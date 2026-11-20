import { redirect } from "next/navigation";
import { getSession } from "./auth";
import {
  canEditProgram,
  roleOf,
  type PanelRole,
} from "./users";

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

export async function requireProgramEditorPage(): Promise<{
  username: string;
  role: PanelRole;
}> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const role = roleOf(session.username);
  if (!role) redirect("/admin/login");
  if (!canEditProgram(session.username)) redirect("/admin/programa");
  return { username: session.username, role };
}

export async function apiProgramEditor(): Promise<
  { ok: true; username: string } | { ok: false; status: 401 | 403 }
> {
  const session = await getSession();
  if (!session) return { ok: false, status: 401 };
  if (!roleOf(session.username)) return { ok: false, status: 401 };
  if (!canEditProgram(session.username)) return { ok: false, status: 403 };
  return { ok: true, username: session.username };
}
