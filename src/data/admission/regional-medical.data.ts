// ============================================================
// 지방 거점 국립대 + 의약학 계열 데이터
// 2027학년도 기준
// ============================================================
import type { University } from './types';

export const REGIONAL_UNIVERSITIES: University[] = [

  // ──────────── 부산대 ────────────
  {
    id: 'pnu',
    name: '부산대학교',
    shortName: '부산대',
    tier: '지거국',
    region: '부산',
    admissionUrl: 'https://go.pusan.ac.kr',
    totalQuota: 4100,
    susiRatio: 76,
    admissionPlans: [
      {
        id: 'pnu-susi-subject',
        name: '학생부교과(지역인재)',
        type: '지역인재',
        track: ['인문', '자연'],
        quota: 800,
        elements: { 교과: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 9,
          mathRequired: false,
          scienceRequired: false,
          description: '3합 9~10 이내',
        },
        gradeCut: {
          humanities: { cut70: 1.8, cut50: 1.5 },
          science:    { cut70: 1.9, cut50: 1.6 },
        },
        isRegionalTalent: true,
      },
      {
        id: 'pnu-susi-medical',
        name: '의예과 지역인재',
        type: '지역인재',
        track: ['자연'],
        quota: 139,
        elements: { 교과: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 4,
          mathRequired: true,
          scienceRequired: false,
          description: '수학포함 3합 4 이내',
        },
        gradeCut: {
          medical: { cut70: 1.3, cut50: 1.1, note: '전체 모집 200명 중 139명(70%)' },
        },
        isRegionalTalent: true,
        changes2027: '부산·울산·경남 고교 출신만 지원 가능. 정시도 지역인재 별도 운영',
      },
    ],
  },

  // ──────────── 경북대 ────────────
  {
    id: 'knu',
    name: '경북대학교',
    shortName: '경북대',
    tier: '지거국',
    region: '대구',
    admissionUrl: 'https://go.knu.ac.kr',
    totalQuota: 4500,
    susiRatio: 72,
    admissionPlans: [
      {
        id: 'knu-susi-subject',
        name: '학생부교과(지역인재)',
        type: '지역인재',
        track: ['인문', '자연'],
        quota: 900,
        elements: { 교과: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 9,
          mathRequired: false,
          scienceRequired: false,
          description: '3합 9~10 이내',
        },
        gradeCut: {
          humanities: { cut70: 1.9, cut50: 1.6 },
          science:    { cut70: 2.0, cut50: 1.7 },
        },
        isRegionalTalent: true,
      },
      {
        id: 'knu-susi-medical',
        name: '의예과 지역인재',
        type: '지역인재',
        track: ['자연'],
        quota: 100,
        elements: { 교과: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 4,
          mathRequired: true,
          scienceRequired: false,
          description: '수학포함 3합 4~5 이내 (탐구 반영 유연)',
        },
        gradeCut: {
          medical: { cut70: 1.4, cut50: 1.2, note: '전체 200명 중 100명 이상 지역인재' },
        },
        isRegionalTalent: true,
      },
    ],
  },

  // ──────────── 충남대 ────────────
  {
    id: 'cnu',
    name: '충남대학교',
    shortName: '충남대',
    tier: '지거국',
    region: '대전',
    admissionUrl: 'https://go.cnu.ac.kr',
    totalQuota: 4000,
    susiRatio: 80,
    admissionPlans: [
      {
        id: 'cnu-susi-subject',
        name: '학생부교과(일반)',
        type: '학생부교과',
        track: ['인문', '자연'],
        quota: 700,
        elements: { 교과: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 11,
          mathRequired: false,
          scienceRequired: false,
          description: '인문 3합 11~12 / 자연 수학포함 3합 9~10',
        },
        gradeCut: {
          humanities: { cut70: 2.0, cut50: 1.7 },
          science:    { cut70: 2.1, cut50: 1.8 },
        },
        isRegionalTalent: false,
      },
      {
        id: 'cnu-susi-medical',
        name: '의예과 (수학필수)',
        type: '지역인재',
        track: ['자연'],
        quota: 50,
        elements: { 교과: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 4,
          mathRequired: true,
          scienceRequired: false,
          description: '수학(미적분/기하) 포함 3합 4 이내',
        },
        gradeCut: {
          medical: { cut70: 1.3, cut50: 1.1, note: '충청권(대전·세종·충남·충북) 고교 지원 가능' },
        },
        isRegionalTalent: true,
        changes2027: '저소득층 특별전형 별도 운영',
      },
      {
        id: 'cnu-susi-pharmacy',
        name: '약학대학',
        type: '학생부교과',
        track: ['자연'],
        quota: 30,
        elements: { 교과: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 5,
          mathRequired: true,
          scienceRequired: true,
          description: '수학포함 3합 5, 과탐 2과목 평균',
        },
        gradeCut: {
          science: { cut70: 1.5, cut50: 1.3 },
        },
        isRegionalTalent: false,
      },
    ],
  },

  // ──────────── 전남대 ────────────
  {
    id: 'jnu',
    name: '전남대학교',
    shortName: '전남대',
    tier: '지거국',
    region: '광주',
    admissionUrl: 'https://go.jnu.ac.kr',
    totalQuota: 3800,
    susiRatio: 75,
    admissionPlans: [
      {
        id: 'jnu-susi-medical',
        name: '의예과 지역인재',
        type: '지역인재',
        track: ['자연'],
        quota: 121,
        elements: { 교과: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 5,
          mathRequired: true,
          scienceRequired: false,
          description: '수학포함 3합 5 이내',
        },
        gradeCut: {
          medical: { cut70: 1.4, cut50: 1.2, note: '전체 200명 중 121명(60.5%) 지역인재' },
        },
        isRegionalTalent: true,
        changes2027: '광주·전남·전북 고교 출신 지원 가능',
      },
    ],
  },

  // ──────────── 제주대 ────────────
  {
    id: 'jeju',
    name: '제주대학교',
    shortName: '제주대',
    tier: '지거국',
    region: '기타지방',
    admissionUrl: 'https://admission.jejunu.ac.kr',
    totalQuota: 2200,
    susiRatio: 74,
    admissionPlans: [
      {
        id: 'jeju-susi-medical',
        name: '의예과 지역인재',
        type: '지역인재',
        track: ['자연'],
        quota: 20,
        elements: { 교과: 100 },
        isMultiStage: false,
        suneungMin: {
          subjectCount: 3,
          gradeSum: 6,
          mathRequired: false,
          scienceRequired: false,
          description: '3합 6 이내 (3합 5→6으로 완화)',
        },
        gradeCut: {
          medical: { cut70: 1.7, cut50: 1.4, note: '수능최저 완화로 지원 문턱 낮아짐' },
        },
        isRegionalTalent: true,
        changes2027: '수능최저 3합 5 → 3합 6으로 하향 완화',
      },
    ],
  },
];

