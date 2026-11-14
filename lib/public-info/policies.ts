import "server-only";
import configuredPolicies from "./approved-policies.json";

export type PublicLanguage = "ko" | "en";
export type PublicPolicyKind = "terms" | "privacy" | "refund";
type Localized = Record<PublicLanguage, string>;
type Review = { approvedAt: string; approvedBy: string; reference: string };
type Policy = { ko: string[]; en: string[]; effectiveDate: string; review: Review };

export interface ApprovedPublicPolicies {
  schemaVersion: 1;
  status: "approved";
  review: Review;
  business: {
    name: Localized;
    representative: Localized;
    registrationNumber: string;
    address: Localized;
    phone: string;
    email: string;
    inquiryContact: Localized;
  };
  processingDisclosure: Localized;
  policies: Record<PublicPolicyKind, Policy>;
}

export const PUBLIC_POLICY_KINDS: readonly PublicPolicyKind[] = ["terms", "privacy", "refund"];
export const PUBLIC_BUSINESS_EMAIL = "caffiendowner1@gmail.com";

const TITLES: Record<PublicPolicyKind, Localized> = {
  terms: { ko: "이용약관", en: "Terms of Use" },
  privacy: { ko: "개인정보처리방침", en: "Privacy Policy" },
  refund: { ko: "취소·환불 및 상품 제공 안내", en: "Cancellation, Refunds and Service" },
};

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function confirmedText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 30000 &&
    !/(?:\b(?:TODO|TBD|PENDING|PLACEHOLDER)\b|미확정|확인\s*필요|승인\s*대기|임시\s*문구|내부\s*작업\s*안내|\[\s*INTERNAL\b|\[\[|\[.+\])/i.test(value);
}

function localized(value: unknown): value is Localized {
  return record(value) && confirmedText(value.ko) && confirmedText(value.en);
}

function date(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function review(value: unknown): value is Review {
  return record(value) && date(value.approvedAt) && confirmedText(value.approvedBy) &&
    confirmedText(value.reference);
}

function paragraphs(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.length <= 100 && value.every(confirmedText);
}

/** A complete approved public information set is required. Draft text lives only in docs. */
export function getApprovedPublicPolicies(value: unknown = configuredPolicies): ApprovedPublicPolicies | null {
  if (!record(value) || value.schemaVersion !== 1 || value.status !== "approved" || !review(value.review)) return null;
  const business = value.business;
  if (!record(business) || !localized(business.name) || !localized(business.representative) ||
    !localized(business.address) || !localized(business.inquiryContact) ||
    typeof business.registrationNumber !== "string" ||
    !/^\d{3}-?\d{2}-?\d{5}$/.test(business.registrationNumber) ||
    typeof business.phone !== "string" || !/^[+\d][\d\s()-]{6,24}$/.test(business.phone)) return null;
  if (!confirmedText(business.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email)) return null;
  if (!localized(value.processingDisclosure)) return null;
  if (!record(value.policies)) return null;
  for (const kind of PUBLIC_POLICY_KINDS) {
    const policy = value.policies[kind];
    if (!record(policy) || !paragraphs(policy.ko) || !paragraphs(policy.en) ||
      !date(policy.effectiveDate) || !review(policy.review)) return null;
  }
  // These attestations are explicit content approval records, not proof of a PG/contract approval.
  return value as unknown as ApprovedPublicPolicies;
}

export function publicPolicyTitle(kind: PublicPolicyKind, lang: PublicLanguage): string {
  return TITLES[kind][lang];
}

export function publicInfoPath(path: string, lang: PublicLanguage): string {
  return `${lang === "en" ? "/en" : ""}${path}`;
}

export function publicPolicyPath(kind: PublicPolicyKind, lang: PublicLanguage): string {
  return publicInfoPath(`/policies/${kind === "refund" ? "refunds" : kind}`, lang);
}
