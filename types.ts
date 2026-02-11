
export enum Severity {
  ERROR = 'ERROR',
  REVISAR = 'REVISAR',
  OBSERVAR = 'OBSERVAR',
  INDICADOR = 'INDICADOR'
}

export interface Establishment {
  codigo: string;
  nombre: string;
  tipo: string;
  comuna?: string;
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
  ruleId: string;
  descripcion: string;
  severidad: Severity;
  resultado: boolean;
  valorActual: any;
  valorEsperado: any;
  mensaje?: string;
  rem_sheet?: string;
}

export interface FileMetadata {
  codigoEstablecimiento: string;
  serieRem: string;
  mes: string;
  extension: string;
  nombreOriginal: string;
}

export interface AppState {
  file: File | null;
  metadata: FileMetadata | null;
  establishment: Establishment | null;
  results: ValidationResult[];
  isValidating: boolean;
  error: string | null;
}
