# 📋 Registro Completo de Validaciones — Validador DEIS SSO

> **Generado automáticamente** el 04-03-2026, 4:41:15 p. m. — Total: **90 validaciones**

## 📊 Resumen por Hoja REM

| Hoja REM | Cantidad de Validaciones |
|----------|------------------------|
| **NOMBRE** | 9 |
| **A01** | 28 |
| **A02** | 4 |
| **A03** | 13 |
| **A04** | 6 |
| **A05** | 5 |
| **A08** | 7 |
| **A09** | 1 |
| **A11** | 4 |
| **A19a** | 1 |
| **A19b** | 1 |
| **A27** | 2 |
| **A28** | 6 |
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
> 28 validaciones

### A01-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `F11`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | F11. La expresión indica que [F11] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [F11] NO contenga datos (sea cero o vacía).

### A01-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `F12`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | F12. La expresión indica que [F12] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [F12] NO contenga datos (sea cero o vacía).

### A01-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `M11`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | M11. La expresión indica que [M11] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [M11] NO contenga datos (sea cero o vacía).

### A01-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `M12`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | M12. La expresión indica que [M12] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [M12] NO contenga datos (sea cero o vacía).

### A01-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `N11`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | N11. La expresión indica que [N11] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [N11] NO contenga datos (sea cero o vacía).

### A01-VAL006
- **Tipo:** CELDA
- **Expresión 1:** `N12`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | N12. La expresión indica que [N12] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [N12] NO contenga datos (sea cero o vacía).

### A01-VAL007
- **Tipo:** CELDA
- **Expresión 1:** `N13`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | N13. La expresión indica que [N13] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [N13] NO contenga datos (sea cero o vacía).

### A01-VAL008
- **Tipo:** CELDA
- **Expresión 1:** `N14`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | N14. La expresión indica que [N14] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [N14] NO contenga datos (sea cero o vacía).

### A01-VAL009
- **Tipo:** CELDA
- **Expresión 1:** `N15`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | N15. La expresión indica que [N15] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [N15] NO contenga datos (sea cero o vacía).

### A01-VAL010
- **Tipo:** CELDA
- **Expresión 1:** `N16`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | N16. La expresión indica que [N16] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [N16] NO contenga datos (sea cero o vacía).

### A01-VAL011
- **Tipo:** CELDA
- **Expresión 1:** `O31`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | O31. La expresión indica que [O31] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [O31] NO contenga datos (sea cero o vacía).

### A01-VAL012
- **Tipo:** CELDA
- **Expresión 1:** `O32`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | O32. La expresión indica que [O32] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [O32] NO contenga datos (sea cero o vacía).

### A01-VAL013
- **Tipo:** CELDA
- **Expresión 1:** `P31`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | P31. La expresión indica que [P31] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [P31] NO contenga datos (sea cero o vacía).

### A01-VAL014
- **Tipo:** CELDA
- **Expresión 1:** `P32`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | P32. La expresión indica que [P32] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [P32] NO contenga datos (sea cero o vacía).

### A01-VAL015
- **Tipo:** CELDA
- **Expresión 1:** `Q31`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Q31. La expresión indica que [Q31] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [Q31] NO contenga datos (sea cero o vacía).

### A01-VAL016
- **Tipo:** CELDA
- **Expresión 1:** `Q32`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Q32. La expresión indica que [Q32] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [Q32] NO contenga datos (sea cero o vacía).

### A01-VAL017
- **Tipo:** CELDA
- **Expresión 1:** `R31`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | R31. La expresión indica que [R31] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [R31] NO contenga datos (sea cero o vacía).

### A01-VAL018
- **Tipo:** CELDA
- **Expresión 1:** `R32`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | R32. La expresión indica que [R32] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [R32] NO contenga datos (sea cero o vacía).

### A01-VAL019
- **Tipo:** CELDA
- **Expresión 1:** `S31`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | S31. La expresión indica que [S31] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [S31] NO contenga datos (sea cero o vacía).

