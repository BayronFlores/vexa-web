/* Tema claro/oscuro. Se carga en <head> sin defer para aplicar la preferencia
   guardada antes del primer pintado (evita el parpadeo). Si la persona nunca
   eligió, no se toca nada y la página sigue el tema del sistema. */
(function () {
  "use strict";
  var KEY = "vexa-theme";
  var COLORS = { dark: "#030020", light: "#faf9ff" };
  var root = document.documentElement;

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null;
    }
  }
  function system() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  function apply(t) {
    root.setAttribute("data-theme", t);
    // Con una elección manual, un único theme-color reemplaza a los dos con media
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    metas.forEach(function (m, i) {
      if (i === 0) {
        m.removeAttribute("media");
        m.setAttribute("content", COLORS[t]);
      } else m.parentNode.removeChild(m);
    });
  }

  window.VexaTheme = {
    current: function () {
      return root.getAttribute("data-theme") || system();
    },
    set: function (t) {
      try {
        localStorage.setItem(KEY, t);
      } catch (e) {
        /* sin almacenamiento: vale solo esta visita */
      }
      apply(t);
    },
    hasChoice: function () {
      return !!stored();
    },
  };

  var saved = stored();
  if (saved) apply(saved);
})();
