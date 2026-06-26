import { useState, useCallback } from 'react';
import { AppState, FileMetadata, EstablishmentCatalog, ValidationRule } from '../types';
import { getMissingRequiredSheetsForSerie } from '../services/remSeriesConfig';

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
        setState(prev => ({ ...prev, isValidating: true, error: null, versionError: null, file }));

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
            const results = [...nombreOutput.results, ...ruleResults];

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
            console.error(err);
            setState(prev => ({
                ...prev,
                isValidating: false,
                error: (err as Error).message || 'Error desconocido durante la validación'
            }));
        }
    }, []);

    return {
        state,
        validateFile,
        resetState
    };
};
