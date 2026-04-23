import React, { useCallback, useMemo, useState } from 'react';
import { ExcelReaderService } from '../services/excelService';
import celdasCatalogRaw from '../data/celdas.catalog.json';
import reglasFinalesRaw from '../data/reglas_finales.json';
import { CellCatalogData, CellReadResult, CellReadStatus, ValidationRule } from '../types';

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

type RuleTone = {
  badge: React.CSSProperties;
  row: React.CSSProperties;
  hoverRow: React.CSSProperties;
};

type MessagePartType = 'rem' | 'section' | 'text' | 'separator';

interface MessagePart {
  value: string;
  type: MessagePartType;
}

const REM_TOKEN_REGEX = /\bREM\s+[A-Z0-9]+\b/i;
const SECTION_TOKEN_REGEX = /\bSECCI[ÓO]N(?:\s+[A-Z0-9.]+)?\s*:[^|,]+|\bSECCI[ÓO]N\s+[A-Z0-9.]+/i;
const INLINE_TOKEN_REGEX = /\bREM\s+[A-Z0-9]+\b|\bSECCI[ÓO]N(?:\s+[A-Z0-9.]+)?\s*:[^|,]+|\bSECCI[ÓO]N\s+[A-Z0-9.]+/gi;

const classifyPart = (part: string): MessagePartType => {
  if (SECTION_TOKEN_REGEX.test(part)) return 'section';
  if (REM_TOKEN_REGEX.test(part)) return 'rem';
  return 'text';
};

const tokenizePipeMessage = (descripcion: string): MessagePart[] => {
  const parts = descripcion.split('|').map((part) => part.trim()).filter(Boolean);
  if (parts.length <= 1) return [{ value: descripcion, type: 'text' }];

  const tokens: MessagePart[] = [];
  parts.forEach((part, index) => {
    tokens.push({ value: part, type: classifyPart(part) });
    if (index < parts.length - 1) tokens.push({ value: '|', type: 'separator' });
  });
  return tokens;
};

const tokenizeInlineMessage = (descripcion: string): MessagePart[] => {
  const tokens: MessagePart[] = [];
  let lastIndex = 0;

  for (const match of descripcion.matchAll(INLINE_TOKEN_REGEX)) {
    if (match.index === undefined) continue;

    const start = match.index;
    const token = match[0];

    if (start > lastIndex) {
      tokens.push({ value: descripcion.slice(lastIndex, start), type: 'text' });
    }

    tokens.push({ value: token, type: classifyPart(token) });
    lastIndex = start + token.length;
  }

  if (lastIndex < descripcion.length) {
    tokens.push({ value: descripcion.slice(lastIndex), type: 'text' });
  }

  return tokens.length > 0 ? tokens : [{ value: descripcion, type: 'text' }];
};

const renderFormattedMessage = (descripcion: string) => {
  if (!descripcion) return '';

  const tokens = descripcion.includes('|') ? tokenizePipeMessage(descripcion) : tokenizeInlineMessage(descripcion);

  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === 'separator') {
          return <span key={`sep-${index}`} className="mx-1" style={{ color: 'var(--text-muted)' }}>|</span>;
        }

        if (token.type === 'rem') {
          return <span key={`rem-${index}`} className="font-bold" style={{ color: 'var(--text-primary)' }}>{token.value}</span>;
        }

        if (token.type === 'section') {
          return <span key={`sec-${index}`} className="font-bold" style={{ color: '#10b981' }}>{token.value}</span>;
        }

        return <span key={`txt-${index}`}>{token.value}</span>;
      })}
    </>
  );
};

