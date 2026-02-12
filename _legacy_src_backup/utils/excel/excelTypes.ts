export interface CellData {
    /** Raw value */
    v: string | number | boolean | Date | null;
    /** Cell type (s=string, n=number, b=boolean, d=date, etc.) */
    t: string;
    /** Formula (if present) */
    f?: string;
}

export interface SheetData {
    /** Sheet name */
    name: string;
    /** Data indexed by cell address (e.g., "A1") */
    data: Record<string, CellData>;
    /** Range of the sheet (e.g., "A1:Z100") */
    ref?: string;
}

export interface WorkbookData {
    sheets: SheetData[];
}

export interface ExcelReaderOptions {
    /** If true, only reads the first sheet or specific sheets */
    sheetName?: string | string[];
    /** If present, limits parsing to this range (e.g., "A1:C10") */
    range?: string;
    /** If true, returns a lighter version of data (e.g. no formulas) - strictly not requested but good practice */
    lite?: boolean;
}
