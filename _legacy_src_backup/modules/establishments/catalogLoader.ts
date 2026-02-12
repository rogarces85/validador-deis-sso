/**
 * catalogLoader.ts
 * Loads and provides access to the establishments catalog.
 * Uses static JSON import for Vite bundling.
 */

import catalogData from '../../../data/establishments.catalog.json';
import {
    Establishment,
    EstablishmentCatalog,
    EstablishmentType,
} from '../../../types';
import { normalizeCode } from './catalogValidator';

// Cache del catálogo tipado
let _catalog: EstablishmentCatalog | null = null;

// Índice por código para búsquedas O(1)
let _codeIndex: Map<string, Establishment> | null = null;

/**
 * Carga y retorna el catálogo tipado.
 */
export function loadCatalog(): EstablishmentCatalog {
    if (!_catalog) {
        _catalog = catalogData as EstablishmentCatalog;
    }
    return _catalog;
}

/**
 * Construye el índice por código si no existe.
 */
function ensureIndex(): Map<string, Establishment> {
    if (!_codeIndex) {
        const catalog = loadCatalog();
        _codeIndex = new Map();
        for (const est of catalog.establecimientos) {
            _codeIndex.set(est.codigo, est);
        }
    }
    return _codeIndex;
}

/**
 * Busca un establecimiento por su código (6 dígitos).
 * Normaliza el código de entrada antes de buscar.
 */
export function findByCode(code: string): Establishment | undefined {
    const idx = ensureIndex();
    const normalized = normalizeCode(code);
    return idx.get(normalized) ?? idx.get(code);
}

/**
 * Retorna todos los establecimientos de un tipo dado.
 */
export function findByType(type: EstablishmentType): Establishment[] {
    const catalog = loadCatalog();
    return catalog.establecimientos.filter((e) => e.tipo === type);
}

/**
 * Retorna todos los establecimientos activos.
 */
export function findActive(): Establishment[] {
    const catalog = loadCatalog();
    return catalog.establecimientos.filter((e) => e.activo);
}

/**
 * Retorna todos los establecimientos de una comuna.
 */
export function findByComuna(comuna: string): Establishment[] {
    const catalog = loadCatalog();
    return catalog.establecimientos.filter((e) => e.comuna === comuna);
}

/**
 * Retorna todos los códigos del catálogo como Set (útil para validación).
 */
export function getAllCodes(): Set<string> {
    const catalog = loadCatalog();
    return new Set(catalog.establecimientos.map((e) => e.codigo));
}

/**
 * Verifica si un código existe en el catálogo.
 */
export function codeExists(code: string): boolean {
    return findByCode(code) !== undefined;
}

/**
 * Resumen estadístico del catálogo por tipo.
 */
export function getCatalogSummary(): Record<string, number> {
    const catalog = loadCatalog();
    const summary: Record<string, number> = {};
    for (const est of catalog.establecimientos) {
        summary[est.tipo] = (summary[est.tipo] || 0) + 1;
    }
    return summary;
}

/**
 * Resetea el cache (útil para tests).
 */
export function resetCache(): void {
    _catalog = null;
    _codeIndex = null;
}
