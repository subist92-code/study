// ============================================================
// 나침반 — 희망 대학/학과별 준비사항 타입 정의
// 2027~2028학년도 기준
// ============================================================

/** 수험 학년도 */
export type AdmissionYear = 2027 | 2028;

/** 전형 구분 */
export type AdmissionType =
  | '학생부종합'
  | '학생부교과'
  | '논술'
  | '정시_수능'
  | '정시_학종'    // 2028 서울대 정시 학종 전형
  | '지역인재'
  | '특기자'
  | '사회통합';

/** 준비 시급도 */
export type Urgency = 'critical' | 'high' | 'medium' | 'low';

/** 학년 */
export type SchoolYear = 1 | 2 | 3;

/** 준비사항 단일 항목 */
export interface PrepItem {
  id: string;
  category: PrepCategory;
  title: string;
  description: string;
  urgency: Urgency;
  /** 시작해야 할 학년 */
  startYear: SchoolYear;
  /** 언제까지 완료해야 하나 */
  deadline?: string;
  /** 구체적 실천 방법 */
  actionItems: string[];
  /** 2028 개편 시 변화 여부 */
  changes2028?: string;
}

/** 준비사항 카테고리 */
export type PrepCategory =
  | '내신관리'
  | '세특관리'
  | '과목이수'
  | '탐구활동'
  | '동아리'
  | '봉사활동'
  | '진로활동'
  | '수능준비'
  | '논술준비'
  | '면접준비'
  | '학폭주의'
  | '학교장추천'
  | '지역인재자격';

// ──────────────────────────────────────────────────────────
// 학종 3대 평가요소 타입
// ──────────────────────────────────────────────────────────

/** 학종 평가요소별 준비 가이드 */
export interface JonghapEvalGuide {
  /** 학업역량 준비 */
  academicAbility: {
    /** 교과 성취 수준 */
    gradeTarget: string;
    /** 세특에 드러나야 할 내용 */
    setukFocus: string[];
    /** 탐구력 증명 방법 */
    inquiryProof: string[];
  };
  /** 진로역량 준비 */
  careerReadiness: {
    /** 전공 관련 필수 이수 과목 */
    requiredSubjects: string[];
    /** 권장 이수 과목 */
    recommendedSubjects: string[];
    /** 진로 탐색 활동 */
    explorationActivities: string[];
  };
  /** 공동체역량 준비 */
  communityAbility: {
    /** 협업/소통 증명 활동 */
    collaborationItems: string[];
    /** 리더십 증명 */
    leadershipItems: string[];
    /** 배려/나눔 활동 */
    careItems: string[];
  };
}

// ──────────────────────────────────────────────────────────
// 대학/학과별 준비 패키지
// ──────────────────────────────────────────────────────────

/** 전형별 준비 패키지 */
export interface AdmissionPrepPackage {
  universityId: string;
  universityName: string;
  department: string;          // 학부/학과명
  admissionType: AdmissionType;
  admissionYear: AdmissionYear;

  /** 핵심 합격 기준 (요약) */
  keyRequirements: string[];

  /** 학년별 로드맵 */
  roadmap: {
    year1: PrepItem[];   // 1학년
    year2: PrepItem[];   // 2학년
    year3: PrepItem[];   // 3학년
  };

  /** 학종인 경우 평가요소 가이드 */
  jonghapGuide?: JonghapEvalGuide;

  /** 수능최저 준비 */
  suneungMinPrep?: {
    requirement: string;
    strategy: string[];
  };

  /** 면접 준비 */
  interviewPrep?: {
    type: '서류기반' | '제시문기반' | 'MMI' | '교직적성' | '없음';
    focus: string[];
    practiceTopics: string[];
  };

  /** 학과별 특이사항 */
  departmentNote?: string;

  /** 2028 변화 예고 */
  changes2028Preview?: string;
}

// ──────────────────────────────────────────────────────────
// 프로그램 입출력 타입
// ──────────────────────────────────────────────────────────

/** 사용자 희망 입력 */
export interface StudentWish {
  universityId: string;
  department: string;
  admissionType: AdmissionType;
  admissionYear: AdmissionYear;
  currentYear: SchoolYear;      // 현재 학년
  track: '인문' | '자연' | '예체능';
  region?: string;              // 지역인재 판단용
}

/** 준비사항 조회 결과 */
export interface PrepResult {
  wish: StudentWish;
  package: AdmissionPrepPackage;
  /** 현재 학년 기준 우선순위 항목 */
  urgentNow: PrepItem[];
  /** 향후 준비 항목 */
  upcoming: PrepItem[];
  /** 놓치면 안 되는 체크포인트 */
  criticalWarnings: string[];
}
