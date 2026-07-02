# Validador DEIS SSO 2026

Plataforma avanzada de validación y aseguramiento de calidad para archivos **REM (Resumen Estadístico Mensual)** del Servicio de Salud Osorno.

## 🛡️ Panel de Administración (003-A + 003-B + 003-C)

### 003-A · Backend y autenticación

- Backend PHP+MySQL nativo sobre XAMPP: `/api/health`, `/api/auth/{login,logout,me,csrf}`.
- Sesión PHP con cookie `HttpOnly`, `SameSite=Strict` y expiración al cerrar el navegador.
- CSRF token por sesión en endpoints no-idempotentes y rate limit (5/15 min) en login.
- Página `/admin/login` con formulario en español y `AdminAuthContext` + `RequireAdmin`.
- Script CLI `scripts/seed-admin.php` para crear el primer admin con contraseña robusta (bcrypt cost 12).

### 003-B · CRUD de reglas y publicación

- Listado paginado con filtros (serie, severidad, búsqueda) y badges de estado.
- Formulario de regla con 4 secciones colapsables: Identidad, Expresión, Severidad, Alcance.
- Vista previa humana de la expresión ("Suma el rango C21:C36", "Lee la celda F11").
- Publicación de versiones inmutables con semver (`1.0.X-reglas`).
- Endpoint público `GET /api/reglas/actual` con la última versión publicada.
- Auditoría completa de cambios en `reglas_audit` con diff antes/después.
- Script `scripts/import-reglas-initial.php` que carga `data/reglas_finales.json` a la BD.

### 003-C · Auditoría no clínica y estadísticas

- El validador envía un evento al backend cada vez que termina una validación con metadatos no clínicos (lista blanca estricta).
- Cola IndexedDB con TTL 7d y max 500 entradas; fire-and-forget con retry asíncrono. La falla del backend no impide la validación local.
- Rate limit 1000/h por IP en `POST /api/audit` (público).
- Página `/admin/auditoria` con 4 StatCards (total, tasa de aprobación, series, top establecimiento) + tabla paginada con filtros (rango fechas, serie, mes, código, resultado).
- Sincronización automática de reglas: el validador consulta `GET /api/reglas/actual` cada 5 minutos; si hay versión nueva, banner en la home con botón "Actualizar reglas".
- Implementa los Principios I.a, VI y VII sin exponer contenido del archivo REM.

**La validación REM sigue siendo 100% local; el contenido del archivo nunca sale del navegador.**

**Detalle completo:** [`docs/MANUAL_ADMIN.md`](docs/MANUAL_ADMIN.md). Specs: `specs/003-a-infra-backend-auth/`, `specs/003-b-crud-reglas/`, `specs/003-c-auditoria-estadisticas/`.

## 📝 Informe de Cambios y Mejoras Recientes (Mar 2026)

## 📝 Informe de Cambios y Mejoras Recientes (Mar 2026)

- Validación integral de la hoja **NOMBRE**: versión obligatoria (A9) 1.2/1.1, códigos de comuna y establecimiento concatenados contra catálogo, consistencia con el nombre del archivo, mes y responsables informados.
- Motor de reglas 2026 reforzado: reglas centralizadas en `data/reglas_finales.json`, con soporte para SUM, rangos cruzados, omitir si valor=0, exclusiones (`establecimientos_excluidos`) y validaciones exclusivas con inversión de operador.
- Flujo de metadata optimizado: `establishments.catalog.json` indexado en Map para lookups O(1), inferencia automática del tipo de recinto y filtrado consistente de reglas por serie REM.
- Exportación premium: reporte XLSX con 3 hojas (Resumen, Hallazgos, Solo Errores) y estilos DEIS; exportación JSON y CSV lista para SIGGES/analytics.
- Experiencia renovada: dropzone con pre-chequeo de nombre, banner de error de versión, ring de aprobación y resumen por severidad, tabla con filtros (severidad/hoja/estado), búsqueda y drawer de detalle.
- Documentación operativa: guía rápida en la home con capturas y documentación técnica en `docs/`.

