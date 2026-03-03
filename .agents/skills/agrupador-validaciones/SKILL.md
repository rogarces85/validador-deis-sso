---
name: Agrupador de Validaciones por Establecimiento
description: "Reestructura y agrupa las validaciones de rules.json discriminando por el tipo de establecimiento."
---

# Agrupador de Validaciones por Establecimiento

Esta habilidad se encarga de analizar, clasificar y agrupar las reglas de validación definidas en `data/rules.json`, discriminándolas según el tipo de establecimiento de salud (ej. Hospitales, CESFAM, Postas, SAPU, SAMU, etc.). Dado que existen reglas específicas para ciertos tipos de atención, esta habilidad permite organizar la lógica de exclusión o inclusión.

## Prerrequisitos
- El archivo de reglas base en `data/rules.json`.
- El catálogo de establecimientos en `data/establishments.catalog.json` (para validar códigos y tipos).
- El código que ejecuta las validaciones (usualmente en PHP o JS) donde este nuevo criterio de validación deberá implementarse.

## Instrucciones

Cuando apliques esta habilidad, sigue los siguientes pasos:

### Paso 1 — Análisis de Reglas Existentes
1. Lee el contenido de `data/rules.json` (`view_file`).
2. Identifica dentro de cada hoja ("A01", "A02", etc.) las reglas que actualmente tienen exclusiones por código (`establecimientos_excluidos`) o que en el campo `mensaje` declaran explícitamente a qué centro aplica (ej. "corresponde solo a Postas", "corresponde solo a HBSJO", "excluye SAMU", etc.).

### Paso 2 — Lectura de Tipos de Establecimiento
1. Revisa `data/establishments.catalog.json` para extraer la lista oficial de los "tipos de establecimiento" que maneja el sistema (ej. "Hospital de Baja Complejidad", "Posta de Salud Rural (PSR)", "Centro de Salud Familiar (CESFAM)", etc.).

### Paso 3 — Clasificación y Mapeo
1. Para cada validación en `rules.json`, determina a qué `tipo_establecimiento` o `tipos_establecimiento` aplica.
2. Agrega una nueva clave en cada objeto de regla llamada `aplicar_a_tipo` (un arreglo de Strings con los tipos permitidos) o `excluir_tipo` (un arreglo de Strings con los tipos excluidos).
3. **Mapeo por siglas específicas de hospitales**: Si el `mensaje` contiene siglas específicas de centros hospitalarios, debes asignar explícitamente el código del establecimiento en un arreglo llamado `aplicar_a`:
   - `HBSJO` => `"123100"`
   - `HPU` => `"123101"`
   - `HRN` => `"123102"`
4. Si una regla es transversal y aplica a todos los centros, puedes omitir estas claves o definir un valor explícito como `["TODOS"]`.

### Paso 4 — Reestructuración del JSON
1. Reescribe el archivo `rules.json` añadiendo la semántica de "Tipo de Establecimiento" y "Establecimientos Específicos" (`aplicar_a`) a las validaciones.
2. Agrupa lógicamente para que quede evidente qué grupos de reglas aplican a la Atención Primaria (APS), Urgencias u Hospitalizados.
3. Asegúrate de que los códigos específicos (ej. "123100" para HBSJO) se mantengan en `establecimientos_excluidos` si la regla indica que dicho código no debe ser validado.

### Paso 5 — Refactorización del Motor de Validación (Opcional pero Recomendado)
1. Busca en el código fuente (por ejemplo, en las clases PHP del validador) dónde se procesa `rules.json`.
2. Inserta la lógica que verifique el "tipo_establecimiento" del usuario que subió el archivo contra los nuevos campos `aplicar_a_tipo` o `excluir_tipo`.
3. Inserta la lógica que verifique si el código de establecimiento exacto (`establecimiento_codigo`) está dentro del arreglo `aplicar_a` en caso de existir, lo cual hace restrictiva la regla solo para esos códigos.

## Convenciones
- Utiliza la nomenclatura del catálogo oficial para nombrar los tipos de establecimiento.
- Mantén el JSON bien estructurado y validado.
- Agrega en `mensaje` notas que reflejen la nueva discriminación si es pertinente.

## Casos de Ejemplo
Si una regla solo aplica a SAPU y SUR:
```json
{
    "id": "VAL38",
    "tipo": "CELDA",
    "rem_sheet": "A08",
    "expresion_1": "C61:AL66",
    ...
    "aplicar_a_tipo": ["SAPU", "SUR"]
}
```
Si una regla aplica específicamente al Hospital Base, Purranque y Río Negro:
```json
{
    ...
    "aplicar_a": ["123100", "123101", "123102"]
}
```
Si una regla aplica a todos EXCEPTO SAMU:
```json
{
    ...
    "excluir_tipo": ["SAMU"]
}
```
