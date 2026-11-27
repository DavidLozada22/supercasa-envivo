# Decisiones

## Documentos legales recuperados

Se conserva el texto de `legacy/segundosdevida` sin actualizar sus afirmaciones.
Ambas páginas lo identifican como borrador pendiente de revisión legal.

## 1. Migrar a Next.js en vez de mantener HTML plano

El sitio necesitaba panel, API y pagos. Un `index.html` no sostiene eso. Se portó
el diseño tal cual a componentes y el CSS se conservó con alcance `.landing-root`
para que no interfiera con el panel.

## 2. Enmascarar YouTube como en Fauna Tickets

Se reutilizó el patrón de `FAUNA TICKETS/components/LivePlayer.tsx`: IFrame API
con `controls: 0`, `modestbranding`, `iv_load_policy: 3`, máscaras sobre el
título y el logo, y controles propios. Se añadió una capa que bloquea los clics
hacia YouTube. El ID del video se configura en el panel.

## 3. QR hacia una página interna, no hacia el portal externo

El QR apunta a `/donar`, no directo a Wompi ni a un link de pago. Razones: un solo
QR para toda la campaña, contenido editable sin reimprimir, y métricas propias.
El QR se genera en el servidor con el host de la petición.

## 4. Usuarios en variable de entorno, no en base de datos

Cuatro usuarios con hash scrypt en `ADMIN_USERS`. Evita una tabla de usuarios y
un panel de administración de cuentas antes del lanzamiento. Para agregar a
alguien: `scripts/hash-password.mjs` y actualizar la variable en Vercel.

## 5. Configuración del panel en Blob

Los enlaces, montos y la campaña cambian durante la transmisión. Guardarlos en
Blob privado permite editarlos sin redeploy. La clave de transmisión nunca sale
al cliente: el endpoint público arma una vista sin secretos.

## 6. Portar donaciones en vez de incrustar el sitio de Sebastián

Su proyecto es Astro con su propio despliegue y su propia base. Mantenerlo aparte
duplicaba dominio, analítica y mantenimiento. Se portaron el catálogo de piezas,
el cálculo de montos, la firma de integridad, el webhook y la vista de recaudo.
Quedaron fuera, por ahora, Plan Padrino y el panel de donaciones.

## 7. Modo simulado solo fuera de producción

Sin llaves de Wompi el flujo se puede probar en preview y en local. En producción
sin llaves el formulario rechaza el pago con un mensaje y deja las alternativas
de transferencia. Así nadie infla el recaudo con pagos simulados.

## 8. Recaudo total = manual + en línea

El campo "Monto recaudado" del panel es la base manual (aportes fuera de línea).
La API suma las donaciones aprobadas de Postgres. Si no hay base, solo cuenta la
base manual.

## 8b. La confirmación del pago no depende solo del webhook

Wompi no reintenta eventos. Si la URL de eventos está vacía o responde error, el
pago se cobra y la donación queda pendiente para siempre. Por eso hay tres
capas:

1. Webhook firmado en `/api/wompi/webhook` (camino principal).
2. Consulta por referencia en `/api/donations/<ref>` cuando el aporte sigue
   pendiente. La página de gracias se corrige sola.
3. Cron diario `/api/cron/reconcile` que barre los pendientes de catorce días.

La conciliación solo aplica el estado que Wompi ya reporta, así que repetirla no
infla el recaudo. El webhook sigue siendo la vía rápida; las otras dos son la red
de seguridad.

## 9. Verificación de dominio de Meta, no pixel

El meta tag entregado es `facebook-domain-verification`, que se inyecta en el
`<head>`. No es un pixel. El pixel sigue pendiente.

## 10. El sistema visual de Sebastián es el canónico

Su sitio tiene el logo real, Baloo 2, los calvitos originales con tags, la casa
por fases y una jerarquía más fuerte. Se adoptó completo como sitio público.
La landing anterior se retiró. El live y el QR se revistieron con su sistema,
no al revés.

Su código fuente quedó vendorizado en `legacy/segundosdevida/` como referencia
viva. El HTML y CSS compilados se extrajeron a `components/campaign/` y
`app/campaign.css`, con las secciones dinámicas reemplazadas por componentes
nuestros.

