import { ValidationRule } from '../../types';

import baseRules from './base.json';
import hospitalRules from './hospital.json';
import postaRules from './posta.json';
import samuRules from './samu.json';

export interface RuleDictionary {
    [key: string]: { validaciones: Record<string, ValidationRule[]> };
}

export const ruleSets: RuleDictionary = {
    BASE: baseRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    HOSPITAL: hospitalRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    POSTA: postaRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    MOVIL: samuRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    SAMU: samuRules as unknown as { validaciones: Record<string, ValidationRule[]> },
};

export default ruleSets;
