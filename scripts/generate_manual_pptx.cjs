const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const { marked } = require('marked');

async function createManualPPTX() {
    const mdPath = path.resolve(__dirname, '../docs/Manual_Usuario.md');
    const mdContent = fs.readFileSync(mdPath, 'utf-8');
    const tokens = marked.lexer(mdContent);

    let pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    // Slide Maestros - Estilo Premium DEIS SSO
    pptx.defineSlideMaster({
        title: 'MASTER_SLIDE',
        background: { color: 'F8FAFC' },
        objects: [
            { rect: { x: 0, y: 0, w: '100%', h: 0.8, fill: { color: '003B71' } } },
            { text: { text: 'Validador DEIS SSO 2026', options: { x: 0.5, y: 0.2, color: 'FFFFFF', fontSize: 24, bold: true } } },
            { line: { x: 0.5, y: 5.2, w: 9.0, line: { color: 'E2E8F0', width: 1 } } },
            { text: { text: 'Servicio de Salud Osorno', options: { x: 0.5, y: 5.3, color: '64748B', fontSize: 10 } } }
        ]
    });

    // Procesar tokens de Markdown para generar diapositivas
    let currentSlide = null;
    let listItems = [];

    for (const token of tokens) {
        if (token.type === 'heading') {
            if (token.depth === 1 || token.depth === 2) {
                currentSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
                currentSlide.addText(token.text.toUpperCase(), {
                    x: 0.5, y: 1.2, w: 9, h: 0.6,
                    fontSize: 32, bold: true, color: '1E293B'
                });
            }
        }
        else if (token.type === 'paragraph') {
            const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/i;
            const match = token.text.match(imgRegex);

            if (match && currentSlide) {
                const imgRelPath = match[1];
                const imgPath = path.resolve(__dirname, '../docs', imgRelPath);

                if (fs.existsSync(imgPath)) {
                    currentSlide.addImage({
                        path: imgPath,
                        x: 1.5, y: 2.0, w: 7.0, h: 3.5,
                        sizing: { type: 'contain' }
                    });
                }
            } else if (currentSlide) {
                const text = token.text.replace(/\*\*(.*?)\*\*/g, '$1');
                currentSlide.addText(text, {
                    x: 0.5, y: 1.9, w: 9, fontSize: 14, color: '475569'
                });
            }
        }
        else if (token.type === 'list' && currentSlide) {
            let bullets = token.items.map(item => {
                return { text: item.text.replace(/\*\*(.*?)\*\*/g, '$1'), options: { bullet: true, indentLevel: 0 } };
            });
            currentSlide.addText(bullets, {
                x: 0.5, y: 2.3, w: 9, fontSize: 14, color: '475569', lineSpacing: 24
            });
        }
    }

    pptx.writeFile({ fileName: path.resolve(__dirname, '../docs/Manual_Usuario.pptx') })
        .then(fileName => console.log(`Presentación creada exitosamente: ${fileName}`))
        .catch(err => console.error(err));
}

createManualPPTX();
