import anthropic

# ==========================================
# 1. 프롬프트 지시어(Prompt Rule)가 추가된 통합 DB
# ==========================================

SAJU_DB = {
    "金_비겁": {
        "title": "고독한 승부사",
        "prompt_rule": "타인과 비교하는 표현을 절대 쓰지 마세요. 학생 스스로 자신과의 싸움에서 이길 수 있도록 도전 정신을 자극하고, 혼자 조용히 파고들 수 있는 심화 질문을 마지막에 던지세요."
    },
    "木_식상": {
        "title": "호기심 톡톡 스토리텔러",
        "prompt_rule": "답변을 닫힌 결론으로 끝내지 마세요. 학생이 더 넓게 사고를 확장할 수 있도록 '이걸 실생활이나 다른 과목에 적용하면 어떨까?' 같은 꼬리 질문을 던져 호기심을 자극하세요."
    },
    "水_인성": {
        "title": "심야의 사색가",
        "prompt_rule": "표면적인 암기법을 제시하지 마세요. '왜 이런 공식/현상이 발생했는지' 그 근본적인 원리와 배경지식을 아주 깊이 있고 차분하게 설명하세요."
    }
}

MBTI_DB = {
    "SJ": {
        "title": "모범생 가디언",
        "prompt_rule": "매우 체계적이고 단계적인(Step-1, Step-2) 가이드를 제공하세요. 모호한 표현을 피하고, 이 개념이 실제 시험이나 기출문제에 어떻게 적용되는지 실용적으로 설명하세요."
    },
    "SP": {
        "title": "자유로운 아티스트",
        "prompt_rule": "지루하고 긴 이론 설명은 최소화하세요. 마치 게임의 퀘스트를 깨는 것처럼 짧고 도전적인 과제로 나누어 설명하고, 파격적이거나 재미있는 비유를 사용하세요."
    },
    "NT": {
        "title": "논리적 전략가",
        "prompt_rule": "감정적인 위로보다는 논리적이고 객관적인 사실에 입각하여 설명하세요. 전체적인 시스템의 원리를 먼저 설명한 후 세부 사항으로 들어가세요."
    },
    "NF": {
        "title": "가치지향 이상주의자",
        "prompt_rule": "따뜻하고 공감하는 톤으로 답변을 시작하세요. 이 과목이나 지식이 사람들의 삶과 세상에 어떤 긍정적인 영향을 미치는지 '스토리텔링'을 곁들여 설명하세요."
    }
}

VAK_DB = {
    "V": {
        "title": "시각 스캐너형",
        "prompt_rule": "반드시 마크다운 표, 이모지, 굵은 글씨, 불렛포인트를 적극 활용하여 시각적으로 구조화하세요. 줄글을 길게 쓰지 말고 핵심을 한눈에 스캔할 수 있게 만드세요."
    },
    "A": {
        "title": "청각 아나운서형",
        "prompt_rule": "마치 대화하듯 리듬감 있고 구어체적인 표현을 사용하세요. 학생이 소리 내어 읽기 좋은 문장으로 구성하고, 암기할 내용은 앞 글자를 딴 재미있는 운율이나 약어를 만들어 제안하세요."
    },
    "K": {
        "title": "체감각 액션배우형",
        "prompt_rule": "개념을 설명할 때 '직접 손으로 써보자', '일어나서 걸으면서 생각해보자' 같은 행동 유도 지시문을 포함하세요. 물리적으로 직접 만지고 겪을 수 있는 예시를 드세요."
    }
}

# ==========================================
# 2. 시스템 프롬프트 생성 함수 (기존 유지)
# ==========================================
def generate_system_prompt(user_name, saju_key, mbti_type, vak_type):
    saju_info = SAJU_DB.get(saju_key, SAJU_DB["木_식상"])
    mbti_info = MBTI_DB.get(mbti_type, MBTI_DB["NT"])
    vak_info  = VAK_DB.get(vak_type,  VAK_DB["V"])

    system_prompt = f"""[Role Definition]
당신은 학생의 타고난 기질(사주), 심리 상태 및 동기(MBTI), 감각적 인지 방식(VAK)을 완벽하게 파악하고 있는 대한민국 최고의 1:1 맞춤형 AI 과외 선생님입니다.
당신의 목표는 단순한 정답 제공이 아니라, 학생의 고유한 기질에 맞춰 지식을 완벽히 소화하도록 돕는 것입니다.

[Student Profile]
현재 질문을 한 학생의 페르소나 데이터는 다음과 같습니다:
- 이름: {user_name}
- 내면 기질 (사주): {saju_info['title']}
- 성향 및 동기 (MBTI): {mbti_info['title']}
- 정보 습득 양식 (VAK): {vak_info['title']}

[Instruction Guidelines : 절대 준수 규칙]
학생이 질문한 과목의 핵심 개념을 설명할 때, 일반적인 백과사전식 나열을 엄격히 금지하며 아래 3가지 규칙을 반드시 적용하여 답변을 생성하세요.

1. 설명 및 포맷팅 방식 (VAK 규칙):
=> {vak_info['prompt_rule']}

2. 톤앤매너 및 동기부여 (MBTI 규칙):
=> {mbti_info['prompt_rule']}

3. 멘탈 케어 및 몰입 유도 (사주 규칙):
=> {saju_info['prompt_rule']}

[Output Requirement]
위 프로필과 규칙을 완벽하게 반영하여, 학생이 즉시 실천할 수 있고 흥미를 느낄 수 있는 맞춤형 해설과 가이드를 작성하세요.
"""
    return system_prompt


