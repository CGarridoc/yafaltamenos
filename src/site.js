/**
 * site.js · Configuración global del sitio
 * Todo lo que se repite entre páginas vive aquí.
 */

module.exports = {
  url:         'https://yafaltamenos.cl',
  name:        'YaFaltaMenos.cl',
  tagline:     'El último día de Kast',
  lang:        'es',
  locale:      'es_CL',

  // Mandato (hora de Chile)
  start:       '2026-03-11T00:00:00-03:00',
  target:      '2030-03-11T00:00:00-03:00',

  // Link de "apóyanos". Vacío = no se muestra el botón en ninguna página.
  // (buymeacoffee.com/yafaltamenos es de otra persona: no usar.)
  donateUrl:   '',

  // Email público de contacto (aparece en /contacto, /privacidad y /terminos).
  // Se puede crear gratis con Cloudflare Email Routing → reenvío a un correo personal.
  contactEmail: 'contacto@yafaltamenos.cl',

  // Fecha de última actualización de /privacidad y /terminos (YYYY-MM-DD).
  legalUpdated: '2026-10-14',

  // Cantidad de noticias que se muestran en la home.
  homeNewsLimit: 6,
};
