/**
 * convertCatalog.ts
 * Script de conversión: lee establecimientos.txt y genera establishments.catalog.json
 *
 * Uso: npx tsx scripts/convertCatalog.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Tipos inline (para evitar dependencias de import en el script standalone)
type EstablishmentType =
    | 'HOSPITAL' | 'CESFAM' | 'POSTA' | 'CECOSF'
    | 'SAPU' | 'SUR' | 'COSAM' | 'SALUD_MENTAL'
    | 'DIRECCION' | 'MOVIL' | 'PRIVADA' | 'OTROS';

const VALID_TYPES: EstablishmentType[] = [
    'HOSPITAL', 'CESFAM', 'POSTA', 'CECOSF',
    'SAPU', 'SUR', 'COSAM', 'SALUD_MENTAL',
    'DIRECCION', 'MOVIL', 'PRIVADA', 'OTROS',
];

interface Establishment {
    codigo: string;
    nombre: string;
    tipo: EstablishmentType;
    comuna: string;
    activo: boolean;
}

interface EstablishmentCatalog {
    version: string;
    generadoEl: string;
    servicioDeSalud: string;
    totalEstablecimientos: number;
    establecimientos: Establishment[];
}

/**
 * Normaliza un código a 6 dígitos con zero-padding izquierdo.
 */
function normalizeCode(raw: string): string {
    const cleaned = raw.trim().replace(/\D/g, '');
    return cleaned.padStart(6, '0');
}

/**
 * Normaliza el tipo de establecimiento a uno válido del enum.
 */
function normalizeType(raw: string): EstablishmentType {
    const upper = raw.trim().toUpperCase();

    // Mapeo directo
    if (VALID_TYPES.includes(upper as EstablishmentType)) {
        return upper as EstablishmentType;
    }

    // Mapeos especiales
    const typeMap: Record<string, EstablishmentType> = {
        'OTRO': 'OTROS',
        'OTORS': 'OTROS',
        'CESFAM': 'CESFAM',
        'HOSPITAL': 'HOSPITAL',
    };

    return typeMap[upper] ?? 'OTROS';
}

/**
 * Parsea una línea del formato PHP-array.
 *
 * Formato esperado:
 *   "123000" => ["nombre" => "DEMO", "comuna" => "10301", "tipo" => "Otro"],
 */
function parseLine(line: string): Establishment | null {
    // Regex para capturar: "código" => ["nombre" => "valor", "comuna" => "valor", "tipo" => "valor"]
    const regex = /["'](\d{3,6})["']\s*=>\s*\[.*?["']nombre["']\s*=>\s*["']([^"']+)["'].*?["']comuna["']\s*=>\s*["'](\d+)["'].*?["']tipo["']\s*=>\s*["']([^"']+)["']/i;
    const match = line.match(regex);

    if (!match) {
        return null;
    }

    const [, rawCode, nombre, comuna, tipo] = match;

    return {
        codigo: normalizeCode(rawCode),
        nombre: nombre.trim(),
        tipo: normalizeType(tipo),
        comuna: comuna.trim(),
        activo: true,
    };
}

/**
 * Lee y parsea el archivo de establecimientos.
 */
function readEstablishments(filePath: string): Establishment[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const establishments: Establishment[] = [];
    const errors: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('//') || line.startsWith('#')) {
            continue;
        }

        const est = parseLine(line);
        if (est) {
            establishments.push(est);
        } else if (line.includes('=>')) {
            errors.push(`Línea ${i + 1}: No se pudo parsear: ${line.substring(0, 80)}...`);
        }
    }

    if (errors.length > 0) {
        console.warn('\n⚠️  Advertencias durante el parseo:');
        errors.forEach((e) => console.warn(`   ${e}`));
    }

    return establishments;
}

/**
 * Valida el catálogo generado.
 */
function validateCatalog(catalog: EstablishmentCatalog): string[] {
    const errors: string[] = [];
    const codes = new Set<string>();

    for (let i = 0; i < catalog.establecimientos.length; i++) {
        const est = catalog.establecimientos[i];

        // Código: 6 dígitos
        if (!/^\d{6}$/.test(est.codigo)) {
            errors.push(`[${i}] Código inválido: "${est.codigo}"`);
        }

        // Duplicados
        if (codes.has(est.codigo)) {
            errors.push(`[${i}] Código duplicado: "${est.codigo}"`);
        }
        codes.add(est.codigo);

        // Nombre no vacío
        if (!est.nombre.trim()) {
            errors.push(`[${i}] Nombre vacío para código "${est.codigo}"`);
        }

        // Tipo válido
        if (!VALID_TYPES.includes(est.tipo)) {
            errors.push(`[${i}] Tipo inválido: "${est.tipo}" para código "${est.codigo}"`);
        }

        // Comuna: 5 dígitos
        if (!/^\d{5}$/.test(est.comuna)) {
            errors.push(`[${i}] Comuna inválida: "${est.comuna}" para código "${est.codigo}"`);
        }
    }

    // Total coherencia
    if (catalog.totalEstablecimientos !== catalog.establecimientos.length) {
        errors.push(`totalEstablecimientos (${catalog.totalEstablecimientos}) ≠ real (${catalog.establecimientos.length})`);
    }

    return errors;
}

