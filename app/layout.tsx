import type { Metadata } from "next";
import { Playfair_Display, Lato, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import LayoutShell from "./components/LayoutShell";
import { LanguageProvider } from "./context/LanguageContext";
import PublicInfoLinks from "./components/PublicInfoLinks";
import PublicInfoRegion from "./components/PublicInfoRegion";
import AnalyticsConsentRuntime from "./components/AnalyticsConsent";
import { getApprovedPublicPolicies, PUBLIC_BUSINESS_EMAIL } from "@/lib/public-info/policies";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Caffiend | 카피엔드 — Yangdoek, Pohang",
  description:
    "A warm Korean dessert café in Yangdoek, Pohang. Handcrafted soufflés, seasonal bingsu, and fluffy pancakes made with love by Kim Mi Gyeoung.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publicEmail = getApprovedPublicPolicies()?.business.email ?? PUBLIC_BUSINESS_EMAIL;
  return (
    <html
      lang="ko"
      className={`${playfair.variable} ${lato.variable} ${notoSansKR.variable}`}
    >
      <body suppressHydrationWarning>
        <LanguageProvider>
          <LayoutShell publicInformation={<PublicInfoRegion
            publicEmail={publicEmail}
            korean={<PublicInfoLinks lang="ko" />}
            english={<PublicInfoLinks lang="en" />}
          />} qrInformation={<PublicInfoRegion
            publicEmail={publicEmail}
            korean={<PublicInfoLinks lang="ko" openInNewTab />}
            english={<PublicInfoLinks lang="en" openInNewTab />}
          />}>{children}</LayoutShell>
          <AnalyticsConsentRuntime />
        </LanguageProvider>
      </body>
    </html>
  );
}
