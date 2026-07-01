import { describe, expect, it, beforeEach, vi } from 'vitest';
import { setCsrfToken } from './client';
import { list, get, create, update, deactivate, activate, publicar, actual, listVersiones } from './reglas';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

function mockFetchOnce(body: unknown, status = 200) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(json(body, status) as unknown as Response);
}

describe('reglas API', () => {
  beforeEach(() => {
    setCsrfToken(null);
    vi.restoreAllMocks();
  });

  it('list serializa filtros en query string', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ ok: true, items: [], total: 0, page: 1, perPage: 20, totalPages: 0 }) as unknown as Response
    );
    await list({ serie: 'A', severidad: 'ERROR', page: 2, perPage: 10 });
    const called = spy.mock.calls[0][0];
    expect(called).toContain('/reglas?');
    expect(called).toContain('serie=A');
    expect(called).toContain('severidad=ERROR');
    expect(called).toContain('page=2');
    expect(called).toContain('perPage=10');
  });

  it('get envia regla_id encoded', async () => {
    mockFetchOnce({ ok: true, regla: { id: 1, regla_id: 'A 01/VAL 1' } });
    const r = await get('A 01/VAL 1');
    expect(r.regla_id).toBe('A 01/VAL 1');
  });

  it('create envia payload con CSRF', async () => {
    setCsrfToken('csrf-xyz');
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ ok: true, regla: { id: 1, regla_id: 'NEW-001' } }) as unknown as Response
    );
    await create({
      regla_id: 'NEW-001',
      serie: 'A',
      rem_sheet: 'A01',
      tipo: 'CELDA',
      expresion_1: 'F11',
      operador: '==',
      expresion_2: 0,
      severidad: 'REVISAR',
      mensaje: 'Test',
      omitir_si_ambos_cero: false,
      omitir_si_v1_es_cero: false,
      validacion_exclusiva: false,
      aplicar_a_tipo: [],
      excluir_tipo: [],
      aplicar_a: [],
      establecimientos_excluidos: [],
      activo: true,
    });
    const init = spy.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe('POST');
    const headers = init.headers as Record<string, string>;
    expect(headers['X-CSRF-Token']).toBe('csrf-xyz');
  });

  it('update hace PUT con CSRF', async () => {
    setCsrfToken('csrf-xyz');
    mockFetchOnce({ ok: true, regla: { id: 1, regla_id: 'A01-VAL001' } });
    await update('A01-VAL001', { mensaje: 'Editado' });
    const spy = vi.mocked(globalThis.fetch);
    expect(spy.mock.calls[0][1]?.method).toBe('PUT');
  });

  it('deactivate hace DELETE', async () => {
    setCsrfToken('csrf-xyz');
    mockFetchOnce({ ok: true, regla: { id: 1, regla_id: 'A01-VAL001', activo: false } });
    const r = await deactivate('A01-VAL001');
    expect(r.activo).toBe(false);
    expect(vi.mocked(globalThis.fetch).mock.calls[0][1]?.method).toBe('DELETE');
  });

  it('activate hace POST a /activar', async () => {
    setCsrfToken('csrf-xyz');
    mockFetchOnce({ ok: true, regla: { id: 1, regla_id: 'A01-VAL001', activo: true } });
    const r = await activate('A01-VAL001');
    expect(r.activo).toBe(true);
    const called = vi.mocked(globalThis.fetch).mock.calls[0][0];
    expect(called).toContain('/activar');
  });

  it('publicar envia notas y CSRF', async () => {
    setCsrfToken('csrf-xyz');
    mockFetchOnce({ ok: true, version: { id: 1, version_semver: '1.0.1-reglas', total_reglas: 50, publicado_por: 1, publicado_en: '2026-07-01', notas: 'Test' }, semver: '1.0.1-reglas', total_reglas: 50 });
    const r = await publicar('Test');
    expect(r.semver).toBe('1.0.1-reglas');
    expect(vi.mocked(globalThis.fetch).mock.calls[0][1]?.method).toBe('POST');
  });

  it('actual es publico y no requiere CSRF', async () => {
    mockFetchOnce({ ok: true, version_semver: '1.0.0-reglas', total_reglas: 100, publicado_en: '2026-07-01', payload: { reglas: [], total_reglas: 100, version_semver: '1.0.0-reglas', publicado_en: '2026-07-01' } });
    const r = await actual();
    expect(r.version_semver).toBe('1.0.0-reglas');
  });

  it('listVersiones pagina por defecto', async () => {
    mockFetchOnce({ ok: true, items: [], total: 0, page: 1, perPage: 20, totalPages: 0 });
    await listVersiones();
    const called = vi.mocked(globalThis.fetch).mock.calls[0][0];
    expect(called).toContain('page=1');
    expect(called).toContain('perPage=20');
  });
});
