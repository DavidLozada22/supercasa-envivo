import { NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

const FALLBACK = "https://supercasa.svgvisual.com/donar";
const ALLOWED_HOST = "svgvisual.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("u") || FALLBACK;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return NextResponse.json({ error: "URL inválida." }, { status: 400 });
  }

  const host = url.hostname.toLowerCase();
  if (!/^https?:$/.test(url.protocol) || (host !== ALLOWED_HOST && !host.endsWith(`.${ALLOWED_HOST}`))) {
    return NextResponse.json({ error: "Dominio no permitido." }, { status: 400 });
  }

  try {
    const png = await QRCode.toBuffer(url.toString(), {
      width: 640,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#1D2B4F", light: "#FFFFFF" },
    });
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "No se pudo generar el QR." }, { status: 500 });
  }
}
