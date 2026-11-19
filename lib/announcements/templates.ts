export const LIVE_URL = "https://supercasa.svgvisual.com/envivo";
export const DONATE_URL = "https://supercasa.svgvisual.com/donar";

export type AnnouncementContent = {
  subject: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function announcementHtml(
  content: AnnouncementContent,
  name?: string | null,
): string {
  const safeName = name?.trim();
  const greeting = safeName ? `Hola, ${escapeHtml(safeName)}.` : "Hola.";
  const body = escapeHtml(content.message).replace(/\n/g, "<br />");
  const ctaLabel = escapeHtml(content.ctaLabel || "Entrar al live");
  const ctaUrl = escapeHtml(content.ctaUrl || LIVE_URL);

  return `
  <div style="margin:0;padding:24px;background:#fffaf0;font-family:Arial,Helvetica,sans-serif;color:#1d2b4f">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:2px solid #0f2354;border-radius:20px;padding:28px">
      <p style="margin:0 0 6px;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#e6009e">La Supercasa</p>
      <h1 style="margin:0 0 14px;font-size:24px;line-height:1.2;color:#0f2354">${greeting}</h1>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6">${body}</p>
      <p style="margin:0 0 22px">
        <a href="${ctaUrl}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#e6009e;color:#ffffff;font-weight:800;text-decoration:none">${ctaLabel}</a>
      </p>
      <p style="margin:0 0 6px;font-size:13px;line-height:1.5;color:#64748b">
        Maratón de 48 horas por La Supercasa. Del viernes 20 al domingo 22 de noviembre,
        hora de Bogotá.
      </p>
      <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8">
        Evento de Familia Kavanah a beneficio de la Fundación Segundos de Vida.
        Si no quieres recibir más correos, responde a este mensaje y te sacamos de la lista.
      </p>
    </div>
  </div>`;
}
