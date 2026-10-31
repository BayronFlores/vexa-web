/* Vexa – «Así se ve Vexa»: al elegir una pantalla de la lista, el teléfono grande la muestra.
   Funciona como pestañas: clic, o flechas / Inicio / Fin con el teclado. */
(function () {
  "use strict";
  var $ = Vexa.$,
    $$ = Vexa.$$,
    on = Vexa.on;

  function showcase() {
    var list = $("#showList"),
      panel = $("#showPanel"),
      desc = $("#showDesc");
    if (!list || !panel) return;
    var tabs = $$('[role="tab"]', list),
      imgs = $$(".show-img", panel);

    function select(i, focus) {
      tabs.forEach(function (t, j) {
        t.setAttribute("aria-selected", j === i ? "true" : "false");
        t.tabIndex = j === i ? 0 : -1;
      });
      imgs.forEach(function (im, j) {
        im.classList.toggle("is-on", j === i);
        if (j === i) im.removeAttribute("aria-hidden");
        else im.setAttribute("aria-hidden", "true");
      });
      panel.setAttribute("aria-labelledby", tabs[i].id);
      if (desc) desc.textContent = tabs[i].getAttribute("data-desc");
      if (focus) tabs[i].focus({ preventScroll: true });
      // En móvil la lista se desliza de lado: deja la elegida a la vista
      if (list.scrollWidth > list.clientWidth) {
        list.scrollTo({
          left: tabs[i].offsetLeft - (list.clientWidth - tabs[i].offsetWidth) / 2,
          behavior: "smooth",
        });
      }
    }

    tabs.forEach(function (t, i) {
      on(t, "click", function () {
        select(i, false);
      });
    });
    on(list, "keydown", function (e) {
      var cur = tabs.indexOf(document.activeElement);
      if (cur < 0) return;
      var n = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight")
        n = (cur + 1) % tabs.length;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
        n = (cur - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      select(n, true);
    });
  }

  Vexa.run(showcase);
})();
