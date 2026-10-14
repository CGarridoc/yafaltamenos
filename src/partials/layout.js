/**
 * layout.js · Esqueleto común de todas las páginas: <head>, nav y footer.
 */

const site    = require('../site');
const { esc } = require('../lib/format');

const NAV = [
  { href: '/#contador',   label: 'contador' },
  { href: '/#noticias',   label: 'noticias' },
  { href: '/cronologia',  label: 'cronología' },
  { href: '/#encuesta',   label: 'encuesta' },
];

const FOOTER_LINKS = [
  { href: '/privacidad', label: 'política de privacidad' },
  { href: '/terminos',   label: 'términos de uso' },
  { href: '/contacto',   label: 'contacto' },
];

function link({ href, label }, path, extra = '') {
  const current = href === path ? ' aria-current="page"' : '';
  return `<a href="${href}"${current}${extra}>${label}</a>`;
}

/**
 * @param {object} page
 * @param {string} page.path         Ruta pública ("/", "/cronologia", …)
 * @param {string} page.title        <title> completo
 * @param {string} page.description  Meta description (única por página)
 * @param {string} page.body         HTML del contenido principal
 * @param {string[]} [page.scripts]  Scripts extra al final del body
 * @param {string} [page.head]       HTML extra dentro de <head> (JSON-LD, etc.)
 * @param {boolean} [page.noindex]   Para la 404
 * @param {(p: string) => string} asset  Resuelve una ruta estática con hash de caché
 */
function layout(page, asset) {
  const canonical = site.url + page.path;
  const ogImage   = site.url + '/og-image';
  const ogTitle   = page.ogTitle || page.title;

  return `<!DOCTYPE html>
<html lang="${site.lang}" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}" />
${page.noindex
    ? '  <meta name="robots" content="noindex" />'
    : `  <link rel="canonical" href="${canonical}" />`}

  <!-- Open Graph -->
  <meta property="og:site_name"    content="${site.name}" />
  <meta property="og:locale"       content="${site.locale}" />
  <meta property="og:title"        content="${esc(ogTitle)}" />
  <meta property="og:description"  content="${esc(page.description)}" />
  <meta property="og:url"          content="${canonical}" />
  <meta property="og:type"         content="website" />
  <meta property="og:image"        content="${ogImage}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt"    content="Contador de días restantes del gobierno de Kast" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${esc(ogTitle)}" />
  <meta name="twitter:description" content="${esc(page.description)}" />
  <meta name="twitter:image"       content="${ogImage}" />
  <meta name="twitter:image:alt"   content="Contador de días restantes del gobierno de Kast" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />

  <!-- Styles -->
  <link rel="stylesheet" href="${asset('/static/css/style.css')}" />

  <!-- Inline theme bootstrap — runs BEFORE paint to prevent flash -->
  <script>
    (function () {
      var saved = localStorage.getItem('yfm-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = saved ? saved : (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    }());
  </script>
${page.head || ''}
</head>
<body>

<nav>
  <a class="nav-logo" href="/">YAFALTAMENOS.CL</a>

  <div class="nav-links">
    ${NAV.map((item) => link(item, page.path)).join('\n    ')}
    <a href="${site.donateUrl}" target="_blank" rel="noopener">apóyanos</a>
  </div>

  <div class="nav-right">
    <button class="theme-toggle" id="themeToggle" aria-label="Cambiar modo claro/oscuro" title="Cambiar tema">
      <span class="icon-sun" aria-hidden="true">&#9728;</span>
      <span class="icon-moon" aria-hidden="true">&#9790;</span>
    </button>
    <button class="hamburger" id="hamburger" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobileNav">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<!-- Mobile menu -->
<div class="mobile-nav" id="mobileNav" role="navigation" aria-label="Menú móvil">
  ${NAV.map((item) => link(item, page.path)).join('\n  ')}
  <a href="${site.donateUrl}" target="_blank" rel="noopener">apóyanos ☕</a>
</div>

<main>
${page.body}
</main>

<footer>
  <div>${site.name} &middot; el último día de Kast &middot; 11.03.2030</div>
  <div class="footer-links">
    ${FOOTER_LINKS.map((item) => link(item, page.path)).join('\n    ')}
  </div>
  <div>sitio de humor político &middot; no afiliado a ningún partido &middot; hecho con amor por Chile</div>
</footer>

<script src="${asset('/static/js/common.js')}"></script>
${(page.scripts || []).join('\n')}
</body>
</html>
`;
}

module.exports = layout;
