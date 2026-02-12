import { SheetData, CellData } from './excelTypes';
import * as XLSX from 'xlsx';

/**
 * Get a specific cell from a sheet.
 * @param sheet The sheet data object
 * @param address The cell address (e.g., "A1")
 * @returns The cell data or null if not found
 */
export const getCell = (sheet: SheetData, address: string): CellData | null => {
    return sheet.data[address] || null;
};

/**
 * Get values from a range of cells.
 * @param sheet The sheet data object
 * @param range The range address (e.g., "A1:B2")
 * @returns 2D array of values
 */
export const getRangeValues = (sheet: SheetData, range: string): any[][] => {
    const decodedRange = XLSX.utils.decode_range(range);
    const result: any[][] = [];

    for (let R = decodedRange.s.r; R <= decodedRange.e.r; ++R) {
        const row: any[] = [];
        for (let C = decodedRange.s.c; C <= decodedRange.e.c; ++C) {
            const address = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = getCell(sheet, address);
            row.push(cell ? cell.v : null);
        }
        result.push(row);
    }
    return result;
};

/**
 * Convert a 0-indexed column number to Excel column name (e.g. 0 -> A, 1 -> B)
 */
export const getColumnName = (colIndex: number): string => {
    return XLSX.utils.encode_col(colIndex);
};

/**
 * Convert a row and column index to Excel address (e.g. 0, 0 -> A1)
 */
export const getCellAddress = (rowIndex: number, colIndex: number): string => {
    return XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
};
