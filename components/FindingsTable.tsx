import React, { useMemo, useState } from 'react';
import { Severity, ValidationResult } from '../types';
import { SeverityBadge, SeverityChip } from './SeverityChips';
import { cleanFindingDescription, getReferenceLabel } from '../utils/findingDisplay';

interface FindingsTableProps {
    findings: ValidationResult[];
    onSelectFinding: (finding: ValidationResult) => void;
}

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
    const parts = descripcion.split('|').map(p => p.trim()).filter(Boolean);
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
                    return <span key={`rem-${index}`} className="font-bold" style={{ color: 'var(--text-primary)' }}>{token.value}</span>;
                }

                if (token.type === 'section') {
                    return <span key={`sec-${index}`} className="font-bold" style={{ color: '#10b981' }}>{token.value}</span>;
                }

                return <span key={`txt-${index}`}>{token.value}</span>;
            })}
        </>
    );
};

const buildOperationalInterpretation = (finding: ValidationResult): string => {
    const operador = finding.operador || '';

    if (operador === '==') {
        return 'Se espera igualdad exacta entre el valor informado y su referencia. Si falla, normalmente hay una inconsistencia de totalizacion o de traspaso entre secciones.';
    }

    if (operador === '>=' || operador === '>') {
        return 'Se espera que el valor actual sea mayor que la referencia. Si falla, puede existir subregistro del numerador o una referencia mas alta de lo esperado.';
    }

    if (operador === '<=' || operador === '<') {
        return 'Se espera que el valor actual no supere la referencia. Si falla, el dato puede estar fuera del limite permitido o mal totalizado.';
    }

    if (operador === '!=') {
        return 'Se espera que ambos lados no coincidan. Si coinciden, el sistema lo marca porque puede existir un registro no esperado.';
    }

    return 'El sistema compara el dato observado con una referencia tecnica y requiere revision segun el contexto de la hoja REM.';
};

const buildPracticalExample = (finding: ValidationResult): string => {
    return `Ejemplo: si el valor actual es ${String(finding.valorActual)} y la referencia evaluada es ${String(finding.valorEsperado ?? 0)}, el sistema verifica si la relacion ${finding.comparacion || finding.operador || 'definida por la regla'} se cumple.`;
};

