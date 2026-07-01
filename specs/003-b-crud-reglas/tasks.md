---
description: "Task list para 003-B CRUD de Reglas y Publicacion"
---

# Tasks: 003-B CRUD de Reglas y Publicacion

**Input**: spec.md, plan.md
**Prerequisites**: 003-A mergeado (constitucion v1.2.0, infra backend y auth admin)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede correr en paralelo
- **[Story]**: US1..US6

## Phase 1: Foundational

- [ ] T001 [P] Crear `api/models/Regla.php` con `list(filtros, page, perPage)`, `findByReglaId`, `create`, `update`, `deactivate`, `activate`, `reglaIdExists`
- [ ] T002 [P] Crear `api/models/ReglaVersion.php` con `list`, `findLatest`, `findByVersion`, `create`, `nextSemver`
- [ ] T003 [P] Crear `api/models/ReglasAudit.php` con `record`, `list`
- [ ] T004 [P] Crear `api/lib/RuleValidator.php` con `validateCreate(array)` y `validateUpdate(array)`, validando tipos, longitudes, enum de severidad y operador, formato de `expresion_1` y conversion de `expresion_2` a JSON canonico
- [ ] T005 [P] Agregar requires en `api/bootstrap.php` para los nuevos modelos/lib

## Phase 2: User Story 1 - Listar (P1)

- [ ] T006 [US1] Crear `ReglasController::list()` con query params `serie`, `rem_sheet`, `severidad`, `q`, `incluir_desactivadas`, `page`, `perPage`. Devuelve `{ok, items, total, page, perPage, totalPages}`
- [ ] T007 [US1] Registrar ruta `GET /api/reglas` en `api/index.php` (RequireAuth)

## Phase 3: User Story 2 y 3 - Crear y Editar (P1)

- [ ] T008 [P] [US2] Crear `ReglasController::create()` (RequireAuth + RequireCsrf). Valida con `RuleValidator::validateCreate`. Verifica `reglaIdExists` para evitar duplicados. Llama `ReglasAudit::record` con accion `CREATE` y `diff_json` con el payload completo en `despues`
- [ ] T009 [P] [US3] Crear `ReglasController::update()` (RequireAuth + RequireCsrf). Carga la regla actual, calcula diff antes/despues, aplica cambios, registra en audit con accion `UPDATE`
- [ ] T010 Registrar rutas `POST /api/reglas` y `PUT /api/reglas/:regla_id` en `api/index.php`

## Phase 4: User Story 4 - Desactivar/Reactivar (P1)

- [ ] T011 [P] [US4] Crear `ReglasController::deactivate()` (RequireAuth + RequireCsrf). Soft-delete con `activo=0`, audit accion `DEACTIVATE`
- [ ] T012 [P] [US4] Crear `ReglasController::activate()` (RequireAuth + RequireCsrf). Setea `activo=1`, audit accion `UPDATE`
- [ ] T013 Registrar rutas `DELETE /api/reglas/:regla_id` y `POST /api/reglas/:regla_id/activar` en `api/index.php`

## Phase 5: User Story 5 - Publicar (P1)

- [ ] T014 [P] [US5] Crear `ReglasController::get()` (RequireAuth). Devuelve una regla por `regla_id`
- [ ] T015 [P] [US5] Crear `ReglasVersionesController::versiones()` (RequireAuth). Lista paginada de `reglas_versiones`
- [ ] T016 [P] [US5] Crear `ReglasVersionesController::publicar()` (RequireAuth + RequireCsrf). Lee reglas activas, genera JSON snapshot, calcula `nextSemver` desde la ultima, crea fila en `reglas_versiones`, audit accion `PUBLISH` (una sola fila resumen)
- [ ] T017 [P] [US5] Crear `ReglasVersionesController::actual()` (PUBLICO, sin auth). Devuelve `{version_semver, total_reglas, publicado_en, payload}` de la ultima version
- [ ] T018 Registrar rutas `GET /api/reglas/:regla_id`, `GET /api/reglas/versiones`, `POST /api/reglas/publicar`, `GET /api/reglas/actual` en `api/index.php`

**Checkpoint**: backend CRUD completo y testeable por HTTP.

## Phase 6: User Story 6 - Import inicial (P1)

- [ ] T019 [P] [US6] Crear `scripts/import-reglas-initial.php` que lee `data/reglas_finales.json`, abre transaccion, limpia tablas (con flag `--reset`), inserta cada regla y crea la primera publicacion `1.0.0-reglas`
- [ ] T020 [P] [US6] Crear `scripts/test-reglas.php` con escenarios: listar, crear, editar, desactivar, publicar, GET /api/reglas/actual publico, import inicial
- [ ] T021 Agregar script a `package.json`: `"import:reglas": "php scripts/import-reglas-initial.php"`, `"test:reglas": "php scripts/test-reglas.php"`

## Phase 7: Cliente TS

