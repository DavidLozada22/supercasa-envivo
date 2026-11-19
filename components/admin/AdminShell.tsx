import Link from "next/link";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";
import { ADMIN_LINKS } from "./nav";

export default async function AdminShell({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  const session = await getSession();

  return (
    <div
      className="flex min-h-screen bg-[#F4F6FB]"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      <AdminSidebar user={session?.username} />

      <div className="flex min-w-0 flex-1 flex-col">
        <nav
          aria-label="Panel"
          className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden"
        >
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const active = link.label === current || (current === "Panel" && link.href === "/admin");
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  active ? "bg-[#0F2354] text-white" : "bg-slate-100 text-[#0F2354]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <header className="border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
          <p className="text-xs font-semibold text-slate-500">
            <Link href="/admin" className="hover:underline">
              Panel
            </Link>
            {" / "}
            <span className="text-[#0F2354]">{current}</span>
          </p>
          <h1 className="mt-1 text-lg font-extrabold tracking-tight text-[#0F2354]">{current}</h1>
        </header>

        <main className="mx-auto w-full max-w-7xl p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
