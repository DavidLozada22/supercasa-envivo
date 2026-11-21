# Estado

Actualizado: 21 de noviembre de 2026.

## Resumen actual

- Producción: `https://supercasa.svgvisual.com`, desplegada por GitHub Actions.
- Panel: `/admin` con Estudio, Streaming, Programa, Recaudo, Campañas y avisos.
- Donaciones: el webhook de Wompi quedó configurado el 21 de noviembre. Antes
  `events_url` estaba en `null` y los eventos salían "Sin URL" en el Debugger.
- Los pagos sí entraron a Wompi: tres aprobados desde el 1 de noviembre
  ($52.500, $100.000 y $20.000) y cuatro rechazados. El de $52.500 quedó
  conciliado en el sitio; los otros dos aprobados vienen de otra integración con
  referencias distintas y no están en la base.
- Quedan seis intentos en pendiente: son pagos abandonados, sin transacción en
  Wompi, así que nunca hubo cobro.
- Pendiente: hacer la donación real mínima de control y ver el evento con estado
  200 en el Debugger.

## Hecho

### 21 de noviembre, webhook de Wompi y pagos pendientes

- Causa del fallo: el comercio de producción tenía `events_url` en `null`. Wompi
  cobraba pero no enviaba ningún evento, así que las donaciones se quedaban en
  pendiente para siempre. Se confirmó con `GET /v1/merchants`: el listado de
  `payment_events` no tenía una sola fila de los pagos reales del 20 y 21 de
  noviembre.
- Se configuró la URL de eventos con `PATCH /v1/merchants/592603`:
  `https://supercasa.svgvisual.com/api/wompi/webhook`. Verificado en la misma
  respuesta del API.
- La firma del webhook ya era correcta: un evento firmado con el secreto de la
  bóveda respondió 200 en producción. El problema era la entrega, no la llave.
- El sitio ahora reconcilia solo: cuando un aporte sigue pendiente,
  `/api/donations/<ref>` consulta Wompi por referencia y aplica el estado. La
  página de gracias se actualiza aunque el webhook no llegue, con un intervalo
  de 8 segundos entre consultas para no martillar la API.
- `reconcilePending()` revisa los pendientes de los últimos catorce días para
  rescatar los aportes viejos.
- Resultado en producción el mismo día: `{"ok":true,"checked":8,"updated":2}`.
  El aporte de $52.500 pasó a aprobado y el de $31.900 a declinado. El recaudo
  subió a $1.171.500 con quince donaciones aprobadas.
- 73 pruebas pasan.

### 20 de noviembre, acceso de sebascapi

- Nuevo usuario `sebascapi` con rol admin en `ADMIN_USERS`, en produccion y preview.
- La clave definida por Nelson quedo en la boveda, entrada `SUPERCASA/PANEL sebascapi`.
- Login verificado en produccion con respuesta 200 y rol admin.
- Sigue vigente la regla: solo Lio edita el programa.

### 20 de noviembre, boton ir al vivo

- El reproductor de `/envivo` tiene un boton flotante "Ir al vivo" cuando el
  espectador esta mas de 12 segundos atras o pausado. Salta al ultimo segundo y
  reanuda la reproduccion.
- La barra de la mascara tiene un boton fijo de radio con el mismo salto.
- En pruebas, el vivo cargo una hora atras y el boton lo dejo en el borde en vivo.

### 20 de noviembre, metricas en vivo

- Streaming abre en "Metricas en vivo": personas en la pagina ahora, unicos del
  dia, vistas y unicos por `/envivo`, `/donar` y `/recorrido`, barras de las
  ultimas 12 horas y recaudo total con meta.
- Se actualiza cada 12 segundos y trae boton directo a YouTube Studio.
- Las vistas se guardan en Postgres (`live_pageviews`, `live_presence`) con un id
  anonimo. Excluye al equipo y a los bots.
- 69 pruebas pasan.

### 20 de noviembre, descargas livianas y cronometro

- Historias, posts y carruseles se descargan en JPG por defecto. Un carrusel de 5
  slides pasa de mas de 20 MB a 1.1 MB. Las capas transparentes siguen en PNG.
