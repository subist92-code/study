import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '@/store/userStore'
import { ohangData } from '@/data/ohangData'
import { ELEMENT_INFO } from '@/utils/sajuCalculator'
import { learningMethods, matchingMatrix, getTemperament } from '@/data/studyMethodData'

export default function StudyMethod() {
  const navigate = useNavigate()
  const { saju, userInfo, mbti } = useUserStore()

  if (!saju) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="text-5xl">🧭</div>
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
  const info = ELEMENT_INFO[element]
  const temperament = mbti ? getTemperament(mbti) : null
  const matchedMethodKeys = temperament ? matchingMatrix[element]?.[temperament] ?? [] : []
  const matchedMethods = matchedMethodKeys.map((k) => learningMethods[k])

  const THEME: Record<string, { bg: string; badge: string; border: string }> = {
    목: { bg: 'bg-emerald-700', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', border: 'border-emerald-200' },
    화: { bg: 'bg-red-700',     badge: 'bg-red-50 text-red-800 border-red-200',             border: 'border-red-200' },
    토: { bg: 'bg-amber-700',   badge: 'bg-amber-50 text-amber-800 border-amber-200',       border: 'border-amber-200' },
    금: { bg: 'bg-slate-700',   badge: 'bg-slate-50 text-slate-800 border-slate-200',       border: 'border-slate-200' },
    수: { bg: 'bg-blue-700',    badge: 'bg-blue-50 text-blue-800 border-blue-200',          border: 'border-blue-200' },
  }
  const theme = THEME[element]

  return (
    <div className="max-w-lg mx-auto py-8 space-y-4">
      {/* 헤더 */}
      <div className="text-center space-y-1">
        <span className="inline-block bg-indigo-700 text-white text-xs font-bold px-4 py-1 rounded-full tracking-widest">
          학습법 매칭
        </span>
        <h2 className="text-2xl font-bold text-indigo-900">
          {userInfo?.name ? `${userInfo.name}님의 ` : ''}{data.name} 학습 전략
        </h2>
      </div>

      {/* 오행 히어로 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.bg} rounded-2xl p-6 text-white relative overflow-hidden`}
      >
        <div className="absolute right-4 top-4 text-6xl opacity-20">{data.emoji}</div>
        <div className="text-4xl mb-3">{data.emoji}</div>
        <div className="text-xl font-bold mb-1">{data.name} 유형</div>
        <div className="text-sm opacity-90 mb-3">{info.studyTrait}</div>
        <div className="flex flex-wrap gap-2">
          {data.characteristics.map((c) => (
            <span key={c} className="bg-white/20 border border-white/25 rounded-full px-3 py-1 text-xs">{c}</span>
          ))}
        </div>
      </motion.div>

      {/* 추천 공부법 */}
      <Section title="📚 추천 공부법 TOP 3">
        <div className="space-y-3">
          {data.bestMethods.map((method, i) => (
            <motion.div
              key={method}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className={`w-7 h-7 rounded-lg ${theme.bg} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-gray-800">{method}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 오행×MBTI 매칭 학습법 상세 카드 */}
      {matchedMethods.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-indigo-800 px-1">
            🔬 {mbti} 맞춤 학습법 상세
          </h3>
          {matchedMethods.map((method, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4"
            >
              {/* 헤더 */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.emoji}</span>
                <div>
                  <div className="font-bold text-gray-800">{method.name}</div>
                  <div className="text-xs text-gray-400">{method.subtitle}</div>
                </div>
                <span className="ml-auto text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{ backgroundColor: method.color }}>
                  #{i + 1} 추천
                </span>
              </div>
              {/* 설명 */}
              <p className="text-sm text-gray-600 leading-relaxed">{method.description}</p>
              {/* 단계 */}
              <div className="space-y-2">
                {method.steps.map((s) => (
                  <div key={s.step} className="flex gap-3 text-sm">
                    <span
                      className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: method.color }}
                    >
                      {s.step}
                    </span>
                    <div>
                      <span className="font-semibold text-gray-700">{s.title} · </span>
                      <span className="text-gray-500">{s.content}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* 실전 팁 */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-600 leading-relaxed">
                💡 <span className="font-semibold">실전 팁: </span>{method.practicalTip}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 강점 / 약점 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-1">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">강점</div>
          <div className="text-sm text-gray-700 leading-relaxed">{data.strengths}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-1">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">보완 포인트</div>
          <div className="text-sm text-gray-700 leading-relaxed">{data.weaknesses}</div>
        </div>
      </div>

      {/* 공부 환경 & 음악 */}
      <Section title="🏡 최적 공부 환경">
        <InfoRow icon="🪴" label="환경" value={data.studyEnv} />
        <InfoRow icon="🎵" label="음악" value={data.music} />
      </Section>

      {/* 입시 전형 추천 */}
      <Section title="🏛️ 추천 입시 전형">
        <div className="flex flex-wrap gap-2">
          {data.admissionFit.map((fit) => (
            <span key={fit} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${theme.badge}`}>
              {fit}
            </span>
          ))}
        </div>
      </Section>


{/* 버튼 */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => navigate('/planner')}
          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3.5 rounded-xl transition-colors"
        >
          다음 단계: 주간 플래너 →
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 py-3 rounded-xl text-sm transition-colors"
        >
          ↩ 다시 분석하기
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
      <h3 className="text-sm font-bold text-indigo-800">{title}</h3>
      {children}
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-3 items-start text-sm">
      <span className="text-base flex-shrink-0">{icon}</span>
      <div>
        <span className="font-semibold text-gray-500 text-xs">{label} · </span>
        <span className="text-gray-700">{value}</span>
      </div>
    </div>
  )
}
