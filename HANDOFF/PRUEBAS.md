# Pruebas

## Documentos legales

- `node --test tests/legal-pages.test.mjs` comprueba las rutas y el aviso de borrador.
- Pendiente: revisión legal del contenido y confirmación de las referencias a
  transparencia, Plan Padrino y contacto de tesorería.

## Flujo del donante

1. Abrir `/donar` en celular y en escritorio.
2. Elegir cada pieza y "Otro monto".
3. Probar correo inválido, consentimiento sin marcar y monto menor al mínimo.
4. Pagar con tarjeta aprobada, rechazada y pago abandonado.
5. Verificar `/donar/gracias`: aprobado, pendiente y rechazado.
6. Confirmar que el recaudo de `/api/live` sube solo cuando el pago se aprueba.
7. Escanear el QR del live con otro celular y llegar a `/donar`.

## Flujo del panel

Usuarios en `HANDOFF/PANEL-ACCESOS.md`.

| Prueba | nelson | flor | sebas | david |
| --- | --- | --- | --- | --- |
| Login y logout | | | | |
| Ver las cuatro secciones | | | | |
| Guardar transmisión | | | | |
| Guardar recaudo | | | | |
| Guardar campaña | | | | |
| Ver métricas de Meta | | | | |

Hoy los cuatro son administradores. Para probar un rol de solo lectura hay que
crear la entrada con `scripts/hash-password.mjs` y rol `editor`, y luego aplicar
la restricción en el servidor (pendiente).

## Seguridad

- Sesión caduca a las 12 horas.
- Clave incorrecta no revela si el usuario existe.
- La clave de transmisión no aparece en `/api/live` ni en el HTML público.
- El webhook rechaza firmas inválidas con 401.
- La simulación de pagos está bloqueada en producción.

## Dispositivos

- iPhone Safari y Android Chrome.
- Escritorio 1440 y 1920.
- OBS con la fuente de navegador apuntando a `/`.
- Conexión lenta: el live y el QR deben cargar sin bloquear el resto.

## Registro

Anotar hallazgos en `ESTADO.md` o abrir un issue. Un cambio cerrado se refleja
aquí y en `ESTADO.md`.

- 50 comprobaciones en `tests/` (node --test).
- Revisado en 1280 y 390 px: header, menú móvil y mini visor sin desbordamiento.
- Cuenta regresiva verificada en local: muestra horas restantes y no muestra la
  píldora ni el visor antes del inicio.

## Evento 48 horas

- `node --test tests/live-resolver.test.mjs` cubre sin clave, directo vigente,
  corte con ID nuevo, sin directo, cuota agotada, error de red y caché.
- `node --test tests/stream-fallback.test.mjs` comprueba el panel protegido, las
  cortinas y la fuente de OBS.
- Manual: entrar con cada usuario y confirmar el nombre en el panel.
- Manual: abrir `/admin/streaming`, descargar un PNG y copiar una URL de OBS.
- Manual: publicar "Ya volvemos" y verla en `/pantalla/onair`.
- Manual: simular un corte y ver el cambio del video en `/envivo` sin recargar.
- Manual: enviar una prueba de Resend y revisar la bandeja.
- Manual: abrir `/admin/programa` y confirmar el bloque y el segmento.
- Manual: revisar la franja de avisos y el formulario en un celular real.

## Segunda ronda de cortinas y panel

- `node --test tests/event-tools.test.mjs` cubre las 55 escenas, la mosca, el
  fondo/marco de live, el chatbot, los 19 recordatorios, los dos caminos de
  donación, el correo de agradecimiento y el mapa del panel.
- Manual: abrir `/admin` y confirmar que el sidebar y el mapa muestran todas las
  herramientas sin entrar a "Herramientas".
- Manual: abrir `/admin/recordatorios` y confirmar los tres grupos de mensajes y
  el botón de confirmación.
- Manual: abrir `/admin/streaming` en las pestañas Cuentas regresivas, La casa y
  Pantallas y overlays.
- Manual: abrir `/donar` y recorrer los dos caminos. Probar el botón de
  comprobante por WhatsApp.
- Manual: abrir `/envivo`, revisar el contador sobre el reproductor y el bloque
  grande de horas debajo.
- Manual: abrir el chatbot en home, `/envivo` y `/donar`; probar una pregunta,
  una respuesta sin coincidencia y el formulario de avisos.
- Manual: publicar `mosca`, `donacion` y `marco-live` en `/pantalla/onair`.
- Manual: simular una donación aprobada y confirmar el correo de agradecimiento
  y la fila nueva en recordatorios.

## Mini visor y placeholders

- Manual: abrir `/donar` antes del evento y confirmar la tarjeta de "Ya viene".
- Manual: abrir `/donar?preview=live`, probar "Pantalla completa", cerrar con
  Escape y confirmar que el video se detiene.
