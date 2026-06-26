export const RECOGNIZED_SERIES = ['A', 'P', 'D', 'BM', 'BS'] as const;
export const ENABLED_SERIES = ['A', 'P'] as const;
export const SERIE_A_MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
export const SERIE_P_MONTHS = ['06', '12'] as const;
export const SERIE_P_REQUIRED_SHEETS = [
    'NOMBRE',
    'P1',
    'P2',
    'P3',
    'P4',
    'P5',
    'P6',
    'P7',
    'P9',
    'P11',
    'P12',
    'P13',
] as const;

export type RecognizedSerie = typeof RECOGNIZED_SERIES[number];
export type EnabledSerie = typeof ENABLED_SERIES[number];

const MONTHS_BY_SERIE: Record<EnabledSerie, readonly string[]> = {
    A: SERIE_A_MONTHS,
    P: SERIE_P_MONTHS,
};

export function isEnabledSerie(serie: string): serie is EnabledSerie {
    return (ENABLED_SERIES as readonly string[]).includes(serie.toUpperCase());
}

export function getAllowedMonthsForSerie(serie: string): readonly string[] {
    const serieUpper = serie.toUpperCase();
    return isEnabledSerie(serieUpper) ? MONTHS_BY_SERIE[serieUpper] : [];
}

export function getMonthExpectationLabel(serie: string): string {
    const allowedMonths = getAllowedMonthsForSerie(serie);
    return allowedMonths.length ? allowedMonths.join(' o ') : 'serie habilitada';
}

export function isMonthAllowedForSerie(serie: string, month: string): boolean {
    return getAllowedMonthsForSerie(serie).includes(month);
}

export function getMissingRequiredSheetsForSerie(serie: string, sheets: string[]): string[] {
    if (serie.toUpperCase() !== 'P') return [];

    const sheetSet = new Set(sheets);
    return SERIE_P_REQUIRED_SHEETS.filter(sheet => !sheetSet.has(sheet));
}
