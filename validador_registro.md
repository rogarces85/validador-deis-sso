# 📋 Registro Completo de Validaciones — Validador DEIS SSO

> **Generado automáticamente** el 13-03-2026, 5:15:01 p. m. — Total: **91 validaciones**

## 📊 Resumen por Hoja REM

| Hoja REM | Cantidad de Validaciones |
|----------|------------------------|
| **NOMBRE** | 9 |
| **A01** | 26 |
| **A02** | 2 |
| **A03** | 17 |
| **A04** | 6 |
| **A05** | 5 |
| **A08** | 7 |
| **A09** | 1 |
| **A11** | 4 |
| **A19a** | 1 |
| **A19b** | 1 |
| **A27** | 2 |
| **A28** | 7 |
| **A29** | 2 |
| **A30R** | 1 |

---

## 📄 Hoja: NOMBRE
> 9 validaciones

### VAL_NOM01
- **Tipo:** CELDA
- **Expresión 1:** `A9`
- **Operador:** `==`
- **Expresión 2:** `"Versión 1.2: Febrero 2026" o "Versión 1.1: Febrero 2026"`
- **Severidad:** ERROR
- **Mensaje:** Verifica que la celda A9 contenga la versión aceptada del archivo REM.
- **🔍 Detalle:** Compara el texto de A9 contra las versiones válidas. Si no coincide, bloquea la validación con alerta de versión inválida. Es la validación de mayor prioridad.

### VAL_NOM02
- **Tipo:** CELDA
- **Expresión 1:** `B2`
- **Operador:** `!=`
- **Expresión 2:** `(vacío)`
- **Severidad:** ERROR
- **Mensaje:** El nombre de la Comuna (celda B2) no debe estar vacío.
- **🔍 Detalle:** Valida que la celda B2 contenga el nombre de la comuna del establecimiento. Si está vacía, se genera un error.

### VAL_NOM03
- **Tipo:** CONCATENACIÓN
- **Expresión 1:** `C2+D2+E2+F2+G2`
- **Operador:** `IN catálogo`
- **Expresión 2:** `communes (catalog)`
- **Severidad:** ERROR
- **Mensaje:** El código de comuna concatenado debe existir en el catálogo de establecimientos.
- **🔍 Detalle:** Concatena las celdas C2, D2, E2, F2 y G2 para formar el código de comuna. Luego verifica que dicho código exista en establishments.catalog.json. Además, valida que ninguna celda individual esté vacía.

### VAL_NOM04
- **Tipo:** CELDA
- **Expresión 1:** `B3`
- **Operador:** `!=`
- **Expresión 2:** `(vacío)`
- **Severidad:** ERROR
- **Mensaje:** El nombre del Establecimiento (celda B3) no debe estar vacío.
- **🔍 Detalle:** Valida que la celda B3 contenga el nombre del establecimiento de salud.

### VAL_NOM05
- **Tipo:** CONCATENACIÓN
- **Expresión 1:** `C3+D3+E3+F3+G3+H3`
- **Operador:** `IN catálogo`
- **Expresión 2:** `establishments (catalog)`
- **Severidad:** ERROR
- **Mensaje:** El código de establecimiento concatenado debe existir en el catálogo.
- **🔍 Detalle:** Concatena las celdas C3 a H3 para formar el código DEIS del establecimiento. Verifica su existencia en el catálogo. Cada celda individual tampoco puede estar vacía.

### VAL_NOM06
- **Tipo:** CELDA
- **Expresión 1:** `B6`
- **Operador:** `!=`
- **Expresión 2:** `(vacío)`
- **Severidad:** ERROR
- **Mensaje:** El nombre del Mes (celda B6) no debe estar vacío.
- **🔍 Detalle:** Valida que la celda B6 contenga el nombre del mes de reporte.

### VAL_NOM07
- **Tipo:** CONCATENACIÓN
- **Expresión 1:** `C6+D6`
- **Operador:** `IN`
- **Expresión 2:** `01-12`
- **Severidad:** ERROR
- **Mensaje:** El código de mes concatenado (C6+D6) debe ser un mes válido entre 01 y 12.
- **🔍 Detalle:** Concatena C6 y D6 para formar el código del mes (ej. "03"). Verifica que sea un mes válido del 01 al 12.

