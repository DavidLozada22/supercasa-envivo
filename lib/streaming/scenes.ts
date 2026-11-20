import blocksJson from "@/lib/program/blocks.json";
import type { ProgramBlock } from "@/lib/program/types";

export type SceneKind = "full" | "overlay";
export type SceneGroup = "generic" | "bloque" | "hora";
export type SceneAccent = "fuchsia" | "lime" | "yellow" | "cyan";
export type SceneField = "title" | "subtitle" | "note" | "guest" | "guestRole" | "returnAt";
export type SceneQrTarget = "donate" | "live";

export type CalvitoKey =
  | "bombero"
  | "chef"
  | "constructor"
  | "doctor"
  | "doctora"
  | "ejecutivo"
  | "empresaria"
  | "piloto"
  | "policia-calvita"
  | "policia";

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
  | "house"
  | "liveframe"
  | "donation-overlay"
  | "live-qr"
  | "mosca"
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
  /** Calvito 3D que acompana la escena. */
  illustration?: CalvitoKey;
  /** Grupo de calvitos para escenas de cierre. */
  illustrationCluster?: CalvitoKey[];
  /** Numero gigante de las cuentas regresivas. */
  countValue?: string;
  countUnit?: string;
  /** Porcentaje fijo de la casa (0, 25, 50, 75, 100). */
  houseFrame?: number;
  /** Toma el porcentaje real del recaudo y avanza la casa sola. */
  houseLive?: boolean;
  /** Llamado a la accion corto para la franja de donacion. */
  cta?: string;
  /** Etiqueta de la esquina superior. */
  badge?: string;
  /** Destino del QR de la escena. */
  qrTarget?: SceneQrTarget;
  /** Usa el recaudo real en lugar del porcentaje fijo. */
  progressLive?: boolean;
  /** Porcentaje fijo de avance (0 a 100). */
  progressPercent?: number;
  /** Texto debajo de la casa. */
  progressCaption?: string;
  /** Textos de invitado y hora de regreso una vez fusionados. */
  guest?: string;
  guestRole?: string;
  returnAt?: string;
};

const BLOCK_ACCENTS: SceneAccent[] = ["fuchsia", "lime", "cyan", "yellow"];

export const CALVITOS: CalvitoKey[] = [
  "bombero",
  "piloto",
  "doctora",
  "chef",
  "policia",
  "constructor",
  "empresaria",
  "ejecutivo",
  "doctor",
  "policia-calvita",
];

export function calvitoSrc(key: CalvitoKey): string {
  return `/img/calvitos/${key}.webp`;
}

