import { NextResponse } from "next/server";
import { createDonation, DonationError } from "@/lib/donations/service";

export const dynamic = "force-dynamic";

const hits = new Map<string, { count: number; until: number }>();

function rateLimited(request: Request): boolean {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.until < now) {
    hits.set(ip, { count: 1, until: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 8;
}

export async function POST(request: Request) {
  if (rateLimited(request)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera un minuto." },
      { status: 429 },
    );
  }

  try {
    const checkout = await createDonation(await request.json());
    return NextResponse.json(checkout, { status: 201 });
  } catch (error) {
    if (error instanceof DonationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[supercasa] crear donación", error);
    return NextResponse.json({ error: "No se pudo iniciar el aporte." }, { status: 500 });
  }
}
