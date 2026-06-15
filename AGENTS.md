<!-- SPECKIT START -->
Para contexto adicional sobre las tecnologías a utilizar, la estructura del proyecto, comandos del shell y otra información importante, lee el plan actual.
<!-- SPECKIT END -->

# Instrucciones del Agente
- **Idioma**: El sistema y todas las interacciones deben ser siempre en **español**.
- **Fuente de Verdad de Reglas**: El archivo `data/reglas_finales.json` es la única fuente de verdad para las reglas de validación. Cualquier modificación debe iniciar en este archivo.
- **Lógica de Validación**: Las reglas se basan en una relación de **Numerador (`expresion_1`)** vs **Denominador (`expresion_2`)**. Si el denominador está vacío o no trae datos, se debe tratar como `0` o vacío.
- **Estructura de Reglas**: Seguir estrictamente la estructura definida en `data/reglas_validacion.md`.
