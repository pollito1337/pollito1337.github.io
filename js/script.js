const $ = s => document.querySelector(s);

// Año del footer
const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

// Menú móvil
const toggle = $('.nav-toggle'), menu = $('#menu');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', e => { if (e.target.closest('a')) { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', false); } });
}

// Modal de clips (<dialog> nativo: Esc y foco ya vienen resueltos)
const dlg = $('#dlg');
if (dlg) {
  document.querySelectorAll('.clip').forEach(c => c.addEventListener('click', () => {
    $('#dlg-img').src = c.dataset.img;
    $('#dlg-title').textContent = c.dataset.title;
    $('#dlg-desc').textContent = c.dataset.desc;
    $('#dlg-link').href = c.dataset.link;
    dlg.showModal();
  }));
  dlg.querySelectorAll('.dlg-x,.dlg-close').forEach(b => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
}

// Reproductor (solo suena cuando pulsas play)
const audio = $('#audio');
if (audio) {
  const playlist = [
    { name: 'Legends', cover: 'images/cover1.webp', file: 'music/Legends.mp3' },
    { name: 'All Girls Are The Same', cover: 'images/cover2.webp', file: 'music/All Girls Are The Same.mp3' },
    { name: 'Lovers Rock', cover: 'images/cover3.webp', file: 'music/Lovers Rock.mp3' }
  ];
  let idx = 0;
  const playBtn = $('#play'), seek = $('#seek');
  const setIcon = playing => {
    playBtn.innerHTML = '<i class="fas fa-' + (playing ? 'pause' : 'play') + '"></i>';
    playBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
  };
  const load = i => {
    idx = (i + playlist.length) % playlist.length;
    $('#song').textContent = playlist[idx].name;
    $('#cover').src = playlist[idx].cover;
    audio.src = playlist[idx].file;
    seek.value = 0;
  };
  const play = () => audio.play().catch(() => setIcon(false));
  playBtn.addEventListener('click', () => audio.paused ? play() : audio.pause());
  $('#next').addEventListener('click', () => { const was = !audio.paused; load(idx + 1); if (was) play(); });
  $('#prev').addEventListener('click', () => { const was = !audio.paused; load(idx - 1); if (was) play(); });
  audio.addEventListener('play', () => setIcon(true));
  audio.addEventListener('pause', () => setIcon(false));
  audio.addEventListener('ended', () => { load(idx + 1); play(); });
  audio.addEventListener('timeupdate', () => { if (audio.duration) seek.value = audio.currentTime / audio.duration * 100; });
  seek.addEventListener('input', () => { if (audio.duration) audio.currentTime = seek.value / 100 * audio.duration; });
  load(0);
}

// Copiar comandos (cs2.html)
const copy = $('#copy');
if (copy) copy.addEventListener('click', async () => {
  const label = copy.querySelector('span');
  try { await navigator.clipboard.writeText($('#cmds').textContent); label.textContent = '¡Copiado!'; }
  catch { label.textContent = 'No se pudo copiar'; }
  setTimeout(() => label.textContent = 'Copiar comandos', 1800);
});

// Portada: agujeros de bala al hacer clic
const hero = $('#hero');
if (hero) hero.addEventListener('click', e => {
  if (e.target.closest('a,button,input,.player,.scope')) return;
  const r = hero.getBoundingClientRect(), h = document.createElement('span');
  h.className = 'hole'; h.style.left = e.clientX - r.left + 'px'; h.style.top = e.clientY - r.top + 'px';
  hero.appendChild(h); setTimeout(() => h.remove(), 5000);
});

// Calculadora eDPI y cm/360
if ($('#c-sens')) {
  const calc = () => {
    const s = parseFloat($('#c-sens').value), d = parseFloat($('#c-dpi').value);
    const ok = s > 0 && d > 0;
    $('#r-edpi').textContent = ok ? Math.round(s * d) : '—';
    $('#r-val').textContent = ok ? (s * 0.07 / 0.022).toFixed(3) : '—';
    $('#r-cm').textContent = ok ? (360 / (0.022 * s * d) * 2.54).toFixed(1) + ' cm' : '—';
  };
  ['#c-sens', '#c-dpi'].forEach(i => $(i).addEventListener('input', calc)); calc();
}

// Generador de crosshair (sistema de píxeles, sept 2026)
if ($('#preview')) {
  const Z = 3, g = id => $(id);
  const upd = () => {
    const len = +g('#x-len').value, th = +g('#x-th').value, gap = +g('#x-gap').value, a = +g('#x-a').value;
    const col = g('#x-color').value, dot = g('#x-dot').checked, tst = g('#x-t').checked, out = g('#x-out').checked, h = g('#x-h').value;
    g('#o-len').textContent = len; g('#o-th').textContent = th; g('#o-gap').textContent = gap; g('#o-a').textContent = a;
    const t = Math.max(th, 1) * Z, L = len * Z, off = gap * Z + t / 2;
    const st = 'background:' + col + ';opacity:' + (a / 255) + (out ? ';box-shadow:0 0 0 ' + Z + 'px #000' : '');
    const bar = (x, y, w, hh) => `<i style="${st};left:calc(50% + ${x}px);top:calc(50% + ${y}px);width:${w}px;height:${hh}px"></i>`;
    let html = (tst ? '' : bar(-t / 2, -off - L, t, L)) + bar(-t / 2, off - t / 2, t, L) + bar(-off - L + t / 2, -t / 2, L, t) + bar(off - t / 2, -t / 2, L, t);
    if (dot) html += bar(-t / 2, -t / 2, t, t);
    g('#preview').innerHTML = html;
    const n = parseInt(col.slice(1), 16);
    g('#xcmds').textContent = [
      'cl_crosshairstyle 4', 'cl_crosshair_length ' + len, 'cl_crosshair_thickness ' + th, 'cl_crosshair_gap ' + gap,
      'cl_crosshairdot ' + (dot ? 1 : 0), 'cl_crosshair_t ' + (tst ? 1 : 0), 'cl_crosshair_recoil 0',
      'cl_crosshaircolor 5', 'cl_crosshaircolor_r ' + (n >> 16), 'cl_crosshaircolor_g ' + (n >> 8 & 255), 'cl_crosshaircolor_b ' + (n & 255), 'cl_crosshaircolor_a ' + a,
      'cl_crosshair_drawoutline ' + (out ? 1 : 0),
      ...(out ? ['cl_crosshairoutline_r 0', 'cl_crosshairoutline_g 0', 'cl_crosshairoutline_b 0', 'cl_crosshairoutline_a 255'] : []),
      'cl_crosshair_screen_height ' + h
    ].join('\n');
  };
  document.querySelectorAll('#x-len,#x-th,#x-gap,#x-a,#x-color,#x-h,#x-dot,#x-t,#x-out').forEach(i => i.addEventListener('input', upd)); upd();
  const cx = $('#copyx');
  cx.addEventListener('click', async () => {
    const l = cx.querySelector('span');
    try { await navigator.clipboard.writeText(g('#xcmds').textContent.replace(/\n/g, '; ')); l.textContent = '¡Copiado!'; } catch { l.textContent = 'No se pudo copiar'; }
    setTimeout(() => l.textContent = 'Copiar crosshair', 1800);
  });
}

// Sonido sintético (sin archivos)
let actx;
const beep = (f, d = .06) => { try { actx = actx || new AudioContext(); const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = f; g.gain.value = .06; o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + d); } catch {} };
if (hero) hero.addEventListener('click', e => { if (!e.target.closest('a,button,input,.player,.scope')) beep(180, .05); });

