# Operación del evento 48 horas

Actualizado: 19 de noviembre de 2026.

## Enlaces

| Qué | Dónde |
| --- | --- |
| Canal de YouTube | https://www.youtube.com/@KavanahPL35 |
| Sitio del live | https://supercasa.svgvisual.com/envivo |
| Panel | https://supercasa.svgvisual.com/admin |
| Cortinas y control de OBS | https://supercasa.svgvisual.com/admin/streaming |
| Programa interno | https://supercasa.svgvisual.com/admin/programa |
| Avisos por correo | https://supercasa.svgvisual.com/admin/avisos |
| Donaciones | https://supercasa.svgvisual.com/donar |

## Roles

- **Vikingo**: señal, OBS, cortes de 12 horas, creación de cada broadcast y audio.
- **Nelson**: panel, enlaces, cortinas, avisos y soporte técnico.
- **Sebas**: conducción principal y bloques de apertura, gala y cierre.
- **Flor, Lina y Lio**: apoyo en programa, avisos, chat y producción.

Cada persona tiene su usuario y clave en el panel. Las claves se comparten por
privado, no en grupos públicos.

## Los 12 bloques

Cada bloque dura 4 horas. Tres bloques forman un broadcast de 12 horas.

| Bloque | Día | Hora | Nombre | Conduce | Cortina |
| --- | --- | --- | --- | --- | --- |
| 01 | Día 1 | 18:00 a 22:00 | El Gran Inicio | Sebas | `bloque-01.png` |
| 02 | Día 1 y 2 | 22:00 a 02:00 | Noche de Desafíos y Risas Sin Filtro | Vikingo | `bloque-02.png` |
| 03 | Día 2 | 02:00 a 06:00 | Desvelo Paranormal | Luz Gardenia y Libardo | `bloque-03.png` |
| 04 | Día 2 | 06:00 a 10:00 | Mañanero con Fe y Café | Cris | `bloque-04.png` |
| 05 | Día 2 | 10:00 a 14:00 | Copa de Campeones | Vikingo | `bloque-05.png` |
| 06 | Día 2 | 14:00 a 18:00 | El Festival de Talentos Kavanah | Paola | `bloque-06.png` |
| 07 | Día 2 | 18:00 a 22:00 | La Gran Gala de los Sueños | Sebas | `bloque-07.png` |
| 08 | Día 2 y 3 | 22:00 a 02:00 | Retro Arcade y Noche de Leyendas | Vikingo | `bloque-08.png` |
| 09 | Día 3 | 02:00 a 06:00 | Maratón Extrema: Reto Speedrun | Libardo | `bloque-09.png` |
| 10 | Día 3 | 06:00 a 10:00 | Despertar Solidario | Cris y Luz Gardenia | `bloque-10.png` |
| 11 | Día 3 | 10:00 a 14:00 | El Desafío de Creadores | Paola | `bloque-11.png` |
| 12 | Día 3 | 14:00 a 18:00 | El Gran Cierre | Sebas | `bloque-12.png` |

Los bloques ancla para avisos y pauta son el 01, el 05, el 07 y el 12.

Los cortes de YouTube caen a las 06:00 y a las 18:00, justo entre bloques. Eso
ayuda: el corte técnico se disfraza con el cambio de bloque.

## Cortinas

Hay 33 piezas en 1920x1080:

- 17 cortinas generales: arranque, ya volvemos, ajuste técnico, ya viene,
  estamos en, donaciones, invitado, cocina, música, historias, legal, creadores,
  casa, reto, aliados, gracias.
- 12 cortinas de bloque, una por cada bloque de la escaleta.
- 4 overlays con fondo transparente: lower third, barra de la meta, contador de
  48 horas y marco de "en vivo".

Cada tarjeta del panel tiene tres salidas:

1. **PNG**: se descarga y se arrastra a OBS. Es la vía principal de Vikingo.
2. **OBS**: copia una URL para usarla como fuente de navegador.
3. **Ver**: abre la cortina a pantalla completa para revisarla.

Las cortinas con texto editable (ya viene, invitado, ya volvemos, entre otras) se
ajustan desde **En control** y salen por la fuente única de OBS.

## Montaje de OBS

1. Crear la escena **Cortinas**.
2. Agregar una fuente de navegador llamada **Cortina en vivo**:
   - URL: la que copia el panel en **En control**.
   - Ancho 1920, alto 1080.
   - Desactivar "Apagar la fuente cuando no sea visible".
   - Activar "Actualizar el navegador cuando la escena se active".
3. Agregar una escena **Cortina PNG** con las piezas descargadas, como respaldo
   si falla el navegador.
4. Para los overlays, agregar fuentes de navegador encima del video:
   - Lower third: 1920x1080, fondo transparente.
   - Barra de la meta: se actualiza sola cada 20 segundos.
   - Contador 48 horas: se actualiza solo cada segundo.
   - Marco en vivo: esquina superior derecha.
5. Audio: la música de la cortina va por una fuente de audio separada, no por el
   navegador, para que no se corte al cambiar de escena.

## Protocolo de corte de 12 horas

Ocurre a las 06:00 y a las 18:00, o antes si YouTube cierra el broadcast.

