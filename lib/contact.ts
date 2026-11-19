export const DONATION_WHATSAPP =
  process.env.NEXT_PUBLIC_DONATION_WHATSAPP || "573165246087";

export const DONATION_EMAIL = "hola@supercasa.svgvisual.com";

export const RECEIPT_MESSAGE =
  "Hola, acabo de hacer una transferencia a La Supercasa. Adjunto mi comprobante. Nombre: ___ Valor: ___";

export function whatsappLink(message: string): string {
  return `https://wa.me/${DONATION_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body = ""): string {
  const query = new URLSearchParams({ subject });
  if (body) query.set("body", body);
  return `mailto:${DONATION_EMAIL}?${query.toString()}`;
}
