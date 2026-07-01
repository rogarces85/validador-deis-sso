# Feature Specification: 003-A Infra Backend y Auth Admin

**Feature Branch**: `003-a-infra-backend-auth`
**Created**: 2026-07-01
**Status**: Draft
**Input**: User description: "Levantar el backend PHP+MySQL sobre XAMPP con login de administrador (email+contrasena), unico rol admin, auditoria de inicio de sesion y pagina /admin/login en la app React. Esta feature no toca el motor de validacion ni el bundle de reglas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Login de Administrador Exitoso (Priority: P1)

Como administrador del Servicio de Salud, quiero ingresar con mi email y contrasena en una pantalla `/admin/login` para acceder al panel de administracion del validador.

**Why this priority**: Es el prerequisito para que cualquier otra historia del modulo admin funcione. Sin login no hay CRUD de reglas ni auditoria visible.

**Independent Test**: Sembrar un admin via `scripts/seed-admin.php`, abrir `http://localhost/www/validador-deis-sso/admin/login`, ingresar credenciales validas y verificar que la respuesta es 200 con cookie de sesion valida y redireccion a `/admin`.

**Acceptance Scenarios**:
1. **Given** un admin sembrado y una pantalla `/admin/login` renderizada, **When** el admin ingresa email y contrasena correctos, **Then** el backend responde 200, establece cookie `deis_admin_session` con flags HttpOnly/SameSite, devuelve JSON `{ok:true, user:{...}}` y el cliente redirige a `/admin`.
2. **Given** una pantalla `/admin/login`, **When** el admin ingresa email inexistente o contrasena incorrecta, **Then** el backend responde 401, no crea sesion, devuelve mensaje generico en espanol ("Credenciales invalidas") y no filtra si el email existe.
3. **Given** una pantalla `/admin/login`, **When** el admin envia el formulario con campos vacios, **Then** la UI muestra errores de validacion y no envia la peticion.

---

### User Story 2 - Sesion Persistente y `Me` (Priority: P1)

Como administrador autenticado, quiero que mi sesion se mantenga al navegar entre paginas del panel y que un endpoint `/api/auth/me` confirme quien soy, para que la UI pueda mostrar mi nombre y proteger rutas.

**Why this priority**: La sesion es la base de autorizacion para todas las paginas `/admin/*` y para los endpoints protegidos.

**Independent Test**: Despues de un login exitoso, recargar la pagina `/admin` no debe redirigir a `/admin/login`. Llamar a `GET /api/auth/me` debe devolver el admin actual si la cookie es valida y 401 si no.

**Acceptance Scenarios**:
1. **Given** un admin con sesion activa, **When** recarga `/admin` o navega a `/admin/reglas`, **Then** la UI verifica `/api/auth/me` y mantiene la sesion visible.
2. **Given** un admin con sesion activa, **When** llama `GET /api/auth/me`, **Then** el backend responde 200 con `{id, email, nombre, ultimo_acceso}`.
3. **Given** un visitante sin sesion, **When** llama `GET /api/auth/me`, **Then** el backend responde 401 con `{ok:false, error:"No autenticado"}`.

---

### User Story 3 - Logout y Expiracion (Priority: P1)

Como administrador, quiero cerrar mi sesion desde el panel para que ninguna otra persona con acceso al navegador pueda seguir usando mi cuenta, y quiero que la sesion expire automaticamente al cerrar el navegador.

**Why this priority**: Cierra el ciclo de vida de la sesion y cumple con la obligacion constitucional de expirar al cerrar el navegador.

**Independent Test**: Despues de un login, llamar `POST /api/auth/logout` debe invalidar la cookie y destruir la sesion PHP; llamadas posteriores a `/api/auth/me` deben devolver 401.

**Acceptance Scenarios**:
1. **Given** un admin autenticado, **When** pulsa el boton "Cerrar sesion" en el panel, **Then** el cliente llama `POST /api/auth/logout`, recibe 200, limpia la sesion local y redirige a `/admin/login`.
2. **Given** un admin que cerro el navegador, **When** vuelve a abrirlo y entra a `/admin`, **Then** la UI detecta que no hay sesion valida (`/api/auth/me` responde 401) y lo redirige a `/admin/login`.

