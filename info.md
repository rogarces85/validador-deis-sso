# PRD Actual - Validador DEIS SSO 2026

## 1. Resumen del Producto

El Validador DEIS SSO 2026 es una aplicación web tipo SPA para prevalidar archivos REM antes de su carga oficial. El sistema permite cargar planillas `.xlsx` o `.xlsm`, extraer metadatos desde el nombre del archivo, leer el workbook en el navegador, validar la hoja `NOMBRE`, aplicar reglas normativas por serie y tipo de establecimiento, visualizar hallazgos y exportar un reporte Excel.

El procesamiento es 100% local en el navegador. No existe backend, base de datos ni envío de información clínica a servidores externos.

## 2. Objetivo del Sistema

Reducir errores de estructura, consistencia y digitación en archivos REM mediante una revisión previa automatizada que entregue al equipo estadístico una lista clara de hallazgos, severidades, valores evaluados y acciones de corrección.

## 3. Usuarios Objetivo

- Equipos de estadística de establecimientos del Servicio de Salud Osorno.
- Referentes REM y encargados de calidad de datos.
- Directivos o supervisores que necesitan revisar rápidamente el estado de un archivo.
- Administradores técnicos que mantienen catálogos, reglas y documentación.

## 4. Alcance Funcional Actual

### Incluido

- Carga local de archivos Excel `.xlsx` y `.xlsm`.
- Validación previa del nombre del archivo.
- Extracción de código de establecimiento, serie REM, mes, extensión y tamaño.
- Cruce del código de establecimiento contra `data/establishments.catalog.json`.
- Identificación del tipo de establecimiento para cargar reglas específicas.
- Lectura de celdas y rangos del workbook con SheetJS.
- Validación de la hoja `NOMBRE`.
- Aplicación de reglas base y reglas específicas por tipo de establecimiento.
- Clasificación de resultados por severidad: `ERROR`, `REVISAR`, `INDICADOR`.
- Visualización de resumen, porcentaje de aprobación y hallazgos.
- Filtros por severidad, hoja, estado y búsqueda textual.
- Panel lateral de detalle por hallazgo.
- Exportación Excel con hojas `Resumen`, `Hallazgos` y `Solo Errores` cuando existen fallas.
- Vista auxiliar de revisión de celdas basada en `data/celdas.catalog.json`.
- Modo claro/oscuro.

### No Incluido Actualmente

- Persistencia histórica de resultados.
- Autenticación o perfiles de usuario.
- Backend/API para almacenamiento o procesamiento.
- Corrección automática del archivo REM.
- Carga directa al sistema oficial DEIS.
- Validación completa para series distintas de `A`. El sistema reconoce `P`, `D`, `BM` y `BS`, pero las bloquea indicando que aún están en construcción.
- Exportación visible desde UI a JSON/CSV. El servicio existe, pero el panel actual solo expone exportación Excel.

## 5. Stack Tecnológico

- React 19 para interfaz SPA.
- TypeScript para tipado.
- Vite como servidor de desarrollo y herramienta de build.
- `xlsx-js-style` / SheetJS para lectura y generación de Excel.
- CSS propio con variables de tema y clases utilitarias.
- Vitest para pruebas.

## 6. Estructura Principal del Código

- `App.tsx`: orquestación de páginas, estado visual y navegación.
- `hooks/useValidationPipeline.ts`: pipeline principal de validación.
- `services/excelService.ts`: carga del workbook, lectura de celdas, suma de rangos y concatenación de celdas.
- `services/filenameValidator.ts`: validación del nombre del archivo.
- `services/nombreSheetValidator.ts`: validación específica de hoja `NOMBRE`.
- `services/ruleEngine.ts`: motor de evaluación de reglas JSON.
- `services/exportService.ts`: generación de reporte Excel, JSON y CSV.
- `components/FileDropzone.tsx`: carga y prevalidación de nombre.
- `components/RulesSummary.tsx`: resumen de archivo, establecimiento y aprobación.
- `components/FindingsTable.tsx`: tabla de hallazgos con filtros.
- `components/FindingDrawer.tsx`: detalle técnico del hallazgo.
- `components/ExportPanel.tsx`: botón de exportación Excel.
- `components/CeldasReview.tsx`: vista de revisión de celdas declaradas en catálogo.
- `data/rules/*.json`: reglas agrupadas por conjunto.
- `data/establishments.catalog.json`: catálogo oficial de establecimientos.
- `data/celdas.catalog.json`: catálogo de celdas para revisión auxiliar.

