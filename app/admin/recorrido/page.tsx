import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import FlowDemo from "@/components/admin/FlowDemo";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function FlowPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return (
    <AdminShell current="Recorrido del donante">
      <FlowDemo />
    </AdminShell>
  );
}
