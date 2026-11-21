import { NextResponse } from "next/server";
import { reconcilePending } from "@/lib/donations/service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Respaldo del webhook de Wompi. Revisa los aportes pendientes de los últimos
 * catorce días y aplica el estado real de la transacción. Solo lee Wompi y
 * escribe el estado que ya existe, así que repetirlo no altera el recaudo.
 */
export async function GET() {
  try {
    const result = await reconcilePending(14, 100);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[supercasa] reconciliación wompi", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export const POST = GET;