## 7. Datos y Reglas Disponibles

- Catálogo de establecimientos: versión `2026.1.0`, con 77 establecimientos.
- Catálogo de celdas: 1269 entradas.
- Reglas base: 41 reglas distribuidas en 11 hojas REM.
- Reglas hospital: 4 reglas.
- Reglas posta: 1 regla.
- Reglas SAMU/MOVIL: archivo disponible, sin reglas activas actualmente.
- Las reglas se cargan desde `data/rules/index.ts`, que expone los conjuntos `BASE`, `HOSPITAL`, `POSTA`, `MOVIL` y `SAMU`.

## 8. Formato de Archivo Esperado

El nombre debe cumplir el formato:

```text
[CodigoEstablecimiento6][SerieREM][Mes2].xlsx|.xlsm
```

Ejemplos válidos por estructura:

```text
123100A01.xlsx
123100A01.xlsm
```

Reglas de validación del nombre:

- Código de establecimiento de 6 dígitos.
- Serie de 1 o 2 letras.
- Mes de 2 dígitos entre `01` y `12`.
- Extensión `.xlsx` o `.xlsm`.
- Series reconocidas: `A`, `P`, `D`, `BM`, `BS`.
- Solo la Serie `A` está habilitada para validación; las demás generan error operativo de serie en construcción.

## 9. Flujo Principal del Sistema

### Flujo 1: Carga y Prevalidación

1. El usuario abre la pantalla principal.
2. El usuario arrastra o selecciona un archivo Excel.
3. `FileDropzone` valida inmediatamente el nombre con `FilenameValidatorService`.
4. Si el nombre es inválido, se muestran errores y se bloquea el botón `Validar`.
5. Si el nombre es válido, el usuario puede iniciar la validación.

### Flujo 2: Pipeline de Validación

1. `useValidationPipeline.validateFile` marca el estado como `isValidating`.
2. `ExcelReaderService.loadFile` carga el archivo con `FileReader` y `xlsx-js-style`.
3. `FilenameValidatorService.validate` extrae metadata desde el nombre.
4. Se construye `FileMetadata` con nombre original, tamaño, serie, mes, periodo `2026`, código, extensión y hojas del workbook.
5. Se busca el establecimiento por código en un `Map` derivado de `establishments.catalog.json`.
6. Se normaliza el tipo de establecimiento. Si el tipo es `OTRO`, se convierte a `OTROS`.
7. `NombreSheetValidator` valida la hoja `NOMBRE`.
8. Se cargan reglas `BASE` y reglas específicas según tipo de establecimiento.
9. Se filtran reglas cuyo `rem_sheet` comienza con la serie del archivo.
10. `RuleEngineService.evaluate` evalúa cada regla aplicable.
11. Se combinan primero los hallazgos de `NOMBRE` y luego los resultados del motor de reglas.
12. El estado final queda en `success`, la app navega automáticamente a `Resultados`.

### Flujo 3: Validación de Hoja NOMBRE

La validación de `NOMBRE` usa la hoja exacta `NOMBRE` y revisa:

- `A9`: versión permitida `Versión 1.2: Febrero 2026` o `Versión 1.1: Febrero 2026`.
- `B2`: nombre de comuna informado.
- `C2:G2`: código de comuna concatenado y existente en catálogo.
- `B3`: nombre de establecimiento informado.
- `C3:H3`: código de establecimiento concatenado y existente en catálogo.
- Código de establecimiento de hoja contra código extraído del nombre del archivo.
- `B6`: nombre del mes informado.
- `C6:D6`: código de mes válido entre `01` y `12`.
- Mes de hoja contra mes extraído del nombre del archivo.
- `B11`: responsable del establecimiento informado.
- `B12`: jefe de estadística informado.

Si la versión es inválida o está vacía, además del hallazgo se activa un banner prioritario de error de versión.

### Flujo 4: Evaluación de Reglas JSON

