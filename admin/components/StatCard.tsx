import React from 'react';

interface Props {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icon?: React.ReactNode;
  /** Color del titulo */
  color?: 'default' | 'accent' | 'error' | 'success' | 'warning';
}

const COLORS: Record<NonNullable<Props['color']>, string> = {
  default: 'var(--text-primary)',
  accent: 'var(--brand-accent)',
  error: 'var(--semantic-error)',
  success: 'var(--brand-accent)',
  warning: '#B25E09',
};

export const StatCard: React.FC<Props> = ({ titulo, valor, subtitulo, icon, color = 'default' }) => {
  return (
    <div
      className="deis-card rounded-2xl p-5"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
          {titulo}
        </div>
        {icon && <div style={{ color: 'var(--text-tertiary)' }}>{icon}</div>}
      </div>
      <div className="text-3xl font-semibold mt-1" style={{ color: COLORS[color] }}>
        {valor}
      </div>
      {subtitulo && (
        <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
          {subtitulo}
        </div>
      )}
    </div>
  );
};
