import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { ohangData, type OhangKey } from '@/data/ohangData'
import { mbtiTypes, mbtiCategories, getMbtiCategory } from '@/data/mbtiData'
import { learningMethods, matchingMatrix, getTemperament } from '@/data/studyMethodData'
import { runMasterEngine } from '@/data/masterEngineData'

// 대입 전형 교집합 도출
function getAdmissionFit(ohang: OhangKey, mbtiCode: string): string[] {
  const ohangFit = [...ohangData[ohang].admissionFit]
  const category = getMbtiCategory(mbtiCode)

  const mbtiAdmissionMap: Record<string, string[]> = {
    NT: ['논술 전형', '수능위주 전형', '학생부종합 (전공적합성)'],
    NF: ['학생부종합 (성장형)', '면접 전형', '자기소개서 비중 높은 전형'],
    SJ: ['학생부교과 전형', '수능위주 전형', '지역균형 전형'],
    SP: ['수능위주 전형', '실기 전형', '게임화 가능 전형'],
  }

  const mbtiList = mbtiAdmissionMap[category] ?? []

  // 교집합 우선, 없으면 각각 상위 1개씩 합산
  const intersection = ohangFit.filter((item) => mbtiList.includes(item))
  if (intersection.length > 0) return intersection

  const combined = [...new Set([...ohangFit.slice(0, 2), ...mbtiList.slice(0, 1)])]
  return combined
}

