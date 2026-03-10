const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const rulesPath = path.join(process.cwd(), 'data', 'Rules_nuevas.json');
const glosaPath = path.join(process.cwd(), 'glosa Serie a.xlsx');

function cleanGlosa(glosa) {
    if (!glosa) return { seccion: 'Desconocida', nombre: 'Sin descripción' };

    // Limpieza agresiva de saltos de línea y caracteres invisibles
    const normalized = glosa.toString().replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim();

    // El separador suele ser " - " o simplemente "-"
    const parts = normalized.split(/\s*-\s*/);

    if (parts.length >= 2) {
        const seccionRaw = parts[0];
        const seccionMatch = seccionRaw.match(/SECCIÓN\s+([A-Z0-9]+)/i);
        const seccionCode = seccionMatch ? seccionMatch[1] : seccionRaw;
        const nombre = parts[parts.length - 1].trim();
        return { seccion: seccionCode, nombre: nombre };
    }

    return { seccion: 'General', nombre: normalized };
}

function extractLine(cell) {
    if (!cell) return null;
    const match = cell.match(/\d+/);
    return match ? match[0] : null;
}

function getInverseOperatorDescription(op, val2) {
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

async function refactorAllMessages() {
    try {
        console.log('📖 Cargando reglas y glosas...');
        const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
        const workbook = XLSX.readFile(glosaPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const glosas = XLSX.utils.sheet_to_json(sheet);

        const glosaMap = new Map();
        glosas.forEach(row => {
            const key = `${row.Hoja}|${row.Linea}`;
            glosaMap.set(key, cleanGlosa(row.Glosa));
        });

        let updateCount = 0;

        for (const sheetName in rulesData.validaciones) {
            rulesData.validaciones[sheetName].forEach(rule => {
                const line = extractLine(rule.expresion_1);
                const key = `${rule.rem_sheet}|${line}`;
                const info = glosaMap.get(key) || { seccion: '?', nombre: 'Descripción no encontrada' };

                const inverseCond = getInverseOperatorDescription(rule.operador, rule.expresion_2);
                const newMsg = `REM ${rule.rem_sheet} | Seccion ${info.seccion}: La prestación '${info.nombre}' (${rule.expresion_1}) ${inverseCond}.`;

                rule.mensaje = newMsg;
                updateCount++;
            });
        }

        fs.writeFileSync(rulesPath, JSON.stringify(rulesData, null, 4), 'utf8');
        console.log(`✅ Refactorización completada. Se actualizaron ${updateCount} mensajes.`);

    } catch (e) {
        console.error('❌ Error en el refactor:', e.message);
    }
}

refactorAllMessages();
