<!-- SPECKIT START -->
Plan actual Spec Kit: `specs/003-a-infra-backend-auth/plan.md` (Feature 003-A: backend PHP+MySQL + auth admin). Siguiente entrega planificada: 003-B (CRUD reglas + publicacion) y 003-C (auditoria no clinica + estadisticas), todas en `specs/003-*/`.

Contexto constitucional: `constitucion v1.2.0` habilita modulo admin (Principio VI) y registro de auditoria no clinica (Principio VII) sobre backend PHP+MySQL, manteniendo la promesa de procesamiento local del contenido del archivo REM.
<!-- SPECKIT END -->

# Instrucciones del Agente
- **Idioma**: El sistema y todas las interacciones deben ser siempre en **español**.
- **Fuente de Verdad de Reglas**: El archivo `data/reglas_finales.json` sigue siendo la unica fuente canonica para las reglas que se distribuyen con el bundle del validador. En paralelo, la tabla `reglas` del backend (carpeta `api/`) actua como **borrador editable**; el admin publica una version con un boton "Publicar" y la version publicada pasa a `reglas_versiones`. Esto se implementa en la Feature 003-B.
- **Logica de Validacion**: Las reglas se basan en una relacion de **Numerador (`expresion_1`)** vs **Denominador (`expresion_2`)**. Si el denominador esta vacio o no trae datos, se debe tratar como `0` o vacio.
- **Estructura de Reglas**: Seguir estrictamente la estructura definida en `data/reglas_validacion.md`.
- **Backend y Auditoria**: Toda interaccion con el backend (auth, CRUD reglas, auditoria) se hace via la API REST bajo `/api/*` descrita en `docs/MANUAL_ADMIN.md`. El contenido del archivo REM **nunca** se envia al backend; solo metadatos no clinicos (nombre, codigo, serie, mes, comuna, conteo por severidad, IP, UA).
- **Convencion de carpetas**:
  - `api/` - Backend PHP nativo (router, controllers, models, middleware, lib).
  - `services/` - Servicios TypeScript del validador (incluye `services/api/` para el cliente HTTP del panel admin).
  - `admin/` - Sub-app React del panel admin (AuthContext, RequireAdmin, pages).
  - `scripts/` - Scripts PHP de operacion (migrate, seed-admin, test-auth).
  - `specs/` - Documentacion Spec Kit por feature.
- **Skills disponibles**: ver `.agents/skills/`. Para este modulo admin, las skills criticas son `speckit-git-feature`, `speckit-git-commit` y `speckit-agent-context-update`.
