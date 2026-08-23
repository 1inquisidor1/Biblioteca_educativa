# Auditoría UX — Biblioteca Educativa

**Fecha:** 23 de agosto de 2026  
**Auditor:** Subagente Hermes (modo no disruptivo)  
**Métodos:** Análisis de código estático, inspección DOM con Chromium headless, verificación de códigos de estado HTTP, capturas de pantalla responsive (1200×800 desktop / 375×667 mobile).

---

## Resumen Ejecutivo

Se verificó navegación, diseño responsive y funcionalidad de búsqueda. **12 enlaces internos están rotos** (6 páginas de autor + 6 páginas de blog). **La búsqueda no funciona** — el parámetro `?search=` se escribe en la URL pero ninguna página lo lee ni filtra contenido. **Los filtros de categoría en `/libros/` no muestran el estado activo** al hacer clic. **Varios elementos aparentan ser interactivos pero no lo son** (tarjetas de categoría, libros destacados, temas).

| Prioridad | Ítems |
|-----------|-------|
| 🔴 Críticos | 3 |
| 🟠 Altos | 4 |
| 🟡 Medianos | 3 |
| 🟢 Bajos | 4 |

---

## 1. Navegación (enlaces rotos y consistencia)

### 🔴 CRÍTICO — 12 enlaces internos rotos (404)

| Página origen | Enlace roto | Destino esperado |
|---|---|---|
| `autores/index.html` | `dr-turing.html` |Detalle del autor — **archivo inexistente** |
| `autores/index.html` | `stephen-hawking.html` | Detalle del autor — **archivo inexistente** |
| `autores/index.html` | `euclides.html` | Detalle del autor — **archivo inexistente** |
| `autores/index.html` | `maria-caldas.html` | Detalle del autor — **archivo inexistente** |
| `autores/index.html` | `laura-rey.html` | Detalle del autor — **archivo inexistente** |
| `autores/index.html` | `gustavo-mendoza.html` | Detalle del autor — **archivo inexistente** |
| `blog/index.html` | `como-aprender-programacion.html` | Post de blog — **archivo inexistente** |
| `blog/index.html` | `metodos-de-estudio.html` | Post de blog — **archivo inexistente** |
| `blog/index.html` | `fisica-cuantica-para-principiantes.html` | Post de blog — **archivo inexistente** |
| `blog/index.html` | `herramientas-gratuitas-pdfs.html` | Post de blog — **archivo inexistente** |
| `blog/index.html` | `aprender-matematicas-con-juegos.html` | Post de blog — **archivo inexistente** |
| `blog/index.html` | `lecturas-esenciales-historia.html` | Post de blog — **archivo inexistente** |

**Verificado:** Todas devuelven HTTP 404. Los 5 enlaces de navegación principales, 4 PDFs y 4 miniaturas funcionan correctamente (HTTP 200).

### 🟠 ALTO — Indicador de página actual inconsistente

| Página | Indicador visual en nav |
|---|---|
| `index.html` | ❌ Ninguno |
| `libros/index.html` | ❌ Ninguno |
| `temas/index.html` | ❌ Ninguno |
| `autores/index.html` | ✅ Inline `style="background-color: rgba(255,255,255,0.3);"` |
| `blog/index.html` | ✅ Inline `style="background-color: rgba(255,255,255,0.3);"` |

Solo 2 de 5 páginas marcan visualmente cuál es la sección actual. Esto dificulta la orientación del usuario.

### 🟠 ALTO — El nav se duplica literalmente en cada página

El `<header>` con los 5 enlaces de navegación se escribe a mano en cada archivo HTML (5 copias idénticas con rutas relativas distintas). Cambiar un enlace requiere editar 5 archivos.

### 🟠 ALTO — Tarjetas de categoría en inicio no son clicables

En `index.html`, las 6 tarjetas `.topic-card` (Ciencias, Tecnología, Matemáticas, Historia, Arte, Literatura) **no contienen ningún `<a>`**. El usuario hace clic esperando filtrar o navegar pero nada ocurre. *Verificado:* 6 `div.topic-card`, **0 enlaces internos**.

### 🟠 ALTO — Tarjetas "Libros Destacados" en inicio no son clicables

En `index.html`, las 3 tarjetas `.book-card` del apartado "Libros Destacados" (Introducción a la IA, Física Cuántica, Álgebra Avanzada) **no tienen enlaces**. Además, son tarjetas de *placeholder* con emojis (📘, 📗, 📕) y autores ficticios (Dr. Alan Turing, Prof. Stephen Hawking, Prof. Euclid). *Verificado:* 0 enlaces dentro de `.book-card` en la página de inicio.

