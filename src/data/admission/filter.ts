// ============================================================
// 나침반 대입 컨설팅 - 핵심 필터링 유틸리티
// Next.js + React Native 공용 (순수 TypeScript, 의존성 없음)
// ============================================================
import type {
  StudentProfile,
  FilterResult,
  University,
  AdmissionPlan,
  SuneungMinimum,
} from './types';  // ← 수정: '../types/admission' → './types'

// ──────────────────────────────────────────────────────────
// 1. 수능 최저 충족 여부 판단
// ──────────────────────────────────────────────────────────

/**
 * 수능 최저학력기준 충족 여부 계산
 * @returns true=충족 / false=미충족 / null=점수 미입력
 */
export function checkSuneungMinimum(
  profile: StudentProfile,
  minimum: SuneungMinimum | undefined
): boolean | null {
  // 수능최저 없는 전형
  if (!minimum) return true;

  const grades = profile.suneungGrades;
  if (!grades) return null; // 수능 점수 미입력

  // 사용 가능한 영역 수집 (수능최저에 쓸 수 있는 영역)
  const available: number[] = [];

  if (grades['국어'] !== undefined) available.push(grades['국어']);

  // 수학 처리 (필수 여부 체크)
  if (grades['수학'] !== undefined) {
    if (minimum.mathRequired) {
      // 수학 필수 포함: 수학을 반드시 쓰고 나머지에서 채움
      const mathGrade = grades['수학'];
      const others = (
        [grades['국어'], grades['탐구1'], grades['탐구2']]
          .filter((g): g is number => g !== undefined)
      );
      // 수학 + 최적 n-1개 조합
      const combined = [mathGrade, ...others].sort((a, b) => a - b);
      const sum = combined.slice(0, minimum.subjectCount).reduce((a, b) => a + b, 0);
      return sum <= minimum.gradeSum;
    }
    available.push(grades['수학']);
  } else if (minimum.mathRequired) {
    return false; // 수학 필수인데 미응시
  }

  if (grades['탐구1'] !== undefined) available.push(grades['탐구1']);
  if (grades['탐구2'] !== undefined) available.push(grades['탐구2']);

  // 과탐 필수 체크
  if (minimum.scienceRequired) {
    const hasSciTank = grades['탐구1'] !== undefined || grades['탐구2'] !== undefined;
    if (!hasSciTank) return false;
  }

  // 영어 별도 조건
  if (minimum.englishMin && grades['영어'] !== undefined) {
    if (grades['영어'] > minimum.englishMin) return false;
  }

  // 한국사 조건
  if (minimum.koreanHistoryMin && grades['한국사'] !== undefined) {
    if (grades['한국사'] > minimum.koreanHistoryMin) return false;
  }

  // 최적 조합 (등급 합이 가장 낮은 n개 선택)
  const sorted = available.sort((a, b) => a - b);
  if (sorted.length < minimum.subjectCount) return null; // 영역 부족

  const bestSum = sorted.slice(0, minimum.subjectCount).reduce((a, b) => a + b, 0);
  return bestSum <= minimum.gradeSum;
}

// ──────────────────────────────────────────────────────────
// 2. 내신 등급 범위 판단
// ──────────────────────────────────────────────────────────

/**
 * 내신 등급이 해당 전형 컷라인 범위 내인지 판단
 * - 교과/학종: gradeCut 기준
 * - 정시: percentileCut 없으면 수능등급으로 대략 판단
 * @returns 'safe' | 'possible' | 'reach' | 'unlikely'
 */
export type GradeRange = 'safe' | 'possible' | 'reach' | 'unlikely';