## 11. El aportante cubre la comisión de Wompi

Wompi cobra 2,65% + $700 + IVA por transacción. `lib/donations/pricing.ts`
calcula el bruto para que a la Fundación le llegue la pieza exacta. El formulario
muestra el desglose y cobra el total.

## 12. Fechas separadas

La campaña de donaciones cierra el 30 de noviembre. El evento en vivo va del
viernes 20 a las 6:00 p. m. al domingo 22 a las 6:00 p. m. El reproductor tiene
tres estados: antes, en vivo y después.

## 13. El home es el sitio de campaña y el live tiene URL propia

El home vuelve a ser el de Sebastián, con su hero y la casa. El streaming vive en
`/envivo`, que es el enlace que se publica en redes. Una franja delgada sobre el
hero avisa del live y lleva a esa página. Así la portada conserva la narrativa y
el evento tiene una URL limpia para compartir.

`/donar` deja de ser un formulario plano y pasa a un wizard de 3 pasos: pieza,
datos, confirmación. El QR apunta ahí.

## 14. La maratón conserva su landing original

`/envivo` no se rediseñó. Se parte de la landing publicada: header fucsia, hero
con los Calvitos flotantes, stream grande, QR, aliados, patrocinadores y redes.
Solo se cambió el logo del header, se añadió el acceso a «La campaña», se
sustituyeron las capturas por el arte original de Sebastián con sus etiquetas en
texto y se reemplazó el dibujo de la casa por su render por fases con las cifras
en vivo.

El crédito de SVG se retiró por pedido explícito del cliente en este proyecto.
Queda «Evento producido por Kavanah».

## 15. Un solo sistema de donaciones

El único flujo activo es `/donar` en Next, con el formulario original de
Sebastián y su lógica de creación de aportes, webhook y progreso. La aplicación
Astro de `legacy/segundosdevida/` queda como referencia de código, no como
sistema activo. Se retiraron los enlaces públicos al portal externo de
donaciones para que todo aporte pase por el mismo flujo.

Pendiente para paridad total: Plan Padrino mensual, carnet, confirmación manual
de aportes y exportación CSV del panel.

## 16. Un solo header público

Prevalece el header de la landing de la transmisión (fondo lima, logo del
elefante sin marco, topbar fucsia). La campaña y las demás páginas lo reutilizan
para no duplicar navegación. El aviso de la maratón vive en el topbar y, cuando
hay live, se suma una píldora animada "En vivo" en el header.

## 17. Un solo navegador de OBS para las cortinas

Las cortinas se generan como PNG de 1920x1080 para que Vikingo las arrastre a
OBS, y además se publican como páginas que pueden usarse como fuente de
navegador. La fuente única `/pantalla/onair` toma la escena activa del panel y
la cambia cada dos segundos. Así se evita configurar una fuente por cortina.

Los overlays van con fondo transparente. La barra de la meta y el contador se
actualizan solos con datos del sitio.

## 18. YouTube con API key, no OAuth

El canal es público, así que la API key basta para leer el directo. OAuth solo
haría falta para directos no listados o para administrar broadcasts, y agrega
verificación de Google y tokens que caducan. La API key vive en Vercel y nunca
se imprime.

El resolutor comprueba primero el último ID con `videos.list` (1 unidad) y solo
busca con `search.list` (100 unidades) cuando el anterior terminó. El resultado
se cachea 25 segundos para proteger la cuota.

## 19. El programa interno no es público

La escaleta se importa a `lib/program/` y se renderiza solo en `/admin/programa`.
No hay ruta pública ni datos de negocio expuestos. Para actualizarla se corre
`scripts/import-escaleta.py` y se despliega.

## 20. Avisos solo con consentimiento y aprobación humana

Los correos salen únicamente de la tabla `reminders` con `consent = true`. No se
usan correos de donantes ni se compran listas. Cada envío se aprueba en el panel
y se registra en un historial. El envío va por lotes de 100 con pausa de un
segundo para respetar el límite de Resend.


## 21. La cortina es una pieza de marca, no un cartel

