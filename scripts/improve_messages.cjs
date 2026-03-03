const fs = require('fs');
const path = require('path');

const seccionesPath = path.join(__dirname, '../data/secciones.md');
const rulesPath = path.join(__dirname, '../data/rules/base.json'); // Usamos base como ejemplo
const outputPath = path.join(__dirname, '../data/Rules_nuevas.json');

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

    // Ordenar las secciones por fila de forma ascendente para cada hoja
    for (const hoja in secciones) {
        secciones[hoja].sort((a, b) => a.row - b.row);
    }

    return secciones;
}

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

async function main() {
    try {
        const mdContent = fs.readFileSync(seccionesPath, 'utf8');
        const secciones = parseSecciones(mdContent);

        const rulesRaw = fs.readFileSync(rulesPath, 'utf8');
        const rulesData = JSON.parse(rulesRaw);

        const newRulesData = { validaciones: {} };

        for (const [hoja, rulesArray] of Object.entries(rulesData.validaciones || {})) {
            newRulesData.validaciones[hoja] = rulesArray.map(rule => {
                const exp1 = rule.expresion_1;
                const exp2 = rule.expresion_2;

                // Extraer celdas
                const cells1 = extractCells(exp1);
                // exp2 puede ser número, ignorar si no es string
                const cells2 = typeof exp2 === 'string' ? extractCells(exp2) : [];

                const allCells = [...cells1, ...cells2];
                let seccionNombre = 'Sección Múltiple o Desconocida';

                if (allCells.length > 0) {
                    // Tomar la primera celda como referencia para la sección,
                    // asumiendo que la mayoría de reglas validan dentro de la misma sección
                    const targetHoja = rule.rem_sheet_ext || rule.rem_sheet;
                    seccionNombre = findSection(secciones, targetHoja, allCells[0].row);
                }

                // Generar lista de celdas únicas
                const celdasUnicas = [...new Set(allCells.map(c => c.cell))].join(', ');

                // Generar explicación de la operación
                const explicacion = `La expresión indica que [${exp1}] ${translateOperator(rule.operador)} [${exp2}]`;

                // Construir mensaje nuevo
                const celdasStr = celdasUnicas ? celdasUnicas : 'N/A';
                const nuevoMensaje = `${rule.rem_sheet} | ${seccionNombre} | ${celdasStr}. ${explicacion}.`;

                return {
                    ...rule,
                    mensaje_original: rule.mensaje, // Guardamos el original por si acaso
                    mensaje: nuevoMensaje
                };
            });
        }

        fs.writeFileSync(outputPath, JSON.stringify(newRulesData, null, 4), 'utf8');
        console.log('Proceso completado. Archivo generado en:', outputPath);

    } catch (err) {
        console.error('Error procesando archivos:', err);
    }
}

main();