export function evaluateGradeRange(
  naesinGrade: number,
  plan: AdmissionPlan,
  track: '인문' | '자연' | '의약학'
): GradeRange {
  // ── 정시 전형: gradeCut 대신 percentileCut 또는 수능 기반 판단 ──
  if (plan.type === '정시') {
    const pCut = plan.percentileCut;
    const cut = track === '자연' ? pCut?.science : pCut?.humanities;
    if (cut) {
      // 정시는 수능 백분위가 핵심이므로 내신은 참고용으로만 사용
      return 'possible'; // 수능 점수 입력 요청 필요 → 별도 함수에서 처리
    }
    // percentileCut도 없으면 수능 점수 필요 표시
    return 'possible';
  }

  // ── 수시 전형: gradeCut 기준 ──
  const cutMap = plan.gradeCut;

  // gradeCut 자체가 없으면 → 데이터 미비, 필터링 불가
  if (!cutMap) return 'possible';

  const cut =
    track === '의약학' ? cutMap.medical :
    track === '인문'   ? cutMap.humanities :
                         cutMap.science;

  // 해당 계열 컷이 없으면 → 데이터 미비
  if (!cut) return 'possible';

  const buffer = plan.type === '학생부종합' ? 0.5 : 0.15;

  if (naesinGrade <= (cut.topCut ?? cut.cut50 ?? cut.cut70 - 0.3)) return 'safe';
  if (naesinGrade <= cut.cut70)              return 'possible';
  if (naesinGrade <= cut.cut70 + buffer)     return 'reach';
  return 'unlikely';
}

/**
 * 정시 전형 수능 백분위 기반 평가 (별도 함수)
 * suneungAvgPercentile: 주요 영역 백분위 평균
 */
export function evaluateJeongsiRange(
  suneungAvgPercentile: number | undefined,
  plan: AdmissionPlan,
  track: '인문' | '자연'
): GradeRange {
  if (plan.type !== '정시') return 'possible';
  if (suneungAvgPercentile === undefined) return 'possible'; // 미입력

  const pCut = plan.percentileCut;
  const cut = track === '자연' ? pCut?.science : pCut?.humanities;
  if (!cut) return 'possible';

  if (suneungAvgPercentile >= (cut.topCut ?? cut.cut50 ?? cut.cut70 + 1)) return 'safe';
  if (suneungAvgPercentile >= cut.cut70)      return 'possible';
  if (suneungAvgPercentile >= cut.cut70 - 3)  return 'reach';
  return 'unlikely';
}

// ──────────────────────────────────────────────────────────
// 3. 지역인재 해당 여부
// ──────────────────────────────────────────────────────────

const REGIONAL_MAP: Record<string, string[]> = {
  'pnu':  ['부산', '울산', '경남', '경상남도', '경남도'],
  'knu':  ['대구', '경북', '경상북도'],
  'cnu':  ['대전', '세종', '충남', '충북', '충청남도', '충청북도'],
  'jnu':  ['광주', '전남', '전북', '전라남도', '전라북도'],
  'jeju': ['제주', '제주도', '제주특별자치도'],
};

export function checkRegionalEligibility(
  universityId: string,
  studentRegion: string | undefined
): boolean {
  if (!studentRegion) return false;
  const eligible = REGIONAL_MAP[universityId];
  if (!eligible) return false;
  return eligible.some(r => studentRegion.includes(r) || r.includes(studentRegion));
}

// ──────────────────────────────────────────────────────────
// 4. 추천 점수 계산
// ──────────────────────────────────────────────────────────

export function calcRecommendScore(
  gradeRange: GradeRange,
  suneungOk: boolean | null,
  regionalMatch: boolean,
  planType: string,
  /** 수능 평균 등급 (정시 전형 현실 반영용) */
  suneungAvgGrade?: number,
  /** 정시 전형인지 여부 */
  isJeongsi?: boolean,
): number {
  let score = 0;

  // ── 정시 전형: 수능 등급이 핵심 ──
  if (isJeongsi) {
    if (suneungAvgGrade === undefined) {
      // 수능 미입력 → 판단 불가, 낮은 점수
      return 20;
    }
    // 수능 평균 등급 → 점수 환산
    // 1등급=100, 2등급=80, 3등급=55, 4등급=30, 5등급 이하=5
    const jeongsiGradeScore: Record<number, number> = {
      1: 100, 2: 80, 3: 55, 4: 30, 5: 5, 6: 0, 7: 0, 8: 0, 9: 0,
    };
    const key = Math.round(suneungAvgGrade);
    return jeongsiGradeScore[key] ?? 0;
  }

  // ── 수시 전형: 내신 기반 점수 ──
  const gradeScore: Record<GradeRange, number> = {
    safe: 40, possible: 30, reach: 15, unlikely: 0,
  };
  score += gradeScore[gradeRange];

  // 수능최저 충족
  if (suneungOk === true)       score += 35;
  else if (suneungOk === null)  score += 20; // 미입력 → 중립
  else                          score += 0;  // 미충족

  // 지역인재 보너스
  if (regionalMatch) score += 20;

  // 논술: 내신 불리해도 기본 보장
  if (planType === '논술') score = Math.max(score, 25);

  return Math.min(score, 100);
}

