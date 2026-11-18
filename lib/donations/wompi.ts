import { createHash, timingSafeEqual } from "node:crypto";

export type WompiMode = "mock" | "sandbox" | "production";
export type WompiStatus = "PENDING" | "APPROVED" | "DECLINED" | "VOIDED" | "ERROR";

export type WompiConfig = {
  mode: WompiMode;
  publicKey: string;
  privateKey: string;
  integritySecret: string;
  eventsSecret: string;
  baseUrl: string;
};

export type WompiTransaction = {
  id: string;
  status: WompiStatus;
  reference: string;
  amountInCents: number;
  currency: string;
  paymentMethodType: string | null;
  statusMessage: string | null;
};

export type WompiEvent = {
  event: string;
  data: { transaction?: Record<string, unknown> } & Record<string, unknown>;
  signature: { properties: string[]; checksum: string };
  timestamp: number;
  sent_at?: string;
};

const MOCK = {
  publicKey: "pub_test_MOCK",
  integritySecret: "test_integrity_MOCK",
  eventsSecret: "test_events_MOCK",
};

export function wompiConfig(): WompiConfig {
  const publicKey = process.env.WOMPI_PUBLIC_KEY ?? "";
  const privateKey = process.env.WOMPI_PRIVATE_KEY ?? "";

  if (!publicKey || !privateKey || publicKey.includes("REEMPLAZAR")) {
    return {
      mode: "mock",
      publicKey: MOCK.publicKey,
      privateKey: "",
      integritySecret: MOCK.integritySecret,
      eventsSecret: MOCK.eventsSecret,
      baseUrl: "",
    };
  }

  const production = publicKey.startsWith("pub_prod_");
  return {
    mode: production ? "production" : "sandbox",
    publicKey,
    privateKey,
    integritySecret: process.env.WOMPI_INTEGRITY_SECRET ?? "",
    eventsSecret: process.env.WOMPI_EVENTS_SECRET ?? "",
    baseUrl: production ? "https://production.wompi.co/v1" : "https://sandbox.wompi.co/v1",
  };
}

/** La simulación solo vive fuera de producción: nunca puede inflar el recaudo real. */
export function simulationAllowed(): boolean {
  return wompiConfig().mode === "mock" && process.env.VERCEL_ENV !== "production";
}

/** Los pagos con tarjeta se pueden ofrecer si hay llaves o si el flujo simulado aplica. */
export function paymentsAvailable(): boolean {
  return wompiConfig().mode !== "mock" || simulationAllowed();
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export function integritySignature(
  reference: string,
  amountInCents: number,
  currency: string,
  secret: string,
): string {
  return sha256(`${reference}${amountInCents}${currency}${secret}`);
}

function valueAt(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (current, key) =>
        current && typeof current === "object"
          ? (current as Record<string, unknown>)[key]
          : undefined,
      source,
    );
}

export function eventChecksum(
  event: Pick<WompiEvent, "data" | "signature" | "timestamp">,
  secret: string,
): string {
  const values = event.signature.properties
    .map((property) => String(valueAt(event.data, property) ?? ""))
    .join("");
  return sha256(`${values}${event.timestamp}${secret}`);
}

export function verifyEvent(event: WompiEvent, secret: string): boolean {
  if (!secret || !event?.signature?.checksum || !Array.isArray(event.signature.properties)) {
    return false;
  }
  const expected = Buffer.from(eventChecksum(event, secret).toLowerCase());
  const received = Buffer.from(String(event.signature.checksum).toLowerCase());
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function parseTransaction(input: Record<string, unknown>): WompiTransaction {
  return {
    id: String(input.id),
    status: String(input.status) as WompiStatus,
    reference: String(input.reference),
    amountInCents: Number(input.amount_in_cents),
    currency: String(input.currency ?? "COP"),
    paymentMethodType: input.payment_method_type ? String(input.payment_method_type) : null,
    statusMessage: input.status_message ? String(input.status_message) : null,
  };
}

async function call<T>(config: WompiConfig, path: string): Promise<T> {
  const response = await fetch(`${config.baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${config.publicKey}` },
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await response.json().catch(() => ({}))) as { data?: unknown; error?: unknown };
  if (!response.ok) {
    throw new Error(
      `Wompi ${path} respondió ${response.status}: ${JSON.stringify(body.error ?? body).slice(0, 200)}`,
    );
  }
  return body.data as T;
}

export async function getTransaction(id: string): Promise<WompiTransaction | null> {
  const config = wompiConfig();
  if (config.mode === "mock") return null;
  try {
    return parseTransaction(
      await call<Record<string, unknown>>(config, `/transactions/${encodeURIComponent(id)}`),
    );
  } catch {
    return null;
  }
}

/** Evento firmado equivalente al de Wompi, para probar el flujo sin llaves. */
export function buildSignedEvent(
  transaction: WompiTransaction,
  secret: string,
): WompiEvent {
  const event: WompiEvent = {
    event: "transaction.updated",
    data: {
      transaction: {
        id: transaction.id,
        status: transaction.status,
        reference: transaction.reference,
        amount_in_cents: transaction.amountInCents,
        currency: transaction.currency,
        payment_method_type: transaction.paymentMethodType ?? "CARD",
        status_message: transaction.statusMessage,
      },
    },
    signature: {
      properties: ["transaction.id", "transaction.status", "transaction.amount_in_cents"],
      checksum: "",
    },
    timestamp: Math.floor(Date.now() / 1000),
    sent_at: new Date().toISOString(),
  };
  event.signature.checksum = eventChecksum(event, secret);
  return event;
}
