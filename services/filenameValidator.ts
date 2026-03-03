
import { FileMetadata } from '../types';

// Series REM válidas reconocidas por el sistema
export const VALID_SERIES = ['A', 'P', 'D', 'BM', 'BS'] as const;
export type ValidSerie = typeof VALID_SERIES[number];

export interface FilenameValidationResult {
    isValid: boolean;
    errors: string[];
    metadata?: Partial<FileMetadata>;
}

export class FilenameValidatorService {
    // Regex format: [IDESTABLECIMIENTO][SERIE][MES].(xlsx|xlsm)
    // Ejemplo: 123100A02.xlsx, 123100BM01.xlsx
    // Grupos: 1: Codigo (6 digitos), 2: Serie (1-2 letras: A, P, D, BM, BS), 3: Mes (2 digitos)
    private static readonly REGEX_FORMAT = /^(\d{6})([A-Z]{1,2})(\d{2})\.(xlsx|xlsm)$/i;

    // js-set-map-lookups: O(1) lookup for valid series
    private static readonly SERIES_SET = new Set(VALID_SERIES.map(s => s.toUpperCase()));

    public validate(filename: string): FilenameValidationResult {
        const errors: string[] = [];

        // Check extension
        if (!filename.toLowerCase().match(/\.(xlsx|xlsm)$/)) {
            return { isValid: false, errors: ['El archivo debe ser extensión .xlsx o .xlsm'] };
        }

        const match = filename.match(FilenameValidatorService.REGEX_FORMAT);
        let codigo, serie, mes;

        if (match) {
            [, codigo, serie, mes] = match;
        } else {
            return {
                isValid: false,
                errors: ['Formato de nombre inválido. Esperado: [Codigo6][Serie1-2][Mes2].xlsx (Ej: 123100A02.xlsx, 123100BM01.xlsx)']
            };
        }

        // Validate Series against allowed list
        const serieUpper = serie.toUpperCase();
        if (!FilenameValidatorService.SERIES_SET.has(serieUpper)) {
            errors.push(`Serie no reconocida: "${serieUpper}". Series válidas: ${VALID_SERIES.join(', ')}`);
        } else if (serieUpper !== 'A') {
            errors.push(`⚠️ La Serie "${serieUpper}" aún se encuentra en construcción. Actualmente solo está disponible la validación para la Serie A.`);
        }

        // Validate Month
        const mesNum = parseInt(mes, 10);
        if (mesNum < 1 || mesNum > 12) {
            errors.push(`Mes inválido: ${mes}. Debe ser entre 01 y 12.`);
        }

        if (errors.length > 0) {
            return { isValid: false, errors };
        }

        // Construct Metadata
        const metadata: Partial<FileMetadata> = {
            nombreOriginal: filename,
            serieRem: serieUpper,
            mes: mes,
            periodo: '2026', // Año defaulting to 2026 as per project context
            codigoEstablecimiento: codigo,
            extension: filename.split('.').pop()
        };

        return { isValid: true, errors: [], metadata };
    }
}
