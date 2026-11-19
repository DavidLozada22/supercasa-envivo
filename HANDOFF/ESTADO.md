# Estado

Actualizado: 18 de noviembre de 2026.

## Hecho

- Home de campaña con el diseño y el hero original de Sebastián.
- Franja de live sobre el hero que enlaza a `/envivo`.
- `/envivo` conserva la landing original de la maratón: header fucsia, hero con
  Calvitos flotantes, stream, QR, aliados, patrocinadores y redes, con el arte
  original de Sebastián y su render de la casa por fases.
- `/donar` con wizard de 3 pasos, comisión de Wompi cubierta y transferencias.
- Pago simulado probado de punta a punta hasta `/donar/gracias`.
- Aliados, redes de la Fundación y de Kavanah, hashtags y crédito SVG.
- Fuente original de Sebastián en `legacy/segundosdevida/`, solo como referencia.
- Rutas `/politica-de-datos` y `/terminos` recuperadas del sitio original como borradores.
- Handoff actualizado con decisiones y flujo.

## Pendiente

- Pixel 1108633085373695 configurado en local con consentimiento en páginas
  públicas. La API de Conversiones, deduplicación y eventos de compra siguen
  pendientes; no se ha utilizado ni configurado su token.

- El mapa de recorrido en `/admin/recorrido` es ilustrativo y no efectúa pagos.
- El flujo de Sebastián no está portado por completo: faltan certificado, carnet,
  opciones internacionales y Plan Padrino. No afirmar equivalencia funcional.
- La tarifa Wompi debe confirmarse con la Fundación antes de cobrar.

- Cargar llaves de Wompi en Vercel y hacer una compra real mínima.
- Crear la base Neon y cargar `DATABASE_URL`.
- Descarga del QR en PNG desde `/admin` para OBS.
- Pixel de Meta.
- Plan Padrino y Carnet de Héroe.
- Revisión en celular real del home y de `/envivo`.
- Revisión legal de ambos borradores y confirmación de sus referencias a transparencia, Plan Padrino y contacto de tesorería.

## Notas

- Rama de trabajo: `feat/campaign-visual-merge`, sin push. Producción sigue con
  la versión anterior.
- Los emojis del copy original se conservaron por decisión del cliente.

- `/donar` usa el formulario original de Sebastián: stepper de 3 pasos, piezas,
  certificado, muro de héroes y resumen con comisión. El Plan Padrino mensual se
  muestra deshabilitado ("muy pronto") porque el backend aún no lo soporta.
- El certificado y la preferencia de muro se guardan en la tabla de donaciones.

- Una sola ruta pública de donación: `/donar`. Se retiraron los enlaces al portal externo.

- QR de donaciones descargable en PNG y SVG desde el panel, protegido por sesión.
- La pestaña Campaña se reemplazó por Calendario fijo en hora de Bogotá.
- `META_ACCESS_TOKEN` cargado en Vercel y en local. El token responde en `/me`
  pero no tiene lectura de cuentas publicitarias (`/me/adaccounts` devuelve 403).
  Falta el ID de cuenta publicitaria y un token con `ads_read` para las métricas.

- Base Neon conectada y esquema aplicado (`donations`, `subscriptions`,
  `payment_events`, `campaign_progress`). `DATABASE_URL` y
  `NEXT_PUBLIC_SITE_URL` cargados en Vercel para producción y preview.
- Metadatos SEO, Open Graph, Twitter Card, robots y sitemap añadidos.
- Favicon SVG y OG image de 1200x630 validados.

- ID de cuenta publicitaria configurado: `act_1137196345721751`.
- Meta responde que la cuenta no ha concedido `ads_read` ni `ads_management`
  al token actual. El token de KeePass es de la API de Conversiones, no de
  lectura de anuncios. Falta generar uno con `ads_read` desde Business Manager
  o Graph API Explorer con acceso a esa cuenta.

- Atribución por UTM y enlaces `/ref/codigo`: visitas en la tabla `visits` y
  aportes con `attribution` en `donations`. El panel tiene la pestaña Campañas
  con generador de enlaces y reporte de visitas y aportes por origen.

- El live muestra un placeholder con los logos de la Fundación y Kavanah cuando
  la señal no está disponible, antes de la maratón o al terminar. Ya no aparece
  el aviso de YouTube "This video is unavailable".
- Nota en el panel: YouTube cierra cada transmisión a las 12 horas; para 48
  horas se programan cuatro bloques y se actualiza el ID en cada reinicio.

- Placeholder del live con los logos de la Fundación y Kavanah; se muestra
  antes del evento, al terminar o si YouTube devuelve error. Corregido el estado
  previo que mostraba el aviso de video no disponible.
- Nuevo logo oficial de la Fundación en el pie (bloque "Organizan") junto a
  Kavanah, y nueva imagen OG 1200x630 con ambos logos y CTA.

- Logos sin fondos blancos: Kavanah blanco en pie y placeholder, Kavanah negro
  en la imagen OG; el logo de la Fundación va directo. La versión OG incluye
  ambos logos y el CTA de la maratón.

- La sección de aliados del home usa el mismo componente y diseño que la
  página de la transmisión (tarjeta blanca con píldoras amarillas).

- Kavanah usa su logo del elefante: horizontal (assets 10-12) en la imagen OG
  y el placeholder, vertical (assets 1-3) en el pie. Sin fondos blancos.

- Los logos vuelven a ir sobre tarjeta blanca en el pie y en el placeholder, con
  la versión dorada de Kavanah para que se lea sobre blanco.
- El fallback del live dice "Reconectando la transmisión" cuando YouTube corta
  la señal.
- PENDIENTE: fondo musical o cortina para los cortes de transmisión, de modo que
  David tenga tiempo de actualizar la URL de YouTube.

- Estados del live calculados en hora de Bogotá (UTC-5): antes, en vivo y después.
  Antes muestra fecha, hora y CTA; al iniciar cambia solo, sin cron.
- El ID del directo se puede resolver automáticamente con YouTube Data API
  (`YOUTUBE_API_KEY` + `YOUTUBE_CHANNEL_ID`); sin clave usa el ID del panel.
- Cortina del live con tres variantes aleatorias, sin palabras técnicas, música
  en `/audio/cortina.mp3` y botón para activarla (el navegador bloquea autoplay).
- PENDIENTE: crear la clave de YouTube Data API en Google Cloud para que el ID se
  actualice solo en cada bloque de 12 horas.
