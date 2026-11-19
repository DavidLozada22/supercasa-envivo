import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import HomePreview from "@/components/admin/HomePreview";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Vista previa en vivo" };

export default async function PreviewHomePage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return (
    <AdminShell current="Vista previa en vivo">
      <HomePreview />
    </AdminShell>
  );
}
