import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ContentStudio from "@/components/admin/studio/ContentStudio";
import { getSession } from "@/lib/auth";
import { readMarketingState } from "@/lib/marketing/store";
import { requirePageRole } from "@/lib/permissions";
import { readStreamingContent } from "@/lib/streaming/content";

export const dynamic = "force-dynamic";

export const metadata = { title: "Estudio" };

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const role = await requirePageRole(["admin", "editor", "marketing"]);
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [marketing, content] = await Promise.all([
    readMarketingState(),
    readStreamingContent(),
  ]);

  const query = await searchParams;
  const tabRaw = Array.isArray(query.tab) ? query.tab[0] : query.tab;
  const sceneRaw = Array.isArray(query.scene) ? query.scene[0] : query.scene;
  const tab =
    tabRaw === "cortinas" || tabRaw === "overlays" || tabRaw === "marketing"
      ? tabRaw
      : "marketing";

  return (
    <AdminShell current="Estudio">
      <ContentStudio
        role={role}
        user={session.username}
        marketing={marketing}
        content={content}
        initialTab={tab}
        initialScene={sceneRaw || undefined}
      />
    </AdminShell>
  );
}
