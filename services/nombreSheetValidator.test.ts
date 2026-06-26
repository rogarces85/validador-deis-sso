import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NombreSheetValidator } from './nombreSheetValidator';
import { ExcelReaderService } from './excelService';

vi.mock('./excelService', () => ({
    ExcelReaderService: {
        getInstance: vi.fn(),
    },
}));

describe('NombreSheetValidator', () => {
    let mockExcel: {
        getCellValue: ReturnType<typeof vi.fn>;
        concatenateToNumber: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockExcel = {
            getCellValue: vi.fn((sheet: string, cell: string) => {
                if (sheet !== 'NOMBRE') return null;

                const values: Record<string, string> = {
                    A9: 'Versión 1.2: Febrero 2026',
                    B2: 'OSORNO',
                    B3: 'Hospital Base San José de Osorno',
                    B6: 'JUNIO',
                    B11: 'Responsable',
                    B12: 'Jefe Estadística',
                    C2: '1',
                    D2: '0',
                    E2: '3',
                    F2: '0',
                    G2: '1',
                    C3: '1',
                    D3: '2',
                    E3: '3',
                    F3: '1',
                    G3: '0',
                    H3: '0',
                    C6: '0',
                    D6: '6',
                };

                return values[cell] ?? null;
            }),
            concatenateToNumber: vi.fn((_sheet: string, cells: string[]) => {
                const key = cells.join(',');
                if (key === 'C2,D2,E2,F2,G2') return 10301;
                if (key === 'C3,D3,E3,F3,G3,H3') return 123100;
                if (key === 'C6,D6') return 6;
                return 0;
            }),
        };

        (ExcelReaderService.getInstance as any).mockReturnValue(mockExcel);
    });

    it('acepta mes 06 para Serie P en hoja NOMBRE', () => {
        const output = new NombreSheetValidator().validate('123100', '06', 'P');

        expect(output.results.map(result => result.ruleId)).not.toContain('VAL_NOM12');
        expect(output.results).toHaveLength(0);
    });

    it('rechaza mes no semestral para Serie P en hoja NOMBRE', () => {
        mockExcel.concatenateToNumber.mockImplementation((_sheet: string, cells: string[]) => {
            const key = cells.join(',');
            if (key === 'C2,D2,E2,F2,G2') return 10301;
            if (key === 'C3,D3,E3,F3,G3,H3') return 123100;
            if (key === 'C6,D6') return 5;
            return 0;
        });

        const output = new NombreSheetValidator().validate('123100', '05', 'P');

        expect(output.results.some(result => result.ruleId === 'VAL_NOM12')).toBe(true);
        expect(output.results.find(result => result.ruleId === 'VAL_NOM12')?.mensaje).toContain('Serie P');
    });

    it('mantiene mes 05 valido para Serie A en hoja NOMBRE', () => {
        mockExcel.concatenateToNumber.mockImplementation((_sheet: string, cells: string[]) => {
            const key = cells.join(',');
            if (key === 'C2,D2,E2,F2,G2') return 10301;
            if (key === 'C3,D3,E3,F3,G3,H3') return 123100;
            if (key === 'C6,D6') return 5;
            return 0;
        });

        const output = new NombreSheetValidator().validate('123100', '05', 'A');

        expect(output.results.map(result => result.ruleId)).not.toContain('VAL_NOM12');
        expect(output.results).toHaveLength(0);
    });
});
