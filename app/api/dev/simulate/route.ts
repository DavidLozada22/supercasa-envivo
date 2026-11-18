import { NextResponse } from "next/server";
import { DonationError, publicDonation, simulateResult } from "@/lib/donations/service";
import type { WompiStatus } from "@/lib/donations/wompi";

export const dynamic = "force-dynamic";

/** Solo existe para probar el flujo sin llaves de Wompi. Nunca en producción. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { reference?: string; status?: WompiStatus };
    if (!body.reference) {
      return NextResponse.json({ error: "Falta la referencia." }, { status: 400 });
    }

    const status = body.status ?? "APPROVED";
    const donation = await simulateResult(body.reference, status);
    if (!donation) {
      return NextResponse.json({ error: "No encontramos ese aporte." }, { status: 404 });
    }

    return NextResponse.json(publicDonation(donation));
  } catch (error) {
    if (error instanceof DonationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "No se pudo simular." }, { status: 500 });
  }
}
