/**
 * 404.js · Página de error (Cloudflare la sirve vía not_found_handling: "404-page")
 */

const site = require('../site');

module.exports = function notFound() {
  return {
    path:    '/404',
    title:   `Página no encontrada · ${site.name}`,
    description: 'Esta página no existe. Como las promesas de campaña.',
    noindex: true,
    body: `
<div class="hero">
  <div class="hero-date">error 404</div>
  <h1 class="hero-title">NO<br>EXISTE</h1>
  <div class="hero-sub">esta página no existe, como las promesas de campaña</div>
</div>
<section class="section-wrapper">
  <div class="section">
    <a class="more-link" href="/">&larr; volver al contador</a>
  </div>
</section>
`,
  };
};
