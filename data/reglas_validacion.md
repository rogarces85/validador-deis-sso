# Reglas de Validación Validador DEIS SSO

Las validaciones están diseñadas bajo un esquema flexible.
Build ✅ | Tests ✅

## ¿Dónde están las reglas?
Las reglas base están unificadas y documentadas en:
📁 `data/reglas_finales.json`

Sin embargo, para la ejecución se distribuyen en archivos por tipo de establecimiento dentro de la carpeta:
📁 `data/rules/`
- `base.json`
- `hospital.json`
- `posta.json`
- `samu.json`

### Estructura base en `reglas_finales.json`:
```json
{
  "A01": [ ...reglas para REM A01... ],
  "A02": [ ...reglas para REM A02... ],
  "A03": [ ...reglas... ],
  ...
  "A30": [ ...reglas... ]
}
```
> `reglas_finales.json` es la fuente de verdad actual. Desde ahi se distribuyen las reglas a `data/rules/*.json` usando la habilidad `sincronizador-reglas`.

## ¿Cómo se cargan en la aplicación?
En `hooks/useValidationPipeline.ts`, la aplicación consume dinámicamente el archivo en `data/rules/` que corresponda al tipo de establecimiento logueado o, por defecto, `base.json`.

```typescript
const allRules = Object.values(rulesData.validaciones).flat();
const applicableRules = allRules.filter(r => r.rem_sheet.startsWith(metadata.serieRem));
```
Se aplanan todas las series y se filtran solo las validaciones declaradas para el archivo subido.

## ¿Qué estructura tiene cada regla?
Cada regla JSON tiene la siguiente configuración:

```json
{
  "id": "A01-VAL001",         // Identificador único generado
  "tipo": "CELDA",            // Tipo de validación
  "rem_sheet": "A01",         // Hoja REM donde aplica
  "expresion_1": "F11",       // Lado izquierdo de la comparación
  "operador": "==",           // Operador: ==, !=, >, <, >=, <=
  "expresion_2": 0,           // Lado derecho (número, celda o rango)
  "severidad": "REVISAR",     // ERROR, REVISAR, OBSERVAR, INDICADOR
  "mensaje": "REM A01 | SECCIÓN A | F11. La expresión indica que [F11] debe ser distinto de [0].",
  
  // Campos opcionales avanzados
  "omitir_si_v1_es_cero": true, 
  "omitir_si_ambos_cero": false,
  
  // Parametrización por Establecimientos
  "aplicar_a_tipo": ["HOSPITAL", "CESFAM"], 
  "excluir_tipo": ["SAMU"],
  "aplicar_a": ["123100"],     
  "establecimientos_excluidos": ["123000"]
}
```

### Expresiones soportadas (`expresion_1` / `expresion_2`)
| Patrón                             | Ejemplo                | Qué hace                                  |
| ---------------------------------- | ---------------------- | ----------------------------------------- |
| **Celda simple**                     | `F11`                  | Lee valor de F11                          |
| **Cross-sheet**                      | `A03!C108`             | Lee C108 de la hoja A03                   |
| **Rango (suma)**                     | `C21:C36`              | Suma todas las celdas del rango           |
| **Rango multi-selección**            | `SUM(C19:C26, F36:F38)`| Suma múltiples rangos                     |
| **Valor nulo/numérico estricto**     | `0`                    | Valor literal de comparación              |

### Parametrización para Inclusiones/Exclusiones
| Propiedad                    | Uso |
| ---------------------------- | --- |
| `aplicar_a_tipo`             | Array con tipos de recintos. Ej: `["HOSPITAL"]`. Filtra por `establecimientos.catalog.json`. |
| `excluir_tipo`               | Array con tipos de recintos. Ej: `["SAMU"]`. Se salta al momento de evaluar. |
| `aplicar_a`                  | Array de **códigos DEIS** directos (ej: `["123100"]`). Hace la regla exclusiva para ellos. |
| `establecimientos_excluidos` | Array de **códigos DEIS** directos que ignoran la evaluación. |
| `omitir_si_v1_es_cero`       | Si `expresion_1` está vacía o es `0`, la validación no se dispara. |

## Mantenimiento
Para agregar una nueva regla:
1. Agrégala en `data/reglas_finales.json` (manteniendo control de IDs como `AXX-VALYYY`).
2. Usa opcionalmente la habilidad `mejora-mensajes-errores` si deseas autocompletar o formalizar la estructura descriptiva.
3. Al terminar de probar o agregar, corre el siguiente comando NodeJS en la raíz para esparcirlas a los archivos de ejecución:
```bash
node .agents/skills/sincronizador-reglas/scripts/sync_rules.cjs
```
Los archivos base.json, hospital.json, posta.json, samu.json se autogenerarán y estarán listos en el build.
