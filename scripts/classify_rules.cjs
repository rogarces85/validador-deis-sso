const fs = require('fs');
const path = require('path');

const rulesPath = path.join(__dirname, '../data/Rules_nuevas.json');
const data = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

console.log('=== CLASIFICACIÓN DE REGLAS ===\n');

let simpleCount = 0; // expresion_2 === 0
let complexCount = 0; // expresion_2 es referencia de celda

for (const sheet in data.validaciones) {
    for (const rule of data.validaciones[sheet]) {
        const isSimple = rule.expresion_2 === 0;
        if (isSimple) {
            simpleCount++;
            console.log(`[SIMPLE vs 0] ${rule.id} | seccion: "${rule.seccion || rule.seccion_expresion_1 || ''}" | expr1: ${rule.expresion_1}`);
        } else {
            complexCount++;
            const expr1 = String(rule.expresion_1);
            const expr2 = String(rule.expresion_2);
            console.log(`[COMPLEX]     ${rule.id} | expr1: ${expr1} | expr2: ${expr2} | seccion: "${rule.seccion || rule.seccion_expresion_1 || ''}" | sec2: "${rule.seccion_expresion_2 || ''}"`);
        }
    }
}

console.log(`\n=== RESUMEN ===`);
console.log(`Reglas simples (vs 0): ${simpleCount}`);
console.log(`Reglas complejas (celda vs celda): ${complexCount}`);
console.log(`Total: ${simpleCount + complexCount}`);
