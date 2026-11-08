/*
  Formula builder.

  Walks a person's causes one at a time, adding the actives each one calls
  for, holds on the finished formula, then moves to the next person. Clicking
  a tab pins it to that person and stops the cycle.
*/
(function () {
  'use strict';

  var TICK = 1000;
  var REDUCED_TICK = 3500;
  var HOLD_TICKS = 2;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function clean(list) {
    return (list || []).map(function (s) { return String(s).trim(); }).filter(Boolean);
  }

  function init(root) {
    var holder = root.querySelector('[data-formula-data]');
    if (!holder) return;

    var data;
    try { data = JSON.parse(holder.textContent); } catch (e) { return; }

    var causes = data.causes || [];
    var examples = data.examples || [];
    if (!causes.length || !examples.length) return;

    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-formula-tab]'));
    var causeCol = root.querySelector('[data-formula-causes]');
    var ingRow = root.querySelector('[data-formula-ing-row]');
    var countEl = root.querySelector('[data-formula-count]');
    if (!causeCol || !ingRow) return;

    var causeLabel = causeCol.querySelector('.formula-builder__col-label');
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var state = { ex: 0, shown: reduced ? Infinity : 0, hold: 0, pinned: false };
    var timer = null;

    function causeFor(key) {
      return causes.filter(function (c) { return c.key === key; })[0];
    }

    // The sensitivity cause is named for the person's level, not its own name.
    function nameFor(cause, example) {
      if (cause.key !== data.sensitivityKey || !example.sensitivity) return cause.name;
      return example.sensitivity + (data.sensitivitySuffix || '');
    }

    function render() {
      var example = examples[state.ex];
      var keys = clean(example.causes);
      var shown = Math.min(state.shown, keys.length);

      var chips = keys.map(function (key, i) {
        var cause = causeFor(key);
        if (!cause) return '';
        var on = i < shown;
        return (
          '<span class="formula-builder__chip' + (on ? ' is-on' : '') + '"' +
          (on ? ' style="background:' + esc(cause.color) + ';border-color:' + esc(cause.color) + '"' : '') +
          '><span class="formula-builder__dot" aria-hidden="true"></span>' +
          esc(nameFor(cause, example)) + '</span>'
        );
      });
      causeCol.innerHTML = (causeLabel ? causeLabel.outerHTML : '') + chips.join('');

      // Actives accumulate across the causes revealed so far, deduped — the
      // first cause to call for one owns its colour.
      var ings = [];
      keys.slice(0, shown).forEach(function (key) {
        var cause = causeFor(key);
        if (!cause) return;
        clean(cause.ings).forEach(function (name) {
          if (!ings.some(function (i) { return i.name === name; })) {
            ings.push({ name: name, color: cause.color });
          }
        });
      });

      ingRow.innerHTML = ings.map(function (i) {
        return '<span class="formula-builder__ing" style="border-left-color:' + esc(i.color) + '">' + esc(i.name) + '</span>';
      }).join('');

      if (countEl) countEl.textContent = ings.length ? '· ' + ings.length + (data.countSuffix || '') : '';

      tabs.forEach(function (tab, i) {
        var on = i === state.ex;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    function tick() {
      if (state.pinned) return;
      var keys = clean(examples[state.ex].causes);
      if (reduced) {
        state.ex = (state.ex + 1) % examples.length;
      } else if (state.shown < keys.length) {
        state.shown += 1;
      } else if (state.hold < HOLD_TICKS) {
        state.hold += 1;
        return;
      } else {
        state.ex = (state.ex + 1) % examples.length;
        state.shown = 0;
        state.hold = 0;
      }
      render();
    }

    function start() {
      if (timer) return;
      timer = window.setInterval(tick, reduced ? REDUCED_TICK : TICK);
    }

    function stop() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        state.ex = i;
        state.shown = clean(examples[i].causes).length;
        state.hold = 0;
        state.pinned = true;
        stop();
        render();
      });
    });

    // Only run while it is on screen; a cycling widget below the fold is
    // finished before anyone reaches it.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !state.pinned) start(); else stop();
        });
      }, { threshold: 0.25 }).observe(root);
    } else {
      start();
    }

    render();
  }

  function boot() {
    document.querySelectorAll('[data-formula-builder]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', boot);
})();
