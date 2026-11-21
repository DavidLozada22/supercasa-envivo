export type AnswerCategory = "empezar" | "causa" | "donar" | "evento" | "otros";

export type AnswerLink = { label: string; href: string };

export type QuickAnswer = {
  id: string;
  category: AnswerCategory;
  question: string;
  answer: string;
  links?: AnswerLink[];
};

export type ShareCategory =
  | "invitacion"
  | "promocion"
  | "envivo"
  | "donacion"
  | "cierre"
  | "empresas"
  | "agradecimiento";

export type ShareMessage = {
  id: string;
  category: ShareCategory;
  title: string;
  when: string;
  message: string;
};

const LIVE = "https://supercasa.svgvisual.com/envivo";
const DONATE = "https://supercasa.svgvisual.com/donar";
const HOME = "https://supercasa.svgvisual.com";
const WHATSAPP = "+57 317 565 8064";
const WA = (text: string) =>
  `https://wa.me/573175658064?text=${encodeURIComponent(text)}`;

export const ANSWER_CATEGORIES: Array<{ id: "all" | AnswerCategory; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "empezar", label: "Empezar" },
  { id: "causa", label: "La causa" },
  { id: "donar", label: "Donaciones" },
  { id: "evento", label: "El evento" },
  { id: "otros", label: "Otros" },
];

export const SHARE_CATEGORIES: Array<{ id: "all" | ShareCategory; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "invitacion", label: "Invitación" },
  { id: "promocion", label: "Promoción" },
  { id: "envivo", label: "En vivo" },
  { id: "donacion", label: "Donación" },
  { id: "cierre", label: "Cierre" },
  { id: "empresas", label: "Empresas" },
  { id: "agradecimiento", label: "Agradecimiento" },
];

