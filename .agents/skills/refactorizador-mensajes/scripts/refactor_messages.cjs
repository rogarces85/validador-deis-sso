const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const rulesPath = path.join(process.cwd(), 'data', 'Rules_nuevas.json');
const glosaPath = path.join(process.cwd(), 'glosa Serie a.xlsx');

/**
 * Filtro de caracteres ultra-restrictivo. 
 * Solo permite caracteres en el rango 32-255 (Imprimibles básicos + Latin-1).
 */
function ultraClean(text) {
    if (!text) return '';
    let result = '';
    const str = text.toString();
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        // Permitir solo caracteres imprimibles estándar y latinos comunes
        if ((code >= 32 && code <= 126) || (code >= 160 && code <= 255)) {
            result += str[i];
        } else {
            result += ' ';
        }
    }
    return result.replace(/\s+/g, ' ').trim();
}

function cleanGlosa(glosa) {
    const raw = ultraClean(glosa);
    if (!raw) return { seccion: 'Desconocida', nombre: 'Sin descripción' };

    // Separar por guion
    const parts = raw.split(/\s*-\s*/);

    if (parts.length >= 2) {
        const seccionRaw = parts[0];
        const seccionMatch = seccionRaw.match(/SECCIÓN\s+([A-Z0-9]+)/i);
        const seccionCode = seccionMatch ? seccionMatch[1] : seccionRaw;
        const nombre = parts[parts.length - 1];
        return { seccion: ultraClean(seccionCode), nombre: ultraClean(nombre) };
    }

    return { seccion: 'General', nombre: raw };
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
                const match = rule.expresion_1.match(/\d+/);
                const line = match ? match[0] : null;
                const key = `${rule.rem_sheet}|${line}`;
                const info = glosaMap.get(key) || { seccion: '?', nombre: 'Descripción no encontrada' };

                const inverseCond = getInverseOperatorDescription(rule.operador, rule.expresion_2);

                const rem = ultraClean(rule.rem_sheet);
                const sec = ultraClean(info.seccion);
                const nom = ultraClean(info.nombre);
                const exp = ultraClean(rule.expresion_1);

                const newMsg = `REM ${rem} | Seccion ${sec}: La prestación '${nom}' (${exp}) ${inverseCond}.`;

                rule.mensaje = ultraClean(newMsg);
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
