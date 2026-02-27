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

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; softBg: string; borderColor: string }> = {
    [Severity.ERROR]: {
        label: 'Errores',
        color: 'var(--semantic-error)',
        softBg: 'var(--semantic-error-soft)',
        borderColor: 'var(--semantic-error-border)',
    },
    [Severity.REVISAR]: {
        label: 'A Revisar',
        color: 'var(--semantic-warning)',
        softBg: 'var(--semantic-warning-soft)',
        borderColor: 'var(--semantic-warning-border)',
    },
    [Severity.OBSERVAR]: {
        label: 'Observaciones',
        color: 'var(--semantic-success)',
        softBg: 'var(--semantic-success-soft)',
        borderColor: 'var(--semantic-success-border)',
    },
    [Severity.INDICADOR]: {
        label: 'Indicadores',
        color: 'var(--semantic-info)',
        softBg: 'var(--semantic-info-soft)',
        borderColor: 'var(--semantic-info-border)',
    },
};

const RulesSummary: React.FC<RulesSummaryProps> = ({ findings, meta, establishment }) => {
    const summary = useMemo(() => {
        const counts = {
            [Severity.ERROR]: 0,
            [Severity.REVISAR]: 0,
            [Severity.OBSERVAR]: 0,
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

            {/* Severity cards — Apple-style neutral backgrounds with colored numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.values(Severity).map(sev => {
                    const config = SEVERITY_CONFIG[sev];
                    const count = summary[sev];
                    return (
                        <div
                            key={sev}
                            className="deis-card p-5 transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                                <span className="text-3xl font-semibold tracking-tight" style={{ color: config.color }}>{count}</span>
                            </div>
                            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{config.label}</p>
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
