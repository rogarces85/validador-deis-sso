---
name: Refactorizador de Mensajes
description: Actualiza los mensajes de validación en Rules_nuevas.json usando lógica inversa (explica el error) y descripciones humanas de glosas Excel.
---

# Refactorizador de Mensajes

Esta habilidad automatiza la humanización de los mensajes de error del validador. Transforma mensajes técnicos en descripciones claras para los usuarios finales del REM.

## Prerrequisitos
- `Rules_nuevas.json` en la carpeta `data/`.
- `glosa Serie a.xlsx` en la raíz del proyecto.
- Habilidad `identificador-prestaciones` instalada para la lógica de limpieza de glosas.

## Instrucciones

### 1. Inversión de Lógica
El mensaje NO debe decir lo que se espera, sino lo que está **SALIENDO MAL**.
- `!= 0` (Se espera distinto de 0) → Mensaje: "es igual a 0".
- `==` (Se espera igualdad) → Mensaje: "es distinto de".
- `<=` (Se espera menor o igual) → Mensaje: "es mayor que".
- `>=` (Se espera mayor o igual) → Mensaje: "es menor que".
- `>` (Se espera mayor) → Mensaje: "es menor o igual a".
- `<` (Se espera menor) → Mensaje: "es mayor o igual a".

### 2. Estructura del Mensaje — Formato Dual

Existen dos formatos según el tipo de validación:

#### Formato SIMPLE (expresion_2 === 0)
Reglas que comparan una celda contra `0`. Usan el campo `seccion`.

```
REM [Hoja] | Seccion [Seccion]: La prestación '[Glosa]' ([Celda]) [Condición Inversa].
```

**Ejemplo:**
```
REM A01 | Seccion General: La prestación 'Médico/a' (F36) es igual a 0.
```

Si la sección está vacía:
```
REM A01 | La prestación 'Médico/a' (F36) es igual a 0.
```

#### Formato COMPLEJO (expresion_2 es referencia de celda)
Reglas que comparan celda vs celda. Usan `seccion_expresion_1` y `seccion_expresion_2`.

```
REM [Hoja] | [Seccion Expr1] | Celdas ([Expr2]) [Condición Inversa] | [Seccion Expr2] | celda ([Expr1])
```

**Ejemplo:**
```
REM A01 | SECCION B CONTROLES DE SALUD SEGÚN CICLO VITAL | Celdas (T36:T38) debe ser mayor | SECCION D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES | celda (C74)
```

Si ambas secciones están vacías, se simplifica:
```
REM A01 | Celdas ([Expr2]) [Condición Inversa] celda ([Expr1])
```

### 3. Limpieza de Glosas
Se debe extraer solo la parte final después del último guion "-" y normalizar espacios dobles.

### 4. Secciones vacías
- Si una sección no se puede determinar, se deja como `""` (cadena vacía).
- Las secciones con `"?"` deben convertirse a `""`.
- En el mensaje, las secciones vacías se omiten (no se imprime "Seccion :").

## Convenciones
- El script debe ejecutarse mediante Node.js: `node .agents/skills/refactorizador-mensajes/scripts/refactor_messages.cjs`.
- No debe incluir prefijos de severidad como "ERROR:" o "REVISAR:".
- Después de ejecutar este script, se debe ejecutar `organize_rules.cjs` para reordenar y aplicar formato dual.
