const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const rulesPath = path.join(process.cwd(), 'data', 'Rules_nuevas.json');
const glosaPath = path.join(process.cwd(), 'glosa Serie a.xlsx');

function cleanGlosa(glosa) {
    if (!glosa) return 'Sin descripción';
    const parts = glosa.split('-');
    const lastPart = parts[parts.length - 1].trim();
    return lastPart.replace(/\s+/g, ' '); // Eliminar dobles espacios
}

function extractLine(cell) {
    if (!cell) return null;
    const match = cell.match(/\d+/);
    return match ? match[0] : null;
}

function getInverseOperatorDescription(op, val2) {
    // El mensaje describe por qué FALLÓ (lógica inversa)
    switch (op) {
        case '!=': return `es igual a ${val2}`;
        case '==': return `es distinto de ${val2}`;
        case '>': return `es menor o igual a ${val2}`;
        case '<': return `es mayor o igual a ${val2}`;
        case '>=': return `es menor que ${val2}`;
        case '<=': return `es mayor que ${val2}`;
        default: return `no cumple con ${op} ${val2}`;
    }
}

async function previewImprovedMessages() {
    try {
        const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
        const workbook = XLSX.readFile(glosaPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const glosas = XLSX.utils.sheet_to_json(sheet);

        const glosaMap = new Map();
        glosas.forEach(row => {
            const key = `${row.Hoja}|${row.Linea}`;
            glosaMap.set(key, cleanGlosa(row.Glosa));
        });

        console.log('# Comparativa de Mensajes Inversos (Por qué falló)\n');

        const testRules = [
            rulesData.validaciones.A01[0], // A01-VAL001 (!= 0)
            rulesData.validaciones.A01[15], // A01-VAL016 (== 0) - Asumiendo que existe o buscando uno con ==
            rulesData.validaciones.A05.find(r => r.id === 'A05-VAL002'), // A05-VAL002 (<=)
            rulesData.validaciones.A04.find(r => r.id === 'A04-VAL001')  // A04-VAL001 (==)
        ];

        testRules.forEach(rule => {
            if (!rule) return;
            const line = extractLine(rule.expresion_1);
            const key = `${rule.rem_sheet}|${line}`;
            const glosa = glosaMap.get(key) || 'Descripción no encontrada';

            const inverseCond = getInverseOperatorDescription(rule.operador, rule.expresion_2);
            const improved = `En REM ${rule.rem_sheet} (Línea ${line}): La prestación '${glosa}' (${rule.expresion_1}) ${inverseCond}.`;

            console.log(`### Regla: ${rule.id} (Operador Original: ${rule.operador})`);
            console.log(`**Original:** ${rule.mensaje}`);
            console.log(`**Propuesto:** ${improved}`);
            console.log('---\n');
        });

    } catch (e) {
        console.error(e);
    }
}

previewImprovedMessages();
