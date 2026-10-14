/**
 * terminos.js · /terminos
 */

const site = require('../site');
const { fmtLongEs } = require('../lib/format');

module.exports = function terminos() {
  const email = site.contactEmail;

  return {
    path:  '/terminos',
    title: `Términos de uso · ${site.name}`,
    description:
      'Términos de uso de YaFaltaMenos.cl, sitio chileno de sátira y humor político ' +
      'no afiliado a ningún partido ni al Gobierno de Chile.',
    body: `
<section class="section-wrapper">
  <div class="section prose">
    <div class="sec-eyebrow">letra chica</div>
    <h1 class="sec-title">TÉRMINOS DE USO</h1>
    <p class="page-updated">Última actualización: ${fmtLongEs(site.legalUpdated)}</p>

    <p>Al usar ${site.name} aceptas estos términos. Son cortos, prometido.</p>

    <h2>1. Esto es sátira</h2>
    <p>${site.name} es un sitio de humor y opinión política. Los titulares, comentarios y la cronología mezclan hechos públicos con ironía, exageración y comentario editorial. No es un medio de noticias ni pretende serlo: si algo te parece demasiado absurdo para ser verdad, verifícalo en una fuente periodística.</p>

    <h2>2. Sin afiliación</h2>
    <p>El sitio no está afiliado, patrocinado ni respaldado por ningún partido político, candidato, organismo público ni por el Gobierno de Chile. Las menciones a personas públicas se refieren a su actuación pública.</p>

    <h2>3. La encuesta</h2>
    <p>La encuesta es un juego, no un estudio de opinión: no tiene muestra representativa ni valor estadístico. Se permite un voto por dirección IP y nos reservamos el derecho de reiniciarla o retirarla. Ver la <a href="/privacidad">política de privacidad</a> para saber qué datos guarda.</p>

    <h2>4. Contenido y uso</h2>
    <p>Puedes compartir y citar el contenido del sitio libremente, siempre que enlaces a ${site.name} y no lo presentes como información oficial o periodística. No está permitido usar el sitio para actividades ilegales ni intentar afectar su funcionamiento (por ejemplo, manipular la encuesta de forma automatizada).</p>

    <h2>5. Aportes voluntarios</h2>
    <p>Los aportes vía Buy Me a Coffee son donaciones voluntarias para cubrir costos del sitio. No otorgan contraprestación, influencia editorial ni derecho a reembolso, salvo lo que establezca la plataforma de pago.</p>

    <h2>6. Enlaces externos</h2>
    <p>El sitio enlaza a servicios de terceros (X, WhatsApp, Buy Me a Coffee, entre otros). No controlamos su contenido ni somos responsables de sus prácticas.</p>

    <h2>7. Responsabilidad</h2>
    <p>El sitio se ofrece «tal cual», sin garantías de disponibilidad ni de exactitud. El contador regresivo se calcula con la fecha de término del mandato presidencial (11 de marzo de 2030) y es referencial.</p>

    <h2>8. Cambios y ley aplicable</h2>
    <p>Podemos actualizar estos términos en cualquier momento; la versión vigente es la publicada en esta página. Se rigen por las leyes de la República de Chile. Para cualquier consulta escribe a <a href="mailto:${email}">${email}</a>.</p>
  </div>
</section>
`,
  };
};
