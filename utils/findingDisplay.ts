import { Severity, ValidationResult } from '../types';

const SEVERITY_PREFIXES = new Set<string>(Object.values(Severity));

export const cleanFindingDescription = (description: string, options: { removeRem?: boolean } = {}): string => {
  const parts = description
    .split('|')
    .map(part => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return description;

  let visibleParts = parts;
  if (SEVERITY_PREFIXES.has(visibleParts[0].toUpperCase())) {
    visibleParts = visibleParts.slice(1);
  }

  if (options.removeRem && /^REM\s*\w+/i.test(visibleParts[0] || '')) {
    visibleParts = visibleParts.slice(1);
  }

  return visibleParts.length > 0 ? visibleParts.join(' | ') : description;
};

export const getReferenceLabel = (finding: ValidationResult): string => {
  if (finding.referenciaLabel) return finding.referenciaLabel;
  if (finding.valorEsperado === null || finding.valorEsperado === undefined || finding.valorEsperado === '') {
    return 'Sin referencia';
  }
  return `Referencia evaluada: ${String(finding.valorEsperado)}`;
};