Las 55 cortinas comparten una retícula de 1920x1080 con logos directos, título
grande, calvito 3D y una franja de donación. El número de bloque es el elemento
principal. La donación no se esconde en el pie: aparece en todas las piezas y en
todos los overlays.

## 22. El live pequeño va en 1280x720

El fondo y el marco dejan un área de 1280x720 en la posición 80 x 180. El panel
derecho ocupa 560 px y lleva QR, Bre-B, cuenta, avance y redes. Así el operador
puede poner el video pequeño sin calcular medidas.

## 23. Chatbot con guion, no con IA generativa

El chatbot responde desde `lib/chat/knowledge.ts`. No inventa cuentas, precios ni
horarios, no cuesta por mensaje y funciona sin depender de una API externa el día
del evento. Si no encuentra la respuesta, ofrece WhatsApp. La captura de nombre y
correo entra a la misma tabla de recordatorios.

## 24. Dos caminos de donación y comprobante por WhatsApp

`/donar` muestra desde el inicio dos caminos: Wompi y transferencia directa. La
transferencia explica los tres pasos y ofrece un botón para enviar el
comprobante. El número sale de `NEXT_PUBLIC_DONATION_WHATSAPP` y usa como
respaldo el teléfono público de la Fundación.

## 25. El donante también recibe avisos

Cuando Wompi aprueba una donación, se envía un agradecimiento por Resend con la
casa, un calvito y los logos, y el correo se inscribe en `reminders` con
`source = 'donacion'`. Un webhook repetido no vuelve a enviar el correo porque
solo se dispara en la transición a aprobado.

## 26. Recordatorios listos, envío manual

El panel de recordatorios trae 19 mensajes por momento. No se programan solos: se
revisan y se confirman para no enviar un aviso equivocado en pleno live. Los
envíos quedan en el historial y se pueden exportar los inscritos en CSV.

## 27. Navegación del panel por grupos

El sidebar agrupa Producción, Recaudo y casa, y Sitio. El inicio muestra un mapa
con todas las herramientas. Se eliminó la duplicación del sidebar del dashboard y
los enlaces viejos a `/admin/cortina`.


## 28. El rol financiero vive en Recaudo

Lina no entra a streaming, marketing ni programa. Entra a `/admin/recaudo`, donde
suma Bre-B y Bancolombia a mano, ve lo de Wompi y corrige o borra sus registros.
Los aportes manuales se guardan como donaciones aprobadas, así que el total del
sitio y la barra de la casa se actualizan solos.

## 29. El Estudio es un solo lugar

Marketing, cortinas y overlays comparten `/admin/estudio`. Tocar una tarjeta abre
un editor con preview, textos y descarga. Los creatives se guardan por slide; las
escenas se guardan como overrides en Blob. El PNG descargable de una escena se
genera en el navegador con `html-to-image`, a 1920x1080 y con fondo transparente
en overlays.

## 30. El acceso móvil no se esconde

La barra inferior muestra cuatro módulos y el botón "Más". Si el módulo activo no
está entre los cuatro, entra en la barra y sale el último. El botón "Más" abre
todos los grupos. Ya no hay que recorrer una fila horizontal larga para llegar a
la pantalla actual.

## 31. El Estudio muestra y edita la pieza real

Cada control del editor escribe en un campo que la escena o el creativo realmente
renderiza. Los campos que no aplican a una pieza no se muestran. Las tarjetas usan
el mismo componente que el editor, escalado y cargado solo al entrar en pantalla,
para que el thumbnail sea la gráfica completa y refleje lo guardado.

El avance se puede tomar del recaudo real o fijar con un porcentaje. El QR de las
escenas se genera en `/api/qr` desde la URL de campaña, así que cambiar entre
donaciones y transmisión cambia también la imagen del QR. Los datos que se repiten
(URLs, Bre-B, banco, hashtag, Instagram) viven en un solo bloque y se aplican a
todas las cortinas y overlays.

## 32. El minuto a minuto genera los links de OBS

Los bloques, las moscas y los "Ya viene" se construyen desde
`lib/program/blocks.json` y `lib/program/segments.json`. La pestaña "Moscas y
agenda" entrega links listos para OBS con el nombre, el cargo y el segmento en la
URL. Si se actualiza la escaleta, se vuelve a importar y la lista se regenera; no
hay que escribir nombres a mano.

