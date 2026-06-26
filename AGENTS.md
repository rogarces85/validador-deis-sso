<!-- SPECKIT START -->
Plan actual Spec Kit: `specs/001-serie-p-validacion/plan.md`.

Feature activa: incorporación de Serie P al validador REM, manteniendo Serie A sin regresiones. La Serie P es semestral y solo acepta meses `06` y `12`; exige hojas `NOMBRE`, `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P9`, `P11`, `P12` y `P13`. `P9` y `P13` son obligatorias aunque inicialmente no tengan reglas.
<!-- SPECKIT END -->

# Instrucciones del Agente
- **Idioma**: El sistema y todas las interacciones deben ser siempre en **español**.
- **Fuente de Verdad de Reglas**: El archivo `data/reglas_finales.json` es la única fuente de verdad para las reglas de validación. Cualquier modificación debe iniciar en este archivo.
- **Lógica de Validación**: Las reglas se basan en una relación de **Numerador (`expresion_1`)** vs **Denominador (`expresion_2`)**. Si el denominador está vacío o no trae datos, se debe tratar como `0` o vacío.
- **Estructura de Reglas**: Seguir estrictamente la estructura definida en `data/reglas_validacion.md`.
