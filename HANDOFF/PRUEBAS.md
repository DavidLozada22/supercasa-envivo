# Pruebas

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
