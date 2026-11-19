import Link from "next/link";
import { PIECES } from "@/lib/donations/pieces";

const A = { "data-astro-cid-erlevsxa": "" } as const;
const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function DonatePreview() {
  return (
    <div className="flow card" {...A}>
      <ol className="stepper" aria-label="Pasos" {...A}>
        <li className="is-current" {...A}>
          <span className="stepper__n" {...A}>1</span>
          Tu pieza
        </li>
        <li {...A}>
          <span className="stepper__n" {...A}>2</span>
          Tus datos
        </li>
        <li {...A}>
          <span className="stepper__n" {...A}>3</span>
          Confirma
        </li>
      </ol>

      <fieldset className="frequency" {...A}>
        <legend {...A}>¿Cómo quieres ayudar?</legend>

        <label className="pill pill--big" {...A}>
          <input type="radio" name="home-frequency" value="once" defaultChecked {...A} />
          <span {...A}>🎁 Donación única</span>
        </label>

        <label className="pill pill--big is-disabled" {...A}>
          <input type="radio" name="home-frequency" value="monthly" disabled {...A} />
          <span {...A}>
            💛 Plan Padrino mensual
            <small {...A}>Muy pronto: cada mes pones una pieza más.</small>
          </span>
        </label>
      </fieldset>

      <fieldset className="pieces" {...A}>
        <legend className="visually-hidden" {...A}>Tu pieza</legend>
        {PIECES.map((piece) => (
          <label
            key={piece.id}
            className={`piece${piece.id === "ventana" ? " piece--rec" : ""}`}
            data-piece={piece.id}
            {...A}
          >
            <input
              type="radio"
              name="home-piece"
              value={piece.id}
              defaultChecked={piece.id === "ventana"}
              {...A}
            />
            <span className="piece__icon" aria-hidden="true" {...A}>{piece.icon}</span>
            <span className="piece__label" {...A}>{piece.label}</span>
            <span className="piece__price" {...A}>
              <strong {...A}>{piece.price > 0 ? cop.format(piece.price) : "Tú eliges"}</strong>
            </span>
            {piece.badge ? (
              <span className="piece__badge piece__badge--once" {...A}>{piece.badge}</span>
            ) : null}
          </label>
        ))}
      </fieldset>

      <div className="actions" {...A}>
        <Link href="/donar" className="btn btn--primary btn--xl" {...A}>
          Continuar
        </Link>
      </div>
    </div>
  );
}
