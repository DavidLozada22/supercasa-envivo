import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProgramBoard from "@/components/admin/ProgramBoard";
import { isAuthenticated } from "@/lib/auth";
import blocksJson from "@/lib/program/blocks.json";
import segmentsJson from "@/lib/program/segments.json";
import type { ProgramBlock, ProgramSegment } from "@/lib/program/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Programa" };

export default async function ProgramPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

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
