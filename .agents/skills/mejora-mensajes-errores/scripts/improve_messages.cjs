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
                // Generar explicación de la operación
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

                // Construir mensaje nuevo
                const celdasStr = celdasUnicas ? celdasUnicas : 'N/A';
                const nuevoMensaje = `REM ${rule.rem_sheet} | ${seccionNombre} | ${celdasStr}. ${explicacion}.`;

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
        console.log(`Proceso completado. Mensajes de reglas mejorados en: ${path.basename(outputPath)}`);

    } catch (err) {
        console.error('Error procesando archivos:', err);
        process.exit(1);
    }
}

main();
