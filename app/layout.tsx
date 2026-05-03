import type { Metadata } from "next";
import { Playfair_Display, Lato, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import ScrollAnimationObserver from "./components/ScrollAnimationObserver";
import ScrollProgressBar from "./components/ScrollProgressBar";
import ScrollToTop from "./components/ScrollToTop";
import ScrollSnapController from "./components/ScrollSnapController";
import { LanguageProvider } from "./context/LanguageContext";

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
  return (
    <html
      lang="ko"
      className={`${playfair.variable} ${lato.variable} ${notoSansKR.variable}`}
    >
      <body className="overflow-hidden">
        <LanguageProvider>
          <Nav />
          <ScrollAnimationObserver />
          <ScrollProgressBar />
          <ScrollToTop />
          <ScrollSnapController />
          <div
            id="scroll-container"
            style={{
              height: "100vh",
              overflowY: "scroll",
            }}
          >
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
