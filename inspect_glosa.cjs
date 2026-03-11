const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputExcel = path.resolve('glosa Serie a.xlsx');

try {
    const workbook = XLSX.readFile(inputExcel, { cellText: true });
    const sheet = workbook.Sheets['Hoja1'];
    // Leer todas las filas para tener un mapa de búsqueda
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log('Muestra de datos (primeras 20 filas):');
    data.slice(0, 20).forEach((row, i) => {
        console.log(`Fila ${i + 1}:`, row.join(' | '));
    });
} catch (e) {
    console.error(e.message);
}
