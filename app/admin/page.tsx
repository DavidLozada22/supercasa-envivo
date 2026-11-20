import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getSession } from "@/lib/auth";
import { currentRole } from "@/lib/permissions";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel de producción | Supercasa",
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const role = await currentRole();
  if (!role) redirect("/admin/login");
  if (role === "marketing") redirect("/admin/estudio");
  if (role === "finance") redirect("/admin/recaudo");
  const config = await getConfig();
  return <AdminDashboard initialConfig={config} user={session.username} role={role} />;
}
