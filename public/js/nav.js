/* Vexa – menú móvil y botón de tema (claro/oscuro). La lógica del tema en sí está en theme.js. */
(function () {
  "use strict";
  var $ = Vexa.$,
    on = Vexa.on;

  /* ---------- Menú móvil ---------- */
  function menu() {
    var btn = $("#menuBtn"),
      nav = $("#menu");
    function set(open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    }
    on(btn, "click", function () {
      set(!nav.classList.contains("open"));
    });
    on(nav, "click", function (e) {
      if (e.target.tagName === "A") set(false);
    });
    on(document, "keydown", function (e) {
      if (e.key === "Escape") set(false);
    });
  }

  /* ---------- Botón de tema: alterna claro/oscuro y recuerda la elección ---------- */
  function themeButton() {
    var btn = $("#themeBtn");
    if (!btn || !window.VexaTheme) return;
    var icon = $("use", btn);
    function paint() {
      var dark = VexaTheme.current() === "dark";
      icon.setAttribute("href", dark ? "#i-sun" : "#i-moon"); // el ícono muestra a qué tema se cambia
      btn.setAttribute(
        "aria-label",
        dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro",
      );
    }
    on(btn, "click", function () {
      VexaTheme.set(VexaTheme.current() === "dark" ? "light" : "dark");
      paint();
    });
    if (window.matchMedia)
      on(matchMedia("(prefers-color-scheme: light)"), "change", function () {
        if (!VexaTheme.hasChoice()) paint();
      });
    paint();
  }

  Vexa.run(menu);
  Vexa.run(themeButton);
})();
