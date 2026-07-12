/* DinaBridge Shared Components — v1.7.0
   Single source of truth for:
   - Global nav (header + drawer + overlay + burger)
   - Global footer
   - JSON-LD schema (ProfessionalService)
   - Scroll-reveal

   Nav is injected into <nav class="nav"> on every page.
   Active link is auto-detected from window.location.pathname.
   No nav HTML should exist in individual HTML files.
*/

(function () {
  'use strict';

  /* ── JSON-LD ─────────────────────────────────────────────── */
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

  /* ── Nav link definitions ────────────────────────────────── */
  var NAV_LINKS = [
    { href: '/',                         label: 'Home' },
    { href: '/elastic-consulting.html',  label: 'How We Work' },
    { href: '/solutions.html',           label: 'Solutions' },
    { href: '/platforms.html',           label: 'Platforms' },
    { href: '/elastic-migration.html',   label: 'Migration' },
    { href: '/about.html',               label: 'About' },
    { href: '/contact.html',             label: 'Contact' },
    { href: '/blog.html',                label: 'Blog' }
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

  /* ── DOM injection ───────────────────────────────────────── */
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

    /* FOOTER */
    var footerEl = document.querySelector('footer');
    if (footerEl) {
      var footerLinks = NAV_LINKS.map(function (l) {
        return '<a href="' + l.href + '">' + l.label + '</a>';
      }).join('\n        ');

      footerEl.innerHTML =
        '<div class="container">\n' +
        '  <div class="footer-inner">\n' +
        '    <div class="footer-brand-block">\n' +
        '      <a href="/" class="brand">\n' +
        '        <div class="brand-mark">D</div>\n' +
        '        <span>DinaBridge</span>\n' +
        '      </a>\n' +
        '    </div>\n' +
        '    <p class="footer-tagline">Senior engineering for production data systems &mdash; observability, search, security, and platform infrastructure.</p>\n' +
        '    <nav class="footer-nav" aria-label="Footer navigation">\n        ' +
        footerLinks +
        '\n    </nav>\n' +
        '    <div class="footer-divider"></div>\n' +
        '    <p class="footer-legal">&copy; 2026 DinaBridge LLC &mdash; All rights reserved</p>\n' +
        '    <span class="footer-gem">Senior Production Data Systems Engineering</span>\n' +
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
