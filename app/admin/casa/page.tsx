import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import HousePreview from "@/components/admin/HousePreview";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Avance de la casa" };

export default async function HousePage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return (
    <AdminShell current="Avance de la casa">
      <HousePreview />
    </AdminShell>
  );
}
