/**
 * 삼각편대 마스터 분석 엔진
 * 사주(하드웨어) × MBTI(소프트웨어) × VAK(인터페이스) 통합 코칭
 */

import type { VakType } from '@/types'
import type { TenGodGroup } from '@/utils/sajuCalculator'
import type { Element } from '@/types'

// ─────────────────────────────────────────────
// 내부 타입
// ─────────────────────────────────────────────
type Vibe = 'Introvert' | 'Extrovert'
type MbtiTemperament = 'SJ' | 'SP' | 'NT' | 'NF'
type SajuKey = string  // `${Element}_${TenGodGroup}`

// ─────────────────────────────────────────────
// [엔진 1] 사주 DB — 오행 × 십성 (25종)
// 하드웨어: 깊은 몰입 조건 & 최적 환경
// ─────────────────────────────────────────────
interface SajuEntry {
  title: string
  vibe: Vibe
  deepFocus: string
}

const SAJU_DB: Record<SajuKey, SajuEntry> = {
  // ── 목 (木) ──
  '목_비겁': {
    title: '고독한 탐험가',
    vibe: 'Introvert',
    deepFocus: '혼자만의 조용한 공간에서 자신만의 방식으로 지식을 탐구할 때 집중력이 극대화됩니다.',
  },
  '목_식상': {
    title: '호기심 스토리텔러',
    vibe: 'Extrovert',
    deepFocus: '탁 트인 창가 자리나 스터디카페에서 마인드맵을 그리며 지식을 뻗어나갈 때 효율이 극대화됩니다.',
  },
  '목_재성': {
    title: '실용 탐구자',
    vibe: 'Extrovert',
    deepFocus: '실질적인 결과물을 만드는 프로젝트형 공부를 할 때 동기와 집중력이 동시에 높아집니다.',
  },
  '목_관성': {
    title: '체계적 혁신가',
    vibe: 'Introvert',
    deepFocus: '체계적인 계획 아래 탐구 주제를 순서대로 파고드는 구조화된 공부에서 집중력이 살아납니다.',
  },
  '목_인성': {
    title: '개념 연결가',
    vibe: 'Introvert',
    deepFocus: '깊은 독서와 자료 탐구를 통해 개념 간 연결고리를 스스로 발견할 때 진짜 공부가 됩니다.',
  },

  // ── 화 (火) ──
  '화_비겁': {
    title: '열혈 승부사',
    vibe: 'Introvert',
    deepFocus: '혼자 치열하게 문제를 풀며 자신의 직관을 믿을 때 놀라운 집중력과 성과가 나타납니다.',
  },
  '화_식상': {
    title: '열정 퍼포머',
    vibe: 'Extrovert',
    deepFocus: '배운 내용을 스터디원에게 설명하거나 발표하는 방식으로 학습할 때 최고의 효율이 나옵니다.',
  },
  '화_재성': {
    title: '직관 전략가',
    vibe: 'Extrovert',
    deepFocus: '타이머 도전이나 경쟁적 환경에서 빠르게 치고나가는 단기 집중 공부에서 에너지가 폭발합니다.',
  },
  '화_관성': {
    title: '목표 불꽃형',
    vibe: 'Introvert',
    deepFocus: '명확한 점수 목표를 세우고 달성을 향해 달려갈 때 엄청난 집중력이 발동됩니다.',
  },
  '화_인성': {
    title: '직관 사색가',
    vibe: 'Introvert',
    deepFocus: '빠르게 이해한 후 원리를 깊이 파고드는 심층 탐구 과정에서 최고의 만족감과 집중이 나옵니다.',
  },

  // ── 토 (土) ──
  '토_비겁': {
    title: '묵묵한 장인',
    vibe: 'Introvert',
    deepFocus: '자기만의 루틴과 규칙으로 매일 조금씩 쌓아가는 혼공 방식이 가장 효율적입니다.',
  },
  '토_식상': {
    title: '친절한 멘토형',
    vibe: 'Extrovert',
    deepFocus: '배운 것을 요약 노트로 정리하거나 남에게 가르쳐줄 때 기억이 가장 확실하게 굳어집니다.',
  },
  '토_재성': {
    title: '성과 수집가',
    vibe: 'Extrovert',
    deepFocus: '매일 성과를 플래너에 기록하고 확인하는 성취 기반 루틴에서 꾸준한 동기가 유지됩니다.',
  },
  '토_관성': {
    title: '철벽 루틴러',
    vibe: 'Introvert',
    deepFocus: '철저한 예습·복습 사이클을 매일 반복하는 구조적 루틴에서 최고의 학습 효율이 나옵니다.',
  },
  '토_인성': {
    title: '심층 이해자',
    vibe: 'Introvert',
    deepFocus: '한 개념을 완전히 이해할 때까지 깊이 파고드는 심화 독서와 필기에서 에너지가 충전됩니다.',
  },

  // ── 금 (金) ──
  '금_비겁': {
    title: '고독한 승부사',
    vibe: 'Introvert',
    deepFocus: '외부와 완벽히 단절된 1인실에서 철저히 혼자만의 싸움을 할 때 극강의 몰입도를 발휘합니다.',
  },
  '금_식상': {
    title: '정밀 표현가',
    vibe: 'Extrovert',
    deepFocus: '깔끔한 정리 노트와 구조화된 도표로 지식을 시각적으로 표현할 때 최강의 집중력이 나옵니다.',
  },
  '금_재성': {
    title: '효율 전략가',
    vibe: 'Extrovert',
    deepFocus: '명확한 수치 목표를 세우고 효율적으로 달성하는 전략적 공부 방식에서 동기가 극대화됩니다.',
  },
  '금_관성': {
    title: '완벽주의 분석가',
    vibe: 'Introvert',
    deepFocus: '완벽한 단권화와 오답 분석으로 약점을 하나하나 제거하는 정밀한 공부에서 최고 집중력이 나옵니다.',
  },
  '금_인성': {
    title: '논리 심층탐구가',
    vibe: 'Introvert',
    deepFocus: '논리적 원리를 끝까지 파고드는 심층 분석 과정에서 최고의 몰입 상태에 진입합니다.',
  },

  // ── 수 (水) ──
  '수_비겁': {
    title: '심야의 사색가',
    vibe: 'Introvert',
    deepFocus: '새벽 시간대나 백색소음 있는 안락한 공간에서 혼자 원리와 배경지식을 깊이 파고들 때 진짜 공부가 됩니다.',
  },
  '수_식상': {
    title: '직관 스토리텔러',
    vibe: 'Extrovert',
    deepFocus: '직관적으로 연결되는 아이디어를 글이나 말로 표현하고 정리할 때 최고의 학습 효율이 나옵니다.',
  },
  '수_재성': {
    title: '심층 실전가',
    vibe: 'Extrovert',
    deepFocus: '실질적인 문제 해결을 목표로 깊이 파고드는 실전형 문제풀이에서 집중과 동기가 함께 살아납니다.',
  },
  '수_관성': {
    title: '체계적 탐구자',
    vibe: 'Introvert',
    deepFocus: '체계적 계획 아래 깊이 있는 원리 이해와 반복 복습의 균형을 맞출 때 최상의 결과가 나옵니다.',
  },
  '수_인성': {
    title: '지혜 흡수형',
    vibe: 'Introvert',
    deepFocus: '새벽 시간대나 조용한 심야에 원리와 배경지식을 깊이 파고드는 독서·사색에서 에너지가 충전됩니다.',
  },
}

