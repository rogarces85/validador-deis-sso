---
description: Extrae strings de múltiples ubicaciones en Excel, los limpia, los une y genera un valor numérico validado.
---

# Skill: Excel Concatenador (Skill_Excel_Concatenate)

## 📌 Propósito Central
Esta Skill tiene una responsabilidad doble en el motor de lectura de Excel:
1. **Extracción y Unión:** Leer valores desde múltiples coordenadas de celdas y concatenarlas mediante un separador opcional.
2. **Sanitización Matemática:** Asegurar que la cadena resultante sea purgada de caracteres no numéricos (como espacios, puntos de miles o monedas) y convertida estrictamente en un tipo `Number` (Integer o Float) válido para operaciones matemáticas en el validador.

---

## ⚙️ Definición Técnica

### Entrada (Inputs)
- **`coordenadas`** (`string[]` o `CellRef[]`): Un array ordenado de referencias a celdas. Ejemplo: `["A1", "B1"]` o `["A03!C10", "A03!D10"]`.
- **`separador`** (`string`, opcional): Un carácter o cadena a insertar entre los valores leídos. Por defecto es `""` (vacío).
- **`hojaDato`** (`string`): El nombre de la hoja de Excel actual donde se leerán las coordenadas si éstas no especifican hoja cruzada.

### Proceso Interno
1. **Recuperación de Datos:** 
   El sistema iterará sobre el array de `coordenadas`. Para cada una, se debe invocar internamente a `ExcelReaderService.getCellValue` (la implementación técnica de *Skill_Excel_ReadCell*).
2. **Unión (Concatenación):**
   Los valores crudos recuperados se transforman en `string` (incluso si la librería de Excel los retornó como números u objetos) y se concatenan usando el `separador` provisto.
3. **Limpieza (Sanitización):**
   Se ejecuta una función de reemplazo por expresión regular (RegEx) diseñada para conservar únicamente dígitos, el signo negativo y el punto/coma decimal.
   * *Ejemplos a limpiar:* `$ 1.500`, `1 200`, `25,5 pts`.
4. **Conversión (Casting):**
   Se aplica `parseFloat()` o `Number()` sobre la cadena purgada. Si el resultado es `NaN`, se debe resolver hacia `0` para mantener la estabilidad matemática del validador.

### Salida (Outputs)
- **`Number`**: Un valor numérico puro. Listo para ser operado con comparaciones (>, <, ==) o sumatorias.

---

## 🛠️ Implementación en TypeScript (Ejemplo de Guía)

El caso de uso ideal es inyectar este comportamiento como un método de apoyo o dentro del Parseador de Expresiones (`resolveExpression`) en `ruleEngine.ts` o como una función utilitaria en `excelService.ts`.

```typescript
import { ExcelReaderService } from './excelService';

export class ExcelConcatenateService {
  private excel = ExcelReaderService.getInstance();

  /**
   * Extrae, limpia, concatena y castéa datos de múltiples celdas.
   * 
   * @param hojaDato La hoja por defecto donde buscar
   * @param coordenadas Las celdas a concatenar
   * @param separador El separador opcional (default '')
   * @returns Un valor numérico garantizado
   */
  public concatenateToNumber(hojaDato: string, coordenadas: string[], separador: string = ""): number {
    
    // 1. Extraer y convertir a array de strings puros
    const valoresCrudos = coordenadas.map(ref => {
      // Manejar referencias cruzadas si las hay (H1!A1)
      let sheet = hojaDato;
      let targetRef = ref;
      if (ref.includes('!')) {
        const parts = ref.split('!');
        sheet = parts[0];
        targetRef = parts[1];
      }
      
      const rawValue = this.excel.getCellValue(sheet, targetRef);
      // Asegurarse de retornar un string incluso desde undefined/null
      return rawValue === null || rawValue === undefined ? "" : String(rawValue);
    });

    // 2. Concatenar
    const resultadoString = valoresCrudos.join(separador);

    // 3. Sanitizar (quitar lo que no sea dígito, menos, punto o coma)
    const stringLimpio = resultadoString.replace(/[^0-9.,-]/g, '');
    
    // Homologar comas a puntos para parseFloat
    const stringParseable = stringLimpio.replace(',', '.');

    // 4. Casting a Número
    const numeroFinal = parseFloat(stringParseable);

    // Si la limpieza dio algo inválido (ej: puro texto que desapareció), retornar 0.
    return isNaN(numeroFinal) ? 0 : numeroFinal;
  }
}
```

---

## 📝 Casos de Uso en Validador2026

*   **Identificadores Compuestos**: Algunos códigos o IDs de establecimientos vienen partidos en varias columnas (ej. Centro A en celda A1, Subcentro B en celda B1). Esta Skill permite concatenar "123" y "45" a `12345` numéricamente evaluable.
*   **Fechas Segmentadas Numéricas**: Unificación de [Día, Mes, Año] a formatos seriales estilo Excel.
*   **Limpieza de Ruido**: Celdas donde un digitador en la Posta ingresó `1.000 ` (con punto y espacio) y otro ingresó `1000`. La Skill purga y une.
