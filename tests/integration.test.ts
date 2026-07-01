import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExcelReaderService } from '../services/excelService';
import { RuleEngineService } from '../services/ruleEngine';
import { ValidationRule, FileMetadata, Severity } from '../types';

// Use vi.hoisted so the mock variable is available to the hoisted vi.mock call
const { mockRead } = vi.hoisted(() => ({ mockRead: vi.fn() }));

vi.mock('xlsx-js-style', async () => {
    const actual = (await vi.importActual('xlsx-js-style')) as any;
    const mod = actual.default ?? actual;
    return {
        __esModule: true,
        default: { ...mod, read: mockRead },
    };
});

// Import AFTER mock setup
import XLSX from 'xlsx-js-style';

describe('Integration: Excel Reader -> Rule Engine', () => {
    let excelService: ExcelReaderService;
    let ruleEngine: RuleEngineService;

    beforeEach(() => {
        vi.clearAllMocks();
        excelService = ExcelReaderService.getInstance();
        ruleEngine = new RuleEngineService();

        // Mock FileReader (no existe en Node/Vitest)
        global.FileReader = class {
            onload: ((e: any) => void) | null = null;
            onerror: ((e: any) => void) | null = null;
            readAsArrayBuffer(_blob: Blob) {
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

        // Mock XLSX.read para retornar nuestro workbook
        mockRead.mockReturnValue(wb);

        // 2. Load File
        const file = new File(['dummy'], '123100A01.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        await excelService.loadFile(file);

        expect(mockRead).toHaveBeenCalled();

        // 3. Define Rules
        const rules: ValidationRule[] = [
            {
                id: 'INT01',
                tipo: 'CELDA',
                rem_sheet: 'A01',
                expresion_1: 'B2',
                operador: '==',
                expresion_2: 10,
                severidad: 'ERROR' as Severity,
                mensaje: 'Integration Test Rule',
                serie: 'A',
            },
        ];

        // 4. Metadata
        const metadata: FileMetadata = {
            codigoEstablecimiento: '123100',
            serieRem: 'A',
            mes: '01',
            extension: 'xlsx',
            nombreOriginal: '123100A01.xlsx',
        };

        // 5. Evaluate
        const results = await ruleEngine.evaluate(rules, metadata);

        // 6. Assert
        expect(results).toHaveLength(1);
        expect(results[0].resultado).toBe(true);
        expect(results[0].valorActual).toBe(10);
    });

    it('should keep Serie P failed findings when valorActual is 0', async () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
            ['', '', ''],
            ['', 0, ''], // B2 = 0
        ]);
        XLSX.utils.book_append_sheet(wb, ws, 'P12');

        mockRead.mockReturnValue(wb);

        const file = new File(['dummy'], '123010P06.xlsm', {
            type: 'application/vnd.ms-excel.sheet.macroEnabled.12',
        });
        await excelService.loadFile(file);

        const rules: ValidationRule[] = [
            {
                id: 'P12-VAL-ZERO',
                tipo: 'SIMPLE',
                rem_sheet: 'P12',
                expresion_1: 'B2',
                operador: '==',
                expresion_2: 13,
                severidad: 'ERROR' as Severity,
                mensaje: 'Serie P zero value must be visible as finding',
                serie: 'P',
            },
        ];

        const metadata: FileMetadata = {
            codigoEstablecimiento: '123010',
            serieRem: 'P',
            mes: '06',
            extension: 'xlsm',
            nombreOriginal: '123010P06.xlsm',
        };

        const results = await ruleEngine.evaluate(rules, metadata);

        expect(results).toHaveLength(1);
        expect(results[0].resultado).toBe(false);
        expect(results[0].valorActual).toBe(0);
        expect(results[0].valorEsperado).toBe(13);
        expect(results[0].rem_sheet).toBe('P12');
    });
});
