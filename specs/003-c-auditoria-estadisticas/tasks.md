---
description: "Task list para 003-C Auditoria No Clinica y Estadisticas"
---

# Tasks: 003-C Auditoria No Clinica y Estadisticas

**Input**: spec.md, plan.md
**Prerequisites**: 003-A (infra) y 003-B (CRUD reglas) mergeados

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede correr en paralelo
- **[Story]**: US1..US4

## Phase 1: Foundational

- [ ] T001 [P] Crear `api/models/AuditLog.php` con `create(array, string $ip, string $ua)`, `list(filtros, page, perPage)`, `stats(filtros)`, `countByIP(ip, windowSec)`, `pruneOld(days)`
- [ ] T002 [P] Crear `api/lib/AuditQueueValidator.php` con `validate(array)` aplicando lista blanca estricta de campos y conversion de tipos
- [ ] T003 [P] Crear `api/controllers/AuditController.php` con `create` (publico, rate limit 1000/h), `list` (admin, pag+filtros), `stats` (admin)
- [ ] T004 Registrar rutas en `api/index.php`: `POST /api/audit` (publico), `GET /api/audit` (admin), `GET /api/audit/estadisticas` (admin)
- [ ] T005 [P] Agregar requires en `api/bootstrap.php`

## Phase 2: User Story 1 - POST /api/audit (P1)

- [ ] T006 [US1] Validar lista blanca de campos en `AuditQueueValidator` y rechazar campos prohibidos con 400 + mensaje claro
- [ ] T007 [US1] Implementar `RateLimiter::hit('audit', $ip, 1000, 3600)` en `AuditController::create` antes de validar payload
- [ ] T008 [US1] Insertar fila en `audit_log` con `timestamp = NOW(3)` (servidor, no cliente)
- [ ] T009 [P] [US1] Crear `scripts/test-audit.php` con 5+ escenarios: POST valido, POST campos prohibidos, POST sin auth (debe ser publico, OK), GET admin sin auth (401), GET admin con auth, GET estadisticas admin, rate limit

## Phase 3: User Story 2 y 3 - GET admin + estadisticas (P1)

- [ ] T010 [P] [US2] Implementar `AuditLog::list(filtros, page, perPage)` con query builder para filtros: codigo, serie, mes, resultado, desde, hasta
- [ ] T011 [P] [US3] Implementar `AuditLog::stats(filtros)` con 4 agregaciones: total, por_serie, por_establecimiento, tasa_aprobacion (excluye ERROR)
- [ ] T012 [US2] Devolver paginacion `{items, total, page, perPage, totalPages}` consistente con el resto de la API
- [ ] T013 [P] [US3] Devolver stats con shape `{total, por_serie: [...], por_establecimiento: [...], tasa_aprobacion: number}`

**Checkpoint**: backend completo, testeable por HTTP.

## Phase 4: Cliente TS

- [ ] T014 [P] Crear `src/api/audit.ts` con `post(event)`, `list(filtros)`, `stats(filtros)`, tipos `AuditEvent`, `AuditStats`
- [ ] T015 [P] Crear `src/lib/auditQueue.ts` con `enqueue`, `flush`, `prune`, `count`, usando IndexedDB (DB: `validador_deis`, store: `audit_queue`)
- [ ] T016 [P] Crear `src/hooks/useRulesVersion.ts` con `currentVersion` (IndexedDB), `latestVersion` (GET /api/reglas/actual), `applyLatest()` (descarga bundle + cache)
- [ ] T017 [P] Crear `src/api/audit.test.ts` con 4 tests (post, list, stats, validacion campos)
- [ ] T018 [P] Crear `src/lib/auditQueue.test.ts` con 3 tests (enqueue, flush, prune con mock de IndexedDB)

## Phase 5: Frontend - Pagina Auditoria

- [ ] T019 [P] Crear `admin/components/StatCard.tsx` (titulo + valor + subtitulo, con variantes color)
- [ ] T020 [P] Crear `admin/components/AuditoriaFilters.tsx` (rango fechas + serie + codigo + resultado)
- [ ] T021 [P] Crear `admin/pages/AuditoriaPage.tsx` con 4 StatCards arriba + filtros + tabla paginada
- [ ] T022 [P] Modificar `admin/AdminLayout.tsx` para agregar link "Auditoria" en sidebar
- [ ] T023 [P] Modificar `admin/AdminApp.tsx` para enrutar `/admin/auditoria` con `RequireAdmin`

## Phase 6: Integracion con el validador

- [ ] T024 Modificar `hooks/useValidationPipeline.ts` para encolar evento de auditoria al terminar la validacion (con metadata: nombre, codigo, establecimiento, comuna, serie, mes, periodo, conteo por severidad, duracion, resultado)
- [ ] T025 [P] Modificar `components/FileDropzone.tsx` para mostrar banner con `useRulesVersion` cuando hay version nueva disponible
- [ ] T026 [P] Modificar `App.tsx` para invocar `useRulesVersion` al montar (chequeo periodico cada 5 min)

## Phase 7: Verificacion final y docs

- [ ] T027 Ejecutar `npm test` y ajustar
- [ ] T028 Ejecutar `php scripts/test-audit.php` y ajustar
- [ ] T029 Ejecutar `npm run build` y ajustar
- [ ] T030 Manual: validar archivo -> ver evento en /admin/auditoria
- [ ] T031 Manual: publicar version -> ver banner en validador -> actualizar
- [ ] T032 Actualizar `docs/MANUAL_ADMIN.md` con seccion "Auditoria y estadisticas"
- [ ] T033 Actualizar `AGENTS.md` y `README.md`
- [ ] T034 Commit final con mensaje claro y push
- [ ] T035 Crear PR via `gh pr create` con la plantilla del repo

## Dependencies & Execution Order

- Phase 1 -> Phase 2 + 3 (backend) -> Phase 4 (cliente TS) -> Phase 5 (paginas) -> Phase 6 (integracion) -> Phase 7 (docs + PR)

## Parallel Opportunities

- T001, T002, T003, T005 son paralelos
- T010, T011, T013 paralelos
- T014, T015, T016, T017, T018 paralelos
- T019, T020, T021, T022, T023 paralelos
- T025, T026 paralelos
- T032, T033 paralelos

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Phase 1 + 2 + 3: backend completo
2. **STOP**: validar POST/GET/GET-stats via scripts/test-audit.php
3. Phase 4 + 5: cliente TS + paginas admin
4. Phase 6: integracion con el validador
5. Phase 7: docs + PR
