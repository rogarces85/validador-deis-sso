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

// data/establishments.catalog.json
var establishments_catalog_default = {
  version: "2026.2.0",
  generadoEl: "2026-06-14T00:00:00-04:00",
  servicioDeSalud: "Servicio de Salud Osorno",
  totalEstablecimientos: 77,
  establecimientos: [
    {
      codigo: "123010",
      nombre: "Direcci\xF3n Servicio Salud Osorno",
      comuna: "10301",
      tipo: "DIRECCION",
      activo: true
    },
    {
      codigo: "123011",
      nombre: "PRAIS",
      comuna: "10301",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "123012",
      nombre: "Cl\xEDnica Dental M\xF3vil (Osorno)",
      comuna: "10301",
      tipo: "MOVIL",
      activo: true
    },
    {
      codigo: "123030",
      nombre: "Departamento de Atenci\xF3n Integral Funcionarios",
      comuna: "10301",
      tipo: "HOSPITAL",
      activo: true
    },
    {
      codigo: "123100",
      nombre: "Hospital Base San Jos\xE9 de Osorno",
      comuna: "10301",
      tipo: "HOSPITAL",
      activo: true
    },
    {
      codigo: "123101",
      nombre: "Hospital de Purranque Dr. Juan Hepp Dubiau",
      comuna: "10303",
      tipo: "HOSPITAL",
      activo: true
    },
    {
      codigo: "123102",
      nombre: "Hospital de R\xEDo Negro",
      comuna: "10305",
      tipo: "HOSPITAL",
      activo: true
    },
    {
      codigo: "123103",
      nombre: "Hospital de Puerto Octay",
      comuna: "10302",
      tipo: "HOSPITAL",
      activo: true
    },
    {
      codigo: "123104",
      nombre: "Hospital Futa Sruka Lawenche Kunko Mapu Mo",
      comuna: "10306",
      tipo: "HOSPITAL",
      activo: true
    },
    {
      codigo: "123105",
      nombre: "Hospital Pu Mulen Quilacahu\xEDn",
      comuna: "10307",
      tipo: "HOSPITAL",
      activo: true
    },
    {
      codigo: "123203",
      nombre: "Clinica Alemana Osorno",
      comuna: "10301",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "123207",
      nombre: "Centro de Rehabilitaci\xF3n de Minusv\xE1lidos",
      comuna: "10303",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "123300",
      nombre: "Centro de Salud Familiar Dr. Pedro J\xE1uregui",
      comuna: "10301",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123301",
      nombre: "Centro de Salud Familiar Dr. Marcelo Lopetegui Adams",
      comuna: "10301",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123302",
      nombre: "Centro de Salud Familiar Ovejer\xEDa",
      comuna: "10301",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123303",
      nombre: "Centro de Salud Familiar Rahue Alto",
      comuna: "10301",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123304",
      nombre: "Centro de Salud Familiar Entre Lagos",
      comuna: "10304",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123305",
      nombre: "Centro de Salud Familiar San Pablo",
      comuna: "10307",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123306",
      nombre: "Centro de Salud Familiar Pampa Alegre",
      comuna: "10301",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123307",
      nombre: "Centro de Salud Familiar Purranque",
      comuna: "10303",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123309",
      nombre: "Centro de Salud Familiar Practicante Pablo Araya",
      comuna: "10305",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123310",
      nombre: "Centro de Salud Familiar Quinto Centenario",
      comuna: "10301",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123311",
      nombre: "Centro de Salud Familiar Bah\xEDa Mansa",
      comuna: "10306",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123312",
      nombre: "Centro de Salud Familiar Puaucho",
      comuna: "10306",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "123402",
      nombre: "Posta de Salud Rural Cuinco",
      comuna: "10306",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123404",
      nombre: "Posta de Salud Rural Pichi Damas",
      comuna: "10301",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123406",
      nombre: "Posta de Salud Rural Puyehue",
      comuna: "10304",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123407",
      nombre: "Posta de Salud Rural Desag\xFCe Rupanco",
      comuna: "10304",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123408",
      nombre: "Posta de Salud Rural \xD1adi Pichi-Damas",
      comuna: "10304",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123410",
      nombre: "Posta de Salud Rural Tres Esteros",
      comuna: "10305",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123411",
      nombre: "Centro Comunitario de Salud Familiar Corte Alto",
      comuna: "10303",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123412",
      nombre: "Posta de Salud Rural Crucero ( Purranque)",
      comuna: "10303",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123413",
      nombre: "Posta de Salud Rural Coligual",
      comuna: "10303",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123414",
      nombre: "Posta de Salud Rural Hueyusca",
      comuna: "10303",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123415",
      nombre: "Posta de Salud Rural Concordia",
      comuna: "10303",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123416",
      nombre: "Posta de Salud Rural Colonia Ponce",
      comuna: "10303",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123417",
      nombre: "Posta de Salud Rural La Naranja",
      comuna: "10303",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123419",
      nombre: "Posta de Salud Rural San Pedro de Purranque",
      comuna: "10303",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123420",
      nombre: "Posta de Salud Rural Collihuinco",
      comuna: "10303",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123422",
      nombre: "Posta de Salud Rural Rupanco",
      comuna: "10302",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123423",
      nombre: "Posta de Salud Rural Cascadas",
      comuna: "10302",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123424",
      nombre: "Posta de Salud Rural Piedras Negras",
      comuna: "10302",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123425",
      nombre: "Posta de Salud Rural Cancura",
      comuna: "10301",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123426",
      nombre: "Posta de Salud Rural Pellinada",
      comuna: "10302",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123427",
      nombre: "Posta de Salud Rural La Calo",
      comuna: "10302",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123428",
      nombre: "Posta de Salud Rural Coihueco (Puerto Octay)",
      comuna: "10302",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123430",
      nombre: "Posta de Salud Rural Purrehu\xEDn",
      comuna: "10306",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123431",
      nombre: "Posta de Salud Rural Aleucapi",
      comuna: "10306",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123432",
      nombre: "Posta de Salud Rural La Poza",
      comuna: "10307",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123434",
      nombre: "Posta de Salud Rural Huilma",
      comuna: "10305",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123435",
      nombre: "Posta de Salud Rural Pucopio",
      comuna: "10307",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123436",
      nombre: "Posta de Salud Rural Chanco ( San Pablo )",
      comuna: "10307",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123437",
      nombre: "Posta de Salud Rural Currim\xE1huida",
      comuna: "10307",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "123700",
      nombre: "Centro Comunitario de Salud Familiar Murrinumo",
      comuna: "10301",
      tipo: "CECOSF",
      activo: true
    },
    {
      codigo: "123701",
      nombre: "Centro Comunitario de Salud Familiar Manuel Rodr\xEDguez",
      comuna: "10301",
      tipo: "CECOSF",
      activo: true
    },
    {
      codigo: "123705",
      nombre: "Centro Comunitario de Salud Familiar El Encanto",
      comuna: "10304",
      tipo: "CECOSF",
      activo: true
    },
    {
      codigo: "123709",
      nombre: "Centro Comunitario de Salud Familiar Riachuelo",
      comuna: "10305",
      tipo: "CECOSF",
      activo: true
    },
    {
      codigo: "123800",
      nombre: "SAPU Dr. Pedro J\xE1uregui",
      comuna: "10301",
      tipo: "SAPU",
      activo: true
    },
    {
      codigo: "123801",
      nombre: "SAPU Rahue Alto",
      comuna: "10301",
      tipo: "SAPU",
      activo: true
    },
    {
      codigo: "200085",
      nombre: "SAPU Dr. Marcelo Lopetegui Adams",
      comuna: "10301",
      tipo: "SAPU",
      activo: true
    },
    {
      codigo: "200209",
      nombre: "COSAM Rahue",
      comuna: "10301",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "200248",
      nombre: "CDR de Adultos Mayores con Demencia",
      comuna: "10301",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "200445",
      nombre: "COSAM Oriente",
      comuna: "10301",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "200455",
      nombre: "Centro Comunitario de Salud Familiar Barrio Estaci\xF3n",
      comuna: "10303",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "200477",
      nombre: "Unidad de Memoria AYEKAN",
      comuna: "10301",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "200490",
      nombre: "Posta de Salud Rural Chamilco",
      comuna: "10306",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "200539",
      nombre: "Centro Referencia Diagn\xF3stico M\xE9dico Osorno",
      comuna: "10301",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "200556",
      nombre: "Hospital Digital",
      comuna: "10301",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "200747",
      nombre: "SAPU Entre Lagos",
      comuna: "10304",
      tipo: "SAPU",
      activo: true
    },
    {
      codigo: "200748",
      nombre: "SUR San Pablo",
      comuna: "10307",
      tipo: "SUR",
      activo: true
    },
    {
      codigo: "200749",
      nombre: "SUR Bah\xEDa Mansa",
      comuna: "10306",
      tipo: "SUR",
      activo: true
    },
    {
      codigo: "200750",
      nombre: "SUR Puaucho",
      comuna: "10306",
      tipo: "SUR",
      activo: true
    },
    {
      codigo: "201055",
      nombre: "Terap\xE9utica Peulla Ambulatoria",
      comuna: "10301",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "201056",
      nombre: "Terap\xE9utica Peulla Residencial",
      comuna: "10301",
      tipo: "OTROS",
      activo: true
    },
    {
      codigo: "201483",
      nombre: "Centro Comunitario de Salud Familiar Las Cascadas",
      comuna: "10302",
      tipo: "CESFAM",
      activo: true
    },
    {
      codigo: "201667",
      nombre: "Posta de Salud Rural Chan Chan R\xEDo Negro",
      comuna: "10305",
      tipo: "POSTA",
      activo: true
    },
    {
      codigo: "202043",
      nombre: "Posta de Salud Rural Pucatrihue",
      comuna: "10306",
      tipo: "POSTA",
      activo: true
    }
  ]
};

