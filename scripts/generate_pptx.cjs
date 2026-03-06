const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const mdPath = path.join(__dirname, '../Informe_Manual_REM.md');
const outputPath = path.join(__dirname, '../Informe_Manual_REM.pptx');

async function createPresentation() {
    if (!fs.existsSync(mdPath)) {
        console.error('El archivo fuente no existe:', mdPath);
        return;
    }

    const mdContent = fs.readFileSync(mdPath, 'utf8');

    // Theme: Midnight Executive
    const THEME = {
        primary: '1E2761', // Navy
        secondary: 'CADCFC', // Ice Blue
        textLight: 'FFFFFF', // White
        textDark: '212121', // Dark Gray
    };

    let pres = new PptxGenJS();
    pres.layout = 'LAYOUT_16x9';

    pres.defineSlideMaster({
        title: 'MASTER_TITLE',
        background: { fill: THEME.primary },
        objects: [
            { line: { x: 0.5, y: 0.5, w: 12.3, h: 0, line: { color: THEME.secondary, width: 2 } } }
        ]
    });

    pres.defineSlideMaster({
        title: 'MASTER_CONTENT',
        background: { fill: 'FFFFFF' },
        objects: [
            { rect: { x: 0, y: 0, w: '100%', h: 1.0, fill: THEME.primary } },
            { text: { text: "Manual REM 2026 - Resumen", options: { x: 0.5, y: 0.3, w: 5, h: 0.4, color: 'FFFFFF', fontSize: 14, fontFace: 'Segoe UI' } } }
        ]
    });

    // --- SLIDE 1: Title ---
    let slideTitle = pres.addSlide({ masterName: 'MASTER_TITLE' });
    slideTitle.addText('Informe del Manual REM 2026', {
        x: 1, y: 2.5, w: 11.3, h: 1.5,
        fontSize: 44, bold: true, color: THEME.textLight, fontFace: 'Georgia', align: 'center'
    });
    slideTitle.addText('Definiciones Operacionales', {
        x: 1, y: 4.0, w: 11.3, h: 1,
        fontSize: 24, color: THEME.secondary, fontFace: 'Segoe UI', align: 'center'
    });

    // Parse Markdown Sections
    // Find all REM blocks
    const remMatches = [...mdContent.matchAll(/## (REM [A-Z0-9a-z]+)\n> Páginas con definiciones operacionales: (.*?)\n/g)];

    // --- SLIDE 2: Resumen ---
    let slideSummary = pres.addSlide({ masterName: 'MASTER_CONTENT' });
    slideSummary.addText('Resumen de Hojas REM', {
        x: 0.5, y: 1.2, w: 12.3, h: 0.8,
        fontSize: 32, bold: true, color: THEME.primary, fontFace: 'Georgia'
    });

    let summaryText = `Se han encontrado definiciones operacionales para ${remMatches.length} hojas REM.\nA continuación, se detallan las páginas relevantes por hoja.`;
    slideSummary.addText(summaryText, {
        x: 0.5, y: 2.2, w: 12.3, h: 2,
        fontSize: 18, color: THEME.textDark, fontFace: 'Segoe UI', valign: 'top'
    });

    // Create a slide for each REM up to a reasonable limit, or group them.
    // Creating too many slides might be overwhelming, but let's map them.
    remMatches.forEach((match, index) => {
        let slideRem = pres.addSlide({ masterName: 'MASTER_CONTENT' });
        let remName = match[1];
        let pagesText = match[2];

        // Content
        slideRem.addText(remName, {
            x: 0.5, y: 1.2, w: 12.3, h: 0.8,
            fontSize: 36, bold: true, color: THEME.primary, fontFace: 'Georgia'
        });

        slideRem.addText('Páginas con definiciones:', {
            x: 0.5, y: 2.2, w: 12.3, h: 0.5,
            fontSize: 20, bold: true, color: THEME.textDark, fontFace: 'Segoe UI'
        });

        slideRem.addText(pagesText, {
            x: 0.5, y: 2.7, w: 12.3, h: 2,
            fontSize: 18, color: THEME.primary, fontFace: 'Segoe UI', valign: 'top'
        });

        // Add a visual element (a box representing the REM sheet)
        slideRem.addShape(pres.ShapeType.rect, {
            x: 9, y: 2.5, w: 3, h: 3,
            fill: THEME.secondary,
            line: { color: THEME.primary, width: 2 }
        });
        slideRem.addText('HOJA\n' + remName.replace('REM ', ''), {
            x: 9, y: 2.5, w: 3, h: 3,
            fontSize: 28, bold: true, color: THEME.primary, fontFace: 'Georgia', align: 'center', valign: 'middle'
        });
    });

    // --- SLIDE END ---
    let slideEnd = pres.addSlide({ masterName: 'MASTER_TITLE' });
    slideEnd.addText('Fin del Reporte', {
        x: 1, y: 3.0, w: 11.3, h: 1.5,
        fontSize: 44, bold: true, color: THEME.textLight, fontFace: 'Georgia', align: 'center'
    });

    await pres.writeFile({ fileName: outputPath });
    console.log(`Presentación generada exitosamente en: ${outputPath}`);
}

createPresentation().catch(err => {
    console.error('Error generando PowerPoint:', err);
});
