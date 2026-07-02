# Implementation Plan: 003-C Auditoria No Clinica y Estadisticas

**Branch**: `003-c-auditoria-estadisticas` | **Date**: 2026-07-01 | **Spec**: `specs/003-c-auditoria-estadisticas/spec.md`

## Summary

Cerrar el ciclo del modulo admin emitiendo eventos no clinicos al backend cada vez que el validador termina una validacion, ofreciendo al admin una tabla y estadisticas agregadas en el panel, y manteniendo el bundle de reglas sincronizado con un banner.

## Technical Context

- **Language/Version**: PHP 8.1+ (backend), TypeScript + React 19 + Vite (frontend).
- **Primary Dependencies**: PHP PDO, MySQL, IndexedDB nativo (cliente), Vitest, mismo stack que 003-A/003-B.
- **Storage**: MySQL/MariaDB (XAMPP) - tabla `audit_log` (ya creada en 003-A), IndexedDB (cliente).
- **Testing**: `scripts/test-audit.php` con escenarios HTTP + tests Vitest.
- **Target Platform**: XAMPP + navegador.
- **Project Type**: SPA con backend PHP minimo, mismo repo.
- **Performance Goals**: POST /api/audit fire-and-forget, GET /api/audit < 500ms, stats < 1s.
- **Constraints**: Constitucion v1.2.0, sin framework PHP, sin envio de contenido REM, UI en espanol.
- **Scale/Scope**: ~100-1000 validaciones/dia, MVP, unico admin, sin RBAC granular.

## Constitution Check

- **I.a Privacidad Local con Auditoria Opcional**: Pasa. La feature implementa exactamente la auditoria opcional que el principio define. Lista blanca estricta de campos.
- **IV Calidad Verificable**: Pasa. Tests PHP + Vitest, build obligatorio.
- **VI Modulo de Administracion**: Pasa. Endpoints de consulta de audit protegidos por RequireAuth.
- **VII Registro de Auditoria No Clinica**: Pasa. La feature IMPLEMENTA este principio.

**Sin violaciones constitucionales.**

## Project Structure

### Documentation

```text
specs/003-c-auditoria-estadisticas/
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
│   └── AuditLog.php                       # NUEVO
├── controllers/
│   └── AuditController.php                # NUEVO (post publico, get admin, estadisticas admin)
└── lib/
    └── AuditQueueValidator.php            # NUEVO (lista blanca + rate limit)

scripts/
└── test-audit.php                         # NUEVO (>= 5 escenarios HTTP)

src/api/
└── audit.ts                                # NUEVO (post, list, estadisticas)

src/hooks/
└── useRulesVersion.ts                      # NUEVO (chequeo version al iniciar + alerta)

src/lib/
└── auditQueue.ts                            # NUEVO (IndexedDB queue con retry y TTL)

admin/
├── AdminApp.tsx                            # MODIFICADO: agregar /admin/auditoria
├── AdminLayout.tsx                         # MODIFICADO: agregar link Auditoria
├── pages/
│   └── AuditoriaPage.tsx                   # NUEVO
└── components/
    ├── StatCard.tsx                        # NUEVO
    └── AuditoriaFilters.tsx                # NUEVO

components/
└── FileDropzone.tsx                         # MODIFICADO: banner de sincronizacion
```

## Complexity Tracking

Sin violaciones. Estructura minima para feature declarativa.

## Implementation Stages

### Etapa 1 - Backend PHP: AuditLog + Controller

**Objetivo:** Endpoint POST /api/audit publico, GET /api/audit admin, GET /api/audit/estadisticas admin.

**Entregables:**
- `api/models/AuditLog.php` con `create`, `list(filtros, page, perPage)`, `stats(filtros)`, `countByIP`, `pruneOld`.
- `api/lib/AuditQueueValidator.php` con `validate(array)` que aplica lista blanca de campos y rate limit.
- `api/controllers/AuditController.php` con `create` (publico, rate limit), `list` (admin, pag, filtros), `stats` (admin).
- Rutas en `api/index.php`.
- Requires en `api/bootstrap.php`.

