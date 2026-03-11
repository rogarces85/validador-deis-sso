const fs = require('fs');
const path = require('path');

const rulesNuevasPath = path.join(process.cwd(), 'data', 'Rules_nuevas.json');
const catalogPath = path.join(process.cwd(), 'data', 'establishments.catalog.json');
const rulesDir = path.join(process.cwd(), 'data', 'rules');

const baseJsonPath = path.join(rulesDir, 'base.json');
const hospitalJsonPath = path.join(rulesDir, 'hospital.json');
const postaJsonPath = path.join(rulesDir, 'posta.json');
const samuJsonPath = path.join(rulesDir, 'samu.json');

// Crear la carpeta data/rules si no existe
if (!fs.existsSync(rulesDir)) {
    fs.mkdirSync(rulesDir, { recursive: true });
}

function parseRules() {
    console.log('📖 Cargando rules y catálogo...');
    const rulesData = JSON.parse(fs.readFileSync(rulesNuevasPath, 'utf8'));
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

    const baseRules = { validaciones: {} };
    const hospitalRules = { validaciones: {} };
    const postaRules = { validaciones: {} };
    const samuRules = { validaciones: {} };

    let countBase = 0, countHosp = 0, countPosta = 0, countSamu = 0;

    for (const sheet in rulesData.validaciones) {
        rulesData.validaciones[sheet].forEach(rule => {
            const msgLower = (rule.mensaje || '').toLowerCase();
            let isHospital = false;
            let isPosta = false;
            let isSamu = false;

            // Detección base en el mensaje de palabras clave
            if (msgLower.includes('solo a hbsjo') || msgLower.includes('alta complejidad') || msgLower.includes('hospital')) {
                isHospital = true;
                if (msgLower.includes('hbsjo')) {
                    rule.aplicar_a = ["123100"]; // HBSJO
                }
            }
            if (msgLower.includes('posta') || msgLower.includes('psr')) {
                isPosta = true;
            }
            if (msgLower.includes('samu') && msgLower.includes('exclusivo')) {
                isSamu = true;
            }

            // Excluir SAMU explícitamente si se detecta en la regla original
            if (msgLower.includes('excluye samu')) {
                rule.excluir_tipo = rule.excluir_tipo || [];
                if (!rule.excluir_tipo.includes("SAMU")) rule.excluir_tipo.push("SAMU");
            }

            // Distribución
            if (isHospital && !isPosta && !isSamu) {
                if (!hospitalRules.validaciones[sheet]) hospitalRules.validaciones[sheet] = [];
                hospitalRules.validaciones[sheet].push(rule);
                countHosp++;
            } else if (isPosta && !isHospital && !isSamu) {
                if (!postaRules.validaciones[sheet]) postaRules.validaciones[sheet] = [];
                postaRules.validaciones[sheet].push(rule);
                countPosta++;
            } else if (isSamu && !isHospital && !isPosta) {
                if (!samuRules.validaciones[sheet]) samuRules.validaciones[sheet] = [];
                samuRules.validaciones[sheet].push(rule);
                countSamu++;
            } else {
                // Si no es exclusivo, va a base.json
                if (!baseRules.validaciones[sheet]) baseRules.validaciones[sheet] = [];
                baseRules.validaciones[sheet].push(rule);
                countBase++;
            }
        });
    }

    // Escribir los archivos
    fs.writeFileSync(baseJsonPath, JSON.stringify(baseRules, null, 4), 'utf8');
    fs.writeFileSync(hospitalJsonPath, JSON.stringify(hospitalRules, null, 4), 'utf8');
    fs.writeFileSync(postaJsonPath, JSON.stringify(postaRules, null, 4), 'utf8');
    fs.writeFileSync(samuJsonPath, JSON.stringify(samuRules, null, 4), 'utf8');

    console.log(`✅ Sincronización completada.`);
    console.log(`📊 Distribución de reglas:`);
    console.log(`  - Base: ${countBase}`);
    console.log(`  - Hospital: ${countHosp}`);
    console.log(`  - Posta: ${countPosta}`);
    console.log(`  - SAMU: ${countSamu}`);
}

try {
    parseRules();
} catch (e) {
    console.error('❌ Error en el proceso de sincronización:', e.message);
}
