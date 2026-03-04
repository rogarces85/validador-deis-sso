const fs = require('fs');

const nuevasData = JSON.parse(fs.readFileSync('./data/Rules_nuevas.json', 'utf8'));

const out = {
    base: { validaciones: {} },
    hospital: { validaciones: {} },
    posta: { validaciones: {} },
    samu: { validaciones: {} }
};

let counts = { base: 0, hospital: 0, posta: 0, samu: 0 };

for (const [sheet, rules] of Object.entries(nuevasData.validaciones)) {
    for (const r of rules) {
        let target = 'base';

        if (r.aplicar_a_tipo && r.aplicar_a_tipo.length === 1 && r.aplicar_a_tipo[0] === 'HOSPITAL') {
            target = 'hospital';
        }
        else if (r.aplicar_a_tipo && r.aplicar_a_tipo.length === 1 && r.aplicar_a_tipo[0] === 'POSTA') {
            target = 'posta';
        }
        else if (r.aplicar_a && r.aplicar_a.length === 1 && r.aplicar_a[0] === '123010') {
            target = 'samu';
        }
        else if (r.aplicar_a_tipo && r.aplicar_a_tipo.length === 1 && r.aplicar_a_tipo[0] === 'SAMU') {
            target = 'samu';
        }
        else if (r.mensaje && String(r.mensaje).includes('solo corresponde registrar a SAMU')) {
            target = 'samu';
        }

        if (!out[target].validaciones[sheet]) out[target].validaciones[sheet] = [];
        out[target].validaciones[sheet].push(r);
        counts[target]++;
    }
}

fs.writeFileSync('./data/rules/base.json', JSON.stringify(out.base, null, 4));
fs.writeFileSync('./data/rules/hospital.json', JSON.stringify(out.hospital, null, 4));
fs.writeFileSync('./data/rules/posta.json', JSON.stringify(out.posta, null, 4));
fs.writeFileSync('./data/rules/samu.json', JSON.stringify(out.samu, null, 4));

console.log('Reglas distribuidas exitosamente:');
console.log(`- Base: ${counts.base}`);
console.log(`- Hospital: ${counts.hospital}`);
console.log(`- Posta: ${counts.posta}`);
console.log(`- Samu: ${counts.samu}`);
