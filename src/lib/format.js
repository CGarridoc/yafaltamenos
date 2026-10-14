/**
 * format.js · Helpers de HTML y fechas para las plantillas
 */

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
                'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const NBSP = ' ';

/* Escapa texto para insertarlo en HTML (contenido y atributos). */
function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* "2026-03-20" → "MAR 2026" */
function fmtMonth(iso) {
  const [y, m] = String(iso).split('-');
  return MONTHS[parseInt(m, 10) - 1] + NBSP + y;
}

/* "2026-03-11" → "11 MAR 2026" */
function fmtDay(iso) {
  const [y, m, d] = String(iso).split('-');
  return parseInt(d, 10) + NBSP + MONTHS[parseInt(m, 10) - 1] + NBSP + y;
}

/* "2026-10-14" → "14 de octubre de 2026" */
function fmtLongEs(iso) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

module.exports = { esc, fmtMonth, fmtDay, fmtLongEs };
