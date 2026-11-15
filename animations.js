// ===== MICRO-ANIMAÇÕES JS (hooks) =====
(function () {
  document.addEventListener('click', function (e) {
    const node = e.target.closest && e.target.closest('.path-node.locked');
    if (!node) return;
    node.classList.remove('shake');
    void node.offsetWidth;
    node.classList.add('shake');
    setTimeout(function () { node.classList.remove('shake'); }, 400);
  }, true);

  const obsTarget = document.getElementById('playerHearts');
  if (obsTarget && typeof MutationObserver !== 'undefined') {
    const mo = new MutationObserver(function () {
      const t = obsTarget.textContent || '';
      const count = (t.match(/❤️/g) || []).length;
      obsTarget.classList.toggle('low', count > 0 && count <= 1);
    });
    mo.observe(obsTarget, { childList: true, characterData: true, subtree: true });
  }
})();
