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
            severidad: 'ERROR',
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
            severidad: 'ERROR',
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
            severidad: 'ERROR',
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
            severidad: 'ERROR',
            mensaje: 'Cross sheet test',
            serie: 'A'
        };

        mockExcel.getCellValue.mockReturnValue(5);

        const results = await ruleEngine.evaluate([rule], mockMetadata);

        expect(mockExcel.getCellValue).toHaveBeenCalledWith('A05', 'C10');
        expect(results[0].resultado).toBe(true);
    });
});
