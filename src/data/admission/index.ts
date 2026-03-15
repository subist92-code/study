export * from './types';
export { SKY_UNIVERSITIES } from './sky.data';
export { TOP_UNIVERSITIES } from './top-universities.data';
export { REGIONAL_UNIVERSITIES, MEDICAL_CUTS } from './regional-medical.data';
export type { MedicalCutData } from './regional-medical.data';
export {
  checkSuneungMinimum,
  evaluateGradeRange,
  checkRegionalEligibility,
  calcRecommendScore,
  filterUniversities,
  getMedicalRegionalOptions,
} from './filter';
export type { GradeRange } from './filter';

import { SKY_UNIVERSITIES } from './sky.data';
import { TOP_UNIVERSITIES } from './top-universities.data';
import { REGIONAL_UNIVERSITIES } from './regional-medical.data';
import type { University } from './types';

export const ALL_UNIVERSITIES: University[] = [
  ...SKY_UNIVERSITIES,
  ...TOP_UNIVERSITIES,
  ...REGIONAL_UNIVERSITIES,
];
