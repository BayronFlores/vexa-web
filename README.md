# Vexa – página de descarga

Sitio estático: no necesita compilar nada. Sube la carpeta completa a tu hosting.
`index.html` es solo el esqueleto: al abrirse, `js/include.js` carga cada parte de `partials/` en su lugar.
Por eso hay que verlo desde un servidor (hosting o `python -m http.server`), no con doble clic.

```
index.html              esqueleto: <head> (título, SEO, estilos) y la lista de partes en orden
partials/               el contenido, una parte por archivo (se cargan solos al abrir la página)
  nav.html              «Saltar al contenido» y barra de navegación
  footer.html           pie de página
  sections/             hero, band, estados, funciones, modos, privacidad, instalar, permisos,
                        novedades, faq, cierre
css/                    un archivo por sección, en el orden en que aparecen
  tokens.css            colores, tipografía y medidas (tema claro y oscuro)
  base.css              reinicio, títulos, botones, chips de estado, datos de descarga
  nav.css               barra de navegación y menú móvil
  hero.css              portada: titular, aviso con QR, teléfono y escáner
  band.css              franja de cifras
  estados.css           probador de estados y línea de estados
  funciones.css         tarjetas de funciones y «Dos formas de usarla»
  privacidad.css        «Tus datos» y diagrama de qué sale del teléfono
  instalar.css          pasos, permisos y novedades
  faq.css               preguntas, cierre y pie de página
  animations.css        animaciones (lo que depende de JS cuelga de la clase .anim)
js/
  config.js             ← datos de la versión (lo único que se edita al publicar)
  theme.js              tema claro/oscuro (se carga primero para evitar parpadeos)
  animations.js         animaciones (se carga primero; no hace nada con «reducir movimiento»)
  include.js            carga partials/ y luego los demás scripts (lista SCRIPTS dentro)
  icons.js              íconos SVG de la página (agrega uno nuevo aquí)
  utils.js              funciones compartidas (Vexa.$, Vexa.copyText, …)
  release.js            versión, huella, tamaño del APK y novedades
  hero.js               código de barras decorativo y aviso de dispositivo con QR
  probe.js              probador de estados
  nav.js                menú móvil y botón de tema
  vendor/qrcode.js      generador de QR (MIT, Kazuhiko Arase)
img/og-image.png        imagen que se ve al compartir el enlace (1200×630)
vexa.apk                ← súbelo tú, junto a index.html
```

Dónde tocar cada cosa: textos → el archivo de su sección en `partials/sections/`; colores → `css/tokens.css` (el tema claro está en
dos bloques, cámbialo en ambos); el aspecto de una sección → su `css/<sección>.css`; cada
comportamiento → su `js/<nombre>.js`. Para reordenar o quitar una sección, edita la lista de `<div data-include>` en `index.html`.
El orden de la lista `SCRIPTS` en `js/include.js` importa: `utils.js` va antes de `release.js`, `hero.js`, `probe.js` y `nav.js`.

## Al publicar una versión nueva

1. Reemplaza `vexa.apk` por el archivo nuevo (o cambia `file` si lo renombras).
2. Abre `js/config.js` y edita **solo el bloque `RELEASE`**:
   - `version`: número nuevo (se actualiza en toda la página).
   - `sha256`: huella del APK. Si la pegas, aparece el bloque «Verifica el archivo».
   - `history`: agrega la versión nueva **al principio** con sus cambios.
3. Guarda. El tamaño del APK se detecta solo si el servidor lo informa.

Para obtener la huella: `sha256sum vexa.apk` (Linux/Mac) o `certutil -hashfile vexa.apk SHA256` (Windows).

## Antes de publicar el sitio

En `index.html` reemplaza `https://TU-DOMINIO.cl/` por la dirección real (con `/` al final) en
`og:url`, `og:image`, `twitter:image` y `canonical`. Las imágenes para compartir necesitan
una dirección absoluta; con la de ejemplo, WhatsApp y redes no mostrarán la imagen.

## Notas

- El código QR aparece solo a quien visita desde un computador y se genera en su navegador
  (no se envía nada a servicios externos). Requiere que la página se sirva por http/https.
- El botón de tema guarda la elección en el navegador; sin elección, la página sigue al sistema.
- Con «reducir movimiento» activado en el sistema, las animaciones no se ejecutan.
