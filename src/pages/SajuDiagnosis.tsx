import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { calculateSaju } from '@/utils/sajuCalculator'
import { useUserStore } from '@/store/userStore'

const STEPS = [
  { emoji: '🔮', label: '입시 분석 중' },
  { emoji: '🧭', label: '성향 파악 중' },
  { emoji: '📚', label: '학습 스타일 매핑 중' },
  { emoji: '✏️', label: '맞춤 공부법 선정 중' },
  { emoji: '💪', label: '멘탈·체력 전략 수립 중' },
  { emoji: '✅', label: '분석 완료' },
]

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function SajuDiagnosis() {
  const navigate = useNavigate()
  const { userInfo, setSaju } = useUserStore()

  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState<number[]>([])

  useEffect(() => {
    // userInfo 없으면 홈으로
    if (!userInfo) {
      navigate('/', { replace: true })
      return
    }

    async function run() {
      for (let i = 0; i < STEPS.length; i++) {
        setActiveStep(i)
        await delay(500 + Math.random() * 400)
        setDoneSteps((prev) => [...prev, i])
      }

      const [yearStr, monthStr, dayStr] = userInfo!.birthDate.split('-')
      const calc = calculateSaju(parseInt(yearStr), parseInt(monthStr), parseInt(dayStr))
      setSaju(calc)
      navigate('/mbti')
    }

    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!userInfo) return null

  return (
    <div className="max-w-lg mx-auto py-12 text-center space-y-8">
      {/* 스피너 */}
      <div className="relative w-24 h-24 mx-auto">
        <motion.div className="absolute inset-0 rounded-full border-2 border-indigo-200" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-t-indigo-700 border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xl">🧭</div>
      </div>

      <div>
        <p className="font-bold text-indigo-800 text-lg">{userInfo.name}님의 학습 DNA 분석 중...</p>
        <p className="text-sm text-gray-400 mt-1">잠시만 기다려 주세요</p>
      </div>

      {/* 진행 단계 */}
      <div className="w-full max-w-xs mx-auto space-y-2.5">
        {STEPS.map((step, i) => {
          const isDone = doneSteps.includes(i)
          const isActive = i === activeStep && !isDone
          return (
            <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
              isDone ? 'bg-emerald-50 border border-emerald-100' :
              isActive ? 'bg-indigo-50 border border-indigo-200' :
              'bg-gray-50 border border-transparent'
            }`}>
              <span className="text-base">{isDone ? '✅' : isActive ? step.emoji : '⬜'}</span>
              <span className={`text-sm font-medium ${
                isDone ? 'text-emerald-700' : isActive ? 'text-indigo-700' : 'text-gray-300'
              }`}>
                {step.label}
              </span>
              {isActive && (
                <motion.span
                  className="ml-auto text-indigo-400 text-xs"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ···
                </motion.span>
              )}
            </div>
          )
        })}
      </div>

      {/* 전체 프로그레스 바 */}
      <div className="w-full max-w-xs mx-auto">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            animate={{ width: `${(doneSteps.length / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">{doneSteps.length} / {STEPS.length}</p>
      </div>
    </div>
  )
}