### VAL_NOM08
- **Tipo:** CELDA
- **Expresión 1:** `B11`
- **Operador:** `!=`
- **Expresión 2:** `(vacío)`
- **Severidad:** ERROR
- **Mensaje:** El nombre del Responsable del Establecimiento (celda B11) no debe estar vacío.
- **🔍 Detalle:** Valida que se haya ingresado el nombre del responsable del establecimiento en B11.

### VAL_NOM09
- **Tipo:** CELDA
- **Expresión 1:** `B12`
- **Operador:** `!=`
- **Expresión 2:** `(vacío)`
- **Severidad:** ERROR
- **Mensaje:** El nombre del Jefe de Estadística (celda B12) no debe estar vacío.
- **🔍 Detalle:** Valida que se haya ingresado el nombre del jefe de estadística en B12.

---

## 📄 Hoja: A01
> 26 validaciones

### A01-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `F11`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (F11) debe ser igual a | celda (0)
- **🔍 Detalle:** Verifica que la expresión [F11] NO contenga datos (sea cero o vacía).

### A01-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `F12`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (F12) debe ser igual a | celda (0)
- **🔍 Detalle:** Verifica que la expresión [F12] NO contenga datos (sea cero o vacía).

### A01-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `M11`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (M11) debe ser igual a | celda (0)
- **🔍 Detalle:** Verifica que la expresión [M11] NO contenga datos (sea cero o vacía).

### A01-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `M12`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (M12) debe ser igual a | celda (0)
- **🔍 Detalle:** Verifica que la expresión [M12] NO contenga datos (sea cero o vacía).

### A01-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `N11`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (N11) debe ser igual a | celda (0)
- **🔍 Detalle:** Verifica que la expresión [N11] NO contenga datos (sea cero o vacía).

### A01-VAL006
- **Tipo:** CELDA
- **Expresión 1:** `N12`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (N12) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [N12] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL007
- **Tipo:** CELDA
- **Expresión 1:** `N13`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (N13) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [N13] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL008
- **Tipo:** CELDA
- **Expresión 1:** `N14`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (N14) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [N14] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL009
- **Tipo:** CELDA
- **Expresión 1:** `N15`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (N15) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [N15] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL010
- **Tipo:** CELDA
- **Expresión 1:** `N16`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (N16) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [N16] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL011
- **Tipo:** CELDA
- **Expresión 1:** `O31`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (O31) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [O31] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL012
- **Tipo:** CELDA
- **Expresión 1:** `O32`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (O32) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [O32] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL013
- **Tipo:** CELDA
- **Expresión 1:** `P31`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (P31) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [P31] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL014
- **Tipo:** CELDA
- **Expresión 1:** `P32`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (P32) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [P32] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL015
- **Tipo:** CELDA
- **Expresión 1:** `Q31`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (Q31) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [Q31] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL016
- **Tipo:** CELDA
- **Expresión 1:** `Q32`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (Q32) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [Q32] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL017
- **Tipo:** CELDA
- **Expresión 1:** `R31`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (R31) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [R31] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL018
- **Tipo:** CELDA
- **Expresión 1:** `R32`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (R32) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [R32] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL019
- **Tipo:** CELDA
- **Expresión 1:** `S31`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (S31) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [S31] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL020
- **Tipo:** CELDA
- **Expresión 1:** `S32`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (S32) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [S32] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL021
- **Tipo:** CELDA
- **Expresión 1:** `T31`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (T31) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [T31] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL022
- **Tipo:** CELDA
- **Expresión 1:** `T32`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (T32) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [T32] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL023
- **Tipo:** CELDA
- **Expresión 1:** `SUM(C19:C26, F36:F38)`
- **Operador:** `==`
- **Expresión 2:** `C89`
- **Severidad:** ERROR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Celdas (SUM(C19:C26, F36:F38)) debe ser igual a | REM A05 | SECCIÓN E:  INGRESOS  A CONTROL DE SALUD DE RECIÉN NACIDOS | celda (C89)
- **🔍 Detalle:** Verifica que el rango [SUM(C19:C26, F36:F38)] esté vacío.

