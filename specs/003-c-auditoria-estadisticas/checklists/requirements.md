# Checklist de Requisitos: 003-C Auditoria No Clinica y Estadisticas

## Funcionales (FR)

- [ ] FR-001 - POST /api/audit publico -> T003
- [ ] FR-002 - Lista blanca estricta -> T002, T006
- [ ] FR-003 - Validacion de conteos -> T002
- [ ] FR-004 - Persistir con timestamp servidor -> T008
- [ ] FR-005 - Rate limit 1000/h por IP -> T007
- [ ] FR-006 - GET /api/audit con filtros -> T010, T012
- [ ] FR-007 - GET /api/audit/estadisticas -> T011, T013
- [ ] FR-008 - Cliente envia evento fire-and-forget -> T024
- [ ] FR-009 - Cola IndexedDB + retry -> T015, T024
- [ ] FR-010 - TTL 7d, max 500 -> T015
- [ ] FR-011 - GET /api/reglas/actual al iniciar -> T016
- [ ] FR-012 - Banner + boton actualizar -> T016, T025
- [ ] FR-013 - data/reglas_finales.json como fallback -> transversal
- [ ] FR-014 - Todo en espanol -> transversal

## User Stories

- [ ] US1 Validador reporta al backend -> T001-T009
- [ ] US2 Tabla de auditoria -> T010, T012, T021
- [ ] US3 Estadisticas de uso -> T011, T013, T019, T020, T021
- [ ] US4 Sincronizacion de reglas -> T016, T025, T026

## Constitucionales

- [x] I.a Privacidad Local con Auditoria Opcional -> IMPLEMENTA la auditoria opcional
- [ ] IV Calidad Verificable -> tests PHP + Vitest
- [ ] VI Modulo de Administracion -> endpoints admin protegidos
- [ ] VII Registro de Auditoria No Clinica -> IMPLEMENTA este principio

## Success Criteria

- [ ] SC-001 POST < 2s -> T024
- [ ] SC-002 Backend caido no impide validacion -> T015 (cola IndexedDB)
- [ ] SC-003 Lista blanca rechaza payload clinico -> T002, T006
- [ ] SC-004 Listar < 500ms -> T010
- [ ] SC-005 Estadisticas < 1s -> T011
- [ ] SC-006 Banner < 5s -> T016, T025
- [ ] SC-007 74+6 tests -> T017, T018, T027
- [ ] SC-008 5+ escenarios PHP -> T009, T028
- [ ] SC-009 Build sin errores -> T029
- [ ] SC-010 Modo degradado -> FR-013

## Riesgos

- [ ] Cola crece sin limite -> T015 (TTL + max)
- [ ] Banner molesto -> T016 (comparar semver)
- [ ] Validacion retrasada -> T024 (fire-and-forget + timeout)
- [ ] Payload con datos clinicos -> T002 (lista blanca)
