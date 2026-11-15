const LANGS = {
  en: { id:'en', name:'Inglês', flag:'🇬🇧', speech:'en-US', short:'EN' },
  fr: { id:'fr', name:'Francês', flag:'🇫🇷', speech:'fr-FR', short:'FR' },
  es: { id:'es', name:'Espanhol', flag:'🇪🇸', speech:'es-ES', short:'ES' },
  zh: { id:'zh', name:'Mandarim', flag:'🇨🇳', speech:'zh-CN', short:'中文' },
  it: { id:'it', name:'Italiano', flag:'🇮🇹', speech:'it-IT', short:'IT' }
};
const RANKS = [
  {name:'Iniciante',icon:'🌱',min:0},
  {name:'Aprendiz',icon:'📘',min:100},
  {name:'Comunicador',icon:'💬',min:300},
  {name:'Profissional',icon:'💼',min:600},
  {name:'Avançado',icon:'🚀',min:1000},
  {name:'Fluente',icon:'🏆',min:1500},
  {name:'Expert',icon:'👑',min:2200}
];
const BADGES = [
  {id:'first_lesson',name:'Primeira lição',desc:'Complete 1 lição',icon:'🎯',check:s=>s.completedLessons.length>=1},
  {id:'first_call',name:'Primeira ligação',desc:'Faça 1 ligação',icon:'📞',check:s=>s.completedCalls.length>=1},
  {id:'streak_3',name:'3 dias',desc:'Streak de 3',icon:'🔥',check:s=>s.streak>=3},
  {id:'streak_7',name:'7 dias',desc:'Streak de 7',icon:'⚡',check:s=>s.streak>=7},
  {id:'xp_100',name:'100 XP',desc:'Acumule 100 XP',icon:'💜',check:s=>s.xp>=100},
  {id:'xp_500',name:'500 XP',desc:'Acumule 500 XP',icon:'💎',check:s=>s.xp>=500},
  {id:'lessons_5',name:'5 lições',desc:'Complete 5',icon:'📚',check:s=>s.completedLessons.length>=5},
  {id:'calls_3',name:'3 ligações',desc:'Faça 3',icon:'🎧',check:s=>s.completedCalls.length>=3},
  {id:'perfect',name:'Lição perfeita',desc:'Acerte tudo',icon:'⭐',check:s=>s.perfectLessons>=1},
  {id:'multilang',name:'Poliglota',desc:'Troque de idioma',icon:'🌍',check:s=>s.langsUsed&&s.langsUsed.length>=2}
];

var S = {
  user:null, theme:'ocean', lang:'en',
  xp:0, streak:0, lastDate:null,
  completedLessons:[], completedCalls:[],
  perfectLessons:0, correct:0, wrong:0,
  dailyDone:0, dailyDate:null, badges:[], langsUsed:['en']
};
var cloudUserId = null;
var curLesson = null, curSec = 0, hearts = 3, lessonCorrect = 0, lessonWrong = 0;
var waitingFeedback = false;

function mascotSVG() {
  return '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="url(#g)" opacity="0.25"/><ellipse cx="50" cy="52" rx="32" ry="30" fill="url(#h)"/><ellipse cx="50" cy="50" rx="26" ry="24" fill="#e8ecf4"/><circle cx="40" cy="46" r="3.5" fill="#1a1a2e"/><circle cx="60" cy="46" r="3.5" fill="#1a1a2e"/><path d="M40 58 Q50 66 60 58" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round"/><defs><radialGradient id="g"><stop offset="0%" stop-color="#5b8aff"/><stop offset="100%" stop-color="transparent"/></radialGradient><linearGradient id="h" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#5b8aff"/><stop offset="100%" stop-color="#3b6de0"/></linearGradient></defs></svg>';
}
function setMascot() {
  const el = document.getElementById('mascotSvg');
  if (el) el.innerHTML = mascotSVG();
  const loginEl = document.getElementById('loginMascotSvg');
  if (loginEl) loginEl.innerHTML = mascotSVG();
}
function localSave() { localStorage.setItem('polywork_v1', JSON.stringify(S)); }
function save() { localSave(); }
function getLessons() { return (typeof CONTENT !== 'undefined' && CONTENT[S.lang]) ? (CONTENT[S.lang].lessons || []) : []; }
function getCalls() { return (typeof CONTENT !== 'undefined' && CONTENT[S.lang]) ? (CONTENT[S.lang].calls || []) : []; }
function speechLang() { return (LANGS[S.lang]||LANGS.en).speech; }
function getRankIndex(xp) { let i=0; for (let r=0;r<RANKS.length;r++) if (xp>=RANKS[r].min) i=r; return i; }
function xpNext(xp) { const i=getRankIndex(xp); return i<RANKS.length-1 ? RANKS[i+1].min : RANKS[i].min+500; }

