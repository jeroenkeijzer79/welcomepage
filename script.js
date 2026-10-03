(function () {
  // Standalone hero slideshow: each photo is shown for 10s,
  // with a 3s cross-fade between photos.
  document.querySelectorAll('.kubio-slideshow').forEach(function(slideshow) {
    const slides = Array.from(slideshow.querySelectorAll('.slideshow-image'));
    if (slides.length < 2) return;

    slides.forEach(function(slide) {
      slide.classList.remove('current', 'next');
      slide.style.opacity = '0';
      slide.style.transition = 'opacity 3s ease-in-out';
    });

    let index = 0;
    slides[index].style.opacity = '1';
    slides[index].classList.add('current');

    setInterval(function() {
      const nextIndex = (index + 1) % slides.length;

      // Put the next image underneath the current one, then fade it in.
      slides[nextIndex].style.zIndex = '2';
      slides[index].style.zIndex = '1';
      slides[nextIndex].style.opacity = '1';

      // After the 3s cross-fade, reset the old image invisibly.
      setTimeout(function() {
        slides[index].style.opacity = '0';
        slides[index].style.zIndex = '0';
        slides[index].classList.remove('current');
        slides[nextIndex].classList.add('current');
        index = nextIndex;
      }, 3000);
    }, 10000);
  });

  // Down arrow scrolls to the content below the hero.
  document.querySelectorAll('[data-kubio-component="downarrow"]').forEach(function(arrow) {
    arrow.style.cursor = 'pointer';
    arrow.addEventListener('click', function() {
      const content = document.querySelector('.entry-content');
      if (content) content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Simple standalone mobile menu.
  const panel = document.getElementById('mobile-panel');
  const backdrop = document.getElementById('mobile-backdrop');
  const openBtn = document.createElement('button');
  openBtn.className = 'mobile-menu-toggle';
  openBtn.setAttribute('aria-label', 'Menu openen');
  openBtn.innerHTML = '<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M64 144h384v32H64zm0 128h384v32H64zm0 128h384v32H64z"/></svg>';

  const header = document.querySelector('.wp-block-kubio-header');
  if (header) {
    const candidates = header.querySelectorAll('.wp-block-kubio-menu-offscreen__iconWrapper, [data-kubio-component="offcanvas"]');
    if (candidates.length) {
      const original = candidates[candidates.length - 1];
      original.innerHTML = '';
      original.appendChild(openBtn);
    } else {
      header.appendChild(openBtn);
    }
  }

  function closeMenu() {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
  }

  openBtn.addEventListener('click', function() {
    panel.classList.add('open');
    backdrop.classList.add('open');
  });

  panel.querySelector('.mobile-menu-close').addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();