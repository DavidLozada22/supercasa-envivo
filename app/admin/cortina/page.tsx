import Link from "next/link";
import { redirect } from "next/navigation";
import CortinaPreview from "@/components/admin/CortinaPreview";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cortinas del live",
};

export default async function CortinaPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Link href="/admin" className="text-sm font-semibold text-[#0F2354] hover:underline">
          Volver al panel
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-[#0F2354]">Cortinas del live</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Estas son las pantallas que verá la audiencia cuando el live esté entre bloques. No
          mencionan reconexiones ni fallas técnicas. La música se activa con el botón.
        </p>
      </div>
      <CortinaPreview />
    </div>
  );
}
