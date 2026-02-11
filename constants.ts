
import { Establishment, EstablishmentType, Severity, ValidationRule } from './types';
import catalogData from './data/establishments.catalog.json';

// ─── Establecimientos desde catálogo JSON ──────────────────

export const ESTABLECIMIENTOS: Establishment[] = catalogData.establecimientos.map((e) => ({
    ...e,
    tipo: e.tipo as EstablishmentType,
}));

// ─── Reglas de ejemplo (subset para desarrollo) ───────────

export const RAW_RULES: any = {
    "A01": [
        { "id": "VAL01", "tipo": "CELDA", "rem_sheet": "A01", "expresion_1": "F11", "operador": "==", "expresion_2": 0, "severidad": "REVISAR", "mensaje": "Control De Salud y Reproductiva, Control Preconcepcional en edades extremas de 10 a 14 años, celda F11" },
        { "id": "VAL01", "tipo": "CELDA", "rem_sheet": "A01", "expresion_1": "F12", "operador": "==", "expresion_2": 0, "severidad": "REVISAR", "mensaje": "Control De Salud y Reproductiva, Control Preconcepcional en edades extremas de 10 a 14 años, celda F12" },
        { "id": "VAL06", "tipo": "CELDA", "rem_sheet": "A01", "expresion_1": "A05!C89", "operador": "==", "expresion_2": "SUM(C19:C26, F36:F38)", "severidad": "ERROR", "mensaje": "Puérpera + RN (A01) debe ser igual a Ingresos RN Total (A05!C89)" },
        { "id": "VAL07", "tipo": "CELDA", "rem_sheet": "A01", "expresion_1": "C74", "operador": "<=", "expresion_2": "SUM(T36:T38)", "severidad": "ERROR", "mensaje": "Control Adolescente (C74) debe ser <= Ciclo Vital 10-14 años (T36-T38)" }
    ],
    "A02": [
        { "id": "VAL04", "tipo": "CELDA", "rem_sheet": "A02", "expresion_1": "B11", "operador": "==", "expresion_2": "B21", "severidad": "ERROR", "mensaje": "Total EMP Profesional debe ser igual a Total EMP Estado Nutricional" },
        { "id": "VAL06", "tipo": "CELDA", "rem_sheet": "A02", "expresion_1": "B17", "operador": "!=", "expresion_2": 0, "severidad": "ERROR", "mensaje": "EMP en B17 solo corresponde a Postas.", "aplicar_a": ["123402", "123404", "123406", "123407", "123408", "123410", "123412", "123413", "123414", "123415", "123416", "123417", "123419", "123420", "123422", "123424", "123425", "123426", "123427", "123428", "123430", "123431", "123432", "123434", "123435", "123436", "123437", "200490"] }
    ],
    "A03": [
        { "id": "VAL09", "tipo": "CELDA", "rem_sheet": "A03", "expresion_1": "C20", "operador": "==", "expresion_2": "SUM(C21:C36)", "severidad": "ERROR", "mensaje": "Total Psicomotor (C20) debe ser igual al detalle (C21:C36)" }
    ],
    "A08": [
        { "id": "VAL45", "tipo": "CELDA", "rem_sheet": "A08", "expresion_1": "SUM(E178:E183)", "operador": ">", "expresion_2": 0, "severidad": "ERROR", "mensaje": "Traslados Secundarios deben registrarse si el centro tiene ambulancia (excepto SAMU).", "establecimientos_excluidos": ["123010"] }
    ],
    "A30": [
        { "id": "VAL66", "tipo": "CELDA", "rem_sheet": "A30", "expresion_1": "SUM(B11:Z99)", "operador": "==", "expresion_2": 0, "severidad": "ERROR", "mensaje": "REM30R: No debe existir registro en este REM." }
    ]
};

export const SAMPLE_RULES: ValidationRule[] = Object.keys(RAW_RULES).flatMap(serie =>
    RAW_RULES[serie].map((r: any) => ({ ...r, serie, severidad: r.severidad as Severity }))
);

export const MONTH_NAMES = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];
