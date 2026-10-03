(function () {
  // Standalone hero slideshow: 5 images, 10 seconds per slide.
  document.querySelectorAll('.kubio-slideshow').forEach(function(slideshow) {
    const slides = Array.from(slideshow.querySelectorAll('.slideshow-image'));
    if (slides.length < 2) return;
    let index = slides.findIndex(s => s.classList.contains('current'));
    if (index < 0) index = 0;
    slides.forEach((s, i) => s.classList.toggle('current', i === index));
    setInterval(function() {
      slides[index].classList.remove('current');
      index = (index + 1) % slides.length;
      slides[index].classList.add('current');
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