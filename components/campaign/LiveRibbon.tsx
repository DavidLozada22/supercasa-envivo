import Link from "next/link";

const START = new Date("2026-11-20T18:00:00-05:00");
const END = new Date("2026-11-22T18:00:00-05:00");

export default function LiveRibbon() {
  const now = new Date();
  if (now > END) return null;

  const live = now >= START;

  return (
    <Link href="/envivo" className="live-ribbon">
      <span className="live-ribbon__dot" />
      <span className="live-ribbon__text">
        {live
          ? "Estamos en vivo · 48 horas por La Supercasa"
          : "La transmisión empieza el viernes 20 a las 6:00 p. m., hora de Bogotá."}
      </span>
      <span className="live-ribbon__cta">Entrar al live</span>
    </Link>
  );
}