### A01-VAL020
- **Tipo:** CELDA
- **Expresión 1:** `S32`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | S32. La expresión indica que [S32] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [S32] NO contenga datos (sea cero o vacía).

### A01-VAL021
- **Tipo:** CELDA
- **Expresión 1:** `T31`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | T31. La expresión indica que [T31] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [T31] NO contenga datos (sea cero o vacía).

### A01-VAL022
- **Tipo:** CELDA
- **Expresión 1:** `T32`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | T32. La expresión indica que [T32] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [T32] NO contenga datos (sea cero o vacía).

### A01-VAL023
- **Tipo:** CELDA
- **Expresión 1:** `A05!C89`
- **Operador:** `==`
- **Expresión 2:** `SUM(C19:C26, F36:F38)`
- **Severidad:** ERROR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | A05, C89, C19, C26, F36, F38. La expresión indica que [A05!C89] debe ser igual a [SUM(C19:C26, F36:F38)].
- **🔍 Detalle:** Compara [A05!C89] sea igual a la suma del rango [SUM(C19:C26, F36:F38)].

### A01-VAL024
- **Tipo:** CELDA
- **Expresión 1:** `C74`
- **Operador:** `<=`
- **Expresión 2:** `T36:T38`
- **Severidad:** ERROR
- **Mensaje:** REM A01 | SECCIÓN D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES (incluidos en sección B) | C74, T36, T38. La expresión indica que [C74] debe ser menor o igual a [T36:T38].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [C74] sea menor o igual a la suma del rango [T36:T38]. | Se omite si ambas expresiones son 0

### A01-VAL025
- **Tipo:** CELDA
- **Expresión 1:** `F74`
- **Operador:** `<=`
- **Expresión 2:** `U36:U38`
- **Severidad:** ERROR
- **Mensaje:** REM A01 | SECCIÓN D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES (incluidos en sección B) | F74, U36, U38. La expresión indica que [F74] debe ser menor o igual a [U36:U38].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [F74] sea menor o igual a la suma del rango [U36:U38]. | Se omite si ambas expresiones son 0

### A01-VAL026
- **Tipo:** CELDA
- **Expresión 1:** `F36`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL | F36. La expresión indica que [F36] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [F36] NO contenga datos (sea cero o vacía).

### A01-VAL027
- **Tipo:** CELDA
- **Expresión 1:** `A03!L20 + A03!M20`
- **Operador:** `==`
- **Expresión 2:** `O36:O37`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | A03, L20, M20, O36, O37. La expresión indica que [A03!L20 + A03!M20] debe ser igual a [O36:O37].
- **🔍 Detalle:** Compara [A03!L20 + A03!M20] sea igual a la suma del rango [O36:O37].

### A01-VAL028
- **Tipo:** CELDA
- **Expresión 1:** `A03!N20 + A03!O20`
- **Operador:** `==`
- **Expresión 2:** `A01!P36 + A01!P37`
- **Severidad:** REVISAR
- **Mensaje:** REM A01 | SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | A03, N20, O20, A01, P36, P37. La expresión indica que [A03!N20 + A03!O20] debe ser igual a [A01!P36 + A01!P37].
- **🔍 Detalle:** Comparación cross-sheet: verifica que [A03!N20 + A03!O20] sea igual a [A01!P36 + A01!P37] (referencia a otra hoja del libro).

---

## 📄 Hoja: A02
> 4 validaciones

### A02-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B11`
- **Operador:** `==`
- **Expresión 2:** `B21`
- **Severidad:** ERROR
- **Mensaje:** REM A02 | SECCIÓN A: EMP REALIZADO POR PROFESIONAL | B11, B21. La expresión indica que [B11] debe ser igual a [B21].
- **🔍 Detalle:** Compara [B11] sea igual a [B21].

### A02-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `C11`
- **Operador:** `==`
- **Expresión 2:** `C21`
- **Severidad:** ERROR
- **Mensaje:** REM A02 | SECCIÓN A: EMP REALIZADO POR PROFESIONAL | C11, C21. La expresión indica que [C11] debe ser igual a [C21].
- **🔍 Detalle:** Compara [C11] sea igual a [C21].

