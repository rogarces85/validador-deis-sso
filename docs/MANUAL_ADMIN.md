# Manual del Panel de Administracion

> Guia operativa para sembrar y usar el modulo admin del Validador DEIS SSO.

## Alcance

Esta guia cubre las **Features 003-A y 003-B**:
- 003-A: backend PHP+MySQL, autenticacion con email y contrasena, unico rol `admin`, ruta `/admin/login` y proteccion CSRF.
- 003-B: CRUD de reglas (lista paginada, formulario con preview, publicacion de versiones).

La feature 003-C (auditoria no clinica y estadisticas) se entregara en un PR posterior y se documentara aqui cuando corresponda.

## Requisitos

- XAMPP 8.x corriendo en `localhost` (Apache + MySQL/MariaDB).
- PHP 8.1+ con extension `pdo_mysql` habilitada.
- Node 18+ para construir la app React (solo necesario para `npm run build`).
- Composer **no** es necesario: el backend es PHP nativo sin dependencias externas.

## Configuracion inicial

### 0) Configurar credenciales de la base de datos

Los valores por defecto apuntan al servidor MySQL/MariaDB del Servicio de Salud:

- Host: `10.8.152.199`
- Puerto: `3306`
- Base de datos: `validador_rem`
- Usuario: `root`

**Importante: la contrasena NO se guarda en el repositorio.** Configurela mediante la variable de entorno `DB_PASS` antes de cualquier operacion (migracion, siembra, tests, requests al backend).

```bash
# Opcion A: archivo .env (Apache lo lee automaticamente con SetEnv)
Copy-Item .env.example .env
# Edite .env y complete DB_PASS=...

# Opcion B: variable de entorno en la sesion PowerShell
$env:DB_HOST="10.8.152.199"
$env:DB_PORT="3306"
$env:DB_NAME="validador_rem"
$env:DB_USER="root"
$env:DB_PASS="su-clave-mysql"
```

Si la conexion falla, valide primero con un cliente MySQL:

```bash
mysql -h 10.8.152.199 -P 3306 -u root -p validador_rem
```

### 1. Crear la base de datos y las tablas

```bash
php scripts/migrate.php
```

Crea (si no existe) la base de datos `validador_rem` y las 6 tablas:

- `usuarios_admin`
- `reglas`
- `reglas_versiones`
- `reglas_audit`
- `audit_log`
- `rate_limit` (auxiliar)

La migracion es **idempotente**: puede ejecutarse varias veces sin error.

Si necesita apuntar a otro servidor, exporte las variables de entorno antes de invocar el script (ver seccion 0).

### 2. Sembrar el primer administrador

```bash
php scripts/seed-admin.php
```

El script pedira por consola:

- Correo electronico (formato valido).
- Nombre visible (2 a 120 caracteres).
- Contrasena (minimo 8 caracteres, se pide confirmacion).

La contrasena se almacena con `password_hash(PASSWORD_BCRYPT, cost: 12)`.

Si el correo ya existe, el script pedira la contrasena actual para autorizar el cambio.

### 3. Construir y servir la app

```bash
npm install
npm run build
```

El bundle queda en `dist/`. El validador y el backend deben servirse desde el **mismo origen** (mismo host y puerto) para que las cookies `SameSite=Strict` funcionen.

#### Opcion A: Apache sirve todo (recomendado para produccion)

1. Copia el contenido de `dist/` sobre `C:\xampp\htdocs\www\validador-deis-sso\`.
2. Asegurate de que `api/.htaccess` este presente (lo crea este PR).
3. Accede a `http://localhost/www/validador-deis-sso/`.

#### Opcion B: Vite dev server con proxy (desarrollo)

```bash
npm run dev
```

Vite expone la app en `http://localhost:3000/` y hace proxy de `/api/*` a Apache en `http://localhost/`. En este modo las cookies funcionan porque el navegador ve un mismo origen (`localhost:3000`).

## Acceso

| URL | Proposito |
|---|---|
| `http://localhost/www/validador-deis-sso/admin/login` | Pantalla de login del admin |
| `http://localhost/www/validador-deis-sso/admin` | Inicio del panel (placeholder en 003-A) |
| `http://localhost/www/validador-deis-sso/` | Validador publico (sin cambios) |

