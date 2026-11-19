import { redirect } from "next/navigation";
import SiteHeader from "@/components/public/SiteHeader";
import DonationThanks from "@/components/donations/DonationThanks";

export const metadata = {
  title: "Tu aporte",
  robots: { index: false, follow: false },
};

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  if (!ref) redirect("/donar");

  return (
    <>
      <SiteHeader current="donate" />

      <div className="sv-root">

      <main className="section">
        <div className="wrap">
          <DonationThanks reference={ref} />
        </div>
      </main>
      <footer className="footer" data-astro-cid-scinlfmn>
        <p className="wrap small copy" data-astro-cid-scinlfmn>
          © 2026 Fundación Segundos de Vida · Evento producido por Kavanah · <a href="https://svgvisual.com" target="_blank" rel="noopener noreferrer" className="svg-support">Apoya a SVG</a>
        </p>
        </footer>
      </div>
    </>
  );
}
