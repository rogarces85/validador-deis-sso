const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Argumentos de entrada
// arg[2] = input excel path
// arg[3] = output markdown path
const inputExcel = process.argv[2];
const outputMd = process.argv[3];

if (!inputExcel || !outputMd) {
    console.error('Uso: node extract_sections.cjs <ruta_absoluta_excel_entrada> <ruta_absoluta_md_salida>');
    process.exit(1);
}

const excelPath = path.resolve(inputExcel);
const mdPath = path.resolve(outputMd);

async function extractSections() {
    try {
        if (!fs.existsSync(excelPath)) {
            console.error(`Error: El archivo de entrada no existe en ${excelPath}`);
            process.exit(1);
        }

        console.log(`Leyendo archivo Excel: ${path.basename(excelPath)}...`);

        // Optimizaciones de Lector Excel Pro
        const workbook = XLSX.readFile(excelPath, {
            cellFormula: false,
            cellHTML: false,
            cellText: false,
            cellStyles: false
        });

        let mdContent = `# Secciones extraídas de ${path.basename(excelPath)}\n\n`;
        let foundAny = false;

        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) continue;

            const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: null });
            let sheetSections = [];

            data.forEach((row, rowIndex) => {
                if (!row || !Array.isArray(row)) return;

                for (let i = 0; i < row.length; i++) {
                    const cellValue = row[i];
                    if (typeof cellValue === 'string') {
                        const cellStr = cellValue.trim().toUpperCase();
                        if (cellStr.startsWith('SECCIÓN') || cellStr.startsWith('SECCION')) {
                            // Convertir saltos de línea a espacios
                            const cleanText = cellValue.replace(/\r?\n|\r/g, ' ').trim();
                            sheetSections.push(`- 📋 **Fila ${rowIndex + 1}**: ${cleanText}`);
                            break;
                        }
                    }
                }
            });

            if (sheetSections.length > 0) {
                mdContent += `## Hoja: ${sheetName}\n`;
                mdContent += sheetSections.join('\n') + '\n\n';
                foundAny = true;
            }
        }

        if (foundAny) {
            // Aseguramos que la carpeta de destino exista
            const outputDir = path.dirname(mdPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.writeFileSync(mdPath, mdContent.trim() + '\n', 'utf-8');
            console.log(`Secciones extraidas exitosamente a ${path.basename(mdPath)}`);
        } else {
            console.log('No se encontraron celdas que comiencen con "SECCIÓN" o "SECCION" en el archivo Excel.');
        }

    } catch (error) {
        console.error('Error al procesar el archivo Excel:', error);
        process.exit(1);
    }
}

extractSections();
