/**
 * worker.js · Entry point principal — Cloudflare Workers
 * ─────────────────────────────────────────────────────────────────────────
 * Enruta /og-image al generador dinámico de SVG.
 * Cualquier otra ruta se delega a env.ASSETS (archivos estáticos del repo).
 * ─────────────────────────────────────────────────────────────────────────
 */

import { buildOGResponse } from './functions/og-image.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/og-image') {
      return buildOGResponse();
    }

    // Todo lo demás: archivos estáticos (index.html, CSS, .md, etc.)
    return env.ASSETS.fetch(request);
  },
};