### A01-VAL026
- **Tipo:** CELDA
- **Expresión 1:** `F36`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL | Celdas (F36) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [F36] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A01-VAL024
- **Tipo:** CELDA
- **Expresión 1:** `C74`
- **Operador:** `<=`
- **Expresión 2:** `T36:T38`
- **Severidad:** ERROR
- **Mensaje:** REM A01 | SECCIÓN D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES (incluidos en sección B) | Celdas (C74) debe ser menor o igual a | SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL | celda (T36:T38)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [C74] sea menor o igual a la suma del rango [T36:T38]. | Se omite si ambas expresiones son 0

### A01-VAL025
- **Tipo:** CELDA
- **Expresión 1:** `F74`
- **Operador:** `<=`
- **Expresión 2:** `U36:U38`
- **Severidad:** ERROR
- **Mensaje:** REM A01 | SECCIÓN D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES (incluidos en sección B) | Celdas (F74) debe ser menor o igual a | SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL | celda (U36:U38)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [F74] sea menor o igual a la suma del rango [U36:U38]. | Se omite si ambas expresiones son 0

---

## 📄 Hoja: A02
> 2 validaciones

### A02-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B11`
- **Operador:** `==`
- **Expresión 2:** `B21`
- **Severidad:** ERROR
- **Mensaje:** REM A02 | SECCIÓN A: EMP REALIZADO POR PROFESIONAL | Celdas (B11) debe ser igual a | SECCIÓN B: EMP SEGÚN RESULTADO DEL ESTADO NUTRICIONAL | celda (B21)
- **🔍 Detalle:** Compara [B11] sea igual a [B21].

### A02-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `C11`
- **Operador:** `==`
- **Expresión 2:** `C21`
- **Severidad:** ERROR
- **Mensaje:** REM A02 | SECCIÓN A: EMP REALIZADO POR PROFESIONAL | Celdas (C11) debe ser igual a | SECCIÓN B: EMP SEGÚN RESULTADO DEL ESTADO NUTRICIONAL | celda (C21)
- **🔍 Detalle:** Compara [C11] sea igual a [C21].

---

## 📄 Hoja: A03
> 17 validaciones

### A01-VAL027
- **Tipo:** CELDA
- **Expresión 1:** `L20 + M20`
- **Operador:** `==`
- **Expresión 2:** `O36:O37`
- **Severidad:** REVISAR
- **Mensaje:** REM A03 | SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR | Celdas (L20 + M20) debe ser igual a | celda (O36:O37)
- **🔍 Detalle:** Compara [L20 + M20] sea igual a la suma del rango [O36:O37].

### A01-VAL028
- **Tipo:** CELDA
- **Expresión 1:** `N20 + O20`
- **Operador:** `==`
- **Expresión 2:** `P36 + P37`
- **Severidad:** REVISAR
- **Mensaje:** REM A03 | SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR | Celdas (N20 + O20) debe ser igual a | REM A01 | SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL | celda (P36 + P37)
- **🔍 Detalle:** Compara [N20 + O20] sea igual a [P36 + P37].

### A02-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `C108 + C110`
- **Operador:** `==`
- **Expresión 2:** `B11`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN D.1: APLICACIÓN DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE  ALCOHOL, TABACO Y OTRAS DROGAS | Celdas (C108 + C110) debe ser igual a | SECCIÓN A.1: APLICACIÓN Y RESULTADOS DE PAUTA BREVE | celda (B11)
- **🔍 Detalle:** Compara [C108 + C110] sea igual a [B11].

### A02-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C113`
- **Operador:** `==`
- **Expresión 2:** `E11 + F11`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN D.1: APLICACIÓN DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE  ALCOHOL, TABACO Y OTRAS DROGAS | Celdas (C113) debe ser igual a | SECCIÓN A.1: APLICACIÓN Y RESULTADOS DE PAUTA BREVE | celda (E11 + F11)
- **🔍 Detalle:** Compara [C113] sea igual a [E11 + F11].

### A03-VAL012
- **Tipo:** CELDA
- **Expresión 1:** `C213`
- **Operador:** `==`
- **Expresión 2:** `C214+C215`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCION E: APLICACIÓN DE PAUTA DETECCIÓN DE FACTORES DE RIESGO BIOPSICOSOCIAL INFANTIL | Celdas (C213) debe ser igual a | celda (C214+C215)
- **🔍 Detalle:** Compara [C213] sea igual a [C214+C215].

