# Registro Maestro de Validaciones REM

Este documento contiene el catálogo oficial de todas las reglas de validación activas en el sistema, ordenadas correlativamente por Hoja REM.

**Total de Reglas:** 90

## Sección: Hoja A01

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A01-VAL001** | `base.json` | `REVISAR` | `F11 == 0` | Control De Salud y Reproductiva, Control Preconcepcional en edades extremas de 10 a 14 años, celda F11 |
| **A01-VAL002** | `base.json` | `REVISAR` | `F12 == 0` | Control De Salud y Reproductiva, Control Preconcepcional en edades extremas de 10 a 14 años, celda F12 |
| **A01-VAL003** | `base.json` | `REVISAR` | `M11 == 0` | Control De Salud y Reproductiva, Control Preconcepcional en edades extremas de 45 a 54 años, celda M11 |
| **A01-VAL004** | `base.json` | `REVISAR` | `M12 == 0` | Control De Salud y Reproductiva, Control Preconcepcional en edades extremas de 45 a 54 años, celda M12 |
| **A01-VAL005** | `base.json` | `REVISAR` | `N11 == 0` | Control De Salud y Reproductiva, Control Preconcepcional en edades extremas de 45 a 54 años, celda N11 |
| **A01-VAL006** | `base.json` | `REVISAR` | `N12 == 0` | Control De Salud y Reproductiva, Control Preconcepcional en edades extremas de 45 a 54 años, celda N12 |
| **A01-VAL007** | `base.json` | `REVISAR` | `N13 == 0` | Control De Salud y Reproductiva, Control Prenatal en mujeres de 50 a 54 años, celda N13 |
| **A01-VAL008** | `base.json` | `REVISAR` | `N14 == 0` | Control De Salud y Reproductiva, Control Prenatal en mujeres de 50 a 54 años, celda N14 |
| **A01-VAL009** | `base.json` | `REVISAR` | `N15 == 0` | Control De Salud y Reproductiva, Control Post Parto y Post Aborto en mujeres de 50 a 54 años, celda N15 |
| **A01-VAL010** | `base.json` | `REVISAR` | `N16 == 0` | Control De Salud y Reproductiva, Control Post Parto y Post Aborto en mujeres de 50 a 54 años, celda N16 |
| **A01-VAL011** | `base.json` | `REVISAR` | `O31 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda O31 |
| **A01-VAL012** | `base.json` | `REVISAR` | `O32 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda O32 |
| **A01-VAL013** | `base.json` | `REVISAR` | `P31 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda P31 |
| **A01-VAL014** | `base.json` | `REVISAR` | `P32 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda P32 |
| **A01-VAL015** | `base.json` | `REVISAR` | `Q31 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda Q31 |
| **A01-VAL016** | `base.json` | `REVISAR` | `Q32 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda Q32 |
| **A01-VAL017** | `base.json` | `REVISAR` | `R31 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda R31 |
| **A01-VAL018** | `base.json` | `REVISAR` | `R32 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda R32 |
| **A01-VAL019** | `base.json` | `REVISAR` | `S31 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda S31 |
| **A01-VAL020** | `base.json` | `REVISAR` | `S32 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda S32 |
| **A01-VAL021** | `base.json` | `REVISAR` | `T31 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda T31 |
| **A01-VAL022** | `base.json` | `REVISAR` | `T32 == 0` | Control De Salud y Reproductiva, Regulación de Fecundidad en mujeres de 55 a 80 años y más, celda T32 |
| **A01-VAL023** | `base.json` | `ERROR` | `A05!C89 == SUM(C19:C26, F36:F38)` | Controles de salud sexual y Reproductiva, la Suma de Puérpera con recién Nacidos  10 Días hasta 28 Días,  celdas C19 a C26 y Controles de salud sexual y Reproductiva, Menor de 1 Mes, celdas  F36 a F38  deben ser igual a la Sección E REM05, Ingresos a control de salud recién Nacidos, Total menores de 28 Días,  celda C89 |
| **A01-VAL024** | `base.json` | `ERROR` | `C74 <= T36:T38` | Controles de Salud según Ciclo Vital, 10 a 14 años (T36 a T38) debe ser mayor o igual a Control de Salud Integral de Adolescente (C74). |
| **A01-VAL025** | `base.json` | `ERROR` | `F74 <= U36:U38` | Controles de Salud según Ciclo Vital, 10 a 14 años (U36 a U38) debe ser mayor o igual a Control de Salud Integral de Adolescente (F74). |
| **A01-VAL026** | `base.json` | `REVISAR` | `F36 == 0` | Controles de Salud según Ciclo Vital, celda F36, no debería ser registrado por el médico salvo excepciones |
| **A01-VAL027** | `base.json` | `REVISAR` | `A03!L20 + A03!M20 == O36:O37` | La suma de Escala de Desarrollo Psicomotor (REM03!L20+M20) debe ser menor o igual a Controles de Salud (A01!O36:O37) para 18-23 meses. |
| **A01-VAL028** | `base.json` | `REVISAR` | `A03!N20 + A03!O20 == A01!P36 + A01!P37` | La suma de Escala de Desarrollo Psicomotor (REM03!N20+O20) debe ser menor o igual a Controles de Salud (A01!P36:P37) para 24-47 meses. |
## Sección: Hoja A02

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A02-VAL001** | `base.json` | `ERROR` | `B11 == B21` | REM02, ERROR sección A o B: El total de EMP Realizados por Profesional (B11) debe ser igual al total de los EMP según Resultado del Estado Nutricional (B21). |
| **A02-VAL002** | `base.json` | `ERROR` | `C11 == C21` | REM02, ERROR sección A o B: El total de EMP Realizados por Profesional a Hombres (C11) debe ser igual al total de los EMP según Resultado del Estado Nutricional a Hombres (C21). |
| **A02-VAL003** | `base.json` | `ERROR` | `A03!C108 + A03!C110 == B11` | REM02, ERROR, sección A: EMP Realizados por Profesional, Total (B11) debe ser igual al N° de Audit (EMP/EMPAM), Sección D.1 (SUMA(C108 + C110)) del REMA03. |
| **A02-VAL004** | `base.json` | `ERROR` | `A03!C113 == E11 + F11` | REM02, ERROR, sección A: EMP Realizados por Profesional, Total (E11 + F11) debe ser igual al N° de Craff (EMP) (C113) del REMA03. |
| **A02-VAL005** | `posta.json` | `ERROR` | `B17 == 0` | REM02, ERROR sección A: EMP realizado por Profesional (B17) debe corresponder solo a Postas. Si el valor es > 0, es un error de digitación en centros que no son Postas. |
## Sección: Hoja A03

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A03-VAL001** | `base.json` | `ERROR` | `C20 == C21:C36` | ERROR sección A.2: El total de Resultados de la Aplicación de escala de evaluación del desarrollo psicomotor (C20) debe ser igual al detalle de evaluaciones del test de desarrollo Psicomotor (C21:C36). |
| **A03-VAL002** | `base.json` | `ERROR` | `C13 == C14:C15` | REM03, ERROR sección A1: La Aplicación y resultados de Pauta Breve (C13) debe ser igual a la sumatoria de los Resultados de la Aplicación de Pauta Breve (C14 y C15). |
| **A03-VAL003** | `base.json` | `ERROR` | `C54 == C55:C57` | REM03, ERROR sección A4: Los Resultados de la Aplicación de Protocolo Neurosensorial (C54) debe ser igual a la sumatoria de los Resultados de la Aplicación de Protocolo Neurosensorial (C55:C57). |
| **A03-VAL004** | `base.json` | `ERROR` | `C22 == B46` | REM03, ERROR sección A2 o A3: Resultados de la aplicación de escala de evaluación del desarrollo Psicomotor (C22) deben ser igual a Niños y Niñas con rezago, Déficit y otra vulnerabilidad (B46). |
| **A03-VAL005** | `base.json` | `ERROR` | `C23 == B47` | REM03, ERROR sección A2 o A3: Resultados de la aplicación de escala de evaluación del desarrollo Psicomotor (C23) deben ser igual a Niños y Niñas con rezago, Déficit y otra vulnerabilidad (B47). |
| **A03-VAL006** | `base.json` | `ERROR` | `C24 == B48` | REM03, ERROR sección A2 o A3: Resultados de la aplicación de escala de evaluación del desarrollo Psicomotor (C24) deben ser igual a Niños y Niñas con rezago, Déficit y otra vulnerabilidad (B48). |
| **A03-VAL007** | `base.json` | `ERROR` | `B86 == A05!C11` | REM03, ERROR, Sección B.2 o REM05 sección A: La Aplicación de Escala de Riesgo Psicosocial abreviada a gestantes (B86) debe ser igual a Total Gestantes Ingresadas en el REM05 (A05!C11). |
| **A03-VAL008** | `base.json` | `ERROR` | `C92 <= A01!(H36:H37)` | REM03, ERROR sección B3 o REM03 sección B: Evaluación de Edimburgo a los 2 Meses (C92) debe ser menor igual a los Controles de Salud según Ciclo vital del REM01 (A01!H36+H37). |
| **A03-VAL009** | `base.json` | `ERROR` | `C93 <= A01!(L36:L37)` | REM03, ERROR sección B3 o REM03 sección B: Evaluación de Edimburgo a los 6 Meses (C93) debe ser menor igual a los Controles de Salud según Ciclo vital del REM01 (A01!L36+L37). |
| **A03-VAL010** | `base.json` | `ERROR` | `C97 == A01!(T36:U38)` | REM03, ERROR sección C o REM01 sección B: Total estado Nutricional del Adolescente (C97) debe ser igual a Controles de salud según ciclo Vital, REM01, de 10 a 19 años (A01!T36:U38). |
| **A03-VAL011** | `base.json` | `ERROR` | `C108:C114 == C115:C117` | REM03, ERROR sección D.1: La Suma del N° Aplicaciones Audit y Craff (C108 a C114) debe ser Igual a los resultados de la evaluación (C115 a C117). |
| **A03-VAL012** | `base.json` | `ERROR` | `C213 == C214+C215` | REM03, ERROR sección E: El total de aplicaciones Pauta de riesgo Biopsicosocial (C213) debe ser Igual a la Suma Con Riesgo y Sin Riesgo (C214 y C215). |
| **A03-VAL013** | `base.json` | `ERROR` | `C61:C66 == C67` | REM03, ERROR sección A,5: La suma de los tipos de alimentación de niños y niñas controlados (C61 a C66) deben ser igual al Total de Niños y Niñas Controlados (C67). |
## Sección: Hoja A04

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A04-VAL001** | `base.json` | `ERROR` | `B39:B41 == B135:B137` | REM04, ERROR Sección B: El total de Consultas por Nutricionistas (B39 a B41) debe ser igual a Clasificación de consulta Nutricional por grupo de edad (B135 a B137). |
| **A04-VAL002** | `base.json` | `ERROR` | `C141:C143 == C146:C149` | REM04, ERROR, sección L: Consultas de lactancia en menores controlados por Nutricionista (C141:C143) debe ser igual a las consultas por lactancia (C146:C149). |
| **A04-VAL003** | `base.json` | `ERROR` | `C114+D114 == E114+F114` | REM04, ERROR, sección I.1: Despacho de Recetas de pacientes Ambulatorios, despacho Total y Parcial de la fila 114 (C114+D114) debe ser igual a E114 + F114. |
| **A04-VAL004** | `base.json` | `ERROR` | `C115+D115 == E115+F115` | REM04, ERROR, sección I.1: Despacho de Recetas de pacientes Ambulatorios, despacho Total y Parcial de la fila 115 (C115+D115) debe ser igual a E115 + F115. |
| **A04-VAL005** | `base.json` | `ERROR` | `C116+D116 == E116+F116` | REM04, ERROR, sección I.1: Despacho de Recetas de pacientes Ambulatorios, despacho Total y Parcial de la fila 116 (C116+D116) debe ser igual a E116 + F116. |
| **A04-VAL006** | `base.json` | `ERROR` | `M114 >= L114` | REM04, ERROR, sección I.1: Despacho de Recetas, Recetas Despachadas COMPLETAS (M114) debe ser MAYOR a Despacho Completo y Oportuno (L114). |
## Sección: Hoja A05

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A05-VAL001** | `base.json` | `REVISAR` | `L11:N14 == 0` | REM05, REVISAR sección A: Ingresos de Gestantes a Programa Prenatal. Celdas L11:N14 (edades extremas 45 a 55 años y más) deben ser corroboradas por profesional a cargo. |
| **A05-VAL002** | `base.json` | `ERROR` | `C119 <= C120:C127` | REM05, ERROR sección H: Ingresos al PSCV (C119) debe ser menor o igual a la suma del desglose del Programa de Salud Cardiovascular (C120 a C127). |
| **A05-VAL003** | `base.json` | `ERROR` | `AF146:AM150 > C162` | REM05, ERROR, sección J: Ingresos y Egresos a programa de pacientes con dependencia Leve, Moderada y Severa (AF146:AM150) debe ser MAYOR a Ingreso al programa A.M según condición de dependencia (C162). |
| **A05-VAL004** | `base.json` | `REVISAR` | `C193 == C204` | REM05, REVISAR sección N: Ingresos al programa de Salud Mental (C193) deben ser Igual al Número personas que posee uno o más trastornos Mentales (C204). |
| **A05-VAL005** | `base.json` | `ERROR` | `C204 <= C205:C241` | REM05, ERROR sección N: Personas con Diagnostico de Trastornos Mentales (C204) deben ser menor o igual a la suma de Diagnósticos de Trastornos Mentales (C205 a C241). |
| **A05-VAL006** | `hospital.json` | `REVISAR` | `C329:E339 == 0` | REM05, REVISAR sección R: El Ingreso y Egreso a Programa de VIH/SIDA (C329 a E339) corresponde solo al HBSJO (Error si centro no es HBSJO). |
| **A05-VAL007** | `hospital.json` | `REVISAR` | `C344:E346 == 0` | REM05, REVISAR sección S: El Ingreso y Egreso por Comercio Sexual (C344 a E346) corresponde solo al HBSJO (Error si centro no es HBSJO). |
## Sección: Hoja A06

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A06-VAL001** | `hospital.json` | `REVISAR` | `D16+D17 == 0` | REM08, ERROR sección A: Las Consultas y Controles de Odontología general (D16 y D17) corresponde solo a HBSJO, HPU y HRN. Valor debe ser revisado si el centro no es uno de estos. |
## Sección: Hoja A08

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A08-VAL001** | `base.json` | `ERROR` | `C61:AL66 == 0` | REM08, ERROR sección B: Categorizaciones de Pacientes (C61 a AL66) corresponde solo a Hospitales alta, Mediana, baja Complejidad, SAPU y SUR. |
| **A08-VAL002** | `base.json` | `ERROR` | `B13+B14 == B78` | REM08, ERROR sección A.1: Atenciones Realizadas U. Urgencias (B13+B14) debe ser igual a Categorizaciones de Pacientes Obstétrica (B78). |
| **A08-VAL003** | `base.json` | `ERROR` | `C171:F171 == 0` | REM08, ERROR sección L: Traslados Primarios (C171:F171) solo corresponde registrar a los siguientes Establecimientos (Nota: Los establecimientos específicos deben ser definidos e incluidos aquí). |
| **A08-VAL004** | `base.json` | `ERROR` | `C172:F174 == 0` | REM08, ERROR sección L: Traslados Primarios (C172:F174) deben registrar todos los establecimientos (Error si no tienen registros). |
| **A08-VAL005** | `base.json` | `ERROR` | `E178:E183 == 0` | REM08, ERROR sección M: Traslados Secundario (E178:E183) deben registrar todos los establecimientos que cuenten con ambulancias a excepción de SAMU (Error si no hay registros). |
| **A08-VAL006** | `base.json` | `ERROR` | `C161+D161 == 0` | REM08, ERROR sección J: Llamados de Urgencias a centro Regulador (C161 y D161) no debería contener registros (Debe ser cero). |
| **A08-VAL007** | `base.json` | `ERROR` | `B13 >= AS13` | REM08, ERROR sección A.1: Atenciones Realizadas (B13) debe ser mayor o igual a la Demanda (AS13). |
| **A08-VAL008** | `hospital.json` | `ERROR` | `E12:AL15 == 0` | REM08, ERROR sección A.1: Las Atenciones Realizadas en UEH de Hospital de Alta Complejidad (E12 a AL15) corresponde solo a HBSJO y HPU. |
| **A08-VAL009** | `hospital.json` | `ERROR` | `B12 == B67` | REM08, ERROR sección A.1: Atenciones Realizadas en UEH de Hospital de Alta Complejidad (B12) debe ser igual a Categorizaciones de Pacientes (B67). |
| **A08-VAL010** | `hospital.json` | `ERROR` | `E31:AL36 == 0` | REM08, ERROR sección A.3: Atenciones Realizadas en UEH Por Hospitales de BAJA Complejidad (E31 a AL36) Corresponde solo a Hospitales De Baja Complejidad. |
| **A08-VAL011** | `hospital.json` | `ERROR` | `B31 == B67` | REM08, ERROR sección A.3: Atenciones Realizadas en UEH de Hospital de Alta Complejidad (B31) debe ser igual a Categorizaciones de Pacientes (B67). |
| **A08-VAL012** | `samu.json` | `ERROR` | `C169:F170 == 0` | REM08, ERROR sección L: Traslados Primarios (C169:F170) solo corresponde registrar a SAMU. |
## Sección: Hoja A09

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A09-VAL001** | `hospital.json` | `REVISAR` | `D16+D17 == 0` | REM08, ERROR sección A: Las Consultas y Controles de Odontología general en Nivel Primario y Secundario de Salud (D16 y D17) corresponde solo a HBSJO, HPU y HRN. Valor debe ser revisado si el centro no es uno de estos. |
## Sección: Hoja A11

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A11-VAL001** | `hospital.json` | `ERROR` | `B13:C30 == 0` | REM11, ERROR sección A.1: Examen VDRL Por Grupo de Usuarios (B13 a C30). Esta sección solo le corresponde a HBSJO. |
| **A11-VAL002** | `hospital.json` | `ERROR` | `C144:P148 == 0` | REM11, ERROR sección B.1: Exámenes (Hepatitis B, C, Chagas, HTLV1, Sífilis) Uso Exclusivo Lab. Que Procesan (C144 a P148) le corresponde solo a HBSJO. |
| **A11-VAL003** | `hospital.json` | `ERROR` | `C152:P156 == 0` | REM11, ERROR sección B.2: Exámenes (Hepatitis B, C, Chagas, HTLV1, Sífilis) Uso Exclusivo Compras Servicio (C152 a P156) le corresponde solo a HBSJO. |
| **A11-VAL004** | `hospital.json` | `ERROR` | `C161:D183 == 0` | REM11, ERROR sección C1: Exámenes de VIH por Grupos de Usuarios (C161 a D183). Esta sección solo le corresponde a HBSJO. |
## Sección: Hoja A19a

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A19a-VAL001** | `base.json` | `ERROR` | `C129:C148 == O129:O148` | REM19a, ERROR sección B.1: Si existen registros en TOTAL ACTIVIDADES (C129:C148), se debe registrar el TOTAL PARTICIPANTES (O129:O148). Se verifica que ambas sumatorias sean iguales. |
## Sección: Hoja A19b

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A19b-VAL001** | `base.json` | `REVISAR` | `B11 == E11:I11` | REM19b, REVISAR sección A: Atención Oficinas de Informaciones. El número de reclamos (B11) debe ser igual a la suma de las respuestas (E11 a I11) para asegurar consistencia. |
## Sección: Hoja A27

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A27-VAL001** | `base.json` | `REVISAR` | `D53 == 0` | REM27, REVISAR sección A: Personas que Ingresan a Educación Grupal (D53). Si existen datos en el total de la sección, se debe revisar que existan datos en Sección B: Actividades de Educación para la Salud personal (D98). |
| **A27-VAL002** | `base.json` | `REVISAR` | `D23 == 0` | REM27, REVISAR sección A: Personas que Ingresan a Educación Grupal. Si existe información en celda D23, se debe revisar la desagregación para Gestantes (Y23 a AA23). |
## Sección: Hoja A28

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A28-VAL001** | `base.json` | `ERROR` | `B13 <= B61` | REM28, ERROR sección A.1: Ingresos al programa de Rehabilitación Integral (B13) debe ser igual o Menor a la suma total de Sección A.2: Evaluación Inicial (B61). |
| **A28-VAL002** | `base.json` | `ERROR` | `B13 >= B14` | REM28, ERROR sección A.1: Ingresos y Egresos al programa de Rehabilitación Integral (B13) debe ser mayor o igual a Ingresos (B14). |
| **A28-VAL003** | `base.json` | `ERROR` | `B13 >= B15` | REM28, ERROR sección A.1: Ingresos y Egresos al programa de Rehabilitación Integral (B13) debe ser mayor o igual a Ingresos (B15). |
| **A28-VAL004** | `base.json` | `ERROR` | `B29 <= B30:B52` | REM28, ERROR sección A.2: Total Ingresos Personas (B29) debe ser menor o igual a la suma de las desagregaciones por condición Física (B30 a B52). |
| **A28-VAL005** | `base.json` | `ERROR` | `B149 <= B150:B177` | REM28, ERROR sección B.1: El Total de Ingresos (B149) debe ser menor o igual a la sumatoria de ingresos a rehabilitación (B150 a B177). |
| **A28-VAL006** | `base.json` | `REVISAR` | `AM150:AM178 == 0` | REM28, REVISAR sección B.1: Ingresos y Egresos al Prog. de Rehabilitación Integral. Se debe registrar solo en “Tipo de atención Abierta” (AM150:AM178). Se activa si existen registros. |
## Sección: Hoja A29

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A29-VAL001** | `base.json` | `ERROR` | `O12:P12 == 0` | REM29, ERROR sección A: Interconsultas de Oftalmología/UAPO. Los datos se deben registrar en M12:N12 y NO debe haber registros en O12:P12. |
| **A29-VAL002** | `base.json` | `ERROR` | `M13:N13 == 0` | REM29, ERROR sección A: Interconsultas de Otorrinolaringología/UAPO. Los datos se deben registrar en O13:P13 y NO debe haber registros en M13:N13. |
## Sección: Hoja A30

| ID Regla | Archivo | Severidad | Expresión | Mensaje |
| :--- | :--- | :--- | :--- | :--- |
| **A30-VAL001** | `base.json` | `ERROR` | `B16:B17 == 0` | REM30R, ERROR: Atención y Orientación de Salud a Distancia. No debe existir registro en este REM. La suma de todas las celdas de registro debe ser cero. |
