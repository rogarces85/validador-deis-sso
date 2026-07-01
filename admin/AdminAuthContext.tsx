import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AdminUser, login as apiLogin, logout as apiLogout, me as apiMe } from '../services/api/auth';
import { setOnUnauthorized } from '../services/api/client';

const STORAGE_KEY = 'deis_admin_session_v1';

interface StoredSession {
  user: AdminUser;
}

interface AdminAuthState {
  user: AdminUser | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

function loadStored(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (parsed && parsed.user && typeof parsed.user.email === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveStored(session: StoredSession | null): void {
  if (session) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => loadStored()?.user ?? null);
  const [status, setStatus] = useState<AdminAuthState['status']>('idle');
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const res = await apiMe();
      if (res) {
        setUser(res.user);
        saveStored({ user: res.user });
        setStatus('ready');
      } else {
        setUser(null);
        saveStored(null);
        setStatus('idle');
      }
    } catch (e) {
      setUser(null);
      saveStored(null);
      setStatus('error');
      setError((e as Error).message);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setStatus('loading');
    setError(null);
    try {
      const res = await apiLogin(email, password);
      setUser(res.user);
      saveStored({ user: res.user });
      setStatus('ready');
    } catch (e) {
      setStatus('error');
      const err = e as Error & { payload?: { reset_in?: number; error?: string } };
      const detail = err.payload?.reset_in
        ? `${err.message} (reintente en ${err.payload.reset_in}s)`
        : err.message;
      setError(detail);
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      saveStored(null);
      setStatus('idle');
    }
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      saveStored(null);
      setStatus('idle');
    });
    if (user) {
      refresh().catch(() => undefined);
    } else {
      setStatus('idle');
    }
    return () => setOnUnauthorized(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const value = useMemo<AdminAuthState>(
    () => ({ user, status, error, login, logout, refresh }),
    [user, status, error, login, logout, refresh]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider');
  }
  return ctx;
}
