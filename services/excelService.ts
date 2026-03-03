
import XLSX from 'xlsx-js-style';

export class ExcelReaderService {
  private static instance: ExcelReaderService;
  private workbook: XLSX.WorkBook | null = null;

  private constructor() { }

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

  /**
   * Skill_Excel_Concatenate: Extrae, limpia, concatena y castéa datos de múltiples celdas.
   * 
   * @param sheetName La hoja por defecto donde buscar
   * @param coordenadas Las celdas a concatenar
   * @param separador El separador opcional (default '')
   * @returns Un valor numérico garantizado
   */
  public concatenateToNumber(sheetName: string, coordenadas: string[], separador: string = ""): number {
    // 1. Extraer y convertir a array de strings puros
    const valoresCrudos = coordenadas.map(ref => {
      // Manejar referencias cruzadas si las hay (H1!A1)
      let sheet = sheetName;
      let targetRef = ref;
      if (ref.includes('!')) {
        const parts = ref.split('!');
        sheet = parts[0];
        targetRef = parts[1];
      }

      const rawValue = this.getCellValue(sheet, targetRef);
      // Asegurarse de retornar un string incluso desde undefined/null
      return rawValue === null || rawValue === undefined ? "" : String(rawValue);
    });

    // 2. Concatenar
    const resultadoString = valoresCrudos.join(separador);

    // 3. Sanitizar (quitar lo que no sea dígito, menos, punto o coma)
    const stringLimpio = resultadoString.replace(/[^0-9.,-]/g, '');

    // Homologar comas a puntos para parseFloat
    const stringParseable = stringLimpio.replace(',', '.');

    // 4. Casting a Número
    const numeroFinal = parseFloat(stringParseable);

    // Si la limpieza dio algo inválido (ej: puro texto que desapareció), retornar 0.
    return isNaN(numeroFinal) ? 0 : numeroFinal;
  }
}
