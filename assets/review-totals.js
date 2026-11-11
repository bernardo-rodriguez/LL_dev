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

  /*
    Judge.me's own live count, cached on the first successful read.

    The override below rewrites the counts Judge.me prints, so re-reading
    the page afterwards would feed our own total back in and compound it.
    This reads the raw number once and never again.
  */
  var cachedJudgeme = null;

  function judgemeCount() {
    if (cachedJudgeme != null) return cachedJudgeme;
    var n = readJudgemeCount();
    if (n != null) cachedJudgeme = n;
    return n;
  }

  function readJudgemeCount() {
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

  /*
    Pages that are not a product have no Judge.me element to read — the
    landing page, for one. Without a fallback the tokens stayed on screen
    exactly as typed, which is worse than a stale number, so the last known
    Judge.me count is kept in settings for those pages.
  */
  function fallbackCount() {
    var n = parseInt(window.LL_REVIEWS_JUDGEME_FALLBACK, 10);
    return isNaN(n) ? null : n;
  }

  function total() {
    var n = judgemeCount();
    if (n == null) n = fallbackCount();
    return n == null ? null : n + legacyCount();
  }

  /*
    Rewrites the counts inside the Judge.me widget to the site-wide total.

    Judge.me can only count what it holds, and the 2,000 older reviews are
    not in it, so its widget disagreed with every other figure on the page.
    This is a display override while those reviews cannot be imported — the
    list underneath still holds only Judge.me's own reviews, so the two will
    not reconcile if anyone pages through them.

    Switch it off with Theme settings > Reviews.
  */
  function overrideJudgemeCounts() {
    if (!window.LL_REVIEWS_OVERRIDE_JUDGEME) return;
    var t = total();
    if (t == null) return;
    var pretty = t.toLocaleString();

    var scopes = document.querySelectorAll('[class*="jdgm"],[class*="jm-"]');
    scopes.forEach(function (el) {
      if (el.children.length) return;
      var txt = el.textContent;
      if (!txt) return;

      // "583 reviews" / "based on 583 reviews", and nothing else
      var m = txt.match(/^(\s*(?:based on\s+)?)([\d,]+)(\s*(?:reviews?|ratings?)\s*)$/i);
      if (!m) return;
      if (m[2].replace(/,/g, '') === String(t)) return;   // already done — no mutation loop

      el.textContent = m[1] + pretty + m[3];
    });
  }

  window.llOverrideJudgemeCounts = overrideJudgemeCounts;
  window.llReviewTotal = total;
  window.llReviewRating = function () { return window.LL_REVIEWS_RATING || ''; };

  function fill() {
    var nodes = document.querySelectorAll('[data-ll-reviews]');
    if (!nodes.length) return true;

    var t = total();
    // Never leave a token on screen. With no number at all the line has
    // nothing left to say, so it is emptied rather than shown half-built —
    // "4.7/5 from reviews" is worse than nothing.
    if (t == null) {
      nodes.forEach(function (el) { el.textContent = ''; el.hidden = true; });
      return false;
    }

    var count = t.toLocaleString();
    var rating = window.llReviewRating();
    nodes.forEach(function (el) {
      el.textContent = (el.getAttribute('data-ll-reviews') || '')
        .replace(/\{\s*reviews\s*\}/gi, count)
        .replace(/\{\s*rating\s*\}/gi, rating);
      el.hidden = false;
    });
    return true;
  }

  window.llFillReviewTotals = fill;

  function run() {
    var done = fill();
    overrideJudgemeCounts();
    return done;
  }

  /*
    The widget redraws on sort, filter and pagination, so unlike the token
    fill this never stops watching. The observer is disconnected around our
    own writes so they cannot retrigger it.
  */
  var observer = new MutationObserver(function () {
    observer.disconnect();
    run();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });

  run();
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  [2000, 5000, 10000, 20000].forEach(function (ms) { window.setTimeout(run, ms); });
})();
