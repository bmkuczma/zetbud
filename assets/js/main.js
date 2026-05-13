(function () {
  'use strict';

  var root = document.documentElement;
  var storageKey = 'zet-bud-theme';

  function getPreferred() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var sun = document.getElementById('icon-sun');
    var moon = document.getElementById('icon-moon');
    if (sun && moon) {
      var dark = theme === 'dark';
      sun.style.display = dark ? 'none' : 'block';
      moon.style.display = dark ? 'block' : 'none';
    }
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {}
  }

  function initTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(storageKey);
    } catch (e) {}
    applyTheme(saved === 'dark' || saved === 'light' ? saved : getPreferred());
  }

  initTheme();

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      try {
        if (!localStorage.getItem(storageKey)) applyTheme(e.matches ? 'dark' : 'light');
      } catch (err) {}
    });
  }

  var menuBtn = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        menu.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-trigger');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.reportValidity()) {
        e.preventDefault();
      }
    });
  }

  var params = new URLSearchParams(window.location.search);
  var fb = document.getElementById('form-feedback');
  var wycena = params.get('wycena');
  if (fb && wycena) {
    fb.hidden = false;
    if (wycena === '1') {
      fb.className = 'form-alert form-alert--ok';
      fb.textContent =
        'Dziękujemy za wiadomość. Odezwiemy się możliwie szybko, zwykle w ciągu jednego dnia roboczego.';
    } else if (wycena === '0') {
      fb.className = 'form-alert form-alert--err';
      fb.textContent =
        'Nie udało się wysłać formularza. Sprawdź pola lub zadzwoń: +48 601 234 567.';
    } else if (wycena === 'rate') {
      fb.className = 'form-alert form-alert--err';
      fb.textContent = 'Odczekaj chwilę przed ponownym wysłaniem wiadomości.';
    }
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    }
  }

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
