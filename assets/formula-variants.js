/*
  Formula-dependent content.

  The visitor's formula lives in the `strength` cookie, written by the quiz
  and rewritten whenever they pick a different plan on the page. It has three
  values — sensitive (Gentle 19-2), medium (Everyday 8-16) and strong
  (Super Strength 8-17) — and defaults to medium.

  Anything carrying data-ll-formula is shown only for that formula, and a
  section can supply per-formula eyebrow, heading and body in a
  [data-ll-formula-copy] JSON block.

  The cookie is polled rather than hooked: three different files write it,
  and a poll stays correct however that grows. It is a string compare a few
  times a second, and it stops while the tab is hidden.
*/
(function () {
  'use strict';

  var FORMULAS = ['sensitive', 'medium', 'strong'];
  var FALLBACK = 'medium';
  var POLL_MS = 400;

  function readStrength() {
    var parts = ('; ' + document.cookie).split('; strength=');
    var raw = parts.length === 2 ? (parts.pop().split(';').shift() || '') : '';
    raw = raw.trim().toLowerCase();
    if (raw === 'gentle') raw = 'sensitive';
    return FORMULAS.indexOf(raw) === -1 ? FALLBACK : raw;
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // the same {} emphasis the sections apply in Liquid, after escaping
  function stylize(value) {
    return esc(value).replace(/\{/g, "<span class='stylized'>").replace(/\}/g, '</span>');
  }

  /*
    Visibility is a class, never the `hidden` attribute: the analysis panels
    are an accordion that owns `hidden` itself, and setting it here would
    spring every closed panel open.
  */
  function applyVisibility(formula) {
    document.querySelectorAll('[data-ll-formula]').forEach(function (el) {
      var want = (el.getAttribute('data-ll-formula') || 'all').trim();
      el.classList.toggle('ll-formula-hidden', !(want === 'all' || want === formula));
    });
  }

  function applyCopy(formula) {
    document.querySelectorAll('[data-ll-formula-copy]').forEach(function (holder) {
      var copy;
      try { copy = JSON.parse(holder.textContent); } catch (e) { return; }
      var variant = copy[formula];
      var root = holder.closest('[data-ll-formula-scope]') || document;

      [['heading', true], ['body', false]].forEach(function (pair) {
        var key = pair[0];
        var target = root.querySelector('[data-ll-formula-' + key + ']');
        if (!target) return;

        // first run: keep what the section rendered, so there is something
        // to fall back to for a formula with no override of its own
        if (target.getAttribute('data-ll-formula-original') === null) {
          target.setAttribute('data-ll-formula-original', target.innerHTML);
        }

        var value = variant && variant[key];
        if (value) {
          target.innerHTML = pair[1] ? stylize(value) : esc(value);
          target.hidden = false;
        } else {
          target.innerHTML = target.getAttribute('data-ll-formula-original');
          target.hidden = target.textContent.trim() === '';
        }
      });
    });
  }

  var last = null;

  function apply() {
    var formula = readStrength();
    if (formula === last) return;
    last = formula;
    document.documentElement.setAttribute('data-ll-formula-active', formula);
    applyVisibility(formula);
    applyCopy(formula);
  }

  var timer = null;

  function start() {
    if (timer) return;
    timer = window.setInterval(apply, POLL_MS);
  }

  function stop() {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  }

  function boot() {
    apply();
    start();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); } else { apply(); start(); }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function () { last = null; apply(); });

  // so the theme editor and other scripts can force a re-read
  window.llApplyFormulaVariants = function () { last = null; apply(); };
})();
