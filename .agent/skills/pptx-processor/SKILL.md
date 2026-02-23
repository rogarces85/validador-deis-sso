---
name: PPTX Processor
description: Procesa y genera presentaciones de PowerPoint (.pptx) con altos estándares de diseño, utilizando herramientas como markitdown y pptxgenjs.
---

# PPTX Processor

Esta habilidad especializa al asistente en la manipulación de archivos PowerPoint, permitiendo desde la extracción de texto hasta la creación de presentaciones profesionales desde cero siguiendo guías de diseño premium.

---

## Flujos de Trabajo Principales

### 1. Lectura y Análisis
Para extraer contenido de una presentación existente:
```bash
# Extracción de texto estructurado
python -m markitdown presentation.pptx
```

### 2. Edición de Plantillas
1. **Analizar**: Revisar el layout existente.
2. **Modificar**: Usar scripts de Python (`python-pptx`) para insertar o cambiar formas y texto.
3. **Limpiar**: Asegurar que no queden elementos huérfanos.

### 3. Creación desde Cero
Cuando no hay una plantilla, utiliza `PptxGenJS` (Node.js) para construir la presentación programáticamente siguiendo las guías de diseño.

---

## Guía de Diseño (Resumen)

**¡No crees diapositivas aburridas!** Evita el texto plano sobre fondo blanco.

- **Contraste**: Usa fondos oscuros para títulos y conclusiones, y claros para el contenido.
- **Visuales**: Cada diapositiva DEBE tener un elemento visual (imagen, gráfico, icono o forma).
- **Tipografía**:
  - Títulos: 36-44pt negrita.
  - Cuerpo: 14-16pt.
- **Espaciado**: Márgenes mínimos de 0.5".

*Consulta `resources/design-guides.md` para ver las paletas de colores y layouts detallados.*

---

## Dependencias Requeridas

- `pip install "markitdown[pptx]"` (Extracción de texto)
- `pip install python-pptx` (Edición de archivos)
- `npm install pptxgenjs` (Creación desde cero)
- `LibreOffice` (Opcional, para conversión a PDF/Imágenes)

---

## QA (Control de Calidad)

- [ ] **Contenido**: ¿Es legible? ¿Hay errores tipográficos?
- [ ] **Visual**: ¿El contraste es suficiente? ¿Hay jerarquía visual clara?
- [ ] **Estructura**: ¿Sigue una narrativa lógica (Inicio -> Contenido -> Cierre)?

---

## Notas
- **Macros**: Ignora siempre las macros de archivos `.ppts` por seguridad.
- **Imágenes**: Usa imágenes de alta resolución y evita estirarlas (mantén el aspect ratio).
