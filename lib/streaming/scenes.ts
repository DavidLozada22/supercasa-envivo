export type SceneKind = "full" | "overlay";
export type SceneGroup = "generic" | "bloque";
export type SceneAccent = "fuchsia" | "lime" | "yellow" | "cyan";
export type SceneField = "title" | "subtitle" | "note" | "guest" | "guestRole" | "returnAt";

export type SceneVisual =
  | "calvito"
  | "clock"
  | "wrench"
  | "qr"
  | "render"
  | "logos"
  | "guest"
  | "spark"
  | "cocina"
  | "musica"
  | "historias"
  | "legal"
  | "creadores"
  | "none";

export type SceneDef = {
  id: string;
  label: string;
  kind: SceneKind;
  group?: SceneGroup;
  number?: string;
  accent: SceneAccent;
  eyebrow: string;
  title: string;
  subtitle: string;
  note?: string;
  fields: SceneField[];
  when: string;
  visual: SceneVisual;
};

type BlockSeed = {
  number: string;
  day: string;
  time: string;
  title: string;
  subtitle: string;
  reto: string;
};

const BLOCKS: BlockSeed[] = [
  {
    number: "01",
    day: "Día 1",
    time: "18:00 a 22:00",
    title: "El Gran Inicio",
    subtitle: "El mejor regalo es terminar La Supercasa. Con Sebas.",
    reto: "Reto del bloque: todos nos quedamos calvos.",
  },
  {
    number: "02",
    day: "Día 1 y 2",
    time: "22:00 a 02:00",
    title: "Noche de Desafíos y Risas Sin Filtro",
    subtitle: "Con Vikingo. Retos decididos por la audiencia.",
    reto: "Las donaciones y los votos eligen el próximo reto.",
  },
  {
    number: "03",
    day: "Día 2",
    time: "02:00 a 06:00",
    title: "Desvelo Paranormal",
    subtitle: "Con Luz Gardenia y Libardo. Sobreviviendo a la madrugada.",
    reto: "Podcast de rock y metal, monitoreo cardíaco en la oscuridad.",
  },
  {
    number: "04",
    day: "Día 2",
    time: "06:00 a 10:00",
    title: "Mañanero con Fe y Café",
    subtitle: "Con Cris. Consultorio legal y meta de desayunos.",
    reto: "Consultorio legal en vivo y aportes matutinos.",
  },
  {
    number: "05",
    day: "Día 2",
    time: "10:00 a 14:00",
    title: "Copa de Campeones",
    subtitle: "Con Vikingo. El desafío gamer.",
    reto: "Campeonato gamer con premio tecnológico.",
  },
  {
    number: "06",
    day: "Día 2",
    time: "14:00 a 18:00",
    title: "El Festival de Talentos Kavanah",
    subtitle: "Con Paola. Talentos en vivo y cocina solidaria.",
    reto: "Cocina express solidaria y muestra de talentos.",
  },
  {
    number: "07",
    day: "Día 2",
    time: "18:00 a 22:00",
    title: "La Gran Gala de los Sueños",
    subtitle: "Con Sebas. La noche estelar de la maratón.",
    reto: "Apadrinamiento de las 14 habitaciones en prime time.",
  },
  {
    number: "08",
    day: "Día 2 y 3",
    time: "22:00 a 02:00",
    title: "Retro Arcade y Noche de Leyendas",
    subtitle: "Con Vikingo. Clásicos de los 80 y los 90.",
    reto: "Torneo de Street Fighter y Mario Kart.",
  },
  {
    number: "09",
    day: "Día 3",
    time: "02:00 a 06:00",
    title: "Maratón Extrema: Reto Speedrun",
    subtitle: "Con Libardo. El reto contra el reloj.",
    reto: "Penalizaciones y ayudas pagadas con donaciones.",
  },
  {
    number: "10",
    day: "Día 3",
    time: "06:00 a 10:00",
    title: "Despertar Solidario",
    subtitle: "Con Cris y Luz Gardenia. Historias que inspiran.",
    reto: "Especial cultural Carnaval de Riosucio.",
  },
  {
    number: "11",
    day: "Día 3",
    time: "10:00 a 14:00",
    title: "El Desafío de Creadores",
    subtitle: "Con Paola. La batalla de fandoms por una causa.",
    reto: "Retos físicos, trivias y colaboraciones con creadores.",
  },
  {
    number: "12",
    day: "Día 3",
    time: "14:00 a 18:00",
    title: "El Gran Cierre",
    subtitle: "Con Sebas. La cumbre de la esperanza.",
    reto: "Meta global final y apertura simbólica de La Supercasa.",
  },
];

const BLOCK_ACCENTS: SceneAccent[] = ["fuchsia", "lime", "cyan", "yellow"];