- [ ] T022 [P] Crear `src/api/reglas.ts` con tipos `Regla`, `ReglaPayload`, `ReglaVersion` y funciones `list`, `get`, `create`, `update`, `deactivate`, `activate`, `versiones`, `publicar`, `actual`
- [ ] T023 [P] Crear `src/api/reglas.test.ts` con >= 4 tests (CRUD basico contra fetch mockeado)
- [ ] T024 [P] Crear `src/api/versiones.test.ts` con 2 tests (publicar, actual)

## Phase 8: UI - Componentes auxiliares

- [ ] T025 [P] Crear `admin/components/SeveridadPicker.tsx` (chips ERROR/REVISAR/INDICADOR)
- [ ] T026 [P] Crear `admin/components/OperadorPicker.tsx` (selector `==`, `!=`, `>`, `<`, `>=`, `<=`)
- [ ] T027 [P] Crear `admin/components/ExpresionInput.tsx` (textarea con resaltado de celdas A1, rangos A1:A10, SUM(), cross-sheet Hoja!A1)
- [ ] T028 [P] Crear `admin/components/ExpresionPreview.tsx` (parsea la expresion y muestra "Lee celda X de hoja Y" / "Suma rango X:Y" / "Suma multiples rangos")
- [ ] T029 [P] Crear `admin/components/MultiSelectTipos.tsx` (selector multiple de `HOSPITAL`, `CESFAM`, etc. desde `VALID_ESTABLISHMENT_TYPES`)
- [ ] T030 [P] Crear `admin/components/MultiSelectEstablecimientos.tsx` (selector multiple desde `data/establishments.catalog.json`)
- [ ] T031 [P] Crear `admin/components/DiffViewer.tsx` (diff antes/despues con resaltado)

## Phase 9: UI - Paginas

- [ ] T032 [P] Crear `admin/pages/ReglasListPage.tsx` con tabla paginada, filtros arriba (serie, rem_sheet, severidad, q), badges, acciones (editar, duplicar, desactivar, activar)
- [ ] T033 [P] Crear `admin/pages/ReglaEditPage.tsx` con `ReglaForm` (secciones colapsables: Identidad, Expresion, Alcance y flags), validacion en vivo, botones "Guardar borrador" y "Cancelar"
- [ ] T034 [P] Crear `admin/components/ReglaForm.tsx` que orquesta los componentes auxiliares y maneja estado del formulario
- [ ] T035 [P] Crear `admin/pages/PublicarPage.tsx` con `DiffViewer` + textarea para nota de release + boton "Publicar v1.0.X-reglas"
- [ ] T036 [P] Crear `admin/pages/DashboardPage.tsx` con resumen (total reglas activas, ultima publicacion, accesos rapidos)

## Phase 10: Router admin

- [ ] T037 Reescribir `admin/AdminApp.tsx` con sub-router (HashRouter de react-router, agregar dependencia si es necesaria, o router propio) que cubra `/admin/login`, `/admin`, `/admin/reglas`, `/admin/reglas/nueva`, `/admin/reglas/:id`, `/admin/publicar`
- [ ] T038 Actualizar `App.tsx` para integrar el sub-app admin con deteccion de `/admin/*`
- [ ] T039 Agregar layout admin con sidebar (Dashboard, Reglas, Publicar, Cerrar sesion)

## Phase 11: Verificacion final y docs

- [ ] T040 Ejecutar `npm test` y ajustar
- [ ] T041 Ejecutar `php scripts/test-reglas.php` y ajustar
- [ ] T042 Ejecutar `npm run build` y ajustar
- [ ] T043 Manual: login admin, crear regla, editar, desactivar, publicar, ver historial, GET /api/reglas/actual publico
- [ ] T044 Actualizar `docs/MANUAL_ADMIN.md` con seccion "CRUD de reglas" y "Publicacion de versiones"
- [ ] T045 Actualizar `AGENTS.md` y `README.md` con la nueva arquitectura del CRUD
- [ ] T046 Commit final con mensaje claro y push con `git push`
- [ ] T047 Crear PR via `gh pr create` con la plantilla del repo

## Dependencies & Execution Order

- Phase 1 -> Phase 2..5 (US1..5 backend) -> Phase 6 (import + test PHP) -> Phase 7 (cliente TS) -> Phase 8 (componentes) -> Phase 9 (paginas) -> Phase 10 (router) -> Phase 11 (verificacion + docs + PR)

## Parallel Opportunities

- T001..T005 son paralelos (archivos distintos)
- T008, T009 son paralelos (metodos de un mismo controller, mismo archivo, NO paralelos realmente)
- T011, T012 paralelos
- T014, T015, T016, T017 paralelos
- T019, T020, T021 paralelos
- T022, T023, T024 paralelos
- T025..T031 (componentes UI) todos paralelos
- T032, T033, T035, T036 (paginas) paralelos
- T044, T045 (docs) paralelos

## Implementation Strategy

### MVP First (US1 + US2 + US6)

1. Phase 1 + 2 + 3 + 6: backend CRUD + import + test PHP
2. **STOP**: validar listar/crear/editar/import via scripts/test-reglas.php
3. Phase 7 + 8 + 9 + 10: UI completa
4. Phase 5 + 11: publicacion + docs + PR
