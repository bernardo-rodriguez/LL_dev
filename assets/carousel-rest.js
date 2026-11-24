/*
  A horizontal carousel that pads its own track starts life scrolled by
  that padding in some browsers, which leaves the first card flush against
  the edge with no gutter. Nothing here animates — it only puts a track
  back to its true start once, before paint, and once more after images
  have settled, so the first card keeps its margin.
*/
(function () {
  var TRACKS = '.dentist-cards__row, .proof-carousel__track';

  function rest() {
    document.querySelectorAll(TRACKS).forEach(function (track) {
      // Leave a track the reader has already moved alone.
      if (track.dataset.carouselTouched === 'true') return;
      if (track.scrollLeft !== 0) track.scrollLeft = 0;
    });
  }

  function markTouched(event) {
    event.currentTarget.dataset.carouselTouched = 'true';
  }

  function boot() {
    document.querySelectorAll(TRACKS).forEach(function (track) {
      ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(function (type) {
        track.addEventListener(type, markTouched, { passive: true, once: true });
      });
    });
    rest();
    requestAnimationFrame(rest);
    window.addEventListener('load', rest, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', boot);
})();
