(function () {
  'use strict';

  function zetbudMenuLabel(pl, en) {
    return document.documentElement.getAttribute('lang') === 'en' ? en : pl;
  }

  var root = document.documentElement;
  var storageKey = 'zet-bud-theme';
  var header = document.querySelector('.site-header');
  var syncPhoneBeforeSubmit = function () {};

  function updateHeaderBarHeight() {
    var inner = document.querySelector('.header-inner');
    if (!inner) return;
    var h = Math.ceil(inner.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--zetbud-header-bar', h + 'px');
  }

  updateHeaderBarHeight();
  window.addEventListener('resize', updateHeaderBarHeight, { passive: true });

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

  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  var menuBtn = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var overlay = document.getElementById('nav-overlay');
  var mainEl = document.getElementById('main');
  var footerEl = document.querySelector('.footer');
  var ctaBarEl = document.querySelector('.mobile-cta-bar');
  var inertSupported = typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype;

  function setInertBehindMenu(open) {
    if (!inertSupported) return;
    [mainEl, ctaBarEl, footerEl].forEach(function (el) {
      if (el) el.inert = !!open;
    });
  }

  function getMenuFocusables() {
    if (!menu) return [];
    var sel =
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var nodes = menu.querySelectorAll(sel);
    return Array.prototype.filter.call(nodes, function (el) {
      if (el.closest('.field--honeypot')) return false;
      if (el.hasAttribute('disabled')) return false;
      var ti = el.getAttribute('tabindex');
      if (ti !== null && ti !== '' && Number(ti) < 0) return false;
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    });
  }

  function onDocumentFocusInCapture(e) {
    if (!menu || !menu.classList.contains('is-open')) return;
    var t = e.target;
    if (!t || t.nodeType !== 1) return;
    if (menu.contains(t)) return;
    if (t === menuBtn || t === overlay) return;
    var list = getMenuFocusables();
    if (!list.length) return;
    window.requestAnimationFrame(function () {
      if (!menu || !menu.classList.contains('is-open')) return;
      if (menu.contains(document.activeElement)) return;
      if (document.activeElement === menuBtn) return;
      list[0].focus();
    });
  }

  function onMenuKeydownCapture(e) {
    if (!menu || !menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setMenuOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    var list = getMenuFocusables();
    if (list.length === 0) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (document.activeElement === menuBtn) {
      e.preventDefault();
      if (e.shiftKey) last.focus();
      else first.focus();
      return;
    }
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        menuBtn.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function setMenuOpen(open) {
    if (!menuBtn || !menu) return;
    if (!open) {
      document.removeEventListener('keydown', onMenuKeydownCapture, true);
      document.removeEventListener('focusin', onDocumentFocusInCapture, true);
    }

    menu.classList.toggle('is-open', open);
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute(
      'aria-label',
      open
        ? zetbudMenuLabel('Zamknij menu nawigacji', 'Close navigation menu')
        : zetbudMenuLabel('Otwórz menu nawigacji', 'Open navigation menu')
    );
    if (header) header.classList.toggle('menu-open', open);
    document.body.classList.toggle('has-menu-open', open);
    if (overlay) {
      overlay.classList.toggle('is-visible', open);
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    setInertBehindMenu(open);

    if (open) {
      document.addEventListener('keydown', onMenuKeydownCapture, true);
      document.addEventListener('focusin', onDocumentFocusInCapture, true);
      window.requestAnimationFrame(function () {
        updateHeaderBarHeight();
        var list = getMenuFocusables();
        if (list.length) list[0].focus();
      });
    } else {
      try {
        menuBtn.focus();
      } catch (err) {}
    }
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      setMenuOpen(!menu.classList.contains('is-open'));
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });
    if (overlay) {
      overlay.addEventListener('click', function () {
        setMenuOpen(false);
      });
    }
    window.addEventListener(
      'resize',
      function () {
        if (window.matchMedia('(min-width: 900px)').matches) setMenuOpen(false);
      },
      { passive: true }
    );
  }

  var sectionIds = ['uslugi', 'dojazd', 'kontakt'];
  var navLinks = document.querySelectorAll('[data-nav-section]');

  function updateActiveNav() {
    if (!navLinks.length || !header) return;
    var y = window.scrollY + header.offsetHeight + 24;
    var firstEl = document.getElementById(sectionIds[0]);
    if (firstEl && y < firstEl.offsetTop) {
      navLinks.forEach(function (a) {
        a.classList.remove('is-active');
      });
      return;
    }
    var current = sectionIds[0];
    for (var i = 0; i < sectionIds.length; i++) {
      var el = document.getElementById(sectionIds[i]);
      if (!el) continue;
      if (el.offsetTop <= y) current = sectionIds[i];
    }
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-nav-section') === current);
    });
  }
  if (navLinks.length) {
    updateActiveNav();
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav, { passive: true });
  }

  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-trigger');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var opening = !item.classList.contains('is-open');
      if (opening) {
        document.querySelectorAll('.faq-item').forEach(function (other) {
          if (other !== item) {
            other.classList.remove('is-open');
            var ob = other.querySelector('.faq-trigger');
            if (ob) ob.setAttribute('aria-expanded', 'false');
          }
        });
      }
      item.classList.toggle('is-open');
      var nowOpen = item.classList.contains('is-open');
      btn.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
    });
  });

  function initPhoneComposer() {
    var country = document.getElementById('phone-country');
    var national = document.getElementById('phone-national');
    if (!country || !national) return;

    function shortNumMsg() {
      return document.documentElement.getAttribute('lang') === 'en'
        ? 'Enter at least 6 digits (without country code).'
        : 'Wpisz min. 6 cyfr numeru (bez kodu kraju).';
    }

    function getMeta() {
      var opt = country.options[country.selectedIndex];
      var max = parseInt(opt.getAttribute('data-national-max') || '15', 10);
      if (isNaN(max) || max < 6) max = 15;
      if (max > 15) max = 15;
      return { max: max };
    }

    function syncPhone() {
      var meta = getMeta();
      var ccDigits = country.value.replace(/\D/g, '');
      /* Bufor na wklejkę z kodem kraju — bez tego przeglądarka obcina wklejkę do maxlength = max krajowych. */
      var inputCap = ccDigits.length + meta.max + 4;
      if (inputCap < 16) inputCap = 16;
      national.setAttribute('maxlength', String(inputCap));

      var raw = national.value.replace(/\D/g, '');
      if (country.value === '+1' && raw.length === 11 && raw.charAt(0) === '1') {
        raw = raw.slice(1);
      }
      while (ccDigits.length >= 1 && raw.indexOf(ccDigits) === 0 && raw.length > meta.max) {
        raw = raw.slice(ccDigits.length);
      }
      if (raw.charAt(0) === '0' && raw.length === meta.max + 1) {
        raw = raw.slice(1);
      }
      var d = raw.slice(0, meta.max);
      national.value = d;
      if (d.length > 0 && d.length < 6) {
        national.setCustomValidity(shortNumMsg());
      } else {
        national.setCustomValidity('');
      }
    }

    country.addEventListener('change', function () {
      national.value = '';
      syncPhone();
    });
    national.addEventListener('input', syncPhone);
    national.addEventListener('change', syncPhone);
    national.addEventListener('blur', syncPhone);
    syncPhoneBeforeSubmit = syncPhone;
    syncPhone();
  }

  initPhoneComposer();

  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      syncPhoneBeforeSubmit();
      if (!form.reportValidity()) {
        e.preventDefault();
        return;
      }
      var btn = document.getElementById('form-submit');
      if (!btn) return;
      var sendLabel = btn.getAttribute('data-label-send') || btn.textContent;
      var sendingLabel = btn.getAttribute('data-label-sending') || 'Wysyłanie…';
      btn.textContent = sendingLabel;
      btn.setAttribute('aria-busy', 'true');
      window.setTimeout(function () {
        if (btn.getAttribute('aria-busy') === 'true') {
          btn.textContent = sendLabel;
          btn.removeAttribute('aria-busy');
        }
      }, 12000);
    });
  }

  var params = new URLSearchParams(window.location.search);
  var fb = document.getElementById('form-feedback');
  var wycena = params.get('wycena');
  if (fb && wycena) {
    fb.hidden = false;
    var pack =
      window.ZETBUD_FORM_FEEDBACK &&
      window.ZETBUD_FORM_FEEDBACK[window.ZETBUD_FORM_FEEDBACK.lang === 'en' ? 'en' : 'pl'];
    var okMsg = pack ? pack.ok : 'Dziękujemy za wiadomość. Odezwiemy się możliwie szybko, zwykle w ciągu jednego dnia roboczego.';
    var errMsg = pack ? pack.err : 'Nie udało się wysłać formularza. Sprawdź pola lub zadzwoń: +48 601 234 567.';
    var rateMsg = pack ? pack.rate : 'Odczekaj chwilę przed ponownym wysłaniem wiadomości.';
    var why = (params.get('why') || '').replace(/[^a-z_]/gi, '');
    var errDetail =
      pack && pack.errByWhy && why && pack.errByWhy[why] ? pack.errByWhy[why] : '';
    if (wycena === '1') {
      fb.className = 'form-alert form-alert--ok';
      fb.textContent = okMsg;
    } else if (wycena === '0') {
      fb.className = 'form-alert form-alert--err';
      fb.textContent = errDetail || errMsg;
    } else if (wycena === 'rate') {
      fb.className = 'form-alert form-alert--err';
      fb.textContent = rateMsg;
    }
    if (window.history && window.history.replaceState) {
      var sp = new URLSearchParams(window.location.search);
      sp.delete('wycena');
      sp.delete('why');
      var tail = sp.toString();
      if (tail) tail = '?' + tail;
      window.history.replaceState(null, '', window.location.pathname + tail + window.location.hash);
    }
    fb.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
    });
  }

  function initScrollReveals() {
    if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var sections = document.querySelectorAll('main > section:not(.hero)');
    if (!sections.length) return;
    document.body.classList.add('site-motion');
    sections.forEach(function (sec) {
      sec.classList.add('awaiting-reveal');
    });
    function markInView(el) {
      el.classList.add('in-view');
      window.requestAnimationFrame(function () {
        el.classList.remove('awaiting-reveal');
      });
    }
    function flushVisible() {
      sections.forEach(function (sec) {
        if (sec.classList.contains('in-view')) return;
        var r = sec.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        if (r.top < vh * 0.92 && r.bottom > vh * 0.06) markInView(sec);
      });
    }
    var raf = window.requestAnimationFrame || function (cb) {
      return window.setTimeout(cb, 0);
    };
    raf(function () {
      flushVisible();
      if (!('IntersectionObserver' in window)) {
        sections.forEach(markInView);
        return;
      }
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            markInView(entry.target);
            io.unobserve(entry.target);
          });
        },
        { root: null, rootMargin: '0px 0px -4% 0px', threshold: 0.05 }
      );
      sections.forEach(function (sec) {
        if (!sec.classList.contains('in-view')) io.observe(sec);
      });
    });

    window.setTimeout(function () {
      sections.forEach(function (sec) {
        if (!sec.classList.contains('in-view')) markInView(sec);
      });
    }, 3200);
  }

  initScrollReveals();

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
