import CampaignShell from "@/components/campaign/CampaignShell";
import { getConfig, toPublicConfig } from "@/lib/config";
import { progress } from "@/lib/donations/service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "La SUPERCASA · Ponte la Capa con los Super Calvitos",
  description:
    "La casa que los Super Calvitos están construyendo contigo. Dona en línea, mira el avance de la obra y acompáñanos en la transmisión de 48 horas.",
  verification: {
    other: {
      "facebook-domain-verification": "4mmbs2tq6hgyfnhpzuhx289m8tpx95",
    },
  },
};

const CAMPAIGN_END = new Date("2026-11-30T23:59:59-05:00");

export default async function HomePage() {
  const publicConfig = toPublicConfig(await getConfig());

  let online = { raisedCop: 0, donations: 0 };
  try {
    online = await progress();
  } catch {
    // Sin base de datos el recaudo manual sigue visible.
  }

  const raised = publicConfig.totals.raised + online.raisedCop;
  const goal = publicConfig.totals.goal;
  const rawPct = goal > 0 ? (raised / goal) * 100 : 0;
  const daysLeft = Math.max(
    0,
    Math.ceil((CAMPAIGN_END.getTime() - Date.now()) / 86_400_000),
  );

  return (
    <>
      <CampaignShell
        config={publicConfig}
        raised={raised}
        goal={goal}
        pct={Math.min(100, rawPct)}
        daysLeft={daysLeft}
      />
    </>
  );
}