El QR del pie de las cortinas mide 200 px para que se lea desde lejos. Los
materiales de marketing usan el QR del vivo por defecto, salvo la categoría Donar,
porque esas piezas ya están dentro del flujo de donación. Las cortinas y overlays
usan el QR de donaciones por defecto.

## 33. Todo material tiene link de OBS

Las cortinas y overlays copian su URL de `/pantalla/<id>` con los textos y ajustes
actuales. Los materiales de marketing tienen una ruta propia,
`/pantalla/creativo/<id>?slide=N`, que renderiza la pieza completa a su tamaño para
usarla como fuente de navegador. El botón OBS vive en la tarjeta y en el editor de
los tres tipos de material, no solo en el panel de Streaming.

En marketing el link usa el estado guardado. Por eso el editor avisa que hay que
guardar antes de copiar si se quieren llevar los últimos cambios.

## 34. Editar sin salir del panel

El editor de escenas se abre en una capa encima de Streaming y usa el contenido
que ya cargó la página. Al cerrar, se desmonta y la pestaña de Streaming sigue
donde estaba. El Studio usa el mismo componente sin la capa incrustada, así que
cada contexto conserva su navegación y sus botones.

Las pantallas de transición viven en la pestaña Básicas. "Personalizada" es la
válvula de escape para mensajes que no tienen una cortina propia. Los filtros del
Studio mantienen las cuentas regresivas en su categoría y agregan Básicas como
vista aparte.

## 35. El programa público es una sola fuente

`lib/program/blocks.json` y `segments.json` alimentan las cortinas de bloque, las
moscas, la página `/programa` y el Excel. La página es pública pero no indexada,
con `X-Robots-Tag` y `Disallow` en robots. El botón "Vamos aquí" del panel guarda
el segmento actual para que la página siga la realidad cuando el reloj se corre.

El Excel se genera limpio desde los mismos JSON, no se entrega el archivo original
con hojas internas. La página está pensada para celular y WhatsApp, con barra fija
de "Ahora" y búsqueda por invitado o segmento.

## 36. "Envío" no es sinónimo de transmisión

En el flujo de donación, todo lo que lleva a la señal se llama "transmisión" o
"en vivo". "Envío" queda reservado para correos y comprobantes. Las etiquetas y
los destinos se revisan juntos: "Volver a la transmisión" abre `/envivo` y "Ver
resumen y pagar" lleva al paso de confirmación, no a una pantalla inesperada.

## 37. Respuestas y mensajes para el equipo

`/respuestas` es un panel público pero no indexado, con el mismo criterio que
`/programa`. No requiere sesión porque lo usa gente que no entra al panel. Las
respuestas viven en `lib/answers/presets.ts` y están escritas para copiar y pegar,
con los enlaces ya incluidos. Los mensajes para redes salen del mismo archivo y
evitan depender de WhatsApp Web o de una cuenta compartida.

La página no carga Meta Pixel ni atribución, y el link se comparte solo por dentro
del equipo.

## 38. Los assets de OBS viven en el repositorio

`assets/obs` es la carpeta de entrega para cualquier agente que configure OBS. No
depende de leer el codebase: tiene los PNG por categoría, la música y un
`manifest.json` con nombres exactos y URLs de producción.

La música siempre va en loop. La pista actual y las tres opciones nuevas están
tanto en `assets/obs/music` como en `public/audio`, para que se puedan usar por
URL. El PNG es la versión base; para textos dinámicos se usa
`/pantalla/<id>`. Los archivos no se renombran.

`npm run obs:assets` reconstruye la carpeta y el manifiesto. Git guarda los blobs
una sola vez aunque el mismo PNG exista en `public/cortinas` y en `assets/obs`.

## 39. El programa se edita en el panel

El JSON de la escaleta sigue siendo la base versionada, pero el cliente edita una
copia en `supercasa/program.json` desde `/admin/programa/editar`. El servidor
normaliza fechas, horas, duraciones, IDs y conteos antes de guardar.

