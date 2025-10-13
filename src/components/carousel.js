// Accessible carousel: auto-rotates (respects reduced motion), pause on hover, keyboard nav
(function () {
  const root = document.querySelector('.carousel');
  if (!root) return;

  const track = root.querySelector('.carousel-track');
  const slides = Array.from(root.querySelectorAll('.carousel-slide'));
  const btnPrev = root.querySelector('.prev');
  const btnNext = root.querySelector('.next');
  const dots = Array.from(root.querySelectorAll('.carousel-dots [role="tab"]'));
  const intervalMs = Number(root.dataset.interval || 7000);
  const pauseOnHover = root.dataset.pauseOnHover === 'true';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  let timer = null;

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
    updateAria();
  }

  function updateDots() {
    dots.forEach((d, i) => {
      const current = i === index;
      d.setAttribute('aria-selected', String(current));
      d.toggleAttribute('aria-current', current);
    });
  }

  function updateAria() {
    slides.forEach((s, i) => s.setAttribute('aria-hidden', String(i !== index)));
  }

  function play() {
    if (prefersReduced) return;
    stop();
    timer = setInterval(() => go(index + 1), intervalMs);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  btnPrev?.addEventListener('click', () => { go(index - 1); });
  btnNext?.addEventListener('click', () => { go(index + 1); });
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

  if (pauseOnHover) {
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);
  }

  go(0);
  play();
})();


