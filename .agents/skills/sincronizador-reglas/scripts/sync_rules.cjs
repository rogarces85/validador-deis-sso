const fs = require('fs');
const path = require('path');

const sourceRulesPath = path.join(process.cwd(), 'data', 'reglas_finales.json');
const rulesDir = path.join(process.cwd(), 'data', 'rules');

const baseJsonPath = path.join(rulesDir, 'base.json');
const hospitalJsonPath = path.join(rulesDir, 'hospital.json');
const postaJsonPath = path.join(rulesDir, 'posta.json');
const samuJsonPath = path.join(rulesDir, 'samu.json');
const checkOnly = process.argv.includes('--check');

// Crear la carpeta data/rules si no existe
if (!fs.existsSync(rulesDir)) {
    fs.mkdirSync(rulesDir, { recursive: true });
}

const HOSPITAL_CODE_GROUPS = {
    'SOLO HBSJO': ['123100'],
    'SOLO HBSJO, HPU': ['123100', '123101'],
    'SOLO HBSJO, HPU, HRN': ['123100', '123101', '123102'],
};

function cloneRule(rule) {
    return JSON.parse(JSON.stringify(rule));
}

function pushRule(target, sheet, rule) {
    if (!target.validaciones[sheet]) {
        target.validaciones[sheet] = [];
    }
    target.validaciones[sheet].push(rule);
}

function normalizeScopedRule(rule) {
    const normalized = cloneRule(rule);
    delete normalized.aplicar_a;
    delete normalized.aplicar_a_tipo;
    delete normalized.excluir_tipo;

    if (normalized.expresion_2 === 'SOLO POSTAS') {
        normalized.aplicar_a_tipo = ['POSTA'];
        return { bucket: 'POSTA', rule: normalized };
    }

    if (HOSPITAL_CODE_GROUPS[normalized.expresion_2]) {
        normalized.aplicar_a_tipo = ['HOSPITAL'];
        normalized.aplicar_a = HOSPITAL_CODE_GROUPS[normalized.expresion_2];
        return { bucket: 'HOSPITAL', rule: normalized };
    }

    return { bucket: 'BASE', rule: normalized };
}

function parseRules() {
    console.log('📖 Cargando reglas base...');
    const rulesData = JSON.parse(fs.readFileSync(sourceRulesPath, 'utf8'));

    const baseRules = { validaciones: {} };
    const hospitalRules = { validaciones: {} };
    const postaRules = { validaciones: {} };
    const samuRules = { validaciones: {} };

    let countBase = 0, countHosp = 0, countPosta = 0, countSamu = 0;

    for (const sheet in rulesData) {
        rulesData[sheet].forEach(rule => {
            const { bucket, rule: normalizedRule } = normalizeScopedRule(rule);

            if (bucket === 'HOSPITAL') {
                pushRule(hospitalRules, sheet, normalizedRule);
                countHosp++;
                return;
            }

            if (bucket === 'POSTA') {
                pushRule(postaRules, sheet, normalizedRule);
                countPosta++;
                return;
            }

            if (bucket === 'SAMU') {
                pushRule(samuRules, sheet, normalizedRule);
                countSamu++;
                return;
            }

            pushRule(baseRules, sheet, normalizedRule);
            countBase++;
        });
    }

    const sourceCount = Object.values(rulesData).reduce((acc, rules) => acc + rules.length, 0);
    const splitCount = countBase + countHosp + countPosta + countSamu;

    if (sourceCount !== splitCount) {
        throw new Error(`Conteo inconsistente: origen=${sourceCount}, divididas=${splitCount}`);
    }

    if (!checkOnly) {
        fs.writeFileSync(baseJsonPath, JSON.stringify(baseRules, null, 4), 'utf8');
        fs.writeFileSync(hospitalJsonPath, JSON.stringify(hospitalRules, null, 4), 'utf8');
        fs.writeFileSync(postaJsonPath, JSON.stringify(postaRules, null, 4), 'utf8');
        fs.writeFileSync(samuJsonPath, JSON.stringify(samuRules, null, 4), 'utf8');
    }

    console.log(checkOnly ? '✅ Verificación completada.' : '✅ Sincronización completada.');
    console.log(`📊 Distribución de reglas:`);
    console.log(`  - Base: ${countBase}`);
    console.log(`  - Hospital: ${countHosp}`);
    console.log(`  - Posta: ${countPosta}`);
    console.log(`  - SAMU: ${countSamu}`);
    console.log(`  - Total origen: ${sourceCount}`);
    console.log(`  - Total dividido: ${splitCount}`);
}

try {
    parseRules();
} catch (e) {
    console.error('❌ Error en el proceso de sincronización:', e.message);
}
