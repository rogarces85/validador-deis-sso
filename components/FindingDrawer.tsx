import React, { useEffect } from 'react';
import { MockFinding } from '../data/mockData';
import { SeverityBadge } from './SeverityChips';

interface FindingDrawerProps {
    finding: MockFinding | null;
    onClose: () => void;
}

const FindingDrawer: React.FC<FindingDrawerProps> = ({ finding, onClose }) => {
    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!finding) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity"
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <SeverityBadge severity={finding.severity} />
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${finding.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {finding.passed ? 'APROBADO' : 'FALLIDO'}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">{finding.description}</h2>
                        <p className="text-sm text-slate-400 font-mono mt-1">{finding.ruleId}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Location info */}
                    <section>
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Ubicación</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <p className="text-[11px] text-slate-400 font-semibold uppercase">Hoja</p>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">{finding.sheet}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <p className="text-[11px] text-slate-400 font-semibold uppercase">Celda</p>
                                <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">{finding.cell}</p>
                            </div>
                        </div>
                    </section>

                    {/* Values */}
                    <section>
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Valores</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className={`rounded-xl p-4 border ${finding.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                <p className="text-[11px] font-semibold uppercase text-slate-500">Valor Actual</p>
                                <p className={`text-2xl font-black mt-1 font-mono ${finding.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {String(finding.actualValue)}
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <p className="text-[11px] font-semibold uppercase text-slate-500">Esperado</p>
                                <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
                                    {String(finding.expectedValue)}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Message */}
                    <section>
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Mensaje de Regla</h4>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-sm text-amber-900 leading-relaxed">{finding.message}</p>
                        </div>
                    </section>

                    {/* Evidence */}
                    {finding.evidence && (
                        <section>
                            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Evidencia / Detalle</h4>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <p className="text-sm text-blue-900 leading-relaxed">{finding.evidence}</p>
                            </div>
                        </section>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3 justify-end">
                    <button
                        onClick={() => {
                            const text = `[${finding.ruleId}] ${finding.severity} | ${finding.sheet}:${finding.cell}\n${finding.description}\n${finding.message}\nActual: ${finding.actualValue} | Esperado: ${finding.expectedValue}`;
                            navigator.clipboard.writeText(text);
                        }}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </>
    );
};

export default FindingDrawer;
