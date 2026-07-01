# Manual del Panel de Administracion

> Guia operativa para sembrar y usar el modulo admin del Validador DEIS SSO.

## Alcance

Esta guia cubre la **Feature 003-A**: backend PHP+MySQL, autenticacion con email y contrasena, unico rol `admin`, ruta `/admin/login` y proteccion CSRF.

Las features 003-B (CRUD de reglas) y 003-C (auditoria no clinica) se entregaran en PRs separados y se documentaran aqui cuando corresponda.

## Requisitos

- XAMPP 8.x corriendo en `localhost` (Apache + MySQL/MariaDB).
- PHP 8.1+ con extension `pdo_mysql` habilitada.
- Node 18+ para construir la app React (solo necesario para `npm run build`).
- Composer **no** es necesario: el backend es PHP nativo sin dependencias externas.

## Configuracion inicial

### 1. Crear la base de datos y las tablas

```bash
# desde la raiz del proyecto
php scripts/migrate.php
```

Esto crea (si no existe) la base de datos `validador_deis_admin` y las 5 tablas:

- `usuarios_admin`
- `reglas`
- `reglas_versiones`
- `reglas_audit`
- `audit_log`
- `rate_limit` (auxiliar)

La migracion es **idempotente**: puede ejecutarse varias veces sin error.

Para apuntar a otra base de datos o credenciales, exporta variables de entorno antes:

```bash
# PowerShell
$env:DB_HOST="127.0.0.1"
$env:DB_PORT="3306"
$env:DB_NAME="mi_base"
$env:DB_USER="mi_usuario"
$env:DB_PASS="mi_clave"
php scripts/migrate.php
```

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
```

Esto crea (si no existe) un admin de pruebas con `email: admin@test.local` y `password: test1234` y valida los endpoints via HTTP.

## Solucion de problemas

### El login devuelve 401 y la contrasena es correcta

- Verifica que `php scripts/migrate.php` se haya ejecutado.
- Verifica que `php scripts/seed-admin.php` haya creado el admin con el correo que usas.
- Abre `http://localhost/www/validador-deis-sso/api/health` y confirma 200.

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
