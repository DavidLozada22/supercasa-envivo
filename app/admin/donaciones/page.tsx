import AdminShell from "@/components/admin/AdminShell";
import DonationsPanel from "@/components/admin/DonationsPanel";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Donaciones" };

export default async function DonationsPage() {
  await requirePageRole(["admin", "editor"]);
  return (
    <AdminShell current="Donaciones">
      <DonationsPanel />
    </AdminShell>
  );
}
