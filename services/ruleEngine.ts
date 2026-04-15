
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
    return normalized === 'OTRO' ? 'OTROS' : normalized as EstablishmentType;
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

      let invertirOperador = false;
      const normalizedType = this.normalizeEstablishmentType(metadata.tipoEstablecimiento);

      // Validación exclusiva: la regla aplica a TODOS los establecimientos.
      // Para los de aplicar_a: se INVIERTE el operador (ej: == se vuelve !=)
      //   → Deben tener datos, error si NO los tienen.
      // Para el resto: se mantiene el operador original
      //   → No deben tener datos, error si SÍ los tienen.
      if (rule.validacion_exclusiva && rule.aplicar_a) {
        const targetSet = new Set(rule.aplicar_a);
        invertirOperador = targetSet.has(metadata.codigoEstablecimiento);
      } else if (rule.validacion_exclusiva && rule.aplicar_a_tipo?.length) {
        const targetTypes = new Set(rule.aplicar_a_tipo.map(type => this.normalizeEstablishmentType(type)));
        invertirOperador = !!normalizedType && targetTypes.has(normalizedType);
      }

      try {
        const result = await this.evaluateSingleRule(rule, invertirOperador);
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

  private async evaluateSingleRule(rule: ValidationRule, invertirOperador: boolean = false): Promise<ValidationResult> {
    const val1 = this.resolveExpression(rule.expresion_1, rule.rem_sheet);
    const val2 = this.resolveExpression(rule.expresion_2, rule.rem_sheet);

    // Para comparaciones lógicas tratamos null como 0
    const v1 = val1 === null || val1 === undefined ? 0 : val1;
    const v2 = val2 === null || val2 === undefined ? 0 : val2;

    // Omitir validación si ambos valores son 0 y la regla lo indica.
    // Esto evita falsos positivos cuando no hay datos (ej: 0 > 0 = false).
    if (rule.omitir_si_ambos_cero && v1 === 0 && v2 === 0) {
      return {
        ruleId: rule.id,
        descripcion: rule.mensaje,
        severidad: rule.severidad,
        resultado: true, // Se da por válida (sin datos, no aplica)
        valorActual: 0,
        valorEsperado: `${rule.operador} 0`,
        operador: rule.operador,
        valorReferencia: 0,
        comparacion: `${this.formatValue(v1)} ${rule.operador} ${this.formatValue(v2)}`,
        diferencia: 0,
        rem_sheet: rule.rem_sheet,
        id: generateUUID(),
        evidence: 'Omitida: ambos valores son 0 (sin datos para comparar).'
      };
    }

    // Omitir validación si la primera expresión es 0 y la regla lo indica.
    if (rule.omitir_si_v1_es_cero && v1 === 0) {
      return {
        ruleId: rule.id,
        descripcion: rule.mensaje,
        severidad: rule.severidad,
        resultado: true,
        valorActual: 0,
        valorEsperado: `${rule.operador} ${val2}`,
        operador: rule.operador,
        valorReferencia: val2,
        comparacion: `${this.formatValue(v1)} ${rule.operador} ${this.formatValue(v2)}`,
        diferencia: typeof v2 === 'number' ? -v2 : undefined,
        rem_sheet: rule.rem_sheet,
        id: generateUUID(),
        evidence: 'Omitida: valor actual de la expresión 1 es 0.'
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

    let passed = false;
    switch (operador) {
      case '==': passed = v1 === v2; break;
      case '!=': passed = v1 !== v2; break;
      case '>': passed = v1 > v2; break;
      case '<': passed = v1 < v2; break;
      case '>=': passed = v1 >= v2; break;
      case '<=': passed = v1 <= v2; break;
      default: passed = false;
    }

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
      valorEsperado: `${operador} ${val2}`,
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

    // Manejar SUM(Rango1, Rango2...)
    if (trimmed.startsWith('SUM(')) {
      const inner = trimmed.substring(4, trimmed.length - 1);
      const parts = inner.split(',').map(p => p.trim());
      return parts.reduce((acc, part) => {
        const val = this.resolveExpression(part, defaultSheet);
        return acc + (typeof val === 'number' ? val : 0);
      }, 0);
    }

    // Manejar A+B (ej: A03!L20 + A03!M20, C114+D114)
    if (trimmed.includes('+')) {
      const parts = trimmed.split('+').map(p => p.trim());
      return parts.reduce((acc, part) => {
        const val = this.resolveExpression(part, defaultSheet);
        return acc + (typeof val === 'number' ? val : 0);
      }, 0);
    }

    // Extraer hoja si tiene referencia cross-sheet (ej: A01!P36, A01!(H36:H37))
    let sheet = defaultSheet;
    let ref = trimmed;
    if (trimmed.includes('!')) {
      const bangIdx = trimmed.indexOf('!');
      sheet = trimmed.substring(0, bangIdx);
      ref = trimmed.substring(bangIdx + 1);
    }

    // Limpiar paréntesis (ej: "(H36:H37)" → "H36:H37")
    ref = ref.replace(/[()]/g, '');

    // Manejar Rangos (ej: C21:C36, H36:H37)
    if (ref.includes(':')) {
      return this.excel.getRangeSum(sheet, ref);
    }

    // Celda Individual (ej: F11, C89)
    return this.excel.getCellValue(sheet, ref);
  }
}
