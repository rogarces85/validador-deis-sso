// Harness de validación que replica el pipeline de la app
import { promises as fs } from 'fs';
import path from 'path';
import { FilenameValidatorService } from '../services/filenameValidator.js';
import { NombreSheetValidator } from '../services/nombreSheetValidator.js';
import { RuleEngineService } from '../services/ruleEngine.js';
import { getMissingRequiredSheetsForSerie } from '../services/remSeriesConfig.js';
import { ExcelReaderService } from '../services/excelService.js';
import rules from '../data/reglas_finales.json';
import catalog from '../data/establishments.catalog.json';
import { Buffer } from 'node:buffer';

// Polyfill FileReader para Node
globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
        const self = this;
        if (blob && blob.arrayBuffer) {
            blob.arrayBuffer().then((buffer) => {
                if (self.onload) self.onload({ target: { result: buffer } });
            });
        }
    }
} as any;

const args = process.argv.slice(2);

interface PipelineOutput {
    archivo: string;
    serieForzada: string;
    mesForzado: string;
    codigoForzado: string;
    errorBloqueante: string | null;
    nombreResultados: any[];
    reglasEjecutadas: number;
    aprobadas: number;
    hallazgos: any[];
}

// Mapeo nombre amigable → serie/mes/codigo a usar en el harness.
// Sirve para cargar archivos FALLA que no cumplen el patrón por nombre.
function mapForced(name: string): { serie: string; mes: string; codigo: string } {
    const m = name.match(/123010P06_(P\d+)(?:_V\d+)?\.xlsm/i);
    if (m) {
        return { serie: m[1].toUpperCase(), mes: '06', codigo: '123010' };
    }
    if (/^123010P06\.xlsm$/.test(name)) {
        return { serie: 'P', mes: '06', codigo: '123010' };
    }
    if (/^123010P06_OK\.xlsm$/.test(name)) {
        return { serie: 'P', mes: '06', codigo: '123010' };
    }
    return { serie: 'A', mes: '06', codigo: '123010' };
}

async function procesar(file: string): Promise<PipelineOutput> {
    const filename = path.basename(file);
    const { serie, mes, codigo } = mapForced(filename);

    // 1. Filename validator (puede bloquearse pero seguimos para diagnóstico)
    const filenameValidator = new FilenameValidatorService();
    const fileValidation = filenameValidator.validate(filename);

    // 2. Cargar workbook con ExcelReaderService real
    const buffer = await fs.readFile(file);
    const blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
    const fileObj = new File([blob], filename, { type: 'application/vnd.ms-excel' });

    const excel = ExcelReaderService.getInstance();
    await excel.loadFile(fileObj);
    const sheets = excel.getSheets();

    // 3. Validar hojas obligatorias
    const missing = getMissingRequiredSheetsForSerie(serie, sheets);
    if (missing.length > 0) {
        return {
            archivo: filename,
            serieForzada: serie,
            mesForzado: mes,
            codigoForzado: codigo,
            errorBloqueante: `Hojas obligatorias faltantes: ${missing.join(', ')}`,
            nombreResultados: [],
            reglasEjecutadas: 0,
            aprobadas: 0,
            hallazgos: []
        };
    }

    // 4. Validar NOMBRE (forzando la serie real del archivo)
    const nombreValidator = new NombreSheetValidator();
    const nombreOutput = nombreValidator.validate(codigo, mes, serie);

    // 5. Cargar reglas aplicables a la serie
    const applicableRules: any[] = [];
    for (const sheetName of Object.keys(rules)) {
        if (sheetName.startsWith(serie)) {
            const arr = (rules as any)[sheetName];
            if (Array.isArray(arr)) applicableRules.push(...arr);
        }
    }

    const ruleEngine = new RuleEngineService();
    const establishment = (catalog as any).establecimientos.find((e: any) => e.codigo === codigo);
    const tipoEstablecimiento = establishment?.tipo;
    const rawType = (tipoEstablecimiento || '').toString().trim().toUpperCase();
    const normalizedType = rawType === 'OTRO' ? 'OTROS' : rawType === 'POSTAS' ? 'POSTA' : rawType;

    const metadata = {
        codigoEstablecimiento: codigo,
        serieRem: serie,
        mes: mes,
        periodo: '2026',
        extension: filename.split('.').pop() || 'xlsx',
        nombreOriginal: filename,
        sheets,
        tipoEstablecimiento: normalizedType
    };

    // 6. Evaluar reglas
    const ruleResults = await ruleEngine.evaluate(applicableRules, metadata);

    const hallazgos = ruleResults.filter((r: any) => r.resultado === false);
    const aprobadas = ruleResults.length - hallazgos.length;

    return {
        archivo: filename,
        serieForzada: serie,
        mesForzado: mes,
        codigoForzado: codigo,
        errorBloqueante: null,
        nombreResultados: nombreOutput.results,
        reglasEjecutadas: ruleResults.length,
        aprobadas,
        hallazgos: hallazgos.map((h: any) => ({
            id: h.ruleId,
            hoja: h.rem_sheet,
            severidad: h.severidad,
            operador: h.operador,
            valorActual: h.valorActual,
            valorEsperado: h.valorEsperado,
            diferencia: h.diferencia,
            mensaje: h.descripcion
        })),
        filenameValidatorResultado: fileValidation
    };
}

