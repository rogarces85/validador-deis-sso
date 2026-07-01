import React from 'react';

export type Severidad = 'ERROR' | 'REVISAR' | 'INDICADOR';

interface Props {
  value: Severidad;
  onChange: (s: Severidad) => void;
  disabled?: boolean;
}

const COLORS: Record<Severidad, { bg: string; fg: string; border: string; label: string }> = {
  ERROR: { bg: 'var(--semantic-error-soft)', fg: 'var(--semantic-error)', border: 'var(--semantic-error-border)', label: 'ERROR' },
  REVISAR: { bg: '#FFF4E5', fg: '#B25E09', border: '#F2C689', label: 'REVISAR' },
  INDICADOR: { bg: 'var(--brand-accent-soft)', fg: 'var(--brand-accent)', border: 'var(--brand-accent)', label: 'INDICADOR' },
};

export const SeveridadPicker: React.FC<Props> = ({ value, onChange, disabled }) => {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Severidad">
      {(Object.keys(COLORS) as Severidad[]).map((s) => {
        const active = value === s;
        const c = COLORS[s];
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(s)}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: active ? c.bg : 'transparent',
              color: active ? c.fg : 'var(--text-secondary)',
              border: `1px solid ${active ? c.border : 'var(--border-default)'}`,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.6 : 1,
            }}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
};
