import { useState, useCallback, useEffect } from 'react';
import { AppState, FileMetadata, ValidationResult, Establishment } from '../../types';
import { ESTABLECIMIENTOS, SAMPLE_RULES } from '../../constants';
import { validateFilename } from '../utils/filenameValidator';
import { ExcelReaderService } from '../../services/excelService';
import { RuleEngineService } from '../../services/ruleEngine';

const STORAGE_KEY = 'validador_last_session';

interface PersistedSession {
    metadata: FileMetadata;
    results: ValidationResult[];
    establishment: Establishment | null;
    timestamp: number;
}

export const useValidationPipeline = () => {
    const [state, setState] = useState<AppState>({
        file: null,
        metadata: null,
        establishment: null,
        results: [],
        isValidating: false,
        error: null,
    });

    // Load persistence on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const session: PersistedSession = JSON.parse(saved);
                // Optional: Check if session is too old (e.g., > 24h)
                setState(prev => ({
                    ...prev,
                    metadata: session.metadata,
                    establishment: session.establishment,
                    results: session.results,
                }));
            }
        } catch (e) {
            console.error('Error loading session', e);
        }
    }, []);

    // Save persistence on success
    useEffect(() => {
        if (state.metadata && state.results.length > 0 && !state.isValidating) {
            const session: PersistedSession = {
                metadata: state.metadata,
                establishment: state.establishment,
                results: state.results,
                timestamp: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        }
    }, [state.metadata, state.results, state.establishment, state.isValidating]);

    const reset = useCallback(() => {
        setState({
            file: null,
            metadata: null,
            establishment: null,
            results: [],
            isValidating: false,
            error: null,
        });
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const processFile = async (file: File) => {
        setState(prev => ({ ...prev, isValidating: true, error: null, file }));

        try {
            // 1. Validar nombre
            const metadata = validateFilename(file.name);

            // 2. Identificar establecimiento
            const establishment = ESTABLECIMIENTOS.find(e => e.codigo === metadata.codigoEstablecimiento) || null;

            // Warning mechanism could be added here, but requirement says "si no existe: warning". 
            // Current logic throws error if strict. We can allow null establishment or warn.
            // Requirement: "Identificar establecimiento (si no existe: warning)"
            // Let's create a warning in the UI if establishment is null, but proceed if possible?
            // Actually, export needs establishment. Let's keep it robust: if not found, we can still proceed but maybe show "Unknown" in UI.
            // For now, let's stick to the previous logic but maybe make it less blocking if desired, 
            // but the original code threw an error. The user requirement says "warning".
            // I will allow null establishment but UI should handle it.

            if (!establishment) {
                // If generic requirement is just "warning", we don't block.
                // However, rules might depend on establishment type (though current sample rules don't seem to heavily rely on it except one).
                console.warn('Establecimiento no encontrado');
            }

            // 3. Leer Excel
            const excelService = ExcelReaderService.getInstance();
            await excelService.loadFile(file);

            // 4. Ejecutar reglas
            const ruleEngine = new RuleEngineService();
            // Filter rules by serie (starts with) or ALL
            const relevantRules = SAMPLE_RULES.filter(r =>
                r.serie.startsWith(metadata.serieRem) || r.serie === 'ALL'
            );

            const results = await ruleEngine.evaluate(relevantRules, metadata);

            setState({
                file,
                metadata,
                establishment, // can be null
                results,
                isValidating: false,
                error: !establishment ? `Advertencia: Establecimiento ${metadata.codigoEstablecimiento} no encontrado en el maestro, pero se procesó el archivo.` : null
            });

        } catch (err) {
            console.error(err);
            setState(prev => ({
                ...prev,
                isValidating: false,
                error: err instanceof Error ? err.message : 'Error desconocido procesando el archivo'
            }));
        }
    };

    return {
        state,
        processFile,
        reset
    };
};
