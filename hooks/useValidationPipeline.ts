import { useState, useCallback } from 'react';
import { AppState, ValidationResult, FileMetadata, Establishment, EstablishmentCatalog, ValidationRule } from '../types';
import { ExcelReaderService } from '../services/excelService';
import { RuleEngineService } from '../services/ruleEngine';
import { FilenameValidatorService } from '../services/filenameValidator';
import catalogData from '../data/establishments.catalog.json';
import rulesData from '../data/rules.json';

const catalog = catalogData as unknown as EstablishmentCatalog;
const rules = rulesData as unknown as ValidationRule[];

export const useValidationPipeline = () => {
    const [state, setState] = useState<AppState>({
        file: null,
        metadata: null,
        establishment: null,
        results: [],
        isValidating: false,
        error: null
    });

    const resetState = useCallback(() => {
        setState({
            file: null,
            metadata: null,
            establishment: null,
            results: [],
            isValidating: false,
            error: null
        });
    }, []);

    const validateFile = useCallback(async (file: File) => {
        setState(prev => ({ ...prev, isValidating: true, error: null, file }));

        try {
            // 1. Read Excel File
            const excelService = ExcelReaderService.getInstance();
            await excelService.loadFile(file);

            // 2. Validate and Extract Metadata
            const filenameValidator = new FilenameValidatorService();
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

            const establishment = catalog.establecimientos.find(e => e.codigo === metadata.codigoEstablecimiento) || null;

            // 4. Run Rules
            const ruleEngine = new RuleEngineService();
            // Filter rules by series?
            const applicableRules = rules.filter(r => r.serie === metadata.serieRem);

            // If no rules for serie, maybe run all or mock for now.
            // Let's run all if none match, just to show something.
            const rulesToRun = applicableRules.length > 0 ? applicableRules : rules;

            const results = await ruleEngine.evaluate(rulesToRun, metadata);

            setState({
                file,
                metadata,
                establishment,
                results,
                isValidating: false,
                error: null
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
