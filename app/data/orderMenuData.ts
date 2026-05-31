// price: -1 = 변동 (variable / seasonal)
export interface MenuItem {
  ko: string;
  en: string;
  image: string;
  price: number;
  season?: boolean;
}

export interface OrderCategory {
  ko: string;
  en: string;
  emoji: string;
  items: MenuItem[];
}

const seasonItems: MenuItem[] = [
  { ko: "스프링 블라썸 에이드", en: "Spring Blossom Ade",                image: "/%EC%8A%A4%ED%94%84%EB%A7%81%20%EB%B8%94%EB%9D%BC%EC%8D%B8%20%EC%97%90%EC%9D%B4%EB%93%9C.png",       price: -1,   season: true },
  { ko: "벚꽃 슈크림 라떼",    en: "Cherry Blossom Cream Latte",          image: "/%EB%B2%9A%EA%BD%82%20%EC%8A%88%ED%81%AC%EB%A6%BC%20%EB%9D%BC%EB%96%BC.png",                            price: 5400, season: true },
  { ko: "망고 말차 라떼",      en: "Mango Matcha Latte",                  image: "/%EB%A7%9D%EA%B3%A0%EB%A7%90%EC%B0%A8%20%EB%9D%BC%EB%96%BC.png",                                         price: -1,   season: true },
  { ko: "산타 메리",           en: "Santa Mary",                          image: "/%EC%82%B0%ED%83%80%20%EB%A9%94%EB%A6%AC.png",                                                            price: -1,   season: true },
  { ko: "고구마 크림브륄레 라떼", en: "Sweet Potato Crème Brûlée Latte",  image: "/%ED%81%AC%EB%A6%BC%20%EB%B8%8C%EB%A5%84%EB%A0%88%20%EB%9D%BC%EB%96%BC.png",                           price: -1,   season: true },
  { ko: "청귤티",              en: "Green Tangerine Tea",                  image: "/%EC%B2%AD%EA%B7%A4%ED%8B%B0.png",                                                                       price: -1,   season: true },
  { ko: "청귤에이드",          en: "Green Tangerine Ade",                  image: "/%EC%B2%AD%EA%B7%A4%20%EC%97%90%EC%9D%B4%EB%93%9C.png",                                                 price: -1,   season: true },
  { ko: "오미자 티",           en: "Omija Tea",                           image: "/%EC%98%A4%EB%AF%B8%EC%9E%90%ED%8B%B0.png",                                                              price: 5300, season: true },
  { ko: "오미자 에이드",       en: "Omija Ade",                           image: "/%EC%98%A4%EB%AF%B8%EC%9E%90%EC%97%90%EC%9D%B4%EB%93%9C.png",                                           price: 5600, season: true },
  { ko: "오미자 라떼",         en: "Omija Latte",                         image: "/%EC%98%A4%EB%AF%B8%EC%9E%90%20%EB%9D%BC%EB%96%BC.png",                                                 price: 6000, season: true },
];

