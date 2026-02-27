---
description: Crear y validar reglas de validación REM para el Validador DEIS SSO
---

# Skill: Reglas de Validación REM

Este skill enseña cómo entender, crear y modificar reglas de validación para el sistema Validador DEIS SSO 2026.

## Contexto del Sistema

El Validador DEIS SSO valida archivos Excel REM (Registro Estadístico Mensual) del sistema de salud chileno. Las reglas se almacenan en un único archivo JSON y se ejecutan automáticamente al subir un archivo.

## Archivos Clave

| Archivo | Propósito |
|---|---|
| `data/rules.json` | **Todas las reglas de validación** — es el único archivo que se edita |
| `services/ruleEngine.ts` | Motor que ejecuta las reglas (NO modificar para agregar reglas) |
| `hooks/useValidationPipeline.ts` | Pipeline que carga y filtra reglas por serie |
| `types.ts` | Tipos TypeScript (`ValidationRule`, `Severity`) |

## Estructura del Archivo de Reglas

```json
{
  "validaciones": {
    "A01": [ /* array de reglas para hoja A01 */ ],
    "A02": [ /* array de reglas para hoja A02 */ ],
    "A03": [ /* ... */ ]
  }
}
```

Cada serie (A01, A02, ..., A30) es una clave del objeto `validaciones` que contiene un array de reglas.

## Anatomía de una Regla

```json
{
  "id": "VAL01",
  "tipo": "CELDA",
  "rem_sheet": "A01",
  "expresion_1": "F11",
  "operador": "==",
  "expresion_2": 0,
  "severidad": "REVISAR",
  "mensaje": "Descripción clara del error..."
}
```

### Campos Obligatorios

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador. Usar formato `VALxx`. Puede repetirse si varias reglas son variantes del mismo chequeo |
| `tipo` | string | Siempre `"CELDA"` (único tipo soportado actualmente) |
| `rem_sheet` | string | Hoja REM principal donde aplica (ej: `"A01"`, `"A05"`) |
| `expresion_1` | string/number | Lado izquierdo de la comparación |
| `operador` | string | Operador: `==`, `!=`, `>`, `<`, `>=`, `<=` |
| `expresion_2` | string/number | Lado derecho de la comparación |
| `severidad` | string | `"ERROR"`, `"REVISAR"`, `"OBSERVAR"` o `"INDICADOR"` |
| `mensaje` | string | Descripción legible del error, incluyendo referencias a celdas y secciones |

### Campos Opcionales

| Campo | Tipo | Descripción |
|---|---|---|
| `aplicar_a` | string[] | Lista de códigos DEIS (6 dígitos). La regla solo se ejecuta si el establecimiento está en esta lista |
| `establecimientos_excluidos` | string[] | Lista de códigos DEIS. La regla se salta estos establecimientos |
| `rem_sheet_ext` | string | Documentación: indica la hoja externa referenciada en la expresión |
| `serie` | string | Serie REM (A, P, D). Informativo, el sistema filtra por `rem_sheet` |

## Tipos de Expresiones Soportadas

### 1. Celda Simple
Referencia a una celda individual en la hoja `rem_sheet`.
```json
"expresion_1": "F11"
```

### 2. Referencia Cross-Sheet
Celda de otra hoja. Formato: `HOJA!CELDA`.
```json
"expresion_1": "A03!C108"
```

### 3. Rango (suma automática)
Suma todas las celdas del rango. Formato: `CELDA_INICIO:CELDA_FIN`.
```json
"expresion_2": "C21:C36"
```

### 4. Rango Cross-Sheet con Paréntesis
Rango de otra hoja. Formato: `HOJA!(RANGO)`.
```json
"expresion_2": "A01!(H36:H37)"
```

### 5. Aritmética (suma de celdas)
Suma individual de celdas usando `+`. Soporta cross-sheet.
```json
"expresion_1": "A03!L20 + A03!M20",
"expresion_2": "C114+D114"
```

### 6. SUM Multi-Rango
Suma de múltiples rangos separados por coma.
```json
"expresion_2": "SUM(C19:C26, F36:F38)"
```

### 7. Valor Numérico Fijo
```json
"expresion_2": 0
```

## Niveles de Severidad

| Severidad | Significado | Color en Excel | Cuándo usar |
|---|---|---|---|
| `ERROR` | Falla crítica, dato incorrecto | 🔴 Rojo + fondo rosa | Inconsistencia lógica que debe corregirse obligatoriamente |
| `REVISAR` | Valor inusual que necesita revisión | 🟠 Naranjo + fondo amarillo | Dato posible pero poco frecuente (edades extremas, registros en centros que no corresponden) |
| `OBSERVAR` | Observación informativa | 🟢 Verde + fondo verde | Cruce informativo, sin obligación de corregir |
| `INDICADOR` | Indicador de gestión | 🔵 Azul + fondo azul | Métricas y estadísticas, no son errores |

## Operadores

| Operador | Significado | Caso de uso típico |
|---|---|---|
| `==` | Igual a | Totales que deben cuadrar, celdas que deben ser cero |
| `!=` | Distinto de | Detectar registros donde no debería haber (debe ser 0 pero es !=0) |
| `>` | Mayor que | Valor debe superar un umbral |
| `<` | Menor que | Valor no debe superar un umbral |
| `>=` | Mayor o igual | Total debe ser al menos igual a un subtotal |
| `<=` | Menor o igual | Subtotal no debe exceder el total |

## Patrones Comunes de Reglas

