import React, { useEffect, useState } from 'react';
import { list, stats, type AuditEvent, type AuditFilters, type AuditStats, type ResultadoFinal } from '../../services/api/audit';
import { AdminLayout } from './AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import { StatCard } from '../components/StatCard';
import { AuditoriaFilters } from '../components/AuditoriaFilters';

const RESULTADO_COLORS: Record<ResultadoFinal, { bg: string; fg: string }> = {
  APROBADO: { bg: 'rgba(34,197,94,0.15)', fg: '#15803D' },
  CON_OBSERVACIONES: { bg: '#FFF4E5', fg: '#B25E09' },
  RECHAZADO: { bg: 'var(--semantic-error-soft)', fg: 'var(--semantic-error)' },
  ERROR: { bg: 'rgba(120,120,128,0.15)', fg: 'var(--text-secondary)' },
};

const PAGE_SIZE = 50;

export const AuditoriaPage: React.FC = () => {
  const { user } = useAdminAuth();
  const [filtros, setFiltros] = useState<AuditFilters>({});
  const [page, setPage] = useState(1);
  const [eventos, setEventos] = useState<AuditEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statsData, setStatsData] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.all([
        list({ ...filtros, page, perPage: PAGE_SIZE }),
        stats(filtros),
      ]);
      setEventos(listRes.items);
      setTotal(listRes.total);
      setTotalPages(listRes.totalPages);
      setStatsData(statsRes);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filtros, page]);

  // Top establecimiento para el StatCard
  const topEst = statsData?.por_establecimiento[0];

  return (
    <AdminLayout user={user}>
      <div className="max-w-6xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Auditoria</h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Eventos de uso del validador. Solo se registran metadatos no clinicos.
          </p>
        </div>

        {/* StatCards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatCard
            titulo="Total de validaciones"
            valor={statsData?.total ?? '—'}
            subtitulo="en el rango seleccionado"
          />
          <StatCard
            titulo="Tasa de aprobacion"
            valor={statsData ? `${Math.round(statsData.tasa_aprobacion * 100)}%` : '—'}
            subtitulo="sin contar errores tecnicos"
            color="success"
          />
          <StatCard
            titulo="Series validadas"
            valor={statsData?.por_serie.length ?? 0}
            subtitulo={statsData?.por_serie.map(s => `${s.serie}: ${s.total}`).join(' · ') ?? ''}
          />
          <StatCard
            titulo="Top establecimiento"
            valor={topEst ? `${topEst.codigo}` : '—'}
            subtitulo={topEst ? `${topEst.nombre || 'sin nombre'} (${topEst.total})` : 'sin datos'}
          />
        </div>

        <AuditoriaFilters filtros={filtros} onChange={f => { setPage(1); setFiltros(f); }} />

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
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Fecha</th>
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Archivo</th>
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Establecimiento</th>
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Serie/Mes</th>
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Hallazgos</th>
                <th className="text-left px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Resultado</th>
                <th className="text-right px-3 py-2" style={{ color: 'var(--text-secondary)' }}>Duracion</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-3 py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>Cargando...</td></tr>
              )}
              {!loading && eventos.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>Sin eventos.</td></tr>
              )}
              {eventos.map((e, idx) => {
                const c = RESULTADO_COLORS[e.resultado_final];
                return (
                  <tr key={`${e.id}-${idx}`} style={{ borderTop: '1px solid var(--border-default)' }}>
                    <td className="px-3 py-2 text-xs font-mono" style={{ color: 'var(--text-primary)' }}>
                      {e.timestamp ? new Date(e.timestamp).toLocaleString('es-CL') : '—'}
                    </td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{e.nombre_archivo}</td>
                    <td className="px-3 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <div>{e.codigo_establecimiento}</div>
                      <div style={{ color: 'var(--text-tertiary)' }}>{e.nombre_establecimiento ?? '—'}</div>
                    </td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{e.serie}/{e.mes}</td>
                    <td className="px-3 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {e.total_hallazgos} ({e.conteo_error ?? 0}E · {e.conteo_revisar ?? 0}R · {e.conteo_indicador ?? 0}I)
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: c.bg, color: c.fg }}
                      >
                        {e.resultado_final}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {e.duracion_ms != null ? `${e.duracion_ms} ms` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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
            <span style={{ color: 'var(--text-secondary)' }}>Pagina {page} de {totalPages} ({total} eventos)</span>
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
