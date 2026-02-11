
import * as XLSX from 'xlsx';

export class ExcelReaderService {
  private static instance: ExcelReaderService;
  private workbook: XLSX.WorkBook | null = null;

  private constructor() {}

  public static getInstance(): ExcelReaderService {
    if (!ExcelReaderService.instance) {
      ExcelReaderService.instance = new ExcelReaderService();
    }
    return ExcelReaderService.instance;
  }

  public async loadFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          this.workbook = XLSX.read(data, { type: 'array' });
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  public getCellValue(sheetName: string, cellRef: string): any {
    if (!this.workbook) return null;
    const sheet = this.workbook.Sheets[sheetName];
    if (!sheet) return null;
    const cell = sheet[cellRef];
    return cell ? cell.v : null;
  }

  public getRangeSum(sheetName: string, rangeRef: string): number {
    if (!this.workbook) return 0;
    const sheet = this.workbook.Sheets[sheetName];
    if (!sheet) return 0;
    
    const range = XLSX.utils.decode_range(rangeRef);
    let sum = 0;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = sheet[address];
        if (cell && typeof cell.v === 'number') {
          sum += cell.v;
        }
      }
    }
    return sum;
  }

  public getSheets(): string[] {
    return this.workbook?.SheetNames || [];
  }
}
