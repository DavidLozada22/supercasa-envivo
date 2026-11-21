import { randomBytes } from "node:crypto";
import { findPiece, MAX_AMOUNT, MIN_AMOUNT } from "./catalog";
import { feeFor } from "./pricing";
import { normalizeAttribution } from "@/lib/attribution";
import { sendDonationThanks } from "@/lib/resend";
import {
  approvedTotal,
  dbClient,
  getDonation,
  insertDonation,
  logEvent,
  pendingWompi,
  transitionDonation,
  type Donation,
} from "./store";
import {
  buildSignedEvent,
  findTransactionByReference,
  getTransaction,
  integritySignature,
  parseTransaction,
  simulationAllowed,
  verifyEvent,
  wompiConfig,
  type WompiEvent,
  type WompiStatus,
  type WompiTransaction,
} from "./wompi";

export class DonationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export type Checkout = {
  reference: string;
  amountCop: number;
  fee: number;
  total: number;
  amountInCents: number;
  currency: "COP";
  publicKey: string;
  integrity: string;
  simulated: boolean;
};

type ParsedOrder = {
  pieceId: string;
  amountCop: number;
  donorName: string | null;
  donorEmail: string;
  donorPhone: string | null;
  showOnWall: boolean;
  certificate: { name: string; docType: string; docNumber: string } | null;
  attribution: ReturnType<typeof normalizeAttribution>;
};

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

function clean(value: unknown, max: number): string | null {
  const text = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  return text ? text.slice(0, max) : null;
}

export function parseOrder(body: unknown): ParsedOrder {
  const input = (body ?? {}) as Record<string, unknown>;
  const donor = (input.donor ?? {}) as Record<string, unknown>;

  const piece = findPiece(String(input.pieceId ?? ""));
  if (!piece) throw new DonationError("Elige una pieza.");

  const email = clean(donor.email, 254)?.toLowerCase() ?? "";
  if (!EMAIL.test(email)) throw new DonationError("Revisa tu correo.");
  if (donor.consent !== true) {
    throw new DonationError("Necesitamos tu autorización para registrar el aporte.");
  }

  const phone = clean(donor.phone, 20);
  if (phone && !/^[+\d\s()-]{7,20}$/.test(phone)) {
    throw new DonationError("Revisa tu número de WhatsApp.");
  }

  let certificate: ParsedOrder["certificate"] = null;
  if (donor.certificate && typeof donor.certificate === "object") {
    const cert = donor.certificate as Record<string, unknown>;
    const docType = String(cert.docType ?? "");
    const docNumber = clean(cert.docNumber, 20) ?? "";
    if (!["CC", "NIT", "CE", "PA"].includes(docType)) {
      throw new DonationError("Tipo de documento no válido para el certificado.");
    }
    if (!/^[0-9A-Za-z.\-]{4,20}$/.test(docNumber)) {
      throw new DonationError("Escribe el número de documento del certificado.");
    }
    certificate = {
      name: clean(cert.name, 100) ?? "",
      docType,
      docNumber,
    };
  }

  const amountCop = piece.amount > 0 ? piece.amount : Math.floor(Number(input.custom) || 0);
  if (piece.amount === 0) {
    if (amountCop < MIN_AMOUNT) {
      throw new DonationError(`El aporte mínimo es $${MIN_AMOUNT.toLocaleString("es-CO")}.`);
    }
    if (amountCop > MAX_AMOUNT) {
      throw new DonationError("El aporte supera el máximo permitido en línea.");
    }
  }

  return {
    pieceId: piece.id,
    amountCop,
    donorName: clean(donor.name, 60),
    donorEmail: email,
    donorPhone: phone,
    showOnWall: donor.showOnWall === true,
    certificate,
    attribution: normalizeAttribution(input.attribution),
  };
}

export async function createDonation(body: unknown): Promise<Checkout> {
  const order = parseOrder(body);
  const config = wompiConfig();

  if (config.mode === "mock" && !simulationAllowed()) {
    throw new DonationError(
      "Los pagos en línea están en configuración. Usa la llave Bre-B o la cuenta Bancolombia.",
      503,
    );
  }

  const reference = `SC-${Date.now()}-${randomBytes(3).toString("hex")}`;
  const { fee, total } = feeFor(order.amountCop);
  const amountInCents = total * 100;

  await insertDonation({
    reference,
    status: "pending",
    source: config.mode === "mock" ? "demo" : "wompi",
    pieceId: order.pieceId,
    amountCop: order.amountCop,
    currency: "COP",
    chargeAmount: total,
    donorName: order.donorName,
    donorEmail: order.donorEmail,
    donorPhone: order.donorPhone,
    showOnWall: order.showOnWall,
    certificate: order.certificate,
    attribution: order.attribution,
  });

  return {
    reference,
    amountCop: order.amountCop,
    fee,
    total,
    amountInCents,
    currency: "COP",
    publicKey: config.publicKey,
    integrity: integritySignature(reference, amountInCents, "COP", config.integritySecret),
    simulated: config.mode === "mock",
  };
}

const STATUS: Record<WompiStatus, Donation["status"]> = {
  PENDING: "pending",
  APPROVED: "approved",
  DECLINED: "declined",
  VOIDED: "voided",
  ERROR: "error",
};

