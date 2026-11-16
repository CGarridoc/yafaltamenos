#!/usr/bin/env node
/**
 * fetch-news.js · Borradores automáticos de noticias
 * ─────────────────────────────────────────────────────────────────────────
 *   ANTHROPIC_API_KEY=... node scripts/fetch-news.js [--dry-run]
 *
 * 1. Publica los borradores (published: false) cuyo auto_publish_at ya pasó
 * 2. Lee los feeds de los medios y se queda con los titulares de las últimas
 *    24 h que hablan del gobierno (ver KEYWORDS)
 * 3. Agrupa los titulares que cuentan la misma noticia en distintos medios,
 *    descarta las ya cubiertas y elige hasta 3, priorizando las que más
 *    medios repiten
 * 4. Pide a Claude un titular satírico, tag y excerpt para cada una y
 *    escribe content/noticias/YYYY-MM-DD-slug.md con published: false
 *
 * Si la API falla (o no hay key), el borrador se guarda igual con el titular
 * original. Todo lo que se genera queda en data/news-history.json, para no
 * volver a crear una noticia aunque se borre su .md.
 *
 * --dry-run: muestra lo que haría sin escribir nada ni llamar a la API.
 * Lo corre .github/workflows/daily-news.yml todos los días a las 07:00 (Chile).
 * ─────────────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const site = require('../src/site');
const { parseFrontmatter } = require('../src/lib/content');
const { TAGS, normalizeTag, fold } = require('../src/lib/tags');

const ROOT         = path.join(__dirname, '..');
const NEWS_DIR     = path.join(ROOT, 'content/noticias');
const HISTORY_FILE = path.join(ROOT, 'data/news-history.json');

const MODEL        = 'claude-sonnet-4-5';
const MAX_PER_DAY  = 3;
const MAX_TITLE    = 180;
const HOUR         = 60 * 60 * 1000;
const WINDOW       = 24 * HOUR;      // antigüedad máxima de un titular
const PUBLISH_IN   = 24 * HOUR;      // borrador → publicado
/* El cron corre una vez al día, y GitHub a veces lo adelanta o atrasa unos
   minutos. Sin este margen, un borrador creado a las 07:03 no se publicaría
   en la corrida de las 07:01 del día siguiente, sino un día después. */
const PUBLISH_GRACE = 2 * HOUR;
const HISTORY_DAYS = 60;

const DRY_RUN = process.argv.includes('--dry-run');
const USER_AGENT = 'Mozilla/5.0 (compatible; yafaltamenos-bot/1.0; +https://yafaltamenos.cl)';

/* Feeds verificados en noviembre de 2026.
   - El Mostrador y CNN Chile no publican RSS: se usa su sitemap de Google
     News (trae titular y fecha, sin resumen).
   - Emol no tiene RSS ni sitemap de noticias recientes: se omite.
   - El RSS de Biobío solo trae los últimos 20 titulares (~1 h). */
const SOURCES = [
  { name: 'Biobío',       type: 'rss',     urls: ['https://www.biobiochile.cl/static/feed-rss'] },
  { name: 'El Mostrador', type: 'sitemap', urls: ['https://www.elmostrador.cl/sitemap_news.xml'] },
  { name: 'Cooperativa',  type: 'rss',     urls: [
    'https://www.cooperativa.cl/noticias/site/tax/port/all/rss_3___1.xml',               // País
    'https://www.cooperativa.cl/noticias/site/cache/nroedic/todasdia/todasdia_rss.xml',  // todas las del día
  ] },
  { name: 'CNN Chile',    type: 'sitemap', urls: ['https://www.cnnchile.com/_files/sitemaps/sitemap_news.xml'] },
  { name: 'La Tercera',   type: 'rss',     urls: [
    'https://www.latercera.com/arc/outboundfeeds/rss/category/politica/?outputType=xml',
    'https://www.latercera.com/arc/outboundfeeds/rss/?outputType=xml',
  ] },
];

/* Se comparan sin tildes y en minúsculas; aceptan plural ("ministros", "expulsiones"). */
const KEYWORDS = ['kast', 'gobierno', 'ministro', 'ministra', 'la moneda', 'gabinete', 'rabat',
  'quiroz', 'aprobacion', 'cadem', 'criteria', 'expulsion', 'deportacion'];
