# Flujo del usuario

## Camino principal

```mermaid
flowchart TD
  A[Link en redes sociales] --> B[Landing: live enmascarado]
  B --> C{Quiere donar}
  C -->|QR con otro celular| D[/donar]
  C -->|Botón Donar ahora| D
  C -->|Barra fija en celular| D
  D --> E[Elige pieza o monto libre]
  E --> F[Nombre, correo y autorización]
  F --> G[Wompi Widget Checkout]
  G -->|Aprobado| H[/donar/gracias: aporte confirmado]
  G -->|Pendiente| I[/donar/gracias: esperando confirmación]
  G -->|Rechazado o cerrado| J[/donar: reintentar]
  H --> K[Compartir por WhatsApp]
  D --> L[Transferencia Bre-B o Bancolombia]
```

## Camino secundario

- Quien no puede pagar en línea baja a las tarjetas de transferencia en `/donar`.
- Quien cierra el widget vuelve al formulario con un mensaje claro.
- Quien ya donó ve el estado en `/donar/gracias` sin repetir el formulario.

## Hallazgos de la revisión heurística

Evaluación con las 10 heurísticas de Nielsen sobre el flujo live a donación.

| # | Hallazgo | Heurística | Severidad | Estado |
| --- | --- | --- | --- | --- |
| 1 | En celular el QR no se puede escanear con el mismo teléfono y el CTA quedaba lejos del video | H6, H8 | 3 | Corregido con barra fija de donación |
| 2 | El botón del encabezado llevaba a un ancla lejana, no a la donación | H7 | 3 | Corregido: va a `/donar` |
| 3 | "Ver opciones de pago" no decía qué hacer | H2 | 2 | Corregido: "Donar ahora" |
| 4 | Sin llaves de Wompi el usuario llenaba todo y fallaba al final | H5, H9 | 4 | Corregido: aviso previo y botón deshabilitado |
| 5 | `/donar` no mostraba cuánto falta | H1 | 2 | Corregido: barra y cifras en el formulario |
| 6 | El error del formulario no se anunciaba a lectores de pantalla | H9 | 2 | Corregido: `role="alert"` |
| 7 | Después de donar no había forma de compartir | H7 | 1 | Corregido: WhatsApp en la página de gracias |
| 8 | El monto libre usaba teclado de texto en celular | H5 | 1 | Corregido: `inputMode="numeric"` |

## Decisiones de flujo

- La landing canónica es la nuestra. El código de Sebastián se usa para el motor
  de donaciones, no para la portada.
- La donación se hace en una sola página con dos bloques visibles. Sin wizard: en
  una transmisión de 48 horas cada paso extra pierde gente.
- El QR apunta siempre a `/donar`, nunca a Wompi directo.
- Los pagos en línea se apagan solos si faltan llaves. Nunca se simula en
  producción.
- La barra fija solo aparece en celular, donde el QR no sirve.

## Pendiente de validar con usuarios

- ¿La gente entiende que el QR es para donar y no para el live?
- ¿Cuántos llegan a `/donar` y abandonan en el formulario?
- ¿El monto sugerido de $100.000 es el correcto para la audiencia?
- Roles: hoy los cuatro usuarios son administradores. Falta un rol de solo
  lectura para probar permisos.

## Versión 2: home de Sebastián con live integrado

```mermaid
flowchart TD
  A[Link en redes] --> B[Home: hero con live y QR]
  B --> C{Donar}
  C -->|Botón Donar ahora| D[/donar]
  C -->|QR con otro celular| D
  C -->|CTA fijo en celular| D
  D --> E[Pieza]
  E --> F[Datos y consentimiento]
  F --> G[Resumen con comisión de Wompi]
  G --> H[Widget de Wompi]
  H -->|Aprobado| I[/donar/gracias]
  D --> J[Transferencia Bre-B o Bancolombia]
  B --> K[Historia, obra, transparencia, empresas]
```

El home ya no muestra el wizard completo: muestra las piezas y lleva a `/donar`.
Así el QR cae directo en la acción y la página no se alarga de más.
