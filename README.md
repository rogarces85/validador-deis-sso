# Validador DEIS SSO 2026

Plataforma avanzada de validación y aseguramiento de calidad para archivos **REM (Resumen Estadístico Mensual)** del Servicio de Salud Osorno.

## 📦 Repositorio y Configuración

**GitHub:** [https://github.com/rogarces85/validador-deis-sso](https://github.com/rogarces85/validador-deis-sso)

```bash
git clone https://github.com/rogarces85/validador-deis-sso.git
cd validador-deis-sso
npm install
npm run dev
```

## 🚀 Características Principales

- **Soporte de Formatos:** Compatibilidad total con archivos `.xlsm` y `.xlsx`.
- **Validación de Nomenclatura (Regla REM01):** Verificación estricta mediante el nombre del archivo: `CodEstab(6)Serie(1-2 caracteres)Mes(2).xlsx/xlsm`.
- **Identificadores Reales:** Cruce automático con el catálogo oficial del DEIS.
- **Motor de Reglas Dinámico:** Evalúa normativas REM directamente sobre celdas, soportando fórmulas complejas y cruces entre hojas (ej: `A03!L20 + A03!M20`).
- **Análisis de Severidad:** Clasificación unificada en *ERROR*, *REVISAR* e *INDICADOR*.
- **Interfaz Premium:** Diseño responsivo de alto estándar con visualización clara de hallazgos y exportación a Excel.

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
