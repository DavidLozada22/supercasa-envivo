import Link from "next/link";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { roleOf } from "@/lib/users";
import AdminSidebar from "./AdminSidebar";
import MobileAdminNav from "./MobileAdminNav";

export default async function AdminShell({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  const session = await getSession();
  const role = session ? roleOf(session.username) : null;

  return (
    <div
      className="flex min-h-screen bg-[#F4F6FB]"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      <AdminSidebar user={session?.username} role={role} />

      <div className="flex min-w-0 flex-1 flex-col">
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

        <main className="mx-auto w-full max-w-7xl p-5 pb-28 lg:p-8">{children}</main>
      </div>

      <MobileAdminNav role={role ?? "editor"} user={session?.username} />
    </div>
  );
}
