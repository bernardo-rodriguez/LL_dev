/*
  The review total shown around the site.

  Judge.me counts only the reviews collected through Judge.me — 583 at the
  time of writing. Another 2,000 predate it and are not in there, so the
  honest total is Judge.me's live count plus that figure. The offset lives in
  Theme settings > Reviews rather than in here, so it can be corrected
  without a code change.

  Anything carrying data-ll-reviews has {reviews} and {rating} filled in.
  Judge.me renders late, so the count is retried until it appears.
*/
(function () {
  'use strict';

  function legacyCount() {
    var n = parseInt(window.LL_REVIEWS_LEGACY, 10);
    return isNaN(n) ? 0 : n;
  }

  function fromSummary(el) {
    if (!el || !el.textContent) return null;
    var m = el.textContent.match(/based on (\d[\d,]*)\s*reviews?/i);
    return m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
  }

  // Judge.me's own live count, however this page happens to show it
  function judgemeCount() {
    var n = fromSummary(document.querySelector('.jdgm-rev-widg__summary-text'));
    if (n == null) n = fromSummary(document.querySelector('.jdgm-all-reviews-text__text'));
    if (n == null) {
      var badge = document.querySelector('.jdgm-prev-badge[data-number-of-reviews]');
      if (badge) {
        var attr = parseInt(badge.getAttribute('data-number-of-reviews'), 10);
        if (!isNaN(attr)) n = attr;
      }
    }
    return n;
  }

  function total() {
    var n = judgemeCount();
    return n == null ? null : n + legacyCount();
  }

  window.llReviewTotal = total;
  window.llReviewRating = function () { return window.LL_REVIEWS_RATING || ''; };

  function fill() {
    var nodes = document.querySelectorAll('[data-ll-reviews]');
    if (!nodes.length) return true;

    var t = total();
    if (t == null) return false;

    var count = t.toLocaleString();
    var rating = window.llReviewRating();
    nodes.forEach(function (el) {
      el.textContent = (el.getAttribute('data-ll-reviews') || '')
        .replace(/\{\s*reviews\s*\}/gi, count)
        .replace(/\{\s*rating\s*\}/gi, rating);
    });
    return true;
  }

  window.llFillReviewTotals = fill;

  if (!fill()) {
    var obs = new MutationObserver(function (m, o) { if (fill()) o.disconnect(); });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    [2000, 5000, 10000].forEach(function (ms) { window.setTimeout(fill, ms); });
  }
})();