- Los PNG de OBS bajaron 75 por ciento: el ZIP completo paso de 44 MB a 11.2 MB.
- El cronometro del live es una pildora de 210x38 con "Llevamos HH:MM:SS", sin
  barra ni numero gigante. Cuenta el tiempo en vivo desde el inicio del evento.
- Queda el selector JPG liviano o PNG en el Estudio para piezas sin transparencia.

### 20 de noviembre, link manual del directo

- El chequeo automatico pasa a 30 segundos. La cuota gratuita aguanta: 2.880
  unidades al dia con directo y 5.760 sin directo, sobre 10.000.
- El panel de Streaming tiene un campo para pegar el link del directo. Se aplica
  al instante con fuente `manual` y se puede volver a automatico.
- Si Google falla, el sitio conserva el ultimo directo detectado y el link manual
  queda como salida rapida.

### 20 de noviembre, conexion del directo

- El live se detecta por la lista de subidas del canal, no por el buscador de
  YouTube. La busqueda gastaba la cuota diaria y no encontraba el directo aunque
  el canal estuviera en vivo.
- Verificado con el directo `9jbiYJDTabU`: `/api/live/current` responde
  `live: true`, `/envivo` incrusta el video y el panel deja de mostrar el error
  de Google.
- Desplegado con el commit `d1a4fb7`.

### 20 de noviembre, editor del programa

- Nueva ruta `/admin/programa/editar` para que el cliente edite el programa
  completo: nombre del bloque, día, horario, conducción, invitados, pilar, enfoque,
  reto, canales y todos los segmentos.
- Se pueden agregar y eliminar bloques y segmentos, duplicar segmentos, buscar
  dentro del bloque y corregir horas, ejecución, tipo, responsable, estado y notas.
- Cada segmento tiene una casilla "Hecho" que se guarda al instante, con contador
  por bloque y total. El Excel incluye la columna `Hecho`.
- Bloques y segmentos se reordenan con flechas. La copia de un segmento queda justo
  debajo de la fila original. El orden manual se conserva al guardar.
- Guardado en `supercasa/program.json` en Blob, con validación en el servidor y
  recálculo de fechas, duraciones y conteos. Botón para descartar y para restaurar
  al JSON base.
- `/programa`, `/api/program`, las moscas de Streaming y el Excel leen el programa
  guardado. `/pantalla/bloque-XX` también toma el nombre y el horario actuales.
- El Excel se genera al momento en `/api/program/excel` con las hojas Programa,
  Bloques y Moscas.
- Marketing ya toma los bloques del JSON V6: la agenda del carrusel, las historias
  de "ya empieza" y los nombres de conducción. El botón "Sincronizar agenda"
  escribe las filas actualizadas en el carrusel de agenda.
- Solo Lio puede editar el programa. Los demás roles ven el programa en lectura
  y pueden descargar el Excel. La lista sale de `PROGRAM_EDITORS` (por defecto
  `lio`) y se valida en el servidor.
- 63 pruebas pasan.
- Desplegado con el commit `1e24b76`. Verificado en producción: `/programa` 200,
  `/api/program` 12 bloques y 508 segmentos, `/api/program/excel` 200 con archivo
  xlsx, `/pantalla/bloque-01` con el nombre del bloque y `/respuestas` 200.

### 20 de noviembre, assets para OBS

- Nueva carpeta `assets/obs` versionada en el repositorio, fuera del gitignore.
  Contiene 56 PNG de cortinas y overlays organizados por categoría, cuatro pistas
  de música y un `manifest.json` con nombres exactos, rutas, URL de PNG y URL de
  OBS.
- La música actual (`cortina.mp3`) y las tres opciones nuevas quedan en
  `assets/obs/music` y también en `public/audio` para usarlas por URL. Todas están
  marcadas para loop.
- `assets/obs/README.md` explica cómo configurar OBS: fuente de medios con Loop,
  sin reiniciar al cambiar de escena, volumen de fondo, cortinas 1920x1080,
  overlays transparentes y URLs dinámicas.
- `AGENTS.md` y `HANDOFF/README.md` apuntan a esos assets para que cualquier agente
  configure OBS sin leer el codebase.
- `npm run obs:assets` regenera las carpetas y el manifiesto desde
  `public/cortinas` y `public/audio`.

### 20 de noviembre, panel de respuestas para WhatsApp

