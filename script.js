(() => {
  'use strict';

  const slides = [...document.querySelectorAll('.slide')];

  if (slides.length > 1) {
    let currentIndex = 0;

    setInterval(() => {
      const current = slides[currentIndex];
      const nextIndex = (currentIndex + 1) % slides.length;
      const next = slides[nextIndex];

      next.classList.add('is-active');
      current.classList.remove('is-active');
      currentIndex = nextIndex;
    }, 10000);
  }

  const scrollButton = document.querySelector('.scroll-down');

  if (scrollButton) {
    scrollButton.addEventListener('click', () => {
      const pageHeight = window.innerHeight;

      window.scrollBy({
        top: pageHeight,
        left: 0,
        behavior: 'smooth'
      });
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.menu-close');
  const mobilePanel = document.querySelector('.mobile-panel');
  const mobileBackdrop = document.querySelector('.mobile-backdrop');

  if (!menuToggle || !mobilePanel || !mobileBackdrop) return;

  const setMenu = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    mobilePanel.setAttribute('aria-hidden', String(!open));
    mobilePanel.classList.toggle('is-open', open);
    mobileBackdrop.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuToggle.addEventListener('click', () => setMenu(true));
  menuClose?.addEventListener('click', () => setMenu(false));
  mobileBackdrop.addEventListener('click', () => setMenu(false));

  mobilePanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
})();