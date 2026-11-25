window.DIGUL_CONFIG = {
  version: "2.4.0",
  gameName: "디굴디굴",
  subtitle: "디저트가 데굴데굴",
  timezone: "Asia/Seoul",
  nickname: {
    min: 2,
    max: 10,
    pattern: "^[가-힣A-Za-z0-9]+$"
  },
  physics: {
    width: 360,
    height: 560,
    dropY: 48,
    dangerY: 96,
    dangerHoldMs: 2000,
    freshBodyGraceMs: 1200,
    dropCooldownMs: 500,
    gravity: 1.08,
    baseRadius: 15,
    restitution: 0.11,
    friction: 0.26,
    frictionStatic: 0.52,
    density: 0.00115
  },
  gameplay: {
    droppableLevels: 5,
    completionBonus: 150
  },
  assets: {
    base: "assets/menu/",
    renderer: "dom-image-v1"
  },
  // file: assets/menu/ 폴더의 이미지 이름
  // fit : 그림 크기 배율 (1.0 = 충돌 원 지름). 그림이 겹쳐 보이면 줄이고, 틈이 보이면 키우세요.
  menus: [
    { level:1,  name:"로투스 수플레",      points:0,  diameter:1.00, file:"01-lotus.webp", fit:1.081,       fallback:"L", tone:"#D79B61" },
    { level:2,  name:"꿀자몽빙수",          points:3,  diameter:1.25, file:"02-grapefruit-bingsu.webp", fit:1.137,           fallback:"G", tone:"#EE9A7F" },
    { level:3,  name:"밤 수플레",           points:6,  diameter:1.50, file:"03-chestnut.webp", fit:1.088,            fallback:"B", tone:"#A96E4E" },
    { level:4,  name:"흑임자 수플레",       points:10, diameter:1.80, file:"04-black-sesame.webp", fit:1.142,        fallback:"S", tone:"#77706E" },
    { level:5,  name:"복숭아 수플레",       points:15, diameter:2.10, file:"05-peach.webp", fit:1.075,        fallback:"P", tone:"#F2A9A6" },
    { level:6,  name:"옛날인절미팥빙수",    points:21, diameter:2.45, file:"06-injeolmi-redbean-bingsu.webp", fit:1.086,     fallback:"I", tone:"#C9925D" },
    { level:7,  name:"두바이 초코 수플레",  points:28, diameter:2.80, file:"07-dubai-choco.webp", fit:1.156,    fallback:"D", tone:"#735040" },
    { level:8,  name:"코코망고리치빙수",    points:36, diameter:3.20, file:"08-coco-mango-lychee-bingsu.webp", fit:1.169,     fallback:"M", tone:"#F0C45A" },
    { level:9,  name:"인절미 수플레",       points:45, diameter:3.65, file:"09-injeolmi.webp", fit:1.076,        fallback:"I", tone:"#D5B57A" },
    { level:10, name:"흑임자빙수",          points:55, diameter:4.10, file:"10-black-sesame-bingsu.webp", fit:1.085,           fallback:"S", tone:"#514B4B" },
    { level:11, name:"크림브륄레 수플레",   points:66, diameter:4.60, file:"11-creme-brulee.webp", fit:1.191,    fallback:"C", tone:"#E7B76C" }
  ]
};