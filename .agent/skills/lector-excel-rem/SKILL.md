---
name: Lector Excel REM
description: Lee y procesa archivos Excel de reportes REM (.xlsx, .xlsm) utilizando los servicios y utilidades existentes del proyecto.
---

# Lector Excel REM

Esta habilidad permite leer, parsear y extraer datos de archivos Excel con formato REM (Registro Estadístico Mensual) utilizando la infraestructura existente del proyecto.

---

## Prerrequisitos

- El archivo debe ser un objeto `File` válido de JavaScript (obtenido vía input file o drag & drop).
- El formato debe ser compatible con Excel (`.xlsx`, `.xlsm`).
- Se utiliza la librería `xlsx` (SheetJS) que ya está instalada en el proyecto.

---

## Instrucciones

### Paso 1 — Importar el Servicio o Utilidad

Para leer un archivo Excel, puedes usar el Singleton `ExcelReaderService` (para estado global) o la función pura `readWorkbook` (para procesamiento stateless).

**Opción A: Singleton (Recomendado para flujo principal)**
```typescript
import { ExcelReaderService } from '../../services/excelService';
```

**Opción B: Función Pura (Recomendado para workers o tests)**
```typescript
import { readWorkbook } from '../../src/utils/excel/excelReader';
```

### Paso 2 — Cargar el Archivo

Una vez que tengas el objeto `File` (generalmente desde `FileUploader` o `FileDropzone`), cárgalo en el servicio.

```typescript
const file: File = ...; // Obtenido del input
const excelService = ExcelReaderService.getInstance();

try {
    await excelService.loadFile(file);
    console.log('Archivo cargado exitosamente');
} catch (error) {
    console.error('Error al leer el archivo Excel', error);
}
```

### Paso 3 — Leer Datos de Celdas

Puedes leer valores individuales o rangos específicos.

```typescript
// Leer una celda específica (Hoja, Celda)
const valor = excelService.getCellValue('A', 'C5'); 

// Leer y sumar un rango
const suma = excelService.getRangeSum('A', 'C5:C10');
```

---

## Convenciones

- **Singletons**: Usa `ExcelReaderService.getInstance()` para mantener el estado del workbook cargado a través de diferentes componentes.
- **Nombres de Hojas**: Los REM suelen tener hojas llamadas por su serie (e.g., "A", "BS", "D").
- **Tipos de Datos**: Los valores crudos pueden ser `string`, `number` o `null`. Asegúrate de validar el tipo antes de operar matemáticamente.

---

## Ejemplos

### Ejemplo 1: Flujo completo en un Hook

```typescript
import { ExcelReaderService } from '../../services/excelService';

export const useExcelProcessor = () => {
    const processFile = async (file: File) => {
        const service = ExcelReaderService.getInstance();
        
        // 1. Cargar
        await service.loadFile(file);
        
        // 2. Extraer datos (ej: Sección A, celda C5)
        const totalAtenciones = service.getCellValue('A', 'C5');
        
        return { totalAtenciones };
    };

    return { processFile };
};
```

### Ejemplo 2: Uso de `readWorkbook` para obtener estructura completa

```typescript
import { readWorkbook } from '../../src/utils/excel/excelReader';

const analyzeExcel = async (file: File) => {
    // Lee todo el libro y devuelve estructura WorkbookData
    const data = await readWorkbook(file);
    
    // Acceder a la primera hoja
    const firstSheet = data.sheets[0];
    console.log(`Hoja: ${firstSheet.name}`);
    
    // Ver valor de A1
    console.log(firstSheet.data['A1']?.v);
};
```

---

## Notas

- **Rendimiento**: `readWorkbook` lee todo el archivo en memoria. Para archivos muy grandes, considera usar opciones de rango o `lite: true`.
- **Validación de Nombre**: Antes de procesar, asegúrate que el nombre del archivo cumple el patrón REM (ver `validateFilename` en `utils`).
- **Macros**: El lector ignora las macros VBA (`.xlsm`) por seguridad, pero lee los valores de las celdas.