const getRuleTone = (ruleCode: string): RuleTone => {
  const palette = [
    {
      badge: { backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#1d4ed8', border: '1px solid rgba(37, 99, 235, 0.22)' },
      row: { backgroundColor: 'rgba(37, 99, 235, 0.045)', borderLeft: '4px solid rgba(37, 99, 235, 0.28)' },
      hoverRow: { backgroundColor: 'rgba(37, 99, 235, 0.085)', borderLeft: '4px solid rgba(37, 99, 235, 0.42)' },
    },
    {
      badge: { backgroundColor: 'rgba(5, 150, 105, 0.12)', color: '#047857', border: '1px solid rgba(5, 150, 105, 0.22)' },
      row: { backgroundColor: 'rgba(5, 150, 105, 0.045)', borderLeft: '4px solid rgba(5, 150, 105, 0.28)' },
      hoverRow: { backgroundColor: 'rgba(5, 150, 105, 0.085)', borderLeft: '4px solid rgba(5, 150, 105, 0.42)' },
    },
    {
      badge: { backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#6d28d9', border: '1px solid rgba(124, 58, 237, 0.22)' },
      row: { backgroundColor: 'rgba(124, 58, 237, 0.045)', borderLeft: '4px solid rgba(124, 58, 237, 0.28)' },
      hoverRow: { backgroundColor: 'rgba(124, 58, 237, 0.085)', borderLeft: '4px solid rgba(124, 58, 237, 0.42)' },
    },
    {
      badge: { backgroundColor: 'rgba(217, 119, 6, 0.12)', color: '#b45309', border: '1px solid rgba(217, 119, 6, 0.22)' },
      row: { backgroundColor: 'rgba(217, 119, 6, 0.045)', borderLeft: '4px solid rgba(217, 119, 6, 0.28)' },
      hoverRow: { backgroundColor: 'rgba(217, 119, 6, 0.085)', borderLeft: '4px solid rgba(217, 119, 6, 0.42)' },
    },
    {
      badge: { backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#b91c1c', border: '1px solid rgba(220, 38, 38, 0.22)' },
      row: { backgroundColor: 'rgba(220, 38, 38, 0.045)', borderLeft: '4px solid rgba(220, 38, 38, 0.28)' },
      hoverRow: { backgroundColor: 'rgba(220, 38, 38, 0.085)', borderLeft: '4px solid rgba(220, 38, 38, 0.42)' },
    },
    {
      badge: { backgroundColor: 'rgba(8, 145, 178, 0.12)', color: '#0e7490', border: '1px solid rgba(8, 145, 178, 0.22)' },
      row: { backgroundColor: 'rgba(8, 145, 178, 0.045)', borderLeft: '4px solid rgba(8, 145, 178, 0.28)' },
      hoverRow: { backgroundColor: 'rgba(8, 145, 178, 0.085)', borderLeft: '4px solid rgba(8, 145, 178, 0.42)' },
    },
  ];

  const hash = Array.from(ruleCode).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
};

const normalizeCatalogRuleCode = (ruleCode: string): string => ruleCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();

const reglasFinales = reglasFinalesRaw as Record<string, ValidationRule[]>;

const allRules = Object.values(reglasFinales).flat() as ValidationRule[];

const rulesBySheetAndCode = new Map(
  allRules.map((rule) => {
    const ruleSuffix = String(rule.id || '').split('-').pop() || '';
    return [`${rule.rem_sheet}|${normalizeCatalogRuleCode(ruleSuffix)}`, rule] as const;
  }),
);

const findRuleForRow = (row: Pick<CellReadResult, 'codigo' | 'hojaSistema'>): ValidationRule | null => {
  const normalizedCode = normalizeCatalogRuleCode(row.codigo);
  return (
    rulesBySheetAndCode.get(`${row.hojaSistema}|${normalizedCode}`) ||
    rulesBySheetAndCode.get(`${row.hojaSistema.replace('AR', 'R')}|${normalizedCode}`) ||
    null
  );
};

const getRowTooltip = (row: CellReadResult, rule: ValidationRule | null): string => {
  const message = String(rule?.mensaje || row.validacion || '').trim();
  return [
    `Regla: ${row.codigo}`,
    `Hoja: ${rule?.rem_sheet || row.hojaSistema}`,
    `Celda: ${row.celda}`,
    message ? `Detalle: ${message}` : '',
  ].filter(Boolean).join('\n');
};

const CeldasReview: React.FC<CeldasReviewProps> = ({ fileName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CellReadStatus>('ALL');
  const [sheetFilter, setSheetFilter] = useState<string>('ALL');
  const [ruleFilter, setRuleFilter] = useState<string>('ALL');
  const [popoverState, setPopoverState] = useState<{ row: CellReadResult; top: number; left: number } | null>(null);

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
      if (ruleFilter !== 'ALL' && row.codigo !== ruleFilter) return false;

      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        row.codigo.toLowerCase().includes(term) ||
        row.hojaRem.toLowerCase().includes(term) ||
        row.celda.toLowerCase().includes(term) ||
        row.validacion.toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, statusFilter, sheetFilter, ruleFilter]);

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

  const selectedRow = popoverState?.row ?? null;

  const handleCloseModal = useCallback(() => {
    setPopoverState(null);
  }, []);

  const openRulePopover = useCallback((row: CellReadResult, event: React.MouseEvent<HTMLElement>) => {
    const popoverWidth = 360;
    const popoverHeight = 340;
    const margin = 16;
    const offset = 12;
    const left = Math.min(
      Math.max(margin, event.clientX + offset),
      Math.max(margin, window.innerWidth - popoverWidth - margin),
    );
    const top = Math.min(
      Math.max(margin, event.clientY + offset),
      Math.max(margin, window.innerHeight - popoverHeight - margin),
    );

    setPopoverState({ row, top, left });
  }, []);

  const handleFilterByRule = useCallback((ruleCode: string) => {
    setRuleFilter(ruleCode);
    setPopoverState(null);
  }, []);

  const clearRuleFilter = useCallback(() => {
    setRuleFilter('ALL');
  }, []);

  const selectedRule = useMemo(() => {
    if (!selectedRow) return null;
    return findRuleForRow(selectedRow);
  }, [selectedRow]);

  const selectedRuleRows = useMemo(() => {
    if (!selectedRow) return [];

    return rows.filter((row) => row.codigo === selectedRow.codigo && row.hojaSistema === selectedRow.hojaSistema);
  }, [rows, selectedRow]);

  return (
    <>
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
              {ruleFilter !== 'ALL' ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium" style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                  <span>Filtro activo:</span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{ruleFilter}</span>
                  <button
                    type="button"
                    onClick={clearRuleFilter}
                    className="rounded-full px-2 py-0.5"
                    style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
                  >
                    Quitar
                  </button>
                </div>
              ) : null}
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
              {filteredRows.map((row) => {
                const ruleTone = getRuleTone(row.codigo);
                const linkedRule = findRuleForRow(row);
                const rowTooltip = getRowTooltip(row, linkedRule);
                const rowIndex = filteredRows.findIndex((candidate) => candidate.indice === row.indice);
                const previousRow = rowIndex > 0 ? filteredRows[rowIndex - 1] : null;
                const nextRow = rowIndex < filteredRows.length - 1 ? filteredRows[rowIndex + 1] : null;
                const sameAsPrevious = previousRow?.codigo === row.codigo && previousRow?.hojaSistema === row.hojaSistema;
                const sameAsNext = nextRow?.codigo === row.codigo && nextRow?.hojaSistema === row.hojaSistema;
                const isGroupStart = !sameAsPrevious;
                const isGroupEnd = !sameAsNext;
                const groupRowStyle: React.CSSProperties = {
                  ...ruleTone.row,
                  borderTop: isGroupStart ? ruleTone.badge.border : '1px solid transparent',
                  borderBottom: isGroupEnd ? ruleTone.badge.border : '1px solid transparent',
                };
                const groupHoverStyle: React.CSSProperties = {
                  ...ruleTone.hoverRow,
                  borderTop: isGroupStart ? ruleTone.badge.border : '1px solid transparent',
                  borderBottom: isGroupEnd ? ruleTone.badge.border : '1px solid transparent',
                };

                return (
                  <tr
                    key={`${row.codigo}-${row.hojaRem}-${row.celda}-${row.indice}`}
                    className="cursor-pointer transition-colors"
                    style={groupRowStyle}
                    onClick={(event) => openRulePopover(row, event)}
                    onMouseEnter={(event) => {
                      Object.assign(event.currentTarget.style, groupHoverStyle);
                    }}
                    onMouseLeave={(event) => {
                      Object.assign(event.currentTarget.style, groupRowStyle);
                    }}
                  >
                    <td className="px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openRulePopover(row, event);
                        }}
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold font-mono transition-transform hover:scale-[1.02]"
                        style={{ ...ruleTone.badge, opacity: isGroupStart ? 1 : 0.72 }}
                        aria-label={`Ver detalle de la regla ${row.codigo}`}
                        title={rowTooltip}
                      >
                        <span>{isGroupStart ? row.codigo : `↳ ${row.codigo}`}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.hojaRem}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.hojaSistema}</td>
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--text-primary)' }} title={rowTooltip}>{row.celda}</td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRow ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Cerrar popover de regla"
            className="absolute inset-0"
            style={{ backgroundColor: 'transparent' }}
            onClick={handleCloseModal}
          />

          <div
            className="absolute w-[min(360px,calc(100vw-32px))] rounded-2xl p-4"
            style={{
              top: `${popoverState?.top ?? 0}px`,
              left: `${popoverState?.left ?? 0}px`,
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold font-mono" style={getRuleTone(selectedRow.codigo).badge}>
                  <span>{selectedRow.codigo}</span>
                </div>
                <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Explicacion de la validacion</p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-full p-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                Hoja: {selectedRule?.rem_sheet || selectedRow.hojaSistema}
              </span>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}
                title={getRowTooltip(selectedRow, selectedRule)}
              >
                Celda: {selectedRow.celda}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--control-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                Severidad: {selectedRule?.severidad || selectedRow.severidad}
              </span>
            </div>

            <div className="mt-3 rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-default)' }}>
              <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Explicacion</p>
              <div className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {selectedRule?.mensaje ? renderFormattedMessage(selectedRule.mensaje) : selectedRow.validacion}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {selectedRuleRows.length} celdas asociadas
              </div>
              <button
                type="button"
                onClick={() => handleFilterByRule(selectedRow.codigo)}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--text-on-brand)' }}
              >
                Ver solo esta regla
              </button>
            </div>

            {!selectedRule ? (
              <div className="mt-3 rounded-2xl p-3 text-sm" style={{ backgroundColor: 'var(--semantic-warning-soft)', color: 'var(--semantic-warning)', border: '1px solid var(--semantic-warning-border)' }}>
                No se encontro el detalle completo de la regla en el diccionario. Se muestra la validacion del catalogo de celdas.
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CeldasReview;
