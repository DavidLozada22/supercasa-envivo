import Link from "next/link";
import { redirect } from "next/navigation";
import HousePreview from "@/components/admin/HousePreview";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Avance de la casa",
};

export default async function HousePage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Link href="/admin" className="text-sm font-semibold text-[#0F2354] hover:underline">
          Volver al panel
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-[#0F2354]">Avance de la casa</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Simula el recaudo con la barra y mira el fundido entre fases. No modifica el recaudo real
          ni crea donaciones.
        </p>
      </div>
      <HousePreview />
    </div>
  );
}
