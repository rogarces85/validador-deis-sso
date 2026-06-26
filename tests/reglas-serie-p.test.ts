import { describe, expect, it } from 'vitest';
import reglas from '../data/reglas_finales.json';

describe('Reglas Serie P', () => {
    const requiredSheets = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P9', 'P11', 'P12', 'P13'];

    it('declara todas las hojas obligatorias de Serie P en reglas_finales.json', () => {
        for (const sheet of requiredSheets) {
            expect(reglas).toHaveProperty(sheet);
            expect(Array.isArray((reglas as Record<string, unknown[]>)[sheet])).toBe(true);
        }
    });

    it('mantiene P9 y P13 sin reglas iniciales pero presentes', () => {
        expect((reglas as Record<string, unknown[]>)['P9']).toHaveLength(0);
        expect((reglas as Record<string, unknown[]>)['P13']).toHaveLength(0);
    });

    it('importa 37 reglas iniciales para Serie P', () => {
        const total = requiredSheets.reduce((sum, sheet) => {
            return sum + (reglas as Record<string, unknown[]>)[sheet].length;
        }, 0);

        expect(total).toBe(37);
    });
});
