import Link from "next/link";
import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import { ADMIN_LINKS } from "./nav";

export default function AdminShell({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F4F6FB]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <nav
          aria-label="Panel"
          className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden"
        >
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-[#0F2354]"
            >
              {link.label}
            </Link>
          ))}
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
