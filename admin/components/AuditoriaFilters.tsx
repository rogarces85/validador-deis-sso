import React from 'react';
import type { AuditFilters, ResultadoFinal } from '../../services/api/audit';

interface Props {
  filtros: AuditFilters;
  onChange: (next: AuditFilters) => void;
}

const RESULTADOS: ResultadoFinal[] = ['APROBADO', 'CON_OBSERVACIONES', 'RECHAZADO', 'ERROR'];

export const AuditoriaFilters: React.FC<Props> = ({ filtros, onChange }) => {
  const set = <K extends keyof AuditFilters>(k: K, v: AuditFilters[K]) => {
    onChange({ ...filtros, [k]: v });
  };
  return (
    <div className="deis-card rounded-2xl p-4 grid grid-cols-1 md:grid-cols-5 gap-3" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Codigo establecimiento</label>
        <input
          type="text"
          maxLength={6}
          value={filtros.codigo_establecimiento ?? ''}
          onChange={e => set('codigo_establecimiento', e.target.value || undefined)}
          placeholder="6 digitos"
          className="w-full px-2 py-1.5 rounded-lg text-sm font-mono"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Serie</label>
        <select
          value={filtros.serie ?? ''}
          onChange={e => set('serie', e.target.value === '' ? undefined : e.target.value as 'A' | 'P')}
          className="w-full px-2 py-1.5 rounded-lg text-sm"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
        >
          <option value="">Todas</option>
          <option value="A">Serie A</option>
          <option value="P">Serie P</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Mes</label>
        <select
          value={filtros.mes ?? ''}
          onChange={e => set('mes', e.target.value || undefined)}
          className="w-full px-2 py-1.5 rounded-lg text-sm"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
        >
          <option value="">Todos</option>
          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m =>
            <option key={m} value={m}>{m}</option>
          )}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Resultado</label>
        <select
          value={filtros.resultado_final ?? ''}
          onChange={e => set('resultado_final', e.target.value === '' ? undefined : e.target.value as ResultadoFinal)}
          className="w-full px-2 py-1.5 rounded-lg text-sm"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
        >
          <option value="">Todos</option>
          {RESULTADOS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Desde</label>
        <input
          type="date"
          value={filtros.desde ?? ''}
          onChange={e => set('desde', e.target.value || undefined)}
          className="w-full px-2 py-1.5 rounded-lg text-sm"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
        />
      </div>
    </div>
  );
};