## 📌 Parámetros solicitados

- **Título del programa:** Validador DEIS SSO 2026 — Prevalidador REM Series A y P.
- **Descripción breve:** Web app que pre-valida archivos REM (xlsx/xlsm) antes de cargarlos al DEIS: revisa nombre, versión, hoja NOMBRE, cruces con catálogo y aplica reglas normativas con severidades.

### Labores generales (tareas del sistema)
- Prevalidar nomenclatura y extensión del archivo (`[Codigo6][Serie][Mes].xlsx/xlsm`) y bloquear series no soportadas.
- Extraer metadata técnica (serie, mes, tamaño, hojas) e identificar establecimiento y tipo desde el catálogo oficial.
- Ejecutar el pipeline de validación (hoja NOMBRE + reglas centralizadas) clasificando hallazgos en ERROR, REVISAR e INDICADOR.
- Presentar hallazgos con filtros por severidad/hoja/estado, búsqueda rápida y detalle contextual.
- Exportar resultados en XLSX (resumen + hallazgos + solo errores), CSV y JSON con marcas de tiempo.

### Labores específicas (tareas del sistema)
- Validar hoja **NOMBRE**: versión en A9 (1.2/1.1), códigos de comuna y establecimiento concatenados y cotejados con `establishments.catalog.json`, concordancia con el nombre del archivo, mes y responsables B11/B12 informados.
- Validar nombre de archivo: regex estricta con Series A y P habilitadas; Serie A acepta meses 01-12 y Serie P solo 06/12. Series no realizadas se bloquean con mensaje operativo.
- Motor de reglas: soporta expresiones con SUM y rangos cruzados, filtros por serie REM, exclusiones/inclusiones por establecimiento, `omitir_si_*` para evitar falsos positivos y validaciones exclusivas que invierten el operador. Conceptualmente, `expresion_1` opera como numerador y `expresion_2` como denominador o referencia.
- Exportación: hoja Resumen con tasa de aprobación, conteo por severidad y metadatos; hoja Hallazgos espejada a la UI; hoja Solo Errores prefiltrada; nombres auto-generados `Validacion_[Codigo]_[Serie]_[Mes].xlsx`.
- UI/UX: TopBar con navegación home/resultados, overlay de carga, badge de versión y componente UserManual con pasos y capturas.

## 📦 Repositorio y Configuración