1. El motor recibe reglas filtradas por serie y tipo de establecimiento.
2. Antes de evaluar, verifica alcance por establecimiento y tipo.
3. Ignora reglas si el establecimiento está en `establecimientos_excluidos`.
4. Respeta `aplicar_a`, `aplicar_a_tipo` y `excluir_tipo`.
5. Soporta reglas exclusivas con `validacion_exclusiva`, invirtiendo el operador para establecimientos que no pertenecen al grupo objetivo.
6. Resuelve `expresion_1` y `expresion_2`.
7. Lee celdas individuales, rangos y expresiones `SUM(...)`.
8. Soporta sumas con `+`, por ejemplo `A03!L20 + A03!M20`.
9. Trata valores nulos como `0` para comparaciones lógicas.
10. Puede omitir reglas cuando ambos valores están vacíos, cuando `omitir_si_v1_es_cero` aplica o cuando `omitir_si_ambos_cero` aplica.
11. Evalúa operadores `==`, `!=`, `>`, `<`, `>=`, `<=`.
12. Genera un `ValidationResult` con estado, severidad, valores, comparación, diferencia, hoja, celda y evidencia.

### Flujo 5: Visualización de Resultados

1. `RulesSummary` muestra nombre de archivo, serie, mes, código, establecimiento, tipo y tasa de aprobación.
2. Se calculan reglas aprobadas, fallidas y conteo por severidad.
3. `FindingsTable` muestra la tabla de hallazgos.
4. La tabla permite filtrar por severidad, hoja y estado.
5. La búsqueda revisa descripción, ID de regla y mensaje.
6. La tabla oculta hallazgos con valor actual `0`, vacío, `null` o `undefined`.
7. Al presionar `Detalle`, se abre `FindingDrawer` con información técnica del hallazgo.
8. El usuario puede copiar el detalle al portapapeles.
9. El botón `Validar otro archivo` reinicia el estado y vuelve a la home.

### Flujo 6: Exportación Excel

1. El usuario presiona `Exportar Excel`.
2. `ExportService.exportToExcel` calcula aprobadas, fallidas, severidades y tasa de aprobación.
3. Se crea una hoja `Resumen` con metadata, establecimiento, fecha de proceso y estadísticas.
4. Se crea una hoja `Hallazgos` con todos los resultados.
5. Si existen fallas, se crea una hoja `Solo Errores` con resultados fallidos.
6. El archivo se descarga con nombre:

```text
Validacion_[Codigo]_[Serie]_[MesNombre]_[Periodo].xlsx
```

### Flujo 7: Revisión de Celdas

1. Tras validar un archivo, se habilita la navegación `Celdas`.
2. `CeldasReview` lee `data/celdas.catalog.json`.
3. Convierte etiquetas tipo `REMxx` a nombres internos de hoja como `Axx`.
4. Valida si la referencia de celda es válida.
5. Verifica si la hoja existe en el workbook cargado.
6. Lee el valor de cada celda y clasifica el estado como `OK`, `CELDA_VACIA`, `CELDA_INVALIDA` u `HOJA_NO_EXISTE`.
7. Permite filtrar por búsqueda, estado, hoja y regla.
8. Relaciona filas del catálogo con reglas de `reglas_finales.json` cuando existe coincidencia por hoja y código.

## 10. Severidades

- `ERROR`: falla crítica o inconsistencia que requiere corrección antes del envío.
- `REVISAR`: posible inconsistencia o valor atípico que necesita revisión humana.
- `INDICADOR`: advertencia o señal de calidad/gestión que no necesariamente bloquea el flujo.

## 11. Reglas de Negocio Relevantes

- Un archivo con nombre inválido no puede iniciar la validación.
- Un archivo de serie reconocida pero distinta de `A` se bloquea por no estar liberada.
- La hoja `NOMBRE` es validada antes de las reglas normativas.
- Las reglas base siempre se consideran junto con reglas específicas del tipo de establecimiento.
- Si no existe conjunto específico para el tipo detectado, solo aplican reglas base.
- Los establecimientos `MOVIL` y `SAMU` usan el mismo archivo de reglas `samu.json`.
- El sistema identifica establecimientos desconocidos, pero la metadata igual conserva el código del nombre.
- Las reglas con valores vacíos pueden retornar aprobadas por omisión para evitar falsos positivos.
- La exportación incluye todos los resultados, no solo los visibles en la tabla filtrada.

