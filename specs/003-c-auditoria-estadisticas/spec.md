# Feature Specification: 003-C Auditoria No Clinica y Estadisticas

**Feature Branch**: `003-c-auditoria-estadisticas`
**Created**: 2026-07-01
**Status**: Draft
**Input**: User description: "Cada vez que el validador termina una validacion, enviar al backend un evento con metadatos no clinicos. El panel admin debe mostrar una tabla con los eventos y estadisticas de uso (por establecimiento, serie, tasa de aprobacion). Tambien sincronizar el bundle de reglas entre el backend y el validador con un banner."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - El validador reporta cada validacion al backend (Priority: P1)

Como usuario del validador, quiero que al terminar una validacion exitosa se envie un evento de auditoria al backend con metadatos no clinicos, para que el Servicio de Salud tenga trazabilidad de uso sin comprometer la privacidad.

**Why this priority**: Es la pieza que materializa el Principio VII de la constitucion v1.2.0 y la base para el resto de la entrega.

**Independent Test**: Cargar un archivo REM valido en el validador. Verificar que se hizo una llamada POST a `/api/audit` con un body que contiene `nombre_archivo, codigo_establecimiento, serie, mes, total_hallazgos, conteo_por_severidad, duracion_ms`. Verificar que NO contiene valores de celdas ni nombres de pacientes.

**Acceptance Scenarios**:
1. **Given** un archivo validado correctamente, **When** la validacion termina, **Then** el cliente hace POST /api/audit con metadatos no clinicos en menos de 2 segundos.
2. **Given** un evento de auditoria valido, **When** el backend lo recibe, **Then** responde 201 y guarda la fila en `audit_log`.
3. **Given** el backend no esta disponible, **When** el cliente intenta enviar, **Then** el evento queda en una cola IndexedDB y se reintenta al proximo inicio.
4. **Given** un payload con campos prohibidos (ej. `valor_celda`, `contenido_hoja`), **When** el backend lo recibe, **Then** responde 400 sin guardar el evento.

---

### User Story 2 - El admin ve la tabla de auditoria (Priority: P1)

Como administrador, quiero ver una tabla paginada de todos los eventos de uso del validador, con filtros por establecimiento, serie, mes y rango de fechas, para responder a auditorias internas del Servicio de Salud.

**Why this priority**: Es la pantalla que consume la base de la auditoria.

**Independent Test**: Con 5+ eventos en la BD (de archivos OK y con error), abrir `/admin/auditoria`. Verificar que la tabla muestra todos los eventos, aplicar filtro por serie y mes, comprobar que la lista se reduce.

**Acceptance Scenarios**:
1. **Given** la BD con eventos, **When** el admin abre `/admin/auditoria`, **Then** ve una tabla paginada con los ultimos 50 eventos.
2. **Given** la tabla, **When** aplica filtro `serie=P`, **Then** la lista solo contiene eventos de archivos Serie P.
3. **Given** la tabla, **When** busca por codigo de establecimiento, **Then** la lista se filtra correctamente.
4. **Given** la tabla, **When** filtra por rango de fechas, **Then** solo aparecen eventos en ese rango.

---

### User Story 3 - El admin ve estadisticas de uso (Priority: P1)

Como administrador, quiero ver tarjetas con estadisticas agregadas (total de validaciones, distribucion por serie, distribucion por establecimiento, tasa de aprobacion) y graficos simples, para entender el uso real del sistema.

**Why this priority**: Complementa la tabla y permite detectar patrones (que establecimiento valida mas, que serie es mas conflictiva, etc).

**Independent Test**: Con 20+ eventos variados, abrir `/admin/auditoria`. Verificar que se muestran 4 stat cards: total de validaciones, distribucion por serie, distribucion por establecimiento, tasa de aprobacion.

**Acceptance Scenarios**:
1. **Given** la BD con eventos, **When** el admin abre `/admin/auditoria`, **Then** ve 4 StatCards arriba: Total, Por Serie, Por Establecimiento, Tasa de Aprobacion.
2. **Given** los StatCards, **When** el admin aplica filtro de rango de fechas, **Then** las estadisticas se recalculan para ese rango.
3. **Given** las estadisticas, **When** el admin ve "Tasa de Aprobacion", **Then** se calcula como `APROBADO / total` y excluye eventos con error tecnico.

---

### User Story 4 - Sincronizacion automatica de reglas (Priority: P2)

Como usuario del validador, quiero ver un banner "Hay nuevas reglas disponibles" cuando la version del backend sea mayor que la local, y un boton para refrescar, para mantener el bundle de reglas actualizado sin intervencion manual del operador.

**Why this priority**: Cierra el ciclo de cambios normativos y operacionaliza el Principio VII.

**Independent Test**: Publicar una nueva version via panel admin. En el validador, recargar. Verificar que aparece el banner "Hay nuevas reglas disponibles (v1.0.1-reglas)". Pulsar el boton y comprobar que el bundle local se actualiza.

**Acceptance Scenarios**:
1. **Given** el bundle local en v1.0.0 y el backend en v1.0.1, **When** el usuario abre el validador, **Then** aparece un banner con el texto "Hay nuevas reglas disponibles".
2. **Given** el banner visible, **When** el usuario pulsa "Actualizar reglas", **Then** el cliente descarga el bundle nuevo, lo guarda en IndexedDB y oculta el banner.
3. **Given** el bundle local igual al backend, **When** el usuario abre el validador, **Then** no aparece banner.