---

### User Story 4 - Rate Limit y CSRF en Login (Priority: P2)

Como operador del sistema, quiero que el endpoint de login aplique rate limit por IP y que las operaciones no-idempotentes (logout) requieran token CSRF, para mitigar ataques de fuerza bruta y CSRF.

**Why this priority**: Es una obligacion constitucional del backend (rate limit + CSRF) y una salvaguarda basica de seguridad.

**Independent Test**: Despues de 5 intentos fallidos de login desde la misma IP en menos de 15 minutos, el sexto intento debe responder 429 con mensaje "Demasiados intentos".

**Acceptance Scenarios**:
1. **Given** 5 intentos fallidos de login en menos de 15 minutos desde la misma IP, **When** se realiza un sexto intento, **Then** el backend responde 429 con `{ok:false, error:"Demasiados intentos, reintente en X segundos"}`.
2. **Given** una sesion admin activa, **When** el cliente llama `POST /api/auth/logout` sin token CSRF, **Then** el backend responde 403 con error de CSRF.
3. **Given** un bloqueo activo por rate limit, **When** pasan 15 minutos, **Then** el siguiente intento de login se procesa normalmente.

---

### User Story 5 - Sembrar Admin Inicial (Priority: P2)

Como operador del despliegue, quiero un script PHP que cree el primer usuario admin solicitandome una contrasena robusta por linea de comandos, para inicializar el modulo admin de forma segura.

**Why this priority**: Es la unica forma operativa de crear el primer admin sin una pantalla de registro (que el alcance no incluye).

**Independent Test**: Ejecutar `php scripts/seed-admin.php` debe pedir email, nombre y contrasena (con confirmacion) por consola, hashear la contrasena con bcrypt y dejarla persistida en `usuarios_admin`.

**Acceptance Scenarios**:
1. **Given** el script `seed-admin.php` ejecutado por primera vez, **When** el operador ingresa email, nombre y contrasena dos veces, **Then** la contrasena se hashea con `password_hash(PASSWORD_BCRYPT)` y se guarda en la tabla `usuarios_admin`.
2. **Given** el script ejecutado con un email que ya existe, **When** confirma sobreescritura, **Then** el admin existente se actualiza con la nueva contrasena.
3. **Given** el script ejecutado, **When** las contrasenas no coinciden, **Then** el script aborta sin escribir en la BD y muestra un mensaje claro.

---

### Edge Cases