- Nueva página pública `/respuestas`, sin login y con `noindex`, para el equipo que
  contesta WhatsApp. Tiene 20 respuestas rápidas y 12 mensajes para compartir en
  grupos.
- Cada respuesta se copia completa con enlaces y se puede abrir directamente en
  WhatsApp. Los mensajes también tienen copiar y compartir.
- Buscador, categorías por tema y diseño móvil. El botón "Copiar link" copia
  `/respuestas` para pasarlo al equipo.
- La página no se indexa, no aparece en el sitemap y no carga Meta Pixel ni
  atribución.
- El control de programa en Streaming tiene un acceso directo a
  "Respuestas WhatsApp".
- Los links públicos `/programa` y `/respuestas` no leen sesión ni rol. Si un
  usuario bloqueado o sin permiso entra a `/admin/programa`, ahora cae en
  `/programa` en vez de quedar en el login. También quedaron alias `/plan`,
  `/cronograma` y `/respuestas-rapidas`, y cabeceras `no-store` para que el
  navegador no guarde un redirect viejo.

### 20 de noviembre, programa V6, página pública y textos del flujo

- Se importó la escaleta V6 con un lector por nombre de columna. Ahora entiende las
  horas de Excel, las filas S (pregrabado) y V (en vivo), y genera IDs únicos.
  Quedan 12 bloques, 508 segmentos y 32 segmentos en vivo.
- Las cortinas de bloque, las moscas, "Ya viene" y "Estamos en" se generan del
  programa. Las moscas salen para los conductores y los invitados con nombre; los
  bloques sin nombre muestran "Invitado por confirmar" y se pueden ajustar en la
  lista.
- Nueva página pública `/programa`, sin login y con `noindex`. Tiene barra fija de
  "Ahora" con bloque, segmento, hora, responsable, siguiente segmento y avance.
  Incluye pestañas por día, búsqueda, acordeones por bloque, botón de Excel,
  compartir y "Volver a ahora". Está pensada para celular y WhatsApp.
- El programa público sigue el reloj de Bogotá. Si el equipo se corre, el control
  "Programa en vivo" de Streaming o Programa permite marcar el segmento actual y
  la página lo sigue.
- Excel limpio en `/programa/programa-48h.xlsx` con hojas Programa, Bloques y
  Moscas. Se genera con `npm run programa:excel`.
- Se corrigió el flujo de donación: "Ir al envío" pasó a "Ir a la transmisión",
  "Volver al live" ahora lleva a `/envivo` (antes llevaba al inicio), y el paso de
  datos dice "Ver resumen y pagar". Se unificó "Ver el live" a "Ver la
  transmisión" en recordatorios, ayuda, chat y anuncios.
- 55 pruebas pasan.

### 20 de noviembre, edición desde Streaming y pantallas básicas

- El botón Editar del panel de Streaming abre el editor en la misma pantalla, sin
  saltar al Estudio. Al cerrar, la persona vuelve a la pestaña de Streaming donde
  estaba y conserva los botones de OBS, PNG y Ver.
- El Studio conserva su propio editor. Si se edita desde el Studio, se cierra
  sobre el mismo Studio.
- Nueva pestaña "Básicas" en Streaming y filtro "Básicas" en el Studio. Incluye
  Ya regresamos, Empezamos en 1, 5, 15, 20, 30 y 60 minutos, Ajuste técnico,
  Ya viene, Estamos en un bloque y Personalizada.
- "Ya volvemos" pasó a llamarse "Ya regresamos" en la cortina, el título y la
  línea de hora de regreso.
- Nueva cortina "Personalizada" para mensajes que no tienen una pieza propia.
  Tiene título, subtítulo y línea corta editables.
- Las tarjetas del Studio tienen los cuatro accesos rápidos: Editar, PNG, OBS y
  Ver. Los editores de cortinas y marketing agregan Ver junto a OBS. En escenas,
  Ver abre el borrador actual; en marketing, el estado guardado.
- Se regeneraron las 56 cortinas y el ZIP con el nuevo QR grande, el nombre
  "Ya regresamos" y la cortina Personalizada.

### 20 de noviembre, OBS, moscas y QR grande

