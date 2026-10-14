/**
 * home.js · /  →  contador + últimas noticias + encuesta
 */

const site = require('../site');
const { esc, fmtMonth } = require('../lib/format');

function newsItem(n, i) {
  return `      <article class="news-item">
        <div class="news-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="news-body">
          <div class="news-tag">${esc(n.tag)}</div>
          <h3 class="news-hl">${esc(n.title)}</h3>
          <div class="news-date"><time datetime="${n.sortDate}">${fmtMonth(n.sortDate)}</time></div>
        </div>
      </article>`;
}

function websiteSchema(description) {
  const data = {
    '@context':     'https://schema.org',
    '@type':        'WebSite',
    name:           site.name,
    alternateName:  'Ya Falta Menos',
    url:            site.url + '/',
    description,
    inLanguage:     'es-CL',
  };
  // "<" escapado para que el JSON nunca pueda cerrar el <script>
  const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
  return `  <script type="application/ld+json">\n${json}\n  </script>`;
}

module.exports = function home({ news, hitos }, asset) {
  const description =
    'Contando cada segundo que le queda al gobierno de Kast. El último día: 11 de marzo de 2030.';
  const latest = news.slice(0, site.homeNewsLimit);

  const newsHtml = latest.length
    ? latest.map(newsItem).join('\n')
    : '      <p class="empty-msg">No hay noticias disponibles.</p>';

  return {
    path:  '/',
    title: `${site.name} · El último día de Kast · 11.03.2030`,
    ogTitle: `${site.name} · El último día de Kast`,
    description,
    head: websiteSchema(description),
    scripts: [
      `<script src="${asset('/static/js/home.js')}"></script>`,
      // Netlify Identity: redirige al panel /admin tras aceptar una invitación del CMS
      `<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", function (user) {
      if (!user) {
        window.netlifyIdentity.on("login", function () {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>`,
    ],
    body: `
<!-- ══════════════════════════════════════
     HERO
══════════════════════════════════════ -->
<div class="hero">
  <div class="hero-date">11 · 03 · 2030</div>
  <h1 class="hero-title">YA FALTA<br>MENOS</h1>
  <div class="hero-sub">contando cada segundo que le queda al gobierno de Kast</div>
</div>


<!-- ══════════════════════════════════════
     COUNTDOWN
══════════════════════════════════════ -->
<div class="countdown" id="contador">
  <div class="cd-grid">
    <div class="cd-cell">
      <span class="cd-num" id="cd-d">—</span>
      <span class="cd-lbl">días</span>
    </div>
    <div class="cd-cell">
      <span class="cd-num" id="cd-h">—</span>
      <span class="cd-lbl">horas</span>
    </div>
    <div class="cd-cell">
      <span class="cd-num" id="cd-m">—</span>
      <span class="cd-lbl">minutos</span>
    </div>
    <div class="cd-cell">
      <span class="cd-num" id="cd-s">—</span>
      <span class="cd-lbl">segundos</span>
    </div>
    <div class="cd-cell ms-cell" aria-hidden="true">
      <span class="cd-num" id="cd-ms">—</span>
      <span class="cd-lbl">ms</span>
    </div>
  </div>

  <div class="progress-wrap">
    <div class="prog-track">
      <div class="prog-fill" id="pf" style="width:0%"></div>
    </div>
    <div class="prog-meta">
      <span>11 mar 2026</span>
      <span class="prog-pct" id="pp">0.00%</span>
      <span>11 mar 2030</span>
    </div>
  </div>
</div>


<!-- ══════════════════════════════════════
     TAGLINE
══════════════════════════════════════ -->
<div class="tagline">
  <h2>Parece una eternidad...</h2>
  <p>cada segundo cuenta &middot; Chile merece más</p>
</div>


<!-- ══════════════════════════════════════
     SOCIAL SHARING
══════════════════════════════════════ -->
<div class="sharing">
  <button class="share-btn" id="shareTwitter">
    <span class="share-btn-icon" aria-hidden="true">&#120143;</span>
    compartir en X
  </button>
  <button class="share-btn" id="shareWhatsapp">
    <span class="share-btn-icon" aria-hidden="true">&#9679;</span>
    whatsapp
  </button>
  <button class="share-btn" id="copyLink">
    <span class="share-btn-icon" aria-hidden="true">&#8853;</span>
    <span id="copyText">copiar link</span>
  </button>
</div>


<!-- ══════════════════════════════════════
     DONATE STRIP
══════════════════════════════════════ -->
<div class="donate-strip">
  <a class="donate-btn"
     href="${site.donateUrl}"
     target="_blank"
     rel="noopener noreferrer">
    &#9749; apóyanos con un café
  </a>
</div>


<!-- ══════════════════════════════════════
     NOTICIAS — EL MURO DE LOS LAMENTOS
══════════════════════════════════════ -->
<section class="section-wrapper" id="noticias">
  <div class="section">
    <div class="sec-eyebrow">registro público</div>
    <h2 class="sec-title">EL MURO DE LOS LAMENTOS</h2>
    <div class="news-list">
${newsHtml}
    </div>
    <a class="more-link" href="/cronologia">ver la cronología completa (${hitos.length} hitos) &rarr;</a>
  </div>
</section>

<div class="divider-full"></div>


<!-- ══════════════════════════════════════
     ENCUESTA
══════════════════════════════════════ -->
<section class="section-wrapper" id="encuesta">
  <div class="section">
    <div class="sec-eyebrow">democracia directa</div>
    <h2 class="sec-title">LA PREGUNTA DEL MILLÓN</h2>
    <div class="poll-wrapper">
      <p class="poll-question">¿Crees que Kast termina su mandato?</p>
      <div class="poll-options" id="poll-options">
        <button class="poll-btn" data-option="si">Sí, lo termina</button>
        <button class="poll-btn" data-option="no">No, cae antes</button>
        <button class="poll-btn" data-option="renuncia">Renuncia él solo</button>
      </div>
      <div class="poll-results" id="poll-results"></div>
      <div class="poll-status" id="poll-status">cargando&hellip;</div>
    </div>
  </div>
</section>
`,
  };
};
