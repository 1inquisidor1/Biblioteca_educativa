# Auditoría Frontend — Biblioteca Educativa

**Fecha:** 23 de agosto, 2026
**Ruta auditada:** `/home/inquisidor/Proyectos/biblioteca-educativa/`
**Archivos revisados:** 5 HTML + 1 CSS

---

## 1. Resumen de Archivos

| Archivo | Líneas |
|---|---|
| `index.html` | 112 |
| `autores/index.html` | 229 |
| `blog/index.html` | 349 |
| `libros/index.html` | 227 |
| `temas/index.html` | 134 |
| `assets/css/main.css` | 351 |

**Estructura extra:** `assets/img/` y `assets/js/` están **vacíos** (sin uso). `data/` está vacío.

---

## 2. Cumplimiento de Paleta de Colores

### ✅ Correcto — Tokens definidos en `:root`

| Nombre | Valor | Comentario |
|---|---|---|
| `--color-primary` | `#22c55e` | Verde principal ✅ |
| `--color-primary-dark` | `#16a34a` | Verde oscuro ✅ |
| `--color-accent` | `#eab308` | Amarillo principal ✅ |
| `--color-accent-dark` | `#ca8a04` | Amarillo oscuro ✅ |
| `--color-bg` | `#ffffff` | Blanco principal ✅ |

