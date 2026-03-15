import type { Element } from '@/types'
import { ohangData, type OhangKey } from '@/data/ohangData'
import { calcPersona, type TenGodGroup, type PersonaResult } from '@/utils/personaCalculator'

// ── 천간 (十天干) ──
const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const
type HeavenlyStem = typeof HEAVENLY_STEMS[number]

// ── 지지 (十二地支) ──
const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const
type EarthlyBranch = typeof EARTHLY_BRANCHES[number]

// ── 천간 → 오행 ──
const STEM_ELEMENT: Record<HeavenlyStem, Element> = {
  甲: '목', 乙: '목',
  丙: '화', 丁: '화',
  戊: '토', 己: '토',
  庚: '금', 辛: '금',
  壬: '수', 癸: '수',
}

// ── 지지 → 오행 ──
const BRANCH_ELEMENT: Record<EarthlyBranch, Element> = {
  子: '수', 丑: '토', 寅: '목', 卯: '목',
  辰: '토', 巳: '화', 午: '화', 未: '토',
  申: '금', 酉: '금', 戌: '토', 亥: '수',
}

// ── 기준일: 2000-01-07 = 甲子日 (60갑자 index 30) ──
const BASE_DATE_UTC = Date.UTC(2000, 0, 7)
const BASE_GAPJA_INDEX = 30

// ── 십성 그룹 (학습 동기 유형, 오행명 비노출) ──
type TenGodGroup = '비겁' | '식상' | '재성' | '관성' | '인성'

export interface SipseongProfile {
  trait: string       // 학습 동기 유형명
  strength: string    // 핵심 강점
  weakness: string    // 핵심 약점
  studyHint: string   // 공부 힌트
  motivation: string  // 동기 원천
}

const SIPSEONG_STUDY: Record<TenGodGroup, SipseongProfile> = {
  비겁: {
    trait: '자기주도형',
    strength: '독립적 사고 · 자기 페이스 유지 · 경쟁에서 강한 동기 발휘',
    weakness: '고집으로 인한 비효율 · 타인 조언 수용 어려움',
    studyHint: '혼자 공부가 가장 잘 맞음. 자기 방식을 신뢰하되 주기적 점검 필요',
    motivation: '자존심과 독립적 성취',
  },
  식상: {
    trait: '창의표현형',
    strength: '창의적 문제해결 · 글쓰기·말하기 탁월 · 아이디어 풍부',
    weakness: '루틴 학습 지루함 · 집중력 지속 어려움',
    studyHint: '가르치기 학습(파인만 기법)이 효과적. 표현하면서 공부',
    motivation: '흥미와 창의적 도전',
  },
  재성: {
    trait: '목표실용형',
    strength: '현실적 목표 설정 · 결과 중심 효율 학습 · 시간 관리',
    weakness: '과정 소홀 · 흥미 없는 과목 집중력 저하',
    studyHint: '명확한 목표 수치 설정. 달성 시 보상 시스템 활용',
    motivation: '결과와 현실적 성취',
  },
  관성: {
    trait: '규율성취형',
    strength: '높은 성취욕 · 규칙적 학습 · 강한 책임감과 도전 정신',
    weakness: '완벽주의 번아웃 · 과도한 자기 압박',
    studyHint: '계획+휴식 균형 필수. 완벽보다 완료 지향',
    motivation: '성취와 인정',
  },
  인성: {
    trait: '지식흡수형',
    strength: '깊은 이해력 · 빠른 개념 흡수 · 연구형 사고',
    weakness: '이해 추구로 속도 느림 · 암기보다 이해 선호',
    studyHint: '개념 이해 후 반복 암기. 이해력을 살린 서술·논술 강화',
    motivation: '지적 호기심과 깊은 이해',
  },
}

// ── 월지 에너지 프로파일 (오행명 비노출) ──
export interface WoljiProfile {
  energy: string   // 에너지 유형
  trait: string    // 주요 특성
  peak: string     // 최적 집중 시간대
}

