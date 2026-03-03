
import { ExcelReaderService } from './excelService';
import { ValidationRule, ValidationResult, Severity, FileMetadata } from '../types';

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

  public async evaluate(rules: ValidationRule[], metadata: FileMetadata): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const rule of rules) {
      // js-set-map-lookups: O(1) Set lookups instead of O(n) .includes()
      if (rule.aplicar_a) {
        const allowedSet = new Set(rule.aplicar_a);
        if (!allowedSet.has(metadata.codigoEstablecimiento)) continue;
      }

      if (rule.establecimientos_excluidos) {
        const excludedSet = new Set(rule.establecimientos_excluidos);
        if (excludedSet.has(metadata.codigoEstablecimiento)) continue;
      }

      try {
        const result = await this.evaluateSingleRule(rule);
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

  private async evaluateSingleRule(rule: ValidationRule): Promise<ValidationResult> {
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
        rem_sheet: rule.rem_sheet,
        id: generateUUID(),
        evidence: 'Omitida: ambos valores son 0 (sin datos para comparar).'
      };
    }

    let passed = false;
    switch (rule.operador) {
      case '==': passed = v1 === v2; break;
      case '!=': passed = v1 !== v2; break;
      case '>': passed = v1 > v2; break;
      case '<': passed = v1 < v2; break;
      case '>=': passed = v1 >= v2; break;
      case '<=': passed = v1 <= v2; break;
      default: passed = false;
    }

    return {
      ruleId: rule.id,
      descripcion: rule.mensaje,
      severidad: rule.severidad,
      resultado: passed,
      valorActual: val1, // Retornamos el valor real (exacto) para el reporte
      valorEsperado: `${rule.operador} ${val2}`,
      rem_sheet: rule.rem_sheet,
      id: generateUUID(),
      cell: (typeof rule.expresion_1 === 'string' && !rule.expresion_1.includes('SUM') && !rule.expresion_1.includes('+') && !rule.expresion_1.includes(':')) ? rule.expresion_1 : undefined,
      evidence: `Evaluado: ${JSON.stringify(v1)}. Comparado con: ${rule.operador} ${JSON.stringify(v2)}.`
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
