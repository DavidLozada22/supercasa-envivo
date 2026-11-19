import postgres from "postgres";

export type DonationStatus = "pending" | "approved" | "declined" | "voided" | "error";
export type DonationSource = "wompi" | "demo" | "manual" | "transfer";

export type Donation = {
  reference: string;
  status: DonationStatus;
  source: DonationSource;
  pieceId: string;
  amountCop: number;
  currency: string;
  chargeAmount: number;
  donorName: string | null;
  donorEmail: string;
  donorPhone: string | null;
  showOnWall: boolean;
  certificate: unknown | null;
  providerTransactionId: string | null;
  paymentMethod: string | null;
  statusMessage: string | null;
  createdAt: string;
  approvedAt: string | null;
};

export type NewDonation = Omit<
  Donation,
  "providerTransactionId" | "paymentMethod" | "statusMessage" | "createdAt" | "approvedAt"
>;

type Sql = ReturnType<typeof postgres>;

const globalStore = globalThis as unknown as {
  __supercasaSql?: Sql;
  __supercasaMemory?: Map<string, Donation>;
};

function sql(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  globalStore.__supercasaSql ??= postgres(url, {
    ssl: url.includes("localhost") ? false : "require",
    max: 3,
    idle_timeout: 20,
  });
  return globalStore.__supercasaSql;
}

function memory(): Map<string, Donation> {
  globalStore.__supercasaMemory ??= new Map();
  return globalStore.__supercasaMemory;
}

function toDonation(row: Record<string, unknown>): Donation {
  return {
    reference: String(row.reference),
    status: String(row.status) as DonationStatus,
    source: String(row.source) as DonationSource,
    pieceId: String(row.piece_id),
    amountCop: Number(row.amount_cop),
    currency: String(row.currency),
    chargeAmount: Number(row.charge_amount),
    donorName: row.donor_name ? String(row.donor_name) : null,
    donorEmail: String(row.donor_email ?? ""),
    donorPhone: row.donor_phone ? String(row.donor_phone) : null,
    showOnWall: Boolean(row.show_on_wall),
    certificate: row.certificate ?? null,
    providerTransactionId: row.provider_transaction_id
      ? String(row.provider_transaction_id)
      : null,
    paymentMethod: row.payment_method ? String(row.payment_method) : null,
    statusMessage: row.status_message ? String(row.status_message) : null,
    createdAt: String(row.created_at),
    approvedAt: row.approved_at ? String(row.approved_at) : null,
  };
}

export function databaseConnected(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export async function insertDonation(input: NewDonation): Promise<Donation> {
  const db = sql();
  if (!db) {
    const donation: Donation = {
      ...input,
      providerTransactionId: null,
      paymentMethod: null,
      statusMessage: null,
      createdAt: new Date().toISOString(),
      approvedAt: null,
    };
    memory().set(donation.reference, donation);
    return donation;
  }

  const rows = await db`
    insert into donations (
      reference, status, source, frequency, piece_id, amount_cop, currency,
      charge_amount, fee, donor_name, donor_email, donor_phone, consent,
      show_on_wall, certificate
    ) values (
      ${input.reference}, ${input.status}, ${input.source}, 'once', ${input.pieceId},
      ${input.amountCop}, ${input.currency}, ${input.chargeAmount}, 0,
      ${input.donorName}, ${input.donorEmail}, ${input.donorPhone}, true,
      ${input.showOnWall}, ${input.certificate ? JSON.stringify(input.certificate) : null}
    )
    returning *
  `;
  return toDonation(rows[0] as Record<string, unknown>);
}

export async function getDonation(reference: string): Promise<Donation | null> {
  const db = sql();
  if (!db) return memory().get(reference) ?? null;
  const rows = await db`select * from donations where reference = ${reference} limit 1`;
  return rows[0] ? toDonation(rows[0] as Record<string, unknown>) : null;
}

export async function transitionDonation(
  reference: string,
  patch: {
    status: DonationStatus;
    providerTransactionId?: string | null;
    paymentMethod?: string | null;
    statusMessage?: string | null;
    approvedAt?: string | null;
  },
): Promise<Donation | null> {
  const db = sql();
  if (!db) {
    const current = memory().get(reference);
    if (!current || current.status !== "pending") return current ?? null;
    const next: Donation = {
      ...current,
      status: patch.status,
      providerTransactionId: patch.providerTransactionId ?? current.providerTransactionId,
      paymentMethod: patch.paymentMethod ?? current.paymentMethod,
      statusMessage: patch.statusMessage ?? current.statusMessage,
      approvedAt: patch.approvedAt ?? current.approvedAt,
    };
    memory().set(reference, next);
    return next;
  }

  const rows = await db`
    update donations set
      status = ${patch.status},
      provider_transaction_id = coalesce(${patch.providerTransactionId ?? null}, provider_transaction_id),
      payment_method = coalesce(${patch.paymentMethod ?? null}, payment_method),
      status_message = coalesce(${patch.statusMessage ?? null}, status_message),
      approved_at = coalesce(${patch.approvedAt ?? null}, approved_at)
    where reference = ${reference} and status = 'pending'
    returning *
  `;
  return rows[0] ? toDonation(rows[0] as Record<string, unknown>) : null;
}

export async function approvedTotal(): Promise<{ raisedCop: number; donations: number }> {
  const db = sql();
  if (!db) {
    let raised = 0;
    let count = 0;
    for (const donation of memory().values()) {
      if (donation.status === "approved") {
        raised += donation.amountCop;
        count += 1;
      }
    }
    return { raisedCop: raised, donations: count };
  }

  const rows = await db`
    select coalesce(sum(amount_cop), 0)::bigint as raised, count(*)::integer as total
    from donations
    where status = 'approved'
  `;
  const row = rows[0] as Record<string, unknown>;
  return { raisedCop: Number(row.raised), donations: Number(row.total) };
}

export async function logEvent(input: {
  event: string | null;
  reference: string | null;
  signatureValid: boolean;
  payload: unknown;
}): Promise<void> {
  const db = sql();
  if (!db) return;
  await db`
    insert into payment_events (provider, event, reference, signature_valid, payload)
    values ('wompi', ${input.event}, ${input.reference}, ${input.signatureValid},
      ${JSON.stringify(input.payload)}::jsonb)
  `;
}