const WOLJI_PROFILE: Record<EarthlyBranch, WoljiProfile> = {
  子: { energy: '내면집중형',  trait: '차분하고 깊은 사고',     peak: '야간 집중력 최고' },
  丑: { energy: '인내지속형',  trait: '꾸준하고 꼼꼼함',        peak: '규칙적 루틴에서 최고' },
  寅: { energy: '추진도전형',  trait: '활동적·진취적',          peak: '오전 집중력 최고' },
  卯: { energy: '유연창의형',  trait: '유연하고 창의적',        peak: '오전~오후 집중 우수' },
  辰: { energy: '실용준비형',  trait: '실용적·계획적',          peak: '오후 집중 우수' },
  巳: { energy: '빠른흡수형',  trait: '열정적·빠른 이해',       peak: '오전 집중력 탁월' },
  午: { energy: '활동에너지형', trait: '에너지·사교성 넘침',    peak: '오후~저녁 집중 최고' },
  未: { energy: '포용인내형',  trait: '부드럽고 포용적',        peak: '오후 집중 우수' },
  申: { energy: '논리분석형',  trait: '날카롭고 분석적',        peak: '오후~저녁 집중 최고' },
  酉: { energy: '정밀완성형',  trait: '정교하고 완벽주의',      peak: '저녁~야간 집중 최고' },
  戌: { energy: '통합심화형',  trait: '깊이 있고 통합적',       peak: '야간 집중력 우수' },
  亥: { energy: '지혜흡수형',  trait: '직관적·흡수력 강함',    peak: '야간~새벽 집중' },
}

// TenGodGroup 재수출 (외부 참조용)
export type { TenGodGroup }

// ── 십성 계산 ──
function calcDominantTenGod(
  dayGan: HeavenlyStem,
  yearStem: HeavenlyStem,
  yearBranch: EarthlyBranch,
  monthBranch: EarthlyBranch,
  dayBranch: EarthlyBranch,
): TenGodGroup {
  const GEN:    Record<Element, Element> = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' }
  const CTRL:   Record<Element, Element> = { 목:'토', 화:'금', 토:'수', 금:'목', 수:'화' }
  const GEN_BY: Record<Element, Element> = { 목:'수', 화:'목', 토:'화', 금:'토', 수:'금' }
  const CT_BY:  Record<Element, Element> = { 목:'금', 화:'수', 토:'목', 금:'화', 수:'토' }

  function grp(de: Element, oe: Element): TenGodGroup {
    if (oe === de)        return '비겁'
    if (GEN[de]  === oe) return '식상'
    if (CTRL[de] === oe) return '재성'
    if (CT_BY[de]=== oe) return '관성'
    if (GEN_BY[de]===oe) return '인성'
    return '비겁'
  }

  const de = STEM_ELEMENT[dayGan]
  const cnt: Record<TenGodGroup, number> = { 비겁:0, 식상:0, 재성:0, 관성:0, 인성:0 }
  cnt[grp(de, STEM_ELEMENT[yearStem])]++
  cnt[grp(de, BRANCH_ELEMENT[yearBranch])]++
  cnt[grp(de, BRANCH_ELEMENT[monthBranch])]++
  cnt[grp(de, BRANCH_ELEMENT[dayBranch])]++
  return Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0] as TenGodGroup
}

// ── 오행 설명 ──
export const ELEMENT_INFO: Record<Element, { label: string; emoji: string; description: string; studyTrait: string }> = {
  목: {
    label: '木 (목)',
    emoji: '🌳',
    description: '성장과 창의의 기운. 새로운 것을 탐구하고 확장하는 힘이 강합니다.',
    studyTrait: '호기심 주도 학습형. 흥미로운 주제엔 몰입하지만 반복·암기에 쉽게 지칩니다.',
  },
  화: {
    label: '火 (화)',
    emoji: '🔥',
    description: '열정과 직관의 기운. 빠른 이해력과 표현력이 뛰어납니다.',
    studyTrait: '직관·속도 학습형. 빠르게 파악하지만 디테일 정리가 약점입니다.',
  },
  토: {
    label: '土 (토)',
    emoji: '🏔️',
    description: '안정과 신뢰의 기운. 꾸준하고 체계적으로 쌓아가는 힘이 있습니다.',
    studyTrait: '누적·반복 학습형. 꾸준한 복습으로 장기 기억력이 탁월합니다.',
  },
  금: {
    label: '金 (금)',
    emoji: '⚔️',
    description: '집중과 정밀의 기운. 논리적 분석과 완성도를 중시합니다.',
    studyTrait: '분석·완벽 학습형. 정확성 높지만 완벽주의로 속도가 느려질 수 있습니다.',
  },
  수: {
    label: '水 (수)',
    emoji: '💧',
    description: '깊이와 사고의 기운. 심층적으로 이해하고 연결하는 능력이 강합니다.',
    studyTrait: '심층·연결 학습형. 원리 이해는 빠르지만 시작하는 데 에너지가 필요합니다.',
  },
}