1. Poner **Ajuste técnico** en el aire.
2. En YouTube Studio, terminar el broadcast anterior si quedó abierto y crear o
   iniciar el nuevo.
3. En OBS, detener la transmisión y volver a iniciarla hacia el nuevo evento.
4. Abrir **Streaming > Conexiones** y pulsar **Comprobar ahora**.
5. Verificar que el ID nuevo aparece. El sitio lo toma solo. No hay que tocar el
   enlace de la página.
6. Poner **Ya volvemos** y, cuando todo esté estable, la cortina del bloque.

Tiempo objetivo: 90 segundos.

## Cambio de bloque

1. Un minuto antes, poner la cortina del bloque que entra.
2. Al iniciar, publicar **Estamos en** con el nombre del bloque o dejar el video.
3. Si el bloque es ancla, enviar el aviso desde **Programa > Avisar a inscritos**.

## Avisos por correo

Solo se escribe a quienes dejaron el correo en la página del live y aceptaron el
consentimiento. A un espectador que nunca se inscribió no se le puede escribir.
Por eso el live tiene el botón "Recibe un aviso cuando empiece cada bloque", que
lleva al formulario.

Cadencia recomendada:

| Momento | Asunto | Objetivo |
| --- | --- | --- |
| 24 h antes | La maratón empieza mañana | Calentar la audiencia |
| 1 h antes | La maratón empieza en 1 hora | Llenar el arranque |
| Bloque 01 | Estamos en vivo | Empujar el primer bloque |
| Sábado 10:00 | Ya viene la Copa de Campeones | Bloque gamer |
| Sábado 18:00 | La Gran Gala empieza | Prime time |
| Domingo 10:00 | Ya viene el Desafío de Creadores | Último día |
| Domingo 16:00 | Última hora: vamos por el 100% | Cierre de meta |
| Domingo 18:30 | Gracias por acompañar La Supercasa | Agradecimiento |

No conviene enviar un correo por cada bloque: doce correos en 48 horas cansan y
bajan la entregabilidad. Los bloques 01, 05, 07 y 12 son suficientes. Los demás
se anuncian en el live y en redes.

El panel **Avisos** arma el correo, muestra la vista previa, pide confirmación y
envía en lotes de 100 con una pausa de un segundo entre lotes. Guarda un
historial con enviados y fallidos.

## Programa interno

La escaleta vive en `lib/program/` y se ve en **Programa**. No es pública.

Muestra el bloque en curso, el segmento al aire, lo que viene, los 280 segmentos
con hora calculada y un aviso cuando las duraciones suman más de 240 minutos.

Para actualizarla cuando llegue la versión nueva del Excel:

```bash
python3 scripts/import-escaleta.py "ruta/al/Excel.xlsx"
git add lib/program
git commit -m "Actualiza la escaleta del evento"
git push
```

El importador convierte "Deivid" y "David" en "Vikingo" para el panel.

## Contingencias

- **Se cae el internet**: el sitio muestra la cortina. OBS reconecta al mismo
  broadcast cuando vuelve la red. El enlace del sitio no cambia.
- **YouTube cierra el broadcast**: se crea uno nuevo y el sitio lo detecta en
  menos de un minuto. Mientras tanto se ve la cortina.
- **Falla la API de YouTube**: el panel muestra ámbar. El sitio conserva el
  último ID y la cortina cubre el hueco. Las cortinas en PNG siguen disponibles.
- **No abre el panel**: los PNG se descargan directo desde
  `https://supercasa.svgvisual.com/cortinas/<id>.png`.
- **Rebota un correo**: Resend lo reporta. El live no depende del correo.

## Lista de chequeo

Antes del evento:

- [ ] El canal de YouTube está público y el directo de prueba se ve en el sitio.
- [ ] El panel abre con los seis usuarios.
- [ ] Las 33 cortinas están descargadas en el computador de OBS.
- [ ] La fuente **Cortina en vivo** está configurada y cambia al publicar.
- [ ] El QR de donaciones apunta a `/donar`.
- [ ] Resend está verificado y se envió una prueba.
- [ ] El programa interno muestra el Bloque 01 como el primero.

Una hora antes:

- [ ] Probar un corte simulado desde **Streaming > Conexiones**.
- [ ] Confirmar audio, micrófonos y respaldo de internet.
- [ ] Enviar el aviso de "1 hora antes" si hay inscritos.

Cada 4 horas:

- [ ] Publicar la cortina del bloque entrante.
- [ ] Revisar el estado de YouTube en **Conexiones**.
- [ ] Enviar el aviso si el bloque es ancla.

Al cierre:

- [ ] Publicar la cortina de gracias.
- [ ] Enviar el correo de agradecimiento.
- [ ] Archivar el historial de avisos.

## Lo que es automático y lo que no

Automático: detección del directo, cambio del video en el sitio, barra de la
meta, contador, historial de cambios y prueba de conexión.

Manual: crear cada broadcast de 12 horas, reiniciar la transmisión en OBS,
elegir la cortina, aprobar cada correo y decidir los momentos de aviso.

El corte de 12 horas no se puede evitar por API. Lo que se elimina es la
actualización manual del enlace en la página.
