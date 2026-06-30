import { describe, expect, it } from 'vitest';
import {
  parseCellRef,
  expandRange,
  tokenizeExpression,
  buildDynamicCellEntries,
} from '../utils/cellReferences';
import { ValidationRule, Severity } from '../types';

describe('cellReferences - parseCellRef', () => {
  it('parses referencias simples', () => {
    expect(parseCellRef('C12')).toEqual({ col: 'C', row: 12 });
    expect(parseCellRef('AB33')).toEqual({ col: 'AB', row: 33 });
  });

  it('toler el simbolo $ de Excel', () => {
    expect(parseCellRef('$C$12')).toEqual({ col: 'C', row: 12 });
  });

  it('devuelve null para entradas invalidas', () => {
    expect(parseCellRef('SUM(C12)')).toBeNull();
    expect(parseCellRef('12C')).toBeNull();
    expect(parseCellRef('')).toBeNull();
  });
});

describe('cellReferences - expandRange', () => {
  it('expande rangos verticales simples', () => {
    const cells = expandRange('B12:B15');
    expect(cells).toEqual(['B12', 'B13', 'B14', 'B15']);
  });

  it('expande rangos horizontales simples', () => {
    const cells = expandRange('C12:E12');
    expect(cells).toEqual(['C12', 'D12', 'E12']);
  });

  it('expande rangos 2D completos', () => {
    const cells = expandRange('B21:AG21');
    expect(cells.length).toBe(32);
    expect(cells[0]).toBe('B21');
    expect(cells[cells.length - 1]).toBe('AG21');
    expect(cells).toContain('AA21');
    expect(cells).toContain('Z21');
  });

  it('tolera orden invertido en rangos', () => {
    const cells = expandRange('AG21:B21');
    expect(cells.length).toBe(32);
    expect(cells[0]).toBe('B21');
  });

  it('tolera $ en rangos', () => {
    expect(expandRange('$H$17:$U$17')).toContain('H17');
    expect(expandRange('$H$17:$U$17')).toContain('U17');
  });
});

describe('cellReferences - tokenizeExpression', () => {
  it('tokeniza una celda simple', () => {
    expect(tokenizeExpression('C69')).toEqual(['C69']);
  });

  it('tokeniza producto de dos celdas', () => {
    const tokens = tokenizeExpression('B61*C61');
    expect(tokens).toContain('B61');
    expect(tokens).toContain('C61');
    expect(tokens.length).toBe(2);
  });

  it('tokeniza suma y resta compuesta', () => {
    const tokens = tokenizeExpression('C12+(F12-G12)');
    expect(tokens).toContain('C12');
    expect(tokens).toContain('F12');
    expect(tokens).toContain('G12');
  });

  it('expande SUM(rango) en celdas individuales', () => {
    const tokens = tokenizeExpression('SUM(H34:AG34)');
    expect(tokens).toContain('H34');
    expect(tokens).toContain('AG34');
    expect(tokens.length).toBeGreaterThan(10);
  });

  it('expande dos SUM() combinados', () => {
    const tokens = tokenizeExpression('SUM(H17:U17)+SUM(V22:AG22)-C38');
    expect(tokens).toContain('H17');
    expect(tokens).toContain('U17');
    expect(tokens).toContain('V22');
    expect(tokens).toContain('AG22');
    expect(tokens).toContain('C38');
  });

  it('tolera multiples SUM(rango) con espacios', () => {
    const tokens = tokenizeExpression('SUM( H34 : AG34 ) + B12');
    expect(tokens).toContain('H34');
    expect(tokens).toContain('AG34');
    expect(tokens).toContain('B12');
  });

  it('tolera referencias con $', () => {
    expect(tokenizeExpression('$C$69')).toContain('C69');
  });

  it('devuelve lista vacia para entrada no valida', () => {
    expect(tokenizeExpression('')).toEqual([]);
    expect(tokenizeExpression('texto sin celdas')).toEqual([]);
  });
});

describe('cellReferences - buildDynamicCellEntries', () => {
  const makeRule = (overrides: Partial<ValidationRule>): ValidationRule => ({
    id: 'TEST-VAL001',
    tipo: 'SIMPLE',
    rem_sheet: 'P1',
    expresion_1: 'C12',
    operador: '==',
    expresion_2: 0,
    severidad: Severity.ERROR,
    mensaje: 'TEST',
    ...overrides,
  } as ValidationRule);

  it('construye entradas desde reglas con celdas y sumas', () => {
    const rules: ValidationRule[] = [
      makeRule({
        id: 'P02-VAL002',
        rem_sheet: 'P2',
        expresion_1: 'C21',
        operador: '==',
        expresion_2: 'SUM(H34:AG34)',
        rem_sheet_2: 'P2',
        seccion_expresion_1: 'SECCION A',
        seccion_expresion_2: 'SECCION A',
        mensaje: 'Test mensaje',
      }),
    ];

    const entries = buildDynamicCellEntries(rules, 'P2');
    const refs = entries.map(e => e.celda);

    expect(refs).toContain('C21');
    expect(refs.length).toBeGreaterThan(1);
    expect(refs).toContain('H34');
    expect(refs).toContain('AG34');
  });

  it('preserva codigo, hoja y mensaje en cada entrada', () => {
    const rules: ValidationRule[] = [
      makeRule({
        id: 'P05-VAL001',
        rem_sheet: 'P5',
        expresion_1: 'SUM(B21:AG21)',
        expresion_2: 'SUM(B38:AG38)',
      }),
    ];

    const entries = buildDynamicCellEntries(rules, 'P5');
    expect(entries.length).toBeGreaterThan(0);
    entries.forEach(e => {
      expect(e.codigo).toBe('P05-VAL001');
      expect(e.hojaRem).toBe('P5');
      expect(typeof e.celda).toBe('string');
      expect(e.celda.length).toBeGreaterThan(0);
    });
  });

  it('no duplica celdas si aparecen en varias reglas', () => {
    const rules: ValidationRule[] = [
      makeRule({ id: 'A-VAL1', expresion_1: 'C12' }),
      makeRule({ id: 'A-VAL2', expresion_1: 'C12 + D14' }),
    ];

    const entries = buildDynamicCellEntries(rules, 'P1');
    const c12count = entries.filter(e => e.celda === 'C12').length;
    expect(c12count).toBe(2);
  });
});
