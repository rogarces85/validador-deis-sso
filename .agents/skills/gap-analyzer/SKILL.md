---
name: gap-analyzer
description: Úsalo para auditar el código actual, listar funciones existentes y detectar qué falta para completar el MVP.
---

# Procedimiento de Análisis
1. **Escaneo de Código:** Recorre las carpetas principales del proyecto (`components`, `services`, `hooks`, `utils`, `src`) y extrae el nombre y propósito de cada función/componente.
2. **Mapa de Funcionalidad:** Clasifica las funciones en categorías (Auth, UI, API, Datos, Utils).
3. **Detección de "TODOs":** Busca comentarios como `// TODO`, `// FIXME` o funciones vacías.
4. **Comparación de MVP:** Utiliza los requerimientos definidos en `task.md` y `README.md` para generar una tabla de comparación.

# Salida Esperada
Genera un **Artifact** tipo tabla con las columnas: [Función/Módulo] | [Estado: Completo/Incompleto] | [Categoría] | [Impacto en MVP].

Ejemplo:
| Función | Estado | Categoría | Impacto en MVP |
|---------|--------|-----------|----------------|
| `loginUser` | Incompleto (TODO) | Auth | Alto |
