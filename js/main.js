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
        if (sceneIndex) sceneIndex.classList.toggle('on-light', entry.target.id === 'que-hacemos');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    document.querySelectorAll('[data-scene]').forEach((s) => observer.observe(s));
  }

  /* ---------- Navegación por capítulos ----------
     Cada escena es un capítulo: solo se ve una a la vez y se llega a las
     demás con el menú o con el enlace «Siguiente» de cada escena. La
     dirección (#que-somos, #resultados…) permite volver con Atrás y
     compartir un capítulo. Sin JavaScript, el sitio se ve todo seguido. */
  const root = document.documentElement;
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const sceneIds = new Set(scenes.map((s) => s.id));
  const footer = document.querySelector('.site-footer');
  // Direcciones antiguas, por si alguien guardó un enlace
  const legacy = {
    territorio: 'inicio', esencia: 'que-somos', vision: 'que-hacemos',
    inteligencia: 'resultados', identidad: 'contacto',
  };
  // Opción del menú que se marca en cada capítulo
  const navFor = {
    inicio: 'inicio', 'que-somos': 'que-somos', 'que-hacemos': 'que-somos',
    resultados: 'resultados', proposito: 'resultados', contacto: 'contacto',
  };
  let current = null;
  let leaveTimer = null;
  let afterShow = () => {};          // lo completa la parte de animaciones

  // Capítulo de una dirección: '' → inicio; un ancla ajena (#contenido) → null
  const sceneFromHash = (hash) => {
    let id = '';
    try { id = decodeURIComponent(hash.replace(/^#/, '')); } catch (e) { return null; }
    if (!id) return 'inicio';
    id = legacy[id] || id;
    return sceneIds.has(id) ? id : null;
  };
  const urlFor = (id) => (id === 'inicio' ? location.pathname + location.search : `#${id}`);

  const swap = (id, { focus = false, enter = false } = {}) => {
    const next = document.getElementById(id);
    scenes.forEach((s) => s.classList.toggle('is-active', s === next));
    root.dataset.route = id;
    current = id;
    document.title = `Ganagán · ${next.dataset.title}`;
    document.querySelectorAll('.site-nav a').forEach((a) => {
      if (a.getAttribute('href') === `#${navFor[id]}`) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    // Cada capítulo empieza arriba, con la cabecera visible
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    window.dispatchEvent(new Event('scroll'));
    if (enter) {
      const parts = [next, footer].filter(Boolean);
      parts.forEach((el) => el.classList.add('is-entering'));
      setTimeout(() => parts.forEach((el) => el.classList.remove('is-entering')), 2200);
    }
    afterShow(next);
    // Con teclado, el foco pasa al título del capítulo nuevo
    if (focus) {
      const title = next.querySelector('h1, h2');
      if (title) {
        title.setAttribute('tabindex', '-1');
        title.focus({ preventScroll: true });
      }
    }
  };

  const show = (id, { animate = false, focus = false } = {}) => {
    if (id === current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    clearTimeout(leaveTimer);
    const withMotion = animate && current && root.classList.contains('motion');
    if (!withMotion) {
      root.classList.remove('is-leaving');
      swap(id, { focus });
      return;
    }
    // La escena actual se apaga y luego entra la nueva
    root.classList.add('is-leaving');
    leaveTimer = setTimeout(() => {
      root.classList.remove('is-leaving');
      swap(id, { focus, enter: true });
    }, 350);
  };

  if (scenes.length) {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = sceneFromHash(a.getAttribute('href'));
      if (!id || !a.getAttribute('href').slice(1)) return;
      e.preventDefault();
      if (id !== current) history.pushState(null, '', urlFor(id));
      show(id, { animate: true, focus: e.detail === 0 });
    });
    window.addEventListener('popstate', () => {
      const id = sceneFromHash(location.hash);
      if (!id) return;
      // Una dirección antigua (#esencia) se reescribe con la nueva (#que-somos)
      if (location.hash && `#${id}` !== location.hash) history.replaceState(null, '', urlFor(id));
      show(id, { animate: true });
    });
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    root.classList.add('is-routed');
    const first = sceneFromHash(location.hash) || 'inicio';
    if (location.hash && `#${first}` !== location.hash) history.replaceState(null, '', urlFor(first));
    swap(first);
  }

  /* =========================================================
     ANIMACIONES (fase 5)
     Solo se activan si el usuario no pidió movimiento reducido.
     Todo lo que se mueve usa transform, opacity o clip-path, y
     el trabajo por scroll se agrupa en un solo requestAnimationFrame.
     ========================================================= */
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

  /* Un elemento recortado (data-reveal="clip") no cuenta como visible para el
     navegador mientras está recortado, así que se vigila su contenedor. */
  const revealOwners = new Map();
  const observeReveal = (el) => {
    if (!revealObserver) return;
    const target = el.dataset.reveal === 'clip' ? el.parentElement : el;
    if (target !== el) revealOwners.set(target, [...(revealOwners.get(target) || []).filter((x) => x !== el), el]);
    revealObserver.observe(target);
  };

  const startReveals = () => {
    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-in'));
      return;
    }
    revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (revealOwners.get(entry.target) || [entry.target]).forEach((el) => el.classList.add('is-in'));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(observeReveal);
  };

  /* --- Escena 03: la ladera se acerca mientras entra --- */
  const visionMedia = document.querySelector('[data-vision-media]');
  const updateVision = () => {
    if (!visionMedia || !inView(visionMedia)) return;
    visionMedia.style.setProperty('--p', progress(visionMedia, 1, 0).toFixed(3));
  };

  /* --- Escena 04: red viva de ejes ---
     Cinco ejes en elipse alrededor del núcleo «Mejores decisiones». Los
     nodos flotan, pulsos de luz viajan de cada eje al núcleo y, con el
     mouse, la red se aparta del puntero y resalta las conexiones del eje. */
  const red = document.querySelector('[data-red]');
  const redSvg = red && red.querySelector('.red__lines');
  const redNodes = red ? [...red.querySelectorAll('.red__node')] : [];
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const R = { w: 0, h: 0, cx: 0, cy: 0, base: [], spokes: [], ring: [], pulses: [], mx: null, my: null, raf: null, visible: false };

  if (red && redSvg && redNodes.length) {
    red.classList.add('red--js');
    const make = (tag, cls) => {
      const el = document.createElementNS(SVG_NS, tag);
      el.setAttribute('class', cls);
      if (tag === 'line') el.setAttribute('pathLength', '1');
      redSvg.appendChild(el);
      return el;
    };
    redNodes.forEach((n, i) => { n.style.setProperty('--i', i); R.ring.push(make('line', 'red__line red__line--ring')); });
    redNodes.forEach(() => R.spokes.push(make('line', 'red__line')));
    redNodes.forEach(() => { const c = make('circle', 'red__pulse'); c.setAttribute('r', '2.5'); R.pulses.push(c); });
  }

  const drawRed = (t) => {
    if (!R.base.length) return;
    const live = root.classList.contains('motion');
    const pos = R.base.map((b) => {
      let x = b.x;
      let y = b.y;
      if (live) {
        x += Math.sin(t * 0.0006 + b.ph) * 7;
        y += Math.cos(t * 0.0005 + b.ph * 1.7) * 6;
      }
      if (R.mx !== null) {                        // se aparta del puntero
        const dx = x - R.mx;
        const dy = y - R.my;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 170) {
          const f = (1 - d / 170) * 24;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }
      }
      return { x: clamp(x, b.hw + 2, R.w - b.hw - 2), y: clamp(y, b.hh + 2, R.h - b.hh - 2) };
    });
    pos.forEach((p, i) => {
      const n = redNodes[i];
      n.style.setProperty('--x', p.x.toFixed(1));
      n.style.setProperty('--y', p.y.toFixed(1));
      const q = pos[(i + 1) % pos.length];
      const set = (el, x1, y1, x2, y2) => {
        el.setAttribute('x1', x1.toFixed(1)); el.setAttribute('y1', y1.toFixed(1));
        el.setAttribute('x2', x2.toFixed(1)); el.setAttribute('y2', y2.toFixed(1));
      };
      set(R.spokes[i], p.x, p.y, R.cx, R.cy);
      set(R.ring[i], p.x, p.y, q.x, q.y);
      // Pulso: recorre el eje hasta el núcleo cada 2,8 s, desfasado por eje
      const f = ((t + i * 560) % 2800) / 2800;
      const e = f * f * (3 - 2 * f);
      const c = R.pulses[i];
      c.setAttribute('cx', (p.x + (R.cx - p.x) * e).toFixed(1));
      c.setAttribute('cy', (p.y + (R.cy - p.y) * e).toFixed(1));
      c.setAttribute('opacity', live ? Math.sin(Math.PI * f).toFixed(2) : '0');
    });
  };

  // Escritorio: alto del video de fondo = desde el borde superior de la
  // escena hasta un poco más abajo de las dos columnas.
  const resultados = document.querySelector('.resultados');
  const sizeResultadosMedia = () => {
    const scene = resultados && resultados.closest('[data-scene]');
    if (!scene || !resultados.offsetHeight) return;
    scene.style.setProperty('--media-h', `${resultados.offsetTop + resultados.offsetHeight + 40}px`);
  };

  const sizeRed = () => {
    sizeResultadosMedia();
    if (!red || !red.offsetWidth || !redNodes.length) return;
    R.w = red.clientWidth;
    R.h = red.clientHeight;
    R.cx = R.w / 2;
    R.cy = R.h / 2;
    redSvg.setAttribute('viewBox', `0 0 ${R.w} ${R.h}`);
    const rx = R.w * (R.w < 600 ? 0.3 : 0.36);
    const ry = R.h * (R.w < 600 ? 0.4 : 0.38);
    R.base = redNodes.map((n, i) => {
      const a = (Number(n.dataset.angle) * Math.PI) / 180;
      return {
        x: R.cx + Math.cos(a) * rx,
        y: R.cy + Math.sin(a) * ry,
        hw: n.offsetWidth / 2,
        hh: n.offsetHeight / 2,
        ph: (R.base[i] && R.base[i].ph) || Math.random() * Math.PI * 2,
      };
    });
    drawRed(performance.now());
  };

  const loopRed = (t) => {
    R.raf = null;
    if (!R.visible || !root.classList.contains('motion')) return;
    drawRed(t);
    R.raf = requestAnimationFrame(loopRed);
  };
  const kickRed = () => {
    if (!R.raf && R.visible && root.classList.contains('motion')) R.raf = requestAnimationFrame(loopRed);
  };

  if (red && R.spokes.length) {
    const setHot = (idx) => {
      redNodes.forEach((n, i) => n.classList.toggle('is-hot', i === idx));
      R.spokes.forEach((l, i) => l.classList.toggle('is-hot', i === idx));
      R.ring.forEach((l, i) => l.classList.toggle('is-hot', idx >= 0 && (i === idx || (i + 1) % R.ring.length === idx)));
    };
    red.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = red.getBoundingClientRect();
      R.mx = e.clientX - r.left;
      R.my = e.clientY - r.top;
      const node = e.target.closest('.red__node');
      setHot(node ? redNodes.indexOf(node) : -1);
      if (!root.classList.contains('motion')) drawRed(performance.now());
    });
    red.addEventListener('pointerleave', () => {
      R.mx = null;
      R.my = null;
      setHot(-1);
      if (!root.classList.contains('motion')) drawRed(performance.now());
    });
    window.addEventListener('resize', sizeRed);
    // El ancho de cada nodo cambia cuando carga su fuente: se mide de nuevo
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeRed);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        R.visible = entry.isIntersecting;
        if (R.visible) {
          sizeRed();
          red.classList.add('is-live');
          kickRed();
        }
      }, { threshold: 0.2 }).observe(red);
    } else {
      red.classList.add('is-live');
    }
  }

  /* --- Videos en bucle (escena 04) ---
     Se descargan solo al aparecer en pantalla y se pausan al salir.
     Con movimiento reducido se queda la imagen fija (poster). */
  const loopVideos = [...document.querySelectorAll('[data-loop-video]')];
  let loopObserver = null;
  const startLoops = () => {
    if (!loopVideos.length || !('IntersectionObserver' in window)) return;
    loopObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          if (!v.getAttribute('src')) { v.src = v.dataset.src; v.preload = 'auto'; }
          const played = v.play();
          if (played && played.catch) played.catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    loopVideos.forEach((v) => loopObserver.observe(v));
  };
  const stopLoops = () => {
    if (loopObserver) loopObserver.disconnect();
    loopVideos.forEach((v) => v.pause());
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
  // Pantallas estrechas en vertical (teléfonos): versión vertical del video
  const portraitQuery = window.matchMedia('(max-aspect-ratio: 2/3)');
  // Con «ahorro de datos» activado, el móvil se queda con la imagen fija
  const saveData = !!(navigator.connection && navigator.connection.saveData);

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
      video.dataset.active = (portraitQuery.matches && video.dataset.srcPortrait) || video.dataset.src;
      video.src = video.dataset.active;
      video.preload = 'auto';
      video.load();
    };

    s.progress = progress;
    s.update = () => {
      if (!s.on || !section.offsetHeight) return;     // capítulo oculto: nada que hacer
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
      // iOS no pinta los fotogramas al buscar hasta que el video se reproduce
      // una vez: se reproduce y se pausa al instante (está silenciado).
      if (!s.primed) {
        s.primed = true;
        const played = video.play();
        if (played && played.then) played.then(() => { video.pause(); s.update(); }).catch(() => {});
      }
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
        const res = await fetch(video.dataset.active);
        if (!res.ok) throw new Error(res.status);
        const blob = await res.blob();
        s.primed = false;
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
  const heroNext = hero && hero.querySelector('.hero__next');

  /* Transición 01 → 02: --fx (0→1) desenfoca y oscurece la portada al salir.
     Con video, en el último tramo del recorrido fijo; sin video, mientras
     la portada sube y deja la pantalla. */
  const updateHeroExit = () => {
    if (!hero || !inView(hero)) return;
    let fx;
    if (heroScrub.on) fx = clamp((heroScrub.progress() - 0.78) / 0.22);
    else fx = clamp(-hero.getBoundingClientRect().top / (window.innerHeight * 0.8));
    hero.style.setProperty('--fx', fx.toFixed(3));
    // Al final del recorrido, el siguiente capítulo se puede pulsar
    const exit = heroScrub.on && fx > 0.6;
    hero.classList.toggle('is-exit', exit);
    if (heroNext) heroNext.tabIndex = exit ? 0 : -1;
  };
  const updateHero = () => {
    updateHeroExit();
    heroScrub.update();
  };

  /* Escena 03 · praderas y silvopastoreo */
  const visionScrub = makeScrub(document.querySelector('[data-vision-stage]'), 'vision--scrub', '--vp');

  const stopScrub = () => { heroScrub.stop(); visionScrub.stop(); };
  /* La portada recorre su video en todas las pantallas (en teléfonos, con la
     versión vertical); la escena 03, solo en escritorio. */
  const syncScrub = () => {
    if (!motionQuery.matches) { stopScrub(); return; }
    if (desktopQuery.matches || !saveData) heroScrub.start(); else heroScrub.stop();
    if (desktopQuery.matches) visionScrub.start(); else visionScrub.stop();
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
      updateProposito();
    });
  };
  const onResize = () => { sizeRed(); onScroll(); };

  /* Al abrir un capítulo: sus apariciones se repiten, las líneas de la
     escena 04 se miden de nuevo y los efectos por scroll se recalculan. */
  afterShow = (section) => {
    if (!root.classList.contains('motion')) return;
    section.querySelectorAll('[data-reveal]').forEach((el) => {
      el.classList.remove('is-in');
      observeReveal(el);
    });
    // La red vuelve a entrar (líneas que se dibujan) cada vez que se abre
    if (red && section.contains(red)) red.classList.remove('is-live');
    sizeRed();
    onScroll();
  };

  const enableMotion = () => {
    root.classList.add('motion');
    syncScrub();
    sizeRed();
    startReveals();
    startLoops();
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
    stopLoops();
    drawRed(performance.now());
  };

  if (motionQuery.matches) enableMotion();
  motionQuery.addEventListener('change', (e) => (e.matches ? enableMotion() : disableMotion()));

  /* ---------- Formulario de contacto ----------
     Se envía a Formspree sin salir de la página. Un solo campo admite
     correo o teléfono; si es correo, se manda también como «email» para
     poder responder directamente. Sin JavaScript, el formulario se envía
     de forma normal y Formspree muestra su página de confirmación. */
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm && window.fetch) {
    const status = contactForm.querySelector('[data-contact-status]');
    const button = contactForm.querySelector('button[type="submit"]');
    const contactField = contactForm.elements.contacto;
    // La validación la hace este código (que también revisa correo o teléfono)
    contactForm.noValidate = true;
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const isPhone = (v) => /^\+?[\d\s().-]{7,20}$/.test(v) && v.replace(/\D/g, '').length >= 7;
    const say = (text, error = false) => {
      status.textContent = text;
      status.classList.toggle('is-error', error);
    };

    contactField.addEventListener('input', () => {
      contactField.setCustomValidity('');
      contactField.removeAttribute('aria-invalid');
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const value = contactField.value.trim();
      const valid = isEmail(value) || isPhone(value);
      contactField.setCustomValidity(valid ? '' : 'Escriba un correo válido o un teléfono de al menos 7 dígitos.');
      if (valid) contactField.removeAttribute('aria-invalid');
      else contactField.setAttribute('aria-invalid', 'true');
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      if (contactForm.action.includes('PENDIENTE')) {
        say('El formulario todavía no está conectado. Pronto podrá enviarnos sus datos desde aquí.', true);
        return;
      }
      const data = new FormData(contactForm);
      if (isEmail(value)) data.set('email', value);
      button.disabled = true;
      say('Enviando…');
      try {
        const res = await fetch(contactForm.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        contactForm.reset();
        say('Gracias. Recibimos sus datos y nos pondremos en contacto pronto.');
      } catch (err) {
        say('No pudimos enviar el formulario. Inténtelo de nuevo en unos minutos.', true);
      } finally {
        button.disabled = false;
      }
    });
  }

  /* ---------- Año del pie de página ---------- */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
