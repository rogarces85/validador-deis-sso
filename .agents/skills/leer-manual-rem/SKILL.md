---
name: Lector de Manual REM
description: Lee el PDF del Manual REM 2026, extrae las Definiciones Operacionales por cada Hoja REM y genera un informe Markdown detallado (Informe_Manual_REM.md).
---

# Lector de Manual REM

Esta habilidad procesa el PDF del **Manual Resumen Estadístico Mensual (REM) 2026** y extrae automáticamente las **Definiciones Operacionales** organizadas por cada Hoja REM (A01, A02, ..., A34).

## Prerrequisitos
- Node.js instalado.
- El paquete `pdf-parse` debe estar instalado (`npm install pdf-parse`).
- Debes contar con el PDF del manual REM disponible localmente al ejecutar el script.

## Instrucciones

### Paso 1 — Ejecutar el Script

```bash
node .agents/skills/leer-manual-rem/scripts/extract_definitions.cjs
```

El script:
1. Lee el PDF del manual completo (649 páginas).
2. Identifica los bloques de cada Hoja REM mediante patrones de encabezado.
3. Dentro de cada hoja, localiza las secciones de **Definiciones Operacionales**.
4. Extrae el texto de cada definición y lo organiza por hoja y sección.
5. Genera el archivo `Informe_Manual_REM.md` con toda la información estructurada.

### Paso 2 — Revisar el Informe

El archivo `Informe_Manual_REM.md` contendrá:
- Un índice de todas las hojas REM encontradas.
- Por cada hoja: las definiciones operacionales extraídas con su texto original.
- Notas sobre posibles validaciones derivadas.

### Paso 3 — Derivar Nuevas Validaciones (Opcional)

A partir del informe, el agente o el usuario puede identificar reglas de validación adicionales que no estén actualmente implementadas en `data/reglas_finales.json`.

## Convenciones
- El PDF se procesa con `pdfjs-dist` (build legacy para compatibilidad Node.js).
- Las definiciones se identifican por patrones de texto como "Definiciones Operacionales", "Definición operacional", etc.
- Las hojas REM se detectan por encabezados como "REM-A01", "REM A01", "SERIE A", etc.
