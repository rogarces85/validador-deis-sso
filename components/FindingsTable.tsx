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

type MessagePartType = 'rem' | 'section' | 'text' | 'separator';

interface MessagePart {
    value: string;
    type: MessagePartType;
}

const REM_TOKEN_REGEX = /\bREM\s+[A-Z0-9]+\b/i;
const SECTION_TOKEN_REGEX = /\bSECCI[ÓO]N(?:\s+[A-Z0-9.]+)?\s*:[^|,]+|\bSECCI[ÓO]N\s+[A-Z0-9.]+/i;
const INLINE_TOKEN_REGEX = /\bREM\s+[A-Z0-9]+\b|\bSECCI[ÓO]N(?:\s+[A-Z0-9.]+)?\s*:[^|,]+|\bSECCI[ÓO]N\s+[A-Z0-9.]+/gi;

const classifyPart = (part: string): MessagePartType => {
    if (SECTION_TOKEN_REGEX.test(part)) return 'section';
    if (REM_TOKEN_REGEX.test(part)) return 'rem';
    return 'text';
};

const tokenizePipeMessage = (descripcion: string): MessagePart[] => {
    const parts = descripcion
        .split('|')
        .map(p => p.trim())
        .filter(Boolean);

    if (parts.length <= 1) return [{ value: descripcion, type: 'text' }];

    const tokens: MessagePart[] = [];
    parts.forEach((part, index) => {
        tokens.push({ value: part, type: classifyPart(part) });
        if (index < parts.length - 1) tokens.push({ value: '|', type: 'separator' });
    });
    return tokens;
};

const tokenizeInlineMessage = (descripcion: string): MessagePart[] => {
    const tokens: MessagePart[] = [];
    let lastIndex = 0;

    for (const match of descripcion.matchAll(INLINE_TOKEN_REGEX)) {
        if (match.index === undefined) continue;
        const start = match.index;
        const token = match[0];

        if (start > lastIndex) {
            tokens.push({ value: descripcion.slice(lastIndex, start), type: 'text' });
        }

        tokens.push({ value: token, type: classifyPart(token) });
        lastIndex = start + token.length;
    }

    if (lastIndex < descripcion.length) {
        tokens.push({ value: descripcion.slice(lastIndex), type: 'text' });
    }

    return tokens.length > 0 ? tokens : [{ value: descripcion, type: 'text' }];
};

