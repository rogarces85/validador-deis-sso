---
name: Lector de Secciones Excel (exce-seccion)
description: Extrae las secciones de todas las hojas de un archivo Excel, generando un archivo Markdown estructurado. Se basa en la habilidad lector-excel-pro para la lectura eficiente.
---

# Lector de Secciones Excel (exce-seccion)

Esta habilidad automatiza la extracción de todos los encabezados que comienzan con "SECCIÓN" o "SECCION" desde cualquier archivo Excel (.xlsx, .xlsm), leyendo hoja por hoja y generando un consolidado en formato Markdown, optimizando el rendimiento usando la librería `xlsx`.

## Prerrequisitos
- Esta habilidad utiliza internamente las directrices de optimización de **Lector Excel Pro** (`lector-excel-pro`).
- Librería `xlsx` instalada en el proyecto (`npm install xlsx`).
- Node.js instalado.

## Instrucciones

Cuando el usuario te solicite procesar un archivo Excel para extraer sus secciones y listar los resultados en un archivo Markdown, debes seguir estos pasos:

### Paso 1 — Ejecutar el Script de Extracción

Utiliza el script `extract_sections.cjs` incluido en esta habilidad para procesar el archivo Excel. El script toma dos argumentos pasados por línea de comandos: la ruta del archivo Excel de entrada y la ruta del archivo Markdown de salida. Si no se entregan, usa unos por defecto en el Validador.

Puedes ejecutar el script desde el CLI de la siguiente manera:

```bash
node .agents/skills/exce-seccion/scripts/extract_sections.cjs <ruta_absoluta_excel> <ruta_absoluta_markdown>
```

Por ejemplo, si el Excel se llama `archivo_rem.xlsm` y la salida es `data/secciones.md`:

```bash
node .agents/skills/exce-seccion/scripts/extract_sections.cjs "$(pwd)/archivo_rem.xlsm" "$(pwd)/data/secciones.md"
```

### Paso 2 — Validar los Resultados

Revisa el archivo Markdown generado.
La estructura generada seguirá el siguiente formato:

```markdown
# Secciones extraídas de [nombre_archivo.xlsx]

## Hoja: [Nombre_de_la_hoja]
- 📋 **Fila [Número]**: [Texto de la celda completa]
```

## Convenciones
- El script ignora celdas vacías y solo selecciona arreglos donde al menos una celda de tipo *string* inicie con la palabra "SECCIÓN" o "SECCION" (case-insensitive).
- Los saltos de línea internos en las celdas de Excel son reemplazados por espacios para mantener el Markdown en una sola línea por ítem.
- Se optimiza la carga en memoria deshabilitando estilos y fórmulas (tal como recomienda la habilidad `lector-excel-pro`).

## Notas
- Mantén siempre las rutas absolutas para prevenir errores con el contexto `__dirname` en el entorno Node.js, a menos que el script defina `process.cwd()` correctamente.
