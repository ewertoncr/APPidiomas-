// ===== TRILHA VISUAL REMODELADA =====
(function() {
  const UNIT_ICONS = ['🌱','🚀','⭐','🏆','💎','🔥'];
  const CAT_ICON = {
    interview: '💼',
    meetings: '👥',
    vocab: '📚',
    speak: '🗣️',
    grammar: '✏️',
    default: '🎯'
  };

  function trailIcon(l, done, locked) {
    if (done) return '✅';
    if (locked) return '🔒';
    return CAT_ICON[l.cat] || CAT_ICON.default;
  }

  function shiftClass(i) {
    const m = i % 3;
    if (m === 0) return 'shift-center';
    if (m === 1) return 'shift-right';
    return 'shift-left';
  }

  window.renderPath = function renderPath() {
    const lessons = typeof getLessons === 'function' ? getLessons() : [];
    const wrap = document.getElementById('lessonsPath');
    if (!wrap) return;
    if (!lessons.length) {
      wrap.innerHTML = '<p style="text-align:center;color:var(--muted);padding:24px;font-weight:700">Nenhuma lição neste idioma ainda.</p>';
      return;
    }

    const units = {};
    lessons.forEach(l => {
      const u = l.unit || 'Unidade 1';
      if (!units[u]) units[u] = [];
      units[u].push(l);
    });

    const completedCount = lessons.filter(x =>
      S.completedLessons.includes(S.lang + '_' + x.id)
    ).length;

    let html = '';
    html += '<div class="trail-hero">';
    html += '<h2>🎮 A tua trilha</h2>';
    html += '<p>Completa as bolinhas para avançar</p>';
    html += '<div class="trail-stats">';
    html += '<span class="trail-stat-pill">✅ ' + completedCount + '/' + lessons.length + ' lições</span>';
    html += '<span class="trail-stat-pill">⚡ ' + (S.xp || 0) + ' XP</span>';
    html += '</div></div>';

    let globalIdx = 0;
    let unitNum = 0;
    Object.keys(units).forEach(unitName => {
      const list = units[unitName];
      const doneInUnit = list.filter(l => S.completedLessons.includes(S.lang + '_' + l.id)).length;
      const pct = Math.round((doneInUnit / list.length) * 100);
      const icon = UNIT_ICONS[unitNum % UNIT_ICONS.length];
      unitNum++;

      html += '<div class="unit-card">';
      html += '<div class="unit-header">';
      html += '<div class="unit-badge">' + icon + '</div>';
      html += '<div class="unit-meta">';
      html += '<h3>' + unitName + '</h3>';
      html += '<p>' + doneInUnit + ' de ' + list.length + ' lições</p>';
      html += '<div class="unit-progress"><i style="width:' + pct + '%"></i></div>';
      html += '</div></div>';
      html += '<div class="path">';

      list.forEach((l, i) => {
        const key = S.lang + '_' + l.id;
        const done = S.completedLessons.includes(key);
        const locked = l.id > completedCount + 1;
        const isCurrent = !done && !locked && (globalIdx === completedCount || (completedCount === 0 && globalIdx === 0));
        let cls = 'path-node';
        if (done) cls += ' done';
        else if (locked) cls += ' locked';
        else if (isCurrent) cls += ' current';

        const title = (l.title || ('Lição ' + l.id)).split(' ').slice(0, 3).join(' ');
        const nodeIcon = trailIcon(l, done, locked);

        html += '<div class="path-row ' + shiftClass(i) + '">';
        html += '<div class="' + cls + '" onclick="' + (locked ? "showToast('Completa a lição anterior','🔒')" : ('startLesson(' + l.id + ')')) + '">';
        html += '<span class="node-icon">' + nodeIcon + '</span>';
        html += '<div class="path-node-label">' + title + '</div>';
        if (!done && !locked) html += '<div class="path-node-xp">+' + (l.xp || 10) + '</div>';
        if (locked) html += '<span class="lock-icon">🔒</span>';
        html += '</div></div>';

        if (i < list.length - 1) {
          html += '<div class="path-connector-wrap"><div class="path-connector' + (done ? ' done' : '') + '"></div></div>';
        }
        globalIdx++;
      });

      html += '</div></div>';
    });

    wrap.innerHTML = html;
  };
})();
