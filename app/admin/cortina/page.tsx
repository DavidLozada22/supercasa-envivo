import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import CortinaPreview from "@/components/admin/CortinaPreview";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Cortinas del live" };

export default async function CortinaPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return (
    <AdminShell current="Cortinas del live">
      <CortinaPreview />
    </AdminShell>
  );
}
