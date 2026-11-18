import { redirect } from "next/navigation";
import DonationThanks from "@/components/donations/DonationThanks";

export const metadata = {
  title: "Tu aporte | La SUPERCASA",
};

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  if (!ref) redirect("/donar");

  return (
    <div className="sv-root">
      <main className="section">
        <div className="wrap">
          <DonationThanks reference={ref} />
        </div>
      </main>
      <footer className="footer" data-astro-cid-scinlfmn>
        <p className="wrap small copy" data-astro-cid-scinlfmn>
          © 2026 Fundación Segundos de Vida · Evento producido por Kavanah
        </p>
        <p className="wrap small copy" data-astro-cid-scinlfmn>
          © 2026 Fundación Segundos de Vida. All Rights Reserved. | Built by{" "}
          <a href="https://svgvisual.com" target="_blank" rel="noopener noreferrer" data-astro-cid-scinlfmn>
            SVG
          </a>
        </p>
      </footer>
    </div>
  );
}