export const QUICK_ANSWERS: QuickAnswer[] = [
  {
    id: "no-encuentro-live",
    category: "empezar",
    question: "No encuentro el streaming",
    answer: `Hola. Para ver la transmisión entra a ${LIVE}. Ahí se abre el live solo cuando estamos al aire. Si no carga, actualiza la página o entra al canal de YouTube del directo @user-me3lo9tr3m. La maratón va del viernes 20 de noviembre a las 6:00 p. m. al domingo 22 a las 6:00 p. m., hora de Bogotá.`,
    links: [
      { label: "Abrir la transmisión", href: LIVE },
      { label: "Canal del directo", href: "https://www.youtube.com/@user-me3lo9tr3m" },
    ],
  },
  {
    id: "que-es",
    category: "causa",
    question: "¿De qué se trata?",
    answer: `Hola. La Supercasa es la casa que la Fundación Segundos de Vida está construyendo para los Súper Calvitos, niños y niñas con cáncer, y sus familias. Este fin de semana hacemos una maratón de 48 horas para terminar la obra. Todo está en ${HOME}.`,
    links: [{ label: "Conocer La Supercasa", href: HOME }],
  },
  {
    id: "quien",
    category: "causa",
    question: "¿Quién organiza?",
    answer:
      "Hola. La organiza la Familia Kavanah a beneficio de la Fundación Segundos de Vida. Kavanah pone el equipo y la transmisión. La Fundación recibe y administra las donaciones y acompaña a las familias.",
    links: [{ label: "Conocer la Fundación", href: "https://segundosdevida.com" }],
  },
  {
    id: "a-quien-ayuda",
    category: "causa",
    question: "¿A quién ayuda?",
    answer:
      "Hola. Cada aporte se convierte en una pieza real de la casa: una ventana, un baño, una habitación. La casa les da un lugar seguro a los niños mientras reciben tratamiento y a sus familias un espacio para estar juntos.",
    links: [{ label: "Donar ahora", href: DONATE }],
  },
  {
    id: "como-dono",
    category: "donar",
    question: "¿Cómo dono?",
    answer: `Hola. Puedes donar de tres formas:
1. Tarjeta débito o crédito, o transferencia Bancolombia, en ${DONATE}
2. Llave Bre-B: @lasupercasa
3. Bancolombia: cuenta de ahorros 186-000090-54, Fundación Segundos de Vida, NIT 900.649.809-2.

Si transfieres, envía el comprobante al WhatsApp ${WHATSAPP} con tu nombre y el valor.`,
    links: [
      { label: "Donar en línea", href: DONATE },
      { label: "WhatsApp del equipo", href: "https://wa.me/573175658064" },
    ],
  },
  {
    id: "cuando",
    category: "evento",
    question: "¿Cuándo empieza y termina?",
    answer:
      "Hola. La maratón empieza el viernes 20 de noviembre a las 6:00 p. m. y termina el domingo 22 a las 6:00 p. m., hora de Bogotá. La campaña sigue abierta hasta el 30 de noviembre.",
    links: [{ label: "Ver la transmisión", href: LIVE }],
  },
  {
    id: "donde-queda",
    category: "evento",
    question: "¿Dónde queda la casa?",
    answer: `Hola. La casa está en Cr. 28 Bis #51-33, barrio Galerías, Bogotá. La transmisión es en línea: ${LIVE}.`,
    links: [
      { label: "Ver ubicación", href: "https://maps.google.com/?q=Cr.+28+Bis+%2351-33,+Galer%C3%ADas,+Bogot%C3%A1" },
      { label: "Abrir la transmisión", href: LIVE },
    ],
  },
  {
    id: "no-carga",
    category: "empezar",
    question: "No me carga el live",
    answer: `Hola. Prueba actualizar la página en ${LIVE}. Si sigue igual, entra al canal de YouTube del directo @user-me3lo9tr3m. La señal se abre sola cuando estamos al aire.`,
    links: [
      { label: "Reintentar", href: LIVE },
      { label: "Canal del directo", href: "https://www.youtube.com/@user-me3lo9tr3m" },
    ],
  },
  {
    id: "pago-falla",
    category: "donar",
    question: "No me funciona el pago",
    answer: `Hola. Si el pago con tarjeta no pasa, prueba con otra tarjeta o usa Bre-B @lasupercasa o la cuenta Bancolombia 186-000090-54. Si sigue el problema, escríbenos a este WhatsApp y te acompañamos.`,
    links: [{ label: "Ver otras formas", href: `${DONATE}#transferencia` }],
  },
  {
    id: "seguro",
    category: "donar",
    question: "¿Es seguro donar?",
    answer:
      "Hola. Los pagos con tarjeta los procesa Wompi, la pasarela de Bancolombia. La Fundación Segundos de Vida recibe y administra las donaciones. Si prefieres, puedes transferir por Bre-B o Bancolombia.",
    links: [{ label: "Donar en línea", href: DONATE }],
  },
  {
    id: "certificado",
    category: "donar",
    question: "¿Dan certificado de donación?",
    answer: `Hola. Sí. La Fundación Segundos de Vida emite certificado de donación. Escríbenos al WhatsApp ${WHATSAPP} con tu nombre y el valor del aporte.`,
    links: [{ label: "Pedir por WhatsApp", href: WA("Hola, necesito certificado de donación de La Supercasa. Mi nombre es ... y aporté ...") }],
  },
  {
    id: "internacional",
    category: "donar",
    question: "¿Puedo donar desde otro país?",
    answer: `Hola. Sí, puedes donar con tarjeta desde cualquier país en ${DONATE}. Si tu tarjeta falla, escríbenos y buscamos la mejor forma de recibir tu aporte.`,
    links: [{ label: "Donar en línea", href: DONATE }],
  },
  {
    id: "avisos",
    category: "evento",
    question: "¿Cómo recibo avisos?",
    answer: `Hola. Deja tu correo en ${LIVE}#avisame. Te avisamos antes de cada bloque y cuando falte poco para la meta.`,
    links: [{ label: "Dejar mi correo", href: `${LIVE}#avisame` }],
  },
  {
    id: "ayudar-sin-donar",
    category: "causa",
    question: "¿Cómo ayudo sin donar?",
    answer: `Hola. Compartir también construye. Manda la transmisión a tres personas: ${LIVE}. Si puedes, dona aunque sea una pieza pequeña. Las dos cosas suman.`,
    links: [{ label: "Compartir la transmisión", href: LIVE }],
  },
  {
    id: "como-va",
    category: "causa",
    question: "¿Cómo va la casa?",
    answer: `Hola. La casa avanza con cada aporte. Puedes ver el porcentaje actualizado en ${DONATE}. Cada pieza que entra se ve en la obra.`,
    links: [{ label: "Ver el avance", href: DONATE }],
  },
  {
    id: "que-pasa-ahora",
    category: "empezar",
    question: "¿Qué está pasando ahora?",
    answer: `Hola. Entra a ${LIVE}. Ahí ves la transmisión y el bloque que está al aire. La maratón tiene 12 bloques de 4 horas.`,
    links: [{ label: "Ver qué está pasando", href: LIVE }],
  },
  {
    id: "hasta-cuando",
    category: "donar",
    question: "¿Hasta cuándo puedo donar?",
    answer:
      "Hola. La maratón termina el domingo 22 de noviembre, pero la campaña sigue abierta hasta el 30 de noviembre. Puedes donar después del live y también invitar a tu empresa o a tu familia.",
    links: [{ label: "Donar ahora", href: DONATE }],
  },
  {
    id: "empresa",
    category: "otros",
    question: "¿Puedo donar como empresa?",
    answer: `Hola. Sí. Tu empresa puede donar, aportar materiales o hacer una alianza. Escríbenos al WhatsApp ${WHATSAPP} y armamos la forma de ayudar.`,
    links: [{ label: "Hablar por WhatsApp", href: WA("Hola, quiero sumar mi empresa a La Supercasa. Mi nombre es ... y la empresa es ...") }],
  },
  {
    id: "especie",
    category: "otros",
    question: "¿Puedo donar en especie?",
    answer: `Hola. Sí. Recibimos materiales para la casa, muebles o insumos para los niños. Escríbenos al WhatsApp ${WHATSAPP} y coordinamos la entrega.`,
    links: [{ label: "Coordinar por WhatsApp", href: WA("Hola, quiero donar en especie para La Supercasa. Tengo ...") }],
  },
  {
    id: "humano",
    category: "otros",
    question: "Quiero hablar con una persona",
    answer: `Hola. Escríbenos por WhatsApp al ${WHATSAPP} y te responde alguien del equipo. Cuéntanos qué necesitas.`,
    links: [{ label: "Abrir WhatsApp", href: "https://wa.me/573175658064" }],
  },
];

