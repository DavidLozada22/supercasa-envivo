export type AdFormat = 'story' | 'post' | 'carousel';
export type AdTheme = 'cortina' | 'calvito';
export type AdCategory = 'horas' | 'suenos' | 'bloques' | 'donar' | 'carruseles' | 'overlays';
export type QrTarget = 'donate' | 'live';

export interface CreativeSlide {
  id: string;
  slideNumber: number;
  kicker: string;
  headline: string;
  speechBubble?: string;
  body: string;
  giantNumber?: string;
  accentColor?: 'magenta' | 'lime' | 'yellow' | 'cyan';
  urlText: string;
  urlLabel: string;
  isTransparentOverlay?: boolean;
  fullSceneImage?: string;
  characterImage?: string;
  secondaryCharacterImage?: string;
  houseImage?: string;
  secondaryHouseImage?: string;
  showProgressBar?: boolean;
  progressPercent?: number;
  showQr?: boolean;
  defaultQrTarget?: QrTarget;
  scheduleRows?: { time: string; title: string; host: string }[];
  tierRows?: { label: string; amount: string; note: string }[];
}

export interface AdCreative {
  id: string;
  title: string;
  subtitle: string;
  format: AdFormat;
  category: AdCategory;
  defaultTheme: AdTheme;
  defaultAspect: '9:16' | '4:5' | '1:1';
  supportsHourCounter?: boolean;
  defaultHourValue?: string;
  supportsKickHandle?: boolean;
  defaultKickHandle?: string;
  objective: string;
  caption: string;
  slides: CreativeSlide[];
}

export interface ProgramBlockSummary {
  number: string;
  day: string;
  schedule: string;
  title: string;
  host: string;
  challenge: string;
  note?: string;
}

export const CAMPAIGN_CONSTANTS = {
  eventStartIso: '2026-11-20T18:00:00-05:00',
  eventEndIso: '2026-11-22T18:00:00-05:00',
  goalCop: 250_000_000,
  goalUsdApprox: 'US$62,500',
  houseProgressPercent: 60,
  location: 'Cr. 28 Bis #51-33, Galerías, Bogotá',
  foundationName: 'Fundación Segundos de Vida',
  foundationNit: 'NIT 900.649.809-2',
  foundationEmail: 'admonsegundosdevida@hotmail.com',
  foundationPhone: '316 524 6087',
  hashtags: '#SuperNavidad48H #PonteLaCapa #48HorasPorLaSupercasa #SegundosDeVida',
  urls: {
    home: 'https://supercasa.svgvisual.com/',
    donate: 'https://supercasa.svgvisual.com/donar',
    live: 'https://supercasa.svgvisual.com/envivo',
    kavanahIg: 'https://www.instagram.com/kavanahpl35/',
    fsvIg: 'https://www.instagram.com/segundosdevidafundacion/',
  },
  assets: {
    logoFsv: '/assets/aistudio/LOGO_SEGUNDOS_DE_VIDA_e3f7704b.png',
    logoKavanahGoldVertical: '/assets/aistudio/Asset_1_13bfba3d.svg',
    logoKavanahGoldHorizontal: '/assets/aistudio/Asset_10_97f83860.svg',
    logoKavanahWhiteHorizontal: '/img/kavanah-horizontal-white.png',
    logoKavanahBlackHorizontal: '/img/kavanah-horizontal-black.png',
    qrDonate: '/img/qr-donar.png',
    house60: '/img/casa/supercasa-060-1400.webp',
    house100: '/img/casa/supercasa-100-1400.webp',
    houseRender: '/img/supercasa-render.webp',
    calvito: '/img/calvito.webp',
    calvita: '/img/calvita.webp',
    bombero: '/img/calvitos/bombero.webp',
    doctora: '/img/calvitos/doctora.webp',
    piloto: '/img/calvitos/piloto.webp',
    policia: '/img/calvitos/policia-calvita.webp',
    chef: '/img/calvitos/chef.webp',
    constructor: '/img/calvitos/constructor.webp',
    empresaria: '/img/calvitos/empresaria.webp',
    ejecutivo: '/img/calvitos/ejecutivo.webp',
    sceneAstronauta: '/img/scenes/astronauta.jpg',
    scenePintora: '/img/scenes/pintora.jpg',
    sceneGamer: '/img/scenes/gamer.jpg',
    sceneConstruyendo: '/img/scenes/construyendo.jpg',
  },
} as const;

export const WHATSAPP_BROADCAST_MESSAGE = `🚨❤️ ¡MAÑANA 20 DE NOVIEMBRE NOS PONEMOS LA CAPA POR LOS SUPER CALVITOS! ❤️🦸 48 HORAS DE STREAMING SOLIDARIO

Nos unimos en un MULTISTREAM SOLIDARIO para apoyar a la Fundación Segundos de Vida y a los niños que luchan contra el cáncer. Queremos aportar nuestro granito de arena para hacer realidad la Super Casa, un lugar lleno de esperanza para ellos. 🏡✨

No importa desde qué país nos acompañes, qué plataforma utilices o cuántos espectadores tengas. Cada visita, cada difusión y cada aporte puede marcar una diferencia.

🌎 ÚNETE A ESTA MISIÓN:
🏡 Conoce la causa: https://supercasa.svgvisual.com/
🫆 Haz tu donación aquí: https://supercasa.svgvisual.com/donar
📺 Sigue la transmisión solidaria: https://supercasa.svgvisual.com/envivo

❤️ Hoy no competimos por espectadores, nos unimos por sonrisas.
🦁 Organizadores: https://www.instagram.com/kavanahpl35/

Porque los verdaderos héroes no siempre llevan capa… ¡mañana toda la comunidad streamer puede ponerse una!
¡POR LOS SUPER CALVITOS, POR LA VIDA Y POR LA ESPERANZA! 🦸‍♂️❤️`;

export const PROGRAM_BLOCKS: ProgramBlockSummary[] = [
  {
    number: '01',
    day: 'Vie 20 Nov',
    schedule: '18:00 – 22:00',
    title: 'El Gran Inicio: 48 Horas por La Supercasa',
    host: 'Sebas',
    challenge: 'Todos nos rapamos en vivo por los Super Calvitos',
    note: 'Horario tentativo',
  },
  {
    number: '02',
    day: 'Vie 20 – Sáb 21',
    schedule: '22:00 – 02:00',
    title: 'Noche de Desafíos & Risas Sin Filtro',
    host: 'Deivid',
    challenge: 'Retos en vivo decididos por votación y donación',
    note: 'Horario tentativo',
  },
  {
    number: '03',
    day: 'Sáb 21 Nov',
    schedule: '02:00 – 06:00',
    title: 'Desvelo Paranormal: Sobreviviendo a la Madrugada',
    host: 'Luz Gardenia y Libardo',
    challenge: 'Podcast Rock/Metal LATAM + monitoreo cardíaco',
    note: 'Horario tentativo',
  },
  {
    number: '04',
    day: 'Sáb 21 Nov',
    schedule: '06:00 – 10:00',
    title: 'Mañanero con Fe y Café',
    host: 'Cris',
    challenge: 'Consultorio legal en vivo + meta de desayunos',
    note: 'Horario tentativo',
  },
  {
    number: '05',
    day: 'Sáb 21 Nov',
    schedule: '10:00 – 14:00',
    title: 'Copa de Campeones: El Desafío Gamer (Kick)',
    host: 'David',
    challenge: 'Campeonato gamer en vivo por Kick con inscripciones solidarias',
    note: 'Transmisión por Kick + supercasa.svgvisual.com/envivo',
  },
  {
    number: '06',
    day: 'Sáb 21 Nov',
    schedule: '14:00 – 18:00',
    title: 'El Festival de Talentos Kavanah',
    host: 'Paola',
    challenge: 'Muestra de talentos + cocina express solidaria',
    note: 'Horario tentativo',
  },
  {
    number: '07',
    day: 'Sáb 21 Nov',
    schedule: '18:00 – 22:00',
    title: 'La Gran Gala de los Sueños (Noche Estelar)',
    host: 'Sebas',
    challenge: 'Apadrinamiento de las 14 habitaciones en Prime Time',
    note: 'Horario tentativo',
  },
  {
    number: '08',
    day: 'Sáb 21 – Dom 22',
    schedule: '22:00 – 02:00',
    title: 'Retro Arcade & Noche de Leyendas',
    host: 'Deivid',
    challenge: 'Torneo Street Fighter / Mario Kart 80s & 90s',
    note: 'Horario tentativo',
  },
  {
    number: '09',
    day: 'Dom 22 Nov',
    schedule: '02:00 – 06:00',
    title: 'Maratón Extrema: Reto Speedrun',
    host: 'Libardo',
    challenge: 'Reto contra el reloj con ayudas por donación',
    note: 'Horario tentativo',
  },
  {
    number: '10',
    day: 'Dom 22 Nov',
    schedule: '06:00 – 10:00',
    title: 'Despertar Solidario: Historias que Inspiran',
    host: 'Cris y Luz Gardenia',
    challenge: 'Especial Carnaval de Riosucio + meta línea blanca',
    note: 'Horario tentativo',
  },
  {
    number: '11',
    day: 'Dom 22 Nov',
    schedule: '10:00 – 14:00',
    title: 'El Desafío de Creadores: Batalla por una Causa',
    host: 'Paola',
    challenge: 'Batalla de fandoms, retos físicos y trivias',
    note: 'Horario tentativo',
  },
  {
    number: '12',
    day: 'Dom 22 Nov',
    schedule: '14:00 – 18:00',
    title: 'El Gran Cierre: La Cumbre de la Esperanza',
    host: 'Equipo Kavanah + FSV',
    challenge: 'Meta global final + apertura simbólica de la Supercasa',
    note: 'Horario tentativo',
  },
];

