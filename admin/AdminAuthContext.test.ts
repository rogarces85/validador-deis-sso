import { describe, expect, it, beforeEach, vi } from 'vitest';
import { setCsrfToken, getCsrfToken } from '../services/api/client';
import { login, logout, me } from '../services/api/auth';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('auth API', () => {
  beforeEach(() => {
    setCsrfToken(null);
    vi.restoreAllMocks();
  });

  it('login guarda csrf y user', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({
        ok: true,
        user: { id: 1, email: 'a@b.c', nombre: 'A', activo: true, ultimo_acceso: null },
        csrf_token: 'csrf-1',
      }) as unknown as Response
    );
    const res = await login('a@b.c', '12345678');
    expect(res.user.email).toBe('a@b.c');
    expect(getCsrfToken()).toBe('csrf-1');
  });

  it('logout limpia token incluso si la API falla', async () => {
    setCsrfToken('csrf-1');
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('boom'));
    await expect(logout()).rejects.toThrow();
    expect(getCsrfToken()).toBeNull();
  });

  it('me retorna null en 401 sin lanzar', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ ok: false, error: 'No autenticado' }, 401) as unknown as Response
    );
    const res = await me();
    expect(res).toBeNull();
  });
});
