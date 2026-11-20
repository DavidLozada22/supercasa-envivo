# Instrucciones para agentes

## Antes de tocar código

Lee `HANDOFF/README.md` y sigue su orden de lectura. No explores todo el
codebase para reconstruir contexto: el handoff existe para eso.

## Al terminar cualquier cambio

Actualiza el handoff en el mismo commit:

- `HANDOFF/ESTADO.md`: qué quedó hecho, qué falta, qué se rompió.
- `HANDOFF/DECISIONES.md`: cualquier decisión de arquitectura o producto.
- `HANDOFF/DESPLIEGUE.md`: variables, dominio o flujo de despliegue.
- `HANDOFF/PRUEBAS.md`: pruebas nuevas o pendientes.

Un cambio sin handoff actualizado está incompleto.

## Reglas del proyecto

- No usar emojis en la interfaz. Iconos de Lucide.
- No usar em dashes en textos.
- No imprimir secretos. Usar `vault.sh` de forma ciega.
- El crédito de SVG va en el pie de cada página.
- El despliegue va por GitHub Actions con token, nunca por integración Git.

## Assets para OBS

Antes de configurar escenas, lee `assets/obs/README.md` y `assets/obs/manifest.json`.
Ahí están la música, las cortinas y los overlays con nombres exactos, sin necesidad
de leer el codebase.

- Toda la música va en loop. No usar one-shot ni cortar el final.
- En OBS, la fuente de medios debe tener `Loop` activo y no reiniciarse al cambiar
  de escena.
- Las cortinas de pantalla completa son 1920x1080.
- Los overlays son PNG con transparencia.
- Para textos dinámicos usa `https://supercasa.svgvisual.com/pantalla/<id>`.
- No renombrar ni editar los archivos de `assets/obs`.
- Si cambian las cortinas o la música, corre `npm run obs:assets`.

## Stack

Next.js 16, React 19, Tailwind 4, Vercel Blob, Postgres y Wompi.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
