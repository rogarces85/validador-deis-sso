# Feature Specification: 003-B CRUD de Reglas y Publicacion

**Feature Branch**: `003-b-crud-reglas`
**Created**: 2026-07-01
**Status**: Draft
**Input**: User description: "Construir un CRUD de reglas en el panel admin con formulario intuitivo, publicacion de versiones y diff antes/despues. La fuente canonica sigue siendo `data/reglas_finales.json` bundleado con la app; la BD MySQL actua como borrador editable y, al publicar, se regenera el bundle."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listar y filtrar reglas (Priority: P1)

Como administrador, quiero ver todas las reglas cargadas en la BD con filtros por serie, hoja, severidad y busqueda por texto para localizar rapidamente una regla especifica.

**Why this priority**: Es la pantalla de entrada del modulo de reglas. Sin esta vista, el admin no puede operar.

**Independent Test**: Sembrar la BD con al menos 20 reglas de prueba via `import-reglas-initial.php`. Abrir `/admin/reglas`, verificar que la tabla muestra todas las reglas, aplicar filtro `serie=A` y comprobar que la lista se reduce correctamente. Buscar por texto "VAL001" y verificar el match.

**Acceptance Scenarios**:
1. **Given** la BD sembrada con reglas, **When** el admin abre `/admin/reglas`, **Then** ve una tabla paginada con todas las reglas activas.
2. **Given** la tabla con reglas, **When** aplica filtro `serie=A`, **Then** la lista solo contiene reglas con `rem_sheet` que empieza con `A`.
3. **Given** la tabla, **When** busca "VAL001", **Then** la lista se filtra a reglas cuyo `regla_id` o `mensaje` contiene ese texto.
4. **Given** la tabla, **When** el admin hace click en una fila, **Then** se abre el detalle de la regla en modo edicion.

---

### User Story 2 - Crear regla nueva (Priority: P1)

Como administrador, quiero crear una regla nueva mediante un formulario claro con preview en vivo de la expresion para no cometer errores al ingresar celdas o rangos.

**Why this priority**: Sin creacion no hay CRUD. El formulario es la pieza central de la entrega.

**Independent Test**: Abrir `/admin/reglas/nueva`, completar los campos identidad, expresion y alcance, guardar y verificar que la regla aparece en la lista. Volver a abrir la regla y comprobar que los datos persistieron.

**Acceptance Scenarios**:
1. **Given** el formulario de nueva regla, **When** el admin completa `regla_id` (auto si vacio), `serie`, `rem_sheet` y presiona "Guardar borrador", **Then** la regla se persiste en la tabla `reglas` con `activo=1`.
2. **Given** el formulario con `expresion_1` mal formada, **When** el admin guarda, **Then** la UI muestra un error de validacion y NO persiste.
3. **Given** el formulario, **When** el admin ingresa `SUM(A1:A10) + B5`, **Then** el preview muestra "Suma el rango A1:A10 y le suma la celda B5".
4. **Given** una regla recien creada, **When** el admin la recarga, **Then** los datos se mantienen identicos a como se ingreso.

---

### User Story 3 - Editar regla existente (Priority: P1)

Como administrador, quiero modificar una regla existente con la misma UI intuitiva del formulario de creacion para mantener consistencia operativa.

**Why this priority**: El edit es la operacion mas frecuente una vez el sistema esta en uso.

**Independent Test**: Abrir una regla existente, modificar `severidad` de ERROR a REVISAR, guardar y verificar que el cambio persiste y aparece en el log de auditoria de cambios.

**Acceptance Scenarios**:
1. **Given** una regla existente, **When** el admin la abre en modo edicion, **Then** todos los campos aparecen pre-llenados con los valores actuales.
2. **Given** el formulario de edicion, **When** el admin modifica `severidad` y guarda, **Then** la regla se actualiza y la accion queda registrada en `reglas_audit` con diff antes/despues.
3. **Given** la regla modificada, **When** el admin recarga la lista, **Then** ve la severidad nueva.
4. **Given** dos admins editando la misma regla, **When** ambos guardan, **Then** el segundo guardado gana con warning de "ultima escritura gana" y el diff se registra en audit.

---

### User Story 4 - Desactivar regla (Priority: P1)

Como administrador, quiero desactivar una regla (no eliminarla fisicamente) para no perder trazabilidad y poder revertir si es necesario.

**Why this priority**: Es preferible soft-delete a DELETE fisico para mantener audit historico y evitar perdida de datos.

**Independent Test**: Abrir una regla, desactivarla, verificar que desaparece de la lista de reglas activas y aparece en una vista de "desactivadas". Reactivar y comprobar que vuelve a la lista principal.

**Acceptance Scenarios**:
1. **Given** una regla activa, **When** el admin la desactiva, **Then** `activo` pasa a 0 y la regla no aparece en la lista por defecto.
2. **Given** una regla desactivada, **When** el admin activa el toggle "Mostrar desactivadas", **Then** aparece con badge "Desactivada".
3. **Given** una regla desactivada, **When** el admin la reactiva, **Then** vuelve al estado activo sin perder cambios previos.

