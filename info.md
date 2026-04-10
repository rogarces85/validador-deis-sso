# 📋 info.md — Estado Actual del Sistema

> **Validador DEIS SSO 2026 — Prevalidador REM Serie A**
> Fecha de generación: 2026-04-10
> Versión del sistema: `1.0.16` (package.json)

---

## 1. Descripción General del Sistema

El **Validador DEIS SSO 2026** es una aplicación web Single Page Application (SPA) que permite pre-validar archivos REM (Resumen Estadístico Mensual) en formato `.xlsx` / `.xlsm` antes de su carga oficial en el sistema DEIS. Opera **100% en el navegador** del usuario, sin enviar datos a servidores externos.

El sistema está orientado a los establecimientos del **Servicio de Salud Osorno** y aplica las normativas estadísticas REM vigentes para el período 2026.

---

## 2. Stack Tecnológico

| Tecnología         | Versión     | Uso                                    |
|:-------------------|:-----------|:---------------------------------------|
| **React**          | 19.2.4      | Framework Frontend SPA                 |
| **TypeScript**     | 5.8.2       | Tipado estricto                        |
| **Vite**           | 6.4.1       | Build tool y servidor de desarrollo    |
| **SheetJS (xlsx)** | 0.18.5      | Lectura de archivos Excel en el cliente |
| **xlsx-js-style**  | 1.2.0       | Exportación XLSX con estilos           |
| **Tailwind CSS**   | —           | Estilos y componentes UI               |
| **Vitest**         | 4.0.18      | Testing unitario y de integración      |
| **pptxgenjs**      | 4.0.1       | (Skill PPTX) Generación de presentaciones |
| **pdf-parse**      | 2.4.5       | (Skill PDF) Lectura de PDFs           |

---

## 3. Arquitectura del Proyecto

```
Validador2026/
├── App.tsx                        # Componente raíz, router de páginas (home / results)
├── index.tsx                      # Entry point React
├── index.css                      # Sistema de diseño global (tokens CSS, dark/light mode)
├── types.ts                       # Definiciones TypeScript globales
├── vite.config.ts                 # Configuración Vite + variables de build
│
├── components/                    # Componentes UI
│   ├── TopBar.tsx                 # Barra superior con navegación y toggle de tema
│   ├── FileDropzone.tsx           # Zona drag & drop + pre-chequeo de nombre
│   ├── RulesSummary.tsx           # Resumen de resultados (ring de aprobación, KPIs)
│   ├── FindingsTable.tsx          # Tabla de hallazgos con filtros y búsqueda
│   ├── FindingDrawer.tsx          # Panel lateral de detalle por hallazgo (lazy)
│   ├── ExportPanel.tsx            # Botón y lógica de exportación (lazy)
│   ├── SeverityChips.tsx          # Badges de severidad (ERROR / REVISAR / INDICADOR)
│   ├── ThemeContext.tsx           # Contexto de tema dark/light mode
│   └── UserManual.tsx             # Guía rápida de uso en la home
│
├── hooks/
│   └── useValidationPipeline.ts   # Hook principal: orquesta todo el flujo de validación
│
├── services/
│   ├── excelService.ts            # Singleton de lectura Excel (SheetJS)
│   ├── filenameValidator.ts       # Validación de nomenclatura del archivo
│   ├── nombreSheetValidator.ts    # Validación de la hoja NOMBRE (9-11 checks)
│   ├── ruleEngine.ts              # Motor de reglas dinámico (SUM, rangos, operadores)
│   ├── exportService.ts           # Generación de archivos XLSX / CSV / JSON
│   └── ruleEngine.test.ts         # Tests del motor de reglas
│
├── data/
│   ├── establishments.catalog.json  # Catálogo oficial de establecimientos SSO
│   ├── Rules_nuevas.json            # Reglas maestras (fuente de verdad)
│   ├── rules_validador.json         # Variante de reglas (legacy)
│   ├── rules_validador_humano.json  # Reglas con mensajes humanizados
│   ├── secciones.md                 # Mapa de secciones por hoja REM
│   └── rules/                       # Reglas segmentadas por tipo de establecimiento
│       ├── base.json               # Reglas para TODOS los establecimientos
│       ├── hospital.json           # Reglas específicas para hospitales
│       ├── posta.json              # Reglas específicas para postas
│       ├── samu.json               # Reglas específicas para SAMU
│       └── index.ts                # Loader de reglas combinadas
│
├── docs/                           # Documentación técnica
├── scripts/                        # Scripts utilitarios
├── tests/                          # Tests de integración
└── .agents/                        # Skills y workflows de IA
    └── skills/                     # 18 skills disponibles
```

---

## 4. Función Principal del Sistema

### 4.1. Pipeline de Validación (`useValidationPipeline.ts`)

El flujo principal se ejecuta en este orden al recibir un archivo:

