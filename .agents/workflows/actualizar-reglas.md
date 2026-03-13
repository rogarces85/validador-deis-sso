---
description: Ejecuta secuencialmente los skills de actualización de reglas y mensajes del validador REM.
---

# Workflow: Actualizar Reglas

Este workflow encadena los skills relacionados con la actualización, refactorización y distribución de reglas de validación en `Rules_nuevas.json`.

## Pasos

### Paso 1 — Importar Secciones
Actualiza los nombres de las secciones en `Rules_nuevas.json` tomando como fuente de verdad `data/secciones.md`.

// turbo
```bash
node scripts/import_sections.cjs
```

---

### Paso 2 — Refactorizar Mensajes
Humaniza los mensajes de error usando glosas del Excel y lógica inversa.
Aplica formato dual y separadores `|`.

// turbo
```bash
node .agents/skills/refactorizador-mensajes/scripts/refactor_messages.cjs
```

---

### Paso 3 — Organizar reglas
Ordena las reglas por sección e ID.

// turbo
```bash
node scripts/organize_rules.cjs
```

---

### Paso 4 — Sincronizar Reglas por Establecimiento
Distribuye las reglas de `Rules_nuevas.json` hacia los archivos específicos por establecimiento.

> **Manual**: Ejecutar skill `sincronizador-reglas`.

---

### Paso 5 — Sincronizar Mensajes
Replica los mensajes actualizados en los archivos por establecimiento.

// turbo
```bash
node .agents/skills/sincronizador-mensajes/scripts/sync_messages.cjs
```

---

### Paso 6 — Verificación de Integridad
Ejecuta la simulación.

// turbo
```bash
node scripts/test_rules_simulator.cjs
```