### Patrón 1: Celda debe ser cero (dato en edad extrema)
Detecta registros en rangos de edad donde no se esperan datos.
```json
{
  "id": "VAL01",
  "tipo": "CELDA",
  "rem_sheet": "A01",
  "expresion_1": "F11",
  "operador": "==",
  "expresion_2": 0,
  "severidad": "REVISAR",
  "mensaje": "Control Preconcepcional en edades extremas de 10 a 14 años, celda F11"
}
```

### Patrón 2: Total debe cuadrar con desglose
Verifica que un total sea igual a la suma de sus componentes.
```json
{
  "id": "VAL09",
  "tipo": "CELDA",
  "rem_sheet": "A03",
  "expresion_1": "C20",
  "operador": "==",
  "expresion_2": "C21:C36",
  "severidad": "ERROR",
  "mensaje": "El total (C20) debe ser igual al detalle de evaluaciones (C21:C36)."
}
```

### Patrón 3: Cruce entre hojas REM
Verifica consistencia entre datos de diferentes hojas.
```json
{
  "id": "VAL06",
  "tipo": "CELDA",
  "rem_sheet": "A01",
  "expresion_1": "A05!C89",
  "operador": "==",
  "expresion_2": "SUM(C19:C26, F36:F38)",
  "severidad": "ERROR",
  "mensaje": "La suma de Puérperas (C19:C26 + F36:F38) debe ser igual a Total REM05 (A05!C89).",
  "rem_sheet_ext": "A05"
}
```

### Patrón 4: Regla solo para ciertos establecimientos
Usa `aplicar_a` para limitar a establecimientos específicos.
```json
{
  "id": "VAL36",
  "tipo": "CELDA",
  "rem_sheet": "A08",
  "expresion_1": "E12:AL15",
  "operador": "!=",
  "expresion_2": 0,
  "severidad": "ERROR",
  "mensaje": "Atenciones en UEH corresponde solo a HBSJO y HPU.",
  "aplicar_a": ["123100", "123101", "123000"]
}
```

### Patrón 5: Excluir establecimientos
Usa `establecimientos_excluidos` para saltar ciertos centros.
```json
{
  "id": "VAL45",
  "tipo": "CELDA",
  "rem_sheet": "A08",
  "expresion_1": "E178:E183",
  "operador": "==",
  "expresion_2": 0,
  "severidad": "ERROR",
  "mensaje": "Traslados Secundarios deben registrar todos los establecimientos excepto SAMU.",
  "establecimientos_excluidos": ["123010"]
}
```

### Patrón 6: Subtotal no debe exceder total
```json
{
  "id": "VAL07",
  "tipo": "CELDA",
  "rem_sheet": "A01",
  "expresion_1": "C74",
  "operador": "<=",
  "expresion_2": "T36:T38",
  "severidad": "ERROR",
  "mensaje": "Control de Salud Integral (C74) debe ser menor o igual a Ciclo Vital 10-14 años (T36:T38)."
}
```

## Cómo Crear una Nueva Regla

### Paso 1: Identificar la validación
Determinar:
- ¿Qué hoja REM afecta? → `rem_sheet`
- ¿Qué celdas se comparan? → `expresion_1`, `expresion_2`
- ¿Qué relación deben tener? → `operador`
- ¿Es un error crítico o una observación? → `severidad`
- ¿Aplica a todos los establecimientos o solo a algunos? → `aplicar_a` / `establecimientos_excluidos`

### Paso 2: Escribir la regla en JSON
Seguir la estructura de los patrones anteriores. Elegir un `id` secuencial (ej: si la última es VAL66, usar VAL67).

### Paso 3: Agregar al array correcto
En `data/rules.json`, ubicar la serie correspondiente y agregar la regla al array. Si la serie no existe, crear una nueva clave.

### Paso 4: Escribir el mensaje
El mensaje debe ser claro e incluir:
- La sección del REM
- Las celdas involucradas
- La lógica de negocio que se valida

### Paso 5: Verificar
- Ejecutar `npx vite build` para asegurar que el JSON es válido
- Probar con un archivo real para verificar que la regla se ejecuta

## Ejemplo Completo: Crear 3 reglas nuevas

Si te piden: *"Agregar validación para que en REM A05, el total de ingresos al PSCV (C119) sea igual al desglose por patología (C120 a C127), y también que las gestantes ingresadas en REM05 (C11) no superen las evaluaciones de riesgo en REM03 (B86)"*

```json
{
  "id": "VAL67",
  "tipo": "CELDA",
  "rem_sheet": "A05",
  "expresion_1": "C119",
  "operador": "==",
  "expresion_2": "C120:C127",
  "severidad": "ERROR",
  "mensaje": "REM05, ERROR sección H: Total ingresos PSCV (C119) debe ser igual al desglose por patología (C120:C127)."
},
{
  "id": "VAL68",
  "tipo": "CELDA",
  "rem_sheet": "A05",
  "expresion_1": "C11",
  "operador": "<=",
  "expresion_2": "A03!B86",
  "severidad": "ERROR",
  "mensaje": "REM05, ERROR sección A: Gestantes ingresadas (C11) no debe superar evaluaciones de riesgo REM03 (A03!B86).",
  "rem_sheet_ext": "A03"
}
```

## Errores Comunes al Crear Reglas

1. **JSON inválido**: Siempre verificar comas entre objetos y cierre de corchetes
2. **Rango invertido**: `C36:C21` no funciona, usar `C21:C36`
3. **Hoja inexistente**: Verificar que el nombre de la hoja (ej: `A05`) coincida con las hojas del archivo Excel
4. **Operador invertido**: Si quieres "A debe ser mayor que B", la expresión es `A >= B`, no `B <= A`
5. **Olvidar `aplicar_a`**: Si una regla solo aplica a hospitales, olvidar este campo hará que se ejecute en todos los centros