// Aim trainer
const arena = $('#arena');
if (arena) {
  let hits, miss, left, tick, tgt, best = 0, t0, sum;
  try { best = +localStorage.getItem('aimBest') || 0; } catch {}
  $('#a-best').textContent = best;
  const acc = () => $('#a-acc').textContent = hits + miss ? Math.round(hits / (hits + miss) * 100) + '%' : '—';
  const spawn = () => {
    if (tgt) tgt.remove();
    tgt = document.createElement('button'); tgt.className = 'target'; tgt.setAttribute('aria-label', 'Objetivo');
    tgt.style.left = 30 + Math.random() * (arena.clientWidth - 60) + 'px';
    tgt.style.top = 30 + Math.random() * (arena.clientHeight - 60) + 'px';
    arena.appendChild(tgt); t0 = performance.now();
  };
  const end = () => {
    clearInterval(tick); if (tgt) tgt.remove(); tgt = null;
    if (hits > best) { best = hits; $('#a-best').textContent = best; try { localStorage.setItem('aimBest', best); } catch {} }
    arena.innerHTML = '<button class="btn gold" id="a-start">Repetir</button>';
    $('#a-start').addEventListener('click', start);
  };
  function start() {
    arena.innerHTML = ''; hits = miss = sum = 0; $('#a-rt').textContent = '—'; left = 30;
    $('#a-hits').textContent = 0; $('#a-time').textContent = left; acc(); spawn();
    tick = setInterval(() => { $('#a-time').textContent = --left; if (left <= 0) end(); }, 1000);
  }
  $('#a-start').addEventListener('click', start);
  arena.addEventListener('pointerdown', e => {
    if (!tgt) return;
    if (e.target === tgt) { hits++; $('#a-hits').textContent = hits; sum += performance.now() - t0; $('#a-rt').textContent = Math.round(sum / hits) + ' ms'; beep(880, .04); spawn(); }
    else if (e.target === arena) { miss++; beep(140, .05); }
    acc();
  });
}

