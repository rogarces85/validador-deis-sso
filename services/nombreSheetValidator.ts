
import { ExcelReaderService } from './excelService';
import { ValidationResult, Severity, EstablishmentCatalog } from '../types';
import catalogData from '../data/establishments.catalog.json';

const catalog = catalogData as unknown as EstablishmentCatalog;

// Build lookup sets once at module level
const establishmentCodes = new Set(catalog.establecimientos.map(e => e.codigo));
const communeCodes = new Set(catalog.establecimientos.map(e => e.comuna));

// Valid months: "01" to "12"
const VALID_MONTHS = new Set(
    Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
);

// Accepted file versions
const ACCEPTED_VERSIONS = [
    'Versión 1.2: Febrero 2026',
    'Versión 1.1: Febrero 2026'
];

function generateUUID(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

export interface NombreValidationOutput {
    results: ValidationResult[];
    versionError: string | null;
}

export class NombreSheetValidator {
    private excel = ExcelReaderService.getInstance();
    private readonly SHEET = 'NOMBRE';

    /**
     * Read a cell from the NOMBRE sheet, returning its string value trimmed.
     * Returns empty string if cell is null/undefined/empty.
     */
    private getCellString(cell: string): string {
        const val = this.excel.getCellValue(this.SHEET, cell);
        if (val === null || val === undefined) return '';
        return String(val).trim();
    }

    /**
     * Run all NOMBRE sheet validations.
     */
    public validate(): NombreValidationOutput {
        const results: ValidationResult[] = [];
        let versionError: string | null = null;

        // ─── 1. VERSION CHECK (A9) — Highest priority ───
        const versionVal = this.getCellString('A9');
        if (!ACCEPTED_VERSIONS.includes(versionVal)) {
            versionError = versionVal
                ? `Versión de archivo no válida: "${versionVal}". Se acepta: ${ACCEPTED_VERSIONS.map(v => `"${v}"`).join(' o ')}`
                : `La celda A9 no contiene la versión del archivo. Se acepta: ${ACCEPTED_VERSIONS.map(v => `"${v}"`).join(' o ')}`;

            results.push(this.makeResult(
                'VAL_NOM01', Severity.ERROR,
                `NOMBRE, ERROR: ${versionError}`,
                versionVal || '(vacío)', ACCEPTED_VERSIONS.join(' | '), 'A9'
            ));
        }

        // ─── 2. COMMUNE NAME (B2) ───
        const communeName = this.getCellString('B2');
        if (!communeName) {
            results.push(this.makeResult(
                'VAL_NOM02', Severity.ERROR,
                'NOMBRE, ERROR: El nombre de la Comuna (celda B2) está vacío.',
                '(vacío)', 'Nombre de comuna', 'B2'
            ));
        }

        // ─── 3. COMMUNE CODE (C2,D2,E2,F2,G2) ───
        const communeCells = ['C2', 'D2', 'E2', 'F2', 'G2'];
        const communeCodeResult = this.validateConcatenatedCode(
            communeCells, communeCodes, 'comuna',
            'VAL_NOM03', 'código de comuna'
        );
        results.push(...communeCodeResult);

        // ─── 4. ESTABLISHMENT NAME (B3) ───
        const estabName = this.getCellString('B3');
        if (!estabName) {
            results.push(this.makeResult(
                'VAL_NOM04', Severity.ERROR,
                'NOMBRE, ERROR: El nombre del Establecimiento (celda B3) está vacío.',
                '(vacío)', 'Nombre de establecimiento', 'B3'
            ));
        }

        // ─── 5. ESTABLISHMENT CODE (C3,D3,E3,F3,G3,H3) ───
        const estabCells = ['C3', 'D3', 'E3', 'F3', 'G3', 'H3'];
        const estabCodeResult = this.validateConcatenatedCode(
            estabCells, establishmentCodes, 'establecimiento',
            'VAL_NOM05', 'código de establecimiento'
        );
        results.push(...estabCodeResult);

        // ─── 6. MONTH NAME (B6) ───
        const monthName = this.getCellString('B6');
        if (!monthName) {
            results.push(this.makeResult(
                'VAL_NOM06', Severity.ERROR,
                'NOMBRE, ERROR: El nombre del Mes (celda B6) está vacío.',
                '(vacío)', 'Nombre del mes', 'B6'
            ));
        }

        // ─── 7. MONTH CODE (C6,D6) ───
        const monthCells = ['C6', 'D6'];
        const monthCodeResult = this.validateMonthCode(monthCells);
        results.push(...monthCodeResult);

        // ─── 8. RESPONSIBLE NAME (B11) ───
        const responsibleName = this.getCellString('B11');
        if (!responsibleName) {
            results.push(this.makeResult(
                'VAL_NOM08', Severity.ERROR,
                'NOMBRE, ERROR: El nombre del Responsable del Establecimiento (celda B11) está vacío.',
                '(vacío)', 'Nombre del responsable', 'B11'
            ));
        }

        // ─── 9. STATISTICS CHIEF NAME (B12) ───
        const statisticsChief = this.getCellString('B12');
        if (!statisticsChief) {
            results.push(this.makeResult(
                'VAL_NOM09', Severity.ERROR,
                'NOMBRE, ERROR: El nombre del Jefe de Estadística (celda B12) está vacío.',
                '(vacío)', 'Nombre del jefe de estadística', 'B12'
            ));
        }

        return { results, versionError };
    }

    /**
     * Validate cells individually (not empty) then concatenate and lookup against a catalog set.
     * Utiliza Skill_Excel_Concatenate para purgar el valor y evitar errores de casteo matemáticos.
     */
    private validateConcatenatedCode(
        cells: string[],
        catalogSet: Set<string>,
        entityLabel: string,
        ruleIdBase: string,
        codeLabel: string
    ): ValidationResult[] {
        const results: ValidationResult[] = [];
        let hasEmpty = false;

        // Check each cell individually
        for (const cell of cells) {
            const val = this.getCellString(cell);
            if (!val) {
                hasEmpty = true;
                results.push(this.makeResult(
                    ruleIdBase, Severity.ERROR,
                    `NOMBRE, ERROR: La celda ${cell} del ${codeLabel} está vacía.`,
                    '(vacío)', `Dígito del ${codeLabel}`, cell
                ));
            }
        }

        // Skill_Excel_Concatenate: Asegura un string limpio (incluso si tienen espacios/caracteres ocultos del Excel)
        const numericCode = this.excel.concatenateToNumber(this.SHEET, cells);
        const codeString = numericCode.toString();

        // If all cells have values, verify
        if (!hasEmpty) {
            if (!catalogSet.has(codeString)) {
                results.push(this.makeResult(
                    ruleIdBase, Severity.ERROR,
                    `NOMBRE, ERROR: El ${codeLabel} resultante "${codeString}" (celdas ${cells.join('&')}) no corresponde a un ${entityLabel} válido del catálogo.`,
                    codeString, `Código de ${entityLabel} válido`, cells[0]
                ));
            }
        }

        return results;
    }

    /**
     * Validate month code cells: each not empty, concatenated value is valid month 01-12.
     * Utiliza Skill_Excel_Concatenate
     */
    private validateMonthCode(cells: string[]): ValidationResult[] {
        const results: ValidationResult[] = [];
        let hasEmpty = false;

        for (const cell of cells) {
            const val = this.getCellString(cell);
            if (!val) {
                hasEmpty = true;
                results.push(this.makeResult(
                    'VAL_NOM07', Severity.ERROR,
                    `NOMBRE, ERROR: La celda ${cell} del código de mes está vacía.`,
                    '(vacío)', 'Dígito del mes', cell
                ));
            }
        }

        // Skill_Excel_Concatenate: Pule y convierte a número
        const numericMonth = this.excel.concatenateToNumber(this.SHEET, cells);
        const monthCode = numericMonth.toString().padStart(2, '0'); // Asegura '01'-'12'

        if (!hasEmpty) {
            if (!VALID_MONTHS.has(monthCode)) {
                results.push(this.makeResult(
                    'VAL_NOM07', Severity.ERROR,
                    `NOMBRE, ERROR: El código de mes resultante "${monthCode}" (celdas ${cells.join('&')}) no corresponde a un mes válido (01-12).`,
                    monthCode, 'Mes válido (01-12)', cells[0]
                ));
            }
        }

        return results;
    }

    /**
     * Create a ValidationResult compatible with the existing system.
     */
    private makeResult(
        ruleId: string,
        severidad: Severity,
        mensaje: string,
        valorActual: any,
        valorEsperado: any,
        cell?: string
    ): ValidationResult {
        return {
            id: generateUUID(),
            ruleId,
            descripcion: mensaje,
            severidad,
            resultado: false,
            valorActual,
            valorEsperado,
            rem_sheet: this.SHEET,
            cell,
            mensaje,
            evidence: `Evaluado: ${JSON.stringify(valorActual)}. Esperado: ${JSON.stringify(valorEsperado)}.`
        };
    }
}
