const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const projectRoot = path.resolve(__dirname, '..');
const sourceFile = path.join(projectRoot, 'Reestructuracion_Expandido.xlsx');

const catalogRows = [
  ['123010', 'Dirección Servicio Salud Osorno', 'Dir_Servicio_Salud', '10301', 'DIRECCION'],
  ['123011', 'PRAIS', 'Prais', '10301', 'OTROS'],
  ['123012', 'Clínica Dental Móvil (Osorno)', 'Clinica_dental_Movil', '10301', 'MOVIL'],
  ['123030', 'Departamento de Atención Integral Funcionarios', 'DAIF', '10301', 'HOSPITAL'],
  ['123100', 'Hospital Base San José de Osorno', 'Hosp_Base', '10301', 'HOSPITAL'],
  ['123101', 'Hospital de Purranque Dr. Juan Hepp Dubiau', 'Hosp_Purranque', '10303', 'HOSPITAL'],
  ['123102', 'Hospital de Río Negro', 'Hosp_Rio_Negro', '10305', 'HOSPITAL'],
  ['123103', 'Hospital de Puerto Octay', 'Hosp_Poctay', '10302', 'HOSPITAL'],
  ['123104', 'Hospital Futa Sruka Lawenche Kunko Mapu Mo', 'Hosp_Futa_Sruka', '10306', 'HOSPITAL'],
  ['123105', 'Hospital Pu Mulen Quilacahuín', 'Hosp_Pu_Mulen_Quila', '10307', 'HOSPITAL'],
  ['123203', 'Clinica Alemana Osorno', 'Clin_Alemana_Osor', '10301', 'OTROS'],
  ['123207', 'Centro de Rehabilitación de Minusválidos', 'CR_Minusvalidos', '10303', 'OTROS'],
  ['123300', 'Centro de Salud Familiar Dr. Pedro Jáuregui', 'Jauregui', '10301', 'CESFAM'],
  ['123301', 'Centro de Salud Familiar Dr. Marcelo Lopetegui Adams', 'Lopetegui', '10301', 'CESFAM'],
  ['123302', 'Centro de Salud Familiar Ovejería', 'Ovejeria', '10301', 'CESFAM'],
  ['123303', 'Centro de Salud Familiar Rahue Alto', 'Rahue_Alto', '10301', 'CESFAM'],
  ['123304', 'Centro de Salud Familiar Entre Lagos', 'Cesfam_Entre_Lagos', '10304', 'CESFAM'],
  ['123305', 'Centro de Salud Familiar San Pablo', 'Cesfam_San_Pablo', '10307', 'CESFAM'],
  ['123306', 'Centro de Salud Familiar Pampa Alegre', 'P_Alegre', '10301', 'CESFAM'],
  ['123307', 'Centro de Salud Familiar Purranque', 'Cesfam_Purranque', '10303', 'CESFAM'],
  ['123309', 'Centro de Salud Familiar Practicante Pablo Araya', 'Cesfam_P_P_Araya', '10305', 'CESFAM'],
  ['123310', 'Centro de Salud Familiar Quinto Centenario', 'Quinto', '10301', 'CESFAM'],
  ['123311', 'Centro de Salud Familiar Bahía Mansa', 'Cesfam_Bahia', '10306', 'CESFAM'],
  ['123312', 'Centro de Salud Familiar Puaucho', 'Cesfam_Puaucho', '10306', 'CESFAM'],
  ['123402', 'Posta de Salud Rural Cuinco', 'PSR_Cuinco', '10306', 'POSTA'],
  ['123404', 'Posta de Salud Rural Pichi Damas', 'PSR_Pichi_Damas', '10301', 'POSTA'],
  ['123406', 'Posta de Salud Rural Puyehue', 'PSR_Puyehue', '10304', 'POSTA'],
  ['123407', 'Posta de Salud Rural Desagüe Rupanco', 'PSR_D_Rupanco', '10304', 'POSTA'],
  ['123408', 'Posta de Salud Rural Ñadi Pichi-Damas', 'PSR_Ñ_P_Damas', '10304', 'POSTA'],
  ['123410', 'Posta de Salud Rural Tres Esteros', 'PSR_T_Esteros', '10305', 'POSTA'],
  ['123411', 'Centro Comunitario de Salud Familiar Corte Alto', 'Cecosf_Corte_Alto', '10303', 'POSTA'],
  ['123412', 'Posta de Salud Rural Crucero ( Purranque)', 'PSR_Crucero', '10303', 'POSTA'],
  ['123413', 'Posta de Salud Rural Coligual', 'PSR_Coligual', '10303', 'POSTA'],
  ['123414', 'Posta de Salud Rural Hueyusca', 'PSR_Hueyusca', '10303', 'POSTA'],
  ['123415', 'Posta de Salud Rural Concordia', 'PSR_Concordia', '10303', 'POSTA'],
  ['123416', 'Posta de Salud Rural Colonia Ponce', 'PSR_C_Ponce', '10303', 'POSTA'],
  ['123417', 'Posta de Salud Rural La Naranja', 'PSR_La_Naranja', '10303', 'POSTA'],
  ['123419', 'Posta de Salud Rural San Pedro de Purranque', 'PSR_S_P_Purranque', '10303', 'POSTA'],
  ['123420', 'Posta de Salud Rural Collihuinco', 'PSR_Collihuinco', '10303', 'POSTA'],
  ['123422', 'Posta de Salud Rural Rupanco', 'PSR_Rupanco', '10302', 'POSTA'],
  ['123423', 'Posta de Salud Rural Cascadas', 'PSR_Cascadas', '10302', 'POSTA'],
  ['123424', 'Posta de Salud Rural Piedras Negras', 'PSR_P_Negras', '10302', 'POSTA'],
  ['123425', 'Posta de Salud Rural Cancura', 'PSR_Cancura', '10301', 'POSTA'],
  ['123426', 'Posta de Salud Rural Pellinada', 'PSR_Pellinada', '10302', 'POSTA'],
  ['123427', 'Posta de Salud Rural La Calo', 'PSR_La_calo', '10302', 'POSTA'],
  ['123428', 'Posta de Salud Rural Coihueco (Puerto Octay)', 'PSR_Coihueco', '10302', 'POSTA'],
  ['123430', 'Posta de Salud Rural Purrehuín', 'PSR_Purrehuin', '10306', 'POSTA'],
  ['123431', 'Posta de Salud Rural Aleucapi', 'PSR_Aleucapi', '10306', 'POSTA'],
  ['123432', 'Posta de Salud Rural La Poza', 'PSR_La_Poza', '10307', 'POSTA'],
  ['123434', 'Posta de Salud Rural Huilma', 'PSR_Huilma', '10305', 'POSTA'],
  ['123435', 'Posta de Salud Rural Pucopio', 'PSR_Pucopio', '10307', 'POSTA'],
  ['123436', 'Posta de Salud Rural Chanco ( San Pablo )', 'PSR_Chanco', '10307', 'POSTA'],
  ['123437', 'Posta de Salud Rural Currimáhuida', 'PSR_Currimahuida', '10307', 'POSTA'],
  ['123700', 'Centro Comunitario de Salud Familiar Murrinumo', 'CECOSF_Murrinumo', '10301', 'CECOSF'],
  ['123701', 'Centro Comunitario de Salud Familiar Manuel Rodríguez', 'CECOSF_M_Rodriguez', '10301', 'CECOSF'],
  ['123705', 'Centro Comunitario de Salud Familiar El Encanto', 'CECOSF_El_Encanto', '10304', 'CECOSF'],
  ['123709', 'Centro Comunitario de Salud Familiar Riachuelo', 'CECOSF_Riachuelo', '10305', 'CECOSF'],
  ['123800', 'SAPU Dr. Pedro Jáuregui', 'SAPU_Dental_Jauregui', '10301', 'SAPU'],
  ['123801', 'SAPU Rahue Alto', 'SAPU_Rahue_Alto', '10301', 'SAPU'],
  ['200085', 'SAPU Dr. Marcelo Lopetegui Adams', 'SAPU_Lopetegui', '10301', 'SAPU'],
  ['200209', 'COSAM Rahue', 'Cosam_Rahue', '10301', 'OTROS'],
  ['200248', 'CDR de Adultos Mayores con Demencia', 'CDRAM', '10301', 'OTROS'],
  ['200445', 'COSAM Oriente', 'Cosam_Oriente', '10301', 'OTROS'],
  ['200455', 'Centro Comunitario de Salud Familiar Barrio Estación', 'CECOSF_Barrio_Estacion', '10303', 'CESFAM'],
  ['200477', 'Unidad de Memoria AYEKAN', 'UM_Ayecan', '10301', 'OTROS'],
  ['200490', 'Posta de Salud Rural Chamilco', 'PSR_Chamilco', '10306', 'POSTA'],
  ['200539', 'Centro Referencia Diagnóstico Médico Osorno', 'CDR_Osorno', '10301', 'OTROS'],
  ['200556', 'Hospital Digital', 'Hosp_digital', '10301', 'OTROS'],
  ['200747', 'SAPU Entre Lagos', 'SAPU_Entre_Lagos', '10304', 'SAPU'],
  ['200748', 'SUR San Pablo', 'SUR_San_Pablo', '10307', 'SUR'],
  ['200749', 'SUR Bahía Mansa', 'SUR_Bahia_Mansa', '10306', 'SUR'],
  ['200750', 'SUR Puaucho', 'SUR_Puaucho', '10306', 'SUR'],
  ['201055', 'Terapéutica Peulla Ambulatoria', 'Peulla_Ambulat', '10301', 'OTROS'],
  ['201056', 'Terapéutica Peulla Residencial', 'Peulla_Reside', '10301', 'OTROS'],
  ['201483', 'Centro Comunitario de Salud Familiar Las Cascadas', 'CECOSF_Las_Cascadas', '10302', 'CESFAM'],
  ['201667', 'Posta de Salud Rural Chan Chan Río Negro', 'PSR_Chan_Chan', '10305', 'POSTA'],
  ['202043', 'Posta de Salud Rural Pucatrihue', 'PSR_Pucatrihue', '10306', 'POSTA'],
];

