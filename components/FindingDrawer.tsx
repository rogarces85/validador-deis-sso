import React from 'react';
import { ValidationResult } from '../types';
import { SeverityBadge } from './SeverityChips';

interface FindingDrawerProps {
    finding: ValidationResult | null;
    onClose: () => void;
}

const FindingDrawer: React.FC<FindingDrawerProps> = ({ finding, onClose }) => {
    if (!finding) return null;

    const deltaTone = typeof finding.diferencia !== 'number'
        ? null
        : finding.diferencia === 0
            ? {
                bg: 'var(--control-bg)',
                color: 'var(--text-secondary)',
                label: 'Igualdad'
            }
            : finding.diferencia > 0
                ? {
                    bg: 'var(--semantic-success-soft)',
                    color: 'var(--semantic-success)',
                    label: 'Positivo'
                }
                : {
                    bg: 'var(--semantic-error-soft)',
                    color: 'var(--semantic-error)',
                    label: 'Negativo'
                };

    const copyToClipboard = () => {
        const text = `
Regla: ${finding.ruleId}
Severidad: ${finding.severidad}
Descripción: ${finding.descripcion}
Hoja: ${finding.rem_sheet || 'N/A'}
Celda: ${finding.cell || 'N/A'}
Valor Actual: ${finding.valorActual}
Valor Esperado: ${finding.valorEsperado}
Comparacion: ${finding.comparacion || ''}
Diferencia: ${finding.diferencia ?? ''}
Mensaje: ${finding.mensaje || ''}
Eviencia: ${finding.evidence || ''}
        `.trim();
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[440px] transform transition-transform z-50 overflow-y-auto"
            style={{
                backgroundColor: 'var(--bg-surface)',
                borderLeft: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-lg)',
            }}>
            <div className="p-7">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Detalle del Hallazgo</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-2.5 py-1 rounded-lg"
                                style={{
                                    backgroundColor: 'var(--control-bg)',
                                    color: 'var(--text-secondary)',
                                }}>
                                {finding.ruleId}
                            </span>
                            {finding.cell && (
                                <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    {finding.cell}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-full transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--control-bg)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Status & Severity */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl"
                        style={{
                            backgroundColor: 'var(--control-bg)',
                        }}>
                        <div className="flex-1">
                            <span className="text-[10px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Estado</span>
                            {finding.resultado ? (
                                <span className="inline-flex items-center gap-1.5 font-semibold text-sm"
                                    style={{ color: 'var(--semantic-success)' }}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    APROBADO
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 font-semibold text-sm"
                                    style={{ color: 'var(--semantic-error)' }}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    FALLIDO
                                </span>
                            )}
                        </div>
                        <div className="w-px h-10" style={{ backgroundColor: 'var(--border-default)' }} />
                        <div className="flex-1">
                            <span className="text-[10px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Severidad</span>
                            <SeverityBadge severity={finding.severidad} />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Descripción</h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {finding.descripcion}
                        </p>
                    </div>

                    {/* Technical Details */}
                    <div>
                        <h3 className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Detalles Técnicos</h3>
                        <div className="rounded-2xl p-5 space-y-4 font-mono text-sm"
                            style={{
                                backgroundColor: 'var(--control-bg)',
                            }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] font-medium uppercase block mb-1 font-sans" style={{ color: 'var(--text-muted)' }}>Hoja REM</span>
                                    <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{finding.rem_sheet || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-medium uppercase block mb-1 font-sans" style={{ color: 'var(--text-muted)' }}>Celda / Rango</span>
                                    <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{finding.cell || 'No especificado'}</span>
                                </div>
                            </div>
                            <div className="pt-4 grid grid-cols-2 gap-4" style={{ borderTop: '1px solid var(--border-default)' }}>
                                <div>
                                    <span className="text-[10px] font-medium uppercase block mb-1 font-sans" style={{ color: 'var(--text-muted)' }}>Valor Encontrado</span>
                                    <span className="font-semibold px-2 py-1 rounded-lg inline-block min-w-[3rem] text-center text-xs"
                                        style={{
                                            color: 'var(--semantic-error)',
                                            backgroundColor: 'var(--semantic-error-soft)',
                                        }}>
                                        {String(finding.valorActual)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-medium uppercase block mb-1 font-sans" style={{ color: 'var(--text-muted)' }}>Valor Esperado</span>
                                    <span className="font-semibold px-2 py-1 rounded-lg inline-block min-w-[3rem] text-center text-xs"
                                        style={{
                                            color: 'var(--semantic-success)',
                                            backgroundColor: 'var(--semantic-success-soft)',
                                        }}>
                                        {String(finding.valorEsperado)}
                                    </span>
                                </div>
                            </div>

                            {(finding.comparacion || typeof finding.diferencia === 'number') ? (
                                <div className="pt-4 space-y-3" style={{ borderTop: '1px solid var(--border-default)' }}>
                                    <div>
                                        <span className="text-[10px] font-medium uppercase block mb-1 font-sans" style={{ color: 'var(--text-muted)' }}>Comparación Evaluada</span>
                                        <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                                            {finding.comparacion || 'No disponible'}
                                        </span>
                                    </div>
                                    {deltaTone ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-medium uppercase font-sans" style={{ color: 'var(--text-muted)' }}>Diferencia</span>
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold"
                                                style={{ backgroundColor: deltaTone.bg, color: deltaTone.color }}>
                                                {deltaTone.label}: {finding.diferencia! > 0 ? '+' : ''}{finding.diferencia}
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Message */}
                    {(finding.mensaje || finding.evidence) && (
                        <div>
                            <h3 className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Mensaje del Sistema</h3>
                            <div className="p-4 rounded-2xl text-sm leading-relaxed"
                                style={{
                                    backgroundColor: 'var(--semantic-info-soft)',
                                    color: 'var(--semantic-info)',
                                }}>
                                {finding.mensaje && <p className="mb-2">{finding.mensaje}</p>}
                                {finding.evidence && (
                                    <p className="mt-2 text-xs font-mono pt-2" style={{ borderTop: '1px solid var(--semantic-info-border)', opacity: 0.8 }}>
                                        Evidencia: {finding.evidence}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-10 pt-6 flex gap-3" style={{ borderTop: '1px solid var(--border-default)' }}>
                    <button
                        onClick={copyToClipboard}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-full font-medium text-sm transition-all active:scale-95"
                        style={{ backgroundColor: 'var(--brand-accent)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copiar Detalles
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-full font-medium text-sm transition-all active:scale-95"
                        style={{
                            backgroundColor: 'var(--control-bg)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FindingDrawer;
