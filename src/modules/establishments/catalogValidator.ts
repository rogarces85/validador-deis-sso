/**
 * catalogValidator.ts
 * Validates the establishments catalog JSON for structural integrity
 * and cross-references with validation rules.
 */

import {
    Establishment,
    EstablishmentCatalog,
    EstablishmentType,
    VALID_ESTABLISHMENT_TYPES,
} from '../../../types';

export interface CatalogValidationError {
    field: string;
    code?: string;
    message: string;
    severity: 'ERROR' | 'WARNING';
}

/**
 * Normaliza un código a 6 dígitos con zero-padding izquierdo.
 */
export function normalizeCode(raw: string): string {
    const cleaned = raw.trim().replace(/\D/g, '');
    return cleaned.padStart(6, '0');
}

/**
 * Valida un establecimiento individual.
 */
function validateEstablishment(
    est: Establishment,
    index: number
): CatalogValidationError[] {
    const errors: CatalogValidationError[] = [];
    const prefix = `establecimientos[${index}]`;

    // Código: exactamente 6 dígitos
    if (!/^\d{6}$/.test(est.codigo)) {
        errors.push({
            field: `${prefix}.codigo`,
            code: est.codigo,
            message: `Código "${est.codigo}" no tiene exactamente 6 dígitos numéricos`,
            severity: 'ERROR',
        });
    }

    // Nombre: no vacío
    if (!est.nombre || est.nombre.trim().length === 0) {
        errors.push({
            field: `${prefix}.nombre`,
            code: est.codigo,
            message: `Nombre vacío para código "${est.codigo}"`,
            severity: 'ERROR',
        });
    }

    // Tipo: pertenece al enum
    if (!VALID_ESTABLISHMENT_TYPES.includes(est.tipo as EstablishmentType)) {
        errors.push({
            field: `${prefix}.tipo`,
            code: est.codigo,
            message: `Tipo "${est.tipo}" no es válido. Tipos permitidos: ${VALID_ESTABLISHMENT_TYPES.join(', ')}`,
            severity: 'ERROR',
        });
    }

    // Comuna: 5 dígitos
    if (!/^\d{5}$/.test(est.comuna)) {
        errors.push({
            field: `${prefix}.comuna`,
            code: est.codigo,
            message: `Comuna "${est.comuna}" no tiene exactamente 5 dígitos`,
            severity: 'ERROR',
        });
    }

    // Activo: debe ser booleano
    if (typeof est.activo !== 'boolean') {
        errors.push({
            field: `${prefix}.activo`,
            code: est.codigo,
            message: `Campo "activo" debe ser booleano para código "${est.codigo}"`,
            severity: 'ERROR',
        });
    }

    return errors;
}

/**
 * Valida el catálogo completo incluyendo consistencia interna.
 */
export function validateCatalog(
    catalog: EstablishmentCatalog
): CatalogValidationError[] {
    const errors: CatalogValidationError[] = [];

    // Metadata
    if (!catalog.version) {
        errors.push({ field: 'version', message: 'Versión del catálogo es requerida', severity: 'ERROR' });
    }
    if (!catalog.generadoEl) {
        errors.push({ field: 'generadoEl', message: 'Fecha de generación es requerida', severity: 'ERROR' });
    }
    if (!catalog.servicioDeSalud) {
        errors.push({ field: 'servicioDeSalud', message: 'Servicio de salud es requerido', severity: 'ERROR' });
    }

    // Total coherencia
    if (catalog.totalEstablecimientos !== catalog.establecimientos.length) {
        errors.push({
            field: 'totalEstablecimientos',
            message: `totalEstablecimientos (${catalog.totalEstablecimientos}) no coincide con la cantidad real (${catalog.establecimientos.length})`,
            severity: 'ERROR',
        });
    }

    // Validar cada establecimiento
    catalog.establecimientos.forEach((est, idx) => {
        errors.push(...validateEstablishment(est, idx));
    });

    // Duplicados
    const codes = catalog.establecimientos.map((e) => e.codigo);
    const seen = new Set<string>();
    codes.forEach((code, idx) => {
        if (seen.has(code)) {
            errors.push({
                field: `establecimientos[${idx}].codigo`,
                code,
                message: `Código duplicado: "${code}"`,
                severity: 'ERROR',
            });
        }
        seen.add(code);
    });

    return errors;
}

/**
 * Interfaz para una regla con referencia a establecimientos.
 */
interface RuleWithEstablishments {
    id: string;
    rem_sheet: string;
    aplicar_a?: string[];
    establecimientos_excluidos?: string[];
}

/**
 * Validación cruzada: verifica que los códigos referenciados en las reglas
 * existan en el catálogo de establecimientos.
 */
export function validateRuleReferences(
    catalog: EstablishmentCatalog,
    rules: Record<string, RuleWithEstablishments[]>
): CatalogValidationError[] {
    const errors: CatalogValidationError[] = [];
    const catalogCodes = new Set(catalog.establecimientos.map((e) => e.codigo));

    for (const [serie, serieRules] of Object.entries(rules)) {
        for (const rule of serieRules) {
            // Verificar aplicar_a
            if (rule.aplicar_a) {
                for (const code of rule.aplicar_a) {
                    const normalized = normalizeCode(code);
                    if (!catalogCodes.has(normalized) && !catalogCodes.has(code)) {
                        errors.push({
                            field: `rules.${serie}.${rule.id}.aplicar_a`,
                            code,
                            message: `Regla ${rule.id} (${serie}) referencia código "${code}" en aplicar_a que no existe en el catálogo`,
                            severity: 'WARNING',
                        });
                    }
                }
            }

            // Verificar establecimientos_excluidos
            if (rule.establecimientos_excluidos) {
                for (const code of rule.establecimientos_excluidos) {
                    const normalized = normalizeCode(code);
                    if (!catalogCodes.has(normalized) && !catalogCodes.has(code)) {
                        errors.push({
                            field: `rules.${serie}.${rule.id}.establecimientos_excluidos`,
                            code,
                            message: `Regla ${rule.id} (${serie}) referencia código "${code}" en establecimientos_excluidos que no existe en el catálogo`,
                            severity: 'WARNING',
                        });
                    }
                }
            }
        }
    }

    return errors;
}
