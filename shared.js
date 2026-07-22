/* DinaBridge Shared Components — v7.0.3
   Single source of truth for:
   - Global nav (header + dropdowns + drawer + overlay + burger)
   - Global footer
   - JSON-LD schema (ProfessionalService)
   - Scroll-reveal

   Nav is injected into <nav class="nav"> on every page.
   Footer is injected into <footer> on every page.
   Idempotency guard prevents double-injection on any page.
   Active link is auto-detected from window.location.pathname.
   No nav HTML should exist in individual HTML files.

   v7.0.3: Footer Legal column — Terms link points to /terms/ (canonical page)

   v7.0.2: Dropdown interaction fix:
            - Removed immediate mouseleave close (was firing before
              pointer could cross into the panel).
            - Panel starts at top:100% (no gap); visual space is
              created by padding-top inside the panel.
            - Invisible hover bridge (10px tall pseudo-block) covers
              the space between trigger bottom and panel top so the
              pointer never exits the interaction zone.
            - 250ms close delay; cancelled when pointer re-enters
              trigger or panel.
            - Click state is authoritative: a clicked-open dropdown
              is not closed by mouseleave (only by click-outside,
              Escape, or a second click on the trigger).
            - Listeners bound once; timers cleared before each state
              change; aria-expanded preserved.
            - Mobile submenu behaviour unchanged.
*/

