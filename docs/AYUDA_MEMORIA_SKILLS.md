# 🧠 Ayuda Memoria: Skills del Validador2026

Este documento sirve como referencia rápida para entender qué hace cada "Skill" (habilidad) del sistema y cuándo invocarla.

---

## 🛠️ Validación y Reglas (Core)

### 1. `rem-validation-rules`
*   **Propósito**: Crear y validar reglas de validación REM.
*   **Uso**: Cuando necesites definir la lógica técnica de una nueva validación en `Rules_nuevas.json`.

### 2. `agrupador-validaciones`
*   **Propósito**: Reestructura y agrupa las reglas de `rules.json` discriminando por tipo de establecimiento (Hospital, CESFAM, etc.).
*   **Uso**: Para mantener la jerarquía correcta en los archivos de reglas por establecimiento.

### 3. `sincronizador-reglas`
*   **Propósito**: Sincroniza los cambios de `Rules_nuevas.json` hacia los archivos específicos de cada establecimiento.
*   **Uso**: Después de editar la "fuente de verdad" (`Rules_nuevas.json`) para propagar los cambios.

### 4. `mejora-mensajes-errores`
*   **Propósito**: Enriquece los mensajes de error en `rules.json` usando información de `secciones.md`.
*   **Uso**: Para que el usuario final entienda exactamente qué falló y por qué (lógica explicada).

---

## 📄 Lectura y Procesamiento de Datos

### 5. `lector-excel-pro`
*   **Propósito**: Lectura eficiente de todas las hojas de un Excel comprimido o grande.
*   **Uso**: Base técnica para que la App procese los archivos REM subidos por los usuarios.

### 6. `leer-manual-rem`
*   **Propósito**: Lee el PDF del Manual REM 2026 y extrae Definiciones Operacionales.
*   **Uso**: Generar el `Informe_Manual_REM.md` para auditar qué validaciones faltan implementar.

### 7. `exce-seccion`
*   **Propósito**: Extrae las secciones/títulos de todas las hojas de un Excel.
*   **Uso**: Generar `secciones.md`, necesario para el skill de mejora de mensajes.

---

## 📊 Informes y Salidas

### 8. `informe-validaciones`
*   **Propósito**: Genera un reporte detallado (MD y Excel) de todas las validaciones cargadas.
*   **Uso**: Auditoría interna para saber cuántas reglas hay por hoja REM e ID.

### 9. `pptx-processor`
*   **Propósito**: Genera presentaciones PowerPoint (.pptx) premium (ej: Midnight Executive).
*   **Uso**: Convertir informes Markdown a diapositivas elegantes para reuniones.

---

## 💻 Desarrollo y Calidad

### 10. `gap-analyzer`
*   **Propósito**: Audita el código actual y detecta qué falta para completar el MVP.
*   **Uso**: Cuando sientas que el proyecto está estancado o necesitas una hoja de ruta técnica.

### 11. `production-mode`
*   **Propósito**: Lista de verificación para dejar la App/Landing lista para producción.
*   **Uso**: Antes de un despliegue o demo final para corregir detalles visuales y de rendimiento.

### 12. `creador-de-habilidades` / `skill-creator`
*   **Propósito**: Guía para generar nuevas habilidades siguiendo el estándar Antigravity.
*   **Uso**: Cuando identifiques un proceso repetitivo que deba convertirse en una nueva herramienta.

### 13. `interface-design` / `ui-ux-pro-max`
*   **Propósito**: Dashboards, paneles, estilos (Glassmorphism, Dark Mode) y componentes.
*   **Uso**: Mejorar visualmente la App, añadir gráficos o refactorizar el diseño UI/UX.

---

## ⚡ Recomendaciones Vercel/React

### 14. `vercel-react-best-practices`
*   **Propósito**: Guías de rendimiento de Vercel (Next.js/React).
*   **Uso**: Refactorizar componentes pesados o mejorar tiempos de carga.

---

> [!TIP]
> Si olvidas cómo usar uno específicamente, puedes pedirme: *"Muéstrame el manual del skill [nombre]"* y leeré el `SKILL.md` original por ti.
