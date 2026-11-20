import { redirect } from "next/navigation";
import Link from "next/link";
import { Download, ExternalLink, Lock, Pencil } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ProgramBoard from "@/components/admin/ProgramBoard";
import { getSession } from "@/lib/auth";
import { currentRole } from "@/lib/permissions";
import { canEditProgram, programEditorNames } from "@/lib/users";
import { readProgram } from "@/lib/program/store";

export const dynamic = "force-dynamic";

export const metadata = { title: "Programa" };

export default async function ProgramPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const role = await currentRole();
  if (!role || !["admin", "editor", "marketing"].includes(role)) {
    redirect("/programa");
  }

  const program = await readProgram();
  const canEdit = canEditProgram(session.username);
  const editorNames = programEditorNames().join(" y ");

  return (
    <AdminShell current="Programa">
      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6009E]">
                Programa 48H
              </p>
              <h1 className="mt-1 text-lg font-extrabold text-[#0F2354]">
                Bloques, horarios y segmentos
              </h1>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
                {canEdit
                  ? "Edita el programa completo. Los cambios se guardan en Blob y salen en `/programa`, en las moscas y en la agenda."
                  : `Solo ${editorNames} puede editar el programa. Aquí lo ves completo y puedes descargar el Excel.`}{" "}
                Última edición: {program.updatedBy || "JSON base"}.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {canEdit ? (
                <Link
                  href="/admin/programa/editar"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#E6009E] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#B8007E]"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} />
                  Editar programa
                </Link>
              ) : (
                <span className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500">
                  <Lock className="h-4 w-4" strokeWidth={2} />
                  Solo lectura
                </span>
              )}
              <a
                href="/api/program/excel"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40"
              >
                <Download className="h-4 w-4" strokeWidth={2} />
                Excel
              </a>
              <a
                href="/programa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={2} />
                Ver público
              </a>
            </div>
          </div>
        </section>

        <ProgramBoard
          blocks={program.blocks}
          segments={program.segments}
          serverNow={new Date().toISOString()}
        />
      </div>
    </AdminShell>
  );
}
