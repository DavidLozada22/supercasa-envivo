import { notFound } from "next/navigation";
import OnAirStage from "@/components/streaming/OnAirStage";
import { getOnAir } from "@/lib/streaming/service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cortina en vivo",
  robots: { index: false, follow: false },
};

export default async function OnAirPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const token = Array.isArray(query.k) ? query.k[0] : query.k;
  const state = await getOnAir();

  if (!state.token || !token || token !== state.token) notFound();

  return <OnAirStage initial={state} token={state.token} />;
}
