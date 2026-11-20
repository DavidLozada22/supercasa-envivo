import AdminShell from "@/components/admin/AdminShell";
import FinancePanel from "@/components/admin/FinancePanel";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Recaudo" };

export default async function FinancePage() {
  await requirePageRole(["admin", "finance"]);
  return (
    <AdminShell current="Recaudo">
      <FinancePanel />
    </AdminShell>
  );
}
