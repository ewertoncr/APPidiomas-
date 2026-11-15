// ===== POLYWORK ADVANCED GAMIFICATION =====
const LEAGUES = [
  {id:'bronze', name:'Bronze', icon:'🥉', min:0},
  {id:'silver', name:'Prata', icon:'🥈', min:150},
  {id:'gold', name:'Ouro', icon:'🥇', min:400},
  {id:'sapphire', name:'Safira', icon:'💠', min:800},
  {id:'ruby', name:'Rubi', icon:'🔴', min:1400},
  {id:'diamond', name:'Diamante', icon:'💎', min:2200}
];
const QUEST_POOL = [
  {id:'q_lesson', icon:'📚', text:'Complete 1 lição', target:1, type:'lessons', reward:{xp:15,gems:5}},
  {id:'q_perfect', icon:'⭐', text:'Lição perfeita', target:1, type:'perfect', reward:{xp:25,gems:10}},
  {id:'q_xp50', icon:'⚡', text:'Ganhe 50 XP hoje', target:50, type:'xp', reward:{xp:20,gems:8}},
  {id:'q_calls', icon:'📞', text:'Faça 1 prática', target:1, type:'calls', reward:{xp:15,gems:5}},
  {id:'q_combo3', icon:'🔥', text:'Combo de 3 acertos', target:3, type:'combo', reward:{xp:20,gems:8}},
  {id:'q_vocab', icon:'🗣️', text:'Pratique 2 seções de fala', target:2, type:'speak', reward:{xp:15,gems:6}}
];
const SHOP_ITEMS = [
  {id:'freeze', name:'Freeze de Streak', icon:'🧊', desc:'Protege seu streak por 1 dia', cost:50, effect:'freeze'},
  {id:'hearts', name:'Vidas extras', icon:'❤️', desc:'+2 vidas na próxima lição', cost:30, effect:'hearts'},
  {id:'boost', name:'Boost de XP', icon:'🚀', desc:'+50% XP na próxima lição', cost:40, effect:'boost'}
];

function ensureGameState() {
  if (typeof S === 'undefined' || !S) return;
  if (S.gems == null) S.gems = 0;
  if (S.vip == null) S.vip = false;
  if (S.weeklyXp == null) S.weeklyXp = 0;
  if (S.weekId == null) S.weekId = getWeekId();
  if (S.freeze == null) S.freeze = 0;
  if (S.extraHearts == null) S.extraHearts = 0;
  if (S.xpBoost == null) S.xpBoost = false;
  if (S.comboBest == null) S.comboBest = 0;
  if (S.dailyChestClaimed == null) S.dailyChestClaimed = null;
  if (S.quests == null || S.questsDate !== todayStr()) {
    rollDailyQuests();
  }
  const wid = getWeekId();
  if (S.weekId !== wid) {
    S.weekId = wid;
    S.weeklyXp = 0;
  }
}

function todayStr() { return new Date().toDateString(); }
function getWeekId() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(),0,1);
  return d.getFullYear() + '-W' + Math.ceil((((d-onejan)/86400000)+onejan.getDay()+1)/7);
}

function rollDailyQuests() {
  const shuffled = QUEST_POOL.slice().sort(() => Math.random()-0.5);
  S.quests = shuffled.slice(0,3).map(q => ({
    id: q.id, icon:q.icon, text:q.text, target:q.target, type:q.type,
    progress:0, done:false, claimed:false, reward:q.reward
  }));
  S.questsDate = todayStr();
}

function getLeague() {
  ensureGameState();
  let i = 0;
  for (let r=0;r<LEAGUES.length;r++) if (S.weeklyXp >= LEAGUES[r].min) i=r;
  return {current: LEAGUES[i], next: LEAGUES[i+1]||null, idx:i};
}

function addGems(n) {
  ensureGameState();
  S.gems += n;
  if (n>0) showToast('+' + n + ' 💎', '💎');
  save();
}

function addXpAdvanced(n, opts) {
  opts = opts || {};
  ensureGameState();
  let mult = 1;
  if (S.xpBoost && !opts.noBoost) { mult = 1.5; S.xpBoost = false; }
  if (opts.combo && opts.combo >= 3) mult += 0.25;
  if (opts.combo && opts.combo >= 5) mult += 0.25;
  const gained = Math.round(n * mult);
  const oldRank = getRankIndex(S.xp);
  S.xp += gained;
  S.weeklyXp = (S.weeklyXp||0) + gained;
  const newRank = getRankIndex(S.xp);
  checkBadges();
  updateQuestProgress('xp', gained);
  if (newRank > oldRank) {
    setTimeout(() => showLevelUp(RANKS[newRank]), 600);
  }
  showToast('+' + gained + ' XP' + (mult>1?' (x'+mult.toFixed(1)+')':''), '⚡');
  save();
  return gained;
}

function updateQuestProgress(type, amount) {
  ensureGameState();
  if (!S.quests) return;
  amount = amount || 1;
  S.quests.forEach(q => {
    if (q.done || q.type !== type) return;
    q.progress = Math.min(q.target, (q.progress||0) + amount);
    if (q.progress >= q.target) {
      q.done = true;
      showToast('Missão completa: ' + q.text, q.icon);
    }
  });
  save();
}

