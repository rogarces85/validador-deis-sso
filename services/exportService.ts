
import XLSX from 'xlsx-js-style';
import { ValidationResult, FileMetadata, Establishment } from '../types';

// ─── Colores consistentes con la UI (DEIS palette) ──────────
const BRAND_NAVY = '0D2137';
const BRAND_OCEAN = '2196C8';
const BRAND_CYAN = '00BCD4';
const WHITE = 'FFFFFF';
const LIGHT_BG = 'F0F6FA';

// ─── Estilos por Severidad (mismos colores de la tabla web) ──
const SEVERITY_FILL: Record<string, { font: string; bg: string }> = {
  ERROR: { font: 'DC2626', bg: 'FEF2F2' },
  REVISAR: { font: 'D97706', bg: 'FFFBEB' },
  INDICADOR: { font: '2563EB', bg: 'EFF6FF' },
};

const PASS_COLOR = '059669';
const FAIL_COLOR = 'DC2626';

// ─── Estilos reutilizables ──────────────────────────────────
function makeHeaderStyle(): XLSX.CellStyle {
  return {
    font: { bold: true, color: { rgb: WHITE }, sz: 11, name: 'Calibri' },
    fill: { fgColor: { rgb: BRAND_NAVY }, patternType: 'solid' },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      bottom: { style: 'thin', color: { rgb: BRAND_OCEAN } },
      top: { style: 'thin', color: { rgb: BRAND_OCEAN } },
      left: { style: 'thin', color: { rgb: BRAND_OCEAN } },
      right: { style: 'thin', color: { rgb: BRAND_OCEAN } },
    },
  };
}

function makeTitleStyle(): XLSX.CellStyle {
  return {
    font: { bold: true, sz: 14, color: { rgb: BRAND_NAVY }, name: 'Calibri' },
  };
}

function makeLabelStyle(): XLSX.CellStyle {
  return {
    font: { bold: true, sz: 10, color: { rgb: '3D5A73' }, name: 'Calibri' },
  };
}

function makeValueStyle(): XLSX.CellStyle {
  return {
    font: { sz: 10, color: { rgb: BRAND_NAVY }, name: 'Calibri' },
  };
}

function makeSeverityBadgeStyle(severity: string): XLSX.CellStyle {
  const cfg = SEVERITY_FILL[severity] || { font: BRAND_NAVY, bg: LIGHT_BG };
  return {
    font: { bold: true, color: { rgb: cfg.font }, sz: 10, name: 'Calibri' },
    fill: { fgColor: { rgb: cfg.bg }, patternType: 'solid' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
      left: { style: 'thin', color: { rgb: 'E5E7EB' } },
      right: { style: 'thin', color: { rgb: 'E5E7EB' } },
    },
  };
}

function makeStatusStyle(passed: boolean): XLSX.CellStyle {
  const color = passed ? PASS_COLOR : FAIL_COLOR;
  return {
    font: { bold: true, color: { rgb: color }, sz: 10, name: 'Calibri' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
      left: { style: 'thin', color: { rgb: 'E5E7EB' } },
      right: { style: 'thin', color: { rgb: 'E5E7EB' } },
    },
  };
}

function makeDataCellStyle(zebra: boolean): XLSX.CellStyle {
  return {
    font: { sz: 10, color: { rgb: BRAND_NAVY }, name: 'Calibri' },
    fill: zebra ? { fgColor: { rgb: 'F8FBFD' }, patternType: 'solid' } : undefined,
    alignment: { vertical: 'center', wrapText: true },
    border: {
      bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
      left: { style: 'thin', color: { rgb: 'E5E7EB' } },
      right: { style: 'thin', color: { rgb: 'E5E7EB' } },
    },
  };
}

function makeMonoStyle(zebra: boolean): XLSX.CellStyle {
  return {
    font: { sz: 10, color: { rgb: BRAND_NAVY }, name: 'Consolas' },
    fill: zebra ? { fgColor: { rgb: 'F8FBFD' }, patternType: 'solid' } : undefined,
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
      left: { style: 'thin', color: { rgb: 'E5E7EB' } },
      right: { style: 'thin', color: { rgb: 'E5E7EB' } },
    },
  };
}

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

function applyCellStyle(ws: XLSX.WorkSheet, row: number, col: number, style: XLSX.CellStyle) {
  const addr = XLSX.utils.encode_cell({ r: row, c: col });
  if (!ws[addr]) ws[addr] = { v: '', t: 's' };
  ws[addr].s = style;
}

// ─── Mes helper ─────────────────────────────────────────────
const MONTH_NAMES: Record<string, string> = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
  '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
  '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
};

