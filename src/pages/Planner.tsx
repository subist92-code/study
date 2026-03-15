import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '@/store/userStore'
import type { OhangKey } from '@/data/ohangData'
import type { ReadingSession } from '@/store/readingStore'
import { useReadingStore, todayStr, getISOWeekKey as readingWeekKey, fmtSec } from '@/store/readingStore'
import { ALL_UNIVERSITIES, filterUniversities } from '@/data/admission'
import type { FilterResult, Track } from '@/data/admission'
import type { NaesinGrades } from '@/types'
import { getPrepResult } from '@/data/prep/finder'
import type { PrepResult, PrepItem, StudentWish } from '@/data/prep/types'

// ── 상수 ────────────────────────────────────────────────
const DAYS = [
  { key: 'mon', label: '월요일', short: '월' },
  { key: 'tue', label: '화요일', short: '화' },
  { key: 'wed', label: '수요일', short: '수' },
  { key: 'thu', label: '목요일', short: '목' },
  { key: 'fri', label: '금요일', short: '금' },
  { key: 'sat', label: '토요일', short: '토' },
  { key: 'sun', label: '일요일', short: '일' },
] as const

type DayKey = (typeof DAYS)[number]['key']

const DAY_ACCENT: Record<DayKey, string> = {
  mon: '#6366f1', tue: '#3b82f6', wed: '#0891b2',
  thu: '#0d9488', fri: '#7c3aed', sat: '#ea580c', sun: '#dc2626',
}

const DEFAULT_DDAY = '2027-11-13' // 2027 수능
const DDAY_LS_KEY = 'nachipmban-dday'
const checksKey = (weekKey: string) => `nachipmban-checks-${weekKey}`

