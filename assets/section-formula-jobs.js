/*
  Formula jobs — one open card at a time, its ingredients rendered into the
  single panel below the grid. Tapping the open card closes it again.
*/
(function () {
  function init(root) {
    var cards = root.querySelectorAll('[data-formula-job]');
    var panel = root.querySelector('[data-formula-jobs-panel]');
    var hint = root.querySelector('[data-formula-jobs-hint]');
    var dataEl = root.querySelector('[data-formula-jobs-data]');
    if (!cards.length || !panel || !dataEl) return;

    var data;
    try {
      data = JSON.parse(dataEl.textContent);
    } catch (e) {
      return;
    }

    function close() {
      cards.forEach(function (c) { c.setAttribute('aria-expanded', 'false'); });
      panel.hidden = true;
      panel.textContent = '';
      if (hint) hint.hidden = false;
    }

    function open(index) {
      var rows = (data[index] && data[index].rows) || [];
      if (!rows.length) { close(); return; }

      cards.forEach(function (c) {
        c.setAttribute('aria-expanded', String(Number(c.dataset.formulaJob) === index));
      });

      panel.textContent = '';
      rows.forEach(function (row) {
        var wrap = document.createElement('div');
        wrap.className = 'formula-jobs__row';

        var name = document.createElement('span');
        name.className = 'formula-jobs__row-name';
        name.textContent = row.name || '';
        wrap.appendChild(name);

        if (row.role) {
          var role = document.createElement('span');
          role.className = 'formula-jobs__row-role';
          role.textContent = row.role;
          wrap.appendChild(role);
        }
        panel.appendChild(wrap);
      });

      panel.hidden = false;
      if (hint) hint.hidden = true;
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var index = Number(card.dataset.formulaJob);
        if (card.getAttribute('aria-expanded') === 'true') close();
        else open(index);
      });
    });
  }

  function boot() {
    document.querySelectorAll('[data-formula-jobs]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', boot);
})();
