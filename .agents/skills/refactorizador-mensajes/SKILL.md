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

### 2. Estructura del Mensaje
El formato estándar debe ser:
`REM [Hoja] | Seccion [Seccion]: La prestación '[Glosa Limpia]' ([Celda]) [Condición Inversa].`

### 3. Limpieza de Glosas
Se debe extraer solo la parte final después del último guion "-" y normalizar espacios dobles.

## Convenciones
- El script debe ejecutarse mediante Node.js: `node .agents/skills/refactorizador-mensajes/scripts/refactor_messages.cjs`.
- No debe incluir prefijos de severidad como "ERROR:" o "REVISAR:".
