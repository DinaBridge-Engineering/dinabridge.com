/* DinaBridge Mobile Navigation — v2.1 (NEUTERED)
   All dynamic HTML injection logic is disabled.
   Pages now use hard-coded canonical nav markup:
     <nav class="nav"> ... </nav>
     <div class="nav-drawer" id="navDrawer"> ... </div>
     <div class="nav-overlay" id="navOverlay"></div>
   with an inline <script> burger wiring on every page.

   This file is retained for reference and future compatibility.
   It performs an early-exit check: if #navBurger, #navDrawer,
   and #navOverlay already exist in the DOM, the script exits
   immediately — zero risk of ghost duplicate layers. */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── EARLY EXIT GUARD ──────────────────────────────────────────
       If the page already has the canonical hard-coded nav elements,
       do nothing. All injection logic below is skipped entirely.
    ────────────────────────────────────────────────────────────── */
    if (
      document.getElementById('navBurger') &&
      document.getElementById('navDrawer') &&
      document.getElementById('navOverlay')
    ) {
      return; // canonical nav already present — exit immediately
    }

    /* ── LEGACY FALLBACK (disabled — retained for reference only) ──
       The following injection code previously ran on pages that used
       the empty <nav class="nav"></nav> shell pattern. All pages now
       use the canonical hard-coded nav, so this block never executes.
    ────────────────────────────────────────────────────────────── */

    /*
    var navEl = document.querySelector('nav.nav');
    if (!navEl) return;

    var navInner = navEl.querySelector('.nav-inner');
    if (!navInner) return;

    // Hamburger button
    var burger = document.createElement('button');
    burger.className = 'nav-burger';
    burger.setAttribute('aria-label', 'Open navigation menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('type', 'button');
    burger.innerHTML =
      '<span class="burger-bar"></span>' +
      '<span class="burger-bar"></span>' +
      '<span class="burger-bar"></span>';
    navInner.appendChild(burger);

    // Drawer (appended to body)
    var drawer = document.createElement('div');
    drawer.className = 'nav-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Navigation menu');
    drawer.setAttribute('aria-hidden', 'true');

    var desktopLinks = navEl.querySelector('.nav-links');
    var drawerLinks = document.createElement('div');
    drawerLinks.className = 'drawer-links';
    if (desktopLinks) {
      var anchors = desktopLinks.querySelectorAll('a');
      for (var i = 0; i < anchors.length; i++) {
        drawerLinks.appendChild(anchors[i].cloneNode(true));
      }
    }

    var desktopCta = navEl.querySelector('.nav-cta');
    if (desktopCta) {
      var ctaClone = desktopCta.cloneNode(true);
      ctaClone.className = 'btn btn-primary drawer-cta';
      drawerLinks.appendChild(ctaClone);
    }

    drawer.appendChild(drawerLinks);
    document.body.appendChild(drawer);

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    // Toggle logic
    var isOpen = false;

    function openMenu() {
      isOpen = true;
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close navigation menu');
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      var firstLink = drawer.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      isOpen = false;
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open navigation menu');
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
      burger.focus();
    }

    burger.addEventListener('click', function () {
      isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    var drawerAnchors = drawer.querySelectorAll('a');
    for (var j = 0; j < drawerAnchors.length; j++) {
      drawerAnchors[j].addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && isOpen) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980 && isOpen) closeMenu();
    });
    */

  });
}());
