"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  IDS, chooseAnswer, createGameSession, getCandidates, getCharacter,
  getEvidence, getMenuProfile, getMoments, getQuestions, getTasteFacts, resultHash,
  type CharacterData, type DessertId, type GameSession, type PreferenceDimension,
} from "@/lib/dessert-friends/model";
import { useLanguage } from "../../context/LanguageContext";
import FooterSection from "../../components/FooterSection";
import {
  getGameSnapshot, getServerGameSnapshot, navigateGame,
  restoreGameHash, saveGameSession, subscribeGame,
} from "./game-store";
import { createDessertCard } from "./card";
import styles from "./DessertFriends.module.css";

type Modal = { kind: "card" | "share"; id: DessertId; url: string } | null;

const mobileQuizQuery = "(max-width: 767px)";
function subscribeMobileQuiz(listener: () => void) {
  const media = window.matchMedia(mobileQuizQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const getMobileQuiz = () => window.matchMedia(mobileQuizQuery).matches;
const getServerMobileQuiz = () => false;

function Art({ character, eager = false, className }: {
  character: CharacterData; eager?: boolean; className?: string;
}) {
  return <Image className={className} src={character.image} alt={character.alt}
    width={1254} height={1254} unoptimized loading={eager ? "eager" : "lazy"} />;
}

export default function DessertFriends() {
  const { lang } = useLanguage();
  const t = (ko: string, en: string) => lang === "ko" ? ko : en;
  const { ready, route, session } = useSyncExternalStore(subscribeGame, getGameSnapshot, getServerGameSnapshot);
  const isMobileQuiz = useSyncExternalStore(subscribeMobileQuiz, getMobileQuiz, getServerMobileQuiz);
  const [selectedTie, setSelectedTie] = useState<DessertId | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const shareInput = useRef<HTMLInputElement>(null);
  const modalTrigger = useRef<HTMLButtonElement | null>(null);
  const mobileAnswerUnlockAt = useRef(0);
  const questions = getQuestions(lang);
  const complete = session?.answers.every((answer) => answer !== null) ?? false;
  const tie = route.page === "quiz" && session?.stage === "tie" && complete;
  const tieCandidates = tie && session ? getCandidates(session.answers).ids : [];
  const question = questions[session?.index ?? 0];
  const resultId = route.page === "result" ? route.id : null;
  const dimensionLabel: Record<PreferenceDimension, string> = {
    texture: t("식감", "Texture"), flavor: t("풍미", "Flavour"), enjoyment: t("즐기는 방식", "How you enjoy it"),
  };

  useEffect(() => { if (ready) restoreGameHash(); }, [ready, lang]);
  useEffect(() => {
    if (!ready) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("scroll-container")?.scrollTo({ top: 0, behavior: "auto" });
      heading.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [ready, route.page, resultId, session?.index, session?.stage, lang]);
  useEffect(() => {
    if (modal && dialog.current && !dialog.current.open) dialog.current.showModal();
    return () => { if (modal?.kind === "card") URL.revokeObjectURL(modal.url); };
  }, [modal]);

  function begin() {
    mobileAnswerUnlockAt.current = 0;
    setSelectedTie(null);
    saveGameSession(createGameSession());
    navigateGame({ page: "quiz" });
  }

  function finish(id: DessertId, current: GameSession | null = session) {
    if (!current || current.answers.some((answer) => answer === null) || !getCandidates(current.answers).ids.includes(id)) {
      setSelectedTie(null);
      return;
    }
    saveGameSession({ ...current, result: id, stage: null });
    setSelectedTie(null);
    navigateGame({ page: "result", id });
  }

  function next(current: GameSession | null = session) {
    if (!current || current.answers[current.index] === null) return;
    if (current.index < questions.length - 1) {
      saveGameSession({ ...current, index: current.index + 1, stage: null });
    } else {
      const candidates = getCandidates(current.answers).ids;
      if (candidates.length === 1) finish(candidates[0], current);
      else {
        setSelectedTie(null);
        saveGameSession({ ...current, stage: "tie" });
      }
    }
  }

  function chooseMobileAnswer(answer: string) {
    const latest = getGameSnapshot();
    const current = latest.session;
    if (!current || !session || latest.route.page !== "quiz"
      || current.index !== session.index || (current.stage ?? null) !== (session.stage ?? null)
      || performance.now() < mobileAnswerUnlockAt.current) return;
    mobileAnswerUnlockAt.current = performance.now() + 250;
    if (tie) finish(answer as DessertId, current);
    else next({ ...chooseAnswer(current, answer), stage: null });
  }

  function previous() {
    mobileAnswerUnlockAt.current = 0;
    if (!session) return;
    if (tie) {
      setSelectedTie(null);
      saveGameSession({ ...session, stage: null });
    } else if (session.index === 0) navigateGame({ page: "home" });
    else saveGameSession({ ...session, index: session.index - 1, stage: null });
  }

  async function makeCard(id: DessertId, trigger: HTMLButtonElement) {
    modalTrigger.current = trigger;
    setBusy(true);
    setNotice("");
    try {
      const blob = await createDessertCard(id, lang);
      setModal({ kind: "card", id, url: URL.createObjectURL(blob) });
    } catch {
      setNotice(t("카드를 만들지 못했어요. 잠시 후 다시 시도해 주세요.", "We couldn't create your card. Please try again shortly."));
    } finally { setBusy(false); }
  }

  function share(id: DessertId, trigger: HTMLButtonElement) {
    modalTrigger.current = trigger;
    setNotice("");
    const url = new URL(window.location.href);
    url.hash = resultHash(id);
    setModal({ kind: "share", id, url: url.href });
  }

  function closeModal() {
    const trigger = modalTrigger.current;
    setModal(null);
    requestAnimationFrame(() => { if (trigger?.isConnected) trigger.focus({ preventScroll: true }); });
  }

  async function copyShareLink() {
    if (!modal) return;
    try {
      await navigator.clipboard.writeText(modal.url);
      setNotice(t("결과 링크를 복사했어요.", "Result link copied."));
    } catch {
      shareInput.current?.select();
      setNotice(t("선택된 링크를 복사해 주세요.", "Please copy the selected link."));
    }
  }

  async function nativeShare() {
    if (!modal || !navigator.share) return;
    const character = getCharacter(modal.id, lang);
    try {
      await navigator.share({
        title: t("나는 어떤 카피엔드 디저트일까?", "Which Caffiend dessert am I?"),
        text: t(`나는 ${character.name}! 디저트에 사는 나와 닮은 작은 친구를 만나보세요.`, `I'm ${character.name}! Meet your own little dessert friend.`),
        url: modal.url,
      });
    } catch (error) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        setNotice(t("링크 복사로 공유할 수 있어요.", "You can share by copying the link."));
      }
    }
  }

  function characterGrid(ids: DessertId[]) {
    return <div className={styles.collectionGrid}>{ids.map((id) => {
      const character = getCharacter(id, lang);
      return <a key={id} href={resultHash(id)} className={styles.characterCard} data-character={id}>
        <div className={styles.cardArt}><span className={styles.cardNumber}>{String(IDS.indexOf(id) + 1).padStart(2, "0")}</span><Art character={character} /></div>
        <p className={styles.category}>{character.category}</p>
        <h2 className={styles.characterName}>{character.name}</h2>
        <p className={styles.caption}>{character.scene}</p>
      </a>;
    })}</div>;
  }

  function renderResult(id: DessertId) {
    const character = getCharacter(id, lang);
    const own = session?.result === id;
    const facts = own && session ? getEvidence(session.answers, id, lang) : [];
    const taste = own && session ? getTasteFacts(session.answers, id, lang) : null;
    const profile = getMenuProfile(id, lang);
    const pair = getCharacter(character.pair, lang);
    const pairWithParticle = pair.name + ((pair.name.charCodeAt(pair.name.length - 1) - 44032) % 28 === 0 ? "와" : "과");
    return <article className={styles.result} data-result-id={id}>
      <div className={styles.resultLead}>
        <div className={styles.resultArt}><Art character={character} eager /><p className={styles.heroCaption}>CAFFIEND DESSERT FRIENDS / {String(IDS.indexOf(id) + 1).padStart(2, "0")}</p></div>
        <div className={styles.resultCopy}>
          <p className={styles.eyebrow}>{own ? t("오늘의 나와 닮은 작은 친구", "Your little dessert friend") : t("디저트에 사는 작은 친구", "A little friend who lives in a dessert")}</p>
          <h1 ref={heading} tabIndex={-1} className={styles.title}>{character.name}</h1>
          <p className={styles.menuName}>{character.menu}{lang === "ko" && <span>{character.en}</span>}</p>
          <blockquote className={styles.quote}>“{character.quote}”</blockquote>
          <p className={styles.story}>{character.story}</p>
          <div className={styles.tags}>{character.traits.map((trait) => <span key={trait}>{trait}</span>)}</div>
          <div className={styles.resultActions}>
            <button className={styles.primaryButton} onClick={(event) => makeCard(id, event.currentTarget)} disabled={busy}>{!busy && <Download size={18} aria-hidden="true" focusable="false" />}{busy ? t("카드 만드는 중…", "Creating card…") : t("카드 저장", "Save card")}</button>
            <button className={styles.secondaryButton} onClick={(event) => share(id, event.currentTarget)}>{t("친구에게 보내기 ↗", "Share with a friend ↗")}</button>
          </div>
        </div>
      </div>

      <section className={styles.contentSection} aria-labelledby="dessert-taste-title">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>A LITTLE TASTE</p><h2 id="dessert-taste-title">{t("이런 맛의 친구예요", "A little taste of this friend")}</h2></div>
        <div className={styles.tasteGrid}>
          <div><p className={styles.story}>{profile.bridge}</p><div className={styles.tags}>{profile.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          <div className={styles.tasteFacts}><h3>{own ? t("오늘 끌린 한 입", "The bite you chose today") : t("한 입 즐겨볼까요?", "Shall we take a bite?")}</h3>
            {!own && <><p>{profile.reasons.texture}</p><p>{profile.reasons.flavor}</p></>}
            {taste?.matched.map((fact) => <div className={styles.fact} key={fact.dimension}><p className={styles.factLabel}>{dimensionLabel[fact.dimension]}</p><p>{fact.reason}</p></div>)}
            {taste && !taste.matched.length && !taste.different.length && <p>{t("오늘은 어떤 맛이든 좋아요. 마음 가는 대로 한 입 즐겨보세요.", "Every flavour feels good today. Enjoy whichever bite you fancy.")}</p>}
            {!!taste?.different.length && <div className={styles.fact}>{!!taste.matched.length && <h4>{t("함께 고른 취향", "More of your preferences")}</h4>}{taste.different.map((fact) => <p key={fact.dimension}><span className={styles.factLabel}>{dimensionLabel[fact.dimension]}</span> {fact.answer}</p>)}</div>}
          </div>
        </div>
      </section>

      <section className={styles.contentSection} aria-labelledby="dessert-moments-title">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>FOUR LITTLE MOMENTS</p><h2 id="dessert-moments-title">{t("이 친구의 하루", "A day with this friend")}</h2><p>{t(`${character.name}, 이럴 땐 이렇게 지내요.`, `Little moments in ${character.name}'s day.`)}</p></div>
        <div className={styles.momentsGrid}>{getMoments(id, lang).map((moment) => <figure className={styles.momentCard} key={moment.key}>
          <Image className={styles.momentArt} src={moment.image} alt={moment.alt} width={1254} height={1254} unoptimized loading="lazy" />
          <figcaption className={styles.momentCopy}><p className={styles.category}>{moment.situation}</p><p className={styles.momentSetting}>{moment.setting}</p><h3 className={styles.momentTitle}>{moment.title}</h3><p className={styles.momentDescription}>{moment.description}</p></figcaption>
        </figure>)}</div>
      </section>

      <div className={styles.detailGrid}>
        <section className={styles.detailBlock}><p className={styles.eyebrow}>A LITTLE IMPERFECT</p><h2>{t("이런 순간도 귀여워요", "A little imperfect, a little lovely")}</h2><p>{character.quirk}</p></section>
        <section className={styles.detailBlock}><p className={styles.eyebrow}>{facts.length ? "YOUR LITTLE CHOICES" : "YOUR TURN"}</p><h2>{facts.length ? t("내 선택에서 발견한 모습", "A little of you in your choices") : t("나는 어떤 친구일까?", "Which friend am I?")}</h2>
          {facts.length ? facts.map((fact) => <div className={styles.evidence} key={fact.question}><p>{fact.question}</p><strong>“{fact.answer}”</strong></div>) : <><p>{t("열두 번의 작은 선택으로 내 디저트도 만나보세요.", "Meet your dessert friend in twelve little choices.")}</p><button className={styles.textButton} onClick={begin}>{t("나의 디저트 찾기 →", "Find my dessert →")}</button></>}
        </section>
      </div>

      <section className={styles.realMenu}>
        <div><Image className={styles.realPhoto} src={character.photo} alt={t(`카피엔드 실제 ${character.menu} 메뉴 사진`, `Caffiend's actual ${character.menu}`)} width={297} height={297} unoptimized loading="lazy" /></div>
        <div className={styles.realMenuCopy}><p className={styles.eyebrow}>FROM THE REAL MENU</p><h2>{t("이 친구가 사는 달콤한 공간.", "A sweet place this friend calls home.")}</h2><h3>{character.menu}</h3><ul className={styles.featureList} role="list">{character.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><a className={styles.textButton} href={lang === "en" ? "/en/menu" : "/menu"}>{t("카피엔드 메뉴 보기 ↗", "View the Caffiend menu ↗")}</a></div>
      </section>

      <a className={styles.pairCard} href={resultHash(character.pair)}><Art className={styles.pairArt} character={pair} /><div className={styles.pairCopy}><p className={styles.eyebrow}>TOGETHER ON THE TABLE</p><h2>{t(`${pairWithParticle} 함께라면`, `Together with ${pair.name}`)}</h2><p>{character.pairStory}</p><span className={styles.textButton}>{t("친구 이야기 보기 →", "Meet this friend →")}</span></div></a>
      <div className={styles.bottomActions}><a className={styles.secondaryButton} href="#collection">{t("디저트 친구 모두 보기", "Meet all the dessert friends")}</a><button className={styles.textButton} onClick={begin}>{t("다시 해보기 ↻", "Try again ↻")}</button></div>
      <p className={styles.disclaimer}>{t("일상 속 모습과 직접 고른 취향으로 만나는 캐릭터 이야기예요. 성격을 진단하거나 입맛을 단정하는 검사는 아닙니다.", "A character story inspired by everyday choices and your own preferences. It isn't a personality diagnosis or a definitive guide to your taste.")}</p>
    </article>;
  }

  return <main>
    <div className={styles.root} data-dessert-game data-language={lang} data-game-screen={route.page}>
      <div className={styles.pageHeader}><p className={styles.eyebrow}>CAFFIEND / DESSERT FRIENDS</p><div className={styles.toolbar}>
        {route.page !== "home" && <button className={styles.textButton} onClick={() => navigateGame({ page: "home" })}>{t("테스트 처음으로", "Back to the beginning")}</button>}
        {route.page !== "collection" && <a className={styles.textButton} href="#collection">{t("디저트 친구들", "Dessert friends")}</a>}
      </div></div>

      {!ready ? <div className={styles.loading} aria-busy="true"><h1>{t("디저트 친구들", "Dessert Friends")}</h1></div> : <>
        {route.page === "home" && <>
          <section className={styles.hero}>
            <div className={styles.heroCopy}><p className={styles.eyebrow}>{t("카피엔드의 작은 성격 테스트", "A little personality quiz from Caffiend")}</p><h1 ref={heading} tabIndex={-1} className={styles.title}>{t("나는 어떤 디저트일까?", "Which dessert am I?")}</h1><p className={styles.lead}>{t("폭신한 수플레와 달콤한 빙수에는 작은 친구들이 살고 있어요. 평소의 나와 끌리는 맛을 따라 나와 닮은 디저트 친구를 만나보세요.", "Little friends live among fluffy soufflés and sweet bingsu. Follow your everyday self and the flavours you love to meet a dessert friend just like you.")}</p><div className={styles.heroActions}><p className={styles.caption}>{t("성격 9문항 + 취향 3문항", "9 personality + 3 taste questions")}</p><button className={styles.primaryButton} onClick={begin}>{t("나의 디저트 찾기", "Find my dessert")} <span aria-hidden="true">↗</span></button></div>
              {session?.result && <a className={styles.resume} href={resultHash(session.result)}>{t("지난 결과 다시 보기 →", "See my previous result →")}</a>}
            </div><div className={styles.heroArt}><p className={styles.eyebrow}>{t("디저트에 사는 작은 친구들", "Little friends who live in desserts")}</p><Art character={getCharacter("P", lang)} eager /><p className={styles.heroCaption}>{t("복숭아 언덕에서 꾸는 낮꿈", "Daydreams on a peach hill")}</p></div>
          </section>
          <section className={styles.intro}><div><p className={styles.eyebrow}>01 / SWEET PERSONALITY</p><h2>{t("같은 테이블, 여덟 가지 매력.", "One table. Eight little personalities.")}</h2><p>{t("디저트마다 작은 친구가 살고 있어요.", "Every dessert has a little friend of its own.")}</p></div><a className={styles.textButton} href="#collection">{t("친구들 만나보기 ↗", "Meet the friends ↗")}</a></section>
          {characterGrid(["S", "D", "B", "M"])}
        </>}

        {route.page === "collection" && <><div className={styles.sectionHeading}><p className={styles.eyebrow}>THE SWEETEST LITTLE FRIENDS</p><h1 ref={heading} tabIndex={-1} className={styles.title}>{t("같은 테이블, 여덟 가지 매력.", "One table. Eight little personalities.")}</h1><p className={styles.lead}>{t("카피엔드 디저트에 사는 여덟 친구들이에요. 캐릭터를 누르면 그 친구의 이야기와 실제 메뉴를 볼 수 있어요.", "Meet the eight friends who live in Caffiend's desserts. Choose a character to discover their story and the real dessert behind it.")}</p></div>{characterGrid(IDS)}<div className={styles.bottomActions}><button className={styles.primaryButton} onClick={begin}>{t("나와 닮은 친구 찾기 →", "Find a friend like me →")}</button></div></>}

        {route.page === "quiz" && session && <section className={styles.quiz} data-question-id={tie ? "tie" : question.id} data-quiz-mode={isMobileQuiz ? "auto" : "manual"}>
          <div className={styles.quizTop}><button className={styles.textButton} onClick={previous}>← {t("이전", "Back")}</button><span>{tie ? t("마지막 한 조각", "One last little piece") : session.index >= 9 ? t("오늘 끌리는 한 입", "A bite you fancy today") : session.index < 4 ? t("설레는 오후의 시작", "A lovely afternoon begins") : session.index < 8 ? t("같이 있으면 더 좋은 순간", "Better moments together") : t("메뉴판 앞의 작은 선택", "A little choice at the menu")}</span><span>{tie ? "+ 1" : `${String(session.index + 1).padStart(2, "0")} / 12`}</span></div>
          <div className={styles.progress} role="progressbar" aria-label={t("테스트 진행", "Quiz progress")} aria-valuemin={0} aria-valuemax={12} aria-valuenow={session.index + 1}><div className={styles.progressFill} style={{ width: `${((session.index + 1) / questions.length) * 100}%` }} /></div>
          <div className={styles.questionHeader}><p className={styles.eyebrow}>{tie ? "THE LAST LITTLE PIECE" : `${question.kind === "preference" ? "A LITTLE TASTE" : "A LITTLE MOMENT"} ${String(session.index + 1).padStart(2, "0")}`}</p><h1 ref={heading} tabIndex={-1} className={styles.questionTitle}>{tie ? t("오늘의 나에게 더 가까운 한마디는?", "Which feels a little more like you today?") : question.title}</h1><p id="dessert-question-hint" className={styles.questionHint}>{isMobileQuiz ? t("선택하면 바로 진행돼요.", "Choose an answer to continue.") : tie ? t("닮은 모습이 나란히 나왔어요. 지금의 마음으로 마지막 한 조각을 골라주세요.", "A few friends feel equally like you. Follow your heart for one last little choice.") : question.kind === "preference" ? t("지금 먹고 싶은 한 입에 더 가까운 쪽을 골라주세요.", "Choose the bite you feel like enjoying right now.") : t("평소의 나와 조금 더 가까운 쪽을 골라주세요.", "Choose the answer that's a little closer to your everyday self.")}</p></div>
          <fieldset key={tie ? "tie" : question.id} className={styles.choices}><legend className={styles.srOnly}>{tie ? t("마지막 한 조각", "One last little piece") : question.title}</legend>
            {(tie ? tieCandidates.map((id) => ({ id, text: getCharacter(id, lang).tie })) : session.orders[session.index].map((id) => question.options.find((option) => option.id === id)!)).map((option) => {
              const selected = tie ? selectedTie === option.id : session.answers[session.index] === option.id;
              const content = <><span className={styles.choiceText}>{option.text}</span><span className={styles.choiceCheck} aria-hidden="true">{selected ? "✓" : "○"}</span></>;
              return isMobileQuiz
                ? <button type="button" className={`${styles.choice} ${selected ? styles.selectedChoice : ""}`} key={option.id} data-option-id={option.id} aria-pressed={selected} aria-describedby="dessert-question-hint" onClick={() => chooseMobileAnswer(option.id)}>{content}</button>
                : <label className={`${styles.choice} ${selected ? styles.selectedChoice : ""}`} key={option.id} data-option-id={option.id}><input type="radio" name={`dessert-${tie ? "tie" : question.id}`} value={option.id} checked={selected} onChange={() => tie ? setSelectedTie(option.id as DessertId) : saveGameSession({ ...chooseAnswer(session, option.id), stage: null })} />{content}</label>;
            })}
          </fieldset>
          {!isMobileQuiz && <div className={styles.questionFooter}><button className={styles.primaryButton} disabled={tie ? !selectedTie || !tieCandidates.includes(selectedTie) : session.answers[session.index] === null} onClick={() => tie ? selectedTie && finish(selectedTie) : next()}>{tie || session.index === questions.length - 1 ? t("나의 디저트 만나기", "Meet my dessert") : t("다음 질문", "Next question")} <span aria-hidden="true">→</span></button><p className={styles.caption}>{t("정답은 없어요. 오늘의 나답게 골라주세요.", "There are no right answers. Just choose what feels like you today.")}</p></div>}
        </section>}

        {route.page === "result" && renderResult(route.id)}
      </>}
    </div>
    <FooterSection />

    {modal && <dialog ref={dialog} className={styles.dialog} aria-labelledby="dessert-dialog-title" onClose={closeModal}><div className={styles.dialogHeader}><h2 id="dessert-dialog-title">{modal.kind === "card" ? t("내 디저트 카드", "My dessert card") : t("친구에게 내 디저트 보내기", "Share my dessert with a friend")}</h2><button className={styles.dialogClose} onClick={() => dialog.current?.close()} aria-label={t("닫기", "Close")}>×</button></div>
      {modal.kind === "card" ? <><Image className={styles.cardPreview} src={modal.url} alt={t(`${getCharacter(modal.id, lang).name} 저장용 카드`, `${getCharacter(modal.id, lang).name} keepsake card`)} width={1080} height={1350} unoptimized /><a className={styles.primaryButton} href={modal.url} download={`caffiend-dessert-${modal.id}-${lang}.png`}><Download size={18} aria-hidden="true" focusable="false" />{t("이미지 내려받기", "Download image")}</a><p className={styles.caption}>{t("휴대폰에서는 이미지를 길게 눌러 저장할 수도 있어요.", "On a phone, you can also press and hold the image to save it.")}</p></> : <><p>{t(`나는 ${getCharacter(modal.id, lang).name}! 디저트에 사는 나와 닮은 작은 친구를 만나보세요.`, `I'm ${getCharacter(modal.id, lang).name}! Meet your own little dessert friend.`)}</p><label className={styles.srOnly} htmlFor="dessert-share-url">{t("복사할 결과 링크", "Result link to copy")}</label><input ref={shareInput} id="dessert-share-url" className={styles.shareInput} value={modal.url} readOnly /><button className={styles.primaryButton} onClick={copyShareLink}>{t("링크 복사", "Copy link")}</button>{typeof navigator !== "undefined" && !!navigator.share && <button className={styles.secondaryButton} onClick={nativeShare}>{t("기기로 공유하기 ↗", "Share from this device ↗")}</button>}</>}
      {notice && <p role="status" aria-live="polite" className={styles.caption}>{notice}</p>}
    </dialog>}
    {notice && !modal && <div role="status" aria-live="polite" className={styles.toast}>{notice}<button onClick={() => setNotice("")} aria-label={t("알림 닫기", "Dismiss notification")}>×</button></div>}
  </main>;
}
