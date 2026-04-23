/**
 * generate_report.cjs
 * Genera un informe completo de TODAS las validaciones del Validador DEIS SSO.
 * Incluye: reglas JSON (reglas_finales.json) + validaciones hoja NOMBRE (hardcoded).
 * Exporta a Markdown (.md) y Excel (.xlsx).
 */
const fs = require('fs');
const path = require('path');

// ── Configuración de rutas ──
const ROOT = process.cwd();
const RULES_PATH = path.join(ROOT, 'data', 'reglas_finales.json');
const OUTPUT_MD = path.join(ROOT, 'docs', 'validador_registro.md');
const OUTPUT_XLSX = path.join(ROOT, 'docs', 'Validador_Registro.xlsx');

// ── 1. Validaciones de la hoja NOMBRE (extraídas de nombreSheetValidator.ts) ──
const NOMBRE_VALIDATIONS = [
    {
        id: 'VAL_NOM01',
        rem_sheet: 'NOMBRE',
        tipo: 'CELDA',
        expresion_1: 'A9',
        operador: '==',
        expresion_2: '"Versión 1.2: Febrero 2026" o "Versión 1.1: Febrero 2026"',
        severidad: 'ERROR',
        mensaje: 'Verifica que la celda A9 contenga la versión aceptada del archivo REM.',
        detalle: 'Compara el texto de A9 contra las versiones válidas. Si no coincide, bloquea la validación con alerta de versión inválida. Es la validación de mayor prioridad.'
    },
    {
        id: 'VAL_NOM02',
        rem_sheet: 'NOMBRE',
        tipo: 'CELDA',
        expresion_1: 'B2',
        operador: '!=',
        expresion_2: '(vacío)',
        severidad: 'ERROR',
        mensaje: 'El nombre de la Comuna (celda B2) no debe estar vacío.',
        detalle: 'Valida que la celda B2 contenga el nombre de la comuna del establecimiento. Si está vacía, se genera un error.'
    },
    {
        id: 'VAL_NOM03',
        rem_sheet: 'NOMBRE',
        tipo: 'CONCATENACIÓN',
        expresion_1: 'C2+D2+E2+F2+G2',
        operador: 'IN catálogo',
        expresion_2: 'communes (catalog)',
        severidad: 'ERROR',
        mensaje: 'El código de comuna concatenado debe existir en el catálogo de establecimientos.',
        detalle: 'Concatena las celdas C2, D2, E2, F2 y G2 para formar el código de comuna. Luego verifica que dicho código exista en establishments.catalog.json. Además, valida que ninguna celda individual esté vacía.'
    },
    {
        id: 'VAL_NOM04',
        rem_sheet: 'NOMBRE',
        tipo: 'CELDA',
        expresion_1: 'B3',
        operador: '!=',
        expresion_2: '(vacío)',
        severidad: 'ERROR',
        mensaje: 'El nombre del Establecimiento (celda B3) no debe estar vacío.',
        detalle: 'Valida que la celda B3 contenga el nombre del establecimiento de salud.'
    },
    {
        id: 'VAL_NOM05',
        rem_sheet: 'NOMBRE',
        tipo: 'CONCATENACIÓN',
        expresion_1: 'C3+D3+E3+F3+G3+H3',
        operador: 'IN catálogo',
        expresion_2: 'establishments (catalog)',
        severidad: 'ERROR',
        mensaje: 'El código de establecimiento concatenado debe existir en el catálogo.',
        detalle: 'Concatena las celdas C3 a H3 para formar el código DEIS del establecimiento. Verifica su existencia en el catálogo. Cada celda individual tampoco puede estar vacía.'
    },
    {
        id: 'VAL_NOM06',
        rem_sheet: 'NOMBRE',
        tipo: 'CELDA',
        expresion_1: 'B6',
        operador: '!=',
        expresion_2: '(vacío)',
        severidad: 'ERROR',
        mensaje: 'El nombre del Mes (celda B6) no debe estar vacío.',
        detalle: 'Valida que la celda B6 contenga el nombre del mes de reporte.'
    },
    {
        id: 'VAL_NOM07',
        rem_sheet: 'NOMBRE',
        tipo: 'CONCATENACIÓN',
        expresion_1: 'C6+D6',
        operador: 'IN',
        expresion_2: '01-12',
        severidad: 'ERROR',
        mensaje: 'El código de mes concatenado (C6+D6) debe ser un mes válido entre 01 y 12.',
        detalle: 'Concatena C6 y D6 para formar el código del mes (ej. "03"). Verifica que sea un mes válido del 01 al 12.'
    },
    {
        id: 'VAL_NOM08',
        rem_sheet: 'NOMBRE',
        tipo: 'CELDA',
        expresion_1: 'B11',
        operador: '!=',
        expresion_2: '(vacío)',
        severidad: 'ERROR',
        mensaje: 'El nombre del Responsable del Establecimiento (celda B11) no debe estar vacío.',
        detalle: 'Valida que se haya ingresado el nombre del responsable del establecimiento en B11.'
    },
    {
        id: 'VAL_NOM09',
        rem_sheet: 'NOMBRE',
        tipo: 'CELDA',
        expresion_1: 'B12',
        operador: '!=',
        expresion_2: '(vacío)',
        severidad: 'ERROR',
        mensaje: 'El nombre del Jefe de Estadística (celda B12) no debe estar vacío.',
        detalle: 'Valida que se haya ingresado el nombre del jefe de estadística en B12.'
    }
];

