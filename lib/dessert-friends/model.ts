import {
  VERSION,
  STORAGE_KEY,
  candidates,
  createSession,
  evidence,
  parseRoute,
  shareHash,
  tasteEvidence,
  updateAnswer,
  validSession,
} from "./original/engine.js";
import { ids, characters } from "./original/characters.js";
import { questions } from "./original/questions.js";
import { situations } from "./original/situations.js";
import { menuProfiles } from "./original/menu-profiles.js";
import {
  englishCharacters,
  englishMenuProfiles,
  englishQuestions,
  englishSituations,
  englishTasteReasons,
} from "./english";

export { VERSION, STORAGE_KEY };

export type Language = "ko" | "en";
export type DessertId = "S" | "P" | "D" | "C" | "B" | "M" | "L" | "T";
export type PreferenceDimension = "texture" | "flavor" | "enjoyment";

export interface AnswerOption {
  id: string;
  text: string;
  primary?: DessertId;
  secondary?: DessertId;
  affinity?: DessertId[];
}

export interface GameQuestion {
  id: string;
  kind: "personality" | "preference";
  title: string;
  dimension?: PreferenceDimension;
  options: AnswerOption[];
}

export interface GameSession {
  version: string;
  answers: (string | null)[];
  index: number;
  result: DessertId | null;
  orders: string[][];
  stage?: "tie" | null;
}

export interface CandidateResult {
  ids: DessertId[];
  scores: Record<DessertId, number>;
  direct: Record<DessertId, number>;
  taste: Record<DessertId, number>;
  shortlist: DessertId[];
}

export interface CharacterData {
  id: DessertId;
  name: string;
  menu: string;
  en: string;
  quote: string;
  story: string;
  traits: string[];
  quirk: string;
  features: string[];
  tie: string;
  pair: DessertId;
  pairStory: string;
  category: string;
  scene: string;
  action: string;
  appearance: string;
  alt: string;
  image: string;
  photo: string;
}

export interface MomentData {
  key: string;
  situation: string;
  title: string;
  description: string;
  alt: string;
  setting: string;
  image: string;
}

export interface MenuProfile {
  tags: string[];
  texture: string[];
  flavor: string[];
  enjoyment: string[];
  bridge: string;
  reasons: Record<PreferenceDimension, string>;
}

export interface EvidenceFact {
  question: string;
  answer: string;
  weight: number;
}

export interface TasteFact {
  question: string;
  answer: string;
  dimension: PreferenceDimension;
  reason?: string;
}

export interface TasteFacts {
  matched: (TasteFact & { reason: string })[];
  different: TasteFact[];
  neutral: TasteFact[];
}

export type GameRoute =
  | { page: "home" }
  | { page: "quiz" }
  | { page: "collection" }
  | { page: "result"; id: DessertId };

export const IDS: DessertId[] = [...ids] as DessertId[];

const canonicalQuestions = questions as unknown as GameQuestion[];
const canonicalCharacters = characters as unknown as Record<DessertId, CharacterData>;
const canonicalMoments = situations as unknown as Record<DessertId, MomentData[]>;
const canonicalProfiles = menuProfiles as unknown as Record<DessertId, MenuProfile>;
const assetUrl = (path: string) => `/dessert-friends/${path}`;

export function createGameSession(random?: () => number): GameSession {
  return createSession(random) as GameSession;
}

export function isValidSession(value: unknown): value is GameSession {
  return validSession(value);
}

export function chooseAnswer(session: GameSession, answer: string): GameSession {
  return updateAnswer(session, answer) as GameSession;
}

export function getCandidates(answers: readonly (string | null)[]): CandidateResult {
  return candidates(answers) as unknown as CandidateResult;
}

export function parseGameHash(hash: string): GameRoute {
  return parseRoute(hash) as GameRoute;
}

export function resultHash(id: DessertId): string {
  return shareHash(id);
}

export function getQuestions(lang: Language): GameQuestion[] {
  return canonicalQuestions.map((question) => ({
    ...question,
    title: lang === "en" ? englishQuestions[question.id].title : question.title,
    options: question.options.map((option) => ({
      ...option,
      ...(option.affinity ? { affinity: [...option.affinity] } : {}),
      text: lang === "en" ? englishQuestions[question.id].options[option.id] : option.text,
    })),
  }));
}

export function getCharacter(id: DessertId, lang: Language): CharacterData {
  const character = canonicalCharacters[id];
  const localized = lang === "en" ? { ...character, ...englishCharacters[id] } : character;
  return {
    ...localized,
    traits: [...localized.traits],
    features: [...localized.features],
    image: assetUrl(character.image),
    photo: assetUrl(character.photo),
  };
}

export function getMoments(id: DessertId, lang: Language): MomentData[] {
  return canonicalMoments[id].map((moment, index) => ({
    ...moment,
    ...(lang === "en" ? englishSituations[id][index] : {}),
    image: assetUrl(moment.image),
  }));
}

export function getMenuProfile(id: DessertId, lang: Language): MenuProfile {
  const profile = canonicalProfiles[id];
  const localized = lang === "en" ? { ...profile, ...englishMenuProfiles[id] } : profile;
  return {
    ...localized,
    tags: [...localized.tags],
    texture: [...profile.texture],
    flavor: [...profile.flavor],
    enjoyment: [...profile.enjoyment],
    reasons: { ...localized.reasons },
  };
}

function localizedAnswer(question: string, answer: string) {
  const sourceQuestion = canonicalQuestions.find((entry) => entry.title === question)!;
  const sourceAnswer = sourceQuestion.options.find((option) => option.text === answer)!;
  return {
    question: englishQuestions[sourceQuestion.id].title,
    answer: englishQuestions[sourceQuestion.id].options[sourceAnswer.id],
    answerId: sourceAnswer.id,
  };
}

export function getEvidence(
  answers: readonly (string | null)[],
  id: DessertId,
  lang: Language,
): EvidenceFact[] {
  const facts = evidence(answers, id) as EvidenceFact[];
  return lang === "ko" ? facts : facts.map((fact) => {
    const translated = localizedAnswer(fact.question, fact.answer);
    return { ...fact, question: translated.question, answer: translated.answer };
  });
}

export function getTasteFacts(
  answers: readonly (string | null)[],
  id: DessertId,
  lang: Language,
): TasteFacts {
  const facts = tasteEvidence(answers, id) as TasteFacts;
  if (lang === "ko") return facts;
  const translate = (fact: TasteFact): TasteFact => {
    const translated = localizedAnswer(fact.question, fact.answer);
    return {
      ...fact,
      question: translated.question,
      answer: translated.answer,
      ...(fact.reason ? { reason: englishTasteReasons(id, fact.dimension, translated.answerId) } : {}),
    };
  };
  return {
    matched: facts.matched.map((fact) => translate(fact) as TasteFact & { reason: string }),
    different: facts.different.map(translate),
    neutral: facts.neutral.map(translate),
  };
}