// services/remSeriesConfig.ts
var ENABLED_SERIES = ["A", "P"];
var SERIE_A_MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
var SERIE_P_MONTHS = ["06", "12"];
var MONTHS_BY_SERIE = {
  A: SERIE_A_MONTHS,
  P: SERIE_P_MONTHS
};
function isEnabledSerie(serie) {
  return ENABLED_SERIES.includes(serie.toUpperCase());
}
function getAllowedMonthsForSerie(serie) {
  const serieUpper = serie.toUpperCase();
  return isEnabledSerie(serieUpper) ? MONTHS_BY_SERIE[serieUpper] : [];
}
function getMonthExpectationLabel(serie) {
  const allowedMonths = getAllowedMonthsForSerie(serie);
  return allowedMonths.length ? allowedMonths.join(" o ") : "serie habilitada";
}
function isMonthAllowedForSerie(serie, month) {
  return getAllowedMonthsForSerie(serie).includes(month);
}

// services/nombreSheetValidator.ts
var catalog = establishments_catalog_default;
var establishmentCodes = new Set(catalog.establecimientos.map((e) => e.codigo));
var communeCodes = new Set(catalog.establecimientos.map((e) => e.comuna));
var VALID_MONTHS = new Set(
  Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
);
var DEFAULT_ACCEPTED_VERSIONS = [
  "Versi\xF3n 1.2: Febrero 2026",
  "Versi\xF3n 1.1: Febrero 2026"
];
var ACCEPTED_VERSIONS_BY_SERIE = {
  A: DEFAULT_ACCEPTED_VERSIONS,
  P: ["Versi\xF3n 1.2: Junio 2026"]
};
function getAcceptedVersions(fileSerie) {
  return ACCEPTED_VERSIONS_BY_SERIE[fileSerie.toUpperCase()] || DEFAULT_ACCEPTED_VERSIONS;
}
function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "10000000-1000-4000-8000-100000000000".replace(
    /[018]/g,
    (c) => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}