async function main() {
    const targets = args.length > 0 ? args : [];
    const filesToProcess = targets.length > 0
        ? targets
        : (await fs.readdir('.'))
            .filter((f: string) => f.startsWith('123010P06_') && f.endsWith('.xlsm'))
            .sort();

    const resumen: any[] = [];
    for (const file of filesToProcess) {
        try {
            const result = await procesar(file);
            resumen.push(result);
        } catch (err) {
            resumen.push({
                archivo: path.basename(file),
                errorTecnico: String(err)
            });
        }
    }

    const totalArchivos = resumen.length;
    const archivosValidados = resumen.filter((r: any) => !r.errorBloqueante && !r.errorTecnico).length;
    const archivosBloqueados = resumen.filter((r: any) => r.errorBloqueante).length;
    const archivosTecnicos = resumen.filter((r: any) => r.errorTecnico).length;
    const conHallazgos = resumen.filter((r: any) => r.hallazgos && r.hallazgos.length > 0).length;
    const sinHallazgos = resumen.filter((r: any) => r.hallazgos && r.hallazgos.length === 0 && !r.errorBloqueante).length;
    const totalHallazgos = resumen.reduce((acc: number, r: any) => acc + (r.hallazgos?.length || 0), 0);
    const totalReglas = resumen.reduce((acc: number, r: any) => acc + (r.reglasEjecutadas || 0), 0);
    const totalAprobadas = resumen.reduce((acc: number, r: any) => acc + (r.aprobadas || 0), 0);

    console.log('\n=== RESUMEN DE PIPELINE ===');
    console.log(JSON.stringify({
        totalArchivos,
        archivosValidados,
        archivosBloqueados,
        archivosConErrorTecnico: archivosTecnicos,
        archivosConHallazgos: conHallazgos,
        archivosSinHallazgos: sinHallazgos,
        totalReglasEjecutadas: totalReglas,
        totalAprobadas,
        totalHallazgos
    }, null, 2));

    console.log('\n=== DETALLE POR ARCHIVO ===');
    for (const r of resumen) {
        console.log(`\n[${r.archivo}]`);
        if (r.errorBloqueante) {
            console.log('  bloqueado:', r.errorBloqueante);
        } else if (r.errorTecnico) {
            console.log('  error tecnico:', r.errorTecnico);
        } else {
            console.log(`  serie=${r.serieForzada} mes=${r.mesForzado} establecimiento=${r.codigoForzado}`);
            console.log(`  reglas ejecutadas=${r.reglasEjecutadas} aprobadas=${r.aprobadas}`);
            console.log(`  hallazgos NOMBRE=${r.nombreResultados.length}`);
            console.log(`  hallazgos reglas=${r.hallazgos.length}`);
            for (const h of r.hallazgos) {
                console.log(`    - ${h.id} (${h.severidad}) ${h.hoja}: ${h.valorActual} ${h.operador} ${h.valorEsperado}`);
            }
        }
    }
}

main().catch((err) => {
    console.error('FATAL:', err);
    process.exit(1);
});
