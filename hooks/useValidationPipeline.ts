import { useState, useCallback } from 'react';
import { AppState, ValidationResult, FileMetadata, Establishment, EstablishmentCatalog, ValidationRule } from '../types';
import { ExcelReaderService } from '../services/excelService';
import { RuleEngineService } from '../services/ruleEngine';
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

            // 2. Extract Metadata (mocked for now as we don't have FilenameParser connected yet, or we infer)
            // Ideally we use a FilenameParser service here.
            // For now, let's infer simple metadata or use a placeholder if parsing fails.
            // Function to parse filename: REM-A-012026-123456.xlsx
            // Format check should be robust.

            const nameParts = file.name.split('-');
            const serie = nameParts.length > 1 ? nameParts[1] : 'A'; // Default or parse
            // This is a naive parser, we should use the FilenameValidator logic if available.

            const metadata: FileMetadata = {
                nombreOriginal: file.name,
                tamano: file.size,
                serieRem: serie,
                mes: '01', // Placeholder/Parsing logic needed
                periodo: '2026',
                codigoEstablecimiento: '123100', // Placeholder/Parsing logic
                extension: file.name.split('.').pop() || '',
                sheets: excelService.getSheets(),
            };

            // Attempt to parse real data from filename if possible
            // Regex for [Series]-[CodEstab]-[Mes][Año].xlsx ? 
            // Let's assume user provides valid codes for now or we match logic.
            // For production mode, let's try to be a bit smarter if we can, or just stick to basic extraction.

            // 3. Find Establishment
            // Check catalog for metadata.codigoEstablecimiento
            // For demo/production-mode fix, let's look up by code if we parsed it, or default.

            // Let's try to extract code from filename more robustly if it looks like a standard name.
            // Example: REM-123100-2026-01.xlsx
            const codeMatch = file.name.match(/(\d{6})/);
            if (codeMatch) {
                metadata.codigoEstablecimiento = codeMatch[1];
            }

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