- Que pasa si el servidor MySQL no esta disponible al iniciar? El backend debe responder 503 en `/api/health` y el login no debe romper la UI.
- Que pasa si `XAMPP` sirve la app y el backend en paths distintos? Las cookies `SameSite=Strict` requieren mismo origen; documentar la configuracion esperada (todo bajo `htdocs/www/validador-deis-sso`).
- Que pasa si la sesion PHP expira por `session.gc_maxlifetime`? La UI debe limpiar la sesion local y redirigir a login sin pantalla en blanco.
- Que pasa si la contrasena enviada tiene menos de 8 caracteres? El backend responde 400 con mensaje claro; la UI muestra feedback en vivo.
- Que pasa si llegan dos requests de login simultaneos? PHP serializa por sesion; el segundo espera al primero y la BD no queda en estado inconsistente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST crear y mantener la tabla `usuarios_admin` mediante un script de migracion PHP idempotente, ejecutado antes de cualquier operacion de auth.
- **FR-002**: El sistema MUST exponer el endpoint `POST /api/auth/login` que valide email y contrasena, use `password_verify` y establezca una sesion PHP con cookie `HttpOnly`, `SameSite=Strict`.
- **FR-003**: El sistema MUST exponer `POST /api/auth/logout` que destruya la sesion actual, borre la cookie y devuelva 200.
- **FR-004**: El sistema MUST exponer `GET /api/auth/me` que devuelva el admin actual si la sesion es valida o 401 si no.
- **FR-005**: El sistema MUST exigir un token CSRF por sesion en todos los endpoints no-idempotentes (`POST /api/auth/logout` y futuros CRUD de reglas).
- **FR-006**: El sistema MUST aplicar rate limit en `POST /api/auth/login` de 5 intentos fallidos por IP cada 15 minutos, devolviendo 429 al exceder.
- **FR-007**: El sistema MUST sembrar el primer admin mediante `scripts/seed-admin.php` que solicite email, nombre y contrasena robusta por CLI.
- **FR-008**: La app React MUST añadir la ruta `/admin/login` con un formulario que pida email y contrasena, muestre errores en espanol y redirija a `/admin` al autenticarse.
- **FR-009**: La app React MUST anadir `AdminAuthContext` y `RequireAdmin` para proteger rutas `/admin/*`; cualquier ruta protegida sin sesion valida redirige a `/admin/login`.
- **FR-010**: La app React MUST mantener el flujo actual del validador (`home`, `results`, `cells`) sin regresiones: el modulo admin es un subtree aparte, no se mezcla con la logica de validacion.
- **FR-011**: Todo texto visible al usuario (formularios, mensajes, errores, documentacion) MUST estar en espanol.
- **FR-012**: El backend MUST usar PDO con prepared statements en todas las queries SQL; password MUST almacenarse con `password_hash(PASSWORD_BCRYPT)`.
- **FR-013**: El sistema MUST ejecutarse con `npm run build` sin errores y SHOULD incluir tests PHP para los endpoints de auth.
- **FR-014**: El sistema MUST funcionar en modo degradado: si el backend no responde, la app cliente sigue siendo utilizable para validar archivos sin admin (modo actual).

### Key Entities

- **usuarios_admin**: id, email (unico), password_hash (bcrypt), nombre, activo, ultimo_acceso, creado_en.
- **admin_session** (sesion PHP, no persistida): id, csrf_token, expires_at, ip_origen, user_agent, intentos_fallidos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un operador puede sembrar el primer admin y loguearse en menos de 2 minutos desde la primera ejecucion del script.
- **SC-002**: `POST /api/auth/login` con credenciales correctas responde en menos de 300 ms (servidor local XAMPP).
- **SC-003**: Tras 5 intentos fallidos consecutivos desde la misma IP, el sexto intento responde 429 sin llegar a la BD.
- **SC-004**: `npm run build` finaliza sin errores ni warnings criticos; `npm run test` mantiene los tests actuales pasando.
- **SC-005**: La UI de login es accesible via `/admin/login` y la sesion persiste durante la navegacion dentro de `/admin/*` hasta logout o cierre de navegador.
- **SC-006**: Toda la documentacion (este spec, plan, manual) esta en espanol; el codigo PHP mantiene identificadores tecnicos en ingles (composer-style).
- **SC-007**: La creacion del schema es reproducible: ejecutar `scripts/migrate.php` sobre una BD limpia deja las 5 tablas creadas sin errores.

## Assumptions

- El entorno del operador tiene XAMPP 8.x con PHP 8.1+ y MySQL/MariaDB 10.4+ corriendo.
- Apache sirve `htdocs/www/validador-deis-sso` y la app React se construye dentro de ese mismo path (modo actual).
- La app React y el backend PHP comparten origen (mismo host, mismo puerto), requisito para que la cookie `SameSite=Strict` funcione.
- El primer admin se siembra una sola vez por despliegue; el alcance MVP no incluye auto-registro, recuperacion de contrasena ni gestion multi-admin.
- El usuario admin es unico y se autentica con email + contrasena (sin 2FA, sin OAuth).
- `session.gc_maxlifetime` de PHP queda con su valor por defecto (1440 segundos = 24 minutos) o se ajusta a 30 minutos para sesiones admin.
- La constitucion v1.2.0 (PR #3) ya esta mergeada en main antes de cerrar este PR.