Tras login exitoso, la sesion se guarda en una cookie `deis_admin_session` con:

- `HttpOnly`: true (no accesible desde JavaScript)
- `SameSite=Strict` (solo se envia en requests same-site)
- `Secure`: true si Apache sirve por HTTPS

La sesion **expira al cerrar el navegador** (`sessionStorage` en cliente + cookies de sesion PHP).

## Endpoints disponibles

| Metodo | Path | Auth | Descripcion |
|---|---|---|---|
| GET | `/api/health` | publico | Health check (verifica BD) |
| GET | `/api/auth/csrf` | publico | Devuelve token CSRF actual |
| POST | `/api/auth/login` | publico | Login (rate-limited) |
| GET | `/api/auth/me` | sesion | Datos del admin actual |
| POST | `/api/auth/logout` | sesion + CSRF | Cierra sesion |

### Ejemplo con curl

```bash
# 1) Health
curl http://localhost/www/validador-deis-sso/api/health

# 2) Login (guardar cookies en jar)
curl -c jar.txt -X POST http://localhost/www/validador-deis-sso/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sso.local","password":"su-clave"}'

# 3) Me (reusar cookies)
curl -b jar.txt http://localhost/www/validador-deis-sso/api/auth/me

# 4) Logout (reusar cookies + token CSRF)
curl -b jar.txt -X POST http://localhost/www/validador-deis-sso/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <token-del-login>" \
  -d '{}'
```

## Seguridad

- **Rate limit**: `POST /api/auth/login` acepta 5 intentos fallidos por IP cada 15 minutos. El sexto intento responde 429.
- **CSRF**: `POST /api/auth/logout` (y futuros endpoints no-idempotentes) requieren token CSRF en el header `X-CSRF-Token` o en el body como `csrf_token`.
- **Contrasena**: minima 8 caracteres, hasheada con bcrypt cost 12.
- **Sesion**: se regenera el ID al login (anti fixation) y se destruye al logout.
- **Headers de respuesta**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: same-origin`.

## Verificacion automatizada

```bash
# Ejecuta los 8 escenarios del script de pruebas PHP
npm run test:auth

# Ejecuta los 12 escenarios del CRUD de reglas + publicacion
npm run test:reglas

