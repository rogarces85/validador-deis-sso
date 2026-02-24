/**
 * Extrae hojas y secciones de un archivo Excel REM.
 * Secciones se identifican por celdas en columna A que:
 * - Empiezan con "SECCIÓN", "SECCION", "Sección", "Seccion"
 * - O empiezan con letras mayúsculas seguidas de punto/número (ej: "A.", "B.1", "I.", "II.")
 * - O contienen headers con texto en negrita/mayúscula en columna A
 * 
 * Uso: node scripts/extractSections.js <archivo.xlsm>
 */

const XLSX = require('xlsx-js-style');
const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
if (!inputFile) {
    console.error('Uso: node scripts/extractSections.js <archivo.xlsm>');
    process.exit(1);
}

const EXCLUDE_SHEETS = ['NOMBRE', 'Control', 'control', 'nombre'];

const wb = XLSX.readFile(inputFile, { cellStyles: true });

const output = [];
output.push(`# Hojas y Secciones — ${path.basename(inputFile)}`);
output.push('');
output.push(`> Archivo: \`${path.basename(inputFile)}\``);
output.push(`> Hojas totales: ${wb.SheetNames.length}`);
output.push(`> Hojas excluidas: ${EXCLUDE_SHEETS.filter(s => wb.SheetNames.includes(s)).join(', ') || 'ninguna'}`);
output.push(`> Generado: ${new Date().toISOString().split('T')[0]}`);
output.push('');

const activeSheets = wb.SheetNames.filter(name => !EXCLUDE_SHEETS.includes(name));

output.push(`## Resumen de Hojas (${activeSheets.length})`);
output.push('');
activeSheets.forEach((name, i) => {
    output.push(`${i + 1}. **${name}**`);
});
output.push('');
output.push('---');
output.push('');

for (const sheetName of activeSheets) {
    const ws = wb.Sheets[sheetName];
    if (!ws) continue;

    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');

    output.push(`## Hoja: ${sheetName}`);
    output.push('');

    const sections = [];

    for (let r = range.s.r; r <= range.e.r; r++) {
        // Check column A (and sometimes B for merged cells)
        const cellA = ws[XLSX.utils.encode_cell({ r, c: 0 })];
        const cellB = ws[XLSX.utils.encode_cell({ r, c: 1 })];

        let text = '';
        if (cellA && cellA.v !== undefined && cellA.v !== null) {
            text = String(cellA.v).trim();
        } else if (cellB && cellB.v !== undefined && cellB.v !== null) {
            // Sometimes section headers are in column B due to merged cells
            text = String(cellB.v).trim();
        }

        if (!text || text.length < 3) continue;

        // Detect section patterns
        const isSectionHeader =
            // "SECCIÓN A:", "Sección B.1:", etc.
            /^SECCI[OÓ]N\s/i.test(text) ||
            // "A.", "B.", "A.1", "B.2", "I.", "II.", "III." etc.
            /^[A-Z]{1,3}[\.\)]\s/i.test(text) ||
            // "A.1.", "B.2.1", etc.
            /^[A-Z]\.\d+[\.\):]?\s/i.test(text) ||
            // All caps text that looks like a header (at least 10 chars, all uppercase)
            (text === text.toUpperCase() && text.length >= 10 && /^[A-ZÁÉÍÓÚÑ\s\.\-\,\(\)0-9:]+$/.test(text) && !/^\d+$/.test(text));

        // Also check if cell is bold (strong indicator of section)
        const isBold = cellA && cellA.s && cellA.s.font && cellA.s.font.bold;

        if (isSectionHeader || (isBold && text.length > 5 && !/^\d+[\.,]?\d*$/.test(text))) {
            // Clean up: truncate very long texts
            const displayText = text.length > 120 ? text.substring(0, 120) + '...' : text;
            sections.push({
                row: r + 1, // 1-indexed for display
                text: displayText,
                isBold: !!isBold,
                isSection: isSectionHeader
            });
        }
    }

    if (sections.length === 0) {
        output.push('_No se detectaron secciones._');
    } else {
        // Deduplicate very similar entries near each other
        const filtered = [];
        for (let i = 0; i < sections.length; i++) {
            const prev = filtered.length > 0 ? filtered[filtered.length - 1] : null;
            // Skip if same text as previous and within 2 rows
            if (prev && prev.text === sections[i].text && Math.abs(prev.row - sections[i].row) <= 2) {
                continue;
            }
            filtered.push(sections[i]);
        }

        filtered.forEach(s => {
            const marker = s.isSection ? '📋' : '📌';
            output.push(`- ${marker} **Fila ${s.row}**: ${s.text}`);
        });
    }

    output.push('');
    output.push('---');
    output.push('');
}

const outputPath = path.join(path.dirname(inputFile), 'data', 'secciones.md');
fs.writeFileSync(outputPath, output.join('\n'), 'utf-8');
console.log(`✅ Archivo generado: ${outputPath}`);
console.log(`   Hojas procesadas: ${activeSheets.length}`);
