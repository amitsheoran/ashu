/* Dr. Ashutosh Gupta — Portfolio interactions */
(function () {
  "use strict";

  /* ---- Navbar: scrolled state + mobile toggle ---- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  window.addEventListener("scroll", function () {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 30);
  });

  if (toggle && links) {
    toggle.addEventListener("click", function () { links.classList.toggle("open"); });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ---- Scroll reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---- Cursor glow (desktop only) ---- */
  if (window.matchMedia("(pointer:fine)").matches) {
    var glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    window.addEventListener("mousemove", function (e) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  }

  /* ---- Starfield canvas ---- */
  var canvas = document.getElementById("stars");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    function size() {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      var count = Math.floor((canvas.width * canvas.height) / 9000);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.2,
          a: Math.random(),
          d: Math.random() * 0.015 + 0.003
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.a += s.d; if (s.a > 1 || s.a < 0) s.d = -s.d;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180,210,255," + Math.abs(s.a) * 0.8 + ")";
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    size(); draw();
    window.addEventListener("resize", size);
  }

  /* ---- Count-up stats ---- */
  var counted = false;
  function countUp() {
    if (counted) return;
    var stats = document.querySelectorAll("[data-count]");
    if (!stats.length) return;
    counted = true;
    stats.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1400, start = performance.now();
      function step(now) {
        var p = Math.min((now - start) / dur, 1);
        var val = Math.floor(p * target);
        el.textContent = val + (p === 1 ? suffix : "");
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var statBand = document.querySelector(".hero-stats, .stat-band");
  if (statBand) {
    var so = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { countUp(); so.disconnect(); }
    }, { threshold: 0.4 });
    so.observe(statBand);
  }

  /* ---- Publication filter ---- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        var f = chip.getAttribute("data-filter");
        document.querySelectorAll(".pub").forEach(function (p) {
          var yr = p.getAttribute("data-decade");
          p.style.display = (f === "all" || f === yr) ? "" : "none";
        });
      });
    });
  }

  /* ---- Contact form (front-end only demo) ---- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("form-note");
      if (note) {
        note.textContent = "Thank you — your message has been noted. Dr. Gupta will respond via email shortly.";
        note.style.color = "var(--lime)";
      }
      form.reset();
    });
  }

  /* ---- Footer year ---- */
  var year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = year; });
  var legacyYr = document.getElementById("yr");
  if (legacyYr) legacyYr.textContent = year;
})();