**GitHub:** [https://github.com/rogarces85/validador-deis-sso](https://github.com/rogarces85/validador-deis-sso)

```bash
git clone https://github.com/rogarces85/validador-deis-sso.git
cd validador-deis-sso
npm install
npm run dev
```

## 🚀 Características Principales

- **Soporte de formatos:** Compatibilidad total con archivos `.xlsm` y `.xlsx`.
- **Validación de nombre + Hoja NOMBRE:** Regex estricta `[Codigo6][Serie][Mes]` y 9 chequeos en NOMBRE (versión A9, comuna/establecimiento, mes y responsables) alineados con el catálogo.
- **Cobertura normativa 2026:** validaciones de Series A y P centralizadas en `data/reglas_finales.json`.
- **Motor de reglas dinámico:** Cruces entre hojas, rangos y SUM, exclusiones por establecimiento, `omitir_si_*`, validaciones exclusivas y comparacion numerador versus denominador; filtrado por serie REM.
- **Exportación avanzada:** XLSX con resumen + hallazgos + solo errores, además de exportación JSON/CSV para análisis externo.
- **UI con control:** Filtros por severidad/hoja/estado, búsqueda, drawer de detalle, ring de aprobación y guía rápida con capturas.

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|:---|:---|
| **React 19** | Frontend SPA |
| **TypeScript** | Tipado estricto |
| **Vite 6** | Build tool & dev server |
| **SheetJS (XLSX)** | Lectura de archivos Excel en cliente |
| **xlsx-js-style** | Escritura XLSX con estilos DEIS (Resumen/Hallazgos) |
| **Tailwind CSS** | Estilos y design tokens vía variables CSS |
| **Vitest** | Tests unitarios e integración (`npm test`) |
| **Spec Kit** | Flujo `specs/001-...` para features (ej. Serie P) |

## 📂 Estructura del Proyecto (Limpia)

```
Validador2026/
├── .agents/              # Skills y configuración de inteligencia artificial
├── admin/                # Sub-app React del panel admin (003-A en adelante)
│   ├── AdminApp.tsx
│   ├── AdminAuthContext.tsx
│   ├── RequireAdmin.tsx
│   └── pages/
│       └── LoginPage.tsx
├── api/                  # Backend PHP nativo (003-A en adelante)
│   ├── index.php                   # router
│   ├── bootstrap.php               # PDO, sesión, helpers
│   ├── .htaccess                   # protege acceso directo
│   ├── lib/                        # Response, Validator, Csrf
│   ├── middleware/                 # auth, ratelimit, cors
│   ├── controllers/                # AuthController, HealthController
│   └── models/                     # UsuarioAdmin
├── components/           # UI: App, TopBar, FileDropzone, RulesSummary,
│                         # FindingsTable, FindingDrawer, CeldasReview,
│                         # ExportPanel, UserManual, ManualRuleExplorer,
│                         # SeverityChips, ThemeContext
├── data/                 # Fuente de verdad
│   ├── reglas_finales.json          # Reglas de validación (Series A y P)
│   ├── reglas_validacion.md         # Estructura documental de las reglas
│   ├── establishments.catalog.json  # Catálogo de establecimientos
│   ├── celdas.catalog.json          # Catálogo de celdas a revisar
│   ├── secciones.md                 # Glosas de secciones
│   └── rules/index.ts               # Diccionario de reglas por tipo
├── docs/                 # Manuales, documentación técnica y flujos
│   └── MANUAL_ADMIN.md              # Guía operativa del panel admin
├── hooks/                # useValidationPipeline (único hook orquestador)
├── scripts/              # Scripts PHP de operación
│   ├── migrate.php                  # crea las 5 tablas (idempotente)
│   ├── seed-admin.php               # siembra el primer admin
│   └── test-auth.php                # 8 escenarios de auth
├── services/             # Servicios de dominio
│   ├── excelService.ts              # Singleton ExcelReaderService
│   ├── ruleEngine.ts                # RuleEngineService + parser embebido
│   ├── filenameValidator.ts         # Regex nombre + extracción metadata
│   ├── nombreSheetValidator.ts      # 9 chequeos hoja NOMBRE
│   ├── remSeriesConfig.ts           # Series, meses y hojas permitidas
│   ├── exportService.ts             # XLSX/CSV/JSON con estilos DEIS
│   └── api/                         # Cliente HTTP del panel admin
├── utils/                # Utilidades puras
│   ├── cellReferences.ts            # Parser A1/rangos/SUM → tokens
│   └── findingDisplay.ts            # Formateo y referencia de hallazgos
├── tests/                # Tests Vitest
└── [config: Vite, TS, Tailwind, package.json]
```

## 🧬 Arquitectura y Flujo del Pipeline

**Tipo:** SPA 100% client-side. No hay backend ni rutas HTTP — el routeo interno es por estado en `App.tsx` (`home` | `results` | `cells`). XAMPP sólo sirve los estáticos.

### Capas (de abajo hacia arriba)

1. **Datos** — `data/reglas_finales.json` es la **única fuente de verdad** de las reglas; cualquier modificación parte desde ahí.
2. **Utilidades puras** — parsers y formateadores sin estado.
3. **Servicios de dominio** — encapsulan lectura Excel, motor de reglas, validadores.
4. **Hook orquestador** — `useValidationPipeline` coordina el pipeline con `Promise.all` + `import()` dinámicos para code-splitting.
5. **UI** — componentes con carga diferida (`FindingDrawer`, `ExportPanel`, `CeldasReview` son `lazy()`).

### Flujo del pipeline (`hooks/useValidationPipeline.ts`)

1. `FilenameValidator` valida el nombre (`[Codigo6][Serie][Mes].xlsm/xlsx`) y extrae metadata.
2. `ExcelReaderService.getInstance()` carga el workbook (Singleton).
3. `remSeriesConfig.getMissingRequiredSheetsForSerie` valida hojas obligatorias (Serie P exige `NOMBRE` + P1–P7, P9, P11–P13).
4. `NombreSheetValidator` corre primero (9 chequeos; sus hallazgos van al inicio de la lista).
5. `RuleEngine.evaluate` corre las reglas filtradas por serie y tipo de establecimiento.
6. Combinación `nombreOutput + ruleResults` → `AppState` → UI.

### Reglas: numerador vs denominador

Conceptualmente, **`expresion_1` es el numerador** y **`expresion_2` es el denominador o referencia**. Si `expresion_2` viene vacía o sin datos, se trata como `0`. Reglas disponibles:

- Expresiones con `SUM` y rangos cruzados entre hojas (`A1:B10`, `Hoja!A1+B2`).
- Operadores: `==`, `!=`, `>`, `<`, `>=`, `<=`.
- Flags por regla: `validacion_exclusiva` (invierte operador y aprueba al objetivo), `omitir_si_ambos_cero`, `omitir_si_v1_es_cero`, `omitir_si_condicion_no_cumple`, `condicion_previa`.
- Filtros por scope: `aplicar_a` (códigos), `aplicar_a_tipo` (tipos de establecimiento), `excluir_tipo`, `establecimientos_excluidos`.
- El parser de expresiones vive embebido en `services/ruleEngine.ts:299` (descenso recursivo: `parseExpression → parseTerm → parseFactor → parseSum`).

## 🔥 Puntos Críticos (alto impacto ante cambios)

- **`services/ruleEngine.ts`** — núcleo de toda la validación. Cualquier cambio impacta todas las series. Embebe el parser de expresiones y la lógica de inversión de operador.
- **`utils/cellReferences.ts`** — `expandRange` + `tokenizeExpression` + `buildDynamicCellEntries` iteran reglas × celdas. Cuello de botella potencial para archivos grandes.
- **`hooks/useValidationPipeline.ts`** — orquesta 6 `import()` dinámicos; un error en cualquiera aborta el pipeline completo.
- **`services/excelService.ts`** — Singleton con fan-in 12; concentra `getCellValue` y `getRangeSum` para todo el sistema.
- **`data/reglas_finales.json` + `data/rules/index.ts`** — fuente de verdad. Cambios aquí deben propagarse vía skill `sincronizador-reglas` (`npm run sync-rules` / `npm run sync-rules:check`).
- **`dist-pipeline/` y `tests-pipeline/`** — bundles pre-construidos de un pipeline Node histórico; no son código de runtime de la app.

## 🧠 Sistema de Habilidades (Skills)

El proyecto cuenta con un sistema de **Skills** que automatizan tareas complejas:
- `rem-validation-rules`: Gestión de lógica de reglas.
- `agrupador-validaciones`: Analisis auxiliar del alcance de reglas por establecimiento.
- `sincronizador-reglas`: Skill heredada; revisar antes de usar porque la fuente de verdad actual es `data/reglas_finales.json`.
- `leer-manual-rem`: Extracción de definiciones desde PDFs oficiales.
- *Consulta `docs/AYUDA_MEMORIA_SKILLS.md` para más información.*

## 📋 Requisitos de Uso

- **Convención de Nombres:** `CodEstab(6)Serie(1-2)Mes(2)` + extensión. Ejemplos: `123207A01.xlsm`, `123010P06.xlsm`, `123010P12.xlsm`.
- **Serie P:** Semestral; solo acepta meses `06` y `12`, y exige hojas `NOMBRE`, `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P9`, `P11`, `P12`, `P13`.
- **Privacidad:** Operación 100% en el cliente (navegador). No se envían datos sensibles a servidores externos.
- **Idioma:** El sistema, mensajes, documentación y reportes se mantienen siempre en español.

---
**Desarrollado con Estándares de Ingeniería Senior - 2026**
