import React from 'react';

export type Operador = '==' | '!=' | '>' | '<' | '>=' | '<=';

interface Props {
  value: Operador;
  onChange: (op: Operador) => void;
  disabled?: boolean;
}

const OPERADORES: { value: Operador; label: string; hint: string }[] = [
  { value: '==', label: '==', hint: 'igual a' },
  { value: '!=', label: '!=', hint: 'distinto de' },
  { value: '>', label: '>', hint: 'mayor que' },
  { value: '<', label: '<', hint: 'menor que' },
  { value: '>=', label: '>=', hint: 'mayor o igual que' },
  { value: '<=', label: '<=', hint: 'menor o igual que' },
];

export const OperadorPicker: React.FC<Props> = ({ value, onChange, disabled }) => {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Operador">
      {OPERADORES.map((op) => {
        const active = value === op.value;
        return (
          <button
            key={op.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(op.value)}
            className="px-3 py-2 rounded-xl text-sm font-mono font-semibold transition-all"
            style={{
              backgroundColor: active ? 'var(--brand-accent)' : 'var(--bg-surface)',
              color: active ? 'white' : 'var(--text-primary)',
              border: `1px solid ${active ? 'var(--brand-accent)' : 'var(--border-default)'}`,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.6 : 1,
            }}
            title={op.hint}
          >
            {op.label}
          </button>
        );
      })}
    </div>
  );
};
