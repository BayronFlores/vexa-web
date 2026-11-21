import { defineConfig } from "astro/config";

// ► Cambia `site` por la dirección real (con «/» al final): se usa para
//   canonical, og:url, og:image y twitter:image (ver src/layouts/Layout.astro).
//   Si publicas en un subdirectorio (p. ej. GitHub Pages de proyecto), agrega también `base: "/vexa-web"`.
export default defineConfig({
  site: "https://TU-DOMINIO.cl/",
  compressHTML: false, // conserva el HTML tal como está escrito en los componentes
});
