# Checklist de Requisitos: 003-A Infra Backend y Auth Admin

> Validar que cada requisito de `spec.md` queda cubierto por las tareas de `tasks.md` antes de cerrar el PR.

## Funcionales (FR)

- [ ] FR-001 - Migracion idempotente de `usuarios_admin` y 4 tablas adicionales -> T004
- [ ] FR-002 - `POST /api/auth/login` con `password_verify` y cookie HttpOnly/SameSite -> T016, T017
- [ ] FR-003 - `POST /api/auth/logout` que destruye sesion y borra cookie -> T028, T029
- [ ] FR-004 - `GET /api/auth/me` con admin actual o 401 -> T024, T025
- [ ] FR-005 - CSRF por sesion en endpoints no-idempotentes -> T008, T011, T028
- [ ] FR-006 - Rate limit 5/15min en login -> T032, T033
- [ ] FR-007 - Script CLI `seed-admin.php` -> T037..T041
- [ ] FR-008 - Ruta `/admin/login` con formulario en espanol -> T021, T022
- [ ] FR-009 - `AdminAuthContext` y `RequireAdmin` -> T020, T026
- [ ] FR-010 - Validador intacto (home/results/cells sin cambios) -> verificacion manual T049
- [ ] FR-011 - Todo texto visible en espanol -> T021, T036, T050
- [ ] FR-012 - PDO prepared statements + bcrypt cost >= 10 -> T005, T039
- [ ] FR-013 - `npm run build` y tests -> T048, T046, T047
- [ ] FR-014 - Modo degradado sin backend -> T049 (manual cerrar XAMPP y verificar validador)

## User Stories

- [ ] US1 Login exitoso -> T014..T023
- [ ] US2 Sesion persistente y me -> T024..T027
- [ ] US3 Logout y expiracion -> T028..T031
- [ ] US4 Rate limit y CSRF -> T032..T036
- [ ] US5 Seed admin CLI -> T037..T041

## Constitucionales

- [ ] I.a Privacidad Local con Auditoria Opcional -> no se toca contenido del archivo; backend opcional
- [ ] II Validacion REM Normativa -> validador intacto
- [ ] II.a Alcance Series A/P -> sin cambios
- [ ] III Trazabilidad de Hallazgos -> sin cambios
- [ ] IV Calidad Verificable -> tests PHP y TS, build obligatorio
- [ ] V Espanol Obligatorio -> UI y mensajes en espanol
- [ ] VI Modulo de Administracion -> auth con email+pass, rol unico, CSRF, expiracion
- [ ] VII Registro de Auditoria No Clinica -> no aplica (003-C)
- [ ] Restricciones Tecnicas -> SPA intacta, XAMPP PHP+MySQL, sin framework PHP

## Success Criteria

- [ ] SC-001 Sembrar y loguear < 2 min -> T041, T049
- [ ] SC-002 Login < 300 ms -> medicion manual T049
- [ ] SC-003 6to intento -> 429 -> T034
- [ ] SC-004 Build sin warnings y tests pasan -> T046, T047, T048
- [ ] SC-005 Sesion persiste en `/admin/*` -> T026, T049
- [ ] SC-006 Documentacion en espanol -> T050, T051, T052
- [ ] SC-007 Migracion reproducible -> T004, T049

## Riesgos

- [ ] Sesion expira -> T026 cubre redirect 401
- [ ] SameSite requiere mismo origen -> documentado en plan y manual
- [ ] bcrypt cost -> T039 fuerza cost 12
- [ ] Migracion idempotente -> T004 usa IF NOT EXISTS
- [ ] CSRF -> T008, T011, T035
- [ ] Bundle crece -> T022 usa lazy load
