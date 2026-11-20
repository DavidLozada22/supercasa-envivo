import { notFound } from "next/navigation";
import CreativeStage from "@/components/marketing/CreativeStage";
import { AD_CREATIVES } from "@/lib/marketing/campaign-kit";
import { readMarketingState } from "@/lib/marketing/store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Material",
  robots: { index: false, follow: false },
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function CreativePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const creative = AD_CREATIVES.find((item) => item.id === id);
  if (!creative) notFound();

  const state = await readMarketingState();
  const edit = state.edits[creative.id];
  const requested = Number(first(query.slide));
  const requestedSlide =
    Number.isFinite(requested) && requested > 0 ? Math.round(requested) : 1;
  const base =
    creative.slides.find((slide) => slide.slideNumber === requestedSlide) ??
    creative.slides[requestedSlide - 1] ??
    creative.slides[0];
  const slide = edit?.slides[base.id] ? { ...base, ...edit.slides[base.id] } : base;

  return (
    <CreativeStage
      creative={creative}
      slide={slide}
      theme={edit?.theme ?? creative.defaultTheme}
      aspect={edit?.aspect ?? creative.defaultAspect}
      showQr={edit?.showQr}
      qrTarget={edit?.qrTarget}
    />
  );
}