### A02-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `A03!C108 + A03!C110`
- **Operador:** `==`
- **Expresión 2:** `B11`
- **Severidad:** ERROR
- **Mensaje:** REM A02 | SECCIÓN A: APLICACIÓN DE INSTRUMENTO Y RESULTADO EN EL NIÑO (A) | A03, C108, C110, B11. La expresión indica que [A03!C108 + A03!C110] debe ser igual a [B11].
- **🔍 Detalle:** Compara [A03!C108 + A03!C110] sea igual a [B11].

### A02-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `A03!C113`
- **Operador:** `==`
- **Expresión 2:** `E11 + F11`
- **Severidad:** ERROR
- **Mensaje:** REM A02 | SECCIÓN A: APLICACIÓN DE INSTRUMENTO Y RESULTADO EN EL NIÑO (A) | A03, C113, E11, F11. La expresión indica que [A03!C113] debe ser igual a [E11 + F11].
- **🔍 Detalle:** Compara [A03!C113] sea igual a [E11 + F11].

---

## 📄 Hoja: A03
> 13 validaciones

### A03-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `C20`
- **Operador:** `==`
- **Expresión 2:** `C21:C36`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR | C20, C21, C36. La expresión indica que [C20] debe ser igual a [C21:C36].
- **🔍 Detalle:** Compara [C20] sea igual a la suma del rango [C21:C36].

### A03-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `C13`
- **Operador:** `==`
- **Expresión 2:** `C14:C15`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.1: APLICACIÓN Y RESULTADOS DE PAUTA BREVE | C13, C14, C15. La expresión indica que [C13] debe ser igual a [C14:C15].
- **🔍 Detalle:** Compara [C13] sea igual a la suma del rango [C14:C15].

### A03-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `C54`
- **Operador:** `==`
- **Expresión 2:** `C55:C57`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.4: RESULTADOS DE LA APLICACIÓN DE PROTOCOLO NEUROSENSORIAL | C54, C55, C57. La expresión indica que [C54] debe ser igual a [C55:C57].
- **🔍 Detalle:** Compara [C54] sea igual a la suma del rango [C55:C57].

### A03-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C22`
- **Operador:** `==`
- **Expresión 2:** `B46`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR | C22, B46. La expresión indica que [C22] debe ser igual a [B46].
- **🔍 Detalle:** Compara [C22] sea igual a [B46].

### A03-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `C23`
- **Operador:** `==`
- **Expresión 2:** `B47`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR | C23, B47. La expresión indica que [C23] debe ser igual a [B47].
- **🔍 Detalle:** Compara [C23] sea igual a [B47].

### A03-VAL006
- **Tipo:** CELDA
- **Expresión 1:** `C24`
- **Operador:** `==`
- **Expresión 2:** `B48`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR | C24, B48. La expresión indica que [C24] debe ser igual a [B48].
- **🔍 Detalle:** Compara [C24] sea igual a [B48].

### A03-VAL007
- **Tipo:** CELDA
- **Expresión 1:** `B86`
- **Operador:** `==`
- **Expresión 2:** `A05!C11`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN B.2: APLICACIÓN DE ESCALA SEGÚN EVALUACIÓN DE RIESGO PSICOSOCIAL ABREVIADA A GESTANTES | B86, A05, C11. La expresión indica que [B86] debe ser igual a [A05!C11].
- **🔍 Detalle:** Comparación cross-sheet: verifica que [B86] sea igual a [A05!C11] (referencia a otra hoja del libro).

### A03-VAL008
- **Tipo:** CELDA
- **Expresión 1:** `C92`
- **Operador:** `<=`
- **Expresión 2:** `A01!(H36:H37)`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN B.3: APLICACIÓN DE ESCALA DE EDIMBURGO A GESTANTES Y MUJERES POST PARTO | C92, A01, H36, H37. La expresión indica que [C92] debe ser menor o igual a [A01!(H36:H37)].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Comparación cross-sheet: verifica que [C92] sea menor o igual a [A01!(H36:H37)] (referencia a otra hoja del libro). | Se omite si ambas expresiones son 0

