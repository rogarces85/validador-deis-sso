<!--
Sync Impact Report
Version change: 1.1.0 -> 1.2.0
Modified principles: I. Privacidad Local y Sin Backend -> I.a Privacidad Local con Auditoria Opcional
Added sections: Principios VI (Modulo de Administracion) y VII (Registro de Auditoria No Clinica);
                seccion "Auditoria Opcional" en Restricciones Tecnicas y de Datos
Removed sections: ninguna
Templates requiring updates: ✅ .specify/templates/plan-template.md reviewed;
                            ✅ .specify/templates/spec-template.md reviewed;
                            ✅ .specify/templates/tasks-template.md reviewed
Runtime guidance requiring updates: ✅ AGENTS.md; ✅ README.md; manual de usuario en etapa de implementacion
Follow-up TODOs: Implementar Features 003-A (Infra backend + Auth admin),
                 003-B (CRUD reglas + publicacion) y 003-C (Auditoria no clinica + estadisticas)
-->
# Validador DEIS SSO 2026 Constitution

## Core Principles

### I.a Privacidad Local con Auditoria Opcional
El contenido de los archivos REM MUST procesarse unicamente en el navegador. La aplicacion
MAY registrar metadatos no clinicos (nombre de archivo, codigo de establecimiento, nombre
del establecimiento, comuna, tipo de establecimiento, serie, mes, periodo, timestamp, IP de
origen, user agent y conteo de hallazgos por severidad) en un backend controlado por el
Servicio de Salud. Se prohibe registrar valores de celdas, contenido de hojas, ni cualquier
dato que permita reconstruir informacion clinica. El backend, la auditoria y el modulo de
administracion son dependencias opcionales: la aplicacion cliente MUST seguir funcionando
completamente sin red ni backend, usando el bundle `data/reglas_finales.json` versionado
como fuente canonica en modo degradado. Rationale: los archivos REM pueden contener datos
sensibles y la confianza operacional depende de que la validacion sea local y efimera;
simultaneamente se requiere trazabilidad operativa de uso para el Servicio de Salud.

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
Los cambios en validadores, motor de reglas, lectura Excel, exportacion, catalogos, backend
PHP, esquema MySQL o modulo admin MUST tener verificacion automatizada con Vitest, scripts
PHP de prueba o una justificacion documentada si no aplica. El build MUST ejecutarse antes
de considerar lista una entrega funcional. Las pruebas nuevas SHOULD cubrir casos limite de
nombres, hoja NOMBRE, reglas omitidas, severidades, endpoints REST y migraciones SQL cuando
el cambio toque esas areas. Rationale: una regresion en validaciones puede producir falsos
positivos o falsos negativos en reportes operativos; una regresion en el modulo admin
puede comprometer la trazabilidad de cambios normativos.

### V. Espanol Obligatorio
El sistema, la interfaz, los mensajes de validacion, la documentacion orientada a usuarios,
los reportes exportados, los mensajes del backend y el panel admin MUST estar siempre en
espanol. Solo se permiten identificadores tecnicos, nombres de librerias, comandos, rutas o
claves de datos en ingles cuando formen parte del codigo o de una integracion existente.
Rationale: los usuarios objetivo operan en equipos estadisticos del Servicio de Salud Osorno
y requieren lenguaje consistente y directo.

### VI. Modulo de Administracion
El sistema MAY exponer un modulo de administracion protegido por autenticacion (email y
contrasena) con un unico rol `admin` para el MVP. El admin MAY crear, leer, actualizar y
desactivar reglas en una base de datos MySQL/MariaDB servida por PHP sobre XAMPP. Toda
modificacion sobre reglas MUST auditarse con timestamp, autor y diff antes/despues. El
modulo admin es responsabilidad del mismo repositorio y se sirve como rutas adicionales
dentro del bundle de la aplicacion. La sesion admin MUST expirar por inactividad en el servidor o al cerrar el navegador, y
los endpoints no-idempotentes MUST requerir token CSRF. Rationale: el ciclo de vida de las
reglas debe ser operable por un administrador del Servicio de Salud sin editar JSON a mano,
manteniendo trazabilidad de cambios.

