// Regenera data/reglas_finales.json desde Reestructuracion_Expandido.xlsx.
// Uso: node scripts/sync-reglas-from-excel.mjs [rutaExcel] [rutaJSON]
import XLSX from 'xlsx';
import fs from 'fs';

const excelPath = process.argv[2] || 'Reestructuracion_Expandido.xlsx';
const jsonPath = process.argv[3] || 'data/reglas_finales.json';

function mapTipo(tipoExcel) {
  const upper = String(tipoExcel || 'SIMPLE').trim().toUpperCase();
  if (upper === 'COMPUESTA') return 'CRUCE';
  return 'CELDA';
}

function parseOperacion(s) {
  const str = String(s || '').trim();
  if (!str) return { operador: '==', valor: 0 };
  const ops = ['>=', '<=', '!=', '==', '>', '<'];
  for (const op of ops) {
    if (str.startsWith(op)) {
      const raw = str.slice(op.length).trim();
      const num = Number(raw);
      const valor = raw !== '' && !Number.isNaN(num) ? num : raw;
      return { operador: op, valor };
    }
  }
  const num = Number(str);
  return { operador: '==', valor: Number.isNaN(num) ? str : num };
}

function rowToRegla(row, seqInSheet) {
  const { operador, valor } = parseOperacion(row['OPERACIÓN']);
  const sec1 = String(row['SECCION'] || '').trim();
  const det1 = String(row['DETALLE / EXPLICACION'] || '').trim();
  const sec2 = String(row['SECCION2'] || '').trim();
  const det2 = String(row['DETALLE/EXPLICACION 2'] || '').trim();
  const mensajeSec = sec1 ? `SECCIÓN ${sec1}` : 'SECCIÓN';
  const idNum = Number(row['ID']);
  const remSheet = String(row['HOJA'] || '').trim();
  let idNumStr;
  if (Number.isFinite(idNum) && idNum > 0) {
    idNumStr = String(idNum).padStart(3, '0');
  } else {
    idNumStr = String(seqInSheet).padStart(3, '0');
  }
  const id = `${remSheet}-VAL${idNumStr}`;
  const regla = {
    id,
    tipo: mapTipo(row['TIPO']),
    rem_sheet: remSheet,
    expresion_1: String(row['CELDAS'] || '').trim(),
    operador,
    expresion_2: valor,
    severidad: String(row['SEVERIDAD'] || 'REVISAR').trim().toUpperCase(),
    mensaje: `REM ${remSheet} | ${mensajeSec} | ${det1}${det2 ? ' | ' + det2 : ''}`.trim(),
  };
  const celdas2 = String(row['CELDAS2'] || '').trim();
  if (celdas2) {
    regla.expresion_2 = celdas2;
  }
  return regla;
}

const wb = XLSX.readFile(excelPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { defval: null });

const grouped = {};
let skipped = 0;
const seqPerSheet = {};
for (const row of rows) {
  if (!row['HOJA'] || !row['CELDAS']) {
    skipped++;
    continue;
  }
  const remSheet = String(row['HOJA']).trim();
  seqPerSheet[remSheet] = (seqPerSheet[remSheet] || 0) + 1;
  const regla = rowToRegla(row, seqPerSheet[remSheet]);
  if (!grouped[regla.rem_sheet]) {
    grouped[regla.rem_sheet] = [];
  }
  grouped[regla.rem_sheet].push(regla);
}

for (const k of Object.keys(grouped)) {
  grouped[k].sort((a, b) => a.id.localeCompare(b.id));
}

// Asegurar P9 y P13 como arrays vacios (hojas obligatorias sin reglas)
for (const k of ['P9', 'P13']) {
  if (!grouped[k]) {
    grouped[k] = [];
  }
}

if (fs.existsSync(jsonPath)) {
  const backup = jsonPath + '.bak';
  fs.copyFileSync(jsonPath, backup);
  console.log(`Backup creado: ${backup}`);
}

fs.writeFileSync(jsonPath, JSON.stringify(grouped, null, 2), 'utf-8');

const totalHojas = Object.keys(grouped).length;
const totalReglas = Object.values(grouped).reduce((acc, arr) => acc + arr.length, 0);
console.log(`OK: ${totalReglas} reglas en ${totalHojas} hojas exportadas a ${jsonPath}`);
if (skipped > 0) {
  console.log(`(Filas omitidas por datos incompletos: ${skipped})`);
}
