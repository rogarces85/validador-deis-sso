const fs = require('fs');
const path = require('path');

const rulesPath = path.join(__dirname, '../data/Rules_nuevas.json');

// Regex para detectar referencias a otras hojas: A01!, A03!, etc.
const SHEET_REF_REGEX = /([A-Z]\d{2}[a-z]?)!/g;

/**
 * Extrae la sección del campo "mensaje" de una regla.
 * Formato esperado: "REM A01 | Seccion NOMBRE_SECCION: ..."
 */
function extractSeccion(mensaje) {
    if (!mensaje) return '';
    const match = mensaje.match(/Seccion\s+([^:]+):/i);
    if (match && match[1]) {
        const sec = match[1].trim();
        return sec === '?' ? '' : sec;
    }
    return '';
}

/**
 * Detecta hojas externas referenciadas en una expresión.
 */
function detectExternalSheets(expression, currentSheet) {
    const sheets = new Set();
    if (!expression || typeof expression !== 'string') return sheets;
    let m;
    const regex = new RegExp(SHEET_REF_REGEX.source, 'g');
    while ((m = regex.exec(expression)) !== null) {
        if (m[1] !== currentSheet) {
            sheets.add(m[1]);
        }
    }
    return sheets;
}

/**
 * Determina la hoja REM secundaria analizando las expresiones.
 */
function detectRemSheet2(rule) {
    const expr1 = String(rule.expresion_1 || '');
    const expr2 = String(rule.expresion_2 || '');
    const currentSheet = rule.rem_sheet;

    const sheetsInExpr2 = detectExternalSheets(expr2, currentSheet);
    if (sheetsInExpr2.size > 0) return [...sheetsInExpr2][0];

    const sheetsInExpr1 = detectExternalSheets(expr1, currentSheet);
    if (sheetsInExpr1.size > 0) return [...sheetsInExpr1][0];

    return null;
}

/**
 * Busca la sección correspondiente a una celda en una hoja externa.
 */
function inferSeccionFromExternalSheet(allValidaciones, externalSheet, cellRef) {
    if (!allValidaciones[externalSheet]) return '';
    const cleanRef = cellRef.replace(/[A-Z]\d{2}[a-z]?!\(?/g, '').replace(/\)$/g, '');
    const cellMatch = cleanRef.match(/([A-Z]+)(\d+)/);
    if (!cellMatch) return '';
    const refRow = parseInt(cellMatch[2]);

    let bestMatch = null;
    let bestDistance = Infinity;

    for (const rule of allValidaciones[externalSheet]) {
        const expr1 = String(rule.expresion_1 || '');
        const rowMatch = expr1.match(/([A-Z]+)(\d+)/);
        if (rowMatch) {
            const ruleRow = parseInt(rowMatch[2]);
            const distance = Math.abs(ruleRow - refRow);
            const sec = rule.seccion || rule.seccion_expresion_1 || '';
            if (distance < bestDistance && sec && sec !== '?' && sec !== '') {
                bestDistance = distance;
                bestMatch = sec;
            }
        }
    }

    if (bestDistance < 30 && bestMatch) return bestMatch;
    return '';
}