// ─────────────────────────────────────────────
// [엔진 2] MBTI DB — 4기질
// 소프트웨어: 동기부여 & 스케줄링
// ─────────────────────────────────────────────
interface MbtiEntry {
  title: string
  trigger: string
  vibe: Vibe
}

const MBTI_DB: Record<MbtiTemperament, MbtiEntry> = {
  SJ: {
    title: '모범생 가디언',
    trigger: '명확한 가이드라인과 정해진 분량이 주어질 때 안정감을 느끼며 책상에 앉습니다.',
    vibe: 'Introvert',
  },
  SP: {
    title: '자유로운 아티스트',
    trigger: '재미와 즉각적인 보상이 걸려있는 단기 퀘스트 형태일 때 흥미를 느낍니다.',
    vibe: 'Extrovert',
  },
  NT: {
    title: '논리적 전략가',
    trigger: '전체적인 시스템을 이해하고 지적 호기심이 자극될 때 스스로 계획을 세웁니다.',
    vibe: 'Introvert',
  },
  NF: {
    title: '가치지향 이상주의자',
    trigger: '좋아하는 멘토의 응원이나 함께하는 스터디원들과의 교감이 있을 때 공부를 시작합니다.',
    vibe: 'Extrovert',
  },
}

// ─────────────────────────────────────────────
// [엔진 3] VAK DB — 감각 인지 채널
// 인터페이스: 실제 암기 & 행동 방식
// ─────────────────────────────────────────────
interface VakEntry {
  title: string
  actionPlan: string
}

