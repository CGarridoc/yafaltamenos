#!/usr/bin/env node
/**
 * build.js · Genera el sitio estático en /dist
 * ─────────────────────────────────────────────────────────────────────────
 *   node build.js
 *
 * 1. Lee todos los .md de content/noticias y content/hitos
 * 2. Renderiza cada página de src/pages con el layout común
 * 3. Copia static/, admin/, _headers y _redirects
 * 4. Genera sitemap.xml y robots.txt
 *
 * Cloudflare lo ejecuta antes de cada deploy (ver "build" en wrangler.jsonc).
 * Sin dependencias: solo Node ≥ 18.
 * ─────────────────────────────────────────────────────────────────────────
 */

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const site              = require('./src/site');
const layout            = require('./src/partials/layout');
const { loadCollection } = require('./src/lib/content');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

const PAGES = [
  require('./src/pages/home'),
  require('./src/pages/cronologia'),
  require('./src/pages/privacidad'),
  require('./src/pages/terminos'),
  require('./src/pages/contacto'),
  require('./src/pages/404'),
];

/* Copia tal cual al output (si existen) */
const COPY = ['static', 'admin', '_headers', '_redirects'];


/* ── Helpers ───────────────────────────────────────────────────────────── */

/* /static/* se sirve con caché "immutable" de 1 año (ver _headers), así que
   cada URL lleva un hash del contenido: si el archivo cambia, cambia la URL. */
function asset(publicPath) {
  const file = path.join(ROOT, publicPath);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
  return `${publicPath}?v=${hash}`;
}

/* "/" → index.html · "/cronologia" → cronologia.html
   (Cloudflare sirve /cronologia desde cronologia.html sin redirigir) */
function outputFile(publicPath) {
  return publicPath === '/' ? 'index.html' : publicPath.slice(1) + '.html';
}

function write(relPath, contents) {
  const file = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

/* Fecha de hoy en Chile (YYYY-MM-DD) */
function todayChile() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
}

function sitemap(pages, lastmods) {
  const urls = pages
    .filter((p) => !p.noindex)
    .map((p) => {
      const lastmod = lastmods[p.path] ? `\n    <lastmod>${lastmods[p.path]}</lastmod>` : '';
      return `  <url>\n    <loc>${site.url}${p.path}</loc>${lastmod}\n  </url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}


/* ── Build ─────────────────────────────────────────────────────────────── */

function build() {
  const started = Date.now();

  const data = {
    news:  loadCollection(path.join(ROOT, 'content/noticias')),
    hitos: loadCollection(path.join(ROOT, 'content/hitos')),
    today: todayChile(),
  };

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);

  for (const entry of COPY) {
    const src = path.join(ROOT, entry);
    if (fs.existsSync(src)) {
      fs.cpSync(src, path.join(DIST, entry), {
        recursive: true,
        filter: (f) => path.basename(f) !== '.DS_Store',
      });
    }
  }

  const pages = PAGES.map((render) => render(data, asset));
  for (const page of pages) {
    write(outputFile(page.path), layout(page, asset));
  }

  const latest = (items) => (items[0] ? items[0].sortDate : undefined);
  write('sitemap.xml', sitemap(pages, {
    '/':           latest(data.news),
    '/cronologia': latest(data.hitos),
    '/privacidad': site.legalUpdated,
    '/terminos':   site.legalUpdated,
  }));

  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

  console.log(
    `✓ build en ${Date.now() - started} ms — ` +
    `${data.news.length} noticias, ${data.hitos.length} hitos, ${pages.length} páginas → dist/`
  );
}

try {
  build();
} catch (err) {
  console.error('✗ build falló:', err.message);
  process.exit(1);
}
