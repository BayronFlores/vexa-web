/* Vexa – portada: código de barras decorativo del escáner y aviso si la visita no es de un Android. */
(function () {
  "use strict";
  var $ = Vexa.$,
    on = Vexa.on;

  /* ---------- Código de barras decorativo (anchos fijos para que se vea igual siempre) ---------- */
  function bars() {
    var widths = [
      3, 2, 5, 2, 3, 6, 2, 4, 2, 2, 5, 3, 2, 6, 3, 2, 4, 2, 5, 3, 2, 3, 6, 2, 4,
    ];
    $("#bars").innerHTML = widths
      .map(function (w) {
        return '<i style="width:' + w + 'px"></i>';
      })
      .join("");
  }

  /* ---------- Aviso si la visita no viene de un Android (con QR en computadores) ---------- */
  // QR generado en el navegador (librería local, sin servicios externos)
  function drawQR(box, text) {
    if (typeof qrcode !== "function") return false;
    var qr = qrcode(0, "M"),
      d = "";
    qr.addData(text);
    qr.make();
    var n = qr.getModuleCount();
    for (var r = 0; r < n; r++)
      for (var c = 0; c < n; c++)
        if (qr.isDark(r, c)) d += "M" + c + " " + r + "h1v1h-1z";
    box.innerHTML =
      '<svg viewBox="0 0 ' +
      n +
      " " +
      n +
      '" shape-rendering="crispEdges" aria-hidden="true"><path d="' +
      d +
      '" fill="#030020"/></svg>';
    return true;
  }

  function deviceNote() {
    var ua = navigator.userAgent || "";
    if (/Android/i.test(ua)) return;
    var note = $("#deviceNote"),
      qrBox = $("#qr");
    var ios = /iPhone|iPad|iPod/i.test(ua);
    var url = location.href.split("#")[0];
    var withQR = false;
    if (!ios && /^https?:$/.test(location.protocol) && qrBox) {
      try {
        withQR = drawQR(qrBox, url);
      } catch (e) {}
    }

    $("#deviceMsg").textContent = ios
      ? "Vexa es una app para Android y no está disponible para iPhone. Si tienes un Android, abre esta página desde ese teléfono."
      : withQR
        ? "Estás en un computador. Vexa se instala en un teléfono Android: escanea el código con su cámara para abrir esta página, o copia el enlace."
        : "Estás en un computador. Vexa se instala en un teléfono Android: abre esta página desde él, o copia el enlace para enviártelo.";
    if (withQR) {
      qrBox.hidden = false;
      note.classList.add("has-qr");
    }
    note.classList.add("show");
    on($("#copyLink"), "click", function () {
      Vexa.copyText(url, this);
    });
  }

  Vexa.run(bars);
  Vexa.run(deviceNote);
})();