export async function applyTransaction(transaction: WompiTransaction): Promise<Donation | null> {
  const donation = await getDonation(transaction.reference);
  if (!donation) return null;

  const expectedCents = Math.round(donation.chargeAmount * 100);
  if (transaction.currency === "COP" && transaction.amountInCents !== expectedCents) {
    return transitionDonation(transaction.reference, {
      status: "error",
      providerTransactionId: transaction.id,
      statusMessage: "El monto no coincide con la donación.",
    });
  }

  const wasApproved = donation.status === "approved";
  const status = STATUS[transaction.status] ?? "error";
  const updated = await transitionDonation(transaction.reference, {
    status,
    providerTransactionId: transaction.id,
    paymentMethod: transaction.paymentMethodType,
    statusMessage: transaction.statusMessage,
    approvedAt: status === "approved" ? new Date().toISOString() : null,
  });

  const result = updated ?? (await getDonation(transaction.reference));

  if (status === "approved" && !wasApproved && result) {
    await afterApproved(result);
  }

  return result;
}

async function afterApproved(donation: Donation): Promise<void> {
  const email = donation.donorEmail?.trim();
  if (!email) return;

  try {
    await sendDonationThanks({
      to: email,
      name: donation.donorName,
      amountCop: donation.amountCop,
    });
  } catch {
    // El correo de agradecimiento no puede frenar la confirmacion del pago.
  }

  try {
    const db = dbClient();
    if (db) {
      await db`
        insert into reminders (email, name, consent, source)
        values (${email}, ${donation.donorName}, true, 'donacion')
        on conflict (lower(email)) do nothing
      `;
    }
  } catch {
    // La lista de recordatorios no puede frenar la confirmacion del pago.
  }
}

export async function processEvent(event: WompiEvent): Promise<{ ok: boolean; reason?: string }> {
  const config = wompiConfig();
  const valid = verifyEvent(event, config.eventsSecret);
  const transaction = event?.data?.transaction;

  await logEvent({
    event: event?.event ?? null,
    reference: transaction?.reference ? String(transaction.reference) : null,
    signatureValid: valid,
    payload: event,
  });

  if (!valid) return { ok: false, reason: "firma inválida" };
  if (event.event !== "transaction.updated" || !transaction) {
    return { ok: true, reason: "evento ignorado" };
  }

  await applyTransaction(parseTransaction(transaction));
  return { ok: true };
}

export async function donationStatus(reference: string): Promise<Donation | null> {
  const donation = await getDonation(reference);
  if (!donation || donation.status !== "pending" || donation.source !== "wompi") {
    return donation;
  }

  if (!shouldQueryProvider(reference)) return donation;

  const transaction = donation.providerTransactionId
    ? await getTransaction(donation.providerTransactionId)
    : await findTransactionByReference(reference, createdAtOf(donation));

  if (transaction && transaction.reference === reference) {
    return (await applyTransaction(transaction)) ?? donation;
  }

  return donation;
}

/** Evita repetir la consulta a Wompi en cada ciclo de la página de gracias. */
const providerChecks = new Map<string, number>();
const PROVIDER_CHECK_MS = 8_000;

function shouldQueryProvider(reference: string): boolean {
  const now = Date.now();
  const last = providerChecks.get(reference) ?? 0;
  if (now - last < PROVIDER_CHECK_MS) return false;
  providerChecks.set(reference, now);
  if (providerChecks.size > 500) providerChecks.clear();
  return true;
}

function createdAtOf(donation: Donation): Date {
  const created = new Date(donation.createdAt);
  return Number.isNaN(created.getTime()) ? new Date(Date.now() - 7 * 86_400_000) : created;
}

/**
 * Rescata los pagos que quedaron pendientes porque el webhook no llegó.
 * Se puede correr desde el panel o por consola sin tocar el recaudo manual.
 */
export async function reconcilePending(
  sinceDays = 14,
  limit = 100,
): Promise<{ checked: number; updated: number }> {
  const since = new Date(Date.now() - sinceDays * 86_400_000);
  const pending = await pendingWompi(since, limit);
  let updated = 0;

  for (const donation of pending) {
    const transaction = await findTransactionByReference(donation.reference, createdAtOf(donation));
    if (!transaction) continue;
    const result = await applyTransaction(transaction);
    if (result && result.status !== "pending") updated += 1;
  }

  return { checked: pending.length, updated };
}

export async function progress(): Promise<{ raisedCop: number; donations: number }> {
  return approvedTotal();
}

export async function simulateResult(
  reference: string,
  status: WompiStatus = "APPROVED",
): Promise<Donation | null> {
  if (!simulationAllowed()) {
    throw new DonationError("La simulación está desactivada.", 403);
  }

  const donation = await getDonation(reference);
  if (!donation) return null;

  const config = wompiConfig();
  const transaction: WompiTransaction = {
    id: `mock-${randomBytes(4).toString("hex")}`,
    status,
    reference,
    amountInCents: Math.round(donation.chargeAmount * 100),
    currency: "COP",
    paymentMethodType: "CARD",
    statusMessage: status === "DECLINED" ? "Transacción rechazada (simulada)" : null,
  };

  await processEvent(buildSignedEvent(transaction, config.eventsSecret));
  return getDonation(reference);
}

export function publicDonation(donation: Donation) {
  return {
    reference: donation.reference,
    status: donation.status,
    amountCop: donation.amountCop,
    donorName: donation.donorName,
    pieceId: donation.pieceId,
  };
}
