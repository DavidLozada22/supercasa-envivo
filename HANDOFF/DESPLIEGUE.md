# Despliegue

Las rutas legales recuperadas no requieren variables ni cambios de despliegue.

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
| `YOUTUBE_API_KEY` | Producción, Preview | Detección del directo |
| `YOUTUBE_CHANNEL_ID` | Producción, Preview | Canal `UCrdNxBU4cfR0rEHY1OO9tQQ` |
| `RESEND_API_KEY` | Producción, Preview | Envío de avisos |
| `RESEND_FROM` | Producción, Preview | Remitente verificado |
| `NEXT_PUBLIC_DONATION_WHATSAPP` | Opcional | WhatsApp para comprobantes y ayuda |

## Resend

- Dominio verificado: `supercasa.svgvisual.com`.
- Remitente: `La Supercasa <hola@supercasa.svgvisual.com>`.
- Registros en Vercel DNS: DKIM en `resend._domainkey`, MX y SPF en `send`,
  CNAME en `rsend`.
- La clave vive en Vercel y en KeePass, entrada
  `KAVANAH/RESEND SUPERCASA KAVANAH`.

## Usuarios del panel

`ADMIN_USERS` tiene seis entradas: salvaje, vikingo, sebas, flor, lina y lio.
Las claves se entregan por privado y no se escriben en este archivo.

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

## Cortinas

Los PNG quedan en `/cortinas/<id>.png` y se regeneran con:

```bash
npm run cortinas
```

Requiere el servidor en `localhost:3100` y Chrome instalado. El script también
crea `public/cortinas/cortinas-supercasa.zip` con las 55 piezas.

El fondo y el marco para live pequeño usan el video en 1280x720 en la posición
80 x 180. El panel derecho mide 560 px.

El WhatsApp de comprobantes sale de `NEXT_PUBLIC_DONATION_WHATSAPP`. Si no está
definido, usa el teléfono público de la Fundación `573165246087`.

Sin llaves de Wompi, `/donar` prioriza la transferencia, muestra el aviso de
"Wompi en activación" y ofrece Bre-B o Bancolombia como camino principal.
Cuando se carguen las llaves, el formulario vuelve a quedar primero sin cambiar
el código.

## Secretos

- Panel: `HANDOFF/PANEL-ACCESOS.md` (ignorado por git).
- Vercel: KeePassXC, `KAVANAH/VERCEL TOKEN DAVID LOZADA`.
- Nunca imprimir un secreto en el chat ni en un commit.

## Fechas de la campaña

- Donaciones abiertas hasta el 30 de noviembre de 2026.
- Evento en vivo: viernes 20 de noviembre, 6:00 p. m., a domingo 22, 6:00 p. m.
- El reproductor cambia de estado según esas fechas. `NEXT_PUBLIC_LIVE_PREVIEW=1`
  fuerza el estado en vivo solo en local.
