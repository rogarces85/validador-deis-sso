import { beforeAll, describe, expect, it } from 'vitest';
import XLSX from 'xlsx-js-style';
import { ExcelReaderService } from '../services/excelService';
import celdasCatalogRaw from '../data/celdas.catalog.json';

type CellCatalogEntry = {
  hojaRem: string;
  celda: string;
};

type CellCatalogData = {
  entries: CellCatalogEntry[];
};

const CELL_REF_REGEX = /^[A-Z]+\d+$/;
const celdasCatalog = celdasCatalogRaw as CellCatalogData;

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

const ensureRefIncludesCell = (sheet: XLSX.WorkSheet, cellRef: string): void => {
  const cell = XLSX.utils.decode_cell(cellRef);

  if (!sheet['!ref']) {
    sheet['!ref'] = XLSX.utils.encode_range({ s: cell, e: cell });
    return;
  }

  const range = XLSX.utils.decode_range(sheet['!ref']);
  range.s.r = Math.min(range.s.r, cell.r);
  range.s.c = Math.min(range.s.c, cell.c);
  range.e.r = Math.max(range.e.r, cell.r);
  range.e.c = Math.max(range.e.c, cell.c);
  sheet['!ref'] = XLSX.utils.encode_range(range);
};

const buildWorkbookFromCatalog = (): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();
  const sheets = new Map<string, XLSX.WorkSheet>();
  let valueSeed = 1;

  for (const entry of celdasCatalog.entries) {
    const cellRef = String(entry.celda || '').trim();
    if (!CELL_REF_REGEX.test(cellRef)) continue;

    const mappedSheet = mapRemSheet(entry.hojaRem);
    let sheet = sheets.get(mappedSheet);

    if (!sheet) {
      sheet = XLSX.utils.aoa_to_sheet([]);
      sheets.set(mappedSheet, sheet);
      XLSX.utils.book_append_sheet(workbook, sheet, mappedSheet);
    }

    ensureRefIncludesCell(sheet, cellRef);
    sheet[cellRef] = { t: 'n', v: valueSeed++ };
  }

  return workbook;
};

describe('Cobertura de celdas definidas en celdas.catalog.json', () => {
  const excelService = ExcelReaderService.getInstance();
  const remWorkbook = buildWorkbookFromCatalog();

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

    const workbookBuffer = XLSX.write(remWorkbook, { bookType: 'xlsm', type: 'array' });
    const remFile = new File([workbookBuffer], 'cobertura_catalogo.xlsm', {
      type: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    });

    await excelService.loadFile(remFile);
  });

  it('lee todas las referencias validas de la columna CELDA', () => {
    const rows = celdasCatalog.entries;

    const validRows = rows.filter((row) => CELL_REF_REGEX.test(String(row.celda).trim()));
    const skippedRows = rows.filter((row) => !CELL_REF_REGEX.test(String(row.celda).trim()));

    const missingSheets: string[] = [];
    const outOfRangeCells: string[] = [];
    const valueMismatches: string[] = [];

    for (const row of validRows) {
      const hojaRem = String(row.hojaRem).trim();
      const cellRef = String(row.celda).trim();
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
      `Hojas faltantes: ${uniqueMissingSheets.join(', ')}`,
    ).toHaveLength(0);
    expect(outOfRangeCells, `Celdas fuera de rango: ${outOfRangeCells.join(', ')}`).toHaveLength(0);
    expect(valueMismatches, `Diferencias detectadas: ${valueMismatches.join(', ')}`).toHaveLength(0);

    expect(skippedRows.length).toBeGreaterThanOrEqual(1);
    expect(skippedRows.some((row) => String(row.celda).trim().toLowerCase() === 'todas')).toBe(true);
  });
});
