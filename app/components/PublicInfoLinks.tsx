import {
  getApprovedPublicPolicies,
  publicInfoPath,
  publicPolicyPath,
  publicPolicyTitle,
  type PublicLanguage,
  type PublicPolicyKind,
} from "@/lib/public-info/policies";

const FOOTER_POLICY_ORDER: PublicPolicyKind[] = ["privacy", "terms", "refund"];

/** Plain links are rendered during SSR; no order/cart/DB client is used here. */
export default function PublicInfoLinks({ lang = "ko", className = "", openInNewTab = false }: {
  lang?: PublicLanguage;
  className?: string;
  openInNewTab?: boolean;
}) {
  const approved = getApprovedPublicPolicies();
  return (
    <nav aria-label={lang === "ko" ? "상품·정책 안내" : "Products and policies"}
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${className}`}>
      <a href={publicInfoPath("/menu/prices", lang)} target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined} className="underline underline-offset-4">
        {lang === "ko" ? "상품·가격 안내" : "Products and prices"}
      </a>
      <a href={publicInfoPath("/menu/details", lang)} target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined} className="underline underline-offset-4">
        {lang === "ko" ? "상품정보" : "Product details"}
      </a>
      {approved && FOOTER_POLICY_ORDER.map((kind) => (
        <a key={kind} href={publicPolicyPath(kind, lang)} target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className={`underline underline-offset-4 ${kind === "privacy" ? "font-bold" : ""}`}>
          {publicPolicyTitle(kind, lang)}
        </a>
      ))}
    </nav>
  );
}