Contraposición con `/libros/` donde las tarjetas reales sí tienen enlaces a PDFs. La inconsistencia genera confusión.

### 🟠 ALTO — Tarjetas de temas no son clicables

En `temas/index.html`, las 6 tarjetas `.topic-card` **no tienen enlaces ni mecanismo de filtrado**. El usuario ve categorías con contadores ("65 recursos", "42 recursos", etc.) pero no puede hacer clic para ver esos recursos.

---

## 2. Funcionalidad de búsqueda

### 🔴 CRÍTICO — La búsqueda no funciona (parámetro URL ignorado)

El siguiente flujo es **completamente no funcional**:

1. En `index.html`, la barra de búsqueda ejecuta `search()` → redirige a `libros/?search=termino`
2. En `libros/index.html`, la barra de búsqueda ejecuta `search()` → redirige a `?search=termino`
3. En `temas/index.html`, la barra de búsqueda ejecuta `search()` → redirige a `../libros/?search=termino`

**Ninguna de estas páginas lee el parámetro `search`** mediante `URLSearchParms` o `window.location.search`. El único código JS relacionado con filtrado es `filterBooks(category)` que filtra por `data-category` (categoría), no por texto.

*Verificado con DOM dump:* cargando `libros/?search=matematica` se muestran **las 5 tarjetas de libros** (ninguna filtrada). Sin el parámetro de búsqueda también se muestran 5. El parámetro es ignorado.

### 🔴 CRÍTICO — Bug: el filtro de categoría no marca el botón activo

En `libros/index.html`, la función `filterBooks(category)`:

```javascript
function filterBooks(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (category === 'all') {
        document.querySelector('.filter-btn.all').classList.add('active');
    }
    // ↑ NO hay else para añadir 'active' al botón clickeado
    ...
}
```

Al hacer clic en "Ciencias", "Tecnología", etc., **se elimina la clase `active` de todos los botones pero nunca se añade al botón clickeado**. El usuario no recibe feedback visual de qué filtro está aplicado. El código solo reagrega `active` al botón "Todos".

### 🟡 MEDIO — Búsqueda vacía no da feedback

Si el usuario hace clic en "Buscar" con el campo vacío, la función `search()` simplemente no hace nada (la condición `if (term)` falla). No hay mensaje de error ni feedback. La interfaz no responde.

### 🟡 MEDIO — Directorio `/data/` vacío

El directorio `data/` existe dentro del proyecto pero está completamente vacío (0 archivos). Sugiere que se planeó implementar datos externos (posiblemente para el motor de búsqueda) pero nunca se completó.

---

## 3. Diseño responsive

### 🟡 MEDIO — Navegación móvil consume espacio vertical excesivo

En mobile (< 768px), el nav pasa de horizontal a `flex-direction: column` con 5 botones. Cada botón tiene `padding: 0.5rem 1rem` + `border-radius: 12px`, ocupando ~60-70 px de alto. Los 5 botones apilados consumen más del 50 % de una pantalla de 667 px. El hero y el contenido principal quedan empujados mucho más allá del *fold*.

Un hamburguesa o nav compacto colapsable sería más apropiado para móvil.

### 🟡 MEDIO — Ruptura de tabla de responsividad en `/libros/`

El CSS base define:
```css
.book-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
```

Pero `/libros/index.html` lo sobrescribe con:
```css
.book-grid { grid-template-columns: 1fr; }          /* móvil: 1 col. */
@media (min-width: 768px) {
    .book-grid { grid-template-columns: repeat(3, 1fr); }  /* desktop: 3 cols. */
}
```

Esto elimina el comportamiento `auto-fill`, de modo que en tablets (ej. 500-767 px) la cuadrícula muestra **1 columna** en lugar de aprovechar el espacio disponible (2 columnas cabrían cómodamente).

### 🟡 MEDIO — Inconsistencia de estilos responsive entre páginas

- CSS base (`main.css`): maneja mobile con `@media (max-width: 768px)`
- `autores/index.html`: duplica su propio `@media (max-width: 768px)` con `flex-direction: column` (redundante)
- `blog/index.html`: duplica su propio `@media (max-width: 768px)` para hero y post-grid
- `index.html`: no tiene styles page-specific para mobile más allá del CSS base

