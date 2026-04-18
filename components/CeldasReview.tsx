import React, { useCallback, useMemo, useState } from 'react';
import { ExcelReaderService } from '../services/excelService';
import celdasCatalogRaw from '../data/celdas.catalog.json';
import { CellCatalogData, CellReadResult, CellReadStatus } from '../types';

interface CeldasReviewProps {
  fileName: string;
}

const CELL_REF_REGEX = /^[A-Z]+\d+$/;
const celdasCatalog = celdasCatalogRaw as CellCatalogData;

const mapRemSheet = (sheetLabel: string): string => {
  const raw = String(sheetLabel || '').trim();
  if (!raw) return raw;

  const upper = raw.toUpperCase();
  if (upper === 'REM30R') return 'A30AR';
  if (!upper.startsWith('REM')) return raw;

  return `A${raw.slice(3)}`;
};

const getValueType = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

const normalizeValue = (value: unknown): string | number | boolean | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
    return value;
  }
  if (value instanceof Date) return value.toISOString();
  return String(value);
};

const statusLabel: Record<CellReadStatus, string> = {
  OK: 'Con dato',
  CELDA_VACIA: 'Vacía',
  CELDA_INVALIDA: 'Referencia inválida',
  HOJA_NO_EXISTE: 'Hoja no existe',
};

const statusStyle: Record<CellReadStatus, React.CSSProperties> = {
  OK: {
    backgroundColor: 'var(--semantic-success-soft)',
    color: 'var(--semantic-success)',
    border: '1px solid var(--semantic-success-border)',
  },
  CELDA_VACIA: {
    backgroundColor: 'var(--control-bg)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
  },
  CELDA_INVALIDA: {
    backgroundColor: 'var(--semantic-warning-soft)',
    color: 'var(--semantic-warning)',
    border: '1px solid var(--semantic-warning-border)',
  },
  HOJA_NO_EXISTE: {
    backgroundColor: 'var(--semantic-error-soft)',
    color: 'var(--semantic-error)',
    border: '1px solid var(--semantic-error-border)',
  },
};

const CeldasReview: React.FC<CeldasReviewProps> = ({ fileName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CellReadStatus>('ALL');
  const [sheetFilter, setSheetFilter] = useState<string>('ALL');

  const rows = useMemo<CellReadResult[]>(() => {
    const excelService = ExcelReaderService.getInstance();

    return celdasCatalog.entries.map((entry, index) => {
      const celda = String(entry.celda || '').trim();
      const hojaSistema = mapRemSheet(entry.hojaRem);

      if (!CELL_REF_REGEX.test(celda)) {
        return {
          ...entry,
          indice: index + 2,
          hojaSistema,
          valor: null,
          tipoValor: '',
          estado: 'CELDA_INVALIDA',
        };
      }

      const sheetExists = excelService.getSheets().includes(hojaSistema);
      if (!sheetExists) {
        return {
          ...entry,
          indice: index + 2,
          hojaSistema,
          valor: null,
          tipoValor: '',
          estado: 'HOJA_NO_EXISTE',
        };
      }

      const rawValue = excelService.getCellValue(hojaSistema, celda);
      const estado: CellReadStatus = rawValue === null || rawValue === undefined || rawValue === ''
        ? 'CELDA_VACIA'
        : 'OK';

      return {
        ...entry,
        indice: index + 2,
        hojaSistema,
        valor: normalizeValue(rawValue),
        tipoValor: getValueType(rawValue),
        estado,
      };
    });
  }, [fileName]);

  const summary = useMemo(() => {
    const counts: Record<CellReadStatus, number> = {
      OK: 0,
      CELDA_VACIA: 0,
      CELDA_INVALIDA: 0,
      HOJA_NO_EXISTE: 0,
    };

    rows.forEach((row) => {
      counts[row.estado] += 1;
    });

    return counts;
  }, [rows]);

  const sheets = useMemo(() => {
    return Array.from(new Set(rows.map((row) => row.hojaRem))).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (statusFilter !== 'ALL' && row.estado !== statusFilter) return false;
      if (sheetFilter !== 'ALL' && row.hojaRem !== sheetFilter) return false;

      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        row.codigo.toLowerCase().includes(term) ||
        row.hojaRem.toLowerCase().includes(term) ||
        row.celda.toLowerCase().includes(term) ||
        row.validacion.toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, statusFilter, sheetFilter]);

  const handleExportJson = useCallback(() => {
    const payload = {
      generatedAt: new Date().toISOString(),
      sourceWorkbook: fileName,
      totalRows: rows.length,
      summary,
      rows,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const baseName = fileName.replace(/\.[^.]+$/, '');
    anchor.href = url;
    anchor.download = `celdas_leidas_${baseName}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [fileName, rows, summary]);

  return (
    <div className="deis-card overflow-hidden">
      <div className="p-5 sm:p-6" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Lectura de Celdas</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Archivo: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{fileName}</span>
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Catalogo fuente: {celdasCatalog.sourceFile} ({celdasCatalog.totalRows} filas)
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--brand-accent)',
              color: 'var(--text-on-brand)',
            }}
          >
            Descargar JSON
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(summary).map(([status, count]) => (
            <div key={status} className="rounded-xl px-3 py-2" style={statusStyle[status as CellReadStatus]}>
              <p className="text-[11px] uppercase tracking-wide font-semibold">{statusLabel[status as CellReadStatus]}</p>
              <p className="text-lg font-semibold mt-0.5">{count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por codigo, hoja, celda o validacion..."
            className="w-full md:flex-1 px-3 py-2 rounded-xl text-sm"
            style={{
              backgroundColor: 'var(--control-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
            }}
          />

          <select
            value={sheetFilter}
            onChange={(event) => setSheetFilter(event.target.value)}
            className="px-3 py-2 rounded-xl text-sm"
            style={{
              backgroundColor: 'var(--control-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <option value="ALL">Todas las hojas</option>
            {sheets.map((sheet) => (
              <option key={sheet} value={sheet}>{sheet}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'ALL' | CellReadStatus)}
            className="px-3 py-2 rounded-xl text-sm"
            style={{
              backgroundColor: 'var(--control-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <option value="ALL">Todos los estados</option>
            <option value="OK">Con dato</option>
            <option value="CELDA_VACIA">Vacias</option>
            <option value="CELDA_INVALIDA">Referencia invalida</option>
            <option value="HOJA_NO_EXISTE">Hoja no existe</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left" style={{ minWidth: '980px' }}>
          <thead style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-canvas)' }}>
            <tr>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Codigo</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Hoja</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Hoja sistema</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Celda</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Valor</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Tipo</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr
                key={`${row.codigo}-${row.hojaRem}-${row.celda}-${row.indice}`}
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{row.codigo}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.hojaRem}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.hojaSistema}</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{row.celda}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                  {row.valor === null ? '—' : String(row.valor)}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.tipoValor || '—'}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={statusStyle[row.estado]}>
                    {statusLabel[row.estado]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CeldasReview;
