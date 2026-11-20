import AdminShell from "@/components/admin/AdminShell";
import AnnouncementsPanel from "@/components/admin/AnnouncementsPanel";
import { requirePageRole } from "@/lib/permissions";
import blocksJson from "@/lib/program/blocks.json";
import type { ProgramBlock } from "@/lib/program/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Avisos" };

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePageRole(["admin", "editor", "marketing"]);
  const query = await searchParams;
  const block = Array.isArray(query.block) ? query.block[0] : query.block;

  return (
    <AdminShell current="Avisos">
      <AnnouncementsPanel
        blocks={blocksJson as ProgramBlock[]}
        initialBlock={block ?? ""}
      />
    </AdminShell>
  );
}
