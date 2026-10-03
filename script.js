(function () {
  'use strict';

  /* Hero slideshow: 10s display + 3s cross-fade. */
  document.querySelectorAll('.kubio-slideshow').forEach(function (slideshow) {
    const slides = Array.from(slideshow.querySelectorAll('.slideshow-image'));
    if (slides.length < 2) return;

    let index = 0;

    slides.forEach(function (slide, i) {
      slide.classList.remove('current', 'next');
      slide.style.transition = 'opacity 3s ease-in-out';
      slide.style.zIndex = i === 0 ? '2' : '0';
      slide.style.setProperty('opacity', i === 0 ? '1' : '0', 'important');
    });

    slides[0].classList.add('current');

    setInterval(function () {
      const current = slides[index];
      const nextIndex = (index + 1) % slides.length;
      const next = slides[nextIndex];

      next.style.zIndex = '2';
      next.style.setProperty('opacity', '0', 'important');

      // Force the browser to register opacity: 0 before starting the fade.
      void next.offsetWidth;

      next.style.setProperty('opacity', '1', 'important');
      current.style.zIndex = '1';

      setTimeout(function () {
        current.style.setProperty('opacity', '0', 'important');
        current.style.zIndex = '0';
        current.classList.remove('current');
        next.classList.add('current');
        index = nextIndex;
      }, 3000);
    }, 10000);
  });

  /* Scroll arrow. */
  document.querySelectorAll('[data-kubio-component="downarrow"]').forEach(function (arrow) {
    arrow.style.cursor = 'pointer';
    arrow.addEventListener('click', function () {
      const content = document.querySelector('.entry-content');
      if (content) {
        content.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Standalone mobile menu. */
  const panel = document.getElementById('mobile-panel');
  const backdrop = document.getElementById('mobile-backdrop');
  const header = document.querySelector('.wp-block-kubio-header');

  if (!panel || !backdrop || !header) return;

  const openBtn = document.createElement('button');
  openBtn.className = 'mobile-menu-toggle';
  openBtn.type = 'button';
  openBtn.setAttribute('aria-label', 'Menu openen');
  openBtn.innerHTML = '<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M64 144h384v32H64zm0 128h384v32H64zm0 128h384v32H64z"/></svg>';

  const target = header.querySelector('.wp-block-kubio-menu-offscreen__iconWrapper, [data-kubio-component="offcanvas"]');
  if (target) {
    target.innerHTML = '';
    target.appendChild(openBtn);
  } else {
    header.appendChild(openBtn);
  }

  function closeMenu() {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
  }

  openBtn.addEventListener('click', function () {
    panel.classList.add('open');
    backdrop.classList.add('open');
  });

  const closeButton = panel.querySelector('.mobile-menu-close');
  if (closeButton) closeButton.addEventListener('click', closeMenu);

  backdrop.addEventListener('click', closeMenu);

  panel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();