// ── 2. Función para generar el campo "Detalle" automáticamente ──
function generateDetail(rule) {
    const op = rule.operador;
    const e1 = rule.expresion_1;
    const e2 = rule.expresion_2;

    let detail = '';

    // Detectar tipo de comparación
    if (String(e2) === '0') {
        if (op === '!=') {
            detail = `Verifica que la expresión [${e1}] contenga datos (no sea cero ni vacía).`;
        } else if (op === '==') {
            detail = `Verifica que la expresión [${e1}] NO contenga datos (sea cero o vacía).`;
        } else {
            detail = `Compara [${e1}] ${translateOp(op)} 0.`;
        }
    } else if (typeof e2 === 'string' && e2.includes('!')) {
        detail = `Comparación cross-sheet: verifica que [${e1}] ${translateOp(op)} [${e2}] (referencia a otra hoja del libro).`;
    } else if (typeof e2 === 'string' && e2.includes(':')) {
        detail = `Compara [${e1}] ${translateOp(op)} la suma del rango [${e2}].`;
    } else if (typeof e1 === 'string' && e1.includes(':')) {
        if (op === '!=') {
            detail = `Verifica que el rango [${e1}] contenga datos (al menos una celda no vacía).`;
        } else if (op === '==') {
            detail = `Verifica que el rango [${e1}] esté vacío.`;
        } else {
            detail = `Compara la suma del rango [${e1}] ${translateOp(op)} [${e2}].`;
        }
    } else {
        detail = `Compara [${e1}] ${translateOp(op)} [${e2}].`;
    }

    // Agregar info de flags opcionales
    const flags = [];
    if (rule.omitir_si_v1_es_cero) flags.push('Se omite si expresión_1 es 0');
    if (rule.omitir_si_ambos_cero) flags.push('Se omite si ambas expresiones son 0');
    if (rule.aplicar_a && rule.aplicar_a.length) flags.push(`Solo aplica a códigos: ${rule.aplicar_a.join(', ')}`);
    if (rule.aplicar_a_tipo && rule.aplicar_a_tipo.length) flags.push(`Solo aplica a tipo: ${rule.aplicar_a_tipo.join(', ')}`);
    if (rule.excluir_tipo && rule.excluir_tipo.length) flags.push(`Excluye tipo: ${rule.excluir_tipo.join(', ')}`);
    if (rule.establecimientos_excluidos && rule.establecimientos_excluidos.length) flags.push(`Excluye códigos: ${rule.establecimientos_excluidos.join(', ')}`);

    if (flags.length) {
        detail += ' | ' + flags.join('. ');
    }

    return detail;
}

function translateOp(op) {
    const ops = {
        '==': 'sea igual a',
        '!=': 'sea distinto de',
        '>': 'sea mayor que',
        '<': 'sea menor que',
        '>=': 'sea mayor o igual a',
        '<=': 'sea menor o igual a'
    };
    return ops[op] || op;
}