// ═══════════════════════════════════════════════════════════════
// EXPORT TO EXCEL — replica la tabla de la UI lo más posible
// ═══════════════════════════════════════════════════════════════
export class ExportService {
  public static exportToExcel(results: ValidationResult[], metadata: FileMetadata, establishment: Establishment | null) {
    const wb = XLSX.utils.book_new();

    // ──────────── Stats (single pass) ────────────
    let totalPassed = 0;
    let totalFailed = 0;
    let errCount = 0;
    let revisarCount = 0;
    let indicadorCount = 0;
    for (const r of results) {
      if (r.resultado) {
        totalPassed++;
      } else {
        totalFailed++;
        if (r.severidad === 'ERROR') errCount++;
        else if (r.severidad === 'REVISAR') revisarCount++;
        else if (r.severidad === 'INDICADOR') indicadorCount++;
      }
    }
    const passRate = results.length > 0 ? Math.round((totalPassed / results.length) * 100) : 0;

    // ═════════════════════════════════════════════════
    // HOJA 1: RESUMEN
    // ═════════════════════════════════════════════════
    const summaryData = [
      ['RESUMEN DE VALIDACIÓN REM'],
      [''],
      ['Archivo:', metadata.nombreOriginal],
      ['Establecimiento:', establishment?.nombre || 'No identificado'],
      ['Código DEIS:', metadata.codigoEstablecimiento],
      ['Serie REM:', metadata.serieRem],
      ['Mes:', `${MONTH_NAMES[metadata.mes] || metadata.mes} ${metadata.periodo || '2026'}`],
      ['Fecha Proceso:', new Date().toLocaleString()],
      [''],
      ['ESTADÍSTICAS'],
      ['Total Reglas:', results.length],
      ['Aprobadas:', totalPassed],
      ['Fallidas:', totalFailed],
      ['Tasa Aprobación:', `${passRate}%`],
      [''],
      ['DESGLOSE POR SEVERIDAD'],
      ['🔴 Errores:', errCount],
      ['🟡 A Revisar:', revisarCount],
      ['🔵 Indicadores:', indicadorCount],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

    if (wsSummary['A1']) wsSummary['A1'].s = makeTitleStyle();
    if (wsSummary['A10']) wsSummary['A10'].s = { font: { bold: true, sz: 12, color: { rgb: BRAND_OCEAN }, name: 'Calibri' } };
    if (wsSummary['A16']) wsSummary['A16'].s = { font: { bold: true, sz: 12, color: { rgb: BRAND_OCEAN }, name: 'Calibri' } };

    // Label styles
    [2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 16, 17, 18].forEach(row => {
      applyCellStyle(wsSummary, row, 0, makeLabelStyle());
      applyCellStyle(wsSummary, row, 1, makeValueStyle());
    });

    wsSummary['!cols'] = [{ wch: 24 }, { wch: 45 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

    // ═════════════════════════════════════════════════
    // HOJA 2: HALLAZGOS (replica la FindingsTable)
    // Columnas: Estado | Descripción | ID Regla | Celda | Hoja REM | Severidad | Valor Actual | Valor Esperado | Comparación | Diferencia
    // ═════════════════════════════════════════════════
    const headers = ['Estado', 'Descripción', 'ID Regla', 'Celda', 'Hoja REM', 'Severidad', 'Valor Actual', 'Valor Esperado', 'Comparación', 'Diferencia'];
    const numCols = headers.length;

    const dataRows = results.map(r => [
      r.resultado ? '✓ OK' : '✗ FALLA',
      r.descripcion,
      r.ruleId,
      r.cell || '',
      r.rem_sheet || '',
      r.severidad,
      r.valorActual != null ? String(r.valorActual) : '',
      r.valorEsperado != null ? String(r.valorEsperado) : '',
      r.comparacion || '',
      typeof r.diferencia === 'number' ? String(r.diferencia) : '',
    ]);

    const wsTable = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);

    // Style headers
    const headerStyle = makeHeaderStyle();
    applyRowStyle(wsTable, 0, numCols, headerStyle);

    // Style data rows — match the table look with zebra striping and severity colors
    results.forEach((r, idx) => {
      const rowNum = idx + 1;
      const zebra = idx % 2 === 1;
      const baseStyle = makeDataCellStyle(zebra);
      const monoStyle = makeMonoStyle(zebra);

      // Col 0: Estado
      applyCellStyle(wsTable, rowNum, 0, makeStatusStyle(r.resultado));
      // Col 1: Descripción
      applyCellStyle(wsTable, rowNum, 1, baseStyle);
      // Col 2: ID Regla
      applyCellStyle(wsTable, rowNum, 2, monoStyle);
      // Col 3: Celda
      applyCellStyle(wsTable, rowNum, 3, monoStyle);
      // Col 4: Hoja REM
      applyCellStyle(wsTable, rowNum, 4, monoStyle);
      // Col 5: Severidad — use severity badge coloring
      applyCellStyle(wsTable, rowNum, 5, makeSeverityBadgeStyle(r.severidad));
      // Col 6: Valor Actual
      applyCellStyle(wsTable, rowNum, 6, monoStyle);
      // Col 7: Valor Esperado
      applyCellStyle(wsTable, rowNum, 7, monoStyle);
      // Col 8: Comparación
      applyCellStyle(wsTable, rowNum, 8, monoStyle);
      // Col 9: Diferencia
      applyCellStyle(wsTable, rowNum, 9, monoStyle);
    });

    // Column widths matching the visual weight of the on-screen table
    wsTable['!cols'] = [
      { wch: 10 }, // Estado
      { wch: 55 }, // Descripción
      { wch: 14 }, // ID Regla
      { wch: 8 },  // Celda
      { wch: 10 }, // Hoja REM
      { wch: 14 }, // Severidad
      { wch: 14 }, // Valor Actual
      { wch: 14 }, // Valor Esperado
      { wch: 24 }, // Comparación
      { wch: 12 }, // Diferencia
    ];

    // Freeze header row
    wsTable['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Auto-filter
    wsTable['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: results.length, c: numCols - 1 } }) };

    XLSX.utils.book_append_sheet(wb, wsTable, 'Hallazgos');

    // ═════════════════════════════════════════════════
    // HOJA 3: SOLO ERRORES (filtrado pre-aplicado)
    // ═════════════════════════════════════════════════
    const failedResults = results.filter(r => !r.resultado);
    if (failedResults.length > 0) {
      const failedRows = failedResults.map(r => [
        r.severidad,
        r.descripcion,
        r.ruleId,
        r.cell || '',
        r.rem_sheet || '',
        r.valorActual != null ? String(r.valorActual) : '',
        r.valorEsperado != null ? String(r.valorEsperado) : '',
        r.comparacion || '',
        typeof r.diferencia === 'number' ? String(r.diferencia) : '',
        r.mensaje || r.evidence || '',
      ]);
      const failedHeaders = ['Severidad', 'Descripción', 'ID Regla', 'Celda', 'Hoja REM', 'Valor Actual', 'Valor Esperado', 'Comparación', 'Diferencia', 'Detalle'];
      const wsErrors = XLSX.utils.aoa_to_sheet([failedHeaders, ...failedRows]);

      const failedNumCols = failedHeaders.length;
      applyRowStyle(wsErrors, 0, failedNumCols, {
        font: { bold: true, color: { rgb: WHITE }, sz: 11, name: 'Calibri' },
        fill: { fgColor: { rgb: 'DC2626' }, patternType: 'solid' },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: { bottom: { style: 'thin', color: { rgb: 'B91C1C' } } },
      });

      failedResults.forEach((r, idx) => {
        const rowNum = idx + 1;
        applyCellStyle(wsErrors, rowNum, 0, makeSeverityBadgeStyle(r.severidad));
        for (let c = 1; c < failedNumCols; c++) {
          applyCellStyle(wsErrors, rowNum, c, makeDataCellStyle(idx % 2 === 1));
        }
      });

      wsErrors['!cols'] = [
        { wch: 14 }, { wch: 55 }, { wch: 14 }, { wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 24 }, { wch: 12 }, { wch: 40 },
      ];

      XLSX.utils.book_append_sheet(wb, wsErrors, 'Solo Errores');
    }

    // Generar nombre y descargar
    const filename = `Validacion_${metadata.codigoEstablecimiento}_${metadata.serieRem}_${MONTH_NAMES[metadata.mes] || metadata.mes}_${metadata.periodo || '2026'}.xlsx`;
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
    const headers = ['Severidad', 'ID Regla', 'Descripción', 'Hoja', 'Celda', 'Mensaje', 'Valor', 'Esperado', 'Comparación', 'Diferencia'];
    const rows = results.map(r => [
      r.severidad,
      r.ruleId,
      `"${r.descripcion.replace(/"/g, '""')}"`,
      r.rem_sheet || '',
      r.cell || '',
      `"${(r.mensaje || '').replace(/"/g, '""')}"`,
      r.valorActual,
      r.valorEsperado,
      `"${(r.comparacion || '').replace(/"/g, '""')}"`,
      r.diferencia ?? ''
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
