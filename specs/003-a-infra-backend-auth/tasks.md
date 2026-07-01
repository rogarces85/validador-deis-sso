---
description: "Task list para 003-A Infra Backend y Auth Admin"
---

# Tasks: 003-A Infra Backend y Auth Admin

**Input**: spec.md, plan.md
**Prerequisites**: PR #3 (constitucion v1.2.0) mergeado en main

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede correr en paralelo (distintos archivos, sin dependencias)
- **[Story]**: US1..US5

## Phase 1: Setup

- [ ] T001 [P] Crear estructura de carpetas `api/`, `api/lib/`, `api/middleware/`, `api/controllers/`, `api/models/`, `scripts/`, `src/api/`, `src/admin/`, `src/admin/pages/`
- [ ] T002 [P] Crear `api/.htaccess` que solo permita `index.php` como entrypoint
- [ ] T003 [P] Agregar `api/` y `scripts/test-*.php` a `.gitignore` solo si hay secretos (no, todo va commiteado)

## Phase 2: Foundational

- [ ] T004 Crear `scripts/migrate.php` idempotente con las 5 tablas (usuarios_admin, reglas, reglas_versiones, reglas_audit, audit_log)
- [ ] T005 [P] Crear `api/bootstrap.php` con PDO singleton, sesion segura, headers JSON
- [ ] T006 [P] Crear `api/lib/Response.php` con `ok()`, `fail()`, `error()` helpers
- [ ] T007 [P] Crear `api/lib/Validator.php` con `requiredEmail`, `requiredString`, `minLength`
- [ ] T008 [P] Crear `api/lib/Csrf.php` con `token()`, `verify()`, emitido en `bootstrap`
- [ ] T009 [P] Crear `api/middleware/cors.php` same-origin only
- [ ] T010 [P] Crear `api/middleware/ratelimit.php` con tabla `rate_limit` o archivo plano (decidir: archivo plano `data/rate_limit.json` en BD)
- [ ] T011 [P] Crear `api/middleware/auth.php` con `RequireAuth()` y `RequireCsrf()`
- [ ] T012 Crear `api/index.php` router con dispatch por metodo+path
- [ ] T013 [P] Crear `api/controllers/HealthController.php` con `GET /api/health` (200 siempre que BD responda)

## Phase 3: User Story 1 - Login (P1)

### Tests para US1

- [ ] T014 [P] [US1] Crear `scripts/test-auth.php` con stubs para los 7 escenarios (sin asserts aun, solo estructura)

### Implementation US1

- [ ] T015 [P] [US1] Crear `api/models/UsuarioAdmin.php` con `findByEmail(string $email): ?array`
- [ ] T016 [US1] Crear `api/controllers/AuthController.php` con `login()` (rate limit + verify + set session + csrf + last access)
- [ ] T017 [US1] Registrar ruta `POST /api/auth/login` en `api/index.php`
- [ ] T018 [P] [US1] Crear `src/api/client.ts` (fetch wrapper, baseURL, manejo de 401, CSRF header)
- [ ] T019 [P] [US1] Crear `src/api/auth.ts` con `login`, `logout`, `me`
- [ ] T020 [P] [US1] Crear `src/admin/AdminAuthContext.tsx` con estado `user | null`, persistencia en `sessionStorage`
- [ ] T021 [P] [US1] Crear `src/admin/pages/LoginPage.tsx` con formulario (email, password, submit, errores en espanol)
- [ ] T022 [US1] Crear `src/admin/AdminApp.tsx` con sub-router (BrowserRouter o HashRouter) y rutas `/admin/login` + `/admin` (placeholder)
- [ ] T023 [US1] Integrar `AdminApp` lazy en `App.tsx` con deteccion de path `/admin/*`

**Checkpoint**: login funciona end-to-end con cookie de sesion.

## Phase 4: User Story 2 - Sesion y Me (P1)

- [ ] T024 [P] [US2] Agregar `me()` a `AuthController` (RequireAuth)
- [ ] T025 [US2] Registrar ruta `GET /api/auth/me`
- [ ] T026 [P] [US2] Crear `src/admin/RequireAdmin.tsx` que llama `me()` al montar y expone `isReady`
- [ ] T027 [US2] Envolver rutas admin (futuras) con `RequireAdmin` desde el inicio

**Checkpoint**: `/admin` redirige a login si no hay sesion; con sesion, renderiza placeholder.

## Phase 5: User Story 3 - Logout (P1)

