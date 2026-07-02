import React from 'react';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import { RequireAdmin } from './RequireAdmin';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReglasListPage } from './pages/ReglasListPage';
import { ReglaEditPage } from './pages/ReglaEditPage';
import { PublicarPage } from './pages/PublicarPage';
import { AuditoriaPage } from './pages/AuditoriaPage';

const AdminRouter: React.FC = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/admin';

  if (path.startsWith('/admin/login')) {
    return <LoginPage />;
  }
  if (path === '/admin' || path === '/admin/') {
    return (
      <RequireAdmin>
        <DashboardPage />
      </RequireAdmin>
    );
  }
  if (path === '/admin/reglas' || path === '/admin/reglas/') {
    return (
      <RequireAdmin>
        <ReglasListPage />
      </RequireAdmin>
    );
  }
  if (path === '/admin/reglas/nueva') {
    return (
      <RequireAdmin>
        <ReglaEditPage />
      </RequireAdmin>
    );
  }
  const editMatch = path.match(/^\/admin\/reglas\/([^/]+)$/);
  if (editMatch) {
    return (
      <RequireAdmin>
        <ReglaEditPage reglaId={decodeURIComponent(editMatch[1])} />
      </RequireAdmin>
    );
  }
  if (path === '/admin/publicar') {
    return (
      <RequireAdmin>
        <PublicarPage />
      </RequireAdmin>
    );
  }
  if (path === '/admin/auditoria') {
    return (
      <RequireAdmin>
        <AuditoriaPage />
      </RequireAdmin>
    );
  }
  return (
    <RequireAdmin>
      <div className="max-w-3xl mx-auto p-6" style={{ color: 'var(--text-secondary)' }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>404</h1>
        <p className="text-sm">Ruta admin no encontrada: {path}</p>
        <a href="/admin" className="text-sm" style={{ color: 'var(--brand-accent)' }}>Ir al dashboard</a>
      </div>
    </RequireAdmin>
  );
};

export const AdminApp: React.FC = () => (
  <AdminAuthProvider>
    <AdminRouter />
  </AdminAuthProvider>
);
