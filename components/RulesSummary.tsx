import React, { useMemo } from 'react';
import { Severity, ValidationResult, FileMetadata, Establishment } from '../types';

const MONTH_NAMES: Record<string, string> = {
    '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
    '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
    '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
};

interface RulesSummaryProps {
    findings: ValidationResult[];
    meta: FileMetadata | null;
    establishment: Establishment | null;
}

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; softBg: string; borderColor: string; solidBg: string; tooltip: string; icon: React.ReactNode }> = {
    [Severity.ERROR]: {
        label: 'Errores',
        color: '#DC2626',
        softBg: 'var(--semantic-error-soft)',
        borderColor: 'var(--semantic-error-border)',
        solidBg: '#DC2626',
        tooltip: 'ERROR: Dato incorrecto o inconsistencia crítica detectada automáticamente. Requiere corrección inmediata antes de enviar el REM.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
    [Severity.REVISAR]: {
        label: 'A Revisar',
        color: '#F59E0B',
        softBg: 'var(--semantic-warning-soft)',
        borderColor: 'var(--semantic-warning-border)',
        solidBg: '#F59E0B',
        tooltip: 'REVISAR: Valor inusual o caso atípico que podría ser correcto pero necesita verificación por el profesional responsable.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        ),
    },
    [Severity.INDICADOR]: {
        label: 'Indicadores',
        color: '#2563EB',
        softBg: 'var(--semantic-info-soft)',
        borderColor: 'var(--semantic-info-border)',
        solidBg: '#2563EB',
        tooltip: 'INDICADOR: Dato informativo que no requiere acción. Sirve como referencia para el análisis estadístico del establecimiento.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
};

const RulesSummary: React.FC<RulesSummaryProps> = ({ findings, meta, establishment }) => {
    const summary = useMemo(() => {
        const counts = {
            [Severity.ERROR]: 0,
            [Severity.REVISAR]: 0,
            [Severity.INDICADOR]: 0,
            passed: 0,
            failed: 0,
            total: findings.length
        };

        // js-combine-iterations: single pass for passed/failed + severity counts
        findings.forEach(f => {
            if (f.resultado) {
                counts.passed++;
            } else {
                counts.failed++;
                if (f.severidad) counts[f.severidad]++;
            }
        });

        return counts;
    }, [findings]);

    if (!meta) return null;

    const passRate = summary.total > 0
        ? Math.round((summary.passed / summary.total) * 100)
        : 0;

    const uniqueSheets = [...new Set(findings.map(f => f.rem_sheet || 'N/A'))];

    return (
        <div className="space-y-6">
            {/* Workbook card */}
            <div className="deis-card p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-2xl doc-icon-container cursor-pointer"
                            title="Documento REM"
                            style={{
                                backgroundColor: 'var(--control-bg)',
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 doc-icon" style={{ color: 'var(--brand-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{meta.nombreOriginal}</h2>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: 'var(--control-bg)', color: 'var(--brand-accent)' }}>
                                    Serie {meta.serieRem}
                                </span>
                                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full"
                                    style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)' }}>
                                    {MONTH_NAMES[meta.mes] || meta.mes} {meta.periodo || '2026'}
                                </span>
                                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full"
                                    style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)' }}>
                                    {meta.codigoEstablecimiento}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Establishment alert banner */}
                    <div className="establishment-alert">
                        <div className="flex items-center gap-3">
                            <div className="establishment-alert-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="establishment-alert-name">
                                {establishment?.nombre || 'Establecimiento desconocido'}
                            </span>
                            {establishment?.tipo && (
                                <span className="establishment-alert-type">{establishment.tipo}</span>
                            )}
                        </div>
                    </div>

                    {/* Pass rate ring — thinner, minimal */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                                <path
                                    d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                                    fill="none"
                                    stroke="var(--border-default)"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                                    fill="none"
                                    stroke={passRate >= 80 ? 'var(--semantic-success)' : passRate >= 50 ? 'var(--semantic-warning)' : 'var(--semantic-error)'}
                                    strokeWidth="2"
                                    strokeDasharray={`${passRate}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{passRate}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Aprobación</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <span className="font-semibold" style={{ color: 'var(--semantic-success)' }}>{summary.passed}</span>
                                <span className="mx-0.5">/</span>
                                <span className="font-semibold">{summary.total}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Severity cards — white bg, colored accents, icons + purple tooltips */}
            <div className="grid grid-cols-3 gap-4">
                {Object.values(Severity).map(sev => {
                    const config = SEVERITY_CONFIG[sev];
                    const count = summary[sev];
                    return (
                        <div
                            key={sev}
                            className="relative group deis-card rounded-2xl p-5 transition-all duration-200 hover:shadow-lg cursor-default"
                            style={{ borderTop: `3px solid ${config.color}` }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}12`, color: config.color }}>
                                    {config.icon}
                                </div>
                                <span className="text-3xl font-bold tracking-tight" style={{ color: config.color }}>{count}</span>
                            </div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: config.color }}>{config.label}</p>

                            {/* Tooltip — purple */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl text-xs font-medium leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 w-64 text-center z-50 shadow-lg"
                                style={{
                                    backgroundColor: '#7C3AED',
                                    color: '#FFFFFF',
                                }}>
                                {config.tooltip}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #7C3AED' }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Meta info bar */}
            <div className="flex flex-wrap gap-6 text-xs font-medium px-1" style={{ color: 'var(--text-muted)' }}>
                <span>Hojas procesadas: <strong style={{ color: 'var(--text-secondary)' }}>{uniqueSheets.join(', ') || 'N/A'}</strong></span>
                <span>Reglas aplicadas: <strong style={{ color: 'var(--text-secondary)' }}>{findings.length}</strong></span>
                <span>Tamaño: <strong style={{ color: 'var(--text-secondary)' }}>{meta.tamano ? (meta.tamano / 1024).toFixed(1) + ' KB' : 'N/A'}</strong></span>
            </div>
        </div>
    );
};

export default RulesSummary;
