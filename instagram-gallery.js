(() => {
  'use strict';

  const gallery = document.querySelector('[data-instagram-gallery]');
  if (!gallery) return;

  const feedUrl = 'instagram-feed.json?v=1';
  const profileUrl = 'https://www.instagram.com/jeroenirene/';
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const render = (posts) => {
    if (!Array.isArray(posts) || posts.length === 0) {
      gallery.innerHTML = '<p class="instagram-gallery-status">De fotogalerij wordt binnenkort bijgewerkt. Bekijk intussen <a href="' + profileUrl + '" target="_blank" rel="noopener noreferrer">@jeroenirene op Instagram</a>.</p>';
      return;
    }

    gallery.innerHTML = posts.map((post) => {
      const firstImage = Array.isArray(post.images) ? post.images[0] : null;
      if (!firstImage || !firstImage.src) return '';
      const caption = (post.caption || 'Jeroen & Irene op Instagram').trim();
      const date = post.timestamp ? new Date(post.timestamp) : null;
      const dateLabel = date && !Number.isNaN(date.getTime())
        ? new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
        : '';
      const mediaCount = Array.isArray(post.images) && post.images.length > 1
        ? '<span class="instagram-gallery-count" aria-label="' + post.images.length + ' foto\'s">+' + (post.images.length - 1) + '</span>'
        : '';
      return '<a class="instagram-gallery-item" href="' + escapeHtml(post.permalink || profileUrl) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(caption || 'Bekijk Instagram-bericht') + '">' +
        '<img src="' + escapeHtml(firstImage.src) + '" alt="' + escapeHtml(firstImage.alt || caption || 'Foto van Jeroen & Irene') + '" loading="lazy" decoding="async">' +
        mediaCount +
        '<span class="instagram-gallery-overlay"><span>' + escapeHtml(dateLabel) + '</span><span class="instagram-gallery-caption">' + escapeHtml(caption || 'Bekijk bericht op Instagram') + '</span></span>' +
        '</a>';
    }).join('');

    if (!gallery.innerHTML.trim()) {
      gallery.innerHTML = '<p class="instagram-gallery-status">Er zijn momenteel geen foto's beschikbaar. Bekijk <a href="' + profileUrl + '" target="_blank" rel="noopener noreferrer">@jeroenirene op Instagram</a>.</p>';
    }
  };

  fetch(feedUrl, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error('Feed niet beschikbaar');
      return response.json();
    })
    .then(render)
    .catch(() => {
      gallery.innerHTML = '<p class="instagram-gallery-status">De fotogalerij kan nu niet worden geladen. Bekijk <a href="' + profileUrl + '" target="_blank" rel="noopener noreferrer">@jeroenirene op Instagram</a>.</p>';
    });
})();
