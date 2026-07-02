
import { ExcelReaderService } from './excelService';
import { ValidationRule, ValidationResult, Severity, FileMetadata, EstablishmentType } from '../types';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts (HTTP)
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

export class RuleEngineService {
  private excel = ExcelReaderService.getInstance();

  private formatValue(value: unknown): string {
    return JSON.stringify(value);
  }

  private normalizeEstablishmentType(type?: string): EstablishmentType | undefined {
    if (!type) return undefined;

    const normalized = type.trim().toUpperCase();
    if (normalized === 'OTRO') {
      return 'OTROS';
    }

    if (normalized === 'POSTAS') {
      return 'POSTA';
    }

    return normalized as EstablishmentType;
  }

  private compareValues(v1: unknown, operador: string, v2: unknown): boolean {
    switch (operador) {
      case '==': return v1 === v2;
      case '!=': return v1 !== v2;
      case '>': return Number(v1) > Number(v2);
      case '<': return Number(v1) < Number(v2);
      case '>=': return Number(v1) >= Number(v2);
      case '<=': return Number(v1) <= Number(v2);
      default: return false;
    }
  }

  /**
   * Determina si un valor leido del Excel representa "ausencia de dato":
   * null, undefined, string vacio, string '0', o numero 0.
   * Es la condicion que activa la omision automatica para reglas tipo
   * DOBLE (dos celdas independientes) y COMPUESTA (resultado combinado 0).
   */
  private isZeroLike(v: unknown): boolean {
    if (v === null || v === undefined) return true;
    if (typeof v === 'string') return v === '' || v === '0';
    if (typeof v === 'number') return v === 0;
    return false;
  }

  private getReferenceLabel(rule: ValidationRule, value: unknown, omittedByCondition: boolean = false): string {
    if (omittedByCondition) {
      return 'No aplica: sin datos previos';
    }

    const isNoDataRule = rule.tipo === 'SIMPLE'
      && rule.operador === '=='
      && Number(rule.expresion_2) === 0;

    if (isNoDataRule) {
      return 'Sin registro esperado';
    }

    return `Referencia evaluada: ${this.formatValue(value)}`;
  }

  private ruleAppliesToMetadata(rule: ValidationRule, metadata: FileMetadata): boolean {
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
      const excludedTypes = new Set(rule.excluir_tipo.map(type => this.normalizeEstablishmentType(type)));
      if (excludedTypes.has(establishmentType)) {
        return false;
      }
    }

    if (!exclusiveByType && rule.aplicar_a_tipo?.length) {
      if (!establishmentType) {
        return false;
      }

      const allowedTypes = new Set(rule.aplicar_a_tipo.map(type => this.normalizeEstablishmentType(type)));
      if (!allowedTypes.has(establishmentType)) {
        return false;
      }
    }

