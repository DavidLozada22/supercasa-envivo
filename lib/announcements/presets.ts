export const LIVE_URL = "https://supercasa.svgvisual.com/envivo";
export const DONATE_URL = "https://supercasa.svgvisual.com/donar";
export const FOUNDATION_URL = "https://segundosdevida.com";

export type ReminderGroup = "Antes del evento" | "Durante el live" | "Después del live";

export type ReminderPreset = {
  id: string;
  group: ReminderGroup;
  title: string;
  when: string;
  subject: string;
  message: string;
  ctaLabel: string;
  ctaUrl: string;
};

export const REMINDER_PRESETS: ReminderPreset[] = [
  {
    id: "antes-24h",
    group: "Antes del evento",
    title: "Falta un día",
    when: "24 horas antes del arranque",
    subject: "Mañana, 48 horas para cambiar una historia",
    message:
      "Mañana a las 6:00 p. m. empieza la maratón que termina La Supercasa. 48 horas, 12 bloques y una sola meta: que los Súper Calvitos tengan su casa. Guarda tu lugar y trae a alguien contigo.",
    ctaLabel: "Reservar mi lugar",
    ctaUrl: LIVE_URL,
  },
  {
    id: "antes-1h",
    group: "Antes del evento",
    title: "Falta una hora",
    when: "1 hora antes",
    subject: "En 1 hora se abre la puerta de La Supercasa",
    message:
      "A las 6:00 p. m. arrancamos. Ya tenemos el set, los invitados y las ganas. Solo falta que estés ahí para empujar la primera meta.",
    ctaLabel: "Entrar al live",
    ctaUrl: LIVE_URL,
  },
  {
    id: "antes-30",
    group: "Antes del evento",
    title: "Media hora",
    when: "30 minutos antes",
    subject: "Media hora. La casa está a punto de despertar",
    message:
      "En 30 minutos empieza la maratón. Entra temprano, mira cómo se arma todo y pon tu primera pieza antes de que suene el arranque.",
    ctaLabel: "Entrar al live",
    ctaUrl: LIVE_URL,
  },
  {
    id: "antes-15",
    group: "Antes del evento",
    title: "Faltan 15 minutos",
    when: "15 minutos antes",
    subject: "En 15 minutos empieza a construirse",
    message:
      "Calienta motores. En 15 minutos la señal abre y la casa empieza a crecer. Cada aporte que entra ahora llega antes del primer bloque.",
    ctaLabel: "Entrar al live",
    ctaUrl: LIVE_URL,
  },
  {
    id: "antes-5",
    group: "Antes del evento",
    title: "Faltan 5 minutos",
    when: "5 minutos antes",
    subject: "5 minutos. Ponte la capa",
    message:
      "Ya casi. En 5 minutos arranca la maratón de 48 horas. Busca el lugar más cómodo y acompáñanos desde el primer minuto.",
    ctaLabel: "Entrar al live",
    ctaUrl: LIVE_URL,
  },
  {
    id: "antes-1",
    group: "Antes del evento",
    title: "Falta 1 minuto",
    when: "1 minuto antes",
    subject: "1 minuto. Ya casi está",
    message:
      "Un minuto para que todo empiece. La casa de los Súper Calvitos está a punto de recibir su primera pieza.",
    ctaLabel: "Entrar al live",
    ctaUrl: LIVE_URL,
  },
  {
    id: "en-vivo",
    group: "Durante el live",
    title: "Estamos en vivo",
    when: "Al abrir la señal",
    subject: "Estamos en vivo. La Supercasa ya empezó",
    message:
      "Abrimos la señal. Durante 48 horas vamos a construir La Supercasa en vivo. Entra, mira el avance y dona desde donde estés.",
    ctaLabel: "Ver la transmisión",
    ctaUrl: LIVE_URL,
  },
  {
    id: "bloque",
    group: "Durante el live",
    title: "Ya viene un bloque",
    when: "Antes de cada bloque ancla",
    subject: "Ya viene el siguiente bloque. No te lo pierdas",
    message:
      "En unos minutos entra un bloque nuevo con retos, invitados y una meta por cumplir. La casa avanza más rápido cuando estás mirando.",
    ctaLabel: "Ver la transmisión",
    ctaUrl: LIVE_URL,
  },
  {
    id: "dona",
    group: "Durante el live",
    title: "Dona aquí",
    when: "Cuando quieras empujar la meta",
    subject: "Tu pieza puede entrar ahora mismo",
    message:
      "Cada aporte pone una pieza real en La Supercasa: una ventana, un baño, una habitación. Dona en línea o transfiere por Bre-B. Tu pieza cuenta hoy.",
    ctaLabel: "Donar ahora",
    ctaUrl: DONATE_URL,
  },
  {
    id: "15h",
    group: "Durante el live",
    title: "Ya vamos 15 horas",
    when: "Sobre la hora 15",
    subject: "15 horas construyendo. La casa ya se ve",
    message:
      "Llevamos 15 horas en vivo y la casa ya muestra su estructura. Falta menos de lo que crees. Suma tu pieza y empuja la siguiente meta.",
    ctaLabel: "Donar ahora",
    ctaUrl: DONATE_URL,
  },
  {
    id: "media",
    group: "Durante el live",
    title: "Vamos por la mitad",
    when: "Sobre la hora 24",
    subject: "Vamos por la mitad. La casa ya tiene forma",
    message:
      "24 horas, miles de historias y una casa que crece. La mitad del camino ya está hecha. La otra mitad depende de los que faltan.",
    ctaLabel: "Donar ahora",
    ctaUrl: DONATE_URL,
  },
  {
    id: "30h",
    group: "Durante el live",
    title: "Ya vamos 30 horas",
    when: "Sobre la hora 30",
    subject: "30 horas en vivo. La meta está cerca",
    message:
      "Llevamos 30 horas sin parar y la casa ya se ve terminada por fuera. Falta el último tramo. Entra al live y ayuda a cerrar la meta.",
    ctaLabel: "Donar ahora",
    ctaUrl: DONATE_URL,
  },
  {
    id: "ultimas-2h",
    group: "Durante el live",
    title: "Quedan 2 horas",
    when: "2 horas antes del cierre",
    subject: "Quedan 2 horas. Este es el último empujón",
    message:
      "La maratón está por cerrar y todavía podemos llegar más lejos. Este es el momento de donar, compartir y sumar a alguien más.",
    ctaLabel: "Donar ahora",
    ctaUrl: DONATE_URL,
  },
  {
    id: "ultimos-min",
    group: "Durante el live",
    title: "Últimos minutos",
    when: "En el cierre del live",
    subject: "Últimos minutos. No dejes la casa a medias",
    message:
      "Quedan pocos minutos de transmisión. Si todavía no has puesto tu pieza, este es el momento. La casa se termina entre todos.",
    ctaLabel: "Donar ahora",
    ctaUrl: DONATE_URL,
  },
  {
    id: "gracias",
    group: "Después del live",
    title: "Gracias por construir",
    when: "Al terminar la maratón",
    subject: "Gracias por construir La Supercasa",
    message:
      "Terminaron 48 horas increíbles. Gracias por acompañar, por donar y por creer en los Súper Calvitos. La campaña sigue abierta hasta el 30 de noviembre: puedes donar, invitar a tu empresa o aportar en especie. Y si quieres conocer la Fundación, agenda una visita.",
    ctaLabel: "Seguir aportando",
    ctaUrl: DONATE_URL,
  },
  {
    id: "campana",
    group: "Después del live",
    title: "La campaña sigue",
    when: "Días después del cierre",
    subject: "La campaña sigue hasta el 30 de noviembre",
    message:
      "La maratón terminó, pero la meta no. Hasta el 30 de noviembre seguimos recibiendo donaciones para terminar los últimos detalles de La Supercasa.",
    ctaLabel: "Donar ahora",
    ctaUrl: DONATE_URL,
  },
  {
    id: "empresas",
    group: "Después del live",
    title: "Empresas aliadas",
    when: "Después del evento",
    subject: "Tu empresa también puede poner una pieza",
    message:
      "Si tu empresa quiere sumarse, puede hacerlo con una donación, con materiales o con una alianza. Escríbenos y armamos la forma de ayudar.",
    ctaLabel: "Conocer la Fundación",
    ctaUrl: FOUNDATION_URL,
  },
  {
    id: "especie",
    group: "Después del live",
    title: "Donación en especie",
    when: "Después del evento",
    subject: "También se puede donar en especie",
    message:
      "Materiales para la casa, muebles, insumos o servicios para los niños. Si tienes algo que pueda servir, escríbenos y coordinamos la entrega.",
    ctaLabel: "Conocer la Fundación",
    ctaUrl: FOUNDATION_URL,
  },
  {
    id: "visita",
    group: "Después del live",
    title: "Agenda una visita",
    when: "Después del evento",
    subject: "Ven a conocer Segundos de Vida",
    message:
      "Queremos mostrarte en persona lo que se construyó. Agenda una visita, conoce la casa y mira cómo tu aporte se convirtió en algo real.",
    ctaLabel: "Agendar una visita",
    ctaUrl: FOUNDATION_URL,
  },
];

export const REMINDER_GROUPS: ReminderGroup[] = [
  "Antes del evento",
  "Durante el live",
  "Después del live",
];
