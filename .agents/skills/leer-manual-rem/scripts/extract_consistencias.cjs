/**
 * extract_consistencias.cjs
 * Versión 2: Mejorada para capturar más reglas y secciones.
 * Extrae las "Reglas de consistencia" del Manual REM 2026 (PDF) y genera consistencias.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PDF_PATH = process.argv[2] || path.join(ROOT, 'Manual Series REM 2026  SERIE A BS BM DV1.1.pdf');
const OUTPUT_MD = process.argv[3] || path.join(ROOT, 'consistencias.md');

async function main() {
    if (!fs.existsSync(PDF_PATH)) {
        throw new Error(`No se encontro el PDF del manual: ${PDF_PATH}`);
    }

    console.log('Leyendo Manual REM 2026 (Búsqueda Exhaustiva)...');
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const buffer = new Uint8Array(fs.readFileSync(PDF_PATH));
    const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
    console.log(`   Total paginas: ${doc.numPages}`);

    const pages = [];
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');
        pages.push({ num: i, text });
    }

    // 1. Patrones de detección
    const remSheetPattern = /REM[\s\-]*([A-Z]\d+[a-z]?)\b/gi;
    const consistenciaPatterns = [
        /Regla(s)?\s+de\s+consistencia/i,
        /Consistencia(s)\s+(Generales|Internas)?/i,
        /Criterio(s)\s+de\s+consistencia/i,
        /Validacion(es)\s+de\s+consistencia/i,
        /Control\s+de\s+consistencia/i,
    ];

    const consistencias = {};
    let currentSheet = 'S/H';
    let currentSection = 'General';

    console.log('Procesando paginas y extrayendo reglas...');

    for (const p of pages) {
        // Actualizar Hoja REM actual
        const sheetMatches = [...p.text.matchAll(remSheetPattern)];
        if (sheetMatches.length > 0) {
            currentSheet = sheetMatches[0][1].toUpperCase();
        }

        // Detectar cambios de sección (SECCIÓN A, SECCIÓN B, etc.)
        // Buscamos patrones como "SECCION A", "S E C C I O N A", "Sección A"
        const sectionMatch = p.text.match(/SECCI[OÓ]N\s+([A-Z0-9]+)/i);
        if (sectionMatch) {
            currentSection = sectionMatch[0].trim();
        }

        // Buscar reglas de consistencia en el texto de la página
        let hasConsistencyText = false;
        for (const pat of consistenciaPatterns) {
            if (pat.test(p.text)) {
                hasConsistencyText = true;
                break;
            }
        }

        if (!hasConsistencyText) continue;

        // Estrategia de extracción:
        // Si encontramos "Reglas de consistencia", intentamos extraer el bloque siguiente
        // hasta que encontremos otro encabezado o el final de la página.
        
        // Unimos el texto para procesarlo mejor
        const text = p.text;
        
        // Buscar todas las ocurrencias de patrones de consistencia
        for (const pat of consistenciaPatterns) {
            const matches = [...text.matchAll(new RegExp(pat, 'gi'))];
            for (const match of matches) {
                const startIdx = match.index;
                // Extraer desde la coincidencia hasta el final de la página o un cambio evidente
                let content = text.substring(startIdx);
                
                // Intentar limpiar el contenido capturando reglas numeradas (R.1, R.2...)
                const rules = [];
                const ruleSplitPattern = /(?=\s*R\.\s*\d+\s*[:\-])/gi;
                const segments = content.split(ruleSplitPattern);
                
                if (segments.length > 1) {
                    // El primer segmento es el encabezado "Reglas de consistencia", lo saltamos
                    for (let i = 1; i < segments.length; i++) {
                        rules.push(segments[i].trim());
                    }
                } else {
                    // No hay numeración R.1, capturamos el texto siguiente (ej. hasta 500 caracteres)
                    rules.push(content.substring(match[0].length).trim().substring(0, 1000));
                }

                if (rules.length > 0) {
                    if (!consistencias[currentSheet]) consistencias[currentSheet] = {};
                    if (!consistencias[currentSheet][currentSection]) consistencias[currentSheet][currentSection] = [];
                    
                    consistencias[currentSheet][currentSection].push({
                        pagina: p.num,
                        reglas: rules
                    });
                }
            }
        }
    }

    // 2. Generar archivo Markdown
    console.log('Generando consistencias.md...');
    const lines = [];
    lines.push('# Reglas de Consistencia — Manual REM 2026 (Búsqueda Exhaustiva)');
    lines.push('');
    lines.push(`> **Fuente:** ${path.basename(PDF_PATH)}`);
    lines.push(`> **Generado:** ${new Date().toLocaleString('es-CL')}`);
    lines.push('');

    const sortedSheets = Object.keys(consistencias).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (sortedSheets.length === 0) {
        lines.push('## No se encontraron reglas de consistencia.');
    } else {
        for (const sheet of sortedSheets) {
            lines.push(`## REM ${sheet}`);
            lines.push('');

            const sections = consistencias[sheet];
            const sortedSecs = Object.keys(sections).sort();

            for (const sec of sortedSecs) {
                lines.push(`### ${sec}`);
                lines.push('');

                for (const entry of sections[sec]) {
                    lines.push(`**Página ${entry.pagina}:**`);
                    for (const rule of entry.reglas) {
                        // Limpiar ruido de extracción de PDF
                        const cleanRule = rule
                            .replace(/\\s{2,}/g, ' ')
                            .replace(/\\n/g, ' ')
                            .trim();
                        if (cleanRule) {
                            lines.push(`- ${cleanRule}`);
                        }
                    }
                    lines.push('');
                }
            }
            lines.push('---');
        }
    }

    fs.writeFileSync(OUTPUT_MD, lines.join('\n'), 'utf8');
    console.log(`\n✅ Proceso completado. Archivo generado: ${OUTPUT_MD}`);
    console.log(`   Hojas detectadas: ${sortedSheets.length}`);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
