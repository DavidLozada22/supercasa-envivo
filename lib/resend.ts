const LIVE_URL = "https://supercasa.svgvisual.com/envivo";
const DONATE_URL = "https://supercasa.svgvisual.com/donar";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendReminderEmail(input: {
  to: string;
  name?: string | null;
  kind: "confirmation" | "reminder";
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Falta RESEND_API_KEY" };

  const from = process.env.RESEND_FROM || "La Supercasa <recordatorios@svgvisual.com>";
  const name = input.name?.trim();
  const subject =
    input.kind === "confirmation"
      ? "Quedaste en la lista de La Supercasa"
      : "La Supercasa empieza el viernes: aquí está tu enlace";
  const intro =
    input.kind === "confirmation"
      ? "Gracias por sumarte. Te escribiremos cuando empiece la transmisión."
      : "La maratón de 48 horas está por comenzar. Este es tu enlace.";

  const html = `
  <div style="margin:0;padding:24px;background:#fffaf0;font-family:Arial,Helvetica,sans-serif;color:#1d2b4f">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:2px solid #1d2b4f;border-radius:20px;padding:28px">
      <p style="margin:0 0 6px;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#e53935">La Supercasa</p>
      <h1 style="margin:0 0 12px;font-size:26px;line-height:1.15">${name ? `Hola, ${escapeHtml(name)}.` : "Hola."}</h1>
      <p style="margin:0 0 10px;font-size:15px;line-height:1.55">${intro}</p>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.55">
        Viernes 20 de noviembre, 6:00 p. m., a domingo 22, 6:00 p. m. Hora de Bogotá.
      </p>
      <p style="margin:0 0 20px">
        <a href="${LIVE_URL}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:999px;background:#e53935;color:#fff;font-weight:800;text-decoration:none">Entrar al live</a>
        <a href="${DONATE_URL}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:999px;background:#ffd400;color:#1d2b4f;font-weight:800;text-decoration:none">Donar ahora</a>
      </p>
      <p style="margin:0;font-size:12px;line-height:1.5;color:#64748b">
        Evento de Familia Kavanah a beneficio de la Fundación Segundos de Vida.
        Si no quieres recibir más correos, responde a este mensaje y te sacamos de la lista.
      </p>
    </div>
  </div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject,
        html,
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return { ok: false, error: `Resend ${response.status}: ${detail.slice(0, 200)}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo conectar con Resend." };
  }
}
