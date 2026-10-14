/**
 * content.js · Lectura de /content/<colección>/*.md
 * Lee todos los .md del directorio (sin índices manuales), parsea el
 * frontmatter, descarta los `published: false` y ordena por fecha desc.
 */

const fs   = require('fs');
const path = require('path');

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/* Parsea el bloque frontmatter YAML simple (clave: valor por línea).
   Soporta strings con o sin comillas, fechas ISO y booleans. */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { data: {}, body: raw.trim() };

  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (!key) continue;
    if (val.length >= 2 &&
        ((val[0] === '"' && val.at(-1) === '"') ||
         (val[0] === "'" && val.at(-1) === "'"))) {
      val = val.slice(1, -1);
    }
    if (val === 'true')  val = true;
    if (val === 'false') val = false;
    data[key] = val;
  }
  return { data, body: raw.slice(m[0].length).trim() };
}

/* Lee una colección. Falla el build (con el nombre del archivo) si a un
   .md le falta title o una fecha válida: mejor un build rojo en Cloudflare
   —que deja online la versión anterior— que publicar contenido roto. */
function loadCollection(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();

  const items = files.map((file) => {
    const fullPath = path.join(dir, file);
    const where    = path.relative(process.cwd(), fullPath);
    const { data, body } = parseFrontmatter(fs.readFileSync(fullPath, 'utf8'));
    // Los hitos creados con el CMS usan `date` como texto libre y `date_iso` para ordenar.
    const sortDate = ISO_DATE.test(String(data.date_iso)) ? data.date_iso : data.date;

    if (!data.title) {
      throw new Error(`${where}: falta "title" en el frontmatter`);
    }
    if (!ISO_DATE.test(String(sortDate))) {
      throw new Error(`${where}: "date" debe tener formato YYYY-MM-DD (vino "${data.date}")`);
    }
    return { ...data, file, body, sortDate };
  });

  return items
    .filter((item) => item.published !== false)
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate) || a.file.localeCompare(b.file));
}

module.exports = { loadCollection, parseFrontmatter };