export default function DiagnosisReport() {
  const navigate = useNavigate()
  const { saju, mbti, vak } = useUserStore()
  const [copied, setCopied] = useState(false)

  // 데이터 미완성 시 안내
  if (!saju || !mbti) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-6xl">📊</div>
        <h1 className="text-2xl font-bold text-gray-800">진단이 완료되지 않았어요</h1>
        <p className="text-gray-500 text-center">
          MBTI 테스트를 완료해야<br />통합 리포트를 볼 수 있어요.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/mbti')}
            className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
          >
            MBTI 테스트하기
          </button>
        </div>
      </div>
    )
  }

  const ohang = ohangData[saju.element as OhangKey]
  const mbtiProfile = mbtiTypes[mbti]
  const temperament = getTemperament(mbti)
  const categoryInfo = mbtiCategories[temperament]
  const methodKeys = matchingMatrix[saju.element]?.[temperament] ?? []
  const methods = methodKeys.map((k) => learningMethods[k]).filter(Boolean)
  const admissionFit = getAdmissionFit(saju.element as OhangKey, mbti)

  // 삼각편대 마스터 엔진 (VAK 완료 시)
  const masterResult = vak
    ? runMasterEngine(saju.element, saju.sipseongGroup, mbti, vak)
    : null

  const handleCopy = async () => {
    const text = [
      `🔮 나의 학습 성향 리포트`,
      ``,
      `성향: ${ohang.name} ${ohang.emoji}`,
      `MBTI: ${mbtiProfile.code} ${mbtiProfile.name} ${mbtiProfile.emoji}`,
      `기질: ${categoryInfo.name}(${temperament}) ${categoryInfo.emoji}`,
      ``,
      `✨ 추천 학습법`,
      ...methods.map((m, i) => `${i + 1}. ${m.name} — ${m.practicalTip}`),
      ``,
      `🎓 추천 대입 전형`,
      ...admissionFit.map((f) => `· ${f}`),
      ``,
      `by 나침판 학습 진단`,
    ].join('\n')

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">

      {/* 헤더 */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-400 mb-1">MBTI × VAK 통합 분석</p>
        <h1 className="text-3xl font-bold text-gray-900">나의 학습 성향 리포트</h1>
      </div>

      {/* ── 삼각편대 마스터 코칭 (VAK 완료 시) ── */}
      {masterResult && (
        <section className="rounded-2xl overflow-hidden shadow-sm border border-violet-200">
          {/* 헤더 배너 */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">⚡</span>
              <h2 className="text-base font-bold text-white">삼각편대 마스터 코칭</h2>
              <span className="ml-auto text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-semibold">
                MBTI × VAK
              </span>
            </div>
            <p className="text-xs text-violet-200">
              {masterResult.userInfo.personaSummary}
            </p>
          </div>

          <div className="bg-white p-5 space-y-4">
            {/* 페르소나 요약 배지 */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">
                🔮 {masterResult.raw.sajuTitle}
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700">
                🧠 {masterResult.raw.mbtiTitle} ({masterResult.raw.mbtiTemperament})
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-100 text-violet-700">
                👁 {masterResult.raw.vakTitle}
              </span>
            </div>

            {/* 3단계 코칭 전략 */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">3단계 맞춤 코칭 전략</p>

              <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                <span className="text-lg flex-shrink-0">🔥</span>
                <div>
                  <p className="text-xs font-bold text-orange-700 mb-0.5">STEP 1 · 동기부여 & 시작</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{masterResult.coachingStrategy.step1Motivation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <span className="text-lg flex-shrink-0">🧘</span>
                <div>
                  <p className="text-xs font-bold text-blue-700 mb-0.5">STEP 2 · 환경 & 심화 몰입</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{masterResult.coachingStrategy.step2DeepFocus}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <span className="text-lg flex-shrink-0">✍️</span>
                <div>
                  <p className="text-xs font-bold text-green-700 mb-0.5">STEP 3 · 암기 & 실전 스킬</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{masterResult.coachingStrategy.step3ActionPlan}</p>
                </div>
              </div>
            </div>

            {/* 멘탈 케어 */}
            <div
              className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${
                masterResult.mentalCare.isConflict
                  ? 'bg-red-50 border-red-100'
                  : 'bg-emerald-50 border-emerald-100'
              }`}
            >
              <span className="text-lg flex-shrink-0">
                {masterResult.mentalCare.isConflict ? '🚨' : '✨'}
              </span>
              <div>
                <p className={`text-xs font-bold mb-0.5 ${
                  masterResult.mentalCare.isConflict ? 'text-red-700' : 'text-emerald-700'
                }`}>
                  {masterResult.mentalCare.isConflict ? '딜레마 해결' : '시너지 효과'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {masterResult.mentalCare.message}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 학습자 유형 카드 ── */}
      <section
        className="rounded-2xl p-6 shadow-sm border"
        style={{
          background: `linear-gradient(135deg, ${ohang.color}18 0%, ${ohang.color}08 100%)`,
          borderColor: `${ohang.color}30`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{ohang.emoji}</span>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">학습자 유형</p>
            <h2 className="text-xl font-bold" style={{ color: ohang.color }}>
              {ohang.learnerType}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{ohang.learnerCore}</p>
          </div>
        </div>
        <ul className="flex flex-col gap-2 mb-4">
          {ohang.characteristics.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ohang.color }} />
              {c}
            </li>
          ))}
        </ul>
        <div
          className="text-xs px-3 py-2 rounded-xl font-medium"
          style={{ background: `${ohang.color}12`, color: ohang.color }}
        >
          💪 핵심 강점: {ohang.strengths}
        </div>
      </section>

      {/* ── 학습 능력 프로파일 ── */}
      <section className="rounded-2xl p-6 shadow-sm border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">🧠</span>
          <h2 className="text-lg font-bold text-gray-800">학습 능력 프로파일</h2>
        </div>

        {/* 강점 능력 3가지 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {ohang.learningAbilities.map((ab, i) => (
            <div key={i} className="bg-white rounded-xl p-3 text-center shadow-sm border border-blue-100">
              <div className="text-2xl mb-1">{ab.icon}</div>
              <p className="text-xs font-bold text-indigo-800 mb-1">{ab.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{ab.desc}</p>
            </div>
          ))}
        </div>

        {/* 보완 영역 */}
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl p-3">
          <span className="text-xl flex-shrink-0">{ohang.weakAbility.icon}</span>
          <div>
            <p className="text-xs font-bold text-orange-700 mb-0.5">보완이 필요한 영역 · {ohang.weakAbility.title}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{ohang.weakAbility.desc}</p>
          </div>
        </div>
      </section>

      {/* ── 공부 취향 분석 ── */}
      <section className="rounded-2xl p-6 shadow-sm border border-amber-100 bg-gradient-to-br from-amber-50 to-white">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">❤️</span>
          <h2 className="text-lg font-bold text-gray-800">공부 취향 분석</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-xl p-3 border border-amber-100">
            <p className="text-xs font-bold text-amber-700 mb-1">🏠 최적 공부 환경</p>
            <p className="text-xs text-gray-600 leading-relaxed">{ohang.studyPreference.environment}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-amber-100">
            <p className="text-xs font-bold text-amber-700 mb-1">📚 선호 공부 방식</p>
            <p className="text-xs text-gray-600 leading-relaxed">{ohang.studyPreference.method}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-green-100">
            <p className="text-xs font-bold text-green-700 mb-1">🔥 의욕 UP 요인</p>
            <p className="text-xs text-gray-600 leading-relaxed">{ohang.studyPreference.energizer}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-red-100">
            <p className="text-xs font-bold text-red-700 mb-1">❄️ 의욕 DOWN 요인</p>
            <p className="text-xs text-gray-600 leading-relaxed">{ohang.studyPreference.killer}</p>
          </div>
        </div>
      </section>

      {/* ── 나만의 학습 페르소나 ── */}
      {saju.persona && (
        <section className="rounded-2xl p-6 shadow-sm border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">🎭</span>
            <h2 className="text-lg font-bold text-gray-800">나만의 학습 페르소나</h2>
          </div>

          {/* 페르소나 메인 카드 */}
          <div className="bg-white rounded-2xl border border-indigo-100 p-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{saju.persona.persona.emoji}</span>
              <div>
                <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide mb-0.5">학습 유형</p>
                <h3 className="text-xl font-bold text-indigo-900">{saju.persona.persona.title}</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {saju.persona.persona.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700"
                >
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed bg-indigo-50 rounded-xl px-4 py-3">
              {saju.persona.persona.guide}
            </p>
          </div>

          {/* 처방 (있는 경우만) */}
          {saju.persona.troubles.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-orange-600 flex items-center gap-1">
                <span>⚠️</span> 지금 주의해야 할 패턴
              </p>
              {saju.persona.troubles.map((t, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3"
                >
                  <span className="text-orange-400 font-bold text-sm flex-shrink-0">!</span>
                  <p className="text-xs text-gray-700 leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── 월지 에너지 + 십성 동기 유형 ── */}
      <section className="rounded-2xl p-6 shadow-sm border border-purple-100 bg-gradient-to-br from-purple-50 to-white">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">⚡</span>
          <h2 className="text-lg font-bold text-gray-800">에너지 패턴 & 동기 유형</h2>
        </div>

        <div className="flex flex-col gap-3">
          {/* 월지 에너지 */}
          {saju.wolji && (
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-purple-700">🌙 에너지 패턴</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">
                  {saju.wolji.energy}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{saju.wolji.trait}</p>
              <p className="text-xs text-purple-600 font-medium">⏰ {saju.wolji.peak}</p>
            </div>
          )}

          {/* 십성 동기 유형 */}
          {saju.sipseong && (
            <div className="bg-white rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-indigo-700">🎯 학습 동기 유형</span>
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                  {saju.sipseong.trait}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-semibold text-green-700">강점: </span>{saju.sipseong.strength}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-semibold text-orange-600">약점: </span>{saju.sipseong.weakness}
              </p>
              <div className="bg-indigo-50 rounded-lg px-3 py-2 text-xs text-indigo-700">
                💡 {saju.sipseong.studyHint}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 성향 인사이트 ── */}
      <section className="rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">💡</span>
          <h2 className="text-lg font-bold text-gray-800">성향 인사이트</h2>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-xs font-bold text-yellow-700 mb-1">⭐ 나만의 특별한 강점</p>
            <p className="text-sm text-gray-700 leading-relaxed">{ohang.personalityInsight.unique}</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-bold text-red-600 mb-1">⚠️ 주의해야 할 패턴</p>
            <ul className="flex flex-col gap-1">
              {ohang.warningPatterns.map((w, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-700 mb-1">🚀 성장을 위한 핵심 조언</p>
            <p className="text-sm text-gray-700 leading-relaxed">{ohang.personalityInsight.growth}</p>
          </div>
        </div>
      </section>

      {/* MBTI 기질 카드 */}
      <section
        className="rounded-2xl p-6 shadow-sm border"
        style={{
          background: `linear-gradient(135deg, ${mbtiProfile.color}18 0%, ${mbtiProfile.color}08 100%)`,
          borderColor: `${mbtiProfile.color}30`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{mbtiProfile.emoji}</span>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">MBTI 기질</p>
            <h2 className="text-xl font-bold" style={{ color: mbtiProfile.color }}>
              {mbtiProfile.code} · {mbtiProfile.name}
            </h2>
          </div>
          <span
            className="ml-auto text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: `${categoryInfo.color}22`, color: categoryInfo.color }}
          >
            {categoryInfo.emoji} {categoryInfo.name}({temperament})
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-3">{mbtiProfile.description}</p>
        <div className="flex flex-wrap gap-2">
          {mbtiProfile.studyStrengths.map((s, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: `${mbtiProfile.color}15`, color: mbtiProfile.color }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* 추천 학습법 카드 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">✨</span>
          <h2 className="text-lg font-bold text-gray-800">추천 학습법</h2>
          <span className="text-xs text-gray-400 ml-1">
            {ohang.name} × {temperament} 조합
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {methods.map((method, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-5 shadow-sm border"
              style={{
                background: `linear-gradient(135deg, ${method.color}14 0%, white 100%)`,
                borderColor: `${method.color}28`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{method.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{method.name}</h3>
                  <p className="text-xs text-gray-400">{method.subtitle}</p>
                </div>
                <span
                  className="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: `${method.color}20`, color: method.color }}
                >
                  추천 {idx + 1}순위
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{method.description}</p>
              <div className="rounded-xl p-3 text-sm" style={{ background: `${method.color}10` }}>
                <span className="font-semibold" style={{ color: method.color }}>실천 팁</span>
                <p className="mt-1 text-gray-700">{method.practicalTip}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2027 대입 추천 전형 */}
      <section className="rounded-2xl p-6 shadow-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎓</span>
          <h2 className="text-lg font-bold text-gray-800">2027 대입 추천 전형</h2>
          <span className="text-xs text-indigo-400 ml-1">MBTI 기반</span>
        </div>
        <div className="flex flex-col gap-2">
          {admissionFit.map((fit, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-indigo-100 shadow-sm"
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{
                  background: i === 0 ? '#6366f1' : i === 1 ? '#818cf8' : '#a5b4fc',
                }}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium text-gray-800">{fit}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-indigo-400">
          * MBTI 성향 기반 분석이며, 실제 지원은 담임 선생님과 상담하세요.
        </p>
      </section>

      {/* 결과 공유 버튼 */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base shadow-md transition-all active:scale-95"
        style={{
          background: copied
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : `linear-gradient(135deg, ${ohang.color}, ${mbtiProfile.color})`,
        }}
      >
        <span>{copied ? '✅' : '📋'}</span>
        {copied ? '클립보드에 복사됐어요!' : '결과 공유하기 (텍스트 복사)'}
      </button>

      {/* 다시 진단하기 */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/mbti')}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          MBTI 다시 하기
        </button>
      </div>

    </div>
  )
}