/**
 * Resumen por tipo.
 */
function printSummary(establishments: Establishment[]): void {
    const byType: Record<string, number> = {};
    const byComuna: Record<string, number> = {};

    for (const est of establishments) {
        byType[est.tipo] = (byType[est.tipo] || 0) + 1;
        byComuna[est.comuna] = (byComuna[est.comuna] || 0) + 1;
    }

    console.log('\n📊 Resumen por tipo:');
    Object.entries(byType)
        .sort(([, a], [, b]) => b - a)
        .forEach(([tipo, count]) => {
            console.log(`   ${tipo.padEnd(15)} ${count}`);
        });

    console.log('\n📊 Resumen por comuna:');
    Object.entries(byComuna)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([comuna, count]) => {
            console.log(`   ${comuna.padEnd(10)} ${count}`);
        });
}

// ─── Main ─────────────────────────────────────────────────

function main(): void {
    const projectRoot = path.resolve(__dirname, '..');
    const inputFile = path.join(projectRoot, 'establecimientos.txt');
    const outputFile = path.join(projectRoot, 'data', 'establishments.catalog.json');

    console.log('🏥 Convertidor de Catálogo de Establecimientos SSO');
    console.log('══════════════════════════════════════════════════\n');
    console.log(`📄 Fuente:  ${inputFile}`);
    console.log(`📦 Destino: ${outputFile}\n`);

    // 1. Leer y parsear
    if (!fs.existsSync(inputFile)) {
        console.error(`❌ Archivo fuente no encontrado: ${inputFile}`);
        process.exit(1);
    }

    const establishments = readEstablishments(inputFile);
    console.log(`✅ Parseados: ${establishments.length} establecimientos\n`);

    // 2. Generar catálogo
    const catalog: EstablishmentCatalog = {
        version: '2026.1.0',
        generadoEl: new Date().toISOString(),
        servicioDeSalud: 'Servicio de Salud Osorno',
        totalEstablecimientos: establishments.length,
        establecimientos: establishments,
    };

    // 3. Validar
    const validationErrors = validateCatalog(catalog);
    if (validationErrors.length > 0) {
        console.error('❌ Errores de validación:');
        validationErrors.forEach((e) => console.error(`   ${e}`));
        process.exit(1);
    }
    console.log('✅ Validación exitosa: sin errores\n');

    // 4. Escribir JSON
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(catalog, null, 2), 'utf-8');
    console.log(`✅ Archivo generado: ${outputFile}`);
    console.log(`   Tamaño: ${(fs.statSync(outputFile).size / 1024).toFixed(1)} KB`);

    // 5. Resumen
    printSummary(establishments);

    // 6. Cross-reference con rules.json
    const rulesFile = path.join(projectRoot, 'rules.json');
    if (fs.existsSync(rulesFile)) {
        console.log('\n🔗 Validación cruzada con rules.json...');
        const rulesData = JSON.parse(fs.readFileSync(rulesFile, 'utf-8'));
        const rules = rulesData.validaciones || rulesData;
        const catalogCodes = new Set(establishments.map((e) => e.codigo));
        const warnings: string[] = [];

        for (const [serie, serieRules] of Object.entries(rules)) {
            for (const rule of serieRules as any[]) {
                const checkCodes = (field: string, codes: string[]) => {
                    for (const code of codes) {
                        const normalized = normalizeCode(code);
                        if (!catalogCodes.has(normalized) && !catalogCodes.has(code)) {
                            warnings.push(`   ⚠️  ${serie}/${rule.id}: ${field} → "${code}" no existe en catálogo`);
                        }
                    }
                };

                if (rule.aplicar_a) checkCodes('aplicar_a', rule.aplicar_a);
                if (rule.establecimientos_excluidos) checkCodes('excluidos', rule.establecimientos_excluidos);
            }
        }

        if (warnings.length > 0) {
            console.log(`\n⚠️  ${warnings.length} referencias a códigos no encontrados:`);
            warnings.forEach((w) => console.log(w));
        } else {
            console.log('   ✅ Todas las referencias de reglas existen en el catálogo');
        }
    }

    console.log('\n✨ Conversión completada exitosamente!\n');
}

main();
