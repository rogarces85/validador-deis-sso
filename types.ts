
export enum Severity {
  ERROR = 'ERROR',
  REVISAR = 'REVISAR',
  OBSERVAR = 'OBSERVAR',
  INDICADOR = 'INDICADOR'
}

export type EstablishmentType =
  | 'HOSPITAL' | 'CESFAM' | 'POSTA' | 'CECOSF'
  | 'SAPU' | 'SUR' | 'COSAM' | 'SALUD_MENTAL'
  | 'DIRECCION' | 'MOVIL' | 'PRIVADA' | 'OTROS';

export const VALID_ESTABLISHMENT_TYPES: readonly EstablishmentType[] = [
  'HOSPITAL', 'CESFAM', 'POSTA', 'CECOSF',
  'SAPU', 'SUR', 'COSAM', 'SALUD_MENTAL',
  'DIRECCION', 'MOVIL', 'PRIVADA', 'OTROS'
] as const;

export interface Establishment {
  codigo: string;           // 6 dígitos, zero-padded
  nombre: string;           // Nombre oficial normalizado
  tipo: EstablishmentType;  // Tipo de establecimiento
  comuna: string;           // Código comuna 5 dígitos
  activo: boolean;          // Si reporta REM actualmente
}

export interface EstablishmentCatalog {
  version: string;
  generadoEl: string;           // ISO date
  servicioDeSalud: string;
  totalEstablecimientos: number;
  establecimientos: Establishment[];
}

export interface ValidationRule {
  id: string;
  tipo: string;
  rem_sheet: string;
  expresion_1: string;
  operador: string;
  expresion_2: any;
  severidad: Severity;
  mensaje: string;
  serie: string;
  aplicar_a?: string[];
  establecimientos_excluidos?: string[];
}

export interface ValidationResult {
  id: string; // generated
  ruleId: string;
  descripcion: string;
  severidad: Severity;
  resultado: boolean;
  valorActual: any;
  valorEsperado: any;
  mensaje?: string;
  rem_sheet?: string;
  cell?: string;
  evidence?: string;
}

export interface FileMetadata {
  codigoEstablecimiento: string;
  serieRem: string;
  mes: string;
  extension: string;
  nombreOriginal: string;
  tamano?: number;
  periodo?: string; // Año
  sheets?: string[];
}

export interface AppState {
  file: File | null;
  metadata: FileMetadata | null;
  establishment: Establishment | null;
  results: ValidationResult[];
  isValidating: boolean;
  error: string | null;
}
