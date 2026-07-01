import React, { useEffect, useState } from 'react';
import { actual, publicar, listVersiones, type ReglaVersion } from '../../services/api/reglas';
import { AdminLayout } from './AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';

export const PublicarPage: React.FC = () => {
  const { user } = useAdminAuth();
  const [current, setCurrent] = useState<{ version_semver: string; total_reglas: number; publicado_en: string } | null>(null);
  const [historial, setHistorial] = useState<ReglaVersion[]>([]);
  const [notas, setNotas] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [a, h] = await Promise.all([
        actual().catch(() => null),
        listVersiones(1, 20).catch(() => ({ items: [], total: 0 })),
      ]);
      if (a) {
        setCurrent({ version_semver: a.version_semver, total_reglas: a.total_reglas, publicado_en: a.publicado_en });
      } else {
        setCurrent(null);
      }
      setHistorial(h.items);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePublicar = async () => {
    if (!window.confirm('Crear una nueva publicacion a partir de las reglas activas? Esta accion queda registrada en el audit log.')) return;
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      const r = await publicar(notas.trim() || undefined);
      setInfo(`Publicada version ${r.semver} con ${r.total_reglas} reglas.`);
      setNotas('');
      await fetchData();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout user={user}>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Publicar version</h1>
          <a href="/admin/reglas" className="text-sm" style={{ color: 'var(--text-secondary)' }}>← Volver al listado</a>
        </div>

        {error && (
          <div className="rounded-2xl p-4 text-sm" style={{ backgroundColor: 'var(--semantic-error-soft)', color: 'var(--semantic-error)' }}>
            {error}
          </div>
        )}
        {info && (
          <div className="rounded-2xl p-4 text-sm" style={{ backgroundColor: 'var(--brand-accent-soft)', color: 'var(--brand-accent)' }}>
            {info}
          </div>
        )}

        <div className="deis-card rounded-2xl p-5 space-y-3" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Ultima publicacion</h2>
          {current ? (
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Version <code style={{ color: 'var(--brand-accent)' }}>{current.version_semver}</code> con{' '}
              <strong>{current.total_reglas}</strong> reglas, publicada el{' '}
              {new Date(current.publicado_en).toLocaleString('es-CL')}.
            </div>
          ) : (
            <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Aun no hay publicaciones.</div>
          )}
        </div>

        <div className="deis-card rounded-2xl p-5 space-y-3" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Nueva publicacion</h2>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Crea un snapshot inmutable de las reglas activas con un nuevo semver (ej. <code>1.0.X-reglas</code>).
            El bundle se sirve en <code>GET /api/reglas/actual</code> para que el validador pueda sincronizarlo.
          </p>
          <label className="block text-sm font-medium mt-2" style={{ color: 'var(--text-primary)' }}>Nota de release (opcional)</label>
          <textarea
            value={notas}
            onChange={e => setNotas(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="ej. Ajustes en validaciones de control preconcepcional."
            className="w-full px-3 py-2 rounded-xl text-sm"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
          />
          <button
            type="button"
            onClick={handlePublicar}
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'var(--brand-accent)', color: 'white', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Publicando...' : 'Publicar nueva version'}
          </button>
        </div>

        <div className="deis-card rounded-2xl p-5 space-y-3" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Historial</h2>
          {historial.length === 0 && (
            <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Sin publicaciones previas.</div>
          )}
          <ul className="space-y-2">
            {historial.map(v => (
              <li
                key={v.id}
                className="rounded-xl px-3 py-2 text-sm flex items-center justify-between"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
              >
                <span>
                  <code style={{ color: 'var(--brand-accent)' }}>{v.version_semver}</code>
                  {' · '}{v.total_reglas} reglas
                  {' · '}{new Date(v.publicado_en).toLocaleString('es-CL')}
                </span>
                {v.notas && <span className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>{v.notas}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};
