import Link from "next/link";

export default function StickyCta() {
  return (
    <div className="sticky-donate">
      <Link href="/donar" className="btn btn--primary">
        Pon tu pieza
      </Link>
    </div>
  );
}
