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

  const from = process.env.RESEND_FROM || "La Supercasa <no-responder@supercasa.svgvisual.com>";
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

export async function sendDonationThanks(input: {
  to: string;
  name?: string | null;
  amountCop: number;
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Falta RESEND_API_KEY" };

  const from = process.env.RESEND_FROM || "La Supercasa <no-responder@supercasa.svgvisual.com>";
  const name = input.name?.trim();
  const amount = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(input.amountCop);
  const subject = "Gracias por poner tu pieza en La Supercasa";
  const base = "https://supercasa.svgvisual.com";
  const share = encodeURIComponent(
    "Estoy apoyando La Supercasa, la casa de los Súper Calvitos. Mira el avance y súmate: https://supercasa.svgvisual.com/envivo",
  );

  const html = `
  <div style="margin:0;padding:24px;background:#fffaf0;font-family:Arial,Helvetica,sans-serif;color:#1d2b4f">
    <div style="max-width:600px;margin:0 auto;overflow:hidden;border:2px solid #0f2354;border-radius:22px;background:#ffffff">
      <div style="padding:22px 26px;background:#0f2354;text-align:center">
        <img src="${base}/img/logo-fsv-official.png" alt="Fundación Segundos de Vida" height="40" style="display:inline-block;height:40px;width:auto;vertical-align:middle" />
        <span style="display:inline-block;padding:0 10px;color:#ffffff;font-size:18px;font-weight:700;vertical-align:middle">×</span>
        <img src="${base}/img/kavanah-horizontal-gold.png" alt="Kavanah" height="34" style="display:inline-block;height:34px;width:auto;vertical-align:middle" />
      </div>

      <div style="padding:28px 28px 8px;text-align:center">
        <p style="margin:0 0 6px;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#e6009e">Tu pieza ya está en la casa</p>
        <h1 style="margin:0 0 10px;font-size:27px;line-height:1.15;color:#0f2354">${name ? `Gracias, ${escapeHtml(name)}.` : "Gracias por tu donación."}</h1>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#334155">
          Tu aporte de <strong style="color:#0f2354">${amount}</strong> ya es una pieza real de La Supercasa.
          Cada ventana, cada baño y cada habitación se construye con gestos como el tuyo.
        </p>
      </div>

      <div style="padding:18px 28px;text-align:center">
        <img src="${base}/img/casa/supercasa-100-800.webp" alt="La Supercasa terminada" width="520" style="display:block;width:100%;max-width:520px;height:auto;margin:0 auto;border-radius:16px;border:1px solid #e2e8f0" />
        <img src="${base}/constructor.png" alt="Súper Calvito constructor" width="150" style="display:block;width:150px;height:auto;margin:-30px auto 0" />
      </div>

      <div style="padding:0 28px 24px;text-align:center">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155">
          La maratón termina el 22 de noviembre, pero la campaña sigue abierta hasta el
          <strong style="color:#0f2354">30 de noviembre</strong>. Todavía puedes invitar a tu familia,
          a tu empresa o donar en especie.
        </p>
        <p style="margin:0 0 18px">
          <a href="${base}/donar" style="display:inline-block;margin:0 6px 8px 0;padding:13px 22px;border-radius:999px;background:#e6009e;color:#ffffff;font-weight:800;text-decoration:none">Ver el avance</a>
          <a href="https://wa.me/?text=${share}" style="display:inline-block;margin:0 6px 8px 0;padding:13px 22px;border-radius:999px;background:#0f2354;color:#ffffff;font-weight:800;text-decoration:none">Compartir La Supercasa</a>
        </p>
        <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#64748b">
          Si necesitas certificado de donación, escríbenos al
          <a href="https://wa.me/573175658064?text=Hola%2C%20necesito%20certificado%20de%20donaci%C3%B3n%20de%20La%20Supercasa" style="color:#0f2354;font-weight:700">WhatsApp +57 317 565 8064</a>
          con tu nombre y el valor del aporte.
        </p>
        <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8">
          Evento de Familia Kavanah a beneficio de la Fundación Segundos de Vida.
          @segundosdevidafundacion · @kavanahpl35
        </p>
      </div>
    </div>
  </div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [input.to], subject, html }),
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

export type ResendHealth = {
  keyPresent: boolean;
  from: string;
  domain: string;
  status: "verified" | "pending" | "not_started" | "failed" | "missing_key" | "not_found" | "error";
  checkedAt: string;
};

let healthCache: { at: number; value: ResendHealth } | null = null;

function fromAddress(): string {
  return process.env.RESEND_FROM || "La Supercasa <no-responder@supercasa.svgvisual.com>";
}

function fromEmail(): string {
  const match = fromAddress().match(/<([^>]+)>/);
  return match?.[1] ?? fromAddress();
}

function fromDomain(): string {
  const email = fromEmail();
  return email.split("@")[1] || "supercasa.svgvisual.com";
}

export async function resendHealth(force = false): Promise<ResendHealth> {
  const now = Date.now();
  if (!force && healthCache && now - healthCache.at < 60_000) return healthCache.value;

  const base: ResendHealth = {
    keyPresent: Boolean(process.env.RESEND_API_KEY),
    from: fromEmail(),
    domain: fromDomain(),
    status: "missing_key",
    checkedAt: new Date(now).toISOString(),
  };

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    healthCache = { at: now, value: base };
    return base;
  }

  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) {
      const value: ResendHealth = { ...base, status: "error" };
      healthCache = { at: now, value };
      return value;
    }
    const data = (await response.json()) as {
      data?: Array<{ name?: string; status?: string }>;
    };
    const item = (data.data ?? []).find((domain) => domain.name === base.domain);
    const raw = item?.status ?? "not_found";
    const status: ResendHealth["status"] =
      raw === "verified" || raw === "pending" || raw === "not_started" || raw === "failed"
        ? raw
        : raw === "temporary_failure"
          ? "pending"
          : "not_found";
    const value: ResendHealth = { ...base, status };
    healthCache = { at: now, value };
    return value;
  } catch {
    const value: ResendHealth = { ...base, status: "error" };
    healthCache = { at: now, value };
    return value;
  }
}

export async function sendTestEmail(to: string): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Falta RESEND_API_KEY" };

  const html = `
  <div style="margin:0;padding:24px;background:#fffaf0;font-family:Arial,Helvetica,sans-serif;color:#0f2354">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:2px solid #0f2354;border-radius:20px;padding:28px">
      <p style="margin:0 0 6px;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#e6009e">La Supercasa</p>
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.2">Correo de prueba</h1>
      <p style="margin:0;font-size:15px;line-height:1.55">Si estás leyendo esto, Resend quedó conectado y los recordatorios de la maratón pueden salir.</p>
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
        from: fromAddress(),
        to: [to],
        subject: "La Supercasa: prueba de Resend",
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
