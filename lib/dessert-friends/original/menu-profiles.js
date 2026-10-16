// 메뉴명·기존 실물 사진·사용자가 확인한 카다이프를 기준으로 한다.
// 확인되지 않은 당도·산미·쓴맛 강도나 피스타치오 함유는 추정하지 않는다.
export const menuProfiles = {
  S: {
    tags:['폭신한 수플레','딸기와 크림'],texture:['soft','mixed'],flavor:['fruit'],enjoyment:['focus','fruit-cream','contrast','combine'],
    bridge:'딸기와 크림을 골고루 챙기는 다정한 반장. 내 한 입보다 친구의 빈 접시가 먼저 눈에 들어와요.',
    reasons:{texture:'폭신한 수플레를 부드럽게 한 입 즐겨요.',flavor:'딸기를 곁들여 과일 풍미를 즐겨요.',enjoyment:'딸기와 크림을 수플레에 함께 올려 먹어요.'}
  },
  P: {
    tags:['폭신한 수플레','복숭아 풍미'],texture:['soft','mixed'],flavor:['fruit'],enjoyment:['focus','fruit-cream','contrast','combine'],
    bridge:'폭신한 수플레에 기대어 복숭아빛 낮꿈을 꿔요. 좋아하는 순간은 서두르지 않고 오래 음미하는 편이에요.',
    reasons:{texture:'폭신한 수플레를 부드럽게 한 입 즐겨요.',flavor:'복숭아를 곁들여 과일 풍미를 즐겨요.',enjoyment:'복숭아와 곁들임을 수플레에 함께 올려 먹어요.'}
  },
  D: {
    tags:['수플레와 카다이프','코코아 풍미'],texture:['soft','mixed'],flavor:['cocoa'],enjoyment:['focus','contrast','combine'],
    bridge:'수플레도 카다이프도 한 입씩, 궁금한 건 직접 맛봐야 해요. 새로운 조합을 발견하면 눈이 반짝여요.',
    reasons:{texture:'폭신한 수플레에 카다이프를 곁들여요.',flavor:'코코아를 입힌 수플레를 한 입 맛봐요.',enjoyment:'수플레와 카다이프를 따로도 함께도 맛봐요.'}
  },
  C: {
    tags:['부드러운 크림','금빛 캐러멜'],texture:['soft','mixed'],flavor:['cream-caramel'],enjoyment:['focus','contrast','combine'],
    bridge:'크림처럼 부드럽게 말해도, 좋아하는 건 확실해요. 캐러멜이 얹힌 수플레도 내 취향대로 한 입 즐겨요.',
    reasons:{texture:'폭신한 수플레에 부드러운 크림을 곁들여요.',flavor:'크림과 캐러멜을 한 입에 즐겨요.',enjoyment:'수플레에 크림과 캐러멜을 함께 곁들여요.'}
  },
  B: {
    tags:['차가운 빙수','흑임자 풍미'],texture:['cold','mixed'],flavor:['sesame'],enjoyment:['focus','combine'],
    bridge:'고소한 흑임자 한 숟갈에 잠깐 쉬어가요. 천천히 먹고 느긋하게 웃는, 서두를 줄 모르는 친구예요.',
    reasons:{texture:'차가운 빙수를 시원하게 한 숟갈 즐겨요.',flavor:'흑임자의 고소한 풍미를 음미해요.',enjoyment:'흑임자 빙수를 천천히 한 숟갈씩 즐겨요.'}
  },
  M: {
    tags:['차가운 빙수','망고 풍미'],texture:['cold','mixed'],flavor:['fruit'],enjoyment:['focus','combine'],
    bridge:'첫 숟갈부터 신나게! 망고가 눈에 들어오면 망설임 없이 먼저 나서는 친구예요.',
    reasons:{texture:'차가운 빙수를 시원하게 한 숟갈 즐겨요.',flavor:'망고를 곁들여 과일 풍미를 즐겨요.',enjoyment:'빙수에 망고 조각을 곁들여 먹어요.'}
  },
  L: {
    tags:['차가운 빙수','커피와 비스킷'],texture:['cold','mixed'],flavor:['coffee'],enjoyment:['focus','combine'],
    bridge:'비스킷을 놓고 커피를 곁들이면, 나만의 시간이 시작돼요. 좋아하는 조합을 익숙한 순서로 즐겨요.',
    reasons:{texture:'차가운 빙수에 비스킷을 곁들여요.',flavor:'커피 풍미에 로투스 비스킷을 더해요.',enjoyment:'커피와 비스킷을 조금씩 곁들여 먹어요.'}
  },
  T: {
    tags:['코코아 풍미','크림 곁들임'],texture:['mixed'],flavor:['cocoa'],enjoyment:['focus','combine'],
    bridge:'코코아 볼에 크림을 곁들이듯, 서로 다른 매력을 한자리에 모아요. 함께할 때 더 즐거운 순간을 잘 찾아내요.',
    reasons:{texture:'코코아 볼에 크림을 곁들여 한 입 즐겨요.',flavor:'코코아를 입힌 티라미수 볼을 맛봐요.',enjoyment:'코코아 볼에 크림을 조금씩 곁들여 먹어요.'}
  }
};

export function matchesPreference(id, dimension, answer) {
  return answer !== 'any' && !!menuProfiles[id]?.[dimension]?.includes(answer);
}

export function preferenceReason(id, dimension, answer) {
  const combinations={S:'수플레와 딸기·크림',P:'수플레와 복숭아',D:'수플레와 카다이프',C:'수플레와 크림·캐러멜',B:'빙수와 흑임자 토핑',M:'빙수와 망고 조각',L:'빙수와 비스킷',T:'코코아 볼과 크림'};
  if(dimension === 'enjoyment') {
    if(answer === 'focus') {
      const flavors={S:'딸기',P:'복숭아',D:'코코아',C:'캐러멜',B:'흑임자',M:'망고',L:'커피',T:'코코아'};
      return `${flavors[id]}의 풍미를 천천히 음미해요.`;
    }
    if(answer === 'combine') return `${combinations[id]}, 조금씩 섞어 내 취향대로 즐겨요.`;
    if(answer === 'contrast') return `${combinations[id]}, 따로도 함께도 맛봐요.`;
  }
  if(dimension === 'texture' && answer === 'mixed') {
    return `${combinations[id]}, 여러 식감을 한 입에 즐겨요.`;
  }
  return menuProfiles[id].reasons[dimension];
}

