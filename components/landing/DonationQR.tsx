import QRCode from "qrcode";
import { headers } from "next/headers";

async function publicBaseUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto =
    headerList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function DonationQR() {
  const target = `${await publicBaseUrl()}/donar`;
  const svg = await QRCode.toString(target, {
    type: "svg",
    margin: 1,
    width: 240,
    errorCorrectionLevel: "M",
    color: { dark: "#0F2354", light: "#FFFFFF" },
  });

  return (
    <div className="stream-qr">
      <div className="stream-qr-code" dangerouslySetInnerHTML={{ __html: svg }} />
      <span className="stream-qr-label">Escanea y dona</span>
    </div>
  );
}
