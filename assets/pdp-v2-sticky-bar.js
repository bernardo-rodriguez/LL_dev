/*
  The v2 product page's sale strip and the bar that follows the page down.

  Three jobs, none of which duplicate the buy box:

  1. It appears once the real add-to-cart has scrolled out of view, and goes
     away again when it comes back, so the two are never on screen together.
  2. It mirrors the price of whichever kit is selected, reading it from the
     kit list rather than holding its own copy of the numbers.
  3. Its button forwards a click to the real control. Skio owns that control
     and it lives in a shadow root, so the click is sent to the button
     itself; the kit and the subscription chosen above are what goes into
     the cart, and there is only ever one submit path.
*/
(function () {
  'use strict';

  function realCta() {
    var picker = document.querySelector('skio-plan-picker');
    if (picker && picker.shadowRoot) {
      var skio = picker.shadowRoot.querySelector('.add-to-cart');
      if (skio) return skio;
    }
    return document.querySelector('#main-clickable-button')
      || document.querySelector('.product-form__submit');
  }

  function mirrorPrice(bar) {
    var opt = document.querySelector('.kitpick input:checked + .kitpick__opt');
    if (!opt) return;

    var pairs = [
      ['[data-pdp-sticky-now]', '.kitpick__now'],
      ['[data-pdp-sticky-was]', '.kitpick__was']
    ];

    pairs.forEach(function (pair) {
      var target = bar.querySelector(pair[0]);
      var source = opt.querySelector(pair[1]);
      if (!target) return;
      if (source && source.textContent.trim()) {
        target.textContent = source.textContent.trim();
        target.hidden = false;
      } else {
        target.hidden = true;
      }
    });

    /* The discount chip is the buy box's, which already tracks the offer. */
    var off = bar.querySelector('[data-pdp-sticky-off]');
    var offSource = document.querySelector('.buybox-v2__off');
    if (off && offSource && offSource.textContent.trim()) {
      off.textContent = offSource.textContent.trim();
      off.hidden = false;
    }
  }

  function watch(bar) {
    var anchor = document.querySelector('.buybox-v2')
      ? document.querySelector('.product__info-container') : null;
    if (!anchor) { bar.hidden = true; return; }

    bar.hidden = false;

    /*
      Shown when the buy box is above the fold's top edge — that is, once the
      customer has scrolled past the place they could already have bought.
      A fallback on scroll covers browsers without IntersectionObserver.
    */
    function paint(visible) {
      bar.classList.toggle('is-on', !visible);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { paint(e.isIntersecting); });
      }, { rootMargin: '0px 0px -40% 0px' });
      io.observe(anchor);
    } else {
      window.addEventListener('scroll', function () {
        paint(anchor.getBoundingClientRect().bottom > 0);
      }, { passive: true });
    }
  }

  function liftStrip() {
    /*
      The strip is authored inside the product section, because that is where
      its countdown deadline is set — one deadline for both the strip and the
      buy box's sale banner. But it belongs above the store header, so it is
      moved there once, before anything else runs. It stays hidden until it
      has been placed, so it is never seen in the wrong spot.
    */
    var strip = document.querySelector('[data-pdp-chrome]');
    if (!strip || strip.classList.contains('is-placed')) return;

    var before = document.querySelector('#shopify-section-announcement-bar')
      || document.querySelector('.outer-header-wrapper')
      || document.querySelector('#shopify-section-header')
      || document.body.firstChild;

    if (before && before.parentNode === document.body) {
      document.body.insertBefore(strip, before);
    } else {
      document.body.insertBefore(strip, document.body.firstChild);
    }
    strip.classList.add('is-placed');
  }

  function boot() {
    liftStrip();

    var bar = document.querySelector('[data-pdp-sticky]');
    if (!bar) return;

    watch(bar);
    mirrorPrice(bar);

    document.addEventListener('change', function (e) {
      if (e.target.closest && e.target.closest('.kitpick')) mirrorPrice(bar);
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-kit-subscribe]')) {
        window.setTimeout(function () { mirrorPrice(bar); }, 250);
      }
    });

    var cta = bar.querySelector('[data-pdp-sticky-cta]');
    if (cta) {
      cta.addEventListener('click', function () {
        var target = realCta();
        if (target) target.click();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
