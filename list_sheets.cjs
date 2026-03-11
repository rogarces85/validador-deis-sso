const XLSX = require('xlsx');
const path = require('path');

const inputExcel = process.argv[2];
if (!inputExcel) {
    console.error('Uso: node list_sheets.cjs <ruta_excel>');
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(path.resolve(inputExcel), { bookSheets: true });
    console.log('Hojas disponibles:', workbook.SheetNames.join(', '));
} catch (error) {
    console.error('Error:', error.message);
}
