import LandingMarkup from "@/components/landing/LandingMarkup";
import { getConfig, toPublicConfig } from "@/lib/config";
import { progress } from "@/lib/donations/service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Maratón 48 horas | La Supercasa",
  description:
    "Acompáñanos en la transmisión solidaria de 48 horas por La Supercasa. Dona mientras ves el live.",
  icons: { icon: "/favicon.svg" },
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
