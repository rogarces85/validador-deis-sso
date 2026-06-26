# Feature Specification: Incorporacion Serie P

**Feature Branch**: `001-serie-p-validacion`

**Created**: 2026-06-26

**Status**: Draft

**Input**: User description: "Incorporar validaciones completas de la Serie P desde Reestructuracion_Expandido.xlsx, habilitar la validacion de Serie P junto con Serie A, exigir hojas P obligatorias, aceptar solo meses 06 y 12 para Serie P, bloquear otras series no realizadas y actualizar manual."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validar Archivo Serie P Semestral (Priority: P1)

Como usuario del validador, quiero cargar un archivo REM Serie P con nombre valido, establecimiento valido, mes semestral valido y hojas obligatorias presentes para obtener resultados de validacion confiables.

**Why this priority**: Es el objetivo principal de la entrega. Sin esta historia, la Serie P no queda operativa.

**Independent Test**: Cargar un archivo `123010P06.xlsm` o `123010P12.xlsm` con hoja NOMBRE y hojas P obligatorias; el sistema debe aceptar el archivo, leer metadata, validar NOMBRE y ejecutar reglas P disponibles.

**Acceptance Scenarios**:

1. **Given** un archivo `123010P06.xlsm` con establecimiento valido y hojas obligatorias, **When** el usuario lo carga, **Then** el sistema acepta Serie P y ejecuta validaciones P.
2. **Given** un archivo `123010P12.xlsm` con hoja NOMBRE coherente, **When** el usuario lo carga, **Then** el sistema acepta el mes 12 para Serie P.
3. **Given** un archivo Serie P con mes `05`, **When** el usuario lo carga, **Then** el sistema lo bloquea indicando que Serie P solo acepta `06` y `12`.

---

### User Story 2 - Bloquear Archivos Serie P Incompletos (Priority: P1)

Como usuario del validador, quiero que un archivo Serie P sin las hojas obligatorias sea rechazado antes de ejecutar reglas para evitar resultados incompletos.

**Why this priority**: Las reglas pueden depender de la estructura completa del REM. Si faltan hojas, no debe emitirse una validacion parcial como si fuera completa.

**Independent Test**: Cargar un archivo Serie P sin `P9` o sin `P13`; el sistema debe bloquear el archivo y listar las hojas faltantes.

**Acceptance Scenarios**:

1. **Given** un archivo Serie P sin `P9`, **When** el usuario lo carga, **Then** el sistema informa que falta `P9` y no ejecuta reglas.
2. **Given** un archivo Serie P sin `P13`, **When** el usuario lo carga, **Then** el sistema informa que falta `P13` y no ejecuta reglas.
3. **Given** un archivo Serie P con `P9` y `P13` presentes pero sin reglas configuradas para esas hojas, **When** el usuario lo carga, **Then** el sistema acepta las hojas y ejecuta las reglas disponibles de las otras hojas P.

---

### User Story 3 - Mantener Serie A Sin Regresiones (Priority: P1)

Como usuario del validador, quiero que los archivos Serie A sigan funcionando igual que antes mientras se incorpora Serie P.

**Why this priority**: Serie A ya esta en uso; habilitar Serie P no debe degradar validaciones existentes.

**Independent Test**: Cargar un archivo Serie A valido y verificar que sigue aceptando meses `01` a `12`, usando el mismo catalogo de establecimientos y las reglas A actuales.

**Acceptance Scenarios**:

1. **Given** un archivo `123010A01.xlsm`, **When** el usuario lo carga, **Then** el sistema mantiene el flujo actual de Serie A.
2. **Given** un archivo `123010A12.xlsm`, **When** el usuario lo carga, **Then** el mes 12 sigue siendo valido para Serie A.

---

### User Story 4 - Bloquear Series No Realizadas (Priority: P2)

Como usuario del validador, quiero recibir un mensaje claro cuando intento subir una serie no implementada para saber que el sistema aun no la valida.

**Why this priority**: Evita falsas expectativas y mantiene el alcance operativo claro.

**Independent Test**: Cargar un archivo `123010D06.xlsm`, `123010BM06.xlsm` o `123010BS06.xlsm`; el sistema debe bloquearlo con mensaje en espanol indicando que esa serie no esta realizada.

**Acceptance Scenarios**:

1. **Given** un archivo Serie D, **When** el usuario lo carga, **Then** el sistema indica que la Serie D no esta realizada.
2. **Given** un archivo Serie BM o BS, **When** el usuario lo carga, **Then** el sistema indica que esa serie no esta realizada.

---

### User Story 5 - Documentar Operacion Serie P (Priority: P3)

Como usuario del validador, quiero que el manual explique como cargar Serie P, sus meses validos y sus hojas obligatorias para operar sin depender de soporte tecnico.

**Why this priority**: La habilitacion debe quedar documentada para uso real del equipo.

**Independent Test**: Revisar el manual y confirmar que contiene formato de archivo, meses `06`/`12`, hojas obligatorias y nota de `P9`/`P13` sin reglas iniciales.

**Acceptance Scenarios**:

1. **Given** el manual actualizado, **When** el usuario consulta Serie P, **Then** encuentra ejemplos `123010P06.xlsm` y `123010P12.xlsm`.
2. **Given** el manual actualizado, **When** el usuario revisa hojas requeridas, **Then** encuentra `P9` y `P13` como obligatorias aunque sin reglas iniciales.

### Edge Cases

