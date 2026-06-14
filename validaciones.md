{
  "metadata": {
    "nombre": "rules-a",
    "descripcion": "Reglas Serie A convertidas desde Reestructuracion_Expandido.xlsx",
    "version": "0.1.0-borrador",
    "fechaGeneracion": "2026-06-08",
    "totalReglas": 92,
    "advertencia": "Archivo generado como modelo inicial. Revisar especialmente operadores 0 y '>0 y >' antes de producción."
  },
  "convenciones": {
    "SIMPLE": "Evalúa una celda, varias celdas o suma de celdas de una sola hoja REM.",
    "DOBLE": "Evalúa una celda, varias celdas o suma entre dos secciones del mismo REM.",
    "COMPUESTA": "Evalúa una celda, varias celdas o suma entre dos hojas REM distintas.",
    "TODOS": "La regla aplica a todos los establecimientos.",
    "POSTAS": "La regla aplica a Postas; si bloquearEnOtros=true, otros establecimientos no deberían registrar datos en esas celdas."
  },
  "reglas": [
    {
      "id": "A01_SIMPLE_REVISAR_1",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 2,
        "idOriginal": "1"
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Preconcepcional en edades extremas de 10 a 14 años - Preconcepciona Médico/a",
      "expresionIzquierda": "F11",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!F11. Revisar: Control Preconcepcional en edades extremas de 10 a 14 años - Preconcepciona Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_2",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 3,
        "idOriginal": "2"
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Preconcepcional en edades extremas de 10 a 14 años - Preconcepciona Matron/a",
      "expresionIzquierda": "F12",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!F12. Revisar: Control Preconcepcional en edades extremas de 10 a 14 años - Preconcepciona Matron/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_3",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 4,
        "idOriginal": "3"
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Preconcepcional en edades extremas de 45 a 54 años - Preconcepciona Médico/a",
      "expresionIzquierda": "M11",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!M11. Revisar: Control Preconcepcional en edades extremas de 45 a 54 años - Preconcepciona Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_4",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 5,
        "idOriginal": "4"
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Preconcepcional en edades extremas de 45 a 54 años - Preconcepciona Matron/a",
      "expresionIzquierda": "M12",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!M12. Revisar: Control Preconcepcional en edades extremas de 45 a 54 años - Preconcepciona Matron/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_5",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 6,
        "idOriginal": "5"
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Preconcepcional en edades extremas de 50 a 54 años - Preconcepciona Médico/a",
      "expresionIzquierda": "N11",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!N11. Revisar: Control Preconcepcional en edades extremas de 50 a 54 años - Preconcepciona Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_6",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 7,
        "idOriginal": "6"
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Preconcepcional en edades extremas de 50 a 54 años - Preconcepciona Matron/a",
      "expresionIzquierda": "N12",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!N12. Revisar: Control Preconcepcional en edades extremas de 50 a 54 años - Preconcepciona Matron/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_7",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 8,
        "idOriginal": "7"
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Prenatal en edades extremas de 50 a 54 años - Prenatal Médico/a",
      "expresionIzquierda": "N13",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!N13. Revisar: Control Prenatal en edades extremas de 50 a 54 años - Prenatal Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_8",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 9,
        "idOriginal": "8"
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Prenatal en edades extremas de 50 a 54 años - Prenatal Matron/a",
      "expresionIzquierda": "N14",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!N14. Revisar: Control Prenatal en edades extremas de 50 a 54 años - Prenatal Matron/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_009",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 10,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Post Parto en Edades Extremas 50 a 54 años - Médico/a",
      "expresionIzquierda": "N15",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!N15. Revisar: Control Post Parto en Edades Extremas 50 a 54 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_010",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 11,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Post Parto en Edades Extremas 50 a 54 años - Matron/a",
      "expresionIzquierda": "N16",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!N16. Revisar: Control Post Parto en Edades Extremas 50 a 54 años - Matron/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_011",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 12,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 55 - 59 años - Médico/a",
      "expresionIzquierda": "O31",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!O31. Revisar: Control Regulación de Fecundidad en edades extremas 55 - 59 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_012",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 13,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 55 - 59 años - Médico/a",
      "expresionIzquierda": "O32",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!O32. Revisar: Control Regulación de Fecundidad en edades extremas 55 - 59 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_013",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 14,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 60 - 64 años - Médico/a",
      "expresionIzquierda": "P31",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!P31. Revisar: Control Regulación de Fecundidad en edades extremas 60 - 64 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_014",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 15,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 60 - 64 años - Médico/a",
      "expresionIzquierda": "P32",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!P32. Revisar: Control Regulación de Fecundidad en edades extremas 60 - 64 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_015",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 16,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 65 - 69 años - Médico/a",
      "expresionIzquierda": "Q31",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!Q31. Revisar: Control Regulación de Fecundidad en edades extremas 65 - 69 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_016",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 17,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 65 - 69 años - Médico/a",
      "expresionIzquierda": "Q32",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!Q32. Revisar: Control Regulación de Fecundidad en edades extremas 65 - 69 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_017",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 18,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 70 -74 años - Médico/a",
      "expresionIzquierda": "R31",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!R31. Revisar: Control Regulación de Fecundidad en edades extremas 70 -74 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_018",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 19,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 70 -74 años - Médico/a",
      "expresionIzquierda": "R32",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!R32. Revisar: Control Regulación de Fecundidad en edades extremas 70 -74 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_019",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 20,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 75 -79 años - Médico/a",
      "expresionIzquierda": "S31",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!S31. Revisar: Control Regulación de Fecundidad en edades extremas 75 -79 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_020",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 21,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 75 -79 años - Médico/a",
      "expresionIzquierda": "S32",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!S32. Revisar: Control Regulación de Fecundidad en edades extremas 75 -79 años - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_021",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 22,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 80 años y Más - Médico/a",
      "expresionIzquierda": "T31",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!T31. Revisar: Control Regulación de Fecundidad en edades extremas 80 años y Más - Médico/a."
    },
    {
      "id": "A01_SIMPLE_REVISAR_022",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 23,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
      "descripcion": "Control Regulación de Fecundidad en edades extremas 80 años y Más - Médico/a",
      "expresionIzquierda": "T32",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!T32. Revisar: Control Regulación de Fecundidad en edades extremas 80 años y Más - Médico/a."
    },
    {
      "id": "A01_COMPUESTA_ERROR_023",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 24,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA / SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL",
      "descripcion": "Control Puérpera recién nacido hasta 10 días de vida más Control de salud Menos de 1 Mes",
      "expresionIzquierda": "C19+C20+C21+C22+C23+C24+C25+C26+F36+F37+F38",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C89",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A01!C19+C20+C21+C22+C23+C24+C25+C26+F36+F37+F38 = A05!C89 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A05",
      "seccionDerecha": "SECCIÓN E: INGRESOS A CONTROL DE SALUD DE RECIÉN NACIDOS",
      "descripcionDerecha": "Ingresos a control de salud recién Nacidos, Menores o igual a 28 días"
    },
    {
      "id": "A01_COMPUESTA_ERROR_024",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 25,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL",
      "descripcion": "Controles de salud realizado por Médico/a, Enfermera/o Matrona/ón en el rango de 10-14 años",
      "expresionIzquierda": "T36+T37+T38",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C74",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A01!T36+T37+T38 >= A01!C74 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A01",
      "seccionDerecha": "SECCIÓN D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES",
      "descripcionDerecha": "Total de controles según Lugar de control según edad 10 a 14 años"
    },
    {
      "id": "A01_COMPUESTA_ERROR_025",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 26,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL",
      "descripcion": "Controles de salud realizado por Médico/a, Enfermera/o Matrona/ón en el rango de 15-19 años",
      "expresionIzquierda": "U36+U37+U38",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "F74",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A01!U36+U37+U38 >= A01!F74 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A01",
      "seccionDerecha": "SECCIÓN D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES",
      "descripcionDerecha": "Total de controles según Lugar de control según edad 15 a 19 años"
    },
    {
      "id": "A01_SIMPLE_REVISAR_026",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 27,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL",
      "descripcion": "Control de salud Menos de 1 Mes, NO debería ser registrado por el médico salvo excepciones",
      "expresionIzquierda": "F36",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A01!F36. Revisar: Control de salud Menos de 1 Mes, NO debería ser registrado por el médico salvo excepciones."
    },
    {
      "id": "A01_COMPUESTA_REVISAR_027",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 28,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL",
      "descripcion": "Controles de salud realizado por Médico/a, Enfermera/o en el rango 18 - 23 meses",
      "expresionIzquierda": "O36+O37",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "L20+M20",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: La relación A01!O36+O37 >= A03!L20+M20 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR",
      "descripcionDerecha": "Aplicación test de Desarrollo Psicomotor en el rango 18 - 23 meses"
    },
    {
      "id": "A01_COMPUESTA_REVISAR_028",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 29,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL",
      "descripcion": "Controles de salud realizado por Médico/a, Enfermera/o en el rango 24 - 47 meses",
      "expresionIzquierda": "P36+P37",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "N20+O20",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: La relación A01!P36+P37 >= A03!N20+O20 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR",
      "descripcionDerecha": "Aplicación test de Desarrollo Psicomotor en el rango 24 - 47 meses"
    },
    {
      "id": "A01_COMPUESTA_ERROR_029",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 30,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL",
      "descripcion": "Controles de salud realizado por Médico/a, Enfermera/o en el rango 2 meses",
      "expresionIzquierda": "H36+H37",
      "operacion": {
        "operadorOriginal": ">",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda > derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C92",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A01!H36+H37 > A03!C92 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN B.3: APLICACIÓN DE ESCALA DE EDIMBURGO A GESTANTES Y MUJERES POST PARTO",
      "descripcionDerecha": "Evaluación a mujeres/personas post parto síntomas de depresión A los 2 meses"
    },
    {
      "id": "A01_COMPUESTA_ERROR_030",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 31,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL",
      "descripcion": "Controles de salud realizado por Médico/a, Enfermera/o en el rango 6 meses",
      "expresionIzquierda": "L36+L37",
      "operacion": {
        "operadorOriginal": ">",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda > derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C93",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A01!L36+L37 > A03!C93 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN B.3: APLICACIÓN DE ESCALA DE EDIMBURGO A GESTANTES Y MUJERES POST PARTO",
      "descripcionDerecha": "Evaluación a mujeres/personas post parto síntomas de depresión A los 6 meses"
    },
    {
      "id": "A01_COMPUESTA_ERROR_031",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 32,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A01",
      "seccion": "SECCIÓN B: CONTROLES DE SALUD SEGÚN CICLO VITAL",
      "descripcion": "Controles de salud realizado por Médico/a, Enfermera/o Matrona/ón en los rangos 10 - 14 años y 15 - 19 años",
      "expresionIzquierda": "T36+T37+T38+U36+U37+U38",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C97",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A01!T36+T37+T38+U36+U37+U38 = A03!C97 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN C: RESULTADOS DE LA EVALUACIÓN DEL ESTADO NUTRICIONAL DEL ADOLESCENTE CON CONTROL SALUD INTEGRAL",
      "descripcionDerecha": "Total Estado Nutricional par ambos Sexos"
    },
    {
      "id": "A02_DOBLE_ERROR_032",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 33,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A02",
      "seccion": "SECCIÓN A: EMP REALIZADO POR PROFESIONAL",
      "descripcion": "Total EMP Realizados por Profesional para Ambos Sexos",
      "expresionIzquierda": "B11",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B21",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A02!B11 = A02!B21 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A02",
      "seccionDerecha": "SECCIÓN B: EMP SEGÚN RESULTADO DEL ESTADO NUTRICIONAL",
      "descripcionDerecha": "Total EMP según Resultado del Estado Nutricional Ambos Sexos"
    },
    {
      "id": "A02_DOBLE_ERROR_033",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 34,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A02",
      "seccion": "SECCIÓN A: EMP REALIZADO POR PROFESIONAL",
      "descripcion": "Total EMP realizados por profesional a Hombres",
      "expresionIzquierda": "C11",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C21",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A02!C11 = A02!C21 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A02",
      "seccionDerecha": "SECCIÓN B: EMP SEGÚN RESULTADO DEL ESTADO NUTRICIONAL",
      "descripcionDerecha": "Total EMP según Resultado del Estado Nutricional a Hombres"
    },
    {
      "id": "A02_DOBLE_ERROR_034",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 35,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A02",
      "seccion": "SECCIÓN A: EMP REALIZADO POR PROFESIONAL",
      "descripcion": "Total EMP realizados por profesional a Mujeres",
      "expresionIzquierda": "D11",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "D21",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A02!D11 = A02!D21 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A02",
      "seccionDerecha": "SECCIÓN B: EMP SEGÚN RESULTADO DEL ESTADO NUTRICIONAL",
      "descripcionDerecha": "Total EMP según Resultado del Estado Nutricional a Mujeres"
    },
    {
      "id": "A02_SIMPLE_ERROR_035",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 36,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A02",
      "seccion": "SECCIÓN A: EMP REALIZADO POR PROFESIONAL",
      "descripcion": "Total EMP realizado por Profesional, celda B17 debe corresponder solo a Postas",
      "expresionIzquierda": "B17",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "POSTAS",
        "validarEn": [
          "POSTAS"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A02!B17. Revisar: Total EMP realizado por Profesional, celda B17 debe corresponder solo a Postas."
    },
    {
      "id": "A02_COMPUESTA_ERROR_036",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 37,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A02",
      "seccion": "SECCIÓN A: EMP REALIZADO POR PROFESIONAL",
      "descripcion": "Total EMP Realizados por Profesional para Ambos Sexos",
      "expresionIzquierda": "B11",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C108+C110",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A02!B11 = A03!C108+C110 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN D.1: APLICACIÓN DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS",
      "descripcionDerecha": "Nº de Audit (EMP/EMPAM) y Nº de Assist (EMP/EMPAM) para Ambos Sexos"
    },
    {
      "id": "A02_COMPUESTA_ERROR_037",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 38,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A02",
      "seccion": "SECCIÓN A: EMP REALIZADO POR PROFESIONAL",
      "descripcion": "Total EMP Realizados por Profesional en el rango de edad 15 - 19 años",
      "expresionIzquierda": "E11+F11",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C113",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A02!E11+F11 = A03!C113 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN D.1: APLICACIÓN DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS",
      "descripcionDerecha": "N° de Craff aplicado (EMP)"
    },
    {
      "id": "A03_DOBLE_ERROR_038",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 39,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A03",
      "seccion": "SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR",
      "descripcion": "Total Aplicación test de Desarrollo Psicomotor Ambos Sexos",
      "expresionIzquierda": "C20",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C21+C22+C23+C24+C25+C26+C27+C28+C29+C30+C31+C32+C33+C34+C35+C36",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A03!C20 = A03!C21+C22+C23+C24+C25+C26+C27+C28+C29+C30+C31+C32+C33+C34+C35+C36 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR",
      "descripcionDerecha": "Resultados de Aplicación test de Desarrollo Psicomotor"
    },
    {
      "id": "A03_DOBLE_ERROR_039",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 40,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A03",
      "seccion": "SECCIÓN A.1: APLICACIÓN Y RESULTADOS DE PAUTA BREVE",
      "descripcion": "Aplicación Pauta Breve en Ambos Sexos",
      "expresionIzquierda": "C13",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C14+C15",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A03!C13 = A03!C14+C15 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN A.1: APLICACIÓN Y RESULTADOS DE PAUTA BREVE",
      "descripcionDerecha": "Resultados Normal y Alterado"
    },
    {
      "id": "A03_DOBLE_ERROR_040",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 41,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A03",
      "seccion": "SECCIÓN A.4: RESULTADOS DE LA APLICACIÓN DE PROTOCOLO NEUROSENSORIAL",
      "descripcion": "Total Aplicación de Protocolo Neurosensorial (1-2 meses) en ambos sexos",
      "expresionIzquierda": "C54",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C55+C56+C57",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A03!C54 = A03!C55+C56+C57 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN A.4: RESULTADOS DE LA APLICACIÓN DE PROTOCOLO NEUROSENSORIAL",
      "descripcionDerecha": "Total resultado Aplicación de Protocolo Neurosensorial (Normal, Anormal y Muy Anormal)"
    },
    {
      "id": "A03_DOBLE_ERROR_041",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 42,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A03",
      "seccion": "SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR",
      "descripcion": "Resultado Primera Evaluación Normal con Rezago",
      "expresionIzquierda": "C22",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B46",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A03!C22 = A03!B46 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN A.3: NIÑOS Y NIÑAS CON REZAGO, DÉFICIT O RIESGO BIOPSICOSOCIAL DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACIÓN EN LA PRIMERA EVALUACIÓN",
      "descripcionDerecha": "Derivados a alguna Modalidad de estimulacion Normal con Rezago"
    },
    {
      "id": "A03_DOBLE_ERROR_042",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 43,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A03",
      "seccion": "SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR",
      "descripcion": "Resultado Primera Evaluación Riesgo",
      "expresionIzquierda": "C23",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B47",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A03!C23 = A03!B47 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN A.3: NIÑOS Y NIÑAS CON REZAGO, DÉFICIT O RIESGO BIOPSICOSOCIAL DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACIÓN EN LA PRIMERA EVALUACIÓN",
      "descripcionDerecha": "Derivados a alguna Modalidad de estimulacion Normal con Riesgo"
    },
    {
      "id": "A03_DOBLE_ERROR_043",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 44,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A03",
      "seccion": "SECCIÓN A.2: RESULTADOS DE LA APLICACIÓN DE ESCALA DE EVALUACIÓN DEL DESARROLLO PSICOMOTOR",
      "descripcion": "Resultado Primera Evaluación Retraso",
      "expresionIzquierda": "C24",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B48",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A03!C24 = A03!B48 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN A.3: NIÑOS Y NIÑAS CON REZAGO, DÉFICIT O RIESGO BIOPSICOSOCIAL DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACIÓN EN LA PRIMERA EVALUACIÓN",
      "descripcionDerecha": "Derivados a alguna Modalidad de estimulacion Normal con Retraso"
    },
    {
      "id": "A03_COMPUESTA_ERROR_044",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 45,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A03",
      "seccion": "SECCIÓN B.2: APLICACIÓN DE ESCALA SEGÚN EVALUACIÓN DE RIESGO PSICOSOCIAL ABREVIADA A GESTANTES",
      "descripcion": "Total Aplicación Evaluación al ingreso",
      "expresionIzquierda": "B86",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C11",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A03!B86 = A05!C11 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A05",
      "seccionDerecha": "SECCIÓN A: INGRESOS DE GESTANTES A PROGRAMA PRENATAL",
      "descripcionDerecha": "Total Gestantes Ingresadas"
    },
    {
      "id": "A03_COMPUESTA_ERROR_045",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 46,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "COMPUESTA",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A03",
      "seccion": "SECCIÓN D.1: APLICACIÓN DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS",
      "descripcion": "Comopnentes de evaluacion de riesgo (Nº de Audit- Nº de Assis - N° de Craff )",
      "expresionIzquierda": "C108+C109+C110+C111+C112+C113+C114",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C115+C116+C117",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A03!C108+C109+C110+C111+C112+C113+C114 = A03!C115+C116+C117 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN D.1: APLICACIÓN DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS",
      "descripcionDerecha": "Resultados de evaluación (Bajo riesgo-Consumo riesgoso/intermedio - Posible consumo perjudicial o dependencia )"
    },
    {
      "id": "A03_DOBLE_ERROR_046",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 47,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A03",
      "seccion": "SECCION E: APLICACIÓN DE PAUTA DETECCIÓN DE FACTORES DE RIESGO BIOPSICOSOCIAL INFANTIL",
      "descripcion": "Total de Aplicaciones Pauta de Riesgo Biopsicosocial en Control de Salud Infantil",
      "expresionIzquierda": "C213",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C214+C215",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A03!C213 = A03!C214+C215 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCION E: APLICACIÓN DE PAUTA DETECCIÓN DE FACTORES DE RIESGO BIOPSICOSOCIAL INFANTIL",
      "descripcionDerecha": "total evaluacion Riesgo y Sin Riesgo"
    },
    {
      "id": "A03_DOBLE_ERROR_047",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 48,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A03",
      "seccion": "SECCIÓN A.5: TIPO DE ALIMENTACIÓN NIÑOS Y NIÑAS CONTROLADOS",
      "descripcion": "Tipos de alimentación (Lactancia Materna exclusiva (LME)- Lactancia Materna más Formula Láctea (LM/FL), Formula Láctea (FL), Etc",
      "expresionIzquierda": "C61+C62+C63+C64+C65+C66",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C67",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A03!C61+C62+C63+C64+C65+C66 = A03!C67 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A03",
      "seccionDerecha": "SECCIÓN A.5: TIPO DE ALIMENTACIÓN NIÑOS Y NIÑAS CONTROLADOS",
      "descripcionDerecha": "Total de niños y niñas controlados"
    },
    {
      "id": "A04_DOBLE_ERROR_048",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 49,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A04",
      "seccion": "SECCIÓN B: CONSULTAS DE PROFESIONALES NO MÉDICOS",
      "descripcion": "Consultas Nutricionista (Otras consultas), Nutricionista malnutrición por exceso, Nutricionista malnutrición por déficit en ambos sexos",
      "expresionIzquierda": "B39+B40+B41",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B135+B136+B137",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A04!B39+B40+B41 = A04!B135+B136+B137 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A04",
      "seccionDerecha": "SECCIÓN K: CLASIFICACIÓN DE CONSULTA NUTRICIONAL POR GRUPO DE EDAD (Incluidas en sección B)",
      "descripcionDerecha": "Clasificación Nutricional (Mal nutrición por riesgo a desnutrir/riesgo bajo peso, Mal nutrición por riesgo obesidad sobrepeso, Estado nutricional normal )"
    },
    {
      "id": "A04_DOBLE_ERROR_049",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 50,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A04",
      "seccion": "SECCIÓN L: CONSULTA DE LACTANCIA EN NIÑOS Y NIÑAS CONTROLADOS",
      "descripcion": "Total Consultas Lactancia Materna",
      "expresionIzquierda": "C141+C142+C143",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C146+C147+C148+C149",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A04!C141+C142+C143 = A04!C146+C147+C148+C149 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A04",
      "seccionDerecha": "SECCIÓN L: CONSULTA DE LACTANCIA EN NIÑOS Y NIÑAS CONTROLADOS",
      "descripcionDerecha": "TotalConsulta de Lactancia por profesional (Médico/a, Matrona/ón, Enfermera/o, Nutricionista )"
    },
    {
      "id": "A04_DOBLE_ERROR_050",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 51,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A04",
      "seccion": "SECCIÓN I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA",
      "descripcion": "Despacho de recetas (Despacho Completo - Despacho Parcial) para tipo: Crónica",
      "expresionIzquierda": "C114+D114",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "E114+F114",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A04!C114+D114 = A04!E114+F114 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A04",
      "seccionDerecha": "SECCIÓN I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA",
      "descripcionDerecha": "Lugar de entrega: En Centro de Salud y En Domicilio para tipo: Crónica"
    },
    {
      "id": "A04_DOBLE_ERROR_051",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 52,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A04",
      "seccion": "SECCIÓN I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA",
      "descripcion": "Despacho de recetas (Despacho Completo - Despacho Parcial) para tipo: Morbilidad",
      "expresionIzquierda": "C115+D115",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "E115+F115",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A04!C115+D115 = A04!E115+F115 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A04",
      "seccionDerecha": "SECCIÓN I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA",
      "descripcionDerecha": "Lugar de entrega: En Centro de Salud y En Domicilio para tipo: Morbilidad"
    },
    {
      "id": "A04_DOBLE_ERROR_052",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 53,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A04",
      "seccion": "SECCIÓN I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA",
      "descripcion": "Despacho de recetas (Despacho Completo - Despacho Parcial) para tipo: Bajo control legal",
      "expresionIzquierda": "C116+D116",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "E116+F116",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A04!C116+D116 = A04!E116+F116 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A04",
      "seccionDerecha": "SECCIÓN I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA",
      "descripcionDerecha": "Lugar de entrega: En Centro de Salud y En Domicilio para tipo: Bajo control legal"
    },
    {
      "id": "A04_DOBLE_ERROR_053",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 54,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A04",
      "seccion": "SECCIÓN I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA",
      "descripcion": "Despacho de recetas Completo y Oportuno para tipo Crónica",
      "expresionIzquierda": "M114",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "L114",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A04!M114 = A04!L114 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A04",
      "seccionDerecha": "SECCIÓN I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCIÓN PRIMARIA",
      "descripcionDerecha": "Despacho de recetas Completo"
    },
    {
      "id": "A05_SIMPLE_REVISAR_054",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 55,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A05",
      "seccion": "SECCIÓN A: INGRESOS DE GESTANTES A PROGRAMA PRENATAL",
      "descripcion": "Ingreso de Gestantes Ingresadas en edades (45 - 49 años, 50 - 54 años, 55 y más años)",
      "expresionIzquierda": "L11+L12+L13+L14+M11+M12+M13+M14+N11+N12+N13+N14",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A05!L11+L12+L13+L14+M11+M12+M13+M14+N11+N12+N13+N14. Revisar: Ingreso de Gestantes Ingresadas en edades (45 - 49 años, 50 - 54 años, 55 y más años)."
    },
    {
      "id": "A05_DOBLE_ERROR_055",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 56,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A05",
      "seccion": "SECCIÓN H: INGRESOS AL PROGRAMA DE SALUD CARDIOVASCULAR (PSCV)",
      "descripcion": "Ingresos al PSCV en ambos sexos",
      "expresionIzquierda": "C119",
      "operacion": {
        "operadorOriginal": "<=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "<=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda <= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C120+C121+C122+C123+C124+C125+C126+C127",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A05!C119 <= A05!C120+C121+C122+C123+C124+C125+C126+C127 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A05",
      "seccionDerecha": "SECCIÓN H: INGRESOS AL PROGRAMA DE SALUD CARDIOVASCULAR (PSCV)",
      "descripcionDerecha": "Desglose del Programa de Salud Cardiovascular (Hipertensión Arterial, Diabetes Mellitus, etc)"
    },
    {
      "id": "A05_DOBLE_ERROR_056",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 57,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A05",
      "seccion": "SECCIÓN J: INGRESOS Y EGRESOS AL PROGRAMA DE PACIENTES CON DEPENDENCIA LEVE, MODERADA Y SEVERA",
      "descripcion": "Ingreso por Dependencia Leve, Moderada,Severa, severa (lesiones por presión) en edades entre 65 años y 80 años y más",
      "expresionIzquierda": "AF146+AF147+AF148+AF149+AF150+AG146+AG147+AG148+AG149+AG150+AH146+AH147+AH148+AH149+AH150+AI146+AI147+AI148+AI149+AI150+AJ146+AJ147+AJ148+AJ149+AJ150+AK146+AK147+AK148+AK149+AK150+AL146+AL147+AL148+AL149+AL150+AM146+AM147+AM148+AM149+AM150",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C162",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A05!AF146+AF147+AF148+AF149+AF150+AG146+AG147+AG148+AG149+AG150+AH146+AH147+AH148+AH149+AH150+AI146+AI147+AI148+AI149+AI150+AJ146+AJ147+AJ148+AJ149+AJ150+AK146+AK147+AK148+AK149+AK150+AL146+AL147+AL148+AL149+AL150+AM146+AM147+AM148+AM149+AM150 >= A05!C162 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A05",
      "seccionDerecha": "SECCIÓN K: INGRESOS AL PROGRAMA DEL ADULTO MAYOR SEGÚN CONDICIÓN DE FUNCIONALIDAD Y DEPENDENCIA",
      "descripcionDerecha": "Subtotal Barthel (Dependiente Leve, Dependiente Moderado, Dependiente Grave, Dependiente Total)"
    },
    {
      "id": "A05_DOBLE_REVISAR_057",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 58,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A05",
      "seccion": "SECCIÓN N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD",
      "descripcion": "Ingresos al programa salud mental",
      "expresionIzquierda": "C193",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C204",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: La relación A05!C193 = A05!C204 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A05",
      "seccionDerecha": "SECCIÓN N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD",
      "descripcionDerecha": "Personas que posee uno o más trastornos Mentales"
    },
    {
      "id": "A05_DOBLE_ERROR_058",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 59,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A05",
      "seccion": "SECCIÓN N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD",
      "descripcion": "Personas con Diagnóstico Trastornos Mentales",
      "expresionIzquierda": "C204",
      "operacion": {
        "operadorOriginal": "<=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "<=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda <= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C205+C206+C207+C208+C209+C210+C211+C212+C213+C214+C215+C216+C217+C218+C219+C220+C221+C222+C223+C224+C225+C226+C227+C228+C229+C230+C231+C232+C233+C234+C235+C236+C237+C238+C239+C240+C241",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A05!C204 <= A05!C205+C206+C207+C208+C209+C210+C211+C212+C213+C214+C215+C216+C217+C218+C219+C220+C221+C222+C223+C224+C225+C226+C227+C228+C229+C230+C231+C232+C233+C234+C235+C236+C237+C238+C239+C240+C241 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A05",
      "seccionDerecha": "SECCIÓN N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD",
      "descripcionDerecha": "Desglose de Diagnósticos de Trastornos Mentales"
    },
    {
      "id": "A05_SIMPLE_REVISAR_059",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 60,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A05",
      "seccion": "SECCIÓN R: INGRESOS Y EGRESOS DEL PROGRAMA DE VIH/SIDA",
      "descripcion": "Ingresos y Egresos al programa VIH/SIDA (Uso exclusivo Centros de Atención VIH-SIDA)",
      "expresionIzquierda": "C329+C330+C331+C332+C333+C334+C335+C336+C337+C338+C339+D329+D330+D331+D332+D333+D334+D335+D336+D337+D338+D339+E329+E330+E331+E332+E333+E334+E335+E336+E337+E338+E339",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HBSJO",
        "validarEn": [
          "HBSJO"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A05!C329+C330+C331+C332+C333+C334+C335+C336+C337+C338+C339+D329+D330+D331+D332+D333+D334+D335+D336+D337+D338+D339+E329+E330+E331+E332+E333+E334+E335+E336+E337+E338+E339. Revisar: Ingresos y Egresos al programa VIH/SIDA (Uso exclusivo Centros de Atención VIH-SIDA)."
    },
    {
      "id": "A05_SIMPLE_REVISAR_060",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 61,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A05",
      "seccion": "SECCIÓN S: INGRESOS Y EGRESOS POR COMERCIO SEXUAL",
      "descripcion": "Ingresos y Egresos al programa Comercio Sexual (Uso exclusivo de Unidades Control Comercio Sexual)",
      "expresionIzquierda": "C344+C345+C346+D344+D345+D346+E344+E345+E346",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HBSJO",
        "validarEn": [
          "HBSJO"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A05!C344+C345+C346+D344+D345+D346+E344+E345+E346. Revisar: Ingresos y Egresos al programa Comercio Sexual (Uso exclusivo de Unidades Control Comercio Sexual)."
    },
    {
      "id": "A08_SIMPLE_ERROR_061",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 62,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
      "descripcion": "Atenciones en UEH de Alta Complejidad corresponde solo a HOSPITAL BASE SAN JOSE OSORNO y HOSPITAL PURRANQUE",
      "expresionIzquierda": "E12+E13+E14+E15+F12+F13+F14+F15+G12+G13+G14+G15+H12+H13+H14+H15+I12+I13+I14+I15+J12+J13+J14+J15+K12+K13+K14+K15+L12+L13+L14+L15+M12+M13+M14+M15+N12+N13+N14+N15+O12+O13+O14+O15+P12+P13+P14+P15+Q12+Q13+Q14+Q15+R12+R13+R14+R15+S12+S13+S14+S15+T12+T13+T14+T15+U12+U13+U14+U15+V12+V13+V14+V15+W12+W13+W14+W15+X12+X13+X14+X15+Y12+Y13+Y14+Y15+Z12+Z13+Z14+Z15+AA12+AA13+AA14+AA15+AB12+AB13+AB14+AB15+AC12+AC13+AC14+AC15+AD12+AD13+AD14+AD15+AE12+AE13+AE14+AE15+AF12+AF13+AF14+AF15+AG12+AG13+AG14+AG15+AH12+AH13+AH14+AH15+AI12+AI13+AI14+AI15+AJ12+AJ13+AJ14+AJ15+AK12+AK13+AK14+AK15+AL12+AL13+AL14+AL15",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HBSJO, HPU",
        "validarEn": [
          "HBSJO, HPU"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A08!E12+E13+E14+E15+F12+F13+F14+F15+G12+G13+G14+G15+H12+H13+H14+H15+I12+I13+I14+I15+J12+J13+J14+J15+K12+K13+K14+K15+L12+L13+L14+L15+M12+M13+M14+M15+N12+N13+N14+N15+O12+O13+O14+O15+P12+P13+P14+P15+Q12+Q13+Q14+Q15+R12+R13+R14+R15+S12+S13+S14+S15+T12+T13+T14+T15+U12+U13+U14+U15+V12+V13+V14+V15+W12+W13+W14+W15+X12+X13+X14+X15+Y12+Y13+Y14+Y15+Z12+Z13+Z14+Z15+AA12+AA13+AA14+AA15+AB12+AB13+AB14+AB15+AC12+AC13+AC14+AC15+AD12+AD13+AD14+AD15+AE12+AE13+AE14+AE15+AF12+AF13+AF14+AF15+AG12+AG13+AG14+AG15+AH12+AH13+AH14+AH15+AI12+AI13+AI14+AI15+AJ12+AJ13+AJ14+AJ15+AK12+AK13+AK14+AK15+AL12+AL13+AL14+AL15. Revisar: Atenciones en UEH de Alta Complejidad corresponde solo a HOSPITAL BASE SAN JOSE OSORNO y HOSPITAL PURRANQUE."
    },
    {
      "id": "A08_SIMPLE_ERROR_062",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 63,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN B: CATEGORIZACIÓN DE PACIENTES, PREVIA A LA ATENCIÓN MÉDICA U ODONTOLÓGICA",
      "descripcion": "Categoriaziones C1,C2,C3,C4,C5 Corresponde solo a Establecimientos Alta, Mediana, Baja Complejidad, SAPU, SAR, SUR",
      "expresionIzquierda": "C61+C62+C63+C64+C65+C66+D61+D62+D63+D64+D65+D66+E61+E62+E63+E64+E65+E66+F61+F62+F63+F64+F65+F66+G61+G62+G63+G64+G65+G66+H61+H62+H63+H64+H65+H66+I61+I62+I63+I64+I65+I66+J61+J62+J63+J64+J65+J66+K61+K62+K63+K64+K65+K66+L61+L62+L63+L64+L65+L66+M61+M62+M63+M64+M65+M66+N61+N62+N63+N64+N65+N66+O61+O62+O63+O64+O65+O66+P61+P62+P63+P64+P65+P66+Q61+Q62+Q63+Q64+Q65+Q66+R61+R62+R63+R64+R65+R66+S61+S62+S63+S64+S65+S66+T61+T62+T63+T64+T65+T66+U61+U62+U63+U64+U65+U66+V61+V62+V63+V64+V65+V66+W61+W62+W63+W64+W65+W66+X61+X62+X63+X64+X65+X66+Y61+Y62+Y63+Y64+Y65+Y66+Z61+Z62+Z63+Z64+Z65+Z66+AA61+AA62+AA63+AA64+AA65+AA66+AB61+AB62+AB63+AB64+AB65+AB66+AC61+AC62+AC63+AC64+AC65+AC66+AD61+AD62+AD63+AD64+AD65+AD66+AE61+AE62+AE63+AE64+AE65+AE66+AF61+AF62+AF63+AF64+AF65+AF66+AG61+AG62+AG63+AG64+AG65+AG66+AH61+AH62+AH63+AH64+AH65+AH66+AI61+AI62+AI63+AI64+AI65+AI66+AJ61+AJ62+AJ63+AJ64+AJ65+AJ66+AK61+AK62+AK63+AK64+AK65+AK66+AL61+AL62+AL63+AL64+AL65+AL66",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HOSPITALES, SAPU, SUR",
        "validarEn": [
          "HOSPITALES, SAPU, SUR"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A08!C61+C62+C63+C64+C65+C66+D61+D62+D63+D64+D65+D66+E61+E62+E63+E64+E65+E66+F61+F62+F63+F64+F65+F66+G61+G62+G63+G64+G65+G66+H61+H62+H63+H64+H65+H66+I61+I62+I63+I64+I65+I66+J61+J62+J63+J64+J65+J66+K61+K62+K63+K64+K65+K66+L61+L62+L63+L64+L65+L66+M61+M62+M63+M64+M65+M66+N61+N62+N63+N64+N65+N66+O61+O62+O63+O64+O65+O66+P61+P62+P63+P64+P65+P66+Q61+Q62+Q63+Q64+Q65+Q66+R61+R62+R63+R64+R65+R66+S61+S62+S63+S64+S65+S66+T61+T62+T63+T64+T65+T66+U61+U62+U63+U64+U65+U66+V61+V62+V63+V64+V65+V66+W61+W62+W63+W64+W65+W66+X61+X62+X63+X64+X65+X66+Y61+Y62+Y63+Y64+Y65+Y66+Z61+Z62+Z63+Z64+Z65+Z66+AA61+AA62+AA63+AA64+AA65+AA66+AB61+AB62+AB63+AB64+AB65+AB66+AC61+AC62+AC63+AC64+AC65+AC66+AD61+AD62+AD63+AD64+AD65+AD66+AE61+AE62+AE63+AE64+AE65+AE66+AF61+AF62+AF63+AF64+AF65+AF66+AG61+AG62+AG63+AG64+AG65+AG66+AH61+AH62+AH63+AH64+AH65+AH66+AI61+AI62+AI63+AI64+AI65+AI66+AJ61+AJ62+AJ63+AJ64+AJ65+AJ66+AK61+AK62+AK63+AK64+AK65+AK66+AL61+AL62+AL63+AL64+AL65+AL66. Revisar: Categoriaziones C1,C2,C3,C4,C5 Corresponde solo a Establecimientos Alta, Mediana, Baja Complejidad, SAPU, SAR, SUR."
    },
    {
      "id": "A08_DOBLE_ERROR_063",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 64,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
      "descripcion": "Atención Médica Niño y Adulto Ambos Sexos",
      "expresionIzquierda": "B12",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B67",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A08!B12 = A08!B67 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A08",
      "seccionDerecha": "SECCIÓN B: CATEGORIZACIÓN DE PACIENTES, PREVIA A LA ATENCIÓN MÉDICA U ODONTOLÓGICA",
      "descripcionDerecha": "Total de Categorizaciones pacientes (C1-C2-C3-C4-C5)"
    },
    {
      "id": "A08_DOBLE_ERROR_064",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 65,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
      "descripcion": "Atención Médica Gineco-Obstetra /Matrona/ón Ambos Sexos",
      "expresionIzquierda": "B13+B14",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B78",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A08!B13+B14 = A08!B78 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A08",
      "seccionDerecha": "SECCIÓN B.1: CATEGORIZACIÓN DE PACIENTES DE URGENCIA GINECO OBSTÉTRICA PREVIO A LA ATENCIÓN CLÍNICA POR MATRÓN (A) Y/O MÉDICO GINECO-OBSTETRA",
      "descripcionDerecha": "Categorizaciones de Pacientes Obstétrica C1-C2-C3-C4-C5)"
    },
    {
      "id": "A08_DOBLE_ERROR_065",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 66,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN A.3: ATENCIONES DE URGENCIA REALIZADAS EN ESTABLECIMIENTOS DE BAJA COMPLEJIDAD",
      "descripcion": "Atención Médica Ambos Sexos",
      "expresionIzquierda": "B31",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B67",
      "aplica": {
        "alcance": "HQUI,HMSJ,HRN,HPO,SAPU,SUR",
        "validarEn": [
          "HQUI,HMSJ,HRN,HPO,SAPU,SUR"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: La relación A08!B31 = A08!B67 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A08",
      "seccionDerecha": "SECCIÓN B: CATEGORIZACIÓN DE PACIENTES, PREVIA A LA ATENCIÓN MÉDICA U ODONTOLÓGICA",
      "descripcionDerecha": "Total de Categorizaciones pacientes (C1-C2-C3-C4-C5)"
    },
    {
      "id": "A08_SIMPLE_ERROR_066",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 67,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN A.3: ATENCIONES DE URGENCIA REALIZADAS EN ESTABLECIMIENTOS DE BAJA COMPLEJIDAD",
      "descripcion": "Atenciones UEH Baja Complejidad corresponde solo a Hospitales de Baja Complejidad, SUR y SAPU",
      "expresionIzquierda": "E31+E32+E33+E34+E35+E36+F31+F32+F33+F34+F35+F36+G31+G32+G33+G34+G35+G36+H31+H32+H33+H34+H35+H36+I31+I32+I33+I34+I35+I36+J31+J32+J33+J34+J35+J36+K31+K32+K33+K34+K35+K36+L31+L32+L33+L34+L35+L36+M31+M32+M33+M34+M35+M36+N31+N32+N33+N34+N35+N36+O31+O32+O33+O34+O35+O36+P31+P32+P33+P34+P35+P36+Q31+Q32+Q33+Q34+Q35+Q36+R31+R32+R33+R34+R35+R36+S31+S32+S33+S34+S35+S36+T31+T32+T33+T34+T35+T36+U31+U32+U33+U34+U35+U36+V31+V32+V33+V34+V35+V36+W31+W32+W33+W34+W35+W36+X31+X32+X33+X34+X35+X36+Y31+Y32+Y33+Y34+Y35+Y36+Z31+Z32+Z33+Z34+Z35+Z36+AA31+AA32+AA33+AA34+AA35+AA36+AB31+AB32+AB33+AB34+AB35+AB36+AC31+AC32+AC33+AC34+AC35+AC36+AD31+AD32+AD33+AD34+AD35+AD36+AE31+AE32+AE33+AE34+AE35+AE36+AF31+AF32+AF33+AF34+AF35+AF36+AG31+AG32+AG33+AG34+AG35+AG36+AH31+AH32+AH33+AH34+AH35+AH36+AI31+AI32+AI33+AI34+AI35+AI36+AJ31+AJ32+AJ33+AJ34+AJ35+AJ36+AK31+AK32+AK33+AK34+AK35+AK36+AL31+AL32+AL33+AL34+AL35+AL36",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HQUI,HMSJ,HRN,HPO,SAPU,SUR",
        "validarEn": [
          "HQUI,HMSJ,HRN,HPO,SAPU,SUR"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A08!E31+E32+E33+E34+E35+E36+F31+F32+F33+F34+F35+F36+G31+G32+G33+G34+G35+G36+H31+H32+H33+H34+H35+H36+I31+I32+I33+I34+I35+I36+J31+J32+J33+J34+J35+J36+K31+K32+K33+K34+K35+K36+L31+L32+L33+L34+L35+L36+M31+M32+M33+M34+M35+M36+N31+N32+N33+N34+N35+N36+O31+O32+O33+O34+O35+O36+P31+P32+P33+P34+P35+P36+Q31+Q32+Q33+Q34+Q35+Q36+R31+R32+R33+R34+R35+R36+S31+S32+S33+S34+S35+S36+T31+T32+T33+T34+T35+T36+U31+U32+U33+U34+U35+U36+V31+V32+V33+V34+V35+V36+W31+W32+W33+W34+W35+W36+X31+X32+X33+X34+X35+X36+Y31+Y32+Y33+Y34+Y35+Y36+Z31+Z32+Z33+Z34+Z35+Z36+AA31+AA32+AA33+AA34+AA35+AA36+AB31+AB32+AB33+AB34+AB35+AB36+AC31+AC32+AC33+AC34+AC35+AC36+AD31+AD32+AD33+AD34+AD35+AD36+AE31+AE32+AE33+AE34+AE35+AE36+AF31+AF32+AF33+AF34+AF35+AF36+AG31+AG32+AG33+AG34+AG35+AG36+AH31+AH32+AH33+AH34+AH35+AH36+AI31+AI32+AI33+AI34+AI35+AI36+AJ31+AJ32+AJ33+AJ34+AJ35+AJ36+AK31+AK32+AK33+AK34+AK35+AK36+AL31+AL32+AL33+AL34+AL35+AL36. Revisar: Atenciones UEH Baja Complejidad corresponde solo a Hospitales de Baja Complejidad, SUR y SAPU."
    },
    {
      "id": "A08_SIMPLE_ERROR_067",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 68,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN B.1: CATEGORIZACIÓN DE PACIENTES DE URGENCIA GINECO OBSTÉTRICA PREVIO A LA ATENCIÓN CLÍNICA POR MATRÓN (A) Y/O MÉDICO GINECO-OBSTETRA",
      "descripcion": "Categoriaziones C1,C2,C3,C4,C5 Corresponde solo a Hospitales de Baja Complejidad, SUR y SAPU",
      "expresionIzquierda": "B78",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HQUI,HMSJ,HRN,HPO,SAPU,SUR",
        "validarEn": [
          "HQUI,HMSJ,HRN,HPO,SAPU,SUR"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A08!B78. Revisar: Categoriaziones C1,C2,C3,C4,C5 Corresponde solo a Hospitales de Baja Complejidad, SUR y SAPU."
    },
    {
      "id": "A08_SIMPLE_ERROR_068",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 69,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA",
      "descripcion": "Traslados SAMU (Básico-Avanzado",
      "expresionIzquierda": "C169+C170+D169+D170+E169+E170+F169+F170",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "SAMU",
        "validarEn": [
          "SAMU"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A08!C169+C170+D169+D170+E169+E170+F169+F170. Revisar: Traslados SAMU (Básico-Avanzado."
    },
    {
      "id": "A08_SIMPLE_ERROR_069",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 70,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA",
      "descripcion": "Traslados (Enrutado,Basicos) corresponde solo a los siguientes establecimientos",
      "expresionIzquierda": "C171+D171+E171+F171",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HRN-HPU-HMSJ-HQUI-CESFAM BAHIA MANSA-SAPU ENTRE LAGOS-SUR PUAUCHO- SUR BAHIA MANSA- SUR SANPABLO",
        "validarEn": [
          "HRN-HPU-HMSJ-HQUI-CESFAM BAHIA MANSA-SAPU ENTRE LAGOS-SUR PUAUCHO- SUR BAHIA MANSA- SUR SANPABLO"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A08!C171+D171+E171+F171. Revisar: Traslados (Enrutado,Basicos) corresponde solo a los siguientes establecimientos."
    },
    {
      "id": "A08_SIMPLE_ERROR_070",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 71,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA",
      "descripcion": "Traslados No SAMU (Terrestre - Marítimo - Aéreo)",
      "expresionIzquierda": "C172+C173+C174+D172+D173+D174+E172+E173+E174+F172+F173+F174",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A08!C172+C173+C174+D172+D173+D174+E172+E173+E174+F172+F173+F174. Revisar: Traslados No SAMU (Terrestre - Marítimo - Aéreo)."
    },
    {
      "id": "A08_SIMPLE_ERROR_071",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 72,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN M: TRASLADO SECUNDARIO",
      "descripcion": "Traslados Crítico y No Crítico (Terrestre - Marítimo - Aéreo) que cuenten con Ambulancia excepto SAMU",
      "expresionIzquierda": "E178+E179+E180+E181+E182+E183",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS EXCEPTO SAMU",
        "validarEn": [
          "TODOS EXCEPTO SAMU"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A08!E178+E179+E180+E181+E182+E183. Revisar: Traslados Crítico y No Crítico (Terrestre - Marítimo - Aéreo) que cuenten con Ambulancia excepto SAMU."
    },
    {
      "id": "A08_SIMPLE_ERROR_072",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 73,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN J: LLAMADOS DE URGENCIA A CENTRO REGULADOR, CENTRO DE DESPACHO O CENTRO COORDINADOR",
      "descripcion": "NO DEBE EXISTIR REGISTRO EN Centro Regulador, Centro de Despacho ó Centro Coordinador",
      "expresionIzquierda": "C161+D161",
      "operacion": {
        "operadorOriginal": "0",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La expresión izquierda debe ser igual a cero. Si contiene registros distintos de cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La condición esperada para A08!C161+D161 no se cumple. Revisar: NO DEBE EXISTIR REGISTRO EN Centro Regulador, Centro de Despacho ó Centro Coordinador.",
      "notaOperador": "El archivo trae OPERACIÓN = 0. Se interpretó como 'la expresión debe ser igual a cero / no debe existir registro'."
    },
    {
      "id": "A08_DOBLE_ERROR_073",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 74,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
      "descripcion": "Atención Médica Niño y Adulto Ambos Sexos debe existir consistencia con",
      "expresionIzquierda": "B12",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "AS12",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A08!B12 >= A08!AS12 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A08",
      "seccionDerecha": "SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
      "descripcionDerecha": "Demanda de Urgencia"
    },
    {
      "id": "A08_DOBLE_ERROR_074",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 75,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A08",
      "seccion": "SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
      "descripcion": "Atención Médica Gineco-Obstetra Ambos Sexos debe existir consistencia con",
      "expresionIzquierda": "B13",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "AS13",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A08!B13 >= A08!AS13 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A08",
      "seccionDerecha": "SECCIÓN A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
      "descripcionDerecha": "Demanda de Urgencia"
    },
    {
      "id": "A11_SIMPLE_ERROR_075",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 76,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A11",
      "seccion": "SECCIÓN A.1: EXAMEN VDRL POR GRUPO DE USUARIOS",
      "descripcion": "Esta sección solo le corresponde a HBSJO",
      "expresionIzquierda": "B13+B14+B15+B16+B17+B18+B19+B20+B21+B22+B23+B24+B25+B26+B27+B28+B29+B30+C13+C14+C15+C16+C17+C18+C19+C20+C21+C22+C23+C24+C25+C26+C27+C28+C29+C30",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HBSJO",
        "validarEn": [
          "HBSJO"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A11!B13+B14+B15+B16+B17+B18+B19+B20+B21+B22+B23+B24+B25+B26+B27+B28+B29+B30+C13+C14+C15+C16+C17+C18+C19+C20+C21+C22+C23+C24+C25+C26+C27+C28+C29+C30. Revisar: Esta sección solo le corresponde a HBSJO."
    },
    {
      "id": "A11_SIMPLE_ERROR_076",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 77,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A11",
      "seccion": "SECCIÓN B.1: EXÁMENES SEGÚN GRUPOS DE USUARIOS POR CONDICIÓN DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS",
      "descripcion": "Uso Exclusivo Laboratorio que Procesan, le corresponde solo a HBSJO",
      "expresionIzquierda": "C144+C145+C146+C147+C148+D144+D145+D146+D147+D148+E144+E145+E146+E147+E148+F144+F145+F146+F147+F148+G144+G145+G146+G147+G148+H144+H145+H146+H147+H148+I144+I145+I146+I147+I148+J144+J145+J146+J147+J148+K144+K145+K146+K147+K148+L144+L145+L146+L147+L148+M144+M145+M146+M147+M148+N144+N145+N146+N147+N148+O144+O145+O146+O147+O148+P144+P145+P146+P147+P148",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HBSJO",
        "validarEn": [
          "HBSJO"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A11!C144+C145+C146+C147+C148+D144+D145+D146+D147+D148+E144+E145+E146+E147+E148+F144+F145+F146+F147+F148+G144+G145+G146+G147+G148+H144+H145+H146+H147+H148+I144+I145+I146+I147+I148+J144+J145+J146+J147+J148+K144+K145+K146+K147+K148+L144+L145+L146+L147+L148+M144+M145+M146+M147+M148+N144+N145+N146+N147+N148+O144+O145+O146+O147+O148+P144+P145+P146+P147+P148. Revisar: Uso Exclusivo Laboratorio que Procesan, le corresponde solo a HBSJO."
    },
    {
      "id": "A11_SIMPLE_ERROR_077",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 78,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A11",
      "seccion": "SECCIÓN B.2: EXÁMENES SEGÚN GRUPOS DE USUARIOS POR CONDICIÓN DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS",
      "descripcion": "Uso Exclusivo Compra Servicio, le corresponde solo a HBSJO",
      "expresionIzquierda": "C152+C153+C154+C155+C156+D152+D153+D154+D155+D156+E152+E153+E154+E155+E156+F152+F153+F154+F155+F156+G152+G153+G154+G155+G156+H152+H153+H154+H155+H156+I152+I153+I154+I155+I156+J152+J153+J154+J155+J156+K152+K153+K154+K155+K156+L152+L153+L154+L155+L156+M152+M153+M154+M155+M156+N152+N153+N154+N155+N156+O152+O153+O154+O155+O156+P152+P153+P154+P155+P156",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HBSJO",
        "validarEn": [
          "HBSJO"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A11!C152+C153+C154+C155+C156+D152+D153+D154+D155+D156+E152+E153+E154+E155+E156+F152+F153+F154+F155+F156+G152+G153+G154+G155+G156+H152+H153+H154+H155+H156+I152+I153+I154+I155+I156+J152+J153+J154+J155+J156+K152+K153+K154+K155+K156+L152+L153+L154+L155+L156+M152+M153+M154+M155+M156+N152+N153+N154+N155+N156+O152+O153+O154+O155+O156+P152+P153+P154+P155+P156. Revisar: Uso Exclusivo Compra Servicio, le corresponde solo a HBSJO."
    },
    {
      "id": "A11_SIMPLE_ERROR_078",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 79,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A11",
      "seccion": "SECCIÓN C.1: EXÁMENES DE VIH POR GRUPOS DE USUARIOS",
      "descripcion": "Esta sección solo le corresponde a HBSJO",
      "expresionIzquierda": "C161+C162+C163+C164+C165+C166+C167+C168+C169+C170+C171+C172+C173+C174+C175+C176+C177+C178+C179+C180+C181+C182+C183+D161+D162+D163+D164+D165+D166+D167+D168+D169+D170+D171+D172+D173+D174+D175+D176+D177+D178+D179+D180+D181+D182+D183",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "HBSJO",
        "validarEn": [
          "HBSJO"
        ],
        "bloquearEnOtros": true
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A11!C161+C162+C163+C164+C165+C166+C167+C168+C169+C170+C171+C172+C173+C174+C175+C176+C177+C178+C179+C180+C181+C182+C183+D161+D162+D163+D164+D165+D166+D167+D168+D169+D170+D171+D172+D173+D174+D175+D176+D177+D178+D179+D180+D181+D182+D183. Revisar: Esta sección solo le corresponde a HBSJO."
    },
    {
      "id": "A19a_DOBLE_ERROR_079",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 80,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A19a",
      "seccion": "SECCIÓN B.1: ACTIVIDADES DE PROMOCIÓN SEGÚN ESTRATEGIAS Y CONDICIONANTES ABORDADAS Y NÚMERO DE PARTICIPANTES",
      "descripcion": "Si existen registros TOTAL ACTIVIDADES (Eventos masivos - Reuniones de planificación participativa - Jornadas y seminarios - Educación grupal )",
      "expresionIzquierda": "C129+C130+C131+C132+C133+C134+C135+C136+C137+C138+C139+C140+C141+C142+C143+C144+C145+C146+C147+C148",
      "operacion": {
        "operadorOriginal": "<=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "<=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda <= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "O129+O130+O131+O132+O133+O134+O135+O136+O137+O138+O139+O140+O141+O142+O143+O144+O145+O146+O147+O148",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A19a!C129+C130+C131+C132+C133+C134+C135+C136+C137+C138+C139+C140+C141+C142+C143+C144+C145+C146+C147+C148 <= A19a!O129+O130+O131+O132+O133+O134+O135+O136+O137+O138+O139+O140+O141+O142+O143+O144+O145+O146+O147+O148 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A19a",
      "seccionDerecha": "SECCIÓN B.1: ACTIVIDADES DE PROMOCIÓN SEGÚN ESTRATEGIAS Y CONDICIONANTES ABORDADAS Y NÚMERO DE PARTICIPANTES",
      "descripcionDerecha": "Total Participantes"
    },
    {
      "id": "A19b_DOBLE_REVISAR_080",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 81,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A19b",
      "seccion": "SECCIÓN A: ATENCIÓN OFICINAS DE INFORMACIONES",
      "descripcion": "Total de Reclamos",
      "expresionIzquierda": "B11",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "E11+F11+G11+H11+I11",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: La relación A19b!B11 >= A19b!E11+F11+G11+H11+I11 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A19b",
      "seccionDerecha": "SECCIÓN A: ATENCIÓN OFICINAS DE INFORMACIONES (SISTEMA INTEGRAL DE ATENCIÓN A USUARIOS)",
      "descripcionDerecha": "Respuestas a reclamos (dentro/fuera de plazos o pendientes)"
    },
    {
      "id": "A21_DOBLE_REVISAR_081",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 82,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A21",
      "seccion": "SECCIÓN C.1.1: PERSONAS ATENDIDAS EN EL PROGRAMA",
      "descripcion": "Ingresos Total",
      "expresionIzquierda": "C31",
      "operacion": {
        "operadorOriginal": "=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda = derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "C32",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: La relación A21!C31 = A21!C32 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A21",
      "seccionDerecha": "SECCIÓN C.1.1: PERSONAS ATENDIDAS EN EL PROGRAMA",
      "descripcionDerecha": "Total Personas Atendidas"
    },
    {
      "id": "A27_DOBLE_REVISAR_082",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 83,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A27",
      "seccion": "SECCIÓN A: PERSONAS QUE INGRESAN A EDUCACIÓN GRUPAL SEGÚN ÁREAS TEMÁTICAS Y EDAD",
      "descripcion": "Total Personas que ingresan Educación en grupo si existe registro debe",
      "expresionIzquierda": "D53",
      "operacion": {
        "operadorOriginal": ">0 y >",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": "CONDICION_COMPUESTA",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero y además es mayor que la expresión derecha, se genera el hallazgo. Confirmar esta lógica si el texto de la regla indica otra relación.",
        "condiciones": [
          {
            "lado": "izquierda",
            "operador": ">",
            "valor": "0"
          },
          {
            "lado": "izquierda",
            "operador": ">",
            "ladoDerecho": "derecha"
          }
        ]
      },
      "expresionDerecha": "D98",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A27!D53. Revisar: Total Personas que ingresan Educación en grupo si existe registro debe.",
      "hojaDerecha": "A27",
      "seccionDerecha": "SECCIÓN B: ACTIVIDADES DE EDUCACIÓN PARA LA SALUD SEGÚN PERSONAL QUE LAS REALIZA (SESIONES)",
      "descripcionDerecha": "Total de Educación en grupo",
      "requiereConfirmacionLogica": true,
      "notaConfirmacion": "Operador combinado interpretado como alerta si izquierda > 0 e izquierda > derecha. Confirmar con el texto de la regla antes de producción."
    },
    {
      "id": "A27_DOBLE_REVISAR_083",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 84,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A27",
      "seccion": "SECCIÓN A: PERSONAS QUE INGRESAN A EDUCACIÓN GRUPAL SEGÚN ÁREAS TEMÁTICAS Y EDAD",
      "descripcion": "Si existe información en Educación prenatal (Nutrición-lactancia-crianza-autocuidado-preparación parto y otros)",
      "expresionIzquierda": "D23",
      "operacion": {
        "operadorOriginal": ">0 y >",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": "CONDICION_COMPUESTA",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero y además es mayor que la expresión derecha, se genera el hallazgo. Confirmar esta lógica si el texto de la regla indica otra relación.",
        "condiciones": [
          {
            "lado": "izquierda",
            "operador": ">",
            "valor": "0"
          },
          {
            "lado": "izquierda",
            "operador": ">",
            "ladoDerecho": "derecha"
          }
        ]
      },
      "expresionDerecha": "Y23+Z23+AA23",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: Se cumple la condición de alerta definida para A27!D23. Revisar: Si existe información en Educación prenatal (Nutrición-lactancia-crianza-autocuidado-preparación parto y otros).",
      "hojaDerecha": "A27",
      "seccionDerecha": "SECCIÓN A: PERSONAS QUE INGRESAN A EDUCACIÓN GRUPAL SEGÚN ÁREAS TEMÁTICAS Y EDAD",
      "descripcionDerecha": "Gestantes (APS - Nivel Secundario - Nivel Terciario)",
      "requiereConfirmacionLogica": true,
      "notaConfirmacion": "Operador combinado interpretado como alerta si izquierda > 0 e izquierda > derecha. Confirmar con el texto de la regla antes de producción."
    },
    {
      "id": "A28_DOBLE_ERROR_084",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 85,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A28",
      "seccion": "SECCIÓN A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO",
      "descripcion": "Ingresos al programa en ambos sexos",
      "expresionIzquierda": "B13",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B61",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A28!B13 >= A28!B61 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A28",
      "seccionDerecha": "SECCIÓN A.3: EVALUACIÓN INICIAL",
      "descripcionDerecha": "Total Evaluaciones por (Médico/a - Kinesiólogo/a - Terpeuta Ocupacional - Fonoaudiólogo/a - Psicólogo/a)"
    },
    {
      "id": "A28_DOBLE_ERROR_085",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 86,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A28",
      "seccion": "SECCIÓN A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO",
      "descripcion": "Ingresos al programa en ambos sexos",
      "expresionIzquierda": "B13",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B14",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A28!B13 >= A28!B14 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A28",
      "seccionDerecha": "SECCIÓN A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO",
      "descripcionDerecha": "Ingresos con plan de tratamiento integral (PTI)"
    },
    {
      "id": "A28_DOBLE_ERROR_086",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 87,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A28",
      "seccion": "SECCIÓN A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO",
      "descripcion": "Ingresos al programa en ambos sexos",
      "expresionIzquierda": "B13",
      "operacion": {
        "operadorOriginal": ">=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": ">=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda >= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B15",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A28!B13 >= A28!B15 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A28",
      "seccionDerecha": "SECCIÓN A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACIÓN EN EL NIVEL PRIMARIO",
      "descripcionDerecha": "Ingresos con plan de tratamiento integral (PTI) con objetivos para el trabajo"
    },
    {
      "id": "A28_DOBLE_ERROR_087",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 88,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A28",
      "seccion": "SECCIÓN A.2: INGRESOS POR CONDICIÓN DE SALUD",
      "descripcion": "Total ingreso (N° de personas)",
      "expresionIzquierda": "B29",
      "operacion": {
        "operadorOriginal": "<=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "<=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda <= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B30+B31+B32+B33+B34+B35+B36+B37+B38+B39+B40+B41+B42+B43+B44+B45+B46+B47+B48+B49+B50+B51+B52",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A28!B29 <= A28!B30+B31+B32+B33+B34+B35+B36+B37+B38+B39+B40+B41+B42+B43+B44+B45+B46+B47+B48+B49+B50+B51+B52 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A28",
      "seccionDerecha": "SECCIÓN A.2: INGRESOS POR CONDICIÓN DE SALUD",
      "descripcionDerecha": "Desglose Total Ingreso (Dolor cervical agudo - Dolor lumbar agudo - Hombro doloroso agudo"
    },
    {
      "id": "A28_DOBLE_ERROR_088",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 89,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "DOBLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A28",
      "seccion": "SECCIÓN B.1: INGRESOS Y EGRESOS A REHABILITACIÓN INTEGRAL",
      "descripcion": "Total ingresos (Nº de personas)",
      "expresionIzquierda": "B149",
      "operacion": {
        "operadorOriginal": "<=",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "<=",
        "descripcionLogica": "La condición positiva debe cumplirse: izquierda <= derecha. Si no se cumple, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "B150+B151+B152+B153+B154+B155+B156+B157+B158+B159+B160+B161+B162+B163+B164+B165+B166+B167+B168+B169+B170+B171+B172+B173+B174+B175+B176+B177",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: La relación A28!B149 <= A28!B150+B151+B152+B153+B154+B155+B156+B157+B158+B159+B160+B161+B162+B163+B164+B165+B166+B167+B168+B169+B170+B171+B172+B173+B174+B175+B176+B177 no se cumple. Revisar consistencia entre secciones u hojas.",
      "hojaDerecha": "A28",
      "seccionDerecha": "SECCIÓN B.1: INGRESOS Y EGRESOS A REHABILITACIÓN INTEGRAL",
      "descripcionDerecha": "Desglose Ingresos por (Ingresos con plan de tratamiento integral (PTI)-Ataque cerebro vascular (ACV)-Traumatismo encéfalo craneano (TEC)-Lesión medular)"
    },
    {
      "id": "A28_SIMPLE_REVISAR_089",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 90,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "REVISAR",
      "activo": true,
      "hoja": "A28",
      "seccion": "SECCIÓN B.1: INGRESOS Y EGRESOS A REHABILITACIÓN INTEGRAL",
      "descripcion": "Se deben registrar solo en Tipo de atención Abierta",
      "expresionIzquierda": "AM150+AM151+AM152+AM153+AM154+AM155+AM156+AM157+AM158+AM159+AM160+AM161+AM162+AM163+AM164+AM165+AM166+AM167+AM168+AM169+AM170+AM171+AM172+AM173+AM174+AM175+AM176+AM177+AM178",
      "operacion": {
        "operadorOriginal": "0",
        "modo": "ERROR_SI_NO_CUMPLE",
        "operador": "=",
        "descripcionLogica": "La expresión izquierda debe ser igual a cero. Si contiene registros distintos de cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "REVISAR: La condición esperada para A28!AM150+AM151+AM152+AM153+AM154+AM155+AM156+AM157+AM158+AM159+AM160+AM161+AM162+AM163+AM164+AM165+AM166+AM167+AM168+AM169+AM170+AM171+AM172+AM173+AM174+AM175+AM176+AM177+AM178 no se cumple. Revisar: Se deben registrar solo en Tipo de atención Abierta.",
      "notaOperador": "El archivo trae OPERACIÓN = 0. Se interpretó como 'la expresión debe ser igual a cero / no debe existir registro'."
    },
    {
      "id": "A29_SIMPLE_ERROR_090",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 91,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A29",
      "seccion": "SECCIÓN A: PROGRAMA DE RESOLUTIVIDAD ATENCIÓN PRIMARIA DE SALUD",
      "descripcion": "Total interconsultas generadas en APS para resolución por especialidad oftalmología (UAPO y canasta integral)",
      "expresionIzquierda": "O12+P12",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A29!O12+P12. Revisar: Total interconsultas generadas en APS para resolución por especialidad oftalmología (UAPO y canasta integral)."
    },
    {
      "id": "A29_SIMPLE_ERROR_091",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 92,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A29",
      "seccion": "SECCIÓN A: PROGRAMA DE RESOLUTIVIDAD ATENCIÓN PRIMARIA DE SALUD",
      "descripcion": "Total interconsultas generadas en APS para resolución por especialidad otorrinolaringología (UAPORRINO y canasta integral) MAL INGRESADA",
      "expresionIzquierda": "M13+N13",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A29!M13+N13. Revisar: Total interconsultas generadas en APS para resolución por especialidad otorrinolaringología (UAPORRINO y canasta integral) MAL INGRESADA."
    },
    {
      "id": "A30AR_SIMPLE_ERROR_092",
      "origen": {
        "archivo": "Reestructuracion_Expandido.xlsx",
        "hojaOrigen": "Hoja1",
        "filaOrigen": 93,
        "idOriginal": null
      },
      "serie": "A",
      "tipo": "SIMPLE",
      "severidad": "ERROR",
      "activo": true,
      "hoja": "A30AR",
      "seccion": "SECCION A1: TELEINTERCONSULTA DE ESPECIALIDAD MEDICA POR HOSPITAL DIGITAL",
      "descripcion": "No debe existir registro en este REM",
      "expresionIzquierda": "B12+C12+D12+E12+F12+G12+H12+I12+J12+K12+L12+M12+N12+O12+P12+Q12",
      "operacion": {
        "operadorOriginal": ">0",
        "modo": "ALERTA_SI_CUMPLE",
        "operador": ">",
        "descripcionLogica": "Si la expresión izquierda es mayor que cero, se genera el hallazgo con la severidad indicada."
      },
      "expresionDerecha": "0",
      "aplica": {
        "alcance": "TODOS"
      },
      "mensaje": "ERROR: Se cumple la condición de alerta definida para A30AR!B12+C12+D12+E12+F12+G12+H12+I12+J12+K12+L12+M12+N12+O12+P12+Q12. Revisar: No debe existir registro en este REM."
    }
  ]
}