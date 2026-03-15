import { getMbtiCategory } from '@/data/mbtiData'
import type { MbtiCategory } from '@/data/mbtiData'
import type { MbtiType } from '@/types'

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────
export type AxisKey = 'EI' | 'SN' | 'TF' | 'JP'
export type AxisChoice = 'A' | 'B'  // A = E/S/T/J, B = I/N/F/P
export type Answers = Record<number, AxisChoice>

export interface MbtiQuestion {
  id: number
  axis: AxisKey
  text: string
  optionA: string  // E/S/T/J 방향
  optionB: string  // I/N/F/P 방향
}

export interface AxisScore {
  aLetter: string      // 'E', 'S', 'T', 'J'
  bLetter: string      // 'I', 'N', 'F', 'P'
  aLabel: string       // '외향', '감각', '사고', '판단'
  bLabel: string       // '내향', '직관', '감정', '인식'
  aCount: number
  bCount: number
  aPct: number         // 0~100
  bPct: number         // 0~100
  dominant: string     // 'E' or 'I', etc.
  dominantPct: number  // 강도 %
}

export interface MbtiCalculationResult {
  code: MbtiType
  temperament: MbtiCategory
  axes: Record<AxisKey, AxisScore>
}

// ─────────────────────────────────────────────
// 축 메타 정보
// ─────────────────────────────────────────────
const AXIS_META: Record<AxisKey, { a: string; b: string; aLabel: string; bLabel: string }> = {
  EI: { a: 'E', b: 'I', aLabel: '외향', bLabel: '내향' },
  SN: { a: 'S', b: 'N', aLabel: '감각', bLabel: '직관' },
  TF: { a: 'T', b: 'F', aLabel: '사고', bLabel: '감정' },
  JP: { a: 'J', b: 'P', aLabel: '판단', bLabel: '인식' },
}

// 기질별 입시 전형 추천
export const TEMPERAMENT_ADMISSION: Record<MbtiCategory, string[]> = {
  NT: ['논술 전형', '수능위주 전형', '학생부종합 (전공적합성)'],
  NF: ['학생부종합 (성장형)', '면접 비중 높은 전형', '학생부종합 (인성)'],
  SJ: ['학생부교과 전형', '지역균형 전형', '수능최저 충족 전형'],
  SP: ['수능위주 전형', '실기·특기자 전형', '학생부종합 (활동 중심)'],
}

