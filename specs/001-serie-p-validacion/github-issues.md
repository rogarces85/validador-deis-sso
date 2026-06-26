# GitHub Issues Propuestos: Incorporacion Serie P

`gh` no esta disponible en este entorno, por lo que estos issues quedan preparados para creacion posterior.

## Issue 1: Spec Kit y constitucion para habilitar Serie P

**Labels sugeridos**: `spec-kit`, `serie-p`, `documentacion`

**Cuerpo**:
Habilitar formalmente Serie P en la gobernanza del proyecto junto con Serie A.

**Tareas**:
- Actualizar constitucion para Series A y P.
- Registrar Serie P como semestral (`06`, `12`).
- Mantener bloqueo de series no realizadas.

## Issue 2: Validar nombre de archivo y meses por serie

**Labels sugeridos**: `validacion`, `serie-p`, `tests`

**Cuerpo**:
Actualizar validacion de nombre para que Serie A acepte `01` a `12` y Serie P solo `06` y `12`.

**Tareas**:
- Modificar `services/filenameValidator.ts`.
- Agregar pruebas para A, P y series no realizadas.
- Actualizar mensajes visibles.

## Issue 3: Validar hoja NOMBRE por serie

**Labels sugeridos**: `validacion`, `nombre`, `serie-p`

**Cuerpo**:
La hoja NOMBRE debe validar el mes segun serie y coincidir con el nombre del archivo.

**Tareas**:
- Pasar `serieRem` al validador NOMBRE.
- Restringir Serie P a `06` y `12`.
- Mantener Serie A con `01` a `12`.

## Issue 4: Exigir hojas obligatorias Serie P

**Labels sugeridos**: `validacion`, `estructura-excel`, `serie-p`

**Cuerpo**:
Bloquear archivos Serie P si faltan hojas obligatorias antes de ejecutar reglas.

**Hojas obligatorias**:
`NOMBRE`, `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P9`, `P11`, `P12`, `P13`.

**Nota**:
`P9` y `P13` son obligatorias aunque no tengan reglas iniciales.

## Issue 5: Ampliar motor de expresiones para reglas P

**Labels sugeridos**: `rule-engine`, `serie-p`, `tests`

**Cuerpo**:
El motor debe soportar expresiones detectadas en `Reestructuracion_Expandido.xlsx`.

**Expresiones objetivo**:
- `C12+(F12-G12)`
- `SUM(H17:U17)+SUM(V22:AG22)-C38`
- `B61*C61`

## Issue 6: Importar reglas Serie P a reglas_finales.json

**Labels sugeridos**: `reglas`, `serie-p`, `data`

**Cuerpo**:
Importar validaciones Serie P desde `Reestructuracion_Expandido.xlsx` hacia la fuente canonica `data/reglas_finales.json`.

**Tareas**:
- Importar reglas de `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P11`, `P12`.
- Crear `P9: []` y `P13: []`.
- Mantener estructura de `data/reglas_validacion.md`.

## Issue 7: Actualizar manual y ayuda de usuario para Serie P

**Labels sugeridos**: `manual`, `ui`, `serie-p`

**Cuerpo**:
Documentar formato, meses validos, hojas obligatorias y estado inicial de `P9`/`P13`.

**Tareas**:
- Actualizar `components/UserManual.tsx`.
- Actualizar `components/FileDropzone.tsx`.
- Actualizar `docs/Manual_Usuario.md`.

## Issue 8: Verificacion final y Pull Request

**Labels sugeridos**: `qa`, `build`, `pull-request`

**Cuerpo**:
Ejecutar pruebas, build y crear PR con evidencia.

**Tareas**:
- Ejecutar `npm run test`.
- Ejecutar `npm run build`.
- Crear PR vinculando issues de Serie P.
