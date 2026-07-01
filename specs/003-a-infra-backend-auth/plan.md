# Implementation Plan: 003-A Infra Backend y Auth Admin

**Branch**: `003-a-infra-backend-auth` | **Date**: 2026-07-01 | **Spec**: `specs/003-a-infra-backend-auth/spec.md`

## Summary

Levantar el backend PHP+MySQL sobre XAMPP con autenticacion real de administrador (email+contrasena) y anadir la ruta `/admin/login` en la app React con un contexto de sesion. Esta feature **no toca** el motor de validacion ni el bundle de reglas: el validador sigue funcionando identicamente, con o sin backend disponible.

## Technical Context

- **Language/Version**: PHP 8.1+ nativo (sin framework), TypeScript con React 19 y Vite en el cliente.
- **Primary Dependencies**: PHP PDO/MySQL, `password_hash`/`password_verify`, sesiones PHP nativas. Cliente: React 19, Vite 6, Vitest.
- **Storage**: MySQL/MariaDB (XAMPP) - tabla `usuarios_admin` + sesiones PHP efimeras. Tablas adicionales (`reglas`, `reglas_versiones`, `reglas_audit`, `audit_log`) se crean pero no se usan en esta feature.
- **Testing**: Script PHP `scripts/test-auth.php` con assertions nativas + `npm test` para frontend.
- **Target Platform**: Servidor XAMPP local (Apache + MySQL) + navegador.
- **Project Type**: Aplicacion web frontend con backend PHP minimo en mismo repo.
- **Performance Goals**: Login < 300 ms, `me` < 100 ms, sin impacto perceptible en el bundle del validador.
- **Constraints**: Procesamiento local del archivo REM intacto; backend opcional (modo degradado); constitucion v1.2.0 ya mergeada; sin frameworks PHP (solo PDO y `password_*`); UI en espanol.
- **Scale/Scope**: Un unico admin (MVP); el CRUD multi-admin queda fuera hasta 003-B.

## Constitution Check

- **I.a Privacidad Local con Auditoria Opcional**: Pasa. Esta feature no toca el contenido del archivo REM. La auditoria de uso (003-C) es futura.
- **IV Calidad Verificable**: Pasa si se incluye `scripts/test-auth.php` con cobertura de happy path, credenciales invalidas, rate limit y CSRF. `npm run build` obligatorio.
- **VI Modulo de Administracion**: Pasa - define email+contrasena, rol unico `admin`, expiracion al cerrar navegador, CSRF en logout.
- **VII Registro de Auditoria No Clinica**: No aplica todavia (feature 003-C).
- **V Espanol Obligatorio**: Pasa - UI login en espanol, mensajes de error en espanol.

**Sin violaciones constitucionales.**

## Project Structure

### Documentation

```text
specs/003-a-infra-backend-auth/
├── spec.md
├── plan.md
├── tasks.md
└── checklists/
    └── requirements.md
```

### Source Code

```text
api/
├── index.php                          # router
├── bootstrap.php                      # PDO, sesion, helpers
├── .htaccess                          # protege acceso directo
├── middleware/
│   ├── auth.php                       # RequireAuth, RequireCsrf
│   ├── ratelimit.php                  # token bucket por IP
│   └── cors.php                       # CORS same-origin
├── controllers/
│   ├── AuthController.php             # login, logout, me
│   └── HealthController.php           # /api/health
├── models/
│   └── UsuarioAdmin.php               # queries de admin
└── lib/
    ├── Response.php                   # json helpers
    ├── Validator.php                  # validacion de payloads
    └── Csrf.php                       # token CSRF por sesion

scripts/
├── migrate.php                        # crea 5 tablas (idempotente)
├── seed-admin.php                     # siembra primer admin via CLI
└── test-auth.php                      # tests manuales del endpoint

src/api/
├── client.ts                          # fetch wrapper
└── auth.ts                            # login, logout, me

src/admin/
├── AdminAuthContext.tsx
├── RequireAdmin.tsx
├── AdminApp.tsx
└── pages/
    └── LoginPage.tsx

src/
├── admin-router.tsx                   # integra rutas /admin en App
└── App.tsx                            # (modificado: branch admin)
```

## Complexity Tracking

No hay violaciones; la estructura es la minima viable.

## Implementation Stages

### Etapa 1 - Schema y Bootstrap

