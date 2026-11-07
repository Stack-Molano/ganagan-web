# Paquete de diseño: GANAGÁN

Fase 2 de la Skill `sitios-web-ganagan`. Aprobado el 2026-11-05.
Entrada obligatoria para la construcción. Complementa `docs/brief.md` y `docs/asset-inventory.md`.

---

## 1. Concepto y posicionamiento

**Concepto:** *GANAGÁN. Tradición que evoluciona. Inteligencia que produce.*

**Posicionamiento:** una empresa ganadera que conserva el oficio y lo gestiona con criterio empresarial e información. El diferencial no es la tecnología en sí: es que **decide mejor**.

### Idea organizadora: «La línea»

Una sola línea fina recorre el sitio y cambia de forma en cada escena. Así «tradición que evoluciona» se ve, no solo se lee. Se dibuja con SVG ligero, sin depender de video.

| Escena | La línea es… | Significado |
|---|---|---|
| 01 Territorio | el **horizonte** del llano | el origen |
| 02 Esencia | **curvas de nivel** y perfil del animal | el conocimiento del territorio |
| 03 Visión | una **retícula** que ordena | la gestión |
| 04 Inteligencia | **líneas de datos** que conectan variables | la información |
| 05 Propósito | el **horizonte** de nuevo, más alto: la montaña | el futuro |
| 06 Identidad | el **trazo del logotipo** | la marca |

### Dos territorios

El recorrido va **del llano a la montaña**, que es la geografía real de la empresa:

- **Llanos Orientales:** escenas 01 y 02. Sabana plana, morichales, horizonte infinito.
- **Santander:** escenas 03 y 05. Laderas, cercas que siguen el relieve, cordilleras.

---

## 2. Identidad visual

- **Estética:** editorial, cinematográfica y sobria. Mucho espacio negativo, imágenes a sangre y tipografía grande.
- **Ritmo de color:** escenas oscuras (grafito y bosque) para lo cinematográfico; la escena 03 en marfil para respirar y marcar el paso a la gestión.
- **Motivo gráfico:** «la línea», trazo de 1 px en arena con opacidad media.
- **Logotipo:** ver `docs/asset-inventory.md`. En fondos oscuros, versión marfil; en fondos claros, versión a color. El isotipo (anillo y cabeza) se usa en el menú.

---

## 3. Paleta

Contraste medido con la fórmula WCAG. Mínimo para texto normal: 4,5:1.

```css
:root {
  --grafito: #161815;  /* fondo principal oscuro (no es negro puro) */
  --bosque:  #1E3528;  /* fondo de escenas 04 y 05 */
  --marfil:  #F2EDE2;  /* texto sobre oscuro; fondo de la escena 03 */
  --arena:   #CDB78F;  /* acento: la línea, etiquetas, enlaces, foco visible */
  --tierra:  #7A5536;  /* acento cálido; texto solo sobre marfil */
  --piedra:  #9A958A;  /* texto secundario, solo sobre grafito */
  --tinta:   #22241F;  /* texto sobre marfil */
  --musgo:   #4F5E46;  /* decorativo; nunca texto */
  --marino:  #002060;  /* reservado al logotipo a color */
}
```

| Combinación | Contraste | Uso permitido |
|---|---|---|
| marfil sobre grafito | 15,3:1 | Texto |
| marfil sobre bosque | 11,3:1 | Texto |
| arena sobre grafito | 9,2:1 | Texto y acentos |
| arena sobre bosque | 6,8:1 | Texto secundario en escenas verdes |
| piedra sobre grafito | 6,0:1 | Texto secundario |
| piedra sobre bosque | 4,4:1 | **No apto**: usar arena |
| tinta sobre marfil | 13,4:1 | Texto |
| tierra sobre marfil | 5,7:1 | Texto y acentos |
| marino sobre marfil | 13,1:1 | Logotipo |
| tierra o musgo sobre oscuro | 2,0–2,7:1 | **Solo decorativo** |

---

## 4. Tipografía