// ── 헬퍼 ────────────────────────────────────────────────
function getISOWeekKey(): string {
  const now = new Date()
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function getTodayKey(): DayKey {
  return (['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as DayKey[])[
    new Date().getDay()
  ]
}

function calcDaysLeft(target: string): number {
  const now = new Date()
  const t = new Date(target)
  now.setHours(0, 0, 0, 0)
  t.setHours(0, 0, 0, 0)
  return Math.ceil((t.getTime() - now.getTime()) / 86400000)
}

// ── 컴포넌트 ─────────────────────────────────────────────
export default function Planner() {
  const navigate = useNavigate()
  const { saju, userInfo } = useUserStore()
  const { sessions } = useReadingStore()

  const weekKey = getISOWeekKey()
  const todayKey = getTodayKey()

  // ── State ──
  const [selectedDay, setSelectedDay] = useState<DayKey>(todayKey)
  const [checks, setChecks] = useState<Partial<Record<DayKey, boolean>>>({})
  const [ddayTarget, setDdayTarget] = useState(DEFAULT_DDAY)
  const [editingDday, setEditingDday] = useState(false)
  const [ddayInput, setDdayInput] = useState(DEFAULT_DDAY)

  // ── localStorage 로드 ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem(checksKey(weekKey))
      if (saved) setChecks(JSON.parse(saved))
    } catch {}

    const savedDday = localStorage.getItem(DDAY_LS_KEY)
    if (savedDday) {
      setDdayTarget(savedDday)
      setDdayInput(savedDday)
    }
  }, [weekKey])

  // ── localStorage 저장 ──
  const toggleCheck = useCallback(
    (day: DayKey) => {
      setChecks((prev) => {
        const next = { ...prev, [day]: !prev[day] }
        localStorage.setItem(checksKey(weekKey), JSON.stringify(next))
        return next
      })
    },
    [weekKey],
  )

  const saveDday = () => {
    setDdayTarget(ddayInput)
    localStorage.setItem(DDAY_LS_KEY, ddayInput)
    setEditingDday(false)
  }

  // ── 데이터가 없는 경우 ──
  if (!saju) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="text-6xl">📅</div>
        <h1 className="text-2xl font-bold text-gray-800">진단이 필요해요</h1>
        <p className="text-gray-500 text-sm">먼저 진단을 완료해야 주간 플래너를 사용할 수 있어요.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          시작하러 가기
        </button>
      </div>
    )
  }

  const ohang = saju.ohang
  const ohangColor = ohang.color
  const weekPlan = ohang.weekPlan
  const selectedPlan = weekPlan[selectedDay as keyof typeof weekPlan]

  // ── 목표대학 준비사항 ──
  const prepResult = useMemo<PrepResult | null>(() => {
    const targetUni = userInfo?.targetUni
    if (!targetUni) return null
    const uniId = parseUniversityId(targetUni)
    if (!uniId) return null

    const grade = userInfo.grade
    const currentYear = grade === '고3' ? 3 : grade === '고2' ? 2 : 1
    const admissionYear = grade === '고3' ? 2027 : 2028
    const track = userInfo.naesinGrades?.track ?? '인문'

    const wish: StudentWish = {
      universityId: uniId,
      department: targetUni,
      admissionType: '학생부종합',
      admissionYear,
      currentYear: currentYear as 1 | 2 | 3,
      track,
    }
    return getPrepResult(wish)
  }, [userInfo])

  // ── 대입 컨설팅 ──
  const naesin = userInfo?.naesinGrades
  const admissionResults = useMemo<FilterResult[]>(() => {
    if (!naesin) return []
    const trackMap: Record<string, Track> = { '인문': '인문', '자연': '자연', '예체능': '예체능' }
    const track: Track = (naesin.track && trackMap[naesin.track]) ?? '인문'
    return filterUniversities(
      {
        naesinGrade: calcAvgGrade(naesin),
        track,
      },
      ALL_UNIVERSITIES,
    ).slice(0, 6)
  }, [naesin])

  // ── 달성률 ──
  const checkedCount = DAYS.filter((d) => checks[d.key]).length
  const achievePercent = Math.round((checkedCount / 7) * 100)

  // ── D-Day ──
  const daysLeft = calcDaysLeft(ddayTarget)
  const ddayLabel =
    daysLeft > 0 ? `D-${daysLeft}` : daysLeft === 0 ? 'D-Day' : `D+${Math.abs(daysLeft)}`

  return (
    <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-6">

      {/* 헤더 */}
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400 mb-1 tracking-wide">
          {ohang.emoji} {ohang.name} 유형
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          {userInfo.name ? `${userInfo.name}님의 ` : ''}주간 플래너
        </h1>
      </div>

      {/* 목표대학 준비 로드맵 (최상단) */}
      {prepResult && <PrepPanel result={prepResult} ohangColor={ohangColor} />}

      {/* 대입 컨설팅 패널 */}
      {naesin && <AdmissionPanel naesin={naesin} results={admissionResults} ohangColor={ohangColor} targetUni={userInfo?.targetUni} />}

      {/* D-Day + 달성률 */}
      <div className="grid grid-cols-2 gap-3">

        {/* D-Day 카드 */}
        <motion.div
          layout
          className="rounded-2xl p-4 text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${ohangColor}, ${ohangColor}cc)` }}
        >
          <p className="text-xs font-semibold opacity-75 mb-1">수능까지</p>
          <p className="text-3xl font-black tracking-tight">{ddayLabel}</p>
          {editingDday ? (
            <div className="mt-2 flex gap-1">
              <input
                type="date"
                value={ddayInput}
                onChange={(e) => setDdayInput(e.target.value)}
                className="text-xs rounded-lg px-2 py-1 text-gray-800 flex-1 min-w-0"
              />
              <button
                onClick={saveDday}
                className="text-xs bg-white/30 hover:bg-white/40 px-2 rounded-lg font-bold transition-colors"
              >
                저장
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingDday(true)}
              className="mt-2 text-xs opacity-60 hover:opacity-90 transition-opacity underline"
            >
              {ddayTarget} 변경
            </button>
          )}
        </motion.div>

        {/* 달성률 카드 */}
        <div className="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 mb-1">이번 주 달성률</p>
          <p className="text-3xl font-black text-gray-900">{achievePercent}%</p>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: ohangColor }}
              initial={{ width: 0 }}
              animate={{ width: `${achievePercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">{checkedCount} / 7일 완료</p>
        </div>
      </div>

      {/* 주간 캘린더 그리드 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-400 mb-3">이번 주 계획</p>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map((day) => {
            const isToday = day.key === todayKey
            const isSelected = day.key === selectedDay
            const isDone = checks[day.key]
            const accent = DAY_ACCENT[day.key]

            return (
              <motion.button
                key={day.key}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedDay(day.key)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all"
                style={{
                  background: isSelected
                    ? `${ohangColor}18`
                    : isToday
                      ? `${accent}10`
                      : 'transparent',
                  border: isSelected
                    ? `2px solid ${ohangColor}`
                    : isToday
                      ? `2px solid ${accent}40`
                      : '2px solid transparent',
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: isSelected ? ohangColor : isToday ? accent : '#9ca3af' }}
                >
                  {day.short}
                </span>

                {/* 체크 인디케이터 */}
                <motion.div
                  animate={isDone ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: isDone ? ohangColor : `${accent}15`,
                  }}
                >
                  {isDone ? (
                    <span className="text-white text-xs font-bold">✓</span>
                  ) : (
                    <span className="text-xs" style={{ color: accent }}>
                      {day.short}
                    </span>
                  )}
                </motion.div>

                {isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* 선택된 날 세부 할 일 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="rounded-2xl border shadow-sm overflow-hidden"
          style={{ borderColor: `${DAY_ACCENT[selectedDay]}30` }}
        >
          {/* 날짜 헤더 */}
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: `${DAY_ACCENT[selectedDay]}12` }}
          >
            <span
              className="w-7 h-7 rounded-lg text-white text-xs font-bold flex items-center justify-center"
              style={{ background: DAY_ACCENT[selectedDay] }}
            >
              {DAYS.find((d) => d.key === selectedDay)?.short}
            </span>
            <span className="font-bold text-gray-800">
              {DAYS.find((d) => d.key === selectedDay)?.label}
            </span>
            {selectedDay === todayKey && (
              <span
                className="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                style={{ background: DAY_ACCENT[selectedDay] }}
              >
                오늘
              </span>
            )}
          </div>

          <div className="bg-white px-5 py-4 flex flex-col gap-4">
            {/* 메인 할 일 + 체크박스 */}
            <div className="flex items-start gap-3">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => toggleCheck(selectedDay)}
                className="mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: checks[selectedDay] ? ohangColor : '#d1d5db',
                  background: checks[selectedDay] ? ohangColor : 'white',
                }}
              >
                <AnimatePresence>
                  {checks[selectedDay] && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="text-white text-xs font-bold"
                    >
                      ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <p
                className="text-sm text-gray-800 leading-relaxed flex-1 font-medium"
                style={{
                  textDecoration: checks[selectedDay] ? 'line-through' : 'none',
                  color: checks[selectedDay] ? '#9ca3af' : '#1f2937',
                }}
              >
                {selectedPlan}
              </p>
            </div>

            {/* 구분선 */}
            <hr className="border-gray-100" />

            {/* 학습 환경 팁 */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-400">학습 환경 추천</p>
              <div
                className="flex items-start gap-2 text-sm text-gray-700 rounded-xl px-3 py-2.5"
                style={{ background: `${ohangColor}0e` }}
              >
                <span>🏫</span>
                <span>{ohang.studyEnv}</span>
              </div>
              <div
                className="flex items-start gap-2 text-sm text-gray-700 rounded-xl px-3 py-2.5"
                style={{ background: `${ohangColor}0e` }}
              >
                <span>🎵</span>
                <span>{ohang.music}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 문해력 훈련 통계 */}
      <ReadingStats sessions={sessions} ohangColor={ohangColor} />

      {/* 하단 네비 버튼 */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => navigate('/study')}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          학습법 보기
        </button>
        <button
          onClick={() => navigate('/report')}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          리포트 보기
        </button>
      </div>

    </div>
  )
}

// ── 문해력 훈련 통계 ─────────────────────────────────────
function ReadingStats({ sessions, ohangColor }: { sessions: ReadingSession[]; ohangColor: string }) {
  const today = todayStr()
  const thisWeek = readingWeekKey()

  const todaySessions = sessions.filter((s) => s.date === today)
  const weekSessions = sessions.filter((s) => readingWeekKey(new Date(s.date)) === thisWeek)

  const todayTotalSec = todaySessions.reduce((sum, s) => sum + s.durationSec, 0)
  const weekAvgSec = weekSessions.length
    ? Math.floor(weekSessions.reduce((sum, s) => sum + s.durationSec, 0) / weekSessions.length)
    : 0

  // 최근 4주 세션 수 집계 (성장 추이)
  const weeklyCount: { label: string; count: number }[] = Array.from({ length: 4 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i * 7)
    const key = readingWeekKey(d)
    return {
      label: i === 0 ? '이번 주' : `${i}주 전`,
      count: sessions.filter((s) => readingWeekKey(new Date(s.date)) === key).length,
    }
  }).reverse()

  const maxCount = Math.max(...weeklyCount.map((w) => w.count), 1)

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-center">
        <p className="text-xs text-gray-400">📖 아직 문해력 훈련 기록이 없어요</p>
        <p className="text-xs text-gray-300 mt-0.5">AI 과외 → 문해력 키워줘 에서 시작하세요</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
      <p className="text-xs font-semibold text-gray-400">📖 문해력 훈련 현황</p>

      {/* 오늘 / 이번 주 요약 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-3 text-center" style={{ background: `${ohangColor}12` }}>
          <p className="text-lg font-black" style={{ color: ohangColor }}>{todaySessions.length}</p>
          <p className="text-xs text-gray-400">오늘 횟수</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: `${ohangColor}12` }}>
          <p className="text-lg font-black" style={{ color: ohangColor }}>{todayTotalSec > 0 ? fmtSec(todayTotalSec) : '-'}</p>
          <p className="text-xs text-gray-400">오늘 총시간</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: `${ohangColor}12` }}>
          <p className="text-lg font-black" style={{ color: ohangColor }}>{weekAvgSec > 0 ? fmtSec(weekAvgSec) : '-'}</p>
          <p className="text-xs text-gray-400">주 평균시간</p>
        </div>
      </div>

      {/* 주간 성장 그래프 */}
      <div>
        <p className="text-xs text-gray-400 mb-2">주간 성장 추이</p>
        <div className="flex items-end gap-2 h-16">
          {weeklyCount.map((w) => (
            <div key={w.label} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-lg"
                style={{ background: ohangColor, opacity: 0.8 }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((w.count / maxCount) * 48, w.count > 0 ? 6 : 0)}px` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              <span className="text-xs text-gray-400">{w.label}</span>
              <span className="text-xs font-bold text-gray-600">{w.count}회</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── 5등급 → 9등급 환산 (2028 수능 학생 필터링용) ──────────
// 비율 기준: 1(10%) → 1.5 / 2(24%) → 3.0 / 3(32%) → 5.0 / 4(24%) → 7.0 / 5(10%) → 8.5
const FIVE_TO_NINE: Record<number, number> = { 1: 1.5, 2: 3.0, 3: 5.0, 4: 7.0, 5: 8.5 }
const convert5to9 = (g: number) => FIVE_TO_NINE[g] ?? g

// ── 내신 평균 등급 계산 헬퍼 ──────────────────────────────
function calcAvgGrade(naesin: NaesinGrades): number | undefined {
  const is2028 = naesin.suneungYear === 2028
  // 2028은 5등급제이므로 9등급 스케일로 환산 후 평균
  const toNine = (g: number) => is2028 ? convert5to9(g) : g

  const grades = [
    naesin.korean, naesin.english, naesin.math,
    naesin.social, naesin.science, naesin.history,
    naesin.elective1Grade, naesin.elective2Grade,
  ].filter((g): g is number => g !== undefined)
    .map(toNine)

  if (grades.length === 0) return undefined
  return parseFloat((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2))
}

// ── 대입 컨설팅 패널 ──────────────────────────────────────
type BadgeType = 'safe' | 'possible' | 'reach' | 'danger' | 'unknown'

const BADGE_CONFIG: Record<BadgeType, { label: string; color: string }> = {
  safe:    { label: '안정',   color: '#16a34a' },
  possible:{ label: '적정',   color: '#2563eb' },
  reach:   { label: '소신',   color: '#d97706' },
  danger:  { label: '위험',   color: '#dc2626' },
  unknown: { label: '확인필요', color: '#9ca3af' },
}

function getBadge(r: FilterResult): BadgeType {
  // 내신·수능 모두 미입력 → 판단 불가
  if (r.gradeInRange === null && r.suneungSatisfied === null) return 'unknown'
  if (r.recommendScore >= 70) return 'safe'
  if (r.recommendScore >= 45) return 'possible'
  if (r.recommendScore >= 25) return 'reach'
  return 'danger'
}

function AdmissionPanel({
  naesin, results, ohangColor, targetUni,
}: {
  naesin: NaesinGrades
  results: FilterResult[]
  ohangColor: string
  targetUni?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const avg = calcAvgGrade(naesin)

  const eligible = results.filter((r) => r.eligible)
  const reach = results.filter((r) => !r.eligible && r.gradeInRange !== false)

  return (
    <motion.div
      layout
      className="rounded-2xl border border-indigo-100 bg-white shadow-sm overflow-hidden"
    >
      {/* 헤더 */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 py-4 flex items-center gap-3 text-left"
        style={{ background: `${ohangColor}10` }}
      >
        <span className="text-xl">🎓</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800">
            대입 컨설팅
            {avg !== undefined && (
              <span className="ml-2 text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                내신 평균 {avg}등급
              </span>
            )}
          </p>
          {targetUni && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">목표: {targetUni}</p>
          )}
          {!targetUni && (
            <p className="text-xs text-gray-400 mt-0.5">
              적정 {eligible.length}개 · 소신 {reach.length}개 전형 검색됨
            </p>
          )}
        </div>
        <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* 내신 요약 칩 */}
      <div className="px-5 py-3 flex flex-wrap gap-1.5 border-b border-gray-50">
        <Chip
          label={naesin.suneungYear === 2027 ? '2027 · 9등급제' : '2028 · 5등급제'}
          color={naesin.suneungYear === 2027 ? '#d97706' : '#059669'}
        />
        {naesin.track && <Chip label={naesin.track} color={ohangColor} />}
        {naesin.korean !== undefined && <Chip label={`국어 ${naesin.korean}등급`} color="#6366f1" />}
        {naesin.english !== undefined && <Chip label={`영어 ${naesin.english}등급`} color="#0891b2" />}
        {naesin.math !== undefined && <Chip label={`수학 ${naesin.math}등급`} color="#7c3aed" />}
        {naesin.history !== undefined && <Chip label={`한국사 ${naesin.history}등급`} color="#6b7280" />}
        {/* 2028 추가 공통과목 */}
        {naesin.social !== undefined && <Chip label={`통합사회 ${naesin.social}등급`} color="#0d9488" />}
        {naesin.science !== undefined && <Chip label={`통합과학 ${naesin.science}등급`} color="#0d9488" />}
        {/* 2027 선택과목 */}
        {naesin.elective1Subject && naesin.elective1Grade !== undefined && (
          <Chip label={`${naesin.elective1Subject} ${naesin.elective1Grade}등급`} color="#059669" />
        )}
        {naesin.elective2Subject && naesin.elective2Grade !== undefined && (
          <Chip label={`${naesin.elective2Subject} ${naesin.elective2Grade}등급`} color="#d97706" />
        )}
      </div>

      {/* 전형 목록 (펼쳤을 때) */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {results.length === 0 ? (
              <p className="px-5 py-4 text-sm text-gray-400 text-center">
                내신 정보를 입력하면 지원 가능 대학을 확인할 수 있어요
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {results.map((r) => {
                  const badge = getBadge(r)
                  return (
                    <div key={`${r.university.id}-${r.plan.id}`} className="px-5 py-3 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-gray-800">{r.university.shortName}</span>
                          <span className="text-xs text-gray-500">{r.plan.name}</span>
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ background: BADGE_CONFIG[badge].color }}
                          >
                            {BADGE_CONFIG[badge].label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{r.comment}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="px-5 py-3 bg-gray-50 text-center">
              <p className="text-xs text-gray-400">2027학년도 기준 참고용 · 실제 컨설팅과 병행 권장</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ background: `${color}18`, color }}
    >
      {label}
    </span>
  )
}

// ── 대학 ID 파싱 ──────────────────────────────────────────
function parseUniversityId(targetUni: string): string | null {
  const text = targetUni.replace(/\s/g, '')
  if (/서울대/.test(text)) return 'snu'
  if (/연세대/.test(text)) return 'yonsei'
  if (/고려대/.test(text)) return 'korea'
  return null
}

const UNI_NAME_MAP: Record<string, string> = {
  snu: '서울대학교',
  yonsei: '연세대학교',
  korea: '고려대학교',
}

const URGENCY_CONFIG = {
  critical: { label: '필수', color: '#dc2626', bg: '#fef2f2' },
  high:     { label: '중요', color: '#d97706', bg: '#fffbeb' },
  medium:   { label: '권장', color: '#2563eb', bg: '#eff6ff' },
  low:      { label: '참고', color: '#9ca3af', bg: '#f9fafb' },
}

const CATEGORY_EMOJI: Record<string, string> = {
  '내신관리': '📊', '세특관리': '✏️', '과목이수': '📚', '탐구활동': '🔬',
  '동아리': '🏫', '봉사활동': '🤝', '진로활동': '🎯', '수능준비': '📝',
  '논술준비': '🖊️', '면접준비': '🗣️', '학폭주의': '⚠️', '학교장추천': '🏅',
  '지역인재자격': '📍',
}

// ── 목표대학 준비 로드맵 패널 ─────────────────────────────
function PrepPanel({ result, ohangColor }: { result: PrepResult; ohangColor: string }) {
  const [expanded, setExpanded] = useState(false)
  const [tab, setTab] = useState<'now' | 'warn'>('now')

  const pkg = result.package
  const uniName = UNI_NAME_MAP[result.wish.universityId] ?? result.wish.universityId
  const urgentCount = result.urgentNow.length
  const warnCount = result.criticalWarnings.length

  return (
    <motion.div
      layout
      className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden"
    >
      {/* 헤더 */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 py-4 flex items-center gap-3 text-left"
        style={{ background: `${ohangColor}0e` }}
      >
        <span className="text-xl">🎯</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800">
            목표대학 준비 로드맵
            <span className="ml-2 text-xs font-normal text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {uniName} · 학생부종합
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            지금 해야 할 항목 {urgentCount}개 · 주의사항 {warnCount}개
          </p>
        </div>
        <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* 핵심 합격 기준 요약 칩 (항상 표시) */}
      <div className="px-5 py-3 flex flex-wrap gap-1.5 border-b border-gray-50">
        {pkg.keyRequirements.slice(0, 3).map((req, i) => (
          <span
            key={i}
            className="text-xs px-2.5 py-1 rounded-full font-medium bg-rose-50 text-rose-700"
          >
            {req.length > 30 ? req.slice(0, 28) + '…' : req}
          </span>
        ))}
      </div>

      {/* 상세 내용 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {/* 탭 */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setTab('now')}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                  tab === 'now' ? 'text-rose-600 border-b-2 border-rose-500' : 'text-gray-400'
                }`}
              >
                🔥 지금 할 일 ({urgentCount})
              </button>
              <button
                onClick={() => setTab('warn')}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                  tab === 'warn' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-400'
                }`}
              >
                ⚠️ 주의사항 ({warnCount})
              </button>
            </div>

            {tab === 'now' && (
              <div className="divide-y divide-gray-50">
                {result.urgentNow.slice(0, 8).map((item) => (
                  <PrepItemRow key={item.id} item={item} />
                ))}
                {result.urgentNow.length === 0 && (
                  <p className="px-5 py-4 text-sm text-gray-400 text-center">현재 학년 기준 긴급 항목이 없습니다</p>
                )}
              </div>
            )}

            {tab === 'warn' && (
              <div className="px-5 py-3 flex flex-col gap-2.5">
                {result.criticalWarnings.map((w, i) => (
                  <div key={i} className="flex gap-2 items-start bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                    <span className="text-amber-500 text-sm mt-0.5 flex-shrink-0">⚠️</span>
                    <p className="text-xs text-amber-800 leading-5">{w}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 면접 정보 */}
            {pkg.interviewPrep && pkg.interviewPrep.type !== '없음' && (
              <div className="px-5 py-3 bg-indigo-50 border-t border-indigo-100">
                <p className="text-xs font-semibold text-indigo-700 mb-1">
                  🗣️ 면접 유형: {pkg.interviewPrep.type}
                </p>
                <div className="flex flex-wrap gap-1">
                  {pkg.interviewPrep.focus.map((f, i) => (
                    <span key={i} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="px-5 py-3 bg-gray-50 text-center">
              <p className="text-xs text-gray-400">2027학년도 기준 참고용 · 실제 컨설팅과 병행 권장</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PrepItemRow({ item }: { item: PrepItem }) {
  const [open, setOpen] = useState(false)
  const cfg = URGENCY_CONFIG[item.urgency]
  const emoji = CATEGORY_EMOJI[item.category] ?? '📌'

  return (
    <div className="px-5 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 text-left"
      >
        <span className="text-base mt-0.5 flex-shrink-0">{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">{item.title}</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {cfg.label}
            </span>
            <span className="text-xs text-gray-400">{item.category}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-4">{item.description}</p>
        </div>
        <span className="text-gray-300 text-xs ml-1 mt-1 flex-shrink-0">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 ml-8 flex flex-col gap-1 overflow-hidden"
        >
          {item.actionItems.map((a, i) => (
            <li key={i} className="text-xs text-gray-600 flex gap-1.5 items-start">
              <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
              <span>{a}</span>
            </li>
          ))}
          {item.deadline && (
            <li className="text-xs text-rose-500 font-semibold flex gap-1.5 items-center mt-0.5">
              <span>⏰</span><span>기한: {item.deadline}</span>
            </li>
          )}
        </motion.ul>
      )}
    </div>
  )
}
