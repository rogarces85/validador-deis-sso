import React, { useEffect, useState } from 'react';
import { list, listVersiones, actual, type ReglaVersion } from '../../services/api/reglas';
import { AdminLayout } from './AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAdminAuth();
  const [total, setTotal] = useState<number | null>(null);
  const [ultima, setUltima] = useState<{ version_semver: string; total_reglas: number; publicado_en: string } | null>(null);
  const [versiones, setVersiones] = useState<ReglaVersion[]>([]);

  useEffect(() => {
    Promise.all([
      list({ perPage: 1 }).then(r => r.total).catch(() => null),
      actual().catch(() => null),
      listVersiones(1, 5).then(r => r.items).catch(() => []),
    ]).then(([t, a, v]) => {
      setTotal(t);
      if (a) setUltima(a);
      setVersiones(v);
    });
  }, []);

  return (
    <AdminLayout user={user}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Bienvenido, {user?.nombre ?? 'admin'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Panel de administracion del validador REM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="deis-card rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>Reglas activas</div>
            <div className="text-3xl font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
              {total === null ? '—' : total}
            </div>
          </div>
          <div className="deis-card rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>Ultima publicacion</div>
            <div className="text-3xl font-semibold mt-1" style={{ color: 'var(--brand-accent)' }}>
              {ultima ? ultima.version_semver : '—'}
            </div>
            {ultima && (
              <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {ultima.total_reglas} reglas · {new Date(ultima.publicado_en).toLocaleString('es-CL')}
              </div>
            )}
          </div>
          <div className="deis-card rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>Publicaciones</div>
            <div className="text-3xl font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
              {versiones.length}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>ultimas 5</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/reglas"
            className="deis-card rounded-2xl p-5 hover:shadow-md transition-shadow"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Reglas</div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Crear, editar, desactivar y revisar el historial de cambios de las reglas de validacion.
            </p>
          </a>
          <a
            href="/admin/publicar"
            className="deis-card rounded-2xl p-5 hover:shadow-md transition-shadow"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Publicar</div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Crear una version inmutable del bundle para que el validador la sincronice.
            </p>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
};
