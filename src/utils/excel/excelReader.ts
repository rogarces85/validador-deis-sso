import * as XLSX from 'xlsx';
import { WorkbookData, SheetData, ExcelReaderOptions, CellData } from './excelTypes';

/**
 * Reads an Excel file and returns a structured WorkbookData object.
 * 
 * @param file The file object to read (File)
 * @param options Configuration options for reading
 * @returns Promise resolving to WorkbookData
 */
export const readWorkbook = (file: File, options?: ExcelReaderOptions): Promise<WorkbookData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);

                // Key requirement: Do not execute macros. 
                // bookVBA: false ensures VBA is ignored (default behavior, but explicit here).
                // type: 'array' is efficient for browser.
                const workbook = XLSX.read(data, {
                    type: 'array',
                    bookVBA: false,
                    cellFormula: true, // We need formulas
                    cellStyles: false // We don't need styles, improves perf
                });

                const result: WorkbookData = { sheets: [] };

                const sheetNames = options?.sheetName
                    ? (Array.isArray(options.sheetName) ? options.sheetName : [options.sheetName])
                    : workbook.SheetNames;

                for (const sheetName of sheetNames) {
                    if (!workbook.Sheets[sheetName]) continue;

                    const worksheet = workbook.Sheets[sheetName];
                    const sheetData: SheetData = {
                        name: sheetName,
                        data: {},
                        ref: worksheet['!ref']
                    };

                    // Determine the range to process
                    let rangeToRead = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };

                    if (options?.range) {
                        // If a specific range is requested, we use that. 
                        // Ideally we should intersect with the sheet's actual content range, but for now we trust the input 
                        // or just use the decoded range.
                        const requestedRange = XLSX.utils.decode_range(options.range);
                        // We could intersect here if we wanted to be strict, but let's just use the requested range
                        // logic: max(start), min(end)
                        rangeToRead.s.r = Math.max(rangeToRead.s.r, requestedRange.s.r);
                        rangeToRead.s.c = Math.max(rangeToRead.s.c, requestedRange.s.c);
                        rangeToRead.e.r = Math.min(rangeToRead.e.r, requestedRange.e.r);
                        rangeToRead.e.c = Math.min(rangeToRead.e.c, requestedRange.e.c);
                    }

                    // Optimization: Iterate over the calculated range instead of all keys
                    for (let R = rangeToRead.s.r; R <= rangeToRead.e.r; ++R) {
                        for (let C = rangeToRead.s.c; C <= rangeToRead.e.c; ++C) {
                            const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
                            const cell = worksheet[cellAddress];

                            if (!cell) continue; // Cell might be empty within the range

                            // Lite mode: skip if we don't need all details? 
                            // User requirement: "avoid saving everything if not necessary".
                            // For now we store the minimal CellData.

                            const cellData: CellData = {
                                v: cell.v,
                                t: cell.t,
                                // Only include formula if present and not in lite mode (optional interpretation)
                                ...(cell.f && !options?.lite ? { f: cell.f } : {})
                            };

                            sheetData.data[cellAddress] = cellData;
                        }
                    }
                    result.sheets.push(sheetData);
                }

                resolve(result);

            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
};
