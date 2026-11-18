import { NextResponse } from "next/server";
import { donationStatus, publicDonation } from "@/lib/donations/service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  if (!/^SC-[\w-]{6,60}$/.test(reference)) {
    return NextResponse.json({ error: "Referencia no válida." }, { status: 400 });
  }

  const donation = await donationStatus(reference);
  if (!donation) {
    return NextResponse.json({ error: "No encontramos ese aporte." }, { status: 404 });
  }

  return NextResponse.json(publicDonation(donation), {
    headers: { "Cache-Control": "no-store" },
  });
}