function speak(text, rate) {
  if (!window.speechSynthesis || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = speechLang();
  u.rate = rate || 0.92;
  speechSynthesis.speak(u);
}

function addXp(n) {
  S.xp += n;
  checkBadges();
  showToast('+' + n + ' XP', '⚡');
  save();
  render();
}
function checkBadges() {
  BADGES.forEach(b => {
    if (!S.badges.includes(b.id) && b.check(S)) {
      S.badges.push(b.id);
      showToast('Conquista: ' + b.name, b.icon);
    }
  });
}
function updateStreak() {
  const today = new Date().toDateString();
  if (S.lastDate === today) return;
  const yest = new Date(Date.now()-86400000).toDateString();
  S.streak = (S.lastDate === yest) ? S.streak + 1 : 1;
  S.lastDate = today;
}
function showToast(msg, icon) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = (icon ? icon + ' ' : '') + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  const nav = document.getElementById('nav-' + id);
  if (nav) nav.classList.add('active');
  if (id === 'lessons' || id === 'home' || id === 'practice' || id === 'achievements' || id === 'profile') render();
}
function loginAsGuest() {
  S.user = {name:'Visitante', email:'Modo visitante', avatar:'G', provider:'guest'};
  cloudUserId = null;
  localSave();
  enterApp();
}
function enterApp() {
  document.getElementById('loginScreen').classList.add('hide');
  document.getElementById('mainHeader').classList.remove('hidden');
  document.getElementById('mainContent').classList.remove('hidden');
  document.getElementById('mainNav').classList.remove('hidden');
  setMascot();
  render();
}
function loginWithGoogle() {
  showToast('Use Visitante por enquanto', 'ℹ️');
  loginAsGuest();
}
function logout() {
  S.user = null;
  localSave();
  document.getElementById('loginScreen').classList.remove('hide');
  document.getElementById('mainHeader').classList.add('hidden');
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('mainNav').classList.add('hidden');
}
function applyTheme(id) {
  document.documentElement.setAttribute('data-theme', id || 'ocean');
  S.theme = id || 'ocean';
}
function setTheme(id) { applyTheme(id); save(); render(); }
function setLang(id) {
  S.lang = id;
  if (!S.langsUsed.includes(id)) S.langsUsed.push(id);
  save(); render();
}
function renderLangGrid(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = Object.values(LANGS).map(l =>
    '<div class="lang-btn '+(S.lang===l.id?'active':'')+'" onclick="setLang(\''+l.id+'\')">' +
    '<div class="flag">'+l.flag+'</div><div class="lbl">'+l.short+'</div></div>'
  ).join('');
}
function renderThemeGrid() {
  const themes = [
    {id:'ocean',name:'Ocean',c:['#5b8aff','#22c55e']},
    {id:'midnight',name:'Midnight',c:['#a78bfa','#e879f9']},
    {id:'forest',name:'Forest',c:['#34d399','#a3e635']},
    {id:'sunset',name:'Sunset',c:['#f97316','#fbbf24']},
    {id:'neo',name:'Neo',c:['#22d3ee','#f472b6']},
    {id:'minimal',name:'Minimal',c:['#e4e4e7','#a1a1aa']}
  ];
  const el = document.getElementById('themeGrid');
  if (!el) return;
  el.innerHTML = themes.map(t =>
    '<div class="theme-btn '+(S.theme===t.id?'active':'')+'" onclick="setTheme(\''+t.id+'\')">' +
    '<div class="theme-preview"><span style="background:'+t.c[0]+'"></span><span style="background:'+t.c[1]+'"></span></div>' +
    '<div class="tname">'+t.name+'</div></div>'
  ).join('');
}

