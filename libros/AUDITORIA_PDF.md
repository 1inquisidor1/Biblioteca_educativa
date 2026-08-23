# Auditoría de PDFs — Biblioteca Educativa

**Fecha:** 2026-08-23  
**Ruta auditada:** `/home/inquisidor/Proyectos/biblioteca-educativa/libros/`  
**Herramientas:** `pdfinfo` (poppler 26.07.0), `pdftotext`, `pdftoppm`, `identify` (ImageMagick), `compare`

---

## Tabla Resumen (4 PDFs)

| # | Archivo (PDF) | Magic Bytes | Páginas | Page 1 Texto (título) | 3 Keywords | Miniatura (PNG) | PNG OK | Thumb=Page 1 | Estado |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `ciencias-naturales-8.pdf` | ✅ `%PDF-1.6` | 224 — normal | "CIENCIAS NATURALES" | moléculas, organismos, materia | `ciencias-naturales-8_thumb-001.png` (1314×1680) | ✅ `\x89PNG` | ✅ RMSE 0.033 | ✅ OK |
| 2 | `estudios-sociales-8.pdf` | ✅ `%PDF-1.7` | 256 — normal | Garbled* (syntax error) | historia, humanos, modernos | `estudios-sociales-8_thumb-001.png` (1275×1650) | ✅ `\x89PNG` | ✅ RMSE 0.041 | ⚠️ OK con error estructural |
| 3 | `lengua-literatura-8.pdf` | ✅ `%PDF-1.7` | 251 — normal | "Ministerio de Educación" (cover) | escritura, debate, reportaje | `lengua-literatura-8_thumb-001.png` (1241×1755) | ✅ `\x89PNG` | ✅ RMSE 0.034 | ✅ OK |
| 4 | `matematica-8.pdf` | ✅ `%PDF-1.7` | 255 — normal | "Educación General Básica" (cover) | números, enteros, número | `matematica-8_thumb-001.png` (1241×1755) | ✅ `\x89PNG` | ✅ RMSE 0.034 | ✅ OK |

\* `estudios-sociales-8.pdf` page 1 text extraction produced garbled output due to a structural error (see Issues).

---

## Verificaciones Detalladas

### 1. Magic Bytes (header)

| Archivo | Hex (primeros 8 bytes) | Decodificado | ✅ Válido |
|---|---|---|---|
| ciencias-naturales-8.pdf | `25 50 44 46 2d 31 2e 36` | `%PDF-1.6` | ✅ |
| estudios-sociales-8.pdf | `25 50 44 46 2d 31 2e 37` | `%PDF-1.7` | ✅ |
| lengua-literatura-8.pdf | `25 50 44 46 2d 31 2e 37` | `%PDF-1.7` | ✅ |
| matematica-8.pdf | `25 50 44 46 2d 31 2e 37` | `%PDF-1.7` | ✅ |

| Miniatura | Hex (primeros 8 bytes) | ✅ Válido |
|---|---|---|
| ciencias-naturales-8_thumb-001.png | `89 50 4e 47 0d 0a 1a 0a` | ✅ |
| estudios-sociales-8_thumb-001.png | `89 50 4e 47 0d 0a 1a 0a` | ✅ |
| lengua-literatura-8_thumb-001.png | `89 50 4e 47 0d 0a 1a 0a` | ✅ |
| matematica-8_thumb-001.png | `89 50 4e 47 0d 0a 1a 0a` | ✅ |

### 2. Page Count (pdfinfo)

| Archivo | Páginas | Tamaño | Observaciones |
|---|---|---|---|
| ciencias-naturales-8.pdf | 224 | 806.2×630.5 pts | ✅ Normal |
| estudios-sociales-8.pdf | 256 | 792×612 pts (Letter) | ✅ Normal |
| lengua-literatura-8.pdf | 251 | 842×595 pts (A4) | ✅ Normal |
| matematica-8.pdf | 255 | 842×595 pts (A4) | ✅ Normal |

Ningún PDF tiene page count inusualmente bajo o alto. Todos están en el rango esperado para libros de texto de 8.º grado (~200-260 páginas).

