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
