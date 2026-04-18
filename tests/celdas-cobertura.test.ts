import { beforeAll, describe, expect, it } from 'vitest';
import XLSX from 'xlsx-js-style';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ExcelReaderService } from '../services/excelService';

type CellRow = {
  'HOJA REM': string;
  CELDA: string;
};

const PROJECT_ROOT = process.cwd();
const CELDAS_PATH = path.resolve(PROJECT_ROOT, 'celdas.xlsx');
const REM_FILENAME = process.env.COBERTURA_REM_FILE || 'SA_26_V1.2.xlsm';
const REM_PATH = path.resolve(PROJECT_ROOT, REM_FILENAME);

const CELL_REF_REGEX = /^[A-Z]+\d+$/;

const mapRemSheet = (sheetLabel: string): string => {
  const raw = String(sheetLabel || '').trim();
  if (!raw) return raw;

  const upper = raw.toUpperCase();
  if (upper === 'REM30R') return 'A30AR';
  if (!upper.startsWith('REM')) return raw;

  return `A${raw.slice(3)}`;
};

const inSheetRange = (sheet: XLSX.WorkSheet, cellRef: string): boolean => {
  if (!sheet['!ref']) return false;

  const range = XLSX.utils.decode_range(sheet['!ref']);
  const cell = XLSX.utils.decode_cell(cellRef);

  return (
    cell.r >= range.s.r &&
    cell.r <= range.e.r &&
    cell.c >= range.s.c &&
    cell.c <= range.e.c
  );
};

describe('Cobertura de celdas definidas en celdas.xlsx', () => {
  const excelService = ExcelReaderService.getInstance();

  beforeAll(async () => {
    global.FileReader = class {
      onload: ((event: any) => void) | null = null;
      onerror: ((event: any) => void) | null = null;

      readAsArrayBuffer(blob: Blob): void {
        blob
          .arrayBuffer()
          .then((buffer) => {
            if (this.onload) {
              this.onload({ target: { result: buffer } });
            }
          })
          .catch((error) => {
            if (this.onerror) {
              this.onerror(error);
            }
          });
      }
    } as any;

    const fileBuffer = await readFile(REM_PATH);
    const remFile = new File([fileBuffer], 'SA_26_V1.2.xlsm', {
      type: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    });

    await excelService.loadFile(remFile);
  });

  it('lee todas las referencias validas de la columna CELDA', () => {
    const celdasWorkbook = XLSX.readFile(CELDAS_PATH);
    const celdasSheet = celdasWorkbook.Sheets[celdasWorkbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<CellRow>(celdasSheet, { defval: '' });

    const remWorkbook = XLSX.readFile(REM_PATH);

    const validRows = rows.filter((row) => CELL_REF_REGEX.test(String(row.CELDA).trim()));
    const skippedRows = rows.filter((row) => !CELL_REF_REGEX.test(String(row.CELDA).trim()));

    const missingSheets: string[] = [];
    const outOfRangeCells: string[] = [];
    const valueMismatches: string[] = [];

    for (const row of validRows) {
      const hojaRem = String(row['HOJA REM']).trim();
      const cellRef = String(row.CELDA).trim();
      const mappedSheet = mapRemSheet(hojaRem);
      const sheet = remWorkbook.Sheets[mappedSheet];

      if (!sheet) {
        missingSheets.push(`${hojaRem} -> ${mappedSheet}`);
        continue;
      }

      if (!inSheetRange(sheet, cellRef)) {
        outOfRangeCells.push(`${hojaRem}:${cellRef}`);
        continue;
      }

      const expectedValue = sheet[cellRef]?.v ?? null;
      const actualValue = excelService.getCellValue(mappedSheet, cellRef);

      if (actualValue !== expectedValue) {
        valueMismatches.push(
          `${mappedSheet}!${cellRef} esperado=${String(expectedValue)} actual=${String(actualValue)}`,
        );
      }
    }

    const uniqueMissingSheets = Array.from(new Set(missingSheets));

    expect(validRows.length).toBeGreaterThan(0);
    expect(
      uniqueMissingSheets,
      `Archivo probado: ${REM_FILENAME}. Hojas faltantes: ${uniqueMissingSheets.join(', ')}`,
    ).toHaveLength(0);
    expect(outOfRangeCells, `Celdas fuera de rango: ${outOfRangeCells.join(', ')}`).toHaveLength(0);
    expect(valueMismatches, `Diferencias detectadas: ${valueMismatches.join(', ')}`).toHaveLength(0);

    expect(skippedRows.length).toBeGreaterThanOrEqual(1);
    expect(skippedRows.some((row) => String(row.CELDA).trim().toLowerCase() === 'todas')).toBe(true);
  });
});
