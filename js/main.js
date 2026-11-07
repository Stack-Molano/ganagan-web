/* =========================================================
   GANAGÁN · Comportamiento básico (prototipo estructural)
   El sitio funciona sin este archivo: aquí solo se mejora
   la navegación. Las animaciones llegarán en la fase 5.
   ========================================================= */
(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  /* ---------- Menú móvil ---------- */
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-toggle__label').textContent = open ? 'Cerrar' : 'Menú';
    menu.classList.toggle('is-open', open);
    if (header) {
      header.classList.toggle('menu-open', open);
      if (open) header.classList.remove('is-hidden');
    }
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    // Si se agranda la ventana con el menú abierto, se cierra.
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (mq) => {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Cabecera: fondo al bajar, se oculta al bajar y vuelve al subir ---------- */
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      const goingDown = y > lastY && y > window.innerHeight * 0.6;
      const menuOpen = menu && menu.classList.contains('is-open');
      header.classList.toggle('is-hidden', goingDown && !menuOpen);
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    // La cabecera reaparece si recibe el foco con el teclado.
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
    update();
  }

  /* ---------- Indicador de escena activa ---------- */
  const sceneIndex = document.querySelector('.scene-index');
  const links = new Map(
    [...document.querySelectorAll('[data-scene-link]')].map((a) => [a.dataset.sceneLink, a])
  );

  if ('IntersectionObserver' in window && links.size) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        const active = links.get(entry.target.id);
        if (active) active.setAttribute('aria-current', 'true');
        if (sceneIndex) sceneIndex.classList.toggle('on-light', entry.target.id === 'vision');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    document.querySelectorAll('[data-scene]').forEach((s) => observer.observe(s));
  }

  /* =========================================================
     ANIMACIONES (fase 5)
     Solo se activan si el usuario no pidió movimiento reducido.
     Todo lo que se mueve usa transform, opacity o clip-path, y
     el trabajo por scroll se agrupa en un solo requestAnimationFrame.
     ========================================================= */
  const root = document.documentElement;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

  /* Progreso 0→1 de un elemento: 0 cuando su borde superior está en
     `from` (fracción de la ventana) y 1 cuando llega a `to`. */
  const progress = (el, from, to) => {
    const top = el.getBoundingClientRect().top;
    const vh = window.innerHeight;
    return clamp((from * vh - top) / ((from - to) * vh));
  };
  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };

  /* --- Revelaciones al entrar en pantalla --- */
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  let revealObserver = null;

  const startReveals = () => {
    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-in'));
      return;
    }
    revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => revealObserver.observe(el));
  };

  /* --- Escena 03: la ladera se acerca mientras entra --- */
  const visionMedia = document.querySelector('[data-vision-media]');
  const updateVision = () => {
    if (!visionMedia || !inView(visionMedia)) return;
    visionMedia.style.setProperty('--p', progress(visionMedia, 1, 0).toFixed(3));
  };

  /* --- Escena 04: líneas que convergen y nodos que se encienden --- */
  const variables = document.querySelector('[data-variables]');
  const svg = variables && variables.querySelector('.variables__lines');
  const lines = svg ? [...svg.querySelectorAll('line')] : [];
  const nodes = variables ? [...variables.querySelectorAll('.variables__node')] : [];
  const center = variables && variables.querySelector('.variables__center');
  const list = variables && variables.querySelector('.variables__list');

  // Guarda las coordenadas originales (en %) para recalcularlas en píxeles.
  lines.forEach((l) => {
    ['x1', 'y1', 'x2', 'y2'].forEach((k) => { l.dataset[k] = l.getAttribute(k); });
  });

  // Con píxeles reales, pathLength="1" funciona y el trazo no se deforma.
  const sizeLines = () => {
    if (!svg) return;
    const { width, height } = variables.getBoundingClientRect();
    if (!width || !height) return;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    lines.forEach((l) => {
      l.setAttribute('x1', (l.dataset.x1 / 100) * width);
      l.setAttribute('x2', (l.dataset.x2 / 100) * width);
      l.setAttribute('y1', (l.dataset.y1 / 100) * height);
      l.setAttribute('y2', (l.dataset.y2 / 100) * height);
    });
  };

  const updateVariables = () => {
    if (!variables || !inView(variables)) return;
    const p = progress(variables, 0.9, 0.3);
    const isList = !svg || svg.getBoundingClientRect().width === 0;   // móvil: lista vertical
    // Escritorio: cada línea empieza un poco después de la anterior
    // y su nodo se enciende cuando la línea arranca.
    lines.forEach((l, i) => {
      const lp = clamp((p - i * 0.1) / 0.5);
      l.style.strokeDashoffset = (1 - lp).toFixed(3);
      if (!isList && nodes[i]) nodes[i].classList.toggle('is-lit', lp > 0.05);
    });
    // Móvil: cada nodo se enciende cuando la línea vertical lo alcanza.
    if (isList) {
      nodes.forEach((n, i) => n.classList.toggle('is-lit', p >= (i + 0.5) / nodes.length));
    }
    if (center) center.classList.toggle('is-lit', p > 0.97);
    // Móvil: la línea vertical avanza con el progreso.
    if (list) list.style.setProperty('--p', p.toFixed(3));
  };

  /* --- Escena 05: máscara que se abre desde la línea central --- */
  const proposito = document.getElementById('proposito');
  const propositoMedia = proposito && proposito.querySelector('.proposito__media');
  const updateProposito = () => {
    if (!propositoMedia || !inView(proposito)) return;
    propositoMedia.style.setProperty('--p', progress(proposito, 1, 0.25).toFixed(3));
  };

  /* --- Video controlado por el scroll (solo escritorio) ---
     Pieza común para la escena 01 y la escena 03. Con la clase `cls` la
     sección se alarga, su contenido queda fijo y el scroll recorre el video.
     `prop` es la variable CSS con el progreso 0→1. El video se descarga
     cuando la sección está a menos de dos pantallas. */
  const desktopQuery = window.matchMedia('(min-width: 1024px)');

  const makeScrub = (section, cls, prop) => {
    const video = section && section.querySelector('[data-scrub-video]');
    const s = { on: false, target: 0, current: 0, seeking: false, raf: null };
    if (!video) return { on: false, start() {}, stop() {}, update() {}, progress: () => 0 };

    const progress = () => {
      const r = section.getBoundingClientRect();
      const travel = r.height - window.innerHeight;       // recorrido fijo
      return travel > 0 ? clamp(-r.top / travel) : 0;
    };
    // Suavizado: el tiempo mostrado persigue al objetivo y solo se pide
    // una nueva posición cuando el navegador terminó la anterior.
    const step = () => {
      s.raf = null;
      if (!s.on || !video.duration) return;
      s.current += (s.target - s.current) * 0.18;
      if (Math.abs(s.target - s.current) < 0.002) s.current = s.target;
      if (!s.seeking && Math.abs(video.currentTime - s.current) > 0.01) {
        s.seeking = true;
        video.currentTime = s.current;
      }
      if (s.current !== s.target || s.seeking) s.raf = requestAnimationFrame(step);
    };
    const kick = () => { if (!s.raf) s.raf = requestAnimationFrame(step); };
    // Si algo falla, vuelve la imagen fija y el scroll no se congela.
    const fail = () => {
      s.seeking = false;
      s.on = false;
      section.classList.remove(cls);
      section.style.removeProperty(prop);
    };
    const load = () => {
      if (video.getAttribute('src')) return;
      video.src = video.dataset.src;
      video.preload = 'auto';
      video.load();
    };

    s.progress = progress;
    s.update = () => {
      if (!s.on) return;
      if (section.getBoundingClientRect().top < window.innerHeight * 2) load();
      if (!inView(section)) return;
      const p = progress();
      section.style.setProperty(prop, p.toFixed(3));
      if (video.duration) {
        s.target = p * (video.duration - 0.05);
        kick();
      }
    };
    s.start = () => {
      if (s.on) return;
      s.on = true;
      section.classList.add(cls);
      video.pause();
      s.update();
    };
    s.stop = () => {
      if (!s.on) return;
      s.on = false;
      section.classList.remove(cls);
      section.style.removeProperty(prop);
    };

    video.addEventListener('seeked', () => { s.seeking = false; kick(); });
    video.addEventListener('error', fail);
    video.addEventListener('loadeddata', () => {
      video.classList.add('is-ready');
      s.update();
    });
    // Respaldo: si el servidor no admite solicitudes parciales (HTTP Range),
    // el video no se puede recorrer. Entonces se descarga completo una vez
    // y se reproduce desde memoria, donde sí se puede buscar cualquier punto.
    video.addEventListener('loadedmetadata', async () => {
      const canSeek = video.seekable.length && video.seekable.end(0) >= video.duration - 0.5;
      if (canSeek || video.src.startsWith('blob:')) return;
      try {
        const res = await fetch(video.dataset.src);
        if (!res.ok) throw new Error(res.status);
        const blob = await res.blob();
        video.src = URL.createObjectURL(blob);
        video.load();
      } catch (err) {
        fail();
      }
    });
    return s;
  };

  /* Escena 01 · portada */
  const hero = document.querySelector('[data-hero]');
  const heroScrub = makeScrub(hero, 'hero--scrub', '--hp');

  /* Transición 01 → 02: --fx (0→1) desenfoca y oscurece la portada al salir.
     Con video, en el último tramo del recorrido fijo; sin video, mientras
     la portada sube y deja la pantalla. */
  const updateHeroExit = () => {
    if (!hero || !inView(hero)) return;
    let fx;
    if (heroScrub.on) fx = clamp((heroScrub.progress() - 0.78) / 0.22);
    else fx = clamp(-hero.getBoundingClientRect().top / (window.innerHeight * 0.8));
    hero.style.setProperty('--fx', fx.toFixed(3));
  };
  const updateHero = () => {
    updateHeroExit();
    heroScrub.update();
  };

  /* Escena 03 · praderas y silvopastoreo */
  const visionScrub = makeScrub(document.querySelector('[data-vision-stage]'), 'vision--scrub', '--vp');

  const startScrub = () => { heroScrub.start(); visionScrub.start(); };
  const stopScrub = () => { heroScrub.stop(); visionScrub.stop(); };
  const syncScrub = () => {
    if (motionQuery.matches && desktopQuery.matches) startScrub();
    else stopScrub();
  };
  desktopQuery.addEventListener('change', () => { syncScrub(); onResize(); });

  /* --- Bucle único por scroll --- */
  let frame = null;
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      updateHero();
      visionScrub.update();
      updateVision();
      updateVariables();
      updateProposito();
    });
  };
  const onResize = () => { sizeLines(); onScroll(); };

  const enableMotion = () => {
    root.classList.add('motion');
    syncScrub();
    sizeLines();
    startReveals();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // El horizonte se dibuja cuando la página terminó de cargar.
    if (document.readyState === 'complete') root.classList.add('is-loaded');
    else window.addEventListener('load', () => root.classList.add('is-loaded'), { once: true });
  };

  // Si el usuario activa el movimiento reducido con la página abierta,
  // se vuelve al estado estático completo.
  const disableMotion = () => {
    root.classList.remove('motion');
    stopScrub();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (revealObserver) revealObserver.disconnect();
    reveals.forEach((el) => el.classList.add('is-in'));
    lines.forEach((l) => l.style.removeProperty('stroke-dashoffset'));
  };

  if (motionQuery.matches) enableMotion();
  motionQuery.addEventListener('change', (e) => (e.matches ? enableMotion() : disableMotion()));

  /* ---------- Año del pie de página ---------- */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
