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
| `PROGRAM_EDITORS` | Producción, Preview | Usuarios que pueden editar el programa. Por defecto `lio` |
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

Estado al 21 de noviembre de 2026: la URL quedó configurada en el comercio de
producción `FUNDACION SEGUNDOS DE VIDA` (id 592603) con
`PATCH /v1/merchants/592603` y `events_url`. Antes estaba en `null`, por eso
los pagos se quedaban en pendiente: Wompi no enviaba ningún evento.

Para confirmarlo sin abrir el panel:

```
GET https://production.wompi.co/v1/merchants
Authorization: Bearer <llave privada de producción>
```

El campo `events_url` debe devolver la URL del webhook.

Si el webhook vuelve a fallar, el sitio no se queda esperando. `/api/donations/<ref>`
consulta Wompi por referencia cuando el aporte sigue pendiente, así que la página
de gracias y el recaudo se actualizan solos. `reconcilePending()` en
`lib/donations/service.ts` revisa los pendientes de los últimos catorce días.

Regla de cierre: si a las seis horas una referencia no tiene ninguna transacción
en Wompi, se marca `voided` con el mensaje "Sin transacción en Wompi: intento
abandonado". Nunca se cerró un pago real: si existe transacción, aunque sea
PENDING, se aplica su estado.

### Métodos de pago habilitados

`GET /v1/merchants` devuelve `accepted_payment_methods`. Hoy son solo
`BANCOLOMBIA_TRANSFER` y `CARD`. El `PATCH` del comercio acepta `events_url`
pero ignora `accepted_payment_methods`, así que Nequi, PSE, Daviplata o Bre-B se
piden en el panel de Wompi o a soporte. Si el comercio los habilita, el widget
los muestra sin tocar el código.

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

El WhatsApp de comprobantes sale de `NEXT_PUBLIC_DONATION_WHATSAPP`. Está
cargado como `573175658064` en producción y preview. Si no está definido, el
código usa el mismo número como respaldo.

## Wompi producción

Variables cargadas solo en producción desde
`KAVANAH/WOMPI SEGUNDOS DE VIDA`:

- `WOMPI_PUBLIC_KEY`
- `WOMPI_PRIVATE_KEY`
- `WOMPI_INTEGRITY_SECRET`
- `WOMPI_EVENTS_SECRET`

Preview queda en modo simulado. La URL del webhook en el dashboard de Wompi debe
ser `https://supercasa.svgvisual.com/api/wompi/webhook` y el secreto de eventos
debe ser el mismo que está en Vercel. La vuelta a `/donar/gracias` también
consulta la transacción con la llave privada, así que confirma aunque el webhook
tarde.

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


## Usuarios y roles del panel

`ADMIN_USERS` tiene nueve entradas:

- salvaje, vikingo, sebas, sebascapi, flor y lio: admin.
- lina: finance.
- ana y sandeivid: marketing.

Claves de ana y sandeivid: `ana_supercasa` y `sandeivid_supercasa`. El resto
conserva sus claves. El rol se resuelve por usuario desde `ADMIN_USERS`, sin
cambiar la cookie. Se actualizó la variable en producción y preview con el token
de Vercel; hay que volver a desplegar para que la tome.

## Estudio de contenido

El Estudio usa `html-to-image` para exportar cortinas y overlays a PNG. Los
creatives usan el exportador canvas que ya venía con el prototipo. Los estados se
guardan en Blob:

- `supercasa/marketing.json`
- `supercasa/streaming-content.json`
- `supercasa/program.json`

El repositorio público `nelsonSVG/estudiomarketing` solo tenía el README. La
versión completa de 88 creatives está en la carpeta local
`GOOGLE AI STUDIO ESTUDIO MARKETING ` y ya fue copiada a `lib/marketing` y
`components/admin/marketing`.

## Rutas internas y assets de OBS

- `/programa` y `/respuestas` son públicas, no piden sesión y responden con
  `X-Robots-Tag: noindex, nofollow` y `Cache-Control: no-store`. Están fuera del
  sitemap y `robots.txt` las bloquea.
- `/admin/programa` es la versión del panel. Si un usuario sin permiso o bloqueado
  entra, se le manda a `/programa`. Sin sesión, va al login.
- `/api/program/now` es lectura pública. La escritura vive en
  `/api/admin/program/now` y requiere rol admin o editor.
- `assets/obs` es una carpeta del repositorio, no del sitio. Contiene la música y
  los PNG organizados para OBS. Para OBS se usan las URL públicas de
  `/cortinas/<id>.png`, `/pantalla/<id>` y `/audio/<archivo>.mp3`.
- Las tres pistas nuevas están en `public/audio` y se sirven desde el dominio.
- `npm run obs:assets` regenera `assets/obs` y su manifiesto.
