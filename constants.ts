
import { Establishment, ValidationRule, Severity } from './types';

export const ESTABLECIMIENTOS: Establishment[] = [
  { codigo: "123000", nombre: "DEMO", comuna: "10301", tipo: "Otro" },
  { codigo: "123010", nombre: "Direccion Servicio Salud Osorno", comuna: "10301", tipo: "DIRECCION" },
  { codigo: "123011", nombre: "PRAIS", comuna: "10301", tipo: "OTROS" },
  { codigo: "123012", nombre: "Clinica Dental Movil (Osorno)", comuna: "10301", tipo: "MOVIL" },
  { codigo: "123030", nombre: "Departamento de Atencion Integral Funcionarios", comuna: "10301", tipo: "OTROS" },
  { codigo: "123100", nombre: "Hospital Base San Jose de Osorno", comuna: "10301", tipo: "HOSPITAL" },
  { codigo: "123101", nombre: "Hospital de Puranque Dr. Juan Hepp Dubiau", comuna: "10303", tipo: "HOSPITAL" },
  { codigo: "123102", nombre: "Hospital de Rio Negro", comuna: "10305", tipo: "HOSPITAL" },
  { codigo: "123103", nombre: "Hospital de Puerto Octay", comuna: "10302", tipo: "HOSPITAL" },
  { codigo: "123104", nombre: "Hospital Futa Sruka Lawenche Kunko Mapu Mo", comuna: "10306", tipo: "HOSPITAL" },
  { codigo: "123105", nombre: "Hospital Pu Mulen Quilacahuin", comuna: "10307", tipo: "HOSPITAL" },
  { codigo: "123203", nombre: "Clinica Alemana Osorno", comuna: "10301", tipo: "PRIVADA" },
  { codigo: "123207", nombre: "Centro de Rehabilitación de Minusválidos", comuna: "10303", tipo: "OTROS" },
  { codigo: "123300", nombre: "Centro de Salud Familiar Dr. Pedro Jauregui", comuna: "10301", tipo: "CESFAM" },
  { codigo: "123301", nombre: "Centro de Salud Familiar Dr. Marcelo Lopetegui Adams", comuna: "10301", tipo: "CESFAM" },
  { codigo: "123302", nombre: "Centro de Salud Familiar Ovejeria", comuna: "10301", tipo: "CESFAM" },
  { codigo: "123303", nombre: "Centro de Salud Familiar Rahue Alto", comuna: "10301", tipo: "CESFAM" },
  { codigo: "123304", nombre: "Centro de Salud Familiar Entre Lagos", comuna: "10304", tipo: "CESFAM" },
  { codigo: "123305", nombre: "Centro de Salud Familiar San Pablo", comuna: "10307", tipo: "CESFAM" },
  { codigo: "123306", nombre: "Centro de Salud Familiar Pampa Alegre", comuna: "10301", tipo: "CESFAM" },
  { codigo: "123307", nombre: "Centro de Salud Familiar Purranque", comuna: "10303", tipo: "CESFAM" },
  { codigo: "123309", nombre: "Centro de Salud Familiar Practicante Pablo Araya", comuna: "10305", tipo: "CESFAM" },
  { codigo: "123310", nombre: "Centro de Salud Familiar Quinto Centenario", comuna: "10301", tipo: "CESFAM" },
  { codigo: "123311", nombre: "Centro de Salud Familiar Bahia Mansa", comuna: "10306", tipo: "CESFAM" },
  { codigo: "123312", nombre: "Centro de Salud Familiar Puaucho", comuna: "10306", tipo: "CESFAM" },
  { codigo: "123402", nombre: "Posta de Salud Rural Cuinco", comuna: "10306", tipo: "POSTA" },
  { codigo: "123404", nombre: "Posta de Salud Rural Pichi Damas", comuna: "10301", tipo: "POSTA" },
  { codigo: "123406", nombre: "Posta de Salud Rural Puyehue", comuna: "10304", tipo: "POSTA" },
  { codigo: "123407", nombre: "Posta de Salud Rural Desague Rupanco", comuna: "10304", tipo: "POSTA" },
  { codigo: "123408", nombre: "Posta de Salud Rural Ñadi Pichi-Damas", comuna: "10304", tipo: "POSTA" },
  { codigo: "123410", nombre: "Posta de Salud Rural Tres Esteros", comuna: "10305", tipo: "POSTA" },
  { codigo: "123411", nombre: "Centro Comunitario de Salud Familiar Corte Alto", comuna: "10303", tipo: "CECOSF" },
  { codigo: "123412", nombre: "Posta de Salud Rural Crucero ( Purranque)", comuna: "10303", tipo: "POSTA" },
  { codigo: "123413", nombre: "Posta de Salud Rural Coligual", comuna: "10303", tipo: "POSTA" },
  { codigo: "123414", nombre: "Posta de Salud Rural Hueyusca", comuna: "10303", tipo: "POSTA" },
  { codigo: "123415", nombre: "Posta de Salud Rural Concordia", comuna: "10303", tipo: "POSTA" },
  { codigo: "123416", nombre: "Posta de Salud Rural Colonia Ponce", comuna: "10303", tipo: "POSTA" },
  { codigo: "123417", nombre: "Posta de Salud Rural La Naranja", comuna: "10303", tipo: "POSTA" },
  { codigo: "123419", nombre: "Posta de Salud Rural San Pedro de Purranque", comuna: "10303", tipo: "POSTA" },
  { codigo: "123420", nombre: "Posta de Salud Rural Collihuinco", comuna: "10303", tipo: "POSTA" },
  { codigo: "123422", nombre: "Posta de Salud Rural Rupanco", comuna: "10302", tipo: "POSTA" },
  { codigo: "123424", nombre: "Posta de Salud Rural Piedras Negras", comuna: "10302", tipo: "POSTA" },
  { codigo: "123425", nombre: "Posta de Salud Rural Cancura", comuna: "10301", tipo: "POSTA" },
  { codigo: "123426", nombre: "Posta de Salud Rural Pellinada", comuna: "10302", tipo: "POSTA" },
  { codigo: "123427", nombre: "Posta de Salud Rural La Calo", comuna: "10302", tipo: "POSTA" },
  { codigo: "123428", nombre: "Posta de Salud Rural Coihueco (Puerto Octay)", comuna: "10302", tipo: "POSTA" },
  { codigo: "123430", nombre: "Posta de Salud Rural Purrehuin", comuna: "10306", tipo: "POSTA" },
  { codigo: "123431", nombre: "Posta de Salud Rural Aleucapi", comuna: "10306", tipo: "POSTA" },
  { codigo: "123432", nombre: "Posta de Salud Rural La Poza", comuna: "10307", tipo: "POSTA" },
  { codigo: "123434", nombre: "Posta de Salud Rural Huilma", comuna: "10305", tipo: "POSTA" },
  { codigo: "123435", nombre: "Posta de Salud Rural Pucopio", comuna: "10307", tipo: "POSTA" },
  { codigo: "123436", nombre: "Posta de Salud Rural Chanco ( San Pablo )", comuna: "10307", tipo: "POSTA" },
  { codigo: "123437", nombre: "Posta de Salud Rural Currimahuida", comuna: "10307", tipo: "POSTA" },
  { codigo: "123700", nombre: "Centro Comunitario de Salud Familiar Murrinumo", comuna: "10301", tipo: "CECOSF" },
  { codigo: "123701", nombre: "Centro Comunitario de Salud Familiar Manuel Rodriguez", comuna: "10301", tipo: "CECOSF" },
  { codigo: "123705", nombre: "Centro Comunitario de Salud Familiar El Encanto", comuna: "10304", tipo: "CECOSF" },
  { codigo: "123709", nombre: "Centro Comunitario de Salud Familiar Riachuelo", comuna: "10305", tipo: "CECOSF" },
  { codigo: "123800", nombre: "SAPU Dr. Pedro Jauregui", comuna: "10301", tipo: "SAPU" },
  { codigo: "123801", nombre: "SAPU Rahue Alto", comuna: "10301", tipo: "SAPU" },
  { codigo: "200085", nombre: "SAPU Dr. Marcelo Lopetegui Adams", comuna: "10301", tipo: "SAPU" },
  { codigo: "200209", nombre: "COSAM Rahue", comuna: "10301", tipo: "SALUD_MENTAL" },
  { codigo: "200248", nombre: "CDR de Adultos Mayores con Demencia", comuna: "10301", tipo: "OTROS" },
  { codigo: "200445", nombre: "COSAM Oriente", comuna: "10301", tipo: "SALUD_MENTAL" },
  { codigo: "200455", nombre: "Centro Comunitario de Salud Familiar Barrio Estacion", comuna: "10303", tipo: "CECOSF" },
  { codigo: "200477", nombre: "Unidad de Memoria AYEKAN", comuna: "10301", tipo: "OTROS" },
  { codigo: "200490", nombre: "Posta de Salud Rural Chamilco", comuna: "10306", tipo: "POSTA" },
  { codigo: "200539", nombre: "Centro Referencia Diagnostico Medico Osorno", comuna: "10301", tipo: "OTROS" },
  { codigo: "200747", nombre: "SAPU Entre Lagos", comuna: "10304", tipo: "SAPU" },
  { codigo: "200748", nombre: "SUR San Pablo", comuna: "10307", tipo: "SUR" },
  { codigo: "200749", nombre: "SUR Bahia Mansa", comuna: "10306", tipo: "SUR" },
  { codigo: "200750", nombre: "SUR Puaucho", comuna: "10306", tipo: "SUR" },
  { codigo: "201055", nombre: "Terapeutica Peulla Ambulatoria", comuna: "10301", tipo: "OTROS" },
  { codigo: "201056", nombre: "Terapeutica Peulla Residencial", comuna: "10301", tipo: "OTROS" },
  { codigo: "201483", nombre: "Centro Comunitario de Salud Familiar Las Cascadas", comuna: "10302", tipo: "CECOSF" },
];

