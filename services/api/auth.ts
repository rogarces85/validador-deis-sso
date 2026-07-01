import { apiFetch, setCsrfToken } from './client';

export interface AdminUser {
  id: number;
  email: string;
  nombre: string;
  activo: boolean;
  ultimo_acceso: string | null;
}

export interface AuthResponse {
  user: AdminUser;
  csrf_token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<{ ok: true; user: AdminUser; csrf_token: string }>(
    '/auth/login',
    { method: 'POST', body: { email, password } }
  );
  setCsrfToken(data.csrf_token);
  return { user: data.user, csrf_token: data.csrf_token };
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<{ ok: true }>('/auth/logout', { method: 'POST', withCsrf: true });
  } finally {
    setCsrfToken(null);
  }
}

export async function me(): Promise<{ user: AdminUser; csrf_token: string } | null> {
  try {
    const data = await apiFetch<{ ok: true; user: AdminUser; csrf_token: string }>('/auth/me');
    setCsrfToken(data.csrf_token);
    return { user: data.user, csrf_token: data.csrf_token };
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) {
      setCsrfToken(null);
      return null;
    }
    throw e;
  }
}

export async function fetchCsrf(): Promise<string> {
  const data = await apiFetch<{ ok: true; csrf_token: string }>('/auth/csrf');
  setCsrfToken(data.csrf_token);
  return data.csrf_token;
}