const establishments = catalogRows.map(([codigo, nombre, _nomAbr, comuna, tipo]) => ({
  codigo,
  nombre,
  comuna,
  tipo,
  activo: true,
}));

const byType = establishments.reduce((acc, item) => {
  acc[item.tipo] ||= [];
  acc[item.tipo].push(item.codigo);
  return acc;
}, {});

const aliasCodes = {
  HBSJO: ['123100'],
  HPU: ['123101'],
  HRN: ['123102'],
  HPO: ['123103'],
  HMSJ: ['123104'],
  HQUI: ['123105'],
  'CESFAM BAHIA MANSA': ['123311'],
  'SAPU ENTRE LAGOS': ['200747'],
  'SUR PUAUCHO': ['200750'],
  'SUR BAHIA MANSA': ['200749'],
  'SUR SANPABLO': ['200748'],
  'SUR SAN PABLO': ['200748'],
};

const typeAliases = {
  TODOS: [],
  HOSPITAL: byType.HOSPITAL || [],
  HOSPITALES: byType.HOSPITAL || [],
  CESFAM: byType.CESFAM || [],
  CECOSF: byType.CECOSF || [],
  POSTA: byType.POSTA || [],
  POSTAS: byType.POSTA || [],
  SAPU: byType.SAPU || [],
  SUR: byType.SUR || [],
  SAMU: byType.MOVIL || [],
  MOVIL: byType.MOVIL || [],
  MOVIL: byType.MOVIL || [],
  OTROS: byType.OTROS || [],
};