```
[Archivo .xlsx/.xlsm]
        │
        ▼
┌───────────────────────────────┐
│  1. LECTURA DEL EXCEL         │  ExcelReaderService.loadFile()
│     SheetJS carga en memoria  │
└───────────────────────────────┘
        │
        ▼
┌───────────────────────────────┐
│  2. VALIDACIÓN DE NOMBRE      │  FilenameValidatorService.validate()
│     Regex: [Cod6][Serie][Mes] │  Extrae: código, serie, mes, extensión
└───────────────────────────────┘
        │
        ▼
┌───────────────────────────────┐
│  3. IDENTIFICACIÓN DEL        │  Map lookup O(1) en establishments.catalog.json
│     ESTABLECIMIENTO           │  Determina tipo: HOSPITAL / POSTA / SAMU / CESFAM...
└───────────────────────────────┘
        │
        ▼
┌───────────────────────────────┐
│  4. VALIDACIÓN HOJA NOMBRE    │  NombreSheetValidator.validate()
│     9 a 11 chequeos           │  Versión A9, códigos, mes, responsables
└───────────────────────────────┘
        │
        ▼
┌───────────────────────────────┐
│  5. MOTOR DE REGLAS           │  RuleEngineService.evaluate()
│     base.json + specific.json │  Filtra por serie, aplica_a, exclusiones
│     Soporta: SUM, rangos,     │  omitir_si_*, validacion_exclusiva
│     cruces entre hojas        │
└───────────────────────────────┘
        │
        ▼
┌───────────────────────────────┐
│  6. CONSOLIDACIÓN Y UI        │  [ ...nombreResults, ...ruleResults ]
│     FindingsTable + Drawer    │  Clasificados en ERROR / REVISAR / INDICADOR
└───────────────────────────────┘
        │
        ▼
┌───────────────────────────────┐
│  7. EXPORTACIÓN               │  ExportService → XLSX (3 hojas) + CSV + JSON
└───────────────────────────────┘
```

---

## 5. Módulos Clave Descriptos

### 5.1. `FilenameValidatorService`
Valida que el nombre del archivo cumpla la convención `[Código6][Serie][Mes].[ext]`:
- Series soportadas: `A`, `P`, `D`, `BM`, `BS`
- Mes: 01–12
- Extensión: `.xlsx` / `.xlsm`

### 5.2. `NombreSheetValidator`
Ejecuta hasta **11 validaciones** sobre la hoja `NOMBRE`:

| ID         | Celda(s)        | Validación                                          |
|:-----------|:----------------|:----------------------------------------------------|
| VAL_NOM01  | A9              | Versión del archivo (1.2 o 1.1)                    |
| VAL_NOM02  | B2              | Nombre de la comuna no vacío                       |
| VAL_NOM03  | C2:G2           | Código de comuna concatenado en catálogo           |
| VAL_NOM04  | B3              | Nombre del establecimiento no vacío                |
| VAL_NOM05  | C3:H3           | Código de establecimiento concatenado en catálogo  |
| VAL_NOM06  | B6              | Nombre del mes no vacío                            |
| VAL_NOM07  | C6:D6           | Código de mes concatenado (01–12)                  |
| VAL_NOM08  | B11             | Nombre del responsable no vacío                    |
| VAL_NOM09  | B12             | Nombre del jefe de estadística no vacío            |
| VAL_NOM10  | —               | Código establecimiento en hoja ≡ código del archivo |
| VAL_NOM11  | —               | Mes en hoja ≡ mes del archivo                      |

### 5.3. `RuleEngineService`
Motor de reglas con soporte para:
- **Expresiones simples**: celda individual (ej. `A03!F11`)
- **Sumas de rangos**: `SUM(A03!C20:C36, A03!D20:D36)`
- **Adición de celdas**: `A03!L20 + A03!M20`
- **Rangos verticales**: `H36:H37`
- **Cross-sheet references**: `HojaREM!Celda`
- **Operadores**: `==`, `!=`, `>`, `<`, `>=`, `<=`
- **Omisión condicional**: `omitir_si_ambos_cero`, `omitir_si_v1_es_cero`
- **Validación exclusiva**: invierte el operador para el conjunto `aplicar_a`
- **Exclusiones**: `establecimientos_excluidos` para saltar establecimientos

### 5.4. `ExportService`
Genera archivos exportables:
- **XLSX**: 3 hojas — Resumen (KPIs), Hallazgos (espejo de la UI), Solo Errores
- **CSV**: Para integración con SIGGES / analytics
- **JSON**: Datos estructurados para procesamiento externo
- Nombre auto-generado: `Validacion_[Codigo]_[Serie]_[Mes].xlsx`

---

## 6. Tipos de Establecimiento Soportados

