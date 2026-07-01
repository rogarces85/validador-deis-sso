import { describe, expect, it } from 'vitest';
import { Severity, ValidationResult } from '../types';

const baseResult = (overrides: Partial<ValidationResult>): ValidationResult => ({
  id: 'test-id',
  ruleId: 'TEST-VAL001',
  descripcion: 'Test hallazgo',
  severidad: Severity.ERROR,
  resultado: false,
  valorActual: 0,
  valorEsperado: 13,
  rem_sheet: 'P12',
  ...overrides,
});

describe('Filter de Hallazgos - cero como valor actual', () => {
  it('un hallazgo con valorActual=0 NO debe ocultarse si resultado=false', () => {
    const findings: ValidationResult[] = [
      baseResult({
        ruleId: 'P12-VAL001',
        descripcion: 'Suma debe ser 13',
        valorActual: 0,
        valorEsperado: 13,
      }),
    ];

    const failed = findings.filter(f => !f.resultado);
    expect(failed.length).toBe(1);
    expect(failed[0].valorActual).toBe(0);
  });

  it('resultados aprobados deben permanecer visibles cuando se pide todos', () => {
    const findings: ValidationResult[] = [
      baseResult({ resultado: true, valorActual: 5 }),
      baseResult({ resultado: false, valorActual: 0 }),
    ];

    const failed = findings.filter(f => !f.resultado);
    const passed = findings.filter(f => f.resultado);

    expect(failed.length).toBe(1);
    expect(passed.length).toBe(1);
  });

  it('valores vacios o nulos no deben mostrarse aunque no haya falla explicita', () => {
    const findings: ValidationResult[] = [
      baseResult({ valorActual: null }),
      baseResult({ valorActual: undefined }),
      baseResult({ valorActual: '' }),
    ];

    const visible = findings.filter(f => {
      const empty = f.valorActual === null || f.valorActual === undefined || f.valorActual === '';
      return !(empty && f.resultado);
    });

    expect(visible.every(f => !f.resultado || f.valorActual !== '')).toBe(true);
  });

  it('contador de severidades suma todos los hallazgos fallidos aunque valorActual=0', () => {
    const findings: ValidationResult[] = [
      baseResult({ valorActual: 0, severidad: Severity.ERROR }),
      baseResult({ valorActual: 0, severidad: Severity.REVISAR }),
      baseResult({ valorActual: 5, severidad: Severity.ERROR, resultado: true }),
      baseResult({ valorActual: 0, severidad: Severity.INDICADOR }),
    ];

    const counts = {
      [Severity.ERROR]: findings.filter(f => !f.resultado && f.severidad === Severity.ERROR).length,
      [Severity.REVISAR]: findings.filter(f => !f.resultado && f.severidad === Severity.REVISAR).length,
      [Severity.INDICADOR]: findings.filter(f => !f.resultado && f.severidad === Severity.INDICADOR).length,
    };

    expect(counts[Severity.ERROR]).toBe(1);
    expect(counts[Severity.REVISAR]).toBe(1);
    expect(counts[Severity.INDICADOR]).toBe(1);
  });
});
