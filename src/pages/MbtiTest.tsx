import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MBTI_QUESTIONS, calcMbtiScore } from '@/utils/mbtiCalculator'
import type { AxisChoice, Answers, MbtiCalculationResult, AxisScore, AxisKey } from '@/utils/mbtiCalculator'
import { mbtiTypes, getMbtiCategory } from '@/data/mbtiData'
import { useUserStore } from '@/store/userStore'
import type { MbtiType, VakType } from '@/types'

// ─────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────
const TOTAL = MBTI_QUESTIONS.length  // 20

const ALL_MBTI_TYPES: MbtiType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

const fade = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -16 },
  transition: { duration: 0.28 },
}

/** 직접 입력 시 축별 강도를 코드에서 추정 (우세 쪽 60%) */
function makeMbtiResultFromCode(code: MbtiType): MbtiCalculationResult {
  const letters = code.split('')  // ['I','N','T','J']
  const axes: Record<AxisKey, AxisScore> = {
    EI: buildAxisScore('EI', 'E', 'I', '외향', '내향', letters[0]),
    SN: buildAxisScore('SN', 'S', 'N', '감각', '직관', letters[1]),
    TF: buildAxisScore('TF', 'T', 'F', '사고', '감정', letters[2]),
    JP: buildAxisScore('JP', 'J', 'P', '판단', '인식', letters[3]),
  }
  return { code, temperament: getMbtiCategory(code), axes }
}

function buildAxisScore(
  _axis: AxisKey, aLetter: string, bLetter: string,
  aLabel: string, bLabel: string, dominant: string,
): AxisScore {
  const isDomA = dominant === aLetter
  return {
    aLetter, bLetter, aLabel, bLabel,
    aCount: isDomA ? 3 : 2,
    bCount: isDomA ? 2 : 3,
    aPct:   isDomA ? 60 : 40,
    bPct:   isDomA ? 40 : 60,
    dominant,
    dominantPct: 60,
  }
}

// ─────────────────────────────────────────────
// VAK 문항 데이터
// ─────────────────────────────────────────────
interface VakQuestion {
  id: number
  text: string
  options: { type: VakType; label: string }[]
}

const VAK_QUESTIONS: VakQuestion[] = [
  {
    id: 1,
    text: '내일이 한국사 시험입니다. 당장 벼락치기를 해야 할 때 당신의 행동은?',
    options: [
      { type: 'V', label: '교과서를 펼치고 형광펜으로 색깔을 칠하거나, 핵심 키워드를 마인드맵으로 그린다.' },
      { type: 'A', label: '인강을 빠른 배속으로 틀어놓거나, 허공을 보며 내 목소리로 중얼거리며 외운다.' },
      { type: 'K', label: '이면지를 꺼내서 잉크가 닳도록 빽빽하게 쓰거나, 방 안을 돌아다니며 몸을 움직인다.' },
    ],
  },
  {
    id: 2,
    text: '처음 가보는 식당의 와이파이 비밀번호(영어+숫자 조합)를 외워서 내 자리로 돌아가야 합니다. 어떻게 기억하나요?',
    options: [
      { type: 'V', label: '비밀번호가 적힌 종이의 글자 모양이나 배열을 머릿속에 사진 찍듯 캡처한다.' },
      { type: 'A', label: '"에이, 칠, 비, 삼..." 하면서 입으로 소리 내어 리듬감 있게 반복하며 걸어간다.' },
      { type: 'K', label: '스마트폰 키패드를 꺼내 허공에 손가락으로 타자를 쳐보며 손의 감각으로 익힌다.' },
    ],
  },
  {
    id: 3,
    text: '새로 산 복잡한 이케아 가구를 조립해야 합니다. 박스를 뜯고 가장 먼저 하는 행동은?',
    options: [
      { type: 'V', label: '조립 설명서의 그림과 도면을 처음부터 끝까지 꼼꼼하게 눈으로 훑어본다.' },
      { type: 'A', label: '설명서를 대충 보고, 유튜브에서 조립 설명 영상(소리)을 찾아 틀어놓는다.' },
      { type: 'K', label: '일단 나사와 부품을 손에 쥐고 이리저리 직접 끼워보며 감을 잡는다.' },
    ],
  },
]

