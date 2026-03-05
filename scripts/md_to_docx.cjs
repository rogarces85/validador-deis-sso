const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } = require('docx');
const sizeOf = require('image-size');

async function generateDocx() {
  const mdPath = path.resolve(__dirname, '../docs/Manual_Usuario.md');
  const docxPath = path.resolve(__dirname, '../docs/Manual_Usuario.docx');
  const mdContent = fs.readFileSync(mdPath, 'utf-8');

  const tokens = marked.lexer(mdContent);
  const children = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'heading':
        let level = HeadingLevel.HEADING_1;
        if (token.depth === 2) level = HeadingLevel.HEADING_2;
        if (token.depth >= 3) level = HeadingLevel.HEADING_3;

        children.push(new Paragraph({
          text: token.text,
          heading: level,
          spacing: { before: 400, after: 200 }
        }));
        break;

      case 'paragraph':
        // Check for images in paragraphs
        const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/i;
        const match = token.text.match(imgRegex);

        if (match) {
          const imgRelPath = match[1];
          const imgPath = path.resolve(__dirname, '../docs', imgRelPath);

          if (fs.existsSync(imgPath)) {
            const dimensions = sizeOf(imgPath);
            const maxWidth = 600; // docx points approx
            const ratio = Math.min(1, maxWidth / dimensions.width);

            children.push(new Paragraph({
              children: [
                new ImageRun({
                  data: fs.readFileSync(imgPath),
                  transformation: {
                    width: dimensions.width * ratio,
                    height: dimensions.height * ratio,
                  },
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 200 }
            }));
          }
        } else {
          // Normal text paragraph, handle bold/italic simple parsing
          const text = token.text.replace(/\*\*(.*?)\*\*/g, '$1'); // Simplified for now
          children.push(new Paragraph({
            children: [new TextRun({ text: text, size: 24 })],
            spacing: { after: 200 }
          }));
        }
        break;

      case 'list':
        for (const item of token.items) {
          children.push(new Paragraph({
            text: item.text.replace(/\*\*(.*?)\*\*/g, '$1'),
            bullet: { level: 0 },
            spacing: { after: 120 }
          }));
        }
        break;

      case 'hr':
        children.push(new Paragraph({
          border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
          spacing: { before: 200, after: 200 }
        }));
        break;
    }
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(docxPath, buffer);
  console.log('Documento DOCX generado exitosamente con docx-lib en:', docxPath);
}

generateDocx().catch(err => {
  console.error("Error capturado:", err);
  process.exit(1);
});
