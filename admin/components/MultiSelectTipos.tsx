import React, { useState } from 'react';

export const VALID_TIPOS = [
  'HOSPITAL', 'CESFAM', 'POSTA', 'CECOSF', 'SAPU', 'SUR', 'COSAM',
  'SALUD_MENTAL', 'DIRECCION', 'MOVIL', 'PRIVADA', 'OTROS',
] as const;

export type TipoEstablecimiento = typeof VALID_TIPOS[number];

interface Props {
  label: string;
  selected: string[];
  onChange: (next: string[]) => void;
  helpText?: string;
}

export const MultiSelectTipos: React.FC<Props> = ({ label, selected, onChange, helpText }) => {
  const [filter, setFilter] = useState('');
  const toggle = (t: string) => {
    if (selected.includes(t)) {
      onChange(selected.filter(x => x !== t));
    } else {
      onChange([...selected, t]);
    }
  };
  const filtered = VALID_TIPOS.filter(t => t.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        {label}
      </label>
      {helpText && (
        <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>{helpText}</p>
      )}
      <input
        type="text"
        placeholder="Filtrar tipos..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-full mb-2 px-2 py-1 rounded-lg text-sm"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
      />
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-surface)' }}>
        {filtered.length === 0 && (
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Sin coincidencias</span>
        )}
        {filtered.map(t => {
          const active = selected.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className="px-2 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: active ? 'var(--brand-accent)' : 'transparent',
                color: active ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${active ? 'var(--brand-accent)' : 'var(--border-default)'}`,
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {selected.length} seleccionado(s): <span style={{ color: 'var(--text-primary)' }}>{selected.join(', ')}</span>
        </div>
      )}
    </div>
  );
};
