// Textos y datos de la pantalla de cierre de la maratón.
// La campaña sigue abierta después del directo, así que el único dato que se
// muestra es cuánto falta para el 30 de noviembre.

export const CAMPAIGN_END = new Date("2026-11-30T23:59:59-05:00");

// Misma cuenta que usa el contador del home, para que ambos digan lo mismo.
export function daysLeft(now = new Date()): number {
  const diff = CAMPAIGN_END.getTime() - now.getTime();
  if (diff <= 0) return 0;
  return Math.max(1, Math.ceil(diff / 86_400_000));
}

export function daysLeftLabel(now = new Date()): string {
  if (now >= CAMPAIGN_END) return "La campaña cerró, gracias";
  const days = daysLeft(now);
  if (days === 1) return "Último día de campaña";
  return `Quedan ${days} días`;
}

export const KAVANAH = {
  label: "Una campaña de Familia Kavanah",
  instagram: "https://www.instagram.com/kavanahpl35/",
  tiktok: "https://www.tiktok.com/@kavanah35",
  youtube: "https://www.youtube.com/@KavanahPL35",
};

export const THANKS = {
  eyebrow: "48 horas por La Supercasa",
  titleLead: "Gracias,",
  titleRest: "lo hicimos juntos",
  body:
    "Gracias por estas 48 horas juntos, construyendo La Supercasa para los Súper Calvitos.",
  note: "La transmisión terminó. La campaña sigue abierta.",
  primary: "Donar ahora",
  secondary: "Conoce Kavanah",
  houseAlt: "La Supercasa terminada, con sus cuatro pisos y la terraza",
};