# Sembrar las reglas desde data/reglas_finales.json a la BD
npm run import:reglas
```

`test:auth` crea (si no existe) un admin de pruebas con `email: admin@test.local` y `password: test1234` y valida los endpoints via HTTP.

`test:reglas` valida 12 escenarios end-to-end: login, listar reglas, GET publico, crear, duplicado -> 409, validacion -> 400, editar, desactivar, activar, publicar, historial de versiones y reflejo publico.

## CRUD de Reglas (Feature 003-B)

### Importar reglas iniciales

Tras mergear 003-B, las reglas aun no estan en la BD. Para cargarlas desde `data/reglas_finales.json`:

```bash
npm run import:reglas          # carga si la BD esta vacia
npm run import:reglas -- --reset   # limpia y reimporta
```

Esto crea las reglas en la tabla `reglas` con `activo=1` y publica la primera version `1.0.0-reglas`.

### Pantallas disponibles

| URL | Proposito |
|---|---|
| `/admin` | Dashboard con conteos y accesos rapidos |
| `/admin/reglas` | Listado paginado con filtros (serie, severidad, busqueda) |
| `/admin/reglas/nueva` | Formulario de creacion con preview de expresiones |
| `/admin/reglas/:regla_id` | Formulario de edicion con preview de expresiones |
| `/admin/publicar` | Publicar nueva version + historial |

### Formulario de regla

El formulario se divide en 4 secciones colapsables:

1. **Identidad** - `regla_id` (unico, no editable en update), `serie` (A/P), `rem_sheet`, `tipo`.
2. **Expresion de comparacion** - `expresion_1`, `operador` (chips), `expresion_2`. La vista previa muestra una descripcion humana (ej. "Suma el rango C21:C36").
3. **Severidad y mensaje** - `severidad` (chips), `mensaje` humano.
4. **Alcance y flags** (avanzado, contraido por defecto) - `aplicar_a_tipo`, `excluir_tipo`, `aplicar_a`, `establecimientos_excluidos`, toggles para `omitir_si_*` y `validacion_exclusiva`.

### Publicar una version

1. Ve a `/admin/publicar`.
2. Escribe una nota de release (opcional, max 1000 chars).
3. Pulsa "Publicar nueva version".
4. El sistema crea una fila en `reglas_versiones` con un semver autoincrementado (ej. `1.0.0-reglas`, `1.0.1-reglas`).

Tras publicar, `GET /api/reglas/actual` (publico) refleja la nueva version. La sincronizacion con el validador (banner de "Hay nuevas reglas") se implementa en 003-C.

## Endpoints de la API

| Metodo | Path | Auth | Descripcion |
|---|---|---|---|
| GET | `/api/health` | publico | Health check (verifica BD) |
| GET | `/api/auth/csrf` | publico | Devuelve token CSRF actual |
| POST | `/api/auth/login` | publico | Login (rate-limited) |
| GET | `/api/auth/me` | sesion | Datos del admin actual |
| POST | `/api/auth/logout` | sesion + CSRF | Cierra sesion |
| GET | `/api/reglas` | sesion | Lista reglas (filtros: `serie`, `severidad`, `q`, `incluir_desactivadas`, `page`, `perPage`) |
| GET | `/api/reglas/:regla_id` | sesion | Detalle de una regla |
| POST | `/api/reglas` | sesion + CSRF | Crear regla |
| PUT | `/api/reglas/:regla_id` | sesion + CSRF | Editar regla |
| DELETE | `/api/reglas/:regla_id` | sesion + CSRF | Soft-delete (desactivar) |
| POST | `/api/reglas/:regla_id/activar` | sesion + CSRF | Reactivar regla |
| GET | `/api/reglas/versiones` | sesion | Historial de publicaciones |
| POST | `/api/reglas/publicar` | sesion + CSRF | Publicar nueva version |
| GET | `/api/reglas/actual` | **publico** | Bundle de la ultima publicacion |

## Solucion de problemas

## Solucion de problemas

### El login devuelve 401 y la contrasena es correcta

- Verifica que `php scripts/migrate.php` se haya ejecutado.
- Verifica que `php scripts/seed-admin.php` haya creado el admin con el correo que usas.
- Verifica que la variable de entorno `DB_PASS` este definida y sea correcta.
- Abre `http://localhost/www/validador-deis-sso/api/health` y confirma 200.

### El backend no se conecta a la base de datos remota

- Verifica que el host `10.8.152.199` sea alcanzable desde la maquina donde corre Apache: `Test-NetConnection 10.8.152.199 -Port 3306`.
- Verifica que el usuario `root` tenga permisos para crear la BD `validador_rem` (la primera ejecucion requiere `CREATE DATABASE`).
- Verifica que el puerto `3306` no este bloqueado por un firewall.

### La importacion de reglas falla con "Data too long"

`expresion_1` esta limitada a 255 chars. Algunas reglas del JSON de origen tienen expresiones compuestas muy largas; el script las trunca con un warning y el admin debe revisarlas en el panel antes de publicar.

### El listado de reglas aparece vacio tras mergear 003-B

Ejecuta `npm run import:reglas` para cargar las reglas desde `data/reglas_finales.json` a la BD. El bundle `data/reglas_finales.json` sigue siendo la fuente canonica para la primera importacion; cambios posteriores van por el panel.

### El frontend no se conecta al backend

- En `vite.config.ts` el proxy apunta a `http://localhost`. Si Apache usa otro puerto, ajustalo.
- En produccion, verifica que `api/.htaccess` este presente y que Apache tenga `mod_rewrite` habilitado.

### Rate limit activado

Espera 15 minutos o reinicia MySQL (la tabla `rate_limit` se vacia). Para resetear manualmente:

```sql
DELETE FROM rate_limit;
```

### Sesion se cierra al cambiar de pestana

Es el comportamiento esperado: la sesion PHP expira por inactividad (default 30 minutos) y se pierde al cerrar el navegador. Si necesitas sesiones persistentes, documentalo para una futura feature.
