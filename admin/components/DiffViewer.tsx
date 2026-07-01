import React from 'react';

interface Props {
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  fields?: string[];
  title?: string;
}

const DEFAULT_FIELDS = [
  'severidad', 'mensaje', 'expresion_1', 'operador', 'expresion_2',
  'omitir_si_ambos_cero', 'omitir_si_v1_es_cero', 'validacion_exclusiva',
  'aplicar_a_tipo', 'excluir_tipo', 'aplicar_a', 'establecimientos_excluidos',
];

function renderValue(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'boolean') return v ? 'si' : 'no';
  if (Array.isArray(v)) return v.length === 0 ? '[]' : v.join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function valuesEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const DiffViewer: React.FC<Props> = ({ before, after, fields = DEFAULT_FIELDS, title }) => {
  const hasBefore = before !== null;
  const hasAfter = after !== null;
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-default)' }}>
      {title && (
        <div className="px-4 py-2 text-sm font-semibold" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
          {title}
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-surface)' }}>
            <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Campo</th>
            <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Antes</th>
            <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Despues</th>
          </tr>
        </thead>
        <tbody>
          {fields.map(f => {
            const b = hasBefore ? before?.[f] : undefined;
            const a = hasAfter ? after?.[f] : undefined;
            const changed = !valuesEqual(b, a);
            const isNew = !hasBefore && hasAfter;
            const isDeleted = hasBefore && !hasAfter;
            return (
              <tr
                key={f}
                style={{
                  backgroundColor: changed
                    ? (isNew ? 'rgba(34,197,94,0.10)' : isDeleted ? 'rgba(239,68,68,0.10)' : 'rgba(234,179,8,0.10)')
                    : 'transparent',
                  borderTop: '1px solid var(--border-default)',
                }}
              >
                <td className="px-3 py-2 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{f}</td>
                <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{hasBefore ? renderValue(b) : '—'}</td>
                <td className="px-3 py-2" style={{ color: 'var(--text-primary)', fontWeight: changed ? 600 : 400 }}>{hasAfter ? renderValue(a) : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