| Rol | Fuente | Pesos |
|---|---|---|
| Títulos (serif editorial) | **Fraunces** (variable) | 300, 600 |
| Texto (sans moderna) | **Manrope** | 400, 500, 600 |
| Botones del menú (sans técnica) | **Space Grotesk** (variable, desde 2026-11-07) | 500 |
| Etiquetas de datos (solo escena 04) | **IBM Plex Mono** | 400 |

- Alternativa: Newsreader + Instrument Sans.
- Licencia OFL. Se alojan en el proyecto (`assets/fonts/`, formato `woff2`), con `font-display: swap`.
- Escala fluida con `clamp()`: título principal de unos 96 px en escritorio, 72 px en tablet y 44 px en móvil.
- La cursiva del logotipo no se usa como tipografía del sitio.

---

## 5. Dirección fotográfica y audiovisual

- **Luz:** hora dorada y primeras horas de la mañana, contraluz suave.
- **Color:** cálido y contenido. Cielos arena y marfil, verdes profundos, sin saturación de postal.
- **Encuadre:** planos muy abiertos de territorio alternados con detalles muy cerrados (piel, manos, cuerda). Casi nada a distancia media.
- **Movimiento:** lento y solemne; dron que avanza, cámara casi quieta.
- **Razas:** Brahman rojo, Brahman blanco o gris, cebú y cruces. Hato mixto.
- **Veracidad:** todas las imágenes son generadas con IA. No se generan ni se presentan como propias instalaciones concretas, personas del equipo ni rótulos de la finca. Los textos hablan del oficio y del territorio, no de «nuestra finca».

---

## 6. Navegación y mapa de secciones

Sitio de **una sola página** con anclas.

- **Menú:** isotipo a la izquierda; cuatro enlaces a la derecha: *Territorio · Esencia · Visión · Propósito*. Transparente sobre el hero; fondo grafito translúcido al bajar. Se oculta al bajar y reaparece al subir.
- **Indicador de escena (escritorio):** numeración vertical `01 — 06` en el borde derecho; la escena activa en arena; cada número enlaza a su escena.
- **Móvil:** botón de menú que abre una pantalla completa en grafito con enlaces grandes en Fraunces.
- **Pie de página:** logotipo, razón social completa (*Inversiones Ganagán M&V S.A.S. ZOMAC*), región de operación, contacto y redes cuando existan, y la nota «Plataforma de inteligencia ganadera: en desarrollo». Sin formularios.

---

## 7. Storyboard

Los textos de apoyo de cada escena se redactan durante la construcción y se aprueban antes de publicar. No incluyen cifras ni datos no confirmados.

### Escena 01 · El territorio · fondo grafito, pantalla completa
- **Imagen:** vista aérea al amanecer de la sabana llanera, con niebla, morichales y un hato mixto en fila con polvo a contraluz.
- **Recursos:** `territorio-scrub.mp4` (escritorio), `territorio-poster-1280.webp`, `territorio-movil-*.webp`.
- **Movimiento:** en escritorio el **scroll controla el video**: el dron avanza y desciende hacia el hato. En móvil, imagen fija vertical con un zoom lento.
- **Mensaje:** *El futuro de la ganadería comienza en el campo.* Propuesta de título corto, pendiente de confirmar: *Todo empieza en la tierra.*
- **La línea:** el horizonte se dibuja al cargar.
- **Transición:** la imagen se oscurece hacia grafito y la línea baja y se curva.

### Escena 02 · Nuestra esencia · fondo grafito, composición editorial
- **Imagen:** tríptico asimétrico. Retrato del toro Brahman rojo (grande), manos con la soga y hato con jinete llanero.
- **Recursos:** `esencia-toro-*.webp`, `esencia-oficio-*.webp`, `esencia-hato-*.webp`.
- **Movimiento:** entradas desfasadas al hacer scroll; parallax suave de 40 px como máximo.
- **Mensaje:** *Conocimiento que se construye generación tras generación.*
- **La línea:** curvas de nivel detrás del tríptico.

