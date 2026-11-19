import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ADMIN_LINKS } from "./nav";

export default function PanelMap() {
  const links = ADMIN_LINKS.filter((link) => link.href !== "/admin");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#E6009E]">
            Mapa del panel
          </p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-[#0F2354]">
            Todo lo que necesitas, en un solo lugar
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Entra directo a cada herramienta. Streaming es el centro de la transmisión.
          </p>
        </div>
        <Link
          href="/admin/streaming"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F2354] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#183478]"
        >
          Abrir Streaming
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {links.map((link) => {
          const Icon = link.icon;
          const primary = link.href === "/admin/streaming";
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex h-full flex-col gap-2 rounded-xl border p-4 transition ${
                primary
                  ? "border-[#B5F43D] bg-[#B5F43D]/12 hover:bg-[#B5F43D]/20"
                  : "border-slate-200 bg-slate-50 hover:border-[#E6009E]/35 hover:bg-white"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  primary ? "bg-[#0F2354] text-[#B5F43D]" : "bg-white text-[#E6009E]"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-extrabold leading-tight text-[#0F2354]">
                  {link.label}
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-[#E6009E]"
                  strokeWidth={2}
                />
              </span>
              <span className="text-[11px] leading-relaxed text-slate-500">{link.description}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
