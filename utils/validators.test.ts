import { describe, it, expect } from 'vitest';
import { validateFilename, matchEstablishment } from './validators';
import { ESTABLECIMIENTOS } from '../constants';

describe('validateFilename', () => {
    it('should validate correct filename format', () => {
        const result = validateFilename('123207A01.xlsm');
        expect(result.isValid).toBe(true);
        expect(result.metadata).toEqual({
            codigoEstablecimiento: '123207',
            serieRem: 'A',
            mes: '01',
            extension: 'xlsm',
            nombreOriginal: '123207A01.xlsm'
        });
    });

    it('should validate filename with different series and extension', () => {
        const result = validateFilename('123100AX05.xlsx');
        expect(result.isValid).toBe(true);
        expect(result.metadata?.serieRem).toBe('AX');
        expect(result.metadata?.extension).toBe('xlsx');
    });

    it('should return error for invalid format', () => {
        const result = validateFilename('invalid.txt');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Nombre de archivo inválido');
    });

    it('should return error for malformed code', () => {
        const result = validateFilename('123A01.xlsx'); // Code too short
        expect(result.isValid).toBe(false);
    });
});

describe('matchEstablishment', () => {
    it('should return establishment for valid code', () => {
        const result = matchEstablishment('123100');
        expect(result).toBeDefined();
        expect(result?.nombre).toBe('Hospital Base San Jose de Osorno');
    });

    it('should return null for unknown code', () => {
        const result = matchEstablishment('999999');
        expect(result).toBeNull();
    });
});
