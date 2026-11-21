# Vexa – página de descarga (Astro)

Sitio estático hecho con [Astro](https://astro.build). El contenido que antes se cargaba en el
navegador desde `partials/` con `js/include.js` ahora se arma **al compilar**: el HTML sale completo
(mejor para buscadores y para quien no tiene JavaScript). El aspecto y el comportamiento son idénticos
a la versión anterior.

## Comandos

Requiere Node 22 o superior.

| Comando           | Qué hace                                                        |
| ----------------- | --------------------------------------------------------------- |
| `npm install`     | Instala Astro (solo la primera vez)                             |
| `npm run dev`     | Servidor local con recarga automática: http://localhost:4321    |
| `npm run build`   | Genera el sitio listo para subir en `dist/`                     |
| `npm run preview` | Sirve `dist/` localmente para probar el resultado final         |

Para publicar, sube **el contenido de `dist/`** a tu hosting. (`dist/` ya viene generada en este zip;
se vuelve a crear con `npm run build`.) No se abre con doble clic: usa `npm run preview` o el hosting.

## Estructura

```
astro.config.mjs        dirección del sitio (`site`) y opciones de Astro
src/
  pages/index.astro     la página: lista de secciones en el orden en que aparecen
  layouts/Layout.astro  <head> (título, SEO, fuentes, JSON-LD), estilos y scripts
  components/
    Nav.astro           «Saltar al contenido» y barra de navegación
    Footer.astro        pie de página
    Icons.astro         sprite de íconos SVG (agrega uno nuevo aquí)
    sections/           hero, band, capturas, estados, funciones, modos, privacidad, instalar,
                        permisos, novedades, faq, cierre
  styles/               un archivo por sección (se importan en Layout.astro, en este orden)
    tokens.css          colores, tipografía y medidas (tema claro y oscuro)
    base.css            reinicio, títulos, botones, chips de estado, datos de descarga
    nav.css · hero.css · band.css · capturas.css · estados.css · funciones.css
    privacidad.css · instalar.css · faq.css · animations.css
public/                 se copia tal cual a la raíz del sitio
  js/
    config.js           ← datos de la versión (lo único que se edita al publicar)
    theme.js            tema claro/oscuro (en <head>, evita parpadeos)
    animations.js       animaciones (en <head>; no hace nada con «reducir movimiento»)
    utils.js            funciones compartidas (Vexa.$, Vexa.copyText, …)
    release.js          versión, huella, tamaño del APK y novedades
    hero.js             código de barras decorativo y aviso de dispositivo con QR
    capturas.js         selector de pantallas de «Así se ve Vexa»
    probe.js            probador de estados
    nav.js              menú móvil y botón de tema
    vendor/qrcode.js    generador de QR (MIT, Kazuhiko Arase)
  img/og-image.png      imagen al compartir el enlace (1200×630)
  img/capturas/         capturas de la app en WebP (600×1200)
```

Dónde tocar cada cosa: textos → el componente de su sección en `src/components/sections/`; colores →
`src/styles/tokens.css` (el tema claro está en dos bloques, cámbialo en ambos); el aspecto de una
sección → su `src/styles/<sección>.css`; cada comportamiento → su `public/js/<nombre>.js`. Para
reordenar o quitar una sección, edita la lista de `src/pages/index.astro`.

El orden de los `<script>` al final de `src/layouts/Layout.astro` importa: `qrcode.js` y `utils.js`
van antes de `release.js`, `hero.js`, `probe.js` y `nav.js`.

Para cambiar una captura, reemplaza el archivo con el mismo nombre en `public/img/capturas/`; para
agregar otra, copia un botón `.show-tab` y una `<img class="show-img">` en
`src/components/sections/Capturas.astro`.

## Al publicar una versión nueva

1. Sube el APK donde lo alojes (en `config.js`, `file` apunta hoy a una *release* de GitHub). Si lo
   alojas en este mismo sitio, déjalo en `public/vexa.apk` y pon `file: "vexa.apk"`.
2. Abre `public/js/config.js` y edita **solo el bloque `RELEASE`**:
   - `version`: número nuevo (se actualiza en toda la página).
   - `sha256`: huella del APK. Si la pegas, aparece el bloque «Verifica el archivo».
   - `history`: agrega la versión nueva **al principio** con sus cambios.
3. Ejecuta `npm run build` y sube `dist/`. El tamaño del APK se detecta solo si el servidor lo informa.

Para obtener la huella: `sha256sum vexa.apk` (Linux/Mac) o `certutil -hashfile vexa.apk SHA256` (Windows).

## Antes de publicar el sitio

En `astro.config.mjs` reemplaza `https://TU-DOMINIO.cl/` por la dirección real (con `/` al final). Con
eso se actualizan solos `og:url`, `og:image`, `twitter:image` y `canonical`. Las imágenes para
compartir necesitan una dirección absoluta; con la de ejemplo, WhatsApp y redes no mostrarán la imagen.

Si publicas en un subdirectorio (por ejemplo, GitHub Pages de proyecto: `usuario.github.io/vexa-web/`),
agrega también `base: "/vexa-web"` en `astro.config.mjs`.

## Notas

- El código QR aparece solo a quien visita desde un computador y se genera en su navegador
  (no se envía nada a servicios externos). Requiere que la página se sirva por http/https.
- El botón de tema guarda la elección en el navegador; sin elección, la página sigue al sistema.
- Con «reducir movimiento» activado en el sistema, las animaciones no se ejecutan.
