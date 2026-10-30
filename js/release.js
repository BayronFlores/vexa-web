/* Vexa – versión, huella, tamaño del APK y novedades.
   Los datos salen de config.js (RELEASE). */
(function () {
  "use strict";
  var $ = Vexa.$,
    $$ = Vexa.$$,
    on = Vexa.on,
    esc = Vexa.esc;

  /* ---------- Versión, huella y tamaño del APK ---------- */
  function release() {
    var R = window.RELEASE;
    if (!R) return;
    $$("[data-apk]").forEach(function (a) {
      a.setAttribute("href", R.file);
    });
    $$("[data-version]").forEach(function (e) {
      e.textContent = R.version;
    });

    if (R.sha256) {
      $("#sha").textContent = R.sha256;
      $("#verify").hidden = false;
      on($("#copySha"), "click", function () {
        Vexa.copyText(R.sha256, this);
      });
    }

    // Tamaño real del APK si el servidor lo informa (no hace nada si falla)
    fetch(R.file, { method: "HEAD" })
      .then(function (r) {
        var n = parseInt(r.headers.get("content-length") || "0", 10);
        if (!r.ok || !n) return;
        var t = (n / 1048576).toFixed(1).replace(".", ",") + " MB";
        $$("[data-size]").forEach(function (o) {
          o.textContent = t;
        });
        $$("[data-size-item]").forEach(function (o) {
          o.hidden = false;
        });
      })
      .catch(function () {});
  }

  /* ---------- Novedades: se pintan desde RELEASE.history (el HTML trae una entrada de respaldo) ---------- */
  function changelog() {
    var list = $("#changelog"),
      H = window.RELEASE && RELEASE.history;
    if (!list || !H || !H.length) return;
    list.innerHTML = H.map(function (h) {
      return (
        "<li><div><h3>Versión " +
        esc(h.version) +
        "</h3>" +
        (h.date ? "<time>" + esc(h.date) + "</time>" : "") +
        "</div>" +
        "<ul>" +
        (h.notes || [])
          .map(function (n) {
            return "<li>" + esc(n) + "</li>";
          })
          .join("") +
        "</ul></li>"
      );
    }).join("");
  }

  Vexa.run(release);
  Vexa.run(changelog);
})();
