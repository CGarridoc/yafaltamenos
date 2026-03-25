# YaFaltaMenos.cl — V2

Sitio de sátira política chilena. Cuenta regresiva al 11 de marzo de 2030,
último día del gobierno de José Antonio Kast.

**Stack:** HTML/CSS/JS vanilla · Decap CMS · Netlify

---

## Estructura de archivos

```
yafaltamenos/
├── index.html                  ← Página principal
├── admin/
│   ├── index.html              ← Panel Decap CMS
│   └── config.yml              ← Configuración CMS (activa)
├── static/
│   ├── admin/
│   │   └── config.yml          ← Copia de referencia del config
│   ├── css/
│   │   └── style.css           ← Todos los estilos + variables dark mode
│   └── uploads/                ← Imágenes subidas vía CMS (se crea sola)
├── content/
│   ├── noticias/               ← Archivos .md de noticias
│   └── hitos/                  ← Archivos .md de la cronología (opcional)
├── netlify.toml
└── README.md
```

---

## Cómo agregar una noticia

### Opción A — Vía CMS (recomendado)

1. Ir a `https://yafaltamenos.cl/admin`
2. Iniciar sesión con Netlify Identity
3. Colección **Noticias** → **New Noticia**
4. Completar: titular, fecha, tag, extracto, cuerpo (opcional)
5. **Publish** → el CMS hace commit en GitHub automáticamente

> El sitio es estático: después de publicar via CMS, edita también el array
> `NEWS` en `index.html` para que aparezca en la portada sin build step.

### Opción B — Archivo .md manual

1. Crear `content/noticias/YYYY-MM-DD-slug.md` con este frontmatter:

```markdown
---
title: "El titular va aquí"
date: 2026-04-01
tag: economía
excerpt: "Una o dos oraciones. El punch va aquí."
published: true
---

Cuerpo opcional de la noticia en markdown.
```

2. Agregar la noticia también al array `NEWS` en `index.html`:

```javascript
{
  tag:     'economía',
  hl:      'El titular va aquí',
  excerpt: 'Una o dos oraciones. El punch va aquí.',
  date:    'ABR 2026'
}
```

3. Commit + push → Netlify redespliega automáticamente.

---

## Cómo agregar un hito a la cronología

Editar el array `MILESTONES` en `index.html`:

```javascript
{
  date:  '15 ABR 2026',
  title: 'Título del hito',
  desc:  'Descripción breve con tono satírico.',
  type:  'active'   // 'active' = punto rojo | 'future' = punto vacío
}
```

O vía CMS: colección **Hitos de la Cronología** → **New Hito**.
(Igual que con noticias, actualizar también el array en `index.html`.)

---

## Cómo actualizar el contador de expulsados

En `index.html`, buscar:

```javascript
var EXPULSADOS = 0;
```

Reemplazar `0` con el número real. Se formatea automáticamente con `es-CL`.

---

## Deploy en Netlify

### Primera vez

1. Subir repo a GitHub
2. En Netlify: **Add new site** → **Import from Git** → seleccionar repo
3. Build settings: dejar vacíos (no hay build command), publish = `.`
4. **Deploy site**

### Activar el CMS (Decap CMS + Netlify Identity)

1. **Site settings → Identity → Enable Identity**
2. **Identity → Registration → Invite only** (para no dejarlo abierto)
3. **Identity → Services → Git Gateway → Enable**
4. Invitar usuarios: **Identity → Invite users**
5. El panel CMS queda en `https://yafaltamenos.cl/admin`

### Deploys posteriores

Cualquier push a `main` redespliega automáticamente en ~30 segundos.

---

## Actualizar contenido sin tocar código

| Qué cambiar | Dónde |
|---|---|
| Noticias (portada) | Array `NEWS` en `index.html` |
| Hitos timeline | Array `MILESTONES` en `index.html` |
| Número expulsados | Variable `EXPULSADOS` en `index.html` |
| Fecha objetivo | Constante `TARGET` en `index.html` |
| Link Buy Me a Coffee | Buscar `buymeacoffee.com/yafaltamenos` |

---

*Hecho con amor por Chile · no afiliado a ningún partido político*
