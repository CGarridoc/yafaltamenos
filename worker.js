/**
 * worker.js · Entry point principal — Cloudflare Workers
 * ─────────────────────────────────────────────────────────────────────────
 * Rutas:
 *   /og-image  → PNG dinámico para Open Graph
 *   /vote      → GET (resultados encuesta) / POST (registrar voto, 1 por IP)
 *   *          → archivos estáticos vía env.ASSETS
 * ─────────────────────────────────────────────────────────────────────────
 */

import { buildOGResponse } from './functions/og-image.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/og-image') {
      return buildOGResponse();
    }

    if (pathname === '/vote') {
      return handleVote(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

/* ── Encuesta ──────────────────────────────────────────────────────────── */

const VALID_OPTIONS = new Set(['si', 'no', 'renuncia']);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

async function handleVote(request, env) {
  /* Preflight */
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'dev-local';

  /* ── GET: devuelve conteos actuales + si el usuario ya votó ── */
  if (request.method === 'GET') {
    const [si, no, renuncia, voted] = await Promise.all([
      env.VOTES.get('totals:si'),
      env.VOTES.get('totals:no'),
      env.VOTES.get('totals:renuncia'),
      env.VOTES.get('vote:' + ip),
    ]);
    return Response.json({
      si:       parseInt(si       || '0'),
      no:       parseInt(no       || '0'),
      renuncia: parseInt(renuncia || '0'),
      voted:    voted || null,
    }, { headers: CORS });
  }

  /* ── POST: registrar voto ── */
  if (request.method === 'POST') {
    /* ¿Ya votó? → devuelve resultados sin modificar */
    const existing = await env.VOTES.get('vote:' + ip);
    if (existing) {
      const [si, no, renuncia] = await Promise.all([
        env.VOTES.get('totals:si'),
        env.VOTES.get('totals:no'),
        env.VOTES.get('totals:renuncia'),
      ]);
      return Response.json({
        si:       parseInt(si       || '0'),
        no:       parseInt(no       || '0'),
        renuncia: parseInt(renuncia || '0'),
        voted:    existing,
        error:    'already_voted',
      }, { headers: CORS });
    }

    /* Parsear opción */
    let body;
    try { body = await request.json(); }
    catch { return new Response('Bad request', { status: 400 }); }

    const option = body.option;
    if (!VALID_OPTIONS.has(option)) {
      return new Response('Invalid option', { status: 400 });
    }

    /* Incrementar contador y guardar voto */
    const totalKey = 'totals:' + option;
    const current  = parseInt(await env.VOTES.get(totalKey) || '0');

    await Promise.all([
      env.VOTES.put('vote:' + ip, option),
      env.VOTES.put(totalKey, String(current + 1)),
    ]);

    /* Devolver resultados actualizados */
    const [si, no, renuncia] = await Promise.all([
      env.VOTES.get('totals:si'),
      env.VOTES.get('totals:no'),
      env.VOTES.get('totals:renuncia'),
    ]);
    return Response.json({
      si:       parseInt(si       || '0'),
      no:       parseInt(no       || '0'),
      renuncia: parseInt(renuncia || '0'),
      voted:    option,
    }, { headers: CORS });
  }

  return new Response('Method not allowed', { status: 405 });
}
