import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DonationsPanel from "@/components/admin/DonationsPanel";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Donaciones" };

export default async function DonationsPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return (
    <AdminShell current="Donaciones">
      <DonationsPanel />
    </AdminShell>
  );
}