const blockScenes: SceneDef[] = (blocksJson as ProgramBlock[]).map((block, index) => {
  const shortTitle = block.title.split(/[:·]/)[0]?.trim() || block.title;
  return {
    id: `bloque-${block.number}`,
    label: `Bloque ${block.number} · ${shortTitle}`,
    kind: "full",
    group: "bloque",
    number: block.number,
    accent: BLOCK_ACCENTS[index % BLOCK_ACCENTS.length],
    eyebrow: `Bloque ${block.number} · ${block.day} · ${block.schedule}`,
    title: shortTitle,
    subtitle: block.title,
    note: block.host ? `Con ${block.host}. ${block.challenge || block.focus}` : block.challenge,
    fields: ["title", "subtitle", "note"],
    when: `Entrada al bloque ${block.number}, de ${block.schedule}.`,
    visual: "none",
    illustration: CALVITOS[index % CALVITOS.length],
    cta: "Dona y construye la siguiente pieza",
  };
});

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
    illustration: "bombero",
    countValue: "1",
    countUnit: "minuto para empezar",
    cta: "Dona antes de que arranque",
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
    illustration: "piloto",
    countValue: "5",
    countUnit: "minutos para empezar",
    cta: "Tu aporte ya puede entrar",
  },
  {
    id: "empezamos-15",
    label: "Empezamos en 15 minutos",
    kind: "full",
    accent: "cyan",
    eyebrow: "Maratón 48 horas",
    title: "Empezamos en 15 minutos",
    subtitle: "Calienta motores. En un rato la casa empieza a crecer.",
    fields: [],
    when: "Quince minutos antes de un bloque o del arranque.",
    visual: "calvito",
    illustration: "doctora",
    countValue: "15",
    countUnit: "minutos para empezar",
    cta: "Dona y pon la primera pieza",
  },
  {
    id: "empezamos-20",
    label: "Empezamos en 20 minutos",
    kind: "full",
    accent: "yellow",
    eyebrow: "Maratón 48 horas",
    title: "Empezamos en 20 minutos",
    subtitle: "Busca el lugar más cómodo. Esto va para largo y es por una causa grande.",
    fields: [],
    when: "Veinte minutos antes de un bloque.",
    visual: "calvito",
    illustration: "chef",
    countValue: "20",
    countUnit: "minutos para empezar",
    cta: "Dona desde donde estés",
  },
  {
    id: "empezamos-30",
    label: "Empezamos en media hora",
    kind: "full",
    accent: "lime",
    eyebrow: "Maratón 48 horas",
    title: "Empezamos en media hora",
    subtitle: "Treinta minutos para que la señal abra y la casa avance.",
    fields: [],
    when: "Media hora antes de un bloque.",
    visual: "calvito",
    illustration: "policia",
    countValue: "½",
    countUnit: "hora para empezar",
    cta: "Dona y suma una pieza",
  },
  {
    id: "empezamos-60",
    label: "Empezamos en 1 hora",
    kind: "full",
    accent: "fuchsia",
    eyebrow: "Maratón 48 horas",
    title: "Empezamos en 1 hora",
    subtitle: "Una hora para prepararte. Nosotros ya estamos construyendo.",
    fields: [],
    when: "Una hora antes del arranque o de un bloque ancla.",
    visual: "calvito",
    illustration: "constructor",
    countValue: "1",
    countUnit: "hora para empezar",
    cta: "Dona y llega con tu pieza",
  },
  {
    id: "horas-2",
    label: "Vamos 2 horas",
    kind: "full",
    group: "hora",
    accent: "lime",
    eyebrow: "Vamos 2 horas · 48 horas por la casa",
    title: "Vamos 2 horas",
    subtitle: "Dos horas, cientos de historias y la primera pieza ya está puesta. Esto apenas empieza.",
    fields: [],
    when: "Sobre la hora 2 de la maratón.",
    visual: "calvito",
    illustration: "piloto",
    countValue: "2",
    countUnit: "horas en vivo",
    cta: "Dona y pon la siguiente pieza",
  },
  {
    id: "horas-5",
    label: "Vamos 5 horas",
    kind: "full",
    group: "hora",
    accent: "cyan",
    eyebrow: "Vamos 5 horas · 48 horas por la casa",
    title: "Vamos 5 horas",
    subtitle: "Cinco horas sin soltar la causa. La casa ya muestra sus primeros avances.",
    fields: [],
    when: "Sobre la hora 5 de la maratón.",
    visual: "calvito",
    illustration: "chef",
    countValue: "5",
    countUnit: "horas en vivo",
    cta: "Dona y suma una pieza más",
  },
  {
    id: "horas-10",
    label: "Vamos 10 horas",
    kind: "full",
    group: "hora",
    accent: "fuchsia",
    eyebrow: "Vamos 10 horas · 48 horas por la casa",
    title: "Vamos 10 horas",
    subtitle: "Diez horas construyendo. La energía se mantiene y la meta se acerca.",
    fields: [],
    when: "Sobre la hora 10 de la maratón.",
    visual: "calvito",
    illustration: "doctora",
    countValue: "10",
    countUnit: "horas en vivo",
    cta: "Dona y empuja la meta",
  },
  {
    id: "horas-24",
    label: "Vamos 24 horas",
    kind: "full",
    group: "hora",
    accent: "yellow",
    eyebrow: "Vamos 24 horas · mitad del camino",
    title: "Vamos 24 horas",
    subtitle: "La mitad del camino. La casa ya se ve y los Súper Calvitos lo saben.",
    fields: [],
    when: "Sobre la hora 24, la mitad de la maratón.",
    visual: "calvito",
    illustration: "policia",
    countValue: "24",
    countUnit: "horas en vivo",
    cta: "Dona y completa la otra mitad",
  },
  {
    id: "horas-30",
    label: "Vamos 30 horas",
    kind: "full",
    group: "hora",
    accent: "lime",
    eyebrow: "Vamos 30 horas · la meta está cerca",
    title: "Vamos 30 horas",
    subtitle: "Treinta horas. El último tramo empieza ahora y cada aporte cuenta el doble.",
    fields: [],
    when: "Sobre la hora 30 de la maratón.",
    visual: "calvito",
    illustration: "empresaria",
    countValue: "30",
    countUnit: "horas en vivo",
    cta: "Dona y cierra la meta",
  },
  {
    id: "horas-32",
    label: "Vamos 32 horas",
    kind: "full",
    group: "hora",
    accent: "fuchsia",
    eyebrow: "Vamos 32 horas · último tramo",
    title: "Vamos 32 horas",
    subtitle: "Quedan 16 horas para cerrar. Este es el momento de empujar entre todos.",
    fields: [],
    when: "Sobre la hora 32 de la maratón.",
    visual: "calvito",
    illustration: "bombero",
    countValue: "32",
    countUnit: "horas en vivo",
    cta: "Dona antes de que se acabe",
  },
  {
    id: "casi-terminamos",
    label: "Ya casi terminamos",
    kind: "full",
    group: "hora",
    accent: "yellow",
    eyebrow: "Último tramo",
    title: "Ya casi terminamos",
    subtitle: "Quedan pocas horas para cerrar la maratón. Tu último aporte puede ser la pieza que falta.",
    note: "La casa se termina entre todos.",
    fields: ["note"],
    when: "En la última franja de la maratón, antes del cierre.",
    visual: "calvito",
    illustration: "constructor",
    cta: "Dona y termina la casa",
  },
  {
    id: "gracias-donaciones",
    label: "Gracias por tus donaciones",
    kind: "full",
    group: "hora",
    accent: "lime",
    eyebrow: "Gracias",
    title: "Gracias por tus donaciones",
    subtitle: "Cada pieza ya es parte de La Supercasa. Los Súper Calvitos van a crecer en un hogar hecho con amor.",
    note: "La campaña sigue hasta el 30 de noviembre.",
    fields: ["note"],
    when: "Después de un buen bloque de donaciones o al cerrar una meta.",
    visual: "calvito",
    illustrationCluster: ["policia-calvita", "bombero", "doctora"],
    cta: "La campaña sigue: dona aquí",
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
    illustration: "ejecutivo",
    cta: "Aprovecha y dona ahora",
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
    illustration: "constructor",
    cta: "La casa no se detiene: dona aquí",
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
    illustration: "policia-calvita",
    cta: "Dona mientras esperas",
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
    illustration: "doctor",
    cta: "Dona y empuja la meta",
  },
  {
    id: "donaciones",
    label: "Bloque de donaciones",
    kind: "full",
    accent: "lime",
    eyebrow: "Dona desde tu celular",
    title: "Cada pieza cuenta",
    subtitle: "Escanea el QR o entra a supercasa.svgvisual.com/donar",
    note: "Llave Bre-B @lasupercasa o cuenta Bancolombia.",
    fields: ["note"],
    when: "Llamados a donar y cierre de metas.",
    visual: "qr",
    cta: "Escanea y dona en 30 segundos",
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
    illustration: "empresaria",
    cta: "Dona en honor a quien te inspira",
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
    illustration: "chef",
    cta: "Dona y sirve una pieza más",
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
    illustration: "piloto",
    cta: "Dona al ritmo de la música",
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
    illustration: "doctora",
    cta: "Dona y cambia una historia",
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
    illustration: "ejecutivo",
    cta: "Dona y sostén el acompañamiento",
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
    illustration: "empresaria",
    cta: "Dona por tu creador favorito",
  },
  {
    id: "casa",
    label: "La casa en vivo",
    kind: "full",
    accent: "cyan",
    eyebrow: "La Supercasa",
    title: "La casa va tomando forma",
    subtitle: "Cada aporte pone una pieza más. Mira cómo avanza en tiempo real.",
    fields: ["note"],
    when: "Mostrar el avance real de la obra durante todo el evento.",
    visual: "house",
    houseLive: true,
    cta: "Dona y haz que la casa avance",
  },
  {
    id: "casa-00",
    label: "La casa · 0%",
    kind: "full",
    accent: "cyan",
    eyebrow: "Paso 1 de 5",
    title: "Así nace La Supercasa",
    subtitle: "El terreno está listo. Hoy empieza a construirse con cada aporte.",
    fields: [],
    when: "Antes de la primera donación o al abrir el evento.",
    visual: "house",
    houseFrame: 0,
    illustration: "constructor",
    cta: "Pon la primera pieza",
  },
  {
    id: "casa-25",
    label: "La casa · 25%",
    kind: "full",
    accent: "lime",
    eyebrow: "Paso 2 de 5",
    title: "Ya se ve la estructura",
    subtitle: "Los primeros aportes levantaron las paredes. Falta la mitad.",
    fields: [],
    when: "Cuando el recaudo llega al 25%.",
    visual: "house",
    houseFrame: 25,
    illustration: "doctora",
    cta: "Dona y levanta el siguiente piso",
  },
  {
    id: "casa-50",
    label: "La casa · 50%",
    kind: "full",
    accent: "yellow",
    eyebrow: "Paso 3 de 5",
    title: "Vamos por la mitad",
    subtitle: "La casa ya tiene forma. Cada pieza que entra se ve.",
    fields: [],
    when: "Cuando el recaudo llega al 50%.",
    visual: "house",
    houseFrame: 50,
    illustration: "chef",
    cta: "Dona y completa la mitad que falta",
  },
  {
    id: "casa-75",
    label: "La casa · 75%",
    kind: "full",
    accent: "fuchsia",
    eyebrow: "Paso 4 de 5",
    title: "Faltan los últimos detalles",
    subtitle: "Puertas, ventanas y acabados. Esto se termina entre todos.",
    fields: [],
    when: "Cuando el recaudo llega al 75%.",
    visual: "house",
    houseFrame: 75,
    illustration: "bombero",
    cta: "Dona y cierra los acabados",
  },
  {
    id: "casa-100",
    label: "La casa · 100%",
    kind: "full",
    accent: "lime",
    eyebrow: "Paso 5 de 5",
    title: "La Supercasa está lista",
    subtitle: "48 horas después, la casa de los Súper Calvitos abre sus puertas.",
    fields: [],
    when: "Meta cumplida y cierre del evento.",
    visual: "house",
    houseFrame: 100,
    illustration: "policia-calvita",
    cta: "Gracias. La casa ya es de ellos",
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
    illustration: "bombero",
    cta: "Dona y desbloquea el reto",
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
    cta: "Dona con los aliados de la casa",
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
    illustrationCluster: ["policia-calvita", "bombero", "doctora"],
    cta: "La campaña sigue: dona aquí",
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
    progressLive: true,
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
  {
    id: "donacion",
    label: "Overlay de donación",
    kind: "overlay",
    accent: "lime",
    eyebrow: "Dona ahora",
    title: "Tu donación construye La Supercasa",
    subtitle: "Escanea el QR, entra al enlace o transfiere por Bre-B.",
    fields: [],
    when: "Sobre el video en los momentos de llamado a donar.",
    visual: "donation-overlay",
  },
  {
    id: "en-vivo-qr",
    label: "En vivo con QR",
    kind: "overlay",
    accent: "fuchsia",
    eyebrow: "En vivo",
    title: "Dona aquí",
    subtitle: "QR y enlace siempre visibles.",
    fields: [],
    when: "Sobre el video durante todo el evento.",
    visual: "live-qr",
  },
  {
    id: "mosca",
    label: "Mosca de horas",
    kind: "overlay",
    accent: "lime",
    eyebrow: "Maratón",
    title: "Hora de la maratón",
    subtitle: "Horas que llevamos y horas que faltan.",
    fields: [],
    when: "Esquina del video durante todo el evento.",
    visual: "mosca",
  },
  {
    id: "fondo-live",
    label: "Fondo para live pequeño",
    kind: "full",
    accent: "cyan",
    eyebrow: "Pantalla completa",
    title: "Live pequeño con información",
    subtitle: "Fondo 1920x1080 para poner el live en 1280x720.",
    fields: [],
    when: "Fondo para entrevistas, análisis o pantalla de espera.",
    visual: "liveframe",
    cta: "Dona aquí",
    progressLive: true,
  },
  {
    id: "marco-live",
    label: "Marco para live pequeño",
    kind: "overlay",
    accent: "cyan",
    eyebrow: "Sobre el video",
    title: "Marco con información",
    subtitle: "Deja el centro transparente para el live de 1280x720.",
    fields: [],
    when: "Encima del video cuando quieras live pequeño con panel de donación.",
    visual: "liveframe",
    progressLive: true,
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