### A03-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `C13`
- **Operador:** `==`
- **Expresión 2:** `C14:C15`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.1: APLICACIÓN Y RESULTADOS DE PAUTA BREVE | Celdas (C13) debe ser igual a | celda (C14:C15)
- **🔍 Detalle:** Compara [C13] sea igual a la suma del rango [C14:C15].

### A03-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `C20`
- **Operador:** `==`
- **Expresión 2:** `C21:C36`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR | Celdas (C20) debe ser igual a | celda (C21:C36)
- **🔍 Detalle:** Compara [C20] sea igual a la suma del rango [C21:C36].

### A03-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C22`
- **Operador:** `==`
- **Expresión 2:** `B46`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR | Celdas (C22) debe ser igual a | SECCIÓN A.3: NIÑOS Y NIÑAS CON REZAGO, DÉFICIT O RIESGO BIOPSICOSOCIAL  DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACIÓN EN LA PRIMERA EVALUACIÓN | celda (B46)
- **🔍 Detalle:** Compara [C22] sea igual a [B46].

### A03-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `C23`
- **Operador:** `==`
- **Expresión 2:** `B47`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR | Celdas (C23) debe ser igual a | SECCIÓN A.3: NIÑOS Y NIÑAS CON REZAGO, DÉFICIT O RIESGO BIOPSICOSOCIAL  DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACIÓN EN LA PRIMERA EVALUACIÓN | celda (B47)
- **🔍 Detalle:** Compara [C23] sea igual a [B47].

### A03-VAL006
- **Tipo:** CELDA
- **Expresión 1:** `C24`
- **Operador:** `==`
- **Expresión 2:** `B48`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR | Celdas (C24) debe ser igual a | SECCIÓN A.3: NIÑOS Y NIÑAS CON REZAGO, DÉFICIT O RIESGO BIOPSICOSOCIAL  DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACIÓN EN LA PRIMERA EVALUACIÓN | celda (B48)
- **🔍 Detalle:** Compara [C24] sea igual a [B48].

### A03-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `C54`
- **Operador:** `==`
- **Expresión 2:** `C55:C57`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.4: RESULTADOS DE LA APLICACIÓN DE PROTOCOLO NEUROSENSORIAL | Celdas (C54) debe ser igual a | celda (C55:C57)
- **🔍 Detalle:** Compara [C54] sea igual a la suma del rango [C55:C57].

### A03-VAL013
- **Tipo:** CELDA
- **Expresión 1:** `C61:C66`
- **Operador:** `==`
- **Expresión 2:** `C67`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.5: TIPO DE ALIMENTACIÓN NIÑOS Y NIÑAS CONTROLADOS | Celdas (C61:C66) debe ser igual a | celda (C67)
- **🔍 Detalle:** Verifica que el rango [C61:C66] esté vacío.

### A03-VAL007
- **Tipo:** CELDA
- **Expresión 1:** `B86`
- **Operador:** `==`
- **Expresión 2:** `C11`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN B.2: APLICACIÓN DE ESCALA SEGÚN EVALUACIÓN DE RIESGO PSICOSOCIAL ABREVIADA A GESTANTES | Celdas (B86) debe ser igual a | REM A05 | SECCIÓN A: INGRESOS DE GESTANTES A PROGRAMA PRENATAL | celda (C11)
- **🔍 Detalle:** Compara [B86] sea igual a [C11].

### A03-VAL008
- **Tipo:** CELDA
- **Expresión 1:** `C92`
- **Operador:** `<=`
- **Expresión 2:** `H36:H37`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN B.3: APLICACIÓN DE ESCALA DE EDIMBURGO A GESTANTES Y MUJERES POST PARTO | Celdas (C92) debe ser menor o igual a | REM A01 | SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL | celda (H36:H37)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [C92] sea menor o igual a la suma del rango [H36:H37]. | Se omite si ambas expresiones son 0

### A03-VAL009
- **Tipo:** CELDA
- **Expresión 1:** `C93`
- **Operador:** `<=`
- **Expresión 2:** `L36:L37`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN B.3: APLICACIÓN DE ESCALA DE EDIMBURGO A GESTANTES Y MUJERES POST PARTO | Celdas (C93) debe ser menor o igual a | REM A01 | SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL | celda (L36:L37)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [C93] sea menor o igual a la suma del rango [L36:L37]. | Se omite si ambas expresiones son 0

