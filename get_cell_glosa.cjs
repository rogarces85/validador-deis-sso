const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputExcel = process.argv[2];
const targetSheet = process.argv[3];
const targetCell = process.argv[4];

if (!inputExcel || !targetSheet || !targetCell) {
    console.error('Uso: node get_cell_glosa.cjs <ruta_excel> <hoja> <celda>');
    process.exit(1);
}

const excelPath = path.resolve(inputExcel);

try {
    const workbook = XLSX.readFile(excelPath, {
        cellFormula: false,
        cellHTML: false,
        cellText: true, // Necesitamos el texto para las glosas
        cellStyles: false
    });

    const sheet = workbook.Sheets[targetSheet];
    if (!sheet) {
        console.error(`Error: No se encontró la hoja "${targetSheet}"`);
        process.exit(1);
    }

    // Intentar obtener el valor de la celda directamente
    let cell = sheet[targetCell];

    // Si la celda es F11, a veces la glosa está en la misma fila pero columnas antes (C, D, E)
    // O si es una tabla, necesitamos el encabezado de la fila.

    console.log(`--- Información de Celda ${targetCell} en Hoja ${targetSheet} ---`);
    console.log(`Valor Original: ${cell ? cell.v : 'Vacío'}`);

    // Extraer contexto de la fila (primeras 10 columnas)
    const rowNumber = parseInt(targetCell.replace(/\D/g, ''));
    console.log(`\n--- Contexto de la Fila ${rowNumber} ---`);
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    cols.forEach(col => {
        const c = sheet[col + rowNumber];
        if (c && c.v) {
            console.log(`${col}${rowNumber}: ${c.v}`);
        }
    });

} catch (error) {
    console.error('Error:', error.message);
}
