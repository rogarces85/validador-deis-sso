const fs = require('fs');

const rulesPath = './rules.json';
const nuevasPath = './data/Rules_nuevas.json';

const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
const nuevasData = JSON.parse(fs.readFileSync(nuevasPath, 'utf8'));

let addedCount = 0;

for (const [sheet, nuevasRules] of Object.entries(nuevasData.validaciones)) {
    if (!rulesData.validaciones[sheet]) {
        rulesData.validaciones[sheet] = [];
    }

    const existingRules = rulesData.validaciones[sheet];

    for (const nuevaRule of nuevasRules) {
        // Find if this rule already exists in rules.json
        const exists = existingRules.some(r =>
            String(r.expresion_1) === String(nuevaRule.expresion_1) &&
            String(r.expresion_2) === String(nuevaRule.expresion_2) &&
            String(r.operador) === String(nuevaRule.operador)
        );

        if (!exists) {
            // Generate a VAL ID
            const highestVal = existingRules.reduce((max, r) => {
                const match = r.id.match(/VAL(\d+)/);
                if (match) {
                    return Math.max(max, parseInt(match[1], 10));
                }
                return max;
            }, 0);

            const newId = `VAL${String(highestVal + 1).padStart(2, '0')}`;

            // Build the rule to add
            const ruleToAdd = {
                ...nuevaRule,
                id: newId
            };

            // Revert new formatting in 'mensaje' maybe? 
            // The prompt says "utiliza las skill que aprendiste", 
            // "mejora-mensajes-errores" skill updates the messages!
            // Wait, Rules_nuevas.json ALREADY has the updated messages.

            existingRules.push(ruleToAdd);
            addedCount++;
            console.log(`[${sheet}] Added rule linking ${nuevaRule.expresion_1} and ${nuevaRule.expresion_2}`);
        }
    }
}

fs.writeFileSync(rulesPath, JSON.stringify(rulesData, null, 4));
console.log(`\nSuccessfully added ${addedCount} missing rules to rules.json.`);
