const fs = require('fs');
const path = require('path');

const sectionsPath = path.join(process.cwd(), 'data', 'secciones.md');
const rulesPath = path.join(process.cwd(), 'data', 'Rules_nuevas.json');

/**
 * Parsea secciones.md en un objeto: { sheet -> [ {fila, nombre}, ... ] }
 */
function parseSections() {
    const content = fs.readFileSync(sectionsPath, 'utf8');
    const lines = content.split('\n');
    const sheets = {};
    let currentSheet = null;

    lines.forEach(line => {
        const sheetMatch = line.match(/^## Hoja:\s+([A-Z0-9]+)/);
        if (sheetMatch) {
            currentSheet = sheetMatch[1];
            sheets[currentSheet] = [];
            return;
        }

        const sectionMatch = line.match(/📋 \*\*Fila (\d+)\*\*:\s*(.+)/);
        if (sectionMatch && currentSheet) {
            sheets[currentSheet].push({
                fila: parseInt(sectionMatch[1]),
                nombre: sectionMatch[2].trim()
            });
        }
    });

    // Ordenar secciones por fila descendente para facilitar búsqueda
    for (const s in sheets) {
        sheets[s].sort((a, b) => b.fila - a.fila);
    }

    return sheets;
}

/**
 * Encuentra la sección para una celda dada (ej: F36) en una hoja.
 */
function findSection(sheetSections, cellRef) {
    if (!sheetSections) return '';
    const match = String(cellRef).match(/([A-Z]+)(\d+)/);
    if (!match) return '';
    const row = parseInt(match[2]);

    // Buscar la sección cuya fila sea <= row (la primera que encontremos pq están desc)
    const found = sheetSections.find(s => s.fila <= row);
    return found ? found.nombre : '';
}

async function importSections() {
    try {
        console.log('📖 Cargando secciones desde secciones.md...');
        const sectionsMap = parseSections();
        console.log(`✅ ${Object.keys(sectionsMap).length} hojas cargadas.`);

        console.log('📖 Cargando reglas...');
        const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

        let updateCount = 0;

        for (const sheetName in rulesData.validaciones) {
            rulesData.validaciones[sheetName].forEach(rule => {
                const isSimple = rule.expresion_2 === 0;

                // Sección 1 (basada en expresion_1)
                const newSec1 = findSection(sectionsMap[rule.rem_sheet], rule.expresion_1);
                
                if (isSimple) {
                    if (newSec1 && rule.seccion !== newSec1) {
                        rule.seccion = newSec1;
                        updateCount++;
                    }
                } else {
                    // Compleja
                    if (newSec1 && rule.seccion_expresion_1 !== newSec1) {
                        rule.seccion_expresion_1 = newSec1;
                        updateCount++;
                    }

                    // Sección 2
                    let sheet2 = rule.rem_sheet_2 || rule.rem_sheet;
                    let expr2 = rule.expresion_2;
                    // Limpiar referencia de hoja si existe (ej: A05!C89 -> C89)
                    if (typeof expr2 === 'string') {
                        expr2 = expr2.replace(/^[A-Z]\d{2}[a-z]?!/i, '');
                    }
                    
                    const newSec2 = findSection(sectionsMap[sheet2], expr2);
                    if (newSec2 && rule.seccion_expresion_2 !== newSec2) {
                        rule.seccion_expresion_2 = newSec2;
                        updateCount++;
                    }
                }
            });
        }

        fs.writeFileSync(rulesPath, JSON.stringify(rulesData, null, 4), 'utf8');
        console.log(`✅ Importación completada. Se actualizaron ${updateCount} campos de sección.`);

    } catch (e) {
        console.error('❌ Error:', e.message);
    }
}

importSections();
