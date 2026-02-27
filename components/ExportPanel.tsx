import React, { useState } from 'react';
import { ValidationResult, FileMetadata, Establishment } from '../types';
import { ExportService } from '../services/exportService';

interface ExportPanelProps {
    results: ValidationResult[];
    metadata: FileMetadata;
    establishment: Establishment | null;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ results, metadata, establishment }) => {
    const [copied, setCopied] = useState(false);

    const buildSummaryText = () => {
        const failed = results.filter(f => !f.resultado);
        const lines = [
            `=== Resumen Validación REM ===`,
            `Archivo: ${metadata.nombreOriginal}`,
            `Establecimiento: ${establishment?.nombre || 'Desconocido'} (${metadata.codigoEstablecimiento})`,
            `Serie: ${metadata.serieRem} | Mes: ${metadata.mes} | Año: ${metadata.periodo || 2026}`,
            ``,
            `Total hallazgos: ${results.length}`,
            `Aprobados: ${results.filter(f => f.resultado).length}`,
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

    const handleExportXLSX = () => {
        ExportService.exportToExcel(results, metadata, establishment);
    };

    const handleExportJSON = () => {
        const data = {
            metadata: { ...metadata, establishmentName: establishment?.nombre },
            establishment,
            results,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `validacion_${metadata.codigoEstablecimiento}_${metadata.mes}_${metadata.periodo || '2026'}.json`);
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Regla', 'Severidad', 'Hoja', 'Celda', 'Descripción', 'Valor Actual', 'Esperado', 'Estado'];
        const rows = results.map(f => [
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
        downloadBlob(blob, `validacion_${metadata.codigoEstablecimiento}_${metadata.mes}_${metadata.periodo || '2026'}.csv`);
    };

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const btnPrimary = "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-full transition-all active:scale-95";
    const btnSecondary = "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full transition-all active:scale-95";

    return (
        <div className="flex flex-wrap gap-2">
            {/* XLSX Export — primary action */}
            <button
                onClick={handleExportXLSX}
                className={btnPrimary}
                style={{
                    backgroundColor: 'var(--brand-accent)',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar Excel
            </button>

            {/* CSV Export */}
            <button
                onClick={handleExportCSV}
                className={btnSecondary}
                style={{
                    backgroundColor: 'var(--control-bg)',
                    color: 'var(--text-secondary)',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                CSV
            </button>

            {/* JSON Export */}
            <button
                onClick={handleExportJSON}
                className={btnSecondary}
                style={{
                    backgroundColor: 'var(--control-bg)',
                    color: 'var(--text-secondary)',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                JSON
            </button>

            {/* Copy Summary */}
            <button
                onClick={handleCopySummary}
                className={btnSecondary}
                style={
                    copied
                        ? {
                            backgroundColor: 'var(--brand-accent)',
                            color: 'white',
                        }
                        : {
                            backgroundColor: 'var(--control-bg)',
                            color: 'var(--text-secondary)',
                        }
                }
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? '¡Copiado!' : 'Copiar'}
            </button>
        </div>
    );
};

export default ExportPanel;
