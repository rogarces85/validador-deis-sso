const fs = require('fs');
const path = require('path');

const rulesPath = path.join(__dirname, '../data/Rules_nuevas.json');
const data = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

// Regex para detectar referencias a otras hojas: A01!, A03!, etc.
const sheetRefRegex = /([A-Z]\d{2}[a-z]?)!/g;

console.log('=== ANÁLISIS DE REGLAS MULTI-HOJA Y MULTI-SECCIÓN ===\n');

let crossSheetCount = 0;
let unknownSectionCount = 0;

for (const sheet in data.validaciones) {
    for (const rule of data.validaciones[sheet]) {
        const expr1 = String(rule.expresion_1 || '');
        const expr2 = String(rule.expresion_2 || '');
        const combined = expr1 + ' | ' + expr2;
        
        // Buscar referencias a otras hojas
        const matches = new Set();
        let m;
        while ((m = sheetRefRegex.exec(combined)) !== null) {
            if (m[1] !== rule.rem_sheet) {
                matches.add(m[1]);
            }
        }
        
        if (matches.size > 0) {
            crossSheetCount++;
            console.log(`[CROSS-SHEET] ${rule.id} | rem_sheet: ${rule.rem_sheet} | seccion: "${rule.seccion}"`);
            console.log(`  expr1: ${expr1}`);
            console.log(`  expr2: ${expr2}`);
            console.log(`  hojas_externas: ${[...matches].join(', ')}`);
            console.log(`  rem_sheet_ext: ${rule.rem_sheet_ext || 'NO DEFINIDO'}`);
            console.log('');
        }
        
        if (rule.seccion === '?') {
            unknownSectionCount++;
        }
    }
}

console.log(`\n=== RESUMEN ===`);
console.log(`Total reglas cross-sheet: ${crossSheetCount}`);
console.log(`Total reglas con sección "?": ${unknownSectionCount}`);

// Listar todas las secciones únicas por hoja
console.log('\n=== SECCIONES ÚNICAS POR HOJA ===');
for (const sheet in data.validaciones) {
    const secciones = [...new Set(data.validaciones[sheet].map(r => r.seccion))];
    console.log(`${sheet}: [${secciones.join(' | ')}]`);
}