### A03-VAL009
- **Tipo:** CELDA
- **Expresión 1:** `C93`
- **Operador:** `<=`
- **Expresión 2:** `A01!(L36:L37)`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN B.3: APLICACIÓN DE ESCALA DE EDIMBURGO A GESTANTES Y MUJERES POST PARTO | C93, A01, L36, L37. La expresión indica que [C93] debe ser menor o igual a [A01!(L36:L37)].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Comparación cross-sheet: verifica que [C93] sea menor o igual a [A01!(L36:L37)] (referencia a otra hoja del libro). | Se omite si ambas expresiones son 0

### A03-VAL010
- **Tipo:** CELDA
- **Expresión 1:** `C97`
- **Operador:** `==`
- **Expresión 2:** `A01!(T36:U38)`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN C: RESULTADOS DE LA EVALUACIÓN DEL ESTADO NUTRICIONAL DEL ADOLESCENTE CON CONTROL SALUD INTEGRAL | C97, A01, T36, U38. La expresión indica que [C97] debe ser igual a [A01!(T36:U38)].
- **🔍 Detalle:** Comparación cross-sheet: verifica que [C97] sea igual a [A01!(T36:U38)] (referencia a otra hoja del libro).

### A03-VAL011
- **Tipo:** CELDA
- **Expresión 1:** `C108:C114`
- **Operador:** `==`
- **Expresión 2:** `C115:C117`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN D.1: APLICACIÓN DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE  ALCOHOL, TABACO Y OTRAS DROGAS | C108, C114, C115, C117. La expresión indica que [C108:C114] debe ser igual a [C115:C117].
- **🔍 Detalle:** Compara [C108:C114] sea igual a la suma del rango [C115:C117].

### A03-VAL012
- **Tipo:** CELDA
- **Expresión 1:** `C213`
- **Operador:** `==`
- **Expresión 2:** `C214+C215`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCION E: APLICACIÓN DE PAUTA DETECCIÓN DE FACTORES DE RIESGO BIOPSICOSOCIAL INFANTIL | C213, C214, C215. La expresión indica que [C213] debe ser igual a [C214+C215].
- **🔍 Detalle:** Compara [C213] sea igual a [C214+C215].

### A03-VAL013
- **Tipo:** CELDA
- **Expresión 1:** `C61:C66`
- **Operador:** `==`
- **Expresión 2:** `C67`
- **Severidad:** ERROR
- **Mensaje:** REM A03 | SECCIÓN A.5: TIPO DE ALIMENTACIÓN NIÑOS Y NIÑAS CONTROLADOS | C61, C66, C67. La expresión indica que [C61:C66] debe ser igual a [C67].
- **🔍 Detalle:** Verifica que el rango [C61:C66] esté vacío.

---

## 📄 Hoja: A04
> 6 validaciones

### A04-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B39:B41`
- **Operador:** `==`
- **Expresión 2:** `B135:B137`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN B: CONSULTAS DE PROFESIONALES NO MÉDICOS | B39, B41, B135, B137. La expresión indica que [B39:B41] debe ser igual a [B135:B137].
- **🔍 Detalle:** Compara [B39:B41] sea igual a la suma del rango [B135:B137].

### A04-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `C141:C143`
- **Operador:** `==`
- **Expresión 2:** `C146:C149`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN L: CONSULTA DE LACTANCIA EN NIÑOS Y NIÑAS CONTROLADOS | C141, C143, C146, C149. La expresión indica que [C141:C143] debe ser igual a [C146:C149].
- **🔍 Detalle:** Compara [C141:C143] sea igual a la suma del rango [C146:C149].

### A04-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `C114+D114`
- **Operador:** `==`
- **Expresión 2:** `E114+F114`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN I.1 : DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA | C114, D114, E114, F114. La expresión indica que [C114+D114] debe ser igual a [E114+F114].
- **🔍 Detalle:** Compara [C114+D114] sea igual a [E114+F114].

