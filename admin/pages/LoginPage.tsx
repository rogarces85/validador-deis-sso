import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthContext';

export const LoginPage: React.FC = () => {
  const { login, status, error, user } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState<string | null>(null);

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next') ?? '/admin';
      window.location.replace(next);
    }
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidation(null);
    if (!email.trim()) {
      setValidation('Ingrese su correo electronico.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setValidation('El correo electronico no tiene un formato valido.');
      return;
    }
    if (password.length < 8) {
      setValidation('La contrasena debe tener al menos 8 caracteres.');
      return;
    }
    try {
      await login(email.trim(), password);
    } catch {
      // el error ya queda en context.error
    }
  };

  const loading = status === 'loading';

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
    >
      <form
        onSubmit={onSubmit}
        className="deis-card rounded-3xl p-8 w-full max-w-sm"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        noValidate
      >
        <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Iniciar sesion
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Acceso para administradores del validador REM.
        </p>

        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Correo electronico
        </label>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-xl outline-none"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
          }}
          disabled={loading}
        />

        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Contrasena
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-xl outline-none"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
          }}
          disabled={loading}
        />

        {(validation || error) && (
          <div
            className="text-sm rounded-xl px-3 py-2 mb-4"
            style={{
              backgroundColor: 'var(--semantic-error-soft)',
              color: 'var(--semantic-error)',
              border: '1px solid var(--semantic-error-border)',
            }}
            role="alert"
          >
            {validation ?? error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-2 font-medium transition-opacity"
          style={{
            backgroundColor: 'var(--brand-accent)',
            color: 'white',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Validando...' : 'Ingresar'}
        </button>

        <p className="text-xs mt-6 text-center" style={{ color: 'var(--text-tertiary)' }}>
          <a href="/" style={{ color: 'var(--brand-accent)' }}>
            Volver al validador
          </a>
        </p>
      </form>
    </div>
  );
};
