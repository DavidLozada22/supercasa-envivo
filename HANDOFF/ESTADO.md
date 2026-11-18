# Estado

Actualizado: 18 de noviembre de 2026.

## Hecho

- Landing migrada a Next.js con el diseño original.
- Reproductor de YouTube enmascarado con controles propios.
- QR en el bloque de streaming hacia `/donar`.
- Página `/donar` con formulario Wompi y opciones de transferencia.
- Página `/donar/gracias` con estado del aporte.
- API de donaciones: crear, consultar, webhook de Wompi, progreso.
- Panel `/admin` con transmisión, recaudo, campaña y Meta Ads.
- Cuatro usuarios del panel con hash scrypt.
- Verificación de dominio de Meta en el head.
- Blob privado conectado en Vercel y variables cargadas.
- Workflow de despliegue con token de la cuenta dueña.

## Pendiente

- Llaves de Wompi del entorno de producción. Sin ellas el pago en línea queda
  apagado en producción.
- `DATABASE_URL` de Supabase para persistir donaciones y recaudo en línea.
- Pixel de Meta (el meta tag entregado es de verificación de dominio).
- ID del video del directo en el panel para activar los controles.
- Plan Padrino (cobro mensual) y panel de donaciones dentro de `/admin`.
- Pruebas de extremo a extremo con las llaves reales de Wompi.

## Riesgos conocidos

- Sin Postgres, las donaciones viven en memoria y se pierden entre instancias.
- El modo simulado está bloqueado en producción, a propósito.
- Las previews de Vercel piden autenticación; el dominio de producción no.

## Responsables

- Wompi: Juan (acceso de desarrollador pendiente).
- Repositorio y cuenta Vercel: David Lozada.
- Contenido y campaña: Kavanah.
