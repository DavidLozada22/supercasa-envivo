# Supercasa en vivo

Sitio de la maratón **Súper Navidad: 48 Horas por la Supercasa** de la Fundación
Segundos de Vida, con panel de producción para transmisión, recaudo y campaña.

## Stack

- Next.js 16 (App Router) y React 19
- Tailwind CSS 4 para el panel
- Vercel Blob para persistir la configuración en producción
- Meta Marketing API para las métricas de pauta

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

La landing queda en `/` y el panel en `/admin`. En desarrollo, si
`ADMIN_PASSWORD` no está definida, la clave es `supercasa2026`.

La configuración se guarda en `.data/config.json` cuando no hay Blob conectado.

## Panel de producción

Cuatro secciones:

1. **Transmisión**: enlace del directo y de respaldo, más servidor RTMP y clave
   para OBS. La clave es privada: nunca se envía al sitio público.
2. **Recaudo**: monto recaudado, meta y avance. La landing consulta `/api/live`
   cada cinco segundos.
3. **Campaña**: nombre, hashtags y ventana de la maratón.
4. **Meta Ads**: pixel, cuenta publicitaria y métricas de los últimos 30 días.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `ADMIN_PASSWORD` | Clave del panel. Obligatoria en producción. |
| `ADMIN_SESSION_SECRET` | Firma de la cookie de sesión. |
| `BLOB_READ_WRITE_TOKEN` | Almacenamiento de la configuración. Se conecta desde Vercel Marketplace. |
| `META_ACCESS_TOKEN` | Token de la Marketing API para leer métricas. |

## Despliegue

El workflow `.github/workflows/deploy.yml` despliega con el token de la cuenta
dueña del proyecto. Requiere tres secretos en GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

`vercel.json` desactiva la integración Git (`deploymentEnabled: false`) para que
Vercel no intente desplegar por su cuenta ni bloquee los envíos.

Antes del primer despliegue hay que crear un Blob store en el proyecto de Vercel
y cargar `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` y `META_ACCESS_TOKEN` en las
variables de entorno de producción.

## Estructura

```
app/                 rutas, API y estilos
components/landing/  landing convertida desde el HTML original
components/admin/    panel de producción
lib/                 configuración, almacenamiento, sesión y Meta
public/              personajes del escuadrón
```
