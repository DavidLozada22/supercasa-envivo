export type CatalogPiece = {
  id: string;
  icon: string;
  label: string;
  price: number;
  badge?: string;
  impact: string[];
};

export const PIECES: CatalogPiece[] = [
  {
    id: "ventana",
    icon: "🪟",
    label: "La ventana de un cuarto",
    price: 100_000,
    badge: "⭐ Calvito la recomienda",
    impact: [
      "Una ventana con marco y vidrio para el cuarto de un niño",
      "Luz y aire fresco cada mañana",
      "El cielo de Bogotá visto desde la cama",
    ],
  },
  {
    id: "bano",
    icon: "🚿",
    label: "Un baño completo",
    price: 250_000,
    impact: [
      "Ducha, sanitario y lavamanos listos para una familia",
      "Un baño calientico después de un día de tratamiento",
    ],
  },
  {
    id: "habitacion",
    icon: "🛏️",
    label: "Una habitación equipada",
    price: 1_000_000,
    impact: [
      "Cama para el niño y para su mamá o cuidador",
      "Un lugar seguro para descansar juntos",
    ],
  },
  {
    id: "pintura",
    icon: "🎨",
    label: "Pintura de una pared",
    price: 50_000,
    impact: ["Color y calidez en una pared de la casa", "Un espacio que se siente hogar"],
  },
  {
    id: "material",
    icon: "🍲",
    label: "Material de instalación",
    price: 20_000,
    impact: ["Tuberías, cables y materiales para dejar la casa lista", "Cada detalle cuenta"],
  },
  {
    id: "libre",
    icon: "✏️",
    label: "Lo que tu corazón diga",
    price: 0,
    impact: ["Tu aporte se suma a la pieza que más falta", "Cada peso construye"],
  },
];
