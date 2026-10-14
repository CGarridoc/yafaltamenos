/* ═══════════════════════════════════════════════════
   common.js · se carga en todas las páginas
   Dark mode + menú móvil
═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────
   DARK MODE
   (el tema inicial lo aplica el script inline del <head>)
───────────────────────────────────── */
document.getElementById('themeToggle').addEventListener('click', function () {
  var current = document.documentElement.getAttribute('data-theme');
  var next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('yfm-theme', next);
});

// Sigue la preferencia del sistema mientras el usuario no haya elegido una
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
  if (!localStorage.getItem('yfm-theme')) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});


/* ─────────────────────────────────────
   HAMBURGER MENU
───────────────────────────────────── */
var nav       = document.querySelector('nav');
var hamburger = document.getElementById('hamburger');
var mobileNav = document.getElementById('mobileNav');

function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Abrir menú');
}

hamburger.addEventListener('click', function () {
  var isOpen = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

// Cerrar al elegir un link o al hacer click fuera
mobileNav.addEventListener('click', function (e) {
  if (e.target.closest('a')) closeMobileNav();
});

document.addEventListener('click', function (e) {
  if (!nav.contains(e.target) && !mobileNav.contains(e.target)) {
    closeMobileNav();
  }
});