### A03-VAL010
- **Tipo:** CELDA
- **Expresión 1:** `C97`
- **Operador:** `==`
- **Expresión 2:** `T36:U38`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN C: RESULTADOS DE LA EVALUACIÓN DEL ESTADO NUTRICIONAL DEL ADOLESCENTE CON CONTROL SALUD INTEGRAL | Celdas (C97) debe ser igual a | REM A01 | SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL | celda (T36:U38)
- **🔍 Detalle:** Compara [C97] sea igual a la suma del rango [T36:U38].

### A03-VAL011
- **Tipo:** CELDA
- **Expresión 1:** `C108:C114`
- **Operador:** `==`
- **Expresión 2:** `C115:C117`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN D.1: APLICACIÓN DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE  ALCOHOL, TABACO Y OTRAS DROGAS | Celdas (C108:C114) debe ser igual a | celda (C115:C117)
- **🔍 Detalle:** Compara [C108:C114] sea igual a la suma del rango [C115:C117].

---

## 📄 Hoja: A04
> 6 validaciones

### A04-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B39:B41`
- **Operador:** `==`
- **Expresión 2:** `B135:B137`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN B: CONSULTAS DE PROFESIONALES NO MÉDICOS | Celdas (B39:B41) debe ser igual a | SECCIÓN K CLASIFICACIÓN DE CONSULTA NUTRICIONAL POR GRUPO DE EDAD (Incluidas en sección B) | celda (B135:B137)
- **🔍 Detalle:** Compara [B39:B41] sea igual a la suma del rango [B135:B137].

### A04-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `C114+D114`
- **Operador:** `==`
- **Expresión 2:** `E114+F114`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN I.1 : DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA | Celdas (C114+D114) debe ser igual a | celda (E114+F114)
- **🔍 Detalle:** Compara [C114+D114] sea igual a [E114+F114].

### A04-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C115+D115`
- **Operador:** `==`
- **Expresión 2:** `E115+F115`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN I.1 : DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA | Celdas (C115+D115) debe ser igual a | celda (E115+F115)
- **🔍 Detalle:** Compara [C115+D115] sea igual a [E115+F115].

### A04-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `C116+D116`
- **Operador:** `==`
- **Expresión 2:** `E116+F116`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN I.1 : DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA | Celdas (C116+D116) debe ser igual a | celda (E116+F116)
- **🔍 Detalle:** Compara [C116+D116] sea igual a [E116+F116].

### A04-VAL006
- **Tipo:** CELDA
- **Expresión 1:** `M114`
- **Operador:** `>=`
- **Expresión 2:** `L114`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN I.1 : DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA | Celdas (M114) debe ser mayor o igual a | celda (L114)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [M114] sea mayor o igual a [L114]. | Se omite si ambas expresiones son 0

### A04-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `C141:C143`
- **Operador:** `==`
- **Expresión 2:** `C146:C149`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN L: CONSULTA DE LACTANCIA EN NIÑOS Y NIÑAS CONTROLADOS | Celdas (C141:C143) debe ser igual a | celda (C146:C149)
- **🔍 Detalle:** Compara [C141:C143] sea igual a la suma del rango [C146:C149].

---

## 📄 Hoja: A05
> 5 validaciones

### A05-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `L11:N14`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A05 | SECCIÓN A: INGRESOS DE GESTANTES A PROGRAMA PRENATAL | Celdas (L11:N14) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [L11:N14] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A05-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `C119`
- **Operador:** `<=`
- **Expresión 2:** `C120:C127`
- **Severidad:** ERROR
- **Mensaje:** REM A05 | SECCIÓN H: INGRESOS AL PROGRAMA DE SALUD CARDIOVASCULAR (PSCV) | Celdas (C119) debe ser menor o igual a | celda (C120:C127)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [C119] sea menor o igual a la suma del rango [C120:C127]. | Se omite si ambas expresiones son 0

