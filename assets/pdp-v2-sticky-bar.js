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

    /*
      The chip comes from the selected kit too, not from the buy box's own
      chip: that one does not follow the kit choice, so mirroring it put
      "40% off" next to the 12-treatment kit's $59/$130, which is 55%.
      Reading both numbers and the chip from the same card keeps the bar
      saying one thing.
    */
    var off = bar.querySelector('[data-pdp-sticky-off]');
    var offSource = opt.querySelector('.kitpick__save')
      || document.querySelector('.buybox-v2__off');
    if (off) {
      var text = offSource ? offSource.textContent.trim() : '';
      off.textContent = text.replace(/^save\s+/i, '') + (/^save\s/i.test(text) ? ' off' : '');
      off.hidden = !text;
    }
  }

  function watch(bar) {
    /*
      The anchor is the block holding the real add-to-cart. It cannot be the
      Skio picker itself: Skio injects `skio-plan-picker` at runtime, so at
      boot it does not exist yet. `product-form` is rendered by the theme,
      wraps the picker, and is therefore there from the first paint. (And
      `.product__info-container` is NOT it — that is the whole options block
      further down the page.)
    */
    var anchor = document.querySelector('product-form')
      || document.querySelector('.product-form__submit')
      || document.querySelector('.buybox-v2');
    if (!anchor || !document.querySelector('.buybox-v2')) { bar.hidden = true; return; }

    bar.hidden = false;

    /*
      Shown only once the button has gone off the TOP of the screen — the
      customer has scrolled past the place they could already have bought.
      While it is still below the fold, on the way down, the page has not
      been read yet and the bar would just be in the way.

      This reads the position on scroll rather than through an
      IntersectionObserver. The observer missed crossings here — scrolling
      back to the top left the bar showing over a visible add-to-cart — and
      a rect read inside a rAF is both cheap and exact.
    */
    var queued = false;

    function paint() {
      queued = false;
      bar.classList.toggle('is-on', anchor.getBoundingClientRect().bottom <= 0);
    }

    function schedule() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(paint);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
  }

  function liftStrip() {
    /*
      The sale strip is authored inside the product section, because that is
      where its countdown deadline is set — one deadline for both the strip
      and the buy box's sale banner. But it belongs above the store header,
      so it is moved there once, before anything else runs. It stays hidden
      until it has been placed, so it is never seen in the wrong spot.
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

  function liftBar(bar) {
    /*
      Moved to the end of <body> for the same reason it is fixed: inside the
      product section it is painted over by the sections that follow it, so
      it is on screen and invisible at once. As the last child of <body> it
      sits above the page without having to outbid anything.
    */
    if (bar.parentNode !== document.body) document.body.appendChild(bar);
  }

  function boot() {
    liftStrip();

    var bar = document.querySelector('[data-pdp-sticky]');
    if (!bar) return;

    liftBar(bar);

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
