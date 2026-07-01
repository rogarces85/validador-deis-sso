# Checklist de Requisitos: 003-B CRUD de Reglas y Publicacion

> Validar que cada requisito de `spec.md` queda cubierto por las tareas de `tasks.md` antes de cerrar el PR.

## Funcionales (FR)

- [ ] FR-001 - GET /api/reglas con filtros y paginacion -> T006
- [ ] FR-002 - GET /api/reglas/:regla_id -> T014
- [ ] FR-003 - POST /api/reglas con validacion -> T008
- [ ] FR-004 - PUT /api/reglas/:regla_id con diff -> T009
- [ ] FR-005 - DELETE /api/reglas/:regla_id (soft-delete + audit) -> T011
- [ ] FR-006 - POST /api/reglas/:regla_id/activar -> T012
- [ ] FR-007 - GET /api/reglas/versiones -> T015
- [ ] FR-008 - POST /api/reglas/publicar con semver y snapshot -> T016
- [ ] FR-009 - GET /api/reglas/actual publico -> T017
- [ ] FR-010 - Validacion backend (longitud, operador) -> T004
- [ ] FR-011 - Regla_id duplicado -> T008 (reglaIdExists)
- [ ] FR-012 - Audit con autor y diff -> T008, T009, T011, T012, T016
- [ ] FR-013 - UI con tabla, filtros, badges -> T032
- [ ] FR-014 - ReglaForm con secciones y validacion en vivo -> T033, T034
- [ ] FR-015 - ExpresionInput + ExpresionPreview -> T027, T028
- [ ] FR-016 - PublicarPage con diff -> T035, T031
- [ ] FR-017 - import-reglas-initial.php -> T019
- [ ] FR-018 - Todo en espanol -> transversal
- [ ] FR-019 - Auth + CSRF (reusar 003-A) -> RequireAuth + RequireCsrf en T007..T017

## User Stories

- [ ] US1 Listar y filtrar -> T006, T032
- [ ] US2 Crear regla -> T008, T033
- [ ] US3 Editar regla -> T009, T033
- [ ] US4 Desactivar regla -> T011, T012, T032
- [ ] US5 Publicar version -> T016, T035
- [ ] US6 Importar reglas iniciales -> T019

## Constitucionales

- [ ] I.a Privacidad Local con Auditoria Opcional -> no se envia contenido REM
- [ ] II Validacion REM Normativa -> validador intacto
- [ ] II.a Alcance Series A/P -> sin cambios
- [ ] III Trazabilidad de Hallazgos -> reglas_audit registra todo
- [ ] IV Calidad Verificable -> tests PHP + Vitest + build obligatorio
- [ ] V Espanol Obligatorio -> UI y mensajes en espanol
- [ ] VI Modulo de Administracion -> CRUD con auth, CSRF, audit
- [ ] VII Registro de Auditoria No Clinica -> no aplica (003-C)

## Success Criteria

- [ ] SC-001 import < 5s -> T019, T043
- [ ] SC-002 crear < 200ms -> T008
- [ ] SC-003 listar < 300ms -> T006
- [ ] SC-004 publicar < 500ms -> T016
- [ ] SC-005 GET /api/reglas/actual publico -> T017
- [ ] SC-006 audit en cada CRUD -> T008, T009, T011, T012, T016
- [ ] SC-007 65+4 tests -> T040
- [ ] SC-008 build sin errores -> T042
- [ ] SC-009 test-reglas.php >= 6 escenarios -> T020, T041
- [ ] SC-010 validador publico intacto -> T043

## Riesgos

- [ ] expresion_2 conversion a JSON canonico -> T004
- [ ] Publicar sin reglas activas -> T016 con 400
- [ ] Audit crece sin limite -> fuera de scope (limpieza futura)
- [ ] Soft-delete deja snapshots intactos -> T011, T014
