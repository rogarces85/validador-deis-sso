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