**Estado:** Pendiente.

### Etapa 2 - Script de tests PHP

**Objetivo:** Validar los 3 endpoints via HTTP.

**Entregables:**
- `scripts/test-audit.php` con >= 5 escenarios: POST valido, POST con campos prohibidos, GET admin, GET estadisticas, rate limit.

**Estado:** Pendiente.

### Etapa 3 - Cliente TS: audit.ts + queue IndexedDB

**Objetivo:** Cliente HTTP + cola local con retry.

**Entregables:**
- `src/api/audit.ts` con `post(event)`, `list(filtros)`, `stats(filtros)`.
- `src/lib/auditQueue.ts` con `enqueue`, `flush`, `prune`, `count`, `TTL_DAYS = 7`, `MAX_SIZE = 500`. Almacenamiento en IndexedDB `validador_deis/audit_queue`.
- `src/hooks/useRulesVersion.ts` con `currentVersion`, `latestVersion` (consulta `/api/reglas/actual`), `applyLatest()` (descarga bundle + cache IndexedDB).
- Tests Vitest para `audit.ts` (4 tests) y `auditQueue.ts` (3 tests).

**Estado:** Pendiente.

### Etapa 4 - Frontend: AuditoriaPage + StatCard + Filters

**Objetivo:** Pagina admin con tabla y estadisticas.

**Entregables:**
- `admin/components/StatCard.tsx` (titulo + valor + subtitulo + variacion opcional).
- `admin/components/AuditoriaFilters.tsx` (rango fechas, serie, establecimiento).
- `admin/pages/AuditoriaPage.tsx` (4 StatCards arriba + tabla + filtros + paginacion).
- `admin/AdminLayout.tsx`: agregar link "Auditoria" en sidebar.
- `admin/AdminApp.tsx`: agregar ruta `/admin/auditoria`.

**Estado:** Pendiente.

### Etapa 5 - Integracion con validador

**Objetivo:** Que el validador envie el evento y muestre banner de sincronizacion.

**Entregables:**
- `hooks/useValidationPipeline.ts`: al terminar la validacion, llamar `auditQueue.enqueue(payload)` + `auditQueue.flush()`.
- `components/FileDropzone.tsx`: usar `useRulesVersion` para mostrar banner con boton "Actualizar reglas".
- `app.tsx`: invocar `useRulesVersion` al montar.

**Estado:** Pendiente.

### Etapa 6 - Verificacion y PR

**Objetivo:** Cerrar la feature con PR limpio.

**Entregables:**
- `npm test` verde con tests nuevos.
- `php scripts/test-audit.php` aprueba >= 5 escenarios.
- `npm run build` sin errores.
- Documentacion actualizada.
- PR via `gh` con la plantilla del repo.

**Estado:** Pendiente.

## Risk Register

| Riesgo | Impacto | Mitigacion |
|---|:---:|---|
| Cola IndexedDB crece sin limite | Medio | TTL 7 dias, max 500 entradas, descarte FIFO |
| Banner aparece en cada inicio aunque no haya version nueva | Bajo | Comparar semver local vs remoto, ignorar si son iguales |
| Validacion local se retrasa por esperar audit | Alto | Fire-and-forget + timeout 2s + retry asincrono |
| Auditoria crece a millones de filas | Bajo | Indice en (codigo, serie, mes, timestamp) ya creado; archivado manual fuera de scope |
| Payload con datos clinicos pasa la validacion | Critico | Lista blanca estricta de campos, rechazo 400 explicito |

## Verification Plan

1. `php scripts/migrate.php` (ya hecho en 003-A).
2. `php scripts/test-audit.php` aprueba los 5+ escenarios.
3. `npm test` mantiene los 74 tests previos + nuevos >= 6.
4. `npm run build` sin errores.
5. Manual: validar archivo REM -> verificar que el POST /api/audit se hizo (log de Apache).
6. Manual: login admin -> /admin/auditoria -> ver tabla y stats.
7. Manual: publicar version -> recargar validador -> ver banner.