const KEYWORD_RE = new RegExp(`\\b(?:${KEYWORDS.join('|')})(?:s|es)?\\b`);

/* Palabras que no sirven para decidir si dos titulares hablan de lo mismo */
const STOPWORDS = new Set(`
  para por con los las del que una uno unos unas sus tras ante como mas pero sin sobre entre
  este esta estos estas ese esa esos esas son fue ser era han hay sera dice dijo asegura afirma
  tiene tienen hace desde hasta cuando donde quien quienes porque ahora tambien todo todos
  gobierno ministro ministra ministros presidente kast chile chileno chilena nuevo nueva
`.split(/\s+/).filter(Boolean));


/* ── Texto ─────────────────────────────────────────────────────────────── */

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…',
  laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', ndash: '–', mdash: '—',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', uuml: 'ü',
  Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ',
};

function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1));
    }
    return ENTITIES[e] ?? m;
  });
}

/* Contenido de un elemento XML como texto plano (sin CDATA, HTML ni entidades) */
function xmlText(raw) {
  if (raw == null) return '';
  const text = decodeEntities(raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1'));
  return decodeEntities(text.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/* Primer <name> (con o sin prefijo de namespace) dentro de un bloque XML */
function xmlField(block, name) {
  const m = block.match(new RegExp(`<(?:[\\w-]+:)?${name}\\b[^>]*>([\\s\\S]*?)</(?:[\\w-]+:)?${name}>`));
  return m ? m[1] : null;
}

/* Palabras con peso de un titular, recortadas a 5 letras para que
   "camionero/camioneros" o "respaldo/respalda" cuenten como la misma.
   Las cifras ("27", "700") se conservan: suelen ser lo que identifica la noticia. */
function tokens(title) {
  return new Set(
    fold(title).replace(/[^a-z0-9ñ]+/g, ' ').split(' ')
      .filter((w) => (/^\d+$/.test(w) ? w.length >= 2 : w.length >= 3) && !STOPWORDS.has(w))
      .map((w) => w.slice(0, 5))
  );
}

/* Dos titulares cuentan lo mismo si comparten suficientes palabras con peso,
   medido sobre el más corto (los titulares de distintos medios varían mucho). */
function similar(a, b, { minShared = 2, minRatio = 0.5 } = {}) {
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  return shared >= minShared && shared / Math.min(a.size, b.size) >= minRatio;
}

/* Más estricto para comparar contra lo ya publicado: una noticia nueva
   sobre un tema recurrente (otra encuesta Cadem) no debe quedar fuera. */
const SAME_STORY = { minShared: 3, minRatio: 0.6 };

/* Clave de comparación de URLs: sin query, hash, "www." ni "/" final */
function urlKey(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '') + u.pathname.replace(/\/+$/, '');
  } catch {
    return String(url).trim();
  }
}

function slugify(text, max = 60) {
  const slug = fold(text).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (slug.length <= max) return slug;
  const cut = slug.slice(0, max);
  return cut.slice(0, cut.lastIndexOf('-') > 20 ? cut.lastIndexOf('-') : max);
}

/* String para el frontmatter entre comillas dobles. content.js no interpreta
   escapes, así que las comillas internas pasan a “tipográficas”. */
function fmString(s) {
  const clean = String(s).replace(/\s+/g, ' ').trim()
    .replace(/"([^"]*)"/g, '“$1”').replace(/"/g, '”');
  return `"${clean}"`;
}

function truncate(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > max / 2 ? cut.lastIndexOf(' ') : cut.length) + '…';
}

/* Fecha de hoy en Chile (YYYY-MM-DD) */
function todayChile(now) {
  return new Date(now).toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
}

function isoSeconds(ms) {
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');
}


/* ── Feeds ─────────────────────────────────────────────────────────────── */

function parseRss(xml) {
  return (xml.match(/<item\b[\s\S]*?<\/item>/g) || []).map((block) => ({
    title:   xmlText(xmlField(block, 'title')),
    url:     xmlText(xmlField(block, 'link')),
    date:    Date.parse(xmlText(xmlField(block, 'pubDate'))),
    // Biobío cierra el resumen con "… Continua leyendo "…" The post … appeared first on …"
    summary: xmlText(xmlField(block, 'description'))
      .replace(/\s*…?\s*Contin[uú]a leyendo[\s\S]*$/i, '…')
      .replace(/\s*The post [\s\S]*appeared first on[\s\S]*$/, ''),
  }));
}

