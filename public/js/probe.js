/* Vexa – probador de estados: el deslizador cambia el chip y marca el estado en la línea (umbral: 7 días). */
(function () {
  "use strict";
  var $ = Vexa.$,
    $$ = Vexa.$$,
    on = Vexa.on;

  function probe() {
    var r = $("#probeRange");
    if (!r) return;
    var chip = $("#probeChip"),
      txt = $("#probeText"),
      items = $$(".axis li");
    var S = {
      expired: ["Vencido", "s-expired"],
      today: ["Vence hoy", "s-today"],
      soon: ["Próximo a vencer", "s-soon"],
      active: ["Vigente", "s-active"],
    };
    function update() {
      var d = parseInt(r.value, 10),
        k,
        t;
      if (d < 0) {
        k = "expired";
        t = "Venció hace " + -d + (d === -1 ? " día" : " días");
      } else if (d === 0) {
        k = "today";
        t = "Vence hoy";
      } else {
        k = d <= 7 ? "soon" : "active";
        t = d === 1 ? "Vence mañana" : "Vence en " + d + " días";
      }
      chip.className = "chip " + k;
      $("use", chip).setAttribute("href", "#" + S[k][1]);
      $("span", chip).textContent = S[k][0];
      txt.textContent = t;
      r.setAttribute("aria-valuetext", t + ": " + S[k][0]);
      items.forEach(function (li) {
        li.classList.toggle("on", li.classList.contains(k));
      });
    }
    on(r, "input", update);
    update();
  }

  Vexa.run(probe);
})();
