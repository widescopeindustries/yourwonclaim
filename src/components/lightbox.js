// Accessible lightbox using <dialog>; supports arrow keys, ESC, and focus management
(function () {
  const gallery = document.querySelector('[data-lightbox="proof"]') || document.querySelector('.gallery');
  const dialog = document.querySelector('.lightbox');
  if (!gallery || !dialog) return;

  const img = dialog.querySelector('.lightbox-img');
  const btnClose = dialog.querySelector('.lightbox-close');
  const btnPrev = dialog.querySelector('.lightbox-prev');
  const btnNext = dialog.querySelector('.lightbox-next');
  const items = Array.from(gallery.querySelectorAll('.gallery-item'));
  let index = 0;
  let previousFocus = null;

  function open(i) {
    index = i;
    previousFocus = document.activeElement;
    setImage(index);
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    btnClose.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    if (dialog.open) dialog.close(); else dialog.removeAttribute('open');
    document.removeEventListener('keydown', onKeydown);
    if (previousFocus) previousFocus.focus();
  }

  function setImage(i) {
    const btn = items[i];
    const src = btn?.getAttribute('data-src');
    const thumb = btn?.querySelector('img');
    img.src = src || thumb?.src || '';
    img.alt = thumb?.alt || 'Proof image';
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }

  function prev() { index = (index - 1 + items.length) % items.length; setImage(index); }
  function next() { index = (index + 1) % items.length; setImage(index); }

  items.forEach((btn, i) => {
    btn.addEventListener('click', () => open(i));
  });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);
})();


