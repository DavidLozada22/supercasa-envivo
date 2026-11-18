import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { isAuthenticated } from "@/lib/auth";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel de producción | Supercasa",
};

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const config = await getConfig();
  return <AdminDashboard initialConfig={config} />;
}
