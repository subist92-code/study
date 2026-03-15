// learningMethods.ts — studyMethodData.ts의 re-export
// 두 파일명 모두 지원하기 위한 별칭 파일
export {
  learningMethods,
  matchingMatrix,
  getTemperament,
} from './studyMethodData'

export type { MethodKey, Temperament } from './studyMethodData'
