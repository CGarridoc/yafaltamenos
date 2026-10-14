/**
 * cronologia.js · /cronologia  →  línea de tiempo completa
 */

const site = require('../site');
const { esc, fmtDay } = require('../lib/format');

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/* "active" (ocurrido) o "future" (pendiente). Si el .md trae `tipo`
   se respeta; si no, se decide por la fecha al momento del build. */
function status(hito, today) {
  if (hito.tipo === 'active' || hito.tipo === 'future') return hito.tipo;
  return hito.sortDate <= today ? 'active' : 'future';
}

function item(hito, today) {
  // `date` puede ser texto libre ("22 MAR 2026") en hitos creados con el CMS
  const label = ISO_DATE.test(String(hito.date)) ? fmtDay(hito.date) : esc(hito.date);
  return `      <article class="tl-item ${status(hito, today)}">
        <div class="tl-date"><time datetime="${hito.sortDate}">${label}</time></div>
        <h2 class="tl-title">${esc(hito.title)}</h2>${hito.descripcion ? `
        <p class="tl-desc">${esc(hito.descripcion)}</p>` : ''}
      </article>`;
}

module.exports = function cronologia({ hitos, today }) {
  const body = hitos.length
    ? hitos.map((h) => item(h, today)).join('\n')
    : '      <p class="empty-msg">No hay hitos disponibles.</p>';

  return {
    path:  '/cronologia',
    title: `Cronología del desastre · ${site.name}`,
    description:
      'Todos los hitos del gobierno de Kast, día a día, desde el 11 de marzo de 2026: ' +
      'declaraciones, cambios de gabinete y promesas en pausa.',
    body: `
<section class="section-wrapper">
  <div class="section">
    <div class="sec-eyebrow">bitácora oficial</div>
    <h1 class="sec-title">CRONOLOGÍA DEL DESASTRE</h1>
    <p class="page-intro">${hitos.length} hitos registrados desde el 11 de marzo de 2026. Del más reciente al más antiguo.</p>
    <div class="timeline timeline--full">
${body}
    </div>
  </div>
</section>
`,
  };
};
