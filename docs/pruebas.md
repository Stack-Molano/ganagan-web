# Matriz de pruebas

Según `references/pruebas-y-accesibilidad.md` de la Skill `sitios-web-ganagan`.
Estados: **aprobado**, **fallido** o **no probado**. No se marca como aprobada ninguna prueba que no se haya ejecutado.

## Ronda 1 · 2026-11-05 · entorno local

Servidor: `python -m http.server` en `127.0.0.1:8000`. Navegador: panel de navegador de la app (Chromium) y Chrome en modo headless.

| # | Prueba | Estado | Evidencia | Corrección |
|---|---|---|---|---|
| 1 | Rutas de recursos (25 referencias en HTML y CSS) | Aprobado | Todas responden 200. Sin rutas absolutas `/…`. Sin diferencias de mayúsculas. | — |
| 2 | Anclas e IDs | Aprobado | 13 anclas, todas con destino; sin IDs duplicados. | — |
| 3 | Texto alternativo | Aprobado | 9 imágenes, todas con `alt` (decorativas con `alt=""`). | — |
| 4 | Consola sin errores | Aprobado | Sin errores en la carga actual. Los 404 previos eran las fuentes antes de descargarlas. | — |
| 5 | Peso de carga, escritorio | Aprobado | ~330 KB sin video; el video (4,6 MB) se carga después de la primera pantalla. | Se quitó el `poster` del video: descargaba 71 KB innecesarios. |
| 6 | Peso de carga, móvil | Aprobado | Solo recursos móviles: sin video ni imágenes grandes de escritorio. | Cierra la duda de la ronda anterior (era efecto del cambio de tamaño durante la prueba). |
| 7 | Anchos 375, 768, 1024, 1440, 1920 | Aprobado | Sin desplazamiento horizontal en ninguno. Video por scroll desde 1024 px. | — |
| 8 | Menú móvil | Aprobado | Abre, cierra con botón y con Escape; el foco vuelve al botón. | Corregido en el prototipo: la cabecera recortaba el menú. |
| 9 | Navegación con teclado y foco visible | Aprobado | Orden lógico: saltar al contenido, logotipo, menú, indicador 01–06, «Descubre». Contorno arena visible en todos. | — |
| 10 | Movimiento reducido | Aprobado | Con `prefers-reduced-motion: reduce` la página no activa `.motion`: sin video, sin animaciones, contenido completo. | — |
| 11 | Contraste del título del hero sobre la imagen | Aprobado | Medido contra el percentil 95 del fondo real. Escritorio: 3,55:1 (mín. 3). Móvil: 5,1:1. | **Fallaba** (2,1–2,5:1). Se reforzó la veladura: lateral en escritorio y superior en móvil. |
| 12 | Contraste del subtítulo del hero | Aprobado | Escritorio: 5,4:1. Móvil: 5,2:1 (mín. 4,5). | **Fallaba** (3,4:1 escritorio; 2,2:1 móvil). Misma corrección. |
| 13 | Contraste de la escena 05 sobre la imagen | Aprobado | Título 8,1:1; texto 8,5:1. | — |
| 14 | Contraste del indicador sobre la escena clara | Aprobado | ≈ 6:1. | **Fallaba** (4,0:1). Tinta al 75 %. |
| 15 | Contraste de la paleta | Aprobado | Ver `docs/paquete-de-diseno.md`, sección 3. | — |
| 16 | Video controlado por scroll | Aprobado | Avanza y retrocede con el scroll (0 s → 4,2 s → 8,3 s). | Respaldo Blob añadido: el servidor local no admite HTTP Range. |
| 17 | Animaciones de escenas 02–06 | Aprobado | Revelaciones, parallax (±40 px), líneas del diagrama, máscara y logotipo. | Corregidos: nodos del diagrama desalineados y encendido simultáneo en móvil. |
| 18 | Sin JavaScript | No probado | Chrome headless no permite desactivarlo. Por diseño, los estados ocultos dependen de `.motion`, que solo añade JavaScript. | Probar manualmente desactivando JavaScript en el navegador. |
| 19 | Teléfono real | No probado | Solo emulación. | Probar tras publicar. |
| 20 | Safari / iOS | No probado | Sin acceso a esos dispositivos. | Probar tras publicar. |
| 21 | URL pública de GitHub Pages | No probado | Aún no publicado. | Fase 9. |
| 22 | Contacto del pie | No probado | Datos pendientes («Próximamente»). | Al recibir correo o WhatsApp. |