---

### Edge Cases

- El cliente pierde conexion durante el POST /api/audit: el evento queda en IndexedDB y se reintenta al restaurar.
- El payload de audit llega con campos faltantes: el backend responde 400 con mensaje claro.
- El admin abre `/admin/auditoria` sin eventos: la tabla muestra estado vacio y los StatCards muestran ceros.
- El bundle remoto tiene mas reglas que el local: la importacion sobrescribe IndexedDB.
- La cola de audit crece sin limite: TTL de 7 dias, max 500 eventos; los mas viejos se descartan.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST exponer `POST /api/audit` (publico, sin auth) que reciba un evento de auditoria con los campos definidos en I.a de la constitucion v1.2.0.
- **FR-002**: El sistema MUST rechazar payloads que contengan campos no listados en I.a (lista blanca estricta).
- **FR-003**: El sistema MUST validar que `total_hallazgos >= 0` y los conteos por severidad sean enteros >= 0.
- **FR-004**: El sistema MUST persistir el evento en `audit_log` con timestamp del servidor (no del cliente).
- **FR-005**: El sistema MUST rate-limitar `POST /api/audit` a 1000 requests/hora por IP.
- **FR-006**: El sistema MUST exponer `GET /api/audit` (admin) con paginacion y filtros por `codigo_establecimiento`, `serie`, `mes`, `resultado_final` y rango `desde/hasta`.
- **FR-007**: El sistema MUST exponer `GET /api/audit/estadisticas` (admin) con agregaciones: total, por_serie, por_establecimiento, tasa_aprobacion.
- **FR-008**: El cliente TS MUST enviar el evento de auditoria al terminar una validacion, en modo fire-and-forget.
- **FR-009**: El cliente TS MUST encolar el evento en IndexedDB si el POST falla, y reintentar al restaurar la conexion o al recargar la app.
- **FR-010**: El cliente TS MUST descartar eventos en cola con TTL > 7 dias o si la cola excede 500 entradas.
- **FR-011**: El cliente TS MUST consultar `GET /api/reglas/actual` al iniciar la app (con timeout 3s) y comparar la `version_semver` con la cacheada en IndexedDB.
- **FR-012**: Si la version del backend es mayor, el cliente MUST mostrar un banner "Hay nuevas reglas disponibles (vX.Y.Z-reglas)" con un boton "Actualizar reglas" que descarga el bundle.
- **FR-013**: El sistema MUST mantener `data/reglas_finales.json` como bundle por defecto en el validador (modo degradado).
- **FR-014**: Todo el texto visible al usuario (formularios, mensajes, banners, documentacion) MUST estar en espanol.

### Key Entities

- **AuditLog**: Registro de una validacion finalizada. Campos: id, timestamp, nombre_archivo, codigo_establecimiento, nombre_establecimiento, comuna, tipo_establecimiento, serie, mes, periodo, total_hallazgos, conteo_error, conteo_revisar, conteo_indicador, resultado_final, duracion_ms, ip_origen, user_agent.
- **AuditQueue (cliente)**: Cola IndexedDB con eventos pendientes de envio. Campos: id, payload, attempts, last_attempt_at, expires_at.

## Success Criteria *(mandatory)*

- **SC-001**: El validador envia el evento de auditoria al backend en menos de 2 segundos tras finalizar la validacion.
- **SC-002**: La falla del backend (red caida) no impide ni retrasa la validacion local: el evento queda en cola.
- **SC-003**: El endpoint `POST /api/audit` valida la lista blanca y rechaza payloads clinicos con 400.
- **SC-004**: La pagina `/admin/auditoria` carga la primera pagina de 50 eventos en menos de 500 ms.
- **SC-005**: El endpoint `GET /api/audit/estadisticas` responde en menos de 1 segundo con 10.000 eventos en la BD.
- **SC-006**: El banner de sincronizacion de reglas aparece en menos de 5 segundos cuando hay una version nueva.
- **SC-007**: `npm test` mantiene los 74 tests previos y agrega >= 6 tests nuevos para `audit.ts` y `useRulesVersion`.
- **SC-008**: `php scripts/test-audit.php` aprueba >= 5 escenarios.
- **SC-009**: `npm run build` finaliza sin errores.
- **SC-010**: El validador publico sigue funcionando sin cambios cuando el backend no responde (modo degradado).

## Assumptions

- El bundle `data/reglas_finales.json` se mantiene como snapshot de la primera publicacion.
- La sincronizacion de reglas es opcional: el validador siempre puede usar el bundle local.
- El operador es el unico rol con acceso a `/admin/auditoria` (no se definen roles adicionales en el MVP).
- El rate limit en `/api/audit` es por IP de origen (mismo criterio que en `/api/auth/login`).
- Las estadisticas se computan en cada request; si la BD crece mucho (> 100k eventos),可以考虑 cache con TTL 60s (futuro).

## Out of Scope

- Dashboards interactivos con bibliotecas de charting (Chart.js, Recharts): la entrega usa tarjetas y barras CSS simples.
- Exportacion a PDF de los reportes: solo CSV/JSON se exportan via `audit_log` directo.
- Auditoria de cambios sobre reglas (ReglasAudit): ya implementada en 003-B; esta feature NO la modifica.
- Login de admin via OAuth/SSO: la feature 003-A implemento email+password.
- Tests E2E con Playwright: cubierto por tests PHP y Vitest.
