import { questions } from './questions.js';
import { ids } from './characters.js';
import { matchesPreference, menuProfiles, preferenceReason } from './menu-profiles.js';
export const VERSION = '2';
export const STORAGE_KEY = 'caffiend-dessert-v2';

export function candidates(answers) {
  if (!Array.isArray(answers) || answers.length !== questions.length || answers.some((a,i) => !questions[i].options.some(o => o.id === a))) throw new Error('모든 문항에 답해주세요.');
  const scores = Object.fromEntries(ids.map(id => [id,0]));
  const direct = {...scores};
  const taste = {...scores};
  answers.forEach((answer,i) => {
    const q = questions[i];
    const choice = q.options.find(o => o.id === answer);
    if (q.kind === 'preference') {
      // 먹는 방식은 여러 메뉴에서 가능하므로 설명에만 쓰고 메뉴 가점은 주지 않는다.
      if(q.dimension !== 'enjoyment') ids.forEach(id => {if(matchesPreference(id,q.dimension,answer)) taste[id]++;});
    } else if (choice.affinity) {
      choice.affinity.forEach(id => scores[id]++);
    } else {
      scores[choice.primary] += 2;
      scores[choice.secondary] += 1;
      direct[choice.primary]++;
    }
  });
  const top = Math.max(...Object.values(scores));
  // 보조 응답 1점 이내의 성향 후보만 취향으로 비교한다.
  const shortlist = ids.filter(id => scores[id] >= top - 1);
  const bestTaste = Math.max(...shortlist.map(id => taste[id]));
  const tasteLeaders = shortlist.filter(id => taste[id] === bestTaste);
  const bestPersonality = Math.max(...tasteLeaders.map(id => scores[id]));
  const highest = tasteLeaders.filter(id => scores[id] === bestPersonality);
  const mostDirect = Math.max(...highest.map(id => direct[id]));
  return { ids: highest.filter(id => direct[id] === mostDirect), scores, direct, taste, shortlist };
}

export function evidence(answers, id) {
  if (!Array.isArray(answers)) return [];
  return answers.flatMap((answer,i) => {
    const o = questions[i]?.options.find(o => o.id === answer);
    return o && questions[i].kind === 'personality' && (o.primary === id || o.secondary === id || o.affinity?.includes(id)) ? [{question:questions[i].title,answer:o.text,weight:o.primary===id?2:1}] : [];
  }).sort((a,b)=>b.weight-a.weight).slice(0,2);
}

export function tasteEvidence(answers, id) {
  const result = {matched:[],different:[],neutral:[]};
  if (!Array.isArray(answers) || !menuProfiles[id]) return result;
  questions.forEach((q,i) => {
    if(q.kind !== 'preference') return;
    const choice=q.options.find(o=>o.id===answers[i]);
    if(!choice) return;
    const fact={question:q.title,answer:choice.text,dimension:q.dimension};
    if(choice.id === 'any') result.neutral.push(fact);
    else if(matchesPreference(id,q.dimension,choice.id)) result.matched.push({...fact,reason:preferenceReason(id,q.dimension,choice.id)});
    else result.different.push(fact);
  });
  return result;
}

export function createSession(random = Math.random) {
  return {version:VERSION,answers:questions.map(()=>null),index:0,result:null,orders:questions.map(q=>{
    const order=q.options.map(o=>o.id);
    for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    return order;
  })};
}

export function validSession(value) {
  if (!value || value.version !== VERSION || !Array.isArray(value.answers) || value.answers.length !== questions.length || !Array.isArray(value.orders) || value.orders.length !== questions.length || !Number.isInteger(value.index) || value.index<0 || value.index>=questions.length) return false;
  if (!value.answers.every((a,i)=>a===null || questions[i].options.some(o=>o.id===a))) return false;
  if (!value.orders.every((order,i)=>Array.isArray(order) && order.length===questions[i].options.length && new Set(order).size===order.length && order.every(id=>questions[i].options.some(o=>o.id===id)))) return false;
  // 저장된 답변은 연속된 접두부여야 한다. 조작·구버전 데이터는 다시 시작한다.
  const blank=value.answers.indexOf(null);
  if(blank>=0 && (value.answers.slice(blank).some(a=>a!==null) || value.index>blank)) return false;
  if(value.result!==null){
    if(!ids.includes(value.result) || blank!==-1) return false;
    return candidates(value.answers).ids.includes(value.result);
  }
  return true;
}

export function updateAnswer(session, answer) {
  if (!questions[session.index].options.some(o=>o.id===answer)) throw new Error('알 수 없는 선택지입니다.');
  const updated={...session,answers:[...session.answers],result:null};
  updated.answers[session.index]=answer;
  return updated;
}

export function shareHash(id) {
  if(!ids.includes(id)) throw new Error('알 수 없는 캐릭터입니다.');
  return `#result/${id}?v=${VERSION}`;
}
export function parseRoute(hash) {
  if(hash==='#quiz') return {page:'quiz'};
  if(hash==='#collection') return {page:'collection'};
  // 같은 캐릭터를 가리키는 과거 공유 링크도 소개 화면으로 유지한다.
  const match=/^#result\/([SPDCBMLT])\?v=[12]$/.exec(hash);
  if(match) return {page:'result',id:match[1]};
  return {page:'home'};
}
