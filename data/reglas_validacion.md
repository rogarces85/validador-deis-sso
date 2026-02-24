Las validaciones están integradas y funcionando. Build ✅ | Tests ✅

¿Dónde están las reglas?
Las reglas están en un solo archivo JSON:

📁 data/rules.json

Estructura:

json
{
  "validaciones": {
    "A01": [ ...reglas para REM A01... ],
    "A02": [ ...reglas para REM A02... ],
    "A03": [ ...reglas... ],
    ...
    "A30": [ ...reglas... ]
  }
}
Actualmente hay 66 reglas distribuidas en 14 series (A01 → A30).

¿Cómo se cargan?
En hooks/useValidationPipeline.ts (línea 68):

typescript
const allRules = Object.values(rulesData.validaciones).flat();
const applicableRules = allRules.filter(r => r.rem_sheet.startsWith(metadata.serieRem));
Se aplanan todas las series → se filtran solo las que corresponden al archivo subido.
¿Cómo editar/agregar/modificar reglas?
Solo edita data/rules.json. Cada regla tiene esta estructura:

json
{
  "id": "VAL01",              // Identificador único
  "tipo": "CELDA",            // Tipo de validación
  "rem_sheet": "A01",         // Hoja REM donde aplica
  "expresion_1": "F11",       // Lado izquierdo de la comparación
  "operador": "==",           // ==, !=, >, <, >=, <=
  "expresion_2": 0,           // Lado derecho (número, celda, rango o fórmula)
  "severidad": "REVISAR",     // ERROR, REVISAR, OBSERVAR, INDICADOR
  "mensaje": "Descripción..." // Mensaje que aparece en el reporte
}
Expresiones soportadas en expresion_1 / expresion_2:
Patrón	Ejemplo	Qué hace
Celda simple	F11	Lee valor de F11 en rem_sheet
Cross-sheet	A03!C108	Lee C108 de la hoja A03
Rango (suma)	C21:C36	Suma todas las celdas del rango
Cross-sheet rango	A01!(H36:H37)	Suma H36:H37 de la hoja A01
Aritmética	C114+D114	Suma valores de ambas celdas
SUM multi-rango	SUM(C19:C26, F36:F38)	Suma múltiples rangos
Número fijo	0	Valor literal
Campos opcionales:
Campo	Para qué
aplicar_a	Array de códigos DEIS. La regla solo se aplica a estos establecimientos
establecimientos_excluidos	Array de códigos DEIS. La regla se salta estos establecimientos
rem_sheet_ext	Documentación de la hoja externa referenciada
Para agregar una regla nueva:
Abre data/rules.json
Ubica la serie (ej: "A01": [...])
Agrega un nuevo objeto al array
Guarda — al hacer build o recargar la app, las reglas se aplican automáticamente
No es necesario tocar código TypeScript ni recompilar para cambios en reglas.