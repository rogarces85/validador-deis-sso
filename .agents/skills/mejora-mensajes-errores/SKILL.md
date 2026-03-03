---
name: Mejora Mensajes Errores
description: Enriquece automáticamente los mensajes de error en los archivos de reglas (rules.json) combinando la información leída del documento de secciones (secciones.md) y explicando la operación lógica de la validación.
---

# Mejora Mensajes Errores

Esta habilidad permite enriquecer los mensajes de error generados por el Validador DEIS SSO. Utiliza un script de Node.js para cruzar la expresión lógica contenida en cada regla de validación (por ejemplo, en `base.json`) con las secciones estructuradas extraídas en `secciones.md`. 

Con este cruce, compone un nuevo mensaje de error con un formato unificado y altamente descriptivo para el usuario final.

## Prerrequisitos
- El sistema debe tener Node.js instalado.
- Se requiere que el archivo `secciones.md` haya sido generado o se encuentre debidamente estructurado indicando el número de fila (ej. `- 📋 **Fila 8**: SECCIÓN A...`). Se recomienda haber usado la habilidad **Lector de Secciones Excel (exce-seccion)** previamente.
- El archivo de reglas JSON (ej. `base.json`, `rules.json`, etc.) debe seguir el esquema donde cada regla contiene los campos `rem_sheet`, `expresion_1`, `expresion_2`, `operador` y `mensaje`.

## Instrucciones

Cuando el usuario requiera mejorar los mensajes de de errores en un archivo de validación JSON, ejecuta el script de esta habilidad indicando la ruta del archivo de reglas, la ruta del archivo `secciones.md` y la ruta en donde debe guardarse el nuevo archivo.

### Paso 1 — Ejecutar el Script de Mejora

Puedes ejecutar el script por línea de comandos, proporcionando tres argumentos posicionales:

```bash
node .agents/skills/mejora-mensajes-errores/scripts/improve_messages.cjs <ruta_json_entrada> <ruta_md_secciones> <ruta_json_salida>
```

**Ejemplo de uso:**
```bash
node .agents/skills/mejora-mensajes-errores/scripts/improve_messages.cjs "data/rules/base.json" "data/secciones.md" "data/Rules_nuevas.json"
```

### Paso 2 — Validar los Resultados
El script construirá los mensajes usando el siguiente formato:
`REM [Hoja] | [Sección] | [lista de celdas]. La expresión indica que [exp1] [op] [exp2].`

Una vez finalizado, puedes probar el nuevo archivo JSON directamente referenciándolo o reemplazándolo por el principal. **NOTA:** El script guarda el mensaje anterior en la propiedad `mensaje_original` del objeto JSON, para evitar pérdida de contexto.

## Convenciones
- El mapeo asume que dentro de una hoja REM, la sección se identifica por la fila asignada a su encabezado principal que es menor o igual a la primera celda referenciada en la expresión de validación.
- Los operadores traducidos incluyen `==` ('debe ser igual a'), `!=` ('debe ser distinto de'), `<=` ('debe ser menor o igual a'), `>=` ('debe ser mayor o igual a'),`0` (´la celda no debe contener datos´), etc.
