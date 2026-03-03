# Análisis Exhaustivo del Motor de Reglas (Validador DEIS-SSO)

## 1. Visión General del Sistema de Reglas (`rules.json`)

El archivo `rules.json` es el núcleo lógico del motor de validación para las estadísticas del REM. Actualmente, procesa la integridad de los datos reportados por los establecimientos de salud de Osorno.

*   **Total de reglas activas**: 66
*   **Alcance actual**: 11 hojas tabulares (Serie A)
*   **Hojas cubiertas**: A01, A02, A03, A04, A05, A06, A08, A09, A11, A19a, A19b, A27, A28, A29, A30R.

---

## 2. Tipología y Estructura Actual de Reglas

La estructura subyacente de cada regla JSON sigue una notación de "comparación binaria":

```json
{
  "id": "VAL01",
  "tipo": "CELDA",
  "rem_sheet": "A01",
  "expresion_1": "F11",
  "operador": "==",
  "expresion_2": 0,
  "severidad": "REVISAR",
  "mensaje": "Mensaje descriptivo del error..."
}
```

### Operaciones soportadas por el AST (Abstract Syntax Tree) simplificado:
1.  **Validación atómica**: Evalúa una celda contra un estático numérico.
2.  **Igualdad posicional**: Evalúa dos celdas estáticas cruzadas (`B13 >= AS13`).
3.  **Agrupaciones Excel nativas**: Lee rangos puros (`C329:E339`).
4.  **Combinaciones de suma (Custom)**: `SUM(C19:C26, F36:F38)`.
5.  **Aritmética lineal (+)**: Sumatorias hardcodeadas (`D16+D17`).
6.  **Referencias Multi-sheet (Cross-sheet)**: Revisa dependencias de otras hojas con un `bang (!)` identifier (ej: `A03!C108`).

---

## 3. Mejoras Modulares Añadidas (Versiones Recientes)

El motor de reglas ha evolucionado para capturar la lógica operativa y las restricciones complejas que impone el Minsal por tipo de centro de salud:

### A. Filtrado Categórico (`aplicar_a_tipo` / `excluir_tipo`)
Permite aplicar validaciones masivas basadas en la clasificación del centro de salud de acuerdo al archivo maestro `establishments.catalog.json`.
*   *Beneficio*: Se evitan falsos positivos globales pidiendo ingresos en un "SAPU" cuando la regla es estrictamente de "HOSPITAL".

### B. Especificidad Exacta (`aplicar_a` / `establecimientos_excluidos`)
Define reglas a nivel de código DEIS (6 dígitos) para casuísticas extremadamente cerradas.
*   *Ejemplo real*: Exámenes de Hepatitis de laboratorio en la hoja `A11` **solo** le corresponden al Hospital Base San José de Osorno (HBSJO = `123100`).

### C. Omisión de Silencios Matemáticos (`omitir_si_ambos_cero: true`)
Evita comportamientos matemáticamente falsos en operadores de desigualdad (`>`, `<`, `>=`, `<=`).
*   *Resolución*: Soluciona el bug `0 > 0 = false` que disparaba un `ERROR` irreal cuando la celda simplemente no poseía atenciones en su columna respectiva.

### D. Exclusividad Bidireccional (`validacion_exclusiva: true`)
Sistematiza el requerimiento funcional de: *"Esto lo reporta exclusivamente el Hospital X"*
*   Si eres el Hospital X y evalúas a `0` → **ERROR** (olvidaste reportar).
*   Si eres cualquier otro centro (Postas, CESFAM) y posees datos `> 0` → **ERROR** (falsa digitación en celdas bloqueadas).

---

## 4. Áreas de Mejora Técnica (Propuestas a Futuro)

Desde una perspectiva de **Senior UI/UX & Backend Architect**, el sistema presenta áreas vulnerables frente a escalabilidad futura (cuando se ingresen las Series B, C, D, P). Las propuestas estructurales son:

### 1. Refactorización de Expresiones y Abandono de "Strings Mágicos"
Actualmente el motor parsea regex y strings crudos (`"A03!C108 + A03!C110"`). Esto es sujeto a roturas graves si alguien añade un espacio indebido en el JSON y la macrofalla pasa sin detectar.
*   **Solución Modular:** Pasar hacia una notación de evaluación por Objeto.
    ```json
    "expresion_1": {
      "fn": "SUM",
      "args": [
        {"sheet": "A03", "cell": "C108"},
        {"sheet": "A03", "cell": "C110"}
      ]
    }
    ```

### 2. Clustering (Agrupación de Reglas Simétricas)
Existe un anti-patrón donde se clonan los nodos JSON para validar un rango fila por fila (Ej: VAL01 a VAL05 revisan 15 celdas distintas con `== 0`).
*   **Solución de Rendimiento:** Habilitar un operador iterativo `EACH`.
    ```json
    "expresion_1": "F11:F20",
    "operador": "EACH ==",
    "expresion_2": 0
    ```
    El Rule Engine evalúa el iterador limpiamente en código TypeScript, eliminando un 30% la verbosidad actual del JSON maestro.

### 3. Etiquetas Cognitivas (Visual Metadata UI)
Las severidades están cubiertas (`ERROR`, `REVISAR`), pero la analítica visual es monolítica en la tabla UI.
*   **Solución de UX (Cognitive Load):** Inyectar `"tags": ["salud_mental", "urgencias", "ges"]` en `rules.json`. De este modo, la UI (React/Vue) puede renderizar "Filtros de Especialidad", facilitando a los directivos la visualización aislada de errores.

### 4. Variables Globales Transitorias
Repetición dura de patrones demográficos (edades, géneros).
*   **Solución Arquitectónica:** Soportar variables en memoria durante el parseo (`$RANGO_HOMBRES_AM`).

### 5. Versionado y Estructura por Año Resolutivo del MINSAL
Los manuales REM cambian casillas, definen nuevas columnas y renumeran filas anualmente. Al ser el Validador estático, al cargar un Excel histórico (Ej: Año 2024), el layout cruzará incorrectamente disparando miles de errores.
*   **Solución Evolutiva Multiverso:** El JSON ya no debe contener las hojas en el `root`, sino jerarquizado por la variable encontrada en la celda A9 del reporte ("Versión X.X").
    ```json
    {
      "versiones_soporte": ["2026.1", "2024.1"],
      "2026.1": {
        "A": { "rules": [...] }
      }
    }
    ```
    La migración dejará un backend altamente adaptable y previsor, convirtiéndolo en un producto sostenible del SS Osorno durante una década.
