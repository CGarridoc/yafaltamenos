/* ═══════════════════════════════════════════════════
   home.js · solo en /
   Contador regresivo + compartir + encuesta
═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────
   COUNTDOWN
───────────────────────────────────── */
var TARGET = new Date('2030-03-11T00:00:00-03:00');
var START  = new Date('2026-03-11T00:00:00-03:00');
var TOTAL  = TARGET - START;

var prevD = -1, prevH = -1, prevM = -1, prevS = -1;

function triggerFlip(el) {
  el.classList.remove('flip');
  // Force reflow so animation restarts
  void el.offsetWidth;
  el.classList.add('flip');
}

function tick() {
  var now  = new Date();
  var diff = TARGET - now;

  if (diff <= 0) {
    document.getElementById('cd-d').textContent  = '0000';
    document.getElementById('cd-h').textContent  = '00';
    document.getElementById('cd-m').textContent  = '00';
    document.getElementById('cd-s').textContent  = '00';
    document.getElementById('cd-ms').textContent = '000';
    document.getElementById('pf').style.width    = '100%';
    document.getElementById('pp').textContent    = '100.00%';
    return;
  }

  var d  = Math.floor(diff / 86400000);
  var h  = Math.floor(diff % 86400000 / 3600000);
  var m  = Math.floor(diff % 3600000  / 60000);
  var s  = Math.floor(diff % 60000    / 1000);
  var ms = Math.floor(diff % 1000);

  var dEl  = document.getElementById('cd-d');
  var hEl  = document.getElementById('cd-h');
  var mEl  = document.getElementById('cd-m');
  var sEl  = document.getElementById('cd-s');
  var msEl = document.getElementById('cd-ms');

  if (d !== prevD) { dEl.textContent = d; triggerFlip(dEl); prevD = d; }
  if (h !== prevH) { hEl.textContent = String(h).padStart(2, '0'); triggerFlip(hEl); prevH = h; }
  if (m !== prevM) { mEl.textContent = String(m).padStart(2, '0'); triggerFlip(mEl); prevM = m; }
  if (s !== prevS) { sEl.textContent = String(s).padStart(2, '0'); triggerFlip(sEl); prevS = s; }

  msEl.textContent = String(ms).padStart(3, '0');

  var pct = Math.min(100, Math.max(0, (now - START) / TOTAL * 100));
  document.getElementById('pf').style.width   = pct.toFixed(3) + '%';
  document.getElementById('pp').textContent   = pct.toFixed(2) + '% completado';
}

setInterval(tick, 50);
tick();


/* ─────────────────────────────────────
   SOCIAL SHARING
───────────────────────────────────── */
var SITE_URL = 'https://yafaltamenos.cl';

function getShareText() {
  var diff = TARGET - new Date();
  var days = Math.max(0, Math.floor(diff / 86400000));
  var pct  = Math.min(100, Math.max(0, (new Date() - START) / TOTAL * 100));
  return (
    'Todavía faltan ' + days + ' días para el último día de Kast 🇨🇱\n' +
    pct.toFixed(1) + '% del mandato completado → yafaltamenos.cl'
  );
}

document.getElementById('shareTwitter').addEventListener('click', function () {
  var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(getShareText());
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
});

document.getElementById('shareWhatsapp').addEventListener('click', function () {
  var url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(getShareText());
  window.open(url, '_blank', 'noopener,noreferrer');
});

document.getElementById('copyLink').addEventListener('click', function () {
  var btn  = document.getElementById('copyLink');
  var txt  = document.getElementById('copyText');

  function onCopied() {
    btn.classList.add('copied');
    txt.textContent = '¡copiado!';
    setTimeout(function () {
      btn.classList.remove('copied');
      txt.textContent = 'copiar link';
    }, 2200);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(SITE_URL).then(onCopied).catch(function () {
      fallbackCopy(SITE_URL, onCopied);
    });
  } else {
    fallbackCopy(SITE_URL, onCopied);
  }
});

function fallbackCopy(text, callback) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); callback(); } catch (e) {}
  document.body.removeChild(ta);
}


/* ─────────────────────────────────────
   ENCUESTA — Cloudflare KV
   GET  /vote → resultados actuales
   POST /vote → registrar voto (1 por IP)
───────────────────────────────────── */
var pollOptions = document.getElementById('poll-options');
var pollResults = document.getElementById('poll-results');
var pollStatus  = document.getElementById('poll-status');

var POLL_LABELS = {
  si:       'Sí, lo termina',
  no:       'No, cae antes',
  renuncia: 'Renuncia él solo'
};

function renderPollResults(data) {
  var total = (data.si || 0) + (data.no || 0) + (data.renuncia || 0);
  var html  = '';
  ['si', 'no', 'renuncia'].forEach(function (key) {
    var count  = data[key] || 0;
    var pct    = total > 0 ? Math.round((count / total) * 100) : 0;
    var active = data.voted === key ? ' poll-bar-row--voted' : '';
    html +=
      '<div class="poll-bar-row' + active + '">' +
        '<div class="poll-bar-label">' +
          '<span>' + POLL_LABELS[key] + '</span>' +
          '<span>' + pct + '%</span>' +
        '</div>' +
        '<div class="poll-bar-track">' +
          '<div class="poll-bar-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
      '</div>';
  });
  html += '<p class="poll-total">' + total.toLocaleString('es-CL') +
          ' voto' + (total !== 1 ? 's' : '') + '</p>';
  if (data.voted) {
    html += '<p class="poll-voted-msg">Ya votaste — gracias por participar.</p>';
  }
  pollResults.innerHTML = html;
  pollResults.style.display = 'block';
  pollOptions.style.display  = 'none';
  pollStatus.style.display   = 'none';
}

function setPollStatus(msg) {
  pollStatus.textContent    = msg;
  pollStatus.style.display  = 'block';
  pollOptions.style.display = 'none';
}

/* Estado inicial */
pollOptions.style.display = 'none';
pollResults.style.display = 'none';

fetch('/vote')
  .then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then(function (data) {
    if (data.voted) {
      renderPollResults(data);
    } else {
      pollOptions.style.display = 'flex';
      pollStatus.style.display  = 'none';
    }
  })
  .catch(function () {
    setPollStatus('encuesta no disponible');
  });

/* Votar */
pollOptions.addEventListener('click', function (e) {
  var btn = e.target.closest('.poll-btn');
  if (!btn) return;
  var option = btn.getAttribute('data-option');
  setPollStatus('registrando voto…');

  fetch('/vote', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ option: option })
  })
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (data) {
      if (!data.voted) data.voted = option;
      renderPollResults(data);
    })
    .catch(function () {
      setPollStatus('error al registrar el voto. Intenta de nuevo.');
    });
});