- Cada tarjeta de cortina, overlay o material de marketing del Estudio tiene un
  botón OBS con el icono de copia. También está en el pie de los tres editores.
  En cortinas y overlays copia `/pantalla/<id>` con los valores actuales en la
  URL: título, invitado, cargo, hora de regreso, QR y avance.
- Marketing tiene una ruta pública `/pantalla/creativo/<id>?slide=N` que muestra
  el material completo, con el estado guardado, para usarlo como fuente de
  navegador en OBS. El botón OBS copia ese link y el del slide que está abierto.
  Hay que guardar antes para que OBS tome los últimos cambios.
- Nueva pestaña "Moscas y agenda" en Streaming. Se genera del minuto a minuto:
  cortinas de bloque, "Estamos en" por bloque, una mosca por persona con su cargo y
  un "Ya viene" por segmento. Cada fila tiene OBS y Ver.
- Las cortinas de bloque ya no usan una lista aparte: salen de
  `lib/program/blocks.json`, con el título, el conductor y el reto del programa.
- QR por defecto: cortinas y overlays apuntan a donaciones; los materiales de
  marketing apuntan al vivo, excepto la categoría Donar. La URL y la etiqueta del
  QR acompañan el destino.
- El QR del pie de las cortinas pasó de 76 px a 200 px. Se ajustaron la casa, los
  calvitos y las cuentas regresivas para que nada quede tapado. La escena de
  donaciones conserva su QR grande a la derecha y oculta el del pie.
- Se regeneraron los 55 PNG de `public/cortinas` y el ZIP con el QR grande y los
  títulos del programa.
- 52 pruebas pasan.

### 20 de noviembre, edición completa del Estudio

- El editor de cortinas y overlays ahora muestra solo los campos que esa pieza usa:
  etiqueta superior, antetítulo, título, subtítulo, línea corta, llamado a donar,
  cuenta regresiva, invitado, rol, hora de regreso y texto bajo la casa.
- Se agregó el control de avance: recaudo real o porcentaje fijo de 0 a 100. Aplica
  a la casa, la barra de la meta y los marcos de live. Los PNG y el preview usan el
  valor elegido.
- El QR y el enlace se eligen por escena: donaciones o transmisión. El QR se genera
  con `/api/qr` a partir de la URL configurada y se incrusta en el PNG.
- Los textos fijos de los overlays (meta, reloj, donación, QR en vivo, mosca, marco
  de live, lower third) ahora se leen de la escena. Ya no hay textos escondidos en
  el código.
- Nuevo bloque "Datos de campaña" en Cortinas y Overlays: URL de donar, URL del
  vivo, Bre-B, banco, hashtag e Instagram. Se edita una vez y se aplica a todas las
  escenas y a los QR.
- Marketing: control de barra y porcentaje de avance, edición de agenda y niveles
  de donación, valores de horas en vivo y usuario de Kick. Las etiquetas "HOY",
  "OBRA REAL" y "CONSTRUIDO" usan el porcentaje elegido en preview y PNG.
- Las tarjetas de marketing y de escenas ahora renderizan la pieza completa, no una
  foto suelta. Cargan solo al entrar en pantalla, reflejan los cambios guardados y
  muestran el checkerboard en las capas transparentes.
- El editor móvil se corrigió con `min-w-0`: el preview ya no desborda la pantalla.
- `app/api/qr` genera PNG de QR solo para enlaces de `svgvisual.com`.

### 19 de noviembre, descargas y categorías del Estudio

- Las descargas de marketing y de escenas usan siempre el borrador abierto, con
  o sin guardar. El preview ya reflejaba los textos al escribir.
- Los carruseles tienen dos salidas: "Descargar slide" para el slide abierto y
  "Descargar carrusel (ZIP)" para las cinco imágenes con los edits actuales más
  `caption.txt`. El ZIP se arma con JSZip en el navegador.
- Las categorías de marketing se separaron en filtros con conteo: Horas en vivo,
  Sueños de los Calvitos, Bloques y agenda, Donar y causa, Carruseles y Capas PNG
  transparentes. Cada filtro explica en una línea qué contiene.
- La categoría de capas PNG se llama "Capas PNG transparentes" y las tarjetas
  muestran un fondo a cuadros con la etiqueta "PNG transparente".
