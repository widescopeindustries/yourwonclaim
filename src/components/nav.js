// Accessible mobile nav: toggles aria-expanded, manages hidden, and ESC to close
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-nav');
  if (!toggle || !menu) return;

  let previousFocus = null;

  function openMenu() {
    previousFocus = document.activeElement;
    toggle.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
    trapFocus(menu);
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
    releaseFocus();
    if (previousFocus) previousFocus.focus();
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      e.preventDefault();
      closeMenu();
    }
  });

  // Basic focus trap
  let focusHandler = null;
  function trapFocus(root) {
    const focusables = root.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    focusHandler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    root.addEventListener('keydown', focusHandler);
    first.focus();
  }
  function releaseFocus() {
    if (focusHandler) {
      menu.removeEventListener('keydown', focusHandler);
      focusHandler = null;
    }
  }
})();


