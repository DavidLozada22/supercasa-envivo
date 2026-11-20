import { redirect } from "next/navigation";
import { getSession } from "./auth";
import { roleOf, type PanelRole } from "./users";

export async function currentRole(): Promise<PanelRole | null> {
  const session = await getSession();
  return session ? roleOf(session.username) : null;
}

function homeForRole(role: PanelRole): string {
  if (role === "marketing") return "/admin/estudio";
  if (role === "finance") return "/admin/recaudo";
  return "/admin";
}

export async function requirePageRole(allowed: PanelRole[]): Promise<PanelRole> {
  const role = await currentRole();
  if (!role) redirect("/admin/login");
  if (!allowed.includes(role)) redirect(homeForRole(role));
  return role;
}

export async function apiRole(
  allowed: PanelRole[],
): Promise<{ ok: true; role: PanelRole } | { ok: false; status: 401 | 403 }> {
  const role = await currentRole();
  if (!role) return { ok: false, status: 401 };
  if (!allowed.includes(role)) return { ok: false, status: 403 };
  return { ok: true, role };
}
