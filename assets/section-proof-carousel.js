/*
  Proof carousel — keeps the pager in step with the track.

  The dots follow the card nearest the track's left edge rather than a
  counter of their own, so a swipe, a keyboard scroll and a dot press all
  end up saying the same thing.
*/
(function () {
  function init(root) {
    var track = root.querySelector('[data-proof-track]');
    var pager = root.querySelector('[data-proof-pager]');
    if (!track || !pager) return;

    var cards = [].slice.call(track.querySelectorAll('[data-proof-card]'));
    var dots = [].slice.call(pager.querySelectorAll('[data-proof-dot]'));
    if (!cards.length || !dots.length) return;

    function current() {
      var edge = track.scrollLeft;
      var best = 0;
      var bestGap = Infinity;
      cards.forEach(function (card, i) {
        var gap = Math.abs(card.offsetLeft - track.offsetLeft - edge);
        if (gap < bestGap) { bestGap = gap; best = i; }
      });
      return best;
    }

    function paint() {
      var i = current();
      dots.forEach(function (dot, j) {
        dot.classList.toggle('proof-carousel__dot--on', j === i);
        dot.setAttribute('aria-current', j === i ? 'true' : 'false');
      });
    }

    var queued = false;
    track.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; paint(); });
    }, { passive: true });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var card = cards[Number(dot.dataset.proofDot)];
        if (!card) return;
        track.scrollTo({
          left: card.offsetLeft - track.offsetLeft,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      });
    });

    paint();
  }

  function boot() {
    document.querySelectorAll('.proof-carousel').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', boot);
})();
