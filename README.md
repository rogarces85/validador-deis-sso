# Validador DEIS SSO 2026

Plataforma avanzada de validación y aseguramiento de calidad para archivos **REM (Resumen Estadístico Mensual)** del Servicio de Salud Osorno.

## 📦 Repositorio

**GitHub:** [https://github.com/rogarces85/validador-deis-sso](https://github.com/rogarces85/validador-deis-sso)

```bash
git clone https://github.com/rogarces85/validador-deis-sso.git
cd validador-deis-sso
npm install
npm run dev
```

## 🚀 Características Principales

- **Soporte de Formatos:** Compatibilidad total con archivos `.xlsm` y `.xlsx`.
- **Validación de Nomenclatura:** Verificación estricta mediante expresiones regulares: `CodEstab(6)Serie(1-2 letras)Mes(2).xlsx/xlsm`.
- **Identificación de Establecimientos:** Cruce automático con el catálogo oficial del SSO (Hospitales, CESFAM, CECOSF, Postas, etc.).
- **Motor de Reglas Dinámico:** Evalúa fórmulas complejas directamente sobre las celdas de Excel, soportando funciones como `SUM`, `UPPER` y comparaciones cruzadas entre hojas.
- **Análisis de Severidad:** Clasificación de hallazgos en *ERROR*, *REVISAR*, *OBSERVAR* e *INDICADOR*.
- **Exportación:** Resultados exportables a Excel, JSON y CSV.

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|:---|:---|
| **React 19** | Frontend SPA |
| **TypeScript** | Tipado estricto |
| **Vite** | Build tool & dev server |
| **SheetJS (XLSX)** | Lectura de archivos Excel en cliente |
| **Tailwind CSS** | Estilos |
| **Vitest** | Testing |

## ⚙️ Arquitectura

```
├── components/         # Componentes UI (TopBar, FileDropzone, FindingsTable, etc.)
├── services/           # Servicios core (ExcelService, RuleEngine, ExportService)
├── src/
│   ├── engine/         # Motor de reglas v2 (AST parser)
│   ├── hooks/          # Custom hooks (useValidationPipeline)
│   ├── modules/        # Módulos de validación
│   ├── rules/          # Reglas JSON (schema + samples)
│   └── utils/          # Utilidades (Excel reader, filename validator)
├── App.tsx             # Componente principal
├── types.ts            # Interfaces TypeScript
└── constants.ts        # Datos estáticos (establecimientos, reglas)
```

## ⚙️ Funcionamiento del Motor

1. **Referencias Cruzadas:** `A03!L20 + A03!M20` (Valida datos entre diferentes hojas del REM).
2. **Exclusiones Inteligentes:** Ciertas reglas solo se aplican según tipo de establecimiento o características específicas.
3. **Identificador de Serie:** Si el archivo es serie "A", el motor ejecuta todas las validaciones de A01, A02, A19, etc.

## 📋 Requisitos de Uso

- **Convención de Nombres:** `CodEstab(6)Serie(1-2)Mes(2)` + extensión.
  - Ejemplo: `123207A01.xlsm`
- **Privacidad:** 100% client-side. Ningún dato sensible es enviado a servidores.

---
**Desarrollado por el Equipo de Ingeniería Senior - 2026**
