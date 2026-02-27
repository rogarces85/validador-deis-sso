---
name: Production Mode
description: Revisa una app/landing, detecta problemas, propone mejoras y aplica correcciones con una lista de verificación fija para dejarla lista para mostrar o publicar.
---

# Production Mode (QA + Fix)

Esta habilidad se encarga de revisar, mejorar y pulir aplicaciones web o landing pages existentes para llevarlas a un estado "listo para producción" o "listo para demo".

---

## ¿Cuándo usar esta habilidad?

- Cuando ya tienes algo generado (landing page o app) y quieres hacerlo "presentable".
- Cuando algo funciona "a medias" (vista móvil extraña, imágenes rotas, botones sin acción, espaciado feo).
- Antes de mostrárselo a un cliente, grabarlo o publicarlo.

---

## Prerrequisitos (Inputs Requeridos)

Si falta alguno de estos datos, **pregunta al usuario**:

1. **Archivo principal**: ¿Cuál es el punto de entrada? (ej: `index.html`, ruta del proyecto, componente principal).
2. **Objetivo de la revisión**:
   - "Listo para mostrar" (Demo)
   - "Listo para publicar" (Producción)
3. **Restricciones**: ¿Qué **NO** se debe tocar? (branding, textos, estructura, etc.).

---

## Checklist de Calidad (Orden Fijo)

El asistente debe verificar estos puntos en orden:

### A) Funciona y se ve bien
- [ ] Abre en vista previa / localhost sin errores de consola.
- [ ] Las imágenes cargan y no hay rutas rotas (404).
- [ ] Las fuentes y estilos se aplican correctamente.

### B) Responsive (Mobile First)
- [ ] Se ve bien en móvil (sin cortes, sin scroll horizontal innecesario).
- [ ] Botones y textos tienen tamaños legibles en pantallas pequeñas.
- [ ] Las secciones tienen un espaciado coherente (márgenes y padding).

### C) Copy y UX Básico
- [ ] Titulares claros y coherentes con la propuesta de valor.
- [ ] CTAs consistentes (mismo verbo, misma intención).
- [ ] Sin texto de relleno tipo "lorem ipsum" (reemplazar por texto realista si es necesario).

### D) Accesibilidad Mínima
- [ ] Contraste razonable en los textos.
- [ ] Imágenes con texto alternativo (`alt`).
- [ ] Estructura lógica de encabezados (`h1`, `h2`, etc.).

---

## Flujo de Trabajo (Workflow)

1. **Diagnóstico Rápido**: Generar una lista de problemas en 5–10 puntos (priorizados por impacto).
2. **Plan de Corrección**: "Qué cambio y por qué" (máximo 8 cambios críticos para ganar calidad rápidamente).
3. **Aplicar Cambios**: Modificar los archivos necesarios siguiendo el plan.
4. **Validación**: Volver a revisar la vista previa y confirmar con el checklist.
5. **Resumen Final**: Listar cambios realizados + qué queda opcional para mejorar.

---

## Reglas

- **NO cambiar el estilo de marca** si hay una guía de estilo o branding definido.
- **NO rehacer todo**: arreglar lo mínimo necesario para ganar calidad rápidamente (Pareto 80/20).
- **Conflicto "Bonito vs Claro"**: Priorizar siempre la **claridad**.

---

## Formato de Salida (Output)

El resultado final debe seguir siempre este formato **en español**:

### Diagnóstico (Priorizado)
1. [Problema 1]
2. [Problema 2]
...

### Cambios Aplicados
- [Archivo] Cambio realizado
- [Archivo] Cambio realizado

### Resultado
**[OK para mostrar / OK para publicar]**

**Notas**: [Observaciones adicionales o mejoras futuras sugeridas]