### A04-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C115+D115`
- **Operador:** `==`
- **Expresión 2:** `E115+F115`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN I.1 : DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA | C115, D115, E115, F115. La expresión indica que [C115+D115] debe ser igual a [E115+F115].
- **🔍 Detalle:** Compara [C115+D115] sea igual a [E115+F115].

### A04-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `C116+D116`
- **Operador:** `==`
- **Expresión 2:** `E116+F116`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN I.1 : DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA | C116, D116, E116, F116. La expresión indica que [C116+D116] debe ser igual a [E116+F116].
- **🔍 Detalle:** Compara [C116+D116] sea igual a [E116+F116].

### A04-VAL006
- **Tipo:** CELDA
- **Expresión 1:** `M114`
- **Operador:** `>=`
- **Expresión 2:** `L114`
- **Severidad:** ERROR
- **Mensaje:** REM A04 | SECCIÓN I.1 : DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA | M114, L114. La expresión indica que [M114] debe ser mayor o igual a [L114].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [M114] sea mayor o igual a [L114]. | Se omite si ambas expresiones son 0

---

## 📄 Hoja: A05
> 5 validaciones

### A05-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `L11:N14`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A05 | SECCIÓN A: INGRESOS DE GESTANTES A PROGRAMA PRENATAL | L11, N14. La expresión indica que [L11:N14] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [L11:N14] NO contenga datos (sea cero o vacía).

### A05-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `C119`
- **Operador:** `<=`
- **Expresión 2:** `C120:C127`
- **Severidad:** ERROR
- **Mensaje:** REM A05 | SECCIÓN H: INGRESOS AL PROGRAMA DE SALUD CARDIOVASCULAR (PSCV) | C119, C120, C127. La expresión indica que [C119] debe ser menor o igual a [C120:C127].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [C119] sea menor o igual a la suma del rango [C120:C127]. | Se omite si ambas expresiones son 0

### A05-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `AF146:AM150`
- **Operador:** `>`
- **Expresión 2:** `C162`
- **Severidad:** ERROR
- **Mensaje:** REM A05 | SECCIÓN J: INGRESOS Y EGRESOS AL PROGRAMA DE PACIENTES CON DEPENDENCIA LEVE, MODERADA Y SEVERA | AF146, AM150, C162. La expresión indica que [AF146:AM150] debe ser estrictamente mayor a [C162].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara la suma del rango [AF146:AM150] sea mayor que [C162]. | Se omite si ambas expresiones son 0

### A05-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C193`
- **Operador:** `==`
- **Expresión 2:** `C204`
- **Severidad:** REVISAR
- **Mensaje:** REM A05 | SECCIÓN N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS /ESPECIALIDAD | C193, C204. La expresión indica que [C193] debe ser igual a [C204].
- **🔍 Detalle:** Compara [C193] sea igual a [C204].

### A05-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `C204`
- **Operador:** `<=`
- **Expresión 2:** `C205:C241`
- **Severidad:** ERROR
- **Mensaje:** REM A05 | SECCIÓN N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS /ESPECIALIDAD | C204, C205, C241. La expresión indica que [C204] debe ser menor o igual a [C205:C241].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [C204] sea menor o igual a la suma del rango [C205:C241]. | Se omite si ambas expresiones son 0

---

## 📄 Hoja: A08
> 7 validaciones

### A08-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `C61:AL66`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN B: CATEGORIZACIÓN DE PACIENTES, PREVIA A LA ATENCIÓN MÉDICA U ODONTOLÓGICA (Establecimientos Alta, Mediana, Baja Complejidad, SAPU, SAR, SUR) | C61, AL66. La expresión indica que [C61:AL66] la celda no debe contener datos.
- **Aplica a:** Tipo: HOSPITAL, SAPU, SUR
- **Excluye:** Códigos: 123000, 123100, 123101, 123102, 123103, 123104, 123105, 123800, 123801, 200085, 200747, 200748, 200749, 200750
- **🔍 Detalle:** Verifica que la expresión [C61:AL66] NO contenga datos (sea cero o vacía). | Solo aplica a tipo: HOSPITAL, SAPU, SUR. Excluye códigos: 123000, 123100, 123101, 123102, 123103, 123104, 123105, 123800, 123801, 200085, 200747, 200748, 200749, 200750