// ── 내부 계산 함수들 ──

/**
 * YYYY-MM-DD 문자열 → UTC 자정 ms
 * (로컬 타임존 오프셋으로 인한 날짜 오차 방지)
 */
function parseDateUTC(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

/**
 * 일주 계산: 2000-01-07 = 甲子日 (60갑자 index 30) 기준
 * YYYY-MM-DD 문자열을 입력받아 천간·지지를 반환
 */
function calcDayPillar(dateStr: string): { stem: HeavenlyStem; branch: EarthlyBranch }
/** @deprecated 숫자 분리 입력 — 내부 호환용 */
function calcDayPillar(year: number, month: number, day: number): { stem: HeavenlyStem; branch: EarthlyBranch }
function calcDayPillar(
  yearOrDate: number | string,
  month?: number,
  day?: number,
): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const targetMs =
    typeof yearOrDate === 'string'
      ? parseDateUTC(yearOrDate)
      : Date.UTC(yearOrDate, month! - 1, day!)

  const diff = Math.round((targetMs - BASE_DATE_UTC) / 86_400_000)
  const gapjaIdx = ((BASE_GAPJA_INDEX + diff) % 60 + 60) % 60
  return {
    stem: HEAVENLY_STEMS[gapjaIdx % 10],
    branch: EARTHLY_BRANCHES[gapjaIdx % 12],
  }
}

/** 연주 계산: 갑자년(1984) 기준 */
function calcYearPillar(year: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const stemIdx = ((year - 4) % 10 + 10) % 10
  const branchIdx = ((year - 4) % 12 + 12) % 12
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
  }
}

/** 월지 (절기 간략 적용: 월 기준 고정) */
const MONTH_BRANCH: Record<number, EarthlyBranch> = {
  1: '丑', 2: '寅', 3: '卯', 4: '辰', 5: '巳', 6: '午',
  7: '未', 8: '申', 9: '酉', 10: '戌', 11: '亥', 12: '子',
}

/** 사주 네 기둥의 오행 분포 계산 */
function calcFiveElements(
  dayStem: HeavenlyStem,
  dayBranch: EarthlyBranch,
  yearStem: HeavenlyStem,
  yearBranch: EarthlyBranch,
  monthBranch: EarthlyBranch,
): Record<Element, number> {
  const count: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }
  count[STEM_ELEMENT[dayStem]]++
  count[STEM_ELEMENT[yearStem]]++
  count[BRANCH_ELEMENT[dayBranch]]++
  count[BRANCH_ELEMENT[yearBranch]]++
  count[BRANCH_ELEMENT[monthBranch]]++
  return count
}

// ── 공개 타입 ──

export interface SajuProfile {
  dayGan: HeavenlyStem           // 일간 천간 (예: 甲)
  dayBranch: EarthlyBranch       // 일지 지지 (예: 子)
  dominantElement: Element       // 가장 강한 오행
  weakElement: Element           // 가장 약한 오행
  fiveElements: Record<Element, number>
  memoryStrength: 'high' | 'medium'
  bestTimeCode: 'morning' | 'afternoon' | 'night'
  stressType: 'burnout_slow' | 'boredom' | 'perfectionism'
}

export interface SajuCalculationResult {
  birthDate: string                          // 'YYYY-MM-DD'
  dayGan: string                             // 일간 한자 (예: 甲)
  element: Element                           // 일간 오행 (예: '목')
  elementDescription: string                 // 오행 학습 성향 설명
  ohang: typeof ohangData[OhangKey]          // ohangData 학습 특성 전체
  profile: SajuProfile
  // ── 월지·십성 심층 분석 ──
  wolji: WoljiProfile                        // 월지 에너지 패턴
  sipseong: SipseongProfile                  // 십성 학습 동기 유형
  sipseongGroup: TenGodGroup                 // 십성 그룹 키 (페르소나 매핑용)
  persona: PersonaResult                     // 학습 페르소나 (25종)
}

// ── ohangData 연동 함수 ──

/**
 * 일간(天干)으로 ohangData 학습 특성을 반환합니다.
 */
export function getOhangByDayGan(stem: HeavenlyStem): typeof ohangData[OhangKey] {
  const key = STEM_ELEMENT[stem] as OhangKey
  return ohangData[key]
}