- Manual: hacer scroll en `/donar` y confirmar la píldora "EN VIVO · Ver".
- Manual: abrir `/admin/streaming` en Pantallas y overlays y revisar el tablero
  de transparencia, las etiquetas y el aviso de PNG pendiente.

## Estudio, finanzas y móvil

- `node --test tests/studio-finance.test.mjs` cubre roles, recaudo manual,
  acceso rápido móvil y el editor del Estudio.
- Manual: entrar como ana y confirmar que solo ve Estudio, Programa,
  Recordatorios y Avisos. Editar un creative, guardar, recargar y descargar PNG.
- Manual: entrar como lina y confirmar que cae en Recaudo y solo ve Recaudo.
  Agregar un aporte de $1.000, editarlo, borrarlo y ver el total.
- Manual: como admin, abrir `/admin/estudio`, editar una cortina, guardar y
  abrir `/pantalla/<id>` para ver el cambio.
- Manual: en celular, usar la barra inferior, entrar a un módulo y abrir "Más".
- Manual: confirmar que el PNG de una cortina editada se descarga a 1920x1080 y
  que el overlay sale transparente.
- Manual: abrir un carrusel, cambiar el titular del slide 2 sin guardar y
  descargar "Descargar slide". El PNG debe traer el texto nuevo.
- Manual: sin guardar, pulsar "Descargar carrusel (ZIP)". Debe bajar un ZIP con
  cinco PNG numerados y `caption.txt` con el caption editado.
- Manual: filtrar por "Capas PNG" y abrir una. El preview debe mostrar el fondo
  a cuadros y el PNG descargado debe tener el centro transparente.
- Manual: recorrer las pestañas Cortinas y Overlays OBS y confirmar que suman
  55 piezas entre las dos.

## OBS, moscas y QR grande

- Abrir `/admin/streaming`, entrar a Cortinas y pulsar Editar. El editor debe
  abrir encima de Streaming, la URL no debe cambiar y al cerrar debe volver a la
  misma pestaña con los botones OBS, PNG y Ver.
- Repetir desde Overlays y desde Básicas.
- Abrir `/admin/estudio?tab=cortinas` y pulsar Editar. El editor debe abrir y
  cerrar dentro del Studio.
- En Streaming, pestaña Básicas, confirmar Ya regresamos, Empezamos en 1, 5, 15,
  20, 30 y 60 minutos, Ajuste técnico, Ya viene, Estamos en un bloque y
  Personalizada.
- Abrir Personalizada, cambiar título, subtítulo y línea corta, y guardar. Debe
  aparecer en `/pantalla/personalizada`.
- En Studio, confirmar que cada tarjeta de Marketing, Cortinas y Overlays tiene
  Editar, PNG, OBS y Ver. En celular deben quedar en dos filas de dos.
- En una cortina, pulsar PNG y confirmar la descarga. Pulsar Ver y abrir
  `/pantalla/<id>`.
- En marketing, pulsar PNG y confirmar que descarga el slide 1 con el QR del vivo.
  Pulsar Ver y abrir `/pantalla/creativo/<id>?slide=1`.

- Abrir `/admin/estudio?tab=cortinas` y confirmar que cada tarjeta tiene OBS.
  Copiar una, abrirla en una pestaña y ver que el título y el QR salen iguales.
- Repetir en Overlays y en Marketing. En Marketing, el OBS debe abrir
  `/pantalla/creativo/<id>?slide=N` con la pieza completa y el QR del vivo.
- Abrir el editor de un material de marketing, cambiar un texto, guardar y
  copiar OBS. La pieza debe reflejar el cambio.
- Abrir el editor de una cortina, cambiar un texto sin guardar y pulsar OBS. El
  link copiado debe llevar el texto nuevo en la URL.
- Abrir `/admin/streaming?tab=presets`. Filtrar "Moscas", copiar la de un invitado
  y comprobar que `/pantalla/lower-third` abre con el nombre y el cargo.
- Probar un "Ya viene" y un "Estamos en". Deben abrir con el título del segmento.
- Verificar `/pantalla/casa`, `/pantalla/empezamos-1` y `/pantalla/bloque-01`:
  el QR debe verse grande y ningún texto debe quedar tapado.
- Verificar `/pantalla/donaciones`: un solo QR grande a la derecha, sin QR en el
  pie.
- En marketing, abrir una pieza de la categoría Donar y confirmar que el QR
  arranca en Donaciones. Abrir una pieza normal y confirmar que arranca en
  Transmisión.
- Cuando llegue el minuto a minuto nuevo, importarlo con
  `python3 scripts/import-escaleta.py "/ruta/archivo.xlsx"` y confirmar que los
  bloques y la lista de moscas cambian sin tocar código.

## Programa V6 y página pública