# ==========================================
# 3. Claude Haiku API 호출 함수 (신규 추가)
# ==========================================
def ask_claude(user_name, saju_key, mbti_type, vak_type, user_question,
               api_key=None, conversation_history=None):
    """
    Parameters
    ----------
    user_name           : 학생 이름
    saju_key            : 사주 키 (예: "木_식상")
    mbti_type           : MBTI 그룹 (예: "NF")
    vak_type            : VAK 유형 (예: "A")
    user_question       : 학생의 질문
    api_key             : Anthropic API 키 (None이면 환경변수 ANTHROPIC_API_KEY 사용)
    conversation_history: 이전 대화 목록 [{"role": "user"/"assistant", "content": "..."}]
                          None이면 새 대화 시작

    Returns
    -------
    tuple(str, list)    : (AI 답변 텍스트, 업데이트된 대화 기록)
    """

    # 클라이언트 초기화
    client = anthropic.Anthropic(api_key=api_key)  # api_key=None → 환경변수 자동 사용

    # 시스템 프롬프트 생성
    system_prompt = generate_system_prompt(user_name, saju_key, mbti_type, vak_type)

    # 대화 이력 초기화 또는 이어받기
    if conversation_history is None:
        conversation_history = []

    # 이번 질문 추가
    conversation_history.append({"role": "user", "content": user_question})

    # Claude Haiku 호출
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",   # Claude Haiku 최신 모델
        max_tokens=1024,
        system=system_prompt,                 # ← 사주+MBTI+VAK 맞춤 프롬프트
        messages=conversation_history         # ← 멀티턴 대화 지원
    )

    # 응답 텍스트 추출
    answer = response.content[0].text

    # 대화 이력에 AI 답변 추가 (다음 턴을 위해)
    conversation_history.append({"role": "assistant", "content": answer})

    # 토큰 사용량 출력 (비용 모니터링용)
    usage = response.usage
    print(f"\n📊 토큰 사용량 | 입력: {usage.input_tokens} | 출력: {usage.output_tokens} | 합계: {usage.input_tokens + usage.output_tokens}")

    return answer, conversation_history


# ==========================================
# 4. 실행 테스트 (Main)
# ==========================================
if __name__ == "__main__":
    import os

    # ── 환경변수에서 API 키 로드 ──────────────────────────────
    # 터미널에서 export ANTHROPIC_API_KEY="sk-ant-..." 설정 후 실행
    # 또는 아래 api_key 파라미터에 직접 문자열로 넣어도 됩니다.
    API_KEY = os.environ.get("ANTHROPIC_API_KEY")

    # ── 테스트 유저 설정 ────────────────────────────────────
    TEST_USER  = "김코딩"
    TEST_SAJU  = "木_식상"   # 호기심 스토리텔러
    TEST_MBTI  = "NF"        # 가치지향 이상주의자
    TEST_VAK   = "A"         # 청각 아나운서형

    print("=" * 55)
    print("  사주 기반 맞춤형 AI 과외 — Claude Haiku 연동 테스트")
    print("=" * 55)
    print(f"  학생: {TEST_USER} | 사주: {TEST_SAJU} | MBTI: {TEST_MBTI} | VAK: {TEST_VAK}")
    print("=" * 55)

    history = None  # 대화 기록 초기화

    # ── 1번째 질문 ──────────────────────────────────────────
    q1 = "광합성이 뭐야? 과학 너무 어려워."
    print(f"\n[학생 질문 1] {q1}")
    answer1, history = ask_claude(TEST_USER, TEST_SAJU, TEST_MBTI, TEST_VAK, q1, api_key=API_KEY)
    print(f"\n[Claude 답변]\n{answer1}")

    # ── 2번째 질문 (대화 이어받기 테스트) ────────────────────
    q2 = "방금 설명한 것 중에서 엽록소가 왜 초록색인지 더 설명해줘."
    print(f"\n[학생 질문 2] {q2}")
    answer2, history = ask_claude(TEST_USER, TEST_SAJU, TEST_MBTI, TEST_VAK, q2,
                                  api_key=API_KEY, conversation_history=history)
    print(f"\n[Claude 답변]\n{answer2}")

    print("\n" + "=" * 55)
    print("  테스트 완료")
    print("=" * 55)
