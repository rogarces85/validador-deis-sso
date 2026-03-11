import { useState, useCallback } from 'react';
import { AppState, ValidationResult, FileMetadata, Establishment, EstablishmentCatalog, ValidationRule } from '../types';
import { ExcelReaderService } from '../services/excelService';
import { RuleEngineService } from '../services/ruleEngine';
import { NombreSheetValidator } from '../services/nombreSheetValidator';
import { FilenameValidatorService } from '../services/filenameValidator';
import catalogData from '../data/establishments.catalog.json';
import ruleDictionary from '../data/rules';

const catalog = catalogData as unknown as EstablishmentCatalog;

// js-set-map-lookups: build index once at module level for O(1) lookups
const establishmentByCode = new Map(
    catalog.establecimientos.map(e => [e.codigo, e])
);

// Reuse a single instance instead of creating per-call
const filenameValidator = new FilenameValidatorService();

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

            // js-set-map-lookups: O(1) lookup via pre-built Map
            const establishment = establishmentByCode.get(metadata.codigoEstablecimiento) || null;

            // 3. Run NOMBRE sheet validations (before regular rules)
            const nombreValidator = new NombreSheetValidator();
            const nombreOutput = nombreValidator.validate(metadata.codigoEstablecimiento, metadata.mes);

            // 4. Run Rules
            const ruleEngine = new RuleEngineService();

            // Load Rules Dynamically based on Establishment Type
            const tipoEstablecimiento = establishment ? establishment.tipo.toUpperCase() : 'BASE';

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
