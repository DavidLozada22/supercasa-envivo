export type Piece = {
  id: string;
  label: string;
  description: string;
  amount: number;
  recommended?: boolean;
};

export const PIECES: Piece[] = [
  {
    id: "ventana",
    label: "Una ventana",
    description: "Marco y vidrio para el cuarto de un niño.",
    amount: 100_000,
    recommended: true,
  },
  {
    id: "bano",
    label: "Un baño completo",
    description: "Ducha, sanitario y lavamanos para una familia.",
    amount: 250_000,
  },
  {
    id: "habitacion",
    label: "Una habitación equipada",
    description: "Cama para el niño y para su cuidador.",
    amount: 1_000_000,
  },
  {
    id: "libre",
    label: "Otro monto",
    description: "Aporta el valor que quieras.",
    amount: 0,
  },
];

export const MIN_AMOUNT = 10_000;
export const MAX_AMOUNT = 50_000_000;

export function findPiece(id: string): Piece | undefined {
  return PIECES.find((piece) => piece.id === id);
}