Los tres colores requeridos (#22c55e, #eab308, #ffffff) están correctamente definidos como variables CSS y se aplican consistentemente a través del stylesheet.

### ⚠️ Inconsistencias — Colores hardcodeados

En lugar de usar las variables, se usan valores literales:

| Archivo | Línea | Código | Debería ser |
|---|---|---|---|
| `main.css` | 150 | `background: white;` | `background-color: var(--color-bg);` |
| `main.css` | 202 | `color: white;` | `color: var(--color-bg);` |
| `main.css` | 224 | `color: white;` | `color: var(--color-bg);` |
| `main.css` | 68 | `rgba(255,255,255,0.15)` | Usar `var(--color-bg)` con opacidad |
| `main.css` | 72 | `rgba(255,255,255,0.3)` | Usar `var(--color-bg)` con opacidad |
| `autores/index.html` | 139 | inline `rgba(255,255,255,0.3)` | Usar variable CSS |
| `blog/index.html` | 185 | inline `rgba(255,255,255,0.3)` | Usar variable CSS |
| `temas/index.html` | 16 | `#16a34a` (hardcodeado) | `var(--color-primary-dark);` |

> **Nota:** Aunque los valores literales producen los colores correctos, rompen la consistencia del sistema de tokens. Si el blanco o el verde base cambian, estos valores no se actualizan automáticamente.

---

## 3. Errores de Sintaxis HTML (html-validate)

### A. Sintaxis de etiquetas vacías (31 errores)

Etiquetas `<input/>` e `<img/>` usan la sintaxis **self-closing XHTML** en lugar de la sintaxis **HTML5**. En HTML5, las etiquetas vacías no llevan `/`:

| Archivo | Línea | Corrección |
|---|---|---|
| `index.html` | 32 | `<input .../>` → `<input ...>` |
| `libros/index.html` | 112 | `<input .../>` → `<input ...>` |
| `libros/index.html` | 135 | `<img .../>` → `<img ...>` |
| `libros/index.html` | 150 | `<img .../>` → `<img ...>` |
| `libros/index.html` | 165 | `<img .../>` → `<img ...>` |
| `libros/index.html` | 180 | `<img .../>` → `<img ...>` |
| `temas/index.html` | 72 | `<input .../>` → `<input ...>` |

### B. Botones sin atributo `type` (9 errores)

Los botones `<button>` sin `type="button"` defaults a `type="submit"`, lo que puede causar envíos de formulario inesperados:

| Archivo | Líneas |
|---|---|
| `index.html` | 33 |
| `libros/index.html` | 113, 120–126 |
| `temas/index.html` | 73 |

**Corrección:** Agregar `type="button"` a todos los `<button>`.

### C. Estilos inline (16 errores)

| Archivo | Líneas |
|---|---|
| `index.html` | 70, 73, 81, 89 |
| `autores/index.html` | 139, 153 |
| `blog/index.html` | 185, 207, 230, 253, 276, 298, 320 |
| `libros/index.html` | 118 |

Se recomienda mover estilos inline a clases CSS.

---

## 4. Errores y Inconsistencias de CSS (csslint + análisis manual)

### A. Selectores duplicados en `main.css`

`main.css` contiene **7 selectores definidos dos veces**, algunos con propiedades conflictivas:

| Selector | Línea 1 | Línea 2 | Conflicto |
|---|---|---|---|
| `header h1` | 47 | 285 | Idéntico (redundante) |
| `.hero h2` | 84 | 294 | Idéntico (redundante) |
| `.book-card:hover` | 158 | 347 | Idéntico (redundante) |
| `.book-info` | 171 | 324 | Mismo `padding` (redundante) |
| `.book-info h4` | 175 | 328 | **`font-size`: 1rem → 1.1rem** ⚠️ |
| `.book-info .author` | 181 | 334 | **`font-size`: 0.85rem → 0.9rem** ⚠️ |
| `.book-info .badge` | 187 | 340 | **Segunda omite `background`, `padding`, `border-radius`** ⚠️ |

> La sección "Libros-specific enhancements" (líneas 310–351) redefine selectores globales sin necesidad, causando conflictos de especificidad y cascada.

### B. Convención de nombres BEM (blog)

```css
.post-card.__green   { ... }   /* ❌ Doble guion bajo */
.post-card.__yellow  { ... }   /* ❌ Should be: post-card--green */
```

La convención BEM usa doble guion (`--`) para modificadores, no doble guion bajo (`__`).

### C. Comentario engañoso

```css
/* Highlight yellow on green */   /* main.css:303 */
.highlight {
    background-color: var(--color-accent);  /* amarillo */
    /* No se define color de texto — hereda del padre */
}
```

El comentario dice "yellow on green" pero no se establece un color de texto verde.

---

## 5. Enlaces Rotos (12 páginas faltantes)

### autores/index.html — 6 enlaces a páginas inexistentes

| Enlace | Archivo faltante |
|---|---|
| `dr-turing.html` | ✗ No existe |
| `stephen-hawking.html` | ✗ No existe |
| `euclides.html` | ✗ No existe |
| `maria-caldas.html` | ✗ No existe |
| `laura-rey.html` | ✗ No existe |
| `gustavo-mendoza.html` | ✗ No existe |

### blog/index.html — 6 enlaces a páginas inexistentes

| Enlace | Archivo faltante |
|---|---|
| `como-aprender-programacion.html` | ✗ No existe |
| `metodos-de-estudio.html` | ✗ No existe |
| `fisica-cuantica-para-principiantes.html` | ✗ No existe |
| `herramientas-gratuitas-pdfs.html` | ✗ No existe |
| `aprender-matematicas-con-juegos.html` | ✗ No existe |
| `lecturas-esenciales-historia.html` | ✗ No existe |

---

## 6. Errores de Lógica JavaScript

### libros/index.html — Bug en `filterBooks()`

```javascript
function filterBooks(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Mark the clicked button active (handle 'all' specially vs specific)
    if (category === 'all') {
        document.querySelector('.filter-btn.all').classList.add('active');
    }
    // ❌ BUG: Cuando category es específica (ej. 'ciencias'),
    //    el botón clickeado NUNCA recibe la clase 'active'
```

**El comentario dice "Mark the clicked button active" pero el código solo lo hace para `'all'`.**
Cuando se hace clic en un filtro específico (Ciencias, Tecnología, etc.), el botón activo visualmente no se actualiza.

**Corrección sugerida:**
```javascript
if (category === 'all') {
    document.querySelector('.filter-btn.all').classList.add('active');
} else {
    // Use event target or pass the button reference
    event.currentTarget.classList.add('active');
}
```

---

## 7. Otros Hallazgos

| Issue | Archivo | Línea | Comentario |
|---|---|---|---|
| Favicon data URI sin codificar | Todos los HTML | Línea 8 | El SVG en `data:` no está URL-encoded. Funciona en navegadores modernos pero es técnicamente no conforme. |
| Código muerto en hero | `blog/index.html` | 192 | `<div class="ribbon" hidden></div>` — la cinta del hero está oculta y es innecesaria. Sirve solo para `.post-card.featured`. |
| Carpetas vacías | `assets/img/`, `assets/js/` | — | Directorios declarados pero sin archivos. |

---

## 8. Notas sobre validadores

- **csslint** reportó 124 problemas, pero la mayoría son **falsos positos** por su falta de soporte para CSS moderno (variables `var()`, `gap`, `repeat()`, `minmax()`, `position: sticky`). Los errores reales son los selectores duplicados y el exceso de declaraciones `font-size`.
- **html-validate** reportó 31 errores reales y significativos, principalmente sobre sintaxis XHTML en HTML5 y botones sin `type`.

---

## 9. Prioridad de Corrección

| Prioridad | Issue |
|---|---|
| 🔴 **Alta** | Botones sin `type="button"` (pueden causar envíos de formulario) |
| 🔴 **Alta** | Enlaces rotos (12 páginas faltantes) |
| 🔴 **Alta** | Bug JS en `filterBooks()` (clase `active` no se aplica a filtros específicos) |
| 🟡 **Media** | Selectores duplicados con conflictos de `font-size` |
| 🟡 **Media** | Sintaxis self-closing `<input/>`, `<img/>` |
| 🟡 **Media** | Colores hardcodeados en lugar de variables (`white`, `rgba(255,255,255,...)`, `#16a34a`) |
| 🟢 **Baja** | Estilos inline (16 ocurrencias) |
| 🟢 **Baja** | Convención BEM `__green`/`__yellow` |
| 🟢 **Baja** | Carpetas de assets vacías |
| 🟢 **Baja** | Favicon data URI no codificado |