---

### User Story 5 - Publicar version (Priority: P1)

Como administrador, quiero publicar el conjunto actual de reglas activas como una version inmutable con un semver autogenerado, para que el validador use ese bundle distribuido.

**Why this priority**: Es el paso que cierra el ciclo CRUD y materializa los cambios para los usuarios del validador.

**Independent Test**: Con 5 reglas activas en la BD, abrir `/admin/publicar`, escribir nota de release "Reglas iniciales Serie P ajustadas", confirmar. Verificar que `reglas_versiones` tiene una nueva fila con `version_semver` y que `data/reglas_finales.json` (o el bundle que se distribuya) coincide con las reglas activas.

**Acceptance Scenarios**:
1. **Given** reglas activas en `reglas`, **When** el admin publica con nota, **Then** se crea una fila en `reglas_versiones` con `version_semver` autoincrementada (ej. `1.0.0-reglas`) y el JSON snapshot.
2. **Given** una publicacion, **When** el admin la ve en `/admin/publicar`, **Then** aparece en el historial con timestamp, autor, conteo de reglas y nota.
3. **Given** una publicacion, **When** el admin consulta `GET /api/reglas/actual`, **Then** devuelve el bundle de la version mas reciente con `version_semver` y `total_reglas`.
4. **Given** una publicacion, **When** el bundle cambia, **Then** la app cliente muestra banner "Hay nuevas reglas disponibles" en el proximo inicio (003-C).

---

### User Story 6 - Importar reglas iniciales (Priority: P1)

Como operador del despliegue, quiero un script CLI que cargue las reglas actuales de `data/reglas_finales.json` a la BD, para que el admin tenga contenido desde el primer login.

**Why this priority**: Sin contenido inicial, el CRUD opera sobre una BD vacia y no se puede probar el flujo completo.

**Independent Test**: Ejecutar `php scripts/import-reglas-initial.php` sobre una BD limpia. Verificar que `reglas` tiene todas las reglas del JSON y que `reglas_versiones` tiene la primera publicacion `1.0.0-reglas`.

**Acceptance Scenarios**:
1. **Given** una BD limpia, **When** se ejecuta el script, **Then** todas las reglas de `data/reglas_finales.json` quedan en `reglas` con `activo=1` y la primera version se publica automaticamente.
2. **Given** una BD con reglas previas, **When** se ejecuta el script con `--reset`, **Then** se eliminan las reglas y versiones previas antes de reimportar.
3. **Given** un JSON malformado, **When** se ejecuta el script, **Then** aborta con mensaje claro antes de tocar la BD.

---

### Edge Cases

- Regla con `expresion_1` que referencia una hoja que no existe: el preview debe indicarlo y guardar debe permitirlo (las reglas pueden referenciar hojas validas aunque la UI no las autocomplete).
- Regla con `aplicar_a` y `excluir_tipo` simultaneos: el validador aplica `excluir_tipo` primero, luego `aplicar_a` (orden ya implementado en `ruleEngine.ts`).
- Publicar con cero reglas activas: el backend responde 400 con mensaje "No hay reglas activas para publicar".
- Publicar dos veces seguidas: cada publicacion crea una nueva fila en `reglas_versiones` con semver autoincrementado.
- Operador intenta acceder a `/admin/reglas` sin sesion: RequireAdmin redirige a `/admin/login`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST exponer `GET /api/reglas` que liste reglas activas con paginacion y filtros por `serie`, `rem_sheet`, `severidad` y `q` (busqueda en `regla_id` y `mensaje`).
- **FR-002**: El sistema MUST exponer `GET /api/reglas/:regla_id` que devuelva el detalle de una regla (campos planos, no JSON embebido).
- **FR-003**: El sistema MUST exponer `POST /api/reglas` que cree una regla nueva con `activo=1`, validando todos los campos obligatorios.
- **FR-004**: El sistema MUST exponer `PUT /api/reglas/:regla_id` que actualice la regla y registre un diff en `reglas_audit`.
- **FR-005**: El sistema MUST exponer `DELETE /api/reglas/:regla_id` que realize soft-delete (`activo=0`) y registre la accion en audit.
- **FR-006**: El sistema MUST exponer `POST /api/reglas/:regla_id/activar` que reestablezca `activo=1`.
- **FR-007**: El sistema MUST exponer `GET /api/reglas/versiones` con el historial de publicaciones (paginado).
- **FR-008**: El sistema MUST exponer `POST /api/reglas/publicar` que cree una nueva fila en `reglas_versiones` con el snapshot actual de reglas activas, semver autoincrementado y nota de release opcional.
- **FR-009**: El sistema MUST exponer `GET /api/reglas/actual` (publico) que devuelva la ultima version publicada con `version_semver` y el payload JSON.
- **FR-010**: El sistema MUST validar en backend que `expresion_1` y `expresion_2` no excedan 255 caracteres y que el operador sea uno de `==`, `!=`, `>`, `<`, `>=`, `<=`.
- **FR-011**: El sistema MUST rechazar creacion/actualizacion con `regla_id` duplicado.
- **FR-012**: El sistema MUST auditar todas las acciones CRUD de reglas con `autor` (admin_id) y `diff_json` (antes/despues en JSON).
- **FR-013**: El cliente TS MUST ofrecer UI con tabla paginada, filtros arriba, busqueda, badges de severidad y botones de accion por fila.
- **FR-014**: El cliente TS MUST ofrecer un `ReglaForm` con secciones colapsables (Identidad, Expresion, Alcance y flags) y validacion en vivo.
- **FR-015**: El cliente TS MUST ofrecer un `ExpresionInput` con resaltado de celdas y `ExpresionPreview` que muestre "Lee celda X de hoja Y" o "Suma rango X:Y" segun el caso.
- **FR-016**: El cliente TS MUST ofrecer una pantalla `PublicarPage` con diff entre el draft actual y la ultima publicacion, campo de nota de release y confirmacion.
- **FR-017**: El script `scripts/import-reglas-initial.php` MUST leer `data/reglas_finales.json`, insertar las reglas en la BD y crear la primera publicacion.
- **FR-018**: Todo el texto visible al usuario (formularios, mensajes, errores, documentacion) MUST estar en espanol.
- **FR-019**: El sistema MUST seguir las mismas garantias de auth y CSRF que la Feature 003-A para los endpoints `/api/reglas*`.

