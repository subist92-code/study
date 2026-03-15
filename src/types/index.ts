// 오행 (Five Elements)
export type Element = '목' | '화' | '토' | '금' | '수'

// 학년
export type GradeLevel = '고3' | '고2' | '고1' | '중3' | '중2' | '중1'

/** 학년에서 파생되는 컨텍스트 정보
 * - AI 프롬프트, 입시 전형 추천, 스케줄 파트에서 공통 활용
 */
export interface GradeContext {
  grade: GradeLevel
  schoolType: '고등학교' | '중학교'
  gradeYear: 1 | 2 | 3            // 학년 숫자 (1~3)
  yearsUntilSuneung: number        // 수능까지 남은 년수 (고3=0, 고2=1, ...)
  isHighSchool: boolean
}

/** 내신 등급 정보 */
export interface NaesinGrades {
  /** 수능 체계 구분 */
  suneungYear: 2027 | 2028
  /** 계열 */
  track?: '인문' | '자연' | '예체능'

  // ── 공통과목 (2027·2028 공통) ──
  korean?: number     // 국어 (1~9)
  english?: number    // 영어 (1~9)
  math?: number       // 수학 (1~9)

  // ── 2028 추가 공통과목 (고2 이하) ──
  social?: number     // 통합사회 (1~9)
  science?: number    // 통합과학 (1~9)
  history?: number    // 한국사 (1~9)

  // ── 2027 선택과목 (고3 전용) ──
  elective1Subject?: string
  elective1Grade?: number
  elective2Subject?: string
  elective2Grade?: number
}

/** 내신 과목명 목록 */
export const ELECTIVE_SUBJECTS_HUMANITIES = [
  '생활과 윤리', '윤리와 사상', '한국지리', '세계지리',
  '동아시아사', '세계사', '경제', '정치와 법', '사회·문화',
  '한국사', '독서', '문학', '화법과 작문', '언어와 매체',
] as const

export const ELECTIVE_SUBJECTS_SCIENCE = [
  '물리학Ⅰ', '화학Ⅰ', '생명과학Ⅰ', '지구과학Ⅰ',
  '물리학Ⅱ', '화학Ⅱ', '생명과학Ⅱ', '지구과학Ⅱ',
  '미적분', '확률과 통계', '기하',
] as const

export const ALL_ELECTIVE_SUBJECTS = [
  ...ELECTIVE_SUBJECTS_HUMANITIES,
  ...ELECTIVE_SUBJECTS_SCIENCE,
  '체육', '음악', '미술', '정보', '기술·가정', '제2외국어',
] as const

/** 사용자 기본 프로필 */
export interface UserInfo {
  name: string
  birthDate: string               // YYYY-MM-DD
  grade: GradeLevel
  naesinGrades?: NaesinGrades     // 내신 등급 (선택)
  targetUni: string               // 목표대학 (선택, 빈 문자열 허용)
}

/** GradeLevel → GradeContext 변환 헬퍼 */
export function getGradeContext(grade: GradeLevel): GradeContext {
  const map: Record<GradeLevel, { schoolType: '고등학교' | '중학교'; gradeYear: 1 | 2 | 3; yearsUntilSuneung: number }> = {
    '고3': { schoolType: '고등학교', gradeYear: 3, yearsUntilSuneung: 0 },
    '고2': { schoolType: '고등학교', gradeYear: 2, yearsUntilSuneung: 1 },
    '고1': { schoolType: '고등학교', gradeYear: 1, yearsUntilSuneung: 2 },
    '중3': { schoolType: '중학교',   gradeYear: 3, yearsUntilSuneung: 3 },
    '중2': { schoolType: '중학교',   gradeYear: 2, yearsUntilSuneung: 4 },
    '중1': { schoolType: '중학교',   gradeYear: 1, yearsUntilSuneung: 5 },
  }
  return { grade, isHighSchool: grade.startsWith('고'), ...map[grade] }
}

// 사주 진단 결과
export interface SajuResult {
  birthDate: string
  birthHour?: number
  dayGan: string       // 일간 (天干)
  element: Element     // 일간 오행
  elementDescription: string
}

// MBTI 결과
export type MbtiType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'

// 전역 진단 상태
export interface DiagnosisState {
  saju: SajuResult | null
  mbti: MbtiType | null
}

// VAK 학습 유형
export type VakType = 'V' | 'A' | 'K'

// 학습 전략 유형
export interface StudyStrategy {
  title: string
  description: string
  methods: string[]
  subjects: string[]
  tips: string[]
}
