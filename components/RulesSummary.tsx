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

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; softBg: string; borderColor: string; icon: string }> = {
    [Severity.ERROR]: {
        label: 'Errores',
        color: 'var(--semantic-error)',
        softBg: 'var(--semantic-error-soft)',
        borderColor: 'var(--semantic-error-border)',
        icon: '🔴',
    },
    [Severity.REVISAR]: {
        label: 'A Revisar',
        color: 'var(--semantic-warning)',
        softBg: 'var(--semantic-warning-soft)',
        borderColor: 'var(--semantic-warning-border)',
        icon: '🟡',
    },
    [Severity.OBSERVAR]: {
        label: 'Observaciones',
        color: 'var(--semantic-success)',
        softBg: 'var(--semantic-success-soft)',
        borderColor: 'var(--semantic-success-border)',
        icon: '🟢',
    },
    [Severity.INDICADOR]: {
        label: 'Indicadores',
        color: 'var(--semantic-info)',
        softBg: 'var(--semantic-info-soft)',
        borderColor: 'var(--semantic-info-border)',
        icon: '🔵',
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
                        <div className="p-4 rounded-xl doc-icon-container cursor-pointer"
                            title="Documento REM"
                            style={{
                                background: 'linear-gradient(135deg, rgba(33, 150, 200, 0.15), rgba(0, 188, 212, 0.1))',
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 doc-icon" style={{ color: 'var(--brand-ocean)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{meta.nombreOriginal}</h2>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="px-2 py-0.5 text-[11px] font-bold rounded uppercase deis-brand-soft" style={{ color: 'var(--brand-ocean)' }}>
                                    Serie {meta.serieRem}
                                </span>
                                <span className="px-2 py-0.5 text-[11px] font-bold rounded uppercase"
                                    style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)' }}>
                                    {MONTH_NAMES[meta.mes] || meta.mes} {meta.periodo || '2026'}
                                </span>
                                <span className="px-2 py-0.5 text-[11px] font-bold rounded uppercase"
                                    style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)' }}>
                                    {meta.codigoEstablecimiento}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Establishment alert banner */}
                    <div className="establishment-alert">
                        <div className="flex items-center gap-3">
                            <div className="establishment-alert-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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

                    {/* Pass rate ring */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20">
                            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                                <path
                                    d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                                    fill="none"
                                    stroke="var(--border-default)"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                                    fill="none"
                                    stroke={passRate >= 80 ? 'var(--semantic-success)' : passRate >= 50 ? 'var(--semantic-warning)' : 'var(--semantic-error)'}
                                    strokeWidth="3"
                                    strokeDasharray={`${passRate}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{passRate}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Tasa de Aprobación</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <span className="font-bold" style={{ color: 'var(--semantic-success)' }}>{summary.passed}</span> de{' '}
                                <span className="font-bold">{summary.total}</span> reglas
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Severity cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.values(Severity).map(sev => {
                    const config = SEVERITY_CONFIG[sev];
                    const count = summary[sev];
                    return (
                        <div
                            key={sev}
                            className="rounded-xl p-5 transition-all hover:scale-[1.02]"
                            style={{
                                backgroundColor: config.softBg,
                                border: `1px solid ${config.borderColor}`,
                                boxShadow: 'var(--shadow-sm)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-lg">{config.icon}</span>
                                <span className="text-3xl font-black" style={{ color: config.color }}>{count}</span>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: config.color }}>{config.label}</p>
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
