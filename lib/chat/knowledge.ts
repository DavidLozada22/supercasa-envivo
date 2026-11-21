import blocksJson from "@/lib/program/blocks.json";
import type { ProgramBlock } from "@/lib/program/types";
import { EVENT_END, EVENT_HOURS, EVENT_START } from "@/lib/event";

const blocks = blocksJson as ProgramBlock[];

export type ChatAction =
  | { type: "link"; label: string; href: string }
  | { type: "remind"; label: string }
  | { type: "whatsapp"; label: string; message: string }
  | { type: "entry"; label: string; id: string };

export type ChatEntry = {
  id: string;
  question: string;
  quick?: boolean;
  keywords: string[];
  answer: string | (() => string);
  actions?: ChatAction[];
};

const CLOCK = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Bogota",
});

function clock(iso: string): string {
  return CLOCK.format(new Date(iso));
}

export function programAnswer(now = Date.now()): string {
  const current = blocks.find(
    (block) => now >= Date.parse(block.startsAt) && now < Date.parse(block.endsAt),
  );
  const next = blocks.find((block) => Date.parse(block.startsAt) > now);

  if (current) {
    return `Ahora vamos en el ${current.label}: ${current.title}, de ${current.startClock} a ${current.endClock}. Conduce ${current.host || "el equipo de Kavanah"}. Cada bloque tiene retos y una meta propia.`;
  }
  if (next) {
    return `El próximo bloque es el ${next.label}: ${next.title}, de ${next.startClock} a ${next.endClock}. Abre con ${next.host || "el equipo de Kavanah"}.`;
  }
  if (now < Date.parse(blocks[0]?.startsAt ?? "")) {
    return `La maratón empieza el viernes 20 de noviembre a las 6:00 p. m., hora de Bogotá. El primer bloque es el 01: ${blocks[0]?.title ?? "El Gran Inicio"}.`;
  }
  return "La maratón ya terminó, pero la campaña sigue hasta el 30 de noviembre. Todavía puedes donar y compartir.";
}

export function dateAnswer(now = Date.now()): string {
  const start = EVENT_START.getTime();
  const end = EVENT_END.getTime();
  if (now < start) {
    const hours = Math.max(1, Math.ceil((start - now) / 3_600_000));
    return `La maratón empieza el viernes 20 de noviembre a las 6:00 p. m. y termina el domingo 22 a las 6:00 p. m., hora de Bogotá. Faltan cerca de ${hours} horas. La campaña sigue hasta el 30 de noviembre.`;
  }
  if (now < end) {
    const hours = Math.floor((now - start) / 3_600_000);
    const left = Math.ceil((end - now) / 3_600_000);
    return `Vamos en la hora ${hours} de ${EVENT_HOURS}. Faltan cerca de ${left} horas para cerrar la maratón. La campaña sigue hasta el 30 de noviembre.`;
  }
  return "La maratón terminó con 48 horas completas. La campaña sigue abierta hasta el 30 de noviembre para los últimos detalles de La Supercasa.";
}

export function progressAnswer(raised: number, goal: number): string {
  if (!goal || goal <= 0) {
    return "La casa avanza con cada aporte. Cada pieza que entra se ve en el avance de la obra. Entra a la página para ver el porcentaje actualizado.";
  }
  const pct = Math.max(0, Math.min(100, (raised / goal) * 100));
  return `La casa va en ${pct.toFixed(1)}% de la meta. Cada aporte pone una pieza real: una ventana, un baño, una habitación. Falta menos de lo que parece.`;
}