### Escena 03 · Nuestra visión · fondo marfil, la primera escena clara
- **Imagen:** panorámica de potreros en ladera de Santander, con cercas que siguen el relieve.
- **Recursos:** `vision-ladera-*.webp`.
- **Movimiento:** el cambio de grafito a marfil es la transición más marcada del sitio.
- **Mensaje:** *Producir mejor también significa decidir mejor.* Tres principios cortos en columnas (por ejemplo, planificar, medir, mejorar): conceptos, no funciones.
- **La línea:** retícula fina que divide las columnas.

### Escena 04 · Inteligencia ganadera · fondo bosque, sin fotografía
- **Composición:** SVG con cinco nodos (*Territorio · Productividad · Información · Indicadores · Finanzas*) unidos por líneas que se dibujan con el scroll y convergen en el centro. Etiquetas en IBM Plex Mono.
- **Mensaje:** *La inteligencia del campo está en comprender cada variable.* Al pie: *Estamos construyendo las herramientas para lograrlo.*
- **Regla:** sin pantallas, tableros ni cifras simuladas. Se comunica una visión, no un producto.
- **Móvil:** nodos apilados en vertical, recorridos por la línea de arriba abajo.

### Escena 05 · Nuestro propósito · fondo bosque que se abre a una imagen
- **Imagen:** montañas de Santander al atardecer, horizonte alto y un camino rural que sube.
- **Recursos:** `proposito-horizonte-*.webp`, `proposito-movil-*.webp`.
- **Movimiento:** la imagen se descubre con una máscara que crece desde la línea central.
- **Mensaje:** *Una nueva perspectiva para el desarrollo ganadero.* Compromiso con la región y el territorio.
- **La línea:** vuelve a ser horizonte, más alto que en la 01.

### Escena 06 · Identidad Ganagán · fondo grafito
- **Composición:** logotipo marfil centrado que se revela siguiendo la línea; debajo, *GANAGÁN. Tradición que evoluciona.* en Fraunces.
- **Recursos:** `ganagan-logo-marfil.svg`.
- **Después:** pie de página.
- **Nota técnica:** el logotipo está hecho de formas rellenas, no de trazos; la animación es una revelación progresiva, no un dibujo a mano literal.

---

## 8. Interacciones y scroll

Técnicas de menor a mayor complejidad, según `references/flujo-scroll.md`:

| Escena | Técnica | Con movimiento reducido o si falla |
|---|---|---|
| 01 | Video controlado por scroll (`currentTime`), solo escritorio y tras pruebas | Poster fijo; en móvil, imagen vertical |
| 02 | `IntersectionObserver` + parallax ligero con `transform` | Imágenes fijas |
| 03 | Cambio de fondo por sección y entradas de texto | Cambio inmediato |
| 04 | Trazo SVG ligado al progreso (`stroke-dashoffset` + `requestAnimationFrame`) | Diagrama completo |
| 05 | Revelación con `clip-path` | Imagen visible |
| 06 | Revelación del logotipo, una vez | Logotipo completo |

Reglas:
- Nunca bloquear rueda, gesto táctil ni teclado. Sin scroll forzado por escenas.
- Animar solo `transform` y `opacity`.
- Pausar animaciones fuera de pantalla.
- Foco visible en arena; menú completo navegable con teclado.

---

## 9. Responsive

| | Escritorio y portátil | Tablet | Móvil |
|---|---|---|---|
| Hero 01 | Video por scroll | Poster o video (según pruebas) | Imagen vertical 9:16 con zoom lento |
| Retícula | 12 columnas, máx. ~1280 px | 8 columnas | 4 columnas, margen 20 px |
| Escena 02 | Tríptico asimétrico | Dos columnas | Una grande + dos pequeñas en fila |
| Escena 04 | Diagrama radial | Radial compacto | Vertical |
| Escena 05 | Imagen horizontal | Imagen horizontal | Imagen vertical 9:16 |
| Menú | 4 enlaces + indicador 01–06 | 4 enlaces | Botón + pantalla completa |
| Títulos | ~96 px | ~72 px | ~44 px |

---

