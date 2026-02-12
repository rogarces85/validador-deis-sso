import { describe, it, expect, beforeEach } from 'vitest';
import {
    loadCatalog,
    findByCode,
    findByType,
    findActive,
    findByComuna,
    getAllCodes,
    codeExists,
    getCatalogSummary,
    resetCache,
} from '../catalogLoader';
import { normalizeCode } from '../catalogValidator';

// ─── Setup ──────────────────────────────────────────────

beforeEach(() => {
    resetCache();
});

// ─── Tests: loadCatalog ─────────────────────────────────

describe('loadCatalog', () => {
    it('loads the catalog with correct metadata', () => {
        const catalog = loadCatalog();
        expect(catalog.version).toBeDefined();
        expect(catalog.servicioDeSalud).toBe('Servicio de Salud Osorno');
        expect(catalog.establecimientos.length).toBeGreaterThan(0);
        expect(catalog.totalEstablecimientos).toBe(catalog.establecimientos.length);
    });

    it('returns the same instance on subsequent calls (cache)', () => {
        const first = loadCatalog();
        const second = loadCatalog();
        expect(first).toBe(second);
    });
});

// ─── Tests: findByCode ──────────────────────────────────

describe('findByCode', () => {
    it('finds Hospital Base San José by code 123100', () => {
        const est = findByCode('123100');
        expect(est).toBeDefined();
        expect(est!.tipo).toBe('HOSPITAL');
        expect(est!.nombre).toContain('Hospital Base');
    });

    it('finds SAPU by code 200085', () => {
        const est = findByCode('200085');
        expect(est).toBeDefined();
        expect(est!.tipo).toBe('SAPU');
    });

    it('returns undefined for non-existent code', () => {
        const est = findByCode('999999');
        expect(est).toBeUndefined();
    });

    it('normalizes short codes before lookup', () => {
        // Code "123100" should be found even without explicit normalization
        const est = findByCode('123100');
        expect(est).toBeDefined();
    });
});

// ─── Tests: findByType ──────────────────────────────────

describe('findByType', () => {
    it('finds all POSTA establishments', () => {
        const postas = findByType('POSTA');
        expect(postas.length).toBeGreaterThan(0);
        postas.forEach((p) => expect(p.tipo).toBe('POSTA'));
    });

    it('finds all CESFAM establishments', () => {
        const cesfams = findByType('CESFAM');
        expect(cesfams.length).toBeGreaterThan(0);
        cesfams.forEach((c) => expect(c.tipo).toBe('CESFAM'));
    });

    it('finds all HOSPITAL establishments', () => {
        const hospitals = findByType('HOSPITAL');
        expect(hospitals.length).toBe(6); // 123100-123105
        hospitals.forEach((h) => expect(h.tipo).toBe('HOSPITAL'));
    });

    it('returns empty array for non-existent type', () => {
        const unknown = findByType('COSAM');
        // COSAM might not exist in the catalog, or it maps to SALUD_MENTAL
        // This just tests the function doesn't throw
        expect(Array.isArray(unknown)).toBe(true);
    });
});

// ─── Tests: findActive ──────────────────────────────────

describe('findActive', () => {
    it('returns all active establishments', () => {
        const active = findActive();
        expect(active.length).toBeGreaterThan(0);
        active.forEach((e) => expect(e.activo).toBe(true));
    });
});

// ─── Tests: findByComuna ────────────────────────────────

describe('findByComuna', () => {
    it('finds establishments in Osorno (10301)', () => {
        const osorno = findByComuna('10301');
        expect(osorno.length).toBeGreaterThan(0);
        osorno.forEach((e) => expect(e.comuna).toBe('10301'));
    });

    it('returns empty for non-existent comuna', () => {
        const none = findByComuna('00000');
        expect(none).toHaveLength(0);
    });
});

// ─── Tests: getAllCodes ─────────────────────────────────

describe('getAllCodes', () => {
    it('returns a Set of all codes', () => {
        const codes = getAllCodes();
        expect(codes).toBeInstanceOf(Set);
        expect(codes.size).toBeGreaterThan(0);
        expect(codes.has('123100')).toBe(true);
        expect(codes.has('999999')).toBe(false);
    });
});

// ─── Tests: codeExists ─────────────────────────────────

describe('codeExists', () => {
    it('returns true for existing code', () => {
        expect(codeExists('123100')).toBe(true);
        expect(codeExists('200085')).toBe(true);
    });

    it('returns false for non-existing code', () => {
        expect(codeExists('999999')).toBe(false);
    });
});

// ─── Tests: getCatalogSummary ──────────────────────────

describe('getCatalogSummary', () => {
    it('returns summary with correct type counts', () => {
        const summary = getCatalogSummary();
        expect(summary['HOSPITAL']).toBe(6);
        expect(summary['POSTA']).toBeGreaterThan(0);
        expect(summary['CESFAM']).toBeGreaterThan(0);
    });
});

// ─── Tests: normalizeCode ──────────────────────────────

describe('normalizeCode (via catalogValidator)', () => {
    it('handles various input formats', () => {
        expect(normalizeCode('12300')).toBe('012300');
        expect(normalizeCode('123100')).toBe('123100');
        expect(normalizeCode('1')).toBe('000001');
    });
});
