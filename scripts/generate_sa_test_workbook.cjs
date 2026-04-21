const path = require('node:path');
const XLSX = require('xlsx-js-style');

const projectRoot = process.cwd();
const sourcePath = path.resolve(projectRoot, 'SA_26_V1.2.xlsm');
const targetPath = path.resolve(projectRoot, '123000A02.xlsm');
const catalogPath = path.resolve(projectRoot, 'data', 'celdas.catalog.json');
const establishmentsPath = path.resolve(projectRoot, 'data', 'establishments.catalog.json');

const CELL_REF_REGEX = /^[A-Z]+\d+$/;

const mapRemSheet = (sheetLabel) => {
  const raw = String(sheetLabel || '').trim();
  if (!raw) return raw;

  const upper = raw.toUpperCase();
  if (upper === 'REM30R') return 'A30AR';
  if (!upper.startsWith('REM')) return raw;

  return `A${raw.slice(3)}`;
};

const ensureRefIncludesCell = (sheet, cellRef) => {
  const cell = XLSX.utils.decode_cell(cellRef);

  if (!sheet['!ref']) {
    sheet['!ref'] = XLSX.utils.encode_range({ s: cell, e: cell });
    return;
  }

  const range = XLSX.utils.decode_range(sheet['!ref']);
  range.s.r = Math.min(range.s.r, cell.r);
  range.s.c = Math.min(range.s.c, cell.c);
  range.e.r = Math.max(range.e.r, cell.r);
  range.e.c = Math.max(range.e.c, cell.c);
  sheet['!ref'] = XLSX.utils.encode_range(range);
};

const setCell = (sheet, cellRef, value, type = 's') => {
  ensureRefIncludesCell(sheet, cellRef);
  sheet[cellRef] = { t: type, v: value };
};

const workbook = XLSX.readFile(sourcePath, {
  bookVBA: true,
  cellStyles: true,
});

const catalog = require(catalogPath);
const establishments = require(establishmentsPath);
const establishment = establishments.establecimientos.find((item) => item.codigo === '123000');
const testDisplayName = 'PRUEBA';

if (!establishment) {
  throw new Error('No se encontro el establecimiento 123000 en el catalogo.');
}

let valueSeed = 1;
const touchedCells = [];
const missingSheets = new Set();

for (const entry of catalog.entries) {
  const cellRef = String(entry.celda || '').trim();
  if (!CELL_REF_REGEX.test(cellRef)) continue;

  const sheetName = mapRemSheet(entry.hojaRem);
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    missingSheets.add(sheetName);
    continue;
  }

  setCell(sheet, cellRef, valueSeed, 'n');
  touchedCells.push(`${sheetName}!${cellRef}`);
  valueSeed += 1;
}

const nombreSheet = workbook.Sheets.NOMBRE;
if (!nombreSheet) {
  throw new Error('La hoja NOMBRE no existe en el archivo fuente.');
}

const communeCodeDigits = establishment.comuna.split('');
const establishmentCodeDigits = establishment.codigo.split('');
const monthDigits = ['0', '2'];

setCell(nombreSheet, 'A9', 'Versión 1.2: Febrero 2026', 's');
setCell(nombreSheet, 'B2', 'Puyehue', 's');
setCell(nombreSheet, 'B3', testDisplayName, 's');
setCell(nombreSheet, 'B6', 'Febrero', 's');
setCell(nombreSheet, 'B11', 'Responsable Prueba', 's');
setCell(nombreSheet, 'B12', 'Jefatura Estadistica Prueba', 's');

['C2', 'D2', 'E2', 'F2', 'G2'].forEach((cellRef, index) => {
  setCell(nombreSheet, cellRef, Number(communeCodeDigits[index]), 'n');
});

['C3', 'D3', 'E3', 'F3', 'G3', 'H3'].forEach((cellRef, index) => {
  setCell(nombreSheet, cellRef, Number(establishmentCodeDigits[index]), 'n');
});

['C6', 'D6'].forEach((cellRef, index) => {
  setCell(nombreSheet, cellRef, Number(monthDigits[index]), 'n');
});

XLSX.writeFile(workbook, targetPath, {
  bookType: 'xlsm',
  bookVBA: true,
});

console.log(JSON.stringify({
  source: path.basename(sourcePath),
  output: path.basename(targetPath),
  touchedCellCount: touchedCells.length,
  uniqueTouchedCellCount: new Set(touchedCells).size,
  missingSheets: Array.from(missingSheets),
  hasVBA: !!workbook.vbaraw,
}, null, 2));
