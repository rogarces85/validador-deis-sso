# Tasks: Incorporacion Serie P

**Input**: Design documents from `specs/001-serie-p-validacion/`

**Prerequisites**: `plan.md`, `spec.md`, `.specify/memory/constitution.md`

**Tests**: Requeridos por la especificacion y por la constitucion para validadores, motor de reglas y regresion Serie A.

**Organization**: Las tareas se agrupan por historia de usuario para permitir implementacion y prueba incremental.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo si no toca el mismo archivo.
- **[Story]**: Historia de usuario asociada.
- Cada tarea incluye rutas exactas del repositorio.

## Phase 1: Setup y Gobernanza

**Purpose**: Dejar el alcance Serie P aprobado y trazable antes de implementar codigo.

- [x] T001 [P] Crear feature Spec Kit en `specs/001-serie-p-validacion/spec.md`.
- [x] T002 [P] Crear plan tecnico en `specs/001-serie-p-validacion/plan.md`.
- [x] T003 [P] Crear checklist de requisitos en `specs/001-serie-p-validacion/checklists/requirements.md`.
- [x] T004 Actualizar `.specify/feature.json` con la feature activa.
- [x] T005 Actualizar `.specify/memory/constitution.md` para habilitar Series A y P.
- [x] T006 Actualizar `AGENTS.md` con referencia al plan activo.

---

## Phase 2: Foundational (Bloqueante)

**Purpose**: Preparar constantes, validadores base y pruebas que bloquean todas las historias.

**CRITICAL**: Ninguna importacion masiva de reglas P debe hacerse antes de que el motor soporte sus expresiones.

- [x] T007 [P] Definir constantes de series habilitadas, meses por serie y hojas obligatorias P en `services/filenameValidator.ts` o un helper compartido minimo.
- [x] T008 [P] Agregar pruebas de nombre de archivo para Serie A, Serie P y series no realizadas en `services/filenameValidator.test.ts`.
- [x] T009 [P] Agregar pruebas de hoja NOMBRE para meses permitidos por serie en `services/nombreSheetValidator.test.ts`.
- [x] T010 [P] Agregar pruebas de hojas obligatorias Serie P en `hooks/useValidationPipeline.test.ts` o en un helper testeable si se extrae.
- [x] T011 [P] Agregar pruebas del motor para resta, multiplicacion, parentesis y `SUM(...)` combinado en `services/ruleEngine.test.ts`.

**Checkpoint**: Pruebas esperadas listas para fallar antes de implementar cambios funcionales.

---

## Phase 3: User Story 1 - Validar Archivo Serie P Semestral (Priority: P1)

**Goal**: Aceptar `123010P06.xlsm` y `123010P12.xlsm` con establecimiento valido, NOMBRE coherente y reglas P disponibles.

**Independent Test**: Validar nombre de archivo Serie P con meses `06` y `12`, y rechazar otros meses.

### Tests

- [x] T012 [P] [US1] Verificar que `123010P06.xlsm` y `123010P12.xlsm` sean validos en `services/filenameValidator.test.ts`.
- [x] T013 [P] [US1] Verificar que `123010P05.xlsm` sea invalido en `services/filenameValidator.test.ts`.
- [x] T014 [P] [US1] Verificar que hoja NOMBRE Serie P acepte solo `06` y `12` en `services/nombreSheetValidator.test.ts`.

### Implementation

- [x] T015 [US1] Cambiar `services/filenameValidator.ts` para permitir Serie P y restringir sus meses a `06` y `12`.
- [x] T016 [US1] Cambiar `services/nombreSheetValidator.ts` para recibir `serieRem` y validar meses segun serie.
- [x] T017 [US1] Cambiar `hooks/useValidationPipeline.ts` para pasar `serieRem` al validador NOMBRE.

**Checkpoint**: Serie P valida por nombre y NOMBRE para meses semestrales.

---

## Phase 4: User Story 2 - Bloquear Archivos Serie P Incompletos (Priority: P1)

**Goal**: Rechazar Serie P si faltan hojas obligatorias, incluyendo `P9` y `P13` aunque no tengan reglas.

**Independent Test**: Simular workbook Serie P sin `P9` o sin `P13`; debe bloquearse antes de reglas.

### Tests

- [x] T018 [P] [US2] Probar deteccion de hojas faltantes para Serie P en `hooks/useValidationPipeline.test.ts` o helper equivalente.
- [x] T019 [P] [US2] Probar que `P9` y `P13` presentes sin reglas no bloqueen por si mismas.

### Implementation

- [x] T020 [US2] Crear helper minimo para validar hojas obligatorias Serie P en `hooks/useValidationPipeline.ts` o `services/workbookStructureValidator.ts`.
- [x] T021 [US2] Integrar el bloqueo antes de ejecutar reglas en `hooks/useValidationPipeline.ts`.
- [x] T022 [US2] Redactar mensaje en espanol que liste hojas faltantes.

**Checkpoint**: El sistema no ejecuta reglas si falta cualquier hoja obligatoria Serie P.

---

## Phase 5: User Story 3 - Mantener Serie A Sin Regresiones (Priority: P1)

**Goal**: Serie A mantiene meses `01` a `12` y flujo actual.

**Independent Test**: Validar archivos A con meses extremos y confirmar que no se exige estructura P.

### Tests

- [x] T023 [P] [US3] Probar que `123010A01.xlsm` y `123010A12.xlsm` sigan siendo validos en `services/filenameValidator.test.ts`.
- [x] T024 [P] [US3] Probar que Serie A no exige hojas P en el pipeline.