const FindingsTable: React.FC<FindingsTableProps> = ({ findings, onSelectFinding }) => {
    const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL');
    const [sheetFilter, setSheetFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASS' | 'FAIL'>('FAIL');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const sheets = useMemo(() => [...new Set(findings.map(f => f.rem_sheet || 'N/A'))], [findings]);

    const severityCounts = useMemo(() => ({
        [Severity.ERROR]: findings.filter(f => !f.resultado && f.severidad === Severity.ERROR).length,
        [Severity.REVISAR]: findings.filter(f => !f.resultado && f.severidad === Severity.REVISAR).length,
        [Severity.INDICADOR]: findings.filter(f => !f.resultado && f.severidad === Severity.INDICADOR).length,
    }), [findings]);

    const failedCount = useMemo(() =>
        findings.filter(f => !f.resultado).length,
    [findings]);

    const totalRules = findings.length;

    const filteredFindings = useMemo(() => {
        return findings.filter(f => {
            if (severityFilter !== 'ALL' && f.severidad !== severityFilter) return false;
            if (sheetFilter !== 'ALL' && (f.rem_sheet || 'N/A') !== sheetFilter) return false;
            if (statusFilter === 'PASS' && !f.resultado) return false;
            if (statusFilter === 'FAIL' && f.resultado) return false;
            if (f.valorActual === null || f.valorActual === undefined || f.valorActual === '') {
                if (f.resultado) return false;
            }
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                return (
                    f.descripcion.toLowerCase().includes(term) ||
                    f.ruleId.toLowerCase().includes(term) ||
                    (f.mensaje || '').toLowerCase().includes(term) ||
                    (f.cell || '').toLowerCase().includes(term) ||
                    (f.rem_sheet || '').toLowerCase().includes(term)
                );
            }
            return true;
        });
    }, [findings, severityFilter, sheetFilter, statusFilter, searchTerm]);

    const resetFilters = () => {
        setSeverityFilter('ALL');
        setSheetFilter('ALL');
        setSearchTerm('');
        setStatusFilter('ALL');
    };

    const chipStyle = (active: boolean) => ({
        backgroundColor: active ? 'var(--text-primary)' : 'var(--control-bg)',
        color: active ? 'var(--bg-canvas)' : 'var(--text-secondary)',
    });

    return (
        <div className="deis-card overflow-hidden w-full">
            <div className="sticky top-0 z-20 p-4 sm:p-5 md:p-6 space-y-4" style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
                <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            Hallazgos
                            <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>
                                {statusFilter === 'FAIL' ? failedCount : filteredFindings.length} de {totalRules}
                            </span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <SeverityChip severity={Severity.ERROR} count={severityCounts[Severity.ERROR]} active={severityFilter === Severity.ERROR} onClick={() => setSeverityFilter(severityFilter === Severity.ERROR ? 'ALL' : Severity.ERROR)} />
                            <SeverityChip severity={Severity.REVISAR} count={severityCounts[Severity.REVISAR]} active={severityFilter === Severity.REVISAR} onClick={() => setSeverityFilter(severityFilter === Severity.REVISAR ? 'ALL' : Severity.REVISAR)} />
                            <SeverityChip severity={Severity.INDICADOR} count={severityCounts[Severity.INDICADOR]} active={severityFilter === Severity.INDICADOR} onClick={() => setSeverityFilter(severityFilter === Severity.INDICADOR ? 'ALL' : Severity.INDICADOR)} />
                        </div>
                    </div>

                    <div className="relative w-full lg:w-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por regla, hoja, celda o mensaje"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 text-sm rounded-xl w-full lg:w-80 transition-all focus:outline-none"
                            style={{ backgroundColor: 'var(--control-bg)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                        />
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row xl:items-center gap-3 justify-between">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-medium uppercase tracking-wider mr-1" style={{ color: 'var(--text-muted)' }}>Severidad:</span>
                        <button onClick={() => setSeverityFilter('ALL')} className="px-3 py-1.5 rounded-full text-sm font-medium transition-all" style={chipStyle(severityFilter === 'ALL')}>Todas</button>

                        <span className="w-px h-4 mx-1 hidden sm:block" style={{ backgroundColor: 'var(--border-default)' }} />

                        <span className="text-xs font-medium uppercase tracking-wider mr-1" style={{ color: 'var(--text-muted)' }}>Hoja:</span>
                        <select
                            value={sheetFilter}
                            onChange={e => setSheetFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer focus:outline-none"
                            style={{ backgroundColor: 'var(--control-bg)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                        >
                            <option value="ALL">Todas</option>
                            {sheets.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <span className="w-px h-4 mx-1 hidden sm:block" style={{ backgroundColor: 'var(--border-default)' }} />

                        <span className="text-xs font-medium uppercase tracking-wider mr-1" style={{ color: 'var(--text-muted)' }}>Estado:</span>
                        {STATUS_OPTIONS.map(opt => (
                            <button key={opt.key} onClick={() => setStatusFilter(opt.key)} className="px-3 py-1.5 rounded-full text-sm font-medium transition-all" style={chipStyle(statusFilter === opt.key)}>
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={resetFilters}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                        style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto p-4 sm:p-5 md:p-6 space-y-4" style={{ maxHeight: 'min(72vh, 920px)' }}>
                {filteredFindings.map((finding) => {
                    const isExpanded = expandedId === finding.id;
                    const referenceLabel = getReferenceLabel(finding);
                    const differenceTone = typeof finding.diferencia !== 'number'
                        ? null
                        : finding.diferencia === 0
                            ? { bg: 'var(--control-bg)', color: 'var(--text-secondary)' }
                            : finding.diferencia > 0
                                ? { bg: 'var(--semantic-success-soft)', color: 'var(--semantic-success)' }
                                : { bg: 'var(--semantic-error-soft)', color: 'var(--semantic-error)' };

                    return (
                        <article key={finding.id} className="rounded-[24px] border border-default overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                            <div className="p-4 md:p-5">
                                <div className="grid grid-cols-1 xl:grid-cols-[auto_auto_1.4fr_0.9fr_auto] gap-4 items-start">
                                    <div className="space-y-2 min-w-[7rem]">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Severidad</p>
                                        <SeverityBadge severity={finding.severidad} />
                                    </div>

                                    <div className="space-y-2 min-w-[6rem]">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Estado</p>
                                        {finding.resultado ? (
                                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--semantic-success)' }}>
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                OK
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--semantic-error)' }}>
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                                Falla
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 min-w-0">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Hallazgo</p>
                                        <div className="text-sm leading-relaxed break-words" style={{ color: 'var(--text-primary)' }}>
                                            {renderDescripcionFormatted(cleanFindingDescription(finding.descripcion))}
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                            <span>{finding.ruleId}</span>
                                            <span>{finding.rem_sheet || 'N/A'}</span>
                                            {finding.cell ? <span>{finding.cell}</span> : null}
                                        </div>
                                    </div>

                                    <div className="space-y-3 min-w-0">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Resumen tecnico</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="rounded-2xl p-3" style={{ backgroundColor: 'var(--control-bg)' }}>
                                                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Valor</p>
                                                <p className="text-sm font-mono break-words" style={{ color: 'var(--text-primary)' }}>{String(finding.valorActual)}</p>
                                            </div>
                                            <div className="rounded-2xl p-3" style={{ backgroundColor: 'var(--control-bg)' }}>
                                                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Referencia</p>
                                                <p className="text-sm break-words" style={{ color: 'var(--text-secondary)' }}>{referenceLabel}</p>
                                            </div>
                                        </div>
                                        {differenceTone && typeof finding.diferencia === 'number' ? (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: differenceTone.bg, color: differenceTone.color }}>
                                                Diferencia: {finding.diferencia > 0 ? '+' : ''}{finding.diferencia}
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="flex flex-row xl:flex-col gap-2 justify-end min-w-[11rem]">
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                                            style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
                                        >
                                            {isExpanded ? 'Ocultar' : 'Expandir'}
                                        </button>
                                        <button
                                            onClick={() => onSelectFinding(finding)}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                                            style={{ backgroundColor: 'var(--brand-accent)', color: '#fff' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Detalle
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {isExpanded ? (
                                <div className="px-4 pb-4 md:px-5 md:pb-5">
                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 rounded-[22px] p-4 md:p-5" style={{ backgroundColor: 'var(--control-bg)', borderTop: '1px solid var(--border-default)' }}>
                                        <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Explicacion de la validacion</p>
                                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                                {finding.comparacion || 'La comparacion tecnica no viene informada explicitamente, pero la regla fue evaluada segun el motor de validacion.'}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Interpretacion operativa</p>
                                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                                {buildOperationalInterpretation(finding)}
                                            </p>
                                            <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
                                                {buildPracticalExample(finding)}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Que revisar en el Excel</p>
                                            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                <li>Hoja: <code>{finding.rem_sheet || 'N/A'}</code></li>
                                                <li>Celda o rango: <code>{finding.cell || 'No especificado'}</code></li>
                                                <li>Valor encontrado: <code>{String(finding.valorActual)}</code></li>
                                                <li>Referencia: {referenceLabel}</li>
                                            </ul>
                                            {finding.mensaje ? (
                                                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
                                                    Mensaje del sistema: {cleanFindingDescription(finding.mensaje)}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </article>
                    );
                })}

                {filteredFindings.length === 0 ? (
                    <div className="rounded-[24px] border border-default px-6 py-20 text-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No se encontraron hallazgos con estos filtros</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default FindingsTable;
