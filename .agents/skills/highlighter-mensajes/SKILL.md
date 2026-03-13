---
name: Resaltador de Mensajes REM
description: Identifica las partes de un mensaje separadas por "|" y define su estilo visual (Hojas REM, Secciones y Descripciones).
---

# Resaltador de Mensajes REM

Esta habilidad define cómo se deben renderizar visualmente los mensajes de validación para mejorar la legibilidad y la jerarquía visual en la interfaz de usuario.

## Estructura del Mensaje
La habilidad debe soportar **dos formatos**:

1. **Formato pipeado (preferido)**
`[Hoja REM] | [Sección (opcional)] | [Descripción] | [Hoja/Sección destino (opcional)]`

2. **Formato narrativo (fallback)**
`En REM A01, SECCIÓN B: ..., la celda X debe ser ...`

> No asumir posiciones fijas (ej: "la sección siempre es la parte 2").

## Reglas de Resaltado

| Parte | Criterio | Estilo Visual |
|---|---|---|
| **Hoja REM** | Primera parte (ej: `REM A01`) | **Negrita** |
| **Sección** | Partes que contienen `SECCIÓN/SECCION` o coinciden por regex de sección | **Negrita + Color Verde Esmeralda** (#50C878 / HSL 140, 52%, 55%) |
| **Descripción/Otros** | Resto de las partes | Letra Normal |

## Estrategia Inteligente de Detección

1. **Normalizar texto antes de analizar**
   - Trim por parte.
   - Colapsar espacios múltiples.
   - Comparación case-insensitive.
   - Aceptar variantes con y sin tilde (`SECCIÓN` / `SECCION`).

2. **Detectar Hoja REM por patrón, no por índice**
   - Regex sugerida: `\bREM\s+[A-Z0-9]+\b`

3. **Detectar Sección por patrón robusto**
   - Regex sugerida: `\bSECCI[ÓO]N(?:\s+[A-Z0-9.]+)?\s*:[^|,]+|\bSECCI[ÓO]N\s+[A-Z0-9.]+`
   - Esto permite reconocer:
     - `SECCIÓN A: ...`
     - `SECCION E: ...`
     - `SECCIÓN B.3: ...`

4. **Fallback sin pipes**
   - Si no hay `|`, tokenizar el texto completo con regex (`REM` y `SECCIÓN`) y aplicar estilos solo a esos fragmentos.

5. **Compatibilidad**
   - Si no hay matches, renderizar mensaje completo sin estilos especiales.

## Implementación de Referencia (React/JavaScript)

```javascript
function highlightMessage(mensaje) {
  const remRegex = /\bREM\s+[A-Z0-9]+\b/i;
  const sectionRegex = /\bSECCI[ÓO]N(?:\s+[A-Z0-9.]+)?\s*:[^|,]+|\bSECCI[ÓO]N\s+[A-Z0-9.]+/i;
  const inlineTokenRegex = /\bREM\s+[A-Z0-9]+\b|\bSECCI[ÓO]N(?:\s+[A-Z0-9.]+)?\s*:[^|,]+|\bSECCI[ÓO]N\s+[A-Z0-9.]+/gi;

  const classify = (part) => {
    if (sectionRegex.test(part)) return 'section';
    if (remRegex.test(part)) return 'rem';
    return 'text';
  };

  if (mensaje.includes('|')) {
    const parts = mensaje.split('|').map(p => p.trim()).filter(Boolean);
    return parts
      .map((part) => {
        const type = classify(part);
        if (type === 'rem') return `<strong class="rem-sheet">${part}</strong>`;
        if (type === 'section') return `<strong class="rem-section">${part}</strong>`;
        return `<span class="rem-text">${part}</span>`;
      })
      .join(' <span class="separator">|</span> ');
  }

  // Fallback para mensajes narrativos sin pipes
  let lastIndex = 0;
  const out = [];
  for (const match of mensaje.matchAll(inlineTokenRegex)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) out.push(`<span class="rem-text">${mensaje.slice(lastIndex, idx)}</span>`);
    const token = match[0];
    const type = classify(token);
    out.push(type === 'rem'
      ? `<strong class="rem-sheet">${token}</strong>`
      : `<strong class="rem-section">${token}</strong>`);
    lastIndex = idx + token.length;
  }
  if (lastIndex < mensaje.length) out.push(`<span class="rem-text">${mensaje.slice(lastIndex)}</span>`);
  return out.join('');
}
```

## CSS Recomendado
```css
.rem-sheet {
  font-weight: 700;
  color: var(--text-primary);
}

.rem-section {
  font-weight: 700;
  color: #50C878; /* Verde Esmeralda */
}

.rem-text {
  font-weight: 400;
  color: var(--text-secondary);
}

.separator {
  color: #ccc;
  margin: 0 4px;
}
```

## Convenciones
- El separador oficial es ` | ` (espacio, pipe, espacio).
- Debe funcionar también sin pipes (compatibilidad con mensajes narrativos).
- Prioridad visual: `SECCIÓN` > `REM` > texto normal.
