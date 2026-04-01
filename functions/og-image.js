/**
 * og-image.js · Cloudflare Workers — módulo importado por worker.js
 * ─────────────────────────────────────────────────────────────────────────
 * Genera una imagen OG dinámica en PNG (1200×630 px) con el contador
 * de días restantes del gobierno calculado en tiempo real.
 *
 * Ruta pública: https://yafaltamenos.cl/og-image
 * Cache:        1 hora en CDN (s-maxage=3600)
 *
 * Conversión SVG→PNG: @resvg/resvg-wasm (renderizado en el Worker,
 * sin dependencias externas en runtime).
 *
 * NOTA: el WASM de resvg (~3.5 MB sin comprimir) supera el límite de
 * 1 MB del plan gratuito de Workers. Se necesita Workers Paid ($5/mes)
 * o Workers Unbound para desplegar con esta dependencia.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { Resvg, initWasm } from '@resvg/resvg-wasm';
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm';

// Inicializa el WASM una sola vez por isolate.
// Guardamos la Promise para que llamadas concurrentes no dupliquen init.
let wasmReady = null;
function ensureWasm() {
  if (!wasmReady) wasmReady = initWasm(resvgWasm);
  return wasmReady;
}

// Fechas del mandato en hora de Chile (UTC-3, sin DST para simplificar)
const START_ISO  = '2026-03-11T00:00:00-03:00';
const TARGET_ISO = '2030-03-11T00:00:00-03:00';

// Paleta
const BG      = '#0d0d0d';
const RED     = '#C41E3A';
const WHITE   = '#f5f3ee';
const MUTED   = '#888888';
const BORDER  = '#2a2a2a';

// Ancho máximo de la barra de progreso (px dentro del SVG)
const BAR_MAX_W = 880;

// ─── Función exportada — llamada desde worker.js ──────────────────────────

export async function buildOGResponse() {
  await ensureWasm();

  const now    = new Date();
  const start  = new Date(START_ISO);
  const target = new Date(TARGET_ISO);

  const totalMs   = target.getTime() - start.getTime();
  const remainMs  = Math.max(0, target.getTime() - now.getTime());
  const elapsedMs = Math.max(0, now.getTime() - start.getTime());

  const days  = Math.floor(remainMs / 86_400_000);
  const pct   = Math.max(0, (remainMs  / totalMs) * 100).toFixed(1);
  const barW  = Math.min(BAR_MAX_W, Math.round((elapsedMs / totalMs) * BAR_MAX_W));

  const svg = buildSVG(days, pct, barW);

  // mode: 'original' respeta exactamente width="1200" height="630" del SVG
  const resvg    = new Resvg(svg, { fitTo: { mode: 'original' } });
  const rendered = resvg.render();
  const png      = rendered.asPng();   // Uint8Array — dimensiones garantizadas 1200×630

  return new Response(png, {
    headers: {
      'Content-Type':         'image/png',
      'Content-Disposition':  'inline',
      'Cache-Control':        'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

// ─── Generador SVG ────────────────────────────────────────────────────────

function buildSVG(days, pct, barW) {
  // Ajuste dinámico: si days tiene 4 dígitos vs menos, reduce un poco el kerning
  const numLetterSpacing = days >= 1000 ? '-12' : '-4';

  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="1200" height="630" viewBox="0 0 1200 630">

  <!-- ── Fondo ──────────────────────────────────────────────── -->
  <rect width="1200" height="630" fill="${BG}"/>

  <!-- ── Marco rojo (top / bottom / left / right) ──────────── -->
  <rect x="0"    y="0"   width="1200" height="8"   fill="${RED}"/>
  <rect x="0"    y="622" width="1200" height="8"   fill="${RED}"/>
  <rect x="0"    y="8"   width="6"    height="614" fill="${RED}"/>
  <rect x="1194" y="8"   width="6"    height="614" fill="${RED}"/>

  <!-- ── Cabecera ───────────────────────────────────────────── -->
  <!-- Sitio (monospace, rojo) -->
  <text
    x="80" y="66"
    font-family="'Courier New', Courier, monospace"
    font-size="13" font-weight="700"
    letter-spacing="5"
    fill="${RED}">YAFALTAMENOS.CL</text>

  <!-- Separador header -->
  <line x1="80" y1="84" x2="1120" y2="84" stroke="${BORDER}" stroke-width="1"/>

  <!-- ── Bloque central: número grande ─────────────────────── -->
  <!-- Sombra sutil del número (misma posición + offset) -->
  <text
    x="123" y="398"
    font-family="Impact, 'Arial Black', 'Arial Narrow', Arial, sans-serif"
    font-size="290"
    letter-spacing="${numLetterSpacing}"
    fill="#1a0005"
    aria-hidden="true">${days}</text>

  <!-- Número principal -->
  <text
    x="120" y="395"
    font-family="Impact, 'Arial Black', 'Arial Narrow', Arial, sans-serif"
    font-size="290"
    letter-spacing="${numLetterSpacing}"
    fill="${WHITE}">${days}</text>

  <!-- Etiqueta DÍAS — pegada bajo el número, blanca, misma familia -->
  <text
    x="465" y="450"
    font-family="Impact, 'Arial Black', Arial, sans-serif"
    font-size="54"
    letter-spacing="20"
    fill="${RED}">D\u00CDAS</text>

  <!-- Subtítulo -->
  <text
    x="80" y="504"
    font-family="'Courier New', Courier, monospace"
    font-size="13"
    letter-spacing="4"
    fill="${MUTED}">PARA EL \u00DALTIMO D\u00CDA DEL GOBIERNO</text>

  <!-- ── Separador + barra de progreso ─────────────────────── -->
  <line x1="80" y1="526" x2="1120" y2="526" stroke="${BORDER}" stroke-width="1"/>

  <!-- Track de progreso -->
  <rect x="80" y="539" width="${BAR_MAX_W}" height="10" rx="3" fill="#333333"/>
  <!-- Fill de progreso -->
  <rect x="80" y="539" width="${barW}" height="10" rx="3" fill="${RED}"/>

  <!-- ── Fila inferior ──────────────────────────────────────── -->
  <!-- Porcentaje (izquierda) -->
  <text
    x="80" y="602"
    font-family="'Courier New', Courier, monospace"
    font-size="16"
    letter-spacing="1"
    fill="${MUTED}">${pct}% restante · la cuenta regresiva ya empez\u00F3</text>

  <!-- Fecha objetivo (derecha) -->
  <text
    x="1120" y="602"
    font-family="Impact, 'Arial Black', Arial, sans-serif"
    font-size="26"
    letter-spacing="4"
    text-anchor="end"
    fill="${WHITE}">11 \u00B7 03 \u00B7 2030</text>

</svg>`;
}
