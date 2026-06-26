# Pull Request: Serie P - Validador REM

## Resumen

Este PR incorpora la **Serie P** al Validador REM manteniendo la **Serie A** sin regresiones. La Serie P es una serie semestral que solo acepta los meses `06` (junio) y `12` (diciembre).

## Motivación

Necesidad institucional de validar los archivos REM Serie P (Programa de Salud) bajo los mismos estándares de calidad que ya existen para la Serie A, con sus propias hojas, reglas y meses.

## Cambios principales

### 1. Servicios nuevos y modificados
- `services/remSeriesConfig.ts` (nuevo): configuración central de series habilitadas, meses válidos y hojas obligatorias por serie.
- `services/filenameValidator.ts`: actualizado para reconocer Series A y P, con meses diferenciados y bloqueo de series no realizadas (D, BM, BS).
- `services/nombreSheetValidator.ts`: valida la versión del archivo según serie; Serie P solo acepta "Versión 1.2: Junio 2026".
- `hooks/useValidationPipeline.ts`: integra la nueva configuración y bloquea archivos Serie P con hojas obligatorias faltantes.
- `services/ruleEngine.ts`: motor de expresiones aritméticas propio (sin `eval`), soporta `+`, `-`, `*`, paréntesis y `SUM(...)` combinados.

### 2. Reglas de validación
- Importadas **37 reglas** Serie P desde el archivo institucional `Reestructuracion_Expandido.xlsx` a `data/reglas_finales.json`.
- Hojas `P9` y `P13` se crean como arreglos vacíos para marcarlas como obligatorias.
- Reglas `P07-VAL001` a `P07-VAL004` usan `omitir_si_ambos_cero: true` para evitar falsos positivos.
- 4 reglas usan `validacion_exclusiva` (HBSJO o CESFAM).

### 3. UI y manuales
- Componente `FileDropzone` con ejemplos para Serie P y Series A/P en el selector.
- Manual de usuario visual y markdown actualizados.

### 4. Pruebas
- 31 tests automatizados pasando (`npm run test`).
- Archivo de prueba oficial `123010P06.xlsm` con cobertura 37/37.
- 33 archivos de falla controlada por hoja (`123010P06_Px_Vyyy.xlsm`).
- Harness `tests-pipeline/run-app-pipeline.ts` que ejecuta el pipeline real de la app sobre archivos con sufijos (que no pasarían la validación estricta de nombre).

## Evidencia de pruebas

### Build
```
npm run test    -> 31 tests OK
npm run build   -> OK
```

### Pipeline real (35 archivos)
| Indicador | Valor |
|---|---|
| Archivos validados | 35 |
| Bloqueados | 0 |
| Errores técnicos | 0 |
| Reglas ejecutadas | 286 |
| Aprobadas | 253 |
| Hallazgos | 33 |

### Cobertura por hoja
| Hoja | Reglas validadas |
|---|---:|
| P1 | 8 |
| P2 | 4 |
| P3 | 4 |
| P4 | 7 |
| P5 | 1 |
| P6 | 4 |
| P7 | 4 |
| P12 | 1 |
| **Total** | **33 de 37** |

Las 4 reglas no cubiertas son exclusivas HBSJO/CESFAM y no aplican al establecimiento 123010.

## Pendientes (futuros PRs)

- Generar archivos de prueba para mes 12 (diciembre).
- Generar archivos con código HBSJO (123100) para cubrir P01-VAL009, P05-VAL002, P11-VAL001 y P11-VAL002.
- Generar archivos con código CESFAM si corresponde.

## Lista de verificación

- [x] Tests automatizados pasando
- [x] Build sin errores
- [x] Archivo OK validado (37/37 reglas)
- [x] Archivos FALLA controlados validan regla objetivo
- [x] Serie A sin regresiones
- [x] Documentación de usuario actualizada
- [x] Spec Kit completo (spec, plan, tasks, github-issues)
- [x] Constitución actualizada a 1.1.0
- [x] Sin secretos ni credenciales commiteadas
- [x] Mensajes de commit claros y referenciados

## Documentos relacionados

- `docs/sesiones/2026-06-26-serie-p-opencode.md` - resumen completo de la sesión
- `specs/001-serie-p-validacion/spec.md` - especificación funcional
- `specs/001-serie-p-validacion/plan.md` - plan técnico
- `docs/Manual_Usuario.md` - manual del usuario

## Cómo probar localmente

```bash
# Instalar dependencias
npm install

# Correr tests
npm run test

# Compilar
npm run build

# Probar archivo OK
# Arrastrar 123010P06.xlsm a la app

# Probar archivos FALLA con harness
node dist-pipeline/run-app-pipeline.js 123010P06.xlsm 123010P06_P1_V001.xlsm
```

## Riesgo y rollback

- Riesgo: bajo. Los cambios están aislados a código de validación; no se modifican componentes de UI existentes, salvo adición de elementos opcionales.
- Rollback: revertir el merge a `main` deja el sistema en Serie A únicamente.