### A08-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `B13+B14`
- **Operador:** `==`
- **Expresión 2:** `B78`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA (Establecimientos de alta y mediana complejidad) | B13, B14, B78. La expresión indica que [B13+B14] debe ser igual a [B78].
- **🔍 Detalle:** Compara [B13+B14] sea igual a [B78].

### A08-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `C171:F171`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA (Desde el lugar del evento a unidad de Emergencia) | C171, F171. La expresión indica que [C171:F171] la celda no debe contener datos.
- **Excluye:** Códigos: 123000, 123102, 123101, 123104, 123105, 123311, 200747, 200748, 200749, 200750
- **🔍 Detalle:** Verifica que la expresión [C171:F171] NO contenga datos (sea cero o vacía). | Excluye códigos: 123000, 123102, 123101, 123104, 123105, 123311, 200747, 200748, 200749, 200750

### A08-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C172:F174`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA (Desde el lugar del evento a unidad de Emergencia) | C172, F174. La expresión indica que [C172:F174] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [C172:F174] NO contenga datos (sea cero o vacía).

### A08-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `E178:E183`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN M: TRASLADO SECUNDARIO (Desde un establecimiento a otro) | E178, E183. La expresión indica que [E178:E183] la celda no debe contener datos.
- **Excluye:** Tipo: SAMU; Códigos: 123010
- **🔍 Detalle:** Verifica que la expresión [E178:E183] NO contenga datos (sea cero o vacía). | Excluye tipo: SAMU. Excluye códigos: 123010

### A08-VAL006
- **Tipo:** CELDA
- **Expresión 1:** `C161+D161`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN J: LLAMADOS DE URGENCIA A CENTRO REGULADOR, CENTRO DE DESPACHO O CENTRO COORDINADOR | C161, D161. La expresión indica que [C161+D161] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [C161+D161] NO contenga datos (sea cero o vacía).

### A08-VAL007
- **Tipo:** CELDA
- **Expresión 1:** `B13`
- **Operador:** `<`
- **Expresión 2:** `AS13`
- **Severidad:** ERROR
- **Mensaje:** REM A08 | SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA (Establecimientos de alta y mediana complejidad) | B13, AS13. La expresión indica que [B13] debe ser estrictamente menor a [AS13].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B13] sea menor que [AS13]. | Se omite si ambas expresiones son 0

---

## 📄 Hoja: A09
> 1 validaciones

### A09-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `D16+D17`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A09 | SECCIÓN A: CONSULTAS Y CONTROLES DE ODONTOLOGÍA GENERAL EN  NIVEL PRIMARIO Y SECUNDARIO DE SALUD | D16, D17. La expresión indica que [D16+D17] la celda debe contener datos.
- **Aplica a:** Códigos: 123000, 123100, 123101, 123102
- **🔍 Detalle:** Verifica que la expresión [D16+D17] contenga datos (no sea cero ni vacía). | Solo aplica a códigos: 123000, 123100, 123101, 123102

---

## 📄 Hoja: A11
> 4 validaciones

### A11-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B13:C30`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A11 | SECCIÓN A.1: EXAMEN VDRL POR GRUPO DE USUARIOS (USO EXCLUSIVO DE ESTABLECIMIENTOS CON LABORATORIO QUE PROCESAN) | B13, C30. La expresión indica que [B13:C30] la celda debe contener datos.
- **Aplica a:** Códigos: 123000, 123100
- **🔍 Detalle:** Verifica que la expresión [B13:C30] contenga datos (no sea cero ni vacía). | Solo aplica a códigos: 123000, 123100