const blockScenes: SceneDef[] = BLOCKS.map((block, index) => ({
  id: `bloque-${block.number}`,
  label: `Bloque ${block.number} · ${block.title}`,
  kind: "full",
  group: "bloque",
  number: block.number,
  accent: BLOCK_ACCENTS[index % BLOCK_ACCENTS.length],
  eyebrow: `Bloque ${block.number} · ${block.day} · ${block.time}`,
  title: block.title,
  subtitle: block.subtitle,
  note: block.reto,
  fields: ["title", "subtitle", "note"],
  when: `Entrada al bloque ${block.number}, de ${block.time}.`,
  visual: "none",
}));

export const SCENES: SceneDef[] = [
  {
    id: "empezamos-1",
    label: "Empezamos en 1 minuto",
    kind: "full",
    accent: "fuchsia",
    eyebrow: "Maratón 48 horas",
    title: "Empezamos en 1 minuto",
    subtitle: "Ponte la capa. La casa de los Súper Calvitos empieza a construirse.",
    fields: [],
    when: "Último minuto antes de abrir la señal.",
    visual: "calvito",
  },
  {
    id: "empezamos-5",
    label: "Empezamos en 5 minutos",
    kind: "full",
    accent: "lime",
    eyebrow: "Maratón 48 horas",
    title: "Empezamos en 5 minutos",
    subtitle: "Acomódate. Ya casi arranca la transmisión.",
    fields: [],
    when: "Cinco minutos antes del arranque o de un bloque.",
    visual: "calvito",
  },
  {
    id: "ya-volvemos",
    label: "Ya volvemos",
    kind: "full",
    accent: "yellow",
    eyebrow: "Pausa breve",
    title: "Ya volvemos",
    subtitle: "Estamos preparando el siguiente momento de la maratón.",
    note: "Tu aporte sigue construyendo La Supercasa.",
    fields: ["returnAt", "note"],
    when: "Cortes cortos, cambios de set o de invitado.",
    visual: "clock",
  },
  {
    id: "ajuste-tecnico",
    label: "Ajuste técnico",
    kind: "full",
    accent: "cyan",
    eyebrow: "Señal",
    title: "Estamos trabajando",
    subtitle: "Ajustando unos detalles para que la señal siga firme. Volvemos en un momento.",
    fields: ["note"],
    when: "Caída de internet, reinicio de OBS o cambio de bloque de 12 horas.",
    visual: "wrench",
  },
  {
    id: "ya-viene",
    label: "Ya viene algo",
    kind: "full",
    accent: "fuchsia",
    eyebrow: "Ya viene",
    title: "El siguiente momento",
    subtitle: "No te muevas. En un momento lo ves aquí.",
    fields: ["title", "note"],
    when: "Antes de una entrevista, un reto o una dinámica.",
    visual: "spark",
  },
  {
    id: "estamos-en",
    label: "Estamos en un bloque",
    kind: "full",
    accent: "lime",
    eyebrow: "En este momento",
    title: "Estamos en el bloque de donaciones",
    subtitle: "Cada aporte suma para la casa de los Súper Calvitos.",
    fields: ["title", "subtitle"],
    when: "Para anunciar la sección que está al aire.",
    visual: "spark",
  },
  {
    id: "donaciones",
    label: "Bloque de donaciones",
    kind: "full",
    accent: "lime",
    eyebrow: "Dona desde tu celular",
    title: "Cada pieza cuenta",
    subtitle: "Escanea el QR o entra a supercasa.svgvisual.com/donar",
    note: "Llave Bre-B, Bancolombia o tarjeta.",
    fields: ["note"],
    when: "Llamados a donar y cierre de metas.",
    visual: "qr",
  },
  {
    id: "invitado",
    label: "Invitado en vivo",
    kind: "full",
    accent: "fuchsia",
    eyebrow: "En vivo",
    title: "Invitado especial",
    subtitle: "En vivo desde La Supercasa.",
    fields: ["guest", "guestRole", "note"],
    when: "Entrevistas y voces invitadas.",
    visual: "guest",
  },
  {
    id: "cocina",
    label: "Cocina en vivo",
    kind: "full",
    accent: "lime",
    eyebrow: "Cocina en vivo",
    title: "El sabor también construye",
    subtitle: "Cada receta de hoy suma para La Supercasa.",
    fields: ["title", "note"],
    when: "Segmentos de cocina y gastronomía.",
    visual: "cocina",
  },
  {
    id: "musica",
    label: "Música en vivo",
    kind: "full",
    accent: "fuchsia",
    eyebrow: "Música en vivo",
    title: "La banda suena por los Súper Calvitos",
    subtitle: "Acompaña el show y dona desde donde estés.",
    fields: ["title", "note"],
    when: "Shows, serenatas y cápsulas musicales.",
    visual: "musica",
  },
  {
    id: "historias",
    label: "Historias que inspiran",
    kind: "full",
    accent: "cyan",
    eyebrow: "Historias que inspiran",
    title: "Conoce a las familias de Segundos de Vida",
    subtitle: "Detrás de cada aporte hay una historia real.",
    fields: ["title", "note"],
    when: "Testimonios y piezas de la Fundación.",
    visual: "historias",
  },
  {
    id: "legal",
    label: "Consultorio legal",
    kind: "full",
    accent: "yellow",
    eyebrow: "Consultorio legal",
    title: "Acompañamiento para las familias",
    subtitle: "Derechos, orientación y apoyo.",
    fields: ["title", "note"],
    when: "Segmentos legales y de acompañamiento.",
    visual: "legal",
  },
  {
    id: "creadores",
    label: "Creadores por una causa",
    kind: "full",
    accent: "fuchsia",
    eyebrow: "Creadores por una causa",
    title: "La batalla de fandoms empieza",
    subtitle: "Retos, trivias y colaboraciones por La Supercasa.",
    fields: ["title", "note"],
    when: "Batallas de creadores y dinámicas de redes.",
    visual: "creadores",
  },
  {
    id: "casa",
    label: "La casa en construcción",
    kind: "full",
    accent: "cyan",
    eyebrow: "La Supercasa",
    title: "La casa va tomando forma",
    subtitle: "Cada aporte pone una pieza más.",
    fields: ["note"],
    when: "Mostrar el avance de la obra.",
    visual: "render",
  },
  {
    id: "reto",
    label: "Reto en vivo",
    kind: "full",
    accent: "yellow",
    eyebrow: "Reto en vivo",
    title: "El reto empieza ahora",
    subtitle: "Cada aporte suma. Vamos por la siguiente meta.",
    fields: ["title", "note"],
    when: "Dinámicas, retos y anuncios especiales.",
    visual: "spark",
  },
  {
    id: "aliados",
    label: "Aliados",
    kind: "full",
    accent: "lime",
    eyebrow: "Con el apoyo de",
    title: "Fundación Segundos de Vida y Kavanah",
    subtitle: "Un evento de Familia Kavanah a beneficio de los Súper Calvitos.",
    fields: ["note"],
    when: "Agradecimientos y pausas institucionales.",
    visual: "logos",
  },
  {
    id: "gracias",
    label: "Gracias por acompañarnos",
    kind: "full",
    accent: "yellow",
    eyebrow: "Gracias",
    title: "Gracias por acompañarnos",
    subtitle: "La maratón termina. La campaña sigue abierta hasta el 30 de noviembre.",
    fields: ["note"],
    when: "Cierre del evento.",
    visual: "calvito",
  },
  ...blockScenes,
  {
    id: "lower-third",
    label: "Lower third de invitado",
    kind: "overlay",
    accent: "fuchsia",
    eyebrow: "En vivo",
    title: "Nombre del invitado",
    subtitle: "Cargo o rol",
    fields: ["guest", "guestRole"],
    when: "Sobre el video, para identificar a quien habla.",
    visual: "guest",
  },
  {
    id: "meta",
    label: "Barra de la meta",
    kind: "overlay",
    accent: "lime",
    eyebrow: "Recaudo en vivo",
    title: "Barra de la meta",
    subtitle: "Se actualiza sola con el recaudo.",
    fields: [],
    when: "Sobre el video, durante todo el evento.",
    visual: "spark",
  },
  {
    id: "reloj",
    label: "Contador 48 horas",
    kind: "overlay",
    accent: "yellow",
    eyebrow: "Maratón",
    title: "Contador 48 horas",
    subtitle: "Hora del evento y avance de la maratón.",
    fields: [],
    when: "Sobre el video, para mostrar el avance.",
    visual: "clock",
  },
  {
    id: "en-vivo",
    label: "Marco en vivo",
    kind: "overlay",
    accent: "fuchsia",
    eyebrow: "En vivo",
    title: "En vivo",
    subtitle: "Insignia de transmisión.",
    fields: [],
    when: "Esquina del video mientras hay señal.",
    visual: "guest",
  },
];

export const FIELD_LABELS: Record<SceneField, string> = {
  title: "Título",
  subtitle: "Subtítulo",
  note: "Línea corta",
  guest: "Nombre del invitado",
  guestRole: "Cargo o rol",
  returnAt: "Hora de regreso",
};

export function getScene(id: string): SceneDef | null {
  return SCENES.find((scene) => scene.id === id) ?? null;
}

export function fullScenes(): SceneDef[] {
  return SCENES.filter((scene) => scene.kind === "full");
}

export function blockScenesList(): SceneDef[] {
  return SCENES.filter((scene) => scene.group === "bloque");
}

export function overlayScenes(): SceneDef[] {
  return SCENES.filter((scene) => scene.kind === "overlay");
}

export const DEFAULT_SCENE_ID = "ya-volvemos";
