import AdminShell from "@/components/admin/AdminShell";
import HomePreview from "@/components/admin/HomePreview";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Vista previa en vivo" };

export default async function PreviewHomePage() {
  await requirePageRole(["admin", "editor"]);
  return (
    <AdminShell current="Vista previa en vivo">
      <HomePreview />
    </AdminShell>
  );
}
