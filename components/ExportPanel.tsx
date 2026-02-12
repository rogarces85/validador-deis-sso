import React, { useState } from 'react';
import { ValidationResult, FileMetadata, Establishment } from '../types';

interface ExportPanelProps {
    findings: ValidationResult[];
    meta: FileMetadata | null;
    establishment: Establishment | null;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ findings, meta, establishment }) => {
    const [copied, setCopied] = useState(false);

    if (!meta) return null;

    const buildSummaryText = () => {
        const failed = findings.filter(f => !f.resultado);
        const lines = [
            `=== Resumen Validación REM ===`,
            `Archivo: ${meta.nombreOriginal}`,
            `Establecimiento: ${establishment?.nombre || 'Desconocido'} (${meta.codigoEstablecimiento})`,
            `Serie: ${meta.serieRem} | Mes: ${meta.mes} | Año: ${meta.periodo || 2026}`,
            ``,
            `Total hallazgos: ${findings.length}`,
            `Aprobados: ${findings.filter(f => f.resultado).length}`,
            `Fallidos: ${failed.length}`,
            ``,
            `--- Hallazgos fallidos ---`,
            ...failed.map(f => `[${f.severidad}] ${f.ruleId} | ${f.rem_sheet || ''}:${f.cell || ''} — ${f.descripcion} (Actual: ${f.valorActual}, Esperado: ${f.valorEsperado})`),
        ];
        return lines.join('\n');
    };

    const handleCopySummary = () => {
        navigator.clipboard.writeText(buildSummaryText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExportJSON = () => {
        const data = {
            meta,
            establishment,
            findings,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `validacion_${meta.codigoEstablecimiento}_${meta.mes}_${meta.periodo || '2026'}.json`);
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Regla', 'Severidad', 'Hoja', 'Celda', 'Descripción', 'Valor Actual', 'Esperado', 'Estado'];
        const rows = findings.map(f => [
            f.id,
            f.ruleId,
            f.severidad,
            f.rem_sheet || '',
            f.cell || '',
            `"${f.descripcion.replace(/"/g, '""')}"`,
            String(f.valorActual),
            String(f.valorEsperado),
            f.resultado ? 'APROBADO' : 'FALLIDO',
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `validacion_${meta.codigoEstablecimiento}_${meta.mes}_${meta.periodo || '2026'}.csv`);
    };

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportButtons = [
        {
            label: 'Exportar JSON',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
            onClick: handleExportJSON,
            style: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
        },
        {
            label: 'Exportar CSV',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            onClick: handleExportCSV,
            style: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar Resultados
            </h3>

            <div className="flex flex-wrap gap-3">
                {exportButtons.map(btn => (
                    <button
                        key={btn.label}
                        onClick={btn.onClick}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold border rounded-xl transition-all shadow-sm hover:shadow ${btn.style}`}
                    >
                        {btn.icon}
                        {btn.label}
                    </button>
                ))}

                <button
                    onClick={handleCopySummary}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold border rounded-xl transition-all shadow-sm ${copied
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copied ? '¡Copiado!' : 'Copiar Resumen'}
                </button>

                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold border border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimir
                </button>
            </div>
        </div>
    );
};

export default ExportPanel;
