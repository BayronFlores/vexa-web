/* Vexa – arma la página cargando las partes de partials/ y después los demás scripts.
   Cada <div data-include="ruta.html"> de index.html se reemplaza por el contenido de ese archivo.
   Necesita http/https (con un servidor local o el hosting); abriendo el archivo con doble clic no carga.
   ► Los scripts que usa la página se listan en SCRIPTS (en este orden). */
(function () {
  "use strict";
  var SCRIPTS = [
    "js/animations.js",
    "js/vendor/qrcode.js",
    "js/utils.js",
    "js/config.js",
    "js/release.js",
    "js/hero.js",
    "js/probe.js",
    "js/nav.js",
  ];
  var root = document.documentElement;
  root.classList.add("loading"); // oculta el contenido hasta que todo esté listo (ver base.css)

  function loadScripts() {
    return SCRIPTS.reduce(function (p, src) {
      return p.then(function () {
        return new Promise(function (ok, fail) {
          var s = document.createElement("script");
          s.src = src;
          s.onload = ok;
          s.onerror = function () {
            fail(new Error(src));
          };
          document.body.appendChild(s);
        });
      });
    }, Promise.resolve());
  }

  function build() {
    var slots = Array.prototype.slice.call(
      document.querySelectorAll("[data-include]"),
    );
    return Promise.all(
      slots.map(function (el) {
        return fetch(el.getAttribute("data-include")).then(function (r) {
          if (!r.ok)
            throw new Error(
              el.getAttribute("data-include") + " (" + r.status + ")",
            );
          return r.text();
        });
      }),
    )
      .then(function (parts) {
        slots.forEach(function (el, i) {
          el.insertAdjacentHTML("beforebegin", parts[i]);
          el.remove();
        });
      })
      .then(loadScripts);
  }

  function start() {
    build()
      .then(function () {
        root.classList.remove("loading");
        var t =
          location.hash &&
          document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (t) t.scrollIntoView(); // el ancla (#faq…) existe recién ahora
      })
      .catch(function (e) {
        root.classList.remove("loading");
        document.body.insertAdjacentHTML(
          "afterbegin",
          '<p style="padding:1rem">No se pudo cargar la página (' +
            e.message +
            "). Ábrela desde un servidor (hosting o <code>python -m http.server</code>).</p>",
        );
      });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start);
  else start();
})();
