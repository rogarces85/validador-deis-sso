---
name: Informe de Validaciones
description: Genera un informe detallado y completo de todas las validaciones del sistema (reglas JSON + hoja NOMBRE), listado por Hoja REM e ID. Exporta a Markdown (.md) y Excel (.xlsx).
---

# Informe de Validaciones

Esta habilidad genera un registro/informe exhaustivo de **todas las validaciones** que maneja el Validador DEIS SSO, incluyendo:

1. **Reglas JSON** definidas en `data/reglas_finales.json` (reglas de comparación por celdas/rangos).
2. **Validaciones de la hoja NOMBRE** definidas en `services/nombreSheetValidator.ts` (versión del archivo, códigos de comuna, establecimiento, mes, responsable, jefe de estadística).

El informe se entrega en dos formatos:
- **Markdown**: `docs/validador_registro.md` (para lectura y documentación rápida).
- **Excel**: `docs/Validador_Registro.xlsx` (para uso en reuniones, impresión y gestión documental).

## Prerrequisitos
- Node.js instalado.
- El paquete `xlsx` (SheetJS) debe estar disponible. Si no lo está, ejecutar `npm install xlsx` previamente.
- El archivo `data/reglas_finales.json` debe estar actualizado.
- El archivo `data/secciones.md` debe existir para enriquecer la información de secciones.

## Instrucciones

### Paso 1 — Ejecutar el Script de Generación

```bash
node .agents/skills/informe-validaciones/scripts/generate_report.cjs
```

El script:
1. Lee `data/reglas_finales.json` y extrae todas las validaciones agrupadas por hoja REM.
2. Extrae las validaciones de la hoja NOMBRE desde `services/nombreSheetValidator.ts` (hardcodeadas en el script como fuente de verdad).
3. Ordena todo por Hoja REM (NOMBRE primero, luego A01, A02, ..., A30) y por ID.
4. Para cada validación genera:
   - **ID**: Identificador único.
   - **Hoja REM**: Hoja donde aplica.
   - **Tipo**: Tipo de validación (CELDA, RANGO, etc.).
   - **Expresión 1**: Lado izquierdo.
   - **Operador**: Operador lógico.
   - **Expresión 2**: Lado derecho.
   - **Severidad**: ERROR, REVISAR, INDICADOR.
   - **Mensaje**: Descripción formateada.
   - **Aplica a**: Tipos/códigos de establecimientos (si aplica).
   - **Excluye**: Establecimientos excluidos (si aplica).
   - **Opciones**: Flags como `omitir_si_v1_es_cero`, `omitir_si_ambos_cero`.
   - **Detalle**: Explicación técnica del comportamiento de la validación.

### Paso 2 — Verificar los Archivos Generados

- `docs/validador_registro.md` — Archivo Markdown con tabla completa.
- `docs/Validador_Registro.xlsx` — Archivo Excel con una hoja por cada REM y una hoja resumen.

### Paso 3 — Actualización Continua

Cada vez que se agreguen, modifiquen o eliminen validaciones, vuelve a ejecutar el script para mantener el informe sincronizado con el estado actual del sistema.

## Convenciones
- Las validaciones de la hoja NOMBRE llevan el prefijo `VAL_NOM` en su ID.
- Las validaciones de las hojas REM llevan ID con formato `AXX-VALYYY`.
- El campo "Detalle" es una interpretación automática de lo que hace la validación.
