# Implementation Plan: 003-B CRUD de Reglas y Publicacion

**Branch**: `003-b-crud-reglas` | **Date**: 2026-07-01 | **Spec**: `specs/003-b-crud-reglas/spec.md`

## Summary

Construir el CRUD de reglas en el panel admin (lista paginada con filtros, formulario con preview de expresiones, publicacion de versiones inmutables) y un script CLI para sembrar el contenido inicial desde `data/reglas_finales.json`. El validador publico NO se ve afectado: sigue cargando `data/reglas_finales.json` localmente.

## Technical Context

- **Language/Version**: PHP 8.1+ (backend), TypeScript + React 19 + Vite (frontend).
- **Primary Dependencies**: PHP PDO, MySQL/MariaDB, sesion PHP con CSRF, xlsx (no se usa aqui), Vitest.
- **Storage**: MySQL/MariaDB (XAMPP) - tablas `reglas`, `reglas_versiones`, `reglas_audit` (ya creadas en 003-A).
- **Testing**: `scripts/test-reglas.php` con escenarios HTTP + tests Vitest para cliente TS.
- **Target Platform**: XAMPP + navegador.
- **Project Type**: SPA con backend PHP minimo, mismo repo.
- **Performance Goals**: Listar < 300 ms, crear < 200 ms, publicar < 500 ms.
- **Constraints**: Constitucion v1.2.0, sin framework PHP, UI en espanol, sin envio de contenido REM al backend.
- **Scale/Scope**: ~100-200 reglas MVP, unico admin, sin RBAC granular.

## Constitution Check

- **I.a Privacidad Local con Auditoria Opcional**: Pasa. No se envia contenido REM. Solo se trabaja sobre metadata de reglas.
- **IV Calidad Verificable**: Pasa. Tests PHP para endpoints CRUD, tests Vitest para cliente TS, build obligatorio.
- **VI Modulo de Administracion**: Pasa. CRUD de reglas con auth, CSRF, audit de cambios.
- **V Espanol Obligatorio**: Pasa. UI y mensajes en espanol.

**Sin violaciones constitucionales.**

## Project Structure

### Documentation

```text
specs/003-b-crud-reglas/
├── spec.md
├── plan.md
├── tasks.md
└── checklists/
    └── requirements.md
```

### Source Code

```text
api/
├── models/
│   ├── Regla.php                  # NUEVO
│   ├── ReglaVersion.php           # NUEVO
│   └── ReglasAudit.php            # NUEVO
├── controllers/
│   ├── ReglasController.php       # NUEVO (list, get, create, update, delete, activar)
│   └── ReglasVersionesController.php  # NUEVO (versiones, publicar, actual)
└── lib/
    └── RuleValidator.php          # NUEVO (validacion de payloads CRUD)

scripts/
├── import-reglas-initial.php      # NUEVO (carga data/reglas_finales.json -> BD)
└── test-reglas.php                # NUEVO (>=6 escenarios HTTP)

src/api/
└── reglas.ts                      # NUEVO (list, get, create, update, delete, activar, publicar, actual, versiones)

admin/
├── AdminApp.tsx                   # MODIFICADO: router completo
├── pages/
│   ├── LoginPage.tsx              # ya existe
│   ├── DashboardPage.tsx          # NUEVO (resumen + accesos)
│   ├── ReglasListPage.tsx         # NUEVO
│   ├── ReglaEditPage.tsx          # NUEVO (alta + edicion)
│   └── PublicarPage.tsx           # NUEVO (diff + publicar)
└── components/
    ├── ReglaForm.tsx              # NUEVO
    ├── SeveridadPicker.tsx        # NUEVO
    ├── OperadorPicker.tsx         # NUEVO
    ├── ExpresionInput.tsx         # NUEVO
    ├── ExpresionPreview.tsx       # NUEVO
    ├── MultiSelectTipos.tsx       # NUEVO
    ├── MultiSelectEstablecimientos.tsx  # NUEVO
    └── DiffViewer.tsx             # NUEVO (diff antes/despues)
```

## Complexity Tracking

Sin violaciones. La estructura es la minima viable para un CRUD con versionado.

## Implementation Stages

### Etapa 1 - Modelos PHP y ReglaValidator

**Objetivo:** Capa de acceso a datos para reglas, versiones y audit. Validacion de payloads.

**Entregables:**
- `api/models/Regla.php` con `list(filtros)`, `findByReglaId`, `create`, `update`, `deactivate`, `activate`, `reglaIdExists`.
- `api/models/ReglaVersion.php` con `list`, `findLatest`, `findByVersion`, `create`, `nextSemver`.
- `api/models/ReglasAudit.php` con `record`, `list`.
- `api/lib/RuleValidator.php` con `validateCreate`, `validateUpdate`.

