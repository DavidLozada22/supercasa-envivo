# Assets para OBS

Esta carpeta reúne lo necesario para configurar las escenas de La Supercasa sin leer el codebase.

- `manifest.json`: lista completa de escenas, categorías, nombres exactos, PNG y URL de OBS.
- `music/`: música de la transmisión. Toda va en loop.
- `cortinas/`: PNG de pantalla completa, organizados por categoría.
- `overlays/`: PNG con transparencia, organizados por tipo.

Repositorio: `https://github.com/DavidLozada22/supercasa-envivo`
Producción: `https://supercasa.svgvisual.com`

## Regla principal: música en loop

Las cuatro pistas están pensadas para repetirse. No las cortes ni las uses como one-shot.

En OBS:

1. Agrega una fuente de medios llamada `Música de fondo`.
2. Elige el archivo o la URL.
3. Activa `Loop`.
4. Desactiva `Restart playback when source becomes active` para que la música siga sonando al cambiar de escena.
5. Ponla en una pista de audio separada, por ejemplo la pista 2.
6. Baja el volumen entre -20 dB y -14 dB mientras hay voz. Usa un limitador si hace falta.

En otras plataformas: usa la opción de repetición o `loop` del reproductor. No dejes que la pista termine en silencio.

## Música disponible

| Archivo | Rol | Duración | Mood | URL pública |
| --- | --- | --- | --- | --- |
| `cortina.mp3` | Actual | 36 s | Cortina de espera | https://supercasa.svgvisual.com/audio/cortina.mp3 |
| `kornevmusic-upbeat-happy-corporate-487426.mp3` | Opción 1 | 2:02 | Corporativa, alegre y optimista | https://supercasa.svgvisual.com/audio/kornevmusic-upbeat-happy-corporate-487426.mp3 |
| `nastelbom-corporate-606705.mp3` | Opción 2 | 2:29 | Corporativa y cálida | https://supercasa.svgvisual.com/audio/nastelbom-corporate-606705.mp3 |
| `atlasaudio-corporate-business-635581.mp3` | Opción 3 | 3:03 | Corporativa y motivadora | https://supercasa.svgvisual.com/audio/atlasaudio-corporate-business-635581.mp3 |

Los archivos también están en `assets/obs/music/` con el nombre exacto. Las URL públicas salen de `public/audio/`.

## Cortinas de pantalla completa

Archivos en `assets/obs/cortinas/`:

| Carpeta | Qué contiene |
| --- | --- |
| `01-cuentas-regresivas` | Empezamos en 1, 5, 15, 20, 30 y 60 minutos |
| `02-horas` | Horas 2, 5, 10, 24, 30 y 32 |
| `03-casa` | Casa en vivo y fases 00, 25, 50, 75 y 100 |
| `04-bloques` | Bloques 01 a 12 |
| `05-cierre` | Casi terminamos, gracias y gracias por donaciones |
| `06-basicas` | Ya regresamos, ajuste técnico, ya viene, estamos en un bloque y personalizada |
| `07-generales` | Aliados, cocina, creadores, donaciones, historias, invitado, legal, música y reto |

Cada PNG conserva el nombre exacto de la escena, por ejemplo `bloque-01.png`.

En OBS tienes dos caminos:

- **Fuente de imagen**: `https://supercasa.svgvisual.com/cortinas/<id>.png`. Es la versión base, sin cambios guardados.
- **Fuente de navegador**: `https://supercasa.svgvisual.com/pantalla/<id>`, tamaño 1920x1080. Es la recomendada porque muestra los textos guardados en el panel y se actualiza al refrescar.

## Overlays

Archivos en `assets/obs/overlays/`:

| Carpeta | Escena |
| --- | --- |
| `01-lower-third` | Nombre y cargo del invitado |
| `02-meta` | Barra de la meta |
| `03-reloj` | Contador de 48 horas |
| `04-en-vivo` | Insignia en vivo |
| `05-donacion` | Overlay de donación con QR |
| `06-en-vivo-qr` | En vivo con QR |
| `07-mosca` | Mosca de horas |
| `08-fondo-live` | Fondo para live pequeño |
| `09-marco-live` | Marco para live pequeño |

Los overlays son PNG con transparencia. En OBS usa una fuente de navegador de 1920x1080 con el fondo transparente, o una fuente de imagen si no necesitas textos dinámicos.

Para el lower third con un invitado específico, la URL puede llevar el nombre y el cargo:

```text
https://supercasa.svgvisual.com/pantalla/lower-third?guest=Vikingo&guestRole=Conducción
```

La lista de moscas ya generadas está en el panel `/admin/streaming?tab=presets` y en `/programa`.

## Manifest

`manifest.json` tiene un objeto por escena con:

- `id`
- `label`
- `kind`: `full` u `overlay`
- `category`
- `file`: ruta exacta dentro del repositorio
- `pngUrl`
- `obsUrl`
- `transparent`
- `use`
- `notes`

Los campos `music` tienen `file`, `path`, `publicUrl`, `loop` y `note`.

## Regenerar

Si cambian las cortinas o la música:

```bash
npm run cortinas
npm run obs:assets
```

`npm run obs:assets` vuelve a copiar los PNG y la música, y regenera `manifest.json`.

## Notas

- No edites los PNG a mano. Los textos se cambian en el panel y se descargan o se sirven por `/pantalla`.
- Verifica la licencia de cada pista antes de publicarla en redes. Estas pistas son para la transmisión interna.
- El crédito de SVG va en el pie de las páginas del sitio, no en los PNG de OBS.
