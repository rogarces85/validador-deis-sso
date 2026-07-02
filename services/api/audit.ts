import { apiFetch } from './client';

export type ResultadoFinal = 'APROBADO' | 'CON_OBSERVACIONES' | 'RECHAZADO' | 'ERROR';

export interface AuditEvent {
  id?: number;
  timestamp?: string;
  nombre_archivo: string;
  codigo_establecimiento: string;
  nombre_establecimiento?: string;
  comuna?: string;
  tipo_establecimiento?: string;
  serie: 'A' | 'P';
  mes: string;
  periodo?: string;
  total_hallazgos: number;
  conteo_error?: number;
  conteo_revisar?: number;
  conteo_indicador?: number;
  resultado_final: ResultadoFinal;
  duracion_ms?: number;
  ip_origen?: string;
  user_agent?: string;
}

export interface AuditStats {
  total: number;
  por_serie: { serie: string; total: number }[];
  por_establecimiento: { codigo: string; nombre: string; total: number }[];
  tasa_aprobacion: number;
}

export interface ListResponse<T> {
  ok: true;
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface AuditFilters {
  codigo_establecimiento?: string;
  serie?: 'A' | 'P';
  mes?: string;
  resultado_final?: ResultadoFinal;
  desde?: string;
  hasta?: string;
  page?: number;
  perPage?: number;
}

export async function post(event: AuditEvent): Promise<{ id: number }> {
  // Fire-and-forget: timeout corto, sin CSRF (endpoint publico).
  const data = await apiFetch<{ ok: true; id: number }>('/audit', {
    method: 'POST',
    body: event,
  });
  return { id: data.id };
}

export async function list(filters: AuditFilters = {}): Promise<ListResponse<AuditEvent>> {
  const search = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      search.set(k, String(v));
    }
  });
  const qs = search.toString();
  return apiFetch<ListResponse<AuditEvent>>(`/audit${qs ? '?' + qs : ''}`);
}

export async function stats(filters: AuditFilters = {}): Promise<AuditStats> {
  const search = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      search.set(k, String(v));
    }
  });
  const qs = search.toString();
  return apiFetch<AuditStats>(`/audit/estadisticas${qs ? '?' + qs : ''}`);
}
