# Reglas de Validacion Validador DEIS SSO

Las validaciones estan disenadas bajo un esquema flexible.
Build OK | Tests OK

## Logica de Comparacion (Numerador vs Denominador)

La idea principal de las validaciones es tratarlas conceptualmente como una relacion entre un **numerador** y un **denominador**:

- **`expresion_1`**: actua como el numerador.
- **`expresion_2`**: actua como el denominador o referencia.

Si `expresion_2` no trae datos o esta vacia, debe interpretarse como `0` o vacio para efectos de la comparacion.

## Donde estan las reglas

Las reglas base estan unificadas y documentadas en:

`data/reglas_finales.json`

Ese archivo es la unica fuente de verdad actual para las reglas del sistema.

### Estructura base en `reglas_finales.json`

```json
{
  "A01": ["...reglas para REM A01..."],
  "A02": ["...reglas para REM A02..."],
  "A03": ["...reglas..."],
  "A30": ["...reglas..."]
}
```

## Como se cargan en la aplicacion

En `hooks/useValidationPipeline.ts`, la aplicacion carga las reglas a traves de `data/rules/index.ts`, que toma `data/reglas_finales.json` como origen canonico.

```typescript
const allRules = Object.values(ruleDictionary.BASE?.validaciones || {}).flat();
const applicableRules = allRules.filter(r => r.rem_sheet.startsWith(metadata.serieRem));
```

Se aplanan las series y se filtran solo las validaciones declaradas para el archivo subido.

## Que estructura tiene cada regla

Cada regla JSON tiene la siguiente configuracion:

```json
{
  "id": "A01-VAL001",
  "tipo": "CELDA",
  "rem_sheet": "A01",
  "expresion_1": "F11",
  "operador": "==",
  "expresion_2": 0,
  "severidad": "REVISAR",
  "mensaje": "REM A01 | SECCION A | F11. La expresion indica que [F11] debe ser distinto de [0].",
  "omitir_si_v1_es_cero": true,
  "omitir_si_ambos_cero": false,
  "aplicar_a_tipo": ["HOSPITAL", "CESFAM"],
  "excluir_tipo": ["SAMU"],
  "aplicar_a": ["123100"],
  "establecimientos_excluidos": ["123000"]
}
```

## Expresiones soportadas (`expresion_1` / `expresion_2`)

| Patron | Ejemplo | Que hace |
| --- | --- | --- |
| Celda simple | `F11` | Lee valor de F11 |
| Cross-sheet | `A03!C108` | Lee C108 de la hoja A03 |
| Rango (suma) | `C21:C36` | Suma todas las celdas del rango |
| Rango multi-seleccion | `SUM(C19:C26, F36:F38)` | Suma multiples rangos |
| Suma aritmetica | `C15+C16+C17` | Suma celdas o expresiones individuales |
| Resta aritmetica | `SUM(H17:U17)+SUM(V22:AG22)-C38` | Resta una celda o expresion al total calculado |
| Multiplicacion | `B61*C61` | Multiplica valores de celdas o expresiones |
| Parentesis | `C12+(F12-G12)` | Agrupa operaciones aritmeticas simples |
| Valor nulo/numerico estricto | `0` | Valor literal de comparacion |

## Parametrizacion para inclusiones y exclusiones

| Propiedad | Uso |
| --- | --- |
| `aplicar_a_tipo` | Array con tipos de recintos. Ej: `["HOSPITAL"]`. |
| `excluir_tipo` | Array con tipos de recintos. Ej: `["SAMU"]`. |
| `aplicar_a` | Array de codigos DEIS directos. Ej: `["123100"]`. |
| `establecimientos_excluidos` | Array de codigos DEIS que ignoran la evaluacion. |
| `omitir_si_v1_es_cero` | Si `expresion_1` esta vacia o es `0`, la validacion no se dispara. |

## Mantenimiento

Para agregar una nueva regla:

1. Agregala en `data/reglas_finales.json` manteniendo control de IDs como `AXX-VALYYY` o `PXX-VALYYY` segun la serie.
2. Mantiene coherencia con la logica numerador versus denominador.
3. Verifica que la estructura de la regla siga este documento y que la app la interprete correctamente.
