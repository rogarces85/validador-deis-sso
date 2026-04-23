---
name: Sincronizador de Reglas
description: Sincroniza los cambios de reglas_finales.json hacia los archivos por establecimiento usando la skill agrupador-validaciones.
---

# Sincronizador de Reglas

Esta habilidad instruye al agente para que revise las modificaciones realizadas en el archivo principal `data/reglas_finales.json` y distribuya automáticamente estas reglas en los archivos específicos correspondientes (`base.json`, `hospital.json`, `posta.json`, `samu.json`), utilizando la lógica de la habilidad **Agrupador de Validaciones por Establecimiento**.

## Prerrequisitos
- Archivo origen de reglas: `data/reglas_finales.json`
- Archivos destino: 
  - `data/rules/base.json`
  - `data/rules/hospital.json`
  - `data/rules/posta.json`
  - `data/rules/samu.json`
- Habilidad compañera: `agrupador-validaciones`

## Instrucciones

Cuando el usuario indique que ha hecho cambios en `reglas_finales.json` o pida ejecutar la sincronización de reglas, sigue estos pasos:

### Paso 1 — Lectura de Cambios
1. Analiza el contenido de `data/reglas_finales.json`.
2. Identifica las reglas que han sido agregadas, modificadas o eliminadas recientemente.

### Paso 2 — Aplicación de la Habilidad Agrupador
1. Lee y aplica mentalmente las instrucciones de la habilidad **Agrupador de Validaciones por Establecimiento** (`.agents/skills/agrupador-validaciones/SKILL.md`).
2. Para cada regla de `reglas_finales.json`, evalúa a qué tipo de establecimiento corresponde utilizando su estructura de `establecimientos_excluidos`, `mensaje` y cruza esto con el catálogo `establishments.catalog.json`.
3. Etiqueta cada regla determinando si pertenece a hospitales, postas, SAMU, o si es una regla transversal.

### Paso 3 — Distribución en Archivos Específicos
Sobrescribe o actualiza los archivos destino según esta lógica de distribución:
1. **`data/rules/base.json`**: Guarda aquí las reglas que son transversales (aplican a la mayoría o todos los establecimientos) y mantén sus exclusiones originales si aplican (ej. excluye SAMU).
2. **`data/rules/hospital.json`**: Guarda aquí las reglas que aplican de forma exclusiva a centros de tipo Hospital.
3. **`data/rules/posta.json`**: Guarda aquí las reglas exclusivas para Postas (PSR) u otros centros de atención primaria rural similares.
4. **`data/rules/samu.json`**: Guarda aquí las reglas exclusivas para el Servicio de Atención Médico de Urgencias (SAMU).

### Paso 4 — Refactorización y Escritura
1. Usa las herramientas de modificación de archivos (`write_to_file` o `multi_replace_file_content`) para plasmar los cambios en los 4 archivos mencionados.
2. Al finalizar, entrega al usuario un breve reporte (resumen) de cuántas reglas se actualizaron/movieron y a qué archivo destino fueron a parar.

## Notas y Convenciones
- **Preferencia por base.json**: Si una regla aplica a múltiples tipos (ej. Hospitales y Postas, pero no SAMU), la convención es ponerla en `base.json` y usar `establecimientos_excluidos` para excluir a SAMU. 
- Los archivos de destino dentro de `data/rules/` deben seguir un formato JSON válido que consiste en un arreglo bidimensional o un objeto/arreglo dependiendo de la arquitectura esperada (respeta el esquema actual de esos archivos).
- Siempre verifica que ninguna regla se pierda en la transferencia.
