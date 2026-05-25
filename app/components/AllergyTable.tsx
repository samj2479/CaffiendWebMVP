"use client";
import { useState, useEffect, useRef } from "react";
import { useT } from "../i18n/useT";

type Row = { name: string; nameEn: string; e:boolean; m:boolean; s:boolean; p:boolean; w:boolean; pe:boolean; bs:boolean; c:boolean; to:boolean };
type Category = { ko:string; en:string; items:Row[] };

const data: Category[] = [
  {
    ko:"수플레", en:"Soufflé",
    items:[
      {name:"초코 수플레",          nameEn:"Chocolate Soufflé",           e:true,  m:true,  s:false, p:false, w:true,  pe:false, bs:false, c:false, to:false},
      {name:"크림브륄레 수플레",    nameEn:"Crème Brûlée Soufflé",        e:true,  m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"로투스 수플레",        nameEn:"Lotus Soufflé",               e:true,  m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"인절미 수플레",        nameEn:"Injeolmi Soufflé",            e:true,  m:true,  s:true,  p:false, w:true,  pe:false, bs:false, c:false, to:false},
      {name:"돼지바 수플레",        nameEn:"Chocolate Crunch Soufflé",    e:true,  m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"밤 수플레",            nameEn:"Chestnut Soufflé",            e:true,  m:true,  s:false, p:false, w:false, pe:false, bs:false, c:true,  to:false},
      {name:"흑임자 수플레",        nameEn:"Black Sesame Soufflé",        e:true,  m:true,  s:false, p:false, w:false, pe:false, bs:true,  c:false, to:false},
      {name:"딸기 수플레",          nameEn:"Strawberry Soufflé",          e:true,  m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"복숭아 수플레",        nameEn:"Peach Soufflé",               e:true,  m:true,  s:false, p:false, w:false, pe:true,  bs:false, c:false, to:false},
      {name:"무화과 수플레",        nameEn:"Fig Soufflé",                 e:true,  m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"두바이 수플레",        nameEn:"Dubai Soufflé",               e:true,  m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
    ],
  },
  {
    ko:"빙수", en:"Bingsu",
    items:[
      {name:"인절미 팥빙수",        nameEn:"Injeolmi Red Bean Bingsu",    e:false, m:true,  s:true,  p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"오레오초코 빙수",      nameEn:"Oreo Chocolate Bingsu",       e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"로투스커피 빙수",      nameEn:"Lotus Coffee Bingsu",         e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"망고 빙수",            nameEn:"Mango Bingsu",                e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"흑임자 빙수",          nameEn:"Black Sesame Bingsu",         e:false, m:true,  s:false, p:false, w:false, pe:false, bs:true,  c:false, to:false},
      {name:"오디 빙수",            nameEn:"Mulberry Bingsu",             e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"딸기 빙수",            nameEn:"Strawberry Bingsu",           e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"복숭아 빙수",          nameEn:"Peach Bingsu",                e:false, m:true,  s:false, p:false, w:false, pe:true,  bs:false, c:false, to:false},
      {name:"꿀자몽 빙수",          nameEn:"Honey Grapefruit Bingsu",     e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"밤 빙수",              nameEn:"Chestnut Bingsu",             e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:true,  to:false},
      {name:"말차 빙수",            nameEn:"Matcha Bingsu",               e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"무화과 빙수",          nameEn:"Fig Bingsu",                  e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"두바이 빙수",          nameEn:"Dubai Bingsu",                e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
    ],
  },
  {
    ko:"간편 디저트", en:"Simple Desserts",
    items:[
      {name:"미니 쫀득쿠키",        nameEn:"Mini Chewy Cookie",           e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"티라미수 볼 (코코아)", nameEn:"Tiramisu Ball (Cocoa)",        e:true,  m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"티라미수 볼 (말차)",   nameEn:"Tiramisu Ball (Matcha)",       e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"티라미수 볼 (인절미)", nameEn:"Tiramisu Ball (Injeolmi)",     e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"티라미수 볼 (로투스)", nameEn:"Tiramisu Ball (Lotus)",        e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"1인 티라미수",         nameEn:"Single Tiramisu",             e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"말렌카 (코코아)",      nameEn:"Medovik (Cocoa)",              e:true,  m:true,  s:false, p:false, w:true,  pe:false, bs:false, c:false, to:false},
      {name:"말렌카 (월넛)",        nameEn:"Medovik (Walnut)",             e:true,  m:true,  s:false, p:false, w:true,  pe:false, bs:false, c:false, to:false},
      {name:"3~4인 티라미수",       nameEn:"Tiramisu for 3–4",            e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
    ],
  },
  {
    ko:"드립 / 더치", en:"Drip / Dutch",
    items:[
      {name:"핸드드립 케냐 AA",     nameEn:"Hand Drip Kenya AA",          e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"콜드브루 아이스",      nameEn:"Cold Brew Ice",               e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"콜드브루 라떼",        nameEn:"Cold Brew Latte",             e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
    ],
  },
  {
    ko:"커피", en:"Coffee",
    items:[
      {name:"에스프레소",           nameEn:"Espresso",                    e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"에소 콘파냐",          nameEn:"Espresso con Panna",          e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"패션후르츠 콘파냐",    nameEn:"Passion Fruit con Panna",     e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"아메리카노",           nameEn:"Americano",                   e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"헤이즐넛 아메리카노",  nameEn:"Hazelnut Americano",          e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"꿀 아메리카노",        nameEn:"Honey Americano",             e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"사케라또",             nameEn:"Shakerato",                   e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"카페라떼",             nameEn:"Café Latte",                  e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"퐁실 카푸치노",        nameEn:"Fluffy Cappuccino",           e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"바닐라말차샷",         nameEn:"Vanilla Matcha Shot",         e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"아가베라떼",           nameEn:"Agave Latte",                 e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"바닐라빈라떼",         nameEn:"Vanilla Bean Latte",          e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"돌체라떼",             nameEn:"Dolce Latte",                 e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"카라멜마끼야또",       nameEn:"Caramel Macchiato",           e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"카페모카",             nameEn:"Café Mocha",                  e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
    ],
  },
  {
    ko:"논커피 라떼", en:"Non-Coffee Latte",
    items:[
      {name:"벚꽃 슈크림 라떼",     nameEn:"Cherry Blossom Cream Latte",       e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"망고 말차 라떼",       nameEn:"Mango Matcha Latte",               e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"산타 메리",            nameEn:"Santa Mary",                       e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"고구마 크림브륄레 라떼",nameEn:"Sweet Potato Crème Brûlée Latte", e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"오미자 라떼",          nameEn:"Omija Latte",                      e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"말차 숲라떼",          nameEn:"Matcha Forest Latte",              e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"고구마라떼",           nameEn:"Sweet Potato Latte",               e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"로얄밀크티",           nameEn:"Royal Milk Tea",                   e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"수제초코라떼",         nameEn:"Homemade Chocolate Latte",         e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"딸기라떼",             nameEn:"Strawberry Latte",                 e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"흑말 라떼",            nameEn:"Black Sesame Matcha Latte",        e:false, m:true,  s:false, p:false, w:false, pe:false, bs:true,  c:false, to:false},
      {name:"초코크림딸기라떼",     nameEn:"Chocolate Cream Strawberry Latte", e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"인절미말차라떼",       nameEn:"Injeolmi Matcha Latte",            e:false, m:true,  s:true,  p:false, w:false, pe:false, bs:false, c:false, to:false},
    ],
  },
  {
    ko:"아인슈페너 / 아포가토", en:"Einspänner / Affogato",
    items:[
      {name:"아인슈페너",           nameEn:"Einspänner",                  e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"로투스 카라멜라떼",    nameEn:"Lotus Caramel Latte",         e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"헤이즐토피넛라떼",     nameEn:"Hazel Toffee Nut Latte",      e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"옥수수슈페너",         nameEn:"Corn Einspänner",             e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"얼그레이 바닐라티라떼",nameEn:"Earl Grey Vanilla Tea Latte", e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"런던포그",             nameEn:"London Fog",                  e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"흑임자 슈페너",        nameEn:"Black Sesame Einspänner",     e:false, m:true,  s:false, p:false, w:false, pe:false, bs:true,  c:false, to:false},
      {name:"에쏘 아포가토",        nameEn:"Espresso Affogato",           e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"숲 아포가토",          nameEn:"Forest Affogato",             e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"흑임자 아포가토",      nameEn:"Black Sesame Affogato",       e:false, m:true,  s:false, p:false, w:false, pe:false, bs:true,  c:false, to:false},
    ],
  },
  {
    ko:"티", en:"Tea",
    items:[
      {name:"청귤티",               nameEn:"Green Tangerine Tea",         e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"오미자 티",            nameEn:"Omija Tea",                   e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"허브티",               nameEn:"Herb Tea",                    e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"아이스티",             nameEn:"Iced Tea",                    e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"꿀생강차",             nameEn:"Honey Ginger Tea",            e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"레몬생강차",           nameEn:"Lemon Ginger Tea",            e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"유자차",               nameEn:"Yuzu Tea",                    e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"꿀대추차",             nameEn:"Honey Jujube Tea",            e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"레몬티",               nameEn:"Lemon Tea",                   e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"애플유자티",           nameEn:"Apple Yuzu Tea",              e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"허니자몽블랙티",       nameEn:"Honey Grapefruit Black Tea",  e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"허니딸기블랙티",       nameEn:"Honey Strawberry Black Tea",  e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
    ],
  },
  {
    ko:"에이드", en:"Ade",
    items:[
      {name:"스프링 블라썸 에이드", nameEn:"Spring Blossom Ade",          e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"청귤에이드",           nameEn:"Green Tangerine Ade",         e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"오미자 에이드",        nameEn:"Omija Ade",                   e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"자몽에이드",           nameEn:"Grapefruit Ade",              e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"레몬 에이드",          nameEn:"Lemon Ade",                   e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"패션후르츠 에이드",    nameEn:"Passion Fruit Ade",           e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"얼그레이유자 에이드",  nameEn:"Earl Grey Yuzu Ade",          e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"바질토마토 에이드",    nameEn:"Basil Tomato Ade",            e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:true },
    ],
  },
  {
    ko:"스무디", en:"Smoothie",
    items:[
      {name:"미숫가루",             nameEn:"Misugaru",                         e:false, m:true,  s:false, p:false, w:true,  pe:false, bs:false, c:false, to:false},
      {name:"냉귀리 쉐이크",        nameEn:"Cold Oat Shake",                   e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"그릭요거드 (그래놀라)",nameEn:"Greek Yogurt (Granola)",            e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"그릭요거드 (딸기)",    nameEn:"Greek Yogurt (Strawberry)",         e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"그릭요거드 (블루베리)",nameEn:"Greek Yogurt (Blueberry)",          e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"그릭요거드 (망고)",    nameEn:"Greek Yogurt (Mango)",              e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"배 스무디",            nameEn:"Pear Smoothie",                    e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
      {name:"유자 스무디",          nameEn:"Yuzu Smoothie",                    e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
    ],
  },
];

const COLS: { key: keyof Omit<Row,"name"|"nameEn">; ko: string; en: string }[] = [
  { key:"e",  ko:"계란",  en:"Egg"          },
  { key:"m",  ko:"우유",  en:"Milk"         },
  { key:"s",  ko:"대두",  en:"Soy"          },
  { key:"p",  ko:"땅콩",  en:"Peanut"       },
  { key:"w",  ko:"밀",    en:"Wheat"        },
  { key:"pe", ko:"복숭아",en:"Peach"        },
  { key:"bs", ko:"흑임자",en:"Black Sesame" },
  { key:"c",  ko:"밤",    en:"Chestnut"     },
  { key:"to", ko:"토마토",en:"Tomato"       },
];

function Dot({ on }: { on: boolean }) {
  return on ? (
    <span style={{
      display:"inline-block", width:14, height:14, borderRadius:"50%",
      background:"#174C35", flexShrink:0,
    }}/>
  ) : null;
}

export default function AllergyTable() {
  const t = useT();
  const [query, setQuery] = useState("");
  const firstMatchRef = useRef<HTMLTableRowElement | null>(null);
  const scrollBoxRef = useRef<HTMLDivElement | null>(null);

  const trimmed = query.trim().toLowerCase();
  const isMatch = (item: Row) =>
    trimmed !== "" &&
    (item.name.toLowerCase().includes(trimmed) || item.nameEn.toLowerCase().includes(trimmed));

  useEffect(() => {
    if (trimmed && firstMatchRef.current && scrollBoxRef.current) {
      const box = scrollBoxRef.current;
      const row = firstMatchRef.current;
      box.scrollTop = row.offsetTop - box.offsetTop;
    }
  }, [trimmed]);

  return (
    <div className="w-full">
      {/* Legend + Search row */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <span className="flex items-center gap-2 text-sm text-black/60">
          <span style={{ display:"inline-block", width:14, height:14, borderRadius:"50%", background:"#174C35" }}/>
          {t("포함", "Contains")}
        </span>
        <div style={{ position:"relative" }}>
          <span style={{
            position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
            pointerEvents:"none", color:"#9CA3AF",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t("메뉴 검색...", "Search menu...")}
            style={{
              paddingLeft:36, paddingRight:12, paddingTop:8, paddingBottom:8,
              border:"1px solid #d1d5db", borderRadius:8, fontSize:14,
              outline:"none", width:200, background:"#fff", color:"#111",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:16, lineHeight:1,
              }}
              aria-label="clear"
            >×</button>
          )}
        </div>
      </div>

      {/* Table — scrollable box */}
      <div ref={scrollBoxRef} className="w-full rounded-xl border border-black/10 shadow-sm" style={{ overflowX:"auto", overflowY:"auto", maxHeight:"70vh" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:680 }}>
          {/* Header */}
          <thead>
            <tr style={{ background:"#174C35" }}>
              <th style={{ position:"sticky", top:0, left:0, zIndex:4, padding:"14px 18px", textAlign:"left", color:"#fff", fontWeight:700, fontSize:15, whiteSpace:"nowrap", borderRight:"1px solid rgba(255,255,255,0.15)", background:"#174C35" }}>
                {t("메뉴", "Menu")}
              </th>
              {COLS.map(col => (
                <th key={col.key} style={{ position:"sticky", top:0, zIndex:2, padding:"14px 12px", textAlign:"center", color:"#fff", fontWeight:600, fontSize:14, whiteSpace:"nowrap", borderRight:"1px solid rgba(255,255,255,0.15)", minWidth:72, background:"#174C35" }}>
                  {t(col.ko, col.en)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {(() => {
              let firstAssigned = false;
              return data.map((cat, ci) => (
              <>
                {/* Category row */}
                <tr key={`cat-${ci}`} style={{ background:"#E8F4EF" }}>
                  <td
                    colSpan={10}
                    style={{ position:"sticky", left:0, padding:"10px 18px", fontWeight:700, fontSize:14, color:"#174C35", borderTop:"1px solid #d0e8df", background:"#E8F4EF", zIndex:1 }}
                  >
                    {t(cat.ko, cat.en)}
                  </td>
                </tr>

                {/* Item rows */}
                {cat.items.map((item, ii) => {
                  const matched = isMatch(item);
                  const isFirst = matched && !firstAssigned;
                  if (isFirst) firstAssigned = true;
                  const rowBg = matched ? "#FFF9C4" : ii % 2 === 0 ? "#fff" : "#F8FAF9";
                  return (
                    <tr
                      key={`${ci}-${ii}`}
                      ref={isFirst ? firstMatchRef : undefined}
                      style={{
                        background: rowBg,
                        borderTop:"1px solid #eef2f0",
                        outline: matched ? "2px solid #D4A017" : "none",
                        outlineOffset: matched ? "-2px" : undefined,
                      }}
                    >
                      <td style={{ position:"sticky", left:0, zIndex:1, padding:"12px 18px", fontSize:15, color: matched ? "#7A5800" : "#111", whiteSpace:"nowrap", borderRight:"1px solid #eef2f0", fontWeight: matched ? 700 : 500, background: rowBg }}>
                        {t(item.name, item.nameEn)}
                      </td>
                      {COLS.map(col => (
                        <td key={col.key} style={{ padding:"12px 8px", textAlign:"center", borderRight:"1px solid #eef2f0" }}>
                          <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
                            <Dot on={item[col.key] as boolean} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </>
            ));
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
