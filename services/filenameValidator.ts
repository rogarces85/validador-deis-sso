
import { FileMetadata } from '../types';

export interface FilenameValidationResult {
    isValid: boolean;
    errors: string[];
    metadata?: Partial<FileMetadata>;
}

export class FilenameValidatorService {
    // Regex format: [IDESTABLECIMIENTO][SERIE][MES].(xlsx|xlsm)
    // Ejemplo: 123100A02.xlsx
    // Grupos: 1: Codigo (6 digitos), 2: Serie (1 caracter, letra o numero), 3: Mes (2 digitos)
    private static readonly REGEX_FORMAT = /^(\d{6})([A-Z0-9]{1})(\d{2})\.(xlsx|xlsm)$/i;

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
                errors: ['Formato de nombre inválido. Esperado: [Codigo6][Serie1][Mes2].xlsx (Ej: 123100A02.xlsx)']
            };
        }

        // Validate Month
        const mesNum = parseInt(mes, 10);
        if (mesNum < 1 || mesNum > 12) {
            errors.push(`Mes inválido: ${mes}. Debe ser entre 01 y 12.`);
        }

        // Validate Code (Length 6 ignored here as regex enforces it, but logic check good)

        if (errors.length > 0) {
            return { isValid: false, errors };
        }

        // Construct Metadata
        const metadata: Partial<FileMetadata> = {
            nombreOriginal: filename,
            serieRem: serie.toUpperCase(),
            mes: mes,
            periodo: '2026', // Año defaulting to 2026 as per project context
            codigoEstablecimiento: codigo,
            extension: filename.split('.').pop()
        };

        return { isValid: true, errors: [], metadata };
    }
}