### VII. Registro de Auditoria No Clinica
Cada finalizacion de validacion MAY emitir un evento al backend con los campos listados en
el principio I.a. La aplicacion cliente SHOULD registrar el evento en cola local
(IndexedDB, con manejo de excepciones si no esta disponible) y reintentar cuando la red este disponible. La falla del endpoint de auditoria
MUST NOT impedir ni retrasar la validacion local visible para el usuario. El backend MUST
rechazar payloads que contengan campos no listados en I.a o que excedan longitudes
razonables. Rationale: la trazabilidad operativa no debe degradar la experiencia del usuario
ni convertirse en un canal de fuga de datos clinicos.

## Restricciones Tecnicas y de Datos

El producto es una SPA React 19 con TypeScript y Vite. La lectura y generacion de Excel MUST
mantenerse en cliente usando SheetJS o una alternativa equivalente que no requiera servidor.
El formato admitido de entrada es `.xlsx` o `.xlsm`, con nombres bajo la estructura
`CodigoEstablecimiento6 + SerieREM + Mes2`. Las Series A y P son las unicas habilitadas; `D`,
`BM`, `BS` y cualquier otra serie reconocida o detectada MUST informarse como serie no
realizada mientras no exista una ampliacion de alcance aprobada.

Los catalogos y reglas SHOULD residir en archivos versionados del repositorio. La aplicacion
MUST mantener separacion clara entre componentes de interfaz, hooks de orquestacion,
servicios de validacion/exportacion y datos JSON. El tema visual puede persistirse
localmente. Los resultados de validacion y archivos cargados MUST permanecer efimeros en
cliente salvo que se emita un evento de auditoria con los campos no clinicos definidos en
I.a.

### Auditoria Opcional

Cuando el backend este disponible, la aplicacion cliente:

1. Envia un evento por cada validacion finalizada a `POST /api/audit` con los campos
   listados en I.a. El envio es fire-and-forget con cola de reintentos en IndexedDB (con
   retroceso exponencial y limite de intentos); nunca bloquea la validacion local.
2. Consulta `GET /api/reglas/actual` al iniciar la aplicacion. Si la `version_semver`
   devuelta es mayor que la local cacheada en IndexedDB, MUST mostrar un banner
   `Hay nuevas reglas disponibles` con boton para actualizar.
3. En modo degradado (sin red o sin backend), la aplicacion MUST funcionar identicamente al
   comportamiento previo a esta enmienda, usando `data/reglas_finales.json` como fuente
   canonica y omitiendo la emision de eventos de auditoria y la alerta de desactualizacion.

El backend PHP+MySQL (sobre XAMPP local) MUST:

1. Escuchar en la misma base URL que la aplicacion cliente, bajo el prefijo `/api/`.
2. Usar PDO con prepared statements para todas las consultas SQL.
3. Almacenar contrasenas admin con `password_hash` (bcrypt) y validar con
   `password_verify`.
4. Configurar la cookie de sesion con flags `HttpOnly`, `SameSite=Strict` y `Secure` cuando
   se sirva por HTTPS.
5. Implementar rate limit en `/api/auth/login` y `/api/audit` para evitar abuso.
6. Versionar cada cambio de esquema mediante scripts de migracion idempotentes. No se
   permite `DROP TABLE` salvo borrado explicito y documentado en el plan.

## Flujo de Desarrollo y Calidad

Las especificaciones MUST declarar usuarios, escenarios independientes, criterios de
aceptacion y restricciones de privacidad. Los planes MUST documentar impacto sobre reglas,
catalogos, validadores, exportacion, mensajes en espanol, backend, esquema de base de datos
y panel admin cuando aplique. Las tareas MUST agruparse por historia o entrega verificable
e incluir validacion de build, pruebas relevantes y revision manual de UI cuando
corresponda.

Antes de cerrar un cambio funcional, se MUST ejecutar `npm run build` y SHOULD ejecutarse
`npm run test` cuando existan pruebas aplicables o se modifique logica validable. Para
cambios que toquen el backend PHP, se MUST ejecutar el script de migracion y los tests PHP
asociados antes de cerrar el PR. Cualquier desviacion de privacidad local, idioma espanol,
trazabilidad de hallazgos, alcance de series REM o registro de auditoria no clinica MUST
registrarse en el plan como violacion constitucional con justificacion y alternativa
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

**Version**: 1.2.0 | **Ratified**: 2026-06-14 | **Last Amended**: 2026-07-01