function renderPath() {
  const lessons = getLessons();
  const wrap = document.getElementById('lessonsPath');
  if (!wrap) return;
  if (!lessons.length) {
    wrap.innerHTML = '<p style="text-align:center;color:var(--muted);padding:24px">Nenhuma lição neste idioma ainda.</p>';
    return;
  }
  const units = {};
  lessons.forEach(l => {
    const u = l.unit || 'Geral';
    if (!units[u]) units[u] = [];
    units[u].push(l);
  });
  let html = '';
  let globalIdx = 0;
  const completedCount = lessons.filter(x => S.completedLessons.includes(S.lang+'_'+x.id)).length;

  Object.keys(units).forEach(unitName => {
    html += '<div class="unit-label">' + unitName + '</div><div class="path">';
    units[unitName].forEach((l, i) => {
      const key = S.lang + '_' + l.id;
      const done = S.completedLessons.includes(key);
      const locked = l.id > completedCount + 1;
      const isCurrent = !done && !locked && (globalIdx === completedCount || (completedCount === 0 && globalIdx === 0));
      let cls = 'path-node';
      if (done) cls += ' done';
      else if (locked) cls += ' locked';
      else if (isCurrent) cls += ' current';
      const icon = done ? '✓' : (l.cat === 'interview' ? '💼' : l.cat === 'meetings' ? '👥' : '📘');
      html += '<div class="'+cls+'" onclick="'+(locked?'':'startLesson('+l.id+')')+'">' +
        icon +
        '<div class="path-node-label">' + l.title.split(' ').slice(0,2).join(' ') + '</div>' +
        (done ? '' : '<div class="path-node-xp">+'+l.xp+'</div>') +
        '</div>';
      if (i < units[unitName].length - 1) {
        html += '<div class="path-connector'+(done?' done':'')+'"></div>';
      }
      globalIdx++;
    });
    html += '</div>';
  });
  wrap.innerHTML = html;
}

function render() {
  if (!S.user) return;
  const rankIdx = getRankIndex(S.xp), rank = RANKS[rankIdx];
  const next = xpNext(S.xp), prev = rank.min;
  const pct = next > prev ? ((S.xp - prev) / (next - prev)) * 100 : 100;
  const lang = LANGS[S.lang] || LANGS.en;

  document.getElementById('logoFlag').textContent = lang.flag;
  document.getElementById('hStreak').textContent = '🔥 ' + S.streak;
  document.getElementById('hXp').textContent = '⚡ ' + S.xp;
  document.getElementById('xpBar').style.width = pct + '%';
  document.getElementById('xpCurrent').textContent = S.xp + ' XP';
  document.getElementById('xpNext').textContent = next + ' XP';
  document.getElementById('userAvatar').textContent = S.user.avatar;
  document.getElementById('userName').textContent = S.user.name.split(' ')[0];
  document.getElementById('profileAvatar').textContent = S.user.avatar;
  document.getElementById('profileName').textContent = S.user.name;
  document.getElementById('profileEmail').textContent = S.user.email;
  document.getElementById('rankIcon').textContent = rank.icon;
  document.getElementById('rankName').textContent = rank.name;
  document.getElementById('rankDesc').textContent = rankIdx < RANKS.length - 1 ? (next - S.xp) + ' XP para ' + RANKS[rankIdx+1].name : 'Rank máximo!';
  document.getElementById('rankFill').style.width = pct + '%';
  document.getElementById('statXp').textContent = S.xp;
  document.getElementById('statStreak').textContent = S.streak;
  document.getElementById('statBadges').textContent = S.badges.length;
  document.getElementById('dailyGoalText').textContent = S.dailyDone >= 1 ? '✅ Meta completa hoje!' : 'Complete 1 lição hoje';

  renderLangGrid('langGrid');
  renderLangGrid('langGridProfile');
  renderThemeGrid();
  renderPath();

  const lessons = getLessons();
  const nextL = lessons.find(l => !S.completedLessons.includes(S.lang + '_' + l.id));
  document.getElementById('todayAction').innerHTML = nextL
    ? '<button class="btn btn-primary" onclick="startLesson('+nextL.id+')">▶ '+nextL.title+' · +'+nextL.xp+' XP</button>'
    : '<button class="btn btn-accent" onclick="showScreen(\'practice\')">📞 Praticar ligação</button>';

  document.getElementById('lessonsLangLabel').textContent = lang.name;

  document.getElementById('phoneList').innerHTML = getCalls().map(c => {
    const key = S.lang + '_' + c.id;
    const done = S.completedCalls.includes(key);
    return '<div class="item '+(done?'done':'')+'" onclick="startCall(\''+c.id+'\')">' +
      '<div class="item-icon green">📞</div>' +
      '<div class="item-body"><h4>'+c.title+'</h4><p>'+c.name+' · '+c.role+'</p></div>' +
      '<div class="item-xp">'+(done?'Feito':'+'+c.xp+' XP')+'</div></div>';
  }).join('') || '<p style="color:var(--muted)">Nenhuma ligação neste idioma.</p>';

  document.getElementById('achProgress').textContent = S.badges.length + ' de ' + BADGES.length;
  document.getElementById('achGrid').innerHTML = BADGES.map(b => {
    const u = S.badges.includes(b.id);
    return '<div class="ach-item '+(u?'unlocked':'locked')+'"><div class="icon">'+b.icon+'</div><div class="name">'+b.name+'</div><div class="desc">'+b.desc+'</div></div>';
  }).join('');

  document.getElementById('pLessons').textContent = S.completedLessons.length;
  document.getElementById('pCalls').textContent = S.completedCalls.length;
  const tot = S.correct + S.wrong;
  document.getElementById('pAccuracy').textContent = tot ? Math.round(S.correct / tot * 100) + '%' : '—';
}