function calcVakResult(scores: Record<VakType, number>): VakType {
  return (['V', 'A', 'K'] as VakType[]).reduce((best, cur) =>
    scores[cur] > scores[best] ? cur : best
  )
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
type Step = 'intro' | 'direct' | 'quiz' | 'vak'

export default function MbtiTest() {
  const navigate = useNavigate()
  const { setMbti, setVak } = useUserStore()

  const [step, setStep]           = useState<Step>('intro')
  const [current, setCurrent]     = useState(0)
  const [answers, setAnswers]     = useState<Answers>({})
  const [_result, setResult]       = useState<MbtiCalculationResult | null>(null)
  const [vakCurrent, setVakCurrent]   = useState(0)
  const [vakAnswers, setVakAnswers]   = useState<(VakType | null)[]>([null, null, null])

  const q        = MBTI_QUESTIONS[current]
  const progress = Math.round((current / TOTAL) * 100)

  function handleDirectSelect(code: MbtiType) {
    setMbti(code)
    setResult(makeMbtiResultFromCode(code))
    setStep('vak')
  }

  function handleAnswer(choice: AxisChoice) {
    const next = { ...answers, [q.id]: choice }
    setAnswers(next)

    if (current + 1 < TOTAL) {
      setCurrent(current + 1)
    } else {
      const r = calcMbtiScore(next)
      setMbti(r.code)
      setResult(r)
      setStep('vak')
    }
  }

  function handleBack() {
    if (current > 0) setCurrent(current - 1)
  }

  function handleVakAnswer(type: VakType) {
    const next = [...vakAnswers] as (VakType | null)[]
    next[vakCurrent] = type
    setVakAnswers(next)

    if (vakCurrent + 1 < VAK_QUESTIONS.length) {
      setVakCurrent(vakCurrent + 1)
    } else {
      const scores: Record<VakType, number> = { V: 0, A: 0, K: 0 }
      next.forEach((t) => { if (t) scores[t]++ })
      const vakResult = calcVakResult(scores)
      setVak(vakResult)
      navigate('/report')
    }
  }

  if (step === 'vak') {
    const q = VAK_QUESTIONS[vakCurrent]
    const vakProgress = Math.round((vakCurrent / VAK_QUESTIONS.length) * 100)
    return (
      <div className="max-w-lg mx-auto py-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-indigo-900">학습 감각 유형 검사</h1>
          <p className="text-sm text-gray-400">3문항으로 나의 학습 채널을 파악합니다</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{vakCurrent + 1} / {VAK_QUESTIONS.length}</span>
            <span>{vakProgress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-violet-500 rounded-full"
              animate={{ width: `${vakProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={vakCurrent} {...fade}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full">
                  Q{q.id}
                </span>
              </div>
              <p className="text-base font-semibold text-gray-800 leading-relaxed">{q.text}</p>
              <div className="space-y-3">
                {q.options.map((opt) => {
                  const selected = vakAnswers[vakCurrent] === opt.type
                  return (
                    <button
                      key={opt.type}
                      onClick={() => handleVakAnswer(opt.type)}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm leading-relaxed transition-all duration-150 ${
                        selected
                          ? 'border-violet-500 bg-violet-50 text-violet-800 font-semibold'
                          : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-violet-300 hover:bg-violet-50/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {vakCurrent > 0 && (
          <button
            onClick={() => setVakCurrent(vakCurrent - 1)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors mx-auto block"
          >
            ← 이전 문항
          </button>
        )}
      </div>
    )
  }

  // ── 인트로: MBTI 알고 있나요? ──
  if (step === 'intro') {
    return (
      <div className="max-w-lg mx-auto py-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-indigo-900">MBTI 학습 유형 검사</h1>
          <p className="text-sm text-gray-400">나의 학습 성향을 파악합니다</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <p className="text-base font-semibold text-gray-800 text-center">
            본인의 MBTI를 알고 있나요?
          </p>

          <button
            onClick={() => setStep('direct')}
            className="w-full px-5 py-4 rounded-xl border-2 border-indigo-200 bg-indigo-50 text-indigo-800 font-semibold text-sm hover:border-indigo-400 transition-all"
          >
            네, 알고 있어요 → 직접 입력할게요
          </button>

          <button
            onClick={() => setStep('quiz')}
            className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-700 font-semibold text-sm hover:border-indigo-200 hover:bg-indigo-50/50 transition-all"
          >
            잘 모르겠어요 → 20문항 검사할게요
          </button>
        </div>
      </div>
    )
  }

  // ── 직접 입력: 16종 선택 ──
  if (step === 'direct') {
    return (
      <div className="max-w-lg mx-auto py-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-indigo-900">MBTI 선택</h1>
          <p className="text-sm text-gray-400">본인의 MBTI 유형을 선택해 주세요</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {ALL_MBTI_TYPES.map((code) => {
            const profile = mbtiTypes[code]
            return (
              <button
                key={code}
                onClick={() => handleDirectSelect(code)}
                className="flex flex-col items-center gap-1 py-3 rounded-xl border-2 border-gray-100 bg-white hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
              >
                <span className="text-xl">{profile.emoji}</span>
                <span className="text-xs font-bold text-gray-800">{code}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => setStep('intro')}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors mx-auto block"
        >
          ← 돌아가기
        </button>
      </div>
    )
  }

  // ── 20문항 검사 ──
  return (
    <div className="max-w-lg mx-auto py-8 space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-indigo-900">MBTI 학습 유형 검사</h1>
        <p className="text-sm text-gray-400">20문항으로 나의 학습 성향을 파악합니다</p>
      </div>

      {/* 프로그레스 바 */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{current + 1} / {TOTAL}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-600 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 문항 카드 */}
      <AnimatePresence mode="wait">
        <motion.div key={current} {...fade}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
                {q.axis} 축
              </span>
              <span className="text-xs text-gray-300">Q{q.id}</span>
            </div>

            <p className="text-base font-semibold text-gray-800 leading-relaxed">{q.text}</p>

            <div className="space-y-3">
              <OptionButton
                label={q.optionA}
                selected={answers[q.id] === 'A'}
                onClick={() => handleAnswer('A')}
              />
              <OptionButton
                label={q.optionB}
                selected={answers[q.id] === 'B'}
                onClick={() => handleAnswer('B')}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {current > 0 ? (
        <button
          onClick={handleBack}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors mx-auto block"
        >
          ← 이전 문항
        </button>
      ) : (
        <button
          onClick={() => setStep('intro')}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors mx-auto block"
        >
          ← 돌아가기
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 서브 컴포넌트
// ─────────────────────────────────────────────
function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm leading-relaxed transition-all duration-150 ${
        selected
          ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-semibold'
          : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50/50'
      }`}
    >
      {label}
    </button>
  )
}

