# Inventario de recursos audiovisuales

Registro de cada recurso del sitio, según `references/paquete-de-diseno.md` de la Skill `sitios-web-ganagan`.
Actualizado: 2026-11-05.

## Reglas

- **Origen:** todas las imágenes y el video son **generados con IA** y no muestran instalaciones, personas ni animales reales de Ganagán. Son reemplazables por fotografía real cuando exista.
- **Originales:** se conservan en `review/exports/` (ignorado por Git). Nunca se publican.
- **Formato web:** imágenes WebP (calidad 80) en dos anchos para `srcset`; video H.264 sin audio.
- **Licencia:** imágenes generadas por el usuario con ChatGPT y Gemini bajo las condiciones de uso de cada servicio. Revisar esas condiciones antes de un uso comercial distinto al sitio.
- **Sin texto, logotipos ni marcas de hierro** en ninguna imagen (verificado en revisión).

## Imágenes

| ID | Archivos publicados | Dimensiones | Peso | Origen | Original | Escena | Alternativa / uso |
|---|---|---|---|---|---|---|---|
| IMG-01H | `assets/images/territorio-hero-1672.webp` · `-960.webp` | 1672×942 · 960×540 | 111 KB · 45 KB | ChatGPT | `IMG-01H.png` | 01 Territorio | Respaldo del video en escritorio. Color corregido (ver «Filtro de color») |
| IMG-01V | `assets/images/territorio-movil-864.webp` · `-540.webp` | 864×1536 · 540×960 | 89 KB · 40 KB | ChatGPT | `IMG-01V.png` | 01 Territorio | Hero en móvil y con movimiento reducido. Recortada de 2:3 a 9:16 |
| POSTER | `assets/images/territorio-poster-1280.webp` | 1280×720 | 71 KB | Primer fotograma de VID-01 | — | 01 Territorio | `poster` del video; coincide exactamente con su inicio |
| FINAL | `assets/images/territorio-final-1280.webp` | 1280×720 | 57 KB | Último fotograma de VID-01 | — | 01 Territorio | Fotograma de llegada; base para la imagen de vista previa (Open Graph) |
| IMG-02A | `assets/images/esencia-toro-1122.webp` · `-700.webp` | 1122×1402 · 700×874 | 134 KB · 70 KB | ChatGPT | `IMG-02A.png` | 02 Esencia | Toro Brahman rojo |
| IMG-02B | `assets/images/esencia-oficio-1254.webp` · `-700.webp` | 1254×1254 · 700×700 | 160 KB · 67 KB | ChatGPT | `IMG-02B.png` → `IMG-02B-retocada.png` | 02 Esencia | Retoque: se eliminó un objeto metálico del antebrazo |
| IMG-02C | `assets/images/esencia-hato-1536.webp` · `-960.webp` | 1536×1024 · 960×640 | 155 KB · 80 KB | ChatGPT | `IMG-02C.png` | 02 Esencia | Hato y jinete llanero |
| IMG-03 | `assets/images/vision-ladera-1560.webp` · `-960.webp` | 1560×822 · 960×506 | 170 KB · 76 KB | ChatGPT | `IMG-03.png` → `IMG-03-retocada.png` | 03 Visión | Recorte: se eliminó un galpón con corral (instalación concreta) |
| IMG-05H | `assets/images/proposito-horizonte-1672.webp` · `-960.webp` | 1672×942 · 960×540 | 159 KB · 70 KB | ChatGPT | `IMG-05.png` | 05 Propósito | Santander, montañas |
| IMG-05V | `assets/images/proposito-movil-864.webp` · `-540.webp` | 864×1536 · 540×960 | 154 KB · 69 KB | ChatGPT | `IMG-05V.png` | 05 Propósito | Versión móvil. Recortada de 2:3 a 9:16 |

## Video

| ID | Archivo publicado | Formato | Peso | Origen | Original | Escena | Alternativa |
|---|---|---|---|---|---|---|---|
| VID-01 | `assets/videos/territorio-scrub.mp4` | H.264, 1280×720, 24 fps, 10 s, sin audio | 4,6 MB | Gemini, imagen a video desde IMG-01H | `VID-01.mp4` | 01 Territorio | POSTER en escritorio; IMG-01V en móvil y con movimiento reducido |

Codificación para scroll: fotograma clave cada 8 fotogramas (30 en total), CRF 20, `faststart`. Se eliminó la pista de audio del original. Solo se carga en escritorio.

## Filtro de color

Aplicado a IMG-01H y VID-01 para acercarlos a la paleta y a IMG-01V:

```
eq=saturation=0.86:contrast=0.96:brightness=0.01,colorbalance=gm=-0.03:rm=-0.01:bm=0.01:rh=0.01:gh=-0.01:bh=0.01
```

## Logotipo

Logotipo aportado por la empresa, vectorizado con ChatGPT a partir del GIF original y agrupado por partes. Original de trabajo: `review/exports/ganagan-logo-color.svg`.

| ID | Archivo | Contenido | Uso |
|---|---|---|---|
| LOGO-C | `assets/icons/ganagan-logo-color.svg` | Logotipo completo a color | Fondos claros (marfil) |
| LOGO-M | `assets/icons/ganagan-logo-marfil.svg` | Logotipo completo en marfil `#F2EDE2` | Fondos oscuros (grafito, bosque); escena 06 |
| ISO-C | `assets/icons/ganagan-isotipo-color.svg` | Anillo y cabeza a color | Fondos claros |
| ISO-M | `assets/icons/ganagan-isotipo-marfil.svg` | Anillo y cabeza en marfil | Menú sobre fondo oscuro; favicon. Mínimo recomendado: 48 px de alto |

- **Colores medidos en el GIF original:** azul marino `#002060` (anillo y «Ganagán»); cabeza y textos `#222222`.
- **Grupos SVG:** `anillo`, `cabeza`, `inversiones`, `ganagan`, `razon-social`. Permiten animar o recolorear cada parte.
- **Correcciones respecto al vectorizado:** se eliminó una línea fina sobre la razón social que no existe en el original, y se recuperaron los huecos de las letras «O» (12 contraformas que habían quedado rellenas).
- La cabeza es transparente por dentro: sobre fotografía, usar siempre un fondo sólido detrás.

## Prompts

Los prompts de cada recurso están en el historial de trabajo de la Fase 2 y se incorporarán a `docs/paquete-de-diseno.md` cuando se apruebe ese documento.
