/**
 * og-image.js · Cloudflare Workers — módulo importado por worker.js
 * ─────────────────────────────────────────────────────────────────────────
 * Genera una imagen OG dinámica en PNG (1200×630 px) con el contador
 * de días restantes del gobierno calculado en tiempo real.
 *
 * Ruta pública: https://yafaltamenos.cl/og-image
 * Cache:        1 hora en CDN (s-maxage=3600)
 *
 * Fuentes: Oswald, EB Garamond Italic y Roboto Mono, las del sitio
 *          (recortadas y embebidas en og-fonts.js).
 * NOTA:    el WASM de resvg (~3.5 MB) requiere Workers Paid ($5/mes).
 * ─────────────────────────────────────────────────────────────────────────
 */

import { Resvg, initWasm } from '@resvg/resvg-wasm';
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm';
import { OSWALD, GARAMOND_ITALIC, ROBOTO_MONO } from './og-fonts.js';

// Inicializa el WASM una sola vez por isolate.
let wasmReady = null;
function ensureWasm() {
  if (!wasmReady) wasmReady = initWasm(resvgWasm);
  return wasmReady;
}

// Fechas del mandato en hora de Chile (UTC-3, sin DST para simplificar)
const START_ISO  = '2026-03-11T00:00:00-03:00';
const TARGET_ISO = '2030-03-11T00:00:00-03:00';

// Paleta (modo oscuro del sitio)
const BG     = '#0d0d0d';
const RED    = '#C41E3A';
const WHITE  = '#f5f3ee';
const MUTED  = '#999999';
const BORDER = '#2a2a2a';

// Barra de progreso, de borde a borde del contenido
const BAR_X = 80;
const BAR_W = 1040;

// Número grande: tamaño, tracking y ancho de cada dígito en Oswald Bold
// (unidades por 1000 em). Sirve para pegar la columna "DÍAS" al número,
// que es más angosto cuando quedan menos de 1000 días.
const NUM_SIZE    = 290;
const NUM_SPACING = -4;
const DIGIT_W = { 0: 550, 1: 385, 2: 514, 3: 514, 4: 524, 5: 509, 6: 538, 7: 439, 8: 521, 9: 538 };

// ─── Función exportada — llamada desde worker.js ──────────────────────────

export async function buildOGResponse() {
  await ensureWasm();

  const now    = new Date();
  const start  = new Date(START_ISO);
  const target = new Date(TARGET_ISO);

  const totalMs   = target.getTime() - start.getTime();
  const remainMs  = Math.max(0, target.getTime() - now.getTime());
  const elapsedMs = Math.min(totalMs, Math.max(0, now.getTime() - start.getTime()));

  const days = Math.floor(remainMs / 86_400_000);
  const done = elapsedMs / totalMs;   // 0 → 1

  const svg = buildSVG(days, done);

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'original' },
    font: {
      loadSystemFonts:   false,   // no buscar fuentes del sistema (no existen en Workers)
      fontBuffers:       [OSWALD, GARAMOND_ITALIC, ROBOTO_MONO],
      defaultFontFamily: 'Oswald',
    },
  });
  const rendered = resvg.render();
  const png      = rendered.asPng();   // Uint8Array — dimensiones garantizadas 1200×630

  return new Response(png, {
    headers: {
      'Content-Type':           'image/png',
      'Content-Disposition':    'inline',
      'Cache-Control':          'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

// ─── Generador SVG ────────────────────────────────────────────────────────
// La esquina inferior izquierda queda vacía a propósito: X pone ahí la
// etiqueta con el título del sitio, encima de la imagen.

const OSW  = 'font-family="Oswald" font-weight="700"';
const GAR  = 'font-family="EB Garamond" font-style="italic"';
const MONO = 'font-family="Roboto Mono" font-weight="500"';

function buildSVG(days, done) {
  const num   = String(days);
  const numW  = [...num].reduce((w, d) => w + DIGIT_W[d], 0) * NUM_SIZE / 1000
              + NUM_SPACING * (num.length - 1);
  // Columna derecha: 100 px después del número, sin pasar de 770 para que
  // "del gobierno de Kast." quepa antes del margen.
  const colX  = Math.round(Math.min(770, 72 + numW + 100));
  const fillW = Math.round(BAR_W * done);
  const pct   = (done * 100).toFixed(1).replace('.', ',');

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="1200" height="630" viewBox="0 0 1200 630">

  <!-- ── Fondo y franja roja superior ───────────────────────── -->
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="10" fill="${RED}"/>

  <!-- ── Cabecera ───────────────────────────────────────────── -->
  <text x="80" y="82" ${OSW} font-size="22" letter-spacing="7" fill="${RED}">YAFALTAMENOS.CL</text>
  <text x="1120" y="82" ${OSW} font-size="22" letter-spacing="7" text-anchor="end"
    fill="${WHITE}">11 · 03 · 2030</text>
  <rect x="80" y="106" width="1040" height="1" fill="${BORDER}"/>

  <!-- ── Número grande + DÍAS ───────────────────────────────── -->
  <text x="72" y="410" ${OSW} font-size="${NUM_SIZE}" letter-spacing="${NUM_SPACING}"
    fill="${WHITE}">${num}</text>
  <text x="${colX - 4}" y="268" ${OSW} font-size="118" letter-spacing="6" fill="${RED}">DÍAS</text>
  <text x="${colX}" y="336" ${GAR} font-size="46" fill="${WHITE}">para el último día</text>
  <text x="${colX}" y="390" ${GAR} font-size="46" fill="${WHITE}">del gobierno de Kast.</text>

  <!-- ── Barra de progreso ──────────────────────────────────── -->
  <rect x="${BAR_X}" y="466" width="${BAR_W}" height="6" rx="3" fill="${BORDER}"/>
  <rect x="${BAR_X}" y="466" width="${fillW}" height="6" rx="3" fill="${RED}"/>
  <circle cx="${BAR_X + fillW}" cy="469" r="10" fill="${RED}"/>
  <text x="1120" y="512" ${MONO} font-size="19" letter-spacing="3" text-anchor="end"
    fill="${RED}">${pct}% DEL MANDATO CUMPLIDO</text>

  <!-- ── Remate ─────────────────────────────────────────────── -->
  <text x="1120" y="585" ${GAR} font-size="40" text-anchor="end" fill="${MUTED}">Parece una eternidad…</text>

</svg>`;
}