export const SHARE_MESSAGES: ShareMessage[] = [
  {
    id: "invitacion-general",
    category: "invitacion",
    title: "Invitación general",
    when: "Para grupos y contactos antes del evento",
    message: `Este viernes 20 de noviembre arranca la maratón de 48 horas por La Supercasa.

Del viernes 20 a las 6:00 p. m. al domingo 22 a las 6:00 p. m. (hora de Bogotá) construimos en vivo la casa de los Súper Calvitos, niños y niñas con cáncer, y sus familias.

Mira la transmisión: ${LIVE}
Dona y pon tu pieza: ${DONATE}`,
  },
  {
    id: "todo-el-evento",
    category: "invitacion",
    title: "Todo el evento en un mensaje",
    when: "Para enviar una sola vez con toda la información",
    message: `La Supercasa: maratón de 48 horas para terminar la casa de los Súper Calvitos.

Del viernes 20 de noviembre a las 6:00 p. m. al domingo 22 a las 6:00 p. m., hora de Bogotá.
12 bloques, invitados, retos y una sola meta.

Mira en vivo: ${LIVE}
Dona: ${DONATE}
Bre-B: @lasupercasa
Bancolombia: 186-000090-54

Cada aporte pone una pieza real en la casa.`,
  },
  {
    id: "la-causa",
    category: "invitacion",
    title: "La causa",
    when: "Para explicar de qué se trata",
    message: `La Supercasa es la casa que la Fundación Segundos de Vida construye para los Súper Calvitos, niños y niñas con cáncer, y sus familias.

Este fin de semana la terminamos en una maratón de 48 horas.

Conoce la causa: ${HOME}
Dona aquí: ${DONATE}`,
  },
  {
    id: "programa",
    category: "invitacion",
    title: "Programa de los 12 bloques",
    when: "Para compartir el plan del fin de semana",
    message: `Programa de la maratón 48H por La Supercasa:

Viernes 20
6:00 p. m. Bloque 01 · El Gran Inicio
10:00 p. m. Bloque 02 · Noche de Desafíos

Sábado 21
2:00 a. m. Bloque 03 · Desvelo Paranormal
6:00 a. m. Bloque 04 · Mañanero con Fe y Café
10:00 a. m. Bloque 05 · Copa de Campeones
2:00 p. m. Bloque 06 · Festival de Talentos
6:00 p. m. Bloque 07 · La Gran Gala de los Sueños
10:00 p. m. Bloque 08 · Retro Arcade

Domingo 22
2:00 a. m. Bloque 09 · Maratón Extrema
6:00 a. m. Bloque 10 · Despertar Solidario
10:00 a. m. Bloque 11 · Desafío de Creadores
2:00 p. m. Bloque 12 · El Gran Cierre

Entra cuando puedas: ${LIVE}`,
  },
  {
    id: "envivo-compartir",
    category: "envivo",
    title: "En vivo para compartir",
    when: "Para reenviar a quien no tiene los links",
    message: `Ya estamos en vivo en la maratón de 48 horas por La Supercasa.

Entra aquí y acompáñanos: ${LIVE}

Ahí puedes ver la transmisión y donar. Cada aporte pone una pieza real en la casa de los Súper Calvitos, niños y niñas con cáncer, y sus familias.

Dona desde el celular: ${DONATE}
Bre-B: @lasupercasa
Bancolombia: 186-000090-54

Programa completo: ${HOME}/programa

Si el link no te abre, busca el canal @user-me3lo9tr3m en YouTube o escríbenos al ${WHATSAPP}.`,
  },
  {
    id: "estamos-en-vivo",
    category: "envivo",
    title: "Estamos en vivo",
    when: "Cuando abre la señal",
    message: `Ya estamos en vivo en la maratón de 48 horas por La Supercasa.

Entra aquí: ${LIVE}

Cada aporte pone una pieza real en la casa. Dona desde $20.000: ${DONATE}`,
  },
  {
    id: "siguiente-bloque",
    category: "envivo",
    title: "Sigue el siguiente bloque",
    when: "Para mantener a la gente conectada",
    message: `La maratón sigue en vivo. Entra a ${LIVE} y acompáñanos en el siguiente bloque.

Si puedes, suma tu pieza: ${DONATE}`,
  },
  {
    id: "como-donar",
    category: "donacion",
    title: "Cómo donar",
    when: "Para responder dudas de donación",
    message: `Para donar a La Supercasa tienes tres caminos:

1. Tarjeta débito o crédito, o transferencia Bancolombia: ${DONATE}
2. Bre-B: @lasupercasa
3. Bancolombia: cuenta de ahorros 186-000090-54, Fundación Segundos de Vida.

Si transfieres, envía el comprobante al WhatsApp ${WHATSAPP}.`,
  },
  {
    id: "avisos",
    category: "donacion",
    title: "Recibe los avisos",
    when: "Para invitar a la lista de correo",
    message: `Recibe los avisos de la maratón: deja tu correo en ${LIVE}#avisame

Te avisamos antes de cada bloque y cuando falte poco para la meta.`,
  },
  {
    id: "ultimo-empujon",
    category: "cierre",
    title: "Último empujón",
    when: "En las últimas horas del evento",
    message: `Quedan pocas horas de la maratón de 48 horas por La Supercasa.

Este es el último empujón. Dona aquí: ${DONATE}
Mira el cierre en vivo: ${LIVE}`,
  },
  {
    id: "empresas",
    category: "empresas",
    title: "Empresas y alianzas",
    when: "Para contactos de empresa",
    message: `Tu empresa puede poner una pieza en La Supercasa. Donación, materiales o alianza.

Escríbenos al WhatsApp ${WHATSAPP} y armamos la forma de ayudar.`,
  },
  {
    id: "especie",
    category: "empresas",
    title: "Donación en especie",
    when: "Para empresas o personas con materiales",
    message: `También puedes donar en especie: materiales para la casa, muebles o insumos para los niños.

Escríbenos al WhatsApp ${WHATSAPP} y coordinamos la entrega.`,
  },
  {
    id: "gracias",
    category: "agradecimiento",
    title: "Gracias por construir",
    when: "Al cerrar el evento",
    message: `Gracias por construir La Supercasa. Terminaron 48 horas increíbles.

La campaña sigue hasta el 30 de noviembre. Puedes donar, invitar a tu empresa o aportar en especie: ${DONATE}`,
  },
  {
    id: "promo-estamos",
    category: "promocion",
    title: "Ya estamos en vivo",
    when: "Cuando abre la señal, para grupos y estados",
    message: `Ya estamos en vivo en La Supercasa.

Entra aquí: ${LIVE}

Dona desde $20.000 y pon una pieza real en la casa de los Súper Calvitos: ${DONATE}`,
  },
  {
    id: "promo-seguimos",
    category: "promocion",
    title: "Seguimos en vivo",
    when: "Para reactivar la conversación a mitad del evento",
    message: `Seguimos en vivo en la maratón de 48 horas por La Supercasa.

Entra cuando puedas: ${LIVE}

Si ya lo viste, comparte este link con alguien más.`,
  },
  {
    id: "promo-donar-aqui",
    category: "promocion",
    title: "Puedes donar aquí",
    when: "Cuando preguntan cómo aportar",
    message: `Puedes donar aquí en dos minutos: ${DONATE}

Tarjeta débito o crédito, o transferencia Bancolombia. También sirve el QR que aparece en la transmisión.`,
  },
  {
    id: "promo-cuentas",
    category: "promocion",
    title: "Cuentas para donar",
    when: "Para quien prefiere transferir",
    message: `Para donar por transferencia:

Bre-B: @lasupercasa
Bancolombia: cuenta de ahorros 186-000090-54, Fundación Segundos de Vida, NIT 900.649.809-2

Envía tu comprobante al WhatsApp ${WHATSAPP} con tu nombre y el valor.`,
  },
  {
    id: "promo-programa",
    category: "promocion",
    title: "Mira el programa",
    when: "Para quien quiere saber qué viene",
    message: `Si quieres saber qué viene en la maratón, aquí está el programa completo:
${HOME}/programa

Y aquí la transmisión: ${LIVE}`,
  },
  {
    id: "promo-comparte",
    category: "promocion",
    title: "Comparte el live",
    when: "Para multiplicar la difusión",
    message: `Ayúdanos a que llegue a más gente. Comparte este link:

${LIVE}

Cada persona que entra puede poner una pieza en la casa de los Súper Calvitos.`,
  },
]