// ─────────────────────────────────────────────
// 20문항 (축별 5문항)
// ─────────────────────────────────────────────
export const MBTI_QUESTIONS: MbtiQuestion[] = [
  // ── EI 축 ──
  {
    id: 1, axis: 'EI',
    text: '공부할 때 선호하는 방식은?',
    optionA: '친구들과 함께 설명하고 토론하며 공부한다',
    optionB: '혼자 조용히 집중해서 공부한다',
  },
  {
    id: 2, axis: 'EI',
    text: '공부 에너지가 떨어질 때 나는?',
    optionA: '사람들과 대화하거나 활동을 하며 충전한다',
    optionB: '혼자 쉬거나 취미 활동으로 조용히 충전한다',
  },
  {
    id: 3, axis: 'EI',
    text: '새로운 개념을 배울 때 나는?',
    optionA: '다른 사람에게 설명하거나 의견을 나누며 이해한다',
    optionB: '혼자 생각하고 노트에 정리하며 이해한다',
  },
  {
    id: 4, axis: 'EI',
    text: '그룹 스터디에서 나의 역할은?',
    optionA: '적극적으로 의견을 내고 토론을 이끈다',
    optionB: '조용히 듣고 나중에 혼자 정리하는 편이다',
  },
  {
    id: 5, axis: 'EI',
    text: '시험 준비 기간에 나는?',
    optionA: '스터디 모임에서 함께 공부할 때 효율이 높다',
    optionB: '혼자 계획을 세워 실천할 때 효율이 높다',
  },

  // ── SN 축 ──
  {
    id: 6, axis: 'SN',
    text: '공부할 때 더 집중하는 것은?',
    optionA: '구체적인 예시, 공식, 사실적 데이터',
    optionB: '전체적인 개념, 이론적 원리, 아이디어의 연결',
  },
  {
    id: 7, axis: 'SN',
    text: '문제를 풀 때 나의 방식은?',
    optionA: '알고 있는 방법을 단계별로 정확히 적용한다',
    optionB: '새로운 접근 방법을 먼저 생각해보고 시도한다',
  },
  {
    id: 8, axis: 'SN',
    text: '공부 노트를 만들 때 나는?',
    optionA: '중요한 내용을 빠짐없이 꼼꼼히 기록한다',
    optionB: '개념들의 연결고리와 핵심 구조를 도식화한다',
  },
  {
    id: 9, axis: 'SN',
    text: '어려운 문제를 만났을 때 나는?',
    optionA: '기본 공식과 개념부터 다시 차근차근 확인한다',
    optionB: '전체 구조를 파악하고 직관적으로 접근해본다',
  },
  {
    id: 10, axis: 'SN',
    text: '선호하는 수업 방식은?',
    optionA: '교과서 내용을 체계적이고 순서대로 설명하는 수업',
    optionB: '다양한 관점으로 생각하게 만드는 심화 토론 수업',
  },

  // ── TF 축 ──
  {
    id: 11, axis: 'TF',
    text: '공부 계획을 세울 때 기준은?',
    optionA: '효율성과 점수 향상 가능성을 객관적으로 계산한다',
    optionB: '공부하면서 의미와 보람을 느낄 수 있는지를 본다',
  },
  {
    id: 12, axis: 'TF',
    text: '성적이 떨어졌을 때 나의 반응은?',
    optionA: '원인을 즉시 분석하고 대책을 논리적으로 세운다',
    optionB: '감정을 먼저 추스른 후 스스로 다독이며 다음을 생각한다',
  },
  {
    id: 13, axis: 'TF',
    text: '과목 선택의 기준은?',
    optionA: '점수 올리기 좋은 전략적 과목을 선택한다',
    optionB: '내가 흥미롭고 의미 있다고 느끼는 과목을 선택한다',
  },
  {
    id: 14, axis: 'TF',
    text: '친구가 공부 고민을 털어놓을 때 나는?',
    optionA: '해결책과 효과적인 공부법을 즉시 조언해준다',
    optionB: '먼저 공감하고 감정을 충분히 들어준다',
  },
  {
    id: 15, axis: 'TF',
    text: '학습 목표를 정할 때 나는?',
    optionA: '구체적인 점수, 등수 같은 객관적 목표를 설정한다',
    optionB: '배움의 즐거움이나 개인적 성장 자체를 목표로 한다',
  },

  // ── JP 축 ──
  {
    id: 16, axis: 'JP',
    text: '공부 계획에 대한 나의 태도는?',
    optionA: '주간 계획을 미리 세우고 반드시 지키려 노력한다',
    optionB: '그날 기분과 상황에 따라 유연하게 조정한다',
  },
  {
    id: 17, axis: 'JP',
    text: '마감이 다가올 때 나는?',
    optionA: '이미 계획대로 진행 중이라 크게 당황하지 않는다',
    optionB: '마감 직전 집중력이 폭발적으로 올라가는 편이다',
  },
  {
    id: 18, axis: 'JP',
    text: '시험 준비 방식은?',
    optionA: '충분한 시간을 두고 체계적으로 단계별 준비한다',
    optionB: '핵심 범위를 파악한 후 중요한 것부터 집중적으로 한다',
  },
  {
    id: 19, axis: 'JP',
    text: '공부 공간에 대해 나는?',
    optionA: '항상 정해진 자리에서 정돈된 환경을 선호한다',
    optionB: '카페, 도서관 등 그날 기분에 맞게 공간을 바꾼다',
  },
  {
    id: 20, axis: 'JP',
    text: '계획이 틀어졌을 때 나는?',
    optionA: '수정된 계획을 즉시 세워 다시 궤도에 올린다',
    optionB: '상황에 맞게 자연스럽게 적응하며 흘러간다',
  },
]

// ─────────────────────────────────────────────
// 핵심 함수: 답변 → MBTI 결과
// ─────────────────────────────────────────────
/**
 * 20문항 답변을 받아 MBTI 코드, 기질, 축별 강도(%)를 반환합니다.
 *
 * @example
 * const result = calcMbtiScore({ 1: 'B', 2: 'B', ... })
 * result.code          // 'INTJ'
 * result.temperament   // 'NT'
 * result.axes.EI.aPct  // 40  (E 40%)
 * result.axes.EI.bPct  // 60  (I 60%)
 */
export function calcMbtiScore(answers: Answers): MbtiCalculationResult {
  const counts: Record<AxisKey, { a: number; b: number }> = {
    EI: { a: 0, b: 0 },
    SN: { a: 0, b: 0 },
    TF: { a: 0, b: 0 },
    JP: { a: 0, b: 0 },
  }

  MBTI_QUESTIONS.forEach((q) => {
    const choice = answers[q.id]
    if (choice === 'A') counts[q.axis].a++
    else if (choice === 'B') counts[q.axis].b++
  })

  const axes = {} as Record<AxisKey, AxisScore>
  const letters: string[] = []

  for (const axis of ['EI', 'SN', 'TF', 'JP'] as AxisKey[]) {
    const meta = AXIS_META[axis]
    const { a, b } = counts[axis]
    const total = a + b || 1
    const aPct = Math.round((a / total) * 100)
    const bPct = 100 - aPct
    const dominant = a >= b ? meta.a : meta.b
    const dominantPct = a >= b ? aPct : bPct

    axes[axis] = {
      aLetter: meta.a,
      bLetter: meta.b,
      aLabel: meta.aLabel,
      bLabel: meta.bLabel,
      aCount: a,
      bCount: b,
      aPct,
      bPct,
      dominant,
      dominantPct,
    }
    letters.push(dominant)
  }

  const code = letters.join('') as MbtiType
  const temperament = getMbtiCategory(code)

  return { code, temperament, axes }
}
