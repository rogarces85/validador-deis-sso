import { describe, expect, it } from 'vitest';
import { FilenameValidatorService } from './filenameValidator';

describe('FilenameValidatorService', () => {
    const validator = new FilenameValidatorService();

    it('acepta Serie A con meses 01 a 12', () => {
        expect(validator.validate('123010A01.xlsm').isValid).toBe(true);
        expect(validator.validate('123010A12.xlsx').isValid).toBe(true);
    });

    it('acepta Serie P solo para junio y diciembre', () => {
        expect(validator.validate('123010P06.xlsm').isValid).toBe(true);
        expect(validator.validate('123010P12.xlsx').isValid).toBe(true);
    });

    it('rechaza Serie P con meses distintos de 06 y 12', () => {
        const result = validator.validate('123010P05.xlsm');

        expect(result.isValid).toBe(false);
        expect(result.errors.join(' ')).toContain('Mes inválido para Serie P');
        expect(result.errors.join(' ')).toContain('06 o 12');
    });

    it('bloquea series reconocidas pero no realizadas', () => {
        for (const filename of ['123010D06.xlsm', '123010BM06.xlsm', '123010BS06.xlsm']) {
            const result = validator.validate(filename);

            expect(result.isValid).toBe(false);
            expect(result.errors.join(' ')).toContain('no está realizada');
            expect(result.errors.join(' ')).toContain('Series A y P');
        }
    });
});
