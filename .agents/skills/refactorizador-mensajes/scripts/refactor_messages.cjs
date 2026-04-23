const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const rulesPath = path.join(process.cwd(), 'data', 'reglas_finales.json');
const glosaPath = process.argv[2] || path.join(process.cwd(), 'glosa Serie a.xlsx');

/**
 * Filtro de caracteres ultra-restrictivo.
 */
function ultraClean(text) {
    if (!text) return '';
    let result = '';
    const str = text.toString();
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
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
    if (!raw) return { nombre: 'Sin descripción' };

    const parts = raw.split(/\s*-\s*/);
    const nombre = parts[parts.length - 1];
    return { nombre: ultraClean(nombre) };
}

function getInverseOperatorDescription(op, val2) {
    const v2 = typeof val2 === 'number' ? val2 : String(val2);
    switch (op) {
        case '!=': return `es igual a ${v2}`;
        case '==': return `es distinto de ${v2}`;
        case '>':  return `es menor o igual a ${v2}`;
        case '<':  return `es mayor o igual a ${v2}`;
        case '>=': return `es menor que ${v2}`;
        case '<=': return `es mayor que ${v2}`;
        default:   return `no cumple con ${op} ${v2}`;
    }
}

function getDirectOperatorDescription(op) {
    switch (op) {
        case '!=': return 'debe ser distinto de';
        case '==': return 'debe ser igual a';
        case '>':  return 'debe ser mayor que';
        case '<':  return 'debe ser menor que';
        case '>=': return 'debe ser mayor o igual a';
        case '<=': return 'debe ser menor o igual a';
        default:   return `debe cumplir ${op}`;
    }
}

function buildSimpleMessage(rule, glosaInfo) {
    const rem = ultraClean(rule.rem_sheet);
    const sec = rule.seccion || '';
    const nom = ultraClean(glosaInfo.nombre);
    const exp = ultraClean(String(rule.expresion_1));
    const inverseCond = getInverseOperatorDescription(rule.operador, rule.expresion_2);

    const parts = [`REM ${rem}`];
    if (sec) parts.push(sec);
    parts.push(`La prestación '${nom}' (${exp}) ${inverseCond}`);

    return parts.join(' | ');
}

function buildComplexMessage(rule) {
    const rem = ultraClean(rule.rem_sheet);
    const sec1 = rule.seccion_expresion_1 || '';
    const sec2 = rule.seccion_expresion_2 || '';
    const exp1 = ultraClean(String(rule.expresion_1));
    const exp2 = ultraClean(String(rule.expresion_2));
    const directCond = getDirectOperatorDescription(rule.operador);

    const parts = [`REM ${rem}`];
    if (sec1) parts.push(sec1);
    parts.push(`Celdas (${exp1}) ${directCond}`);
    if (sec2) parts.push(sec2);
    parts.push(`celda (${exp2})`);

    return parts.join(' | ');
}

async function refactorAllMessages() {
    try {
        console.log('📖 Cargando reglas y glosas...');
        const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

        let glosaMap = new Map();
        if (fs.existsSync(glosaPath)) {
            const workbook = XLSX.readFile(glosaPath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const glosas = XLSX.utils.sheet_to_json(sheet);
            glosas.forEach(row => {
                const key = `${row.Hoja}|${row.Linea}`;
                glosaMap.set(key, cleanGlosa(row.Glosa));
            });
            console.log(`📋 Glosas cargadas: ${glosaMap.size} entradas.`);
        }

        let total = 0;

        for (const sheetName in rulesData) {
            rulesData[sheetName].forEach(rule => {
                // Buscar glosa para exp1
                const match = String(rule.expresion_1).match(/\d+/);
                const line = match ? match[0] : null;
                const key = `${rule.rem_sheet}|${line}`;
                const info = glosaMap.get(key) || { nombre: 'Descripción no encontrada' };

                if (rule.expresion_2 === 0) {
                    rule.mensaje = ultraClean(buildSimpleMessage(rule, info));
                } else {
                    rule.mensaje = ultraClean(buildComplexMessage(rule));
                }
                total++;
            });
        }

        fs.writeFileSync(rulesPath, JSON.stringify(rulesData, null, 4), 'utf8');
        console.log(`✅ Refactorización completada. ${total} mensajes actualizados.`);

    } catch (e) {
        console.error('❌ Error en el refactor:', e.message);
    }
}

refactorAllMessages();
