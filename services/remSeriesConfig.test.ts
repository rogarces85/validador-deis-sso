import { describe, expect, it } from 'vitest';
import {
    getAllowedMonthsForSerie,
    getMissingRequiredSheetsForSerie,
    isMonthAllowedForSerie,
} from './remSeriesConfig';

describe('remSeriesConfig', () => {
    it('define meses permitidos por serie', () => {
        expect(getAllowedMonthsForSerie('A')).toHaveLength(12);
        expect(isMonthAllowedForSerie('A', '01')).toBe(true);
        expect(isMonthAllowedForSerie('A', '12')).toBe(true);
        expect(getAllowedMonthsForSerie('P')).toEqual(['06', '12']);
        expect(isMonthAllowedForSerie('P', '05')).toBe(false);
    });

    it('detecta hojas obligatorias faltantes para Serie P', () => {
        const missing = getMissingRequiredSheetsForSerie('P', [
            'NOMBRE',
            'P1',
            'P2',
            'P3',
            'P4',
            'P5',
            'P6',
            'P7',
            'P11',
            'P12',
        ]);

        expect(missing).toEqual(['P9', 'P13']);
    });

    it('no exige hojas P para Serie A', () => {
        expect(getMissingRequiredSheetsForSerie('A', ['NOMBRE', 'A01'])).toEqual([]);
    });

    it('acepta Serie P cuando P9 y P13 existen aunque no tengan reglas', () => {
        const missing = getMissingRequiredSheetsForSerie('P', [
            'NOMBRE',
            'P1',
            'P2',
            'P3',
            'P4',
            'P5',
            'P6',
            'P7',
            'P9',
            'P11',
            'P12',
            'P13',
        ]);

        expect(missing).toEqual([]);
    });
});
