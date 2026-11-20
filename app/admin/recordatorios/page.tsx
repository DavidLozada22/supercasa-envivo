import AdminShell from "@/components/admin/AdminShell";
import RemindersPanel from "@/components/admin/RemindersPanel";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Recordatorios" };

export default async function RemindersPage() {
  await requirePageRole(["admin", "editor", "marketing"]);
  return (
    <AdminShell current="Recordatorios">
      <RemindersPanel />
    </AdminShell>
  );
}
