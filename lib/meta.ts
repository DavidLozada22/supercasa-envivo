import type { AppConfig } from "./types";

export type MetaMetrics = {
  connected: boolean;
  error?: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  reach: number;
  period: string;
};

const EMPTY: MetaMetrics = {
  connected: false,
  spend: 0,
  impressions: 0,
  clicks: 0,
  ctr: 0,
  cpc: 0,
  reach: 0,
  period: "last_7d",
};

const PRESETS: Record<string, string> = {
  today: "today",
  "7": "last_7d",
  "14": "last_14d",
  "30": "last_30d",
};

export async function fetchMetaMetrics(
  config: AppConfig,
  range = "7",
): Promise<MetaMetrics> {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) {
    return { ...EMPTY, error: "Falta META_ACCESS_TOKEN en las variables de entorno." };
  }

  const account = config.meta.adAccountId.replace(/^act_/i, "").trim();
  if (!account) {
    return { ...EMPTY, error: "Configura el ID de la cuenta publicitaria en el panel." };
  }

  const period = PRESETS[range] ?? PRESETS["7"];
  const params = new URLSearchParams({
    fields: "spend,impressions,clicks,ctr,cpc,reach",
    date_preset: period,
    level: "account",
    access_token: token,
  });

  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/act_${account}/insights?${params.toString()}`,
      { cache: "no-store" },
    );
    const payload = (await response.json()) as {
      data?: Array<Record<string, string>>;
      error?: { message?: string };
    };

    if (!response.ok || payload.error) {
      return {
        ...EMPTY,
        error: payload.error?.message ?? "Meta rechazó la consulta. Revisa el token y la cuenta.",
        period,
      };
    }

    const row = payload.data?.[0] ?? {};
    return {
      connected: true,
      spend: Number(row.spend ?? 0),
      impressions: Number(row.impressions ?? 0),
      clicks: Number(row.clicks ?? 0),
      ctr: Number(row.ctr ?? 0),
      cpc: Number(row.cpc ?? 0),
      reach: Number(row.reach ?? 0),
      period,
    };
  } catch {
    return { ...EMPTY, error: "No se pudo conectar con la API de Meta.", period };
  }
}
