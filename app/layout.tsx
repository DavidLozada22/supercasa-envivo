import type { Metadata } from "next";
import MetaPixel from "@/components/analytics/MetaPixel";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://supercasa.svgvisual.com"),
  title: {
    default: "La SUPERCASA · Fundación Segundos de Vida",
    template: "%s | La SUPERCASA",
  },
  description:
    "La casa que los Super Calvitos están construyendo contigo. Dona, mira el avance de la obra y acompáñanos en la maratón de 48 horas.",
  applicationName: "La SUPERCASA",
  authors: [{ name: "Fundación Segundos de Vida" }],
  creator: "Fundación Segundos de Vida",
  publisher: "Fundación Segundos de Vida",
  keywords: [
    "La Supercasa",
    "Fundación Segundos de Vida",
    "Super Calvitos",
    "donaciones",
    "maratón 48 horas",
    "Bogotá",
    "cáncer infantil",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "La SUPERCASA",
    title: "La SUPERCASA · Ponte la Capa con los Super Calvitos",
    description:
      "La casa que los Super Calvitos están construyendo contigo. Dona, mira el avance de la obra y acompáñanos en la maratón de 48 horas.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "La SUPERCASA, Fundación Segundos de Vida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La SUPERCASA · Ponte la Capa con los Super Calvitos",
    description:
      "La casa que los Super Calvitos están construyendo contigo. Dona y acompáñanos en la maratón de 48 horas.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
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
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Fredoka:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}<MetaPixel /></body>
    </html>
  );
}
