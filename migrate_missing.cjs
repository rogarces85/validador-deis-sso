const fs = require('fs');

const rulesPath = './rules.json';
const nuevasPath = './data/Rules_nuevas.json';
const seccionesPath = './data/secciones.md';

const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
const nuevasData = JSON.parse(fs.readFileSync(nuevasPath, 'utf8'));
const mdContent = fs.readFileSync(seccionesPath, 'utf8');

function parseSecciones(mdContent) {
    const secciones = {};
    let currentHoja = null;

    const lines = mdContent.split('\n');
    for (const line of lines) {
        const hojaMatch = line.match(/^## Hoja:\s*(\w+)/);
        if (hojaMatch) {
            currentHoja = hojaMatch[1];
            secciones[currentHoja] = [];
            continue;
        }

        const filaMatch = line.match(/^- 📋 \*\*Fila (\d+)\*\*: (.+)/);
        if (currentHoja && filaMatch) {
            secciones[currentHoja].push({
                row: parseInt(filaMatch[1], 10),
                name: filaMatch[2].trim()
            });
        }
    }

    for (const hoja in secciones) {
        secciones[hoja].sort((a, b) => a.row - b.row);
    }

    return secciones;
}

const secciones = parseSecciones(mdContent);

function findSection(secciones, hoja, row) {
    if (!secciones[hoja]) return 'Sección Desconocida';

    const sheetSections = secciones[hoja];
    let foundSection = sheetSections[0] ? sheetSections[0].name : 'Sección Desconocida';

    for (const sec of sheetSections) {
        if (sec.row <= row) {
            foundSection = sec.name;
        } else {
            break;
        }
    }
    return foundSection;
}

function extractCells(exp) {
    if (typeof exp !== 'string') return [];
    const cellRegex = /[A-Z]+(\d+)/g;
    const cells = [];
    let match;
    while ((match = cellRegex.exec(exp)) !== null) {
        cells.push({ cell: match[0], row: parseInt(match[1], 10) });
    }
    return cells;
}

function translateOperator(op) {
    const ops = {
        "==": "debe ser igual a",
        "!=": "debe ser distinto de",
        "<>": "debe ser distinto de",
        ">": "debe ser estrictamente mayor a",
        "<": "debe ser estrictamente menor a",
        ">=": "debe ser mayor o igual a",
        "<=": "debe ser menor o igual a"
    };
    return ops[op] || `[${op}]`;
}

const hojasToMigrate = ['A07', 'A09', 'A11', 'A19a', 'A21'];
let totalMigrated = 0;

for (const sheet of hojasToMigrate) {
    if (!nuevasData.validaciones[sheet]) {
        nuevasData.validaciones[sheet] = [];
    }

    const rulesFromSource = rulesData.validaciones[sheet] || [];

    // Solo importar si no existen ya en Rules_nuevas.json
    for (const rule of rulesFromSource) {
        const exists = nuevasData.validaciones[sheet].some(r =>
            String(r.expresion_1) === String(rule.expresion_1) &&
            String(r.expresion_2) === String(rule.expresion_2) &&
            String(r.operador) === String(rule.operador)
        );

        if (!exists) {
            // Generar nuevo ID AXX-VAL00X
            const existingIds = nuevasData.validaciones[sheet].map(r => r.id);
            let nextNum = 1;
            while (existingIds.includes(`${sheet}-VAL${String(nextNum).padStart(3, '0')}`)) {
                nextNum++;
            }
            const newId = `${sheet}-VAL${String(nextNum).padStart(3, '0')}`;

            // Mejorar mensaje
            const exp1 = rule.expresion_1;
            const exp2 = rule.expresion_2;

            const cells1 = extractCells(exp1);
            const cells2 = typeof exp2 === 'string' ? extractCells(exp2) : [];

            const allCells = [...cells1, ...cells2];
            let seccionNombre = 'Sección Múltiple o Desconocida';

            if (allCells.length > 0) {
                const targetHoja = rule.rem_sheet_ext || rule.rem_sheet;
                seccionNombre = findSection(secciones, targetHoja, allCells[0].row);
            }

            const celdasUnicas = [...new Set(allCells.map(c => c.cell))].join(', ');

            let explicacion = "";
            if (String(exp2).trim() === '0') {
                if (rule.operador === '==') {
                    explicacion = `La expresión indica que [${exp1}] la celda no debe contener datos`;
                } else if (rule.operador === '!=') {
                    explicacion = `La expresión indica que [${exp1}] la celda debe contener datos`;
                } else {
                    explicacion = `La expresión indica que [${exp1}] ${translateOperator(rule.operador)} [${exp2}]`;
                }
            } else {
                explicacion = `La expresión indica que [${exp1}] ${translateOperator(rule.operador)} [${exp2}]`;
            }

            const celdasStr = celdasUnicas ? celdasUnicas : 'N/A';
            const nuevoMensaje = `REM ${rule.rem_sheet} | ${seccionNombre} | ${celdasStr}. ${explicacion}.`;

            nuevasData.validaciones[sheet].push({
                ...rule,
                id: newId,
                mensaje_original: rule.mensaje,
                mensaje: nuevoMensaje
            });
            totalMigrated++;
        }
    }
}

fs.writeFileSync(nuevasPath, JSON.stringify(nuevasData, null, 4));
console.log(`Migradas ${totalMigrated} reglas de los REMs solicitados a data/Rules_nuevas.json`);
