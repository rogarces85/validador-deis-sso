# Informe de Migracion de Reglas 2026

## Objetivo

Documentar la migracion del motor de validacion hacia un modelo de 4 niveles de aplicabilidad por regla:

1. Universal
2. Por tipo de establecimiento
3. Exclusion por tipo
4. Alcance o exclusion por codigo DEIS

## Cambios de Motor Aplicados

1. Se incorporo soporte efectivo para `aplicar_a_tipo` y `excluir_tipo`.
2. Se agrego `tipoEstablecimiento` a la metadata de ejecucion.
3. Se normalizo `OTRO` a `OTROS` para evitar errores de alcance.
4. Se corrigio la evaluacion de `validacion_exclusiva` para que funcione correctamente tanto por codigo como por tipo.

## Reglas Migradas

### Reglas por tipo

| Regla | Hoja | Alcance aplicado | Observacion |
| --- | --- | --- | --- |
| `A08-VAL002` | `A08` | `aplicar_a_tipo: ["HOSPITAL"]` | Regla hospitalaria explicita por texto de seccion |
| `A08-VAL007` | `A08` | `aplicar_a_tipo: ["HOSPITAL"]` | Regla hospitalaria explicita por texto de seccion |
| `A09-VAL001` | `A09` | `aplicar_a_tipo: ["HOSPITAL", "OTROS"]` | Mantiene ademas filtro por codigo existente |
| `A11-VAL001` | `A11` | `aplicar_a_tipo: ["HOSPITAL", "OTROS"]` | Mantiene ademas filtro por codigo existente |
| `A11-VAL002` | `A11` | `aplicar_a_tipo: ["HOSPITAL", "OTROS"]` | Mantiene ademas filtro por codigo existente |
| `A11-VAL003` | `A11` | `aplicar_a_tipo: ["HOSPITAL", "OTROS"]` | Mantiene ademas filtro por codigo existente |
| `A11-VAL004` | `A11` | `aplicar_a_tipo: ["HOSPITAL", "OTROS"]` | Mantiene ademas filtro por codigo existente |
| `A28-VAL006` | `A28` | `aplicar_a_tipo: ["HOSPITAL"]` | Mantiene ademas filtro por codigo existente |
| `A28-VAL007` | `A28` | `aplicar_a_tipo: ["HOSPITAL"]` | Mantiene ademas filtro por codigo existente |
| `A30R-VAL001` | `A30R` | `aplicar_a_tipo: ["HOSPITAL"]` | Regla hospitalaria explicita por seccion |

### Reglas con exclusion por tipo

| Regla | Hoja | Alcance aplicado | Observacion |
| --- | --- | --- | --- |
| `A08-VAL003` | `A08` | `excluir_tipo: ["SUR"]` | Se reemplazo exclusion manual de codigos `SUR` por exclusion estructurada |
| `A08-VAL005` | `A08` | `excluir_tipo: ["SAMU"]` | Ya venia modelada asi; ahora el motor la respeta |

## Depuracion Especifica de A08

### Regla resuelta

#### `A08-VAL001`

Situacion original:

1. Declaraba `aplicar_a_tipo: ["HOSPITAL", "SAPU", "SUR"]`.
2. A la vez excluia todos los codigos conocidos de esos mismos tipos.
3. En la practica la regla quedaba sin universo real de aplicacion.

Accion aplicada:

1. Se elimino la lista contradictoria de `establecimientos_excluidos`.
2. Se convirtio a modelo de exclusividad por tipo usando:

```json
{
  "operador": "==",
  "expresion_2": 0,
  "aplicar_a_tipo": ["HOSPITAL", "SAPU", "SUR"],
  "validacion_exclusiva": true
}
```

Semantica resultante:

1. Para `HOSPITAL`, `SAPU` y `SUR`: la regla exige datos en la seccion.
2. Para el resto: la regla exige no informar datos en esa seccion.

Motivo:

1. Es la unica regla de `A08` donde el propio texto de seccion ya declaraba con claridad el universo funcional.
2. La documentacion historica en `docs/Simulation_Results.md` ya reflejaba este comportamiento exclusivo.

### Reglas A08 aun pendientes de criterio funcional fino

Las siguientes reglas se mantuvieron sin una reinterpretacion agresiva, porque el texto y las exclusiones historicas no permiten inferir con seguridad un universo funcional unico:

1. `A08-VAL003`
2. `A08-VAL004`
3. `A08-VAL006`

### Analisis puntual de reglas pendientes

#### `A08-VAL003`

Estado actual:

1. Mantiene exclusion por codigos especificos.
2. Ademas excluye `SUR` como tipo.

Lectura funcional:

1. La lista historica mezcla hospitales, un CESFAM, un SAPU y antes tambien codigos `SUR`.
2. Esa mezcla no permite concluir un patron limpio por tipo completo.

Decision:

1. Se mantuvo como regla hibrida.
2. No se forzo `aplicar_a_tipo` porque eso ampliaria la regla a establecimientos que hoy no tienen evidencia de reportar esta seccion.

#### `A08-VAL004`

Estado actual:

1. No tiene exclusiones por codigo ni por tipo.
2. Comparte la misma seccion funcional que `A08-VAL003`.

Lectura funcional:

1. Existe sospecha de que deberia compartir el mismo universo de `A08-VAL003`.
2. No hay evidencia suficiente en las reglas ni en los documentos para aplicar esa herencia automaticamente.

Decision:

1. Se mantiene sin alteracion.
2. Requiere validacion con referente REM o contraste contra archivos reales de establecimientos.

#### `A08-VAL006`

Estado actual:

1. Regla sin restricciones de alcance.
2. La seccion apunta a llamados a centro regulador, despacho o coordinacion.

Lectura funcional:

1. Semanticamente parece candidata a urgencia regulada o prehospitalaria.
2. El proyecto no entrega evidencia suficiente para asociarla hoy a un tipo especifico sin riesgo.

Decision:

1. Se mantiene universal por ahora.
2. Debe revisarse cuando exista criterio formal de cobertura `SAMU` o equivalentes en el catalogo operativo.

Riesgo de forzar una migracion mayor:

1. Podria expandir validaciones a establecimientos que hoy no reportan esa seccion.
2. Podria generar falsos positivos masivos en urgencia APS u hospitales de baja complejidad.

## Criterio Operativo Recomendado para Reglas Nuevas

1. Si la seccion REM nombra explicitamente los tipos permitidos, usar `aplicar_a_tipo`.
2. Si la seccion aplica a casi todos menos un grupo funcional, usar `excluir_tipo`.
3. Si una regla es exclusiva de un subconjunto y el resto no debe informar, usar `validacion_exclusiva: true` con `aplicar_a` o `aplicar_a_tipo`.
4. Dejar `aplicar_a` solo para casos realmente particulares de establecimiento.

## Estado Final

1. El motor ya soporta ejecucion limpia por tipo, por exclusiones y por exclusividad.
2. Las reglas migradas siguen siendo compatibles con filtros por codigo cuando son necesarios.
3. `A08` quedo parcialmente depurada y con su contradiccion principal resuelta.
