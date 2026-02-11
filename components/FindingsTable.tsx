import React, { useState, useMemo } from 'react';
import { Severity } from '../types';
import { MockFinding } from '../data/mockData';
import { SeverityBadge } from './SeverityChips';

interface FindingsTableProps {
    findings: MockFinding[];
    onSelectFinding: (finding: MockFinding) => void;
}

const FindingsTable: React.FC<FindingsTableProps> = ({ findings, onSelectFinding }) => {
    const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL');
    const [sheetFilter, setSheetFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASS' | 'FAIL'>('ALL');

    const sheets = useMemo(() => [...new Set(findings.map(f => f.sheet))], [findings]);

    const filteredFindings = useMemo(() => {
        return findings.filter(f => {
            if (severityFilter !== 'ALL' && f.severity !== severityFilter) return false;
            if (sheetFilter !== 'ALL' && f.sheet !== sheetFilter) return false;
            if (statusFilter === 'PASS' && !f.passed) return false;
            if (statusFilter === 'FAIL' && f.passed) return false;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                return (
                    f.description.toLowerCase().includes(term) ||
                    f.ruleId.toLowerCase().includes(term) ||
                    f.message.toLowerCase().includes(term)
                );
            }
            return true;
        });
    }, [findings, severityFilter, sheetFilter, statusFilter, searchTerm]);

    const severityOptions: (Severity | 'ALL')[] = ['ALL', ...Object.values(Severity)];
    const statusOptions: { key: 'ALL' | 'PASS' | 'FAIL'; label: string }[] = [
        { key: 'ALL', label: 'Todos' },
        { key: 'PASS', label: 'Aprobados' },
        { key: 'FAIL', label: 'Fallidos' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Filters bar */}
            <div className="p-4 md:p-6 border-b border-slate-100 space-y-4">
                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Hallazgos
                        <span className="text-sm font-normal text-slate-400">
                            ({filteredFindings.length} de {findings.length})
                        </span>
                    </h3>

                    {/* Search */}
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar regla o descripción..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64 transition-all"
                        />
                    </div>
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Severity */}
                    <span className="text-xs text-slate-400 font-semibold uppercase mr-1">Severidad:</span>
                    {severityOptions.map(sev => (
                        <button
                            key={sev}
                            onClick={() => setSeverityFilter(sev)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${severityFilter === sev
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {sev === 'ALL' ? 'Todas' : sev}
                        </button>
                    ))}

                    <span className="w-px h-5 bg-slate-200 mx-2" />

                    {/* Sheet */}
                    <span className="text-xs text-slate-400 font-semibold uppercase mr-1">Hoja:</span>
                    <select
                        value={sheetFilter}
                        onChange={e => setSheetFilter(e.target.value)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="ALL">Todas</option>
                        {sheets.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <span className="w-px h-5 bg-slate-200 mx-2" />

                    {/* Status */}
                    {statusOptions.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => setStatusFilter(opt.key)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${statusFilter === opt.key
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Regla</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hoja</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Severidad</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valor</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Esperado</th>
                            <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredFindings.map(finding => (
                            <tr
                                key={finding.id}
                                onClick={() => onSelectFinding(finding)}
                                className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                            >
                                <td className="px-6 py-4">
                                    {finding.passed ? (
                                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            OK
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-red-500 font-bold text-xs">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            FALLA
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-semibold text-slate-900 leading-tight">{finding.description}</p>
                                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{finding.ruleId} · {finding.cell}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded uppercase">{finding.sheet}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <SeverityBadge severity={finding.severity} />
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-mono text-slate-700 font-semibold bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                        {String(finding.actualValue)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-mono text-slate-400">{String(finding.expectedValue)}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </td>
                            </tr>
                        ))}
                        {filteredFindings.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-16 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-slate-400 font-medium">No se encontraron hallazgos con estos filtros</p>
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
