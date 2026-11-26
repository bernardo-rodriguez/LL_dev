/*
  The sale banner's countdown.

  Driven by a real deadline from the section settings rather than a number
  that resets on every page load — a timer that always reads two days is a
  claim the page cannot keep. With no deadline set, or once it has passed,
  the timer simply does not appear.
*/
(function () {
  'use strict';

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick(el, deadline) {
    var left = deadline - Date.now();
    if (left <= 0) { el.hidden = true; return false; }

    var days = Math.floor(left / 86400000);
    var hrs = Math.floor(left / 3600000) % 24;
    var min = Math.floor(left / 60000) % 60;
    var sec = Math.floor(left / 1000) % 60;

    var value = el.querySelector('.buybox-v2__promo-timer-value');
    if (value) {
      value.textContent = (days > 0 ? days + 'd ' : '') + pad(hrs) + ':' + pad(min) + ':' + pad(sec);
    }

    /*
      The announcement strip shows the same deadline as four separate cells.
      It reads from this one timer rather than running a second clock, so the
      two can never drift apart or disagree about when the sale ends.
    */
    var cells = { days: days, hrs: hrs, min: min, sec: sec };
    Object.keys(cells).forEach(function (unit) {
      var cell = el.querySelector('[data-count-' + unit + ']');
      if (cell) cell.textContent = pad(cells[unit]);
    });

    el.hidden = false;
    return true;
  }

  function start(el) {
    var raw = el.getAttribute('data-promo-deadline');
    var deadline = Date.parse(raw);
    if (isNaN(deadline)) return;          // unparseable: leave it hidden
    if (!tick(el, deadline)) return;
    var id = window.setInterval(function () {
      if (!tick(el, deadline)) window.clearInterval(id);
    }, 1000);
  }

  function boot() { document.querySelectorAll('[data-promo-deadline]').forEach(start); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', boot);
})();
