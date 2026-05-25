export type AllergyRow = {
  name: string; nameEn: string;
  e:boolean; m:boolean; s:boolean; p:boolean; w:boolean; pe:boolean; bs:boolean; c:boolean; to:boolean;
};

export type AllergyColKey = keyof Omit<AllergyRow, "name" | "nameEn">;

export const allergyCols: { key: AllergyColKey; ko: string; en: string }[] = [
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

export const allergyFlatRows: AllergyRow[] = [
  // 수플레
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
  // 빙수
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
  // 간편 디저트
  {name:"미니 쫀득쿠키",        nameEn:"Mini Chewy Cookie",           e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"티라미수 볼 (코코아)", nameEn:"Tiramisu Ball (Cocoa)",        e:true,  m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"티라미수 볼 (말차)",   nameEn:"Tiramisu Ball (Matcha)",       e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"티라미수 볼 (인절미)", nameEn:"Tiramisu Ball (Injeolmi)",     e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"티라미수 볼 (로투스)", nameEn:"Tiramisu Ball (Lotus)",        e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"1인 티라미수",         nameEn:"Single Tiramisu",             e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"말렌카 (코코아)",      nameEn:"Medovik (Cocoa)",              e:true,  m:true,  s:false, p:false, w:true,  pe:false, bs:false, c:false, to:false},
  {name:"말렌카 (월넛)",        nameEn:"Medovik (Walnut)",             e:true,  m:true,  s:false, p:false, w:true,  pe:false, bs:false, c:false, to:false},
  {name:"3~4인 티라미수",       nameEn:"Tiramisu for 3–4",            e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  // 드립/더치
  {name:"핸드드립 케냐 AA",     nameEn:"Hand Drip Kenya AA",          e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"콜드브루 아이스",      nameEn:"Cold Brew Ice",               e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"콜드브루 라떼",        nameEn:"Cold Brew Latte",             e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  // 커피
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
  // 논커피 라떼
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
  // 아인슈페너/아포가토
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
  // 티
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
  // 에이드
  {name:"스프링 블라썸 에이드", nameEn:"Spring Blossom Ade",          e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"청귤에이드",           nameEn:"Green Tangerine Ade",         e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"오미자 에이드",        nameEn:"Omija Ade",                   e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"자몽에이드",           nameEn:"Grapefruit Ade",              e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"레몬 에이드",          nameEn:"Lemon Ade",                   e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"패션후르츠 에이드",    nameEn:"Passion Fruit Ade",           e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"얼그레이유자 에이드",  nameEn:"Earl Grey Yuzu Ade",          e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"바질토마토 에이드",    nameEn:"Basil Tomato Ade",            e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:true },
  // 스무디
  {name:"미숫가루",             nameEn:"Misugaru",                    e:false, m:true,  s:false, p:false, w:true,  pe:false, bs:false, c:false, to:false},
  {name:"냉귀리 쉐이크",        nameEn:"Cold Oat Shake",              e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"그릭요거드 (그래놀라)",nameEn:"Greek Yogurt (Granola)",       e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"그릭요거드 (딸기)",    nameEn:"Greek Yogurt (Strawberry)",    e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"그릭요거드 (블루베리)",nameEn:"Greek Yogurt (Blueberry)",     e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"그릭요거드 (망고)",    nameEn:"Greek Yogurt (Mango)",         e:false, m:true,  s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"배 스무디",            nameEn:"Pear Smoothie",               e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
  {name:"유자 스무디",          nameEn:"Yuzu Smoothie",               e:false, m:false, s:false, p:false, w:false, pe:false, bs:false, c:false, to:false},
];

/** Returns allergen col keys for a given Korean menu name (handles combined items). */
export function getItemAllergenKeys(koName: string): AllergyColKey[] {
  const baseName = koName.split("(")[0].trim();
  const matching = allergyFlatRows.filter(row => {
    if (row.name === koName) return true;
    const rowBase = row.name.split("(")[0].trim();
    return rowBase === baseName;
  });
  const found = new Set<AllergyColKey>();
  matching.forEach(row => {
    allergyCols.forEach(col => { if (row[col.key]) found.add(col.key); });
  });
  return Array.from(found);
}
