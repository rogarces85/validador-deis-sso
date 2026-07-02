import React from 'react';
import { useAdminAuth } from '../AdminAuthContext';

interface Props {
  user: { nombre: string; email: string } | null;
  children: React.ReactNode;
}

const NAV: { href: string; label: string }[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/reglas', label: 'Reglas' },
  { href: '/admin/publicar', label: 'Publicar' },
  { href: '/admin/auditoria', label: 'Auditoria' },
];

export const AdminLayout: React.FC<Props> = ({ user, children }) => {
  const { logout } = useAdminAuth();
  const path = typeof window !== 'undefined' ? window.location.pathname : '/admin';
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
      <header
        className="flex items-center justify-between px-6 py-3"
        style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}
      >
        <div className="flex items-center gap-6">
          <a href="/admin" className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            Validador DEIS <span style={{ color: 'var(--brand-accent)' }}>admin</span>
          </a>
          <nav className="flex items-center gap-1">
            {NAV.map(item => {
              const active = item.href === '/admin' ? path === '/admin' : path.startsWith(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: active ? 'var(--brand-accent)' : 'transparent',
                    color: active ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span style={{ color: 'var(--text-secondary)' }}>
            {user?.nombre ?? 'admin'}{' '}
            <span style={{ color: 'var(--text-tertiary)' }}>({user?.email ?? ''})</span>
          </span>
          <a href="/" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Validador</a>
          <button
            type="button"
            onClick={() => { void logout(); }}
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: 'var(--semantic-error-soft)', color: 'var(--semantic-error)' }}
          >
            Cerrar sesion
          </button>
        </div>
      </header>
      <main className="px-6 py-6">{children}</main>
    </div>
  );
};