- Importar con:
  `python3 scripts/import-escaleta.py "/ruta/Escaleta 48H La Supercasa V6.xlsx"`
  Deben salir 12 bloques, 508 segmentos y 32 en vivo.
- Generar el Excel con `npm run programa:excel`. El archivo queda en
  `public/programa/programa-48h.xlsx`.
- Abrir `/programa` en celular. La barra de "Ahora" debe quedar fija, el segmento
  actual resaltado y el botón "Ahora" debe volver a él.
- Confirmar `curl -I /programa` con `X-Robots-Tag: noindex, nofollow` y que
  `/robots.txt` tenga `Disallow: /programa`.
- Descargar el Excel desde el botón y abrir las tres hojas.
- En Streaming, pestaña En control, marcar un segmento como actual. Recargar
  `/programa` y confirmar que la barra dice "En vivo según el equipo".
- Volver a "Automático" y confirmar que la barra dice "Según cronograma".
- En Moscas y agenda, ajustar el nombre y el cargo de una mosca, copiar el link y
  abrir `/pantalla/lower-third` con los valores nuevos.

## Flujo de donación y textos

- Abrir `/donar` antes del evento. El botón del bloque de transmisión debe decir
  "Ir a la transmisión".
- Abrir el modal de la transmisión en vivo (cuando haya señal) y confirmar el
  mismo texto.
- Iniciar una donación, pasar por datos y confirmar que el botón dice "Ver resumen
  y pagar".
- Después del pago, en `/donar/gracias`, "Volver a la transmisión" debe abrir
  `/envivo` y no el inicio.
- Buscar "envío" en las rutas públicas. Solo deben quedar los textos de envío de
  correos y comprobantes.

## Editor completo del Estudio

- Abrir `/admin/estudio?tab=cortinas&scene=casa`. Cambiar el título y ver que el
  preview cambia al escribir. Pasar a "Porcentaje fijo", elegir 75% y confirmar
  que la casa cambia a la imagen de 75% y el badge dice 75%.
- En la misma escena, cambiar el destino del QR a "Transmisión" y verificar que el
  QR, la URL y el llamado cambian en el preview.
- Abrir el bloque "Datos de campaña", cambiar Bre-B y confirmar que las tarjetas
  de cortinas debajo muestran el texto nuevo antes de guardar.
- Abrir `/admin/estudio?tab=overlays&scene=meta`. Cambiar antetítulo y llamado, y
  confirmar que la barra los muestra. Probar "Recaudo real" y "Porcentaje fijo".
- Abrir `/admin/estudio?tab=overlays&scene=donacion`. Editar título, texto de
  apoyo, Bre-B y banco; confirmar el preview y el PNG transparente.
- En marketing, abrir una historia, activar "Mostrar" en "Avance de la obra",
  elegir 75% y ver la barra y las etiquetas del preview.
- En un carrusel, editar una fila de agenda o un nivel de donación y confirmar
  que el slide abierto cambia.
- Confirmar que las tarjetas de marketing muestran la gráfica completa, incluida
  la capa PNG con checkerboard.
- En celular, abrir el editor de una cortina. El preview debe quedar dentro del
  ancho de la pantalla y el formulario debe poder desplazarse.

## Verificación en producción

- Login de lina: rol finance y redirección a `/admin/recaudo`.
- Login de ana y sandeivid: rol marketing y redirección a `/admin/estudio`.
- Login de salvaje: rol admin y entrada a `/admin`.
- Lina no entra a Estudio ni Streaming. Ana y Sandeivid no entran a Recaudo ni
  Streaming. Las APIs devuelven 403 en el cruce de roles.
- Recaudo de producción: alta de $1.000, edición a $2.000 y borrado. Totales
  correctos y vuelta a $0.
- Estudio de producción: 88 de 88 creatives y el editor abre.
- PNG de cortina editada verificado en producción: 1920x1080 y contenido completo.

## Wompi produccion

- Verificar que `/donar` muestre el formulario en línea y no el aviso de "Wompi
  en activación".
- Verificar que los botones de comprobante apunten a `wa.me/573175658064`.
- Hacer una donación real mínima de $1.000 con tarjeta. Confirmar:
  - La pantalla de gracias.
  - El correo de agradecimiento de Resend.
  - La fila de Wompi en `/admin/recaudo`.
  - Que el total del sitio suba.
- Revisar en el dashboard de Wompi que el webhook apunte a
  `https://supercasa.svgvisual.com/api/wompi/webhook`.

## Dashboard en móvil

- Entrar a `/admin` como admin en 390 px. Debe abrir en Inicio con el mapa de
  accesos en dos columnas.
- Tocar Transmisión, Meta, Calendario o Campañas. El mapa debe desaparecer y
  solo debe quedar la sección elegida.
- Volver a Inicio. El mapa debe reaparecer.
- Abrir "Más" en la barra inferior. Debe mostrar todos los módulos agrupados y
  el activo resaltado.