- [ ] T028 [US3] Agregar `logout()` a `AuthController` (RequireAuth + RequireCsrf + session_destroy)
- [ ] T029 [US3] Registrar ruta `POST /api/auth/logout`
- [ ] T030 [P] [US3] Agregar boton "Cerrar sesion" en `AdminApp` (placeholder)
- [ ] T031 [US3] En cliente: tras logout, limpiar `sessionStorage` y redirigir a `/admin/login`

**Checkpoint**: logout invalida sesion y protege rutas.

## Phase 6: User Story 4 - Rate Limit y CSRF (P2)

- [ ] T032 [US4] Implementar `RateLimiter::hit($ip, $route)` con ventana 15 min y limite 5
- [ ] T033 [US4] En `AuthController::login`, aplicar rate limit antes de validar password
- [ ] T034 [US4] Tests: 5 logins fallidos -> 429 en el sexto
- [ ] T035 [US4] Tests: `POST /api/auth/logout` sin CSRF -> 403
- [ ] T036 [US4] Documentar en `docs/MANUAL_ADMIN.md` el comportamiento de rate limit y CSRF

**Checkpoint**: brute force y CSRF mitigados.

## Phase 7: User Story 5 - Seed Admin (P2)

- [ ] T037 [P] [US5] Crear `scripts/seed-admin.php` con readline para email, nombre, password x2
- [ ] T038 [US5] Validar formato email, longitud minima password (>= 8), coincidencia de password
- [ ] T039 [US5] Hashear con `password_hash(PASSWORD_BCRYPT, ['cost' => 12])`
- [ ] T040 [US5] Insertar o actualizar fila en `usuarios_admin`
- [ ] T041 [US5] Agregar a `package.json` script `seed:admin: "php scripts/seed-admin.php"`

**Checkpoint**: el operador puede sembrar el primer admin via CLI.

## Phase 8: Tests y Verificacion

- [ ] T042 [P] Implementar asserts en `scripts/test-auth.php` (7 escenarios)
- [ ] T043 [P] Crear `src/api/client.test.ts` con msw para probar wrapper
- [ ] T044 [P] Crear `src/admin/AdminAuthContext.test.tsx` con renderHook
- [ ] T045 [P] Crear `src/admin/pages/LoginPage.test.tsx` con msw + testing-library
- [ ] T046 Ejecutar `npm test` y ajustar lo que rompa
- [ ] T047 Ejecutar `php scripts/test-auth.php` y ajustar lo que rompa
- [ ] T048 Ejecutar `npm run build` sin warnings criticos
- [ ] T049 Manual: login OK, login fail, rate limit, logout, cerrar navegador

## Phase 9: Polish & Documentacion

- [ ] T050 [P] Crear `docs/MANUAL_ADMIN.md` con guia rapida
- [ ] T051 [P] Actualizar `AGENTS.md` con la nueva arquitectura (api/, src/api/, src/admin/)
- [ ] T052 [P] Actualizar `README.md` con seccion "Panel de administracion" (1 parrafo + link al manual)
- [ ] T053 Commit final con mensaje claro y push
- [ ] T054 Crear PR via `gh pr create` con la plantilla del repo

## Dependencies & Execution Order

- Phase 1 -> Phase 2 -> Phase 3..5 (US1..3) -> Phase 6 (US4) -> Phase 7 (US5) -> Phase 8 -> Phase 9
- US1, US2, US3 estan acopladas; US4 y US5 se pueden hacer en paralelo entre si
- Tests en Phase 8 dependen de todo lo anterior

## Parallel Opportunities

- T001, T002, T003 en Phase 1
- T005..T011 en Phase 2 (todos archivos distintos)
- T015, T018, T019, T020, T021 en Phase 3 (modelo, client, auth API, context, page)
- T043, T044, T045 en Phase 8 (archivos de test distintos)
- T050, T051, T052 en Phase 9 (archivos de doc distintos)

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Phase 1 + 2 (infra)
2. Phase 3 + 4 + 5 (login, sesion, logout)
3. **STOP**: validar login -> /admin -> logout -> /admin/login
4. Luego Phase 6 (rate limit + CSRF)
5. Luego Phase 7 (seed admin)
6. Phase 8 + 9 (tests + docs + PR)

### Incremental Delivery

- 003-A entrega: backend funcional + UI login + admin unico operativo.
- 003-B agregara: CRUD de reglas y publicacion.
- 003-C agregara: auditoria no clinica y estadisticas.