### 3. Title Matching (filename vs content)

| Archivo | Nombre archivo | Texto página 1 | Match |
|---|---|---|---|
| ciencias-naturales-8.pdf | "Ciencias Naturales" | "CIENCIAS NATURALES" | ✅ Coincide |
| estudios-sociales-8.pdf | "Estudios Sociales" | Garbled* → "Estudios Sociales" (8× en cuerpo) | ✅ Coincide (ver nota) |
| lengua-literatura-8.pdf | "Lengua y Literatura" | "Ministerio de Educación" (portada) → "Lengua y Cultura" | ✅ Coincide |
| matematica-8.pdf | "Matemática" | "Educación General Básica" (portada) → "Matemática" (63× en cuerpo) | ✅ Coincide |

Los títulos no aparecen textualmente en la portada de los PDFs 3 y 4 (solo el encabezado del Ministerio de Educación). El nombre del archivo refleja el tema principal del libro, confirmado en el cuerpo del texto. No hay mismatch de título.

### 4. Keywords (3 por PDF — de texto página 10-30)

| Archivo | Keyword 1 | Keyword 2 | Keyword 3 | Confirmación de materia |
|---|---|---|---|---|
| ciencias-naturales-8.pdf | moléculas | organismos | materia | ✅ Ciencias naturales |
| estudios-sociales-8.pdf | historia | humanos | modernos | ✅ Estudios sociales |
| lengua-literatura-8.pdf | escritura | debate | reportaje | ✅ Lengua y literatura |
| matematica-8.pdf | números | enteros | número | ✅ Matemática |

### 5. Thumbnail Alignment (PNG vs PDF Page 1)

Método: Renderizado de página 1 con `pdftoppm` (70 dpi) → redimensionado a dimensiones exactas de la miniatura → comparación pixel-por-píxel con `compare -metric RMSE`.

| Archivo | Thumb (W×H) | Render p1 (W×H) | RMSE p1 vs thumb | RMSE p2 vs thumb | Resultado |
|---|---|---|---|---|---|
| ciencias-naturales-8 | 1314×1680 | 613×784 | 0.0335 | 0.4797 | ✅ = Page 1 |
| estudios-sociales-8 | 1275×1650 | 595×770 | 0.0408 | 0.5309 | ✅ = Page 1 |
| lengua-literatura-8 | 1241×1755 | 579×819 | 0.0336 | 0.5275 | ✅ = Page 1 |
| matematica-8 | 1241×1755 | 579×819 | 0.0337 | 0.5180 | ✅ = Page 1 |

- **RMSE < 0.05** = coincidencia visual (thumbnail ≈ página 1)
- **RMSE > 0.47** = sin coincidencia (thumbnail ≠ página 2)
- El sufijo `_thumb-001` corresponde correctamente al índice de página 1.

---

## Issues Encontrados

### ⚠️ Issue 1: Error estructural en `estudios-sociales-8.pdf`

```
Syntax Error: Expected the optional content group list, but wasn't able to find it, or it isn't an Array
```

Este error ocurre durante `pdftotext` y `pdftoppm`. El PDF contiene un grupo de contenido opcional (OCG) malformado. Aunque el contenido sigue siendo accesible (texto y renderizado funcionan con limitaciones), la estructura del PDF tiene un daño. Recendación: reparar con `qpdf --linearize` o regenerar el PDF.

### ℹ️ Issue 2: Metadato Title vacío en todos los PDFs

Ninguno de los 4 PDFs tiene el campo `Title` poblado en los metadatos. Esto no afecta el contenido, pero dificulta la identificación automática del título del libro.

### ℹ️ Issue 3: Tamaño de página reportado como landscape pero renderizado como portrait

`pdfinfo` reporta tamaños de página en orientación landscape (e.g., A4 = 842×595), pero `pdftoppm` renderiza en portrait (579×819). Las miniaturas también son portrait. Las miniaturas coinciden con el renderizado de página 1, no con el tamaño base reportado — posiblemente el PDF aplica rotación por página no reflejada en `pdfinfo`.
