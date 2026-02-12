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
        // Could show a toast here
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl transform transition-transform z-50 overflow-y-auto border-l border-slate-200">
            <div className="p-6">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Detalle del Hallazgo</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                {finding.ruleId}
                            </span>
                            {finding.cell && (
                                <span className="text-sm font-mono text-slate-500 font-bold">
                                    {finding.cell}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Status & Severity */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Estado</span>
                            {finding.resultado ? (
                                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-sm bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    APROBADO
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-red-600 font-bold text-sm bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    FALLIDOS
                                </span>
                            )}
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div className="flex-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Severidad</span>
                            <SeverityBadge severity={finding.severidad} />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Descripción</h3>
                        <p className="text-slate-700 leading-relaxed bg-white p-0">
                            {finding.descripcion}
                        </p>
                    </div>

                    {/* Technical Details */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Detalles Técnicos</h3>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4 font-mono text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Hoja REM</span>
                                    <span className="text-slate-800 font-semibold">{finding.rem_sheet || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Celda / Rango</span>
                                    <span className="text-slate-800 font-semibold">{finding.cell || 'No especificado'}</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Valor Encontrado</span>
                                    <span className="text-red-600 font-bold bg-white px-2 py-1 rounded border border-red-100 inline-block min-w-[3rem] text-center">
                                        {String(finding.valorActual)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Valor Esperado</span>
                                    <span className="text-emerald-600 font-bold bg-white px-2 py-1 rounded border border-emerald-100 inline-block min-w-[3rem] text-center">
                                        {String(finding.valorEsperado)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message / Error */}
                    {(finding.mensaje || finding.evidence) && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Mensaje del Sistema</h3>
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
                                {finding.mensaje && <p className="mb-2">{finding.mensaje}</p>}
                                {finding.evidence && (
                                    <p className="mt-2 text-xs font-mono text-blue-600 pt-2 border-t border-blue-200">
                                        Evidencia: {finding.evidence}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={copyToClipboard}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copiar Detalles
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FindingDrawer;
