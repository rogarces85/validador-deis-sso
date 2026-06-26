import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RuleEngineService } from './ruleEngine';
import { ExcelReaderService } from './excelService';
import { ValidationRule, Severity, FileMetadata } from '../types';

// Mock ExcelReaderService
vi.mock('./excelService', () => {
    const mockGetInstance = vi.fn();
    const mockGetCellValue = vi.fn();
    const mockGetRangeSum = vi.fn();

    return {
        ExcelReaderService: {
            getInstance: mockGetInstance
        }
    };
});

describe('RuleEngineService', () => {
    let ruleEngine: RuleEngineService;
    let mockExcel: any;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Setup mock implementation
        mockExcel = {
            getCellValue: vi.fn(),
            getRangeSum: vi.fn()
        };

        (ExcelReaderService.getInstance as any).mockReturnValue(mockExcel);

        ruleEngine = new RuleEngineService();
    });

    const mockMetadata: FileMetadata = {
        codigoEstablecimiento: '123100',
        tipoEstablecimiento: 'HOSPITAL',
        serieRem: 'A',
        mes: '01',
        extension: 'xlsx',
        nombreOriginal: 'test.xlsx'
    };

    it('should evaluate equality rule correctly (PASS)', async () => {
        const rule: ValidationRule = {
            id: 'TEST01',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A1',
            operador: '==',
            expresion_2: 10,
            severidad: Severity.ERROR,
            mensaje: 'Test Rule',
            serie: 'A'
        };

        mockExcel.getCellValue.mockReturnValue(10); // A1 = 10

        const results = await ruleEngine.evaluate([rule], mockMetadata);

        expect(results).toHaveLength(1);
        expect(results[0].resultado).toBe(true);
        expect(results[0].comparacion).toBe('10 == 10');
        expect(results[0].diferencia).toBe(0);
        expect(mockExcel.getCellValue).toHaveBeenCalledWith('A01', 'A1');
    });

    it('should evaluate equality rule correctly (FAIL)', async () => {
        const rule: ValidationRule = {
            id: 'TEST01',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A1',
            operador: '==',
            expresion_2: 20,
            severidad: Severity.ERROR,
            mensaje: 'Test Rule',
            serie: 'A'
        };

        mockExcel.getCellValue.mockReturnValue(10); // A1 = 10, expect 20

        const results = await ruleEngine.evaluate([rule], mockMetadata);

        expect(results).toHaveLength(1);
        expect(results[0].resultado).toBe(false);
        expect(results[0].comparacion).toBe('10 == 20');
        expect(results[0].diferencia).toBe(-10);
    });

    it('should expose positive and negative deltas for relational operators', async () => {
        const greaterRule: ValidationRule = {
            id: 'TEST10',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A1',
            operador: '>=',
            expresion_2: 3,
            severidad: Severity.ERROR,
            mensaje: 'Greater or equal rule'
        };

        const lowerRule: ValidationRule = {
            id: 'TEST11',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A2',
            operador: '<=',
            expresion_2: 4,
            severidad: Severity.ERROR,
            mensaje: 'Lower or equal rule'
        };

        mockExcel.getCellValue.mockImplementation((_sheet: string, cell: string) => {
            if (cell === 'A1') return 7;
            if (cell === 'A2') return 9;
            return 0;
        });

        const results = await ruleEngine.evaluate([greaterRule, lowerRule], mockMetadata);

        expect(results).toHaveLength(2);
        expect(results[0].comparacion).toBe('7 >= 3');
        expect(results[0].diferencia).toBe(4);
        expect(results[0].resultado).toBe(true);
        expect(results[1].comparacion).toBe('9 <= 4');
        expect(results[1].diferencia).toBe(5);
        expect(results[1].resultado).toBe(false);
    });

    it('should resolve SUM function correctly', async () => {
        const rule: ValidationRule = {
            id: 'TEST02',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'SUM(A1, A2)',
            operador: '==',
            expresion_2: 30,
            severidad: Severity.ERROR,
            mensaje: 'Sum Test',
            serie: 'A'
        };

        mockExcel.getCellValue.mockImplementation((sheet: string, cell: string) => {
            if (cell === 'A1') return 10;
            if (cell === 'A2') return 20;
            return 0;
        });

        const results = await ruleEngine.evaluate([rule], mockMetadata);

        expect(results[0].resultado).toBe(true);
    });

    it('should resolve cross-sheet references', async () => {
        const rule: ValidationRule = {
            id: 'TEST03',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A05!C10',
            operador: '==',
            expresion_2: 5,
            severidad: Severity.ERROR,
            mensaje: 'Cross sheet test',
            serie: 'A'
        };

        mockExcel.getCellValue.mockReturnValue(5);

        const results = await ruleEngine.evaluate([rule], mockMetadata);

        expect(mockExcel.getCellValue).toHaveBeenCalledWith('A05', 'C10');
        expect(results[0].resultado).toBe(true);
    });

    it('should resolve cross-sheet ranges with parentheses', async () => {
        const rule: ValidationRule = {
            id: 'TEST03B',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A05!(C10:C12)',
            operador: '==',
            expresion_2: 15,
            severidad: Severity.ERROR,
            mensaje: 'Cross sheet range test',
            serie: 'A'
        };

        mockExcel.getRangeSum.mockReturnValue(15);

        const results = await ruleEngine.evaluate([rule], mockMetadata);

        expect(mockExcel.getRangeSum).toHaveBeenCalledWith('A05', 'C10:C12');
        expect(results[0].resultado).toBe(true);
    });

    it('should resolve subtraction, multiplication and parentheses for Serie P expressions', async () => {
        const rules: ValidationRule[] = [
            {
                id: 'TEST_P_EXPR_01',
                tipo: 'CELDA',
                rem_sheet: 'P2',
                expresion_1: 'C12+(F12-G12)',
                operador: '==',
                expresion_2: 18,
                severidad: Severity.ERROR,
                mensaje: 'Serie P arithmetic with parentheses'
            },
            {
                id: 'TEST_P_EXPR_02',
                tipo: 'CELDA',
                rem_sheet: 'P1',
                expresion_1: 'B61*C61',
                operador: '==',
                expresion_2: 24,
                severidad: Severity.ERROR,
                mensaje: 'Serie P multiplication'
            }
        ];

        mockExcel.getCellValue.mockImplementation((_sheet: string, cell: string) => {
            const values: Record<string, number> = {
                C12: 20,
                F12: 5,
                G12: 7,
                B61: 6,
                C61: 4,
            };
            return values[cell] ?? 0;
        });

        const results = await ruleEngine.evaluate(rules, { ...mockMetadata, serieRem: 'P' });

        expect(results).toHaveLength(2);
        expect(results[0].valorActual).toBe(18);
        expect(results[0].resultado).toBe(true);
        expect(results[1].valorActual).toBe(24);
        expect(results[1].resultado).toBe(true);
    });

    it('should resolve SUM combined with addition and subtraction', async () => {
        const rule: ValidationRule = {
            id: 'TEST_P_EXPR_03',
            tipo: 'CELDA',
            rem_sheet: 'P2',
            expresion_1: 'SUM(H17:U17)+SUM(V22:AG22)-C38',
            operador: '==',
            expresion_2: 42,
            severidad: Severity.ERROR,
            mensaje: 'Serie P combined SUM arithmetic'
        };

        mockExcel.getRangeSum.mockImplementation((_sheet: string, range: string) => {
            if (range === 'H17:U17') return 30;
            if (range === 'V22:AG22') return 20;
            return 0;
        });
        mockExcel.getCellValue.mockImplementation((_sheet: string, cell: string) => {
            if (cell === 'C38') return 8;
            return 0;
        });

        const results = await ruleEngine.evaluate([rule], { ...mockMetadata, serieRem: 'P' });

        expect(results).toHaveLength(1);
        expect(results[0].valorActual).toBe(42);
        expect(results[0].resultado).toBe(true);
    });

    it('should evaluate rules limited by establishment type', async () => {
        const rule: ValidationRule = {
            id: 'TEST04',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A1',
            operador: '==',
            expresion_2: 10,
            severidad: Severity.ERROR,
            mensaje: 'Type-scoped rule',
            aplicar_a_tipo: ['HOSPITAL']
        };

        mockExcel.getCellValue.mockReturnValue(10);

        const results = await ruleEngine.evaluate([rule], mockMetadata);

        expect(results).toHaveLength(1);
        expect(results[0].resultado).toBe(true);
    });

    it('should skip rules excluded by establishment type', async () => {
        const rule: ValidationRule = {
            id: 'TEST05',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A1',
            operador: '==',
            expresion_2: 10,
            severidad: Severity.ERROR,
            mensaje: 'Excluded type rule',
            excluir_tipo: ['HOSPITAL']
        };

        const results = await ruleEngine.evaluate([rule], mockMetadata);

        expect(results).toHaveLength(0);
    });

    it('should normalize OTRO to OTROS when filtering by type', async () => {
        const rule: ValidationRule = {
            id: 'TEST06',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A1',
            operador: '==',
            expresion_2: 7,
            severidad: Severity.ERROR,
            mensaje: 'Normalized type rule',
            aplicar_a_tipo: ['OTROS']
        };

        mockExcel.getCellValue.mockReturnValue(7);

        const results = await ruleEngine.evaluate([rule], {
            ...mockMetadata,
            codigoEstablecimiento: '123207',
            tipoEstablecimiento: 'OTROS'
        });

        expect(results).toHaveLength(1);
        expect(results[0].resultado).toBe(true);
    });

    it('should require both type and code when both scopes are present', async () => {
        const rule: ValidationRule = {
            id: 'TEST07',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A1',
            operador: '==',
            expresion_2: 7,
            severidad: Severity.ERROR,
            mensaje: 'Combined scope rule',
            aplicar_a: ['123100'],
            aplicar_a_tipo: ['HOSPITAL']
        };

        mockExcel.getCellValue.mockReturnValue(7);

        const passingResults = await ruleEngine.evaluate([rule], mockMetadata);
        expect(passingResults).toHaveLength(1);
        expect(passingResults[0].resultado).toBe(true);

        const skippedResults = await ruleEngine.evaluate([rule], {
            ...mockMetadata,
            codigoEstablecimiento: '123101'
        });

        expect(skippedResults).toHaveLength(0);
    });

    it('should evaluate exclusivity for non-target codes', async () => {
        const rule: ValidationRule = {
            id: 'TEST08',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A1',
            operador: '==',
            expresion_2: 0,
            severidad: Severity.ERROR,
            mensaje: 'Exclusive code rule',
            aplicar_a: ['123100'],
            validacion_exclusiva: true
        };

        mockExcel.getCellValue.mockReturnValue(5);

        const nonTargetResults = await ruleEngine.evaluate([rule], {
            ...mockMetadata,
            codigoEstablecimiento: '123101'
        });

        expect(nonTargetResults).toHaveLength(1);
        expect(nonTargetResults[0].resultado).toBe(false);
    });

    it('should invert operator for exclusive target types only', async () => {
        const rule: ValidationRule = {
            id: 'TEST09',
            tipo: 'CELDA',
            rem_sheet: 'A01',
            expresion_1: 'A1',
            operador: '==',
            expresion_2: 0,
            severidad: Severity.ERROR,
            mensaje: 'Exclusive type rule',
            aplicar_a_tipo: ['HOSPITAL'],
            validacion_exclusiva: true
        };

        mockExcel.getCellValue.mockReturnValue(5);

        const targetResults = await ruleEngine.evaluate([rule], mockMetadata);
        expect(targetResults).toHaveLength(1);
        expect(targetResults[0].resultado).toBe(true);

        const nonTargetResults = await ruleEngine.evaluate([rule], {
            ...mockMetadata,
            codigoEstablecimiento: '123300',
            tipoEstablecimiento: 'CESFAM'
        });

        expect(nonTargetResults).toHaveLength(1);
        expect(nonTargetResults[0].resultado).toBe(false);
    });
});
