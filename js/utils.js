/* Vexa – utilidades compartidas por release.js, hero.js, probe.js y nav.js.
   Se carga antes que ellos (ver orden de <script> en index.html). */
(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function on(el, type, fn) {
    if (el) el.addEventListener(type, fn);
  }
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Copiar al portapapeles con respaldo; cambia el texto del botón a «Copiado» un momento
  function copyText(text, btn) {
    var label = $("span", btn) || btn,
      original = label.textContent;
    function done() {
      label.textContent = "Copiado";
      setTimeout(function () {
        label.textContent = original;
      }, 1800);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () {});
      return;
    }
    var t = document.createElement("textarea");
    t.value = text;
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {}
    document.body.removeChild(t);
  }

  // Ejecuta una función aislada: si falla, lo demás de la página sigue funcionando
  function run(fn) {
    try {
      fn();
    } catch (e) {
      if (window.console) console.error("Vexa:", fn.name, e);
    }
  }

  window.Vexa = {
    $: $,
    $$: $$,
    on: on,
    esc: esc,
    copyText: copyText,
    run: run,
  };
})();