No hay consistencia en cómo se aplican los breakpoint — cada página reescribe reglas parcialmente.

### 🟢 BAJO — No hay meta viewport en ninguna página

*(Corrección: todas las páginas incluyen `<meta name="viewport" content="width=device-width, initial-scale=1.0">`. El viewport está bien configurado.)*

---

## 4. Calidad de código y otros hallazgos

### 🟢 BAJO — Colisión de clase `.read-more` en blog

En `blog/index.html`, la clase `.read-more` se aplica tanto a un `<span>` (tiempo de lectura: "5 min de lectura") como a un `<a class="btn btn-accent read-more">` (botón "Leer más"). La regla CSS `.read-more { font-size: 0.85rem; }` afecta a ambos elementos, lo que podría causar estilos inesperados.

### 🟢 BAJO — Exceso de estilos inline

Estilos inline esparcidos en múltiples páginas:
- `index.html`: `style="text-align:center; ..."` en `<h3>`, `style="background: var(--color-bg-light); ..."` en placeholders de libros
- `autores/index.html`: `style="background-color: rgba(255,255,255,0.3);"` en nav activo
- `blog/index.html`: `style="background: var(--color-bg-light); ..."` en badges

Estos estilos bypass el CSS cacheable y complican el mantenimiento.

### 🟢 BAJO — Cinta "featured" redundante en hero del blog

`blog/index.html` línea 192: `<div class="ribbon" hidden></div>` dentro de `.blog-hero`. Luego un script la oculta nuevamente:
```javascript
const heroRibbon = document.querySelector('.blog-hero .ribbon');
if (heroRibbon) heroRibbon.hidden = true;
```
Doble redundancia. La cinta solo se usa visualmente dentro de `.post-card.featured`.

### 🟢 BAJO — Alt text genérico en miniaturas

Las miniaturas de libros usan textos alt genéricos como `"Miniatura Ciencias Naturales"`. Sería mejor incluir el título del libro, p. ej. `"Miniatura Ciencias Naturales 8.º Grado"`.

---

## 5. Tabla de verificación

| Ítem verificado | Estado | Evidencia |
|---|---|---|
| Homepage (200) | ✅ | HTTP 200, text/html |
| Libros (200) | ✅ | HTTP 200, text/html |
| Temas (200) | ✅ | HTTP 200, text/html |
| Autores (200) | ✅ | HTTP 200, text/html |
| Blog (200) | ✅ | HTTP 200, text/html |
| main.css (200) | ✅ | HTTP 200, text/css |
| 4 PDFs (200) | ✅ | HTTP 200, application/pdf |
| 4 Thumbnails (200) | ✅ | HTTP 200, image/png |
| 6 enlaces autor (404) | ❌ | HTTP 404 en todas |
| 6 enlaces blog (404) | ❌ | HTTP 404 en todas |
| Búsqueda lee ?search= | ❌ | DOM dump confirma 5 libros sin filtrar con `?search=matematica` |
| Nav móvil vertical | ✅ | CSS `@media (max-width: 768px)` |
| Viewport meta | ✅ | Presente en todas las páginas |
| Hero en mobile > fold | ⚠️ | Nav vertical ocupa >50 % de pantalla móvil |
| Filtro activo en /libros/ | ⚠️ | Bug JS: no añade `active` a botón clickeado |

---

## Recomendaciones (priorizadas)

1. **Crear las páginas faltantes** — 6 detalles de autor y 6 posts de blog (o remover los enlaces rotos).
2. **Implementar la búsqueda** — Añadir JS que lea `?search=` mediante `URLSearchParams` y filtre tarjetas por texto (título, autor, categoría).
3. **Hacer clicables las tarjetas de categoría y temas** — Al menos enlazar a `/libros/` con filtro por categoría.
4. **Hacer clicables o remover las tarjetas "Libros Destacados" del inicio** — Si los libros no existen, no mostrarlos como si fueran reales.
5. **Unificar el indicator de página actual** — Usar una clase CSS `.active` en nav consistente en todas las páginas.
6. **Corregir el bug del filtro activo** — Añadir `else { event.target.classList.add('active'); }` o pasar el botón clickeado.
7. **Reemplazar el nav duplicado** por un include server-side o componente compartido.
8. **Añadir un menú hamburguesa para mobile** para reducir el consumo de espacio vertical.
9. **Corregir el `.read-more` collision** renombrando una de las clases.
