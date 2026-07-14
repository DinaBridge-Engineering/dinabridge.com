/* DinaBridge Shared Components — v7.0.2
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
    { href: '/about/',   label: 'About us' },
    { href: '/careers/', label: 'Careers'  }
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

         Key design decisions:
         1. Panel is positioned at top:100% (no CSS gap).
            Visual breathing room comes from padding-top on
            the panel itself (see global.css .nav-dropdown-panel).
         2. An invisible hover bridge — a ::before pseudo-element
            10px tall sitting between the trigger bottom edge and
            the panel — keeps pointer-events alive so the browser
            never fires mouseleave while the pointer is in transit.
         3. Close delay: 250ms. Timer is cleared on mouseenter
            of either the trigger button or the panel.
         4. Click authority: clicking the trigger sets
            dd._clickedOpen = true. While that flag is set,
            mouseleave cannot close the dropdown. Only a second
            click on the trigger, a click outside, or Escape
            clears the flag and closes the dropdown.
         ══════════════════════════════════════════════════ */

      var CLOSE_DELAY = 250; /* ms */

      navEl.querySelectorAll('.nav-dropdown').forEach(function (dd) {
        var btn   = dd.querySelector('.nav-dropdown-btn');
        var panel = dd.querySelector('.nav-dropdown-panel');

        /* Per-dropdown close timer handle */
        dd._closeTimer    = null;
        dd._clickedOpen   = false;

        /* ── helpers ──────────────────────────────────── */
        function cancelClose() {
          if (dd._closeTimer) {
            clearTimeout(dd._closeTimer);
            dd._closeTimer = null;
          }
        }

        function openDD() {
          /* Cancel any pending close for this dropdown */
          cancelClose();
          /* Close other open dropdowns immediately */
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

        /* ── Initialize closed ────────────────────────── */
        panel.setAttribute('aria-hidden', 'true');

        /* ── Click on trigger ─────────────────────────── */
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (dd.classList.contains('is-open')) {
            dd._clickedOpen = false;
            closeDD(true);
          } else {
            dd._clickedOpen = true;
            openDD();
          }
        });

        /* ── Hover: enter trigger ─────────────────────── */
        btn.addEventListener('mouseenter', function () {
          cancelClose();
        });

        /* ── Hover: enter panel ───────────────────────── */
        panel.addEventListener('mouseenter', function () {
          cancelClose();
        });

        /* ── Hover: leave trigger ─────────────────────── */
        btn.addEventListener('mouseleave', function () {
          /* If the user clicked it open, do not start a close timer.
             The dropdown will only close via click-outside / Escape. */
          if (!dd._clickedOpen) {
            closeDD(false);
          }
        });

        /* ── Hover: leave panel ───────────────────────── */
        panel.addEventListener('mouseleave', function () {
          if (!dd._clickedOpen) {
            closeDD(false);
          }
        });

        /* ── Select a link inside the panel ──────────── */
        panel.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            closeDD(true);
          });
        });
      });

      /* ── Global close: click outside or Escape ─────── */
      document.addEventListener('click', function () {
        navEl.querySelectorAll('.nav-dropdown.is-open').forEach(function (dd) {
          if (dd._closeTimer) { clearTimeout(dd._closeTimer); dd._closeTimer = null; }
          dd._clickedOpen = false;
          dd.classList.remove('is-open');
          dd.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
          dd.querySelector('.nav-dropdown-panel').setAttribute('aria-hidden', 'true');
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
          navEl.querySelectorAll('.nav-dropdown.is-open').forEach(function (dd) {
            if (dd._closeTimer) { clearTimeout(dd._closeTimer); dd._closeTimer = null; }
            dd._clickedOpen = false;
            dd.classList.remove('is-open');
            dd.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
            dd.querySelector('.nav-dropdown-panel').setAttribute('aria-hidden', 'true');
          });
          if (burger.classList.contains('is-open')) closeDrawer();
        }
      });
    }

    /* ── FOOTER ──────────────────────────────────────── */
    var footerEl = document.querySelector('footer');
    if (footerEl && !footerEl.dataset.sharedInjected) {
      footerEl.dataset.sharedInjected = '1';
      footerEl.innerHTML =
        '<div class="cx footer-inner">\n' +
        '  <div class="footer-grid">\n' +

        '    <div class="footer-brand">\n' +
        '      <a href="/" class="logo">Dina<span>Bridge</span></a>\n' +
        '      <p>Senior engineers building search, observability, and security platforms at scale. Directly, under your brand, or embedded in your team.</p>\n' +
        '      <a href="mailto:hello@dinabridge.com" class="footer-email">hello@dinabridge.com</a>\n' +
        '      <a href="mailto:partners@dinabridge.com" class="footer-email">partners@dinabridge.com</a>\n' +
        '    </div>\n' +

        '    <div class="footer-col">\n' +
        '      <div class="footer-col-title">Services</div>\n' +
        '      <ul>\n' +
        '        <li><a href="/solutions/">Team augmentation</a></li>\n' +
        '        <li><a href="/partners/">Partner delivery</a></li>\n' +
        '        <li><a href="/#contact">Direct engagement</a></li>\n' +
        '        <li><a href="/platforms/">All platforms</a></li>\n' +
        '      </ul>\n' +
        '    </div>\n' +

        '    <div class="footer-col">\n' +
        '      <div class="footer-col-title">Learn</div>\n' +
        '      <ul>\n' +
        '        <li><a href="/learning/">Learning</a></li>\n' +
        '        <li><a href="/glossary/">Glossary</a></li>\n' +
        '        <li><a href="/blog/">Blog</a></li>\n' +
        '        <li><a href="/#faq">FAQ</a></li>\n' +
        '      </ul>\n' +
        '    </div>\n' +

        '    <div class="footer-col">\n' +
        '      <div class="footer-col-title">Company</div>\n' +
        '      <ul>\n' +
        '        <li><a href="/about/">About us</a></li>\n' +
        '        <li><a href="/careers/">Careers</a></li>\n' +
        '        <li><a href="/partners/">Partners</a></li>\n' +
        '      </ul>\n' +
        '    </div>\n' +

        '    <div class="footer-col">\n' +
        '      <div class="footer-col-title">Legal</div>\n' +
        '      <ul>\n' +
        '        <li><a href="/privacy/">Privacy</a></li>\n' +
        '        <li><a href="/#contact">Contact</a></li>\n' +
        '      </ul>\n' +
        '    </div>\n' +

        '  </div>\n' +

        '  <div class="footer-bottom">\n' +
        '    <p class="footer-copy">&copy; 2026 DinaBridge. We build platforms that work.</p>\n' +
        '    <div class="social-row">\n' +
        '      <a href="https://www.linkedin.com/company/dinabridge" class="social-btn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">\n' +
        '        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>\n' +
        '      </a>\n' +
        '      <a href="https://github.com/DinaBridge-Engineering" class="social-btn" aria-label="GitHub" target="_blank" rel="noopener noreferrer">\n' +
        '        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>\n' +
        '      </a>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>';
    }

    /* ── SCROLL REVEAL ───────────────────────────────── */
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08 });
      revealEls.forEach(function (el) { io.observe(el); });
    }

  });

}());
