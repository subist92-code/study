import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Anthropic from '@anthropic-ai/sdk'
import { useReadingStore, todayStr, fmtSec } from '@/store/readingStore'

// ── 타입 ──────────────────────────────────────────────────
interface Passage {
  category: string
  title: string
  sentences: string[]
}

interface Question {
  type: 'keyword' | 'context'
  question: string
  options: string[]
  answer: number
  explanation: string
}

// 각 문제를 별도 호출하므로 phase를 세분화
type Phase =
  | 'gen-passage'   // 지문 생성 중
  | 'full-preview'  // 전체 지문 3초 표시
  | 'reading'       // 문장별 읽기
  | 'gen-q'         // 문제 1개 생성 중
  | 'quiz'          // 문제 풀기
  | 'review'        // 전체 지문 + 정답

interface Props {
  apiKey: string
  systemPrompt: string
  userName: string
  grade?: string  // e.g. '고3', '고2', '고1', '중3' ...
  onClose: () => void
  onRestart: () => void
}

// ── 헬퍼 ──────────────────────────────────────────────────
function parseJSON<T>(text: string): T | null {
  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0]) as T
    return null
  } catch {
    return null
  }
}

const CATEGORIES = [
  '문학',          // 현대소설·현대시·고전문학
  '일제강점기문학', // 1920~1945년 소설·시 (윤동주·김소월·이상·현진건 등)
  '시사',
  '과학',
  '역사',
  '철학',
  '경제',
  '환경',
  '의학',
  '예술',
  '심리학',
]

/** 학년별 난이도 가이드 */
function gradeLevelGuide(grade?: string): string {
  if (!grade) return '중·고등학생 수준'
  if (grade === '고3' || grade === '고2') return '고등학교 2~3학년 수준 (수능 지문 수준, 문장당 30~50자, 어휘 및 개념 심화)'
  if (grade === '고1') return '고등학교 1학년 수준 (교과서 지문 수준, 문장당 25~40자)'
  if (grade === '중3') return '중학교 3학년 수준 (교과서 지문 수준, 문장당 20~35자)'
  if (grade === '중2') return '중학교 2학년 수준 (교과서 지문 수준, 문장당 18~30자, 어휘 쉽게)'
  if (grade === '중1') return '중학교 1학년 수준 (교과서 지문 수준, 문장당 15~25자, 쉬운 어휘)'
  return '중·고등학생 수준'
}

/** 카테고리별 추가 지시 */
function categoryGuide(cat: string, grade?: string): string {
  if (cat === '일제강점기문학') {
    return `1920년~1945년 일제강점기 한국 문학 작품을 기반으로 한 지문을 작성하세요.
- 윤동주(서시·별 헤는 밤·자화상), 김소월(진달래꽃·초혼·산유화), 이상(날개·오감도), 현진건(운수 좋은 날·빈처), 이효석(메밀꽃 필 무렵), 나도향, 염상섭 등의 작품 세계를 반영하세요.
- 실제 작품의 분위기·주제·문체를 살려 창작하되 저작권에 문제없는 범위로 재구성하세요.
- 저항·고난·그리움·민족의식 등의 주제가 담기도록 하세요.`
  }
  if (cat === '문학') {
    if (grade === '고3' || grade === '고2') return '수능 문학 영역 수준의 현대소설·현대시·고전시가 지문을 작성하세요. 주제와 표현 기법이 분명해야 합니다.'
    if (grade === '고1') return '고1 교과서 현대문학 작품 수준의 소설 또는 시 지문을 작성하세요.'
    return '중학교 교과서 현대문학(소설·시) 수준의 지문을 작성하세요.'
  }
  if (cat === '역사') {
    if (grade?.startsWith('고')) return '한국사·세계사 교과서 수준의 역사 지문을 작성하세요. 사건의 배경·원인·결과가 포함되어야 합니다.'
    return '중학교 역사 교과서 수준의 지문을 작성하세요.'
  }
  return `${cat} 관련 한국 교과서 수준의 지문을 작성하세요.`
}

function makePassagePrompt(grade?: string): string {
  const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
  const levelGuide = gradeLevelGuide(grade)
  const catGuide = categoryGuide(cat, grade)
  return `카테고리: ${cat}
학년: ${grade ?? '중·고등학생'}

${catGuide}

작성 조건:
- ${levelGuide}
- 8~12문장, 각 문장은 마침표로 끝남
- 학년 수준에 맞는 교과서 중심 어휘 사용
- 흥미롭고 교육적인 내용

JSON만 출력:
{"category":"${cat}","title":"제목","sentences":["문장1","문장2","문장3"]}`
}

