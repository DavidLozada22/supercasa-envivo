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

## Stack

Next.js 16, React 19, Tailwind 4, Vercel Blob, Postgres y Wompi.