// Consola (tecla ` o botón del pie)
(() => {
  const con = document.createElement('div'); con.id = 'con';
  con.innerHTML = '<div id="con-out" aria-live="polite"></div><input id="con-in" autocomplete="off" spellcheck="false" aria-label="Consola" placeholder="escribe help">';
  document.body.appendChild(con);
  const out = $('#con-out'), inp = $('#con-in');
  const say = t => { out.textContent += t + '\n'; out.scrollTop = out.scrollHeight; };
  const cmds = {
    help: () => 'help · sens · setup · redes · cs2 · inicio · clear',
    sens: () => 'sensitivity 0.557 | DPI 1600 | eDPI 891 | 1280x960 4:3 | 1000 Hz',
    setup: () => 'i7-11700F | RTX 3060 Ti | 16 GB | AOC 25G3ZM 240 Hz | Viper V3 Pro | Apex Pro TKL',
    redes: () => 'twitch.tv/aitorgs10\nyoutube.com/@pollito-p7k\ntiktok.com/@pollito99998\nx.com/pollito1337',
    cs2: () => { location.href = 'cs2.html'; return 'cargando cs2...'; },
    inicio: () => { location.href = 'index.html'; return 'cargando inicio...'; },
    clear: () => { out.textContent = ''; return ''; }
  };
  const toggle = open => { con.classList.toggle('open', open); if (con.classList.contains('open')) { if (!out.textContent) say('Consola de Pollito. Escribe help.'); inp.focus(); } };
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggle(false);
    else if ((e.key === '`' || e.key === 'º') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); toggle(); }
  });
  inp.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || !inp.value.trim()) return;
    const c = inp.value.trim().toLowerCase(); say('> ' + c); inp.value = '';
    const r = cmds[c] ? cmds[c]() : 'comando desconocido: ' + c; if (r) say(r);
  });
  const f = document.querySelector('footer .wrap');
  if (f) { const b = document.createElement('button'); b.className = 'con-btn'; b.textContent = 'consola'; b.addEventListener('click', () => toggle(true)); f.appendChild(b); }
})();

// Copiar mi código de crosshair
const cc = $('#copycode');
if (cc) cc.addEventListener('click', async () => {
  const l = cc.querySelector('span');
  try { await navigator.clipboard.writeText($('#mycode').textContent.trim()); l.textContent = '¡Copiado!'; } catch { l.textContent = 'No se pudo copiar'; }
  setTimeout(() => l.textContent = 'Copiar código', 1800);
});

// Descargar autoexec.cfg (sensibilidad + crosshair del generador)
const dl = $('#dlcfg');
if (dl) dl.addEventListener('click', () => {
  const sens = parseFloat($('#c-sens').value) || 0.557;
  const txt = ['// autoexec.cfg generado desde la web de Pollito', 'sensitivity "' + sens + '"', 'zoom_sensitivity_ratio_mouse "1.0"', '', '// Crosshair', $('#xcmds').textContent, ''].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' })); a.download = 'autoexec.cfg';
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});