- La pestaña de overlays de transmisión se llama "Overlays OBS" para no
  confundirla con las capas PNG de marketing. Las dos pestañas suman las 55
  escenas, todas con miniatura y editor.

### 20 de noviembre, estudio y finanzas

- Estudio de contenido en `/admin/estudio` con tres pestañas: Marketing,
  Cortinas y Overlays.
- Se integró el estudio de marketing completo: 88 creatives y 120 slides. La
  carpeta local tiene la versión completa; el repositorio público de GitHub
  solo tenía el README.
- Cada creative abre un editor con preview, textos, color, tema, formato, QR,
  caption y descarga PNG. Guarda por creative y por slide en Blob.
- Cada cortina y overlay abre un editor con preview 1920x1080, textos, color,
  calvito, guardado en Blob y descarga PNG con los cambios usando
  `html-to-image`.
- Los cambios de las escenas se aplican en `/pantalla/<id>` y en la fuente de
  OBS. El PNG base se mantiene como respaldo.
- Roles: salvaje, vikingo, sebas, flor y lio quedan admin. Lina queda finance.
  Ana y sandeivid quedan marketing.
- `/admin/recaudo` para Lina y los admin: total de Wompi, Bre-B y Bancolombia,
  formulario para agregar aportes manuales, edición y borrado. Los aportes
  manuales entran a `donations` y suman al total del sitio y a la barra de la
  casa.
- Acceso rápido móvil: barra inferior con cuatro módulos y un botón "Más" que
  abre todos los módulos agrupados. El módulo activo siempre queda visible.
- El login redirige a marketing a `/admin/estudio` y a finanzas a
  `/admin/recaudo`. Las páginas y APIs validan el rol.
- `ADMIN_USERS` actualizado en Vercel para producción y preview. Roles
  verificados en producción: Lina entra a Recaudo, Ana y Sandeivid a Estudio,
  los cinco admin a Inicio. Las rutas y APIs bloquean el acceso cruzado.
- Recaudo probado en producción: se agregó un aporte de $1.000, se editó a
  $2.000 y se borró. El total volvió a $0.
- Exportación PNG de cortinas corregida y verificada a 1920x1080 en local y
  producción. El preview se escala, pero la captura usa el nodo real sin
  transformación.
- Wompi producción activado. Se cargaron en Vercel producción
  `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`, `WOMPI_INTEGRITY_SECRET` y
  `WOMPI_EVENTS_SECRET` desde la bóveda. La consulta de estado ahora usa la llave
  privada. Preview queda en modo simulado para no cobrar por accidente.
- Dashboard `/admin` abre en Inicio con el mapa de accesos. Al entrar a
  Transmisión, Meta, Calendario o Campañas, el mapa se oculta y se ve solo esa
  sección. El mapa quedó en dos columnas en móvil y las descripciones se ocultan
  para reducir scroll. La pestaña de recaudo del dashboard se renombró Meta y ya
  no edita el recaudo manual: el recaudo real vive en `/admin/recaudo`.
- 50 pruebas en `tests/` (node --test).

### 19 de noviembre, segunda ronda

- Cortinas rediseñadas a 1920x1080 con textos y logos más grandes. 55 piezas:
  17 generales, 6 cuentas regresivas (1, 5, 15, 20, media hora y 1 hora), 6 de
  la casa (0, 25, 50, 75, 100 y avance real), 12 bloques, 5 overlays y el fondo
  y marco para live pequeño.
- Los calvitos 3D se intercalan en las cortinas. Los bloques llevan el número
  gigante, el reto y una franja de donación. Los logos van directos sobre el
  fondo, sin placa blanca.
- Overlays con logos y llamado a donar: lower third, barra de la meta, contador,
  marco en vivo, donación grande con QR y "en vivo con QR". La mosca muestra
  hora actual y horas restantes.
- Fondo y marco para live pequeño: el video va en 1280x720 en la posición
  80 x 180; el panel derecho lleva QR, Bre-B, cuenta, avance y redes.
- Panel `/admin` con sidebar agrupado y mapa de accesos. Todo se ve desde el
  inicio: Streaming, Programa, Recordatorios, Avisos, Donaciones, Casa,
  Recorrido y Vista previa.
