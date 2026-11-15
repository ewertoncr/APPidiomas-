// ===== VIP + MASCOT ASSISTANT =====
const VIP_PRICE = 'R$ 9,90';
const FREE_LESSON_LIMIT = 2;

const MASCOT_LINES = {
  greet: [
    'Oi! Eu sou a Nova, sua parceira de idiomas! 🌟',
    'E aí! Pronto pra aprender de um jeito divertido?',
    'Olá! Bora conquistar um novo idioma juntos?'
  ],
  tip: [
    'Dica: pratique um pouquinho todo dia. Streak é poder! 🔥',
    'Toque nas palavras pra ouvir a pronúncia. Seu ouvido agradece!',
    'Errou? Sem drama! Cada erro te ensina algo novo 💪',
    'Combo de acertos dá mais XP. Fica esperto! ⚡'
  ],
  cheer: [
    'Você está mandando bem! Continua assim! 🎉',
    'Uau! Que progresso incrível!',
    'Orgulho total daqui! 🏆'
  ],
  wrong: [
    'Quase! Tenta de novo, você consegue 💪',
    'Não desanima! A próxima você acerta!',
    'Erros fazem parte. Bora de novo!'
  ],
  vip: [
    'Com o VIP você desbloqueia TUDO e aprende sem limites! 👑',
    'VIP = todas as lições, idiomas e super poderes. Vale muito!'
  ],
  idle: [
    'Ei! Toca em mim se quiser uma dica 😊',
    'Estou aqui se precisar de ajuda!',
    'Hmm... que tal uma lição agora?'
  ]
};

function isVip() {
  return !!(typeof S !== 'undefined' && S && S.vip);
}

function canAccessLesson(lessonId) {
  if (isVip()) return true;
  return lessonId <= FREE_LESSON_LIMIT;
}

function activateVip() {
  if (typeof S === 'undefined') return;
  S.vip = true;
  S.vipSince = new Date().toISOString();
  if (typeof save === 'function') save();
  showToast('VIP ativado! Bem-vindo 👑', '👑');
  closeVipModal();
  if (typeof render === 'function') render();
  setMascotMood('cheer');
}

function showVipModal() {
  const el = document.getElementById('vipModal');
  if (el) el.classList.add('show');
}

function closeVipModal() {
  document.getElementById('vipModal')?.classList.remove('show');
}

function renderVipUI() {
  const banner = document.getElementById('vipBanner');
  const active = document.getElementById('vipActive');
  const hVip = document.getElementById('hVip');
  const bannerP = document.getElementById('vipBannerProfile');
  if (hVip) hVip.style.display = isVip() ? 'flex' : 'none';
  if (banner) banner.style.display = isVip() ? 'none' : 'block';
  if (bannerP) bannerP.style.display = isVip() ? 'none' : 'block';
  if (active) active.style.display = isVip() ? 'block' : 'none';
}

function pickLine(key) {
  const arr = MASCOT_LINES[key] || MASCOT_LINES.idle;
  return arr[Math.floor(Math.random() * arr.length)];
}

function setMascotMood(kind) {
  const textEl = document.getElementById('mascotText');
  const moodEl = document.getElementById('mascotMood');
  if (!textEl) return;
  const moods = { greet:'😊', tip:'💡', cheer:'🎉', wrong:'💪', vip:'👑', idle:'👋' };
  textEl.textContent = pickLine(kind || 'idle');
  if (moodEl) moodEl.textContent = moods[kind] || '😊';
}

function talkToMascot() {
  const kinds = isVip() ? ['tip','cheer','idle','greet'] : ['tip','idle','vip','greet'];
  const k = kinds[Math.floor(Math.random() * kinds.length)];
  setMascotMood(k);
  const svg = document.getElementById('mascotSvg');
  if (svg) {
    svg.style.animation = 'none';
    void svg.offsetHeight;
    svg.style.animation = 'bounce 0.6s ease';
  }
}

function onCorrectAnswer() {
  if (Math.random() > 0.5) setMascotMood('cheer');
}

function onWrongAnswer() {
  setMascotMood('wrong');
}

const PLAY_THEMES = [
  {id:'play', name:'Play', c:['#7c5cff','#00d4ff']},
  {id:'candy', name:'Candy', c:['#ff4d8d','#ffc107']},
  {id:'neon', name:'Neon', c:['#00f5d4','#f72585']},
  {id:'ocean', name:'Dark', c:['#5b8aff','#22c55e']}
];

setTimeout(function() {
  if (typeof ensureGameState === 'function') {
    const prev = ensureGameState;
    window.ensureGameState = function() {
      prev();
      if (typeof S !== 'undefined' && S && S.vip == null) S.vip = false;
    };
  }
  if (typeof startLesson === 'function') {
    const prevStart = startLesson;
    window.startLesson = function(id) {
      if (!canAccessLesson(id)) {
        setMascotMood('vip');
        showVipModal();
        return;
      }
      prevStart(id);
    };
  }
  if (typeof answerMc === 'function') {
    const prevAns = answerMc;
    window.answerMc = function(chosen, ok) {
      prevAns(chosen, ok);
      if (chosen === ok) onCorrectAnswer();
      else onWrongAnswer();
    };
  }
}, 150);
