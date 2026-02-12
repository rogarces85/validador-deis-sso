/**
 * Barrel export for establishments module.
 */
export { loadCatalog, findByCode, findByType, findActive, findByComuna, getAllCodes, codeExists, getCatalogSummary, resetCache } from './catalogLoader';
export { validateCatalog, validateRuleReferences, normalizeCode } from './catalogValidator';
export type { CatalogValidationError } from './catalogValidator';