- Panel `/admin/recordatorios` con 19 mensajes listos por momento (antes,
  durante y después), confirmación de envío, historial y lista de inscritos.
- Chatbot con guion y memoria del proyecto en home, `/envivo` y `/donar`.
  Responde causa, horarios, bloques, donación, comprobante, certificado,
  empresas y especie. Captura nombre y correo para la lista de recordatorios.
- Contador grande de horas en `/envivo`, píldora sobre el reproductor y mosca
  para OBS. Muestra horas en vivo, horas restantes y el avance de las 48.
- `/donar` con dos caminos visibles: pago en línea con Wompi y transferencia
  directa. La transferencia explica los tres pasos y tiene botón para enviar el
  comprobante por WhatsApp o correo.
- Al aprobarse una donación, Resend envía el agradecimiento con la casa, un
  calvito y los logos, y el donante queda inscrito en recordatorios.
- La escaleta se normaliza: sin guiones largos, con nombres capitalizados y el
  error "Incio" corregido. El aviso de duraciones se mantiene.
- Generador de cortinas con ZIP `cortinas-supercasa.zip` (55 piezas, 50 MB).
- `/donar` tiene un mini visor del live entre la introducción y los dos caminos:
  video en vivo, botón de pantalla completa con modal, acceso directo a
  `/envivo` y píldora "EN VIVO · Ver" al salir de pantalla. Antes del evento
  muestra el conteo.
- El panel de Streaming cambió los placeholders de las tarjetas: esqueleto de
  carga, aviso de PNG pendiente, tablero para overlays transparentes y etiquetas
  PNG, Cuenta, Hora, Casa, Bloque u Overlay.
- `?preview=live` en `/donar` fuerza el estado en vivo para revisar el mini visor
  sin esperar al evento.

### 19 de noviembre

- Login del panel sin nombres reales en los placeholders y con botón para ver u
  ocultar la clave.
- Seis usuarios del panel: salvaje, vikingo, sebas, flor, lina y lio, cada uno
  con su clave entregada por privado. El login tiene límite de intentos.
- Panel `/admin/streaming`: 33 cortinas de 1920x1080, descarga en PNG, URL para
  OBS, control de la cortina al aire y estado de las conexiones.
- Fuente única de OBS con cambio de escena desde el panel. Overlays de lower
  third, barra de la meta, contador de 48 horas y marco en vivo.
- Detección automática del directo con YouTube Data API, caché de 25 segundos,
  historial de cambios, botón de comprobación y simulacro de corte.
- El reproductor consulta el ID cada 30 segundos y cambia el video sin recargar.
  Si no hay señal, muestra la cortina.
- Resend conectado: dominio `supercasa.svgvisual.com` verificado, remitente
  `hola@supercasa.svgvisual.com` y prueba enviada.
- Panel `/admin/avisos` con plantillas, vista previa, confirmación, envío por
  lotes e historial. Solo escribe a quienes dieron consentimiento.
- Panel `/admin/programa` con los 12 bloques y los 280 segmentos de la escaleta,
  bloque en curso, lo que viene y aviso de duraciones.
- Importador `scripts/import-escaleta.py` y generador `scripts/render-cortinas.mjs`.

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

### Para el evento

- Probar el corte real de las 12 horas en el primer cambio de broadcast.
- Revisar el panel y las cortinas en el computador de OBS antes de las 6:00 p. m.
- Confirmar las duraciones reales de la escaleta: el Bloque 04 suma 886 minutos
  para un bloque de 240.
- Cargar la escaleta definitiva cuando llegue la versión nueva.
- Revisar en celular real la franja de avisos, el chatbot y el formulario.
- WhatsApp de comprobantes y ayuda: `+57 317 565 8064`, cargado como
  `NEXT_PUBLIC_DONATION_WHATSAPP` en producción y preview.

- Pixel 1108633085373695 configurado en local con consentimiento en páginas
  públicas. La API de Conversiones, deduplicación y eventos de compra siguen
  pendientes; no se ha utilizado ni configurado su token.

- El mapa de recorrido en `/admin/recorrido` es ilustrativo y no efectúa pagos.
- El flujo de Sebastián no está portado por completo: faltan certificado, carnet,
  opciones internacionales y Plan Padrino. No afirmar equivalencia funcional.
