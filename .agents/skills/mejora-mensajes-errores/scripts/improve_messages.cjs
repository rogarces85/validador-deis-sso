const fs = require('fs');
const path = require('path');

const inputRules = process.argv[2];
const inputSections = process.argv[3];
const outputRules = process.argv[4];

if (!inputRules || !inputSections || !outputRules) {
    console.error('Uso: node improve_messages.cjs <ruta_json_entrada> <ruta_md_secciones> <ruta_json_salida>');
    process.exit(1);
}

const rulesPath = path.resolve(inputRules);
const seccionesPath = path.resolve(inputSections);
const outputPath = path.resolve(outputRules);

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

function extractCells(exp, defaultSheet) {
    if (typeof exp !== 'string') return [];
    // Buscar prefijo opcional de hoja "A05!" seguido de la celda "C89"
    const cellRegex = /(?:([A-Z0-9]+)!)?([A-Z]+)(\d+)/g;
    const cells = [];
    let match;
    while ((match = cellRegex.exec(exp)) !== null) {
        let sheet = match[1] || defaultSheet;
        cells.push({
            sheet: sheet,
            cell: match[2] + match[3],
            row: parseInt(match[3], 10)
        });
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

function buildSheetString(cellsArray, defaultSheet, secciones) {
    if (!cellsArray || cellsArray.length === 0) return null;

    const sheetGroups = {};
    for (const c of cellsArray) {
        if (!sheetGroups[c.sheet]) sheetGroups[c.sheet] = [];
        sheetGroups[c.sheet].push(c);
    }

    const parts = [];
    for (const [sheet, cList] of Object.entries(sheetGroups)) {
        const firstRow = cList[0].row;
        const seccionNombre = findSection(secciones, sheet, firstRow);

        const celdasUnicas = [...new Set(cList.map(item => item.cell))].join(', ');
        parts.push(`REM ${sheet} | ${seccionNombre} | ${celdasUnicas}`);
    }

    return parts.join(' | ');
}

async function main() {
    try {
        if (!fs.existsSync(seccionesPath)) {
            console.error(`Error: El archivo de secciones no existe: ${seccionesPath}`);
            process.exit(1);
        }
        if (!fs.existsSync(rulesPath)) {
            console.error(`Error: El archivo de reglas no existe: ${rulesPath}`);
            process.exit(1);
        }

        const mdContent = fs.readFileSync(seccionesPath, 'utf8');
        const secciones = parseSecciones(mdContent);

        const rulesRaw = fs.readFileSync(rulesPath, 'utf8');
        const rulesData = JSON.parse(rulesRaw);

        const newRulesData = { validaciones: {} };

        for (const [hoja, rulesArray] of Object.entries(rulesData.validaciones || {})) {
            newRulesData.validaciones[hoja] = rulesArray.map(rule => {
                const defaultSheet = rule.rem_sheet;
                const exp1 = rule.expresion_1;
                const exp2 = rule.expresion_2;

                const cells1 = extractCells(exp1, defaultSheet);
                const cells2 = typeof exp2 === 'string' ? extractCells(exp2, defaultSheet) : [];

                const part1 = buildSheetString(cells1, defaultSheet, secciones);
                const part2 = buildSheetString(cells2, defaultSheet, secciones);

                let isDouble = false;
                let startText = "";
                if (part1 && part2) {
                    // Si son idénticos (misma hoja, misma sección, mismas celdas) se muestra una vez
                    if (part1 === part2) {
                        startText = part1;
                    } else {
                        // Si son distintos (ya sea por hoja cruzada o distintas celdas agrupadas por hoja)
                        // Se unen las respuestas como: REM A01 | Seccion... | REM A05 | Seccion...
                        startText = `${part1} | ${part2}`;
                        isDouble = true;
                    }
                } else if (part1) {
                    startText = part1;
                } else if (part2) {
                    startText = part2;
                } else {
                    startText = `REM ${defaultSheet} | Sección Múltiple o Desconocida | N/A`;
                }

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

                let nuevoMensaje = "";
                if (isDouble) {
                    // Validaciones con doble hoja o cruzadas (6 partes / 5 pipes visuales)
                    nuevoMensaje = `${startText}. ${explicacion}.`;
                } else {
                    // Validaciones de una sola hoja (4 partes / 3 pipes visuales)
                    nuevoMensaje = `${startText} | ${explicacion}.`;
                }

                return {
                    ...rule,
                    mensaje_original: rule.mensaje,
                    mensaje: nuevoMensaje
                };
            });
        }

        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(newRulesData, null, 4), 'utf8');
        console.log(`Proceso completado. Mensajes de reglas (Doble Hoja Automático) mejorados en: ${path.basename(outputPath)}`);

    } catch (err) {
        console.error('Error procesando archivos:', err);
        process.exit(1);
    }
}

main();
