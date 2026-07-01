import React from 'react';

interface Props {
  expresion: string;
}

/**
 * Vista previa legible de una expresion de regla. NO evalua la
 * expresion (eso lo hace el validador en runtime), solo la parsea
 * de forma simple para mostrar una descripcion humana.
 *
 * Reglas que reconoce:
 *   SUM(rango) o SUM(rango, rango, ...)
 *   Hoja!Celda (cross-sheet)
 *   Celda simple
 *   Rango A1:B10
 *   Suma/resta simple A1+B2
 */
export const ExpresionPreview: React.FC<Props> = ({ expresion }) => {
  const descripcion = describe(expresion);
  if (!descripcion) {
    return (
      <div
        className="text-sm rounded-xl px-3 py-2"
        style={{
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-tertiary)',
          border: '1px solid var(--border-default)',
        }}
      >
        Escribe una expresion (ej. <code>F11</code>, <code>SUM(C21:C36)</code>, <code>A03!C108</code>).
      </div>
    );
  }
  return (
    <div
      className="text-sm rounded-xl px-3 py-2"
      style={{
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-default)',
      }}
    >
      <strong style={{ color: 'var(--text-primary)' }}>Vista previa:</strong> {descripcion}
    </div>
  );
};

function describe(expr: string): string | null {
  const trimmed = expr.trim();
  if (!trimmed) return null;

  const sumMatch = trimmed.match(/^SUM\s*\((.+)\)$/i);
  if (sumMatch) {
    const args = sumMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    if (args.length === 0) return null;
    if (args.length === 1) {
      return `Suma el rango ${args[0]}.`;
    }
    return `Suma los rangos ${args.join(', ')}.`;
  }

  const crossMatch = trimmed.match(/^([A-Z]+\d+):?([A-Z]*\d+)?!([A-Z]+\d+)$/i);
  if (crossMatch) {
    return `Lee la celda ${crossMatch[3]} de la hoja ${crossMatch[1]}.`;
  }

  const rangeMatch = trimmed.match(/^([A-Z]+\d+):([A-Z]+\d+)$/i);
  if (rangeMatch) {
    return `Suma el rango ${rangeMatch[1]}:${rangeMatch[2]}.`;
  }

  const cellMatch = trimmed.match(/^[A-Z]+\d+$/i);
  if (cellMatch) {
    return `Lee la celda ${trimmed.toUpperCase()}.`;
  }

  const arithMatch = trimmed.match(/^([A-Z]+\d+)([+\-*/])([A-Z]+\d+)$/);
  if (arithMatch) {
    return `Combina las celdas ${arithMatch[1]} ${arithMatch[2]} ${arithMatch[3]}.`;
  }

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return `Valor literal numerico: ${trimmed}.`;
  }
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return `Valor literal texto: ${trimmed}.`;
  }

  return `Expresion compuesta: "${trimmed}".`;
}