- La tarifa Wompi debe confirmarse con la Fundación antes de cobrar.

- Cargar llaves de Wompi en Vercel y hacer una compra real mínima. Hoy
  producción muestra "Wompi en activación" y prioriza Bre-B y transferencia.
- Crear la base Neon y cargar `DATABASE_URL`.
- Descarga del QR en PNG desde `/admin` para OBS: hecho.
- Pixel de Meta.
- Plan Padrino y Carnet de Héroe.
- Revisión en celular real del home y de `/envivo`.
- Revisión legal de ambos borradores y confirmación de sus referencias a transparencia, Plan Padrino y contacto de tesorería.

## Notas

- Rama de trabajo: `main`. Los cambios se publican por GitHub Actions con token.
  Producción queda en `https://supercasa.svgvisual.com`.
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

- Corregida la comparación "Hoy / Así quedará": la imagen de hoy cubría todo y
  el control no tenía comportamiento. Ahora es un componente cliente que revela
  la casa terminada al deslizar.
- `/donar` muestra el render de la casa por fases, con las cifras en vivo.
- Los logos del placeholder suben a 64/80 px en escritorio y 40/48 en celular.
- La cortina usa `/audio/cortina.mp3` (36 s) en loop, con botón de reproducción
  en `/admin/cortina` y duración visible.

- La vista previa de cortinas ahora es un reproductor por cortina: play/pause
  individual, barra de control, duración y ecualizador animado. Una sola suena.
- Título de la cortina más grande y logos reducidos (48/60 escritorio, 32/40
  celular) para recuperar jerarquía.
- El render de la casa en donaciones hace un fundido con zoom al cambiar de fase.
- PENDIENTE 3D: generar un GLB (TRELLIS de Microsoft, Meshy, Spline o Blender) e
  integrarlo con un visor Three.js; hoy la transición es 2D por fases.

- Nuevo simulador en `/admin/casa`: barra y botones 0-100% para probar el
  fundido del render sin tocar el recaudo real. Enlace en el panel.

- Panel con sidebar y breadcrumbs en todas las vistas internas (donaciones,
  recorrido, cortinas, casa).
- Nueva vista `/admin/donaciones`: lista de aportes con datos del donante,
  filtro, CSV y registro manual que suma al recaudo. Los pagos de Wompi
  aparecerán solos cuando el webhook confirme.
- Atribución solo con enlace de afiliado `/ref/codigo`; se retiró la interfaz de
  UTM y se reinició el contador de visitas.
- El home muestra "Pon tu pieza" con el mismo layout de piezas del sitio
  original. El Plan Padrino mensual sigue bloqueado y pendiente.

- Corregido "Elige la pieza" del home: se eliminaron los estilos propios que
  rompían el layout y quedó exactamente el grid original de Sebastián
  (auto-fill de 230px, icono a la izquierda, badge y estado amarillo).
- Recordatorios del live: formulario "Avísame cuando empiece" en `/envivo`,
  tabla `reminders` en Neon, panel en `/admin/recordatorios` con lista, CSV y
  envío por Resend. Requiere `RESEND_API_KEY` y dominio verificado para enviar.

- El pie de todas las páginas cierra con "Apoya a SVG" enlazado a
  svgvisual.com, junto a "Evento producido por Kavanah". Se eliminaron las
  líneas de crédito duplicadas en `/donar` y `/donar/gracias`.

- Header público unificado (`components/public/SiteHeader.tsx`) en campaña,
  maratón, donaciones, gracias y legales: topbar fucsia con el aviso y el
  caption de Kavanah, header lima con el logo del elefante sin tarjeta blanca,
  navegación (La campaña / Maratón 48 horas), botón Donar y acceso al panel.
- Cuando la transmisión está en vivo, el header muestra una píldora "En vivo"
  animada que enlaza a `/envivo` desde cualquier pantalla. Para revisarla en
  local: `NEXT_PUBLIC_HEADER_LIVE=1`.

- Header público con cuenta regresiva real ("Empezamos en vivo en 1 día y 18 h"),
  que cambia sola a "Estamos en vivo" y muestra la píldora animada al llegar la
  hora. La navegación usa botones con el estilo de la landing y sin cambio de
  estilo entre páginas; "La campaña" pasó a "Conoce La Supercasa".
