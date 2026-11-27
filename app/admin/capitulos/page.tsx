import AdminShell from "@/components/admin/AdminShell";
import ChaptersPanel from "@/components/admin/ChaptersPanel";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Capítulos" };

export default async function ChaptersAdminPage() {
  await requirePageRole(["admin", "editor", "marketing"]);
  return (
    <AdminShell current="Capítulos">
      <ChaptersPanel />
    </AdminShell>
  );
}