/* Sitemap de Google News: <url><loc/><news:news><news:title/><news:publication_date/> */
function parseNewsSitemap(xml) {
  return (xml.match(/<url>[\s\S]*?<\/url>/g) || []).map((block) => ({
    title:   xmlText(xmlField(block, 'title')),
    url:     xmlText(xmlField(block, 'loc')),
    date:    Date.parse(xmlText(xmlField(block, 'publication_date'))),
    summary: '',
  }));
}

async function fetchSource(source) {
  const seen  = new Set();
  const items = [];
  for (const url of source.urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const parsed = source.type === 'rss' ? parseRss(xml) : parseNewsSitemap(xml);
      if (!parsed.length) throw new Error('el feed no trae noticias');
      for (const item of parsed) {
        const key = urlKey(item.url);
        if (!item.title || !item.url || seen.has(key)) continue;
        seen.add(key);
        items.push({ ...item, source: source.name });
      }
    } catch (err) {
      console.warn(`⚠ ${source.name}: ${url} → ${err.message}`);
    }
  }
  return items;
}


/* ── Contenido existente ───────────────────────────────────────────────── */

function newsFiles() {
  return fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith('.md')).sort();
}

/* Paso 1: published: false → true en los borradores vencidos */
function publishDue(now) {
  const published = [];
  for (const file of newsFiles()) {
    const fullPath = path.join(NEWS_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data } = parseFrontmatter(raw);
    if (data.published !== false || !data.auto_publish_at) continue;

    const at = Date.parse(data.auto_publish_at);
    if (Number.isNaN(at)) {
      console.warn(`⚠ ${file}: auto_publish_at inválido ("${data.auto_publish_at}")`);
      continue;
    }
    if (at > now + PUBLISH_GRACE) continue;

    if (!DRY_RUN) {
      fs.writeFileSync(fullPath, raw.replace(/^published:[ \t]*false[ \t]*$/m, 'published: true'));
    }
    published.push(file);
  }
  return published;
}

function loadHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw new Error(`${path.relative(ROOT, HISTORY_FILE)}: ${err.message}`);
  }
}

/* URLs y titulares ya cubiertos: los .md actuales + el historial (que
   recuerda también los borradores que se borraron) */
function knownStories(history) {
  const urls   = new Set(history.map((h) => urlKey(h.url)));
  const titles = history.map((h) => tokens(h.title));
  for (const file of newsFiles()) {
    const { data } = parseFrontmatter(fs.readFileSync(path.join(NEWS_DIR, file), 'utf8'));
    if (data.source) urls.add(urlKey(data.source));
    if (data.source_title) titles.push(tokens(data.source_title));
    if (data.title) titles.push(tokens(data.title));
  }
  return { urls, titles };
}


/* ── Selección ─────────────────────────────────────────────────────────── */

/* Agrupa los titulares que cuentan la misma noticia */
function cluster(items) {
  const groups = [];
  for (const item of [...items].sort((a, b) => b.date - a.date)) {
    const tk = tokens(item.title);
    const group = groups.find((g) => g.items.some((other) => similar(tk, other.tokens)));
    if (group) group.items.push({ ...item, tokens: tk });
    else groups.push({ items: [{ ...item, tokens: tk }] });
  }
  for (const g of groups) {
    g.sources = new Set(g.items.map((i) => i.source));
    g.latest  = Math.max(...g.items.map((i) => i.date));
    // El titular que se usa: el que trae el resumen más completo
    g.main = [...g.items].sort((a, b) => b.summary.length - a.summary.length)[0];
  }
  return groups;
}

function isKnown(group, known) {
  return group.items.some((item) =>
    known.urls.has(urlKey(item.url)) ||
    known.titles.some((t) => similar(item.tokens, t, SAME_STORY)));
}


