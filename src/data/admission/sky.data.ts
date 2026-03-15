// ============================================================
// SKY 대학 데이터 (서울대·연세대·고려대)
// 2027학년도 기준 | 70% 컷라인 참고값
// ============================================================
import type { University } from './types';

export const SKY_UNIVERSITIES: University[] = [

  // ──────────────────────────────────────────────
  // 서울대학교
  // ──────────────────────────────────────────────
  {
    id: 'snu',
    name: '서울대학교',
    shortName: '서울대',
    tier: 'SKY',
    region: '서울',
    admissionUrl: 'https://admission.snu.ac.kr',
    totalQuota: 3532,
    susiRatio: 74,
    admissionPlans: [
      {
        id: 'snu-susi-regional',
        name: '지역균형선발전형',
        type: '학생부종합',
        track: ['인문', '자연'],
        quota: 680,
        elements: { 서류: 70, 면접: 30 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 7,
          mathRequired: false,
          scienceRequired: false,
          description: '3개 영역 등급 합 7 이내',
        },
        gradeCut: {
          humanities: { cut70: 1.3, cut50: 1.1, topCut: 1.0, note: '전교권 최상위' },
          science:    { cut70: 1.4, cut50: 1.2, topCut: 1.0 },
        },
        isRegionalTalent: false,
        changes2027: '안정적 구조 유지',
      },
      {
        id: 'snu-susi-general',
        name: '일반전형(학종)',
        type: '학생부종합',
        track: ['인문', '자연'],
        quota: 1556,
        elements: { 서류: 100 },
        isMultiStage: true,
        stage1Multiple: 2,
        suneungMin: undefined, // 수능최저 없음
        gradeCut: {
          humanities: { cut70: 1.8, cut50: 1.5, note: '세특·탐구역량이 당락 결정' },
          science:    { cut70: 2.0, cut50: 1.6 },
          medical:    { cut70: 1.4, cut50: 1.1 },
        },
        isRegionalTalent: false,
        changes2027: '생활과학대 식품영양학과 문이과 통합 지원 가능, 사범대 정시 결격면접 강화',
      },
      {
        id: 'snu-jeongsi-general',
        name: '정시 일반전형(나군)',
        type: '정시',
        track: ['인문', '자연'],
        quota: 900,
        elements: { 수능: 80, 교과평가: 20 },
        isMultiStage: false,
        percentileCut: {
          humanities: { cut70: 96, cut50: 97, note: '국영수사 합산' },
          science:    { cut70: 95, cut50: 97, note: '국영수과 합산' },
        },
        isRegionalTalent: false,
        changes2027: '교과평가 AA~BB 필요, 내신 사실상 필수',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 연세대학교
  // ──────────────────────────────────────────────
  {
    id: 'yonsei',
    name: '연세대학교',
    shortName: '연세대',
    tier: 'SKY',
    region: '서울',
    admissionUrl: 'https://admission.yonsei.ac.kr',
    totalQuota: 3650,
    susiRatio: 68,
    admissionPlans: [
      {
        id: 'yonsei-susi-recommend',
        name: '추천형(교과)',
        type: '학생부교과',
        track: ['인문', '자연'],
        quota: 530,
        elements: { 교과: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 2,
          gradeSum: 4,
          mathRequired: false,
          scienceRequired: false,
          englishMin: 2,
          description: '인문 2합 4 / 자연 수학포함 2합 5',
        },
        gradeCut: {
          humanities: { cut70: 1.3, cut50: 1.1, note: '학교장 추천 필수' },
          science:    { cut70: 1.4, cut50: 1.2 },
          medical:    { cut70: 1.01, cut50: 1.0, note: '전국 최상위 내신 집중' },
        },
        isRegionalTalent: false,
        changes2027: '치의예 논술 폐지 → 학생부 위주 전환',
      },
      {
        id: 'yonsei-susi-active',
        name: '활동우수형(학종)',
        type: '학생부종합',
        track: ['인문', '자연'],
        quota: 820,
        elements: { 서류: 60, 면접: 40 },
        isMultiStage: true,
        stage1Multiple: 3,
        suneungMin: {
          subjectCount: 2,
          gradeSum: 4,
          mathRequired: false,
          scienceRequired: false,
          description: '인문 2합 4 / 자연 2합 5',
        },
        gradeCut: {
          humanities: { cut70: 1.8, cut50: 1.5 },
          science:    { cut70: 1.9, cut50: 1.6 },
          medical:    { cut70: 1.09, cut50: 1.0 },
        },
        isRegionalTalent: false,
        changes2027: '다면사고평가(과학제시문) 신설, 수리 비중 축소',
      },
      {
        id: 'yonsei-susi-mugeon',
        name: '진리자유학부(무전공)',
        type: '학생부종합',
        track: ['무전공'],
        quota: 259,
        elements: { 서류: 60, 면접: 40 },
        isMultiStage: true,
        stage1Multiple: 3,
        suneungMin: {
          subjectCount: 2,
          gradeSum: 5,
          mathRequired: false,
          scienceRequired: false,
          description: '2합 5 이내',
        },
        gradeCut: {
          humanities: { cut70: 2.0, cut50: 1.7, note: '신설 전형, 입결 추정치' },
          science:    { cut70: 2.1, cut50: 1.8 },
        },
        isRegionalTalent: false,
        changes2027: '2027 신설. 의예·치의예·약학·간호 제외 전공 자유 선택',
      },
      {
        id: 'yonsei-susi-essay',
        name: '논술전형',
        type: '논술',
        track: ['인문', '자연'],
        quota: 380,
        elements: { 논술: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 2,
          gradeSum: 5,
          mathRequired: true,
          scienceRequired: false,
          description: '자연: 수학포함 2합 5',
        },
        isRegionalTalent: false,
        changes2027: '다면사고평가 신설, 치의예 논술 선발 폐지',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 고려대학교
  // ──────────────────────────────────────────────
  {
    id: 'korea',
    name: '고려대학교',
    shortName: '고려대',
    tier: 'SKY',
    region: '서울',
    admissionUrl: 'https://oku.korea.ac.kr',
    totalQuota: 4669,
    susiRatio: 58,
    admissionPlans: [
      {
        id: 'korea-susi-school',
        name: '학교추천(교과)',
        type: '학생부교과',
        track: ['인문', '자연'],
        quota: 850,
        elements: { 교과: 90, 서류: 10 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 7,
          mathRequired: false,
          scienceRequired: false,
          koreanHistoryMin: 4,
          description: '3합 7 이내 (한국사 4등급)',
        },
        gradeCut: {
          humanities: { cut70: 1.5, cut50: 1.3 },
          science:    { cut70: 1.6, cut50: 1.4 },
          medical:    { cut70: 1.01, cut50: 1.0 },
        },
        isRegionalTalent: false,
        changes2027: '경쟁률 20.5→12.89 하락 (2026 기준)',
      },
      {
        id: 'korea-susi-academic',
        name: '학업우수전형(학종)',
        type: '학생부종합',
        track: ['인문', '자연'],
        quota: 700,
        elements: { 서류: 100 },
        isMultiStage: false, // 면접 폐지!
        suneungMin: {
          subjectCount: 4,
          gradeSum: 8,
          mathRequired: false,
          scienceRequired: false,
          description: '4합 8 이내 (경영학과 4합 5)',
        },
        gradeCut: {
          humanities: { cut70: 1.8, cut50: 1.5 },
          science:    { cut70: 1.9, cut50: 1.6 },
        },
        isRegionalTalent: false,
        changes2027: '면접 완전 폐지 → 서류 100% 일괄 전환 (2027 핵심 변화)',
      },
      {
        id: 'korea-susi-field',
        name: '계열적합전형(학종)',
        type: '학생부종합',
        track: ['인문', '자연'],
        quota: 500,
        elements: { 서류: 100 },
        isMultiStage: true,
        stage1Multiple: 5,
        suneungMin: undefined, // 수능최저 없음
        gradeCut: {
          humanities: { cut70: 2.2, cut50: 1.9, note: '내신보다 활동·역량 중시' },
          science:    { cut70: 2.3, cut50: 2.0 },
        },
        isRegionalTalent: false,
      },
      {
        id: 'korea-susi-essay',
        name: '논술전형',
        type: '논술',
        track: ['인문', '자연'],
        quota: 349,
        elements: { 논술: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 4,
          gradeSum: 8,
          mathRequired: false,
          scienceRequired: false,
          description: '4합 8 이내 (경영 4합 5)',
        },
        isRegionalTalent: false,
        changes2027: '논술 100% 방식 유지. 내신 불리한 학생 진입 창구',
      },
      {
        id: 'korea-jeongsi-general',
        name: '정시 일반전형(나군)',
        type: '정시',
        track: ['인문', '자연'],
        quota: 1100,
        elements: { 수능: 100 },
        isMultiStage: false,
        percentileCut: {
          humanities: { cut70: 94, cut50: 96 },
          science:    { cut70: 94, cut50: 96 },
        },
        isRegionalTalent: false,
      },
      {
        id: 'korea-jeongsi-subject',
        name: '정시 교과우수전형(가군)',
        type: '정시',
        track: ['인문', '자연'],
        quota: 770,
        elements: { 수능: 80, 교과: 20 },
        isMultiStage: false,
        percentileCut: {
          humanities: { cut70: 92, cut50: 94, note: '내신 3등급 이하 불리' },
          science:    { cut70: 92, cut50: 94 },
        },
        isRegionalTalent: false,
        changes2027: '내신 반영으로 내신 우수자 유리',
      },
    ],
  },
];
