import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import type { GradeLevel, UserInfo, NaesinGrades } from '@/types'
import { ALL_ELECTIVE_SUBJECTS } from '@/types'

const GRADE_OPTIONS: GradeLevel[] = ['고3', '고2', '고1', '중3', '중2', '중1']

const YEARS_UNTIL_SUNEUNG: Record<'고3' | '고2' | '고1', number> = { 고3: 0, 고2: 1, 고1: 2 }

/** 2027(고3): 9등급제 / 2028(고2 이하): 5등급제 */
const NAESIN_GRADES_9 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const NAESIN_GRADES_5 = [1, 2, 3, 4, 5]

/** 고3 = 2027 수능 체계, 고2 이하 = 2028 수능 체계 */
const getSuneungYear = (g: GradeLevel | ''): 2027 | 2028 =>
  g === '고3' ? 2027 : 2028

export default function Home() {
  const navigate = useNavigate()
  const { userInfo, setUserInfo } = useUserStore()

  const [name, setName] = useState(userInfo?.name ?? '')
  const [year, setYear] = useState(userInfo?.birthDate?.split('-')[0] ?? '')
  const [month, setMonth] = useState(userInfo?.birthDate?.split('-')[1]?.replace(/^0/, '') ?? '')
  const [day, setDay] = useState(userInfo?.birthDate?.split('-')[2]?.replace(/^0/, '') ?? '')
  const [grade, setGrade] = useState<GradeLevel | ''>(userInfo?.grade ?? '')
  const [targetUni, setTargetUni] = useState(userInfo?.targetUni ?? '')
  const [error, setError] = useState('')

  // 내신 등급 state
  const saved = userInfo?.naesinGrades
  const [track, setTrack] = useState<'인문' | '자연' | '예체능' | ''>(saved?.track ?? '')
  // 공통과목 (2027·2028)
  const [koreanGrade, setKoreanGrade] = useState<string>(saved?.korean?.toString() ?? '')
  const [englishGrade, setEnglishGrade] = useState<string>(saved?.english?.toString() ?? '')
  const [mathGrade, setMathGrade] = useState<string>(saved?.math?.toString() ?? '')
  // 2028 추가 공통과목
  const [socialGrade, setSocialGrade] = useState<string>(saved?.social?.toString() ?? '')
  const [scienceGrade, setScienceGrade] = useState<string>(saved?.science?.toString() ?? '')
  const [historyGrade, setHistoryGrade] = useState<string>(saved?.history?.toString() ?? '')
  // 2027 선택과목 (고3 전용)
  const [elective1Subject, setElective1Subject] = useState(saved?.elective1Subject ?? '')
  const [elective1Grade, setElective1Grade] = useState<string>(saved?.elective1Grade?.toString() ?? '')
  const [elective2Subject, setElective2Subject] = useState(saved?.elective2Subject ?? '')
  const [elective2Grade, setElective2Grade] = useState<string>(saved?.elective2Grade?.toString() ?? '')

  function validate(): boolean {
    if (!name.trim()) { setError('이름을 입력해주세요.'); return false }
    const y = parseInt(year), m = parseInt(month), d = parseInt(day)
    if (!y || !m || !d) { setError('생년월일을 모두 입력해주세요.'); return false }
    if (y < 1990 || y > 2015) { setError('년도는 1990~2015 사이로 입력해주세요.'); return false }
    if (m < 1 || m > 12) { setError('월은 1~12 사이로 입력해주세요.'); return false }
    if (d < 1 || d > 31) { setError('일은 1~31 사이로 입력해주세요.'); return false }
    if (!grade) { setError('학년을 선택해주세요.'); return false }
    setError('')
    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !grade) return

    const birthDate = `${year}-${String(parseInt(month)).padStart(2, '0')}-${String(parseInt(day)).padStart(2, '0')}`

    // 내신 등급 조립
    const suneungYear = getSuneungYear(grade)
    const hasAnyGrade = koreanGrade || englishGrade || mathGrade ||
      socialGrade || scienceGrade || historyGrade ||
      elective1Grade || elective2Grade || track

    const naesinGrades: NaesinGrades | undefined = hasAnyGrade
      ? {
          suneungYear,
          track: track || undefined,
          korean: koreanGrade ? parseInt(koreanGrade) : undefined,
          english: englishGrade ? parseInt(englishGrade) : undefined,
          math: mathGrade ? parseInt(mathGrade) : undefined,
          // 한국사 (2027·2028 공통)
          history: historyGrade ? parseInt(historyGrade) : undefined,
          // 2028 추가 공통과목 (고2 이하)
          ...(suneungYear === 2028 && {
            social: socialGrade ? parseInt(socialGrade) : undefined,
            science: scienceGrade ? parseInt(scienceGrade) : undefined,
          }),
          // 2027 선택과목 (고3)
          ...(suneungYear === 2027 && {
            elective1Subject: elective1Subject || undefined,
            elective1Grade: elective1Grade ? parseInt(elective1Grade) : undefined,
            elective2Subject: elective2Subject || undefined,
            elective2Grade: elective2Grade ? parseInt(elective2Grade) : undefined,
          }),
        }
      : undefined

    const info: UserInfo = {
      name: name.trim(),
      birthDate,
      grade,
      naesinGrades,
      targetUni: targetUni.trim(),
    }
    setUserInfo(info)
    navigate('/saju')
  }

  const isHighSchool = grade.startsWith('고')
  const is2027 = grade === '고3'   // 고3 = 2027 수능 (공통+선택)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* 브랜드 헤더 */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">강남chat</h1>
        <p className="text-gray-500 text-base font-medium">AI 기반 맞춤형 학습 설계 플랫폼</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold text-indigo-800 tracking-wide uppercase">기본 정보 입력</h2>

        {/* 이름 */}
        <Field label="이름" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            maxLength={10}
            className={inputCls}
          />
        </Field>

        {/* 생년월일 */}
        <Field label="생년월일" required>
          <div className="flex gap-2">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="년도"
              min={1990}
              max={2015}
              className={`${inputCls} text-center`}
              style={{ flex: 2 }}
            />
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="월"
              min={1}
              max={12}
              className={`${inputCls} text-center`}
              style={{ flex: 1 }}
            />
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="일"
              min={1}
              max={31}
              className={`${inputCls} text-center`}
              style={{ flex: 1 }}
            />
          </div>
        </Field>

        {/* 학년 */}
        <Field label="학년" required>
          <div className="grid grid-cols-3 gap-2">
            {GRADE_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  grade === g
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          {grade && (
            <p className="text-xs text-indigo-500 mt-1.5">
              {grade.startsWith('고')
                ? `고등학교 ${grade[1]}학년 · 수능까지 ${YEARS_UNTIL_SUNEUNG[grade as '고3' | '고2' | '고1']}년`
                : `중학교 ${grade[1]}학년`}
            </p>
          )}
        </Field>

        {/* 내신 등급 입력 (고등학생만) */}
        {isHighSchool && (
          <div className="space-y-3 bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
            {/* 헤더: 제목 + 수능체계 뱃지 + 계열 */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-indigo-800 tracking-wide">
                  내신 등급 <span className="text-indigo-400 font-normal">(선택)</span>
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  is2027
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {is2027 ? '2027 수능' : '2028 수능'}
                </span>
              </div>
              {/* 계열 선택 */}
              <div className="flex gap-1">
                {(['인문', '자연', '예체능'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTrack(track === t ? '' : t)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                      track === t
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 공통과목 */}
            <p className="text-xs text-gray-500 font-medium">
              공통과목
              <span className="ml-1.5 font-normal text-gray-400">
                ({is2027 ? '9등급제' : '5등급제'})
              </span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <GradeSelect label="국어" value={koreanGrade} onChange={setKoreanGrade} grades={is2027 ? NAESIN_GRADES_9 : NAESIN_GRADES_5} />
              <GradeSelect label="영어" value={englishGrade} onChange={setEnglishGrade} grades={is2027 ? NAESIN_GRADES_9 : NAESIN_GRADES_5} />
              <GradeSelect label="수학" value={mathGrade} onChange={setMathGrade} grades={is2027 ? NAESIN_GRADES_9 : NAESIN_GRADES_5} />
              {/* 2027(고3): 한국사 여기에 표시 */}
              {is2027 && <GradeSelect label="한국사" value={historyGrade} onChange={setHistoryGrade} grades={NAESIN_GRADES_9} />}
            </div>

            {/* 2028 추가 공통과목 (고2 이하): 한국사·통합사회·통합과학 — 5등급제 */}
            {!is2027 && (
              <div className="grid grid-cols-3 gap-2">
                <GradeSelect label="한국사" value={historyGrade} onChange={setHistoryGrade} grades={NAESIN_GRADES_5} />
                <GradeSelect label="통합사회" value={socialGrade} onChange={setSocialGrade} grades={NAESIN_GRADES_5} />
                <GradeSelect label="통합과학" value={scienceGrade} onChange={setScienceGrade} grades={NAESIN_GRADES_5} />
              </div>
            )}

            {/* 2027 선택과목 (고3 전용) */}
            {is2027 && (
              <>
                <p className="text-xs text-gray-500 font-medium">선택과목</p>
                <div className="space-y-2">
                  <ElectiveRow
                    subjectValue={elective1Subject}
                    gradeValue={elective1Grade}
                    onSubjectChange={setElective1Subject}
                    onGradeChange={setElective1Grade}
                    placeholder="선택과목 1"
                  />
                  <ElectiveRow
                    subjectValue={elective2Subject}
                    gradeValue={elective2Grade}
                    onSubjectChange={setElective2Subject}
                    onGradeChange={setElective2Grade}
                    placeholder="선택과목 2"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* 목표대학 (선택) */}
        <Field label="목표대학">
          <div className="relative">
            <input
              type="text"
              value={targetUni}
              onChange={(e) => setTargetUni(e.target.value)}
              placeholder="예: 연세대 경영학과 (선택사항)"
              className={inputCls}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">선택</span>
          </div>
        </Field>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3.5 rounded-xl transition-colors"
        >
          시작하기
        </button>
        <p className="text-center text-xs text-gray-400">모든 분석은 기기 내에서 처리됩니다</p>
      </form>
    </div>
  )
}

// ── 서브 컴포넌트 ──────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-indigo-800 tracking-wide">
        {label}
        {required && <span className="text-indigo-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function GradeSelect({
  label, value, onChange, grades,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  grades: number[]
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500 text-center">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm bg-white text-center focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
      >
        <option value="">-</option>
        {grades.map((g) => (
          <option key={g} value={g}>{g}등급</option>
        ))}
      </select>
    </div>
  )
}

function ElectiveRow({
  subjectValue, gradeValue, onSubjectChange, onGradeChange, placeholder,
}: {
  subjectValue: string
  gradeValue: string
  onSubjectChange: (v: string) => void
  onGradeChange: (v: string) => void
  placeholder: string
}) {
  // 2027 선택과목은 항상 9등급제
  return (
    <div className="flex gap-2">
      <select
        value={subjectValue}
        onChange={(e) => onSubjectChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
      >
        <option value="">{placeholder}</option>
        {ALL_ELECTIVE_SUBJECTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        value={gradeValue}
        onChange={(e) => onGradeChange(e.target.value)}
        className="w-24 px-2 py-2 border border-gray-200 rounded-xl text-sm bg-white text-center focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
      >
        <option value="">-</option>
        {NAESIN_GRADES_9.map((g) => (
          <option key={g} value={g}>{g}등급</option>
        ))}
      </select>
    </div>
  )
}

const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all'