/* ── Titular satírico ──────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `Escribes titulares para YaFaltaMenos.cl, un sitio chileno de sátira política que lleva la cuenta regresiva al último día del gobierno de José Antonio Kast (11 de marzo de 2030). El diseño es sobrio y los titulares también: sarcasmo seco, sin estridencia.

Así suenan los titulares del sitio:
- "Prometió expulsar 300.000 inmigrantes. Van 120. Faltan 299.880. El plan va según lo previsto."
- "Primer cambio de gabinete: día 70. El récord anterior era de 126 días. Pero él no venía a improvisar."
- "Hacienda descubre un error de $10.500 millones en las cuentas del gobierno anterior. Las propias: impecables, según Hacienda."

La ironía sale de poner los hechos uno al lado del otro y cerrar con un remate corto, dicho con cara de póker.

Reglas:
- Usa solo hechos, cifras, nombres y citas que estén en el material de la fuente que te entrego. No inventes datos ni consecuencias. El remate puede ser irónico, pero no puede presentar como hecho algo que la fuente no dice.
- Sin insultos, apodos ni descalificaciones personales: se ironiza sobre lo que se hace y se dice, no sobre las personas.
- Sin emojis, hashtags ni signos de exclamación.
- Español de Chile, registro sobrio. Sin garabatos.
- title: máximo ${MAX_TITLE} caracteres, espacios incluidos.
- excerpt: una sola oración que cuente qué pasó (quién, qué) con un toque de ironía. Máximo 200 caracteres.
- tag: exactamente uno de estos: ${TAGS.join(', ')}.
  economía = plata, impuestos, presupuesto, empleo, pensiones. derechos = migración, expulsiones, seguridad, protestas, derechos sociales. corrupción = investigaciones, fiscalía, conflictos de interés. medioambiente = clima, proyectos extractivos, recursos naturales. gabinete = ministros, La Moneda, encuestas de aprobación y la gestión del gobierno en general. internacional = relaciones exteriores y noticias de otros países.

Responde solo con un objeto JSON, sin texto antes ni después:
{"title": "...", "tag": "...", "excerpt": "..."}`;

function userPrompt(group, now) {
  const { main } = group;
  const day = Math.floor((now - Date.parse(site.start)) / (24 * HOUR));
  const others = group.items.filter((i) => i !== main).map((i) => `- ${i.source}: ${i.title}`);
  return [
    `Medio: ${main.source}`,
    `Titular original: ${main.title}`,
    `Resumen: ${main.summary ? truncate(main.summary, 1500) : '(el medio no publica resumen)'}`,
    others.length ? `Otros medios con la misma noticia:\n${others.join('\n')}` : '',
    `Contexto: hoy es el día ${day} del gobierno de Kast (asumió el 11 de marzo de 2026).`,
  ].filter(Boolean).join('\n\n');
}

/* Valida la respuesta del modelo; devuelve null si no sirve */
function parseDraft(text) {
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  let data;
  try { data = JSON.parse(json); } catch { return null; }
  const title   = String(data.title ?? '').trim();
  const excerpt = String(data.excerpt ?? '').trim();
  const tag     = normalizeTag(data.tag);
  if (!title || title.length > MAX_TITLE || !excerpt || !tag) return null;
  return { title, tag, excerpt };
}

async function satirize(client, group, now) {
  const prompt = userPrompt(group, now);
  for (let attempt = 1; attempt <= 2; attempt++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });
    if (response.stop_reason === 'refusal') throw new Error('el modelo se negó');
    const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    const draft = parseDraft(text);
    if (draft) return draft;
    console.warn(`⚠ respuesta inválida (intento ${attempt}): ${text.slice(0, 200)}`);
  }
  throw new Error('el modelo no devolvió un JSON válido');
}

/* Tag de respaldo cuando no hay API: por palabras del titular */
const TAG_HINTS = [
  ['internacional', /\b(eeuu|estados unidos|trump|argentina|milei|peru|bolivia|venezuela|onu|china|cancille)/],
  ['corrupción',    /(corrup|fraude|fiscalia|querella|formaliza|soborno|cohecho|licitaci)/],
  ['medioambiente', /(ambient|clima|glaciar|incendio|sequia|forestal|litio|mineri|contamina)/],
  ['derechos',      /(expuls|deport|migra|derecho|carabiner|protesta|marcha|indulto|seguridad)/],
  ['economía',      /(econom|hacienda|impuesto|presupuesto|pension|sueldo|empleo|inflacion|ipc|precio|deuda|fiscal|camioner|combustible)/],
];

