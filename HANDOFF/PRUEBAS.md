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
