import AdminShell from "@/components/admin/AdminShell";
import ProgramEditor from "@/components/admin/program/ProgramEditor";
import { requireProgramEditorPage } from "@/lib/permissions";
import { readProgram } from "@/lib/program/store";

export const dynamic = "force-dynamic";

export const metadata = { title: "Editar programa" };

export default async function ProgramEditorPage() {
  const { username } = await requireProgramEditorPage();
  const program = await readProgram();

  return (
    <AdminShell current="Programa">
      <ProgramEditor initial={program} user={username} />
    </AdminShell>
  );
}