const allCodes = establishments.map(item => item.codigo);
const outputSets = ['base', 'hospital', 'posta', 'cesfam', 'cecosf', 'sapu', 'sur', 'movil', 'otros'];
const setByType = {
  HOSPITAL: 'hospital',
  POSTA: 'posta',
  CESFAM: 'cesfam',
  CECOSF: 'cecosf',
  SAPU: 'sapu',
  SUR: 'sur',
  MOVIL: 'movil',
  OTROS: 'otros',
};

function normalizeText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function normalizeApply(value) {
  return normalizeText(value || 'TODOS').toUpperCase();
}

function remLabel(sheet) {
  const match = String(sheet).match(/^A(\d+)/i);
  return match ? `REM${match[1]}` : String(sheet).toUpperCase();
}

function normalizeOperator(value) {
  const op = normalizeText(value);
  if (op === '=') return '==';
  if (op === '0') return '==';
  if (op === '>0') return '==';
  if (op === '>0 y >') return '>';
  return op;
}

function expressionForCells(cells) {
  return normalizeText(cells).replace(/\s+/g, '');
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function codesForApply(rawApply) {
  const apply = normalizeApply(rawApply);
  if (!apply || apply === 'TODOS') return { codes: [], exceptCodes: [], unknown: [] };
  if (apply === 'TODOS EXCEPTO SAMU') return { codes: [], exceptCodes: typeAliases.SAMU, unknown: [] };

  const normalized = apply.replace(/,/g, '-');
  const tokens = normalized.split('-').map(part => normalizeText(part)).filter(Boolean);
  const codes = [];
  const unknown = [];

  for (const token of tokens) {
    if (aliasCodes[token]) {
      codes.push(...aliasCodes[token]);
    } else if (typeAliases[token]) {
      codes.push(...typeAliases[token]);
    } else {
      unknown.push(token);
    }
  }

  return { codes: unique(codes), exceptCodes: [], unknown };
}

function isRestrictionOnly(row) {
  const apply = normalizeApply(row.APLICA);
  const operation = normalizeText(row['OPERACIÓN']);

  if (operation !== '>0') return false;
  if (!apply || apply === 'TODOS' || apply === 'TODOS EXCEPTO SAMU') return false;
  return normalizeText(row.TIPO).toUpperCase() === 'SIMPLE';
}

function targetSetsForRule(rule, apply, restrictionOnly) {
  if (restrictionOnly || !apply || normalizeApply(apply) === 'TODOS' || normalizeApply(apply) === 'TODOS EXCEPTO SAMU') {
    return ['base'];
  }

  const { codes } = codesForApply(apply);
  const types = unique(codes.map(code => establishments.find(item => item.codigo === code)?.tipo));
  const sets = unique(types.map(type => setByType[type]).filter(Boolean));
  return sets.length ? sets : ['base'];
}

function addRule(grouped, rule) {
  grouped[rule.rem_sheet] ||= [];
  grouped[rule.rem_sheet].push(rule);
}

function buildMessage(rule, row) {
  const left = `${rule.severidad} | ${remLabel(rule.rem_sheet)} | ${rule.seccion_expresion_1} | ${rule.descripcion_expresion_1} | ${row.CELDAS}`;
  if (!row.HOJA2 || !row.CELDAS2) return left;
  return `${left} ${rule.operador} ${remLabel(row.HOJA2)} | ${rule.seccion_expresion_2} | ${rule.descripcion_expresion_2} | ${row.CELDAS2}`;
}

function main() {
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`No existe el archivo fuente: ${sourceFile}`);
  }

  const workbook = XLSX.readFile(sourceFile, {
    cellDates: false,
    cellFormula: true,
    cellStyles: false,
    bookVBA: false,
  });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: null, raw: false });
  const counters = {};
  const finalRules = {};
  const sets = Object.fromEntries(outputSets.map(name => [name, {}]));
  const unknownApply = [];

  for (const [idx, row] of rows.entries()) {
    const sheet = normalizeText(row.HOJA);
    const apply = normalizeApply(row.APLICA);
    const sourceType = normalizeText(row.TIPO).toUpperCase();
    const operation = normalizeText(row['OPERACIÓN']);
    const restrictionOnly = isRestrictionOnly(row);
    const applyInfo = codesForApply(row.APLICA);

    if (applyInfo.unknown.length) {
      unknownApply.push({ fila: idx + 2, aplica: row.APLICA, desconocidos: applyInfo.unknown });
    }

    counters[sheet] = (counters[sheet] || 0) + 1;
    const id = `${sheet}-VAL${String(counters[sheet]).padStart(3, '0')}`;
    const expression1 = expressionForCells(row.CELDAS);
    const expression2 = row.CELDAS2 ? expressionForCells(row.CELDAS2) : 0;

    const rule = {
      id,
      seccion_expresion_1: normalizeText(row.SECCION),
      descripcion_expresion_1: normalizeText(row['DETALLE / EXPLICACION']),
      tipo: operation === '>0 y >' ? 'CONDICIONAL' : sourceType,
      tipo_validacion: sourceType,
      rem_sheet: sheet,
      expresion_1: expression1,
      operador: normalizeOperator(operation),
      expresion_2: operation === '>0' || operation === '0' ? 0 : expression2,
      severidad: normalizeText(row.SEVERIDAD).toUpperCase(),
      rem_sheet_2: normalizeText(row.HOJA2) || sheet,
      seccion_expresion_2: normalizeText(row.SECCION2),
      descripcion_expresion_2: normalizeText(row['DETALLE/EXPLICACION 2']),
      aplica_origen: apply,
    };

    if (operation === '>0 y >') {
      rule.condicion_previa = {
        expresion: expression1,
        operador: '>',
        valor: 0,
      };
      rule.omitir_si_condicion_no_cumple = true;
    } else if (operation === '>') {
      rule.omitir_si_ambos_cero = true;
    }

    if (restrictionOnly) {
      rule.establecimientos_excluidos = applyInfo.codes;
    } else if (apply === 'TODOS EXCEPTO SAMU') {
      rule.aplicar_a = applyInfo.exceptCodes;
    } else if (apply !== 'TODOS') {
      rule.aplicar_a = applyInfo.codes;
    }

    rule.mensaje = buildMessage(rule, row);

    addRule(finalRules, rule);
    for (const setName of targetSetsForRule(rule, row.APLICA, restrictionOnly)) {
      addRule(sets[setName], rule);
    }
  }

  if (unknownApply.length) {
    console.error('APLICA contiene valores desconocidos:');
    console.error(JSON.stringify(unknownApply, null, 2));
    process.exit(1);
  }

  const catalog = {
    version: '2026.2.0',
    generadoEl: '2026-06-14T00:00:00-04:00',
    servicioDeSalud: 'Servicio de Salud Osorno',
    totalEstablecimientos: establishments.length,
    establecimientos: establishments,
  };

  fs.writeFileSync(path.join(projectRoot, 'data', 'establishments.catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(projectRoot, 'data', 'reglas_finales.json'), `${JSON.stringify(finalRules, null, 2)}\n`, 'utf8');

  for (const [setName, validaciones] of Object.entries(sets)) {
    fs.writeFileSync(path.join(projectRoot, 'data', 'rules', `${setName}.json`), `${JSON.stringify({ validaciones }, null, 2)}\n`, 'utf8');
  }
  fs.writeFileSync(path.join(projectRoot, 'data', 'rules', 'samu.json'), `${JSON.stringify({ validaciones: sets.movil }, null, 2)}\n`, 'utf8');

  const totalRules = Object.values(finalRules).reduce((sum, rules) => sum + rules.length, 0);
  const setTotals = Object.fromEntries(Object.entries(sets).map(([name, grouped]) => [
    name,
    Object.values(grouped).reduce((sum, rules) => sum + rules.length, 0),
  ]));

  console.log(JSON.stringify({
    reglasGeneradas: totalRules,
    hojas: Object.keys(finalRules).length,
    establecimientos: establishments.length,
    sets: setTotals,
  }, null, 2));
}

main();