    return true;
  }

  public async evaluate(rules: ValidationRule[], metadata: FileMetadata): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const rule of rules) {
      if (!this.ruleAppliesToMetadata(rule, metadata)) {
        continue;
      }

      let exclusiveTargetAllowed = false;
      const normalizedType = this.normalizeEstablishmentType(metadata.tipoEstablecimiento);

      // Validación exclusiva: solo los establecimientos objetivo pueden tener datos.
      // Para objetivos se aprueba sin exigir registro; para no objetivos se evalúa == 0.
      if (rule.validacion_exclusiva && rule.aplicar_a) {
        const targetSet = new Set(rule.aplicar_a);
        exclusiveTargetAllowed = targetSet.has(metadata.codigoEstablecimiento);
      } else if (rule.validacion_exclusiva && rule.aplicar_a_tipo?.length) {
        const targetTypes = new Set(rule.aplicar_a_tipo.map(type => this.normalizeEstablishmentType(type)));
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
          valorActual: 'Error',
          valorEsperado: rule.expresion_2,
          mensaje: `Falla técnica: ${e instanceof Error ? e.message : 'Desconocido'}`,
          id: generateUUID()
        });
      }
    }

    return results;
  }

  private async evaluateSingleRule(rule: ValidationRule, invertirOperador: boolean = false, exclusiveTargetAllowed: boolean = false): Promise<ValidationResult> {
    const val1 = this.resolveExpression(rule.expresion_1, rule.rem_sheet);
    const val2 = this.resolveExpression(rule.expresion_2, rule.rem_sheet_2 || rule.rem_sheet);

    // Para comparaciones lógicas tratamos null como 0
    const v1 = val1 === null || val1 === undefined ? 0 : val1;
    const v2 = val2 === null || val2 === undefined ? 0 : val2;

    if (exclusiveTargetAllowed) {
      return {
        ruleId: rule.id,
        descripcion: rule.mensaje,
        severidad: rule.severidad,
        resultado: true,
        valorActual: val1,
        valorEsperado: val2,
        referenciaLabel: 'Establecimiento autorizado para registrar',
        operador: rule.operador,
        valorReferencia: val2,
        comparacion: 'No aplica: establecimiento autorizado',
        diferencia: undefined,
        rem_sheet: rule.rem_sheet,
        id: generateUUID(),
        cell: (typeof rule.expresion_1 === 'string' && !rule.expresion_1.includes('SUM') && !rule.expresion_1.includes('+') && !rule.expresion_1.includes(':')) ? rule.expresion_1 : undefined,
        evidence: 'Omitida: el establecimiento está autorizado para registrar esta sección.'
      };
    }

    if (rule.condicion_previa) {
      const conditionalValue = this.resolveExpression(rule.condicion_previa.expresion, rule.rem_sheet);
      const normalizedConditionalValue = conditionalValue === null || conditionalValue === undefined ? 0 : conditionalValue;
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
          evidence: 'Omitida: la condición previa no se cumple, no existen datos para comparar.'
        };
      }
    }

    // Omitir validación si ambos valores son nulos/vacíos (sin datos).
    if ((val1 === null || val1 === undefined || val1 === '') && (val2 === null || val2 === undefined || val2 === '')) {
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
        evidence: 'Omitida: ambos valores son nulos o vacíos (sin datos para comparar).'
      };
    }

    // Omitir validación si la primera expresión es nula/vacía y la regla lo indica.
    if (rule.omitir_si_v1_es_cero && (val1 === null || val1 === undefined || val1 === '' || val1 === 0)) {
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
        diferencia: typeof v2 === 'number' ? -v2 : undefined,
        rem_sheet: rule.rem_sheet,
        id: generateUUID(),
        evidence: 'Omitida: valor actual de la expresión 1 es nulo, vacío o cero.'
      };
    }

    // Omision automatica por tipo de regla (003-D):
    //   - DOBLE: regla CELDA cuyo expresion_2 es una celda (no un numero).
    //     Si AMBAS celdas son 0/vacias, no hay datos que comparar.
    //   - COMPUESTA: regla tipo CRUCE (expresion combinada).
    //     Si el resultado de la expresion es 0, no hay datos.
    // El flag omitir_si_ambos_cero === false desactiva este comportamiento
    // automatico (override manual del operador del panel).
    if (rule.omitir_si_ambos_cero !== false) {
      // DOBLE: regla CELDA cuyo expresion_2 es una celda simple (B1, F11) o
      // una referencia cross-sheet (Hoja!B1, A03!C108). NO matchea rangos,
      // sumas, ni valores numericos literales.
      const isDoble = rule.tipo === 'CELDA'
        && typeof rule.expresion_2 === 'string'
        && /^[A-Z][A-Z0-9_]*!?\$?[A-Z]*\$?\d+$/i.test(rule.expresion_2)
        && !/[:+*()\s]/.test(rule.expresion_2);
      const isCompuesta = rule.tipo === 'CRUCE';
      if ((isDoble && this.isZeroLike(val1) && this.isZeroLike(val2))
          || (isCompuesta && v1 === 0)) {
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
          evidence: isDoble
            ? 'Omitida: ambas celdas son 0 o vacias (regla tipo DOBLE, sin datos para comparar).'
            : 'Omitida: resultado combinado es 0 (regla tipo COMPUESTA, sin datos para comparar).'
        };
      }
    }

    // Omitir validación si ambos valores son 0 y la regla lo indica.
    // Esto evita falsos positivos cuando no hay datos (ej: 0 > 0 = false).
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
        evidence: 'Omitida: ambos valores son 0 (sin datos para comparar).'
      };
    }

    // Invertir el operador si aplica (para validacion_exclusiva)
    let operador = rule.operador;
    if (invertirOperador) {
      switch (operador) {
        case '==': operador = '!='; break;
        case '!=': operador = '=='; break;
        case '>': operador = '<='; break;
        case '<': operador = '>='; break;
        case '>=': operador = '<'; break;
        case '<=': operador = '>'; break;
      }
    }

    const passed = this.compareValues(v1, operador, v2);

    const operadorEfectivo = invertirOperador ? `${operador} (invertido de ${rule.operador})` : operador;
    const comparacion = `${this.formatValue(v1)} ${operador} ${this.formatValue(v2)}`;
    const diferencia = typeof v1 === 'number' && typeof v2 === 'number'
      ? v1 - v2
      : undefined;

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
      cell: (typeof rule.expresion_1 === 'string' && !rule.expresion_1.includes('SUM') && !rule.expresion_1.includes('+') && !rule.expresion_1.includes(':')) ? rule.expresion_1 : undefined,
      evidence: `Evaluado: ${JSON.stringify(v1)}. Comparado con: ${operadorEfectivo} ${JSON.stringify(v2)}.`
    };
  }

  private resolveExpression(expr: any, defaultSheet: string): any {
    if (typeof expr === 'number') return expr;
    if (!expr || typeof expr !== 'string') return 0;

    const trimmed = expr.trim();
    let index = 0;

    const peek = () => trimmed[index];
    const consume = () => trimmed[index++];
    const skipWhitespace = () => {
      while (index < trimmed.length && /\s/.test(trimmed[index])) index++;
    };
    const toNumber = (value: unknown): number => Number(value ?? 0) || 0;

    const readReference = (): string => {
      const start = index;
      let nestedParens = 0;
      while (index < trimmed.length && !/[+\-*/(),\s]/.test(trimmed[index])) {
        index++;

        if (trimmed[index] === '(' && trimmed[index - 1] === '!') {
          nestedParens = 1;
          index++;
          while (index < trimmed.length && nestedParens > 0) {
            if (trimmed[index] === '(') nestedParens++;
            if (trimmed[index] === ')') nestedParens--;
            index++;
          }
          break;
        }
      }
      return trimmed.slice(start, index);
    };

    const resolveReference = (rawRef: string): number => {
      if (!rawRef) return 0;

      let sheet = defaultSheet;
      let ref = rawRef;
      if (rawRef.includes('!')) {
        const bangIdx = rawRef.indexOf('!');
        sheet = rawRef.substring(0, bangIdx);
        ref = rawRef.substring(bangIdx + 1);
      }

      ref = ref.replace(/[()]/g, '');

      if (ref.includes(':')) {
        return toNumber(this.excel.getRangeSum(sheet, ref));
      }

      return toNumber(this.excel.getCellValue(sheet, ref));
    };

    const parseExpression = (): number => {
      let value = parseTerm();
      skipWhitespace();

      while (peek() === '+' || peek() === '-') {
        const operator = consume();
        const right = parseTerm();
        value = operator === '+' ? value + right : value - right;
        skipWhitespace();
      }

      return value;
    };

    const parseTerm = (): number => {
      let value = parseFactor();
      skipWhitespace();

      while (peek() === '*' || peek() === '/') {
        const operator = consume();
        const right = parseFactor();
        value = operator === '*' ? value * right : right === 0 ? 0 : value / right;
        skipWhitespace();
      }

      return value;
    };

    const parseSum = (): number => {
      index += 3;
      skipWhitespace();
      if (peek() !== '(') return 0;
      consume();

      let total = 0;
      skipWhitespace();
      while (index < trimmed.length && peek() !== ')') {
        total += parseExpression();
        skipWhitespace();
        if (peek() === ',') {
          consume();
          skipWhitespace();
        }
      }

      if (peek() === ')') consume();
      return total;
    };

    const parseFactor = (): number => {
      skipWhitespace();

      if (peek() === '+') {
        consume();
        return parseFactor();
      }

      if (peek() === '-') {
        consume();
        return -parseFactor();
      }

      if (peek() === '(') {
        consume();
        const value = parseExpression();
        skipWhitespace();
        if (peek() === ')') consume();
        return value;
      }

      if (trimmed.slice(index, index + 3).toUpperCase() === 'SUM') {
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
}
