import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { apiRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const url = new URL(request.url);
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const base = configured || `${url.protocol}//${url.host}`;
  const target = `${base}/donar`;
  const format = url.searchParams.get("format") === "svg" ? "svg" : "png";
  const download = url.searchParams.get("download") === "1";

  if (format === "svg") {
    const svg = await QRCode.toString(target, {
      type: "svg",
      margin: 2,
      width: 1024,
      color: { dark: "#0F2354", light: "#FFFFFF" },
    });
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": download
          ? 'attachment; filename="qr-donaciones-supercasa.svg"'
          : "inline",
        "Cache-Control": "no-store",
      },
    });
  }

  const png = await QRCode.toBuffer(target, {
    type: "png",
    margin: 2,
    width: 1024,
    errorCorrectionLevel: "M",
    color: { dark: "#0F2354", light: "#FFFFFF" },
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": download
        ? 'attachment; filename="qr-donaciones-supercasa.png"'
        : "inline",
      "Cache-Control": "no-store",
    },
  });
}
