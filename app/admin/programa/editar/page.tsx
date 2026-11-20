import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProgramEditor from "@/components/admin/program/ProgramEditor";
import { getSession } from "@/lib/auth";
import { currentRole } from "@/lib/permissions";
import { readProgram } from "@/lib/program/store";

export const dynamic = "force-dynamic";

export const metadata = { title: "Editar programa" };

export default async function ProgramEditorPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const role = await currentRole();
  if (!role || !["admin", "editor", "marketing"].includes(role)) {
    redirect("/programa");
  }

  const program = await readProgram();

  return (
    <AdminShell current="Programa">
      <ProgramEditor initial={program} user={session.username} />
    </AdminShell>
  );
}
