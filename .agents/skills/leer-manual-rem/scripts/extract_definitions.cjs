/**
 * extract_definitions.cjs
 * Extrae las Definiciones Operacionales del Manual REM 2026 (PDF) y genera Informe_Manual_REM.md
 * Usa pdfjs-dist (legacy build) para compatibilidad con Node.js.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PDF_PATH = path.join(ROOT, 'Manual Series REM 2026  SERIE A BS BM DV1.1.pdf');
const OUTPUT_MD = path.join(ROOT, 'Informe_Manual_REM.md');

async function main() {
    console.log('📖 Leyendo Manual REM 2026...');
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const buffer = new Uint8Array(fs.readFileSync(PDF_PATH));
    const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
    console.log(`   Total páginas: ${doc.numPages}`);

    // ── 1. Extraer texto por página ──
    console.log('📝 Extrayendo texto de todas las páginas...');
    const pages = [];
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');
        pages.push({ num: i, text });
        if (i % 100 === 0) process.stdout.write(`   ${i}/${doc.numPages}\r`);
    }
    console.log(`   ${doc.numPages}/${doc.numPages} ✅`);

    // ── 2. Identificar bloques por Hoja REM ──
    // Los encabezados del manual usan "REM-A01", "REM A01", "REM-A19b", etc.
    console.log('🔍 Identificando hojas REM y definiciones operacionales...');

    // Build a combined text with page markers
    const fullText = pages.map(p => `\n[PAGE_${p.num}]\n${p.text}`).join('\n');

    // Pattern to detect REM sheet headers
    // Example patterns in manual: "REM-A01", "REM A01", "REM - A27", "Serie A", "REM-A19a"
    const remSheetPattern = /REM[\s\-]*([A-Z]\d+[a-z]?)\b/gi;

    // Track which pages belong to which REM sheets
    const sheetPages = {}; // { 'A01': [pageNums], 'A02': [pageNums], ... }
    for (const p of pages) {
        const matches = [...p.text.matchAll(remSheetPattern)];
        for (const m of matches) {
            const sheet = m[1].toUpperCase().replace(/([A-Z])(\d)/, '$1$2');
            // Normalize: keep lowercase suffix if any (A19a, A19b, A11a)
            const rawSheet = m[1];
            const normalizedSheet = rawSheet.charAt(0).toUpperCase() + rawSheet.slice(1);
            if (!sheetPages[normalizedSheet]) sheetPages[normalizedSheet] = new Set();
            sheetPages[normalizedSheet].add(p.num);
        }
    }

    // ── 3. Para cada página, detectar Definiciones Operacionales ──
    const defOperacionalPattern = /definicion(es)?\s+operacional(es)?/i;

    // Group pages with definitions by the REM sheet they belong to
    const sheetDefinitions = {}; // { 'A01': { pages: [], texts: [] }, ... }

    // Strategy: For each page with "Definiciones Operacionales", find which REM sheet it belongs to
    // by checking the page itself and scanning nearby pages
    for (const p of pages) {
        if (!defOperacionalPattern.test(p.text)) continue;

        // Determine which REM sheet this page belongs to
        let currentSheet = null;

        // Check current page for REM reference
        const remMatch = p.text.match(/REM[\s\-]*([A-Z]\d+[a-z]?)/i);
        if (remMatch) {
            currentSheet = remMatch[1];
        } else {
            // Look backwards through recent pages
            for (let j = p.num - 1; j >= Math.max(1, p.num - 10); j--) {
                const prevText = pages[j - 1]?.text || '';
                const prevMatch = prevText.match(/REM[\s\-]*([A-Z]\d+[a-z]?)/i);
                if (prevMatch) {
                    currentSheet = prevMatch[1];
                    break;
                }
            }
        }

        if (currentSheet) {
            if (!sheetDefinitions[currentSheet]) {
                sheetDefinitions[currentSheet] = { pages: [], texts: [] };
            }
            sheetDefinitions[currentSheet].pages.push(p.num);
            sheetDefinitions[currentSheet].texts.push(p.text);
        }
    }

    // ── 4. Extraer secciones y definiciones de cada bloque ──
    console.log('📋 Generando informe...');

    // Sort sheets naturally
    const sortedSheets = Object.keys(sheetDefinitions).sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true });
    });

    const lines = [];
    lines.push('# 📘 Informe del Manual REM 2026 — Definiciones Operacionales');
    lines.push('');
    lines.push(`> **Fuente:** Manual Series REM 2026 SERIE A BS BM DV1.1.pdf`);
    lines.push(`> **Generado:** ${new Date().toLocaleString('es-CL')}`);
    lines.push(`> **Total páginas procesadas:** ${doc.numPages}`);
    lines.push(`> **Hojas REM encontradas con definiciones:** ${sortedSheets.length}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // Índice
    lines.push('## 📑 Índice de Hojas REM');
    lines.push('');
    for (const sheet of sortedSheets) {
        const info = sheetDefinitions[sheet];
        lines.push(`- [REM ${sheet}](#rem-${sheet.toLowerCase()}) — ${info.pages.length} páginas con definiciones (p. ${info.pages.join(', ')})`);
    }
    lines.push('');
    lines.push('---');
    lines.push('');

    // Contenido por hoja
    for (const sheet of sortedSheets) {
        const info = sheetDefinitions[sheet];
        lines.push(`## REM ${sheet}`);
        lines.push(`> Páginas con definiciones operacionales: ${info.pages.join(', ')}`);
        lines.push('');

        for (let i = 0; i < info.texts.length; i++) {
            let text = info.texts[i];

            // Clean up the text - split by common section markers
            // Try to identify sections like "SECCIÓN A:", "SECCIÓN B:", etc.
            const sectionPattern = /SECCI[OÓ]N\s+([A-Z][.\d]*[:\s])/gi;
            const sections = text.split(sectionPattern);

            // Format the text into readable paragraphs
            // Replace multiple spaces with single space
            text = text.replace(/\s{2,}/g, ' ').trim();

            // Break into shorter lines for readability
            const sentences = text.split(/(?<=[.!?])\s+/);
            let currentParagraph = '';

            lines.push(`### Página ${info.pages[i]}`);
            lines.push('');

            for (const sentence of sentences) {
                const trimmed = sentence.trim();
                if (!trimmed) continue;

                // Detect section headers
                if (/^SECCI[OÓ]N\s+[A-Z]/i.test(trimmed)) {
                    if (currentParagraph) {
                        lines.push(currentParagraph);
                        lines.push('');
                        currentParagraph = '';
                    }
                    lines.push(`**${trimmed}**`);
                    lines.push('');
                    continue;
                }

                // Detect definition headers
                if (/definici[oó]n\s+operacional/i.test(trimmed)) {
                    if (currentParagraph) {
                        lines.push(currentParagraph);
                        lines.push('');
                        currentParagraph = '';
                    }
                    lines.push(`> 📌 **${trimmed}**`);
                    lines.push('');
                    continue;
                }

                currentParagraph += (currentParagraph ? ' ' : '') + trimmed;

                // Break paragraphs that are too long
                if (currentParagraph.length > 300) {
                    lines.push(currentParagraph);
                    lines.push('');
                    currentParagraph = '';
                }
            }

            if (currentParagraph) {
                lines.push(currentParagraph);
                lines.push('');
            }
        }

        lines.push('---');
        lines.push('');
    }

    // ── 5. Resumen de hojas sin definiciones operacionales detectadas ──
    // Compare with all known sheets from secciones.md
    const knownSheets = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09',
        'A11', 'A11a', 'A19a', 'A19b', 'A21', 'A23', 'A24', 'A25', 'A26',
        'A27', 'A28', 'A29', 'A30', 'A30AR', 'A31', 'A32', 'A33', 'A34'];

    const missingSheets = knownSheets.filter(s => !sheetDefinitions[s]);
    if (missingSheets.length > 0) {
        lines.push('## ⚠️ Hojas REM sin definiciones detectadas automáticamente');
        lines.push('');
        lines.push('Las siguientes hojas REM no tuvieron definiciones operacionales identificadas automáticamente en el PDF. Esto puede deberse a formato de texto diferente o a que las definiciones están integradas en el cuerpo de otra sección.');
        lines.push('');
        for (const s of missingSheets) {
            lines.push(`- REM ${s}`);
        }
        lines.push('');
    }

    // Write output
    const mdContent = lines.join('\n');
    fs.writeFileSync(OUTPUT_MD, mdContent, 'utf8');

    console.log(`\n✅ Informe generado: Informe_Manual_REM.md`);
    console.log(`   Hojas con definiciones: ${sortedSheets.length}`);
    console.log(`   Hojas: ${sortedSheets.join(', ')}`);
    console.log(`   Tamaño del informe: ${(mdContent.length / 1024).toFixed(0)} KB`);
}

main().catch(err => {
    console.error('Error:', err.message || err);
    process.exit(1);
});
