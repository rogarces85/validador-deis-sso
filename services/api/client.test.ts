import { describe, expect, it, beforeEach, vi } from 'vitest';
import { apiFetch, setCsrfToken, getCsrfToken, setOnUnauthorized } from './client';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('api client', () => {
  beforeEach(() => {
    setCsrfToken(null);
    setOnUnauthorized(null);
  });

  it('envia credenciales y lee JSON', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ ok: true, user: { id: 1, email: 'a@b.c' } }) as unknown as Response
    );
    const data = await apiFetch<{ ok: true; user: { id: number } }>('/auth/me');
    expect(data.user.id).toBe(1);
    expect(spy).toHaveBeenCalledWith(
      './api/auth/me',
      expect.objectContaining({ credentials: 'include' })
    );
  });

  it('envia X-CSRF-Token cuando withCsrf=true y hay token', async () => {
    setCsrfToken('TOKEN-XYZ');
    let captured: RequestInit | undefined;
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(
      ((_url: unknown, init?: RequestInit) => {
        captured = init;
        return Promise.resolve(json({ ok: true }) as unknown as Response);
      }) as unknown as typeof fetch
    );
    await apiFetch('/auth/logout', { method: 'POST', withCsrf: true });
    expect(captured).toBeDefined();
    const headersRecord = captured?.headers as Record<string, string> | undefined;
    expect(headersRecord?.['X-CSRF-Token']).toBe('TOKEN-XYZ');
  });

  it('lanza error con status cuando la respuesta no es ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ ok: false, error: 'Sin autorizacion' }, 401) as unknown as Response
    );
    try {
      await apiFetch('/auth/me');
      throw new Error('Debio lanzar');
    } catch (e) {
      const err = e as Error & { status?: number };
      expect(err.status).toBe(401);
      expect(err.message).toBe('Sin autorizacion');
    }
  });

  it('dispara onUnauthorized en 401', async () => {
    const handler = vi.fn();
    setOnUnauthorized(handler);
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ ok: false, error: 'x' }, 401) as unknown as Response
    );
    try {
      await apiFetch('/auth/me');
    } catch {
      // ignore
    }
    expect(handler).toHaveBeenCalled();
  });
});
