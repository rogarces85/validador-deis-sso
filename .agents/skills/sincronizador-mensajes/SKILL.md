---
name: Sincronizador de Mensajes Global
description: Skill heredada para sincronizar mensajes hacia archivos derivados. Revisar antes de usar.
---

# Sincronizador de Mensajes Global

Esta habilidad corresponde a una arquitectura anterior con archivos derivados por establecimiento. Actualmente, el mensaje canonico vive en `data/reglas_finales.json`.

## Estado actual
- El archivo `data/reglas_finales.json` debe contener el mensaje definitivo.
- No usar esta skill salvo que existan archivos derivados recreados por solicitud explicita.

## Instrucciones

### 1. Lectura de Origen
- Carga las reglas desde `data/reglas_finales.json`.
- Crea un mapa indexado por el `ID` de la regla para una búsqueda rápida.

### 2. Actualizacion de destinos
- Si no existen archivos derivados autorizados por el usuario, detente.
- Si existen, sincroniza sus mensajes desde `data/reglas_finales.json` sin alterar la regla fuente.

### 3. Persistencia
- Guarda los cambios en los archivos de destino manteniendo el formato JSON legible (indentación de 4 espacios).

## Convenciones
- `data/reglas_finales.json` siempre prevalece sobre cualquier copia derivada.
- No debe modificarse la logica de la regla al sincronizar mensajes.
