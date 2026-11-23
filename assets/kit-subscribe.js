/*
  The r6 buy box offers the subscription as a checkbox. Skio still owns the
  decision — its picker lives in a shadow root and is what the form posts —
  so the checkbox presses Skio's own control and then mirrors whatever Skio
  settles on. That way a change made anywhere, including by Skio itself on
  load, is reflected in one place.
*/
(function () {
  function skioRoot() {
    var el = document.querySelector('skio-plan-picker');
    return el && el.shadowRoot ? el.shadowRoot : null;
  }

  function groups(root) {
    var inputs = [].slice.call(root.querySelectorAll('input.skio-group-input'));
    var sub = null;
    var once = null;
    inputs.forEach(function (input) {
      var container = input.closest('.skio-group-container');
      var where = container ? container.className : '';
      // Skio marks the two groups by class; the one-time group also has an
      // empty value, which is the surer test of the two.
      if (/onetime/.test(where) || input.value === '') once = input;
      else sub = input;
    });
    return { sub: sub, once: once };
  }

  function wire(button) {
    var root = skioRoot();
    if (!root) return false;

    var pair = groups(root);
    if (!pair.sub || !pair.once) return false;

    var list = button.closest('.kitpick');

    function paint() {
      var on = pair.sub.checked;
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      // The free pen and free shipping come with the subscription, so the
      // kit rows stop advertising them the moment it is switched off.
      if (list) list.setAttribute('data-subscribed', on ? 'true' : 'false');
    }

    button.addEventListener('click', function () {
      var next = pair.sub.checked ? pair.once : pair.sub;
      // Click rather than set .checked: Skio listens for the event its own
      // control fires, and setting the property silently would not update
      // the hidden selling_plan the form posts.
      next.click();
      paint();
    });

    root.addEventListener('change', paint, true);
    paint();
    return true;
  }

  function boot() {
    var button = document.querySelector('[data-kit-subscribe]');
    if (!button) return;

    // Skio renders asynchronously; give it a bounded number of tries rather
    // than polling for the life of the page.
    var tries = 0;
    (function attempt() {
      if (wire(button)) return;
      if (++tries > 40) return;
      setTimeout(attempt, 250);
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
