import { apiFetch } from './client';

export type Severidad = 'ERROR' | 'REVISAR' | 'INDICADOR';
export type Operador = '==' | '!=' | '>' | '<' | '>=' | '<=';
export type TipoRegla = 'CELDA' | 'RANGO' | 'SUMA' | 'CRUCE';

export interface Regla {
  id: number;
  regla_id: string;
  serie: 'A' | 'P';
  rem_sheet: string;
  tipo: TipoRegla;
  expresion_1: string;
  operador: Operador;
  expresion_2: number | string | null;
  severidad: Severidad;
  mensaje: string;
  omitir_si_ambos_cero: boolean;
  omitir_si_v1_es_cero: boolean;
  validacion_exclusiva: boolean;
  aplicar_a_tipo: string[];
  excluir_tipo: string[];
  aplicar_a: string[];
  establecimientos_excluidos: string[];
  activo: boolean;
  actualizado_por: number | null;
  actualizado_en: string | null;
}

export type ReglaPayload = Omit<Regla, 'id' | 'actualizado_por' | 'actualizado_en'>;

export interface ReglaVersion {
  id: number;
  version_semver: string;
  total_reglas: number;
  publicado_por: number;
  publicado_en: string;
  notas: string | null;
}

export interface ListResponse<T> {
  ok: true;
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface SingleResponse<T> {
  ok: true;
  regla?: T;
  version?: T;
  semver?: string;
  total_reglas?: number;
  version_semver?: string;
  publicado_en?: string;
  payload?: { reglas: Regla[]; total_reglas: number };
  csrf_token?: string;
  user?: unknown;
}

export interface ListParams {
  serie?: 'A' | 'P';
  rem_sheet?: string;
  severidad?: Severidad;
  q?: string;
  incluir_desactivadas?: boolean;
  page?: number;
  perPage?: number;
}

export async function list(params: ListParams = {}): Promise<ListResponse<Regla>> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      search.set(k, String(v));
    }
  });
  const qs = search.toString();
  return apiFetch<ListResponse<Regla>>(`/reglas${qs ? '?' + qs : ''}`);
}

export async function get(reglaId: string): Promise<Regla> {
  const data = await apiFetch<{ ok: true; regla: Regla }>(`/reglas/${encodeURIComponent(reglaId)}`);
  return data.regla;
}

export async function create(payload: ReglaPayload): Promise<Regla> {
  const data = await apiFetch<{ ok: true; regla: Regla }>('/reglas', {
    method: 'POST',
    body: payload,
    withCsrf: true,
  });
  return data.regla;
}

export async function update(reglaId: string, payload: Partial<ReglaPayload>): Promise<Regla> {
  const data = await apiFetch<{ ok: true; regla: Regla }>(`/reglas/${encodeURIComponent(reglaId)}`, {
    method: 'PUT',
    body: payload,
    withCsrf: true,
  });
  return data.regla;
}

export async function deactivate(reglaId: string): Promise<Regla> {
  const data = await apiFetch<{ ok: true; regla: Regla }>(`/reglas/${encodeURIComponent(reglaId)}`, {
    method: 'DELETE',
    withCsrf: true,
  });
  return data.regla;
}

export async function activate(reglaId: string): Promise<Regla> {
  const data = await apiFetch<{ ok: true; regla: Regla }>(`/reglas/${encodeURIComponent(reglaId)}/activar`, {
    method: 'POST',
    withCsrf: true,
  });
  return data.regla;
}

export async function listVersiones(page = 1, perPage = 20): Promise<ListResponse<ReglaVersion>> {
  return apiFetch<ListResponse<ReglaVersion>>(`/reglas/versiones?page=${page}&perPage=${perPage}`);
}

export async function publicar(notas?: string): Promise<{ version: ReglaVersion; semver: string; total_reglas: number }> {
  const data = await apiFetch<{ ok: true; version: ReglaVersion; semver: string; total_reglas: number }>(
    '/reglas/publicar',
    { method: 'POST', body: { notas }, withCsrf: true }
  );
  return { version: data.version, semver: data.semver, total_reglas: data.total_reglas };
}

export async function actual(): Promise<{
  version_semver: string;
  total_reglas: number;
  publicado_en: string;
  payload: { reglas: Regla[]; total_reglas: number; version_semver: string; publicado_en: string };
}> {
  return apiFetch('/reglas/actual');
}
