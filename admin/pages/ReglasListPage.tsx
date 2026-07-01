import React, { useEffect, useState } from 'react';
import { list, listVersiones, deactivate, activate, type Regla, type Severidad } from '../../services/api/reglas';
import { AdminLayout } from './AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';

const SEVERIDADES: Severidad[] = ['ERROR', 'REVISAR', 'INDICADOR'];

const SEVERITY_COLORS: Record<Severidad, { bg: string; fg: string }> = {
  ERROR: { bg: 'var(--semantic-error-soft)', fg: 'var(--semantic-error)' },
  REVISAR: { bg: '#FFF4E5', fg: '#B25E09' },
  INDICADOR: { bg: 'var(--brand-accent-soft)', fg: 'var(--brand-accent)' },
};

export const ReglasListPage: React.FC = () => {
  const { user } = useAdminAuth();
  const [reglas, setReglas] = useState<Regla[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [filtros, setFiltros] = useState<{ serie?: 'A' | 'P'; severidad?: Severidad; q?: string; incluir_desactivadas?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ultimaVersion, setUltimaVersion] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await list({ ...filtros, page, perPage });
      setReglas(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filtros, page]);

  useEffect(() => {
    listVersiones(1, 1).then(r => {
      if (r.items.length > 0) setUltimaVersion(r.items[0].version_semver);
    }).catch(() => undefined);
  }, []);

  const handleAccion = async (regla: Regla, accion: 'desactivar' | 'activar') => {
    const confirmMsg = accion === 'desactivar'
      ? `Desactivar la regla ${regla.regla_id}?`
      : `Reactivar la regla ${regla.regla_id}?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      if (accion === 'desactivar') await deactivate(regla.regla_id);
      else await activate(regla.regla_id);
      await fetchData();
    } catch (e) {
      window.alert('Error: ' + (e as Error).message);
    }
  };

  return (
    <AdminLayout user={user}>
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Reglas</h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {total} regla{total === 1 ? '' : 's'} activa{total === 1 ? '' : 's'}
              {ultimaVersion && <> · ultima publicacion <code style={{ color: 'var(--brand-accent)' }}>{ultimaVersion}</code></>}
            </p>
          </div>
          <a
            href="/admin/reglas/nueva"
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'var(--brand-accent)', color: 'white' }}
          >
            + Nueva regla
          </a>
        </div>

        {/* Filtros */}
        <div className="deis-card rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Serie</label>
            <select
              value={filtros.serie ?? ''}
              onChange={e => setFiltros(f => ({ ...f, serie: e.target.value === '' ? undefined : e.target.value as 'A' | 'P' }))}
              className="w-full px-2 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
            >
              <option value="">Todas</option>
              <option value="A">Serie A</option>
              <option value="P">Serie P</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Severidad</label>
            <select
              value={filtros.severidad ?? ''}
              onChange={e => setFiltros(f => ({ ...f, severidad: e.target.value === '' ? undefined : e.target.value as Severidad }))}
              className="w-full px-2 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
            >
              <option value="">Todas</option>
              {SEVERIDADES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Buscar</label>
            <input
              type="text"
              value={filtros.q ?? ''}
              onChange={e => setFiltros(f => ({ ...f, q: e.target.value || undefined }))}
              placeholder="ID o mensaje"
              className="w-full px-2 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={!!filtros.incluir_desactivadas}
                onChange={e => setFiltros(f => ({ ...f, incluir_desactivadas: e.target.checked }))}
              />
              Mostrar desactivadas
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl p-4 text-sm" style={{ backgroundColor: 'var(--semantic-error-soft)', color: 'var(--semantic-error)' }}>
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="deis-card rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: 'var(--bg-surface)' }}>
              <tr>
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>ID</th>
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Hoja</th>
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Expresion</th>
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Severidad</th>
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Estado</th>
                <th className="text-right px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-3 py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>Cargando...</td></tr>
              )}
              {!loading && reglas.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>Sin resultados.</td></tr>
              )}
              {reglas.map(r => {
                const c = SEVERITY_COLORS[r.severidad];
                return (
                  <tr key={r.id} style={{ borderTop: '1px solid var(--border-default)', opacity: r.activo ? 1 : 0.55 }}>
                    <td className="px-3 py-2 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{r.regla_id}</td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{r.rem_sheet}</td>
                    <td className="px-3 py-2 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {r.expresion_1} {r.operador} {r.expresion_2 === null ? '0' : String(r.expresion_2)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: c.bg, color: c.fg }}
                      >
                        {r.severidad}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs" style={{ color: r.activo ? 'var(--text-tertiary)' : 'var(--semantic-error)' }}>
                      {r.activo ? 'Activa' : 'Desactivada'}
                    </td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <a
                        href={`/admin/reglas/${encodeURIComponent(r.regla_id)}`}
                        className="text-xs font-medium"
                        style={{ color: 'var(--brand-accent)' }}
                      >
                        Editar
                      </a>
                      {r.activo ? (
                        <button
                          type="button"
                          onClick={() => handleAccion(r, 'desactivar')}
                          className="text-xs font-medium"
                          style={{ color: 'var(--semantic-error)' }}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAccion(r, 'activar')}
                          className="text-xs font-medium"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          Reactivar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginacion */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-lg"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
            >
              Anterior
            </button>
            <span style={{ color: 'var(--text-secondary)' }}>Pagina {page} de {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded-lg"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
