import { Establishment } from '../domain/establishments.types';

/**
 * Matches a 6-digit establishment code against a provided catalog.
 * Returns the matching Establishment object or undefined if not found.
 * Use this to validate if an extracted code exists in the official registry.
 */
export function matchEstablishment(code6: string, catalog: Establishment[]): Establishment | undefined {
    return catalog.find((est) => est.code6 === code6);
}