const renderDescripcionFormatted = (descripcion: string) => {
    if (!descripcion) return '';

    const tokens = descripcion.includes('|')
        ? tokenizePipeMessage(descripcion)
        : tokenizeInlineMessage(descripcion);

    return (
        <>
            {tokens.map((token, index) => {
                if (token.type === 'separator') {
                    return <span key={`sep-${index}`} className="mx-1" style={{ color: 'var(--text-muted)' }}>|</span>;
                }

                if (token.type === 'rem') {
                    return (
                        <span key={`rem-${index}`} className="font-bold" style={{ color: 'var(--text-primary)' }}>
                            {token.value}
                        </span>
                    );
                }

                if (token.type === 'section') {
                    return (
                        <span key={`sec-${index}`} className="font-bold" style={{ color: '#10b981' }}>
                            {token.value}
                        </span>
                    );
                }

                return <span key={`txt-${index}`}>{token.value}</span>;
            })}
        </>
    );
};

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
        backgroundColor: active ? 'var(--text-primary)' : 'var(--control-bg)',
        color: active ? 'var(--bg-canvas)' : 'var(--text-secondary)',
    });

    return (
        <div className="deis-card overflow-hidden">
            {/* Filters bar */}
            <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4" style={{ borderBottom: '1px solid var(--border-default)' }}>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                    <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        Hallazgos
                        <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>
                            ({filteredFindings.length} de {findings.length})
                        </span>
                    </h3>

                    {/* Search */}
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar regla o descripción..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 text-sm rounded-xl w-full sm:w-60 transition-all focus:outline-none"
                            style={{
                                backgroundColor: 'var(--control-bg)',
                                border: 'none',
                                color: 'var(--text-primary)',
                            }}
                        />
                    </div>
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-medium uppercase tracking-wider mr-1" style={{ color: 'var(--text-muted)' }}>Estado:</span>
                    {SEVERITY_OPTIONS.map(sev => (
                        <button
                            key={sev}
                            onClick={() => setSeverityFilter(sev)}
                            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                            style={chipStyle(severityFilter === sev)}
                        >
                            {sev === 'ALL' ? 'Todas' : sev}
                        </button>
                    ))}

                    <span className="w-px h-4 mx-1.5 hidden sm:block" style={{ backgroundColor: 'var(--border-default)' }} />

                    <span className="text-[10px] font-medium uppercase tracking-wider mr-1" style={{ color: 'var(--text-muted)' }}>Hoja:</span>
                    <select
                        value={sheetFilter}
                        onChange={e => setSheetFilter(e.target.value)}
                        className="px-3 py-1 rounded-full text-xs font-medium cursor-pointer focus:outline-none"
                        style={{
                            backgroundColor: 'var(--control-bg)',
                            border: 'none',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <option value="ALL">Todas</option>
                        {sheets.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <span className="w-px h-4 mx-1.5 hidden sm:block" style={{ backgroundColor: 'var(--border-default)' }} />

                    {STATUS_OPTIONS.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => setStatusFilter(opt.key)}
                            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                            style={chipStyle(statusFilter === opt.key)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table — Estado → Validación → Regla → Hoja → Valor → Esperado → Comparación → Acciones */}
            <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: '860px' }}>
                    <thead style={{ backgroundColor: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-default)' }}>
                        <tr>
                            <th className="px-4 sm:px-6 py-3 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Estado</th>
                            <th className="px-4 sm:px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-center" style={{ color: 'var(--text-muted)' }}>Validación</th>
                            <th className="px-4 sm:px-6 py-3 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Regla</th>
                            <th className="px-4 sm:px-6 py-3 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Hoja</th>
                            <th className="px-4 sm:px-6 py-3 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Valor</th>
                            <th className="px-4 sm:px-6 py-3 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Esperado</th>
                            <th className="px-4 sm:px-6 py-3 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Comparación</th>
                            <th className="px-4 sm:px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-center" style={{ color: 'var(--text-muted)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFindings.map(finding => (
                            <tr
                                key={finding.id}
                                className="transition-colors group"
                                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--control-bg)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {/* Estado (antes Severidad) — SeverityBadge */}
                                <td className="px-4 sm:px-6 py-3">
                                    <SeverityBadge severity={finding.severidad} />
                                </td>
                                {/* Validación (antes Estado) — icon only */}
                                <td className="px-4 sm:px-6 py-3 text-center">
                                    {finding.resultado ? (
                                        <span title="Aprobado" className="inline-flex items-center justify-center" style={{ color: 'var(--semantic-success)' }}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    ) : (
                                        <span title="Fallido" className="inline-flex items-center justify-center" style={{ color: 'var(--semantic-error)' }}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </td>
                                {/* Regla */}
                                <td className="px-4 sm:px-6 py-3">
                                    <p className="text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
                                        {renderDescripcionFormatted(finding.descripcion)}
                                    </p>
                                    <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{finding.ruleId} {finding.cell ? `· ${finding.cell}` : ''}</p>
                                </td>
                                {/* Hoja */}
                                <td className="px-4 sm:px-6 py-3">
                                    <span className="px-2 py-1 text-[11px] font-medium rounded-full"
                                        style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)' }}>
                                        {finding.rem_sheet || 'N/A'}
                                    </span>
                                </td>
                                {/* Valor Actual */}
                                <td className="px-4 sm:px-6 py-3">
                                    <span className="text-sm font-mono font-medium px-2 py-1 rounded-lg"
                                        style={{
                                            backgroundColor: 'var(--control-bg)',
                                            color: 'var(--text-primary)',
                                        }}>
                                        {String(finding.valorActual)}
                                    </span>
                                </td>
                                {/* Esperado */}
                                <td className="px-4 sm:px-6 py-3">
                                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{String(finding.valorEsperado)}</span>
                                </td>
                                <td className="px-4 sm:px-6 py-3">
                                    <div className="space-y-1">
                                        <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                                            {finding.comparacion || 'N/A'}
                                        </span>
                                        {typeof finding.diferencia === 'number' ? (
                                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                                                style={{
                                                    backgroundColor: finding.diferencia === 0
                                                        ? 'var(--control-bg)'
                                                        : finding.diferencia > 0
                                                            ? 'var(--semantic-success-soft)'
                                                            : 'var(--semantic-error-soft)',
                                                    color: finding.diferencia === 0
                                                        ? 'var(--text-secondary)'
                                                        : finding.diferencia > 0
                                                            ? 'var(--semantic-success)'
                                                            : 'var(--semantic-error)',
                                                }}>
                                                {finding.diferencia > 0 ? '+' : ''}{finding.diferencia}
                                            </span>
                                        ) : null}
                                    </div>
                                </td>
                                {/* Acciones — Detalle */}
                                <td className="px-4 sm:px-6 py-3 text-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSelectFinding(finding); }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 hover:shadow-sm"
                                        style={{
                                            backgroundColor: 'var(--brand-accent)',
                                            color: '#FFFFFF',
                                        }}
                                        title="Ver detalle de esta validación"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredFindings.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-20 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No se encontraron hallazgos con estos filtros</p>
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
