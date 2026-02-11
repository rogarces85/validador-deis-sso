export interface Establishment {
    code6: string;
    name: string;
    type: string;
    hasAmbulance?: boolean;
    comuna?: string;
}

export interface ParsedFilename {
    codEstab: string;
    serie: string;
    mes: string;
    ext: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    parsed?: ParsedFilename;
}
