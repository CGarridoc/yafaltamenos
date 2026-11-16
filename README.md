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
- `tag` es uno de: `economía`, `derechos`, `corrupción`, `medioambiente`, `gabinete`,
  `internacional`. Se acepta con o sin tilde (`economia` → `economía`).

## Noticias automáticas

Todos los días a las **07:00 (hora de Chile)** la GitHub Action
[`daily-news.yml`](.github/workflows/daily-news.yml) corre `scripts/fetch-news.js`, que:

1. **Publica** los borradores cuyo `auto_publish_at` ya pasó (`published: false` → `true`).
2. **Lee** los feeds de Biobío, El Mostrador, Cooperativa, CNN Chile y La Tercera, y se queda
   con los titulares de las últimas 24 h que mencionan a Kast, el gobierno, ministros, La Moneda,
   el gabinete, Rabat, Quiroz, aprobación, Cadem, Criteria, expulsiones o deportaciones.
3. **Elige hasta 3** noticias nuevas, priorizando las que publican más medios. Descarta las que
   ya existen en `content/noticias/` (por URL y por titular parecido) y las que generó antes,
   aunque las hayas borrado (quedan anotadas en `data/news-history.json`).
4. **Pide a Claude** (`claude-sonnet-4-5`) un titular satírico, el tag y un excerpt, y crea el borrador:

   ```markdown
   ---
   title: "<titular satírico>"
   date: 2026-11-16
   tag: gabinete
   excerpt: "<una línea>"
   source: "<URL de la noticia original>"
   source_title: "<titular original>"
   published: false
   auto_publish_at: 2026-11-17T10:00:00Z
   ---
   ```

   Si la API falla, el borrador se crea igual con el titular original (y un tag adivinado).
5. Si hubo cambios, hace commit `auto: noticias YYYY-MM-DD` y push a `main`, lo que despliega el sitio.

O sea: **un borrador se publica solo ~24 h después de creado, en la corrida del día siguiente**,
salvo que lo edites o lo borres antes. (La corrida acepta borradores que vencen hasta 2 h
después, para que el atraso habitual del cron de GitHub no los deje para el otro día.)

**Emol** no publica RSS (ni un sitemap de noticias recientes) y quedó fuera. El Mostrador y
CNN Chile tampoco tienen RSS: se leen desde su sitemap de Google News, que trae titular y fecha
pero no resumen. Las URLs de los feeds están en `SOURCES`, al principio del script.

### Configurar la API key (una sola vez)

1. Crea una API key en [console.anthropic.com](https://console.anthropic.com) → *API Keys*.
2. En GitHub: repo → **Settings → Secrets and variables → Actions → New repository secret**.
   Nombre: `ANTHROPIC_API_KEY`, valor: la key.

El workflow usa el `GITHUB_TOKEN` automático para hacer push (tiene `contents: write`).
Si algún día proteges `main` para exigir PRs, el push de la Action va a fallar.

### Revisar los borradores desde el teléfono

Los borradores llegan a `main` cada mañana con el commit `auto: noticias …`. En la app de
GitHub (o github.com en el navegador): repo → **Code** → `content/noticias/` → los archivos
con la fecha de hoy.

- **Aprobar ya:** abre el archivo → ✏️ (*Edit*) → cambia `published: false` por
  `published: true` → *Commit changes*. Se publica en el próximo deploy (un par de minutos).
- **Corregir el titular:** edita `title` o `excerpt` y haz commit. Si lo dejas en
  `published: false`, se publica solo a la hora de `auto_publish_at`.
- **Descartarlo:** abre el archivo → menú **⋯** → *Delete file* → *Commit changes*. No se
  vuelve a crear.
- **Frenarlo sin borrarlo:** borra la línea `auto_publish_at`. Queda como borrador hasta que
  lo publiques a mano.

Si no haces nada, se publica solo.

### Correrlo en local

```bash
ANTHROPIC_API_KEY=sk-ant-... node scripts/fetch-news.js
```

Escribe los borradores en `content/noticias/` (y publica los vencidos), igual que la Action,
pero no hace commit. Sin `ANTHROPIC_API_KEY` funciona igual, con los titulares originales.
Para ver qué noticias elegiría sin escribir nada ni llamar a la API:

```bash
node scripts/fetch-news.js --dry-run
```

Requiere haber corrido `npm install` (usa el SDK de Anthropic).

### Ejecutarlo a mano o cambiar la hora

- **A mano:** repo → **Actions → Noticias diarias → Run workflow**.
- **Cambiar la hora:** en `.github/workflows/daily-news.yml` hay dos crons en UTC, uno para
  el horario de verano de Chile (UTC-3) y otro para el de invierno (UTC-4). Para correrlo,
  por ejemplo, a las 08:00 de Chile:

  ```yaml
  - cron: '0 11 * * *'   # 08:00 en verano (UTC-3)
  - cron: '0 12 * * *'   # 08:00 en invierno (UTC-4)
  ```

  y actualiza los mismos dos valores en el `case` del paso "¿Son las 07:00 en Chile?"
  (`"0 11 * * *|-0300" | "0 12 * * *|-0400"`). GitHub puede atrasar los crons varios minutos.
- **Cantidad de noticias, palabras clave o tono:** `MAX_PER_DAY`, `KEYWORDS` y `SYSTEM_PROMPT`
  en `scripts/fetch-news.js`.

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
│   └── lib/                 ← lectura de .md, tags válidos y helpers de formato
├── content/
│   ├── noticias/*.md
│   └── hitos/*.md
├── scripts/fetch-news.js    ← borradores automáticos de noticias (lo corre la Action diaria)
├── data/news-history.json   ← noticias ya generadas, para no repetirlas
├── .github/workflows/       ← daily-news.yml
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
