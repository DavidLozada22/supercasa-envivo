import { NextResponse } from "next/server";
import { apiRole } from "@/lib/permissions";
import { getConfig, normalizeConfig, saveConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }
  return NextResponse.json(await getConfig(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  try {
    const body = await request.json();
    const config = normalizeConfig(body);
    const saved = await saveConfig(config);
    return NextResponse.json(saved, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo guardar la configuración.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