**Estado:** Pendiente.

### Etapa 2 - Controllers PHP

**Objetivo:** Endpoints REST del CRUD + publicacion.

**Entregables:**
- `api/controllers/ReglasController.php`: `list`, `get`, `create`, `update`, `deactivate`, `activate`.
- `api/controllers/ReglasVersionesController.php`: `versiones`, `publicar`, `actual` (publico).
- Rutas registradas en `api/index.php`.

**Estado:** Pendiente.

### Etapa 3 - Script de importacion inicial

**Objetivo:** Cargar `data/reglas_finales.json` a la BD con la primera publicacion automatica.

**Entregables:**
- `scripts/import-reglas-initial.php` con flag `--reset` opcional.
- `scripts/test-reglas.php` con >= 6 escenarios HTTP (login admin, listar, crear, editar, desactivar, publicar, importar, GET /api/reglas/actual publico).

**Estado:** Pendiente.

### Etapa 4 - Cliente TS y servicios API

**Objetivo:** Wrapper HTTP del CRUD + helpers de tipado.

**Entregables:**
- `src/api/reglas.ts` con funciones `list`, `get`, `create`, `update`, `deactivate`, `activate`, `versiones`, `publicar`, `actual` y tipos `Regla`, `ReglaVersion`, `ReglaPayload`.
- Test Vitest `src/api/reglas.test.ts`.

**Estado:** Pendiente.

### Etapa 5 - UI: lista, formulario, publicar

**Objetivo:** Pantallas admin funcionales y componentes reusables.

**Entregables:**
- `admin/AdminApp.tsx` actualizado con sub-router (HashRouter) para `/admin/login`, `/admin`, `/admin/reglas`, `/admin/reglas/nueva`, `/admin/reglas/:id`, `/admin/publicar`.
- `admin/pages/ReglasListPage.tsx` con tabla paginada, filtros arriba, badges, acciones por fila.
- `admin/pages/ReglaEditPage.tsx` con `ReglaForm` (secciones: Identidad, Expresion, Alcance y flags).
- `admin/pages/PublicarPage.tsx` con `DiffViewer` entre el draft actual y la ultima publicacion.
- Componentes auxiliares: `ReglaForm`, `SeveridadPicker`, `OperadorPicker`, `ExpresionInput`, `ExpresionPreview`, `MultiSelectTipos`, `MultiSelectEstablecimientos`, `DiffViewer`.
- Test Vitest para `ReglaForm` (no DOM real, solo logica pura del modelo de reglas).

**Estado:** Pendiente.

### Etapa 6 - Verificacion y PR

**Objetivo:** Cerrar la feature con PR limpio.

**Entregables:**
- `npm test` verde con tests nuevos.
- `php scripts/test-reglas.php` aprueba >= 6 escenarios.
- `php scripts/import-reglas-initial.php --reset` deja la BD poblada.
- `npm run build` sin errores.
- Documentacion actualizada: `MANUAL_ADMIN.md` (seccion CRUD y publicacion), `AGENTS.md`, `README.md`.
- PR via `gh` con la plantilla del repo.

**Estado:** Pendiente.

## Risk Register

| Riesgo | Impacto | Mitigacion |
|---|:---:|---|
| `expresion_2` viene como numero, string o null desde el JSON | Alto | `RuleValidator` fuerza conversion a JSON con tipo explicito (string, number, null). |
| Publicar una version con cero reglas activas rompe el bundle del cliente | Alto | Backend rechaza publicacion vacia con 400 y mensaje claro. |
| Auditoria crece sin limite | Bajo | Mantener 90 dias; limpieza via script `scripts/cleanup-audit.php` (futuro). |
| El admin publica una regla con `expresion_1` que el validador no parsea | Medio | Documentar operadores y patrones en el formulario. Tests Vitest del parser existentes (ya verde). |
| Soft-delete deja referencias huerfanas en versiones publicadas | Bajo | Las versiones son snapshots inmutables; no se modifican al desactivar. |

## Verification Plan

1. `php scripts/migrate.php` (ya hecho en 003-A).
2. `php scripts/import-reglas-initial.php --reset` carga todas las reglas y crea la primera publicacion.
3. `php scripts/test-reglas.php` aprueba los 6 escenarios HTTP.
4. `npm test` mantiene los 65 tests previos + nuevos tests de `reglas.ts`.
5. `npm run build` sin errores.
6. Manual: login admin -> `/admin/reglas` -> crear regla -> editar -> desactivar -> publicar -> ver en `/admin/publicar`.
7. Manual: `GET /api/reglas/actual` responde 200 con el bundle de la ultima publicacion.
