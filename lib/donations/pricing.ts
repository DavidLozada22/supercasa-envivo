const PCT = 0.0265;
const FIXED = 700;
const VAT = 0.19;

/**
 * Comisión de Wompi (Plan Avanzado) que cubre el aportante.
 * Se calcula sobre el total para que a la Fundación le llegue la pieza exacta:
 * total - IVA(comisión) = aporte.
 */
export function feeFor(amountCop: number): { fee: number; total: number } {
  const gross = (amountCop + FIXED * (1 + VAT)) / (1 - PCT * (1 + VAT));
  const fee = Math.ceil((gross - amountCop) / 100) * 100;
  return { fee, total: amountCop + fee };
}
