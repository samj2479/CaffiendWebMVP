"use client";

import { useLanguage } from "../../context/LanguageContext";
import FooterSection from "../../components/FooterSection";
import styles from "./SouffleGuide.module.css";

const steps = [
  {
    titleKo: "먼저, 빵과 크림만",
    titleEn: "First, just soufflé and cream",
    ingredientsKo: ["빵", "크림"],
    ingredientsEn: ["Soufflé", "Cream"],
    descriptionKo: "먼저 빵과 크림만 함께 맛보세요.",
    descriptionEn: "Start by tasting just the soufflé and cream together.",
  },
  {
    titleKo: "네 가지를 한입에",
    titleEn: "All four in one bite",
    ingredientsKo: ["빵", "크림", "아이스크림", "과일"],
    ingredientsEn: ["Soufflé", "Cream", "Ice cream", "Fruit"],
    descriptionKo: "다음에는 빵과 크림에 아이스크림과 과일까지 곁들여 드셔보세요. 네 가지를 한입에 함께 즐기는 거예요.",
    descriptionEn: "Next, add ice cream and fruit to the soufflé and cream. Enjoy all four together in one bite.",
  },
];

export default function SouffleGuide() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <main>
      <div className={styles.root} data-souffle-guide data-language={lang}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>CAFFIEND / SOUFFLÉ GUIDE</p>
          <h1>{isEn ? "A little guide to enjoying soufflé." : "수플레, 이렇게 즐겨보세요."}</h1>
          <p className={styles.intro}>
            {isEn ? "Watch the video, then enjoy two little steps." : "영상으로 먼저 보고, 두 가지 순서로 즐겨보세요."}
          </p>
        </header>

        <div className={styles.contentGrid}>
          <figure className={styles.videoFigure}>
            <div className={styles.videoFrame}>
              <video
                className={styles.video}
                controls
                playsInline
                preload="metadata"
                poster="/media/souffle-guide/poster.jpg"
                aria-label={isEn ? "How to enjoy Caffiend soufflé" : "카피엔드 수플레 즐기는 방법 영상"}
              >
                <source src="/media/souffle-guide/souffle-guide.mp4" type="video/mp4" />
                <track kind="captions" src="/media/souffle-guide/captions-ko.vtt" srcLang="ko" label="한국어" />
                <track kind="subtitles" src="/media/souffle-guide/captions-en.vtt" srcLang="en" label="English" default={isEn} />
                {isEn ? "Your browser cannot play this video." : "이 브라우저에서는 영상을 재생할 수 없습니다."}
              </video>
            </div>
            <figcaption className={styles.videoCaption}>
              <span>CAFFIEND SOUFFLÉ</span>
              <span>{isEn ? "21 seconds" : "21초 영상"}</span>
            </figcaption>
          </figure>

          <section className={styles.guide} aria-labelledby="souffle-steps-title">
            <div className={styles.guideHeading}>
              <p className={styles.eyebrow}>TWO LITTLE STEPS</p>
              <h2 id="souffle-steps-title">{isEn ? "One plate, two ways to enjoy it." : "한 접시를 즐기는 두 가지 순서."}</h2>
            </div>
            <ol className={styles.steps} role="list">
              {steps.map((step, index) => (
                <li className={styles.step} key={step.titleEn}>
                  <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div className={styles.stepCopy}>
                    <h3>{isEn ? step.titleEn : step.titleKo}</h3>
                    <p className={styles.ingredients}>
                      {(isEn ? step.ingredientsEn : step.ingredientsKo).map((ingredient, ingredientIndex) => (
                        <span key={ingredient}>
                          {ingredientIndex > 0 && <span className={styles.plus} aria-hidden="true">+</span>}
                          {ingredient}
                        </span>
                      ))}
                    </p>
                    <p className={styles.description}>{isEn ? step.descriptionEn : step.descriptionKo}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={styles.closing}>
              <p>{isEn ? "Enjoy every bite at Caffiend." : "카피엔드에서 맛있게 즐겨보세요."}</p>
              <a className={styles.menuButton} href={isEn ? "/en/menu" : "/menu"}>
                {isEn ? "View the menu" : "메뉴 보러가기"}<span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        </div>
      </div>
      <FooterSection />
    </main>
  );
}
