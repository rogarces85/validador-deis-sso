# Documento de Requerimientos del Producto (PRD) - Validador DEIS SSO

## 1. Información del Proyecto
- **Nombre del Producto:** Validador DEGI (Registro Estadístico Mensual - REM)
- **Nombre del Proyecto (Code):** ValidadorDEGI2022 / ValidadorDEGI2024
- **Organización:** Servicio de Salud Osorno (SSO), Departamento de Estadísticas e Información de Salud.
- **Estado Actual:** Legado / En Producción (Actualizado a 2024/2025).
- **URL de Publicación:** [estadisticas.ssosorno.cl](https://estadisticas.ssosorno.cl/estadisticas/instalador/publish.html)
- **Tecnología:** Visual Basic .NET (Windows Forms) / .NET Framework 4.8.

## 2. Descripción General
El Validador DEIS SSO es una herramienta de escritorio diseñada para auditar y validar la consistencia de los datos contenidos en los archivos de Registro Estadístico Mensual (REM) generados por los establecimientos de salud de la red Osorno. El objetivo principal es detectar errores de digitación, inconsistencias lógicas y faltas en las reglas de validación ministeriales antes de la consolidación central.

## 3. Objetivos del Producto
- **Garantizar la Calidad del Dato:** Asegurar que los datos reportados sean coherentes entre las diferentes secciones y hojas del archivo REM.
- **Automatizar la Auditoría:** Reemplazar la revisión manual de archivos Excel por un proceso automatizado que resalte errores críticos.
- **Facilitar la Corrección:** Proporcionar un reporte claro de las celdas y reglas que fallaron, permitiendo a los establecimientos corregir sus datos rápidamente.

## 4. Funcionalidades Principales

### 4.1. Importación y Detección de Archivos
- **Carga de Archivos:** Soporte para archivos Excel en formato `.xlsx` y `.xlsm`.
- **Identificación Automática:** El sistema extrae información del nombre del archivo (código de establecimiento, serie, mes, año) para determinar el flujo de validación.
- **Detección de Series:**
  - **Serie A:** 
  - **Serie P:** 
  - **Serie D:** 
  - **Serie BM:** 
  - **Serie BS:** 

### 4.2. Motor de Validación
- **Lectura por Interop:** Utiliza Microsoft Office Interop para leer celdas y rangos específicos de las hojas (ej: `A01`, `A02`, `A03`).
- **Niveles de Hallazgo:**
  - **[ERROR]:** Inconsistencias graves que impiden la aceptación del dato (ej: totales que no cuadran).
  - **[REVISAR]:** Datos que son atípicos o requieren confirmación (ej: atenciones en edades extremas).
  - **[OBSERVAR]:** Notas informativas sobre la calidad del registro.
- **Tipos de Reglas:**
  - **Validación Cruzada:** Comparación de valores entre diferentes hojas (ej: REM A01 vs REM A03).
  - **Validación de Totales:** Verificación de que la suma de subcategorías coincida con el total general o la columna de beneficiarios.
  - **Validación de Rango:** Valores esperados en celdas específicas según la sección.

### 4.3. Visualización y Reporte
- **Grilla de Resultados:** Visualización en tiempo real de los hallazgos en un `DataGridView`.
- **Exportación:** Generación de un nuevo reporte Excel con los errores detectados, aplicando formatos de color (Rojo para [ERROR], Naranjo para [REVISAR], Verde para [OBSERVAR]).

## 5. Requerimientos Técnicos (Legado)
- **SO:** Windows 7/10/11.
- **Dependencias:** Microsoft Excel instalado (requerido para Interop).
- **Framework:** .NET Framework 4.x.

## 6. Flujo del Usuario
1. El usuario abre la aplicación.
2. Selecciona el archivo REM (.xlsm/.xlsx) mediante un diálogo de apertura.
3. El sistema carga los datos y ejecuta el proceso de validación correspondiente a la serie detectada.
4. El usuario revisa los errores en pantalla.
5. El usuario exporta los hallazgos a un Excel para ser enviado al establecimiento responsable de la corrección.

## 7. Apéndice: Ejemplos de Reglas Implementadas
- **Regla A01/VAL [01]:** Verifica que en el Control Preconcepcional (F11, F12) no existan registros para edades de 10 a 14 años sin revisión.
- **Regla A02/VAL [01]:** El total de EMP realizado por profesional (B11) debe ser igual al total según estado nutricional (B21).
- **Regla Cruzada A01/A03:** La suma de controles por ciclo vital en A01 debe ser mayor o igual a la aplicación de escalas en A03 para rangos de edad equivalentes.