const VAK_DB: Record<VakType, VakEntry> = {
  V: {
    title: '시각 스캐너형',
    actionPlan: '형광펜 컬러 코딩, 마인드맵, 인포그래픽 중심의 깔끔한 단권화 노트를 작성하세요.',
  },
  A: {
    title: '청각 아나운서형',
    actionPlan: '백지 복습 시 남에게 설명하듯 소리 내어 말하고, 잘 안 외워지는 것은 리듬을 타며 중얼거리세요.',
  },
  K: {
    title: '체감각 액션배우형',
    actionPlan: '가만히 앉아있기보다 서서 공부하거나, 이면지에 잉크가 닳도록 빽빽하게 쓰며 몸으로 기억하세요.',
  },
}

// ─────────────────────────────────────────────
// MBTI → 4기질 추출
// ─────────────────────────────────────────────
function getMbtiTemperament(mbtiCode: string): MbtiTemperament {
  if (mbtiCode.includes('S') && mbtiCode.includes('J')) return 'SJ'
  if (mbtiCode.includes('S') && mbtiCode.includes('P')) return 'SP'
  if (mbtiCode.includes('N') && mbtiCode.includes('T')) return 'NT'
  if (mbtiCode.includes('N') && mbtiCode.includes('F')) return 'NF'
  return 'NT'
}

// ─────────────────────────────────────────────
// 결과 타입
// ─────────────────────────────────────────────
export interface MasterEngineResult {
  userInfo: {
    personaSummary: string    // "[MBTI의 겉모습]을 한 [사주 페르소나]"
    sensoryTrait: string      // VAK 유형명
  }
  coachingStrategy: {
    step1Motivation: string   // 동기부여 & 시작 트리거
    step2DeepFocus: string    // 환경 & 심화몰입 조건
    step3ActionPlan: string   // 암기 & 실전 스킬
  }
  mentalCare: {
    isConflict: boolean
    message: string
  }
  raw: {
    sajuTitle: string
    mbtiTitle: string
    mbtiTemperament: MbtiTemperament
    vakTitle: string
  }
}

// ─────────────────────────────────────────────
// 마스터 엔진 실행
// ─────────────────────────────────────────────
export function runMasterEngine(
  element: Element,
  sipseongGroup: TenGodGroup,
  mbtiCode: string,
  vakType: VakType,
): MasterEngineResult {
  const sajuKey: SajuKey = `${element}_${sipseongGroup}`
  const sajuData = SAJU_DB[sajuKey] ?? SAJU_DB['금_비겁']

  const temperament = getMbtiTemperament(mbtiCode)
  const mbtiData = MBTI_DB[temperament]
  const vakData = VAK_DB[vakType]

  // 충돌 검사: 사주 vibe ≠ MBTI vibe
  const isConflict = sajuData.vibe !== mbtiData.vibe

  const mentalCareMessage = isConflict
    ? `평소에는 ${mbtiData.title}처럼 행동하지만(${mbtiData.vibe === 'Extrovert' ? '외향적' : '내향적'}), 진짜 집중이 필요할 때는 ${sajuData.title}의 본성(${sajuData.vibe === 'Introvert' ? '내향적 독립 모드' : '외향적 교류 모드'})이 나옵니다. 공부 시작은 자신의 MBTI 방식대로 하되, 고난도 문제나 시험 직전에는 반드시 본성의 환경으로 전환해야 멘탈이 흔들리지 않습니다.`
    : `당신의 표면적 성향과 내면의 깊은 기질이 완벽히 일치합니다! 자신의 직관을 믿고 현재의 환경 세팅을 흔들림 없이 밀어붙이세요.`

  return {
    userInfo: {
      personaSummary: `[${mbtiCode}의 겉모습]을 한 [${sajuData.title}]`,
      sensoryTrait: vakData.title,
    },
    coachingStrategy: {
      step1Motivation: mbtiData.trigger,
      step2DeepFocus: sajuData.deepFocus,
      step3ActionPlan: vakData.actionPlan,
    },
    mentalCare: {
      isConflict,
      message: mentalCareMessage,
    },
    raw: {
      sajuTitle: sajuData.title,
      mbtiTitle: mbtiData.title,
      mbtiTemperament: temperament,
      vakTitle: vakData.title,
    },
  }
}