### Implementation

- [x] T025 [US3] Asegurar que validacion de hojas obligatorias solo aplique a `metadata.serieRem === 'P'` en `hooks/useValidationPipeline.ts`.
- [x] T026 [US3] Revisar filtro de reglas por prefijo en `hooks/useValidationPipeline.ts` para mantener `A` y habilitar `P`.

**Checkpoint**: Serie A no cambia su comportamiento operativo.

---

## Phase 6: User Story 4 - Bloquear Series No Realizadas (Priority: P2)

**Goal**: Bloquear `D`, `BM`, `BS` y cualquier serie no habilitada con mensaje claro.

**Independent Test**: Cargar nombres Serie D/BM/BS y confirmar bloqueo antes de leer reglas.

### Tests

- [x] T027 [P] [US4] Probar bloqueo de `123010D06.xlsm`, `123010BM06.xlsm` y `123010BS06.xlsm` en `services/filenameValidator.test.ts`.

### Implementation

- [x] T028 [US4] Ajustar mensajes de `services/filenameValidator.ts` para indicar que solo Series A y P estan disponibles.
- [ ] T029 [US4] Actualizar texto visible de series aceptadas en `components/FileDropzone.tsx`.

**Checkpoint**: Series no realizadas no entran al flujo.

---

## Phase 7: Motor de Expresiones Serie P

**Goal**: Soportar las expresiones detectadas en `Reestructuracion_Expandido.xlsx`.

**Independent Test**: Evaluar expresiones `C12+(F12-G12)`, `SUM(H17:U17)+SUM(V22:AG22)-C38` y `B61*C61`.

### Tests

- [x] T030 [P] Agregar casos de resta, multiplicacion y parentesis en `services/ruleEngine.test.ts`.
- [x] T031 [P] Agregar caso combinado con `SUM(...)` y resta en `services/ruleEngine.test.ts`.

### Implementation

- [x] T032 Cambiar `services/ruleEngine.ts` para resolver aritmetica segura sin ejecutar codigo dinamico.
- [x] T033 Confirmar que valores nulos o vacios sigan tratandose como `0` para denominador y expresiones sin datos.

**Checkpoint**: El motor puede evaluar reglas P antes de importarlas masivamente.

---

## Phase 8: Importacion de Reglas Serie P

**Goal**: Convertir reglas P desde Excel a `data/reglas_finales.json`.

**Independent Test**: Confirmar claves P y conteo esperado de reglas importadas.

### Tests

- [x] T034 [P] Crear verificacion JSON de claves `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P9`, `P11`, `P12`, `P13`.
- [x] T035 [P] Verificar que `P9` y `P13` existan como arrays vacios.

### Implementation

- [x] T036 Importar reglas P desde `Reestructuracion_Expandido.xlsx` hacia `data/reglas_finales.json`.
- [x] T037 Normalizar IDs como `P01-VAL001`, `P02-VAL001`, etc.
- [x] T038 Redactar mensajes de reglas P en espanol con hoja, seccion, celdas y condicion.
- [x] T039 Actualizar `data/reglas_validacion.md` si se documenta soporte nuevo de expresiones.

**Checkpoint**: Reglas P viven en la unica fuente de verdad.

---

## Phase 9: User Story 5 - Documentar Operacion Serie P (Priority: P3)

**Goal**: Manual y UI explican Serie P semestral, hojas obligatorias y series disponibles.

**Independent Test**: Leer manual y confirmar ejemplos `123010P06.xlsm` y `123010P12.xlsm`.

### Implementation

- [x] T040 [P] Actualizar `components/UserManual.tsx` con Serie P, meses y hojas obligatorias.
- [x] T041 [P] Actualizar `docs/Manual_Usuario.md` con Serie P y nota `P9`/`P13`.
- [x] T042 [P] Actualizar `components/FileDropzone.tsx` con ejemplos y series habilitadas.

**Checkpoint**: Documentacion operativa lista.

---

## Phase 10: Issues, PR y Verificacion Final

**Goal**: Dejar evidencia, issues y PR cuando el entorno GitHub lo permita.

- [ ] T043 Crear issues desde `specs/001-serie-p-validacion/github-issues.md` cuando `gh` este disponible o desde GitHub web. Bloqueado en este entorno: `gh` no esta instalado.
- [x] T044 Ejecutar `npm run test`. Evidencia: 7 archivos, 30 tests OK.
- [x] T045 Ejecutar `npm run build`. Evidencia: build Vite OK; warnings no bloqueantes de chunk/import existentes.
- [x] T046 Revisar `git diff` para confirmar que solo se incluyen cambios intencionales.
- [ ] T047 Crear Pull Request vinculando issues y evidencia de pruebas. Bloqueado en este entorno: `gh` no esta instalado; rama preparada para push/PR.

---

## Dependencies & Execution Order

- Phase 1 completa antes de cualquier implementacion.
- Phase 2 bloquea todas las historias porque define pruebas y alcance compartido.
- Phases 3, 4 y 5 son P1 y deben completarse antes de documentar como funcional.
- Phase 7 debe completarse antes de Phase 8 para evitar importar reglas que el motor no puede evaluar.
- Phase 10 se ejecuta al cierre, cuando pruebas y build pasen.

## Implementation Strategy

1. Completar validacion de serie/mes y hojas obligatorias.
2. Proteger regresion Serie A.
3. Ampliar motor de expresiones.
4. Importar reglas P.
5. Actualizar manual/UI.
6. Ejecutar pruebas/build y crear PR.
