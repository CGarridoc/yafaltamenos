# YaFaltaMenos.cl

Sitio de sátira política chilena. Cuenta regresiva al 11 de marzo de 2030,
último día del gobierno de José Antonio Kast.

**Stack:** HTML generado en build con Node (sin frameworks ni dependencias) ·
Cloudflare Workers (assets estáticos + Worker para `/og-image` y `/vote`) · KV para la encuesta.

---

## Cómo agregar una noticia

1. Crea un archivo en `content/noticias/`, por ejemplo `content/noticias/2026-10-14-mi-noticia.md`:

   ```markdown
   ---
   title: "El titular va aquí"
   date: 2026-10-14
   tag: economía
   excerpt: "Una o dos oraciones."
   published: true
   ---
   ```

2. Commit + push a `main`. Listo.

No hay que tocar ningún índice: el build lee todos los `.md` de la carpeta.

- La home muestra las **6 noticias más recientes** (por `date`).
- `published: false` la oculta (sirve para borradores). Si omites `published`, se publica.
- `title` y `date` (formato `YYYY-MM-DD`) son obligatorios. Si faltan o la fecha está
  mal escrita, el build falla y te dice qué archivo revisar; mientras tanto el sitio
  sigue mostrando la versión anterior.
- El nombre del archivo no importa para el orden, pero `YYYY-MM-DD-slug.md` ayuda a encontrarlos.

## Cómo agregar un hito a la cronología

Igual que una noticia, en `content/hitos/`:

```markdown
---
date: 2026-10-14
title: "Título del hito"
descripcion: "Descripción breve con tono satírico."
published: true
---
```

Aparece en `/cronologia`, del más reciente al más antiguo. Los hitos con fecha futura
se muestran como "pendientes" (punto vacío); puedes forzarlo con `tipo: active` o `tipo: future`.

---

## Correr el build en local

Requiere Node 18 o superior.

```bash
npm run build
```

Genera el sitio completo en `dist/` (no se versiona). Para verlo con el Worker,
la encuesta y `/og-image` funcionando:

```bash
npm run dev
```

Abre `http://localhost:8787`. `wrangler dev` vuelve a correr el build cada vez que
cambias algo en `content/`, `src/` o `static/`. La encuesta usa un KV local, así que
los votos de prueba no tocan producción.

## Deploy

Cada push a `main` despliega solo: Cloudflare ejecuta `npx wrangler deploy`, y wrangler
corre `node build.js` antes de subir (está configurado en `"build"` dentro de
`wrangler.jsonc`). No hace falta configurar un build command en el dashboard.

Deploy manual (requiere `npx wrangler login`):

```bash
npm run deploy
```

---

## Estructura

```
yafaltamenos/
├── build.js                 ← genera dist/ (páginas, sitemap.xml, robots.txt)
├── src/
│   ├── site.js              ← configuración: URL, email de contacto, fechas, etc.
│   ├── partials/layout.js   ← <head>, nav y footer comunes a todas las páginas
│   ├── pages/               ← una plantilla por página (/, /cronologia, /privacidad…)
│   └── lib/                 ← lectura de .md y helpers de formato
├── content/
│   ├── noticias/*.md
│   └── hitos/*.md
├── static/                  ← CSS y JS del cliente (se copian a dist/static)
├── worker.js                ← Worker: /og-image, /vote y fecha en og:image de la home
├── functions/og-image.js    ← genera la imagen PNG de Open Graph
├── admin/                   ← panel Decap CMS
└── wrangler.jsonc           ← config de Cloudflare
```

### Agregar una página nueva

1. Crea `src/pages/mi-pagina.js` que exporte una función que devuelva
   `{ path, title, description, body }` (copia `contacto.js` como base).
2. Agrégala al array `PAGES` en `build.js`.
3. Si debe aparecer en el menú o el footer, agrégala en `NAV` o `FOOTER_LINKS` de `src/partials/layout.js`.

Se incluye sola en `sitemap.xml`.

### Cosas a tener en cuenta

- **Caché de CSS/JS:** `/static/*` se sirve con caché de un año. El build agrega un
  hash del contenido a cada URL (`style.css?v=…`), así que los cambios se ven al instante.
  Agrega los archivos nuevos con `asset('/static/…')` en las plantillas para mantenerlo.
- **Rutas del Worker:** cualquier ruta nueva que atienda `worker.js` debe agregarse a
  `assets.run_worker_first` en `wrangler.jsonc`. Si no, Cloudflare devuelve la página 404.
- **Textos legales:** si el sitio empieza a recolectar algo nuevo (analytics, formularios),
  actualiza `src/pages/privacidad.js` y `legalUpdated` en `src/site.js`.

---

*Hecho con amor por Chile · no afiliado a ningún partido político*
