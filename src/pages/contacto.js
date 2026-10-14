/**
 * contacto.js · /contacto
 */

const site = require('../site');

module.exports = function contacto() {
  const email = site.contactEmail;

  return {
    path:  '/contacto',
    title: `Contacto · ${site.name}`,
    description:
      'Escríbele a YaFaltaMenos.cl: sugerencias de noticias, correcciones, prensa ' +
      'o simplemente para desahogarte.',
    body: `
<section class="section-wrapper">
  <div class="section prose">
    <div class="sec-eyebrow">buzón ciudadano</div>
    <h1 class="sec-title">CONTACTO</h1>

    <p>¿Tienes una noticia que merece estar en el muro de los lamentos, encontraste un error o eres de prensa? Escríbenos:</p>

    <p class="contact-email"><a href="mailto:${email}">${email}</a></p>

    <p>Leemos todo, pero respondemos lo que podemos. Si nos mandas una noticia, incluye el enlace a la fuente original.</p>
    <p>Para dudas sobre tus datos, revisa la <a href="/privacidad">política de privacidad</a>.</p>
  </div>
</section>
`,
  };
};