function makeQuestionPrompt(type: 'keyword' | 'context', passageText: string): string {
  const desc =
    type === 'keyword'
      ? '지문에서 가장 핵심적인 키워드나 개념을 찾는'
      : '지문의 전체 주제나 요지를 파악하는'
  return `다음 지문을 읽고 "${desc}" 4지선다 문제 1개를 만들어주세요.

[지문]
${passageText}

JSON만 출력 (설명 없이):
{"question":"질문 내용","options":["선택지1","선택지2","선택지3","선택지4"],"answer":0,"explanation":"정답 해설"}`
}

// ── 컴포넌트 ──────────────────────────────────────────────
export default function MunhaeryokReader({ apiKey, systemPrompt, userName, grade, onClose, onRestart }: Props) {
  const { addSession } = useReadingStore()
  const client = useRef(new Anthropic({ apiKey, dangerouslyAllowBrowser: true }))

  const [phase, setPhase] = useState<Phase>('gen-passage')
  const [passage, setPassage] = useState<Passage | null>(null)
  const [sentenceIdx, setSentenceIdx] = useState(0)

  const [questions, setQuestions] = useState<(Question | null)[]>([null])
  const [questionIdx, setQuestionIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | undefined)[]>([undefined])

  const [error, setError] = useState('')
  const startTimeRef = useRef<number>(0)

  // ── 1. 지문 생성 ──
  useEffect(() => {
    async function run() {
      try {
        const res = await client.current.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: makePassagePrompt(grade) }],
        })
        const text = (res.content[0] as { type: string; text: string }).text
        const data = parseJSON<Passage>(text)
        if (!data?.sentences?.length) throw new Error('지문 파싱 실패')
        setPassage(data)
        setPhase('full-preview')
      } catch (e) {
        setError(e instanceof Error ? e.message : '지문 생성 실패')
      }
    }
    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── 2. 전체 미리보기 3초 후 자동 전환 ──
  useEffect(() => {
    if (phase !== 'full-preview') return
    const t = setTimeout(() => {
      setSentenceIdx(0)
      startTimeRef.current = Math.floor(Date.now() / 1000)
      setPhase('reading')
    }, 5000)
    return () => clearTimeout(t)
  }, [phase])

  // ── 3. gen-q 진입 시 해당 문제 생성 ──
  useEffect(() => {
    if (phase !== 'gen-q' || !passage) return
    const type = questionIdx === 0 ? 'keyword' : 'context'
    const passageText = passage.sentences.join(' ')

    async function run() {
      try {
        const res = await client.current.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: systemPrompt,
          messages: [{ role: 'user', content: makeQuestionPrompt(type, passageText) }],
        })
        const text = (res.content[0] as { type: string; text: string }).text
        const data = parseJSON<Omit<Question, 'type'>>(text)
        if (!data?.question || !data.options?.length) throw new Error(`${type} 문제 파싱 실패`)
        const q: Question = { type, ...data }
        setQuestions((prev) => {
          const next = [...prev]
          next[questionIdx] = q
          return next
        })
        setPhase('quiz')
      } catch (e) {
        setError(e instanceof Error ? e.message : '문제 생성 실패')
      }
    }
    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, questionIdx])

  // ── 다음 버튼 ──
  const handleNext = () => {
    if (!passage) return

    if (phase === 'reading') {
      if (sentenceIdx < passage.sentences.length - 1) {
        setSentenceIdx((i) => i + 1)
      } else {
        setQuestionIdx(0)
        setPhase('gen-q')
      }
      return
    }

    if (phase === 'quiz') {
      const durationSec = Math.floor(Date.now() / 1000) - startTimeRef.current
      const qs = questions.filter(Boolean) as Question[]
      const correct = selectedAnswers.filter((a, i) => a === qs[i]?.answer).length
      addSession({
        date: todayStr(),
        durationSec,
        category: passage.category,
        sentenceCount: passage.sentences.length,
        correctCount: correct,
        totalQuestions: qs.length,
      })
      setPhase('review')
    }
  }

  const handleSelectAnswer = (optIdx: number) => {
    if (selectedAnswers[questionIdx] !== undefined) return
    setSelectedAnswers((prev) => {
      const next = [...prev]
      next[questionIdx] = optIdx
      return next
    })
  }

  const currentSentence = passage?.sentences[sentenceIdx] ?? ''
  const totalSentences = passage?.sentences.length ?? 0
  const currentQ = questions[questionIdx]
  const currentAnswer = selectedAnswers[questionIdx]

  return (
    <div className="flex flex-col gap-4 min-h-[500px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <span className="font-bold text-gray-800">문해력 훈련</span>
          {passage && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
              {passage.category}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-sm font-medium">
          ✕ 닫기
        </button>
      </div>

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
          ❌ {error}
          <button onClick={onClose} className="ml-3 underline">닫기</button>
        </div>
      )}

      {/* ── 지문 생성 중 ── */}
      {phase === 'gen-passage' && !error && <Spinner label="지문을 생성하고 있어요..." emoji="📜" />}

      {/* ── 전체 미리보기 (3초) ── */}
      {phase === 'full-preview' && passage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-700 font-semibold text-center">
            📋 지문을 3초간 전체 확인하세요
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-800 mb-3">{passage.title}</p>
            <p className="text-sm text-gray-700 leading-7">{passage.sentences.join(' ')}</p>
          </div>
          <div className="flex justify-center">
            <CountdownBar duration={5} />
          </div>
        </motion.div>
      )}

      {/* ── 문장별 읽기 ── */}
      {phase === 'reading' && passage && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                animate={{ width: `${((sentenceIdx + 1) / totalSentences) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
              {sentenceIdx + 1} / {totalSentences}
            </span>
          </div>
          {/* 고정 높이 카드 — 3줄(약 96px) 기준으로 맞춤 */}
          <div className="relative h-36 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={sentenceIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full bg-white border border-indigo-100 rounded-2xl px-8 py-6 shadow-sm text-center">
                  <p className="text-base text-gray-800 leading-8 font-medium">{currentSentence}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
          >
            {sentenceIdx < totalSentences - 1 ? '다음 →' : '문제 풀기 →'}
          </button>
        </div>
      )}

      {/* ── 문제 생성 중 ── */}
      {phase === 'gen-q' && !error && (
        <Spinner label={`${questionIdx + 1}번 문제를 생성하고 있어요...`} emoji="🧩" />
      )}

      {/* ── 문제 풀기 ── */}
      {phase === 'quiz' && currentQ && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              currentQ.type === 'keyword' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'
            }`}>
              {currentQ.type === 'keyword' ? '핵심 키워드' : '주제 파악'}
            </span>
            <span className="text-xs text-gray-400">1 / 1</span>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 leading-6">{currentQ.question}</p>
          </div>

          <div className="flex flex-col gap-2">
            {currentQ.options.map((opt, i) => {
              const isSelected = currentAnswer === i
              const isCorrect = i === currentQ.answer
              const revealed = currentAnswer !== undefined
              return (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={revealed}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    !revealed
                      ? 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 text-gray-700'
                      : isCorrect
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : isSelected
                          ? 'border-red-300 bg-red-50 text-red-600'
                          : 'border-gray-100 bg-gray-50 text-gray-400'
                  }`}
                >
                  {revealed && isCorrect && '✓ '}
                  {revealed && isSelected && !isCorrect && '✗ '}
                  {opt}
                </button>
              )
            })}
          </div>

          {currentAnswer !== undefined && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
                💡 {currentQ.explanation}
              </div>
              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
              >
                결과 보기 →
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* ── 리뷰 ── */}
      {phase === 'review' && passage && (
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl p-5 text-white text-center">
            <p className="text-xs font-semibold opacity-75 mb-1">{userName}님의 결과</p>
            <p className="text-4xl font-black">
              {selectedAnswers[0] === questions[0]?.answer ? '정답' : '오답'}
            </p>
            <p className="text-xs opacity-75 mt-1">
              소요 시간: {fmtSec(Math.floor(Date.now() / 1000) - startTimeRef.current)}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 mb-2">📋 전체 지문</p>
            <p className="text-sm font-bold text-gray-800 mb-2">{passage.title}</p>
            <p className="text-sm text-gray-700 leading-7">{passage.sentences.join(' ')}</p>
          </div>

          <div className="flex flex-col gap-3">
            {(questions.filter(Boolean) as Question[]).map((q, qi) => (
              <div key={qi} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold ${selectedAnswers[qi] === q.answer ? 'text-emerald-600' : 'text-red-500'}`}>
                    {selectedAnswers[qi] === q.answer ? '✓ 정답' : '✗ 오답'}
                  </span>
                  <span className="text-xs text-gray-400">{q.type === 'keyword' ? '핵심 키워드' : '주제 파악'}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 mb-1">{q.question}</p>
                <p className="text-xs text-emerald-700 font-semibold mb-1">정답: {q.options[q.answer]}</p>
                <p className="text-xs text-gray-500">{q.explanation}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors"
            >
              채팅으로
            </button>
            <button
              onClick={onRestart}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
            >
              📖 문해력 더하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── 서브 컴포넌트 ──────────────────────────────────────────
function Spinner({ label, emoji }: { label: string; emoji: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="text-4xl"
      >
        {emoji}
      </motion.div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}

function CountdownBar({ duration }: { duration: number }) {
  return (
    <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-amber-400 rounded-full"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration, ease: 'linear' }}
      />
    </div>
  )
}
