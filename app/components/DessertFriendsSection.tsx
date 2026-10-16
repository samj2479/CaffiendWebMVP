"use client";

import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import styles from "./DessertFriendsSection.module.css";

export default function DessertFriendsSection() {
  const { lang } = useLanguage();
  const isEnglish = lang === "en";

  return (
    <section
      id="dessert-friends-intro"
      aria-labelledby="dessert-friends-intro-title"
      className={styles.section}
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            {isEnglish ? "A little fun while you wait for your order" : "메뉴 기다리는 중 심심하다면?"}
          </p>
          <h2 id="dessert-friends-intro-title" className={styles.title}>
            {isEnglish ? <>Meet your<br />dessert friend.</> : <>나와 닮은<br />디저트 친구들</>}
          </h2>
          <p className={styles.description}>
            {isEnglish
              ? "A few little choices, a sweet discovery. Find the Caffiend dessert friend who shares your personality and taste."
              : "작은 선택을 따라 만나는 달콤한 발견. 나의 성격과 취향을 닮은 카피엔드 디저트 친구를 찾아보세요."}
          </p>
          <a
            href={isEnglish ? "/en/brand/dessert-friends" : "/brand/dessert-friends"}
            className="inline-block font-sans text-sm tracking-widest uppercase bg-white text-black px-10 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-300"
          >
            {isEnglish ? "Dessert Friends" : "디저트 친구들"}
          </a>
        </div>
        <figure className={styles.figure}>
          <div className={styles.art}>
            <Image
              src="/dessert-friends/assets/residents-v3/D.webp"
              width={1254}
              height={1254}
              sizes="(max-width: 767px) 86vw, (max-width: 1199px) 44vw, 550px"
              quality={90}
              alt={isEnglish
                ? "Dubai Explorer Captain examining the green topping on a Dubai soufflé with a magnifying glass"
                : "두바이 수플레 위에서 돋보기로 초록 토핑을 살펴보는 두바이 탐구대장"}
            />
          </div>
          <figcaption className={styles.caption}>
            {isEnglish ? "Dubai Explorer Captain" : "두바이 탐구대장"}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
