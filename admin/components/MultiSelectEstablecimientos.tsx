import React, { useState } from 'react';
import establishmentsCatalog from '../../data/establishments.catalog.json';

interface CatalogEstablishment {
  codigo: string;
  nombre: string;
  tipo: string;
  comuna: string;
  activo: boolean;
}

interface Props {
  label: string;
  selected: string[];
  onChange: (next: string[]) => void;
  helpText?: string;
  soloActivos?: boolean;
}

export const MultiSelectEstablecimientos: React.FC<Props> = ({ label, selected, onChange, helpText, soloActivos = true }) => {
  const [filter, setFilter] = useState('');
  const establecimientos = ((establishmentsCatalog as { establecimientos: CatalogEstablishment[] }).establecimientos ?? [])
    .filter(e => !soloActivos || e.activo);
  const filtered = establecimientos.filter(e => {
    const q = filter.toLowerCase();
    return e.codigo.includes(q) || e.nombre.toLowerCase().includes(q) || e.comuna.toLowerCase().includes(q);
  }).slice(0, 100);
  const toggle = (codigo: string) => {
    if (selected.includes(codigo)) {
      onChange(selected.filter(x => x !== codigo));
    } else {
      onChange([...selected, codigo]);
    }
  };
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
        placeholder="Buscar por codigo, nombre o comuna..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-full mb-2 px-2 py-1 rounded-lg text-sm"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
      />
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-default)' }}>
        <div className="max-h-48 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="p-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {establecimientos.length === 0 ? 'Catalogo vacio' : 'Sin coincidencias'}
            </div>
          )}
          {filtered.map(e => {
            const active = selected.includes(e.codigo);
            return (
              <button
                key={e.codigo}
                type="button"
                onClick={() => toggle(e.codigo)}
                className="w-full text-left px-3 py-2 text-sm flex items-center justify-between"
                style={{
                  backgroundColor: active ? 'var(--brand-accent-soft)' : 'transparent',
                  borderBottom: '1px solid var(--border-default)',
                }}
              >
                <span style={{ color: 'var(--text-primary)' }}>
                  <strong>{e.codigo}</strong> {e.nombre}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {e.tipo} - {e.comuna}
                </span>
              </button>
            );
          })}
        </div>
        {filtered.length === 100 && (
          <div className="p-2 text-xs" style={{ color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-surface)' }}>
            Mostrando los primeros 100. Refina la busqueda para ver mas.
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.map(codigo => (
            <span
              key={codigo}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
              style={{ backgroundColor: 'var(--brand-accent-soft)', color: 'var(--brand-accent)' }}
            >
              {codigo}
              <button type="button" onClick={() => toggle(codigo)} aria-label={`Quitar ${codigo}`}>x</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
