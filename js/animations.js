/* =========================================================
   Vexa – animaciones
   Se carga en <head> (sin defer) para marcar la página con
   .anim antes del primer pintado y evitar parpadeos.
   Si la persona pidió reducir movimiento, no hace nada.
   ========================================================= */
(function () {
  "use strict";

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("anim");

  /* ---------- Utilidades ---------- */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  // Avisa UNA vez por elemento cuando entra en pantalla.
  // onEnter(el, k): k es el orden de llegada dentro del lote que entró junto (sirve para escalonar).
  function onceVisible(els, options, onEnter) {
    var io = new IntersectionObserver(function (entries) {
      var k = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        onEnter(e.target, k++);
      });
    }, options);
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  // Marca el elemento con una clase mientras está (o no está) en pantalla
  function watch(sel, cls, whenVisible) {
    var el = $(sel);
    if (!el) return;
    new IntersectionObserver(function (es) {
      var visible = es[0].isIntersecting;
      el.classList.toggle(cls, whenVisible ? visible : !visible);
    }).observe(el);
  }

  /* ---------- 1. Titular del hero: palabra por palabra ---------- */
  function splitHero() {
    var h = $(".hero h1");
    if (!h) return;
    try {
      var text = h.textContent.trim();
      h.setAttribute("aria-label", text);
      h.innerHTML = text
        .split(/\s+/)
        .map(function (w, i) {
          return (
            '<span class="w" aria-hidden="true" style="--w:' +
            i +
            '">' +
            w +
            "</span>"
          );
        })
        .join(" ");
    } finally {
      h.classList.add("split");
    }
  }

  /* ---------- 2. Aparición al hacer scroll (solo títulos, tarjetas y pasos) ---------- */
  var REVEAL = [
    [".sec h2, .band-text, .final h2", "up"],
    [".tile", "scale"],
    [".steps li", "up"],
  ];

  function reveals() {
    var els = [];
    REVEAL.forEach(function (pair) {
      $$(pair[0]).forEach(function (el) {
        el.setAttribute("data-reveal", pair[1]);
        els.push(el);
      });
    });
    onceVisible(
      els,
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
      function (el, k) {
        el.style.setProperty("--i", k);
        el.classList.add("is-in");
      },
    );
  }

  /* ---------- 3. Grupos con línea que se dibuja (línea de tiempo y pasos) ---------- */
  function groups() {
    var gs = $$(".when, .steps");
    gs.forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) {
        c.style.setProperty("--k", i);
      });
    });
    onceVisible(gs, { threshold: 0.35 }, function (g) {
      g.classList.add("is-in");
    });
  }

  /* ---------- 4. Contadores que suben hasta su valor ---------- */
  function countUp(el) {
    var n = el._n,
      s = el._s;
    if (!n) return;
    var t0 = performance.now(),
      dur = 1100;
    (function frame(t) {
      var p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + s;
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
  }

  function counters() {
    var els = $$(".stats b, .counters b").filter(function (el) {
      var m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return false;
      el._n = parseInt(m[1], 10);
      el._s = m[2];
      if (el._n > 0) el.textContent = "0" + el._s;
      return true;
    });
    onceVisible(els, { threshold: 0.6 }, countUp);
  }

  /* ---------- 5. Pausar lo infinito cuando no se ve ----------
     - hero: se marca .is-offscreen al salir (así las entradas del primer pintado no se pausan)
     - franja y cable de datos: solo corren mientras están en pantalla (.is-visible) */
  function pauseOffscreen() {
    watch(".hero", "is-offscreen", false);
    watch(".band", "is-visible", true);
    watch(".flow", "is-visible", true);
  }

  /* ---------- 6. Navegación: sombra, barra de progreso y sección actual ---------- */
  function nav() {
    var header = $(".nav");
    if (!header) return;

    var bar = document.createElement("div");
    bar.className = "progress";
    bar.setAttribute("aria-hidden", "true");
    header.appendChild(bar);

    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      header.classList.toggle("scrolled", window.scrollY > 8);
      bar.style.setProperty(
        "--p",
        max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0,
      );
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();

    var links = {};
    $$('.links a[href^="#"]').forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var sio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          Object.keys(links).forEach(function (k) {
            links[k].classList.remove("current");
            links[k].removeAttribute("aria-current");
          });
          var a = links[e.target.id];
          if (a) {
            a.classList.add("current");
            a.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    $$("main section[id]").forEach(function (s) {
      sio.observe(s);
    });
  }

  /* ---------- 7. Probador de estados: la etiqueta «rebota» al cambiar de estado ---------- */
  function probe() {
    var r = $("#probeRange"),
      chip = $("#probeChip");
    if (!r || !chip) return;
    function state() {
      return chip.className.replace(/\s*bump/, "");
    }
    var current = state();
    r.addEventListener("input", function () {
      // main.js actualiza la etiqueta en su propio listener; leemos después
      requestAnimationFrame(function () {
        var s = state();
        if (s === current) return;
        current = s;
        chip.classList.remove("bump");
        void chip.offsetWidth;
        chip.classList.add("bump");
      });
    });
  }

  function init() {
    [splitHero, reveals, groups, counters, pauseOffscreen, nav, probe].forEach(
      function (fn) {
        try {
          fn();
        } catch (e) {
          /* una animación fallida nunca debe romper la página */
        }
      },
    );
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