### A11-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `C144:P148`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A11 | SECCIÓN B.1: EXÁMENES SEGÚN GRUPOS DE USUARIOS POR CONDICIÓN DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS (USO EXCLUSIVO DE ESTABLECIMIENTOS CON LABORATORIO QUE PROCESAN) | C144, P148. La expresión indica que [C144:P148] la celda debe contener datos.
- **Aplica a:** Códigos: 123000, 123100
- **🔍 Detalle:** Verifica que la expresión [C144:P148] contenga datos (no sea cero ni vacía). | Solo aplica a códigos: 123000, 123100

### A11-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `C152:P156`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A11 | SECCIÓN B.2: EXÁMENES SEGÚN GRUPOS DE USUARIOS POR CONDICIÓN DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS (USO EXCLUSIVO DE ESTABLECIMIENTOS QUE COMPRAN SERVICIO) | C152, P156. La expresión indica que [C152:P156] la celda debe contener datos.
- **Aplica a:** Códigos: 123000, 123100
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Verifica que la expresión [C152:P156] contenga datos (no sea cero ni vacía). | Se omite si expresión_1 es 0. Solo aplica a códigos: 123000, 123100

### A11-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `C161:D183`
- **Operador:** `!=`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A11 | SECCIÓN C.1: EXÁMENES  DE  VIH POR GRUPOS DE USUARIOS (USO EXCLUSIVO DE ESTABLECIMIENTOS CON LABORATORIO QUE PROCESAN) | C161, D183. La expresión indica que [C161:D183] la celda debe contener datos.
- **Aplica a:** Códigos: 123000, 123100
- **🔍 Detalle:** Verifica que la expresión [C161:D183] contenga datos (no sea cero ni vacía). | Solo aplica a códigos: 123000, 123100

---

## 📄 Hoja: A19a
> 1 validaciones

### A19a-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `C129:C148`
- **Operador:** `==`
- **Expresión 2:** `O129:O148`
- **Severidad:** ERROR
- **Mensaje:** REM A19a | SECCIÓN B.1: ACTIVIDADES DE PROMOCIÓN SEGÚN ESTRATEGIAS Y CONDICIONANTES ABORDADAS Y NÚMERO DE PARTICIPANTES | C129, C148, O129, O148. La expresión indica que [C129:C148] debe ser igual a [O129:O148].
- **🔍 Detalle:** Compara [C129:C148] sea igual a la suma del rango [O129:O148].

---

## 📄 Hoja: A19b
> 1 validaciones

### A19b-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B11`
- **Operador:** `==`
- **Expresión 2:** `E11:I11`
- **Severidad:** REVISAR
- **Mensaje:** REM A19b | SECCIÓN A: ATENCIÓN OFICINAS DE INFORMACIONES (SISTEMA INTEGRAL DE ATENCIÓN A USUARIOS) | B11, E11, I11. La expresión indica que [B11] debe ser igual a [E11:I11].
- **🔍 Detalle:** Compara [B11] sea igual a la suma del rango [E11:I11].

---

## 📄 Hoja: A27
> 2 validaciones

### A27-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `D53`
- **Operador:** `==`
- **Expresión 2:** `D98`
- **Severidad:** REVISAR
- **Mensaje:** REM A27 | SECCIÓN A: PERSONAS QUE INGRESAN A EDUCACIÓN GRUPAL SEGÚN ÁREAS TEMÁTICAS Y EDAD | D53. La expresión indica que [D53] debe ser igual a [D98].
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Compara [D53] sea igual a [D98]. | Se omite si expresión_1 es 0

### A27-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `D23`
- **Operador:** `==`
- **Expresión 2:** `Y23:AA23`
- **Severidad:** REVISAR
- **Mensaje:** REM A27 | SECCIÓN A: PERSONAS QUE INGRESAN A EDUCACIÓN GRUPAL SEGÚN ÁREAS TEMÁTICAS Y EDAD | D23. La expresión indica que [D23] debe ser igual a [Y23:AA23].
- **Opciones:** Omitir si exp1=0
- **🔍 Detalle:** Compara [D23] sea igual a la suma del rango [Y23:AA23]. | Se omite si expresión_1 es 0

