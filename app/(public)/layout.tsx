import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { CookieConsentBanner } from "@/components/analytics/CookieConsent";
import { ClarityProvider } from "@/components/analytics/ClarityProvider";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
      <CookieConsentBanner />
      <ClarityProvider />
    </>
  );
}