// ──────────────────────────────────────────────────────────
// 5. 메인 필터링 함수
// ──────────────────────────────────────────────────────────

export function filterUniversities(
  profile: StudentProfile,
  universities: University[]
): FilterResult[] {
  const results: FilterResult[] = [];
  const medicalTrack = profile.aimMedical ? '의약학' as const : undefined;

  // 수능 평균 등급 계산 (정시용)
  const suneungAvgGrade = (() => {
    const g = profile.suneungGrades;
    if (!g) return undefined;
    const vals = (['국어', '수학', '탐구1', '탐구2'] as const)
      .map(k => g[k])
      .filter((v): v is number => v !== undefined);
    if (vals.length === 0) return undefined;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  })();

  // 수능 평균 백분위 계산 (정시 범위 평가용)
  // 등급 → 백분위 근사 변환
  const gradeToPercentile = (g: number) =>
    g <= 1 ? 97 : g <= 2 ? 89 : g <= 3 ? 77 : g <= 4 ? 60 : g <= 5 ? 40 : 20;

  const suneungAvgPercentile = (() => {
    const g = profile.suneungGrades;
    if (!g) return undefined;
    const vals = (['국어', '수학', '탐구1', '탐구2'] as const)
      .map(k => g[k])
      .filter((v): v is number => v !== undefined);
    if (vals.length === 0) return undefined;
    const percs = vals.map(gradeToPercentile);
    return percs.reduce((a, b) => a + b, 0) / percs.length;
  })();

  for (const univ of universities) {
    for (const plan of univ.admissionPlans) {

      // 계열 필터
      const trackOk =
        plan.track.includes(profile.track) ||
        plan.track.includes('무전공');
      if (!trackOk) continue;

      // 지역인재 매칭
      const regionalMatch = plan.isRegionalTalent
        ? checkRegionalEligibility(univ.id, profile.region)
        : false;
      if (plan.isRegionalTalent && !regionalMatch) continue;

      // 수능최저 충족 여부
      const suneungOk = checkSuneungMinimum(profile, plan.suneungMin);

      const isJeongsi = plan.type === '정시';
      const jeongsiTrack = profile.track === '자연' ? '자연' : '인문';

      // 내신/수능 범위 평가
      let gradeRange: GradeRange | null = null;
      let gradeInRange: boolean | null = null;

      if (isJeongsi) {
        // 정시: 수능 백분위 기반
        gradeRange = evaluateJeongsiRange(suneungAvgPercentile, plan, jeongsiTrack);
        gradeInRange = suneungAvgPercentile !== undefined
          ? gradeRange !== 'unlikely'
          : null;
      } else if (profile.naesinGrade !== undefined) {
        // 수시: 내신 기반
        const evalTrack = medicalTrack ?? jeongsiTrack;
        gradeRange = evaluateGradeRange(profile.naesinGrade, plan, evalTrack);
        gradeInRange = gradeRange !== 'unlikely';
      }

      // ── 내신 입력됐는데 수시 전형이 unlikely면 제외 (현실적 필터링) ──
      if (!isJeongsi && gradeRange === 'unlikely') continue;

      // 최종 eligible
      const eligible = suneungOk !== false && gradeRange !== 'unlikely';

      // 추천 점수
      const recommendScore = calcRecommendScore(
        gradeRange ?? 'possible',
        suneungOk,
        regionalMatch,
        plan.type,
        suneungAvgGrade,
        isJeongsi,
      );

      const comment = buildComment(
        plan, gradeRange ?? 'possible', suneungOk, regionalMatch,
        isJeongsi, suneungAvgGrade,
      );

      // ── gradeRange 포함해서 push ──
      results.push({
        university: univ,
        plan,
        eligible,
        suneungSatisfied: suneungOk,
        gradeInRange,
        gradeRange,       // ← FilterResult 타입에 필요한 필드
        regionalMatch,
        recommendScore,
        comment,
      });
    }
  }

  return results.sort((a, b) => b.recommendScore - a.recommendScore);
}

