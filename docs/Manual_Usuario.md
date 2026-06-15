# Manual de Usuario: Validador REM DEIS SSO

Este sistema permite **prevalidar archivos REM** antes de su envio. Revisa nombre de archivo, hoja `NOMBRE`, reglas de consistencia y cruces entre hojas para reducir errores antes de cargar al DEIS.

## 1. Que valida el sistema

El validador revisa cuatro capas:

1. **Nombre del archivo**: estructura, serie soportada, mes y extension.
2. **Hoja `NOMBRE`**: version, codigos, mes y responsables.
3. **Reglas REM**: comparaciones entre celdas, rangos y cruces entre hojas.
4. **Hallazgos y exportacion**: detalle tecnico para corregir y volver a validar.

> [!IMPORTANT]
> La unica fuente de verdad de las reglas es `data/reglas_finales.json`.

## 2. Antes de cargar un archivo

Verifique lo siguiente:

1. El archivo debe tener extension `.xlsx` o `.xlsm`.
2. El nombre debe respetar el formato `CodigoEstablecimiento + Serie + Mes`.
3. Ejemplo valido: `123100A01.xlsm`.
4. La serie actualmente habilitada para validacion completa es **Serie A**.
5. La hoja `NOMBRE` debe contener la version esperada, el mes correcto y responsables informados.

<p align="center">
  <img src="images/validador_home.png" alt="Pantalla principal del validador" width="900"/>
</p>

> [!NOTE]
> El procesamiento ocurre en el navegador. El archivo no se envia a servidores externos.

## 3. Flujo de validacion paso a paso

### Paso 1. Cargar el archivo

1. Arrastre el Excel al area de carga o hagale clic.
2. El sistema revisa el nombre del archivo de inmediato.
3. Si el nombre no cumple la estructura, la validacion se bloquea.

### Paso 2. Revisar hoja `NOMBRE`

Antes de evaluar reglas REM, el sistema valida:

1. La version en `A9`.
2. Los codigos de comuna y establecimiento.
3. La consistencia entre el mes del archivo y el mes informado en la hoja.
4. La presencia de responsables del establecimiento y estadistica.

Si la version es incorrecta, se muestra una alerta prioritaria.

### Paso 3. Ejecutar reglas de negocio

Cada regla compara un valor actual contra una referencia esperada.

#### Logica base de las reglas

- `expresion_1`: actua como **numerador**.
- `expresion_2`: actua como **denominador** o referencia.
- Si `expresion_2` no trae dato, el sistema la trata como **0** o vacio segun corresponda.

Esto permite interpretar de forma consistente reglas simples, dobles y compuestas.

### Paso 4. Leer los resultados

Una vez finalizada la validacion, la aplicacion abre la vista de resultados.

<p align="center">
  <img src="images/validador_results.png" alt="Resumen y resultados del validador" width="900"/>
</p>

Alli podra revisar:

1. Nombre del archivo validado.
2. Establecimiento detectado.
3. Mes, serie y codigo.
4. Cantidad de hallazgos por severidad.
5. Porcentaje de aprobacion.

## 4. Niveles de severidad

<p align="center">
  <img src="images/validador_severity_legend.png" alt="Leyenda de severidad" width="700"/>
</p>

- **ERROR**: inconsistencia critica. Debe corregirse antes del envio.
- **REVISAR**: caso atipico o sensible que requiere revision humana.
- **INDICADOR**: advertencia o senal de calidad que puede ayudar al seguimiento.

## 5. Como interpretar un hallazgo

Cuando seleccione un hallazgo en la tabla, se abre el panel de detalle.

<p align="center">
  <img src="images/validador_error_detail.png" alt="Detalle de hallazgo" width="560"/>
</p>

En ese panel encontrara:

1. **Regla**: identificador unico de la validacion.
2. **Hoja y celda**: ubicacion del problema o rango evaluado.
3. **Valor encontrado**: dato actual leido desde el Excel.
4. **Referencia**: valor esperado o comparado.
5. **Comparacion evaluada**: expresion final utilizada por el motor.
6. **Diferencia**: brecha numerica cuando aplica.
7. **Mensaje y evidencia**: explicacion para corregir con criterio.

## 6. Vista de celdas

La pestana **Celdas** permite revisar referencias tecnicas declaradas en el catalogo auxiliar.

Esta vista ayuda a detectar:

1. Hojas inexistentes.
2. Celdas invalidas.
3. Celdas vacias.
4. Correspondencia entre reglas y referencias de celdas.

Es especialmente util cuando el equipo necesita auditar por que una regla esta fallando o si una hoja del REM cambio de estructura.

> [!TIP]
> Cuando una validacion menciona `POSTA` o `POSTAS`, el sistema las interpreta como equivalentes para efectos de alcance y lectura documental.

## 7. Exportacion de resultados

<p align="center">
  <img src="images/validador_export.png" alt="Opciones de exportacion" width="900"/>
</p>

Use el boton de exportacion para descargar un archivo Excel con:

1. Resumen general.
2. Lista completa de hallazgos.
3. Hoja exclusiva de errores, cuando existan.

Flujo recomendado:

1. Exportar el reporte.
2. Corregir el Excel original.
3. Volver a usar **Validar otro archivo**.
4. Confirmar que las inconsistencias desaparecieron.

## 8. Casos frecuentes

### El archivo no se deja validar

Revise primero:

1. Extension `.xlsx` o `.xlsm`.
2. Nombre del archivo.
3. Serie soportada.

### Aparece error de version

Verifique la hoja `NOMBRE`, especialmente la celda `A9`.

### Un hallazgo muestra comparacion contra 0

Eso puede ser correcto. Si `expresion_2` no tiene datos, la regla se evalua contra `0` o vacio.

### El total del resumen no coincide con lo que ve en pantalla

Algunas vistas pueden ocultar resultados triviales o sin datos, pero el sistema conserva el total real de evaluaciones realizadas.

## 9. Glosario breve

- **REM**: Resumen Estadistico Mensual.
- **Hoja `NOMBRE`**: hoja de control con metadata del archivo.
- **Hallazgo**: resultado de una validacion.
- **`expresion_1`**: valor observado.
- **`expresion_2`**: valor de referencia.

---

Desarrollado para el Servicio de Salud Osorno - 2026.
