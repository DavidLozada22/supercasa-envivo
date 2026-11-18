import { redirect } from "next/navigation";
import DonationThanks from "@/components/donations/DonationThanks";

export const metadata = {
  title: "Tu aporte | Súper Navidad por La Supercasa",
};

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  if (!ref) redirect("/donar");

  return (
    <div className="landing-root">
      <div className="bg-pattern" aria-hidden="true" />
      <main className="container" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <DonationThanks reference={ref} />
      </main>
      <footer>
        <p className="mt-8 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Fundación Segundos de Vida. All Rights Reserved. | Built by{" "}
          <a
            href="https://svgvisual.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#E6009E] transition hover:brightness-110"
          >
            SVG
          </a>
        </p>
      </footer>
    </div>
  );
}
