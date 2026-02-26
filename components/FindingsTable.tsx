import React, { useState, useMemo } from 'react';
import { Severity, ValidationResult } from '../types';
import { SeverityBadge } from './SeverityChips';

interface FindingsTableProps {
    findings: ValidationResult[];
    onSelectFinding: (finding: ValidationResult) => void;
}

// rendering-hoist-jsx: static arrays hoisted outside component
const SEVERITY_OPTIONS: (Severity | 'ALL')[] = ['ALL', ...Object.values(Severity)];
const STATUS_OPTIONS: { key: 'ALL' | 'PASS' | 'FAIL'; label: string }[] = [
    { key: 'ALL', label: 'Todos' },
    { key: 'PASS', label: 'Aprobados' },
    { key: 'FAIL', label: 'Fallidos' },
];

const FindingsTable: React.FC<FindingsTableProps> = ({ findings, onSelectFinding }) => {
    const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL');
    const [sheetFilter, setSheetFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASS' | 'FAIL'>('ALL');

    const sheets = useMemo(() => [...new Set(findings.map(f => f.rem_sheet || 'N/A'))], [findings]);

    const filteredFindings = useMemo(() => {
        return findings.filter(f => {
            if (severityFilter !== 'ALL' && f.severidad !== severityFilter) return false;
            if (sheetFilter !== 'ALL' && (f.rem_sheet || 'N/A') !== sheetFilter) return false;
            if (statusFilter === 'PASS' && !f.resultado) return false;
            if (statusFilter === 'FAIL' && f.resultado) return false;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                return (
                    f.descripcion.toLowerCase().includes(term) ||
                    f.ruleId.toLowerCase().includes(term) ||
                    (f.mensaje || '').toLowerCase().includes(term)
                );
            }
            return true;
        });
    }, [findings, severityFilter, sheetFilter, statusFilter, searchTerm]);

    const chipStyle = (active: boolean) => ({
        backgroundColor: active ? 'var(--brand-navy)' : 'var(--bg-inset)',
        color: active ? 'white' : 'var(--text-secondary)',
        border: active ? '1px solid transparent' : '1px solid var(--border-subtle)',
    });

    return (
        <div className="deis-card overflow-hidden">
            {/* Filters bar */}
            <div className="p-4 md:p-6 space-y-4" style={{ borderBottom: '1px solid var(--border-default)' }}>
                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Hallazgos
                        <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>
                            ({filteredFindings.length} de {findings.length})
                        </span>
                    </h3>

                    {/* Search */}
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar regla o descripción..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 text-sm rounded-lg w-full md:w-64 transition-all focus:outline-none"
                            style={{
                                backgroundColor: 'var(--control-bg)',
                                border: '1px solid var(--control-border)',
                                color: 'var(--text-primary)',
                            }}
                        />
                    </div>
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-semibold uppercase mr-1" style={{ color: 'var(--text-muted)' }}>Severidad:</span>
                    {SEVERITY_OPTIONS.map(sev => (
                        <button
                            key={sev}
                            onClick={() => setSeverityFilter(sev)}
                            className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                            style={chipStyle(severityFilter === sev)}
                        >
                            {sev === 'ALL' ? 'Todas' : sev}
                        </button>
                    ))}

                    <span className="w-px h-5 mx-2" style={{ backgroundColor: 'var(--border-default)' }} />

                    <span className="text-xs font-semibold uppercase mr-1" style={{ color: 'var(--text-muted)' }}>Hoja:</span>
                    <select
                        value={sheetFilter}
                        onChange={e => setSheetFilter(e.target.value)}
                        className="px-3 py-1 rounded-lg text-xs font-bold cursor-pointer focus:outline-none"
                        style={{
                            backgroundColor: 'var(--control-bg)',
                            border: '1px solid var(--control-border)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <option value="ALL">Todas</option>
                        {sheets.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <span className="w-px h-5 mx-2" style={{ backgroundColor: 'var(--border-default)' }} />

                    {STATUS_OPTIONS.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => setStatusFilter(opt.key)}
                            className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                            style={chipStyle(statusFilter === opt.key)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead style={{ backgroundColor: 'var(--bg-inset)', borderBottom: '1px solid var(--border-default)' }}>
                        <tr>
                            <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Estado</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Regla</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Hoja</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Severidad</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Valor</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Esperado</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider w-10" style={{ color: 'var(--text-muted)' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFindings.map(finding => (
                            <tr
                                key={finding.id}
                                onClick={() => onSelectFinding(finding)}
                                className="cursor-pointer transition-colors group"
                                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0, 188, 212, 0.04)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <td className="px-6 py-4">
                                    {finding.resultado ? (
                                        <span className="inline-flex items-center gap-1.5 font-bold text-xs" style={{ color: 'var(--semantic-success)' }}>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            OK
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 font-bold text-xs" style={{ color: 'var(--semantic-error)' }}>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            FALLA
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{finding.descripcion}</p>
                                    <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{finding.ruleId} {finding.cell ? `· ${finding.cell}` : ''}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-[11px] font-bold rounded uppercase"
                                        style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)' }}>
                                        {finding.rem_sheet || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <SeverityBadge severity={finding.severidad} />
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-mono font-semibold px-2 py-1 rounded"
                                        style={{
                                            backgroundColor: 'var(--bg-inset)',
                                            color: 'var(--text-primary)',
                                            border: '1px solid var(--border-subtle)',
                                        }}>
                                        {String(finding.valorActual)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{String(finding.valorEsperado)}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </td>
                            </tr>
                        ))}
                        {filteredFindings.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-16 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--border-default)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-medium" style={{ color: 'var(--text-muted)' }}>No se encontraron hallazgos con estos filtros</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FindingsTable;
