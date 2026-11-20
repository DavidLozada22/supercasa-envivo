"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import type { PanelRole } from "@/lib/users";
import { groupsForRole } from "./nav";

export default function AdminSidebar({
  user,
  role,
}: {
  user?: string;
  role?: PanelRole | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const groups = groupsForRole(role ?? null);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col justify-between overflow-y-auto bg-[#0F2354] p-6 text-white lg:flex">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B5F43D]">
          Supercasa en vivo
        </p>
        <h2 className="mt-2 text-lg font-extrabold leading-tight">Panel de producción</h2>
        <p className="mt-1 text-xs text-white/50">Fundación Segundos de Vida</p>

        <div className="mt-7 space-y-6">
          {groups.map((group) => (
            <nav key={group.label} aria-label={group.label}>
              <p className="px-3.5 pb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/30">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const active =
                    link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-start gap-3 rounded-xl px-3.5 py-2.5 transition ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${
                          active ? "text-[#B5F43D]" : "text-white/40 group-hover:text-white/80"
                        }`}
                        strokeWidth={1.75}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold leading-tight">{link.label}</span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-white/40">
                          {link.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
        {user ? (
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6009E] text-xs font-extrabold uppercase text-white">
              {user.slice(0, 2)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{user}</p>
              <p className="text-[11px] text-white/40">Sesión activa</p>
            </div>
          </div>
        ) : null}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.75} />
          Ver sitio
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
