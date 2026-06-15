import { ValidationRule } from '../../types';
import reglasFinales from '../reglas_finales.json';

export interface RuleDictionary {
    [key: string]: { validaciones: Record<string, ValidationRule[]> };
}

const universalRules = { validaciones: reglasFinales as any };

export const ruleSets: RuleDictionary = {
    BASE: universalRules,
    HOSPITAL: { validaciones: {} as any },
    POSTA: { validaciones: {} as any },
    CESFAM: { validaciones: {} as any },
    CECOSF: { validaciones: {} as any },
    SAPU: { validaciones: {} as any },
    SUR: { validaciones: {} as any },
    MOVIL: { validaciones: {} as any },
    SAMU: { validaciones: {} as any },
    OTROS: { validaciones: {} as any },
};

export default ruleSets;
