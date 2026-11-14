import { notFound } from "next/navigation";
import {
  getApprovedPublicPolicies,
  type PublicLanguage,
  type PublicPolicyKind,
} from "@/lib/public-info/policies";
import PolicyDocument from "./PolicyDocument";

export default function PublicPolicyPage({ kind, lang }: { kind: PublicPolicyKind; lang: PublicLanguage }) {
  const content = getApprovedPublicPolicies();
  if (!content) notFound();
  const policy = content.policies[kind];
  const business = content.business;
  return (
    <PolicyDocument kind={kind} lang={lang} source={policy[lang].join("\n\n")}
      effectiveDate={policy.effectiveDate} disclosure={kind === "privacy" ? content.processingDisclosure[lang] : undefined}>
      <section className="my-12 border-y border-caramel/20 py-6 text-sm leading-7"
        aria-label={lang === "ko" ? "사업자 정보" : "Business information"}>
        <h2 className="mb-2 text-base font-semibold">{business.name[lang]}</h2>
        <p>{lang === "ko" ? "대표자 " : "Representative "}{business.representative[lang]}</p>
        <p>{lang === "ko" ? "사업자등록번호 " : "Business registration number "}{business.registrationNumber}</p>
        <p>{business.address[lang]}</p>
        <p>{lang === "ko" ? "전화 " : "Phone "}<a href={`tel:${business.phone}`}>{business.phone}</a></p>
        <p>{lang === "ko" ? "전자우편 " : "Email "}<a href={`mailto:${business.email}`} className="underline underline-offset-4">{business.email}</a></p>
        <p>{business.inquiryContact[lang]}</p>
      </section>
    </PolicyDocument>
  );
}
