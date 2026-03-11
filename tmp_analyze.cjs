const fs = require('fs');

const file = fs.readFileSync('c:/xampp/htdocs/www/Validador2026/data/Rules_nuevas.json', 'utf8');
const rootConfig = JSON.parse(file);
const data = rootConfig.validaciones ? rootConfig.validaciones : rootConfig;

let md = '# Informe de Análisis Lógico: Mensajes vs Operadores\n\n';
md += 'Este informe destaca las reglas donde el texto del mensaje parece contradecir el operador lógico, o requerir inversión para funcionar como se espera.\n\n';

const suspicious = [];

for (const sheet in data) {
    if (!Array.isArray(data[sheet])) continue;

    data[sheet].forEach(rule => {
        const msg = (rule.mensaje || '').toLowerCase();
        const msg_orig = (rule.mensaje_original || '').toLowerCase();
        const op = rule.operador;

        let flag = null;

        // Revisar mensaje original también
        const fullMsg = msg + ' ' + msg_orig;

        // 1. "Debe ser distinto" o "no debe ser igual" vs == (la validación aprobará si son iguales)
        if ((fullMsg.includes('debe ser distinto') || fullMsg.includes('no debe ser igual') || fullMsg.includes('diferente a ')) && op === '==') {
            flag = 'Mensaje exige diferencia, pero el operador es de igualdad (==). La validación arrojará error cuando sean distintos (al evaluar a Falso).';
        }
        // 2. "Debe ser igual" vs != (la validación aprobarará si son distintos)
        else if (fullMsg.includes('debe ser igual') && !fullMsg.includes('no ') && op === '!=') {
            flag = 'Mensaje exige igualdad, pero el operador es distinto (!=). La validación arrojará error cuando sean iguales.';
        }
        // 3. "Debe contener datos" vs == 0
        else if ((fullMsg.includes('debe contener datos') || fullMsg.includes('distinto a cero') || fullMsg.includes('distinto a vacío')) && op === '==') {
            flag = 'Mensaje exige contener datos (!= 0), pero operador es (==). Si la celda TIENE datos, la regla con == 0 evaluará a False y arrojará error. Si espera datos para aprobar, debe ser (!=).';
        }
        // 4. Mención de "blanco", "cero" vs !=
        else if (fullMsg.includes('estar en blanco') && !fullMsg.includes('no ') && op === '!=') {
            flag = 'Mensaje exige estar en blanco/vacío (== 0), pero operador es (!=). Si la celda DEBE estar vacía para aprobar, el operador debería ser (==).';
        }

        if (flag) {
            suspicious.push({ rule, flag });
        }
    });
}

if (suspicious.length === 0) {
    md += '✅ No se encontraron inconsistencias evidentes mediante heurística. Se requiere revisión manual.\n';
} else {
    md += '## ⚠️ Reglas Sospechosas (' + suspicious.length + ' encontradas)\n\n';
    suspicious.forEach(s => {
        md += '### ' + s.rule.rem_sheet + ' | ID: ' + s.rule.id + '\n';
        md += '- **Expresión:** `[' + s.rule.expresion_1 + '] ' + s.rule.operador + ' [' + s.rule.expresion_2 + ']`\n';
        if (s.rule.omitir_si_v1_es_cero) md += '- **Condición:** omitir_si_v1_es_cero\n';
        md += '- **Mensaje:** > ' + s.rule.mensaje + '\n';
        md += '- **🚨 Inconsistencia Detectada:** ' + s.flag + '\n\n';
    });
}

// También genero el listado completo
let mdAll = '# Listado Completo de Reglas y Operadores\n\n| ID | Hoja | Op | Exp 1 | Exp 2 | Mensaje |\n|---|---|---|---|---|---|\n';
for (const sheet in data) {
    if (!Array.isArray(data[sheet])) continue;
    data[sheet].forEach(rule => {
        let msg = (rule.mensaje || '').replace(/\n/g, ' ');
        if (msg.length > 80) msg = msg.substring(0, 77) + '...';
        mdAll += `| ${rule.id} | ${rule.rem_sheet} | \`${rule.operador}\` | \`${rule.expresion_1}\` | \`${rule.expresion_2}\` | ${msg} |\n`;
    });
}
fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/523d49cd-f661-451e-9241-fdde16aa6166/informe_logica_reglas.md', md);
fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/523d49cd-f661-451e-9241-fdde16aa6166/informe_reglas_todas.md', mdAll);
console.log('Informes generados');
