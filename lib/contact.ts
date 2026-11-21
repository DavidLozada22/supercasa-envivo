export const DONATION_WHATSAPP =
  process.env.NEXT_PUBLIC_DONATION_WHATSAPP || "573175658064";

export const DONATION_WHATSAPP_DISPLAY = "+57 317 565 8064";

export const RECEIPT_MESSAGE =
  "Hola, acabo de hacer una transferencia a La Supercasa. Adjunto mi comprobante. Nombre: ___ Valor: ___";

export function whatsappLink(message: string): string {
  return `https://wa.me/${DONATION_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
