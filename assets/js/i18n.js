/**
 * Zet-Bud — przełączanie języka PL / EN (treść EN ładowana z JS; PL w HTML dla SEO).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'zet-bud-lang';

  var EN = {
    skip: 'Skip to content',
    brandAria: 'Zet-Bud — home',
    navOffer: 'Services',
    navWhy: 'Why us',
    navProjects: 'Projects',
    navArea: 'Service area',
    navLocation: 'Location',
    navFaq: 'FAQ',
    navContact: 'Contact',
    navCta: 'Free quote',
    themeAria: 'Toggle light or dark mode',
    themeAriaDark: 'Switch to light mode',
    themeAriaLight: 'Switch to dark mode',
    menuOpen: 'Open navigation menu',
    menuClose: 'Close navigation menu',
    menuDialog: 'Site navigation menu',
    mobileCtaRegion: 'Quick contact',
    phoneLink: '+48 601 234 567',

    metaTitle: 'Zet-Bud | Homes, electrical, earthworks, renovations — Pomerania',
    metaDesc:
      'Zet-Bud — Kłosowo, Kartuzy, Tri-City: new homes, electrical installations, earthworks, renovations and interiors. Free quote — reply usually within one business day.',
    ogTitle: 'Zet-Bud | Homes, electrical, earthworks, renovations — Pomerania',
    ogDesc:
      'Construction company: residential new builds, electrical, site preparation, renovations and premium interiors. Kartuzy, Kłosowo, Tri-City. Free quote.',
    ogLocale: 'en_US',
    ogLocaleAlternate: 'pl_PL',
    ogImageAlt: 'ZetBud — construction company logo, Pomerania',
    twTitle: 'Zet-Bud | Homes, electrical, earthworks — Pomerania',
    twDesc: 'Pomerania & Tri-City: new builds, electrical, earthworks, renovations. Free quote — reply usually within 24 h.',

    heroEyebrow: 'One project lead · clear scope & schedule · Kartuzy, Tri-City & Pomerania',
    heroTitle:
      '<span class="hero-title__brand">Zet-Bud</span><span class="hero-title__scope"><span class="hero-title__item">Single- &amp; multi-family homes</span><span class="hero-title__item">Electrical installations</span><span class="hero-title__item">Earthworks</span><span class="hero-title__item">Renovations &amp; fit-out</span></span><span class="hero-title__region">Kłosowo · Kartuzy · Tri-City</span>',
    heroLead:
      'We focus on <strong>single- and multi-family residential projects</strong>, <strong>electrical installations</strong>, <strong>earthworks and site preparation</strong>, plus <strong>building renovations and premium interior fit-out</strong>. One point of contact, clear scope and schedule, quality supervision on site. Based in Kłosowo near Kartuzy — Kartuzy county, Tri-City and neighbouring municipalities.',
    heroCtaPrimary: 'Free project quote',
    heroCtaCall: 'Call: 601 234 567',
    heroMicro:
      'We usually reply to the form or phone <strong>within one business day</strong> — we will arrange a site visit and agree the starting stage.',
    trust1t: '18+ years',
    trust1d: 'in residential construction, electrical and fit-out projects',
    trust2t: '340+',
    trust2d: 'completed stages and turnkey phases',
    trust3t: '24 h',
    trust3d: 'typical first response time',
    trust4t: '5 years',
    trust4d: 'warranty on selected finishing packages',
    trustSat: 'Average investor rating after handover: <strong>4.8/5</strong> · internal surveys 2024–2025',

    heroImgAlt: 'Construction site — housing and infrastructure, Zet-Bud Pomerania',

    heroCaptionStrong: 'On site:',
    heroCaption:
      'stage documentation, dry reinforcement checks before pours, tidy yard and coordinated handovers between trades.',

    servicesEyebrow: 'Services',
    servicesTitle: 'Four pillars — how we support your investment',
    servicesIntro:
      'Our core work is <strong>single- and multi-family housing</strong>, complemented by <strong>electrical</strong> services, <strong>earthworks</strong>, and <strong>renovations with high-end interiors</strong>. You can contract one scope or a bundled schedule under one site lead.',

    svc1h: 'Single- & multi-family homes — new construction',
    svc1p:
      'Shell and turnkey packages: foundations, masonry, floors, roof structure and covering, closed shell, developer standard or move-in ready. We coordinate concrete and prefabricated deliveries and keep quality checks before each next stage.',
    svc1t1: 'foundations',
    svc1t2: 'SFR / MFR',
    svc1t3: 'multi-family',

    svc2h: 'Electrical installations',
    svc2p:
      'New installations in housing, upgrades and modernisations, distribution boards, routing, earthing and coordination with other trades. Clear circuits labelling and documentation for acceptance and use.',
    svc2t1: 'new builds',
    svc2t2: 'modernisation',
    svc2t3: 'distribution',

    svc3h: 'Earthworks & site preparation',
    svc3p:
      'Excavations for foundations and networks, levelling, trenching, drainage and temporary site setup. We plan machinery access, spoil handling and weather buffers so the shell schedule is realistic.',
    svc3t1: 'excavation',
    svc3t2: 'drainage',
    svc3t3: 'site prep',

    svc4h: 'Renovations & premium interiors',
    svc4p:
      'Structural and finishing upgrades in occupied or new buildings: bathrooms, kitchens, flooring, built-ins and detailing to a high specification. Transparent budgets and staged handovers.',
    svc4t1: 'renovation',
    svc4t2: 'fit-out',
    svc4t3: 'finishing',

    sectionCtaQuote: 'Free quote',
    sectionCtaCall: 'Call',

    whyEyebrow: 'Why Zet-Bud',
    whyTitle: 'Built right, priced clearly',
    whyIntro:
      'We do not promise the cheapest quote on the market. We promise predictability: you know what is in scope, when we mobilise on site and how we close each stage — from excavation to handover.',

    why1h: 'Schedule-driven delivery',
    why1p: 'Weekly progress, weather buffers and materials ordered ahead — not “tomorrow morning” surprises.',
    why2h: 'Transparent pricing',
    why2p: 'Cost categories, material alternatives and exclusions — fewer invoice surprises.',
    why3h: 'Aligned trades',
    why3p: 'Electrical, earthworks and finishing in one schedule — fewer “who goes first on the wall” conflicts.',
    why4h: 'Materials matched to spec',
    why4p: 'Manufacturers chosen for your finish class — no overspend, no weak links where it matters.',
    why5h: 'Organised site',
    why5p: 'Waste segregation, material zones and professional conduct — also in terraced and multi-unit contexts.',
    why6h: 'Warranty & protocols',
    why6p: 'Partial acceptance, warranty documentation and clear after-sales procedures.',

    procEyebrow: 'How we work',
    procTitle: 'A process that clears budget fog',
    procIntro:
      'Each stage has a technical owner and a decision point — you know when you approve scope, when materials are fixed and when rooms are handed over.',

    proc1h: 'Contact',
    proc1p: 'Short brief on work type (build, electrical, earthworks, renovation), location and timing, access to design documents.',
    proc2h: 'Estimate',
    proc2p: 'Site walkthrough, technology and stage options, standard / premium variants, progress-linked payment plan.',
    proc3h: 'Design alignment',
    proc3p: 'Detail freeze, trade sequencing, early orders for long-lead items.',
    proc4h: 'Delivery',
    proc4p: 'Supervision, weekly summaries, quality checks before the next stage.',
    proc5h: 'Handover',
    proc5p: 'Snagging list, user training, full documentation and warranties.',

    projEyebrow: 'Projects',
    projTitle: 'Selected projects — quality in the details',
    projIntro: 'Examples across <strong>housing, electrical, earthworks and interiors</strong> in Kartuzy county and Pomerania.',

    proj1h: 'Single-family home — extended developer finish',
    proj1p:
      'Kartuzy area · 9 months · from foundations. Developer-plus package: technical terrace, MVHR, triple glazing and full interior finishing.',
    proj1alt: 'Modern single-family house with large glazing and mixed façade',

    proj2h: 'Extension — day zone and annex',
    proj2p:
      'Żukowo · 4 months · new day zone, foundation upgrades for the new footprint, seamless link to the existing entrance.',
    proj2alt: 'House extension — open kitchen and living area',

    proj3h: 'Electrical & wet rooms on the ground floor',
    proj3p:
      'Kartuzy area · central systems, underfloor heating, bespoke kitchen open to the living room.',
    proj3alt: 'Bathroom in a new home with walk-in shower',

    proj4h: 'Façade & entrance — exterior renovation',
    proj4p:
      'Wejherowo · insulation, silicone render, metal flashings and canopy per architect drawings.',
    proj4alt: 'Façade and entrance zone after renovation',

    testEyebrow: 'Client feedback',
    testTitle: 'What clients say',

    test1:
      '“We built a single-storey house. Zet-Bud followed the estimate; the foreman explained window options — no pressure for extras.”',
    test1f: '<strong>Anna & Tomasz K.</strong> · single-family new build',

    test2:
      '“After the previous contractor left chaos, Zet-Bud took over, aligned electrical and finishing trades and delivered handover — great communication.”',
    test2f: '<strong>Piotr S.</strong> · renovation & finishing',

    test3:
      '“We wanted developer standard plus terrace and MVHR. We got a weather-aware schedule and one lead from earthworks to internal plaster.”',
    test3f: '<strong>Magdalena W.</strong> · single-family home, Kartuzy county',

    areaEyebrow: 'Service area',
    areaTitle: 'Pomerania & Tri-City — short drive from Kartuzy',
    areaIntro:
      'We deliver <strong>housing, electrical, earthworks and interior projects</strong> mainly in Kartuzy county, the Tri-City agglomeration and nearby municipalities. Longer distances only where we can keep the same supervision standard.',

    areaCardTitle: 'Typical start lead times',
    areaCardText:
      'New build: usually 6–10 weeks after estimate approval (structure orders, site agreements). Interior-heavy phases are planned after shell and roof are closed.',

    mapEyebrow: 'Location',
    mapTitle: 'Office & sites — Kartuzy, Tri-City, Pomerania',
    mapIntro:
      'Direct investor contact and short travel to sites within ca. 50 km of Kartuzy and in the Tri-City. Replace the placeholder map embed with your final Google Maps code when the HQ pin is fixed.',

    napTitle: 'Contact details (NAP)',
    napHours: 'Hours: Mon–Fri 7:30–17:00',
    napMaps: 'Open route in Google Maps',
    mapFrameTitle: 'Map — ul. Nad Potokiem 54, Kłosowo',
    mapEmbedAria: 'Google Map — ul. Nad Potokiem 54, Kłosowo',

    faqEyebrow: 'FAQ',
    faqTitle: 'Questions before the first meeting',

    faq1q: 'Is the quote really free?',
    faq1a:
      'Yes — for new builds, renovations or bundled scopes we offer a free initial walkthrough and outline estimate. Paid soil tests or extra consultants are agreed before any chargeable work starts.',

    faq2q: 'How do you schedule earthworks with the shell?',
    faq2a:
      'We sequence excavation, drainage and backfill with concrete deliveries and curing time, plus a weather buffer. The weekly plan is updated after shell closed and after the roof is on.',

    faq3q: 'Do you issue electrical completion documentation?',
    faq3a:
      'We hand over circuits documentation and measurement protocols required for acceptance. Formal grid-operator steps, if any, are agreed in the quote according to scope.',

    faq4q: 'How do warranty and after-sales work?',
    faq4a:
      'Final protocol and manufacturer warranty cards. Claims by email or phone — statutory warranty applies to building works; selected interior systems can extend to 5 years.',

    faq5q: 'Can I supply my own materials?',
    faq5a:
      'Yes — the estimate states on-site storage responsibility and system compatibility (e.g. EPS vs ventilation). Materials outside the recommended list need technical sign-off before budget lock.',

    contactEyebrow: 'Contact',
    contactTitle: 'Request a free quote — we will propose a site visit time',
    contactIntro:
      'Describe the work scope (build, electrical, earthworks, renovation), size and location. We will call back to clarify the stage and questions for the first meeting.',

    asideCall: 'Call',
    asideHours: 'Mon–Fri, 7:30–17:00',
    asideWrite: 'Email',

    honeypot: 'Website (do not fill)',
    formName: 'Full name / company',
    formNamePh: 'e.g. John Smith or ACME Ltd',
    formPhone: 'Phone',
    formPhoneHint:
      'Enter the national number — digits only, no spaces. Length depends on the country (Poland: 9 digits).',
    formPhoneNationalPh: 'e.g. 501234567',
    formPhoneCountryAria: 'Country calling code',
    formEmail: 'E-mail',
    formEmailPh: 'you@company.com',
    formTopic: 'Project type',
    formTopicPh: 'Choose from the list',
    formTopicT1: 'New build — single / multi-family home',
    formTopicT2: 'Electrical installations',
    formTopicT3: 'Earthworks & site preparation',
    formTopicT4: 'Renovation & premium interiors',
    formTopicT5: 'Plot finishing / surroundings',
    formTopicT6: 'Other — I will detail in the message',
    formMessage: 'Project description',
    formMessagePh:
      'Type of works, floor area, design status (ready / adaptation), site address or municipality, desired start.',
    formSubmitBtn: 'Send quote request',
    formSubmit: 'Send quote request',
    formSubmitting: 'Sending…',
    formNote:
      'By submitting you confirm you have read the <a href="#">privacy policy</a> and commercial contact rules. We usually reply within one business day.',

    footerLead:
      'Zet-Bud in Pomerania: Kartuzy, Kłosowo, Tri-City area. New homes, electrical, earthworks, renovations and interiors — clear scope and site supervision.',
    footerShortcuts: 'Shortcuts',
    footLink1: 'Services',
    footLink2: 'Projects',
    footLink3: 'Location / map',
    footLink4: 'FAQ',
    footLink5: 'Free quote',
    footerCompany: 'Company details',
    footerRights: 'Zet-Bud Sp. z o.o. All rights reserved.',
    footerLegal: '<a href="#">Privacy policy</a> · <a href="#">Terms of service</a>',

    mobileCtaPhone: 'Phone',
    mobileCtaQuote: 'Quote',

    headerCta: 'Free quote',
  };

  var LD_EN = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://zet-bud.pl/#website',
        url: 'https://zet-bud.pl/',
        name: 'Zet-Bud',
        inLanguage: 'en',
        description:
          'Construction company in Pomerania — single- and multi-family homes, electrical, earthworks, renovations and interiors.',
        publisher: { '@id': 'https://zet-bud.pl/#firma' },
        potentialAction: {
          '@type': 'CommunicateAction',
          name: 'Free construction quote',
          target: 'https://zet-bud.pl/#kontakt',
        },
      },
      {
        '@type': ['ConstructionCompany', 'LocalBusiness', 'Electrician'],
        '@id': 'https://zet-bud.pl/#firma',
        name: 'Zet-Bud Sp. z o.o.',
        description:
          'Construction and finishing company in Pomerania — Kartuzy, Kłosowo, Tri-City: new residential buildings, electrical installations, earthworks, renovations and high-end interior fit-out.',
        url: 'https://zet-bud.pl/',
        telephone: '+48601234567',
        email: 'biuro@zet-bud.pl',
        priceRange: '$$',
        image: [
          'https://zet-bud.pl/assets/images/brand/logo-zetbud-480w.png',
          'https://zet-bud.pl/assets/images/hero.jpg',
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ul. Nad Potokiem 54',
          addressLocality: 'Kłosowo',
          addressRegion: 'pomorskie',
          postalCode: '83-304',
          addressCountry: 'PL',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 54.40764, longitude: 18.26584 },
        hasMap: 'https://www.google.com/maps/search/?api=1&query=54.40764%2C18.26584',
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Pomeranian Voivodeship' },
          { '@type': 'City', name: 'Kłosowo' },
          { '@type': 'City', name: 'Kartuzy' },
          { '@type': 'City', name: 'Gdańsk' },
          { '@type': 'City', name: 'Gdynia' },
          { '@type': 'City', name: 'Sopot' },
          { '@type': 'City', name: 'Żukowo' },
          { '@type': 'City', name: 'Wejherowo' },
          { '@type': 'City', name: 'Kościerzyna' },
          { '@type': 'City', name: 'Rumia' },
          { '@type': 'City', name: 'Reda' },
          { '@type': 'City', name: 'Pruszcz Gdański' },
        ],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '07:30',
            closes: '17:00',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://zet-bud.pl/#faq-schema',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is the quote really free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — for new builds, renovations or bundled scopes we offer a free initial walkthrough and outline estimate. Paid soil tests or extra consultants are agreed before any chargeable work starts.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do you schedule earthworks with the shell?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We sequence excavation, drainage and backfill with concrete deliveries and curing time, plus a weather buffer. The weekly plan is updated after shell closed and after the roof is on.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you issue electrical completion documentation?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We hand over circuits documentation and measurement protocols required for acceptance. Formal grid-operator steps, if any, are agreed in the quote according to scope.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do warranty and after-sales work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Final protocol and manufacturer warranty cards. Claims by email or phone — statutory warranty applies to building works; selected interior systems can extend to 5 years.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I supply my own materials?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — the estimate states on-site storage responsibility and system compatibility (e.g. EPS vs ventilation). Materials outside the recommended list need technical sign-off before budget lock.',
            },
          },
        ],
      },
    ],
  };

  var backups = { meta: {}, el: {}, aria: {}, alt: {}, titleAttr: {}, ph: {}, ld: null, mapSrc: null, heroImgAlt: undefined };

  function setMapIframeLang(lang) {
    var ifr = document.querySelector('.map-embed iframe');
    if (!ifr || !backups.mapSrc) return;
    var s = backups.mapSrc;
    var hl = lang === 'en' ? 'en' : 'pl';
    if (/([?&])hl=[^&]*/.test(s)) {
      s = s.replace(/([?&])hl=[^&]*/, '$1hl=' + hl);
    } else {
      s += (s.indexOf('?') >= 0 ? '&' : '?') + 'hl=' + hl;
    }
    ifr.setAttribute('src', s);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function captureBackups() {
    if (backups.ld === null) {
      var ld = byId('zetbud-ld-json');
      if (ld) backups.ld = ld.textContent;
    }
    var metaIds = [
      'meta-desc',
      'og-title',
      'og-desc',
      'og-locale',
      'og-locale-alt',
      'og-img-alt',
      'tw-title',
      'tw-desc',
    ];
    metaIds.forEach(function (id) {
      var n = byId(id);
      if (n && backups.meta[id] === undefined) backups.meta[id] = n.getAttribute('content') || '';
    });
    if (backups.mapSrc === null) {
      var ifr = document.querySelector('.map-embed iframe');
      if (ifr) backups.mapSrc = ifr.getAttribute('src') || '';
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!k || backups.el[k]) return;
      if (el.getAttribute('data-i18n-html') === 'true') {
        backups.el[k] = el.innerHTML;
      } else {
        backups.el[k] = el.textContent;
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria');
      if (!k || backups.aria[k] !== undefined) return;
      backups.aria[k] = el.getAttribute('aria-label') || '';
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function (img) {
      var k = img.getAttribute('data-i18n-alt');
      if (!k || backups.alt[k] !== undefined) return;
      backups.alt[k] = img.getAttribute('alt') || '';
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-title');
      if (!k || backups.titleAttr[k] !== undefined) return;
      backups.titleAttr[k] = el.getAttribute('title') || '';
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-placeholder');
      if (!k || backups.ph[k] !== undefined) return;
      backups.ph[k] = el.getAttribute('placeholder') || '';
    });

    if (backups.title === undefined) backups.title = document.title;

    var sb = byId('form-submit');
    if (sb) {
      if (backups.el['formSubmitBtn'] === undefined) backups.el['formSubmitBtn'] = sb.textContent.trim();
      if (backups.el['formSubmitting'] === undefined) {
        backups.el['formSubmitting'] = sb.getAttribute('data-label-sending') || 'Wysyłanie…';
      }
    }
  }

  function setMeta(id, value) {
    var n = byId(id);
    if (n) n.setAttribute('content', value);
  }

  function applySelectOptions(lang) {
    var sel = byId('topic');
    if (!sel) return;
    sel.querySelectorAll('option[data-i18n]').forEach(function (opt) {
      var k = opt.getAttribute('data-i18n');
      if (!k) return;
      if (lang === 'en' && EN[k]) opt.textContent = EN[k];
      else if (lang === 'pl' && backups.el[k]) opt.textContent = backups.el[k];
    });
  }

  function applyLanguage(lang) {
    captureBackups();
    var isEn = lang === 'en';
    document.documentElement.lang = isEn ? 'en' : 'pl';
    document.documentElement.setAttribute('xml:lang', isEn ? 'en' : 'pl');

    if (isEn) {
      document.title = EN.metaTitle;
      setMeta('meta-desc', EN.metaDesc);
      setMeta('og-title', EN.ogTitle);
      setMeta('og-desc', EN.ogDesc);
      setMeta('og-locale', EN.ogLocale);
      setMeta('og-locale-alt', EN.ogLocaleAlternate);
      setMeta('og-img-alt', EN.ogImageAlt);
      setMeta('tw-title', EN.twTitle);
      setMeta('tw-desc', EN.twDesc);

      var ld = byId('zetbud-ld-json');
      if (ld) ld.textContent = JSON.stringify(LD_EN);

      setMapIframeLang('en');
    } else {
      document.title = backups.title || document.title;
      Object.keys(backups.meta).forEach(function (id) {
        setMeta(id, backups.meta[id]);
      });
      var ldPl = byId('zetbud-ld-json');
      if (ldPl && backups.ld) ldPl.textContent = backups.ld;
      setMapIframeLang('pl');
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!k) return;
      if (isEn && EN[k]) {
        if (el.getAttribute('data-i18n-html') === 'true') el.innerHTML = EN[k];
        else el.textContent = EN[k];
      } else {
        if (el.getAttribute('data-i18n-html') === 'true') el.innerHTML = backups.el[k] || '';
        else el.textContent = backups.el[k] || '';
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria');
      if (!k) return;
      if (isEn && EN[k]) el.setAttribute('aria-label', EN[k]);
      else if (!isEn && backups.aria[k] !== undefined) el.setAttribute('aria-label', backups.aria[k]);
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function (img) {
      var k = img.getAttribute('data-i18n-alt');
      if (!k) return;
      if (isEn && EN[k]) img.setAttribute('alt', EN[k]);
      else if (!isEn && backups.alt[k] !== undefined) img.setAttribute('alt', backups.alt[k]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-title');
      if (!k) return;
      if (isEn && EN[k]) el.setAttribute('title', EN[k]);
      else if (!isEn && backups.titleAttr[k] !== undefined) el.setAttribute('title', backups.titleAttr[k]);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-placeholder');
      if (!k) return;
      if (isEn && EN[k]) el.setAttribute('placeholder', EN[k]);
      else if (!isEn && backups.ph[k] !== undefined) el.setAttribute('placeholder', backups.ph[k]);
    });

    var hi = document.getElementById('hero-main-img');
    if (hi) {
      if (backups.heroImgAlt === undefined) backups.heroImgAlt = hi.getAttribute('alt') || '';
      hi.setAttribute('alt', isEn ? EN.heroImgAlt : backups.heroImgAlt);
    }

    applySelectOptions(lang);

    var formLang = byId('form-lang');
    if (formLang) formLang.value = isEn ? 'en' : 'pl';

    var submitBtn = byId('form-submit');
    if (submitBtn) {
      if (isEn) {
        submitBtn.textContent = EN.formSubmitBtn || EN.formSubmit;
        submitBtn.setAttribute('data-label-send', EN.formSubmitBtn || EN.formSubmit);
        submitBtn.setAttribute('data-label-sending', EN.formSubmitting);
      } else {
        submitBtn.textContent = backups.el['formSubmitBtn'] || submitBtn.textContent;
        submitBtn.setAttribute('data-label-send', backups.el['formSubmitBtn'] || '');
        submitBtn.setAttribute('data-label-sending', backups.el['formSubmitting'] || '');
      }
    }

    document.querySelectorAll('.lang-switch__btn').forEach(function (b) {
      var active = b.getAttribute('data-lang') === lang;
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    if (window.ZETBUD_FORM_FEEDBACK) {
      window.ZETBUD_FORM_FEEDBACK.lang = lang;
    }
  }

  function readInitialLang() {
    try {
      var u = new URLSearchParams(window.location.search).get('lang');
      if (u === 'en' || u === 'pl') return u;
    } catch (e) {}
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s === 'en' || s === 'pl') return s;
    } catch (e2) {}
    return 'pl';
  }

  function wireLangButtons() {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        if (lang !== 'en' && lang !== 'pl') return;
        applyLanguage(lang);
        try {
          var u = new URL(window.location.href);
          u.searchParams.set('lang', lang);
          window.history.replaceState(null, '', u.pathname + u.search + u.hash);
        } catch (e) {}
      });
    });
  }

  function init() {
    window.ZETBUD_FORM_FEEDBACK = {
      lang: 'pl',
      pl: {
        ok: 'Dziękujemy za wiadomość. Odezwiemy się możliwie szybko, zwykle w ciągu jednego dnia roboczego.',
        err: 'Nie udało się wysłać formularza. Sprawdź pola lub zadzwoń: +48 601 234 567.',
        rate: 'Odczekaj chwilę przed ponownym wysłaniem wiadomości.',
        errByWhy: {
          mail: 'Wiadomość nie została wysłana z powodu problemu po stronie serwera poczty. Spróbuj ponownie za chwilę lub zadzwoń: +48 601 234 567. Na hostingu musi istnieć poprawny plik config.local.php (SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, ZETBUD_SMTP_HELO). Port 465 = zwykle SSL (SMTPS), port 587 = STARTTLS — muszą do siebie pasować; możesz wymusić SMTP_ENCRYPTION (ssl lub tls) w config. W logach PHP (error_log) jest komunikat błędu SMTP; chwilowo możesz włączyć ZETBUD_SMTP_DEBUG lub ZETBUD_SMTP_INSECURE (tylko diagnostyka).',
          bad_name: 'Sprawdź pole z imieniem lub nazwą firmy (min. 2 znaki).',
          bad_phone: 'Telefon jest za krótki. Wpisz co najmniej 6 cyfr numeru krajowego (bez +48) albo wklej pełny numer — zostanie poprawiony automatycznie.',
          bad_email: 'Sprawdź poprawność adresu e-mail.',
          bad_topic: 'Wybierz typ inwestycji z listy.',
          bad_msg: 'Opis inwestycji powinien mieć co najmniej ok. 10 znaków.',
          method: 'Formularz wymaga wysłania metodą POST. Otwórz stronę z adresu zet-bud.pl i spróbuj ponownie.',
        },
      },
      en: {
        ok: 'Thank you. We will get back to you as soon as possible — usually within one business day.',
        err: 'The form could not be sent. Check the fields or call +48 601 234 567.',
        rate: 'Please wait a moment before sending again.',
        errByWhy: {
          mail: 'The message could not be sent due to a mail server issue. Please try again shortly or call +48 601 234 567. The host needs a valid config.local.php (SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, ZETBUD_SMTP_HELO). Port 465 usually uses implicit SSL (SMTPS); port 587 uses STARTTLS — they must match; you can force SMTP_ENCRYPTION (ssl or tls) in config. Check PHP error_log for the SMTP error; temporarily enable ZETBUD_SMTP_DEBUG or ZETBUD_SMTP_INSECURE (diagnostics only).',
          bad_name: 'Please check the name / company field (min. 2 characters).',
          bad_phone: 'The phone number looks too short. Enter at least 6 national digits (without +48) or paste the full number — it will be normalized.',
          bad_email: 'Please check that your e-mail address is valid.',
          bad_topic: 'Please choose a project type from the list.',
          bad_msg: 'Please enter a slightly longer message (at least about 10 characters).',
          method: 'This form must be submitted via POST from the live site. Please try again from zet-bud.pl.',
        },
      },
    };

    captureBackups();

    var lang = readInitialLang();
    if (lang === 'en') applyLanguage('en');
    else applyLanguage('pl');

    wireLangButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