export const CHAT_ENTRIES: ChatEntry[] = [
  {
    id: "que-es",
    question: "¿Qué es La Supercasa?",
    quick: true,
    keywords: ["que es", "supercasa", "evento", "maraton", "casa", "de que trata"],
    answer:
      "La Supercasa es la casa que la Fundación Segundos de Vida está construyendo para los Súper Calvitos, niños y niñas con cáncer, y sus familias. La maratón de 48 horas es para terminar la obra y abrir sus puertas.",
    actions: [
      { type: "link", label: "Ver la transmisión", href: "/envivo" },
      { type: "entry", label: "¿A quién ayuda?", id: "causa" },
    ],
  },
  {
    id: "causa",
    question: "¿A quién ayuda?",
    quick: true,
    keywords: ["causa", "ninos", "niños", "cancer", "calvitos", "fundacion", "ayuda", "familias"],
    answer:
      "Cada aporte se convierte en una pieza real: una ventana, un baño, una habitación. La casa les da un lugar seguro a los niños mientras reciben tratamiento, y a sus familias un espacio para estar juntos sin perder la esperanza.",
    actions: [{ type: "link", label: "Donar ahora", href: "/donar" }],
  },
  {
    id: "quien",
    question: "¿Quién organiza?",
    keywords: ["quien", "organiza", "kavanah", "familia", "fundacion", "segundos de vida"],
    answer:
      "La organiza la Familia Kavanah a beneficio de la Fundación Segundos de Vida. Kavanah pone la energía, el equipo y la transmisión. La Fundación recibe y administra las donaciones, y acompaña a las familias.",
    actions: [{ type: "link", label: "Conocer la Fundación", href: "https://segundosdevida.com" }],
  },
  {
    id: "cuando",
    question: "¿Cuándo empieza y termina?",
    quick: true,
    keywords: ["cuando", "hora", "empieza", "termina", "fecha", "horario", "calendario"],
    answer: () => dateAnswer(),
    actions: [{ type: "link", label: "Ver la transmisión", href: "/envivo" }],
  },
  {
    id: "donde",
    question: "¿Dónde veo el live?",
    keywords: ["donde", "ver", "live", "youtube", "transmision", "envivo", "canal"],
    answer:
      "En supercasa.svgvisual.com/envivo. También puedes abrir el canal de YouTube del directo @user-me3lo9tr3m. El sitio detecta el directo solo, así que no tienes que buscar enlaces nuevos cuando hay un corte.",
    actions: [{ type: "link", label: "Abrir la transmisión", href: "/envivo" }],
  },
  {
    id: "donar",
    question: "¿Cómo dono?",
    quick: true,
    keywords: ["donar", "donacion", "wompi", "tarjeta", "pse", "nequi", "bre-b", "breb", "transferencia", "bancolombia", "pagar"],
    answer:
      "Tienes tres caminos: tarjeta, PSE o Nequi con Wompi; llave Bre-B @lasupercasa; o transferencia a la cuenta de ahorros Bancolombia 186-000090-54 de la Fundación. Si transfieres, envía el comprobante por WhatsApp y te confirmamos.",
    actions: [
      { type: "link", label: "Donar ahora", href: "/donar" },
      { type: "entry", label: "Ya transferí", id: "comprobante" },
    ],
  },
  {
    id: "comprobante",
    question: "Ya transferí, ¿qué hago?",
    keywords: ["comprobante", "transferi", "transferí", "pague", "pagué", "envie", "envío", "soporte"],
    answer:
      "Abre WhatsApp y envía la foto del comprobante con tu nombre y el valor. Con eso registramos tu pieza y te confirmamos.",
    actions: [
      {
        type: "whatsapp",
        label: "Enviar comprobante",
        message:
          "Hola, acabo de hacer una transferencia a La Supercasa. Adjunto mi comprobante. Nombre: ___ Valor: ___",
      },
    ],
  },
  {
    id: "falla",
    question: "No me funciona el pago",
    keywords: ["falla", "error", "no puedo", "no me funciona", "pago", "tarjeta", "rechaza", "problema"],
    answer:
      "Si el pago no pasa, prueba con otra tarjeta o usa Bre-B o transferencia. Si sigue fallando, escríbenos por WhatsApp y te acompañamos paso a paso. No te quedes sin donar por un error técnico.",
    actions: [
      { type: "link", label: "Ver otras formas", href: "/donar#transferencia" },
      {
        type: "whatsapp",
        label: "Pedir ayuda",
        message: "Hola, estoy intentando donar a La Supercasa y el pago no me funciona. ¿Me ayudan?",
      },
    ],
  },
  {
    id: "progreso",
    question: "¿Cómo va la casa?",
    quick: true,
    keywords: ["como va", "progreso", "avance", "porcentaje", "meta", "cuanto llevan", "recaudado"],
    answer:
      "La casa avanza con cada aporte. Cada pieza que entra se ve en el avance de la obra. Entra a la página para ver el porcentaje actualizado.",
    actions: [
      { type: "link", label: "Ver el avance", href: "/#donar" },
      { type: "link", label: "Donar ahora", href: "/donar" },
    ],
  },
  {
    id: "programa",
    question: "¿Qué viene ahora?",
    quick: true,
    keywords: ["que viene", "programa", "bloque", "seccion", "sección", "ahora", "siguiente", "escaleta"],
    answer: () => programAnswer(),
    actions: [
      { type: "link", label: "Ver la transmisión", href: "/envivo" },
      { type: "link", label: "Donar ahora", href: "/donar" },
    ],
  },
  {
    id: "avisos",
    question: "¿Cómo recibo avisos?",
    quick: true,
    keywords: ["aviso", "avisos", "recordatorio", "recordatorios", "correo", "inscribir", "notificacion"],
    answer:
      "Déjame tu nombre y tu correo. Te aviso cuando empiece cada bloque, cuando falte poco para la meta y cuando esté por cerrar. También te recuerdo en qué bloque vamos.",
    actions: [{ type: "remind", label: "Recibir avisos" }],
  },
  {
    id: "empresa",
    question: "¿Puedo donar como empresa?",
    keywords: ["empresa", "compania", "compañia", "negocio", "patrocinio", "aliado", "corporativo"],
    answer:
      "Sí. Tu empresa puede donar, aportar materiales o hacer una alianza. Escríbenos y armamos la forma de ayudar, con reconocimiento en la campaña si lo quieren.",
    actions: [
      {
        type: "whatsapp",
        label: "Hablar con el equipo",
        message: "Hola, quiero sumar a mi empresa a La Supercasa. ¿Cómo podemos ayudar?",
      },
    ],
  },
  {
    id: "especie",
    question: "¿Puedo donar en especie?",
    keywords: ["especie", "materiales", "muebles", "insumos", "donar cosas", "construccion"],
    answer:
      "Sí. Materiales para la casa, muebles, insumos o servicios para los niños. Escríbenos con lo que tienes y coordinamos la entrega con la Fundación.",
    actions: [
      {
        type: "whatsapp",
        label: "Ofrecer materiales",
        message: "Hola, quiero donar en especie a La Supercasa. Les cuento qué tengo disponible:",
      },
    ],
  },
  {
    id: "certificado",
    question: "¿Dan certificado de donación?",
    keywords: ["certificado", "recibo", "tributario", "deduccion", "deducción", "factura"],
    answer:
      "Sí. La Fundación Segundos de Vida emite certificado de donación. Si lo necesitas, escríbenos por WhatsApp con tu nombre y el valor del aporte.",
    actions: [
      {
        type: "whatsapp",
        label: "Pedir por WhatsApp",
        message:
          "Hola, necesito certificado de donación de La Supercasa. Mi nombre es ... y aporté ...",
      },
    ],
  },
  {
    id: "internacional",
    question: "¿Puedo donar desde otro país?",
    keywords: ["internacional", "otro pais", "otro país", "fuera", "exterior", "dolares", "dólares"],
    answer:
      "Puedes donar con tarjeta desde cualquier país. Si tu tarjeta falla, escríbenos y buscamos la mejor forma de recibir tu aporte.",
    actions: [{ type: "link", label: "Donar ahora", href: "/donar" }],
  },
  {
    id: "compartir",
    question: "¿Cómo ayudo sin donar?",
    keywords: ["compartir", "sin donar", "gratis", "ayudar", "difundir", "redes"],
    answer:
      "Compartir también construye. Manda el live a tres personas y cuéntales por qué lo haces. Si puedes, dona aunque sea una pieza pequeña. Las dos cosas suman.",
    actions: [{ type: "link", label: "Compartir la transmisión", href: "/envivo" }],
  },
  {
    id: "visita",
    question: "¿Puedo conocer la Fundación?",
    keywords: ["visita", "visitar", "conocer", "fundacion", "sede", "agendar"],
    answer:
      "Puedes agendar una visita a la Fundación en segundosdevida.com. También puedes escribirnos y coordinamos para que conozcas la casa y a las familias.",
    actions: [
      { type: "link", label: "Agendar una visita", href: "https://segundosdevida.com" },
      {
        type: "whatsapp",
        label: "Coordinar por WhatsApp",
        message: "Hola, quiero conocer la Fundación Segundos de Vida y La Supercasa. ¿Cómo agendo una visita?",
      },
    ],
  },
  {
    id: "hasta-cuando",
    question: "¿Hasta cuándo puedo donar?",
    keywords: ["hasta cuando", "hasta cuándo", "plazo", "cierra", "30 de noviembre", "ultimo dia"],
    answer:
      "La maratón termina el 22 de noviembre, pero la campaña sigue abierta hasta el 30 de noviembre. Puedes donar después del live y también invitar a tu empresa o a tu familia.",
    actions: [{ type: "link", label: "Donar ahora", href: "/donar" }],
  },
  {
    id: "humano",
    question: "Hablar con una persona",
    quick: true,
    keywords: ["persona", "humano", "hablar", "whatsapp", "contacto", "ayuda", "agente"],
    answer:
      "Te paso con una persona del equipo por WhatsApp. Cuéntanos qué necesitas y te respondemos lo antes posible.",
    actions: [
      {
        type: "whatsapp",
        label: "Abrir WhatsApp",
        message: "Hola, tengo una duda sobre La Supercasa y necesito ayuda.",
      },
    ],
  },
];

export const QUICK_ENTRIES = CHAT_ENTRIES.filter((entry) => entry.quick);

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchEntry(input: string): ChatEntry | null {
  const text = normalize(input);
  if (!text) return null;

  let best: { entry: ChatEntry; score: number } | null = null;

  for (const entry of CHAT_ENTRIES) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const clean = normalize(keyword);
      if (clean && text.includes(clean)) score += clean.includes(" ") ? 3 : 2;
    }
    if (normalize(entry.question).includes(text)) score += 2;
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }

  return best?.entry ?? null;
}

export function entryById(id: string): ChatEntry | null {
  return CHAT_ENTRIES.find((entry) => entry.id === id) ?? null;
}
