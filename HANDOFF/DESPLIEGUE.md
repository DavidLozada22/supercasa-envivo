# Despliegue

## Vercel

- Proyecto: `supercasa-envivo`
- Team: `davidlozada22s-projects` (`team_8DOr5cSxa6pvpsgAlkIlUvfu`)
- Project ID: `prj_LZcglUGwf5Dvrxh71n7QQJ0S2RNP`
- Dominio de producción: `https://supercasa.svgvisual.com`

## Flujo

`.github/workflows/deploy.yml` despliega en cada push:

- `main` va a producción.
- Cualquier otra rama va a preview.
- Usa `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` como secretos de
  GitHub.
- Borra `.git` antes de desplegar para que Vercel no rechace la autoría.

`vercel.json` tiene `git.deploymentEnabled: false` para que la integración Git de
Vercel no duplique despliegues ni bloquee envíos.

## Variables en Vercel

| Variable | Dónde | Para qué |
| --- | --- | --- |
| `ADMIN_USERS` | Producción, Preview | Usuarios del panel con salt y hash |
| `ADMIN_SESSION_SECRET` | Producción, Preview | Firma de la cookie de sesión |
| `BLOB_READ_WRITE_TOKEN` | Producción, Preview | Configuración del panel |
| `DATABASE_URL` | Producción | Donaciones en Postgres |
| `WOMPI_PUBLIC_KEY` | Producción | Widget de Wompi |
| `WOMPI_PRIVATE_KEY` | Producción | API de Wompi |
| `WOMPI_INTEGRITY_SECRET` | Producción | Firma de cada cobro |
| `WOMPI_EVENTS_SECRET` | Producción | Verificación del webhook |
| `META_ACCESS_TOKEN` | Producción | Métricas de Meta Ads |

## Wompi

En el panel de Wompi, la URL de eventos debe ser:

```
https://supercasa.svgvisual.com/api/wompi/webhook
```

El redirect del widget vuelve a `/donar/gracias?ref=...`.

## Protección de despliegues

El team tiene Vercel Authentication activa para previews y para dominios
`.vercel.app`. Los dominios personalizados no la piden, por eso producción se
prueba en `supercasa.svgvisual.com`.

## Secretos

- Panel: `HANDOFF/PANEL-ACCESOS.md` (ignorado por git).
- Vercel: KeePassXC, `KAVANAH/VERCEL TOKEN DAVID LOZADA`.
- Nunca imprimir un secreto en el chat ni en un commit.

## Fechas de la campaña

- Donaciones abiertas hasta el 30 de noviembre de 2026.
- Evento en vivo: viernes 20 de noviembre, 6:00 p. m., a domingo 22, 6:00 p. m.
- El reproductor cambia de estado según esas fechas. `NEXT_PUBLIC_LIVE_PREVIEW=1`
  fuerza el estado en vivo solo en local.
