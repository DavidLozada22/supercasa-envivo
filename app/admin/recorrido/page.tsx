import AdminShell from "@/components/admin/AdminShell";
import FlowDemo from "@/components/admin/FlowDemo";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function FlowPage() {
  await requirePageRole(["admin", "editor"]);
  return (
    <AdminShell current="Recorrido del donante">
      <FlowDemo />
    </AdminShell>
  );
}