- Archivo Serie P con nombre valido pero hoja NOMBRE con mes distinto al nombre del archivo.
- Archivo Serie P con mes `06` o `12` en el nombre, pero hoja NOMBRE con mes fuera de `06`/`12`.
- Archivo Serie P con `P9` y `P13` presentes como hojas vacias: debe aceptarse la estructura y ejecutar reglas disponibles.
- Archivo Serie P con hoja `P09` en vez de `P9`: debe considerarse faltante `P9` salvo que se defina normalizacion explicita en una etapa futura.
- Archivo con serie desconocida fuera de `A`, `P`, `D`, `BM`, `BS`: debe bloquearse como serie no reconocida o no realizada, sin ejecutar reglas.
- Reglas P con expresiones aritmeticas que usan resta, multiplicacion, parentesis y `SUM(...)` combinados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST habilitar validacion de Serie P sin deshabilitar ni alterar el comportamiento esperado de Serie A.
- **FR-002**: El sistema MUST aceptar archivos Serie P solo cuando el nombre cumpla `CodigoEstablecimiento6 + P + Mes2` y el mes sea `06` o `12`.
- **FR-003**: El sistema MUST mantener Serie A con meses validos `01` a `12`.
- **FR-004**: El sistema MUST bloquear cualquier serie no realizada con un mensaje claro en espanol indicando que actualmente solo estan disponibles las Series A y P.
- **FR-005**: El sistema MUST validar que los archivos Serie P contengan las hojas `NOMBRE`, `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P9`, `P11`, `P12` y `P13` antes de ejecutar reglas.
- **FR-006**: El sistema MUST bloquear la validacion Serie P si falta cualquiera de las hojas obligatorias y MUST listar las hojas faltantes.
- **FR-007**: El sistema MUST validar hoja NOMBRE usando el mismo catalogo de establecimientos para Serie A y Serie P.
- **FR-008**: El sistema MUST validar que el mes de hoja NOMBRE coincida con el mes del nombre de archivo.
- **FR-009**: El sistema MUST restringir hoja NOMBRE de Serie P a meses `06` y `12`.
- **FR-010**: El sistema MUST importar reglas Serie P desde `Reestructuracion_Expandido.xlsx` hacia `data/reglas_finales.json`, respetando que este archivo es la unica fuente de verdad.
- **FR-011**: El sistema MUST crear entradas `P9` y `P13` en `data/reglas_finales.json` como arrays vacios mientras no existan reglas, manteniendolas como hojas obligatorias.
- **FR-012**: El motor de reglas MUST evaluar expresiones necesarias para Serie P, incluyendo celdas, rangos, `SUM(...)`, suma, resta, multiplicacion y parentesis simples.
- **FR-013**: Toda regla Serie P MUST conservar trazabilidad con hoja REM, ID, severidad, expresiones evaluadas, operador, mensaje humano y valores comparados.
- **FR-014**: El manual MUST documentar Serie P como serie semestral, sus meses validos, formato de archivo, hojas obligatorias y estado inicial de `P9`/`P13`.
- **FR-015**: System MUST keep all user-facing text, validation messages, documentation, and exported report labels in Spanish.
- **FR-016**: System MUST preserve local-only processing in the browser unless the feature explicitly records a constitutional exception.
- **FR-017**: System MUST keep validation findings traceable with severity, location, evaluated values, source rule or validator, and a human correction message.

### Key Entities *(include if feature involves data)*

- **Serie REM**: Identificador de alcance de validacion. Valores habilitados al cierre de esta feature: `A` y `P`.
- **Mes Permitido Por Serie**: Conjunto de meses validos segun serie. Serie A usa `01` a `12`; Serie P usa `06` y `12`.
- **Hoja Obligatoria Serie P**: Hoja requerida para aceptar un REM Serie P: `NOMBRE`, `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P9`, `P11`, `P12`, `P13`.
- **Regla Serie P**: Validacion declarada en `data/reglas_finales.json`, derivada de `Reestructuracion_Expandido.xlsx`.
- **Resultado de Validacion**: Hallazgo o aprobacion con trazabilidad de regla, hoja, celda/rango, valores comparados y mensaje.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un archivo Serie P valido con mes `06` o `12` y hojas obligatorias es aceptado y procesado localmente en el navegador.
- **SC-002**: Un archivo Serie P con mes distinto de `06` o `12` es bloqueado antes de ejecutar reglas.
- **SC-003**: Un archivo Serie P sin `P9` o `P13` es bloqueado con mensaje que lista explicitamente las hojas faltantes.
- **SC-004**: Un archivo Serie A valido sigue procesandose con meses `01` a `12` despues de habilitar Serie P.
- **SC-005**: Las reglas Serie P importadas desde el Excel quedan disponibles en `data/reglas_finales.json` y se filtran por prefijo `P`.
- **SC-006**: `npm run test` y `npm run build` finalizan correctamente antes de cerrar la implementacion.
- **SC-007**: El manual del sistema contiene instrucciones verificables para Serie P, incluyendo ejemplos `123010P06.xlsm` y `123010P12.xlsm`.

## Assumptions

- `Reestructuracion_Expandido.xlsx` es la fuente operacional para importar las reglas iniciales de Serie P.
- `P9` y `P13` no tienen reglas iniciales, pero son obligatorias para aceptar el archivo.
- La lista de establecimientos aceptados es la misma para Serie A y Serie P.
- No se agregara backend, base de datos ni persistencia historica.
- El sistema seguira leyendo archivos `.xlsx` y `.xlsm` localmente en el navegador.
- Las hojas Serie P se esperan con nombres exactos `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P9`, `P11`, `P12`, `P13`.
