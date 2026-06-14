import { ValidationRule } from '../../types';

import baseRules from './base.json';
import hospitalRules from './hospital.json';
import postaRules from './posta.json';
import cesfamRules from './cesfam.json';
import cecosfRules from './cecosf.json';
import sapuRules from './sapu.json';
import surRules from './sur.json';
import movilRules from './movil.json';
import otrosRules from './otros.json';
import samuRules from './samu.json';

export interface RuleDictionary {
    [key: string]: { validaciones: Record<string, ValidationRule[]> };
}

export const ruleSets: RuleDictionary = {
    BASE: baseRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    HOSPITAL: hospitalRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    POSTA: postaRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    CESFAM: cesfamRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    CECOSF: cecosfRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    SAPU: sapuRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    SUR: surRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    MOVIL: movilRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    SAMU: samuRules as unknown as { validaciones: Record<string, ValidationRule[]> },
    OTROS: otrosRules as unknown as { validaciones: Record<string, ValidationRule[]> },
};

export default ruleSets;
