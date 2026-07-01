import React, { useEffect } from 'react';
import { useAdminAuth } from './AdminAuthContext';

interface Props {
  children: React.ReactNode;
}

const LoginFallback: React.FC = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-secondary)',
    }}
  >
    <span>Verificando sesion...</span>
  </div>
);

export const RequireAdmin: React.FC<Props> = ({ children }) => {
  const { user, status, refresh } = useAdminAuth();

  useEffect(() => {
    if (status === 'idle' && !user) {
      refresh().catch(() => undefined);
    }
  }, [status, user, refresh]);

  if (status === 'loading' || (status === 'idle' && !user)) {
    return <LoginFallback />;
  }
  if (!user) {
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      const target = '/admin/login?next=' + encodeURIComponent(window.location.pathname);
      window.location.replace(target);
    }
    return <LoginFallback />;
  }
  return <>{children}</>;
};
