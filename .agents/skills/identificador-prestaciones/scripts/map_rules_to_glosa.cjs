const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const rulesPath = path.join(process.cwd(), 'data', 'reglas_finales.json');
const glosaPath = process.argv[2] || path.join(process.cwd(), 'glosa Serie a.xlsx');
const outputPath = process.argv[3] || path.join(process.cwd(), 'docs', 'informe_prestaciones_validador.md');

function cleanGlosa(glosa) {
    if (!glosa) return 'Sin descripción';
    const parts = glosa.split('-');
    return parts[parts.length - 1].trim();
}

function extractLine(cell) {
    if (!cell) return null;
    const match = cell.match(/\d+/);
    return match ? match[0] : null;
}

async function generateReport() {
    try {
        console.log('Cargando reglas...');
        const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

        if (!fs.existsSync(glosaPath)) {
            throw new Error(`No se encontro el archivo de glosas: ${glosaPath}`);
        }

        console.log('Cargando glosas de Excel...');
        const workbook = XLSX.readFile(glosaPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const glosas = XLSX.utils.sheet_to_json(sheet);

        // Mapa de glosas: "Hoja|Linea" -> GlosaLimpia
        const glosaMap = new Map();
        glosas.forEach(row => {
            const key = `${row.Hoja}|${row.Linea}`;
            glosaMap.set(key, cleanGlosa(row.Glosa));
        });

        const report = {};

        for (const sheetName in rulesData) {
            rulesData[sheetName].forEach(rule => {
                const cells = [];
                if (rule.expresion_1) {
                    const match = rule.expresion_1.match(/[A-Z]+\d+/g);
                    if (match) cells.push(...match);
                }
                if (rule.expresion_2 && typeof rule.expresion_2 === 'string') {
                    const match = rule.expresion_2.match(/[A-Z]+\d+/g);
                    if (match) cells.push(...match);
                }

                const uniqueLines = [...new Set(cells.map(extractLine))];

                uniqueLines.forEach(line => {
                    const remSheet = rule.rem_sheet || sheetName;
                    const key = `${remSheet}|${line}`;
                    const glosa = glosaMap.get(key) || 'No encontrada en glosario';

                    if (!report[remSheet]) report[remSheet] = {};
                    if (!report[remSheet][line]) report[remSheet][line] = { glosa, rules: [] };

                    if (!report[remSheet][line].rules.find(r => r.id === rule.id)) {
                        report[remSheet][line].rules.push({
                            id: rule.id,
                            mensaje: rule.mensaje,
                            severidad: rule.severidad
                        });
                    }
                });
            });
        }

        let mdContent = '# 📋 Informe de Prestaciones e Indicadores Relacionados\n\n';
        mdContent += '> Mapeo automático de reglas del validador con glosas oficiales de Excel.\n\n';

        const sortedSheets = Object.keys(report).sort();

        sortedSheets.forEach(sheet => {
            mdContent += `## 📄 Hoja REM: ${sheet}\n\n`;
            const lines = Object.keys(report[sheet]).sort((a, b) => parseInt(a) - parseInt(b));

            lines.forEach(line => {
                const item = report[sheet][line];
                mdContent += `### 🔹 Línea ${line}: ${item.glosa}\n`;
                mdContent += '| ID Regla | Severidad | Mensaje |\n';
                mdContent += '|----------|-----------|---------|\n';
                item.rules.forEach(r => {
                    mdContent += `| ${r.id} | ${r.severidad} | ${r.mensaje} |\n`;
                });
                mdContent += '\n';
            });
        });

        fs.writeFileSync(outputPath, mdContent, 'utf8');
        console.log(`✅ Informe generado exitosamente en: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error general:', error);
    }
}

generateReport();