### A05-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `AF146:AM150`
- **Operador:** `>`
- **Expresión 2:** `C162`
- **Severidad:** ERROR
- **Mensaje:** REM A05 | SECCIÓN J: INGRESOS Y EGRESOS AL PROGRAMA DE PACIENTES CON DEPENDENCIA LEVE, MODERADA Y SEVERA | Celdas (AF146:AM150) debe ser mayor que | SECCIÓN K: INGRESOS AL PROGRAMA DEL ADULTO MAYOR SEGÚN CONDICIÓN DE FUNCIONALIDAD Y DEPENDENCIA | celda (C162)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara la suma del rango [AF146:AM150] sea mayor que [C162]. | Se omite si ambas expresiones son 0

### A05-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C193`
- **Operador:** `==`
- **Expresión 2:** `C204`
- **Severidad:** REVISAR
- **Mensaje:** REM A05 | SECCIÓN N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS /ESPECIALIDAD | Celdas (C193) debe ser igual a | celda (C204)
- **🔍 Detalle:** Compara [C193] sea igual a [C204].

### A05-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `C204`
- **Operador:** `<=`
- **Expresión 2:** `C205:C241`
- **Severidad:** ERROR
- **Mensaje:** REM A05 | SECCIÓN N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS /ESPECIALIDAD | Celdas (C204) debe ser menor o igual a | celda (C205:C241)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [C204] sea menor o igual a la suma del rango [C205:C241]. | Se omite si ambas expresiones son 0

---

## 📄 Hoja: A08
> 7 validaciones

### A08-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `B13+B14`
- **Operador:** `==`
- **Expresión 2:** `B78`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA (Establecimientos de alta y mediana complejidad) | Celdas (B13+B14) debe ser igual a | SECCIÓN B.1: CATEGORIZACIÓN DE PACIENTES DE URGENCIA GINECO OBSTÉTRICA PREVIO A LA ATENCIÓN CLÍNICA POR MATRÓN (A) Y/O MÉDICO GINECO-OBSTETRA (Establecimientos alta, mediana y baja complejidad) | celda (B78)
- **🔍 Detalle:** Compara [B13+B14] sea igual a [B78].

### A08-VAL007
- **Tipo:** CELDA
- **Expresión 1:** `B13`
- **Operador:** `<`
- **Expresión 2:** `AS13`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA (Establecimientos de alta y mediana complejidad) | Celdas (B13) debe ser menor que | celda (AS13)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B13] sea menor que [AS13]. | Se omite si ambas expresiones son 0

### A08-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `C61:AL66`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN B: CATEGORIZACIÓN DE PACIENTES, PREVIA A LA ATENCIÓN MÉDICA U ODONTOLÓGICA (Establecimientos Alta, Mediana, Baja Complejidad, SAPU, SAR, SUR) | Celdas (C61:AL66) debe ser distinto de | celda (0)
- **Aplica a:** Tipo: HOSPITAL, SAPU, SUR
- **Excluye:** Códigos: 123000, 123100, 123101, 123102, 123103, 123104, 123105, 123800, 123801, 200085, 200747, 200748, 200749, 200750
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [C61:AL66] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0. Solo aplica a tipo: HOSPITAL, SAPU, SUR. Excluye códigos: 123000, 123100, 123101, 123102, 123103, 123104, 123105, 123800, 123801, 200085, 200747, 200748, 200749, 200750

### A08-VAL006
- **Tipo:** CELDA
- **Expresión 1:** `C161+D161`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN J: LLAMADOS DE URGENCIA A CENTRO REGULADOR, CENTRO DE DESPACHO O CENTRO COORDINADOR | Celdas (C161+D161) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [C161+D161] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A08-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `C171:F171`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA (Desde el lugar del evento a unidad de Emergencia) | Celdas (C171:F171) debe ser distinto de | celda (0)
- **Excluye:** Códigos: 123000, 123102, 123101, 123104, 123105, 123311, 200747, 200748, 200749, 200750
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [C171:F171] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0. Excluye códigos: 123000, 123102, 123101, 123104, 123105, 123311, 200747, 200748, 200749, 200750

### A08-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C172:F174`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA (Desde el lugar del evento a unidad de Emergencia) | Celdas (C172:F174) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [C172:F174] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A08-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `E178:E183`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN M: TRASLADO SECUNDARIO (Desde un establecimiento a otro) | Celdas (E178:E183) debe ser distinto de | celda (0)
- **Excluye:** Tipo: SAMU; Códigos: 123010
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [E178:E183] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0. Excluye tipo: SAMU. Excluye códigos: 123010