function fallbackDraft(group) {
  const { main } = group;
  const folded = fold(main.title);
  const tag = (TAG_HINTS.find(([, re]) => re.test(folded)) || ['gabinete'])[0];
  const firstSentence = main.summary.split(/(?<=[.!?])\s/)[0];
  return {
    title:   truncate(main.title, MAX_TITLE),
    tag,
    excerpt: truncate(firstSentence || main.title, 200),
  };
}


/* ── Archivo ───────────────────────────────────────────────────────────── */

function writeDraft(group, draft, now) {
  const date = todayChile(now);
  const base = `${date}-${slugify(group.main.title) || 'noticia'}`;
  let file = `${base}.md`;
  for (let n = 2; fs.existsSync(path.join(NEWS_DIR, file)); n++) file = `${base}-${n}.md`;

  const contents = `---
title: ${fmString(draft.title)}
date: ${date}
tag: ${draft.tag}
excerpt: ${fmString(draft.excerpt)}
source: ${fmString(group.main.url)}
source_title: ${fmString(group.main.title)}
published: false
auto_publish_at: ${isoSeconds(now + PUBLISH_IN)}
---
`;
  if (!DRY_RUN) fs.writeFileSync(path.join(NEWS_DIR, file), contents);
  return file;
}


/* ── Main ──────────────────────────────────────────────────────────────── */

async function main() {
  const now = Date.now();
  if (DRY_RUN) console.log('(dry run: no se escribe nada ni se llama a la API)\n');

  // 1. Auto-publicación
  const published = publishDue(now);
  for (const file of published) console.log(`✓ publicado: ${file}`);

  // 2. Feeds
  const perSource = await Promise.all(SOURCES.map(fetchSource));
  const all = perSource.flat();
  if (!all.length) throw new Error('ningún feed respondió');

  const relevant = all.filter((i) =>
    now - i.date <= WINDOW && i.date <= now + HOUR && KEYWORD_RE.test(fold(i.title)));
  for (const [i, s] of SOURCES.entries()) {
    const n = relevant.filter((r) => r.source === s.name).length;
    console.log(`· ${s.name}: ${perSource[i].length} titulares, ${n} relevantes`);
  }

  // 3. Selección
  const history = loadHistory();
  const known   = knownStories(history);
  const groups  = cluster(relevant)
    .filter((g) => !isKnown(g, known))
    .sort((a, b) => b.sources.size - a.sources.size || b.latest - a.latest)
    .slice(0, MAX_PER_DAY);

  if (!groups.length) {
    console.log('\nSin noticias nuevas.');
    return;
  }

  // 4. Borradores
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !DRY_RUN) console.warn('⚠ falta ANTHROPIC_API_KEY: se usan los titulares originales');
  const client = apiKey && !DRY_RUN ? new Anthropic({ apiKey, timeout: 60_000 }) : null;

  console.log('');
  for (const group of groups) {
    let draft;
    let via = 'IA';
    if (client) {
      try {
        draft = await satirize(client, group, now);
      } catch (err) {
        const detail = err instanceof Anthropic.APIError ? `API ${err.status}: ${err.message}` : err.message;
        console.warn(`⚠ ${group.main.title}: ${detail}`);
      }
    }
    if (!draft) {
      draft = fallbackDraft(group);
      via = 'titular original';
    }

    const file = writeDraft(group, draft, now);
    console.log(`✓ ${file}  [${draft.tag} · ${via} · ${[...group.sources].join(', ')}]`);
    console.log(`    original: ${group.main.title}`);
    console.log(`    titular:  ${draft.title}`);
    console.log(`    excerpt:  ${draft.excerpt}\n`);

    for (const item of group.items) {
      history.push({ date: todayChile(now), url: item.url, title: item.title });
    }
  }

  // 5. Historial (se poda lo que ya no puede volver a aparecer)
  if (!DRY_RUN) {
    const cutoff = todayChile(now - HISTORY_DAYS * 24 * HOUR);
    const kept = history.filter((h) => h.date >= cutoff);
    fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(kept, null, 2) + '\n');
  }
}

main().catch((err) => {
  console.error('✗ fetch-news falló:', err.message);
  process.exit(1);
});
