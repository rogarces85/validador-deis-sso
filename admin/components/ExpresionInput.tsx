import React, { useMemo } from 'react';

interface Props {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

/**
 * Resalta celdas (A1), rangos (A1:B10), funciones SUM(A1:A10) y
 * referencias cross-sheet (Hoja!A1) en un textarea sin perder foco
 * de edicion: muestra el texto plano en el textarea y, superpuesto,
 * un <pre> espejado que pinta los matches con clases inline.
 */
export const ExpresionInput: React.FC<Props> = ({ value, onChange, placeholder, disabled, rows = 2 }) => {
  const highlighted = useMemo(() => {
    const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let html = escape(value);
    // SUM(...)
    html = html.replace(/\b(SUM)\s*\(([^)]*)\)/gi, '<span style="color:#7C3AED;font-weight:600">$1(<span style="color:#B25E09">$2</span>)</span>');
    // Cross-sheet Hoja!Celda
    html = html.replace(/([A-Z]+\d+):?([A-Z]*\d+)?!([A-Z]+\d+)/g, '<span style="color:#0E7C66">$1!$3</span>');
    // Rango A1:B10
    html = html.replace(/([A-Z]+\d+):([A-Z]+\d+)/g, '<span style="color:#0E7C66">$1:$2</span>');
    // Celda suelta A1
    html = html.replace(/\b([A-Z]+\d+)\b/g, '<span style="color:#0E7C66;font-weight:600">$1</span>');
    // Operadores
    html = html.replace(/(\+|-|\*|\/)/g, '<span style="color:#B91C1C">$1</span>');
    return html;
  }, [value]);

  return (
    <div className="relative">
      <pre
        aria-hidden
        className="absolute inset-0 px-3 py-2 rounded-xl font-mono text-sm pointer-events-none whitespace-pre-wrap break-words m-0"
        style={{
          color: 'transparent',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
        }}
        dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
      />
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="relative w-full px-3 py-2 rounded-xl outline-none font-mono text-sm"
        style={{
          color: 'var(--text-primary)',
          backgroundColor: 'transparent',
          border: '1px solid var(--border-default)',
          resize: 'vertical',
          caretColor: 'var(--text-primary)',
        }}
        spellCheck={false}
      />
    </div>
  );
};
