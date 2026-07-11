(function () {
  "use strict";

  /* ---------------- Mobile nav ---------------- */
  (function initMobileNav() {
    var navToggle = document.getElementById("navToggle");
    var navLinksEl = document.getElementById("navLinks");
    if (!navToggle || !navLinksEl) return;

    function closeMobileNav() {
      navLinksEl.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
    navToggle.addEventListener("click", function () {
      var open = navLinksEl.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinksEl.querySelectorAll("a[href^='#']").forEach(function (a) {
      a.addEventListener("click", closeMobileNav);
    });
  })();

  /* ---------------- Scroll-spy ---------------- */
  (function initScrollSpy() {
    var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    var sections = document.querySelectorAll("main > section[id]");
    if (!navLinks.length || !sections.length || !("IntersectionObserver" in window)) return;

    function setActiveLink(id) {
      navLinks.forEach(function (a) {
        var target = a.getAttribute("href").replace("#", "");
        a.classList.toggle("active", target === id);
      });
    }
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  })();

  /* ---------------- Animated big number (objectif) ---------------- */
  (function initCounter() {
    var el = document.querySelector(".big-num [data-count]");
    if (!el) return;
    var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;

    function animate() {
      if (reduceMotion) { el.textContent = target.toLocaleString("fr-FR"); return; }
      var duration = 1300, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString("fr-FR");
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString("fr-FR");
      }
      requestAnimationFrame(step);
    }

    var wrap = document.querySelector(".objectif");
    if (wrap && "IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (entries, o) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animate(); o.disconnect(); }
        });
      }, { threshold: 0.35 });
      obs.observe(wrap);
      setTimeout(function () { if (el.textContent === "0") animate(); }, 1200);
    } else {
      animate();
    }
  })();

  /* ---------------- Reveal on scroll (cards + partners) ---------------- */
  (function initReveal() {
    var targets = document.querySelectorAll(".reveal, .ps-card, .link-card, .team-member, .achv-card");
    targets.forEach(function (el) { el.classList.add("reveal"); });

    var partners = document.querySelectorAll(".partner");

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("in"); });
      partners.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var revealObserver = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); o.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { revealObserver.observe(el); });

    /* Partenaires : apparition progressive décalée, l'un après l'autre */
    if (partners.length) {
      var partnersObserver = new IntersectionObserver(function (entries, o) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var idx = Array.prototype.indexOf.call(partners, entry.target);
            setTimeout(function () { entry.target.classList.add("in"); }, idx * 180);
            o.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      partners.forEach(function (el) { partnersObserver.observe(el); });
    }
  })();

})();
