import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import type { ReactNode } from "react";

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <SiteHeader current="legal" />

      <div className="flex min-h-screen flex-col bg-[#fffaf1] font-['Plus_Jakarta_Sans',sans-serif] text-[#28251f]">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:py-20">
        <h1 className="mt-10 font-['Baloo_2',sans-serif] text-4xl leading-tight font-bold sm:text-5xl">{title}</h1>
        <p className="mt-6 rounded-xl bg-[#ffedb5] p-4 font-bold">
          Borrador pendiente de revisión legal. La Fundación Segundos de Vida debe entregar el texto oficial antes del lanzamiento.
        </p>
        <div className="mt-8 space-y-5 leading-relaxed [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-[#ae402d] [&_h2]:mt-8 [&_h2]:font-['Baloo_2',sans-serif] [&_h2]:text-2xl [&_h2]:font-bold [&_li]:mb-2 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </main>
      <SiteFooter />
      </div>
    </>
  );
}
