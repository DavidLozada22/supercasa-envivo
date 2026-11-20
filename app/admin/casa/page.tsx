import AdminShell from "@/components/admin/AdminShell";
import HousePreview from "@/components/admin/HousePreview";
import { requirePageRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Avance de la casa" };

export default async function HousePage() {
  await requirePageRole(["admin", "editor"]);
  return (
    <AdminShell current="Avance de la casa">
      <HousePreview />
    </AdminShell>
  );
}
