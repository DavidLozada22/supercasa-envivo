import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SÚPER NAVIDAD: 48 Horas por la Supercasa | Fundación Segundos de Vida",
  description:
    "Maratón solidaria de 48 horas para construir La Supercasa de la Fundación Segundos de Vida.",
  verification: {
    other: {
      "facebook-domain-verification": "4mmbs2tq6hgyfnhpzuhx289m8tpx95",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
