---
name: Sincronizador de Mensajes Global
description: Sincroniza los mensajes de validación desde Rules_nuevas.json hacia los archivos específicos de establecimientos (base, hospital, posta, samu).
---

# Sincronizador de Mensajes Global

Esta habilidad asegura que las mejoras en la redacción de los mensajes (mensajes humanos e inversos) realizadas en `data/Rules_nuevas.json` se repliquen en todos los archivos de reglas por establecimiento.

## Prerrequisitos
- El archivo `data/Rules_nuevas.json` debe estar actualizado con los nuevos mensajes.
- Deben existir los archivos en `data/rules/`: `base.json`, `hospital.json`, `posta.json`, `samu.json`.

## Instrucciones

### 1. Lectura de Origen
- Carga el objeto `validaciones` de `data/Rules_nuevas.json`.
- Crea un mapa indexado por el `ID` de la regla para una búsqueda rápida.

### 2. Actualización de Destinos
- Recorre cada uno de los archivos en `data/rules/`.
- Para cada regla en el archivo de destino, busca si existe una regla con el mismo `ID` en el origen.
- Si existe, actualiza el campo `mensaje` con el valor del origen.
- Elimina el campo `mensaje_original` de los archivos de destino si está presente, para mantener la consistencia.

### 3. Persistencia
- Guarda los cambios en los archivos de destino manteniendo el formato JSON legible (indentación de 4 espacios).

## Convenciones
- El script debe ejecutarse mediante Node.js: `node .agents/skills/sincronizador-mensajes/scripts/sync_messages.cjs`.
- No debe modificar la lógica (expresiones, operadores) de los archivos de destino, solo el contenido del mensaje.
