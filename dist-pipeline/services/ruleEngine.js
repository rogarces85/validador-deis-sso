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

// services/ruleEngine.ts
function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "10000000-1000-4000-8000-100000000000".replace(
    /[018]/g,
    (c) => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}
var RuleEngineService = class {
  constructor() {
    this.excel = ExcelReaderService.getInstance();
  }
  formatValue(value) {
    return JSON.stringify(value);
  }
  normalizeEstablishmentType(type) {
    if (!type) return void 0;
    const normalized = type.trim().toUpperCase();
    if (normalized === "OTRO") {
      return "OTROS";
    }
    if (normalized === "POSTAS") {
      return "POSTA";
    }
    return normalized;
  }
  compareValues(v1, operador, v2) {
    switch (operador) {
      case "==":
        return v1 === v2;
      case "!=":
        return v1 !== v2;
      case ">":
        return Number(v1) > Number(v2);
      case "<":
        return Number(v1) < Number(v2);
      case ">=":
        return Number(v1) >= Number(v2);
      case "<=":
        return Number(v1) <= Number(v2);
      default:
        return false;
    }
  }
  getReferenceLabel(rule, value, omittedByCondition = false) {
    if (omittedByCondition) {
      return "No aplica: sin datos previos";
    }
    const isNoDataRule = rule.tipo === "SIMPLE" && rule.operador === "==" && Number(rule.expresion_2) === 0;
    if (isNoDataRule) {
      return "Sin registro esperado";
    }
    return `Referencia evaluada: ${this.formatValue(value)}`;
  }
  ruleAppliesToMetadata(rule, metadata) {
    const establishmentCode = metadata.codigoEstablecimiento;
    const establishmentType = this.normalizeEstablishmentType(metadata.tipoEstablecimiento);
    const exclusiveByCode = !!(rule.validacion_exclusiva && rule.aplicar_a?.length);
    const exclusiveByType = !!(rule.validacion_exclusiva && rule.aplicar_a_tipo?.length);
    if (rule.establecimientos_excluidos?.includes(establishmentCode)) {
      return false;
    }
    if (!exclusiveByCode && rule.aplicar_a && !rule.aplicar_a.includes(establishmentCode)) {
      return false;
    }
    if (rule.excluir_tipo?.length && establishmentType) {
      const excludedTypes = new Set(rule.excluir_tipo.map((type) => this.normalizeEstablishmentType(type)));
      if (excludedTypes.has(establishmentType)) {
        return false;
      }
    }
    if (!exclusiveByType && rule.aplicar_a_tipo?.length) {
      if (!establishmentType) {
        return false;
      }
      const allowedTypes = new Set(rule.aplicar_a_tipo.map((type) => this.normalizeEstablishmentType(type)));
      if (!allowedTypes.has(establishmentType)) {
        return false;
      }
    }
    return true;
  }
  async evaluate(rules, metadata) {
    const results = [];
    for (const rule of rules) {
      if (!this.ruleAppliesToMetadata(rule, metadata)) {
        continue;
      }
      let exclusiveTargetAllowed = false;
      const normalizedType = this.normalizeEstablishmentType(metadata.tipoEstablecimiento);
      if (rule.validacion_exclusiva && rule.aplicar_a) {
        const targetSet = new Set(rule.aplicar_a);
        exclusiveTargetAllowed = targetSet.has(metadata.codigoEstablecimiento);
      } else if (rule.validacion_exclusiva && rule.aplicar_a_tipo?.length) {
        const targetTypes = new Set(rule.aplicar_a_tipo.map((type) => this.normalizeEstablishmentType(type)));
        exclusiveTargetAllowed = !!normalizedType && targetTypes.has(normalizedType);
      }
      try {
        const result = await this.evaluateSingleRule(rule, false, exclusiveTargetAllowed);
        results.push(result);
      } catch (e) {
        results.push({
          ruleId: rule.id,
          descripcion: rule.mensaje,
          severidad: rule.severidad,
          resultado: false,
          valorActual: "Error",
          valorEsperado: rule.expresion_2,
          mensaje: `Falla t\xE9cnica: ${e instanceof Error ? e.message : "Desconocido"}`,
          id: generateUUID()
        });
      }
    }
    return results;
  }
  async evaluateSingleRule(rule, invertirOperador = false, exclusiveTargetAllowed = false) {
    const val1 = this.resolveExpression(rule.expresion_1, rule.rem_sheet);
    const val2 = this.resolveExpression(rule.expresion_2, rule.rem_sheet_2 || rule.rem_sheet);
    const v1 = val1 === null || val1 === void 0 ? 0 : val1;
    const v2 = val2 === null || val2 === void 0 ? 0 : val2;
    if (exclusiveTargetAllowed) {
      return {
        ruleId: rule.id,
        descripcion: rule.mensaje,
        severidad: rule.severidad,
        resultado: true,
        valorActual: val1,
        valorEsperado: val2,
        referenciaLabel: "Establecimiento autorizado para registrar",
        operador: rule.operador,
        valorReferencia: val2,
        comparacion: "No aplica: establecimiento autorizado",
        diferencia: void 0,
        rem_sheet: rule.rem_sheet,
        id: generateUUID(),
        cell: typeof rule.expresion_1 === "string" && !rule.expresion_1.includes("SUM") && !rule.expresion_1.includes("+") && !rule.expresion_1.includes(":") ? rule.expresion_1 : void 0,
        evidence: "Omitida: el establecimiento est\xE1 autorizado para registrar esta secci\xF3n."
      };
    }
    if (rule.condicion_previa) {
      const conditionalValue = this.resolveExpression(rule.condicion_previa.expresion, rule.rem_sheet);
      const normalizedConditionalValue = conditionalValue === null || conditionalValue === void 0 ? 0 : conditionalValue;
      const conditionPassed = this.compareValues(
        normalizedConditionalValue,
        rule.condicion_previa.operador,
        rule.condicion_previa.valor
      );
      if (!conditionPassed && rule.omitir_si_condicion_no_cumple) {
        return {
          ruleId: rule.id,
          descripcion: rule.mensaje,
          severidad: rule.severidad,
          resultado: true,
          valorActual: val1,
          valorEsperado: val2,
          referenciaLabel: this.getReferenceLabel(rule, val2, true),
          operador: rule.operador,
          valorReferencia: val2,
          comparacion: `${this.formatValue(normalizedConditionalValue)} ${rule.condicion_previa.operador} ${this.formatValue(rule.condicion_previa.valor)}`,
          diferencia: 0,
          rem_sheet: rule.rem_sheet,
          id: generateUUID(),
          evidence: "Omitida: la condici\xF3n previa no se cumple, no existen datos para comparar."
        };
      }
    }
    if ((val1 === null || val1 === void 0 || val1 === "") && (val2 === null || val2 === void 0 || val2 === "")) {
      return {
        ruleId: rule.id,
        descripcion: rule.mensaje,
        severidad: rule.severidad,
        resultado: true,
        valorActual: val1,
        valorEsperado: val2,
        referenciaLabel: this.getReferenceLabel(rule, val2),
        operador: rule.operador,
        valorReferencia: val2,
        comparacion: `${this.formatValue(v1)} ${rule.operador} ${this.formatValue(v2)}`,
        diferencia: 0,
        rem_sheet: rule.rem_sheet,
        id: generateUUID(),
        evidence: "Omitida: ambos valores son nulos o vac\xEDos (sin datos para comparar)."
      };
    }
    if (rule.omitir_si_v1_es_cero && (val1 === null || val1 === void 0 || val1 === "" || val1 === 0)) {
      return {
        ruleId: rule.id,
        descripcion: rule.mensaje,
        severidad: rule.severidad,
        resultado: true,
        valorActual: val1,
        valorEsperado: val2,
        referenciaLabel: this.getReferenceLabel(rule, val2),
        operador: rule.operador,
        valorReferencia: val2,
        comparacion: `${this.formatValue(v1)} ${rule.operador} ${this.formatValue(v2)}`,
        diferencia: typeof v2 === "number" ? -v2 : void 0,
        rem_sheet: rule.rem_sheet,
        id: generateUUID(),
        evidence: "Omitida: valor actual de la expresi\xF3n 1 es nulo, vac\xEDo o cero."
      };
    }
    if (rule.omitir_si_ambos_cero && v1 === 0 && v2 === 0) {
      return {
        ruleId: rule.id,
        descripcion: rule.mensaje,
        severidad: rule.severidad,
        resultado: true,
        valorActual: 0,
        valorEsperado: val2,
        referenciaLabel: this.getReferenceLabel(rule, val2),
        operador: rule.operador,
        valorReferencia: 0,
        comparacion: `${this.formatValue(v1)} ${rule.operador} ${this.formatValue(v2)}`,
        diferencia: 0,
        rem_sheet: rule.rem_sheet,
        id: generateUUID(),
        evidence: "Omitida: ambos valores son 0 (sin datos para comparar)."
      };
    }
    let operador = rule.operador;
    if (invertirOperador) {
      switch (operador) {
        case "==":
          operador = "!=";
          break;
        case "!=":
          operador = "==";
          break;
        case ">":
          operador = "<=";
          break;
        case "<":
          operador = ">=";
          break;
        case ">=":
          operador = "<";
          break;
        case "<=":
          operador = ">";
          break;
      }
    }
    const passed = this.compareValues(v1, operador, v2);
    const operadorEfectivo = invertirOperador ? `${operador} (invertido de ${rule.operador})` : operador;
    const comparacion = `${this.formatValue(v1)} ${operador} ${this.formatValue(v2)}`;
    const diferencia = typeof v1 === "number" && typeof v2 === "number" ? v1 - v2 : void 0;
    return {
      ruleId: rule.id,
      descripcion: rule.mensaje,
      severidad: rule.severidad,
      resultado: passed,
      valorActual: val1,
      valorEsperado: val2,
      referenciaLabel: this.getReferenceLabel(rule, val2),
      operador,
      valorReferencia: val2,
      comparacion,
      diferencia,
      rem_sheet: rule.rem_sheet,
      id: generateUUID(),
      cell: typeof rule.expresion_1 === "string" && !rule.expresion_1.includes("SUM") && !rule.expresion_1.includes("+") && !rule.expresion_1.includes(":") ? rule.expresion_1 : void 0,
      evidence: `Evaluado: ${JSON.stringify(v1)}. Comparado con: ${operadorEfectivo} ${JSON.stringify(v2)}.`
    };
  }
  resolveExpression(expr, defaultSheet) {
    if (typeof expr === "number") return expr;
    if (!expr || typeof expr !== "string") return 0;
    const trimmed = expr.trim();
    let index = 0;
    const peek = () => trimmed[index];
    const consume = () => trimmed[index++];
    const skipWhitespace = () => {
      while (index < trimmed.length && /\s/.test(trimmed[index])) index++;
    };
    const toNumber = (value) => Number(value ?? 0) || 0;
    const readReference = () => {
      const start = index;
      let nestedParens = 0;
      while (index < trimmed.length && !/[+\-*/(),\s]/.test(trimmed[index])) {
        index++;
        if (trimmed[index] === "(" && trimmed[index - 1] === "!") {
          nestedParens = 1;
          index++;
          while (index < trimmed.length && nestedParens > 0) {
            if (trimmed[index] === "(") nestedParens++;
            if (trimmed[index] === ")") nestedParens--;
            index++;
          }
          break;
        }
      }
      return trimmed.slice(start, index);
    };
    const resolveReference = (rawRef) => {
      if (!rawRef) return 0;
      let sheet = defaultSheet;
      let ref = rawRef;
      if (rawRef.includes("!")) {
        const bangIdx = rawRef.indexOf("!");
        sheet = rawRef.substring(0, bangIdx);
        ref = rawRef.substring(bangIdx + 1);
      }
      ref = ref.replace(/[()]/g, "");
      if (ref.includes(":")) {
        return toNumber(this.excel.getRangeSum(sheet, ref));
      }
      return toNumber(this.excel.getCellValue(sheet, ref));
    };
    const parseExpression = () => {
      let value = parseTerm();
      skipWhitespace();
      while (peek() === "+" || peek() === "-") {
        const operator = consume();
        const right = parseTerm();
        value = operator === "+" ? value + right : value - right;
        skipWhitespace();
      }
      return value;
    };
    const parseTerm = () => {
      let value = parseFactor();
      skipWhitespace();
      while (peek() === "*" || peek() === "/") {
        const operator = consume();
        const right = parseFactor();
        value = operator === "*" ? value * right : right === 0 ? 0 : value / right;
        skipWhitespace();
      }
      return value;
    };
    const parseSum = () => {
      index += 3;
      skipWhitespace();
      if (peek() !== "(") return 0;
      consume();
      let total = 0;
      skipWhitespace();
      while (index < trimmed.length && peek() !== ")") {
        total += parseExpression();
        skipWhitespace();
        if (peek() === ",") {
          consume();
          skipWhitespace();
        }
      }
      if (peek() === ")") consume();
      return total;
    };
    const parseFactor = () => {
      skipWhitespace();
      if (peek() === "+") {
        consume();
        return parseFactor();
      }
      if (peek() === "-") {
        consume();
        return -parseFactor();
      }
      if (peek() === "(") {
        consume();
        const value = parseExpression();
        skipWhitespace();
        if (peek() === ")") consume();
        return value;
      }
      if (trimmed.slice(index, index + 3).toUpperCase() === "SUM") {
        return parseSum();
      }
      if (/\d/.test(peek())) {
        const numericMatch = trimmed.slice(index).match(/^\d+(?:\.\d+)?/);
        if (numericMatch) {
          index += numericMatch[0].length;
          return Number(numericMatch[0]);
        }
      }
      return resolveReference(readReference());
    };
    return parseExpression();
  }
};
export {
  RuleEngineService
};
