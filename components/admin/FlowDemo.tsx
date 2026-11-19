"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";

const outcomes = {
  Aprobado: { title: "Gracias, tu aporte ya suma", text: "La donación se confirma y puede reflejarse en el recaudo.", Icon: CheckCircle2 },
  Pendiente: { title: "Estamos confirmando tu pago", text: "La persona espera la confirmación de la pasarela.", Icon: Clock },
  Rechazado: { title: "El pago no se completó", text: "La persona puede volver a intentarlo o usar otro medio.", Icon: XCircle },
};
type Outcome = keyof typeof outcomes;

export default function FlowDemo() {
  const [state, setState] = useState<Outcome>("Aprobado");
  const current = outcomes[state];
  const Icon = current.Icon;
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-[#0F2354]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <div className="mx-auto max-w-5xl">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" href="/admin"><ArrowLeft size={16} /> Volver al panel</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-widest text-[#B8007E]">Herramientas de producción</p>
        <h1 className="mt-2 text-3xl font-extrabold">Recorrido del donante</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Una vista del recorrido y una demostración de los mensajes de resultado. No crea donaciones, no realiza pagos y no cambia el recaudo.</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="map-title">
            <h2 id="map-title" className="text-xl font-bold">Mapa del recorrido</h2>
            <ol className="mt-5 space-y-2">
              {[
                ["1", "Campaña o transmisión", "La persona conoce la causa o llega desde redes."],
                ["2", "Donar o escanear QR", "Accede a las opciones de aporte."],
                ["3", "Pieza y datos", "Elige el valor y autoriza el tratamiento de datos."],
                ["4", "Confirmación y pago", "Revisa el total y continúa al medio disponible."],
                ["5", "Resultado", "Consulta si el pago fue aprobado, está pendiente o fue rechazado."],
              ].map(([number, title, text], index) => (
                <li key={number}>
                  {index > 0 ? <ArrowDown className="ml-4 my-1 text-slate-400" size={18} aria-hidden="true" /> : null}
                  <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2354] text-sm font-bold text-white">{number}</span>
                    <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm text-slate-600">{text}</p></div>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-slate-600">Las transferencias se concilian manualmente. El mapa describe el flujo previsto, no confirma la disponibilidad de cada integración.</p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="demo-title">
            <h2 id="demo-title" className="text-xl font-bold">Vista de resultados</h2>
            <p className="mt-2 text-sm text-slate-600">Selecciona un estado para ver un ejemplo del mensaje que recibiría la persona.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(Object.keys(outcomes) as Outcome[]).map((item) => (
                <button key={item} type="button" aria-pressed={state === item} onClick={() => setState(item)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${state === item ? "border-[#0F2354] bg-[#0F2354] text-white" : "border-slate-300 hover:bg-slate-100"}`}>{item}</button>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border-2 border-[#0F2354] bg-[#fffaf0] p-8 text-center" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Ejemplo · no es un pago real</p>
              <Icon className="mx-auto mt-5 text-[#0F2354]" size={40} strokeWidth={1.75} aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold">{current.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{current.text}</p>
              <p className="mt-4 text-sm font-semibold">Aporte de ejemplo: $100.000 COP</p>
            </div>
            <p className="mt-4 text-sm text-slate-500">Esta vista es ilustrativa. Las pruebas reales del checkout requieren sandbox de Wompi y una base de datos de prueba.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
