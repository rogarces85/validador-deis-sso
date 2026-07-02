import { describe, expect, it, beforeEach, vi } from 'vitest';
import { setCsrfToken } from './client';
import { post, list, stats, type AuditEvent } from './audit';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

function mockFetchOnce(body: unknown, status = 200) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(json(body, status) as unknown as Response);
}

const sampleEvent: AuditEvent = {
  nombre_archivo: 'test.xlsm',
  codigo_establecimiento: '123010',
  serie: 'A',
  mes: '06',
  total_hallazgos: 5,
  conteo_error: 1,
  conteo_revisar: 2,
  conteo_indicador: 2,
  resultado_final: 'CON_OBSERVACIONES',
  duracion_ms: 1500,
};

describe('audit API', () => {
  beforeEach(() => {
    setCsrfToken(null);
    vi.restoreAllMocks();
  });

  it('post envia payload sin CSRF (endpoint publico)', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ ok: true, id: 42 }) as unknown as Response
    );
    const r = await post(sampleEvent);
    expect(r.id).toBe(42);
    const init = spy.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe('POST');
    const headers = init.headers as Record<string, string>;
    expect(headers['X-CSRF-Token']).toBeUndefined();
  });

  it('list serializa filtros en query string', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ ok: true, items: [], total: 0, page: 1, perPage: 50, totalPages: 0 }) as unknown as Response
    );
    await list({ serie: 'A', codigo_establecimiento: '123010', page: 2, perPage: 10 });
    const called = spy.mock.calls[0][0];
    expect(called).toContain('/audit?');
    expect(called).toContain('serie=A');
    expect(called).toContain('codigo_establecimiento=123010');
    expect(called).toContain('page=2');
  });

  it('stats devuelve agregaciones esperadas', async () => {
    mockFetchOnce({
      ok: true,
      total: 100,
      por_serie: [{ serie: 'A', total: 60 }, { serie: 'P', total: 40 }],
      por_establecimiento: [{ codigo: '123010', nombre: 'Hosp. Osorno', total: 50 }],
      tasa_aprobacion: 0.7,
    });
    const r = await stats();
    expect(r.total).toBe(100);
    expect(r.por_serie.length).toBe(2);
    expect(r.tasa_aprobacion).toBe(0.7);
  });

  it('post propaga error del backend', async () => {
    mockFetchOnce({ ok: false, error: 'lista blanca estricta: foo' }, 400);
    await expect(post({ ...sampleEvent, nombre_archivo: 'bad' })).rejects.toThrow('lista blanca');
  });
});
