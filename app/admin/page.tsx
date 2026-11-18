import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getSession } from "@/lib/auth";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel de producción | Supercasa",
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const config = await getConfig();
  return <AdminDashboard initialConfig={config} user={session.username} />;
}
