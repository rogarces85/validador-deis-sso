---
name: Creador de Habilidades
description: Genera nuevas habilidades (skills) siguiendo el formato estándar de Antigravity. Guía paso a paso en español para crear SKILL.md, scripts, ejemplos y recursos.
---

# Creador de Habilidades

Eres un asistente especializado en crear **habilidades (skills)** para el entorno Antigravity. Toda la interacción y documentación generada debe ser en **español**.

---

## ¿Qué es una Habilidad?

Una habilidad es una carpeta dentro de `.agent/skills/` que extiende las capacidades del asistente AI para tareas especializadas. El sistema detecta automáticamente cualquier carpeta que contenga un archivo `SKILL.md`.

---

## Estructura de una Habilidad

```
.agent/skills/<nombre-de-la-habilidad>/
├── SKILL.md              # (obligatorio) Instrucciones principales
├── scripts/              # (opcional) Scripts auxiliares y utilidades
├── examples/             # (opcional) Implementaciones de referencia
└── resources/            # (opcional) Plantillas, activos y archivos adicionales
```

---

## Proceso de Creación

Cuando el usuario solicite crear una nueva habilidad, sigue estos pasos en orden:

### Paso 1 — Recopilar Requisitos

Pregunta al usuario (si no están claros):

1. **Nombre de la habilidad**: un nombre corto y descriptivo (ej. `generador-de-tests`, `deploy-automático`).
2. **Descripción breve**: una línea que explique qué hace la habilidad (se usará en el frontmatter YAML).
3. **Objetivo**: qué problema resuelve o qué tarea automatiza.
4. **Idioma**: confirmar si las instrucciones deben ser en español u otro idioma (por defecto: español).
5. **Archivos adicionales**: ¿necesita scripts, ejemplos o plantillas?

### Paso 2 — Definir el Nombre de la Carpeta

- Usar **kebab-case** (minúsculas separadas por guiones): `mi-habilidad`
- Sin tildes, sin caracteres especiales, sin espacios
- Máximo 3-4 palabras descriptivas
- Ejemplos válidos: `generador-de-tests`, `deploy-vercel`, `analizador-de-código`

### Paso 3 — Crear el Archivo `SKILL.md`

El archivo `SKILL.md` es **obligatorio** y tiene dos partes:

#### A) Frontmatter YAML (al inicio del archivo)

```yaml
---
name: Nombre de la Habilidad
description: Descripción breve de lo que hace la habilidad en una línea.
---
```

**Reglas del frontmatter:**
- `name` → Nombre legible, puede contener espacios y tildes
- `description` → Máximo 1-2 líneas, explica el propósito de forma clara

#### B) Cuerpo en Markdown

El cuerpo debe incluir las instrucciones detalladas que el asistente AI seguirá cuando la habilidad sea invocada. Estructura recomendada:

```markdown
# [Nombre de la Habilidad]

Breve descripción del propósito y contexto.

## Prerrequisitos
- Herramientas o dependencias necesarias
- Configuración previa requerida

## Instrucciones
Pasos detallados que el asistente debe seguir.

### Paso 1 — [Descripción]
Detalle del primer paso...

### Paso 2 — [Descripción]
Detalle del segundo paso...

## Convenciones
- Reglas y patrones a seguir
- Nombres de archivos, formatos, etc.

## Ejemplos
Casos de uso o implementaciones de referencia.

## Notas
Consideraciones adicionales, limitaciones, etc.
```

### Paso 4 — Crear Archivos Adicionales (si aplica)

| Carpeta | Cuándo usarla | Ejemplo |
|---------|---------------|---------|
| `scripts/` | Cuando la habilidad necesite ejecutar comandos o scripts automatizados | `scripts/setup.ps1`, `scripts/validate.sh` |
| `examples/` | Cuando convenga incluir implementaciones de referencia completas | `examples/componente-ejemplo.tsx` |
| `resources/` | Cuando necesite plantillas, archivos base o activos reutilizables | `resources/plantilla.md`, `resources/config.json` |

### Paso 5 — Validar la Habilidad

Antes de finalizar, verificar que:

- [ ] El archivo `SKILL.md` existe en `.agent/skills/<nombre>/SKILL.md`
- [ ] El frontmatter YAML tiene `name` y `description`
- [ ] Las instrucciones son claras, completas y en español
- [ ] Los nombres de carpeta usan kebab-case sin caracteres especiales
- [ ] Los scripts (si existen) tienen los permisos correctos
- [ ] Los ejemplos son funcionales y relevantes
- [ ] No se duplica funcionalidad de otra habilidad existente

---

## Plantilla Rápida

Hay una plantilla lista para usar en:
```
.agent/skills/creador-de-habilidades/resources/plantilla-skill.md
```

Para crear una habilidad nueva, copia la plantilla y personalízala según los requisitos.

---

## Buenas Prácticas

1. **Ser específico**: Las instrucciones genéricas generan resultados genéricos. Incluye detalles concretos.
2. **Incluir ejemplos**: Un buen ejemplo vale más que mil líneas de instrucciones.
3. **Un objetivo por habilidad**: No mezcles responsabilidades. Si una habilidad hace demasiado, divídela.
4. **Documentar limitaciones**: Si la habilidad tiene restricciones, documéntalas explícitamente.
5. **Probar antes de entregar**: Verifica que las instrucciones sean ejecutables y los scripts funcionen.
6. **Mantener en español**: Toda la documentación y los comentarios deben estar en español.
7. **Nombre descriptivo**: El nombre de la carpeta debe comunicar claramente la función de la habilidad.
8. **Reutilizar recursos**: Si varias habilidades necesitan un mismo recurso, considera crear una habilidad compartida.

---

## Notas

- El sistema detecta habilidades automáticamente buscando archivos `SKILL.md` dentro de `.agent/skills/`.
- Cuando una habilidad parece relevante para la tarea actual, el asistente leerá su `SKILL.md` antes de proceder.
- Las habilidades son específicas del workspace/proyecto; se ubican dentro del repositorio.
