---
name: Sincronizador de Reglas
description: Skill heredada de una arquitectura anterior. Revisar antes de usar.
---

# Sincronizador de Reglas

Esta habilidad pertenece a una arquitectura anterior donde las reglas se distribuian en multiples archivos por establecimiento. Actualmente, la fuente de verdad del sistema es `data/reglas_finales.json` y no debe generarse una distribucion paralela salvo instruccion explicita del usuario.

## Estado actual
- Archivo origen de reglas: `data/reglas_finales.json`
- Los archivos derivados por establecimiento ya no forman parte del flujo normal.
- Antes de usar esta skill, confirmar con el usuario que desea reinstalar una arquitectura derivada.

## Instrucciones

Cuando el usuario pida expresamente reconstruir archivos derivados por establecimiento, sigue estos pasos:

### Paso 1 — Lectura de Cambios
1. Analiza el contenido de `data/reglas_finales.json`.
2. Identifica las reglas que han sido agregadas, modificadas o eliminadas recientemente.

### Paso 2 — Aplicación de la Habilidad Agrupador
1. Lee y aplica mentalmente las instrucciones de la habilidad **Agrupador de Validaciones por Establecimiento** (`.agents/skills/agrupador-validaciones/SKILL.md`).
2. Para cada regla de `reglas_finales.json`, evalúa a qué tipo de establecimiento corresponde utilizando su estructura de `establecimientos_excluidos`, `mensaje` y cruza esto con el catálogo `establishments.catalog.json`.
3. Etiqueta cada regla determinando si pertenece a hospitales, postas, SAMU, o si es una regla transversal.

### Paso 3 — Confirmacion previa
1. Advierte al usuario que el sistema actual no necesita archivos derivados para operar.
2. Solo continua si el usuario confirma que desea recrearlos por motivos de auditoria, compatibilidad o exportacion.

### Paso 4 — Resultado
1. Si no hubo confirmacion explicita, no escribas archivos derivados.
2. Si hubo confirmacion, documenta claramente que se trata de una salida secundaria y que `data/reglas_finales.json` sigue siendo la fuente de verdad.

## Notas y Convenciones
- No cambies la regla fuente en `data/reglas_finales.json` durante una exportacion derivada salvo que el usuario lo pida.
- Siempre deja constancia de que los archivos derivados son secundarios y potencialmente obsoletos.