---

## 📄 Hoja: A09
> 1 validaciones

### A09-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `D16+D17`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A09 | SECCIÓN A: CONSULTAS Y CONTROLES DE ODONTOLOGÍA GENERAL EN  NIVEL PRIMARIO Y SECUNDARIO DE SALUD | Celdas (D16+D17) debe ser distinto de | celda (0)
- **Aplica a:** Códigos: 123000, 123100, 123101, 123102
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [D16+D17] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0. Solo aplica a códigos: 123000, 123100, 123101, 123102

---

## 📄 Hoja: A11
> 4 validaciones

### A11-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B13:C30`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A11 | SECCIÓN A.1: EXAMEN VDRL POR GRUPO DE USUARIOS (USO EXCLUSIVO DE ESTABLECIMIENTOS CON LABORATORIO QUE PROCESAN) | Celdas (B13:C30) debe ser distinto de | celda (0)
- **Aplica a:** Códigos: 123000, 123100
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [B13:C30] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0. Solo aplica a códigos: 123000, 123100

### A11-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `C144:P148`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A11 | SECCIÓN B.1: EXÁMENES SEGÚN GRUPOS DE USUARIOS POR CONDICIÓN DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS (USO EXCLUSIVO DE ESTABLECIMIENTOS CON LABORATORIO QUE PROCESAN) | Celdas (C144:P148) debe ser distinto de | celda (0)
- **Aplica a:** Códigos: 123000, 123100
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [C144:P148] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0. Solo aplica a códigos: 123000, 123100

### A11-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `C152:P156`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A11 | SECCIÓN B.2: EXÁMENES SEGÚN GRUPOS DE USUARIOS POR CONDICIÓN DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS (USO EXCLUSIVO DE ESTABLECIMIENTOS QUE COMPRAN SERVICIO) | Celdas (C152:P156) debe ser distinto de | celda (0)
- **Aplica a:** Códigos: 123000, 123100
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [C152:P156] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0. Solo aplica a códigos: 123000, 123100

### A11-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C161:D183`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A11 | SECCIÓN C.1: EXÁMENES  DE  VIH POR GRUPOS DE USUARIOS (USO EXCLUSIVO DE ESTABLECIMIENTOS CON LABORATORIO QUE PROCESAN) | Celdas (C161:D183) debe ser distinto de | celda (0)
- **Aplica a:** Códigos: 123000, 123100
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [C161:D183] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0. Solo aplica a códigos: 123000, 123100

---

## 📄 Hoja: A19a
> 1 validaciones

### A19a-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `C129:C148`
- **Operador:** `<=`
- **Expresión 2:** `O129:O148`
- **Severidad:** ERROR
- **Mensaje:** REM A19a | SECCIÓN B.1: ACTIVIDADES DE PROMOCIÓN SEGÚN ESTRATEGIAS Y CONDICIONANTES ABORDADAS Y NÚMERO DE PARTICIPANTES | Celdas (C129:C148) debe ser menor o igual a | celda (O129:O148)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Compara [C129:C148] sea menor o igual a la suma del rango [O129:O148]. | Se omite si expresión_1 es 0

---

## 📄 Hoja: A19b
> 1 validaciones

### A19b-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B11`
- **Operador:** `==`
- **Expresión 2:** `E11:I11`
- **Severidad:** REVISAR
- **Mensaje:** REM A19b | SECCIÓN A: ATENCIÓN OFICINAS DE INFORMACIONES (SISTEMA INTEGRAL DE ATENCIÓN A USUARIOS) | Celdas (B11) debe ser igual a | celda (E11:I11)
- **🔍 Detalle:** Compara [B11] sea igual a la suma del rango [E11:I11].

---

## 📄 Hoja: A27
> 2 validaciones

### A27-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `D53`
- **Operador:** `>=`
- **Expresión 2:** `D98`
- **Severidad:** REVISAR
- **Mensaje:** REM A27 | SECCIÓN A: PERSONAS QUE INGRESAN A EDUCACIÓN GRUPAL SEGÚN ÁREAS TEMÁTICAS Y EDAD | Celdas (D53) debe ser mayor o igual a | SECCIÓN B: ACTIVIDADES DE EDUCACIÓN PARA LA SALUD SEGÚN PERSONAL QUE LAS REALIZA (SESIONES) | celda (D98)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Compara [D53] sea mayor o igual a [D98]. | Se omite si expresión_1 es 0

