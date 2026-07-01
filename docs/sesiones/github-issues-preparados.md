# Issues preparados para GitHub - Serie P

A continuación se listan los issues que se deben crear manualmente en
https://github.com/rogarces85/validador-deis-sso/issues

`gh` no está disponible en el entorno actual.

---

## Issue 1: Generar archivos de prueba Serie P mes 12 (diciembre)

**Título:** Generar archivos de prueba para Serie P mes 12

**Labels:** enhancement, testing, serie-p

**Milestone:** Serie P v1.0

**Descripción:**

### Objetivo
Extender la cobertura de pruebas Serie P al segundo semestre (diciembre, mes 12), replicando los archivos de junio pero con sufijo `12`.

### Tareas
- [ ] Generar `123010P12.xlsm` (archivo OK, 37/37 reglas aprobadas)
- [ ] Generar 33 archivos `123010P12_Px_Vyyy.xlsm` (fallas controladas)
- [ ] Actualizar `Reporte_Pruebas_Serie_P.xlsx` con la cobertura mes 12
- [ ] Validar en pipeline con `node dist-pipeline/run-app-pipeline.js`
- [ ] Commitear y referenciar en documentación

### Criterios de aceptación
- Archivo OK pasa 37/37 reglas
- Cada archivo FALLA activa exactamente su regla objetivo
- No se introducen regresiones en Serie A ni en Serie P mes 06

---

## Issue 2: Generar archivos de prueba para HBSJO (código 123100)

**Título:** Cubrir reglas exclusivas HBSJO con archivos de prueba

**Labels:** enhancement, testing, serie-p

**Milestone:** Serie P v1.0

**Descripción:**

### Objetivo
Las 4 reglas exclusivas para Hospital Básico San José de Osorno (HBSJO) no se pueden
probar con el establecimiento 123010 (DIRECCION). Se requieren archivos con código
123100.

### Reglas a cubrir
- `P01-VAL009` (Hoja P1)
- `P05-VAL002` (Hoja P5)
- `P11-VAL001` (Hoja P11)
- `P11-VAL002` (Hoja P11)

### Tareas
- [ ] Identificar el código DEIS real de HBSJO
- [ ] Crear archivo base HBSJO con hojas obligatorias
- [ ] Generar archivos OK y FALLA por regla
- [ ] Validar que las reglas se activan con el código y se omiten con otros
- [ ] Actualizar reporte de pruebas

### Criterios de aceptación
- Cada archivo FALLA activa la regla objetivo
- Verificar que las reglas NO se aplican a establecimientos no HBSJO

---

## Issue 3: Documentar matriz final de pruebas Serie P

**Título:** Crear documento PDF/Markdown con matriz final de pruebas

**Labels:** documentation, serie-p

**Milestone:** Serie P v1.0

**Descripción:**

### Objetivo
Generar un documento formal que resuma toda la evidencia de pruebas Serie P
para adjuntar al Pull Request y al informe institucional.

### Contenido propuesto
- Resumen ejecutivo (alcance, cobertura, resultado)
- Tabla de cobertura por hoja
- Tabla de archivos OK/FALLA con su resultado
- Capturas o ejemplos de hallazgos
- Limitaciones y exclusiones
- Pendientes

### Formatos
- Markdown en `docs/sesiones/serie-p-matriz-pruebas.md`
- Opcional: PDF generado desde el Markdown

### Criterios de aceptación
- Documento revisado y firmado por el equipo
- Referenciado desde el PR y desde el `README.md`

---

## Issue 4: Evaluar persistencia del harness de pipeline

**Título:** Decidir ubicación del harness tests-pipeline/

**Labels:** refactor, infrastructure

**Descripción:**

### Contexto
Se creó `tests-pipeline/run-app-pipeline.ts` y su bundle `dist-pipeline/` para
ejecutar el pipeline real de la app desde Node y validar archivos con sufijos
que no pasarían la validación estricta de nombre.

### Pregunta a resolver
¿Este harness debe quedar en el repo principal o moverse a una rama separada
o paquete independiente?

### Opciones
- **A:** Mantenerlo en la rama principal bajo `tests-pipeline/` y `dist-pipeline/`.
- **B:** Moverlo a una rama de herramientas internas (no mergeada a main).
- **C:** Eliminarlo una vez cerrado el PR y confiar solo en Vitest + UI manual.

### Tareas
- [ ] Discutir con el equipo
- [ ] Decidir opción
- [ ] Aplicar (mantener, mover o eliminar)
- [ ] Actualizar `.gitignore` si corresponde

---

## Issue 5: Validar comportamiento con establecimiento CESFAM

**Título:** Confirmar reglas exclusivas CESFAM con código real

**Labels:** enhancement, testing, serie-p

**Descripción:**

### Contexto
Algunas reglas usan `validacion_exclusiva: "CESFAM"`. Falta confirmar el código
DEIS real del CESFAM y validar que las reglas se activan solo con ese código.

### Tareas
- [ ] Identificar código DEIS de CESFAM
- [ ] Crear archivo de prueba con ese código
- [ ] Generar archivos FALLA que activen las reglas exclusivas CESFAM
- [ ] Validar omisión con códigos no CESFAM

---

## Cómo crear estos issues manualmente

1. Ir a https://github.com/rogarces85/validador-deis-sso/issues
2. Clic en "New issue"
3. Copiar el contenido de cada sección de arriba
4. Asignar labels y milestone correspondientes
5. Si tienes `gh` instalado, puedes ejecutar:

```bash
gh issue create --title "..." --body-file issues/01-mes-12.md --label enhancement,testing,serie-p
```