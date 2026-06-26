<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles: II. Validacion REM Normativa; Restricciones Tecnicas y de Datos
Added sections: Alcance de Series REM Habilitadas
Removed sections: none
Templates requiring updates: ✅ .specify/templates/plan-template.md reviewed; ✅ .specify/templates/spec-template.md reviewed; ✅ .specify/templates/tasks-template.md reviewed
Runtime guidance requiring updates: ✅ AGENTS.md; pending README/manual in implementation stage
Follow-up TODOs: Implement Serie P validators, rules, tests and manual updates under specs/001-serie-p-validacion
-->
# Validador DEIS SSO 2026 Constitution

## Core Principles

### I. Privacidad Local y Sin Backend
El sistema MUST procesar los archivos REM 100% en el navegador. No se permite enviar
archivos, datos clinicos, resultados de validacion ni metadatos sensibles a servidores
externos. No se debe agregar backend, API, base de datos ni persistencia historica sin una
enmienda explicita a esta constitucion. Rationale: los archivos REM pueden contener datos
sensibles y la confianza operacional depende de que la validacion sea local y efimera.

### II. Validacion REM Normativa
Cada cambio funcional MUST preservar el flujo de validacion REM: nombre de archivo,
extraccion de metadata, catalogo de establecimientos, hoja NOMBRE y reglas JSON base mas
reglas especificas por tipo de establecimiento. Las series no liberadas MUST bloquearse con
un mensaje operativo claro. Las reglas, catalogos y severidades MUST mantenerse trazables a
archivos versionados del repositorio. Rationale: el valor del producto es reducir errores
antes de la carga oficial DEIS sin alterar el alcance normativo vigente.

### II.a Alcance de Series REM Habilitadas
Las Series A y P son las unicas series REM habilitadas para validacion operativa. La Serie A
MUST aceptar meses `01` a `12`. La Serie P MUST tratarse como serie semestral y aceptar solo
los meses `06` y `12`, tanto en el nombre de archivo como en la hoja NOMBRE. Para Serie P,
el sistema MUST exigir las hojas `NOMBRE`, `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P9`,
`P11`, `P12` y `P13` antes de ejecutar reglas; `P9` y `P13` pueden existir sin reglas JSON
iniciales, pero siguen siendo obligatorias para aceptar el archivo. Toda serie distinta de A
o P MUST bloquearse con un mensaje en espanol indicando que la serie no esta realizada.
Rationale: el alcance productivo queda delimitado por validaciones completas y evita falsos
resultados para series no implementadas.

### III. Trazabilidad de Hallazgos
Todo hallazgo visible o exportado MUST incluir la informacion necesaria para corregirlo:
severidad, hoja, celda o rango evaluado, valores comparados, regla o validacion origen,
mensaje humano y evidencia cuando aplique. La exportacion Excel MUST conservar un resumen y
el detalle completo de hallazgos, aunque la interfaz aplique filtros visuales. Rationale: los
equipos de estadistica necesitan acciones de correccion verificables, no solo estados de
aprobacion o falla.

### IV. Calidad Verificable
Los cambios en validadores, motor de reglas, lectura Excel, exportacion o catalogos MUST
tener verificacion automatizada con Vitest o una justificacion documentada si no aplica. El
build MUST ejecutarse antes de considerar lista una entrega funcional. Las pruebas nuevas
SHOULD cubrir casos limite de nombres, hoja NOMBRE, reglas omitidas y severidades cuando el
cambio toque esas areas. Rationale: una regresion en validaciones puede producir falsos
positivos o falsos negativos en reportes operativos.

### V. Espanol Obligatorio
El sistema, la interfaz, los mensajes de validacion, la documentacion orientada a usuarios y
los reportes exportados MUST estar siempre en espanol. Solo se permiten identificadores
tecnicos, nombres de librerias, comandos, rutas o claves de datos en ingles cuando formen
parte del codigo o de una integracion existente. Rationale: los usuarios objetivo operan en
equipos estadisticos del Servicio de Salud Osorno y requieren lenguaje consistente y directo.

## Restricciones Tecnicas y de Datos

El producto es una SPA React 19 con TypeScript y Vite. La lectura y generacion de Excel MUST
mantenerse en cliente usando SheetJS o una alternativa equivalente que no requiera servidor.
El formato admitido de entrada es `.xlsx` o `.xlsm`, con nombres bajo la estructura
`CodigoEstablecimiento6 + SerieREM + Mes2`. Las Series A y P son las unicas habilitadas; `D`,
`BM`, `BS` y cualquier otra serie reconocida o detectada MUST informarse como serie no
realizada mientras no exista una ampliacion de alcance aprobada.

Los catalogos y reglas MUST residir en archivos versionados del repositorio. La aplicacion
MUST mantener separacion clara entre componentes de interfaz, hooks de orquestacion,
servicios de validacion/exportacion y datos JSON. El tema visual puede persistirse localmente,
pero los resultados de validacion y archivos cargados MUST permanecer efimeros salvo que una
enmienda apruebe un modo de auditoria local.

## Flujo de Desarrollo y Calidad

Las especificaciones MUST declarar usuarios, escenarios independientes, criterios de
aceptacion y restricciones de privacidad. Los planes MUST documentar impacto sobre reglas,
catalogos, validadores, exportacion y mensajes en espanol. Las tareas MUST agruparse por
historia o entrega verificable e incluir validacion de build, pruebas relevantes y revision
manual de UI cuando corresponda.

Antes de cerrar un cambio funcional, se MUST ejecutar `npm run build` y SHOULD ejecutarse
`npm run test` cuando existan pruebas aplicables o se modifique logica validable. Cualquier
desviacion de privacidad local, idioma espanol, trazabilidad de hallazgos o alcance de series
REM MUST registrarse en el plan como violacion constitucional con justificacion y alternativa
rechazada.

## Governance

Esta constitucion prevalece sobre practicas informales y documentos que contradigan sus
principios. Toda enmienda MUST actualizar este archivo, incluir un Sync Impact Report,
revisar los templates de Spec Kit y actualizar documentacion runtime afectada. Las decisiones
de producto deben contrastarse con `info.md`, README y la documentacion operativa vigente.

La version sigue SemVer: MAJOR para eliminar o redefinir principios de forma incompatible,
MINOR para agregar principios o ampliar obligaciones materiales, y PATCH para aclaraciones no
semanticas. Cada plan, especificacion y lista de tareas generados despues de esta ratificacion
MUST pasar una revision de cumplimiento constitucional antes de implementarse.

**Version**: 1.1.0 | **Ratified**: 2026-06-14 | **Last Amended**: 2026-06-26
