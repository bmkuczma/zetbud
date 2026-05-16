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

  function applyContactFormFeedback(wycena, why) {
    var fb = document.getElementById('form-feedback');
    if (!fb) return false;
    var wf = window.ZETBUD_FORM_FEEDBACK;
    var isEn = document.documentElement.getAttribute('lang') === 'en';
    var pack = wf && wf[isEn ? 'en' : 'pl'];
    var okMsg = pack ? pack.ok : 'Dziękujemy za wiadomość. Odezwiemy się możliwie szybko, zwykle w ciągu jednego dnia roboczego.';
    var errMsg = pack ? pack.err : 'Nie udało się wysłać formularza. Sprawdź pola lub zadzwoń: +48 601 234 567.';
    var rateMsg = pack ? pack.rate : 'Odczekaj chwilę przed ponownym wysłaniem wiadomości.';
    var whyClean = (why || '').replace(/[^a-z_]/gi, '');
    var errDetail =
      pack && pack.errByWhy && whyClean && pack.errByWhy[whyClean] ? pack.errByWhy[whyClean] : '';
    var motion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    fb.hidden = false;
    fb.removeAttribute('tabindex');

    if (wycena === '1') {
      fb.className = 'form-alert form-alert--ok';
      fb.textContent = okMsg;
      fb.setAttribute('tabindex', '-1');
      try {
        fb.focus();
      } catch (err) {}
      fb.scrollIntoView({ behavior: motion, block: 'nearest' });
      return true;
    }
    if (wycena === 'rate') {
      fb.className = 'form-alert form-alert--warn';
      fb.textContent = rateMsg;
      fb.setAttribute('tabindex', '-1');
      try {
        fb.focus();
      } catch (err2) {}
      fb.scrollIntoView({ behavior: motion, block: 'nearest' });
      return false;
    }
    if (wycena === '0') {
      fb.className = 'form-alert form-alert--warn';
      fb.textContent = errDetail || errMsg;
      fb.setAttribute('tabindex', '-1');
      try {
        fb.focus();
      } catch (err3) {}
      fb.scrollIntoView({ behavior: motion, block: 'nearest' });
      return false;
    }
    fb.className = 'form-alert form-alert--warn';
    fb.textContent = errMsg;
    fb.setAttribute('tabindex', '-1');
    try {
      fb.focus();
    } catch (err4) {}
    fb.scrollIntoView({ behavior: motion, block: 'nearest' });
    return false;
  }

  function handleContactFetchResponse(res, form) {
    var ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.indexOf('application/json') !== -1) {
      return res
        .json()
        .then(function (j) {
          var w = j.wycena != null ? String(j.wycena) : '0';
          var why = j.why != null ? String(j.why) : '';
          if (w === '1') {
            if (applyContactFormFeedback('1', why)) {
              form.reset();
              syncPhoneBeforeSubmit();
            }
          } else if (w === 'rate') {
            applyContactFormFeedback('rate', why);
          } else if (w === '0') {
            applyContactFormFeedback('0', why);
          } else {
            applyContactFormFeedback('0', 'mail');
          }
        })
        .catch(function () {
          applyContactFormFeedback('0', 'mail');
        });
    }
    if (res.redirected) {
      var u = new URL(res.url, window.location.href);
      var wycena = u.searchParams.get('wycena');
      var why = u.searchParams.get('why') || '';
      if (wycena === '1') {
        if (applyContactFormFeedback('1', why)) {
          form.reset();
          syncPhoneBeforeSubmit();
        }
      } else if (wycena === '0' || wycena === 'rate') {
        applyContactFormFeedback(wycena, why);
      } else {
        applyContactFormFeedback('0', 'mail');
      }
      return undefined;
    }
    if (res.ok) {
      applyContactFormFeedback('0', '');
      return undefined;
    }
    applyContactFormFeedback('0', 'mail');
    return undefined;
  }

  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!window.fetch || !window.FormData) return;
      e.preventDefault();
      syncPhoneBeforeSubmit();
      if (!form.reportValidity()) return;
      var btn = document.getElementById('form-submit');
      if (!btn) return;
      var sendLabel = btn.getAttribute('data-label-send') || btn.textContent;
      var sendingLabel = btn.getAttribute('data-label-sending') || 'Wysyłanie…';
      var isEn = document.documentElement.getAttribute('lang') === 'en';

      btn.textContent = sendingLabel;
      btn.setAttribute('aria-busy', 'true');
      btn.disabled = true;

      var actionUrl = new URL(form.getAttribute('action') || 'contact.php', window.location.href).href;

      fetch(actionUrl, {
        method: 'POST',
        body: new FormData(form),
        credentials: 'same-origin',
        headers: { 'X-Zetbud-Fetch': '1' },
        redirect: 'follow',
      })
        .then(function (res) {
          return handleContactFetchResponse(res, form);
        })
        .catch(function () {
          var fb = document.getElementById('form-feedback');
          var netMsg = isEn
            ? 'Could not reach the server. Your entries are kept — try again in a moment.'
            : 'Brak połączenia z serwerem. Wpisane dane zostały zachowane — spróbuj ponownie za chwilę.';
          if (fb) {
            fb.hidden = false;
            fb.className = 'form-alert form-alert--warn';
            fb.textContent = netMsg;
            fb.setAttribute('tabindex', '-1');
            try {
              fb.focus();
            } catch (err) {}
            var motion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
            fb.scrollIntoView({ behavior: motion, block: 'nearest' });
          }
        })
        .finally(function () {
          btn.textContent = sendLabel;
          btn.removeAttribute('aria-busy');
          btn.disabled = false;
        });
    });
  }

  var params = new URLSearchParams(window.location.search);
  var wycenaParam = params.get('wycena');
  if (wycenaParam) {
    applyContactFormFeedback(wycenaParam, params.get('why') || '');
    if (window.history && window.history.replaceState) {
      var sp = new URLSearchParams(window.location.search);
      sp.delete('wycena');
      sp.delete('why');
      var tail = sp.toString();
      if (tail) tail = '?' + tail;
      window.history.replaceState(null, '', window.location.pathname + tail + window.location.hash);
    }
    if (wycenaParam === '1' && form) {
      form.reset();
      syncPhoneBeforeSubmit();
    }
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
