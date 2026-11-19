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
