"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { ADMIN_LINKS } from "./nav";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col justify-between bg-[#0F2354] p-6 text-white lg:flex">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B5F43D]">
          Supercasa en vivo
        </p>
        <h2 className="mt-2 text-lg font-extrabold leading-tight">Panel de producción</h2>
        <p className="mt-1 text-xs text-white/50">Fundación Segundos de Vida</p>

        <nav className="mt-8 space-y-1" aria-label="Panel">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${active ? "text-[#B5F43D]" : ""}`}
                  strokeWidth={1.75}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2">
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