function organizeRules() {
    if (!fs.existsSync(rulesPath)) {
        console.error('El archivo de reglas no existe:', rulesPath);
        return;
    }

    const rulesData = fs.readFileSync(rulesPath, 'utf8');
    const catalog = JSON.parse(rulesData);

    if (!catalog.validaciones) {
        console.error('No se encontró la clave "validaciones" en el JSON.');
        return;
    }

    const newValidaciones = {};
    let simpleCount = 0;
    let complexCount = 0;

    for (const sheet in catalog.validaciones) {
        let rules = catalog.validaciones[sheet];

        rules = rules.map(rule => {
            const isSimple = rule.expresion_2 === 0;

            // Extraer sección actual (de cualquier campo que exista)
            let currentSeccion = rule.seccion_expresion_1 || rule.seccion || '';
            if (!currentSeccion || currentSeccion === '?') {
                currentSeccion = extractSeccion(rule.mensaje);
            }
            // Limpiar "?" residuales
            if (currentSeccion === '?') currentSeccion = '';

            // Detectar hoja y sección secundaria
            const remSheet2 = detectRemSheet2(rule);
            let seccionExpr2 = rule.seccion_expresion_2 || '';
            if (!seccionExpr2 && remSheet2) {
                const expr2Str = String(rule.expresion_2 || '');
                const expr1Str = String(rule.expresion_1 || '');
                const externalInExpr2 = detectExternalSheets(expr2Str, rule.rem_sheet).size > 0;
                const refToSearch = externalInExpr2 ? expr2Str : expr1Str;
                seccionExpr2 = inferSeccionFromExternalSheet(catalog.validaciones, remSheet2, refToSearch);
            }
            if (seccionExpr2 === '?') seccionExpr2 = '';

            let orderedRule = {};

            if (isSimple) {
                // ── FORMATO SIMPLE (vs 0) ──
                simpleCount++;
                orderedRule.id = rule.id;
                orderedRule.seccion = currentSeccion;
                orderedRule.tipo = rule.tipo;
                orderedRule.rem_sheet = rule.rem_sheet;
                orderedRule.expresion_1 = rule.expresion_1;
                orderedRule.operador = rule.operador;
                orderedRule.expresion_2 = rule.expresion_2;
                orderedRule.severidad = rule.severidad;
            } else {
                // ── FORMATO COMPLEJO (celda vs celda) ──
                complexCount++;
                orderedRule.id = rule.id;
                orderedRule.seccion_expresion_1 = currentSeccion;
                orderedRule.tipo = rule.tipo;
                orderedRule.rem_sheet = rule.rem_sheet;
                orderedRule.expresion_1 = rule.expresion_1;
                orderedRule.operador = rule.operador;

                // Campos de la segunda expresión
                if (remSheet2) {
                    orderedRule.rem_sheet_2 = remSheet2;
                }
                orderedRule.seccion_expresion_2 = seccionExpr2;
                orderedRule.expresion_2 = rule.expresion_2;
                orderedRule.severidad = rule.severidad;
            }

            // Copiar propiedades opcionales
            if (rule.omitir_si_ambos_cero) orderedRule.omitir_si_ambos_cero = rule.omitir_si_ambos_cero;
            if (rule.omitir_si_v1_es_cero) orderedRule.omitir_si_v1_es_cero = rule.omitir_si_v1_es_cero;
            if (rule.establecimientos_excluidos) orderedRule.establecimientos_excluidos = rule.establecimientos_excluidos;
            if (rule.aplicar_a_tipo) orderedRule.aplicar_a_tipo = rule.aplicar_a_tipo;
            if (rule.aplicar_a) orderedRule.aplicar_a = rule.aplicar_a;
            if (rule.excluir_tipo) orderedRule.excluir_tipo = rule.excluir_tipo;
            if (rule.rem_sheet_ext) orderedRule.rem_sheet_ext = rule.rem_sheet_ext;

            // Mensaje siempre al final
            orderedRule.mensaje = rule.mensaje;

            return orderedRule;
        });

        // Ordenar: simples primero por seccion, luego complejas por seccion_expresion_1
        rules.sort((a, b) => {
            const secA = a.seccion || a.seccion_expresion_1 || '';
            const secB = b.seccion || b.seccion_expresion_1 || '';
            if (secA < secB) return -1;
            if (secA > secB) return 1;
            return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
        });

        newValidaciones[sheet] = rules;
    }

    catalog.validaciones = newValidaciones;

    fs.writeFileSync(rulesPath, JSON.stringify(catalog, null, 4), 'utf8');
    console.log(`Reglas organizadas exitosamente.`);
    console.log(`Reglas SIMPLES (seccion): ${simpleCount}`);
    console.log(`Reglas COMPLEJAS (seccion_expresion_1/2): ${complexCount}`);
    console.log(`Total: ${simpleCount + complexCount}`);
}

organizeRules();
