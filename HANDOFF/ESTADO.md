# Estado

Actualizado: 18 de noviembre de 2026, noche.

## Hecho

- Sitio público basado en el diseño de Sebastián: header, hero, calvitos, casa,
  historia, obra, transparencia, empresas, footer y legales.
- Live enmascarado y QR integrados en el hero, con estados antes, en vivo y después.
- `/donar` con flujo propio: piezas, datos, consentimiento, comisión de Wompi
  cubierta por el aportante y transferencias Bre-B / Bancolombia.
- `/donar/gracias` con estado en vivo del aporte y compartir por WhatsApp.
- Aliados (TerraFerme, HivraTech, ServImagenes, Intesi) visibles en el footer.
- Redes de la Fundación y de Producción Kavanah separadas.
- Motor de donaciones con Wompi: firma, webhook, progreso y simulación fuera de producción.
- CTA fijo de donación en celular.
- Fuente original de Sebastián vendorizada en `legacy/segundosdevida/`.

## Pendiente

- Cargar las llaves de Wompi en Vercel (test y producción).
- Crear la base Neon y cargar `DATABASE_URL`.
- Descarga del QR en PNG desde `/admin` para OBS.
- Conectar el pixel de Meta (el meta tag actual es de verificación de dominio).
- Plan Padrino (mensual) y Carnet de Héroe.
- Revisar el sitio en celular real y ajustar el hero (el live queda angosto en 375px).
- Definir el ID del video del directo en el panel.

## Notas

- Los emojis del copy original de Sebastián se conservaron por decisión del
  cliente. La regla general del proyecto los evita; aquí manda el diseño de campaña.
- El modo simulado solo funciona fuera de producción.
- La rama de trabajo es `feat/campaign-visual-merge`; producción sigue con la
  versión anterior hasta que se apruebe.