function startLesson(id) {
  const lessons = getLessons();
  curLesson = lessons.find(l => l.id === id);
  if (!curLesson) return;
  curSec = 0;
  hearts = 3;
  lessonCorrect = 0;
  lessonWrong = 0;
  waitingFeedback = false;
  document.getElementById('feedbackBar').classList.remove('show');
  document.getElementById('mainNav').classList.add('hidden');
  document.getElementById('mainHeader').classList.add('hidden');
  showScreen('player');
  renderSec();
}
function exitLesson() {
  curLesson = null;
  document.getElementById('feedbackBar').classList.remove('show');
  document.getElementById('mainNav').classList.remove('hidden');
  document.getElementById('mainHeader').classList.remove('hidden');
  showScreen('lessons');
}
function updatePlayerUI() {
  const secs = curLesson ? (curLesson.sections || []) : [];
  const pct = secs.length ? (curSec / secs.length) * 100 : 0;
  document.getElementById('playerProgress').style.width = pct + '%';
  document.getElementById('playerHearts').textContent = '❤️'.repeat(hearts) + '🖤'.repeat(3 - hearts);
}

function renderSec() {
  if (!curLesson) return;
  const secs = curLesson.sections || [];
  updatePlayerUI();
  if (curSec >= secs.length) {
    finishLesson();
    return;
  }
  const sec = secs[curSec];
  const body = document.getElementById('lessonBody');
  waitingFeedback = false;
  document.getElementById('feedbackBar').classList.remove('show');

  if (sec.t === 'intro') {
    body.innerHTML =
      '<div class="section-type">Introdução</div>' +
      '<p class="q">' + sec.c + '</p>' +
      '<button class="btn btn-primary" onclick="nextSec()">Começar</button>';
  } else if (sec.t === 'vocab') {
    const vocab = curLesson.vocab || [];
    body.innerHTML =
      '<div class="section-type">Vocabulário · toque para ouvir</div>' +
      vocab.map((v, i) =>
        '<div class="vocab-card" onclick="speak(\'' + esc(v.w) + '\')">' +
        '<button class="sound-btn" onclick="event.stopPropagation();speak(\'' + esc(v.w) + '\')">🔊</button>' +
        '<div><div class="v-word">' + v.w + '</div>' +
        '<div class="v-mean">' + v.m + '</div>' +
        (v.e ? '<div class="v-ex">' + v.e + '</div>' : '') +
        '</div></div>'
      ).join('') +
      '<button class="btn btn-primary" style="margin-top:12px" onclick="nextSec()">Continuar</button>';
    if (vocab[0]) setTimeout(() => speak(vocab[0].w), 300);
  } else if (sec.t === 'mc') {
    const letters = ['A','B','C','D'];
    body.innerHTML =
      '<div class="section-type">Escolha a resposta</div>' +
      '<p class="q">' + sec.q + '</p>' +
      sec.opts.map((o, i) =>
        '<div class="opt" id="opt'+i+'" onclick="answerMc('+i+','+sec.ok+')">' +
        '<span class="opt-letter">' + letters[i] + '</span> ' + o + '</div>'
      ).join('');
  } else if (sec.t === 'speak') {
    body.innerHTML =
      '<div class="section-type">Pratique falando</div>' +
      '<div class="speak-box">' +
      '<div class="speak-prompt">' + sec.p + '</div>' +
      '<button class="big-sound" onclick="speak(\'' + esc(sec.e) + '\')">🔊</button>' +
      '<div class="speak-example"><strong>Modelo:</strong> ' + sec.e + '</div>' +
      '</div>' +
      '<button class="btn btn-ghost" onclick="speak(\'' + esc(sec.e) + '\')" style="margin-bottom:8px">Ouvir de novo</button>' +
      '<button class="btn btn-primary" onclick="nextSec()">Já pratiquei · Continuar</button>';
    setTimeout(() => speak(sec.e), 400);
  } else {
    body.innerHTML = '<p class="q">' + (sec.c || '') + '</p><button class="btn btn-primary" onclick="nextSec()">Continuar</button>';
  }
}