## 12. Estados de la Aplicación

- `idle`: sin archivo cargado.
- `loading`: archivo en proceso de validación.
- `success`: archivo validado y resultados disponibles.
- `error`: error de carga, nombre, lectura o validación general.

## 13. Páginas y Navegación

- `Cargar Archivo`: pantalla inicial con dropzone, prevalidación y manual de usuario.
- `Resultados`: disponible cuando existe validación exitosa.
- `Celdas`: disponible cuando existe validación exitosa.

La navegación `Resultados` y `Celdas` permanece deshabilitada hasta que se valide un archivo.

## 14. Privacidad y Seguridad

- El archivo se procesa en memoria del navegador.
- No hay transferencia de archivos a servidor.
- No hay almacenamiento persistente de resultados.
- Al recargar la página, el resultado se pierde.
- El tema visual puede persistirse mediante almacenamiento local según el contexto de tema.

## 15. Criterios de Aceptación del Sistema Actual

- Dado un archivo con extensión distinta de `.xlsx` o `.xlsm`, el sistema debe rechazarlo.
- Dado un archivo con nombre fuera del formato esperado, el sistema debe mostrar error y bloquear validación.
- Dado un archivo Serie `A` con nombre válido, el sistema debe cargarlo y avanzar al pipeline.
- Dado un archivo Serie `P`, `D`, `BM` o `BS`, el sistema debe indicar que la serie está en construcción.
- Dado un código de establecimiento existente, el sistema debe mostrar nombre y tipo del establecimiento.
- Dada una versión inválida en `NOMBRE!A9`, el sistema debe generar error y banner prioritario.
- Dado un código o mes inconsistente entre nombre y hoja `NOMBRE`, el sistema debe generar hallazgo `ERROR`.
- Dada una regla aplicable fallida, el sistema debe mostrar valores, comparación, diferencia y severidad.
- Dado un conjunto de resultados, el resumen debe mostrar total, aprobadas, fallidas y aprobación porcentual.
- Dado un resultado disponible, el usuario debe poder exportar un Excel con resumen y hallazgos.

## 16. Riesgos y Limitaciones Detectadas

- La documentación menciona 91 validaciones activas, pero los archivos actuales de `data/rules` suman 46 reglas activas entre base, hospital y posta; `samu.json` no contiene reglas activas.
- La tabla de hallazgos filtra automáticamente resultados con valor actual `0` o vacío, por lo que el conteo visible puede no coincidir con el total del resumen.
- `NombreSheetValidator` concatena códigos convirtiéndolos a número; si un código válido dependiera de ceros iniciales, podría perderlos.
- La validación carga el Excel antes de validar formalmente el nombre dentro del pipeline, aunque la UI ya hace prevalidación antes de permitir continuar.
- El servicio soporta exportación JSON/CSV, pero la UI actual solo ofrece Excel.
- No hay persistencia ni trazabilidad histórica de validaciones.
- No hay validación de versión del catálogo contra una fuente externa; depende de los JSON locales.

## 17. Comandos de Desarrollo

```bash
npm install
npm run dev
npm run build
npm run test
npm run sync-rules
npm run sync-rules:check
```

## 18. Indicadores de Calidad Recomendados

- Porcentaje de archivos validados sin errores críticos.
- Cantidad promedio de errores por establecimiento.
- Reglas con mayor frecuencia de falla.
- Hojas REM con más inconsistencias.
- Tiempo promedio desde validación inicial hasta archivo corregido.
- Cobertura de reglas por hoja REM y tipo de establecimiento.

## 19. Roadmap Sugerido

- Habilitar exportación JSON/CSV desde la interfaz si se requiere interoperabilidad.
- Revisar discrepancia entre documentación de 91 validaciones y reglas activas actuales.
- Añadir soporte real para series `P`, `D`, `BM` y `BS`.
- Mejorar concatenación de códigos para preservar ceros iniciales.
- Añadir reporte visible de reglas omitidas y motivo de omisión.
- Implementar pruebas para `NombreSheetValidator` y `FilenameValidatorService`.
- Agregar modo de auditoría opcional para guardar resultados localmente sin exponer datos sensibles.