| Tipo             | Descripción                          | Reglas adicionales |
|:-----------------|:-------------------------------------|:-------------------|
| `HOSPITAL`       | Hospitales                           | `hospital.json`    |
| `CESFAM`         | Centro de Salud Familiar             | (base)             |
| `POSTA`          | Posta Rural                          | `posta.json`       |
| `CECOSF`         | Centro Comunitario de Salud Familiar | (base)             |
| `SAPU`           | Servicio de Atención Primaria Urgencia | (base)           |
| `SUR`            | Servicio de Urgencia Rural           | (base)             |
| `COSAM`          | Centro Comunitario de Salud Mental   | (base)             |
| `SALUD_MENTAL`   | Establecimiento de Salud Mental      | (base)             |
| `DIRECCION`      | Dirección de Servicio                | (base)             |
| `MOVIL`          | Unidad Móvil                         | (base)             |
| `SAMU`           | Servicio de Atención Médica Urgente  | `samu.json`        |
| `PRIVADA`        | Establecimiento Privado              | (base)             |
| `OTROS`          | Otros tipo de recintos               | (base)             |

---

## 7. Severidades del Sistema

| Nivel        | Descripción                                                    |
|:-------------|:---------------------------------------------------------------|
| `ERROR`      | Incumplimiento normativo. Requiere corrección antes de cargar. |
| `REVISAR`    | Inconsistencia detectada. El usuario debe verificar.           |
| `INDICADOR`  | Observación estadística. No bloquea la carga.                  |

---

## 8. Cobertura de Validaciones Activas

| Componente              | Cantidad aprox. | Fuente                    |
|:------------------------|:----------------|:--------------------------|
| Hoja NOMBRE             | 11              | `nombreSheetValidator.ts` |
| Reglas base Serie A     | ~80+            | `data/rules/base.json`    |
| Reglas hospital         | Determinado     | `data/rules/hospital.json`|
| Reglas posta            | Pendiente       | `data/rules/posta.json`   |
| Reglas SAMU             | Pendiente       | `data/rules/samu.json`    |
| **Total activas (est.)** | **~91**        | README 2026               |

---

## 9. Catálogo de Establecimientos

- **Archivo**: `data/establishments.catalog.json`
- **Versión**: 2026
- **Servicio de Salud**: Osorno
- **Lookup**: Indexado en `Map<codigo, Establishment>` al inicio de la app (O(1))
- **Campos por establecimiento**: `codigo`, `nombre`, `tipo`, `comuna`, `activo`

---

## 10. Sistema de Skills (IA Asistida)

El proyecto integra un sistema de **18 skills** bajo `.agents/skills/` para automatizar tareas repetitivas:

| Skill                        | Función principal                                          |
|:-----------------------------|:----------------------------------------------------------|
| `rem-validation-rules`       | Crear y mantener reglas de validación REM                  |
| `agrupador-validaciones`     | Agrupar reglas por tipo de establecimiento                 |
| `sincronizador-reglas`       | Propagar cambios desde `Rules_nuevas.json` a archivos por tipo |
| `sincronizador-mensajes`     | Sincronizar mensajes entre el archivo maestro y los específicos |
| `refactorizador-mensajes`    | Reformular mensajes con lógica inversa (explica el error) |
| `leer-manual-rem`            | Extraer definiciones operacionales del PDF Manual REM 2026 |
| `informe-validaciones`       | Generar informe completo de reglas en Markdown y Excel    |
| `lector-excel-pro`           | Lectura eficiente de hojas Excel                          |
| `identificador-prestaciones` | Asociar glosas Excel con reglas del validador             |
| `gap-analyzer`               | Auditar el código y detectar funciones faltantes para el MVP |
| `highlighter-mensajes`       | Definir estilos visuales de mensajes por segmentos        |
| `interface-design`           | Diseño de dashboards e interfaces internas                |
| `ui-ux-pro-max`              | Inteligencia de diseño UI/UX con 50 estilos y 21 paletas  |
| `production-mode`            | Revisión final y corrección antes de publicar             |
| `pptx-processor`             | Generar presentaciones PowerPoint                         |
| `lector-seccion-excel`       | Extraer secciones de hojas Excel                          |
| `creador-de-habilidades`     | Crear nuevas skills siguiendo el estándar Antigravity     |
| `vercel-react-best-practices`| Optimización de código React/Next.js                     |

---

## 11. Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción (incrementa patch de versión)
npm run build

# Preview del build
npm run preview

# Ejecutar tests
npm test
```

---

## 12. Variables de Entorno

| Variable                | Archivo       | Descripción                       |
|:------------------------|:--------------|:----------------------------------|
| (configuración local)   | `.env.local`  | Variables de entorno privadas     |
| `__APP_VERSION__`       | Vite build    | Versión inyectada desde package.json |
| `__BUILD_DATE__`        | Vite build    | Fecha de compilación              |

---

## 13. Repositorio y Control de Versiones

- **GitHub**: [https://github.com/rogarces85/validador-deis-sso](https://github.com/rogarces85/validador-deis-sso)
- **Versión actual**: `1.0.16`
- **Rama principal**: `main`
- **Build automático de versión**: Se incrementa el patch con cada `npm run build`

---

## 14. Privacidad y Seguridad

> ⚠️ **El sistema opera 100% en el cliente (navegador).**
> Ningún dato REM, código de establecimiento o hallazgo de validación se transmite a servidores externos.
> Los archivos se procesan exclusivamente en memoria del navegador con SheetJS.

---

*Generado automáticamente por Antigravity — Validador DEIS SSO 2026*
