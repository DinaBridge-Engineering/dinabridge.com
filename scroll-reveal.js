/* DinaBridge Scroll Reveal — v1.0.0
   Adds .is-visible to .reveal elements as they enter viewport.
   No dependencies. Runs on DOMContentLoaded.
   Uses IntersectionObserver with rootMargin for early trigger. */

(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  });
}());
