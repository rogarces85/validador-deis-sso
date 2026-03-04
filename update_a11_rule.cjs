const fs = require('fs');

const nuevasPath = './data/Rules_nuevas.json';
const data = JSON.parse(fs.readFileSync(nuevasPath, 'utf8'));

if (data.validaciones && data.validaciones['A11']) {
    let affected = 0;
    data.validaciones['A11'] = data.validaciones['A11'].map(rule => {
        if (rule.expresion_1 === 'C152:P156') {
            rule.omitir_si_v1_es_cero = true;
            rule.mensaje = "REM A11 | SECCIÓN B.2: EXÁMENES SEGÚN GRUPOS DE USUARIOS POR CONDICIÓN DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS (USO EXCLUSIVO DE ESTABLECIMIENTOS QUE COMPRAN SERVICIO) | C152, P156. La expresión indica que [C152:P156] la celda debe contener datos.";
            affected++;
        }
        return rule;
    });

    // If the rule didn't exist for some reason, we should insert it, but wait: the user says "agrega a esta validacion la opcion...". This implies the rule already exists in Rules_nuevas.json.

    fs.writeFileSync(nuevasPath, JSON.stringify(data, null, 4));
    console.log(`Modificadas ${affected} reglas.`);
} else {
    console.log("No se encontró la hoja A11.");
}