### Key Entities

- **Regla**: Borrador editable. Campos: `id`, `regla_id` (negocio), `serie`, `rem_sheet`, `tipo`, `expresion_1`, `operador`, `expresion_2` (JSON), `severidad`, `mensaje`, `omitir_si_ambos_cero`, `omitir_si_v1_es_cero`, `validacion_exclusiva`, `aplicar_a_tipo`, `excluir_tipo`, `aplicar_a`, `establecimientos_excluidos`, `activo`, `actualizado_por`, `actualizado_en`.
- **ReglaVersion**: Snapshot inmutable de una publicacion. Campos: `id`, `version_semver`, `total_reglas`, `publicado_por`, `publicado_en`, `notas`, `payload_json`.
- **ReglaAudit**: Bitacora de cambios. Campos: `id`, `regla_pk`, `regla_id`, `accion`, `diff_json`, `autor`, `timestamp`.

## Success Criteria *(mandatory)*

- **SC-001**: `import-reglas-initial.php` carga las reglas de `data/reglas_finales.json` y crea la primera publicacion en menos de 5 segundos.
- **SC-002**: Crear una regla via API responde 201 con la regla creada en menos de 200 ms.
- **SC-003**: La lista paginada de reglas carga la primera pagina en menos de 300 ms con hasta 1000 reglas activas.
- **SC-004**: Publicar una version con 50 reglas responde 200 con el semver nuevo y el snapshot, en menos de 500 ms.
- **SC-005**: `GET /api/reglas/actual` es publico y responde 200 con el bundle de la ultima publicacion, sin requerir sesion.
- **SC-006**: Toda operacion CRUD queda registrada en `reglas_audit` con `autor` y diff.
- **SC-007**: `npm test` mantiene los 65 tests previos en verde y agrega >= 4 tests nuevos para `services/api/reglas.ts`.
- **SC-008**: `npm run build` finaliza sin errores criticos.
- **SC-009**: `php scripts/test-reglas.php` (nuevo script) aprueba >= 6 escenarios: listar, crear, editar, desactivar, publicar, importar.
- **SC-010**: El validador publico sigue funcionando sin cambios: `data/reglas_finales.json` se mantiene como bundle por defecto y la app carga desde ahi si el backend no responde.

## Assumptions

- La primera publicacion tras `import-reglas-initial.php` se hace con `version_semver = "1.0.0-reglas"`.
- Las publicaciones siguientes autoincrementan el semver patch: `1.0.0-reglas`, `1.0.1-reglas`, `1.0.2-reglas`, etc.
- El bundle `data/reglas_finales.json` NO se regenera automaticamente al publicar (queda como snapshot del ultimo release confirmado manualmente). La regeneracion automatica queda para una entrega posterior (003-C + scripts).
- El admin no edita `data/reglas_finales.json` directamente: el flujo es siempre BD -> publicar.
- El validador publico no consulta la BD: sigue usando `data/reglas_finales.json` (modo degradado). La sincronizacion de reglas desde la API al cliente se implementa en 003-C.
- La constitucion v1.2.0 sigue vigente: el contenido del archivo REM nunca sale del navegador.
- El unico rol es `admin` (sin RBAC granular para CRUD).
- El operador puede acceder a MySQL directamente para borrar/resetear la tabla `reglas` si necesita reimportar (no exponemos DELETE masivo en la API).

## Out of Scope

- Versionado automatico con semver mayor/menor (siempre patch).
- Comentarios en reglas (no se requieren para MVP).
- Importar reglas desde Excel (la fuente canonica sigue siendo `data/reglas_finales.json`).
- Tests E2E con Playwright (cubierto por tests PHP y Vitest).
- Sincronizacion cliente-servidor de reglas (queda para 003-C).
- Auditoria de uso del validador (queda para 003-C).