// ============================================================
// 의약학 계열 빠른 참조 데이터
// ============================================================
export interface MedicalCutData {
  universityId: string;
  universityName: string;
  department: '의예' | '치의예' | '약학' | '한의예' | '간호';
  admissionType: string;
  quota: number;
  regionalQuota?: number;        // 지역인재 인원
  regionalRatio?: number;        // 지역인재 비율 %
  gradeCut70: number;
  suneungDesc: string;
  eligibleRegions?: string[];    // 지원 가능 지역
  note?: string;
}

export const MEDICAL_CUTS: MedicalCutData[] = [
  // 의예과
  { universityId: 'yonsei',  universityName: '연세대',  department: '의예', admissionType: '교과추천', quota: 20, gradeCut70: 1.01, suneungDesc: '수학포함 2합 4', note: '서울 전국모집' },
  { universityId: 'korea',   universityName: '고려대',  department: '의예', admissionType: '학교추천', quota: 20, gradeCut70: 1.01, suneungDesc: '4합 5 이내', note: '서울 전국모집' },
  { universityId: 'skku',    universityName: '성균관대', department: '의예', admissionType: '학생부교과', quota: 28, gradeCut70: 1.05, suneungDesc: '4합 5 이내', note: '삼성서울병원 연계' },
  { universityId: 'hanyang', universityName: '한양대',  department: '의예', admissionType: '면접형(신설)', quota: 16, gradeCut70: 1.1, suneungDesc: '수학포함 4합 5', changes2027: '2027 신설' } as any,
  { universityId: 'pnu',     universityName: '부산대',  department: '의예', admissionType: '지역인재', quota: 139, regionalQuota: 139, regionalRatio: 70, gradeCut70: 1.3, suneungDesc: '수학포함 3합 4', eligibleRegions: ['부산', '울산', '경남'] },
  { universityId: 'knu',     universityName: '경북대',  department: '의예', admissionType: '지역인재', quota: 100, regionalQuota: 100, regionalRatio: 50, gradeCut70: 1.4, suneungDesc: '수학포함 3합 4~5', eligibleRegions: ['대구', '경북'] },
  { universityId: 'cnu',     universityName: '충남대',  department: '의예', admissionType: '지역인재', quota: 50, regionalQuota: 50, regionalRatio: 60, gradeCut70: 1.3, suneungDesc: '수학포함 3합 4', eligibleRegions: ['대전', '세종', '충남', '충북'] },
  { universityId: 'jnu',     universityName: '전남대',  department: '의예', admissionType: '지역인재', quota: 121, regionalQuota: 121, regionalRatio: 60.5, gradeCut70: 1.4, suneungDesc: '수학포함 3합 5', eligibleRegions: ['광주', '전남', '전북'] },
  { universityId: 'jeju',    universityName: '제주대',  department: '의예', admissionType: '지역인재', quota: 20, regionalQuota: 20, regionalRatio: 100, gradeCut70: 1.7, suneungDesc: '3합 6 이내(완화)', eligibleRegions: ['제주'] },
  // 약학
  { universityId: 'yonsei',  universityName: '연세대',  department: '약학', admissionType: '교과추천', quota: 5, gradeCut70: 1.04, suneungDesc: '수학포함 2합 5', note: '의대급 경쟁' },
  { universityId: 'skku',    universityName: '성균관대', department: '약학', admissionType: '학생부교과', quota: 20, gradeCut70: 1.15, suneungDesc: '4합 5 이내' },
  { universityId: 'khu',     universityName: '경희대',  department: '약학', admissionType: '교과·학종', quota: 25, gradeCut70: 1.3, suneungDesc: '과탐포함 3합 5' },
  { universityId: 'ewha',    universityName: '이화여대', department: '약학', admissionType: '교과·학종', quota: 30, gradeCut70: 1.3, suneungDesc: '3합 5~6' },
  { universityId: 'cnu',     universityName: '충남대',  department: '약학', admissionType: '학생부교과', quota: 30, gradeCut70: 1.5, suneungDesc: '수학포함 3합 5 과탐2' },
  // 치의예
  { universityId: 'yonsei',  universityName: '연세대',  department: '치의예', admissionType: '학생부종합', quota: 15, gradeCut70: 1.32, suneungDesc: '2합 4~5', note: '2027 논술→학종 전환' },
];
