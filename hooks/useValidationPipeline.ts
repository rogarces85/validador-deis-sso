import { useState, useCallback } from 'react';
import { AppState, FileMetadata, EstablishmentCatalog, ValidationRule } from '../types';
import { getMissingRequiredSheetsForSerie } from '../services/remSeriesConfig';
import { enqueue, flush } from '../services/auditQueue';
import type { AuditEvent } from '../services/api/audit';

function deriveResultado(results: ValidationRule[]): 'APROBADO' | 'CON_OBSERVACIONES' | 'RECHAZADO' {
    const fallidos = results.filter(r => r.resultado === false);
    if (fallidos.length === 0) return 'APROBADO';
    const errores = fallidos.filter(r => r.severidad === 'ERROR');
    if (errores.length === 0) return 'CON_OBSERVACIONES';
    return 'RECHAZADO';
}

export const useValidationPipeline = () => {
    const [state, setState] = useState<AppState>({
        file: null,
        metadata: null,
        establishment: null,
        results: [],
        isValidating: false,
        error: null,
        versionError: null
    });

    const resetState = useCallback(() => {
        setState({
            file: null,
            metadata: null,
            establishment: null,
            results: [],
            isValidating: false,
            error: null,
            versionError: null
        });
    }, []);

    const validateFile = useCallback(async (file: File) => {
        const t0 = performance.now();
        setState(prev => ({ ...prev, isValidating: true, error: null, versionError: null, file }));

        // Intentar vaciar la cola de auditoria antes de empezar (best-effort).
        void flush().catch(() => undefined);

        let meta: FileMetadata | null = null;
        let establishment: any = null;
        let results: any[] = [];
        let isError = false;
        let errorMsg: string | null = null;

        try {
            const [
                excelServiceModule,
                ruleEngineModule,
                nombreSheetValidatorModule,
                filenameValidatorModule,
                catalogModule,
                ruleDictionaryModule,
            ] = await Promise.all([
                import('../services/excelService'),
                import('../services/ruleEngine'),
                import('../services/nombreSheetValidator'),
                import('../services/filenameValidator'),
                import('../data/establishments.catalog.json'),
                import('../data/rules'),
            ]);

            const { ExcelReaderService } = excelServiceModule;
            const { RuleEngineService } = ruleEngineModule;
            const { NombreSheetValidator } = nombreSheetValidatorModule;
            const { FilenameValidatorService } = filenameValidatorModule;
            const catalog = catalogModule.default as unknown as EstablishmentCatalog;
            const ruleDictionary = ruleDictionaryModule.default;
            const filenameValidator = new FilenameValidatorService();
            const establishmentByCode = new Map(
                catalog.establecimientos.map(e => [e.codigo, e])
            );

            // 1. Read Excel File
            const excelService = ExcelReaderService.getInstance();
            await excelService.loadFile(file);

            // 2. Validate and Extract Metadata
            const validationResult = filenameValidator.validate(file.name);

            if (!validationResult.isValid) {
                throw new Error(`Nombre de archivo inválido: ${validationResult.errors.join(', ')}`);
            }

            // Merge validated metadata with technical metadata
            const metadata: FileMetadata = {
                nombreOriginal: file.name,
                tamano: file.size,
                serieRem: validationResult.metadata?.serieRem || 'A',
                mes: validationResult.metadata?.mes || '01',
                periodo: validationResult.metadata?.periodo || '2026',
                codigoEstablecimiento: validationResult.metadata?.codigoEstablecimiento || '000000',
                extension: validationResult.metadata?.extension || 'xlsx',
                sheets: excelService.getSheets(),
            };

            const missingRequiredSheets = getMissingRequiredSheetsForSerie(metadata.serieRem, metadata.sheets || []);
            if (missingRequiredSheets.length > 0) {
                throw new Error(`El archivo Serie ${metadata.serieRem} no contiene las hojas obligatorias: ${missingRequiredSheets.join(', ')}. No puede validarse.`);
            }

            // js-set-map-lookups: O(1) lookup via pre-built Map
            const establishment = establishmentByCode.get(metadata.codigoEstablecimiento) || null;
            const rawEstablishmentType = establishment?.tipo?.toUpperCase();
            const normalizedEstablishmentType = rawEstablishmentType === 'OTRO'
                ? 'OTROS'
                : rawEstablishmentType === 'POSTAS'
                    ? 'POSTA'
                    : establishment?.tipo;

            metadata.tipoEstablecimiento = normalizedEstablishmentType;
            meta = metadata;
            // Capturamos una referencia local para emitir el evento de audit
            // al final del callback (state no esta actualizado todavia en el closure).
            const establishmentLocal = establishment;

            // 3. Run NOMBRE sheet validations (before regular rules)
            const nombreValidator = new NombreSheetValidator();
            const nombreOutput = nombreValidator.validate(metadata.codigoEstablecimiento, metadata.mes, metadata.serieRem);

            // 4. Run Rules
            const ruleEngine = new RuleEngineService();

            // Load Rules Dynamically based on Establishment Type
            const tipoEstablecimiento = normalizedEstablishmentType?.toUpperCase() || 'BASE';

            // @ts-ignore
            const baseRules = Object.values(ruleDictionary.BASE?.validaciones || {}).flat() as ValidationRule[];

            // @ts-ignore
            const specificRules = ruleDictionary[tipoEstablecimiento]
                // @ts-ignore
                ? Object.values(ruleDictionary[tipoEstablecimiento].validaciones || {}).flat() as ValidationRule[]
                : [];

            const allRules = [...baseRules, ...specificRules];

            // Filter by series (using rem_sheet prefix as proxy for series)
            const applicableRules = allRules.filter(r => r.rem_sheet.startsWith(metadata.serieRem));

            // Run rules
            const rulesToRun = applicableRules.length > 0 ? applicableRules : [];

            const ruleResults = await ruleEngine.evaluate(rulesToRun, metadata);

            // Combine NOMBRE results (first) + rule engine results
            results = [...nombreOutput.results, ...ruleResults];

            setState({
                file,
                metadata,
                establishment,
                results,
                isValidating: false,
                error: null,
                versionError: nombreOutput.versionError
            });

        } catch (err) {
            // Asegurar que meta se setea aun cuando ocurra error
            console.error(err);
            errorMsg = (err as Error).message || 'Error desconocido durante la validación';
            isError = true;
            setState(prev => ({
                ...prev,
                isValidating: false,
                error: errorMsg
            }));
        }

        // Emitir evento de auditoria (no clinico) - fire-and-forget.
        // Si meta no existe (fallo antes de extraer metadata), no emitimos.
        const duracion = Math.round(performance.now() - t0);
        if (meta) {
            const m = meta as FileMetadata;
            const fallidos = results.filter(r => r.resultado === false);
            const conteoError = fallidos.filter(r => r.severidad === 'ERROR').length;
            const conteoRevisar = fallidos.filter(r => r.severidad === 'REVISAR').length;
            const conteoIndicador = fallidos.filter(r => r.severidad === 'INDICADOR').length;
            const resultado: 'APROBADO' | 'CON_OBSERVACIONES' | 'RECHAZADO' | 'ERROR' =
                isError ? 'ERROR' : deriveResultado(results);
            const event: AuditEvent = {
                nombre_archivo: m.nombreOriginal,
                codigo_establecimiento: m.codigoEstablecimiento,
                nombre_establecimiento: establishmentLocal?.nombre ?? null,
                comuna: establishmentLocal?.comuna ?? null,
                tipo_establecimiento: m.tipoEstablecimiento ?? null,
                serie: m.serieRem,
                mes: m.mes,
                periodo: m.periodo,
                total_hallazgos: results.length,
                conteo_error: conteoError,
                conteo_revisar: conteoRevisar,
                conteo_indicador: conteoIndicador,
                resultado_final: resultado,
                duracion_ms: duracion,
            };
            void enqueue(event).then(() => flush()).catch(() => undefined);
        }
    }, []);

    return {
        state,
        validateFile,
        resetState
    };
};
