
import * as XLSX from 'xlsx';
import { ValidationResult, FileMetadata, Establishment } from '../types';

export class ExportService {
  public static exportToExcel(results: ValidationResult[], metadata: FileMetadata, establishment: Establishment | null) {
    const wb = XLSX.utils.book_new();

    // 1. Summary Sheet
    const summaryData = [
      ['RESUMEN DE VALIDACIÓN'],
      [''],
      ['Archivo:', metadata.nombreOriginal],
      ['Establecimiento:', establishment?.nombre || 'No identificado'],
      ['Código DEIS:', metadata.codigoEstablecimiento],
      ['Serie REM:', metadata.serieRem],
      ['Mes:', metadata.mes],
      ['Fecha Proceso:', new Date().toLocaleString()],
      [''],
      ['ESTADÍSTICAS'],
      ['Total Reglas:', results.length],
      ['Exitosas:', results.filter(r => r.resultado).length],
      ['Fallidas:', results.filter(r => !r.resultado).length],
      ['Errores Críticos:', results.filter(r => !r.resultado && r.severidad === 'ERROR').length],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

    // 2. Details Sheet
    const detailsHeader = ['ID Regla', 'Descripción', 'Severidad', 'Estado', 'Valor Actual', 'Valor Esperado', 'Mensaje'];
    const detailsData = results.map(r => [
      r.ruleId,
      r.descripcion,
      r.severidad,
      r.resultado ? 'CUMPLE' : 'FALLA',
      r.valorActual,
      r.valorEsperado,
      r.mensaje || ''
    ]);
    const wsDetails = XLSX.utils.aoa_to_sheet([detailsHeader, ...detailsData]);
    XLSX.utils.book_append_sheet(wb, wsDetails, 'Detalle Errores');

    // Generate filename
    const filename = `Resultados_Validacion_${metadata.codigoEstablecimiento}_${metadata.serieRem}_${metadata.mes}.xlsx`;

    // Download
    XLSX.writeFile(wb, filename);
  }

  public static exportToJson(results: ValidationResult[], metadata: FileMetadata, establishment: Establishment | null) {
    const data = {
      metadata: {
        ...metadata,
        establishmentName: establishment?.nombre,
        timestamp: new Date().toISOString()
      },
      results
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Resultados_${metadata.codigoEstablecimiento}_${metadata.serieRem}_${metadata.mes}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public static exportToCsv(results: ValidationResult[], metadata: FileMetadata) {
    const headers = ['Severity', 'RuleID', 'Description', 'Sheet', 'Cell', 'Message', 'Value', 'Expected'];
    const rows = results.map(r => [
      r.severidad,
      r.ruleId,
      `"${r.descripcion.replace(/"/g, '""')}"`,
      r.rem_sheet || '',
      '',
      `"${(r.mensaje || '').replace(/"/g, '""')}"`,
      r.valorActual,
      r.valorEsperado
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Resultados_${metadata.codigoEstablecimiento}_${metadata.serieRem}_${metadata.mes}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