// ── 3. Leer y procesar reglas_finales.json ──
const rulesData = JSON.parse(fs.readFileSync(RULES_PATH, 'utf8'));

// Construir lista plana de todas las validaciones
const allValidations = [];

// Agregar NOMBRE primero
for (const v of NOMBRE_VALIDATIONS) {
    allValidations.push({
        id: v.id,
        rem_sheet: v.rem_sheet,
        tipo: v.tipo,
        expresion_1: v.expresion_1,
        operador: v.operador,
        expresion_2: v.expresion_2,
        severidad: v.severidad,
        mensaje: v.mensaje,
        aplica_a: '-',
        excluye: '-',
        opciones: '-',
        detalle: v.detalle
    });
}

// Agregar reglas JSON
for (const [sheet, rules] of Object.entries(rulesData)) {
    for (const rule of rules) {
        const aplicaA = [];
        if (rule.aplicar_a_tipo && rule.aplicar_a_tipo.length) aplicaA.push(`Tipo: ${rule.aplicar_a_tipo.join(', ')}`);
        if (rule.aplicar_a && rule.aplicar_a.length) aplicaA.push(`Códigos: ${rule.aplicar_a.join(', ')}`);

        const excluye = [];
        if (rule.excluir_tipo && rule.excluir_tipo.length) excluye.push(`Tipo: ${rule.excluir_tipo.join(', ')}`);
        if (rule.establecimientos_excluidos && rule.establecimientos_excluidos.length) excluye.push(`Códigos: ${rule.establecimientos_excluidos.join(', ')}`);

        const opciones = [];
        if (rule.omitir_si_v1_es_cero) opciones.push('Omitir si exp1=0');
        if (rule.omitir_si_ambos_cero) opciones.push('Omitir si ambos=0');

        allValidations.push({
            id: rule.id || 'N/A',
            rem_sheet: rule.rem_sheet || sheet,
            tipo: rule.tipo || 'CELDA',
            expresion_1: rule.expresion_1,
            operador: rule.operador,
            expresion_2: rule.expresion_2,
            severidad: rule.severidad,
            mensaje: rule.mensaje || rule.mensaje_original || '',
            aplica_a: aplicaA.length ? aplicaA.join('; ') : '-',
            excluye: excluye.length ? excluye.join('; ') : '-',
            opciones: opciones.length ? opciones.join('; ') : '-',
            detalle: generateDetail(rule)
        });
    }
}

// ── 4. Generar Markdown ──
function generateMarkdown() {
    const lines = [];
    lines.push('# 📋 Registro Completo de Validaciones — Validador DEIS SSO');
    lines.push('');
    lines.push(`> **Generado automáticamente** el ${new Date().toLocaleString('es-CL')} — Total: **${allValidations.length} validaciones**`);
    lines.push('');

    // Agrupar por hoja
    const bySheet = {};
    for (const v of allValidations) {
        if (!bySheet[v.rem_sheet]) bySheet[v.rem_sheet] = [];
        bySheet[v.rem_sheet].push(v);
    }

    // Orden: NOMBRE primero, luego alfanumérico
    const sheetOrder = Object.keys(bySheet).sort((a, b) => {
        if (a === 'NOMBRE') return -1;
        if (b === 'NOMBRE') return 1;
        return a.localeCompare(b, undefined, { numeric: true });
    });

    // Resumen por hoja
    lines.push('## 📊 Resumen por Hoja REM');
    lines.push('');
    lines.push('| Hoja REM | Cantidad de Validaciones |');
    lines.push('|----------|------------------------|');
    for (const sheet of sheetOrder) {
        lines.push(`| **${sheet}** | ${bySheet[sheet].length} |`);
    }
    lines.push('');
    lines.push('---');
    lines.push('');

    // Detalle por hoja
    for (const sheet of sheetOrder) {
        const rules = bySheet[sheet];
        lines.push(`## 📄 Hoja: ${sheet}`);
        lines.push(`> ${rules.length} validaciones`);
        lines.push('');

        for (const r of rules) {
            lines.push(`### ${r.id}`);
            lines.push(`- **Tipo:** ${r.tipo}`);
            lines.push(`- **Expresión 1:** \`${r.expresion_1}\``);
            lines.push(`- **Operador:** \`${r.operador}\``);
            lines.push(`- **Expresión 2:** \`${r.expresion_2}\``);
            lines.push(`- **Severidad:** ${r.severidad}`);
            lines.push(`- **Mensaje:** ${r.mensaje}`);
            if (r.aplica_a !== '-') lines.push(`- **Aplica a:** ${r.aplica_a}`);
            if (r.excluye !== '-') lines.push(`- **Excluye:** ${r.excluye}`);
            if (r.opciones !== '-') lines.push(`- **Opciones:** ${r.opciones}`);
            lines.push(`- **🔍 Detalle:** ${r.detalle}`);
            lines.push('');
        }

        lines.push('---');
        lines.push('');
    }

    return lines.join('\n');
}