export const AD_CREATIVES: AdCreative[] = [
  // ==================== SUEÑOS Y PROFESIONES 3D (DIRECTOS CON GLOBO CARICATURA) ====================
  {
    id: 'story-piloto-sueno',
    title: 'Historia · Sueño de Piloto (Globo Caricatura)',
    subtitle: 'Ilustración directa sobre el fondo cielo, texto gigante y globo de diálogo',
    format: 'story',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '9:16',
    objective: 'Empatía y donación directa',
    caption: `✈️ ¡Tu aporte me acerca más a cumplir mi sueño de ser piloto!
Para seguir soñando en grande, los Super Calvitos necesitan un hogar seguro mientras dura su tratamiento en Bogotá.

La Supercasa ya está al 60%. Pon tu pieza desde $20.000 en:
🫆 supercasa.svgvisual.com/donar
🏡 Conoce la causa: supercasa.svgvisual.com

#SuperNavidad48H #PonteLaCapa #48HorasPorLaSupercasa #SegundosDeVida`,
    slides: [
      {
        id: 'story-piloto-sueno-s1',
        slideNumber: 1,
        kicker: 'LOS SUPER CALVITOS SUEÑAN EN GRANDE',
        headline: 'Tu aporte construye su futuro',
        speechBubble: '¡Tu aporte me acerca más a cumplir mi sueño de ser piloto! ✈️',
        body: 'Ayúdanos a terminar el 40% restante de La Supercasa en Bogotá.',
        accentColor: 'yellow',
        urlLabel: 'PON TU PIEZA AQUÍ',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.piloto,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-astronauta-sueno',
    title: 'Historia 3D · Sueño de Astronauta (Escena 3D)',
    subtitle: 'Nueva escena 3D generada con cohete y globo de diálogo caricatura',
    format: 'story',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '9:16',
    objective: 'Emocionar y convertir donantes en Stories',
    caption: `🚀✨ ¡Hasta las estrellas con los Super Calvitos!
Cada peso que donas ayuda a terminar La Supercasa en Bogotá para 15 niños que luchan contra el cáncer.

🫆 Dona desde $20.000: supercasa.svgvisual.com/donar
🏡 Conoce la causa: supercasa.svgvisual.com

#SuperNavidad48H #PonteLaCapa #SegundosDeVida`,
    slides: [
      {
        id: 'story-astronauta-sueno-s1',
        slideNumber: 1,
        kicker: 'SUEÑAN SIN LÍMITES · BOGOTÁ',
        headline: '¡Despeguemos juntos su hogar!',
        speechBubble: '¡Tu aporte me acerca más a ser astronauta y seguir luchando! 🚀',
        body: 'Meta: terminar el 40% de La Supercasa.',
        accentColor: 'cyan',
        urlLabel: 'HAZ TU DONACIÓN EN',
        urlText: 'supercasa.svgvisual.com/donar',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.sceneAstronauta,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-pintora-pieza',
    title: 'Historia 3D · Calvita Pintora (Escena 3D)',
    subtitle: 'Escena 3D pintando la casa para invitar a donar pintura o ventanas',
    format: 'story',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '9:16',
    objective: 'Microdonaciones de $20k y $50k',
    caption: `🎨🏡 ¡Llenemos de color La Supercasa!
Con $50.000 COP regalas la pintura de una pared y con $100.000 la ventana de un cuarto.

Escanea el QR o entra directo a:
👉 supercasa.svgvisual.com/donar

#LaSupercasa #SuperNavidad48H #SegundosDeVida`,
    slides: [
      {
        id: 'story-pintora-pieza-s1',
        slideNumber: 1,
        kicker: 'PINTEMOS SU HOGAR JUNTOS',
        headline: 'Falta tu color en La Supercasa',
        speechBubble: '¡Con $50.000 pintas mi cuarto y con $100.000 pones mi ventana! 🎨',
        body: 'Tarjetas, PSE, Nequi, Daviplata o Bancolombia.',
        accentColor: 'yellow',
        urlLabel: 'PON TU PIEZA AQUÍ',
        urlText: 'supercasa.svgvisual.com/donar',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.scenePintora,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-doctora-sueno',
    title: 'Historia · Sueño de Doctora (Globo Caricatura)',
    subtitle: 'Calvita doctora directa sobre el fondo con mensaje cercano',
    format: 'story',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '9:16',
    objective: 'Apadrinar habitaciones y ventanas',
    caption: `🩺 Quiero ser doctora para cuidar a otros niños como yo.
Hoy necesitamos un lugar seguro donde descansar con mamá después de cada quimio en Bogotá.

Pon una ventana ($100.000), pintura ($50.000) o tu aporte desde $20.000:
👉 supercasa.svgvisual.com/donar

#PonteLaCapa #SuperNavidad48H #SegundosDeVida`,
    slides: [
      {
        id: 'story-doctora-sueno-s1',
        slideNumber: 1,
        kicker: 'POR LOS SUPER CALVITOS',
        headline: 'Quiero ser doctora. ¿Me ayudas?',
        speechBubble: 'Con tu donación tendremos una habitación tibia junto a mamá 🩺💛',
        body: 'Cada pieza acerca a 15 niños a su hogar.',
        accentColor: 'magenta',
        urlLabel: 'PON TU PIEZA AQUÍ',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.doctora,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-bombero-sueno',
    title: 'Historia · Sueño de Bombero (Cortina 48H)',
    subtitle: 'Calvito bombero directo sobre cortina diagonal 48H',
    format: 'story',
    category: 'suenos',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    objective: 'Conversión en vivo durante maratón',
    caption: `🚒 Los verdaderos héroes no llevan capa, ¡ponen piezas para La Supercasa!
Acompáñanos en las 48 horas de transmisión solidaria y ayuda a construir el hogar de 15 niños en tratamiento contra el cáncer.

📺 Mira el en vivo: supercasa.svgvisual.com/envivo
🫆 Haz tu donación: supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa #SegundosDeVida`,
    slides: [
      {
        id: 'story-bombero-sueno-s1',
        slideNumber: 1,
        kicker: '48 HORAS DE STREAMING SOLIDARIO',
        headline: '¡Ponte la capa por nuestros héroes!',
        speechBubble: '¡Quiero ser bombero! Tu aporte nos da fuerza cada día 🚒❤️',
        body: 'Transmisión continua del 20 al 22 de noviembre.',
        giantNumber: '48H',
        accentColor: 'magenta',
        urlLabel: 'MIRA EL VIVO Y DONA',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.bombero,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-chef-sueno',
    title: 'Historia · Sueño de Chef y Cocina (Globo Caricatura)',
    subtitle: 'Calvito chef directo sobre el fondo hablando de la cocina de mamá',
    format: 'story',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '9:16',
    objective: 'Recaudar para cocina y alimentación',
    caption: `🍲 Cuando llegamos a Bogotá por el tratamiento, lo que más anhelamos es un plato hecho por mamá.
Tu aporte hoy ayuda a equipar la cocina de La Supercasa.

Dona desde $20.000 con Wompi, Nequi, PSE o Bancolombia:
👉 supercasa.svgvisual.com/donar

#LaSupercasa #SuperNavidad48H #SegundosDeVida`,
    slides: [
      {
        id: 'story-chef-sueno-s1',
        slideNumber: 1,
        kicker: 'EQUIPEMOS LA COCINA DE LA SUPERCASA',
        headline: 'Un hogar con sabor a casa',
        speechBubble: '¡Quiero ser chef! Con tu aporte mamá podrá cocinar mi plato favorito 🍲',
        body: 'Falta poco para completar el 100% en Galerías, Bogotá.',
        accentColor: 'yellow',
        urlLabel: 'APORTA DESDE $20.000 EN',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.chef,
        showQr: true,
      },
    ],
  },
  {
    id: 'post-piloto-sueno',
    title: 'Post 4:5 · Tu aporte acerca a un niño a ser piloto',
    subtitle: 'Post de alto impacto emocional sin recuadros, texto gigante y globo',
    format: 'post',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '4:5',
    objective: 'Alcance orgánico y compartidos en Feed',
    caption: `✈️ Los Super Calvitos ya saben qué quieren ser cuando sean grandes.
Para llegar allá, hoy necesitan un hogar donde descansar entre citas médicas y quimioterapias en Bogotá.

La Supercasa va al 60%. Con tu granito de arena la terminamos juntos.
🏡 Conoce la causa: supercasa.svgvisual.com
🫆 Dona aquí: supercasa.svgvisual.com/donar

#PonteLaCapa #SuperNavidad48H #SegundosDeVida #SuperCalvitos`,
    slides: [
      {
        id: 'post-piloto-sueno-s1',
        slideNumber: 1,
        kicker: 'SUEÑAN EN GRANDE · BOGOTÁ',
        headline: 'Tu aporte lo acerca a su sueño',
        speechBubble: '¡Tu aporte me acerca más a cumplir mi sueño de ser piloto! ✈️',
        body: '15 niños y sus familias esperan terminar La Supercasa (60% listo).',
        accentColor: 'yellow',
        urlLabel: 'CONOCE Y DONA AQUÍ',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.piloto,
        showQr: true,
      },
    ],
  },
  {
    id: 'post-construyendo-3d',
    title: 'Post 4:5 · Escena 3D Construyendo La Supercasa',
    subtitle: 'Dos Super Calvitos 3D construyendo la casita juntos con globo de diálogo',
    format: 'post',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '4:5',
    objective: 'Post principal de invitación a construir',
    caption: `🧱🏡 ¡Estamos al 60% construyendo La Supercasa!
Cada ladrillo, ventana y donación acerca a 15 niños y sus mamás a tener su hogar en Bogotá.

🏡 Conoce la causa: supercasa.svgvisual.com
🫆 Pon tu pieza aquí: supercasa.svgvisual.com/donar

#LaSupercasa #PonteLaCapa #SuperNavidad48H #SegundosDeVida`,
    slides: [
      {
        id: 'post-construyendo-3d-s1',
        slideNumber: 1,
        kicker: 'MISIÓN SUPERCASA · 60% CONSTRUIDO',
        headline: '¡Pon tu pieza y terminemos la casa!',
        speechBubble: '¡Cada ladrillo que pones nos da un hogar seguro en Bogotá! 🧱💛',
        body: 'Dona desde $20.000 COP con Wompi, Nequi, PSE o Bancolombia.',
        accentColor: 'yellow',
        urlLabel: 'PON TU PIEZA AQUÍ',
        urlText: 'supercasa.svgvisual.com/donar',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.sceneConstruyendo,
        showQr: true,
      },
    ],
  },

  // ==================== HISTORIAS EN VIVO: YA VAMOS X HORAS ====================
  {
    id: 'story-vamos-horas',
    title: 'Historia Dinámica · ¡Ya vamos X horas en vivo!',
    subtitle: 'Personaliza las horas al instante: 5, 7, 10, 12, 22, 24, 36 o 50+',
    format: 'story',
    category: 'horas',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    supportsHourCounter: true,
    defaultHourValue: '12',
    objective: 'Actualizaciones en tiempo real durante toda la maratón',
    caption: `🔥 ¡YA LLEVAMOS {HORAS} HORAS DE STREAMING SOLIDARIO SIN PARAR!
Seguimos transmitiendo en vivo por los Super Calvitos de la Fundación @segundosdevidafundacion junto a @kavanahpl35.

¿Ya pusiste tu pieza en La Supercasa? Cada minuto cuenta:
📺 Mira el en vivo: supercasa.svgvisual.com/envivo
🫆 Haz tu donación: supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa #SuperNavidad48H`,
    slides: [
      {
        id: 'story-vamos-horas-s1',
        slideNumber: 1,
        kicker: 'EN VIVO AHORA · MARATÓN SOLIDARIA',
        headline: '¡Ya vamos {HORAS} horas al aire!',
        speechBubble: '¡No paramos hasta terminar La Supercasa! Súmate ahora ❤️',
        body: 'La transmisión sigue encendida. Entra, difunde o pon tu pieza hoy.',
        giantNumber: '{HORAS}H',
        accentColor: 'magenta',
        urlLabel: 'SIGUE LA TRANSMISIÓN EN',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.constructor,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-vamos-5h',
    title: 'Historia · ¡Ya vamos 5 horas! Arranque encendido',
    subtitle: 'Primer corte de 5 horas al aire para atraer audiencia',
    format: 'story',
    category: 'horas',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    supportsHourCounter: true,
    defaultHourValue: '5',
    objective: 'Impulso inicial de las primeras horas',
    caption: `⚡ ¡YA VAMOS 5 HORAS EN VIVO POR LA SUPERCASA!
Gracias a todos los que están conectados desde el minuto uno. Todavía nos quedan 43 horas de retos, risas y solidaridad.

📺 Conéctate: supercasa.svgvisual.com/envivo
🫆 Pon tu pieza: supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa`,
    slides: [
      {
        id: 'story-vamos-5h-s1',
        slideNumber: 1,
        kicker: 'MARATÓN EN CURSO · DÍA 1',
        headline: '¡Ya vamos 5 horas sin parar!',
        speechBubble: '¡Apenas calentamos motores! Faltan 43 horas de solidaridad 🔥',
        body: 'Cada visita y cada donación suma una pieza nueva a la casa.',
        giantNumber: '05H',
        accentColor: 'lime',
        urlLabel: 'MIRA EL EN VIVO AQUÍ',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.bombero,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-vamos-24h',
    title: 'Historia · ¡24 Horas! Mitad de la Maratón',
    subtitle: 'Hito de medio camino: 24h completadas, 24h por delante',
    format: 'story',
    category: 'horas',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    supportsHourCounter: true,
    defaultHourValue: '24',
    objective: 'Reencender donaciones a la mitad del evento',
    caption: `🚨 ¡LLEGAMOS A LAS 24 HORAS EN VIVO! MITAD DEL CAMINO 🔥❤️
Llevamos un día entero transmitiendo sin pausa por los niños de @segundosdevidafundacion.

¡Ahora vamos por las 24 horas finales! Si no has donado todavía, este es tu momento:
🫆 supercasa.svgvisual.com/donar
📺 supercasa.svgvisual.com/envivo

#48HorasPorLaSupercasa #PonteLaCapa #SuperNavidad48H`,
    slides: [
      {
        id: 'story-vamos-24h-s1',
        slideNumber: 1,
        kicker: 'MITAD DE LA MARATÓN · 24 / 48 HORAS',
        headline: '¡24 horas de pura solidaridad!',
        speechBubble: '¡Llegamos a la mitad! ¿Nos ayudas con el último empujón? 🦸',
        body: 'Nos quedan 24 horas para acercarnos a la meta de La Supercasa.',
        giantNumber: '24H',
        accentColor: 'yellow',
        urlLabel: 'PON TU PIEZA HOY EN',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.policia,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-vamos-50h',
    title: 'Historia · ¡Recta Final! 48+ / 50+ Horas Extendidas',
    subtitle: 'Para las últimas horas o si superan las 48 horas en vivo',
    format: 'story',
    category: 'horas',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    supportsHourCounter: true,
    defaultHourValue: '50',
    objective: 'Cierre épico de recaudación',
    caption: `⏰🔥 ¡YA PASAMOS LAS {HORAS} HORAS EN VIVO POR LA SUPERCASA!
Últimos minutos para sumar tu granito de arena por los Super Calvitos. ¡Cada $20.000 cuenta muchísimo en el cierre!

🫆 Dona ya en: supercasa.svgvisual.com/donar
📺 Mira el cierre en vivo: supercasa.svgvisual.com/envivo

#SuperNavidad48H #PonteLaCapa #SegundosDeVida`,
    slides: [
      {
        id: 'story-vamos-50h-s1',
        slideNumber: 1,
        kicker: 'RECTA FINAL · CIERRE EN VIVO',
        headline: '¡Ya vamos {HORAS} horas en vivo!',
        speechBubble: '¡Último impulso! Ayúdanos a cerrar con broche de oro 🏡✨',
        body: 'Cada aporte de última hora se convierte en habitaciones y esperanza.',
        giantNumber: '{HORAS}H',
        accentColor: 'magenta',
        urlLabel: 'ÚLTIMAS HORAS · DONA EN',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.doctora,
        showQr: true,
      },
    ],
  },

  // ==================== BLOQUES EN VIVO + KICK DE DAVID ====================
  {
    id: 'story-empieza-inicio',
    title: 'Historia · ¡Ya empezamos! El Gran Inicio (Rapada)',
    subtitle: 'Cortina vertical previa al arranque del Bloque 01 (Viernes 6:00 p. m.)',
    format: 'story',
    category: 'bloques',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    objective: 'Convocar al arranque 6:00 p. m. Bogotá',
    caption: `🚨 ¡ARRANCAMOS EN MINUTOS!
Bloque 01 · El Gran Inicio de las 48 HORAS por La Supercasa con Sebas y todo el equipo.
🔥 Reto de apertura: ¡Todos nos rapamos en vivo por los Super Calvitos!

📺 Entra ya a: supercasa.svgvisual.com/envivo
🏡 Conoce la causa: supercasa.svgvisual.com

#PonteLaCapa #48HorasPorLaSupercasa`,
    slides: [
      {
        id: 'story-empieza-inicio-s1',
        slideNumber: 1,
        kicker: 'YA VAMOS A EMPEZAR · BLOQUE 01',
        headline: 'El Gran Inicio: ¡Nos rapamos en vivo!',
        speechBubble: '¡Viernes 6:00 p. m. arranca la locura solidaria! 🦸',
        body: 'Conduce Sebas e invitados especiales. Reto: todos calvos en vivo.',
        giantNumber: '01',
        accentColor: 'magenta',
        urlLabel: 'TRANSMISIÓN EN VIVO EN',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.constructor,
        showQr: false,
      },
    ],
  },
  {
    id: 'story-empieza-desafios',
    title: 'Historia · Ya empieza Noche de Desafíos & Risas',
    subtitle: 'Aviso para el Bloque 02 nocturno (10:00 p. m. – 2:00 a. m.)',
    format: 'story',
    category: 'bloques',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    objective: 'Sintonía bloque nocturno',
    caption: `🎮😂 ¡YA VA A EMPEZAR LA NOCHE DE DESAFÍOS & RISAS SIN FILTRO!
Con Deivid · Retos en vivo decididos por la audiencia con cada donación.

📺 Míralo en vivo: supercasa.svgvisual.com/envivo
🫆 Manda tu reto donando: supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa`,
    slides: [
      {
        id: 'story-empieza-desafios-s1',
        slideNumber: 1,
        kicker: 'YA VAMOS A EMPEZAR · BLOQUE 02',
        headline: 'Noche de Desafíos & Risas',
        speechBubble: '¡Tú decides los retos en vivo con tu donación! 😂🔥',
        body: '10:00 p. m. a 2:00 a. m. (Hora Bogotá) · Retos y Party Games.',
        giantNumber: '02',
        accentColor: 'lime',
        urlLabel: 'MIRA EL EN VIVO EN',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.calvito,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-copa-gamer-kick',
    title: 'Historia 3D · Copa de Campeones Gamer (Kick)',
    subtitle: 'Escena 3D gamer exclusiva con audífonos lima + @usuario de Kick editable',
    format: 'story',
    category: 'bloques',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    supportsKickHandle: true,
    defaultKickHandle: 'deivid',
    objective: 'Llevar comunidad gamer de Kick a donar',
    caption: `🏆🎮 ¡YA EMPIEZA LA COPA DE CAMPEONES: EL DESAFÍO GAMER!
Acompaña a David en vivo por Kick (@{KICK}) dentro de las 48 Horas por La Supercasa.
Inscripciones y aportes solidarios para terminar el hogar de los Super Calvitos.

🟢 Transmisión Kick: kick.com/{KICK}
📺 En vivo oficial: supercasa.svgvisual.com/envivo
🫆 Dona aquí: supercasa.svgvisual.com/donar

#CopaSupercasa #PonteLaCapa #48HorasPorLaSupercasa`,
    slides: [
      {
        id: 'story-copa-gamer-kick-s1',
        slideNumber: 1,
        kicker: 'EN VIVO POR KICK: @{KICK} · BLOQUE 05',
        headline: 'Copa de Campeones Gamer',
        speechBubble: '¡Únete en Kick (@{KICK}) y apoya con tu donación en el torneo! 🎮🏆',
        body: 'Desafío Gamer de David · Sábado 10:00 a. m. (Bogotá).',
        accentColor: 'lime',
        urlLabel: 'KICK @{KICK} Y EN VIVO EN',
        urlText: 'supercasa.svgvisual.com/envivo',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.sceneGamer,
        showQr: true,
      },
    ],
  },
  {
    id: 'post-copa-gamer-kick',
    title: 'Post 4:5 · Copa de Campeones Gamer en Kick',
    subtitle: 'Escena 3D gamer para anunciar el torneo de David con su @ de Kick',
    format: 'post',
    category: 'bloques',
    defaultTheme: 'cortina',
    defaultAspect: '4:5',
    supportsKickHandle: true,
    defaultKickHandle: 'deivid',
    objective: 'Difusión del torneo gamer en redes',
    caption: `🎮🔥 ¡TORNEO SOLIDARIO EN KICK POR LA SUPERCASA!
Participa o apoya en la Copa de Campeones: El Desafío Gamer con David en Kick (@{KICK}).
Todo lo recaudado va directo a construir La Supercasa de la Fundación @segundosdevidafundacion.

🟢 Kick: kick.com/{KICK}
📺 Web oficial: supercasa.svgvisual.com/envivo
🫆 Donar: supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa #Kick`,
    slides: [
      {
        id: 'post-copa-gamer-kick-s1',
        slideNumber: 1,
        kicker: 'ESPECIAL GAMER · KICK @{KICK}',
        headline: 'Copa de Campeones: Desafío Gamer',
        speechBubble: '¡Juega y apoya por los Super Calvitos en Kick @{KICK}! 🎮',
        body: 'Sábado 21 Nov · 10:00 a. m. (Bogotá). Conduce David.',
        accentColor: 'lime',
        urlLabel: 'EN VIVO POR KICK Y EN',
        urlText: 'supercasa.svgvisual.com/envivo',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.sceneGamer,
        showQr: true,
      },
    ],
  },
  {
    id: 'post-afiche-oficial-48h',
    title: 'Post 4:5 · Afiche Oficial: 48 Horas por La Supercasa',
    subtitle: 'Póster principal estilo cortina + Calvitos directos para fijar en perfil',
    format: 'post',
    category: 'bloques',
    defaultTheme: 'cortina',
    defaultAspect: '4:5',
    objective: 'Publicación ancla fijada en Instagram',
    caption: `🚨❤️ ¡ESTE 20, 21 Y 22 DE NOVIEMBRE NOS PONEMOS LA CAPA POR LOS SUPER CALVITOS! ❤️🦸‍♂️
48 HORAS DE STREAMING SOLIDARIO junto a @kavanahpl35 a beneficio de @segundosdevidafundacion.

📅 Viernes 20 nov, 6:00 p. m. → Domingo 22 nov, 6:00 p. m. (Hora Bogotá)
🏡 Conoce la causa: supercasa.svgvisual.com
📺 Transmisión en vivo: supercasa.svgvisual.com/envivo
🫆 Donaciones: supercasa.svgvisual.com/donar

#SuperNavidad48H #PonteLaCapa #48HorasPorLaSupercasa`,
    slides: [
      {
        id: 'post-afiche-oficial-48h-s1',
        slideNumber: 1,
        kicker: 'VIE 20 NOV 6:00 P. M. → DOM 22 NOV 6:00 P. M.',
        headline: '48 Horas de Streaming por La Supercasa',
        speechBubble: '¡No competimos por viewers, nos unimos por sonrisas! ❤️',
        body: 'Multistream solidario para terminar el 40% restante de la casa.',
        giantNumber: '48H',
        accentColor: 'magenta',
        urlLabel: 'CONOCE LA CAUSA Y MIRA EL LIVE',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.constructor,
        secondaryCharacterImage: CAMPAIGN_CONSTANTS.assets.doctora,
        showQr: true,
      },
    ],
  },

  // ==================== DONACIONES DIRECTAS Y OBRA 60% ====================
  {
    id: 'story-como-donar',
    title: 'Historia · ¿Cómo donar? Pon tu pieza aquí',
    subtitle: 'Estilo cortina donaciones.png: QR grande, cero botones web, Wompi/Nequi/Bancolombia',
    format: 'story',
    category: 'donar',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    objective: 'Conversión rápida con QR y URL clara',
    caption: `🫆💛 ¿CÓMO DONAR EN 30 SEGUNDOS?
1️⃣ Entra a supercasa.svgvisual.com/donar (o escanea el QR)
2️⃣ Elige tu pieza desde $20.000 COP (o el valor que tu corazón diga)
3️⃣ Paga seguro con Nequi, Daviplata, PSE, Tarjeta, Llave Bre-B o cuenta Bancolombia.

Fundación Segundos de Vida · NIT 900.649.809-2
#SuperNavidad48H #PonteLaCapa #SegundosDeVida`,
    slides: [
      {
        id: 'story-como-donar-s1',
        slideNumber: 1,
        kicker: 'DONA DESDE TU CELULAR EN 30 SEGUNDOS',
        headline: 'Cada pieza cuenta. Pon la tuya hoy.',
        body: 'Tarjetas, PSE, Nequi, Daviplata, Llave Bre-B o Bancolombia (NIT 900.649.809-2).',
        giantNumber: '60%',
        accentColor: 'magenta',
        urlLabel: 'ESCANEA EL QR O ENTRA A',
        urlText: 'supercasa.svgvisual.com/donar',
        showQr: true,
        tierRows: [
          { label: 'Material de instalación', amount: '$20.000', note: 'Suma tu granito' },
          { label: 'Pintura de una pared', amount: '$50.000', note: 'Color y alegría' },
          { label: 'Ventana de un cuarto', amount: '$100.000', note: 'Pieza estrella' },
        ],
      },
    ],
  },
  {
    id: 'story-obra-60-hoy',
    title: 'Historia · La Supercasa va al 60% (Falta 40%)',
    subtitle: 'Foto real de la obra gris al 60% + barra gigante sin cajas de botón',
    format: 'story',
    category: 'donar',
    defaultTheme: 'calvito',
    defaultAspect: '9:16',
    objective: 'Transparencia visual y urgencia de obra',
    caption: `🏗️🏡 ¡LA SUPERCASA YA ESTÁ AL 60%!
La estructura ya está de pie en Galerías, Bogotá (Cr. 28 Bis #51-33).
Ahora necesitamos tu ayuda para terminar el 40% restante: cocina, 14 habitaciones, baños y jardín en la azotea.

Pon tu pieza aquí: supercasa.svgvisual.com/donar
Conoce la causa: supercasa.svgvisual.com

#LaSupercasa #SuperNavidad48H #SegundosDeVida`,
    slides: [
      {
        id: 'story-obra-60-hoy-s1',
        slideNumber: 1,
        kicker: 'AVANCE REAL EN GALERÍAS, BOGOTÁ',
        headline: 'Ya está al 60%. Solo faltas tú.',
        speechBubble: '¡Ayúdanos a terminar el último 40% de nuestra casa! 🧱💛',
        body: 'Meta total: $250.000.000 COP para recibir a 15 niños y sus mamás.',
        accentColor: 'yellow',
        urlLabel: 'PON TU PIEZA AQUÍ',
        urlText: 'supercasa.svgvisual.com/donar',
        houseImage: CAMPAIGN_CONSTANTS.assets.house60,
        showProgressBar: true,
        progressPercent: 60,
        showQr: true,
      },
    ],
  },
  {
    id: 'post-hoy-vs-terminada',
    title: 'Post 4:5 · La Casa Hoy (60%) vs Terminada (100%)',
    subtitle: 'Comparativa lado a lado que muestra el impacto real de cada donación',
    format: 'post',
    category: 'donar',
    defaultTheme: 'calvito',
    defaultAspect: '4:5',
    objective: 'Confianza y donación de alto valor',
    caption: `🏡✨ Así se ve La Supercasa HOY (60% construida) y así quedará TERMINADA contigo.
En el corazón de Galerías, Bogotá, 15 Super Calvitos y sus mamás tendrán cocina, habitaciones seguras, sala de juegos y jardín en la azotea.

Conoce la causa: supercasa.svgvisual.com
Haz tu donación: supercasa.svgvisual.com/donar

#LaSupercasa #SegundosDeVida #PonteLaCapa`,
    slides: [
      {
        id: 'post-hoy-vs-terminada-s1',
        slideNumber: 1,
        kicker: 'TRANSPARENCIA · CR. 28 BIS #51-33, BOGOTÁ',
        headline: 'Al 60% hoy. Al 100% contigo.',
        body: 'Cada peso se convierte en ventanas, habitaciones y hogar para 15 familias.',
        accentColor: 'yellow',
        urlLabel: 'CONOCE LA OBRA Y DONA',
        urlText: 'supercasa.svgvisual.com/donar',
        houseImage: CAMPAIGN_CONSTANTS.assets.house60,
        secondaryHouseImage: CAMPAIGN_CONSTANTS.assets.house100,
        showProgressBar: true,
        progressPercent: 60,
        showQr: true,
      },
    ],
  },
  {
    id: 'post-que-puedes-donar',
    title: 'Post 1:1 · ¿Qué pieza quieres poner hoy?',
    subtitle: 'Catálogo gráfico claro de aportes desde $20.000 hasta $1.000.000',
    format: 'post',
    category: 'donar',
    defaultTheme: 'calvito',
    defaultAspect: '1:1',
    objective: 'Claridad en montos de donación',
    caption: `🧱 ¿Qué pieza de La Supercasa puedes poner hoy?
🔧 $20.000 · Material de instalación
🎨 $50.000 · Pintura de una pared
🪟 $100.000 · Ventana de un cuarto
🚿 $250.000 · Un baño completo
🛏️ $1.000.000 · Habitación equipada (o cualquier valor que nazca de tu corazón)

Dona fácil en supercasa.svgvisual.com/donar · NIT 900.649.809-2
#PonteLaCapa #SuperNavidad48H #SegundosDeVida`,
    slides: [
      {
        id: 'post-que-puedes-donar-s1',
        slideNumber: 1,
        kicker: 'PON TU PIEZA · WOMPI / NEQUI / PSE / BANCOLOMBIA',
        headline: 'Tú eliges cómo construirla',
        body: 'Certificado oficial de donación (Fundación Segundos de Vida · NIT 900.649.809-2).',
        accentColor: 'yellow',
        urlLabel: 'ELIGE TU PIEZA EN',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.empresaria,
        showQr: true,
        tierRows: [
          { label: 'Material / Pintura', amount: '$20k – $50k', note: 'Cada aporte cuenta' },
          { label: 'Ventana / Baño completo', amount: '$100k – $250k', note: 'Pieza clave de obra' },
          { label: 'Habitación equipada', amount: '$1.000.000', note: 'Niño + cuidador' },
        ],
      },
    ],
  },

  // ==================== CARRUSELES DE 5 SLIDES (4:5 · 1080x1350) ====================
  {
    id: 'carousel-historia-supercasa',
    title: 'Carrusel 01 · Historia de La Supercasa (5 Slides)',
    subtitle: 'Storytelling con sueños 3D, obra al 60%, maratón 48H y QR de donación',
    format: 'carousel',
    category: 'carruseles',
    defaultTheme: 'calvito',
    defaultAspect: '4:5',
    objective: 'Educar sobre la causa y convertir en el slide 5',
    caption: `🏡✨ Desliza para conocer qué es La Supercasa y por qué transmitimos 48 HORAS SEGUIDAS este 20, 21 y 22 de noviembre.

La casa ya está al 60% en Galerías, Bogotá. Falta tu pieza para que 15 Super Calvitos y sus mamás tengan un hogar mientras dura su tratamiento.

🫆 Dona hoy: supercasa.svgvisual.com/donar
📺 Mira el vivo: supercasa.svgvisual.com/envivo

#SuperNavidad48H #PonteLaCapa #SegundosDeVida`,
    slides: [
      {
        id: 'car1-s1',
        slideNumber: 1,
        kicker: 'SLIDE 1 / 5 · CONOCE LA CAUSA',
        headline: '¿Por qué hacemos 48 horas en vivo?',
        speechBubble: '¡Hola! Estamos construyendo mi casa en Bogotá. ¿Nos ayudas? 🦸',
        body: 'Desliza y conoce la historia detrás de La Supercasa.',
        accentColor: 'yellow',
        urlLabel: 'DESLIZA LA HISTORIA →',
        urlText: 'supercasa.svgvisual.com/',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.sceneConstruyendo,
      },
      {
        id: 'car1-s2',
        slideNumber: 2,
        kicker: 'SLIDE 2 / 5 · SUS SUEÑOS',
        headline: 'Un hogar para seguir soñando en grande',
        speechBubble: '¡Tu aporte me acerca más a cumplir mi sueño de ser piloto! ✈️',
        body: '15 niños con cáncer y sus mamás tendrán habitaciones, cocina y sala de juegos.',
        accentColor: 'yellow',
        urlLabel: 'SIGUIENTE →',
        urlText: 'supercasa.svgvisual.com/',
        characterImage: CAMPAIGN_CONSTANTS.assets.piloto,
      },
      {
        id: 'car1-s3',
        slideNumber: 3,
        kicker: 'SLIDE 3 / 5 · OBRA REAL AL 60%',
        headline: 'La estructura ya está de pie al 60%',
        body: 'En Cr. 28 Bis #51-33 (Galerías, Bogotá) falta el 40%: fachada, instalaciones, 14 habitaciones y jardín.',
        giantNumber: '60%',
        accentColor: 'lime',
        urlLabel: 'FALTA EL 40% →',
        urlText: 'supercasa.svgvisual.com/donar',
        houseImage: CAMPAIGN_CONSTANTS.assets.house60,
        showProgressBar: true,
        progressPercent: 60,
      },
      {
        id: 'car1-s4',
        slideNumber: 4,
        kicker: 'SLIDE 4 / 5 · MARATÓN 48H',
        headline: '48 horas continuas por sus sonrisas',
        speechBubble: '¡Desde el viernes 20 a las 6 p. m. hasta el domingo 22! 📺',
        body: 'Retos en vivo, Copa Gamer en Kick, talentos y gala de habitaciones junto a Familia Kavanah.',
        giantNumber: '48H',
        accentColor: 'magenta',
        urlLabel: 'SIGUE EL STREAM →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.bombero,
      },
      {
        id: 'car1-s5',
        slideNumber: 5,
        kicker: 'SLIDE 5 / 5 · PON TU PIEZA HOY',
        headline: 'Cada aporte construye La Supercasa',
        body: 'Escanea el QR o entra al link. Aceptamos tarjeta, PSE, Nequi, Daviplata, Bre-B y Bancolombia.',
        accentColor: 'magenta',
        urlLabel: 'DONA AHORA EN',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.calvito,
        showQr: true,
      },
    ],
  },
  {
    id: 'carousel-como-donar',
    title: 'Carrusel 02 · Qué puedes donar y cómo hacerlo (5 Slides)',
    subtitle: 'Guía visual persuasiva de piezas ($20k a $1M) + pasos de pago',
    format: 'carousel',
    category: 'carruseles',
    defaultTheme: 'cortina',
    defaultAspect: '4:5',
    objective: 'Convertir dudas en donaciones concretas',
    caption: `🧱💛 ¡PON TU PIEZA EN LA SUPERCASA! Desliza para ver exactamente en qué se convierte tu donación:

🔧 $20.000 · Material de instalación
🎨 $50.000 · Pintura de una pared
🪟 $100.000 · Ventana de un cuarto
🚿 $250.000 · Baño completo
🛏️ $1.000.000 · Habitación equipada

Dona fácil con Wompi, Nequi, PSE o Bancolombia en:
👉 supercasa.svgvisual.com/donar

#LaSupercasa #SuperNavidad48H #SegundosDeVida`,
    slides: [
      {
        id: 'car2-s1',
        slideNumber: 1,
        kicker: 'SLIDE 1 / 5 · PON TU PIEZA',
        headline: '¿En qué se convierte tu donación?',
        speechBubble: '¡Cada pieza que pones se refleja en la casa en tiempo real! 🏡',
        body: 'Desliza para elegir la pieza que quieres regalarle hoy a los Super Calvitos.',
        giantNumber: '60%',
        accentColor: 'yellow',
        urlLabel: 'DESLIZA LAS PIEZAS →',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.constructor,
      },
      {
        id: 'car2-s2',
        slideNumber: 2,
        kicker: 'SLIDE 2 / 5 · DESDE $20.000 COP',
        headline: 'Pequeños gestos, paredes llenas de vida',
        body: 'Con $20.000 pones material de instalación y con $50.000 pintas la pared del cuarto de un niño.',
        giantNumber: '$20K',
        accentColor: 'lime',
        urlLabel: 'APORTA DESDE $20.000 →',
        urlText: 'supercasa.svgvisual.com/donar',
        tierRows: [
          { label: 'Material de instalación', amount: '$20.000', note: 'Cada peso suma' },
          { label: 'Pintura de una pared', amount: '$50.000', note: 'Llena la casa de color' },
        ],
      },
      {
        id: 'car2-s3',
        slideNumber: 3,
        kicker: 'SLIDE 3 / 5 · LA PIEZA RECOMENDADA',
        headline: 'Regala la ventana de un cuarto',
        speechBubble: '¡Yo te recomiendo la ventana de mi cuarto, quiero ver el cielo! 🪟',
        body: 'Con $100.000 COP ayudas a instalar una ventana iluminada y segura.',
        giantNumber: '$100K',
        accentColor: 'yellow',
        urlLabel: 'REGALA UNA VENTANA →',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.doctora,
      },
      {
        id: 'car2-s4',
        slideNumber: 4,
        kicker: 'SLIDE 4 / 5 · PADRINOS Y EMPRESAS',
        headline: 'Apadrina un baño o una habitación',
        body: 'Recibes certificado oficial de donación (Régimen Tributario Especial · NIT 900.649.809-2).',
        giantNumber: '$1M',
        accentColor: 'magenta',
        urlLabel: 'APADRINA UN ESPACIO →',
        urlText: 'supercasa.svgvisual.com/donar',
        tierRows: [
          { label: 'Un baño completo', amount: '$250.000', note: 'Higiénico y adaptado' },
          { label: 'Habitación equipada', amount: '$1.000.000', note: 'Niño + su cuidador' },
        ],
      },
      {
        id: 'car2-s5',
        slideNumber: 5,
        kicker: 'SLIDE 5 / 5 · PAGO SEGURO',
        headline: 'Dona en 30 segundos aquí',
        body: 'Escanea el QR o entra a /donar. Tarjetas, PSE, Nequi, Daviplata, Bre-B o Bancolombia.',
        accentColor: 'magenta',
        urlLabel: 'ESCANEA Y DONA EN',
        urlText: 'supercasa.svgvisual.com/donar',
        showQr: true,
        characterImage: CAMPAIGN_CONSTANTS.assets.calvita,
      },
    ],
  },
  {
    id: 'carousel-agenda-tentativa',
    title: 'Carrusel 03 · Agenda Tentativa 48H & Kick (5 Slides)',
    subtitle: 'Horarios tentativos por día incluyendo Copa Gamer de David en Kick',
    format: 'carousel',
    category: 'carruseles',
    defaultTheme: 'cortina',
    defaultAspect: '4:5',
    supportsKickHandle: true,
    defaultKickHandle: 'deivid',
    objective: 'Guardar en Instagram y sintonizar bloques',
    caption: `📌 ¡GUARDA LA AGENDA TENTATIVA DE LAS 48 HORAS!
(Horarios sujetos a ajustes en vivo durante la maratón).
Incluye la Copa de Campeones Gamer con David por Kick (@{KICK}).

📺 Sigue toda la transmisión en: supercasa.svgvisual.com/envivo
🫆 Dona cuando quieras: supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa #SuperNavidad48H`,
    slides: [
      {
        id: 'car3-s1',
        slideNumber: 1,
        kicker: 'SLIDE 1 / 5 · AGENDA TENTATIVA 48H',
        headline: '12 Bloques de Solidaridad Sin Parar',
        body: 'Viernes 20 nov 6:00 p. m. a Domingo 22 nov 6:00 p. m. (Hora Bogotá GMT-5).',
        giantNumber: '48H',
        accentColor: 'magenta',
        urlLabel: 'DESLIZA LOS HORARIOS →',
        urlText: 'supercasa.svgvisual.com/envivo',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.sceneGamer,
      },
      {
        id: 'car3-s2',
        slideNumber: 2,
        kicker: 'SLIDE 2 / 5 · VIERNES 20 NOV (TENTATIVO)',
        headline: 'Gran Inicio & Noche de Desafíos',
        body: 'Arrancamos rapándonos en vivo por los Super Calvitos y seguimos con retos del público.',
        giantNumber: 'DÍA 1',
        accentColor: 'yellow',
        urlLabel: 'MIRA EL SÁBADO →',
        urlText: 'supercasa.svgvisual.com/envivo',
        scheduleRows: [
          { time: '18:00 – 22:00', title: 'El Gran Inicio (Rapada en vivo)', host: 'Sebas' },
          { time: '22:00 – 02:00', title: 'Noche de Desafíos & Risas Sin Filtro', host: 'Deivid' },
        ],
      },
      {
        id: 'car3-s3',
        slideNumber: 3,
        kicker: 'SLIDE 3 / 5 · SÁBADO 21 NOV (KICK @{KICK})',
        headline: 'Copa Gamer, Talentos y Gala Estelar',
        body: 'Copa de Campeones Gamer en Kick (@{KICK}), talentos y apadrinamiento de 14 habitaciones.',
        giantNumber: 'DÍA 2',
        accentColor: 'lime',
        urlLabel: 'MIRA EL DOMINGO →',
        urlText: 'supercasa.svgvisual.com/envivo',
        scheduleRows: [
          { time: '02:00 – 10:00', title: 'Desvelo Paranormal + Mañanero Café', host: 'Luz, Libardo, Cris' },
          { time: '10:00 – 14:00', title: 'Copa Campeones Gamer (Kick @{KICK})', host: 'David' },
          { time: '14:00 – 22:00', title: 'Talentos Kavanah + Gala 14 Habitaciones', host: 'Paola & Sebas' },
        ],
      },
      {
        id: 'car3-s4',
        slideNumber: 4,
        kicker: 'SLIDE 4 / 5 · DOMINGO 22 NOV (TENTATIVO)',
        headline: 'Retro Arcade, Creadores y Gran Cierre',
        body: 'Batalla de fandoms, speedrun solidario y apertura simbólica de La Supercasa.',
        giantNumber: 'DÍA 3',
        accentColor: 'cyan',
        urlLabel: 'ÚNETE AL CIERRE →',
        urlText: 'supercasa.svgvisual.com/envivo',
        scheduleRows: [
          { time: '22:00 – 06:00', title: 'Retro Arcade 80s/90s + Speedrun', host: 'Deivid & Libardo' },
          { time: '06:00 – 14:00', title: 'Despertar Solidario + Batalla Creadores', host: 'Cris, Luz & Paola' },
          { time: '14:00 – 18:00', title: 'Gran Cierre: Cumbre de la Esperanza', host: 'Kavanah + FSV' },
        ],
      },
      {
        id: 'car3-s5',
        slideNumber: 5,
        kicker: 'SLIDE 5 / 5 · TRANSMISIÓN OFICIAL',
        headline: '¡Conéctate al en vivo de las 48H!',
        body: 'Escanea el QR para entrar directo a la transmisión continua o apoya la causa.',
        accentColor: 'magenta',
        urlLabel: 'VIVE LAS 48 HORAS EN',
        urlText: 'supercasa.svgvisual.com/envivo',
        showQr: true,
        defaultQrTarget: 'live',
        characterImage: CAMPAIGN_CONSTANTS.assets.calvito,
      },
    ],
  },
  {
    id: 'carousel-en-vivo-ahora',
    title: 'Carrusel 04 · ¡Ya Estamos En Vivo 48H! (5 Slides · QR En Vivo)',
    subtitle: 'Para publicar durante la transmisión · QR directo a supercasa.svgvisual.com/envivo',
    format: 'carousel',
    category: 'carruseles',
    defaultTheme: 'cortina',
    defaultAspect: '4:5',
    objective: 'Llevar audiencia al en vivo durante el evento (QR /envivo)',
    caption: `🔴📺 ¡YA ESTAMOS EN VIVO EN LAS 48 HORAS POR LA SUPERCASA!
Desliza para conocer qué está pasando ahora mismo en la maratón solidaria junto a @kavanahpl35 y @segundosdevidafundacion.

📺 Entra directo al en vivo: https://supercasa.svgvisual.com/envivo
🏡 Conoce la causa: https://supercasa.svgvisual.com/
🫆 Dona cuando quieras: https://supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa #SuperNavidad48H #SegundosDeVida`,
    slides: [
      {
        id: 'car4-s1',
        slideNumber: 1,
        kicker: 'SLIDE 1 / 5 · TRANSMISIÓN EN CURSO',
        headline: '¡Ya estamos en vivo 48 horas!',
        speechBubble: '¡Arrancó la maratón solidaria! Entra ya a vernos en vivo 🔴🦸',
        body: 'Del viernes 20 nov 6 p. m. al domingo 22 nov 6 p. m. sin desconectarnos.',
        giantNumber: 'LIVE',
        accentColor: 'magenta',
        urlLabel: 'DESLIZA Y MIRA EL STREAM →',
        urlText: 'supercasa.svgvisual.com/envivo',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.sceneConstruyendo,
      },
      {
        id: 'car4-s2',
        slideNumber: 2,
        kicker: 'SLIDE 2 / 5 · POR LOS SUPER CALVITOS',
        headline: 'Transmitimos por sus sueños en grande',
        speechBubble: '¡Cada viewer que se conecta nos acerca a terminar La Supercasa! ✈️❤️',
        body: '15 niños en tratamiento contra el cáncer esperan su hogar en Galerías, Bogotá.',
        accentColor: 'yellow',
        urlLabel: 'SÚMATE AL EN VIVO →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.piloto,
      },
      {
        id: 'car4-s3',
        slideNumber: 3,
        kicker: 'SLIDE 3 / 5 · OBRA AL 60%',
        headline: 'Vamos al 60%. ¡En vivo por el 40%!',
        body: 'Cada hora de transmisión impulsa paredes, ventanas y habitaciones reales.',
        giantNumber: '60%',
        accentColor: 'lime',
        urlLabel: 'MIRA EL AVANCE EN VIVO →',
        urlText: 'supercasa.svgvisual.com/envivo',
        houseImage: CAMPAIGN_CONSTANTS.assets.house60,
        showProgressBar: true,
        progressPercent: 60,
      },
      {
        id: 'car4-s4',
        slideNumber: 4,
        kicker: 'SLIDE 4 / 5 · MULTISTREAM ABIERTO',
        headline: 'Desde cualquier país y plataforma',
        speechBubble: '¡Comparte el en vivo con tus amigos! Cada visita suma 🌎🔥',
        body: 'Retos en tiempo real, invitados, música, juegos y recaudación en directo.',
        giantNumber: '48H',
        accentColor: 'cyan',
        urlLabel: 'ENTRA A LA SEÑAL OFICIAL →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.bombero,
      },
      {
        id: 'car4-s5',
        slideNumber: 5,
        kicker: 'SLIDE 5 / 5 · ESCANEA Y MIRA EL VIVO',
        headline: '¡Te esperamos dentro del stream!',
        body: 'Escanea este QR para ir directo a la transmisión en vivo de las 48 Horas.',
        accentColor: 'magenta',
        urlLabel: 'ENTRA AL EN VIVO AQUÍ',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.doctora,
        showQr: true,
        defaultQrTarget: 'live',
      },
    ],
  },
  {
    id: 'carousel-copa-gamer-kick-vivo',
    title: 'Carrusel 05 · Copa Gamer En Vivo por Kick (5 Slides · QR En Vivo)',
    subtitle: 'Para el bloque gamer durante el evento · @usuario de Kick + QR a /envivo',
    format: 'carousel',
    category: 'carruseles',
    defaultTheme: 'cortina',
    defaultAspect: '4:5',
    supportsKickHandle: true,
    defaultKickHandle: 'deivid',
    objective: 'Conectar comunidad gamer al stream oficial durante el torneo',
    caption: `🎮🏆 ¡ESTAMOS EN VIVO CON LA COPA DE CAMPEONES GAMER!
Acompaña a David en Kick (@{KICK}) y en la señal oficial de las 48 Horas por La Supercasa.
Cada partida y cada reto ayudan a terminar el hogar de los Super Calvitos.

📺 Transmisión oficial: https://supercasa.svgvisual.com/envivo
🟢 Kick: https://kick.com/{KICK}
🫆 Apoya la meta: https://supercasa.svgvisual.com/donar

#CopaSupercasa #PonteLaCapa #48HorasPorLaSupercasa #Kick`,
    slides: [
      {
        id: 'car5-s1',
        slideNumber: 1,
        kicker: 'SLIDE 1 / 5 · COPA GAMER EN KICK @{KICK}',
        headline: '¡Copa de Campeones Gamer En Vivo!',
        speechBubble: '¡Sintoniza ya en Kick @{KICK} y en la señal oficial! 🎮🔥',
        body: 'Torneo solidario en directo dentro de las 48 Horas por La Supercasa.',
        accentColor: 'lime',
        urlLabel: 'JUEGA Y APOYA EN VIVO →',
        urlText: 'supercasa.svgvisual.com/envivo',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.sceneGamer,
      },
      {
        id: 'car5-s2',
        slideNumber: 2,
        kicker: 'SLIDE 2 / 5 · BLOQUE GAMER Y ARCADE',
        headline: 'Partidas, retos y fandoms en vivo',
        body: 'Inscripciones solidarias, duelos de creadores y metas activadas por el chat.',
        giantNumber: 'KICK',
        accentColor: 'cyan',
        urlLabel: 'CANAL @{KICK} Y WEB →',
        urlText: 'supercasa.svgvisual.com/envivo',
        scheduleRows: [
          { time: 'EN VIVO', title: 'Copa Campeones Gamer (Kick @{KICK})', host: 'David' },
          { time: '22:00 – 02:00', title: 'Retro Arcade: Street Fighter & Mario Kart', host: 'Deivid' },
        ],
      },
      {
        id: 'car5-s3',
        slideNumber: 3,
        kicker: 'SLIDE 3 / 5 · TU CHAT CONSTRUYE',
        headline: 'Cada partida suma piezas a la casa',
        speechBubble: '¡Tu apoyo en el chat se convierte en ventanas y cuartos reales! 🧱💛',
        body: 'La Supercasa está al 60%. Hoy jugamos para completar el 40% restante.',
        accentColor: 'yellow',
        urlLabel: 'MIRA EL STREAM AQUÍ →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.constructor,
      },
      {
        id: 'car5-s4',
        slideNumber: 4,
        kicker: 'SLIDE 4 / 5 · DESAFÍOS EN DIRECTO',
        headline: 'No te pierdas los duelos del bloque',
        body: 'Entra a la transmisión continua para votar retos y alentar a tu creador favorito.',
        giantNumber: '48H',
        accentColor: 'magenta',
        urlLabel: 'VER TRANSMISIÓN →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.policia,
      },
      {
        id: 'car5-s5',
        slideNumber: 5,
        kicker: 'SLIDE 5 / 5 · ESCANEA Y MIRA EL TORNEO',
        headline: 'Entra ya al En Vivo Oficial',
        body: 'Escanea el QR para abrir la transmisión ahora mismo y apoyar desde tu celular.',
        accentColor: 'lime',
        urlLabel: 'SEÑAL EN VIVO Y KICK @{KICK}',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.calvito,
        showQr: true,
        defaultQrTarget: 'live',
      },
    ],
  },
  {
    id: 'carousel-dinamicas-retos-evento',
    title: 'Carrusel 06 · Retos y Dinámicas En Vivo (5 Slides · QR En Vivo)',
    subtitle: 'Lo que está pasando durante las 48H: rapada, podcast, talentos y gala',
    format: 'carousel',
    category: 'carruseles',
    defaultTheme: 'cortina',
    defaultAspect: '4:5',
    objective: 'Retener audiencia y mostrar actividades activas durante el streaming',
    caption: `🔥😂 ¡ESTO ES TODO LO QUE ESTÁ PASANDO EN VIVO EN LAS 48 HORAS!
Desde la rapada solidaria hasta el podcast de madrugada, el festival de talentos y la gran gala de las 14 habitaciones.

📺 No te desconectes, entra al en vivo: https://supercasa.svgvisual.com/envivo
🫆 Manda tu reto donando: https://supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa #SuperNavidad48H`,
    slides: [
      {
        id: 'car6-s1',
        slideNumber: 1,
        kicker: 'SLIDE 1 / 5 · EN DIRECTO LAS 48 HORAS',
        headline: '¡Retos locos por una causa gigante!',
        speechBubble: '¡Cada meta cumplida desbloquea un nuevo reto en vivo! 😂🦸',
        body: 'Desliza y descubre las dinámicas que están encendiendo la transmisión.',
        giantNumber: '12',
        accentColor: 'magenta',
        urlLabel: 'MIRA QUÉ ESTÁ PASANDO →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.calvito,
      },
      {
        id: 'car6-s2',
        slideNumber: 2,
        kicker: 'SLIDE 2 / 5 · DINÁMICAS DE APERTURA Y NOCHE',
        headline: 'Rapada en vivo & Desafíos del chat',
        body: 'El equipo se rapa en vivo por los Super Calvitos y cumple retos votados por ustedes.',
        giantNumber: '01',
        accentColor: 'yellow',
        urlLabel: 'ENTRA AL CHAT EN VIVO →',
        urlText: 'supercasa.svgvisual.com/envivo',
        scheduleRows: [
          { time: 'RETOS', title: 'Todos nos rapamos por los Super Calvitos', host: 'Sebas & Equipo' },
          { time: 'VIVO', title: 'Castigos y desafíos activados por donación', host: 'Deivid' },
        ],
      },
      {
        id: 'car6-s3',
        slideNumber: 3,
        kicker: 'SLIDE 3 / 5 · MADRUGADA Y TALENTOS',
        headline: 'Podcast Rock, Café y Cocina Express',
        body: 'De madrugada a la tarde: monitoreo cardíaco, consultorio legal y talentos Kavanah.',
        giantNumber: '24H',
        accentColor: 'cyan',
        urlLabel: 'SIGUE LA TRANSMISIÓN →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.chef,
      },
      {
        id: 'car6-s4',
        slideNumber: 4,
        kicker: 'SLIDE 4 / 5 · NOCHE ESTELAR',
        headline: 'La Gran Gala de las 14 Habitaciones',
        speechBubble: '¡Apadrinamos cuartos completos en vivo con toda la comunidad! ✨🏡',
        body: 'Historias reales, padrinos en directo y avance en vivo del contador de La Supercasa.',
        accentColor: 'lime',
        urlLabel: 'CONÉCTATE A LA GALA →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.empresaria,
      },
      {
        id: 'car6-s5',
        slideNumber: 5,
        kicker: 'SLIDE 5 / 5 · NO TE LO PIERDAS EN VIVO',
        headline: 'Escanea el QR y entra al stream',
        body: 'La transmisión está activa ahora mismo. ¡Tu presencia y difusión hacen historia!',
        accentColor: 'magenta',
        urlLabel: 'ESCANEA Y MIRA EL EN VIVO',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.bombero,
        showQr: true,
        defaultQrTarget: 'live',
      },
    ],
  },
  {
    id: 'carousel-multistream-creadores',
    title: 'Carrusel 07 · Multistream Solidario en Curso (5 Slides · QR En Vivo)',
    subtitle: 'Para invitar a más streamers y comunidades durante las 48H · QR /envivo',
    format: 'carousel',
    category: 'carruseles',
    defaultTheme: 'cortina',
    defaultAspect: '4:5',
    objective: 'Sumar streamers, raids y audiencias internacionales al en vivo',
    caption: `🌎❤️ HOY NO COMPETIMOS POR ESPECTADORES, ¡NOS UNIMOS POR SONRISAS!
El Multistream Solidario de 48 Horas está al aire en este momento.
No importa tu país, tu plataforma o tus viewers: suma tu stream o acompáñanos en vivo.

📺 Mira el multistream oficial: https://supercasa.svgvisual.com/envivo
🏡 Conoce toda la causa: https://supercasa.svgvisual.com/

#PonteLaCapa #48HorasPorLaSupercasa #MultistreamSolidario`,
    slides: [
      {
        id: 'car7-s1',
        slideNumber: 1,
        kicker: 'SLIDE 1 / 5 · MULTISTREAM SOLIDARIO',
        headline: 'No competimos por viewers. Nos unimos por sonrisas.',
        speechBubble: '¡Todos los canales sumando por los Super Calvitos! 🦸‍♂️🦸‍♀️',
        body: 'Desliza y descubre cómo acompañarnos en el multistream en vivo.',
        giantNumber: '48H',
        accentColor: 'magenta',
        urlLabel: 'MIRA LA SEÑAL CENTRAL →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.bombero,
        secondaryCharacterImage: CAMPAIGN_CONSTANTS.assets.policia,
      },
      {
        id: 'car7-s2',
        slideNumber: 2,
        kicker: 'SLIDE 2 / 5 · DESDE CUALQUIER PAÍS',
        headline: 'Cada visita y cada raid cuenta',
        speechBubble: '¡No importa si somos 5 o 5.000, juntos llenamos La Supercasa! 🌎✨',
        body: 'Creadores de Twitch, Kick, YouTube y TikTok conectados en simultáneo.',
        accentColor: 'cyan',
        urlLabel: 'ENTRA AL STREAM →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.ejecutivo,
      },
      {
        id: 'car7-s3',
        slideNumber: 3,
        kicker: 'SLIDE 3 / 5 · RESUMEN EN TIEMPO REAL',
        headline: 'Casa al 60% · Meta $250M COP',
        body: 'Todo lo recaudado va directo a la Fundación Segundos de Vida (NIT 900.649.809-2).',
        giantNumber: '60%',
        accentColor: 'yellow',
        urlLabel: 'SIGUE EL AVANCE →',
        urlText: 'supercasa.svgvisual.com/envivo',
        houseImage: CAMPAIGN_CONSTANTS.assets.house100,
        showProgressBar: true,
        progressPercent: 60,
      },
      {
        id: 'car7-s4',
        slideNumber: 4,
        kicker: 'SLIDE 4 / 5 · PONTE LA CAPA HOY',
        headline: 'Comparte el enlace con tu comunidad',
        speechBubble: '¡Si estás viendo esto, eres parte de la misión Supercasa! ❤️',
        body: 'Invita a un amigo al directo, comenta en el chat o aporta tu pieza desde $20.000.',
        accentColor: 'lime',
        urlLabel: 'ÚNETE AL EN VIVO →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.calvita,
      },
      {
        id: 'car7-s5',
        slideNumber: 5,
        kicker: 'SLIDE 5 / 5 · ESCANEA Y MIRA EL MULTISTREAM',
        headline: 'Conéctate ahora en /envivo',
        body: 'Escanea este código QR para abrir la transmisión solidaria en tu pantalla.',
        accentColor: 'cyan',
        urlLabel: 'ESCANEA Y ENTRA AL VIVO',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.ejecutivo,
        showQr: true,
        defaultQrTarget: 'live',
      },
    ],
  },
  {
    id: 'carousel-bitacora-en-vivo-48h',
    title: 'Carrusel 08 · Bitácora En Vivo {HORAS}H de Maratón (5 Slides · QR En Vivo)',
    subtitle: 'Carrusel dinámico para publicar cortes en vivo (12h, 24h, 36h, 48h) · QR /envivo',
    format: 'carousel',
    category: 'carruseles',
    defaultTheme: 'cortina',
    defaultAspect: '4:5',
    supportsHourCounter: true,
    defaultHourValue: '24',
    objective: 'Recapitular horas cumplidas en vivo e impulsar el tramo siguiente',
    caption: `⏰🔥 ¡BITÁCORA OFICIAL: YA LLEVAMOS {HORAS} HORAS DE STREAMING SOLIDARIO!
Desliza para ver cómo avanza la maratón de 48 horas por La Supercasa junto a @kavanahpl35 y @segundosdevidafundacion.

📺 Sigue la transmisión ahora mismo: https://supercasa.svgvisual.com/envivo
🫆 Suma tu pieza hoy: https://supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa #SuperNavidad48H`,
    slides: [
      {
        id: 'car8-s1',
        slideNumber: 1,
        kicker: 'SLIDE 1 / 5 · REPORTE EN VIVO',
        headline: '¡Ya vamos {HORAS} horas al aire!',
        speechBubble: '¡Seguimos encendidos sin parar por los Super Calvitos! 🔥❤️',
        body: 'Desliza la bitácora de nuestra maratón solidaria rumbo a las 48 horas.',
        giantNumber: '{HORAS}H',
        accentColor: 'magenta',
        urlLabel: 'DESLIZA EL REPORTE →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.constructor,
      },
      {
        id: 'car8-s2',
        slideNumber: 2,
        kicker: 'SLIDE 2 / 5 · LA META SIGUE FIRME',
        headline: 'Construyendo el 40% final en vivo',
        body: 'Cada hora de transmisión suma esperanza para 15 niños en tratamiento y sus familias.',
        giantNumber: '60%',
        accentColor: 'yellow',
        urlLabel: 'VAMOS POR EL 100% →',
        urlText: 'supercasa.svgvisual.com/envivo',
        houseImage: CAMPAIGN_CONSTANTS.assets.house60,
        secondaryHouseImage: CAMPAIGN_CONSTANTS.assets.house100,
        showProgressBar: true,
        progressPercent: 60,
      },
      {
        id: 'car8-s3',
        slideNumber: 3,
        kicker: 'SLIDE 3 / 5 · LO QUE VIENE EN DIRECTO',
        headline: 'Más retos, invitados y sorpresas',
        speechBubble: '¡Quédate con nosotros en el siguiente tramo de la maratón! 📺✨',
        body: 'Aún quedan horas llenas de energía, música, juegos y recaudación en vivo.',
        giantNumber: '48H',
        accentColor: 'lime',
        urlLabel: 'MIRA LO QUE SIGUE →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.doctora,
      },
      {
        id: 'car8-s4',
        slideNumber: 4,
        kicker: 'SLIDE 4 / 5 · SÚMATE DESDE CASA',
        headline: 'Tu visita y aporte nos dan fuerza',
        body: 'Comparte el link con tus grupos y pasa a saludar al chat de La Supercasa.',
        accentColor: 'cyan',
        urlLabel: 'ENTRA AL EN VIVO →',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.piloto,
      },
      {
        id: 'car8-s5',
        slideNumber: 5,
        kicker: 'SLIDE 5 / 5 · CONÉCTATE AHORA',
        headline: 'Escanea el QR y vive las {HORAS}H+',
        body: 'Entra directo al en vivo ahora mismo o cambia el QR a Donar en el editor si lo prefieres.',
        accentColor: 'magenta',
        urlLabel: 'MIRA LA TRANSMISIÓN EN',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.bombero,
        showQr: true,
        defaultQrTarget: 'live',
      },
    ],
  },

  // ==================== CAPAS PNG TRANSPARENTES PARA VIDEOS / HISTORIAS ====================
  {
    id: 'overlay-maraton-48h-invitacion',
    title: 'Capa PNG Transparente · Maratón 48H (Vie 20 – Dom 22 Nov)',
    subtitle: 'Centro 100% transparente para poner encima de tu video o foto en Stories/Reels',
    format: 'story',
    category: 'overlays',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    objective: 'Superponer sobre videos personales invitando a donar',
    caption: `🚨❤️ ¡ESTE VIERNES 20 DE NOVIEMBRE DESDE LAS 6:00 P. M. NOS PONEMOS LA CAPA!
48 HORAS DE STREAMING SOLIDARIO (Viernes 20 nov 6 p. m. → Domingo 22 nov 6 p. m., hora Bogotá) para terminar La Supercasa (va al 60%) de @segundosdevidafundacion junto a @kavanahpl35.

🏡 Conoce la causa: supercasa.svgvisual.com
🫆 Haz tu donación: supercasa.svgvisual.com/donar
📺 Mira el en vivo: supercasa.svgvisual.com/envivo

#SuperNavidad48H #PonteLaCapa #48HorasPorLaSupercasa`,
    slides: [
      {
        id: 'overlay-maraton-48h-invitacion-s1',
        slideNumber: 1,
        isTransparentOverlay: true,
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: '¡Maratón en Vivo 48 Horas por La Supercasa!',
        body: '48h en vivo (Vie 20 6 p. m. – Dom 22 nov 6 p. m. Bogotá). Casa al 60% · ¡Falta 40%!',
        accentColor: 'magenta',
        urlLabel: 'DONA DESDE $20.000 EN',
        urlText: 'supercasa.svgvisual.com/donar',
        showQr: true,
      },
    ],
  },
  {
    id: 'overlay-horarios-48h-fechas',
    title: 'Capa PNG Transparente · Fechas y Horarios 48H (Video)',
    subtitle: 'Marco transparente unificado con fecha de inicio, cierre y horario Bogotá GMT-5',
    format: 'story',
    category: 'overlays',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    objective: 'Invitar a la maratón en vivo de 48 horas sobre videos o fotos personales',
    caption: `🚨❤️ ¡MARATÓN EN VIVO DE 48 HORAS POR LA SUPERCASA!
Nos unimos del viernes 20 de noviembre a las 6:00 p. m. al domingo 22 de noviembre a las 6:00 p. m. (hora Bogotá GMT-5) por @segundosdevidafundacion y @kavanahpl35.

🏡 Todo en la web: supercasa.svgvisual.com
📺 Mira el en vivo: supercasa.svgvisual.com/envivo
🫆 Pon tu pieza: supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa #SuperNavidad48H`,
    slides: [
      {
        id: 'overlay-horarios-48h-fechas-s1',
        slideNumber: 1,
        isTransparentOverlay: true,
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: 'Maratón en Vivo · 48 Horas Solidarias',
        body: 'Inicio Vie 20 (6:00 p. m.) a Dom 22 nov (6:00 p. m.) Bogotá. Todo en un clic.',
        accentColor: 'lime',
        urlLabel: 'CAUSA, EN VIVO Y DONACIONES EN',
        urlText: 'supercasa.svgvisual.com',
        showQr: true,
      },
    ],
  },
  {
    id: 'overlay-causa-60-qr',
    title: 'Capa PNG Transparente · Maratón 48H + Obra al 60%',
    subtitle: 'Sticker/marco transparente con fechas oficiales de la maratón, avance al 60% y QR',
    format: 'story',
    category: 'overlays',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    objective: 'Conversión directa con fechas oficiales de 48H sobre foto de obra o video',
    caption: `🏡💛 ¡48 HORAS EN VIVO POR LA SUPERCASA (VIE 20 – DOM 22 NOV)!
La obra ya está al 60%. Ayúdanos a construir el último 40% para 15 niños que luchan contra el cáncer en Bogotá.
⏰ Del viernes 20 nov 6:00 p. m. al domingo 22 nov 6:00 p. m. (GMT-5).

🫆 Dona fácil con Nequi, PSE, tarjeta o Bancolombia: supercasa.svgvisual.com/donar
🏡 Conoce la causa: supercasa.svgvisual.com

#LaSupercasa #SegundosDeVida #PonteLaCapa`,
    slides: [
      {
        id: 'overlay-causa-60-qr-s1',
        slideNumber: 1,
        isTransparentOverlay: true,
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: '48H en vivo: terminemos La Supercasa',
        body: 'Maratón en vivo 48 horas (20–22 nov Bogotá) · 15 niños te necesitan.',
        accentColor: 'yellow',
        urlLabel: 'ESCANEA EL QR O DONA EN',
        urlText: 'supercasa.svgvisual.com/donar',
        showProgressBar: true,
        progressPercent: 60,
        showQr: true,
      },
    ],
  },
  {
    id: 'overlay-gamer-kick-video',
    title: 'Capa PNG Transparente · Maratón 48H & Kick (@deivid)',
    subtitle: 'Marco transparente con fechas de las 48H y horario del torneo gamer en Kick',
    format: 'story',
    category: 'overlays',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    supportsKickHandle: true,
    defaultKickHandle: 'deivid',
    objective: 'Invitar a la maratón 48H y al bloque gamer del sábado 10 a. m. en Kick',
    caption: `🎮🏆 ¡MARATÓN 48 HORAS EN VIVO · COPA GAMER POR KICK (@{KICK})!
Del viernes 20 nov 6:00 p. m. al domingo 22 nov 6:00 p. m. (Bogotá).
⏰ Especial Copa Gamer: Sábado 21 nov, 10:00 a. m. – 2:00 p. m.

🟢 Kick: kick.com/{KICK}
📺 Señal oficial: supercasa.svgvisual.com/envivo
🫆 Dona aquí: supercasa.svgvisual.com/donar

#CopaSupercasa #PonteLaCapa #48HorasPorLaSupercasa`,
    slides: [
      {
        id: 'overlay-gamer-kick-video-s1',
        slideNumber: 1,
        isTransparentOverlay: true,
        kicker: '20–22 NOV (48H) · KICK @{KICK} SÁB 10 A. M.',
        headline: '48H en Vivo · Copa Gamer Solidaria',
        body: 'Maratón Vie 20 (6 p. m.) – Dom 22 nov (6 p. m.) · Bloque Kick Sáb 10 a. m. – 2 p. m.',
        accentColor: 'cyan',
        urlLabel: 'KICK @{KICK} Y VIVO EN',
        urlText: 'supercasa.svgvisual.com/envivo',
        showQr: true,
      },
    ],
  },

  // ==================== +10 CAPAS PNG TRANSPARENTES UNIFICADAS (48H FECHAS Y HORARIOS + 3D) ====================
  ...(
    [
      {
        id: 'overlay-prof-piloto',
        title: 'Capa PNG 3D · Piloto + Maratón 48H (Transparente)',
        subtitle: 'Calvito piloto sobre centro transparente con fechas y horarios del evento',
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: '¡48H en vivo por sus sueños!',
        speechBubble: '¡Tu aporte me acerca más a cumplir mi sueño de ser piloto! ✈️',
        body: 'Maratón en vivo 48 horas (20–22 nov, 6 p. m. Bogotá) · Obra al 60%.',
        accentColor: 'yellow' as const,
        urlLabel: 'CAUSA, VIVO Y DONACIONES EN',
        urlText: 'supercasa.svgvisual.com',
        characterImage: CAMPAIGN_CONSTANTS.assets.piloto,
        showQr: true,
      },
      {
        id: 'overlay-prof-doctora',
        title: 'Capa PNG 3D · Doctora + Maratón 48H (Transparente)',
        subtitle: 'Calvita doctora sobre fondo transparente con fechas y horario de transmisión',
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: '48H en vivo para construir su hogar',
        speechBubble: '¡Quiero ser doctora! Ayúdanos en estas 48 horas solidarias 🩺💛',
        body: 'Maratón en vivo 48 horas · 20 al 22 de nov (6 p. m. GMT-5). Casa al 60%.',
        accentColor: 'magenta' as const,
        urlLabel: 'HAZ TU DONACIÓN EN',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.doctora,
        showQr: true,
      },
      {
        id: 'overlay-prof-bombero',
        title: 'Capa PNG 3D · Bombero + Maratón 48H (Transparente)',
        subtitle: 'Calvito bombero sobre capa transparente invitando al horario completo 48H',
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: '¡Únete a la maratón 48H en vivo!',
        speechBubble: '¡Quiero ser bombero! Te esperamos del 20 al 22 de nov 🚒❤️',
        body: 'Streaming continuo desde Vie 20 nov 6:00 p. m. hasta Dom 22 nov 6:00 p. m.',
        accentColor: 'magenta' as const,
        urlLabel: 'MIRA EL EN VIVO Y DONA EN',
        urlText: 'supercasa.svgvisual.com/envivo',
        characterImage: CAMPAIGN_CONSTANTS.assets.bombero,
        showQr: true,
      },
      {
        id: 'overlay-prof-chef',
        title: 'Capa PNG 3D · Chef + Maratón 48H (Transparente)',
        subtitle: 'Calvito chef sobre fondo transparente con fechas y horarios del streaming',
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: '48H en vivo por su nuevo hogar',
        speechBubble: '¡Quiero ser chef! Súmate del vie 20 al dom 22 nov 🍲✨',
        body: 'Maratón en vivo 48 horas (Bogotá GMT-5) · Dona desde $20.000 COP.',
        accentColor: 'yellow' as const,
        urlLabel: 'TODO EN LA PÁGINA OFICIAL',
        urlText: 'supercasa.svgvisual.com',
        characterImage: CAMPAIGN_CONSTANTS.assets.chef,
        showQr: true,
      },
      {
        id: 'overlay-prof-constructor',
        title: 'Capa PNG 3D · Constructor + Maratón 48H (Transparente)',
        subtitle: 'Calvito constructor con casco sobre centro transparente y fechas 20–22 nov',
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: '48H en vivo: ¡falta el 40% de la obra!',
        speechBubble: '¡Ya vamos al 60%! Conéctate las 48 horas y pon tu pieza 🧱👷',
        body: 'Del vie 20 (6 p. m.) al dom 22 nov (6 p. m.) Bogotá · Nequi, PSE y tarjeta.',
        accentColor: 'lime' as const,
        urlLabel: 'CONSTRUYE CON NOSOTROS EN',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.constructor,
        showQr: true,
      },
      {
        id: 'overlay-prof-policia',
        title: 'Capa PNG 3D · Policía Calvita + 48H (Transparente)',
        subtitle: 'Super Calvita policía sobre capa transparente con fechas de la maratón',
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: '48 Horas en vivo cuidando su futuro',
        speechBubble: '¡Quiero ser policía! Acompáñanos del 20 al 22 de nov 💙⭐',
        body: 'Maratón en vivo 48 horas · Inicio y cierre a las 6:00 p. m. (hora Bogotá).',
        accentColor: 'cyan' as const,
        urlLabel: 'CONOCE LA CAUSA Y DONA EN',
        urlText: 'supercasa.svgvisual.com',
        characterImage: CAMPAIGN_CONSTANTS.assets.policia,
        showQr: true,
      },
      {
        id: 'overlay-prof-empresaria',
        title: 'Capa PNG 3D · Empresaria Padrinos + 48H (Transparente)',
        subtitle: 'Calvita empresaria sobre fondo transparente con horario 48H para aliados',
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: '48H en vivo: tu empresa pone capa',
        speechBubble: '¡Súmate del 20 al 22 de nov y recibe certificado NIT! 💼',
        body: 'Maratón 48 horas (Vie 20 6 p. m. – Dom 22 6 p. m.) · Plan Padrino Bogotá.',
        accentColor: 'yellow' as const,
        urlLabel: 'APADRINA EN LAS 48H EN',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.empresaria,
        showQr: true,
      },
      {
        id: 'overlay-prof-ejecutivo',
        title: 'Capa PNG 3D · Ejecutivo + Multistream 48H (Transparente)',
        subtitle: 'Calvito ejecutivo sobre fondo transparente con fechas del multistream 48H',
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: 'Multistream en vivo: 48 horas juntos',
        speechBubble: 'Hoy no competimos por viewers, ¡nos unimos por sonrisas! 🤝',
        body: 'Maratón solidaria 48h (Vie 20 6:00 p. m. → Dom 22 nov 6:00 p. m. Bogotá).',
        accentColor: 'cyan' as const,
        urlLabel: 'ENTRA AL HUB OFICIAL',
        urlText: 'supercasa.svgvisual.com',
        characterImage: CAMPAIGN_CONSTANTS.assets.ejecutivo,
        showQr: true,
      },
      {
        id: 'overlay-prof-calvitos-juntos',
        title: 'Capa PNG 3D · Dúo Calvitos + Maratón 48H (Transparente)',
        subtitle: 'Dúo 3D en esquina sobre tu video o foto con fechas oficiales 20–22 nov',
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: '¡48H en vivo por los Super Calvitos!',
        speechBubble: '¡Te esperamos del 20 al 22 de noviembre desde las 6:00 p. m.! 🦸‍♂️🦸‍♀️',
        body: '48 horas de transmisión continua (Hora Bogotá) · Causa, live y donaciones.',
        accentColor: 'magenta' as const,
        urlLabel: 'VIVO, CAUSA Y DONACIONES EN',
        urlText: 'supercasa.svgvisual.com',
        characterImage: CAMPAIGN_CONSTANTS.assets.constructor,
        secondaryCharacterImage: CAMPAIGN_CONSTANTS.assets.doctora,
        showQr: false,
      },
      {
        id: 'overlay-prof-horario-completo',
        title: 'Capa PNG 3D · Horario 48H + Calvito (Transparente)',
        subtitle: 'Marco transparente con fechas y horario exacto de inicio y cierre en Bogotá',
        kicker: 'VIE 20 NOV 6 P. M. → DOM 22 NOV 6 P. M.',
        headline: 'Maratón en Vivo: 48 Horas Solidarias',
        speechBubble: '¡Del viernes 20 (6 p. m.) al domingo 22 nov (6 p. m.) hora Bogotá! ⏰❤️',
        body: '48 horas sin parar · Casa al 60%. Todo en supercasa.svgvisual.com.',
        accentColor: 'lime' as const,
        urlLabel: 'TODAS LAS DONACIONES Y EL LIVE EN',
        urlText: 'supercasa.svgvisual.com',
        characterImage: CAMPAIGN_CONSTANTS.assets.bombero,
        showQr: true,
      },
    ] as const
  ).map(
    (item): AdCreative => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      format: 'story',
      category: 'overlays',
      defaultTheme: 'cortina',
      defaultAspect: '9:16',
      objective: 'Capa transparente 48H en vivo (fechas y horarios) para videos/fotos',
      caption: `🦸‍♂️❤️ ${item.headline}
${item.speechBubble}
📅 Maratón en vivo 48 horas: Viernes 20 de noviembre 6:00 p. m. → Domingo 22 de noviembre 6:00 p. m. (hora Bogotá GMT-5).

🏡 Página principal (causa, live y donaciones): https://supercasa.svgvisual.com/
🫆 Donar directo: https://supercasa.svgvisual.com/donar
📺 En vivo: https://supercasa.svgvisual.com/envivo

#SuperNavidad48H #PonteLaCapa #48HorasPorLaSupercasa #SegundosDeVida`,
      slides: [
        {
          id: `${item.id}-s1`,
          slideNumber: 1,
          isTransparentOverlay: true,
          kicker: item.kicker,
          headline: item.headline,
          speechBubble: item.speechBubble,
          body: item.body,
          accentColor: item.accentColor,
          urlLabel: item.urlLabel,
          urlText: item.urlText,
          characterImage: item.characterImage,
          secondaryCharacterImage:
            'secondaryCharacterImage' in item ? item.secondaryCharacterImage : undefined,
          showQr: item.showQr,
        },
      ],
    }),
  ),

  // ==================== +27 HISTORIAS GRÁFICAS (NO PNG) HITO POR HORAS (1H A 48H) ====================
  ...(
    [
      { hr: '1', day: 'DÍA 1 · VIE 7:00 P. M.', bubble: '¡Acabamos de encender las 48 horas! Súmate desde ya 🔥', url: 'supercasa.svgvisual.com', accent: 'magenta' as const, char: CAMPAIGN_CONSTANTS.assets.piloto, overlay: false },
      { hr: '3', day: 'DÍA 1 · VIE 9:00 P. M.', bubble: '¡Llevamos 3 horas al aire! Cada aporte acerca La Supercasa ❤️', url: 'supercasa.svgvisual.com/envivo', accent: 'lime' as const, char: CAMPAIGN_CONSTANTS.assets.constructor, overlay: false },
      { hr: '6', day: 'DÍA 1 · MEDIANOCHE', bubble: '¡Medianoche y seguimos despiertos por los Super Calvitos! 🌙', url: 'supercasa.svgvisual.com/donar', accent: 'cyan' as const, char: CAMPAIGN_CONSTANTS.assets.bombero, overlay: false },
      { hr: '7', day: 'DÍA 1 · 1:00 A. M.', bubble: '¡Ya vamos 7 horas sin parar! Tu donación nos da energía ⚡', url: 'supercasa.svgvisual.com', accent: 'yellow' as const, char: CAMPAIGN_CONSTANTS.assets.piloto, overlay: false },
      { hr: '8', day: 'DÍA 1 · 2:00 A. M.', bubble: '¡8 horas seguidas en vivo! ¿Ya pusiste tu pieza hoy? 🧱', url: 'supercasa.svgvisual.com/envivo', accent: 'magenta' as const, char: CAMPAIGN_CONSTANTS.assets.doctora, overlay: false },
      { hr: '10', day: 'DÍA 2 · 4:00 A. M.', bubble: '¡Ya vamos 10 horas en vivo! Buenos días solidarios, ¡a donar! ☀️', url: 'supercasa.svgvisual.com', accent: 'lime' as const, char: CAMPAIGN_CONSTANTS.assets.chef, overlay: false },
      { hr: '11', day: 'DÍA 2 · 5:00 A. M.', bubble: '¡Ya llevamos 11 horas al aire y la casa sigue creciendo! 🏡', url: 'supercasa.svgvisual.com/donar', accent: 'yellow' as const, char: CAMPAIGN_CONSTANTS.assets.policia, overlay: false },
      { hr: '14', day: 'DÍA 2 · SÁB 8:00 A. M.', bubble: '¡14 horas en vivo! Comparte esta historia con tus amigos 🙌', url: 'supercasa.svgvisual.com', accent: 'cyan' as const, char: CAMPAIGN_CONSTANTS.assets.doctora, overlay: false },
      { hr: '15', day: 'DÍA 2 · SÁB 9:00 A. M.', bubble: '¡Ya vamos 15 horas sin parar! Tu granito completa el 40% 🧱💛', url: 'supercasa.svgvisual.com/donar', accent: 'magenta' as const, char: CAMPAIGN_CONSTANTS.assets.constructor, overlay: false },
      { hr: '16', day: 'DÍA 2 · SÁB 10:00 A. M.', bubble: '¡16 horas de streaming solidario! Entra al vivo ahora 📺', url: 'supercasa.svgvisual.com/envivo', accent: 'lime' as const, char: CAMPAIGN_CONSTANTS.assets.empresaria, overlay: false },
      { hr: '18', day: 'DÍA 2 · MEDIODÍA', bubble: '¡Ya vamos 18 horas! Todo pasa en supercasa.svgvisual.com ❤️', url: 'supercasa.svgvisual.com', accent: 'cyan' as const, char: CAMPAIGN_CONSTANTS.assets.ejecutivo, overlay: false },
      { hr: '20', day: 'DÍA 2 · 2:00 P. M.', bubble: '¡20 horas en vivo! A punto de llegar a la mitad del reto 🚀', url: 'supercasa.svgvisual.com/donar', accent: 'yellow' as const, char: CAMPAIGN_CONSTANTS.assets.piloto, overlay: false },
      { hr: '22', day: 'DÍA 2 · 4:00 P. M.', bubble: '¡Ya vamos 22 horas! Casi un día completo por los niños 🦸', url: 'supercasa.svgvisual.com', accent: 'magenta' as const, char: CAMPAIGN_CONSTANTS.assets.constructor, overlay: false },
      { hr: '25', day: 'DÍA 2 · 7:00 P. M.', bubble: '¡Ya llevamos 25 horas! Cruzamos la mitad y vamos con todo 🔥', url: 'supercasa.svgvisual.com', accent: 'lime' as const, char: CAMPAIGN_CONSTANTS.assets.bombero, overlay: false },
      { hr: '28', day: 'DÍA 2 · 10:00 P. M.', bubble: '¡28 horas al aire! Hoy la gala estelar es por 14 habitaciones ✨', url: 'supercasa.svgvisual.com/donar', accent: 'magenta' as const, char: CAMPAIGN_CONSTANTS.assets.doctora, overlay: false },
      { hr: '30', day: 'DÍA 2 · MEDIANOCHE', bubble: '¡30 horas sin desconectarnos! Cada $20.000 suma muchísimo 💛', url: 'supercasa.svgvisual.com/envivo', accent: 'cyan' as const, char: CAMPAIGN_CONSTANTS.assets.chef, overlay: false },
      { hr: '32', day: 'DÍA 3 · 2:00 A. M.', bubble: '¡32 horas en vivo! Gracias a quienes trasnochan donando 🌙', url: 'supercasa.svgvisual.com', accent: 'yellow' as const, char: CAMPAIGN_CONSTANTS.assets.policia, overlay: false },
      { hr: '34', day: 'DÍA 3 · 4:00 A. M.', bubble: '¡34 horas! Último día de maratón, entra a La Supercasa 🏡', url: 'supercasa.svgvisual.com/donar', accent: 'lime' as const, char: CAMPAIGN_CONSTANTS.assets.ejecutivo, overlay: false },
      { hr: '35', day: 'DÍA 3 · DOM 5:00 A. M.', bubble: '¡Ya vamos 35 horas al aire! Amanecemos con más sonrisas ☀️❤️', url: 'supercasa.svgvisual.com', accent: 'cyan' as const, char: CAMPAIGN_CONSTANTS.assets.empresaria, overlay: false },
      { hr: '36', day: 'DÍA 3 · QUEDAN 12H', bubble: '¡Ya vamos 36 horas! Entramos a las últimas 12 horas ⏰❤️', url: 'supercasa.svgvisual.com', accent: 'magenta' as const, char: CAMPAIGN_CONSTANTS.assets.constructor, overlay: false },
      { hr: '38', day: 'DÍA 3 · QUEDAN 10H', bubble: '¡38 horas al aire! Faltan 10 horas para cerrar la meta 🎯', url: 'supercasa.svgvisual.com/envivo', accent: 'cyan' as const, char: CAMPAIGN_CONSTANTS.assets.piloto, overlay: false },
      { hr: '40', day: 'DÍA 3 · QUEDAN 8H', bubble: '¡40 horas de solidaridad pura! Pon tu pieza antes del cierre 🧱', url: 'supercasa.svgvisual.com/donar', accent: 'yellow' as const, char: CAMPAIGN_CONSTANTS.assets.doctora, overlay: false },
      { hr: '42', day: 'DÍA 3 · QUEDAN 6H', bubble: '¡Ya vamos 42 horas! Últimas 6 horas para sumar sonrisas 🦸‍♀️', url: 'supercasa.svgvisual.com', accent: 'magenta' as const, char: CAMPAIGN_CONSTANTS.assets.bombero, overlay: false },
      { hr: '44', day: 'DÍA 3 · QUEDAN 4H', bubble: '¡44 horas! Recta finalísima en supercasa.svgvisual.com 🔥', url: 'supercasa.svgvisual.com/envivo', accent: 'lime' as const, char: CAMPAIGN_CONSTANTS.assets.chef, overlay: false },
      { hr: '45', day: 'DÍA 3 · QUEDAN 3H', bubble: '¡Ya vamos 45 horas! Últimas 3 horas para cerrar la meta 🚨❤️', url: 'supercasa.svgvisual.com/donar', accent: 'cyan' as const, char: CAMPAIGN_CONSTANTS.assets.policia, overlay: false },
      { hr: '46', day: 'DÍA 3 · ÚLTIMAS 2H', bubble: '¡46 HORAS! Quedan 120 minutos para el gran cierre solidario 🚨', url: 'supercasa.svgvisual.com/donar', accent: 'magenta' as const, char: CAMPAIGN_CONSTANTS.assets.piloto, overlay: false },
      { hr: '48', day: '¡META 48 HORAS!', bubble: '¡LO LOGRAMOS: 48 HORAS POR LA SUPERCASA! Aún puedes donar 🏡✨', url: 'supercasa.svgvisual.com', accent: 'yellow' as const, char: CAMPAIGN_CONSTANTS.assets.constructor, overlay: false },
    ] as const
  ).map(
    (m): AdCreative => {
      const hrUnit = m.hr === '1' ? 'hora' : 'horas';
      return {
        id: `story-vamos-${m.hr}h-hito`,
        title: `Historia · ¡Ya vamos ${m.hr} ${hrUnit} al aire!`,
        subtitle: `${m.day} · Cortina gráfica (no PNG) de avance en vivo para Stories`,
        format: 'story',
        category: 'horas',
        defaultTheme: 'cortina',
        defaultAspect: '9:16',
        supportsHourCounter: true,
        defaultHourValue: m.hr,
        objective: `Reportar hito gráfico de ${m.hr} ${hrUnit} y activar donaciones`,
        caption: `🔥⏰ ¡YA LLEVAMOS {HORAS} ${hrUnit.toUpperCase()} DE STREAMING SOLIDARIO POR LA SUPERCASA!
Seguimos transmitiendo en vivo junto a @kavanahpl35 y @segundosdevidafundacion. La casa va al 60%, ¡ayúdanos a terminarla!

🏡 Página principal (causa, live y donaciones): https://${m.url}
🫆 Donar directo: https://supercasa.svgvisual.com/donar
📺 En vivo: https://supercasa.svgvisual.com/envivo

#48HorasPorLaSupercasa #PonteLaCapa #SuperNavidad48H #SegundosDeVida`,
        slides: [
          {
            id: `story-vamos-${m.hr}h-hito-s1`,
            slideNumber: 1,
            isTransparentOverlay: m.overlay,
            kicker: `${m.day} · STREAMING SOLIDARIO`,
            headline: m.hr === '1' ? '¡Ya vamos {HORAS} hora al aire!' : '¡Ya vamos {HORAS} horas al aire!',
            speechBubble: m.bubble,
            body: 'La Supercasa está al 60%. Entra al vivo o pon tu pieza hoy.',
            giantNumber: `${m.hr.padStart(2, '0')}H`,
            accentColor: m.accent,
            urlLabel: m.url === 'supercasa.svgvisual.com' ? 'CAUSA, VIVO Y DONACIONES EN' : 'ENTRA AHORA EN',
            urlText: m.url,
            characterImage: m.char,
            showQr: true,
          },
        ],
      };
    },
  ),

  // ==================== +10 HISTORIAS DE BLOQUES (03 AL 12 + MULTISTREAM HUB) ====================
  ...(
    [
      {
        id: 'story-empieza-bloque-03',
        num: '03',
        title: 'Historia · Ya empieza Bloque 03: Desvelo Paranormal',
        schedule: 'Sáb 21 Nov · 02:00 – 06:00 a. m. (Tentativo)',
        headline: 'Desvelo Paranormal en vivo',
        bubble: 'Podcast Rock/Metal LATAM + monitoreo cardíaco en madrugada 👻🎸',
        host: 'Luz Gardenia y Libardo',
        accent: 'cyan' as const,
        char: CAMPAIGN_CONSTANTS.assets.calvito,
        url: 'supercasa.svgvisual.com/envivo',
      },
      {
        id: 'story-empieza-bloque-04',
        num: '04',
        title: 'Historia · Ya empieza Bloque 04: Mañanero con Fe y Café',
        schedule: 'Sáb 21 Nov · 06:00 – 10:00 a. m. (Tentativo)',
        headline: 'Mañanero con Fe y Café',
        bubble: 'Consultorio legal en vivo + meta de desayunos solidarios ☕💛',
        host: 'Cris',
        accent: 'yellow' as const,
        char: CAMPAIGN_CONSTANTS.assets.chef,
        url: 'supercasa.svgvisual.com',
      },
      {
        id: 'story-empieza-bloque-06',
        num: '06',
        title: 'Historia · Ya empieza Bloque 06: Festival de Talentos',
        schedule: 'Sáb 21 Nov · 14:00 – 18:00 (Tentativo)',
        headline: 'Festival de Talentos Kavanah',
        bubble: 'Muestra de talentos + cocina express solidaria en directo 🎤🍲',
        host: 'Paola',
        accent: 'lime' as const,
        char: CAMPAIGN_CONSTANTS.assets.chef,
        url: 'supercasa.svgvisual.com/envivo',
      },
      {
        id: 'story-empieza-bloque-07',
        num: '07',
        title: 'Historia · Ya empieza Bloque 07: Gran Gala de los Sueños',
        schedule: 'Sáb 21 Nov · 18:00 – 22:00 (Tentativo)',
        headline: 'La Gran Gala de los Sueños',
        bubble: '¡Noche estelar! Apadrinemos las 14 habitaciones de La Supercasa ✨🏡',
        host: 'Sebas',
        accent: 'magenta' as const,
        char: CAMPAIGN_CONSTANTS.assets.empresaria,
        url: 'supercasa.svgvisual.com/donar',
      },
      {
        id: 'story-empieza-bloque-08',
        num: '08',
        title: 'Historia · Ya empieza Bloque 08: Retro Arcade & Leyendas',
        schedule: 'Sáb 21 – Dom 22 · 22:00 – 02:00 (Tentativo)',
        headline: 'Retro Arcade: Noche 80s & 90s',
        bubble: '¡Torneo Street Fighter y Mario Kart por los Super Calvitos! 🕹️🔥',
        host: 'Deivid',
        accent: 'cyan' as const,
        char: CAMPAIGN_CONSTANTS.assets.piloto,
        url: 'supercasa.svgvisual.com/envivo',
      },
      {
        id: 'story-empieza-bloque-09',
        num: '09',
        title: 'Historia · Ya empieza Bloque 09: Maratón Speedrun',
        schedule: 'Dom 22 Nov · 02:00 – 06:00 a. m. (Tentativo)',
        headline: 'Maratón Extrema: Speedrun',
        bubble: 'Reto contra el reloj con ayudas activadas por tus donaciones ⏱️🎮',
        host: 'Libardo',
        accent: 'lime' as const,
        char: CAMPAIGN_CONSTANTS.assets.bombero,
        url: 'supercasa.svgvisual.com',
      },
      {
        id: 'story-empieza-bloque-10',
        num: '10',
        title: 'Historia · Ya empieza Bloque 10: Despertar Solidario',
        schedule: 'Dom 22 Nov · 06:00 – 10:00 a. m. (Tentativo)',
        headline: 'Despertar Solidario e Historias',
        bubble: 'Especial Carnaval de Riosucio + meta de línea blanca para la casa 🏡💛',
        host: 'Cris y Luz Gardenia',
        accent: 'yellow' as const,
        char: CAMPAIGN_CONSTANTS.assets.doctora,
        url: 'supercasa.svgvisual.com',
      },
      {
        id: 'story-empieza-bloque-11',
        num: '11',
        title: 'Historia · Ya empieza Bloque 11: Desafío de Creadores',
        schedule: 'Dom 22 Nov · 10:00 – 14:00 (Tentativo)',
        headline: 'Batalla de Creadores por la Causa',
        bubble: '¡Batalla de fandoms, retos físicos y trivias en vivo! 💥🦸',
        host: 'Paola',
        accent: 'magenta' as const,
        char: CAMPAIGN_CONSTANTS.assets.policia,
        url: 'supercasa.svgvisual.com/envivo',
      },
      {
        id: 'story-empieza-bloque-12',
        num: '12',
        title: 'Historia · Ya empieza Bloque 12: Gran Cierre Cumbre',
        schedule: 'Dom 22 Nov · 14:00 – 18:00 (Tentativo)',
        headline: 'Gran Cierre: Cumbre de Esperanza',
        bubble: '¡Último bloque! Apertura simbólica de La Supercasa junto a todos 🏡❤️',
        host: 'Equipo Kavanah + FSV',
        accent: 'yellow' as const,
        char: CAMPAIGN_CONSTANTS.assets.constructor,
        url: 'supercasa.svgvisual.com',
      },
      {
        id: 'story-multistream-comunidad',
        title: 'Historia · Únete al Multistream Solidario (Todos los Canales)',
        subtitle: 'Invitación directa a streamers y comunidad sin importar plataforma o viewers',
        schedule: 'Vie 20 Nov 6 p. m. → Dom 22 Nov 6 p. m.',
        num: '48H',
        headline: '¡Ponte la capa desde tu stream!',
        bubble: 'No importa tu plataforma ni tus viewers: hoy nos unimos por sonrisas 🌎❤️',
        host: 'Comunidad Streamer LATAM',
        accent: 'magenta' as const,
        char: CAMPAIGN_CONSTANTS.assets.calvita,
        url: 'supercasa.svgvisual.com',
      },
    ] as const
  ).map(
    (b): AdCreative => ({
      id: b.id,
      title: b.title,
      subtitle: 'subtitle' in b ? b.subtitle : `${b.schedule} · Conduce: ${b.host}`,
      format: 'story',
      category: 'bloques',
      defaultTheme: 'cortina',
      defaultAspect: '9:16',
      objective: 'Convocar audiencia al bloque en vivo',
      caption: `📺🚨 ¡YA VA A EMPEZAR: ${b.headline.toUpperCase()}!
📅 ${b.schedule} · Conduce: ${b.host}

🏡 Página oficial (causa, live y donaciones): https://supercasa.svgvisual.com/
📺 Transmisión en vivo: https://supercasa.svgvisual.com/envivo
🫆 Dona aquí: https://supercasa.svgvisual.com/donar

#48HorasPorLaSupercasa #PonteLaCapa #SuperNavidad48H`,
      slides: [
        {
          id: `${b.id}-s1`,
          slideNumber: 1,
          kicker: `BLOQUE ${b.num} · ${b.schedule.toUpperCase()}`,
          headline: b.headline,
          speechBubble: b.bubble,
          body: `Conduce: ${b.host}. Mira el vivo y apoya La Supercasa (60%).`,
          giantNumber: b.num,
          accentColor: b.accent,
          urlLabel: b.url === 'supercasa.svgvisual.com' ? 'VIVO Y DONACIONES EN' : 'MIRA EL EN VIVO EN',
          urlText: b.url,
          characterImage: b.char,
          showQr: true,
        },
      ],
    }),
  ),

  // ==================== +8 PIEZAS EXTRA DE SUEÑOS 3D Y PÁGINA PRINCIPAL ====================
  {
    id: 'story-policia-sueno',
    title: 'Historia · Sueño de Policía Calvita (Globo Caricatura)',
    subtitle: 'Super Calvita policía directa sobre cielo con globo de diálogo',
    format: 'story',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '9:16',
    objective: 'Empatía y donación desde Stories',
    caption: `💙⭐ ¡Tu aporte me acerca a cumplir mi sueño de ser policía y cuidar a más niños!
La Supercasa ya está al 60%. Ayúdanos a terminarla en:
🏡 https://supercasa.svgvisual.com/
🫆 https://supercasa.svgvisual.com/donar

#SuperNavidad48H #PonteLaCapa #SegundosDeVida`,
    slides: [
      {
        id: 'story-policia-sueno-s1',
        slideNumber: 1,
        kicker: 'LOS SUPER CALVITOS SUEÑAN EN GRANDE',
        headline: 'Cuidemos su hogar en Bogotá',
        speechBubble: '¡Tu aporte me acerca más a cumplir mi sueño de ser policía! 🚓💙',
        body: 'Falta el 40% para recibir a 15 niños en tratamiento.',
        accentColor: 'cyan',
        urlLabel: 'CONOCE Y DONA EN',
        urlText: 'supercasa.svgvisual.com',
        characterImage: CAMPAIGN_CONSTANTS.assets.policia,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-constructor-sueno',
    title: 'Historia · Sueño de Constructor (Pon Tu Ladrillo)',
    subtitle: 'Calvito constructor invitando a poner un ladrillo en La Supercasa',
    format: 'story',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '9:16',
    objective: 'Conversión directa con metáfora de construcción',
    caption: `👷🧱 ¡Tu aporte pone un ladrillo real en La Supercasa!
Ya llevamos el 60% construido en Galerías, Bogotá.
🏡 Página principal: https://supercasa.svgvisual.com/
🫆 Dona aquí: https://supercasa.svgvisual.com/donar

#LaSupercasa #PonteLaCapa #SegundosDeVida`,
    slides: [
      {
        id: 'story-constructor-sueno-s1',
        slideNumber: 1,
        kicker: 'OBRA AL 60% · GALERÍAS, BOGOTÁ',
        headline: '¡Construyamos juntos el 40% final!',
        speechBubble: '¡Quiero ser constructor! Pon tu ladrillo en nuestra casa hoy 🧱👷',
        body: 'Cada aporte desde $20.000 COP se suma a la meta.',
        accentColor: 'yellow',
        urlLabel: 'PON TU PIEZA AQUÍ',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.constructor,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-empresaria-padrino',
    title: 'Historia · Plan Padrino Empresas (Certificado NIT)',
    subtitle: 'Calvita empresaria invitando a pymes, marcas y padrinos',
    format: 'story',
    category: 'donar',
    defaultTheme: 'calvito',
    defaultAspect: '9:16',
    objective: 'Atraer padrinos de $250k a $1M+',
    caption: `💼💛 ¿Tu marca o familia quiere apadrinar una ventana, baño o habitación de La Supercasa?
Fundación Segundos de Vida emite certificado de donación (NIT 900.649.809-2).

🏡 Conoce toda la causa y dona: https://supercasa.svgvisual.com/
🫆 Plan Padrino directo: https://supercasa.svgvisual.com/donar

#PlanPadrino #LaSupercasa #SegundosDeVida`,
    slides: [
      {
        id: 'story-empresaria-padrino-s1',
        slideNumber: 1,
        kicker: 'PLAN PADRINO · NIT 900.649.809-2',
        headline: 'Apadrina una habitación equipada',
        speechBubble: '¡Tu empresa puede regalar un cuarto completo con certificado oficial! 💼✨',
        body: 'Ventana $100k · Baño $250k · Habitación $1.000.000 COP.',
        accentColor: 'yellow',
        urlLabel: 'APADRINA HOY EN',
        urlText: 'supercasa.svgvisual.com/donar',
        characterImage: CAMPAIGN_CONSTANTS.assets.empresaria,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-ejecutivo-aliados',
    title: 'Historia · Alianzas & Creadores (Todo en la Web Principal)',
    subtitle: 'Calvito ejecutivo dirigiendo tráfico al hub supercasa.svgvisual.com',
    format: 'story',
    category: 'donar',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    objective: 'Tráfico al sitio principal supercasa.svgvisual.com',
    caption: `🤝❤️ Todo el evento, la transmisión en vivo, el avance de la casa y las donaciones están en un solo lugar:
👉 https://supercasa.svgvisual.com/

Viernes 20 nov 6:00 p. m. → Domingo 22 nov 6:00 p. m. (Hora Bogotá).
#PonteLaCapa #48HorasPorLaSupercasa #SegundosDeVida`,
    slides: [
      {
        id: 'story-ejecutivo-aliados-s1',
        slideNumber: 1,
        kicker: 'HUB OFICIAL DEL EVENTO 48H',
        headline: 'Causa, en vivo y donaciones en un lugar',
        speechBubble: '¡Todo ocurre en supercasa.svgvisual.com! Entra y súmate ❤️',
        body: 'Disponible para donar desde Colombia y el exterior.',
        giantNumber: '60%',
        accentColor: 'cyan',
        urlLabel: 'PÁGINA PRINCIPAL DEL EVENTO',
        urlText: 'supercasa.svgvisual.com',
        characterImage: CAMPAIGN_CONSTANTS.assets.ejecutivo,
        showQr: true,
      },
    ],
  },
  {
    id: 'post-astronauta-sueno',
    title: 'Post 4:5 · Escena 3D Astronauta (Feed Instagram)',
    subtitle: 'Versión vertical 4:5 de la escena 3D astronauta para el feed principal',
    format: 'post',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '4:5',
    objective: 'Compartidos y guardados en el feed',
    caption: `🚀✨ ¡Que ningún niño deje de soñar con las estrellas!
Con tu aporte en las 48 Horas por La Supercasa ayudamos a terminar su hogar en Bogotá (60% listo).

🏡 Página principal y donaciones: https://supercasa.svgvisual.com/
#SuperNavidad48H #PonteLaCapa #SegundosDeVida`,
    slides: [
      {
        id: 'post-astronauta-sueno-s1',
        slideNumber: 1,
        kicker: 'SUEÑAN SIN LÍMITES · BOGOTÁ',
        headline: '¡Despeguemos juntos La Supercasa!',
        speechBubble: '¡Tu aporte me acerca más a ser astronauta y seguir luchando! 🚀',
        body: 'Obra al 60%. Dona en supercasa.svgvisual.com.',
        accentColor: 'cyan',
        urlLabel: 'CAUSA, VIVO Y DONACIONES EN',
        urlText: 'supercasa.svgvisual.com',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.sceneAstronauta,
        showQr: true,
      },
    ],
  },
  {
    id: 'post-pintora-pieza',
    title: 'Post 4:5 · Escena 3D Pintora (Feed Instagram)',
    subtitle: 'Versión 4:5 para el feed mostrando a Calvita pintando la casita',
    format: 'post',
    category: 'suenos',
    defaultTheme: 'calvito',
    defaultAspect: '4:5',
    objective: 'Microdonaciones de pintura y ventanas desde el feed',
    caption: `🎨🏡 ¡Tu aporte pinta de alegría La Supercasa!
Con $50.000 COP regalas pintura y con $100.000 una ventana para un cuarto.
🏡 Todo en: https://supercasa.svgvisual.com/
🫆 Dona directo: https://supercasa.svgvisual.com/donar

#LaSupercasa #SuperNavidad48H #SegundosDeVida`,
    slides: [
      {
        id: 'post-pintora-pieza-s1',
        slideNumber: 1,
        kicker: 'PON TU COLOR EN LA SUPERCASA',
        headline: 'Pintemos juntos su nuevo hogar',
        speechBubble: '¡Con $50.000 pintas mi cuarto y con $100.000 pones mi ventana! 🎨',
        body: 'Dona en línea con Nequi, PSE, Daviplata o Bancolombia.',
        accentColor: 'yellow',
        urlLabel: 'PON TU PIEZA HOY EN',
        urlText: 'supercasa.svgvisual.com/donar',
        fullSceneImage: CAMPAIGN_CONSTANTS.assets.scenePintora,
        showQr: true,
      },
    ],
  },
  {
    id: 'story-hub-principal-supercasa',
    title: 'Historia · Todo Pasa en supercasa.svgvisual.com',
    subtitle: 'Historia central de tráfico al sitio principal con foto real de la obra',
    format: 'story',
    category: 'donar',
    defaultTheme: 'cortina',
    defaultAspect: '9:16',
    objective: 'Concentrar visitas, streaming y donaciones en la home',
    caption: `🏡❤️ ¿Quieres conocer la causa, ver la transmisión 48H y donar?
¡Todo pasa en nuestra página principal!
👉 https://supercasa.svgvisual.com/

Viernes 20 nov 6:00 p. m. → Domingo 22 nov 6:00 p. m. (Bogotá).
#PonteLaCapa #48HorasPorLaSupercasa #SegundosDeVida`,
    slides: [
      {
        id: 'story-hub-principal-supercasa-s1',
        slideNumber: 1,
        kicker: 'PÁGINA PRINCIPAL · CAUSA + VIVO + DONAR',
        headline: 'Todo el evento en un solo enlace',
        speechBubble: 'Entra a ver la casa, la transmisión en vivo y pon tu pieza 🏡✨',
        body: 'Obra real al 60% en Galerías, Bogotá (Cr. 28 Bis #51-33).',
        giantNumber: '60%',
        accentColor: 'yellow',
        urlLabel: 'ENTRA A LA PÁGINA PRINCIPAL',
        urlText: 'supercasa.svgvisual.com',
        houseImage: CAMPAIGN_CONSTANTS.assets.house100,
        showProgressBar: true,
        progressPercent: 60,
        showQr: true,
      },
    ],
  },
  {
    id: 'post-no-competimos-sonrisas',
    title: 'Post 1:1 · Hoy no competimos por viewers, nos unimos por sonrisas',
    subtitle: 'Frase insignia del mensaje oficial para compartir en comunidades streamer',
    format: 'post',
    category: 'bloques',
    defaultTheme: 'cortina',
    defaultAspect: '1:1',
    objective: 'Viralidad en comunidad streamer y aliados',
    caption: `❤️🦸‍♂️ Hoy no competimos por espectadores, ¡nos unimos por sonrisas!
48 horas de multistream solidario (Viernes 20 nov 6 p. m. → Domingo 22 nov 6 p. m.) por Fundación @segundosdevidafundacion junto a @kavanahpl35.

🏡 Todo en: https://supercasa.svgvisual.com/
#PonteLaCapa #SuperNavidad48H #48HorasPorLaSupercasa`,
    slides: [
      {
        id: 'post-no-competimos-sonrisas-s1',
        slideNumber: 1,
        kicker: 'MULTISTREAM SOLIDARIO · 20 AL 22 DE NOVIEMBRE',
        headline: 'Hoy nos unimos por sonrisas',
        speechBubble: '¡Cada visita, difusión y aporte cambia la vida de un Super Calvito! ❤️',
        body: '48 horas continuas por la meta de La Supercasa.',
        giantNumber: '48H',
        accentColor: 'magenta',
        urlLabel: 'ÚNETE A LA MISIÓN EN',
        urlText: 'supercasa.svgvisual.com',
        characterImage: CAMPAIGN_CONSTANTS.assets.bombero,
        secondaryCharacterImage: CAMPAIGN_CONSTANTS.assets.policia,
        showQr: true,
      },
    ],
  },
];

export interface CountdownState {
  phase: 'upcoming' | 'live' | 'ended';
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  headline: string;
}

export function getCountdownState(now: Date = new Date()): CountdownState {
  const startMs = new Date(CAMPAIGN_CONSTANTS.eventStartIso).getTime();
  const endMs = new Date(CAMPAIGN_CONSTANTS.eventEndIso).getTime();
  const currentMs = now.getTime();

  if (currentMs < startMs) {
    const diff = Math.max(0, startMs - currentMs);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      phase: 'upcoming',
      days,
      hours,
      minutes,
      seconds,
      headline: 'Faltan para el inicio en vivo (Vie 20 Nov · 6:00 p. m. Bogotá)',
    };
  }

  if (currentMs <= endMs) {
    const diff = Math.max(0, endMs - currentMs);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      phase: 'live',
      days,
      hours,
      minutes,
      seconds,
      headline: 'Maratón 48 horas EN VIVO ahora mismo',
    };
  }

  return {
    phase: 'ended',
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    headline: 'La maratón culminó, pero La Supercasa sigue recibiendo donaciones',
  };
}

export function getCanvasDimensions(
  aspect: '9:16' | '4:5' | '1:1',
): { width: number; height: number; label: string } {
  switch (aspect) {
    case '9:16':
      return { width: 1080, height: 1920, label: '1080 × 1920 px (Historia IG / Reel)' };
    case '4:5':
      return { width: 1080, height: 1350, label: '1080 × 1350 px (Post Vertical / Carrusel)' };
    case '1:1':
      return { width: 1080, height: 1080, label: '1080 × 1080 px (Post Cuadrado)' };
  }
}

export function resolveDynamicTokens(
  text: string,
  options: { hoursValue?: string; kickHandle?: string },
): string {
  const hours = (options.hoursValue ?? '12').trim() || '12';
  const kick = (options.kickHandle ?? 'deivid').trim().replace(/^@+/, '') || 'deivid';
  return text.replace(/\{HORAS\}/g, hours).replace(/\{KICK\}/g, kick);
}

export function filterCreatives(
  creatives: AdCreative[],
  formatFilter: 'all' | AdFormat,
  categoryFilter: 'all' | AdCategory = 'all',
  searchQuery: string = '',
): AdCreative[] {
  const q = searchQuery.trim().toLowerCase();
  return creatives.filter((item) => {
    if (formatFilter !== 'all' && item.format !== formatFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (!q) return true;
    const inHeader =
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.objective.toLowerCase().includes(q);
    const inSlides = item.slides.some(
      (s) =>
        s.headline.toLowerCase().includes(q) ||
        s.body.toLowerCase().includes(q) ||
        (s.speechBubble ?? '').toLowerCase().includes(q) ||
        s.kicker.toLowerCase().includes(q),
    );
    return inHeader || inSlides;
  });
}

export function resolveQrTarget(
  slide: Pick<CreativeSlide, 'defaultQrTarget' | 'urlText'>,
  override?: QrTarget,
): QrTarget {
  if (override === 'live' || override === 'donate') {
    return override;
  }
  if (slide.defaultQrTarget === 'live' || slide.defaultQrTarget === 'donate') {
    return slide.defaultQrTarget;
  }
  if (slide.urlText.toLowerCase().includes('/envivo')) {
    return 'live';
  }
  return 'donate';
}

export function getCreativeDefaultQrTarget(creative: AdCreative): QrTarget {
  const qrSlide =
    creative.slides.find((s) => s.showQr) ??
    creative.slides[creative.slides.length - 1] ??
    creative.slides[0];
  return resolveQrTarget(qrSlide);
}

export function resolveSlideUrlText(
  slide: Pick<CreativeSlide, 'defaultQrTarget' | 'urlText'>,
  options: {
    customUrlText?: string;
    qrTargetOverride?: QrTarget;
    hoursValue?: string;
    kickHandle?: string;
  },
): string {
  if (options.customUrlText?.trim()) {
    return resolveDynamicTokens(options.customUrlText.trim(), options);
  }
  const baseUrl = resolveDynamicTokens(slide.urlText.trim(), options);
  if (options.qrTargetOverride === 'live') {
    return 'supercasa.svgvisual.com/envivo';
  }
  if (options.qrTargetOverride === 'donate') {
    return 'supercasa.svgvisual.com/donar';
  }
  return baseUrl;
}

export function resolveSlideUrlLabel(
  slide: Pick<CreativeSlide, 'urlLabel'>,
  options: {
    qrTargetOverride?: QrTarget;
    hoursValue?: string;
    kickHandle?: string;
  },
): string {
  if (options.qrTargetOverride === 'live') {
    return 'MIRA EL EN VIVO EN';
  }
  if (options.qrTargetOverride === 'donate') {
    return 'ESCANEA Y DONA EN';
  }
  return resolveDynamicTokens(slide.urlLabel, options);
}

export function buildCustomizedCaption(
  creative: AdCreative,
  options: { creatorHandle?: string; hoursValue?: string; kickHandle?: string } | string,
): string {
  const opts =
    typeof options === 'string'
      ? { creatorHandle: options }
      : options;
  const resolved = resolveDynamicTokens(creative.caption, {
    hoursValue: opts.hoursValue ?? creative.defaultHourValue,
    kickHandle: opts.kickHandle ?? creative.defaultKickHandle,
  });
  const cleanHandle = opts.creatorHandle?.trim().replace(/^@+/, '');
  if (!cleanHandle) {
    return resolved;
  }
  return `🦸‍♂️ Transmisión aliada junto a @${cleanHandle}\n\n${resolved}`;
}
