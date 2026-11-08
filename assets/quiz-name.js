/*
  Greets the quiz taker by name.

  The quiz writes a `firstname` cookie when the name step is answered
  (assets/quiz_2.js). Anything carrying data-quiz-name holds a template with
  a {name} token; it is filled in and revealed when a name is known, and
  removed outright when one is not — a greeting addressed to nobody is worse
  than no greeting.
*/
(function () {
  'use strict';

  var TOKEN = /\{\s*(?:name|insert name|first_name|firstname)\s*\}/gi;

  function fromCookie(key) {
    var parts = ('; ' + document.cookie).split('; ' + key + '=');
    if (parts.length !== 2) return '';
    return parts.pop().split(';').shift() || '';
  }

  function clean(raw) {
    var value = raw || '';
    try { value = decodeURIComponent(value.replace(/\+/g, ' ')); } catch (e) { /* keep raw */ }
    value = value.replace(/[<>"'`\\]/g, '').replace(/\s+/g, ' ').trim();
    // a first name only, and never long enough to break the line
    value = value.split(' ')[0];
    if (value.length > 20) return '';
    // an empty, numeric or placeholder value is no name at all
    if (!value || /^(null|undefined|n\/?a|none|test)$/i.test(value) || !/[a-z]/i.test(value)) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function resolve(el) {
    var params = new URLSearchParams(window.location.search);
    return clean(params.get('name') || '') ||
           clean(fromCookie('firstname')) ||
           clean(el.getAttribute('data-quiz-name-fallback'));
  }

  function fill(el) {
    var template = el.getAttribute('data-quiz-name') || '';
    if (!TOKEN.test(template)) { el.hidden = false; return; }
    TOKEN.lastIndex = 0;

    var name = resolve(el);
    if (!name) { el.remove(); return; }

    el.textContent = template.replace(TOKEN, name);
    el.hidden = false;
  }

  function boot() {
    document.querySelectorAll('[data-quiz-name]').forEach(fill);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', boot);
})();