(function () {
  'use strict';

  /* ── Idempotency guard ───────────────────────────────── */
  if (window.__dinabridgeShellLoaded) return;
  window.__dinabridgeShellLoaded = true;

  /* ── JSON-LD ──────────────────────────────────────────── */
  var schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "DinaBridge",
    "url": "https://dinabridge.com",
    "description": "Senior engineering consultancy for production data systems — observability, search, security, and platform infrastructure. Hands-on delivery across Elastic, Kafka, Kubernetes, and ScienceLogic.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chicago",
      "addressRegion": "IL",
      "addressCountry": "USA"
    },
    "areaServed": { "@type": "Country", "name": "United States" },
    "priceRange": "$$",
    "serviceType": [
      "Production Data Systems Consulting",
      "Observability Engineering",
      "Search & Retrieval Engineering",
      "Security SIEM & Detection Engineering",
      "Platform & Delivery Engineering",
      "Kafka Consulting",
      "Kubernetes Consulting",
      "Elasticsearch Consulting",
      "ScienceLogic SL1 Consulting",
      "Elastic Migration Consulting"
    ],
    "knowsAbout": [
      "Elasticsearch", "Kibana", "Elastic Stack",
      "Apache Kafka", "Kubernetes", "ScienceLogic SL1",
      "Observability", "APM", "Distributed Tracing",
      "SIEM", "Detection Engineering", "Vector Search",
      "Splunk Migration", "Datadog Migration", "LogRhythm Migration"
    ]
  };
  var schemaTag = document.createElement('script');
  schemaTag.type = 'application/ld+json';
  schemaTag.text = JSON.stringify(schema, null, 2);
  document.head.appendChild(schemaTag);

  /* ── Path helpers ────────────────────────────────────── */
  var path = window.location.pathname;
  if (path === '/index.html') path = '/';

  function isActive(href) {
    if (href === '/') return path === '/';
    return path === href || path.indexOf(href) === 0;
  }

  function activeClass(href) {
    return isActive(href) ? ' class="active"' : '';
  }

  /* ── Chevron SVG ─────────────────────────────────────── */
  var CHEVRON = '<svg class="nav-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>';

  /* ── About dropdown items ────────────────────────────── */
  var ABOUT_ITEMS = [
    { href: '/about/',   label: 'About us'         },
    { href: '/impact/',  label: 'DinaBridge Impact' },
    { href: '/careers/', label: 'Careers'           }
  ];

  /* ── Resources dropdown items ────────────────────────── */
  var RESOURCES_ITEMS = [
    { href: '/learning/', label: 'Learning' },
    { href: '/glossary/', label: 'Glossary' },
    { href: '/blog/',     label: 'Blog'     }
  ];

  function buildDropdownItems(items) {
    return items.map(function (l) {
      return '<a href="' + l.href + '"' + activeClass(l.href) + ' class="nav-dropdown-item' + (isActive(l.href) ? ' active' : '') + '">' + l.label + '</a>';
    }).join('');
  }

  function buildMobileSubItems(items) {
    return items.map(function (l) {
      return '<a href="' + l.href + '"' + (isActive(l.href) ? ' class="active"' : '') + '>' + l.label + '</a>';
    }).join('');
  }

  /* ── About dropdown active? ──────────────────────────── */
  var aboutActive  = ABOUT_ITEMS.some(function(l)  { return isActive(l.href); });
  var resActive    = RESOURCES_ITEMS.some(function(l) { return isActive(l.href); });

  /* ── Build desktop nav HTML ──────────────────────────── */
  function buildDesktopNav() {
    return [
      '<a href="/"' + activeClass('/') + '>Home</a>',
      '<a href="/platforms/"' + activeClass('/platforms/') + '>Platforms</a>',
      '<a href="/solutions/"' + activeClass('/solutions/') + '>Solutions</a>',

      /* About dropdown */
      '<div class="nav-dropdown" data-dropdown="about">',
      '  <button class="nav-dropdown-btn' + (aboutActive ? ' active' : '') + '" aria-expanded="false" aria-haspopup="true">',
      '    About ' + CHEVRON,
      '  </button>',
      '  <div class="nav-dropdown-panel" role="menu">',
      buildDropdownItems(ABOUT_ITEMS),
      '  </div>',
      '</div>',

      /* Resources dropdown */
      '<div class="nav-dropdown" data-dropdown="resources">',
      '  <button class="nav-dropdown-btn' + (resActive ? ' active' : '') + '" aria-expanded="false" aria-haspopup="true">',
      '    Resources ' + CHEVRON,
      '  </button>',
      '  <div class="nav-dropdown-panel" role="menu">',
      buildDropdownItems(RESOURCES_ITEMS),
      '  </div>',
      '</div>',

      '<a href="/partners/"' + activeClass('/partners/') + '>Partners</a>'
    ].join('\n');
  }

  /* ── Build mobile drawer links ───────────────────────── */
  function buildMobileLinks() {
    return [
      '<a href="/">Home</a>',
      '<a href="/platforms/">Platforms</a>',
      '<a href="/solutions/">Solutions</a>',

      /* About mobile group */
      '<div class="drawer-group" data-group="about">',
      '  <button class="drawer-group-btn" aria-expanded="false">About ' + CHEVRON + '</button>',
      '  <div class="drawer-sub">',
      buildMobileSubItems(ABOUT_ITEMS),
      '  </div>',
      '</div>',

      /* Resources mobile group */
      '<div class="drawer-group" data-group="resources">',
      '  <button class="drawer-group-btn" aria-expanded="false">Resources ' + CHEVRON + '</button>',
      '  <div class="drawer-sub">',
      buildMobileSubItems(RESOURCES_ITEMS),
      '  </div>',
      '</div>',

      '<a href="/partners/">Partners</a>'
    ].join('\n');
  }

  /* ── DOM injection ───────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    /* ── NAV ─────────────────────────────────────────── */
    var navEl = document.querySelector('nav.nav');
    if (navEl && !navEl.dataset.sharedInjected) {
      navEl.dataset.sharedInjected = '1';
      navEl.innerHTML =
        '<div class="container">\n' +
        '  <div class="nav-inner">\n' +
        '    <a href="/" class="brand">\n' +
        '      <div class="brand-mark">D</div>\n' +
        '      <span class="brand-wordmark">DinaBridge</span>\n' +
        '    </a>\n' +
        '    <div class="nav-links" role="navigation" aria-label="Main navigation">\n' +
        buildDesktopNav() +
        '    </div>\n' +
        '    <a href="/#contact" class="nav-cta" aria-label="Contact DinaBridge">Contact</a>\n' +
        '    <button class="nav-burger" aria-label="Open menu" aria-expanded="false" id="navBurger">\n' +
        '      <span class="burger-bar"></span>\n' +
        '      <span class="burger-bar"></span>\n' +
        '      <span class="burger-bar"></span>\n' +
        '    </button>\n' +
        '  </div>\n' +
        '</div>';

      /* ── DRAWER (injected once, after nav) ─────────── */
      if (!document.getElementById('navDrawer')) {
        var drawerHTML =
          '<div class="nav-drawer" id="navDrawer" aria-hidden="true">\n' +
          '  <div class="drawer-links">\n' +
          buildMobileLinks() +
          '    <a href="/#contact" class="nav-cta nav-cta--full" style="margin-top:var(--sp-16);">Start a Conversation</a>\n' +
          '  </div>\n' +
          '</div>\n' +
          '<div class="nav-overlay" id="navOverlay"></div>';
        navEl.insertAdjacentHTML('afterend', drawerHTML);
      }

      /* ── Burger / drawer toggle ────────────────────── */
      var burger  = document.getElementById('navBurger');
      var drawer  = document.getElementById('navDrawer');
      var overlay = document.getElementById('navOverlay');

      function closeDrawer() {
        burger.classList.remove('is-open');
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        overlay.classList.remove('is-visible');
        burger.setAttribute('aria-expanded', 'false');
      }

      function openDrawer() {
        burger.classList.add('is-open');
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        overlay.classList.add('is-visible');
        burger.setAttribute('aria-expanded', 'true');
      }

      burger.addEventListener('click', function () {
        if (burger.classList.contains('is-open')) { closeDrawer(); } else { openDrawer(); }
      });
      overlay.addEventListener('click', closeDrawer);
      window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024 && burger.classList.contains('is-open')) closeDrawer();
      });

      /* ── Mobile submenu toggles ────────────────────── */
      drawer.querySelectorAll('.drawer-group-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var grp = btn.closest('.drawer-group');
          var sub = grp.querySelector('.drawer-sub');
          var open = sub.classList.toggle('is-open');
          btn.classList.toggle('is-open', open);
          btn.setAttribute('aria-expanded', String(open));
        });
      });

      /* ══════════════════════════════════════════════════
         DESKTOP DROPDOWN INTERACTION — v7.0.2
         ══════════════════════════════════════════════════ */

      var CLOSE_DELAY = 250;

      navEl.querySelectorAll('.nav-dropdown').forEach(function (dd) {
        var btn   = dd.querySelector('.nav-dropdown-btn');
        var panel = dd.querySelector('.nav-dropdown-panel');

        dd._closeTimer    = null;
        dd._clickedOpen   = false;

        function cancelClose() {
          if (dd._closeTimer) { clearTimeout(dd._closeTimer); dd._closeTimer = null; }
        }

        function openDD() {
          cancelClose();
          navEl.querySelectorAll('.nav-dropdown').forEach(function (other) {
            if (other !== dd && other.classList.contains('is-open')) {
              if (other._closeTimer) { clearTimeout(other._closeTimer); other._closeTimer = null; }
              other._clickedOpen = false;
              other.classList.remove('is-open');
              other.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
              other.querySelector('.nav-dropdown-panel').setAttribute('aria-hidden', 'true');
            }
          });
          dd.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          panel.setAttribute('aria-hidden', 'false');
        }

        function closeDD(immediate) {
          cancelClose();
          if (immediate) {
            dd._clickedOpen = false;
            dd.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
          } else {
            dd._closeTimer = setTimeout(function () {
              dd._clickedOpen = false;
              dd.classList.remove('is-open');
              btn.setAttribute('aria-expanded', 'false');
              panel.setAttribute('aria-hidden', 'true');
            }, CLOSE_DELAY);
          }
        }

        panel.setAttribute('aria-hidden', 'true');

        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (dd.classList.contains('is-open')) { dd._clickedOpen = false; closeDD(true); }
          else { dd._clickedOpen = true; openDD(); }
        });
        btn.addEventListener('mouseenter', function () { cancelClose(); });
        panel.addEventListener('mouseenter', function () { cancelClose(); });
        btn.addEventListener('mouseleave', function () { if (!dd._clickedOpen) closeDD(false); });
        panel.addEventListener('mouseleave', function () { if (!dd._clickedOpen) closeDD(false); });
        panel.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () { closeDD(true); });
        });
      });

      document.addEventListener('click', function () {
        navEl.querySelectorAll('.nav-dropdown.is-open').forEach(function (dd) {
          if (dd._closeTimer) { clearTimeout(dd._closeTimer); dd._closeTimer = null; }
          dd._clickedOpen = false;
          dd.classList.remove('is-open');
          dd.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
          dd.querySelector('.nav-dropdown-panel').setAttribute('aria-hidden', 'true