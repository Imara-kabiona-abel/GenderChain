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

  /* ---------------- Language toggle (FR/EN) ---------------- */
  (function initLangToggle() {
    var langInputs = document.querySelectorAll("input[name='lang']");
    if (!langInputs.length) return;

    function applyLang(lang) {
      document.documentElement.lang = lang;
      document.querySelectorAll("[data-fr]").forEach(function (el) {
        var text = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-fr");
        if (text != null) el.textContent = text;
      });
    }
    langInputs.forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked) applyLang(input.value);
      });
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

  /* ---------------- Reveal on scroll ---------------- */
  (function initReveal() {
    var targets = document.querySelectorAll(".reveal, .ps-card, .link-card, .team-member, .achv-card, .support-card, .value-card, .news-card");
    targets.forEach(function (el) { el.classList.add("reveal"); });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var revealObserver = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); o.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { revealObserver.observe(el); });
  })();

  /* ---------------- Curseur stylé (ordinateur uniquement) ---------------- */
  (function initCursor() {
    var ring = document.getElementById("cursorRing");
    if (!ring || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    var shown = false;
    document.addEventListener("mousemove", function (e) {
      if (!shown) { ring.classList.add("show"); shown = true; }
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    });
    document.addEventListener("mouseleave", function () { ring.classList.remove("show"); });
    document.querySelectorAll("a, button, input, .partner, .value-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("pointer"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("pointer"); });
    });
  })();

  /* ---------------- Actualités (chargées depuis actualites.json) ---------------- */
  (function initNews() {
    var grid = document.getElementById("newsGrid");
    if (!grid) return;
    fetch("actualites.json")
      .then(function (r) { return r.json(); })
      .then(function (items) {
        grid.innerHTML = "";
        if (!items || !items.length) {
          grid.innerHTML = '<p class="muted">Aucune actualité publiée pour l\'instant.</p>';
          return;
        }
        items.forEach(function (item) {
          var card = document.createElement("div");
          card.className = "news-card";
          card.innerHTML = '<div class="news-date">' + (item.date || "") + '</div>'
            + "<h3>" + (item.titre || "") + "</h3>"
            + "<p>" + (item.resume || "") + "</p>"
            + (item.lien ? '<a href="' + item.lien + '" target="_blank" rel="noopener">Lire la suite →</a>' : "");
          grid.appendChild(card);
        });
      })
      .catch(function () {
        grid.innerHTML = '<p class="muted">Actualités indisponibles pour le moment.</p>';
      });
  })();

  /* ---------------- Newsletter (Formspree) ---------------- */
  (function initNewsletter() {
    var form = document.getElementById("newsletterForm");
    var status = document.getElementById("nlStatus");
    if (!form || !status) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "Envoi en cours…";
      status.className = "nl-status";
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (r) {
          if (r.ok) {
            status.textContent = "Merci ! Votre inscription a bien été prise en compte.";
            status.className = "nl-status ok";
            form.reset();
          } else {
            status.textContent = "Une erreur est survenue. Réessayez, ou écrivez-nous directement à genderchaindrc@gmail.com.";
            status.className = "nl-status err";
          }
        })
        .catch(function () {
          status.textContent = "Connexion impossible. Réessayez, ou écrivez-nous à genderchaindrc@gmail.com.";
          status.className = "nl-status err";
        });
    });
  })();

  /* ---------------- Bandeau cookies ---------------- */
  (function initCookieBanner() {
    var banner = document.getElementById("cookieBanner");
    if (!banner) return;
    var KEY = "gc_cookie_ack";
    if (!localStorage.getItem(KEY)) {
      setTimeout(function () { banner.classList.add("show"); }, 900);
    }
    var accept = document.getElementById("cookieAccept");
    var details = document.getElementById("cookieDetails");
    if (accept) accept.addEventListener("click", function () {
      localStorage.setItem(KEY, "1");
      banner.classList.remove("show");
    });
    if (details) details.addEventListener("click", function () {
      window.location.hash = "#cookieBanner";
      alert("Ce site n'utilise que des cookies techniques nécessaires à son fonctionnement (par exemple, mémoriser la langue choisie). Aucun cookie publicitaire, aucun traceur tiers, aucune revente de données. Si GenderChain met en place un jour un outil d'analyse d'audience ou de publicité, cette bannière sera mise à jour en conséquence.");
    });
  })();

})();
