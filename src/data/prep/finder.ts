// ============================================================
// 희망 대학/학과별 준비사항 조회 유틸리티 (nachipmban 적용판)
// ============================================================
import type {
  StudentWish, PrepResult, PrepItem,
  AdmissionPrepPackage, SchoolYear,
} from './types';
import { SKY_PREP_PACKAGES } from './sky-prep.data';
import { COMMON_WARNINGS_2027 } from './common-eval.data';

const ALL_PACKAGES: AdmissionPrepPackage[] = [
  ...SKY_PREP_PACKAGES,
];

export function getPrepResult(wish: StudentWish): PrepResult | null {
  const pkg = findPackage(wish);
  if (!pkg) return null;

  const allItems = getAllItems(pkg);
  const commonItems = COMMON_WARNINGS_2027;

  const urgentNow = [...commonItems, ...allItems].filter(item =>
    item.startYear <= wish.currentYear &&
    (item.urgency === 'critical' || item.urgency === 'high')
  );

  const upcoming = allItems.filter(item =>
    item.startYear > wish.currentYear
  );

  const criticalWarnings = buildCriticalWarnings(wish, pkg);

  return { wish, package: pkg, urgentNow, upcoming, criticalWarnings };
}

function findPackage(wish: StudentWish): AdmissionPrepPackage | null {
  let pkg = ALL_PACKAGES.find(p =>
    p.universityId === wish.universityId &&
    p.admissionType === wish.admissionType &&
    p.admissionYear === wish.admissionYear
  );
  if (!pkg && wish.admissionYear === 2028) {
    pkg = ALL_PACKAGES.find(p =>
      p.universityId === wish.universityId &&
      p.admissionType === wish.admissionType
    );
  }
  return pkg ?? null;
}

function getAllItems(pkg: AdmissionPrepPackage): PrepItem[] {
  return [...pkg.roadmap.year1, ...pkg.roadmap.year2, ...pkg.roadmap.year3];
}

function buildCriticalWarnings(wish: StudentWish, pkg: AdmissionPrepPackage): string[] {
  const warnings: string[] = [];

  if (pkg.admissionType === '지역인재' && !wish.region) {
    warnings.push('지역인재 전형입니다. 거주 지역을 입력해야 지원 자격 여부를 확인할 수 있습니다.');
  }
  if (wish.currentYear === 3 && pkg.suneungMinPrep) {
    warnings.push(`수능최저 조건: ${pkg.suneungMinPrep.requirement} — 9월 모평 기준으로 충족 여부를 반드시 확인하세요.`);
  }
  if (pkg.admissionType === '논술' && wish.currentYear >= 3) {
    warnings.push('논술전형은 단기 준비가 어렵습니다. 기출 문제 집중 분석과 실전 연습에 집중하세요.');
  }
  if (wish.admissionYear === 2028) {
    warnings.push('2028학년도: 내신 5등급제 전환. 등급보다 세특·정성평가 비중이 크게 높아집니다.');
    warnings.push('2028학년도: 수능 선택과목 폐지. 통합사회·통합과학 필수 응시 준비 필요.');
  }
  if (wish.universityId === 'snu' && wish.admissionType === '정시_수능' && wish.admissionYear === 2028) {
    warnings.push('서울대 2028 정시: 1단계 수능 등급합(3배수) → 2단계 수능백분위 60%+교과평가 40%. 내신이 정시에도 결정적 영향.');
  }
  warnings.push('2027~2028: 학교폭력 조치 사항이 모든 전형에 반드시 반영됩니다.');

  return warnings;
}

export function getPrepByYear(wish: StudentWish, year: SchoolYear): PrepItem[] {
  const pkg = findPackage(wish);
  if (!pkg) return [];
  const key = `year${year}` as 'year1' | 'year2' | 'year3';
  return [...COMMON_WARNINGS_2027, ...pkg.roadmap[key]];
}
