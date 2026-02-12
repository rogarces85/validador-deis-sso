import { describe, it, expect } from 'vitest';
import { parseFilename, validateFilename } from '../utils/filenameValidator';
import { matchEstablishment } from '../utils/establishmentMatcher';
import { Establishment } from '../domain/establishments.types';
import sampleCatalog from '../data/establishments.catalog.sample.json';

describe('Filename Validator', () => {
    describe('parseFilename', () => {
        it('should correctly parse a valid filename (xlsx)', () => {
            const result = parseFilename('102301A01.xlsx');
            expect(result).not.toBeInstanceOf(Error);
            const parsed = result as any;
            expect(parsed.codEstab).toBe('102301');
            expect(parsed.serie).toBe('A');
            expect(parsed.mes).toBe('01');
            expect(parsed.ext).toBe('xlsx');
        });

        it('should correctly parse a valid filename (xlsm)', () => {
            const result = parseFilename('102100BS12.xlsm');
            expect(result).not.toBeInstanceOf(Error);
            const parsed = result as any;
            expect(parsed.codEstab).toBe('102100');
            expect(parsed.serie).toBe('BS');
            expect(parsed.mes).toBe('12');
            expect(parsed.ext).toBe('xlsm');
        });

        it('should correctly parse a valid filename with ANEXO', () => {
            const result = parseFilename('105001ANEXO03.xlsx');
            expect(result).not.toBeInstanceOf(Error);
            const parsed = result as any;
            expect(parsed.serie).toBe('ANEXO');
        });

        it('should return error for invalid format', () => {
            const result = parseFilename('invalid_file.txt');
            expect(result).toBeInstanceOf(Error);
        });

        it('should return error for wrong extension', () => {
            const result = parseFilename('102301A01.csv');
            expect(result).toBeInstanceOf(Error);
        });
    });

    describe('validateFilename', () => {
        it('should return valid for correct filename', () => {
            const result = validateFilename('102301A01.xlsx');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should return invalid for month 00', () => {
            const result = validateFilename('102301A00.xlsx');
            expect(result.isValid).toBe(false);
            expect(result.errors[0]).toContain('Invalid month');
        });

        it('should return invalid for month 13', () => {
            const result = validateFilename('102301A13.xlsx');
            expect(result.isValid).toBe(false);
            expect(result.errors[0]).toContain('Invalid month');
        });

        it('should return invalid for unknown series', () => {
            const result = validateFilename('102301X01.xlsx'); // X is not in allowed list
            expect(result.isValid).toBe(false);
            expect(result.errors[0]).toContain('Invalid series');
        });

        it('should return invalid for known series lowercased if logic enforces uppercase (it does not enforce parsing but validation checks uppercase list)', () => {
            // Our parse logic converts serie to uppercase, so 'a' becomes 'A' which IS valid. 
            // Let's verify this behavior.
            const result = validateFilename('102301a01.xlsx');
            expect(result.isValid).toBe(true);
            expect(result.parsed?.serie).toBe('A');
        });
    });
});

describe('Establishment Matcher', () => {
    const catalog = sampleCatalog as Establishment[];

    it('should find an existing establishment', () => {
        const establishment = matchEstablishment('102301', catalog);
        expect(establishment).toBeDefined();
        expect(establishment?.name).toBe('HOSPITAL SAN JUAN DE DIOS');
    });

    it('should return undefined for non-existing establishment', () => {
        const establishment = matchEstablishment('999999', catalog);
        expect(establishment).toBeUndefined();
    });

    it('should find establishment regardless of other file components', () => {
        // This function only cares about code6
        const establishment = matchEstablishment('105001', catalog);
        expect(establishment).toBeDefined();
        expect(establishment?.type).toBe('SAPU');
    });
});
