const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const rulesPath = path.join(__dirname, '../data/Rules_nuevas.json');
const outputMdPath = path.join(__dirname, '../Simulation_Results.md');
const outputXlsxPath = path.join(__dirname, '../Simulation_Results.xlsx');

function runSimulation() {
    if (!fs.existsSync(rulesPath)) {
        console.error('El archivo de reglas no existe:', rulesPath);
        return;
    }

    const rulesData = fs.readFileSync(rulesPath, 'utf8');
    const catalog = JSON.parse(rulesData);

    let rules = [];
    if (Array.isArray(catalog)) {
        rules = catalog;
    } else if (catalog.validaciones) {
        rules = Object.values(catalog.validaciones).flat();
    } else if (catalog.reglas) {
        rules = catalog.reglas;
    }

    console.log(`Cargadas ${rules.length} reglas para simulación.`);

    let mdOutput = '# Reporte de Simulación de Reglas\n\n';
    mdOutput += 'Este reporte muestra cómo se comporta cada regla bajo distintos escenarios de datos simulados.\n\n';

    // Para no generar un archivo gigante, podemos agrupar por operador y mostrar ejemplos representativos
    // O correr todas las reglas. El usuario pidió "ir probando cada regla".
    // 5 escenarios por regla. Si hay 1000 reglas, serán 5000 lineas. Aceptable en un .md o .csv.
    // Usaremos un tabla markdown por regla (o una fila en una tabla general).

    mdOutput += '| ID Regla | Operador | Escenario | v1 | v2 | ¿Omitida? | ¿Cumple Regla (Pasa)? | Comentario | Mensaje Validación |\n';
    mdOutput += '|---|---|---|---|---|---|---|---|---|\n';

    let escenariosEvaluados = 0;
    let reglasEvaluadas = 0;

    const dataForExcel = [];

    for (const rule of rules) {
        if (!rule.operador) continue;
        reglasEvaluadas++;

        // Escenarios base
        const escenarios = [
            { nombre: 'Iguales', v1: 10, v2: 10 },
            { nombre: 'v1 Mayor', v1: 15, v2: 10 },
            { nombre: 'v2 Mayor', v1: 5, v2: 10 },
            { nombre: 'Ambos 0', v1: 0, v2: 0 },
            { nombre: 'v1 = 0', v1: 0, v2: 10 },
            { nombre: 'v2 = 0', v1: 10, v2: 0 }
        ];

        for (const esc of escenarios) {
            const result = evaluateRuleMock(rule, esc.v1, esc.v2);
            escenariosEvaluados++;

            let row = `| ${rule.id} | \`${rule.operador}\` | ${esc.nombre} | ${esc.v1} | ${esc.v2} | `;
            row += `${result.isOmitted ? 'Sí' : 'No'} | `;
            row += `${result.isValid ? '✅ Sí' : '❌ No'} | `;
            row += `${result.omissionReason || result.detail} | `;
            row += `${rule.mensaje || ''} |`;

            mdOutput += row + '\n';

            dataForExcel.push({
                'ID Regla': rule.id,
                'Operador': rule.operador,
                'Escenario': esc.nombre,
                'v1': esc.v1,
                'v2': esc.v2,
                '¿Omitida?': result.isOmitted ? 'Sí' : 'No',
                '¿Cumple Regla (Pasa)?': result.isValid ? 'Sí' : 'No',
                'Comentario': result.omissionReason || result.detail,
                'Mensaje Validación': rule.mensaje || ''
            });
        }
    }

    fs.writeFileSync(outputMdPath, mdOutput, 'utf8');

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(dataForExcel);
    xlsx.utils.book_append_sheet(wb, ws, 'Resultados_Simulación');
    xlsx.writeFile(wb, outputXlsxPath);

    console.log(`Simulación completada. Reglas evaluadas: ${reglasEvaluadas}. Escenarios probados: ${escenariosEvaluados}.`);
    console.log(`Reporte Markdown generado en: ${outputMdPath}`);
    console.log(`Reporte Excel generado en: ${outputXlsxPath}`);
}

function evaluateRuleMock(rule, v1, v2) {
    let isValid = false;
    let isOmitted = false;
    let omissionReason = '';

    // Lógica extraida de ruleEngine.ts
    if (rule.omitir_si_ambos_cero && v1 === 0 && v2 === 0) {
        isValid = true;
        isOmitted = true;
        omissionReason = 'Omitida: ambos 0';
    } else if (rule.omitir_si_v1_es_cero && v1 === 0) {
        isValid = true;
        isOmitted = true;
        omissionReason = 'Omitida: v1 es 0';
    } else {
        // Asumimos que no hay invertirOperador en esta simulación básica (se puede agregar si es necesario)
        let operador = rule.operador;
        switch (operador) {
            case '==': isValid = v1 === v2; break;
            case '!=': isValid = v1 !== v2; break;
            case '>': isValid = v1 > v2; break;
            case '<': isValid = v1 < v2; break;
            case '>=': isValid = v1 >= v2; break;
            case '<=': isValid = v1 <= v2; break;
            default: isValid = false;
        }
    }

    return {
        isValid,
        isOmitted,
        omissionReason,
        detail: isValid ? 'Regla se cumple' : 'Regla arroja ERROR'
    };
}

runSimulation();
