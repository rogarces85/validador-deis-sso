
const CELL_REF_REGEX = /^\$?([A-Z]+)\$?(\d+)$/;
const RANGE_REGEX = /^\$?([A-Z]+)\$?(\d+):\$?([A-Z]+)\$?(\d+)$/;
const SUM_RANGE_REGEX = /SUM\s*\(\s*([A-Z]+\d+:[A-Z]+\d+)\s*\)/gi;
const CELL_REF_TOKEN = /\$?[A-Z]+\$?\d+/g;

export interface CellReference {
  sheet: string;
  cell: string;
  row: number;
  col: number;
}

const colToIndex = (col: string): number => {
  let n = 0;
  for (let i = 0; i < col.length; i++) {
    n = n * 26 + (col.charCodeAt(i) - 64);
  }
  return n - 1;
};

const indexToCol = (index: number): string => {
  let n = index;
  let result = '';
  while (n >= 0) {
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26) - 1;
  }
  return result;
};

export const parseCellRef = (raw: string): { col: string; row: number } | null => {
  const cleaned = String(raw || '').replace(/\$/g, '').trim().toUpperCase();
  const match = cleaned.match(CELL_REF_REGEX);
  if (!match) return null;
  return { col: match[1], row: parseInt(match[2], 10) };
};

export const expandRange = (range: string): string[] => {
  const cleaned = String(range || '').replace(/\$/g, '').trim().toUpperCase();
  const match = cleaned.match(RANGE_REGEX);
  if (!match) return [];

  const [, colA, rowA, colB, rowB] = match;
  const startRow = Math.min(parseInt(rowA, 10), parseInt(rowB, 10));
  const endRow = Math.max(parseInt(rowA, 10), parseInt(rowB, 10));
  const startColIdx = Math.min(colToIndex(colA), colToIndex(colB));
  const endColIdx = Math.max(colToIndex(colA), colToIndex(colB));

  const cells: string[] = [];
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startColIdx; c <= endColIdx; c++) {
      cells.push(`${indexToCol(c)}${r}`);
    }
  }
  return cells;
};

export const tokenizeExpression = (expression: string): string[] => {
  const text = String(expression || '').trim();
  if (!text) return [];

  const tokens = new Set<string>();
  let working = text;

  let sumMatch: RegExpExecArray | null;
  while ((sumMatch = SUM_RANGE_REGEX.exec(working)) !== null) {
    const range = sumMatch[1];
    expandRange(range).forEach(c => tokens.add(c));
    working = working.replace(sumMatch[0], ' ');
  }
  SUM_RANGE_REGEX.lastIndex = 0;

  const plainMatches = working.match(CELL_REF_TOKEN) || [];
  plainMatches.forEach(m => {
    const cleaned = m.replace(/\$/g, '').toUpperCase();
    if (RANGE_REGEX.test(cleaned)) {
      expandRange(cleaned).forEach(c => tokens.add(c));
    } else if (CELL_REF_REGEX.test(cleaned)) {
      tokens.add(cleaned);
    }
  });

  return Array.from(tokens);
};

import type { ValidationRule } from '../types';

export interface DynamicCellEntry {
  codigo: string;
  severidad: string;
  hojaRem: string;
  seccion: string;
  validacion: string;
  celda: string;
}

export const buildDynamicCellEntries = (
  rules: ValidationRule[],
  defaultSheet: string,
  severidadFallback: string = 'ERROR',
): DynamicCellEntry[] => {
  const entries: DynamicCellEntry[] = [];

  rules.forEach(rule => {
    const sheet = rule.rem_sheet_2 || rule.rem_sheet || defaultSheet;
    const primaryTokens = tokenizeExpression(String(rule.expresion_1 || ''));
    const secondaryTokens = tokenizeExpression(String(rule.expresion_2 || ''));
    const allTokens = Array.from(new Set([...primaryTokens, ...secondaryTokens]));

    allTokens.forEach(cellRef => {
      entries.push({
        codigo: rule.id,
        severidad: rule.severidad || severidadFallback,
        hojaRem: sheet,
        seccion: rule.seccion_expresion_1 || '',
        validacion: rule.mensaje || `${rule.expresion_1} ${rule.operador} ${rule.expresion_2}`,
        celda: cellRef,
      });
    });
  });

  return entries;
};
