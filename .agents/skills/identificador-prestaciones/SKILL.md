---
name: Identificador de Prestaciones
description: Lee glosas de Excel, las limpia (dejando solo el texto post último "-") y las asocia con las reglas del validador por Hoja REM y Línea.
---

# Identificador de Prestaciones

Esta habilidad permite vincular las reglas técnicas definidas en `Rules_nuevas.json` con las descripciones humanas (glosas) contenidas en archivos Excel de referencia (como `glosa Serie a.xlsx`).

## Prerrequisitos
- Archivo Excel de glosas con columnas: `Código`, `Glosa`, `Hoja`, `Linea`.
- Archivo `data/Rules_nuevas.json` actualizado.
- Librería `xlsx` instalada.

## Instrucciones

### Limpieza de Glosas
La glosa extraída de Excel suele contener la jerarquía completa de la sección (ej. "SECCIÓN A - SUBSECCIÓN 1 - Prestación X"). Esta habilidad debe:
1. Buscar el último carácter guion ("-") en la cadena.
2. Extraer todo el texto que se encuentra a la derecha de ese guion.
3. Trim de espacios en blanco resultantes.

### Mapeo y Agrupamiento
1. Iterar por cada regla en el validador.
2. Identificar la(s) celda(s) involucrada(s) y su Hoja REM.
3. Buscar en el Excel de glosas la fila que coincida con la Hoja y la Línea (extraída del número de la celda).
4. Asociar la prestación limpia a la regla.
5. Agrupar el informe final por Hoja REM y luego por número de línea.

## Convenciones
- Los scripts de esta habilidad deben residir en `scripts/`.
- El informe de salida debe ser en Markdown para facilitar la lectura.
