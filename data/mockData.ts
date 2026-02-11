import { Severity } from '../types';

export interface MockFinding {
    id: string;
    ruleId: string;
    severity: Severity;
    sheet: string;
    cell: string;
    description: string;
    message: string;
    actualValue: any;
    expectedValue: any;
    passed: boolean;
    evidence?: string;
}

export interface MockWorkbookMeta {
    fileName: string;
    establishment: string;
    establishmentCode: string;
    establishmentType: string;
    series: string;
    month: string;
    year: number;
    uploadedAt: string;
    sheetsProcessed: string[];
    totalCells: number;
    totalRulesApplied: number;
}

export const mockWorkbookMeta: MockWorkbookMeta = {
    fileName: '123300_REM_A_ENERO_2026.xlsx',
    establishment: 'Centro de Salud Familiar Dr. Pedro Jauregui',
    establishmentCode: '123300',
    establishmentType: 'CESFAM',
    series: 'A',
    month: 'ENERO',
    year: 2026,
    uploadedAt: new Date().toISOString(),
    sheetsProcessed: ['A01', 'A02', 'A03', 'A05', 'A08', 'A30'],
    totalCells: 14520,
    totalRulesApplied: 42,
};

export const mockFindings: MockFinding[] = [
    {
        id: 'F001',
        ruleId: 'VAL01',
        severity: Severity.REVISAR,
        sheet: 'A01',
        cell: 'F11',
        description: 'Control Preconcepcional en edades extremas',
        message: 'Celda F11 debe ser 0 para menores de 10-14 años. Se encontró un valor positivo.',
        actualValue: 3,
        expectedValue: 0,
        passed: false,
        evidence: 'La celda F11 en hoja A01 contiene el valor 3, correspondiente a controles preconcepcionales registrados en el rango etario 10-14 años. Según norma técnica, este grupo no debiera presentar registros.',
    },
    {
        id: 'F002',
        ruleId: 'VAL01',
        severity: Severity.REVISAR,
        sheet: 'A01',
        cell: 'F12',
        description: 'Control Preconcepcional en edades extremas',
        message: 'Celda F12 debe ser 0 para menores de 10-14 años.',
        actualValue: 1,
        expectedValue: 0,
        passed: false,
        evidence: 'La celda F12 de hoja A01 registra 1 control preconcepcional en el grupo etario 10-14 años.',
    },
    {
        id: 'F003',
        ruleId: 'VAL06',
        severity: Severity.ERROR,
        sheet: 'A01',
        cell: 'C89 (cruce A05)',
        description: 'Puérpera + RN debe igualar Ingresos RN Total',
        message: 'Puérpera + RN (A01) debe ser igual a Ingresos RN Total (A05!C89). Diferencia detectada.',
        actualValue: 28,
        expectedValue: 32,
        passed: false,
        evidence: 'En hoja A01 la suma de puérperas + RN es 28 (C19:C26 + F36:F38), mientras que en hoja A05 celda C89 (Ingresos RN Total) es 32. Diferencia de 4 registros.',
    },
    {
        id: 'F004',
        ruleId: 'VAL07',
        severity: Severity.ERROR,
        sheet: 'A01',
        cell: 'C74',
        description: 'Control Adolescente vs Ciclo Vital 10-14',
        message: 'Control Adolescente (C74) debe ser <= Ciclo Vital 10-14 años (T36-T38).',
        actualValue: 45,
        expectedValue: '<=38',
        passed: false,
        evidence: 'Control Adolescente en C74 = 45 excede la suma del Ciclo Vital 10-14 (T36:T38 = 38). Superávit de 7 controles.',
    },
    {
        id: 'F005',
        ruleId: 'VAL04',
        severity: Severity.ERROR,
        sheet: 'A02',
        cell: 'B11 / B21',
        description: 'EMP Profesional vs EMP Estado Nutricional',
        message: 'Total EMP Profesional debe ser igual a Total EMP Estado Nutricional.',
        actualValue: '120 / 115',
        expectedValue: 'B11 == B21',
        passed: false,
        evidence: 'B11 (EMP Profesional Total) = 120, B21 (EMP Estado Nutricional Total) = 115. Diferencia de 5.',
    },
    {
        id: 'F006',
        ruleId: 'VAL09',
        severity: Severity.ERROR,
        sheet: 'A03',
        cell: 'C20',
        description: 'Total Psicomotor vs Detalle desglosado',
        message: 'Total Psicomotor (C20) debe ser igual al detalle (C21:C36).',
        actualValue: 88,
        expectedValue: 92,
        passed: false,
        evidence: 'Celda C20 (Total Psicomotor) = 88, pero la suma del desglose C21:C36 = 92. Diferencia de 4 registros. Posible omisión en el total.',
    },
    {
        id: 'F007',
        ruleId: 'VAL45',
        severity: Severity.ERROR,
        sheet: 'A08',
        cell: 'E178:E183',
        description: 'Traslados Secundarios sin registro',
        message: 'Traslados Secundarios deben registrarse si el centro tiene ambulancia.',
        actualValue: 0,
        expectedValue: '>0',
        passed: false,
        evidence: 'La sumatoria de E178:E183 es 0. Este establecimiento posee ambulancia y debería tener registros de traslados secundarios.',
    },
    {
        id: 'F008',
        ruleId: 'VAL66',
        severity: Severity.OBSERVAR,
        sheet: 'A30',
        cell: 'B11:Z99',
        description: 'REM30R: Verificación de registros',
        message: 'REM30R: No debe existir registro en este REM para este tipo de establecimiento.',
        actualValue: 0,
        expectedValue: 0,
        passed: true,
        evidence: 'Validación exitosa. La hoja A30 no contiene registros, lo cual es correcto para este tipo de establecimiento.',
    },
    {
        id: 'F009',
        ruleId: 'VAL04-B',
        severity: Severity.INDICADOR,
        sheet: 'A02',
        cell: 'B30',
        description: 'Indicador de cobertura EMP',
        message: 'La cobertura de EMP es del 78%, bajo el umbral esperado del 85%.',
        actualValue: '78%',
        expectedValue: '>=85%',
        passed: false,
        evidence: 'El porcentaje de cobertura de Examen de Medicina Preventiva sobre la población inscrita validada es del 78% (120/154). El umbral mínimo esperado por la meta sanitaria es de 85%.',
    },
    {
        id: 'F010',
        ruleId: 'VAL02',
        severity: Severity.REVISAR,
        sheet: 'A01',
        cell: 'C50',
        description: 'Control de salud infantil inconsistente',
        message: 'El control de salud infantil total no coincide con la suma de sus desgloses por grupo etario.',
        actualValue: 210,
        expectedValue: 215,
        passed: false,
        evidence: 'El total en C50 es 210, pero la suma de los grupos etarios (C51:C58) es 215. Diferencia de 5 controles.',
    },
    {
        id: 'F011',
        ruleId: 'VAL03',
        severity: Severity.OBSERVAR,
        sheet: 'A01',
        cell: 'D60',
        description: 'Control cardiovascular registrado correctamente',
        message: 'Los controles cardiovasculares cumplen con la regla de consistencia.',
        actualValue: 150,
        expectedValue: 150,
        passed: true,
    },
    {
        id: 'F012',
        ruleId: 'VAL10',
        severity: Severity.INDICADOR,
        sheet: 'A03',
        cell: 'F45',
        description: 'Tasa de rezago psicomotor',
        message: 'La tasa de rezago está dentro de parámetros normales.',
        actualValue: '4.2%',
        expectedValue: '<=8%',
        passed: true,
    },
];

// Severity summary helper
export const getSeveritySummary = (findings: MockFinding[]) => {
    const total = findings.length;
    const byStatus = {
        passed: findings.filter(f => f.passed).length,
        failed: findings.filter(f => !f.passed).length,
    };
    const bySeverity = {
        [Severity.ERROR]: findings.filter(f => f.severity === Severity.ERROR).length,
        [Severity.REVISAR]: findings.filter(f => f.severity === Severity.REVISAR).length,
        [Severity.OBSERVAR]: findings.filter(f => f.severity === Severity.OBSERVAR).length,
        [Severity.INDICADOR]: findings.filter(f => f.severity === Severity.INDICADOR).length,
    };
    const sheets = [...new Set(findings.map(f => f.sheet))];
    return { total, byStatus, bySeverity, sheets };
};