const soufleeItems: MenuItem[] = [
  { ko: "초코 수플레",         en: "Chocolate Soufflé",           image: "/%EC%B4%88%EC%BD%94%20%EC%88%98%ED%94%8C%EB%A0%88.png",              price: 13000 },
  { ko: "크림브륄레 수플레",  en: "Crème Brûlée Soufflé",        image: "/%ED%81%AC%EB%A6%BC%20%EB%B8%8C%EB%A5%84%EB%A0%88%20%EC%88%98%ED%94%8C%EB%A0%88.png", price: 13000 },
  { ko: "로투스 수플레",       en: "Lotus Soufflé",               image: "/%EB%A1%9C%ED%88%AC%EC%8A%A4%20%EC%88%98%ED%94%8C%EB%A0%88.png",     price: 13000 },
  { ko: "인절미 수플레",       en: "Injeolmi Soufflé",            image: "/%EC%9D%B8%EC%A0%88%EB%AF%B8%20%EC%88%98%ED%94%8C%EB%A0%88.png",     price: 14000 },
  { ko: "돼지바 수플레",       en: "Chocolate Crunch Soufflé",    image: "/%EB%8F%BC%EC%A7%80%EB%B0%94%20%EC%88%98%ED%94%8C%EB%A0%88.png",     price: 14500 },
  { ko: "밤 수플레",           en: "Chestnut Soufflé",            image: "/%EB%B0%A4%20%EC%88%98%ED%94%8C%EB%A0%88.png",                        price: 15000 },
  { ko: "흑임자 수플레",       en: "Black Sesame Soufflé",        image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EC%88%98%ED%94%8C%EB%A0%88.png",     price: 15000 },
  { ko: "딸기 수플레",         en: "Strawberry Soufflé",          image: "/%EB%94%B8%EA%B8%B0%20%EC%88%98%ED%94%8C%EB%A0%88.png",             price: 17000 },
  { ko: "복숭아 수플레",       en: "Peach Soufflé",               image: "/%EB%B3%B5%EC%88%AD%EC%95%84%20%EC%88%98%ED%94%8C%EB%A0%88.png",    price: 17000 },
  { ko: "무화과 수플레",       en: "Fig Soufflé",                 image: "/%EB%AC%B4%ED%99%94%EA%B3%BC%20%EC%88%98%ED%94%8C%EB%A0%88.png",    price: 17000 },
  { ko: "두바이 수플레",       en: "Dubai Soufflé",               image: "/%EB%91%90%EB%B0%94%EC%9D%B4%20%EC%88%98%ED%94%8C%EB%A0%88.png",    price: 21000 },
];

const bingsuItems: MenuItem[] = [
  { ko: "인절미 팥빙수",       en: "Injeolmi Red Bean Bingsu",    image: "/%EC%9D%B8%EC%A0%88%EB%AF%B8%20%EB%B9%99%EC%88%98.png",             price: 14000 },
  { ko: "오레오초코 빙수",     en: "Oreo Chocolate Bingsu",       image: "/%EC%98%A4%EB%A0%88%EC%98%A4%20%EB%B9%99%EC%88%98.png",             price: 15000 },
  { ko: "로투스커피 빙수",     en: "Lotus Coffee Bingsu",         image: "/%EB%A1%9C%ED%88%AC%EC%8A%A4%20%EB%B9%99%EC%88%98.png",             price: 15500 },
  { ko: "망고 빙수",           en: "Mango Bingsu",                image: "/%EB%A7%9D%EA%B3%A0%20%EB%B9%99%EC%88%98.png",                        price: 16000 },
  { ko: "흑임자 빙수",         en: "Black Sesame Bingsu",         image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EB%B9%99%EC%88%98.png",             price: 17000 },
  { ko: "오디 빙수",           en: "Mulberry Bingsu",             image: "/%EC%98%A4%EB%94%94%20%EB%B9%99%EC%88%98.png",                        price: 17000 },
  { ko: "딸기 빙수",           en: "Strawberry Bingsu",           image: "/%EB%94%B8%EA%B8%B0%20%EB%B9%99%EC%88%98.png",                        price: 17000 },
  { ko: "복숭아 빙수",         en: "Peach Bingsu",                image: "/%EB%B3%B5%EC%88%AD%EC%95%84%20%EB%B9%99%EC%88%98.png",             price: 17000 },
  { ko: "꿀자몽 빙수",         en: "Honey Grapefruit Bingsu",     image: "/%EC%9E%90%EB%AA%BD%20%EB%B9%99%EC%88%98.png",                        price: 18000 },
  { ko: "밤 빙수",             en: "Chestnut Bingsu",             image: "/%EB%B0%A4%20%EB%B9%99%EC%88%98.png",                                 price: 17000 },
  { ko: "말차 빙수",           en: "Matcha Bingsu",               image: "/%EB%A7%90%EC%B0%A8%20%EB%B9%99%EC%88%98.png",                        price: 18000 },
  { ko: "무화과 빙수",         en: "Fig Bingsu",                  image: "/%EB%AC%B4%ED%99%94%EA%B3%BC%20%EB%B9%99%EC%88%98.png",             price: 17000 },
  { ko: "두바이 빙수",         en: "Dubai Bingsu",                image: "/%EB%91%90%EB%B0%94%EC%9D%B4%20%EB%B9%99%EC%88%98.png",             price: 20000 },
];

const lightDessertItems: MenuItem[] = [
  { ko: "미니 쫀득쿠키",                       en: "Mini Chewy Cookie",                                image: "/%EB%AF%B8%EB%8B%88%20%EC%AB%80%EB%93%9D%EC%BF%A0%ED%82%A4.png",                                                                     price: 2000 },
  { ko: "티라미수 볼 (코코아/말차/인절미/로투스)", en: "Tiramisu Ball (Cocoa/Matcha/Injeolmi/Lotus)",   image: "/%ED%8B%B0%EB%9D%BC%EB%AF%B8%EC%88%98%EB%B3%BC(%EC%BD%94%EC%BD%94%EC%95%84%20%EB%A7%90%EC%B0%A8%20%EC%9D%B8%EC%A0%88%EB%AF%B8%20%EB%A1%9C%ED%88%AC%EC%8A%A4).png", price: 3500 },
  { ko: "1인 티라미수",                         en: "Single Tiramisu",                                  image: "/1%EC%9D%B8%20%ED%8B%B0%EB%9D%BC%EB%AF%B8%EC%88%98.png",                                                                             price: 4500 },
  { ko: "말렌카 (코코아/월넛)",                 en: "Medovik (Cocoa/Walnut)",                           image: "/%EB%A7%90%EB%A0%8C%EC%B9%B4(%EC%BD%94%EC%BD%94%EC%95%84%20%EC%9B%94%EB%84%9B).png",                                                  price: 6000 },
  { ko: "3~4인 티라미수",                       en: "Tiramisu for 3–4",                                 image: "/3%204%EC%9D%B8%20%ED%8B%B0%EB%9D%BC%EB%AF%B8%EC%88%98.png",                                                                         price: 8000 },
];

const dripItems: MenuItem[] = [
  { ko: "핸드드립 케냐 AA",   en: "Hand Drip Kenya AA",  image: "/%ED%95%B8%EB%93%9C%EB%93%9C%EB%A6%BD%20%EC%BC%80%EB%83%90%20AAA.png",   price: 6000 },
  { ko: "콜드브루 아이스",    en: "Cold Brew Ice",        image: "/%EC%BD%9C%EB%93%9C%EB%B8%8C%EB%A3%A8%20%EC%95%84%EC%9D%B4%EC%8A%A4.png", price: 6000 },
  { ko: "콜드브루 라떼",      en: "Cold Brew Latte",      image: "/%EC%BD%9C%EB%93%9C%EB%B8%8C%EB%A3%A8%20%EB%9D%BC%EB%96%BC.png",         price: 6500 },
];

const coffeeItems: MenuItem[] = [
  { ko: "에스프레소",          en: "Espresso",                   image: "/%EC%97%90%EC%8A%A4%ED%94%84%EB%A0%88%EC%86%8C.png",           price: 3500 },
  { ko: "에소 콘파냐",         en: "Espresso con Panna",         image: "/%EC%97%90%EC%8F%98%20%EC%BD%98%ED%8C%8C%EB%83%90.png",        price: 3900 },
  { ko: "패션후르츠 콘파냐",   en: "Passion Fruit con Panna",    image: "/%ED%8C%A8%EC%85%98%ED%9B%84%EB%A5%B4%EC%B8%A0%20%EC%BD%98%ED%8C%8C%EB%83%90.png", price: 4000 },
  { ko: "아메리카노",          en: "Americano",                  image: "/%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8.png",           price: 4000 },
  { ko: "헤이즐넛 아메리카노", en: "Hazelnut Americano",         image: "/%ED%97%A4%EC%9D%B4%EC%A6%90%EB%84%9B%20%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8.png", price: 4500 },
  { ko: "꿀 아메리카노",       en: "Honey Americano",            image: "/%EA%BF%80%20%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8.png", price: 4500 },
  { ko: "사케라또",            en: "Shakerato",                  image: "/%EC%82%AC%EC%BC%80%EB%9D%BC%EB%98%90.png",                    price: 4800 },
  { ko: "카페라떼",            en: "Café Latte",                 image: "/%EC%B9%B4%ED%8E%98%20%EB%9D%BC%EB%96%BC.png",                 price: 4800 },
  { ko: "퐁실 카푸치노",       en: "Fluffy Cappuccino",          image: "/%ED%90%81%EC%8B%A4%20%EC%B9%B4%ED%91%B8%EC%B9%98%EB%85%B8.png", price: 4800 },
  { ko: "바닐라말차샷",        en: "Vanilla Matcha Shot",        image: "/%EB%B0%94%EB%8B%90%EB%9D%BC%20%EB%A7%90%EC%B0%A8%EC%83%B7.png", price: 5300 },
  { ko: "아가베라떼",          en: "Agave Latte",                image: "/%EB%B0%94%EB%8B%90%EB%9D%BC%EB%B9%88%20%EB%9D%BC%EB%96%BC.png", price: 5500 },
  { ko: "바닐라빈라떼",        en: "Vanilla Bean Latte",         image: "/%EB%B0%94%EB%8B%90%EB%9D%BC%EB%B9%88%20%EB%9D%BC%EB%96%BC.png", price: 5500 },
  { ko: "돌체라떼",            en: "Dolce Latte",                image: "/%EB%8F%8C%EC%B2%B4%20%EB%9D%BC%EB%96%BC.png",                 price: 5500 },
  { ko: "카라멜마끼야또",      en: "Caramel Macchiato",          image: "/%EC%B9%B4%EB%9D%BC%EB%A9%9C%EB%A7%88%EB%81%BC%EC%95%BC%EB%98%90.png", price: 5500 },
  { ko: "카페모카",            en: "Café Mocha",                 image: "/%EC%B9%B4%ED%8E%98%EB%AA%A8%EC%B9%B4.png",                   price: 5500 },
];

const nonCoffeeItems: MenuItem[] = [
  { ko: "말차 숲라떼",         en: "Matcha Forest Latte",                  image: "/%EB%A7%90%EC%B0%A8%20%EC%88%B2%20%EB%9D%BC%EB%96%BC.png",         price: 5000 },
  { ko: "고구마라떼",          en: "Sweet Potato Latte",                   image: "/%EA%B3%A0%EA%B5%AC%EB%A7%88%20%EB%9D%BC%EB%96%BC.png",             price: 5300 },
  { ko: "로얄밀크티",          en: "Royal Milk Tea",                       image: "/%EB%A1%9C%EC%96%84%20%EB%B0%80%ED%81%AC%ED%8B%B0.png",             price: 5300 },
  { ko: "수제초코라떼",        en: "Homemade Chocolate Latte",             image: "/%EC%88%98%EC%A0%9C%20%EC%B4%88%EC%BD%94%20%EB%9D%BC%EB%96%BC.png", price: 5300 },
  { ko: "딸기라떼",            en: "Strawberry Latte",                     image: "/%EB%94%B8%EA%B8%B0%EB%9D%BC%EB%96%BC.png",                         price: 5300 },
  { ko: "흑말 라떼",           en: "Black Sesame Matcha Latte",            image: "/%ED%9D%91%EB%A7%90%EB%9D%BC%EB%96%BC.png",                         price: 5300 },
  { ko: "초코크림딸기라떼",    en: "Chocolate Cream Strawberry Latte",     image: "/%EC%B4%88%EC%BD%94%ED%81%AC%EB%A6%BC%EB%94%B8%EA%B8%B0%EB%9D%BC%EB%96%BC.png", price: 5300 },
  { ko: "인절미말차라떼",      en: "Injeolmi Matcha Latte",                image: "/%EC%9D%B8%EC%A0%88%EB%AF%B8%EB%A7%90%EC%B0%A8%20%EB%9D%BC%EB%96%BC.png", price: 5500 },
];

const einItems: MenuItem[] = [
  { ko: "아인슈페너",          en: "Einspänner",                  image: "/%EC%95%84%EC%9D%B8%EC%8A%88%ED%8E%98%EB%84%88.png",           price: 5300 },
  { ko: "로투스 카라멜라떼",  en: "Lotus Caramel Latte",         image: "/%EB%A1%9C%ED%88%AC%EC%8A%A4%20%EC%B9%B4%EB%9D%BC%EB%A9%9C%20%EB%9D%BC%EB%96%BC.png", price: 5300 },
  { ko: "헤이즐토피넛라떼",   en: "Hazel Toffee Nut Latte",      image: "/%ED%97%A4%EC%9D%B4%EC%A6%90%ED%86%A0%ED%94%BC%EB%84%9B%20%EB%9D%BC%EB%96%BC.png", price: 5300 },
  { ko: "옥수수슈페너",        en: "Corn Einspänner",             image: "/%EC%98%A5%EC%88%98%EC%88%98%EC%8A%88%ED%8E%98%EB%84%88.png",   price: 5500 },
  { ko: "얼그레이 바닐라티라떼", en: "Earl Grey Vanilla Tea Latte", image: "/%EB%A1%9C%ED%88%AC%EC%8A%A4%EC%B9%B4%EB%9D%BC%EB%A9%9C%20%EB%9D%BC%EB%96%BC.png", price: 5500 },
  { ko: "런던포그",            en: "London Fog",                  image: "/%EB%9F%B0%EB%8D%98%ED%8F%AC%EA%B7%B8.png",                    price: 5500 },
  { ko: "흑임자 슈페너",       en: "Black Sesame Einspänner",     image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EC%8A%88%ED%8E%98%EB%84%88.png", price: 5700 },
  { ko: "에쏘 아포가토",       en: "Espresso Affogato",           image: "/%EC%97%90%EC%8F%98%20%EC%95%84%ED%8F%AC%EC%B9%B4%ED%86%A0.png", price: 5300 },
  { ko: "숲 아포가토",         en: "Forest Affogato",             image: "/%EC%88%B2%20%EC%95%84%ED%8F%AC%EC%B9%B4%ED%86%A0.png",        price: 5800 },
  { ko: "흑임자 아포가토",     en: "Black Sesame Affogato",       image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EC%95%84%ED%8F%AC%EC%B9%B4%ED%86%A0.png", price: 6000 },
];

const teaItems: MenuItem[] = [
  { ko: "허브티",              en: "Herb Tea",                    image: "/%ED%97%88%EB%B8%8C%ED%8B%B0%20.png",              price: 4000 },
  { ko: "아이스티",            en: "Iced Tea",                    image: "/%EC%95%84%EC%9D%B4%EC%8A%A4%ED%8B%B0.png",        price: 4000 },
  { ko: "꿀생강차",            en: "Honey Ginger Tea",            image: "/%EA%BF%80%EC%83%9D%EA%B0%95%EC%B0%A8.png",        price: 4300 },
  { ko: "레몬생강차",          en: "Lemon Ginger Tea",            image: "/%EB%A0%88%EB%AA%AC%EC%83%9D%EA%B0%95%EC%B0%A8.png", price: 4800 },
  { ko: "유자차",              en: "Yuzu Tea",                    image: "/%EC%9C%A0%EC%9E%90%EC%B0%A8.png",                 price: 4800 },
  { ko: "꿀대추차",            en: "Honey Jujube Tea",            image: "/%EA%BF%80%EB%8C%80%EC%B6%94%EC%B0%A8%20.png",     price: -1   },
  { ko: "레몬티",              en: "Lemon Tea",                   image: "/%EB%A0%88%EB%AA%AC%ED%8B%B0.png",                 price: 4800 },
  { ko: "애플유자티",          en: "Apple Yuzu Tea",              image: "/%EC%95%A0%ED%94%8C%EC%9C%A0%EC%9E%90%ED%8B%B0.png", price: 5000 },
  { ko: "허니자몽블랙티",      en: "Honey Grapefruit Black Tea",  image: "/%ED%97%88%EB%8B%88%EC%9E%90%EB%AA%BD%EB%B8%94%EB%9E%99%ED%8B%B0.png", price: 5500 },
  { ko: "허니딸기블랙티",      en: "Honey Strawberry Black Tea",  image: "/%ED%97%88%EB%8B%88%EB%94%B8%EA%B8%B0%EB%B8%94%EB%9E%99%ED%8B%B0.png", price: 5500 },
];

const adeItems: MenuItem[] = [
  { ko: "자몽에이드",          en: "Grapefruit Ade",              image: "/%EC%9E%90%EB%AA%BD%EC%97%90%EC%9D%B4%EB%93%9C.png",        price: 5300 },
  { ko: "레몬 에이드",         en: "Lemon Ade",                   image: "/%EB%A0%88%EB%AA%AC%EC%97%90%EC%9D%B4%EB%93%9C%20.png",    price: 5300 },
  { ko: "패션후르츠 에이드",   en: "Passion Fruit Ade",           image: "/%ED%8C%A8%EC%85%98%ED%9B%84%EB%A5%B4%EC%B8%A0%20%EC%97%90%EC%9D%B4%EB%93%9C.png", price: 5300 },
  { ko: "얼그레이유자 에이드", en: "Earl Grey Yuzu Ade",          image: "/%EC%96%BC%EA%B7%B8%EB%A0%88%EC%9D%B4%20%EC%9C%A0%EC%9E%90%20%EC%97%90%EC%9D%B4%EB%93%9C.png", price: 5500 },
  { ko: "바질토마토 에이드",   en: "Basil Tomato Ade",            image: "/%EB%B0%94%EC%A7%88%20%ED%86%A0%EB%A7%88%ED%86%A0%20%EC%97%90%EC%9D%B4%EB%93%9C.png", price: 5600 },
];

const smoothieItems: MenuItem[] = [
  { ko: "미숫가루",                              en: "Misugaru",                                  image: "/%EB%AF%B8%EC%88%AB%EA%B0%80%EB%A3%A8.png",                          price: 4500 },
  { ko: "냉귀리 쉐이크",                         en: "Cold Oat Shake",                            image: "/%EB%83%89%EA%B7%80%EB%A6%AC%EC%89%90%EC%9D%B4%ED%81%AC.png",        price: 4500 },
  { ko: "그릭요거트 (그래놀라/딸기/블루베리/망고)", en: "Greek Yogurt (Granola/Strawberry/Blueberry/Mango)", image: "/%EA%B7%B8%EB%A6%AD%EC%9A%94%EA%B1%B0%ED%8A%B8(%EA%B7%B8%EB%9E%98%EB%86%80%EB%9D%BC%20%EB%94%B8%EA%B8%B0%20%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%20%EB%A7%9D%EA%B3%A0).png", price: 5500 },
  { ko: "배 스무디",                             en: "Pear Smoothie",                             image: "/%EB%B0%B0%EC%88%98%EB%AC%B4%EB%94%94.png",                           price: 5500 },
  { ko: "유자 스무디",                            en: "Yuzu Smoothie",                             image: "/%EC%9C%A0%EC%9E%90%EC%8A%A4%EB%AC%B4%EB%94%94.png",                 price: 5500 },
];

export const orderCategories: OrderCategory[] = [
  { ko: "시즌",      en: "Season",      emoji: "🌸", items: seasonItems      },
  { ko: "수플레",    en: "Soufflé",     emoji: "🍮", items: soufleeItems     },
  { ko: "빙수",      en: "Bingsu",      emoji: "❄️", items: bingsuItems      },
  { ko: "간편 디저트", en: "Dessert",   emoji: "🍰", items: lightDessertItems },
  { ko: "드립/더치", en: "Drip",        emoji: "☕", items: dripItems        },
  { ko: "커피",      en: "Coffee",      emoji: "☕", items: coffeeItems      },
  { ko: "논커피",    en: "Non-Coffee",  emoji: "🥛", items: nonCoffeeItems   },
  { ko: "아인슈페너", en: "Einspänner", emoji: "🍦", items: einItems         },
  { ko: "티",        en: "Tea",         emoji: "🍵", items: teaItems         },
  { ko: "에이드",    en: "Ade",         emoji: "🍋", items: adeItems         },
  { ko: "스무디",    en: "Smoothie",    emoji: "🥤", items: smoothieItems    },
];
