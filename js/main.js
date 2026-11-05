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
    window.matchMedia('(min-width: 768px)').addEventListener('change', (mq) => {
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

  /* ---------- Año del pie de página ---------- */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
