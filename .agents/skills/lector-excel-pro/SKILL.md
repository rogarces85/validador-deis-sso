---
name: Lector Excel Pro
description: Lectura eficiente de todas las hojas de un Excel (.xlsx, .xlsm) con optimización de rendimiento e integración en el formulario de la app.
---

# Lector Excel Pro

Esta habilidad permite procesar archivos Excel de forma masiva y eficiente, extrayendo datos de todas las hojas disponibles y asegurando la compatibilidad con el sistema de validación del proyecto.

---

## Prerrequisitos

- Los archivos deben cargarse a través del componente `FileDropzone`.
- Se requiere el uso de `ExcelReaderService` para mantener la instancia del libro de trabajo.

---

## Instrucciones de Rendimiento

Para una lectura "más eficiente", sigue estas reglas al usar la librería `xlsx` (SheetJS):

1. **Flags de Lectura**: Desactiva estilos y macros para reducir el consumo de memoria y CPU.
   ```typescript
   XLSX.read(data, {
       type: 'array',
       bookVBA: false,      // Ignorar macros
       cellStyles: false,   // Ignorar estilos (bordes, colores)
       cellFormula: true,   // Mantener fórmulas si son necesarias para validación
   });
   ```

2. **Iteración de Hojas**: Utiliza un bucle sobre `SheetNames` para no omitir datos críticos de subseries.

3. **Acceso Stateless**: Prefiere obtener el valor crudo `.v` para comparaciones rápidas.

---

## Integración con el Formulario

El flujo de trabajo estándar en este proyecto es:

1. **Captura**: El archivo llega desde `FileDropzone`.
2. **Carga**: Se invoca `excelService.loadFile(file)`.
3. **Pipeline**: El hook `useValidationPipeline` coordina la validación del nombre y la lectura de datos.

### Ejemplo de Procesamiento Total

```typescript
const excelService = ExcelReaderService.getInstance();
const sheets = excelService.getSheets(); // Retorna SheetNames[]

const allData = sheets.map(sheetName => {
    // Procesar lógica específica por hoja
    return {
        name: sheetName,
        total: excelService.getRangeSum(sheetName, 'A1:Z500') // Ajustar rango según necesidad
    };
});
```

---

## Convenciones

- **Series REM**: Las hojas suelen llamarse "A", "BS", "D", "P". La habilidad debe ser capaz de identificar cuál es la hoja principal basada en el nombre del archivo (metadata).
- **Rango Dinámico**: Evita procesar toda la hoja si los datos están contenidos en un bloque específico; usa `XLSX.utils.decode_range` sobre `!ref`.

---

## Notas

- **Archivos Grandes**: Si el archivo supera los 10MB, notifica al usuario sobre el tiempo de procesamiento.
- **Seguridad**: No ejecutes nunca macros de archivos `.xlsm`.
