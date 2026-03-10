const fs = require('fs');

const rulesPath = 'c:/xampp/htdocs/www/Validador2026/data/Rules_nuevas.json';
const db = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
const validaciones = db.validaciones || db;

const base = { validaciones: {} };
const hospital = { validaciones: {} };
const posta = { validaciones: {} };
const samu = { validaciones: {} };

for (const sheet in validaciones) {
    validaciones[sheet].forEach(rule => {
        const types = rule.aplicar_a_tipo || [];
        const excluded = rule.excluir_tipo || [];

        let isTransversal = true;

        if (types.includes('Hospital') || types.includes("Hospital de Baja Complejidad") || types.includes("Hospital Gral. Subvencionado") || rule.aplicar_a) {
            if (!hospital.validaciones[sheet]) hospital.validaciones[sheet] = [];
            hospital.validaciones[sheet].push(rule);
            isTransversal = false;
        }
        if (types.includes('Posta de Salud Rural (PSR)') || types.includes('Posta')) {
            if (!posta.validaciones[sheet]) posta.validaciones[sheet] = [];
            posta.validaciones[sheet].push(rule);
            isTransversal = false;
        }
        if (types.includes('SAMU') || types.includes('Servicio de Atención Médico de Urgencias (SAMU)')) {
            if (!samu.validaciones[sheet]) samu.validaciones[sheet] = [];
            samu.validaciones[sheet].push(rule);
            isTransversal = false;
        }

        // Use transversal fallback if it doesn't clearly match a specific profile
        if (isTransversal) {
            if (!base.validaciones[sheet]) base.validaciones[sheet] = [];
            base.validaciones[sheet].push(rule);
        }
    });
}

function write(name, data) {
    fs.writeFileSync(`c:/xampp/htdocs/www/Validador2026/data/rules/${name}.json`, JSON.stringify(data, null, 4));
}
write('base', base);
write('hospital', hospital);
write('posta', posta);
write('samu', samu);
console.log('Sync de reglas completado con éxito.');
