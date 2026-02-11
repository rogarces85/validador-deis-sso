import { describe, it, expect, beforeEach } from 'vitest';
import {
    validateCatalog,
    validateRuleReferences,
    normalizeCode,
} from '../catalogValidator';
import { EstablishmentCatalog, Establishment, EstablishmentType } from '../../../../types';

// ─── Helper ─────────────────────────────────────────────

function makeValidEstablishment(overrides: Partial<Establishment> = {}): Establishment {
    return {
        codigo: '123100',
        nombre: 'Hospital Base San José de Osorno',
        tipo: 'HOSPITAL' as EstablishmentType,
        comuna: '10301',
        activo: true,
        ...overrides,
    };
}

function makeValidCatalog(establishments: Establishment[] = [makeValidEstablishment()]): EstablishmentCatalog {
    return {
        version: '2026.1.0',
        generadoEl: '2026-02-11T00:00:00Z',
        servicioDeSalud: 'Servicio de Salud Osorno',
        totalEstablecimientos: establishments.length,
        establecimientos: establishments,
    };
}

// ─── Tests: normalizeCode ───────────────────────────────

describe('normalizeCode', () => {
    it('pads short codes to 6 digits', () => {
        expect(normalizeCode('12300')).toBe('012300');
        expect(normalizeCode('1')).toBe('000001');
        expect(normalizeCode('999')).toBe('000999');
    });

    it('keeps 6-digit codes unchanged', () => {
        expect(normalizeCode('123100')).toBe('123100');
        expect(normalizeCode('200085')).toBe('200085');
    });

    it('strips non-numeric characters', () => {
        expect(normalizeCode('  123100  ')).toBe('123100');
        expect(normalizeCode('12-31-00')).toBe('123100');
    });
});

// ─── Tests: validateCatalog ─────────────────────────────

describe('validateCatalog', () => {
    it('returns no errors for a valid catalog', () => {
        const catalog = makeValidCatalog();
        const errors = validateCatalog(catalog);
        expect(errors).toHaveLength(0);
    });

    it('detects missing version', () => {
        const catalog = makeValidCatalog();
        catalog.version = '';
        const errors = validateCatalog(catalog);
        expect(errors.some((e) => e.field === 'version')).toBe(true);
    });

    it('detects code with wrong length', () => {
        const catalog = makeValidCatalog([
            makeValidEstablishment({ codigo: '12345' }), // 5 dígitos
        ]);
        const errors = validateCatalog(catalog);
        expect(errors.some((e) => e.message.includes('6 dígitos'))).toBe(true);
    });

    it('detects code with 7 digits', () => {
        const catalog = makeValidCatalog([
            makeValidEstablishment({ codigo: '1234567' }),
        ]);
        const errors = validateCatalog(catalog);
        expect(errors.some((e) => e.message.includes('6 dígitos'))).toBe(true);
    });

    it('detects duplicate codes', () => {
        const catalog = makeValidCatalog([
            makeValidEstablishment({ codigo: '123100' }),
            makeValidEstablishment({ codigo: '123100', nombre: 'Duplicado' }),
        ]);
        catalog.totalEstablecimientos = 2;
        const errors = validateCatalog(catalog);
        expect(errors.some((e) => e.message.includes('duplicado'))).toBe(true);
    });

    it('detects invalid establishment type', () => {
        const catalog = makeValidCatalog([
            makeValidEstablishment({ tipo: 'INVALIDO' as EstablishmentType }),
        ]);
        const errors = validateCatalog(catalog);
        expect(errors.some((e) => e.message.includes('no es válido'))).toBe(true);
    });

    it('detects empty name', () => {
        const catalog = makeValidCatalog([
            makeValidEstablishment({ nombre: '' }),
        ]);
        const errors = validateCatalog(catalog);
        expect(errors.some((e) => e.message.includes('Nombre vacío'))).toBe(true);
    });

    it('detects invalid comuna format', () => {
        const catalog = makeValidCatalog([
            makeValidEstablishment({ comuna: '1030' }), // 4 dígitos
        ]);
        const errors = validateCatalog(catalog);
        expect(errors.some((e) => e.message.includes('5 dígitos'))).toBe(true);
    });

    it('detects totalEstablecimientos mismatch', () => {
        const catalog = makeValidCatalog();
        catalog.totalEstablecimientos = 99;
        const errors = validateCatalog(catalog);
        expect(errors.some((e) => e.message.includes('no coincide'))).toBe(true);
    });
});

// ─── Tests: validateRuleReferences ──────────────────────

describe('validateRuleReferences', () => {
    it('returns no errors when all referenced codes exist', () => {
        const catalog = makeValidCatalog([
            makeValidEstablishment({ codigo: '123100' }),
            makeValidEstablishment({ codigo: '123010', nombre: 'SAMU' }),
        ]);
        const rules = {
            A01: [{ id: 'VAL01', rem_sheet: 'A01', aplicar_a: ['123100'] }],
            A08: [{ id: 'VAL45', rem_sheet: 'A08', establecimientos_excluidos: ['123010'] }],
        };

        const errors = validateRuleReferences(catalog, rules);
        expect(errors).toHaveLength(0);
    });

    it('detects missing aplicar_a code', () => {
        const catalog = makeValidCatalog([
            makeValidEstablishment({ codigo: '123100' }),
        ]);
        const rules = {
            A02: [{ id: 'VAL06', rem_sheet: 'A02', aplicar_a: ['999999'] }],
        };

        const errors = validateRuleReferences(catalog, rules);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].message).toContain('999999');
        expect(errors[0].message).toContain('aplicar_a');
    });

    it('detects missing establecimientos_excluidos code', () => {
        const catalog = makeValidCatalog([
            makeValidEstablishment({ codigo: '123100' }),
        ]);
        const rules = {
            A08: [{ id: 'VAL45', rem_sheet: 'A08', establecimientos_excluidos: ['888888'] }],
        };

        const errors = validateRuleReferences(catalog, rules);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].message).toContain('888888');
    });

    it('handles rules without establishment references', () => {
        const catalog = makeValidCatalog();
        const rules = {
            A01: [{ id: 'VAL01', rem_sheet: 'A01' }],
        };

        const errors = validateRuleReferences(catalog, rules);
        expect(errors).toHaveLength(0);
    });
});

// ─── Tests: Catalog real (JSON file) ────────────────────

describe('Real catalog validation', () => {
    it('should validate the actual establishments.catalog.json without errors', async () => {
        const catalogJson = (await import('../../../../data/establishments.catalog.json')).default;
        const errors = validateCatalog(catalogJson as EstablishmentCatalog);
        expect(errors).toHaveLength(0);
    });

    it('actual catalog should have 73 establishments', async () => {
        const catalogJson = (await import('../../../../data/establishments.catalog.json')).default;
        expect(catalogJson.establecimientos).toHaveLength(73);
        expect(catalogJson.totalEstablecimientos).toBe(73);
    });
});
