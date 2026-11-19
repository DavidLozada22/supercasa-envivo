import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import RemindersPanel from "@/components/admin/RemindersPanel";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Recordatorios" };

export default async function RemindersPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return (
    <AdminShell current="Recordatorios">
      <RemindersPanel />
    </AdminShell>
  );
}
