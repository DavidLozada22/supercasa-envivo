# Handoff · Supercasa en vivo

Punto de entrada para cualquier agente o persona que llegue al proyecto. Lee esto
antes de abrir el código. Al terminar cada cambio, actualiza los archivos de esta
carpeta. Es parte del trabajo, no un extra.

## Orden de lectura

1. `CONTEXTO.md`: qué es el proyecto, dónde vive y cómo está armado.
2. `ESTADO.md`: qué está hecho, qué falta y qué está roto.
3. `DECISIONES.md`: por qué está construido así.
4. `DESPLIEGUE.md`: Vercel, dominio, variables y secretos.
5. `PRUEBAS.md`: qué probar y con qué usuarios.
6. `EVENTO-48H.md`: operación del evento, cortinas, cortes y avisos.
7. `../assets/obs/README.md`: música, cortinas y overlays para OBS, con nombres
   exactos y `manifest.json` para configurar escenas sin leer el código.

## Reglas de la carpeta

- No guardar secretos aquí. Las claves viven en `HANDOFF/PANEL-ACCESOS.md`,
  ignorado por git, y en KeePassXC.
- Un cambio de arquitectura se anota en `DECISIONES.md` el mismo día.
- Un pendiente nuevo entra en `ESTADO.md` con su responsable si lo hay.
- Los datos de negocio (montos, metas, fechas) no se copian aquí: viven en el
  panel de producción.
