import type { ReactNode } from "react";
import { publicInfoPath, publicPolicyTitle, type PublicLanguage, type PublicPolicyKind } from "@/lib/public-info/policies";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index} className="font-semibold text-black">{part.slice(2, -2)}</strong>;
    const link = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/.exec(part);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-caramel underline underline-offset-4">{link[1]}</a>;
    return part;
  });
}

function policyBlocks(source: string, lang: PublicLanguage): ReactNode[] {
  const lines = source.split("\n"), result: ReactNode[] = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line || /^---+$/.test(line)) { index++; continue; }
    if (line.startsWith("### ")) {
      result.push(<h2 key={index} className="mt-12 border-b border-caramel/20 pb-4 font-serif text-xl font-bold leading-relaxed text-caramel">{inline(line.slice(4))}</h2>); index++; continue;
    }
    if (line.startsWith("|")) {
      const key = index, rows: string[][] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        const cells = lines[index].trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim());
        if (!cells.every(cell => /^:?-+:?$/.test(cell))) rows.push(cells);
        index++;
      }
      result.push(<div key={key} className="my-6 max-w-full overflow-x-auto" role="region" aria-label={lang === "ko" ? "정책 표" : "Policy table"} tabIndex={0}>
        <table className="w-full min-w-[560px] border-collapse text-left text-sm leading-7">
          <thead><tr>{rows[0]?.map((cell, column) => <th key={column} className="border-b-2 border-caramel/30 px-4 py-4 font-semibold text-caramel">{inline(cell)}</th>)}</tr></thead>
          <tbody>{rows.slice(1).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, column) => <td key={column} className="border-b border-caramel/15 px-4 py-4 align-top">{inline(cell)}</td>)}</tr>)}</tbody>
        </table>
      </div>); continue;
    }
    if (/^[-*] /.test(line)) {
      const key = index, items = [];
      while (index < lines.length && /^[-*] /.test(lines[index].trim())) { items.push(lines[index].trim().slice(2)); index++; }
      result.push(<ul key={key} className="my-6 list-disc space-y-2 pl-5">{items.map((item, i) => <li key={i}>{inline(item)}</li>)}</ul>); continue;
    }
    const key = index, paragraph = [];
    while (index < lines.length && lines[index].trim() && !/^(### |\||[-*] )/.test(lines[index].trim())) { paragraph.push(lines[index].trim()); index++; }
    result.push(<p key={key} className="my-6">{inline(paragraph.join(" "))}</p>);
  }
  return result;
}

export default function PolicyDocument({ kind, lang, source, effectiveDate, disclosure, children }: {
  kind: PublicPolicyKind;
  lang: PublicLanguage;
  source: string;
  effectiveDate?: string;
  disclosure?: string;
  children?: ReactNode;
}) {
  const english = lang === "en";
  return <main lang={lang} className="min-h-screen bg-[#FAF7F2] px-6 pb-20 pt-[100px] text-black md:px-12 md:pb-28 md:pt-[140px]">
    <div className="mx-auto max-w-6xl">
      <header className="text-center">
        {!effectiveDate && <p data-policy-review-status="unapproved" className="mb-4 font-sans text-xs tracking-widest text-caramel uppercase">{english ? "Local review · not in effect" : "로컬 검토본 · 미시행"}</p>}
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-[-0.02em]">{publicPolicyTitle(kind, lang)}</h1>
        {effectiveDate && <p className="mt-4 text-sm text-caramel">
          {english ? "Effective date " : "시행일 "}<time dateTime={effectiveDate}>{effectiveDate}</time>
        </p>}
      </header>
      <article data-policy-draft={effectiveDate ? undefined : kind} data-policy-language={lang} className="mx-auto mt-12 max-w-3xl font-sans text-sm leading-8 text-black/75 [overflow-wrap:anywhere] md:mt-16 md:text-base">
        {policyBlocks(source, lang)}
        {disclosure && <section className="mt-12 border-t border-caramel/20 pt-6">
          <h2 className="font-serif text-xl font-bold text-caramel">{english ? "Outsourcing and overseas processing" : "처리위탁 및 국외이전"}</h2>
          {policyBlocks(disclosure, lang)}
        </section>}
        {children}
      </article>
      <div className="mt-16 text-center">
        <a href={publicInfoPath("/menu", lang)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-caramel px-8 py-3.5 font-sans text-sm tracking-widest text-white transition-colors hover:bg-[#0D3224]">{english ? "Photo menu" : "사진 메뉴 보기"}</a>
      </div>
    </div>
  </main>;
}
