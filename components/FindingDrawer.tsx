import React from 'react';
import { ValidationResult } from '../types';
import { SeverityBadge } from './SeverityChips';

interface FindingDrawerProps {
    finding: ValidationResult | null;
    onClose: () => void;
}

const FindingDrawer: React.FC<FindingDrawerProps> = ({ finding, onClose }) => {
    if (!finding) return null;

    const copyToClipboard = () => {
        const text = `
Regla: ${finding.ruleId}
Severidad: ${finding.severidad}
Descripción: ${finding.descripcion}
Hoja: ${finding.rem_sheet || 'N/A'}
Celda: ${finding.cell || 'N/A'}
Valor Actual: ${finding.valorActual}
Valor Esperado: ${finding.valorEsperado}
Mensaje: ${finding.mensaje || ''}
Eviencia: ${finding.evidence || ''}
        `.trim();
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[480px] transform transition-transform z-50 overflow-y-auto"
            style={{
                backgroundColor: 'var(--bg-surface)',
                borderLeft: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-lg)',
            }}>
            <div className="p-6">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Detalle del Hallazgo</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono px-2 py-1 rounded"
                                style={{
                                    backgroundColor: 'var(--bg-inset)',
                                    color: 'var(--text-muted)',
                                    border: '1px solid var(--border-subtle)',
                                }}>
                                {finding.ruleId}
                            </span>
                            {finding.cell && (
                                <span className="text-sm font-mono font-bold" style={{ color: 'var(--text-secondary)' }}>
                                    {finding.cell}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-full transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Status & Severity */}
                    <div className="flex items-center gap-4 p-4 rounded-xl"
                        style={{
                            backgroundColor: 'var(--bg-inset)',
                            border: '1px solid var(--border-subtle)',
                        }}>
                        <div className="flex-1">
                            <span className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Estado</span>
                            {finding.resultado ? (
                                <span className="inline-flex items-center gap-1.5 font-bold text-sm px-2.5 py-1 rounded-lg"
                                    style={{
                                        color: 'var(--semantic-success)',
                                        backgroundColor: 'var(--semantic-success-soft)',
                                        border: '1px solid var(--semantic-success-border)',
                                    }}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    APROBADO
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 font-bold text-sm px-2.5 py-1 rounded-lg"
                                    style={{
                                        color: 'var(--semantic-error)',
                                        backgroundColor: 'var(--semantic-error-soft)',
                                        border: '1px solid var(--semantic-error-border)',
                                    }}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    FALLIDO
                                </span>
                            )}
                        </div>
                        <div className="w-px h-10" style={{ backgroundColor: 'var(--border-default)' }} />
                        <div className="flex-1">
                            <span className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Severidad</span>
                            <SeverityBadge severity={finding.severidad} />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>Descripción</h3>
                        <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {finding.descripcion}
                        </p>
                    </div>

                    {/* Technical Details */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>Detalles Técnicos</h3>
                        <div className="rounded-xl p-4 space-y-4 font-mono text-sm"
                            style={{
                                backgroundColor: 'var(--bg-inset)',
                                border: '1px solid var(--border-default)',
                            }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Hoja REM</span>
                                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{finding.rem_sheet || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Celda / Rango</span>
                                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{finding.cell || 'No especificado'}</span>
                                </div>
                            </div>
                            <div className="pt-4 grid grid-cols-2 gap-4" style={{ borderTop: '1px solid var(--border-default)' }}>
                                <div>
                                    <span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Valor Encontrado</span>
                                    <span className="font-bold px-2 py-1 rounded inline-block min-w-[3rem] text-center"
                                        style={{
                                            color: 'var(--semantic-error)',
                                            backgroundColor: 'var(--semantic-error-soft)',
                                            border: '1px solid var(--semantic-error-border)',
                                        }}>
                                        {String(finding.valorActual)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Valor Esperado</span>
                                    <span className="font-bold px-2 py-1 rounded inline-block min-w-[3rem] text-center"
                                        style={{
                                            color: 'var(--semantic-success)',
                                            backgroundColor: 'var(--semantic-success-soft)',
                                            border: '1px solid var(--semantic-success-border)',
                                        }}>
                                        {String(finding.valorEsperado)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    {(finding.mensaje || finding.evidence) && (
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>Mensaje del Sistema</h3>
                            <div className="p-4 rounded-xl text-sm leading-relaxed"
                                style={{
                                    backgroundColor: 'var(--semantic-info-soft)',
                                    color: 'var(--semantic-info)',
                                    border: '1px solid var(--semantic-info-border)',
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
                <div className="mt-12 pt-6 flex gap-3" style={{ borderTop: '1px solid var(--border-default)' }}>
                    <button
                        onClick={copyToClipboard}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl font-bold transition-all active:scale-95"
                        style={{ background: 'linear-gradient(135deg, var(--brand-ocean), var(--brand-cyan))' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copiar Detalles
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95"
                        style={{
                            backgroundColor: 'var(--bg-inset)',
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
