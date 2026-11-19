# Decisiones

## 1. Migrar a Next.js en vez de mantener HTML plano

El sitio necesitaba panel, API y pagos. Un `index.html` no sostiene eso. Se portó
el diseño tal cual a componentes y el CSS se conservó con alcance `.landing-root`
para que no interfiera con el panel.

## 2. Enmascarar YouTube como en Fauna Tickets

Se reutilizó el patrón de `FAUNA TICKETS/components/LivePlayer.tsx`: IFrame API
con `controls: 0`, `modestbranding`, `iv_load_policy: 3`, máscaras sobre el
título y el logo, y controles propios. Se añadió una capa que bloquea los clics
hacia YouTube. El ID del video se configura en el panel.

## 3. QR hacia una página interna, no hacia el portal externo

El QR apunta a `/donar`, no directo a Wompi ni a un link de pago. Razones: un solo
QR para toda la campaña, contenido editable sin reimprimir, y métricas propias.
El QR se genera en el servidor con el host de la petición.

## 4. Usuarios en variable de entorno, no en base de datos

Cuatro usuarios con hash scrypt en `ADMIN_USERS`. Evita una tabla de usuarios y
un panel de administración de cuentas antes del lanzamiento. Para agregar a
alguien: `scripts/hash-password.mjs` y actualizar la variable en Vercel.

## 5. Configuración del panel en Blob

Los enlaces, montos y la campaña cambian durante la transmisión. Guardarlos en
Blob privado permite editarlos sin redeploy. La clave de transmisión nunca sale
al cliente: el endpoint público arma una vista sin secretos.

## 6. Portar donaciones en vez de incrustar el sitio de Sebastián

Su proyecto es Astro con su propio despliegue y su propia base. Mantenerlo aparte
duplicaba dominio, analítica y mantenimiento. Se portaron el catálogo de piezas,
el cálculo de montos, la firma de integridad, el webhook y la vista de recaudo.
Quedaron fuera, por ahora, Plan Padrino y el panel de donaciones.

## 7. Modo simulado solo fuera de producción

Sin llaves de Wompi el flujo se puede probar en preview y en local. En producción
sin llaves el formulario rechaza el pago con un mensaje y deja las alternativas
de transferencia. Así nadie infla el recaudo con pagos simulados.

## 8. Recaudo total = manual + en línea

El campo "Monto recaudado" del panel es la base manual (aportes fuera de línea).
La API suma las donaciones aprobadas de Postgres. Si no hay base, solo cuenta la
base manual.

## 9. Verificación de dominio de Meta, no pixel

El meta tag entregado es `facebook-domain-verification`, que se inyecta en el
`<head>`. No es un pixel. El pixel sigue pendiente.

## 10. El sistema visual de Sebastián es el canónico

Su sitio tiene el logo real, Baloo 2, los calvitos originales con tags, la casa
por fases y una jerarquía más fuerte. Se adoptó completo como sitio público.
La landing anterior se retiró. El live y el QR se revistieron con su sistema,
no al revés.

Su código fuente quedó vendorizado en `legacy/segundosdevida/` como referencia
viva. El HTML y CSS compilados se extrajeron a `components/campaign/` y
`app/campaign.css`, con las secciones dinámicas reemplazadas por componentes
nuestros.

## 11. El aportante cubre la comisión de Wompi

Wompi cobra 2,65% + $700 + IVA por transacción. `lib/donations/pricing.ts`
calcula el bruto para que a la Fundación le llegue la pieza exacta. El formulario
muestra el desglose y cobra el total.

## 12. Fechas separadas

La campaña de donaciones cierra el 30 de noviembre. El evento en vivo va del
viernes 20 a las 6:00 p. m. al domingo 22 a las 6:00 p. m. El reproductor tiene
tres estados: antes, en vivo y después.

## 13. El home es el sitio de campaña y el live tiene URL propia

El home vuelve a ser el de Sebastián, con su hero y la casa. El streaming vive en
`/envivo`, que es el enlace que se publica en redes. Una franja delgada sobre el
hero avisa del live y lleva a esa página. Así la portada conserva la narrativa y
el evento tiene una URL limpia para compartir.

`/donar` deja de ser un formulario plano y pasa a un wizard de 3 pasos: pieza,
datos, confirmación. El QR apunta ahí.