var NombreSheetValidator = class {
  constructor() {
    this.excel = ExcelReaderService.getInstance();
    this.SHEET = "NOMBRE";
  }
  /**
   * Read a cell from the NOMBRE sheet, returning its string value trimmed.
   * Returns empty string if cell is null/undefined/empty.
   */
  getCellString(cell) {
    const val = this.excel.getCellValue(this.SHEET, cell);
    if (val === null || val === void 0) return "";
    return String(val).trim();
  }
  /**
   * Run all NOMBRE sheet validations.
   * @param fileEstablishmentCode El código de establecimiento extraído del nombre del archivo.
   * @param fileMonth El mes extraído del nombre del archivo (ej. "03").
   */
  validate(fileEstablishmentCode, fileMonth, fileSerie = "A") {
    const results = [];
    let versionError = null;
    const acceptedVersions = getAcceptedVersions(fileSerie);
    const versionVal = this.getCellString("A9");
    if (!acceptedVersions.includes(versionVal)) {
      versionError = versionVal ? `Versi\xF3n de archivo no v\xE1lida para Serie ${fileSerie.toUpperCase()}: "${versionVal}". Se acepta: ${acceptedVersions.map((v) => `"${v}"`).join(" o ")}` : `La celda A9 no contiene la versi\xF3n del archivo para Serie ${fileSerie.toUpperCase()}. Se acepta: ${acceptedVersions.map((v) => `"${v}"`).join(" o ")}`;
      results.push(this.makeResult(
        "VAL_NOM01",
        "ERROR" /* ERROR */,
        `NOMBRE, ERROR: ${versionError}`,
        versionVal || "(vac\xEDo)",
        acceptedVersions.join(" | "),
        "A9"
      ));
    }
    const communeName = this.getCellString("B2");
    if (!communeName) {
      results.push(this.makeResult(
        "VAL_NOM02",
        "ERROR" /* ERROR */,
        "NOMBRE, ERROR: El nombre de la Comuna (celda B2) est\xE1 vac\xEDo.",
        "(vac\xEDo)",
        "Nombre de comuna",
        "B2"
      ));
    }
    const communeCells = ["C2", "D2", "E2", "F2", "G2"];
    const communeCodeResult = this.validateConcatenatedCode(
      communeCells,
      communeCodes,
      "comuna",
      "VAL_NOM03",
      "c\xF3digo de comuna"
    );
    results.push(...communeCodeResult);
    const estabName = this.getCellString("B3");
    if (!estabName) {
      results.push(this.makeResult(
        "VAL_NOM04",
        "ERROR" /* ERROR */,
        "NOMBRE, ERROR: El nombre del Establecimiento (celda B3) est\xE1 vac\xEDo.",
        "(vac\xEDo)",
        "Nombre de establecimiento",
        "B3"
      ));
    }
    const estabCells = ["C3", "D3", "E3", "F3", "G3", "H3"];
    const estabCodeResult = this.validateConcatenatedCode(
      estabCells,
      establishmentCodes,
      "establecimiento",
      "VAL_NOM05",
      "c\xF3digo de establecimiento",
      fileEstablishmentCode
    );
    results.push(...estabCodeResult);
    const monthName = this.getCellString("B6");
    if (!monthName) {
      results.push(this.makeResult(
        "VAL_NOM06",
        "ERROR" /* ERROR */,
        "NOMBRE, ERROR: El nombre del Mes (celda B6) est\xE1 vac\xEDo.",
        "(vac\xEDo)",
        "Nombre del mes",
        "B6"
      ));
    }
    const monthCells = ["C6", "D6"];
    const monthCodeResult = this.validateMonthCode(monthCells, fileMonth, fileSerie);
    results.push(...monthCodeResult);
    const responsibleName = this.getCellString("B11");
    if (!responsibleName) {
      results.push(this.makeResult(
        "VAL_NOM08",
        "ERROR" /* ERROR */,
        "NOMBRE, ERROR: El nombre del Responsable del Establecimiento (celda B11) est\xE1 vac\xEDo.",
        "(vac\xEDo)",
        "Nombre del responsable",
        "B11"
      ));
    }
    const statisticsChief = this.getCellString("B12");
    if (!statisticsChief) {
      results.push(this.makeResult(
        "VAL_NOM09",
        "ERROR" /* ERROR */,
        "NOMBRE, ERROR: El nombre del Jefe de Estad\xEDstica (celda B12) est\xE1 vac\xEDo.",
        "(vac\xEDo)",
        "Nombre del jefe de estad\xEDstica",
        "B12"
      ));
    }
    return { results, versionError };
  }
  /**
   * Validate cells individually (not empty) then concatenate and lookup against a catalog set.
   * Utiliza Skill_Excel_Concatenate para purgar el valor y evitar errores de casteo matemáticos.
   */
  validateConcatenatedCode(cells, catalogSet, entityLabel, ruleIdBase, codeLabel, fileEstablishmentCode) {
    const results = [];
    let hasEmpty = false;
    for (const cell of cells) {
      const val = this.getCellString(cell);
      if (!val) {
        hasEmpty = true;
        results.push(this.makeResult(
          ruleIdBase,
          "ERROR" /* ERROR */,
          `NOMBRE, ERROR: La celda ${cell} del ${codeLabel} est\xE1 vac\xEDa.`,
          "(vac\xEDo)",
          `D\xEDgito del ${codeLabel}`,
          cell
        ));
      }
    }
    const numericCode = this.excel.concatenateToNumber(this.SHEET, cells);
    const codeString = numericCode.toString();
    if (!hasEmpty) {
      if (!catalogSet.has(codeString)) {
        results.push(this.makeResult(
          ruleIdBase,
          "ERROR" /* ERROR */,
          `NOMBRE, ERROR: El ${codeLabel} resultante "${codeString}" (celdas ${cells.join("&")}) no corresponde a un ${entityLabel} v\xE1lido del cat\xE1logo.`,
          codeString,
          `C\xF3digo de ${entityLabel} v\xE1lido`,
          cells[0]
        ));
      }
      if (ruleIdBase === "VAL_NOM05" && fileEstablishmentCode && codeString !== fileEstablishmentCode) {
        results.push(this.makeResult(
          "VAL_NOM10",
          "ERROR" /* ERROR */,
          `NOMBRE, ERROR: El c\xF3digo de establecimiento en la hoja ("${codeString}") no coincide con el c\xF3digo del archivo ("${fileEstablishmentCode}").`,
          codeString,
          fileEstablishmentCode,
          cells[0]
        ));
      }
    }
    return results;
  }
  /**
   * Validate month code cells: each not empty, concatenated value is valid month 01-12.
   * Utiliza Skill_Excel_Concatenate
   */
  validateMonthCode(cells, fileMonth, fileSerie = "A") {
    const results = [];
    let hasEmpty = false;
    for (const cell of cells) {
      const val = this.getCellString(cell);
      if (!val) {
        hasEmpty = true;
        results.push(this.makeResult(
          "VAL_NOM07",
          "ERROR" /* ERROR */,
          `NOMBRE, ERROR: La celda ${cell} del c\xF3digo de mes est\xE1 vac\xEDa.`,
          "(vac\xEDo)",
          "D\xEDgito del mes",
          cell
        ));
      }
    }
    const numericMonth = this.excel.concatenateToNumber(this.SHEET, cells);
    const monthCode = numericMonth.toString().padStart(2, "0");
    if (!hasEmpty) {
      if (!VALID_MONTHS.has(monthCode)) {
        results.push(this.makeResult(
          "VAL_NOM07",
          "ERROR" /* ERROR */,
          `NOMBRE, ERROR: El c\xF3digo de mes resultante "${monthCode}" (celdas ${cells.join("&")}) no corresponde a un mes v\xE1lido (01-12).`,
          monthCode,
          "Mes v\xE1lido (01-12)",
          cells[0]
        ));
      } else if (!isMonthAllowedForSerie(fileSerie, monthCode)) {
        results.push(this.makeResult(
          "VAL_NOM12",
          "ERROR" /* ERROR */,
          `NOMBRE, ERROR: El c\xF3digo de mes resultante "${monthCode}" no es v\xE1lido para la Serie ${fileSerie.toUpperCase()}. Debe ser ${getMonthExpectationLabel(fileSerie)}.`,
          monthCode,
          `Mes v\xE1lido para Serie ${fileSerie.toUpperCase()}: ${getMonthExpectationLabel(fileSerie)}`,
          cells[0]
        ));
      }
      if (fileMonth && monthCode !== fileMonth) {
        results.push(this.makeResult(
          "VAL_NOM11",
          "ERROR" /* ERROR */,
          `NOMBRE, ERROR: El mes en la hoja ("${monthCode}") no coincide con el mes del archivo ("${fileMonth}").`,
          monthCode,
          fileMonth,
          cells[0]
        ));
      }
    }
    return results;
  }
  /**
   * Create a ValidationResult compatible with the existing system.
   */
  makeResult(ruleId, severidad, mensaje, valorActual, valorEsperado, cell) {
    return {
      id: generateUUID(),
      ruleId,
      descripcion: mensaje,
      severidad,
      resultado: false,
      valorActual,
      valorEsperado,
      rem_sheet: this.SHEET,
      cell,
      mensaje,
      evidence: `Evaluado: ${JSON.stringify(valorActual)}. Esperado: ${JSON.stringify(valorEsperado)}.`
    };
  }
};
export {
  NombreSheetValidator
};
