import { describe, expect, it } from 'vitest';
import reglas from '../data/reglas_finales.json';
import { buildDynamicCellEntries, tokenizeExpression } from '../utils/cellReferences';
import { type ValidationRule } from '../types';

type RawReglas = Record<string, Array<Record<string, unknown>>>;

describe('Reglas Serie P', () => {
    const requiredSheets = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P9', 'P11', 'P12', 'P13'];

    it('declara todas las hojas obligatorias de Serie P en reglas_finales.json', () => {
        for (const sheet of requiredSheets) {
            expect(reglas).toHaveProperty(sheet);
            expect(Array.isArray((reglas as Record<string, unknown[]>)[sheet])).toBe(true);
        }
    });

    it('mantiene P9 y P13 sin reglas iniciales pero presentes', () => {
        expect((reglas as RawReglas).P9).toHaveLength(0);
        expect((reglas as RawReglas).P13).toHaveLength(0);
    });

    it('importa 37 reglas iniciales para Serie P', () => {
        const total = requiredSheets.reduce((sum, sheet) => {
            return sum + (reglas as Record<string, unknown[]>)[sheet].length;
        }, 0);

        expect(total).toBe(37);
    });

    it('genera celdas dinamicas para todas las reglas Serie P', () => {
        const typedReglas = reglas as unknown as Record<string, ValidationRule[]>;
        const pRules = Object.values(typedReglas)
          .flat()
          .filter(r => String(r.rem_sheet || '').toUpperCase().startsWith('P'));

        const entries = buildDynamicCellEntries(pRules, 'P1');
        expect(entries.length).toBeGreaterThan(30);

        const sheets = new Set(entries.map(e => e.hojaRem));
        expect(sheets.has('P1')).toBe(true);
        expect(sheets.has('P2')).toBe(true);
        expect(sheets.has('P5')).toBe(true);
        expect(sheets.has('P12')).toBe(true);
    });

    it('extrae correctamente SUM() y rangos en reglas Serie P', () => {
        expect(tokenizeExpression('SUM(B21:AG21)').length).toBeGreaterThan(10);
        const tokens = tokenizeExpression('SUM(H17:U17)+SUM(V22:AG22)-C38');
        expect(tokens).toContain('C38');
        expect(tokens).toContain('H17');
        expect(tokens).toContain('AG22');
    });

    it('no altera reglas exclusivas con validacion_exclusiva', () => {
        const typedReglas = reglas as unknown as Record<string, ValidationRule[]>;
        const exclusive = typedReglas.P11.filter(r => r.validacion_exclusiva);
        expect(exclusive.length).toBe(2);
        exclusive.forEach(r => {
            expect(r.aplicar_a).toContain('123100');
            expect(r.severidad).toBe('ERROR');
        });
    });
});
