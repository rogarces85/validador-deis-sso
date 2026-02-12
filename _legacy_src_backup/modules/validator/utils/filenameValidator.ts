import { ParsedFilename, ValidationResult } from '../domain/establishments.types';

const VALID_EXTENSIONS = ['xlsx', 'xlsm'];
const VALID_SERIES = ['A', 'BS', 'BM', 'D', 'P', 'ANEXO', 'AX'];

/**
 * Parses the filename to extract its components if it matches the expected pattern.
 * Pattern: CodEstab(6 digits) + Serie(1-2 letters or ANEXO) + Mes(2 digits) + .xlsx/.xlsm
 */
export function parseFilename(filename: string): ParsedFilename | Error {
    // Regex explanation:
    // ^(\d{6})       -> Group 1: 6 digits (CodEstab)
    // ([A-Za-z]+)    -> Group 2: 1 or more letters (Serie) - checked for validity later
    // (\d{2})        -> Group 3: 2 digits (Mes)
    // \.             -> literal dot
    // (xlsx|xlsm)$   -> Group 4: extension
    const regex = /^(\d{6})([A-Za-z]+)(\d{2})\.(xlsx|xlsm)$/i;
    const match = filename.match(regex);

    if (!match) {
        return new Error('Filename does not match the required format: CodEstab(6)Serie(Letters)Mes(2).ext');
    }

    const [, codEstab, serie, mes, ext] = match;

    return {
        codEstab,
        serie: serie.toUpperCase(),
        mes,
        ext: ext.toLowerCase(),
    };
}

export function validateFilename(filename: string): ValidationResult {
    const result: ValidationResult = {
        isValid: false,
        errors: [],
    };

    const parseResult = parseFilename(filename);

    if (parseResult instanceof Error) {
        result.errors.push(parseResult.message);
        return result;
    }

    result.parsed = parseResult;

    // Validate Month
    const mesNum = parseInt(parseResult.mes, 10);
    if (mesNum < 1 || mesNum > 12) {
        result.errors.push(`Invalid month: ${parseResult.mes}. Must be between 01 and 12.`);
    }

    // Validate Series
    // Note: user asked for 1-2 letters, but also mentioned ANEXO/AX. 
    // 'ANEXO' is 5 letters. Adjusting regex logic to strictly capture, but here we validate against allowed list.
    if (!VALID_SERIES.includes(parseResult.serie)) {
        result.errors.push(`Invalid series: ${parseResult.serie}. Allowed: ${VALID_SERIES.join(', ')}.`);
    }

    if (result.errors.length === 0) {
        result.isValid = true;
    }

    return result;
}
