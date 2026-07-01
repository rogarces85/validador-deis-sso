import React from 'react';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import { RequireAdmin } from './RequireAdmin';
import { LoginPage } from './pages/LoginPage';

const AdminHomePlaceholder: React.FC = () => {
  const { user, logout } = useAdminAuth();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="deis-card rounded-3xl p-6 mb-4" style={{ boxShadow: 'var(--shadow-md)' }}>
        <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Panel de administracion
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Sesion iniciada como <strong>{user?.nombre}</strong> ({user?.email}).
        </p>
        <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
          Esta es la pantalla base del modulo admin. Las siguientes entregas agregaran:
        </p>
        <ul className="text-sm mt-2 ml-5 list-disc" style={{ color: 'var(--text-secondary)' }}>
          <li>003-B: CRUD de reglas y publicacion de versiones.</li>
          <li>003-C: Auditoria no clinica y estadisticas de uso.</li>
        </ul>
        <div className="mt-6">
          <button
            onClick={() => void logout()}
            className="text-sm font-medium rounded-full px-3 py-1.5"
            style={{ backgroundColor: 'var(--semantic-error-soft)', color: 'var(--semantic-error)' }}
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminRouter: React.FC = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/admin';

  if (path.startsWith('/admin/login')) {
    return <LoginPage />;
  }

  return (
    <RequireAdmin>
      <AdminHomePlaceholder />
    </RequireAdmin>
  );
};

export const AdminApp: React.FC = () => (
  <AdminAuthProvider>
    <AdminRouter />
  </AdminAuthProvider>
);
