/* DinaBridge Shared Components — v2.9.0
   Single source of truth for:
   - Global nav (header + drawer + overlay + burger)
   - Global footer
   - JSON-LD schema (ProfessionalService)
   - Scroll-reveal

   Nav is injected into <nav class="nav"> on every page.
   Active link is auto-detected from window.location.pathname.
   No nav HTML should exist in individual HTML files.

   v2.9.0: Footer rebuilt to match home page exactly — 5-column grid with
            Services, Learn, Company, Legal columns + social row + copyright.
   v2.8.0: /careers.html → /careers/ in NAV_LINKS (directory routing, real page now at careers/index.html).
   v2.7.0: /privacy.html -> /privacy/ in LEGAL_LINKS (directory routing, real page now at privacy/index.html).
   v2.6.0: /partners.html → /partners/ in NAV_LINKS (directory routing, real page now at partners/index.html).
   v2.5.0: /solutions.html → /solutions/ in NAV_LINKS (directory routing, real page now at solutions/index.html).
   v2.4.0: /platforms → /platforms/ in NAV_LINKS (directory routing, real page now at platforms/index.html).
   v2.3.0: /platforms.html → /platforms in NAV_LINKS.
   v2.2.0: Added Privacy Policy to footer Legal section.
   v2.1.0: Added Glossary to NAV_LINKS.
   v2.0.0: Added Learning to NAV_LINKS.
*/

(function () {
  'use strict';

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

  /* ── Nav link definitions ────────────────────────────── */
  var NAV_LINKS = [
    { href: '/',                         label: 'Home' },
    { href: '/elastic-consulting.html',  label: 'How We Work' },
    { href: '/solutions/',               label: 'Solutions' },
    { href: '/platforms/',               label: 'Platforms' },
    { href: '/partners/',                label: 'Partners' },
    { href: '/elastic-migration.html',   label: 'Migration' },
    { href: '/about.html',               label: 'About' },
    { href: '/careers/',                 label: 'Careers' },
    { href: '/contact.html',             label: 'Contact' },
    { href: '/blog.html',                label: 'Blog' },
    { href: '/learning.html',            label: 'Learning' },
    { href: '/glossary.html',            label: 'Glossary' }
  ];

  /* Legal links — footer only, not in primary nav */
  var LEGAL_LINKS = [
    { href: '/privacy/', label: 'Privacy Policy' }
  ];

  var path = window.location.pathname;
  if (path === '/index.html') path = '/';

  function isActive(href) {
    if (href === '/') return path === '/';
    return path === href || path.indexOf(href) === 0;
  }

  function buildLinks() {
    return NAV_LINKS.map(function (l) {
      var cls = isActive(l.href) ? ' class="active"' : '';
      return '<a href="' + l.href + '"' + cls + '>' + l.label + '</a>';
    }).join('\n        ');
  }

  function buildLegalLinks() {
    return LEGAL_LINKS.map(function (l) {
      return '<a href="' + l.href + '">' + l.label + '</a>';
    }).join('\n        ');
  }

  /* ── DOM injection ───────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    /* NAV */
    var navEl = document.querySelector('nav.nav');
    if (navEl) {
      navEl.innerHTML =
        '<div class="container">\n' +
        '  <div class="nav-inner">\n' +
        '    <a href="/" class="brand">\n' +
        '      <div class="brand-mark">D</div>\n' +
        '      <span>DinaBridge</span>\n' +
        '    </a>\n' +
        '    <div class="nav-links">\n        ' +
        buildLinks() +
        '\n    </div>\n' +
        '    <a href="/contact.html" class="nav-cta">Start a Conversation</a>\n' +
        '    <button class="nav-burger" aria-label="Open menu" aria-expanded="false" id="navBurger">\n' +
        '      <span class="burger-bar"></span>\n' +
        '      <span class="burger-bar"></span>\n' +
        '      <span class="burger-bar"></span>\n' +
        '    </button>\n' +
        '  </div>\n' +
        '</div>';

      /* DRAWER */
      var drawerHTML =
        '<div class="nav-drawer" id="navDrawer">\n' +
        '  <div class="drawer-links">\n        ' +
        buildLinks() +
        '\n    <a href="/contact.html" class="nav-cta btn btn-primary" style="margin-top:var(--sp-12);width:100%;justify-content:center;">Start a Conversation</a>\n' +
        '  </div>\n' +
        '</div>\n' +
        '<div class="nav-overlay" id="navOverlay"></div>';

      navEl.insertAdjacentHTML('afterend', drawerHTML);

      /* BURGER LOGIC */
      var burger  = document.getElementById('navBurger');
      var drawer  = document.getElementById('navDrawer');
      var overlay = document.getElementById('navOverlay');

      function toggle(open) {
        burger.classList.toggle('is-open', open);
        drawer.classList.toggle('is-open', open);
        overlay.classList.toggle('is-visible', open);
        burger.setAttribute('aria-expanded', String(open));
      }
      burger.addEventListener('click',  function () { toggle(!burger.classList.contains('is-open')); });
      overlay.addEventListener('click', function () { toggle(false); });
      document.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && burger.classList.contains('is-open')) toggle(false);
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 980 && burger.classList.contains('is-open')) toggle(false);
      });
    }

    /* FOOTER — matches home page exactly */
    var footerEl = document.querySelector('footer');
    if (footerEl) {
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
        '        <li><a href="/contact.html">Direct engagement</a></li>\n' +
        '        <li><a href="/platforms/">All platforms</a></li>\n' +
        '      </ul>\n' +
        '    </div>\n' +

        '    <div class="footer-col">\n' +
        '      <div class="footer-col-title">Learn</div>\n' +
        '      <ul>\n' +
        '        <li><a href="/learning/">Learning</a></li>\n' +
        '        <li><a href="/glossary/">Glossary</a></li>\n' +
        '        <li><a href="/blog.html">Blog</a></li>\n' +
        '        <li><a href="/contact.html#faq">FAQ</a></li>\n' +
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
        '        <li><a href="/contact.html">Contact</a></li>\n' +
        '      </ul>\n' +
        '    </div>\n' +

        '  </div>\n' +

        '  <div class="footer-bottom">\n' +
        '    <p class="footer-copy">&copy; 2026 DinaBridge. We build platforms that work.</p>\n' +
        '    <div class="social-row">\n' +
        '      <a href="https://www.linkedin.com/company/dinabridge" class="social-btn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">\n' +
        '        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>\n' +
        '      </a>\n' +
        '      <a href="https://github.com/DinaBridge-Engineering" class="social-btn" aria-label="GitHub" target="_blank" rel="noopener noreferrer">\n' +
        '        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>\n' +
        '      </a>\n' +
        '      <a href="#" class="social-btn" aria-label="Twitter / X">\n' +
        '        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>\n' +
        '      </a>\n' +
        '      <a href="#" class="social-btn" aria-label="RSS">\n' +
        '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor"/></svg>\n' +
        '      </a>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>';
    }

    /* SCROLL REVEAL */
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
