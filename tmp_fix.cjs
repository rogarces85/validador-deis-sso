const fs = require('fs');
const path = require('path');

const rulesPath = 'c:/xampp/htdocs/www/Validador2026/data/Rules_nuevas.json';
const file = fs.readFileSync(rulesPath, 'utf8');
const rootConfig = JSON.parse(file);
const data = rootConfig.validaciones ? rootConfig.validaciones : rootConfig;

let count = 0;

for (const sheet in data) {
    if (!Array.isArray(data[sheet])) continue;

    data[sheet].forEach(rule => {
        const msg = (rule.mensaje || '').toLowerCase();
        const msg_orig = (rule.mensaje_original || '').toLowerCase();
        const op = rule.operador;
        const exp2 = String(rule.expresion_2).trim();

        const fullMsg = msg + ' ' + msg_orig;

        // Reglas con == 0 pero que dicen "no debe"
        if ((fullMsg.includes('no debe contener datos') || fullMsg.includes('distinto') || fullMsg.includes('diferente a ')) && op === '==' && exp2 === '0') {
            rule.operador = '!=';
            rule.mensaje = rule.mensaje.replace(/no debe contener datos/gi, 'debe contener datos (distinto de cero)');
            rule.mensaje_original = rule.mensaje_original.replace(/no debe contener datos/gi, 'debe contener datos (distinto de cero)');
            count++;
        }
        else if (fullMsg.includes('debe ser igual') && !fullMsg.includes('no ') && op === '!=') {
            rule.operador = '==';
            count++;
        }
    });
}

fs.writeFileSync(rulesPath, JSON.stringify(rootConfig, null, 4), 'utf8');
console.log(`Reglas modificadas: ${count}`);