/**
 * YYYY-MM-DD 날짜 문자열로 ohangData 학습 특성을 반환합니다.
 *
 * @example
 * const profile = getOhangProfile('2005-03-14')
 * // profile.name, profile.bestMethods, profile.weekPlan 등
 */
export function getOhangProfile(dateStr: string): typeof ohangData[OhangKey] {
  const { stem } = calcDayPillar(dateStr)
  return getOhangByDayGan(stem)
}

// ── 메인 함수 ──

/**
 * 생년월일(YYYY-MM-DD)을 입력받아 일간 오행 및 학습 프로파일을 반환합니다.
 *
 * @example
 * const result = calculateSaju('2005-03-14')
 * result.dayGan        // '甲'
 * result.element       // '목'
 * result.ohang         // ohangData['목'] 전체
 * result.profile       // 상세 프로파일 (오행 분포, 최적 시간대 등)
 */
export function calculateSaju(dateStr: string): SajuCalculationResult
/** @deprecated 숫자 분리 입력 지원 유지 */
export function calculateSaju(year: number, month: number, day: number): SajuCalculationResult
export function calculateSaju(
  yearOrDate: number | string,
  month?: number,
  day?: number,
): SajuCalculationResult {
  const dateStr =
    typeof yearOrDate === 'string'
      ? yearOrDate
      : `${yearOrDate}-${String(month!).padStart(2, '0')}-${String(day!).padStart(2, '0')}`

  const [yr, mo, dy] = dateStr.split('-').map(Number)
  const dayPillar = calcDayPillar(dateStr)
  const yearPillar = calcYearPillar(yr)
  const monthBranch = MONTH_BRANCH[mo]

  const fiveElements = calcFiveElements(
    dayPillar.stem,
    dayPillar.branch,
    yearPillar.stem,
    yearPillar.branch,
    monthBranch,
  )

  // 사용되지 않는 분해 변수 억제
  void dy

  const sorted = Object.entries(fiveElements).sort((a, b) => b[1] - a[1])
  const dominantElement = sorted[0][0] as Element
  const weakElement = sorted[sorted.length - 1][0] as Element

  const dayGan = dayPillar.stem
  const element = STEM_ELEMENT[dayGan]
  const info = ELEMENT_INFO[element]

  const HIGH_MEMORY_STEMS: HeavenlyStem[] = ['己', '戊', '庚', '辛']
  const AFTERNOON_BRANCHES: EarthlyBranch[] = ['午', '未', '申', '酉']
  const NIGHT_BRANCHES: EarthlyBranch[] = ['戌', '亥', '子', '丑']

  const profile: SajuProfile = {
    dayGan,
    dayBranch: dayPillar.branch,
    dominantElement,
    weakElement,
    fiveElements,
    memoryStrength: HIGH_MEMORY_STEMS.includes(dayGan) ? 'high' : 'medium',
    bestTimeCode: AFTERNOON_BRANCHES.includes(dayPillar.branch)
      ? 'afternoon'
      : NIGHT_BRANCHES.includes(dayPillar.branch)
      ? 'night'
      : 'morning',
    stressType:
      fiveElements['화'] < 1
        ? 'burnout_slow'
        : fiveElements['목'] > 2
        ? 'boredom'
        : 'perfectionism',
  }

  const domTenGod = calcDominantTenGod(
    dayGan,
    yearPillar.stem,
    yearPillar.branch,
    monthBranch,
    dayPillar.branch,
  )

  return {
    birthDate: dateStr,
    dayGan,
    element,
    elementDescription: info.studyTrait,
    ohang: ohangData[element as OhangKey],
    profile,
    wolji: WOLJI_PROFILE[monthBranch],
    sipseong: SIPSEONG_STUDY[domTenGod],
    sipseongGroup: domTenGod,
    persona: calcPersona(element, domTenGod, fiveElements),
  }
}

/** 최적 공부 시간대 한국어 문자열 */
export function getBestTimeLabel(code: SajuProfile['bestTimeCode']): string {
  return { morning: '오전 (6시~11시)', afternoon: '오후 (14시~19시)', night: '야간 (21시~자정)' }[code]
}

/** 스트레스 유형 한국어 문자열 */
export function getStressLabel(type: SajuProfile['stressType']): string {
  return {
    burnout_slow: '서서히 번아웃형',
    boredom: '지루함 이탈형',
    perfectionism: '완벽주의 과부하형',
  }[type]
}
