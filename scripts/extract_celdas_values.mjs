import XLSX from 'xlsx-js-style';
import { writeFile } from 'node:fs/promises';

const targetWorkbook = process.argv[2] || '123304A01.xlsm';
const celdasWorkbook = process.argv[3] || 'celdas.xlsx';
const outputBase = process.argv[4] || targetWorkbook.replace(/\.[^.]+$/, '');

const mapRemSheet = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return raw;

  const upper = raw.toUpperCase();
  if (upper === 'REM30R') return 'A30AR';
  if (!upper.startsWith('REM')) return raw;

  return `A${raw.slice(3)}`;
};

const isCellRef = (value) => /^[A-Z]+\d+$/.test(String(value || '').trim());

const cwb = XLSX.readFile(celdasWorkbook);
const cws = cwb.Sheets[cwb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(cws, { defval: '' });

const wb = XLSX.readFile(targetWorkbook);

const report = rows.map((row, index) => {
  const codigo = String(row['CÓDIGO'] || '').trim();
  const severidad = String(row['SEVERIDAD'] || '').trim();
  const hojaRem = String(row['HOJA REM'] || '').trim();
  const seccion = String(row['SECCIÓN'] || '').trim();
  const validacion = String(row['VALIDACIÓN'] || '').trim();
  const celda = String(row['CELDA'] || '').trim();
  const hojaSistema = mapRemSheet(hojaRem);

  let estado = 'OK';
  let valor = null;
  let tipo = '';

  if (!isCellRef(celda)) {
    estado = 'CELDA_INVALIDA';
  } else if (!wb.Sheets[hojaSistema]) {
    estado = 'HOJA_NO_EXISTE';
  } else {
    const cellObj = wb.Sheets[hojaSistema][celda];
    if (!cellObj) {
      estado = 'CELDA_VACIA';
    } else {
      valor = cellObj.v ?? null;
      tipo = cellObj.t ?? '';
    }
  }

  return {
    indice: index + 2,
    codigo,
    severidad,
    hoja_rem: hojaRem,
    hoja_sistema: hojaSistema,
    seccion,
    validacion,
    celda,
    valor,
    tipo,
    estado,
  };
});

const headers = [
  'indice',
  'codigo',
  'severidad',
  'hoja_rem',
  'hoja_sistema',
  'seccion',
  'validacion',
  'celda',
  'valor',
  'tipo',
  'estado',
];

const csvEscape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const csvLines = [
  headers.join(','),
  ...report.map((item) => headers.map((header) => csvEscape(item[header])).join(',')),
];

const csvPath = `reporte_celdas_${outputBase}.csv`;
const jsonPath = `reporte_celdas_${outputBase}.json`;
const okCsvPath = `reporte_celdas_${outputBase}_ok.csv`;

await writeFile(csvPath, csvLines.join('\n'), 'utf8');
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const okRows = report.filter((item) => item.estado === 'OK');
const okCsvLines = [
  headers.join(','),
  ...okRows.map((item) => headers.map((header) => csvEscape(item[header])).join(',')),
];
await writeFile(okCsvPath, okCsvLines.join('\n'), 'utf8');

const statusCounts = report.reduce((acc, item) => {
  acc[item.estado] = (acc[item.estado] || 0) + 1;
  return acc;
}, {});

console.log(`Archivo objetivo: ${targetWorkbook}`);
console.log(`Filas procesadas: ${report.length}`);
console.log(`Estados: ${JSON.stringify(statusCounts)}`);
console.log(`CSV: ${csvPath}`);
console.log(`JSON: ${jsonPath}`);
console.log(`CSV solo OK: ${okCsvPath}`);