**Objetivo:** Crear las 5 tablas, conexion PDO, router, helpers, .htaccess.

**Entregables:**
- `scripts/migrate.php` idempotente.
- `api/bootstrap.php` con PDO, sesion segura, headers JSON.
- `api/lib/Response.php`, `api/lib/Validator.php`, `api/lib/Csrf.php`.
- `api/middleware/auth.php`, `api/middleware/ratelimit.php`, `api/middleware/cors.php`.
- `api/index.php` router minimal.
- `api/.htaccess` que niega acceso directo a PHP fuera del router.

**Estado:** Pendiente.

### Etapa 2 - AuthController y Modelo

**Objetivo:** Endpoints `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`.

**Entregables:**
- `api/models/UsuarioAdmin.php` (findByEmail, updateLastAccess, updatePasswordHash).
- `api/controllers/AuthController.php` con login/logout/me usando los middlewares.

**Estado:** Pendiente.

### Etapa 3 - Seed Admin

**Objetivo:** Script CLI para crear el primer admin.

**Entregables:**
- `scripts/seed-admin.php` con readline, validacion, bcrypt, confirmacion de contrasena.

**Estado:** Pendiente.

### Etapa 4 - Frontend (Login + Context + Guard)

**Objetivo:** Pantalla de login, contexto de sesion, guard de rutas.

**Entregables:**
- `src/api/client.ts` con baseURL `/api`, manejo de cookies, CSRF token.
- `src/api/auth.ts` (login, logout, me).
- `src/admin/AdminAuthContext.tsx` con sessionStorage.
- `src/admin/RequireAdmin.tsx` que llama `/api/auth/me` antes de renderizar.
- `src/admin/pages/LoginPage.tsx` con formulario en espanol.
- `src/admin/AdminApp.tsx` con sub-router.
- `src/admin-router.tsx` integrado en `App.tsx`.

**Estado:** Pendiente.

### Etapa 5 - Tests y Verificacion

**Objetivo:** Cubrir happy path + edge cases.

**Entregables:**
- `scripts/test-auth.php`: 7 escenarios (login OK, login fail, me, logout, CSRF fail, rate limit, contrasena corta).
- `npm test` para `client.ts` y `AdminAuthContext` (con msw si aplica).
- `npm run build` debe pasar.

**Estado:** Pendiente.

### Etapa 6 - Documentacion y PR

**Objetivo:** Cerrar feature con PR limpio.

**Entregables:**
- `docs/MANUAL_ADMIN.md` (guia rapida: sembrar admin, login, logout).
- `AGENTS.md` actualizado con la nueva arquitectura.
- `README.md` con seccion "Panel de administracion" minima.
- PR via `gh` con la plantilla del repo.

**Estado:** Pendiente.

## Risk Register

| Riesgo | Impacto | Mitigacion |
|---|:---:|---|
| Sesion PHP expira por GC y deja al usuario en pantalla en blanco | Medio | Frontend maneja 401 global y redirige a `/admin/login` |
| Cookie `SameSite=Strict` falla si API y app viven en origen distinto | Alto | Documentar y exigir mismo origen; `.htaccess` configura `Set-Cookie` en mismo path |
| `password_hash` con cost bajo permite brute force | Bajo | Forzar cost >= 10 en `seed-admin.php` |
| Migracion rompe la BD si se corre dos veces | Bajo | `CREATE TABLE IF NOT EXISTS` + `SHOW TABLES` check |
| CSRF token no se propaga en logout por bug en cliente | Bajo | Tests PHP y TS obligatorios; cookie `deis_csrf` separada |
| Bundle React crece al agregar admin | Bajo | Lazy load del sub-app admin + code splitting por ruta |

## Verification Plan

1. `php scripts/migrate.php` sobre BD limpia -> 5 tablas creadas.
2. `php scripts/seed-admin.php` -> admin sembrado.
3. `php scripts/test-auth.php` -> todos los escenarios en verde.
4. `npm install && npm run build` -> bundle OK sin warnings.
5. `npm test` -> tests existentes pasando.
6. Manual: abrir `http://localhost/www/validador-deis-sso/admin/login`, login OK, navegar a `/admin` (placeholder), logout.
7. Manual: login fallido 6 veces -> 429 en el sexto.
8. Manual: cerrar y reabrir navegador -> `/admin` redirige a login.
