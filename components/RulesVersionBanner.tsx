import React from 'react';
import { useRulesVersion } from '../hooks/useRulesVersion';

/**
 * Banner que aparece en la home del validador cuando la version de
 * reglas del backend es mayor que la cacheada localmente.
 * Implementa la US4 de la Feature 003-C.
 */
export const RulesVersionBanner: React.FC = () => {
  const { currentVersion, latestVersion, latestTotal, hasUpdate, applyLatest, loading, refresh } = useRulesVersion();

  if (!hasUpdate) {
    return null;
  }

  return (
    <div
      className="rounded-2xl p-4 mb-6 flex items-start justify-between gap-3"
      style={{
        backgroundColor: 'var(--brand-accent-soft)',
        border: '1px solid var(--brand-accent)',
      }}
      role="alert"
    >
      <div>
        <div className="text-sm font-semibold" style={{ color: 'var(--brand-accent)' }}>
          Hay nuevas reglas disponibles
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          Version local <code>{currentVersion}</code> · Version remota <code>{latestVersion}</code>
          {latestTotal != null && <> · {latestTotal} reglas</>}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Actualiza para validar archivos con la version mas reciente del bundle normativo.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-default)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          Verificar
        </button>
        <button
          type="button"
          onClick={() => void applyLatest()}
          disabled={loading}
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: 'var(--brand-accent)',
            color: 'white',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Actualizando...' : 'Actualizar reglas'}
        </button>
      </div>
    </div>
  );
};