### A27-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `D23`
- **Operador:** `>=`
- **Expresión 2:** `Y23:AA23`
- **Severidad:** REVISAR
- **Mensaje:** REM A27 | SECCIÓN A: PERSONAS QUE INGRESAN A EDUCACIÓN GRUPAL SEGÚN ÁREAS TEMÁTICAS Y EDAD | Celdas (D23) debe ser mayor o igual a | celda (Y23:AA23)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Compara [D23] sea mayor o igual a la suma del rango [Y23:AA23]. | Se omite si expresión_1 es 0

---

## 📄 Hoja: A28
> 7 validaciones

### A28-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B13`
- **Operador:** `<=`
- **Expresión 2:** `B61`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN A.1: INGRESOS Y EGRESOS  A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO | Celdas (B13) debe ser menor o igual a | SECCIÓN A.3: EVALUACIÓN INICIAL | celda (B61)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B13] sea menor o igual a [B61]. | Se omite si ambas expresiones son 0

### A28-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `B13`
- **Operador:** `>=`
- **Expresión 2:** `B14`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN A.1: INGRESOS Y EGRESOS  A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO | Celdas (B13) debe ser mayor o igual a | celda (B14)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B13] sea mayor o igual a [B14]. | Se omite si ambas expresiones son 0

### A28-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `B13`
- **Operador:** `>=`
- **Expresión 2:** `B15`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN A.1: INGRESOS Y EGRESOS  A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO | Celdas (B13) debe ser mayor o igual a | celda (B15)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B13] sea mayor o igual a [B15]. | Se omite si ambas expresiones son 0

### A28-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `B29`
- **Operador:** `<=`
- **Expresión 2:** `B30:B52`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN A.2: INGRESOS POR CONDICIÓN DE SALUD | Celdas (B29) debe ser menor o igual a | celda (B30:B52)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B29] sea menor o igual a la suma del rango [B30:B52]. | Se omite si ambas expresiones son 0

### A28-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `B149`
- **Operador:** `<=`
- **Expresión 2:** `B150:B177`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN B.1: INGRESOS Y EGRESOS  A REHABILITACIÓN INTEGRAL | Celdas (B149) debe ser menor o igual a | celda (B150:B177)
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B149] sea menor o igual a la suma del rango [B150:B177]. | Se omite si ambas expresiones son 0

### A28-VAL006
- **Tipo:** CELDA
- **Expresión 1:** `AM149:AM177`
- **Operador:** `>=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A28 | SECCIÓN B.1: INGRESOS Y EGRESOS  A REHABILITACIÓN INTEGRAL | Celdas (AM149:AM177) debe ser mayor o igual a | celda (0)
- **Aplica a:** Códigos: 123100, 123101, 123102
- **🔍 Detalle:** Compara [AM149:AM177] sea mayor o igual a 0. | Solo aplica a códigos: 123100, 123101, 123102

### A28-VAL007
- **Tipo:** CELDA
- **Expresión 1:** `AM149:AM177`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN B.1: INGRESOS Y EGRESOS  A REHABILITACIÓN INTEGRAL | Celdas (AM149:AM177) debe ser distinto de | celda (0)
- **Aplica a:** Códigos: 123100, 123101, 123102
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [AM149:AM177] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0. Solo aplica a códigos: 123100, 123101, 123102

---

## 📄 Hoja: A29
> 2 validaciones

### A29-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `O12:P12`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A29 | SECCIÓN A: PROGRAMA DE RESOLUTIVIDAD ATENCIÓN PRIMARIA DE SALUD | Celdas (O12:P12) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [O12:P12] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

### A29-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `M13:N13`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A29 | SECCIÓN A: PROGRAMA DE RESOLUTIVIDAD ATENCIÓN PRIMARIA DE SALUD | Celdas (M13:N13) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [M13:N13] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

---

## 📄 Hoja: A30R
> 1 validaciones

### A30R-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B16:B17`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A30R |SECCION A1: TELEINTERCONSULTA DE ESPECIALIDAD MEDICA POR HOSPITAL DIGITAL Celdas (B16:B17) debe ser distinto de | celda (0)
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [B16:B17] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0

---
