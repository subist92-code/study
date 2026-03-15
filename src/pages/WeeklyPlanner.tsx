import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '@/store/userStore'
import { ohangData } from '@/data/ohangData'

const DAYS = [
  { key: 'mon', label: '월요일', short: '월' },
  { key: 'tue', label: '화요일', short: '화' },
  { key: 'wed', label: '수요일', short: '수' },
  { key: 'thu', label: '목요일', short: '목' },
  { key: 'fri', label: '금요일', short: '금' },
  { key: 'sat', label: '토요일', short: '토' },
  { key: 'sun', label: '일요일', short: '일' },
] as const

const DAY_COLOR: Record<string, string> = {
  mon: 'bg-indigo-600',
  tue: 'bg-blue-600',
  wed: 'bg-cyan-600',
  thu: 'bg-teal-600',
  fri: 'bg-violet-600',
  sat: 'bg-orange-500',
  sun: 'bg-rose-500',
}

export default function WeeklyPlanner() {
  const navigate = useNavigate()
  const { saju, userInfo } = useUserStore()

  if (!saju) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="text-5xl">📅</div>
        <p className="text-gray-500 text-sm">먼저 진단을 완료해주세요.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-800 transition-colors"
        >
          시작하러 가기
        </button>
      </div>
    )
  }

  const element = saju.element
  const data = ohangData[element]
  const weekPlan = data.weekPlan

  // 오늘 요일 (0=일,1=월,...6=토)
  const todayIdx = new Date().getDay()
  const todayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][todayIdx]

  return (
    <div className="max-w-lg mx-auto py-8 space-y-4">
      {/* 헤더 */}
      <div className="text-center space-y-1">
        <span className="inline-block bg-indigo-700 text-white text-xs font-bold px-4 py-1 rounded-full tracking-widest">
          주간 플래너
        </span>
        <h2 className="text-2xl font-bold text-indigo-900">
          {userInfo.name ? `${userInfo.name}님의 ` : ''}{data.name} 주간 루틴
        </h2>
        <p className="text-sm text-gray-400">{data.emoji} {data.name} 유형 맞춤 주간 학습 계획</p>
      </div>

      {/* 오늘 하이라이트 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-indigo-700 rounded-2xl p-5 text-white"
      >
        <div className="text-xs font-bold opacity-70 tracking-widest mb-1">TODAY</div>
        <div className="text-lg font-bold mb-2">
          {DAYS.find((d) => d.key === todayKey)?.label ?? '오늘'}의 학습 목표
        </div>
        <div className="bg-white/20 rounded-xl px-4 py-3 text-sm leading-relaxed">
          {weekPlan[todayKey as keyof typeof weekPlan]}
        </div>
      </motion.div>

      {/* 주간 전체 플랜 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h3 className="text-sm font-bold text-indigo-800">📅 이번 주 전체 플랜</h3>
        <div className="space-y-2">
          {DAYS.map((day, i) => {
            const isToday = day.key === todayKey
            const plan = weekPlan[day.key]
            return (
              <motion.div
                key={day.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  isToday ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg ${DAY_COLOR[day.key]} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {day.short}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-gray-500">{day.label}</span>
                    {isToday && (
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">오늘</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{plan}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 학습 팁 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h3 className="text-sm font-bold text-indigo-800">💡 {data.name} 유형 학습 팁</h3>
        <div className="space-y-2">
          {data.characteristics.map((c) => (
            <div key={c} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-2" />
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => navigate('/study')}
          className="w-full border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          ← 학습법 다시 보기
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 py-3 rounded-xl text-sm transition-colors"
        >
          홈으로
        </button>
      </div>
    </div>
  )
}
