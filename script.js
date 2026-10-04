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
      const content = document.getElementById('content');

      if (content) {
        content.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  const about = document.querySelector('.about');
  const aboutScrollUp = document.querySelector('.about-scroll-up');

  if (about && aboutScrollUp) {
    const updateAboutArrow = (entries) => {
      const entry = entries[0];
      aboutScrollUp.classList.toggle('is-visible', entry.isIntersecting && entry.intersectionRatio >= 0.97);
    };

    const aboutObserver = new IntersectionObserver(updateAboutArrow, {
      threshold: [0, 0.5, 0.9, 0.97, 1]
    });

    aboutObserver.observe(about);

    aboutScrollUp.addEventListener('click', () => {
      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');

  if (header && hero) {
    let ticking = false;

    const updateHeader = () => {
      const fadeDistance = Math.max(1, hero.offsetHeight - header.offsetHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / fadeDistance));
      const value = Math.round(255 * progress);
      const inverse = 255 - value;

      header.style.setProperty('--nav-bg-r', value);
      header.style.setProperty('--nav-bg-g', value);
      header.style.setProperty('--nav-bg-b', value);
      header.style.setProperty('--nav-bg-a', progress === 0 ? '.30' : String(progress));

      header.style.setProperty('--nav-text-r', inverse);
      header.style.setProperty('--nav-text-g', inverse);
      header.style.setProperty('--nav-text-b', inverse);

      ticking = false;
    };

    const requestHeaderUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
    window.addEventListener('resize', requestHeaderUpdate);
    updateHeader();
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