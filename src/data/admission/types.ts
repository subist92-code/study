// ============================================================
// 나침반 대입 컨설팅 - 핵심 타입 정의
// Next.js + React Native 공용
// ============================================================

/** 수능 영역 */
export type SuneungSubject = '국어' | '수학' | '영어' | '탐구1' | '탐구2' | '한국사';

/** 계열 */
export type Track = '인문' | '자연' | '예체능' | '무전공';

/** 전형 종류 */
export type AdmissionType =
  | '학생부교과'   // 교과전형
  | '학생부종합'   // 학종
  | '논술'
  | '정시'
  | '지역인재'
  | '사회통합'
  | '특기자';

/** 대학 그룹 티어 */
export type UniversityTier =
  | 'SKY'           // 서울대·연세대·고려대
  | '서성한중'       // 서강·성균관·한양·중앙
  | '경외시이'       // 경희·외대·시립·이화
  | '건동홍국숭'     // 건국·동국·홍익·국민·숭실
  | '지거국'         // 지방거점국립대
  | '수도권중위'
  | '지방사립';

/** 수능 최저학력기준 */
export interface SuneungMinimum {
  /** 몇 개 영역 합산 */
  subjectCount: number;
  /** 등급 합 이내 */
  gradeSum: number;
  /** 수학 필수 포함 여부 */
  mathRequired: boolean;
  /** 과탐 필수 여부 */
  scienceRequired: boolean;
  /** 영어 등급 별도 조건 (e.g. 2등급 이내) */
  englishMin?: number;
  /** 한국사 등급 조건 */
  koreanHistoryMin?: number;
  /** 설명 (예: "국수탐 3합 7 이내") */
  description: string;
}

/** 내신 컷라인 (70% 컷 기준) */
export interface GradeCut {
  /** 70% 컷 (최솟값) */
  cut70: number;
  /** 50% 컷 (중간값) */
  cut50?: number;
  /** 최초합격 상위권 */
  topCut?: number;
  /** 비고 */
  note?: string;
}

/** 전형 상세 정보 */
export interface AdmissionPlan {
  id: string;
  name: string;
  type: AdmissionType;
  track: Track[];
  /** 모집인원 */
  quota: number;
  /** 전형 요소 (예: { 서류: 100 } 또는 { 교과: 90, 서류: 10 }) */
  elements: Record<string, number>;
  /** 단계별 선발 여부 */
  isMultiStage: boolean;
  /** 1단계 배수 */
  stage1Multiple?: number;
  /** 수능 최저 */
  suneungMin?: SuneungMinimum;
  /** 내신 컷 (교과·학종) */
  gradeCut?: {
    humanities?: GradeCut;
    science?: GradeCut;
    medical?: GradeCut;
  };
  /** 정시 백분위 컷 */
  percentileCut?: {
    humanities?: GradeCut;
    science?: GradeCut;
  };
  /** 지역인재 여부 */
  isRegionalTalent: boolean;
  /** 주요 변경사항 */
  changes2027?: string;
}

/** 대학 정보 */
export interface University {
  id: string;
  name: string;
  shortName: string;
  tier: UniversityTier;
  region: '서울' | '수도권' | '부산' | '대구' | '광주' | '대전' | '기타지방';
  /** 입학처 URL */
  admissionUrl: string;
  /** 2027 총 모집인원 */
  totalQuota: number;
  /** 수시 비중 % */
  susiRatio: number;
  admissionPlans: AdmissionPlan[];
}

// ============================================================
// 필터링 입력 타입
// ============================================================

/** 수험생 성적 입력 */
export interface StudentProfile {
  /** 내신 평균 등급 (소수점 가능, e.g. 1.8) */
  naesinGrade?: number;
  /** 수능 영역별 등급 */
  suneungGrades?: Partial<Record<SuneungSubject, number>>;
  /** 계열 */
  track: Track;
  /** 희망 학과/계열 키워드 */
  desiredMajor?: string;
  /** 거주 지역 (지역인재 판단) */
  region?: string;
  /** 지원 의약학 계열 여부 */
  aimMedical?: boolean;
}

/** 필터링 결과 */
export interface FilterResult {
  university: University;
  plan: AdmissionPlan;
  /** 지원 가능 여부 */
  eligible: boolean;
  /** 수능최저 충족 여부 */
  suneungSatisfied: boolean | null; // null = 수능점수 미입력
  /** 내신 범위 내 여부 */
  gradeInRange: boolean | null;
  /** 내신 등급 판정 ('safe'|'possible'|'reach'|'unlikely'|null=미입력) */
  gradeRange: 'safe' | 'possible' | 'reach' | 'unlikely' | null;
  /** 지역인재 해당 여부 */
  regionalMatch: boolean;
  /** 추천도 점수 (0~100) */
  recommendScore: number;
  /** 코멘트 */
  comment: string;
}
