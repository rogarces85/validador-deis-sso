import { ESTABLECIMIENTOS } from '../constants';
import { Establishment, FileMetadata } from '../types';

export interface ValidationResult {
    isValid: boolean;
    metadata?: FileMetadata;
    error?: string;
}

export const validateFilename = (filename: string): ValidationResult => {
    // Patrón: CodEstab(6)Serie(1-2 letras)Mes(2).xlsx/xlsm
    // Ejemplos: 123207A01.xlsm, 123207AX05.xlsx
    const nameMatch = filename.match(/^(\d{6})([A-Z]{1,2})(\d{2})\.(xlsx|xlsm)$/i);

    if (!nameMatch) {
        return {
            isValid: false,
            error: 'Nombre de archivo inválido. Formato esperado: CodEstab(6)Serie(1-2)Mes(2).xlsx o .xlsm (ej: 123207A01.xlsm)'
        };
    }

    return {
        isValid: true,
        metadata: {
            codigoEstablecimiento: nameMatch[1],
            serieRem: nameMatch[2].toUpperCase(),
            mes: nameMatch[3],
            extension: nameMatch[4].toLowerCase() as 'xlsx' | 'xlsm',
            nombreOriginal: filename
        }
    };
};

export const matchEstablishment = (codigo: string): Establishment | null => {
    return ESTABLECIMIENTOS.find(e => e.codigo === codigo) || null;
};
