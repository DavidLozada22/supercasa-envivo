import { redirect } from "next/navigation";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
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
      <SiteFooter />
      </div>
    </>
  );
}
