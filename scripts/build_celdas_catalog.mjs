import XLSX from 'xlsx-js-style';
import { writeFile } from 'node:fs/promises';

const inputPath = process.argv[2] || 'celdas.xlsx';
const outputPath = process.argv[3] || 'data/celdas.catalog.json';

const workbook = XLSX.readFile(inputPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

const entries = rows.map((row) => ({
  codigo: String(row['CÓDIGO'] || '').trim(),
  severidad: String(row['SEVERIDAD'] || '').trim(),
  hojaRem: String(row['HOJA REM'] || '').trim(),
  seccion: String(row['SECCIÓN'] || '').trim(),
  validacion: String(row['VALIDACIÓN'] || '').trim(),
  celda: String(row['CELDA'] || '').trim(),
}));

const payload = {
  generatedAt: new Date().toISOString(),
  sourceFile: inputPath,
  totalRows: entries.length,
  entries,
};

await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`Catalogo generado: ${outputPath}`);
console.log(`Total filas: ${entries.length}`);
