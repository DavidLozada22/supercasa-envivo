"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import type { PanelRole } from "@/lib/users";
import { groupsForRole, linksForRole } from "./nav";

function isActive(pathname: string | null, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return Boolean(pathname?.startsWith(href));
}

export default function MobileAdminNav({
  role,
  user,
}: {
  role: PanelRole;
  user?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = linksForRole(role);
  const groups = groupsForRole(role);
  const active = links.find((link) => isActive(pathname, link.href));
  const primary = links.slice(0, 4);
  if (active && !primary.some((link) => link.href === active.href)) {
    primary[Math.max(0, primary.length - 1)] = active;
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <>
      <nav
        aria-label="Accesos rápidos"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_rgba(15,35,84,0.08)] lg:hidden"
      >
        <div className="mx-auto flex w-full max-w-lg items-stretch">
          {primary.map((link) => {
            const Icon = link.icon;
            const on = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-[58px] flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-bold transition ${
                  on ? "text-[#E6009E]" : "text-slate-500"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${
                    on ? "text-[#E6009E]" : "text-slate-400"
                  }`}
                  strokeWidth={on ? 2.2 : 1.8}
                />
                <span className="max-w-full truncate">{link.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir todos los módulos"
            className="flex min-h-[58px] flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-bold text-slate-500"
          >
            <Menu className="h-[18px] w-[18px] text-slate-400" strokeWidth={1.8} />
            <span>Más</span>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          className="fixed inset-0 z-[70] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Todos los módulos"
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/50"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-3xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6009E]">
                  Panel
                </p>
                <h2 className="text-base font-extrabold text-[#0F2354]">
                  Todos los módulos
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-4">
              {groups.map((group) => (
                <section key={group.label}>
                  <p className="mb-1.5 px-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.links.map((link) => {
                      const Icon = link.icon;
                      const on = isActive(pathname, link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition ${
                            on
                              ? "bg-[#0F2354] text-white"
                              : "text-[#0F2354] hover:bg-slate-50"
                          }`}
                        >
                          <Icon
                            className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${
                              on ? "text-[#B5F43D]" : "text-[#E6009E]"
                            }`}
                            strokeWidth={1.8}
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-bold leading-tight">
                              {link.label}
                            </span>
                            <span
                              className={`mt-0.5 block text-[11px] leading-snug ${
                                on ? "text-white/60" : "text-slate-500"
                              }`}
                            >
                              {link.description}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-4 space-y-1 border-t border-slate-100 pt-3">
              {user ? (
                <p className="px-3 py-1 text-[11px] font-semibold text-slate-400">
                  Sesión: {user}
                </p>
              ) : null}
              <Link
                href="/"
                target="_blank"
                className="flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
                Ver sitio
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex min-h-[44px] w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.8} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
