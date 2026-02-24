
import XLSX from 'xlsx-js-style';
import { ValidationResult, FileMetadata, Establishment } from '../types';

// ─── Estilos por Severidad ──────────────────────────────────
// Rojo = ERROR, Naranjo = REVISAR, Verde = OBSERVAR, Azul = INDICADOR
const SEVERITY_STYLES: Record<string, XLSX.CellStyle> = {
  ERROR: {
    font: { color: { rgb: 'FF0000' }, bold: true },
    fill: { fgColor: { rgb: 'FFF0F0' }, patternType: 'solid' },
  },
  REVISAR: {
    font: { color: { rgb: 'FF8C00' }, bold: true },
    fill: { fgColor: { rgb: 'FFF8E1' }, patternType: 'solid' },
  },
  OBSERVAR: {
    font: { color: { rgb: '2E7D32' } },
    fill: { fgColor: { rgb: 'E8F5E9' }, patternType: 'solid' },
  },
  INDICADOR: {
    font: { color: { rgb: '1565C0' } },
    fill: { fgColor: { rgb: 'E3F2FD' }, patternType: 'solid' },
  },
};

const HEADER_STYLE: XLSX.CellStyle = {
  font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
  fill: { fgColor: { rgb: '3F51B5' }, patternType: 'solid' },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: {
    bottom: { style: 'thin', color: { rgb: '000000' } },
  },
};

const TITLE_STYLE: XLSX.CellStyle = {
  font: { bold: true, sz: 14, color: { rgb: '1A237E' } },
};

const LABEL_STYLE: XLSX.CellStyle = {
  font: { bold: true, sz: 10 },
};

// ─── Aplica estilo a un rango de celdas en una fila ─────────
function applyRowStyle(ws: XLSX.WorkSheet, row: number, numCols: number, style: XLSX.CellStyle) {
  for (let c = 0; c < numCols; c++) {
    const addr = XLSX.utils.encode_cell({ r: row, c });
    if (!ws[addr]) {
      ws[addr] = { v: '', t: 's' };
    }
    ws[addr].s = style;
  }
}

export class ExportService {
  public static exportToExcel(results: ValidationResult[], metadata: FileMetadata, establishment: Establishment | null) {
    const wb = XLSX.utils.book_new();

    // ─── 1. Hoja Resumen ────────────────────────────────
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

    // Estilo al título del resumen
    if (wsSummary['A1']) wsSummary['A1'].s = TITLE_STYLE;

    // Estilo a las etiquetas
    [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13].forEach(row => {
      const addr = XLSX.utils.encode_cell({ r: row, c: 0 });
      if (wsSummary[addr]) wsSummary[addr].s = LABEL_STYLE;
    });

    wsSummary['!cols'] = [{ wch: 22 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

    // ─── 2. Hoja Detalle con colores por severidad ──────
    const detailsHeader = ['ID Regla', 'Hoja REM', 'Severidad', 'Estado', 'Descripción', 'Valor Actual', 'Valor Esperado', 'Mensaje'];
    const detailsData = results.map(r => [
      r.ruleId,
      r.rem_sheet || '',
      r.severidad,
      r.resultado ? 'CUMPLE' : 'FALLA',
      r.descripcion,
      r.valorActual ?? '',
      r.valorEsperado ?? '',
      r.mensaje || ''
    ]);
    const wsDetails = XLSX.utils.aoa_to_sheet([detailsHeader, ...detailsData]);

    // Estilo al header
    const numCols = detailsHeader.length;
    applyRowStyle(wsDetails, 0, numCols, HEADER_STYLE);

    // Estilo condicional por severidad a cada fila de datos
    results.forEach((r, idx) => {
      const dataRow = idx + 1; // row 0 es header
      const severity = r.severidad;
      const style = SEVERITY_STYLES[severity];
      if (style && !r.resultado) {
        applyRowStyle(wsDetails, dataRow, numCols, style);
      }
    });

    // Anchos de columna
    wsDetails['!cols'] = [
      { wch: 10 }, // ID Regla
      { wch: 8 },  // Hoja REM
      { wch: 12 }, // Severidad
      { wch: 8 },  // Estado
      { wch: 60 }, // Descripción
      { wch: 15 }, // Valor Actual
      { wch: 15 }, // Valor Esperado
      { wch: 40 }, // Mensaje
    ];

    XLSX.utils.book_append_sheet(wb, wsDetails, 'Detalle Errores');

    // Generar nombre y descargar
    const filename = `Resultados_Validacion_${metadata.codigoEstablecimiento}_${metadata.serieRem}_${metadata.mes}.xlsx`;
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
    const headers = ['Severidad', 'ID Regla', 'Descripción', 'Hoja', 'Celda', 'Mensaje', 'Valor', 'Esperado'];
    const rows = results.map(r => [
      r.severidad,
      r.ruleId,
      `"${r.descripcion.replace(/"/g, '""')}"`,
      r.rem_sheet || '',
      r.cell || '',
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