function claimQuest(id) {
  ensureGameState();
  const q = (S.quests||[]).find(x => x.id === id);
  if (!q || !q.done || q.claimed) return;
  q.claimed = true;
  S.xp += q.reward.xp;
  S.weeklyXp = (S.weeklyXp||0) + q.reward.xp;
  addGems(q.reward.gems);
  showToast('+' + q.reward.xp + ' XP · +' + q.reward.gems + ' 💎', '🎁');
  checkBadges();
  save();
  render();
}

function claimDailyChest() {
  ensureGameState();
  if (S.dailyChestClaimed === todayStr()) {
    showToast('Baú já coletado hoje', '📦');
    return;
  }
  S.dailyChestClaimed = todayStr();
  const xp = 10 + Math.floor(Math.random()*20);
  const gems = 5 + Math.floor(Math.random()*15);
  S.xp += xp;
  S.weeklyXp = (S.weeklyXp||0) + xp;
  addGems(gems);
  showToast('Baú: +' + xp + ' XP · +' + gems + ' 💎', '🎁');
  checkBadges();
  save();
  render();
}

function buyShopItem(id) {
  ensureGameState();
  const item = SHOP_ITEMS.find(x => x.id === id);
  if (!item) return;
  if (S.gems < item.cost) {
    showToast('Gems insuficientes', '💎');
    return;
  }
  S.gems -= item.cost;
  if (item.effect === 'freeze') S.freeze = (S.freeze||0) + 1;
  if (item.effect === 'hearts') S.extraHearts = (S.extraHearts||0) + 2;
  if (item.effect === 'boost') S.xpBoost = true;
  showToast('Comprado: ' + item.name, item.icon);
  save();
  render();
}

function updateStreakAdvanced() {
  const today = todayStr();
  if (S.lastDate === today) return;
  const yest = new Date(Date.now()-86400000).toDateString();
  if (S.lastDate === yest) {
    S.streak = (S.streak||0) + 1;
  } else if (S.freeze > 0 && S.lastDate) {
    S.freeze -= 1;
    showToast('Freeze usado! Streak protegido', '🧊');
  } else {
    S.streak = 1;
  }
  S.lastDate = today;
}

function showLevelUp(rank) {
  const el = document.getElementById('levelUp');
  if (!el) return;
  document.getElementById('levelUpIcon').textContent = rank.icon;
  document.getElementById('levelUpName').textContent = rank.name;
  el.classList.add('show');
}

function closeLevelUp() {
  document.getElementById('levelUp')?.classList.remove('show');
}

function renderQuests() {
  ensureGameState();
  const el = document.getElementById('questsList');
  if (!el) return;
  el.innerHTML = (S.quests||[]).map(q => {
    const pct = Math.min(100, Math.round((q.progress||0)/q.target*100));
    return '<div class="quest-item '+(q.done?'done':'')+'">' +
      '<div class="quest-icon">'+q.icon+'</div>' +
      '<div class="quest-body">' +
        '<div class="quest-text">'+q.text+'</div>' +
        '<div class="quest-bar"><div class="quest-fill" style="width:'+pct+'%"></div></div>' +
        '<div class="quest-meta">'+(q.progress||0)+'/'+q.target+' · +'+q.reward.xp+'XP +'+q.reward.gems+'💎</div>' +
      '</div>' +
      (q.done && !q.claimed
        ? '<button class="btn-claim" onclick="claimQuest(\''+q.id+'\')">Resgatar</button>'
        : (q.claimed ? '<span class="quest-claimed">✓</span>' : '')) +
    '</div>';
  }).join('');
}

function renderLeague() {
  ensureGameState();
  const el = document.getElementById('leagueCard');
  if (!el) return;
  const L = getLeague();
  const next = L.next;
  const prevMin = L.current.min;
  const nextMin = next ? next.min : L.current.min + 500;
  const pct = Math.min(100, ((S.weeklyXp - prevMin) / (nextMin - prevMin)) * 100);
  el.innerHTML =
    '<div class="league-row">' +
      '<div class="league-icon">'+L.current.icon+'</div>' +
      '<div class="league-info">' +
        '<h3>Liga '+L.current.name+'</h3>' +
        '<p>'+S.weeklyXp+' XP esta semana'+(next?' · '+(nextMin-S.weeklyXp)+' para '+next.name:'')+'</p>' +
        '<div class="rank-bar"><div class="rank-fill" style="width:'+pct+'%"></div></div>' +
      '</div>' +
    '</div>';
}

function renderShop() {
  ensureGameState();
  const el = document.getElementById('shopList');
  if (!el) return;
  el.innerHTML = SHOP_ITEMS.map(item =>
    '<div class="shop-item">' +
      '<div class="shop-icon">'+item.icon+'</div>' +
      '<div class="shop-body"><h4>'+item.name+'</h4><p>'+item.desc+'</p></div>' +
      '<button class="btn-shop" onclick="buyShopItem(\''+item.id+'\')">'+item.cost+' 💎</button>' +
    '</div>'
  ).join('');
}

function renderChest() {
  ensureGameState();
  const el = document.getElementById('dailyChest');
  if (!el) return;
  const claimed = S.dailyChestClaimed === todayStr();
  el.innerHTML = claimed
    ? '<div class="chest claimed">📦 Baú coletado hoje</div>'
    : '<button class="chest open" onclick="claimDailyChest()">🎁 Abrir baú diário</button>';
}
