import React from 'react';
import { Severity } from '../types';
import { MockFinding, getSeveritySummary, MockWorkbookMeta } from '../data/mockData';

interface RulesSummaryProps {
    findings: MockFinding[];
    meta: MockWorkbookMeta;
}

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string; border: string; icon: string }> = {
    [Severity.ERROR]: {
        label: 'Errores',
        color: 'text-red-700',
        bg: 'bg-gradient-to-br from-red-50 to-red-100/50',
        border: 'border-red-200',
        icon: '🔴',
    },
    [Severity.REVISAR]: {
        label: 'A Revisar',
        color: 'text-amber-700',
        bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50',
        border: 'border-amber-200',
        icon: '🟡',
    },
    [Severity.OBSERVAR]: {
        label: 'Observaciones',
        color: 'text-emerald-700',
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
        border: 'border-emerald-200',
        icon: '🟢',
    },
    [Severity.INDICADOR]: {
        label: 'Indicadores',
        color: 'text-blue-700',
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
        border: 'border-blue-200',
        icon: '🔵',
    },
};

const RulesSummary: React.FC<RulesSummaryProps> = ({ findings, meta }) => {
    const summary = getSeveritySummary(findings);

    const passRate = summary.total > 0
        ? Math.round((summary.byStatus.passed / summary.total) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* Workbook card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900">{meta.fileName}</h2>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded uppercase">Serie {meta.series}</span>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded uppercase">{meta.month}</span>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded uppercase">{meta.establishmentCode}</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{meta.establishment}</p>
                        </div>
                    </div>

                    {/* Pass rate ring */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20">
                            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                                <path
                                    d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                                    fill="none"
                                    stroke={passRate >= 80 ? '#10b981' : passRate >= 50 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth="3"
                                    strokeDasharray={`${passRate}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-black text-slate-900">{passRate}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase">Tasa de Aprobación</p>
                            <p className="text-sm text-slate-600">
                                <span className="font-bold text-emerald-600">{summary.byStatus.passed}</span> de{' '}
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
                    const count = summary.bySeverity[sev];
                    return (
                        <div
                            key={sev}
                            className={`${config.bg} border ${config.border} rounded-xl p-5 transition-all hover:scale-[1.02] hover:shadow-md`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-lg">{config.icon}</span>
                                <span className={`text-3xl font-black ${config.color}`}>{count}</span>
                            </div>
                            <p className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>{config.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Meta info bar */}
            <div className="flex flex-wrap gap-6 text-xs text-slate-400 font-medium px-1">
                <span>Hojas procesadas: <strong className="text-slate-600">{meta.sheetsProcessed.join(', ')}</strong></span>
                <span>Celdas analizadas: <strong className="text-slate-600">{meta.totalCells.toLocaleString()}</strong></span>
                <span>Reglas aplicadas: <strong className="text-slate-600">{meta.totalRulesApplied}</strong></span>
            </div>
        </div>
    );
};

export default RulesSummary;