export const RAW_RULES: any = {
    "A01": [
        { "id": "VAL01", "tipo": "CELDA", "rem_sheet": "A01", "expresion_1": "F11", "operador": "==", "expresion_2": 0, "severidad": "REVISAR", "mensaje": "Control De Salud y Reproductiva, Control Preconcepcional en edades extremas de 10 a 14 años, celda F11" },
        { "id": "VAL01", "tipo": "CELDA", "rem_sheet": "A01", "expresion_1": "F12", "operador": "==", "expresion_2": 0, "severidad": "REVISAR", "mensaje": "Control De Salud y Reproductiva, Control Preconcepcional en edades extremas de 10 a 14 años, celda F12" },
        { "id": "VAL06", "tipo": "CELDA", "rem_sheet": "A01", "expresion_1": "A05!C89", "operador": "==", "expresion_2": "SUM(C19:C26, F36:F38)", "severidad": "ERROR", "mensaje": "Puérpera + RN (A01) debe ser igual a Ingresos RN Total (A05!C89)" },
        { "id": "VAL07", "tipo": "CELDA", "rem_sheet": "A01", "expresion_1": "C74", "operador": "<=", "expresion_2": "SUM(T36:T38)", "severidad": "ERROR", "mensaje": "Control Adolescente (C74) debe ser <= Ciclo Vital 10-14 años (T36-T38)" }
    ],
    "A02": [
        { "id": "VAL04", "tipo": "CELDA", "rem_sheet": "A02", "expresion_1": "B11", "operador": "==", "expresion_2": "B21", "severidad": "ERROR", "mensaje": "Total EMP Profesional debe ser igual a Total EMP Estado Nutricional" },
        { "id": "VAL06", "tipo": "CELDA", "rem_sheet": "A02", "expresion_1": "B17", "operador": "!=", "expresion_2": 0, "severidad": "ERROR", "mensaje": "EMP en B17 solo corresponde a Postas.", "aplicar_a": ["123402", "123404", "123406", "123407", "123408", "123410", "123412", "123413", "123414", "123415", "123416", "123417", "123419", "123420", "123422", "123424", "123425", "123426", "123427", "123428", "123430", "123431", "123432", "123434", "123435", "123436", "123437", "200490"] }
    ],
    "A03": [
        { "id": "VAL09", "tipo": "CELDA", "rem_sheet": "A03", "expresion_1": "C20", "operador": "==", "expresion_2": "SUM(C21:C36)", "severidad": "ERROR", "mensaje": "Total Psicomotor (C20) debe ser igual al detalle (C21:C36)" }
    ],
    "A08": [
        { "id": "VAL45", "tipo": "CELDA", "rem_sheet": "A08", "expresion_1": "SUM(E178:E183)", "operador": ">", "expresion_2": 0, "severidad": "ERROR", "mensaje": "Traslados Secundarios deben registrarse si el centro tiene ambulancia (excepto SAMU).", "establecimientos_excluidos": ["123010"] }
    ],
    "A30": [
        { "id": "VAL66", "tipo": "CELDA", "rem_sheet": "A30", "expresion_1": "SUM(B11:Z99)", "operador": "==", "expresion_2": 0, "severidad": "ERROR", "mensaje": "REM30R: No debe existir registro en este REM." }
    ]
};

export const SAMPLE_RULES: ValidationRule[] = Object.keys(RAW_RULES).flatMap(serie => 
    RAW_RULES[serie].map((r: any) => ({ ...r, serie, severidad: r.severidad as Severity }))
);

export const MONTH_NAMES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];
