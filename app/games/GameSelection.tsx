import Image from "next/image";
import FooterSection from "../components/FooterSection";
import DigulTopFive from "./DigulTopFive";

export default function GameSelection({ lang }: { lang: "ko" | "en" }) {
  const english = lang === "en";
  const title = english ? "Digul Digul" : "디굴디굴";

  return (
    <>
      <main lang={lang} className="min-h-screen bg-[#FAF7F2] px-4 pt-[100px] pb-20 text-black sm:px-6 md:pt-[140px] md:pb-28">
        <div className="mx-auto max-w-3xl">
          <DigulTopFive lang={lang} />
          <section aria-labelledby="digul-game-title" className="mx-auto mt-10 flex max-w-sm flex-col items-center text-center md:mt-14">
            <Image
              src="/cafe-games/assets/menu/02-grapefruit-bingsu.webp"
              alt=""
              width={224}
              height={224}
              unoptimized
              className="h-32 w-32 object-contain sm:h-40 sm:w-40"
            />
            <h2 id="digul-game-title" className="mt-4 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed break-keep text-black/65">
              {english ? "Drop matching desserts together to make a bigger dessert." : "같은 디저트를 떨어뜨려 합치며 더 큰 디저트를 만들어 보세요."}
            </p>
            <a
              href={`/cafe-games/index.html?game=merge${english ? "&lang=en" : ""}`}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-caramel px-7 py-2.5 text-sm font-semibold text-white hover:bg-caramel/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel"
            >
              {english ? "Play" : "게임 시작"}<span aria-hidden="true">→</span>
            </a>
          </section>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