- En celular el header se reduce a logo, píldora de en vivo y menú hamburguesa.
  El menú es pantalla completa con accesos grandes, detalle del evento y los
  logos de la Fundación y Kavanah en el pie.
- La campaña incluye un mini visor del live (solo cuando está en vivo) con CTA
  grande a `/envivo`. Para revisarlo en local hay que compilar con
  `NEXT_PUBLIC_HEADER_LIVE=1`.

- El topbar, el header y el menú usan siempre la tipografía y los colores de la
  landing de la transmisión (Plus Jakarta Sans, texto #334155, botones blancos y
  Donar fucsia), sin heredar la tipografía Baloo 2 de la campaña. Se ve igual en
  `/` y en `/envivo`.
- En el menú móvil el logo de Kavanah usa la versión blanca del elefante y se
  dimensiona por ancho para no deformarse.

- Cuando la maratón está al aire, el home reemplaza la imagen de la casa en el
  hero por un visor EN VIVO con CTA a `/envivo`. Se retiró la tarjeta suelta que
  estaba más abajo.
- El topbar se limita a 1000 px y se centra igual en todo el sitio. El chrome
  define su propio `--ink` para que los bordes y sombras de los botones no
  desaparezcan en las páginas que no usan los tokens de la campaña.
- Nueva ruta de administración `/admin/preview-home`: muestra el home en estado
  en vivo dentro de un marco, con selector de escritorio y celular. Usa
  `/?preview=live` y no altera el estado real del sitio.

- Un solo pie en todo el sitio (`components/public/SiteFooter.tsx`): organizadores,
  hashtags, línea de la Fundación, enlaces legales, tesorería y crédito con
  "Apoya a SVG". Se usa en home, maratón, donaciones, gracias y legales.
- Las redes de la Fundación y de Kavanah salieron del pie y viven dentro de la
  página (`SocialSection`), en el home y en donaciones.

- Video promo en el hero, reemplazando la imagen de la casa: 720p para
  escritorio (8.3 MB) y 540p para celular (5.5 MB), póster JPG y subtítulos
  WebVTT en español. Arranca silenciado por la política de autoplay, con botón
  "Activar sonido", captions visibles y pausa fuera de pantalla.
- En `/envivo`, la pantalla de espera tiene "Mira de qué se trata · 1:35" que
  reproduce el promo con sonido dentro del mismo marco.
- El logo del header es el oficial (`logo-fsv-official.png`) a 38 px, 34 px y
  30 px. Se quitó la versión anterior `logo-fsv.png`.
- El caption de organizadores del hero se eliminó porque repetía el topbar.
- La columna derecha del hero quedó alineada con la etiqueta MISIÓN SUPERCASA:
  se quitó el `position: sticky` que la desplazaba 51 px.

- Los subtítulos del video son propios: píldora fucsia, texto blanco, tipografía
  Plus Jakarta Sans y sin depender del render nativo (el track queda oculto y se
  leen los cues con cuechange).
- El hero tiene un botón central "Activar sonido" con estilo 3D y pulso, además
  del botón de ampliar que abre el video en un modal con controles nativos.
- En `/envivo` el promo es una sección grande entre el visor y el bloque de
  donaciones, con póster, duración y CTA "Ver el video". Abre el mismo modal.
- El modal muestra los subtítulos debajo del video para no tapar la imagen,
  pausa el video del hero y garantiza una sola reproducción con audio.
- Todos los botones del sitio usan la tipografía del header (Plus Jakarta Sans).

- La tarjeta del promo en `/envivo` reproduce sola, silenciada y en loop, con
  subtítulos encima para invitar a abrirla. Usa la versión de 540p para no cargar
  el archivo grande. Al abrir el modal se pausa, y al cerrarlo se reanuda.

- El header y el menú móvil tienen "Avísame", que lleva a `/envivo#avisame`.
- El formulario de donación permite dejar el correo en la lista de recordatorios;
  el aporte se guarda y se inserta en `reminders` con origen `donacion`.
- El panel de campañas tiene botones rápidos de código, incluido `SDV`.
- Nuevo `HANDOFF/PENDIENTES.md` con enlace SDV, CRM, diseño de correos, flujo de
  inscripción y notificaciones durante la transmisión.
