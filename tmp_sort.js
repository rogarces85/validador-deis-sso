const fs = require('fs');
const file = 'c:/xampp/htdocs/www/Validador2026/data/Rules_nuevas.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const sortedKeys = Object.keys(data.validaciones).sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
});

const newValidaciones = {};
for (const key of sortedKeys) {
    const arr = data.validaciones[key];
    arr.sort((a, b) => {
        if (a.id && b.id) {
            return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
        }
        return 0;
    });
    newValidaciones[key] = arr;
}

data.validaciones = newValidaciones;
fs.writeFileSync(file, JSON.stringify(data, null, 4) + '\n', 'utf8');
console.log('Sorted successfully:', sortedKeys);
