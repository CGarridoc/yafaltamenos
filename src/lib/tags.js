/**
 * tags.js · Secciones válidas de las noticias
 * La lista canónica (con tildes) es la misma del select del CMS.
 * normalizeTag acepta variantes sin tilde o con mayúsculas ("economia",
 * "Economía") y devuelve la forma canónica.
 */

const TAGS = ['economía', 'derechos', 'corrupción', 'medioambiente', 'gabinete', 'internacional'];

/* "Corrupción" → "corrupcion" (sin tildes, minúsculas) */
function fold(value) {
  return String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

const BY_FOLDED = new Map(TAGS.map((t) => [fold(t), t]));

/* Devuelve el tag canónico, o undefined si no es uno de los válidos. */
function normalizeTag(tag) {
  return BY_FOLDED.get(fold(tag));
}

module.exports = { TAGS, normalizeTag, fold };
