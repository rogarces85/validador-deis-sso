const fs = require('fs');

const file = fs.readFileSync('c:/xampp/htdocs/www/Validador2026/data/Rules_nuevas.json', 'utf8');
const data = JSON.parse(file);

let md = '# Listado Completo de Reglas y Operadores\n\n';
md += '| ID | Hoja | Operador | Mensaje |\n';
md += '|---|---|---|---|\n';

const inconsistencies = [];

for (const sheet in data) {
    if (!Array.isArray(data[sheet])) continue;

    data[sheet].forEach(rule => {
        let msg = (rule.mensaje || '').replace(/\n/g, ' ');
        if (msg.length > 100) {
            msg = msg.substring(0, 97) + '...';
        }
        md += `| ${rule.id} | ${rule.rem_sheet} | \`${rule.operador}\` | ${msg} |\n`;
    });
}

fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/523d49cd-f661-451e-9241-fdde16aa6166/informe_reglas_todas.md', md);
console.log('Done');
