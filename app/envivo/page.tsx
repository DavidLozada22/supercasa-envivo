import LandingMarkup from "@/components/landing/LandingMarkup";
import { getConfig, toPublicConfig } from "@/lib/config";
import { progress } from "@/lib/donations/service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Maratón 48 horas",
  description:
    "Transmisión especial de 48 horas por La Supercasa. Viernes 20 de noviembre, 6:00 p. m., a domingo 22, 6:00 p. m., hora de Bogotá.",
  alternates: { canonical: "/envivo" },
  openGraph: {
    title: "Maratón 48 horas por La Supercasa",
    description: "Acompáñanos en la transmisión solidaria de 48 horas y dona mientras ves la transmisión.",
    url: "/envivo",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Maratón 48 horas por La Supercasa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maratón 48 horas por La Supercasa",
    description: "Acompáñanos en la transmisión solidaria de 48 horas.",
    images: ["/og-image.jpg"],
  },
};

export default async function LivePage() {
  const config = toPublicConfig(await getConfig());

  let online = { raisedCop: 0, donations: 0 };
  try {
    online = await progress();
  } catch {
    // Sin base de datos el recaudo manual sigue visible.
  }

  return <LandingMarkup config={config} raised={config.totals.raised + online.raisedCop} />;
}
