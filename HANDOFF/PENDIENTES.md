# Pendientes de la campaña

## 1. Enlace de afiliado SDV

- Enlace listo para compartir: `https://supercasa.svgvisual.com/ref/SDV`
  (también sirve `https://supercasa.svgvisual.com/envivo?ref=SDV`).
- Guarda el referido 90 días en el navegador y lo adjunta al aporte.
- Métrica: panel, pestaña **Campañas**. Ahí se ven visitas y aportes agrupados
  por código. El código `SDV` ya está como botón rápido en el generador.
- Pendiente: un resumen exportable por código (CSV) y comparación entre códigos
  (SDV, Instagram, Meta, WhatsApp) con tasa de conversión.

## 2. Recordatorios y CRM

Lo que existe hoy:

- Formulario "Avísame cuando empiece" en `/envivo#avisame`, enlazado desde el
  header y desde el menú móvil en todas las páginas.
- Tabla `reminders` en Neon con correo, nombre, origen, referido y fecha de envío.
- Panel `/admin/recordatorios` con lista, CSV y envío manual a pendientes.
- Quien dona puede marcar "Avísame por correo cuando empiece la transmisión" y
  queda en la misma lista con origen `donacion`.

Falta:

- Integrar un CRM o completar Resend: clave `RESEND_API_KEY`, dominio verificado,
  remitente propio y manejo de rebotes.
- Doble confirmación (opt-in) y enlace de baja en cada correo.
- Envío automático programado: 24 horas antes, al iniciar, y durante la maratón
  por bloques.
- Deduplicar y unificar la lista con los donantes históricos.

## 3. Diseño de los correos

- Bienvenida: confirmación de inscripción y qué va a pasar.
- Recordatorio 24 horas antes, con fecha, hora de Bogotá y enlace al live.
- "Ya empezamos": enviado al iniciar la transmisión.
- Durante el evento: aviso por bloque (invitados, música, testimonios), con
  enlace a donar y al live.
- Cierre: agradecimiento y últimas horas de campaña.
- Todos con la marca, los logos, el enlace de afiliado cuando aplique y texto
  alternativo para quienes no ven imágenes.

## 4. Notificaciones durante la transmisión

- Requiere el CRM conectado y una lista segmentada.
- Definir quién escribe y con qué frecuencia, para no saturar.
- Reutilizar la atribución por `ref` en los enlaces de cada correo.

## 5. Otros

- Automatizar el resumen diario de recaudo y recordatorios.
- Revisar el texto de los subtítulos con la Fundación, especialmente nombres.