## 10. Inventario

Ver `docs/asset-inventory.md`: 18 imágenes WebP, 1 video y 4 logotipos SVG, con dimensiones, pesos, origen, retoques y alternativas.

---

## 11. Prompts de producción

Registro de los prompts usados. Todas las imágenes llevaron al final el bloque de estilo común.

**Bloque de estilo común:**
> Fotografía documental cinematográfica, natural y auténtica, como tomada por un fotógrafo de campo en Colombia. Luz natural de hora dorada o primera mañana, gradación cálida y apagada: verdes profundos, tierras, arena y marfil. Contraste suave, grano fino de película, sin saturación excesiva. Nada publicitario ni artificial. Sin texto, sin letras, sin logotipos, sin marcas de agua, sin marcas de hierro en el ganado, sin vallas ni carteles.

**IMG-01H (ChatGPT, 16:9):**
> Vista aérea desde un dron alto, al amanecer, sobre la sabana de los Llanos Orientales de Colombia. Llanura plana e infinita de pasto dorado, morichales dispersos y niebla baja flotando sobre el pasto. En el tercio inferior, un hato de ganado Brahman rojo y gris avanza en fila suelta, pequeño en el encuadre, dejando una estela de polvo iluminada a contraluz. El horizonte es una línea recta y limpia a un tercio de la altura de la imagen. La mitad superior es un cielo amplio y sereno en degradado de marfil a arena, una zona tranquila e integrada en la escena. Las sombras del terreno caen en verde bosque profundo. Composición horizontal 16:9.

**VID-01 (Gemini, imagen a video desde IMG-01H, 16:9):**
> Video horizontal 16:9, una sola toma continua sin cortes, a partir de la imagen de referencia adjunta. El dron avanza lenta y constantemente hacia adelante y desciende con suavidad hacia el hato de ganado Brahman rojo y blanco, manteniéndose siempre por el centro del encuadre. La niebla se desplaza despacio entre los morichales, el pasto ondula con el viento, el polvo que levanta el hato brilla a contraluz y la luz del amanecer se intensifica poco a poco. El ganado camina con calma y naturalidad, sin cambiar de número ni de forma. Conserva exactamente la composición, el paisaje, las proporciones, los colores y la iluminación de la imagen de referencia. No introduzcas elementos nuevos. Color contenido y natural. La toma termina en reposo: el hato queda nítido y bien compuesto en el tercio inferior, con el horizonte todavía visible arriba. Movimiento de cámara lento, suave y solemne. Sin texto, sin logotipos, sin subtítulos, sin marcas de agua, sin cortes, sin marcas de hierro en el ganado.

**IMG-01V (ChatGPT, 2:3, recortada a 9:16):**
> Vista aérea desde un dron alto, al amanecer, sobre la sabana de los Llanos Orientales de Colombia. Llanura plana con pasto, morichales dispersos y niebla baja. Un hato de ganado Brahman rojo y blanco avanza en fila suelta, pequeño en el encuadre, centrado horizontalmente en el tercio inferior, con una estela de polvo iluminada a contraluz. Horizonte recto un poco por debajo de la mitad. La mitad superior es cielo sereno en degradado de marfil a arena, con espacio libre para un título. Elementos importantes en la franja central. Color contenido, sin disco solar visible.

**IMG-02A (ChatGPT, 4:5):**
> Retrato lateral de tres cuartos de un toro Brahman rojo puro de exposición, con pelaje caoba uniforme y brillante, giba alta y bien definida, orejas largas y caídas, papada amplia y piel suelta, y cuernos cortos hacia arriba y atrás. De pie y sereno sobre pasto de sabana. Contraluz de hora dorada que dibuja un borde de luz sobre la giba y las orejas. Polvo suspendido en el aire. Fondo muy desenfocado en verde bosque y tierra. Anatomía correcta y realista. Composición vertical 4:5.