La página pública, las moscas, el Excel y las cortinas de bloque leen ese estado.
El botón "Sincronizar agenda" actualiza las filas del carrusel de agenda de
marketing. Los PNG de OBS siguen siendo la versión base hasta que se regeneren con
`npm run cortinas` y `npm run obs:assets`.

## 40. Solo Lio edita el programa

El programa 48H lo modifica una sola persona. La variable `PROGRAM_EDITORS`
acepta una lista de usuarios separada por comas y su valor por defecto es `lio`.
No es un rol nuevo: Lio conserva su rol admin y los demás usuarios ven el
programa en modo lectura, con el Excel disponible.

La regla se aplica en el servidor, no solo en la interfaz. `/admin/programa/editar`
redirige a `/admin/programa` a quien no esté en la lista, y las rutas
`/api/admin/program` y `/api/admin/program/sync-agenda` responden 403. Para sumar
a otra persona basta con agregar su usuario a `PROGRAM_EDITORS` en Vercel.

## 41. Marcas de hecho y orden manual

Cada segmento tiene una casilla `done`. Se guarda al instante con
`/api/admin/program/check`, sin esperar al botón de guardar, para que Lio pueda
marcar el programa mientras ocurre. El Excel agrega la columna `Hecho`.

El orden de bloques y segmentos ahora es el orden del arreglo guardado. Se
quitaron los `sort` por hora de `normalize.ts`: la escaleta V6 ya viene en orden
cronológico y desde el editor se mueve con flechas. Las horas siguen mandando en
la barra "Ahora", en las moscas y en el próximo segmento, que se calcula por hora.

Al duplicar, la copia se inserta justo debajo de la fila original y queda con
`(copia)` en el nombre y sin la marca de hecho. Al agregar un segmento, entra al
final de su bloque.

`readBlob` usa `useCache: false`. Sin eso, dos marcas seguidas se pisaban porque
la segunda lectura traía la versión anterior del programa.

## 42. El directo se detecta por la lista de subidas

`search.list` gasta 100 unidades por llamada, tiene su propia cuota diaria y
tarda en indexar el directo. Por eso el panel decia "Google respondio con un
error" o "no hay directo" con el canal ya en vivo.

Ahora el resolutor consulta `playlistItems` de la lista de subidas del canal
(`UU` + el ID sin `UC`) y luego `videos.list` con esos IDs. Cuesta 2 unidades,
no usa la cuota de busqueda y encuentra el directo al instante. Se mantiene
`videos.list` sobre el ultimo ID conocido como primer intento (1 unidad).

Un 429 o 403 se trata como cuota agotada. El estado se cachea 60 segundos para
cuidar la cuota durante las 48 horas.

## 43. Chequeo cada 30 segundos y link manual

La cuota gratuita de YouTube Data API es de 10.000 unidades por dia y no se
cobra por pasarse: si se agota, la API rechaza hasta el reinicio diario. Con el
chequeo cada 30 segundos se gastan 2.880 unidades al dia cuando hay directo
(una llamada a `videos.list`) y 5.760 cuando no lo hay (lista de subidas mas
videos). Sigue sobrando margen para 48 horas.

El panel de Streaming tiene un campo "Link manual". Guarda el video en
`supercasa/streaming/live-override.json` y el resolutor lo usa antes de llamar a
la API, con fuente `manual`. "Volver a automático" borra el archivo y retoma la
deteccion. Sirve si Google falla, si la clave se cae o si el directo no aparece
en la lista de subidas.

## 44. Descargas livianas

Las historias, posts y carruseles se exportan en JPG calidad 0.9 por defecto. Antes
salían en PNG de 1080x1920 y un carrusel de 5 slides pesaba mas de 20 MB. Ahora
cada slide pesa 200 a 300 KB y el ZIP del carrusel queda en 1 a 2 MB. Las capas
transparentes siguen en PNG porque necesitan alfa. El panel deja elegir entre JPG
liviano y PNG cuando la pieza no es transparente.

Los PNG de OBS se optimizaron con paleta de 256 colores y calidad 85. El total
paso de 88.9 MB a 22.3 MB y el ZIP de "Descargar todas" de 44 MB a 11.2 MB, sin
perder transparencia. `node scripts/optimize-cortinas.mjs` repite el proceso y
regenera el ZIP.

