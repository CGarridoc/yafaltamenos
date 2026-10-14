/**
 * privacidad.js · /privacidad
 * Si cambia lo que el sitio recolecta (analytics, formularios, etc.),
 * actualizar este texto y `legalUpdated` en site.js.
 */

const site = require('../site');
const { fmtLongEs } = require('../lib/format');

module.exports = function privacidad() {
  const email = site.contactEmail;

  return {
    path:  '/privacidad',
    title: `Política de privacidad · ${site.name}`,
    description:
      'Qué datos recoge YaFaltaMenos.cl (casi ninguno), para qué los usamos ' +
      'y cómo ejercer tus derechos sobre ellos.',
    body: `
<section class="section-wrapper">
  <div class="section prose">
    <div class="sec-eyebrow">letra chica</div>
    <h1 class="sec-title">POLÍTICA DE PRIVACIDAD</h1>
    <p class="page-updated">Última actualización: ${fmtLongEs(site.legalUpdated)}</p>

    <p>${site.name} es un sitio de humor político. No tenemos cuentas de usuario, no vendemos datos y no usamos cookies de publicidad ni de seguimiento. Esta página explica, en simple, lo poco que sí ocurre con tus datos cuando nos visitas.</p>

    <h2>1. Encuesta</h2>
    <p>Cuando votas en la encuesta de la portada guardamos tu <strong>dirección IP</strong> junto a la opción que elegiste. Lo hacemos solo para permitir un voto por persona y mostrarte qué votaste. Las IP no se publican, no se cruzan con otros datos y no se comparten con terceros. Los resultados se muestran únicamente como totales agregados. Los datos se conservan mientras la encuesta esté activa.</p>

    <h2>2. Preferencias en tu navegador</h2>
    <p>Si cambias entre modo claro y oscuro, guardamos esa preferencia en el <code>localStorage</code> de tu navegador. Ese dato nunca sale de tu dispositivo y puedes borrarlo limpiando los datos del sitio en tu navegador.</p>

    <h2>3. Servicios de terceros</h2>
    <p>Para funcionar, el sitio depende de algunos proveedores que reciben datos técnicos de tu visita (como tu IP y el tipo de navegador):</p>
    <ul>
      <li><strong>Cloudflare</strong> aloja el sitio y la encuesta, y procesa registros técnicos de las solicitudes para servir las páginas y protegerlas de abusos.</li>
      <li><strong>Google Fonts</strong> entrega las tipografías del sitio.</li>
      <li><strong>Netlify</strong> entrega un script que usa el panel de edición del sitio.</li>
    </ul>
    <p>Cada proveedor trata esos datos según su propia política de privacidad.</p>

    <h2>4. Enlaces externos</h2>
    <p>Los botones para compartir en X o WhatsApp y el enlace para apoyarnos en Buy Me a Coffee te llevan a servicios externos. Lo que hagas allí se rige por sus propias políticas, no por esta.</p>

    <h2>5. Tus derechos</h2>
    <p>De acuerdo con la legislación chilena de protección de datos personales, puedes solicitar acceso, rectificación o eliminación de los datos que te conciernan. Como no pedimos nombre ni correo, la forma práctica de identificar tu voto es por la IP desde la que votaste. Escríbenos a <a href="mailto:${email}">${email}</a> y te responderemos a la brevedad.</p>

    <h2>6. Cambios</h2>
    <p>Si cambia lo que hacemos con los datos, actualizaremos esta página y la fecha de arriba.</p>
  </div>
</section>
`,
  };
};