// ── 5. Generar Excel ──
function generateExcel() {
    let XLSX;
    try {
        XLSX = require('xlsx');
    } catch (e) {
        console.warn('⚠️  Paquete "xlsx" no encontrado. Instalando...');
        require('child_process').execSync('npm install xlsx', { cwd: ROOT, stdio: 'inherit' });
        XLSX = require('xlsx');
    }

    const wb = XLSX.utils.book_new();

    // Hoja RESUMEN
    const summaryRows = [];
    const bySheet = {};
    for (const v of allValidations) {
        if (!bySheet[v.rem_sheet]) bySheet[v.rem_sheet] = [];
        bySheet[v.rem_sheet].push(v);
    }

    const sheetOrder = Object.keys(bySheet).sort((a, b) => {
        if (a === 'NOMBRE') return -1;
        if (b === 'NOMBRE') return 1;
        return a.localeCompare(b, undefined, { numeric: true });
    });

    summaryRows.push(['Hoja REM', 'Cantidad']);
    for (const sheet of sheetOrder) {
        summaryRows.push([sheet, bySheet[sheet].length]);
    }
    summaryRows.push(['TOTAL', allValidations.length]);

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    wsSummary['!cols'] = [{ wch: 15 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

    // Hoja COMPLETA con todas las validaciones
    const headers = ['ID', 'Hoja REM', 'Tipo', 'Expresión 1', 'Operador', 'Expresión 2', 'Severidad', 'Mensaje', 'Aplica a', 'Excluye', 'Opciones', 'Detalle'];
    const allRows = [headers];
    for (const v of allValidations) {
        allRows.push([
            v.id, v.rem_sheet, v.tipo,
            String(v.expresion_1), v.operador, String(v.expresion_2),
            v.severidad, v.mensaje, v.aplica_a, v.excluye, v.opciones, v.detalle
        ]);
    }

    const wsAll = XLSX.utils.aoa_to_sheet(allRows);
    wsAll['!cols'] = [
        { wch: 14 }, { wch: 10 }, { wch: 14 },
        { wch: 20 }, { wch: 8 }, { wch: 20 },
        { wch: 12 }, { wch: 60 }, { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 60 }
    ];
    XLSX.utils.book_append_sheet(wb, wsAll, 'Todas');

    // Hojas individuales por REM
    for (const sheet of sheetOrder) {
        const rules = bySheet[sheet];
        const rows = [headers];
        for (const v of rules) {
            rows.push([
                v.id, v.rem_sheet, v.tipo,
                String(v.expresion_1), v.operador, String(v.expresion_2),
                v.severidad, v.mensaje, v.aplica_a, v.excluye, v.opciones, v.detalle
            ]);
        }
        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws['!cols'] = wsAll['!cols'];
        // Nombre de hoja Excel max 31 chars
        const sheetName = sheet.length > 31 ? sheet.substring(0, 31) : sheet;
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    XLSX.writeFile(wb, OUTPUT_XLSX);
}

// ── MAIN ──
console.log('📋 Generando informe de validaciones...');
console.log(`   Total de validaciones encontradas: ${allValidations.length}`);

// Markdown
const mdContent = generateMarkdown();
fs.writeFileSync(OUTPUT_MD, mdContent, 'utf8');
console.log(`✅ Markdown generado: ${path.basename(OUTPUT_MD)}`);

// Excel
generateExcel();
console.log(`✅ Excel generado: ${path.basename(OUTPUT_XLSX)}`);

console.log('\n🎉 Informe completo generado exitosamente.');