// ──────────────────────────────────────────────────────────
// 6. 코멘트 빌더
// ──────────────────────────────────────────────────────────

function buildComment(
  plan: AdmissionPlan,
  gradeRange: GradeRange,
  suneungOk: boolean | null,
  regionalMatch: boolean,
  isJeongsi?: boolean,
  suneungAvgGrade?: number,
): string {
  const parts: string[] = [];

  if (isJeongsi) {
    if (suneungAvgGrade === undefined) {
      parts.push('⚠ 수능 점수 입력 필요 (정시 판단 불가)');
    } else if (suneungAvgGrade <= 1.5) {
      parts.push('수능 안정권');
    } else if (suneungAvgGrade <= 2.5) {
      parts.push('수능 가능권');
    } else if (suneungAvgGrade <= 3.5) {
      parts.push('수능 소신 지원권');
    } else {
      parts.push('⚠ 수능 등급 부족 (정시 지원 어려움)');
    }
    if (plan.elements['교과']) parts.push('내신 반영 있음');
  } else {
    const gradeMsg: Record<GradeRange, string> = {
      safe:     '내신 안정권',
      possible: '내신 지원 가능권',
      reach:    '내신 소신 지원권 (상향)',
      unlikely: '⚠ 내신 부족',
    };
    parts.push(gradeMsg[gradeRange]);
  }

  if (plan.suneungMin) {
    if (suneungOk === true)       parts.push(`수능최저(${plan.suneungMin.description}) 충족`);
    else if (suneungOk === false) parts.push(`⚠ 수능최저(${plan.suneungMin.description}) 미충족`);
    else                          parts.push(`수능최저(${plan.suneungMin.description}) — 점수 입력 필요`);
  } else if (!isJeongsi) {
    parts.push('수능최저 없음');
  }

  if (regionalMatch)     parts.push('✅ 지역인재 해당');
  if (plan.changes2027)  parts.push(`📌 ${plan.changes2027}`);

  return parts.join(' | ');
}

// ──────────────────────────────────────────────────────────
// 7. 편의 함수: 의대 지역인재 빠른 체크
// ──────────────────────────────────────────────────────────

export function getMedicalRegionalOptions(
  studentRegion: string,
  naesinGrade: number,
  suneungGrades?: Partial<Record<string, number>>
): Array<{ university: string; dept: string; eligible: boolean; note: string }> {
  const medicalRegionals = [
    { univ: '부산대', id: 'pnu', regions: ['부산','울산','경남'], cut: 1.3, suneungDesc: '수학포함 3합 4' },
    { univ: '경북대', id: 'knu', regions: ['대구','경북'],         cut: 1.4, suneungDesc: '수학포함 3합 4~5' },
    { univ: '충남대', id: 'cnu', regions: ['대전','세종','충남','충북'], cut: 1.3, suneungDesc: '수학포함 3합 4' },
    { univ: '전남대', id: 'jnu', regions: ['광주','전남','전북'],   cut: 1.4, suneungDesc: '수학포함 3합 5' },
    { univ: '제주대', id: 'jeju', regions: ['제주'],               cut: 1.7, suneungDesc: '3합 6 이내' },
  ];

  return medicalRegionals.map(item => {
    const regionOk = item.regions.some(r => studentRegion.includes(r));
    const gradeOk = naesinGrade <= item.cut + 0.3;
    const eligible = regionOk && gradeOk;
    return {
      university: item.univ,
      dept: '의예과',
      eligible,
      note: regionOk
        ? (gradeOk ? `지원 가능권 (수능: ${item.suneungDesc})` : `내신 다소 부족 (컷 ${item.cut}등급)`)
        : '지역 미해당',
    };
  });
}