function esc(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function answerMc(chosen, ok) {
  if (waitingFeedback) return;
  waitingFeedback = true;
  const opts = document.querySelectorAll('.opt');
  opts.forEach((o, i) => {
    o.style.pointerEvents = 'none';
    if (i === ok) o.classList.add('ok');
    else if (i === chosen) o.classList.add('bad');
  });
  const bar = document.getElementById('feedbackBar');
  const title = document.getElementById('fbTitle');
  const text = document.getElementById('fbText');
  if (chosen === ok) {
    lessonCorrect++;
    S.correct++;
    title.textContent = 'Correto!';
    text.textContent = 'Boa resposta 👏';
    bar.className = 'feedback-bar show ok';
    speak('Correct!');
  } else {
    lessonWrong++;
    S.wrong++;
    hearts = Math.max(0, hearts - 1);
    updatePlayerUI();
    const sec = curLesson.sections[curSec];
    title.textContent = 'Quase!';
    text.textContent = sec.fb || ('A resposta certa era: ' + sec.opts[ok]);
    bar.className = 'feedback-bar show bad';
    speak('Try again');
  }
  save();
}

function continueAfterFeedback() {
  document.getElementById('feedbackBar').classList.remove('show');
  waitingFeedback = false;
  nextSec();
}

function nextSec() {
  if (waitingFeedback) return;
  curSec++;
  renderSec();
}

function finishLesson() {
  if (!curLesson) return;
  const key = S.lang + '_' + curLesson.id;
  const xp = curLesson.xp || 30;
  if (!S.completedLessons.includes(key)) {
    S.completedLessons.push(key);
    S.xp += xp;
    S.dailyDone = 1;
    updateStreak();
    if (lessonWrong === 0) S.perfectLessons = (S.perfectLessons || 0) + 1;
    checkBadges();
    save();
  }
  document.getElementById('celebXp').textContent = '+' + xp + ' XP';
  document.getElementById('celeb').classList.add('show');
  speak('Great job!');
  curLesson = null;
}

function closeCeleb() {
  document.getElementById('celeb').classList.remove('show');
  document.getElementById('mainNav').classList.remove('hidden');
  document.getElementById('mainHeader').classList.remove('hidden');
  showScreen('lessons');
  render();
}

function startCall(id) {
  const calls = getCalls();
  const call = calls.find(c => c.id === id);
  if (!call) return;
  const key = S.lang + '_' + call.id;
  if (!S.completedCalls.includes(key)) {
    S.completedCalls.push(key);
    addXp(call.xp || 25);
    S.dailyDone = 1;
    updateStreak();
    checkBadges();
    save();
  }
  showToast('Simulação: ' + call.title, '📞');
  render();
}

function load() {
  try {
    const raw = localStorage.getItem('polywork_v1');
    if (raw) Object.assign(S, JSON.parse(raw));
  } catch(e) {}
  applyTheme(S.theme);
  setMascot();
  if (S.user) enterApp();
  else {
    const loginEl = document.getElementById('loginMascotSvg');
    if (loginEl) loginEl.innerHTML = mascotSVG();
  }
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('installBanner');
  if (banner) banner.classList.add('show');
});
document.getElementById('installBtn')?.addEventListener('click', async () => {
  if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; }
  document.getElementById('installBanner')?.classList.remove('show');
});
document.getElementById('installDismiss')?.addEventListener('click', () => {
  localStorage.setItem('polywork_hide_install', '1');
  document.getElementById('installBanner')?.classList.remove('show');
});

load();
