# Contexto del proyecto

## Qué es

Sitio de la campaña **Súper Navidad: 48 Horas por La Supercasa** de la Fundación
Segundos de Vida. Recauda fondos para terminar el albergue de los Súper Calvitos
en Bogotá. Meta de referencia: $250.000.000 COP.

## Superficies

| Ruta | Para quién | Qué hace |
| --- | --- | --- |
| `/` | Audiencia | Home de Sebastián con el live enmascarado y el QR en el hero |
| `/donar` | Donantes | Flujo de donación estilo campaña, comisión cubierta y transferencias |
| `/donar/gracias` | Donantes | Estado del aporte en tiempo real |
| `/admin` | Producción | Transmisión, recaudo, campaña y Meta Ads |
| `/admin/login` | Producción | Acceso por usuario y clave |

## Stack

- Next.js 16 con App Router y React 19.
- Tailwind CSS 4 en el panel y en el formulario de donación.
- CSS propio de la landing en `app/landing.css`, con alcance `.landing-root`.
- Vercel Blob privado para la configuración editable del panel.
- Postgres (Supabase) para donaciones cuando exista `DATABASE_URL`.
- Wompi Widget Checkout para pagos en línea.
- Meta Marketing API para métricas de pauta.

## Estructura

```
app/                  rutas, API y estilos globales
components/landing/   landing, reproductor enmascarado, QR
components/donations/ formulario Wompi y página de gracias
components/admin/     panel de producción
lib/                  configuración, sesión, usuarios, Meta, donaciones
supabase/migrations/  esquema de donaciones
scripts/              utilidades (hash de claves)
HANDOFF/              este contexto
legacy/segundosdevida fuente original de Sebastián, solo referencia
```

## Origen

La landing venía en un `index.html` plano con Firebase. Se migró a Next.js en la
rama `feat/nextjs-panel-produccion` (PR 1). El sistema de donaciones se rescató
del proyecto de Sebastián, `juans2704-svg/SegundosdeVida` (Astro + Postgres +
Wompi), y se portó el núcleo al mismo despliegue.

## Dominio

Producción: `https://supercasa.svgvisual.com`
Proyecto Vercel: `supercasa-envivo` (team de David Lozada)
