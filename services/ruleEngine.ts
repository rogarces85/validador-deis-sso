
import { ExcelReaderService } from './excelService';
import { ValidationRule, ValidationResult, Severity, FileMetadata } from '../types';

export class RuleEngineService {
  private excel = ExcelReaderService.getInstance();

  public async evaluate(rules: ValidationRule[], metadata: FileMetadata): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const rule of rules) {
      // 1. Filtrar por establecimientos incluidos (si existe la lista)
      if (rule.aplicar_a && !rule.aplicar_a.includes(metadata.codigoEstablecimiento)) {
        continue;
      }

      // 2. Filtrar por establecimientos excluidos (si existe la lista)
      if (rule.establecimientos_excluidos && rule.establecimientos_excluidos.includes(metadata.codigoEstablecimiento)) {
        continue;
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
          id: crypto.randomUUID()
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
      id: crypto.randomUUID(),
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
      // En sumatorias sí forzamos null a 0
      return parts.reduce((acc, part) => {
        const val = this.resolveExpression(part, defaultSheet);
        return acc + (typeof val === 'number' ? val : 0);
      }, 0);
    }

    // Manejar A+B (ej: A03!L20 + A03!M20)
    if (trimmed.includes('+')) {
      const parts = trimmed.split('+').map(p => p.trim());
      return parts.reduce((acc, part) => {
        const val = this.resolveExpression(part, defaultSheet);
        return acc + (typeof val === 'number' ? val : 0);
      }, 0);
    }

    // Manejar Rangos (ej: C21:C36)
    if (trimmed.includes(':')) {
      let sheet = defaultSheet;
      let range = trimmed;
      if (trimmed.includes('!')) {
        [sheet, range] = trimmed.split('!');
      }
      return this.excel.getRangeSum(sheet, range);
    }

    // Manejar Celdas Individuales (ej: F11 o A05!C89)
    let sheet = defaultSheet;
    let cell = trimmed;
    if (trimmed.includes('!')) {
      [sheet, cell] = trimmed.split('!');
    }

    // Retorna el valor exacto (number, string o null)
    return this.excel.getCellValue(sheet, cell);
  }
}
