/**
 * Cliente HTTP minimo para la API del panel admin.
 *
 * - baseURL: /api (mismo origen por defecto)
 * - credentials: include (envia y recibe cookies de sesion)
 * - Manejo centralizado de 401 (sesion expirada) y CSRF
 */

export interface ApiError {
  ok: false;
  error: string;
  reset_in?: number;
  [key: string]: unknown;
}

export interface ApiOk<T> {
  ok: true;
  data: T;
  [key: string]: unknown;
}

let csrfToken: string | null = null;
type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

export function getCsrfToken(): string | null {
  return csrfToken;
}

export function setOnUnauthorized(handler: UnauthorizedHandler | null): void {
  onUnauthorized = handler;
}

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  withCsrf?: boolean;
  signal?: AbortSignal;
}

const BASE_URL = './api';

export async function apiFetch<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const method = opts.method ?? 'GET';
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (opts.withCsrf && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    credentials: 'include',
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });

  if (res.status === 401 && onUnauthorized) {
    onUnauthorized();
  }

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload: unknown = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err = (isJson ? (payload as ApiError) : { ok: false, error: String(payload) });
    const error = new Error(err.error || `Error ${res.status}`);
    (error as Error & { status?: number; payload?: unknown }).status = res.status;
    (error as Error & { status?: number; payload?: unknown }).payload = err;
    throw error;
  }

  return payload as T;
}