---

## 📄 Hoja: A28
> 6 validaciones

### A28-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B13`
- **Operador:** `<=`
- **Expresión 2:** `B61`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN A.1: INGRESOS Y EGRESOS  A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO | B13, B61. La expresión indica que [B13] debe ser menor o igual a [B61].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B13] sea menor o igual a [B61]. | Se omite si ambas expresiones son 0

### A28-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `B13`
- **Operador:** `>=`
- **Expresión 2:** `B14`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN A.1: INGRESOS Y EGRESOS  A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO | B13, B14. La expresión indica que [B13] debe ser mayor o igual a [B14].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B13] sea mayor o igual a [B14]. | Se omite si ambas expresiones son 0

### A28-VAL003
- **Tipo:** CELDA
- **Expresión 1:** `B13`
- **Operador:** `>=`
- **Expresión 2:** `B15`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN A.1: INGRESOS Y EGRESOS  A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO | B13, B15. La expresión indica que [B13] debe ser mayor o igual a [B15].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B13] sea mayor o igual a [B15]. | Se omite si ambas expresiones son 0

### A28-VAL004
- **Tipo:** CELDA
- **Expresión 1:** `B29`
- **Operador:** `<=`
- **Expresión 2:** `B30:B52`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN A.2: INGRESOS POR CONDICIÓN DE SALUD | B29, B30, B52. La expresión indica que [B29] debe ser menor o igual a [B30:B52].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B29] sea menor o igual a la suma del rango [B30:B52]. | Se omite si ambas expresiones son 0

### A28-VAL005
- **Tipo:** CELDA
- **Expresión 1:** `B149`
- **Operador:** `<=`
- **Expresión 2:** `B150:B177`
- **Severidad:** ERROR
- **Mensaje:** REM A28 | SECCIÓN B.1: INGRESOS Y EGRESOS  A REHABILITACIÓN INTEGRAL | B149, B150, B177. La expresión indica que [B149] debe ser menor o igual a [B150:B177].
- **Opciones:** Omitir si ambos=0
- **🔍 Detalle:** Compara [B149] sea menor o igual a la suma del rango [B150:B177]. | Se omite si ambas expresiones son 0

### A28-VAL006
- **Tipo:** CELDA
- **Expresión 1:** `AM150:AM178`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** REVISAR
- **Mensaje:** REM A28 | SECCIÓN B.1: INGRESOS Y EGRESOS  A REHABILITACIÓN INTEGRAL | AM150, AM178. La expresión indica que [AM150:AM178] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [AM150:AM178] NO contenga datos (sea cero o vacía).

---

## 📄 Hoja: A29
> 2 validaciones

### A29-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `O12:P12`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A29 | SECCIÓN A: PROGRAMA DE RESOLUTIVIDAD ATENCIÓN PRIMARIA DE SALUD | O12, P12. La expresión indica que [O12:P12] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [O12:P12] NO contenga datos (sea cero o vacía).

### A29-VAL002
- **Tipo:** CELDA
- **Expresión 1:** `M13:N13`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A29 | SECCIÓN A: PROGRAMA DE RESOLUTIVIDAD ATENCIÓN PRIMARIA DE SALUD | M13, N13. La expresión indica que [M13:N13] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [M13:N13] NO contenga datos (sea cero o vacía).

---

## 📄 Hoja: A30R
> 1 validaciones

### A30-VAL001
- **Tipo:** CELDA
- **Expresión 1:** `B16:B17`
- **Operador:** `==`
- **Expresión 2:** `0`
- **Severidad:** ERROR
- **Mensaje:** REM A30R | Sección Desconocida | B16, B17. La expresión indica que [B16:B17] la celda no debe contener datos.
- **🔍 Detalle:** Verifica que la expresión [B16:B17] NO contenga datos (sea cero o vacía).

---