Las descargas usan `canvas.toBlob` y object URLs en vez de data URLs en base64.
Eso evita los archivos gigantes en memoria y los bloqueos de Safari en celulares.

## 45. El cronometro cuenta lo que llevamos

La pildora del live paso de cuenta regresiva a cronometro ascendente. Durante la
maraton dice "Llevamos HH:MM:SS" con el punto EN VIVO. Antes del arranque muestra
"Empieza pronto" y al cerrar, "48 h completas". Se actualiza cada segundo y mide
desde el inicio del evento, no desde que carga la pagina.

## 46. Metricas en vivo en el panel

Streaming abre en la pestaña "Metricas en vivo". Un componente en el layout publico
manda una vista por pagina visitada y un ping cada 20 segundos mientras la pestaña
esta visible. Se guardan en `live_pageviews` y `live_presence`, con un id anonimo en
`localStorage`. No guarda IP ni datos personales. Las sesiones de admin y los bots
se descartan en el servidor.

El panel muestra personas en `/envivo` ahora, unicos del dia, vistas y unicos de
`/envivo`, `/donar` y `/recorrido`, barras de las ultimas 12 horas, y el recaudo
manual mas el de Wompi. Se refresca cada 12 segundos. Incluye boton a YouTube
Studio y una nota: los embeds tambien suman vistas en YouTube, pero YouTube no
las separa por sitio.

El SQL crea las tablas si no existen y la migracion quedo en
`supabase/migrations/20261121000000_live_metrics.sql`.

## 47. Boton para volver al vivo

El reproductor mide cada 2 segundos la diferencia entre `getDuration` y
`getCurrentTime`. Si el espectador esta mas de 12 segundos atras, o deja el video
en pausa mas de 12 segundos, aparece el boton flotante "Ir al vivo". La barra de
controles tambien tiene un boton fijo de radio para volver al ultimo segundo.

Con el video en pausa, `getDuration` queda congelado en el momento de la pausa,
asi que buscar ese valor dejaba al espectador donde mismo. Ahora el boton
reanuda primero y hace el salto 900 ms despues, cuando la duracion ya se
actualizo. A los 2 segundos verifica y repite el salto si sigue atras. Durante
esa ventana el boton no reaparece. En pruebas dejo 0 segundos de diferencia.

## 48. El archivo de capítulos vive en Drive, el catálogo en Postgres

No se paga hosting de video. Los archivos se quedan en la carpeta de Drive del
equipo y el sitio guarda solo el ID del archivo. El player se carga al hacer clic
y usa el visor de Drive, así que el video se reproduce dentro de la página sin
moverlo a otro servicio.

Drive no es un CDN y no genera vista previa de todos los archivos. Si más
adelante se quiere un player propio, se codifica el video y se mueve a Cloudflare
R2 en su capa gratuita. El catálogo no cambia: solo se ajusta el proveedor y el
ID.

El catálogo no usa Vercel Blob, que sigue suspendido en el team de David. La
tabla `chapters` se crea con una migración y también en tiempo de ejecución. Si la
tabla está vacía, se siembra con los 15 capítulos iniciales.

## 49. El clip de la tuna se queda en el sitio

El archivo `S02-21` es un MP4 válido de 13 segundos, pero Drive no genera su
vista previa y el embed no reproduce. Se reencodeó a 720p, pesa 738 KB y se sirve
desde `public/video/tuna-presentacion-2.mp4`. Es la única excepción al esquema de
Drive y no justifica contratar nada.

## 50. Los capítulos se indexan

El archivo es contenido público de la Fundación, así que `/capitulos` y cada
detalle entran al sitemap, tienen canonical, Open Graph con la miniatura de Drive
y `VideoObject` con duración y fecha. La página no reemplaza al podcast: lo
ordena y lo deja compartible por capítulo.

## 51. Un solo proveedor por capítulo

Cada capítulo guarda `provider` (`drive` o `file`) y `providerId`. Las páginas no
arman URLs a mano: `embedUrl`, `watchUrl` y `posterFor` resuelven el proveedor.
Agregar R2, Vimeo o un archivo propio más adelante es un valor nuevo en esa
columna, no una reescritura del catálogo.
