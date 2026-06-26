# Implementation Plan: Incorporacion Serie P

**Branch**: `001-serie-p-validacion` | **Date**: 2026-06-26 | **Spec**: `specs/001-serie-p-validacion/spec.md`

**Input**: Feature specification from `specs/001-serie-p-validacion/spec.md`

## Summary

Habilitar la Serie P como segunda serie validable del sistema, manteniendo Serie A sin regresiones. La implementacion incorpora reglas desde `Reestructuracion_Expandido.xlsx`, restringe Serie P a meses semestrales `06` y `12`, exige hojas obligatorias incluyendo `P9` y `P13`, bloquea otras series no realizadas y actualiza documentacion/manual.

## Technical Context

**Language/Version**: TypeScript con React 19 y Vite.

**Primary Dependencies**: React, Vite, SheetJS (`xlsx`/`xlsx-js-style`), Vitest.

**Storage**: Archivos versionados del repositorio; sin backend, API, base de datos ni persistencia historica.

**Testing**: Vitest para validadores, motor de reglas y regresion Serie A; `npm run build` obligatorio.

**Target Platform**: Navegador, SPA servida localmente desde XAMPP/Vite.

**Project Type**: Aplicacion web frontend local.

**Performance Goals**: Mantener lectura y validacion local sin degradacion perceptible para archivos REM Serie A o P.

**Constraints**: Procesamiento local, mensajes en espanol, `data/reglas_finales.json` como unica fuente de verdad, sin modificar reglas desde archivos derivados.

**Scale/Scope**: Habilitar Serie P inicial con reglas disponibles para `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P11`, `P12`; crear `P9` y `P13` vacias pero obligatorias.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Local-only privacy: Pasa. La feature no agrega backend, API, subida externa, base de datos ni persistencia historica.
- REM validation scope: Impacta nombre de archivo, metadata, hoja NOMBRE, reglas JSON, motor de reglas, mensajes, UI y manual. No cambia el catalogo de establecimientos.
- Traceability: Pasa si cada regla P importada conserva ID, hoja, expresiones, operador, severidad, mensaje y valores comparados.
- Quality gates: Requiere pruebas Vitest para nombre de archivo, hoja NOMBRE, hojas obligatorias P, motor de expresiones y regresion A. `npm run build` obligatorio.
- Spanish language: Pasa si todos los mensajes nuevos, manual y UI quedan en espanol.

**Constitution Amendment Required**: Si. La constitucion actual declara que Serie A es la unica habilitada mientras no se apruebe ampliacion. Esta feature debe actualizarla para declarar Series A y P habilitadas, con P semestral (`06`, `12`) y otras series bloqueadas.

## Project Structure

### Documentation (this feature)

```text
specs/001-serie-p-validacion/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
data/
├── reglas_finales.json
└── reglas_validacion.md

services/
├── filenameValidator.ts
├── nombreSheetValidator.ts
├── ruleEngine.ts
└── ruleEngine.test.ts

hooks/
└── useValidationPipeline.ts

components/
├── FileDropzone.tsx
└── UserManual.tsx

docs/
└── Manual_Usuario.md

tests/
└── integration.test.ts
```

**Structure Decision**: Mantener la arquitectura actual. No crear servicios remotos ni fuentes paralelas de reglas. Centralizar reglas en `data/reglas_finales.json` y encapsular validaciones de serie/mes/hojas en servicios existentes o helpers pequeños.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Ampliar alcance constitucional de Serie A a Series A y P | Serie P queda operativa y deja de estar en construccion | Mantener Serie P bloqueada impediria cumplir el objetivo del usuario |

## Implementation Stages

### Etapa 1 - Planificacion Spec Kit

**Objetivo**: Crear documentos de alcance y plan tecnico.

**Entregables**: `spec.md`, `plan.md`, checklist de requisitos y feature activa.

**Estado**: En curso.

### Etapa 2 - Enmienda Constitucional y Tareas

**Objetivo**: Actualizar constitucion para habilitar Serie P y generar `tasks.md` detallado.

**Entregables**: `.specify/memory/constitution.md`, `tasks.md`, opcionalmente issues GitHub.

**Estado**: Completada en planificacion. Issues preparados en `github-issues.md`; creacion real pendiente porque `gh` no esta disponible en el entorno.

### Etapa 3 - Infraestructura de Serie/Mes/Hojas

**Objetivo**: Habilitar Serie P en nombre de archivo, hoja NOMBRE y hojas obligatorias.

**Entregables**: Cambios en `filenameValidator`, `nombreSheetValidator`, pipeline y pruebas.

**Estado**: Completada. Se agrego `services/remSeriesConfig.ts`, pruebas enfocadas y bloqueo por hojas obligatorias Serie P antes de ejecutar reglas.

### Etapa 4 - Motor de Expresiones

**Objetivo**: Soportar expresiones necesarias para reglas P.

**Entregables**: `ruleEngine.ts` actualizado y pruebas para suma, resta, multiplicacion, parentesis y `SUM` combinado.

**Estado**: Pendiente.

### Etapa 5 - Importacion de Reglas P

**Objetivo**: Convertir validaciones P desde `Reestructuracion_Expandido.xlsx` a `data/reglas_finales.json`.

**Entregables**: Reglas para P disponibles, `P9: []`, `P13: []`, estructura validada.

**Estado**: Pendiente.

### Etapa 6 - Manual, UI y Mensajes

**Objetivo**: Documentar Serie P y actualizar textos visibles.

**Entregables**: `components/UserManual.tsx`, `components/FileDropzone.tsx`, `docs/Manual_Usuario.md`.

**Estado**: Pendiente.

### Etapa 7 - Verificacion, Issues y Pull Request

**Objetivo**: Ejecutar pruebas/build, crear issues si hay remoto GitHub disponible y abrir PR.

**Entregables**: Evidencia de `npm run test`, `npm run build`, issues, PR.

**Estado**: Pendiente.

## Risk Register

| Riesgo | Impacto | Mitigacion |
|---|---:|---|
| Reglas P contienen expresiones no soportadas por el motor actual | Alto | Ampliar y probar `resolveExpression` antes de importar reglas |
| `P9` y `P13` sin reglas pueden interpretarse como no requeridas | Alto | Validarlas como hojas obligatorias independientes de reglas JSON |
| Regresion en Serie A | Alto | Pruebas de nombre, mes y pipeline Serie A |
| Diferencias de nombres de hojas (`P09` vs `P9`) | Medio | Exigir nombres exactos segun alcance actual y documentarlo |
| Mensajes tecnicos poco claros | Medio | Redactar mensajes operativos en espanol con hojas faltantes y causa |

## Verification Plan

- Ejecutar pruebas unitarias nuevas y existentes con `npm run test`.
- Ejecutar build con `npm run build`.
- Validar manualmente casos de nombre: `123010A01.xlsm`, `123010P06.xlsm`, `123010P12.xlsm`, `123010P05.xlsm`, `123010D06.xlsm`.
- Validar manualmente caso Serie P sin `P9` y sin `P13`.
- Confirmar que `data/reglas_finales.json` contiene claves P requeridas y JSON valido.
