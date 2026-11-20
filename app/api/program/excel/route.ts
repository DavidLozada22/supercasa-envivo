import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { buildProgramWorkbook } from "@/lib/program/excel";
import { readProgram } from "@/lib/program/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const program = await readProgram();
  const workbook = buildProgramWorkbook(program);
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="programa-48h.xlsx"',
      "Cache-Control": "no-store, max-age=0, must-revalidate",
    },
  });
}
