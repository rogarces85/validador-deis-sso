# Validador DEIS SSO 2026

Plataforma avanzada de validación y aseguramiento de calidad para archivos **REM (Resumen Estadístico Mensual)** del Servicio de Salud Osorno.

## 📝 Informe de Cambios y Mejoras Recientes (Mar 2026)

- Validación integral de la hoja **NOMBRE**: versión obligatoria (A9) 1.2/1.1, códigos de comuna y establecimiento concatenados contra catálogo, consistencia con el nombre del archivo, mes y responsables informados.
- Motor de reglas 2026 reforzado: **91 validaciones activas (Serie A)**; reglas base + específicas por establecimiento (base/hospital/posta/samu), soporta SUM, rangos cruzados, omitir si valor=0, exclusiones (`establecimientos_excluidos`) y validaciones exclusivas con inversión de operador.
- Flujo de metadata optimizado: `establishments.catalog.json` indexado en Map para lookups O(1), inferencia automática del tipo de recinto para seleccionar el set de reglas correcto.
- Exportación premium: reporte XLSX con 3 hojas (Resumen, Hallazgos, Solo Errores) y estilos DEIS; exportación JSON y CSV lista para SIGGES/analytics.
- Experiencia renovada: dropzone con pre-chequeo de nombre, banner de error de versión, ring de aprobación y resumen por severidad, tabla con filtros (severidad/hoja/estado), búsqueda y drawer de detalle.
- Documentación operativa: `validador_registro.md` autogenerado con las 91 validaciones, guía rápida en la home con capturas y ajustes visuales responsivos.

## 📌 Parámetros solicitados

- **Título del programa:** Validador DEIS SSO 2026 — Prevalidador REM Serie A.
- **Descripción breve:** Web app que pre-valida archivos REM (xlsx/xlsm) antes de cargarlos al DEIS: revisa nombre, versión, hoja NOMBRE, cruces con catálogo y aplica reglas normativas con severidades.

### Labores generales (tareas del sistema)
- Prevalidar nomenclatura y extensión del archivo (`[Codigo6][Serie][Mes].xlsx/xlsm`) y bloquear series no soportadas.
- Extraer metadata técnica (serie, mes, tamaño, hojas) e identificar establecimiento y tipo desde el catálogo oficial.
- Ejecutar el pipeline de validación (hoja NOMBRE + reglas base/específicas) clasificando hallazgos en ERROR, REVISAR e INDICADOR.
- Presentar hallazgos con filtros por severidad/hoja/estado, búsqueda rápida y detalle contextual.
- Exportar resultados en XLSX (resumen + hallazgos + solo errores), CSV y JSON con marcas de tiempo.

### Labores específicas (tareas del sistema)
- Validar hoja **NOMBRE**: versión en A9 (1.2/1.1), códigos de comuna y establecimiento concatenados y cotejados con `establishments.catalog.json`, concordancia con el nombre del archivo, mes y responsables B11/B12 informados.
- Validar nombre de archivo: regex estricta con series `A/P/D/BM/BS`, aviso para series no liberadas y mes entre 01-12.
- Motor de reglas: soporta expresiones con SUM y rangos cruzados, filtros por serie REM, exclusiones/inclusiones por establecimiento, `omitir_si_*` para evitar falsos positivos y validaciones exclusivas que invierten el operador.
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
- **Cobertura normativa 2026:** 91 validaciones activas de Serie A distribuidas en reglas base y específicas por establecimiento (base/hospital/posta/samu).
- **Motor de reglas dinámico:** Cruces entre hojas, rangos y SUM, exclusiones por establecimiento, `omitir_si_*` y validaciones exclusivas; filtrado por serie REM.
- **Exportación avanzada:** XLSX con resumen + hallazgos + solo errores, además de exportación JSON/CSV para análisis externo.
- **UI con control:** Filtros por severidad/hoja/estado, búsqueda, drawer de detalle, ring de aprobación y guía rápida con capturas.

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|:---|:---|
| **React 19** | Frontend SPA |
| **TypeScript** | Tipado estricto |
| **Vite** | Build tool & dev server |
| **SheetJS (XLSX)** | Lectura de archivos Excel en cliente |
| **Tailwind CSS** | Estilos y UI |

## 📂 Estructura del Proyecto (Limpia)

```
Validador2026/
├── .agents/          # Skills y configuración de inteligencia artificial
├── components/       # Componentes UI (FindingsTable, FileDropzone, etc.)
├── data/             # Reglas de validación (Rules_nuevas.json) y catálogos
├── docs/             # Manuales, documentación técnica y flujos de datos
├── hooks/            # Lógica de estado y efectos (useValidationPipeline)
├── scripts/          # Scripts utilitarios del sistema
├── services/         # Servicios core (ExcelService, RuleEngine)
├── tests/            # Tests de integración y calidad
└── [archivos de configuración: Vite, TS, Tailwind, Package.json]
```

## 🧠 Sistema de Habilidades (Skills)

El proyecto cuenta con un sistema de **Skills** que automatizan tareas complejas:
- `rem-validation-rules`: Gestión de lógica de reglas.
- `agrupador-validaciones`: Organización de reglas por establecimiento.
- `sincronizador-reglas`: Propagación de cambios desde el core.
- `leer-manual-rem`: Extracción de definiciones desde PDFs oficiales.
- *Consulta `docs/AYUDA_MEMORIA_SKILLS.md` para más información.*

## 📋 Requisitos de Uso

- **Convención de Nombres:** `CodEstab(6)Serie(1-2)Mes(2)` + extensión (ej: `123207A01.xlsm`).
- **Privacidad:** Operación 100% en el cliente (navegador). No se envían datos sensibles a servidores externos.

---
**Desarrollado con Estándares de Ingeniería Senior - 2026**
