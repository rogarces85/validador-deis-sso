import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExcelReaderService } from '../services/excelService';
import { RuleEngineService } from '../services/ruleEngine';
import { ValidationRule, FileMetadata } from '../types';
import * as XLSX from 'xlsx';

// Mock XLSX module completely
vi.mock('xlsx', async (importOriginal) => {
    const actual = await importOriginal<typeof import('xlsx')>();
    return {
        ...actual,
        read: vi.fn(), // We will mock return values in tests
        utils: {
            ...actual.utils,
            book_new: actual.utils.book_new,
            aoa_to_sheet: actual.utils.aoa_to_sheet,
            book_append_sheet: actual.utils.book_append_sheet,
        }
    };
});

describe('Integration: Excel Reader -> Rule Engine', () => {
    let excelService: ExcelReaderService;
    let ruleEngine: RuleEngineService;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Get instances
        excelService = ExcelReaderService.getInstance();
        ruleEngine = new RuleEngineService();

        // Mock FileReader
        global.FileReader = class {
            onload: ((e: any) => void) | null = null;
            onerror: ((e: any) => void) | null = null;
            readAsArrayBuffer(blob: Blob) {
                if (this.onload) {
                    const dummyBuffer = new ArrayBuffer(8);
                    this.onload({ target: { result: dummyBuffer } });
                }
            }
        } as any;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should process a file and validate rules', async () => {
        // 1. Setup mock workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
            ['', '', ''], // 1
            ['', 10, ''], // 2 - B2 = 10
        ]);
        XLSX.utils.book_append_sheet(wb, ws, 'A01');

        // Mock XLSX.read to return our workbook
        vi.mocked(XLSX.read).mockReturnValue(wb);

        // 2. Load File
        const file = new File(['dummy'], '123100A01.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        await excelService.loadFile(file);

        expect(XLSX.read).toHaveBeenCalled();

        // 3. Define Rules
        const rules: ValidationRule[] = [
            {
                id: 'INT01',
                tipo: 'CELDA',
                rem_sheet: 'A01',
                expresion_1: 'B2',
                operador: '==',
                expresion_2: 10,
                severidad: 'ERROR',
                mensaje: 'Integration Test Rule',
                serie: 'A'
            }
        ];

        // 4. Metadata
        const metadata: FileMetadata = {
            codigoEstablecimiento: '123100',
            serieRem: 'A',
            mes: '01',
            extension: 'xlsx',
            nombreOriginal: '123100A01.xlsx'
        };

        // 5. Evaluate
        const results = await ruleEngine.evaluate(rules, metadata);

        // 6. Assert
        expect(results).toHaveLength(1);
        expect(results[0].resultado).toBe(true);
        expect(results[0].valorActual).toBe(10);
    });
});