**IMG-02B (ChatGPT, 1:1):**
> Plano muy cerrado de las manos curtidas de un vaquero llanero ajustando una soga de cuero trenzado. Se ven el antebrazo, la camisa de algodón remangada y la textura de la piel y del cuero. Luz lateral cálida de la mañana, fondo oscuro desenfocado en tonos tierra. No se ve el rostro. Composición cuadrada 1:1.

**IMG-02C (ChatGPT, 3:2):**
> Hato de ganado cebú en la sabana de los Llanos Orientales: Brahman rojo, Brahman gris y cruces cebuinos caminando juntos a media distancia sobre pasto alto dorado. Un jinete llanero con sombrero los guía de espaldas a la cámara. Hora dorada con polvo a contraluz y morichales al fondo. Escena natural, sin pose. Composición horizontal 3:2.

**IMG-03 (ChatGPT, 21:9):**
> Vista elevada de potreros en ladera en las montañas de Santander, Colombia, a primera hora de la mañana. Cercas de madera y alambre siguen las curvas del terreno y dividen parcelas de pasto bien delimitadas, con caminos de tierra que las conectan. Algunas reses cebú pastan a distancia. Geometría limpia de cercas sobre el relieve. Bruma suave al fondo. Paleta clara de marfil, arena y verde apagado. Composición panorámica 21:9.

**IMG-05 / IMG-05V (ChatGPT, 16:9 y 2:3 recortada a 9:16):**
> Paisaje de montaña en Santander, Colombia, al atardecer. Cordilleras sucesivas se desvanecen en la bruma hacia el horizonte, alto en la imagen. Potreros verdes en ladera con cercas y algunas reses cebú blancas y rojas a distancia. Un camino rural de tierra sube hacia la luz. Cielo cálido de arena y marfil. Sensación de amplitud, perspectiva y futuro. Sin construcciones.

---

## 12. Criterios técnicos y de rendimiento

- HTML, CSS y JavaScript nativos; sin frameworks ni dependencias.
- **Primera pantalla:** solo se carga el poster del hero, con prioridad alta. El video se carga después, solo en escritorio y sin movimiento reducido.
- **Video:** H.264 MP4, sin audio, `muted`, `playsinline`, fotograma clave cada 8 fotogramas.
- **Imágenes:** WebP con `srcset` (dos anchos), `loading="lazy"` fuera de la primera pantalla, dimensiones declaradas.
- **Fuentes:** locales en `woff2`, `font-display: swap`, solo los pesos usados.
- **Rutas:** relativas (`./assets/...`) para funcionar bajo `usuario.github.io/ganagan-web/`.
- **Pruebas:** matriz de `references/pruebas-y-accesibilidad.md`, con estados *no probado / aprobado / fallido*.

---

## 13. Riesgos y alternativas

| Riesgo | Impacto | Alternativa |
|---|---|---|
| No hay datos verificables de la empresa | Medio | Textos sin cifras; añadirlas cuando se confirmen |
| Imágenes generadas con IA | Medio | Marcadas como reemplazables; plan de sesión fotográfica futura |
| Video de 720p | Bajo | Aceptable por la escena brumosa; regenerar en mayor resolución si Gemini lo permite |
| Video por scroll en Safari o iOS | Medio | En móvil se usa imagen fija |
| Peso del video (4,6 MB) | Bajo | Solo se carga en escritorio; comprimir más si las pruebas lo piden |
| Repositorio privado | Medio al publicar | Confirmar visibilidad o plan antes de la publicación |

---

## 14. Secuencia de implementación

1. ~~Brief actualizado y paquete de diseño guardado.~~
2. ~~FFmpeg instalado.~~
3. ~~Recursos producidos, optimizados e inventariados.~~
4. **Prototipo estructural:** HTML semántico de las 6 escenas, paleta, tipografía y menú. Funciona por completo sin animaciones ni video.
5. Animaciones CSS y SVG de las escenas 02 a 06.
6. Integración del video por scroll en la escena 01, con sus alternativas.
7. Redacción y aprobación de los textos de apoyo.
8. Pruebas completas: responsive, teclado, movimiento reducido y rendimiento.
9. Publicación en GitHub Pages y verificación de la URL real.
