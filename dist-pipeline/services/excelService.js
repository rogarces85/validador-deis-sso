// services/excelService.ts
import XLSX from "xlsx-js-style";
var ExcelReaderService = class _ExcelReaderService {
  constructor() {
    this.workbook = null;
  }
  static getInstance() {
    if (!_ExcelReaderService.instance) {
      _ExcelReaderService.instance = new _ExcelReaderService();
    }
    return _ExcelReaderService.instance;
  }
  async loadFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result);
          this.workbook = XLSX.read(data, { type: "array" });
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
  getCellValue(sheetName, cellRef) {
    if (!this.workbook) return null;
    const sheet = this.workbook.Sheets[sheetName];
    if (!sheet) return null;
    const cell = sheet[cellRef];
    return cell ? cell.v : null;
  }
  getRangeSum(sheetName, rangeRef) {
    if (!this.workbook) return 0;
    const sheet = this.workbook.Sheets[sheetName];
    if (!sheet) return 0;
    const range = XLSX.utils.decode_range(rangeRef);
    let sum = 0;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = sheet[address];
        if (cell && typeof cell.v === "number") {
          sum += cell.v;
        }
      }
    }
    return sum;
  }
  getSheets() {
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
  concatenateToNumber(sheetName, coordenadas, separador = "") {
    const valoresCrudos = coordenadas.map((ref) => {
      let sheet = sheetName;
      let targetRef = ref;
      if (ref.includes("!")) {
        const parts = ref.split("!");
        sheet = parts[0];
        targetRef = parts[1];
      }
      const rawValue = this.getCellValue(sheet, targetRef);
      return rawValue === null || rawValue === void 0 ? "" : String(rawValue);
    });
    const resultadoString = valoresCrudos.join(separador);
    const stringLimpio = resultadoString.replace(/[^0-9.,-]/g, "");
    const stringParseable = stringLimpio.replace(",", ".");
    const numeroFinal = parseFloat(stringParseable);
    return isNaN(numeroFinal) ? 0 : numeroFinal;
  }
};
export {
  ExcelReaderService
};
