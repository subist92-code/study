// ============================================================
// SKY 대학 전형별 준비사항 패키지
// 서울대·연세대·고려대 — 2027·2028학년도
// ============================================================
import type { AdmissionPrepPackage } from './types';

export const SKY_PREP_PACKAGES: AdmissionPrepPackage[] = [

  // ══════════════════════════════════════════════════════════
  // 서울대학교 — 학생부종합 일반전형 (자연계열 기준)
  // ══════════════════════════════════════════════════════════
  {
    universityId: 'snu',
    universityName: '서울대학교',
    department: '자연계열 전반 (공학부·자연과학대·농업생명과학대 등)',
    admissionType: '학생부종합',
    admissionYear: 2027,
    keyRequirements: [
      '수능최저 없음 — 서류+면접으로만 선발',
      '1단계 서류 100%(2배수) → 2단계 서류 70%+면접 30%',
      '제시문 기반 구술면접 (수학·과학 원리 논리적 설명)',
      '고교 교육과정 내 심화 탐구 활동이 세특에 반드시 반영되어야 함',
      '의예·치의예·수의예: MMI(다중미니면접) 추가',
    ],
    roadmap: {
      year1: [
        {
          id: 'snu-y1-naesin',
          category: '내신관리',
          title: '전 과목 고른 내신 관리',
          description: '서울대 학종은 특정 과목만 잘해도 안 됨. 국·수·영·사·과 균형 있게',
          urgency: 'critical',
          startYear: 1,
          actionItems: [
            '1등급대 목표로 전 과목 균형 유지',
            '예체능 포함 모든 과목 성실히 임할 것 (교사 관찰 대상)',
            '내신 하락 과목 즉시 보완 — 상승 곡선이 중요',
          ],
        },
        {
          id: 'snu-y1-setuk',
          category: '세특관리',
          title: '수업 중 탐구력 증명 세특 기반 만들기',
          description: '서울대는 세특에서 "이 학생이 얼마나 깊게 생각하는가"를 본다',
          urgency: 'critical',
          startYear: 1,
          actionItems: [
            '모든 수업에서 "왜?"라는 질문을 던지고 추가 조사 실시',
            '수행평가 주제를 희망 전공과 연결',
            '선생님께 수업 후 질문 → 교사 기억에 남을 것',
            '탐구 과정: 동기→탐구→결론→후속질문 구조로 세특 기재 요청',
          ],
        },
        {
          id: 'snu-y1-subject',
          category: '과목이수',
          title: '전공 관련 과목 이수 계획 수립',
          description: '서울대는 고교에서 해당 전공 관련 과목을 제대로 이수했는지 확인',
          urgency: 'high',
          startYear: 1,
          actionItems: [
            '서울대 입학처 공식 홈페이지 → 학과별 권장 이수 과목 확인',
            '자연계: 수학(미적분·확률과통계), 물리학·화학·생명과학·지구과학 중 전공 연계 과목',
            '2~3학년 선택 과목 로드맵 미리 작성',
          ],
        },
      ],
      year2: [
        {
          id: 'snu-y2-deepdive',
          category: '탐구활동',
          title: '전공 연계 심화 탐구 프로젝트 시작',
          description: '단순 관심 표현이 아닌 "실제로 탐구한 결과물"이 있어야 함',
          urgency: 'critical',
          startYear: 2,
          actionItems: [
            '교과 수업 기반 R&E (소논문) 탐구 기획',
            '희망 학과 관련 현상·문제를 주제로 실험·조사 설계',
            '탐구 결과를 여러 교과 세특에 연계하여 기재',
            '독서 → 질문 → 탐구 → 결론 사이클 완성',
          ],
        },
        {
          id: 'snu-y2-interview-prep',
          category: '면접준비',
          title: '제시문 기반 구술면접 대비 시작',
          description: '서울대 면접은 제시문을 주고 논리적으로 설명하는 방식',
          urgency: 'high',
          startYear: 2,
          actionItems: [
            '서울대 입학처 기출 면접 문제 분석',
            '수학·과학 원리를 말로 설명하는 연습',
            '"왜 이렇게 되는가?"를 논리적으로 풀어내는 연습',
            '사범대: 교직 적성·인성 면접 추가 대비',
          ],
        },
        {
          id: 'snu-y2-dongari',
          category: '동아리',
          title: '전공 연계 동아리 핵심 역할 수행',
          description: '동아리 활동이 진로역량을 증명하는 주요 경로',
          urgency: 'high',
          startYear: 2,
          actionItems: [
            '전공 관련 학술 동아리 활동 (물리·화학·수학·컴퓨터 등)',
            '동아리 내 탐구 프로젝트 주도',
            '임원/기획자 역할 수행 → 리더십 증명',
          ],
        },
      ],
      year3: [
        {
          id: 'snu-y3-final-setuk',
          category: '세특관리',
          title: '3학년 1학기 — 세특 완성도 극대화',
          description: '서울대 서류 평가에서 3학년 1학기까지 세특이 핵심',
          urgency: 'critical',
          startYear: 3,
          deadline: '3학년 1학기 종료 전',
          actionItems: [
            '1~2학년 탐구 활동의 심화 버전을 3학년 세특에 완성',
            '희망 학과 연구 분야와 연계된 최신 논문·이슈 탐구',
            '모든 교과에서 "이 학과를 위해 이 수업을 이렇게 활용했다"는 스토리 완성',
          ],
        },
        {
          id: 'snu-y3-interview-final',
          category: '면접준비',
          title: '제시문 면접 집중 대비',
          description: '수능 이후 면접까지 2~3주 — 집중 준비 필요',
          urgency: 'critical',
          startYear: 3,
          deadline: '수능 이후 면접일 전',
          actionItems: [
            '최근 3년 기출 문제 완전 분석',
            '제시문 → 핵심 파악 → 논리 구성 → 발표 연습 루틴',
            '수학 증명, 과학 실험 원리 설명 연습',
            '예상 질문 리스트 작성 후 모의 면접 실시',
          ],
        },
      ],
    },
    jonghapGuide: {
      academicAbility: {
        gradeTarget: '전 과목 1~2등급, 전공 관련 과목 1등급',
        setukFocus: [
          '교과 내용과 연계한 자발적 심화 탐구 기록',
          '단순 암기가 아닌 원리 이해 및 응용 과정',
          '수업 중 질문과 교사의 답변 이후 추가 탐구',
        ],
        inquiryProof: [
          '교과 수업 기반 실험·조사 설계 및 결과 분석',
          '2개 이상 교과를 융합한 융합 탐구',
          '탐구 실패 경험과 극복 과정 기록',
        ],
      },
      careerReadiness: {
        requiredSubjects: [
          '수학: 수학Ⅰ, 수학Ⅱ, 미적분 (이공계 필수)',
          '과학: 전공 관련 과학 과목 2개 이상 (물리·화학·생명·지구)',
          '영어: 영어독해·영어작문 (이공계 논문 독해)',
        ],
        recommendedSubjects: [
          '기하 (공학·수학 계열)',
          '화학Ⅱ, 물리학Ⅱ (이공계 상위 전공)',
          '생명과학Ⅱ (의생명·생물 계열)',
          '정보 (컴퓨터공학·AI 계열)',
        ],
        explorationActivities: [
          '희망 학과 현직 교수/연구원 인터뷰 (학교 진로활동)',
          '대학 개방 강의·캠프 참여 기록',
          '관련 학술지 논문 읽기 → 세특 연계',
        ],
      },
      communityAbility: {
        collaborationItems: [
          '모둠 프로젝트에서 역할 분담 및 갈등 해결 과정',
          '팀 탐구 결과를 발표하며 설득력 있게 전달',
        ],
        leadershipItems: [
          '학급 임원 또는 동아리 임원 경험',
          '후배 또는 동료를 가르치거나 돕는 활동',
        ],
        careItems: [
          '학습 어려움 겪는 친구 도움 (멘토링)',
          '지역 사회 기여 봉사활동',
        ],
      },
    },
    interviewPrep: {
      type: '제시문기반',
      focus: [
        '수학·과학 원리를 논리적 언어로 설명하는 능력',
        '제시문에서 핵심 개념 추출 후 응용',
        '의예·치의예·수의예: MMI 방식 (의사소통, 윤리적 판단, 상황 대처)',
      ],
      practiceTopics: [
        '고교 수학 교과서 증명 문제 구술 연습',
        '과학 실험 원리를 "왜?"로 분해하여 설명',
        '의학 관련: 의료 윤리 딜레마 상황 대처',
        '최근 과학·기술 이슈에 대한 본인 견해 말하기',
      ],
    },
    changes2028Preview: '2028: 서울대 정시 30%로 완화 → 수시 학종 경쟁 더 치열. 정시도 교과평가 40%로 확대 → 정시 준비생도 내신 관리 필수',
  },

  // ══════════════════════════════════════════════════════════
  // 서울대학교 — 지역균형전형
  // ══════════════════════════════════════════════════════════
  {
    universityId: 'snu',
    universityName: '서울대학교',
    department: '전 계열 (고교별 3명 이내 추천)',
    admissionType: '학생부교과',
    admissionYear: 2027,
    keyRequirements: [
      '일반고·자공고만 지원 가능 (자사고·외고·국제고·과학고·영재학교 불가)',
      '학교장 추천 필수 (고교당 3명 이내)',
      '1단계 서류 100%(3배수) → 2단계 서류 70%+면접 30%',
      '수능최저 없음',
      '교과 성적이 최상위권이어야 추천 가능',
    ],
    roadmap: {
      year1: [
        {
          id: 'snu-jg-y1-naesin',
          category: '내신관리',
          title: '전교 최상위권 내신 유지',
          description: '지역균형은 학교에서 TOP 3 안에 들어야 추천 가능',
          urgency: 'critical',
          startYear: 1,
          actionItems: [
            '전교 석차 상위 3% 목표',
            '전 과목 균형 — 특히 국·수·영·사·과 1등급 필수',
            '지역균형 추천은 학교별 경쟁이므로 교내 경쟁력 분석 필요',
          ],
        },
        {
          id: 'snu-jg-y1-recommend',
          category: '학교장추천',
          title: '학교장 추천 가능성 관리',
          description: '내신 + 인성 + 학교 기여도로 추천 여부 결정됨',
          urgency: 'critical',
          startYear: 1,
          actionItems: [
            '선생님들께 긍정적 인상 남기기',
            '학교 행사 적극 참여',
            '담임교사와 정기적 면담',
          ],
        },
      ],
      year2: [
        {
          id: 'snu-jg-y2-activity',
          category: '탐구활동',
          title: '전공 연계 탐구 활동 집중',
          description: '서류 70%이므로 세특 관리도 중요',
          urgency: 'high',
          startYear: 2,
          actionItems: [
            '일반전형 준비와 동일하게 세특 관리',
            '추천서 작성에 도움 될 교사 관계 형성',
          ],
        },
      ],
      year3: [
        {
          id: 'snu-jg-y3-interview',
          category: '면접준비',
          title: '서류 기반 면접 대비',
          description: '본인 학생부에 기재된 활동을 깊이 있게 설명할 수 있어야 함',
          urgency: 'critical',
          startYear: 3,
          actionItems: [
            '본인 세특 전체를 다시 읽고 활동 의미 재정리',
            '왜 그 활동을 했는가 → 무엇을 배웠는가 → 어떻게 발전했는가 스토리 준비',
            '예상 질문 50개 이상 작성 후 모의 면접',
          ],
        },
      ],
    },
    suneungMinPrep: undefined,
    interviewPrep: {
      type: '서류기반',
      focus: [
        '학생부에 기재된 활동의 의미와 배움 설명',
        '지원 동기와 진로 계획 연계',
        '교직 적성 (사범대 지원 시)',
      ],
      practiceTopics: [
        '내 세특에서 가장 인상적인 탐구 3가지 설명',
        '고교 생활 중 가장 어려웠던 순간과 극복',
        '왜 서울대 이 학과인가 — 구체적 이유',
      ],
    },
  },

  // ══════════════════════════════════════════════════════════
  // 연세대학교 — 학생부종합 활동우수형
  // ══════════════════════════════════════════════════════════
  {
    universityId: 'yonsei',
    universityName: '연세대학교',
    department: '전 계열',
    admissionType: '학생부종합',
    admissionYear: 2027,
    keyRequirements: [
      '1단계 서류 100%(3배수) → 2단계 서류 60%+면접 40%',
      '수능최저: 인문 2합4 / 자연 수학포함 2합5',
      '의예 1등급 2개 이상',
      '2027 다면사고평가 신설: 과학 제시문 기반 논리 평가',
      '치의예 논술 전형 폐지 → 학종으로 이관',
    ],
    roadmap: {
      year1: [
        {
          id: 'yonsei-y1-naesin',
          category: '내신관리',
          title: '내신 + 수능최저 동시 준비 구조 구축',
          description: '연세대 활동우수는 수능최저가 있으므로 내신·수능 병행 필수',
          urgency: 'critical',
          startYear: 1,
          actionItems: [
            '내신 1~2등급대 목표',
            '수능최저(인문 2합4, 자연 2합5)를 위한 수능 준비 병행',
            '영어 등급 별도 관리 필요 (2등급 이내)',
          ],
        },
      ],
      year2: [
        {
          id: 'yonsei-y2-activity',
          category: '탐구활동',
          title: '"활동우수형"답게 활동 스토리 구축',
          description: '전형 이름처럼 활동의 질과 다양성이 중요',
          urgency: 'critical',
          startYear: 2,
          actionItems: [
            '교과+비교과+동아리를 하나의 스토리로 연결',
            '전공 관련 활동의 깊이와 발전 과정을 시간 순으로 정리',
            '진리자유학부 지원 시: 특정 전공 고집보다 융합적 지식 탐구',
          ],
        },
        {
          id: 'yonsei-y2-essay-interview',
          category: '면접준비',
          title: '2027 신설 "다면사고평가" 대비',
          description: '자연계 논술/면접: 과학 제시문으로 논리적 사고력 평가. 단순 풀이 X',
          urgency: 'high',
          startYear: 2,
          actionItems: [
            '과학 개념을 "논리 언어"로 설명하는 연습',
            '한 현상을 다양한 과학 관점에서 분석하는 연습',
            '기존 논술 기출 + 新 다면사고평가 대비 문제 풀이',
          ],
          changes2028: '2028: 유사 방식 유지 예상',
        },
      ],
      year3: [
        {
          id: 'yonsei-y3-suneung',
          category: '수능준비',
          title: '수능최저 반드시 충족',
          description: '수능최저 미충족 시 아무리 서류가 좋아도 불합격',
          urgency: 'critical',
          startYear: 3,
          actionItems: [
            '인문: 국어·수학·탐구 중 2개 합 4 이내 목표',
            '자연: 수학 포함 2개 합 5 이내 (수학 1등급 필수에 가까움)',
            '의예: 1등급 2개 이상 — 매우 높은 수준 요구',
            '9월 모의고사에서 충족 여부 최종 확인 후 지원',
          ],
        },
      ],
    },
    jonghapGuide: {
      academicAbility: {
        gradeTarget: '인문 1~2등급, 자연 1~2등급, 의약학 1등급',
        setukFocus: [
          '활동의 "우수성"이 드러나야 함 — 평범한 활동 기록은 의미 없음',
          '수상 실적은 미반영이나 활동 과정 세특 기재',
        ],
        inquiryProof: [
          '교과 수업에서 기존 이론의 한계를 발견하고 대안 탐구',
          '실험 설계 → 수행 → 오류 분석 → 재설계 과정',
        ],
      },
      careerReadiness: {
        requiredSubjects: ['수학Ⅰ·Ⅱ·미적분', '전공 관련 과학 2과목 이상'],
        recommendedSubjects: ['기하', '심화 과학 (물Ⅱ·화Ⅱ·생Ⅱ)'],
        explorationActivities: ['연세대 학과 홈페이지 연구 분야 탐색', '진로 활동에 전공 관련 활동 기재'],
      },
      communityAbility: {
        collaborationItems: ['팀 프로젝트 리더 또는 핵심 기여자'],
        leadershipItems: ['동아리 임원', '학생 자치 활동'],
        careItems: ['멘토링·봉사 활동'],
      },
    },
    interviewPrep: {
      type: '서류기반',
      focus: ['학생부 활동의 의미와 영향 설명', '연세대를 선택한 이유와 학업 계획'],
      practiceTopics: [
        '본인 활동 중 가장 어려웠던 탐구와 극복 과정',
        '진리자유학부: 왜 무전공으로 입학하고 어떤 전공을 탐색할 것인가',
        '의예: 의사가 되고자 하는 동기와 의료 윤리 상황 대처',
      ],
    },
    changes2028Preview: '2028: 수능 변별력 약화 → 서류·면접 비중 더 증가 예상. 진리자유학부 무전공 확대 가능성',
  },

  // ══════════════════════════════════════════════════════════
  // 고려대학교 — 학업우수전형 (학종)
  // ══════════════════════════════════════════════════════════
  {
    universityId: 'korea',
    universityName: '고려대학교',
    department: '전 계열',
    admissionType: '학생부종합',
    admissionYear: 2027,
    keyRequirements: [
      '2027 핵심 변화: 면접 완전 폐지 → 서류 100% 일괄 선발',
      '수능최저: 4합 8 이내 (경영학과 4합 5)',
      '서류만으로 선발 → 세특 완성도가 당락을 결정',
      '학업 성취도와 세특의 질적 수준이 핵심 경쟁력',
    ],
    roadmap: {
      year1: [
        {
          id: 'korea-y1-setuk',
          category: '세특관리',
          title: '세특 기반 학업역량 구축 — 면접 없으므로 서류만으로 설득',
          description: '2027부터 면접이 없어 세특의 완성도가 합불을 결정',
          urgency: 'critical',
          startYear: 1,
          actionItems: [
            '교과별 세특에 탐구 과정·사고 과정을 구체적으로 기재',
            '단순 "활동함" 기록이 아닌 "왜, 어떻게, 무엇을 배웠는가" 구조',
            '선생님과 소통하여 세특에 본인 탐구 내용이 잘 담기도록 노력',
          ],
        },
      ],
      year2: [
        {
          id: 'korea-y2-jonghap',
          category: '탐구활동',
          title: '계열 적합성 증명 (계열적합전형 병행 준비)',
          description: '학업우수 외 계열적합전형도 있으므로 계열 연계 활동 강화',
          urgency: 'high',
          startYear: 2,
          actionItems: [
            '계열 관련 교과에서 심화 활동 집중',
            '인문: 사회·경제·역사 관련 논문 탐독 → 세특 연계',
            '자연: 수학·과학 기반 실험/설계 탐구',
          ],
        },
        {
          id: 'korea-y2-suneung',
          category: '수능준비',
          title: '수능최저 4합 8 준비 — 4개 영역 모두 2등급 이내',
          description: '4합 8은 4개 영역 평균 2등급. 고3 되면 늦음',
          urgency: 'critical',
          startYear: 2,
          actionItems: [
            '국·수·영·탐 4개 영역 모두 2등급 이내 목표',
            '경영학과 지원 시: 4합 5 — 매우 높은 수준 (평균 1.25등급)',
            '영어 등급 별도 관리 (2등급 이상)',
          ],
        },
      ],
      year3: [
        {
          id: 'korea-y3-doc-complete',
          category: '세특관리',
          title: '서류 100% — 세특 최종 완성',
          description: '면접이 없으므로 서류에서 이미 차별화가 이루어져야 함',
          urgency: 'critical',
          startYear: 3,
          deadline: '3학년 1학기 종료 전',
          actionItems: [
            '3학년 1학기 세특: 1~2학년 탐구의 심화·발전 형태',
            '전공 관련 연구 트렌드 반영',
            '본인 탐구의 독창성과 전공 연계성 강조',
          ],
        },
      ],
    },
    suneungMinPrep: {
      requirement: '4합 8 이내 (경영 4합 5)',
      strategy: [
        '4개 영역 모두 2등급 이내 유지 목표',
        '9월 모평에서 충족 여부 최종 점검',
        '경영학과: 평균 1.25등급 수준 — 수능 실력이 수시 합격의 전제 조건',
      ],
    },
    interviewPrep: {
      type: '없음',
      focus: ['2027 면접 폐지 — 서류 100%만으로 선발'],
      practiceTopics: [],
    },
    changes2028Preview: '2028: 정시 내신 반영 확대 추세 → 고려대 교과우수전형(교과20%) 영향 커짐',
  },

  // ══════════════════════════════════════════════════════════
  // 고려대학교 — 논술전형
  // ══════════════════════════════════════════════════════════
  {
    universityId: 'korea',
    universityName: '고려대학교',
    department: '전 계열 (논술 100% 선발)',
    admissionType: '논술',
    admissionYear: 2027,
    keyRequirements: [
      '논술 100% — 내신 불리한 학생에게도 기회',
      '수능최저: 4합 8 이내 (경영 4합 5)',
      '인문: 언어·통합논술 / 자연: 수리논술',
      '내신 등급 무관 — 논술 실력만이 당락 결정',
    ],
    roadmap: {
      year1: [
        {
          id: 'korea-essay-y1',
          category: '논술준비',
          title: '논술 기초 체력 — 논리적 글쓰기 훈련',
          description: '논술은 단기간에 실력이 오르지 않음. 1학년부터 준비 필요',
          urgency: 'high',
          startYear: 1,
          actionItems: [
            '시사 이슈를 주제로 논리적 글쓰기 연습 (주 1회 이상)',
            '인문: 신문 사설·칼럼 분석 후 반론 작성',
            '자연: 수학 개념을 서술형으로 풀어 설명하는 연습',
            '고려대 기출 논술 문제 분석 (학교 홈페이지 공개)',
          ],
        },
      ],
      year2: [
        {
          id: 'korea-essay-y2',
          category: '논술준비',
          title: '고려대 유형별 논술 집중 대비',
          description: '고려대는 논술 100% — 유형 완전 분석 필요',
          urgency: 'critical',
          startYear: 2,
          actionItems: [
            '인문: 제시문 요약 → 비교·분석 → 비판적 견해 구조 완성',
            '자연: 수리논술 — 증명, 최적화, 확률 계산 서술 연습',
            '3년치 기출 풀고 첨삭 필수',
            '수능최저 병행 준비 (4합 8)',
          ],
        },
      ],
      year3: [
        {
          id: 'korea-essay-y3',
          category: '논술준비',
          title: '실전 논술 + 수능최저 동시 완성',
          description: '수능 전 논술 고사 있으므로 수능 준비와 균형 필요',
          urgency: 'critical',
          startYear: 3,
          deadline: '논술 고사일',
          actionItems: [
            '9월 이후 실전 모의 논술 주 2~3회',
            '시간 제한 훈련 (실제 시험 시간 내 완성)',
            '논술 고사일과 타 대학 일정 충돌 여부 확인',
          ],
        },
      ],
    },
    suneungMinPrep: {
      requirement: '4합 8 이내',
      strategy: [
        '논술 준비와 수능 준비 병행 필수',
        '수능최저 미충족 시 논술 잘 써도 자동 탈락',
      ],
    },
  },
];
