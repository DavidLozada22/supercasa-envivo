import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProgramBoard from "@/components/admin/ProgramBoard";
import { getSession } from "@/lib/auth";
import { currentRole } from "@/lib/permissions";
import blocksJson from "@/lib/program/blocks.json";
import segmentsJson from "@/lib/program/segments.json";
import type { ProgramBlock, ProgramSegment } from "@/lib/program/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Programa" };

export default async function ProgramPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const role = await currentRole();
  if (!role || !["admin", "editor", "marketing"].includes(role)) {
    redirect("/programa");
  }

  return (
    <AdminShell current="Programa">
      <ProgramBoard
        blocks={blocksJson as ProgramBlock[]}
        segments={segmentsJson as ProgramSegment[]}
        serverNow={new Date().toISOString()}
      />
    </AdminShell>
  );
}
