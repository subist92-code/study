const sajuPageHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>나침반 — 나만의 공부 나침반</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700;900&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
:root {
  --navy:#1E3A6E; --navy-dark:#0F2040; --navy-light:#2E5FAD;
  --gold:#D4AF37; --gold-light:#F0D060; --gold-pale:#FDF6DC;
  --cream:#FAF7F0; --white:#ffffff;
  --text:#1a1a2e; --text-light:#667799;
  --green:#2ECC71; --orange:#E67E22; --red:#E74C3C;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Noto Sans KR',sans-serif;background:var(--cream);color:var(--text);min-height:100vh;overflow-x:hidden;}

.bg{position:fixed;inset:0;z-index:0;pointer-events:none;
  background:radial-gradient(ellipse 70% 50% at 15% 5%,rgba(30,58,110,.08) 0%,transparent 60%),
             radial-gradient(ellipse 60% 70% at 90% 90%,rgba(212,175,55,.07) 0%,transparent 60%);}
.bg::before{content:'';position:absolute;inset:0;
  background-image:repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(30,58,110,.03) 60px),
                   repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(30,58,110,.03) 60px);}

.screen{display:none;position:relative;z-index:1;animation:fadeIn .4s ease;}
.screen.active{display:block;}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

.header{text-align:center;padding:52px 24px 0;}
.logo-wrap{display:inline-flex;align-items:center;gap:14px;margin-bottom:12px;}
.compass{width:56px;height:56px;background:var(--navy);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 24px rgba(30,58,110,.35);position:relative;}
.compass::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:1.5px solid rgba(212,175,55,.3);}
.logo-text{font-family:'Noto Serif KR',serif;font-size:34px;font-weight:900;color:var(--navy);letter-spacing:-1px;}
.logo-dot{color:var(--gold);}
.tagline{font-size:13px;color:var(--text-light);letter-spacing:2.5px;text-transform:uppercase;margin-top:2px;}

.card{background:white;border-radius:24px;padding:40px 36px;
  box-shadow:0 8px 40px rgba(30,58,110,.10),0 2px 8px rgba(30,58,110,.05);
  max-width:480px;margin:28px auto;border:1px solid rgba(212,175,55,.18);}
.card-title{font-family:'Noto Serif KR',serif;font-size:20px;font-weight:700;color:var(--navy);margin-bottom:6px;}
.card-sub{font-size:13px;color:var(--text-light);line-height:1.7;margin-bottom:28px;}

.field{margin-bottom:20px;}
.field label{display:block;font-size:13px;font-weight:600;color:var(--navy);margin-bottom:8px;letter-spacing:.3px;}
.field input{width:100%;padding:14px 16px;border:1.5px solid #e0e8f5;border-radius:12px;
  font-size:15px;font-family:'Noto Sans KR',sans-serif;color:var(--text);background:#f8faff;outline:none;
  transition:border-color .2s,box-shadow .2s;}
.field input:focus{border-color:var(--navy-light);box-shadow:0 0 0 3px rgba(46,95,173,.12);background:white;}
.field input::placeholder{color:#aab0c4;}
.date-row{display:flex;gap:10px;}

.btn-primary{width:100%;padding:16px;background:var(--navy);color:white;border:none;border-radius:14px;
  font-size:16px;font-weight:700;font-family:'Noto Sans KR',sans-serif;cursor:pointer;
  letter-spacing:.5px;transition:all .25s;position:relative;overflow:hidden;margin-top:8px;}
.btn-primary:hover{background:var(--navy-dark);transform:translateY(-1px);box-shadow:0 8px 24px rgba(30,58,110,.3);}
.btn-primary:active{transform:translateY(0);}
.btn-secondary{width:100%;padding:14px;background:transparent;color:var(--navy);border:2px solid var(--navy);
  border-radius:14px;font-size:15px;font-weight:600;font-family:'Noto Sans KR',sans-serif;
  cursor:pointer;transition:all .2s;margin-top:10px;}
.btn-secondary:hover{background:var(--navy);color:white;}
.free-tag{text-align:center;margin-top:14px;}
.free-tag span{background:var(--gold-pale);color:#8B6914;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;}

#screen-loading{text-align:center;padding:80px 24px;}
.spin-wrap{width:96px;height:96px;margin:0 auto 36px;position:relative;}
.spin-ring{position:absolute;inset:0;border-radius:50%;border:3px solid transparent;}
.spin-ring.r1{border-top-color:var(--navy);animation:spin 1.1s linear infinite;}
.spin-ring.r2{inset:12px;border-top-color:var(--gold);animation:spin .85s linear infinite reverse;}
.spin-ring.r3{inset:24px;border-top-color:rgba(30,58,110,.3);animation:spin 1.4s linear infinite;}
.spin-center{position:absolute;inset:36px;background:var(--navy);border-radius:50%;display:flex;align-items:center;justify-content:center;}
@keyframes spin{to{transform:rotate(360deg)}}

.loading-title{font-family:'Noto Serif KR',serif;font-size:22px;font-weight:700;color:var(--navy);margin-bottom:20px;}
.agent-list{list-style:none;max-width:360px;margin:0 auto;}
.agent-item{display:flex;align-items:center;gap:12px;padding:9px 16px;border-radius:10px;
  font-size:13px;color:var(--text-light);margin-bottom:6px;transition:all .3s;opacity:0;}
.agent-item.active{background:#f0f4fb;color:var(--navy);opacity:1;font-weight:600;}
.agent-item.done{background:#f0fbf4;color:#1a7a40;opacity:1;}
.agent-item.show{opacity:.6;}
.agent-dot{width:8px;height:8px;border-radius:50%;background:currentColor;flex-shrink:0;}
.agent-spinner{width:14px;height:14px;border:2px solid rgba(30,58,110,.2);border-top-color:var(--navy);
  border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;}

#screen-result{padding:40px 20px 60px;max-width:540px;margin:0 auto;}
.result-top{text-align:center;margin-bottom:28px;}
.dna-pill{display:inline-block;background:var(--navy);color:var(--gold);
  font-size:12px;font-weight:700;padding:5px 18px;border-radius:20px;letter-spacing:1.5px;margin-bottom:14px;}
.result-greeting{font-family:'Noto Serif KR',serif;font-size:26px;font-weight:900;color:var(--navy);margin-bottom:4px;}
.result-sub{font-size:13px;color:var(--text-light);}

.type-hero{background:linear-gradient(135deg,var(--navy) 0%,var(--navy-light) 100%);
  border-radius:22px;padding:30px;color:white;margin-bottom:14px;position:relative;overflow:hidden;}
.type-hero::before{content:'';position:absolute;right:-30px;top:-30px;
  width:140px;height:140px;border-radius:50%;border:2px solid rgba(212,175,55,.2);}
.type-hero::after{content:'';position:absolute;right:15px;top:15px;
  width:90px;height:90px;border-radius:50%;border:1.5px solid rgba(212,175,55,.15);}
.type-emoji{font-size:40px;margin-bottom:14px;display:block;}
.type-name{font-family:'Noto Serif KR',serif;font-size:24px;font-weight:900;
  color:var(--gold-light);margin-bottom:8px;}
.type-desc{font-size:14px;line-height:1.75;opacity:.92;margin-bottom:16px;}
.trait-row{display:flex;flex-wrap:wrap;gap:8px;}
.trait{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);
  border-radius:20px;padding:4px 13px;font-size:12px;}

/* ── 학습 DNA 코드 배너 ── */
.dna-banner{background:linear-gradient(135deg,#0F2040 0%,#1E3A6E 100%);
  border-radius:18px;padding:20px 22px;color:white;margin-bottom:14px;}
.dna-banner-label{font-size:10px;color:rgba(212,175,55,.9);letter-spacing:2px;
  text-transform:uppercase;font-weight:700;margin-bottom:10px;}
.dna-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;}
.dna-chip{display:inline-flex;align-items:center;gap:6px;
  background:rgba(255,255,255,.12);border:1px solid rgba(212,175,55,.2);
  border-radius:20px;padding:5px 14px;font-size:12px;font-weight:600;color:white;}
.dna-chip-icon{font-size:13px;}
.dna-sub{font-size:12px;color:rgba(255,255,255,.6);margin-top:4px;}

/* ── 섹션 공통 ── */
.sec{background:white;border-radius:18px;padding:24px;margin-bottom:14px;
  border:1px solid rgba(30,58,110,.07);box-shadow:0 2px 12px rgba(30,58,110,.05);}
.sec-head{display:flex;align-items:center;gap:10px;margin-bottom:18px;}
.sec-icon{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;}
.ic-study{background:#eef3fb;} .ic-time{background:#fdf6dc;} .ic-mental{background:#fdeef0;} .ic-body{background:#edfaf0;} .ic-uni{background:#f0edfb;}
.ic-ability{background:#eef3fb;} .ic-pref{background:#fdf6dc;} .ic-insight{background:#f0edfb;}
.sec-title{font-family:'Noto Serif KR',serif;font-size:16px;font-weight:700;color:var(--navy);}

/* ── 공부법 ── */
.method-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #f0f4fb;}
.method-item:last-child{border-bottom:none;}
.m-num{width:28px;height:28px;background:var(--navy);color:var(--gold);border-radius:8px;
  display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;}
.m-name{font-size:14px;font-weight:700;color:var(--navy);margin-bottom:3px;}
.m-desc{font-size:13px;color:var(--text-light);line-height:1.65;}

/* ── 시간대 ── */
.time-labels{display:flex;justify-content:space-between;font-size:11px;color:var(--text-light);margin-bottom:6px;}
.time-bar{height:9px;background:#f0f4fb;border-radius:5px;overflow:hidden;margin-bottom:12px;}
.time-fill{height:100%;border-radius:5px;background:linear-gradient(90deg,var(--navy-light),var(--gold));}
.time-best{font-size:13px;font-weight:600;color:var(--navy);background:var(--gold-pale);
  padding:9px 14px;border-radius:9px;border-left:3px solid var(--gold);}

/* ── 코칭 리스트 ── */
.c-item{display:flex;align-items:flex-start;gap:10px;padding:9px 0;
  border-bottom:1px solid #f0f4fb;font-size:13px;line-height:1.65;color:var(--text-light);}
.c-item:last-child{border-bottom:none;}
.c-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:7px;}

/* ── 학습 능력 프로파일 ── */
.ability-headline{background:var(--gold-pale);border-left:3px solid var(--gold);
  border-radius:8px;padding:10px 14px;font-size:13px;font-weight:600;color:#8B6914;margin-bottom:14px;}
.ability-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
.ability-card{background:#eef3fb;border-radius:10px;padding:12px 10px;text-align:center;}
.ability-card.weak-card{background:#fff5f0;}
.ability-icon{font-size:20px;margin-bottom:5px;}
.ability-name{font-size:12px;font-weight:700;color:var(--navy);line-height:1.35;}
.ability-name.weak-name{color:#c0392b;}
.ability-divider{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.ability-divider-line{flex:1;height:1px;background:#e0e8f5;}
.ability-divider-text{font-size:11px;color:var(--text-light);font-weight:600;white-space:nowrap;}

/* ── 공부 취향 분석 ── */
.pref-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;}
.pref-box{background:#f8faff;border-radius:10px;padding:12px;}
.pref-label{font-size:10px;color:var(--text-light);font-weight:700;letter-spacing:.5px;margin-bottom:5px;}
.pref-value{font-size:13px;color:var(--navy);font-weight:500;line-height:1.5;}
.pref-tag-section{margin-top:10px;}
.pref-tag-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px;}
.pref-tag-label{font-size:11px;font-weight:700;color:var(--text-light);margin-bottom:3px;}
.like-tag{background:#edfaf0;color:#1a7a40;padding:3px 11px;border-radius:12px;font-size:12px;font-weight:600;}
.hate-tag{background:#fff5f0;color:#c0392b;padding:3px 11px;border-radius:12px;font-size:12px;font-weight:600;}

/* ── 성향 인사이트 ── */
.insight-block{border-radius:12px;padding:14px 16px;margin-bottom:10px;}
.insight-block:last-child{margin-bottom:0;}
.insight-block.star{background:linear-gradient(135deg,#fdf6dc,#fff9ed);border:1px solid rgba(212,175,55,.3);}
.insight-block.warn{background:#fff5f5;border:1px solid rgba(231,76,60,.2);}
.insight-block.tip{background:#f0f4fb;border:1px solid rgba(30,58,110,.12);}
.insight-head{font-size:12px;font-weight:700;margin-bottom:6px;}
.insight-head.star{color:#8B6914;} .insight-head.warn{color:#c0392b;} .insight-head.tip{color:var(--navy);}
.insight-body{font-size:13px;line-height:1.7;color:var(--text);}

/* ── 위험도 바 ── */
.risk-wrap{margin-bottom:14px;}
.risk-label-row{display:flex;justify-content:space-between;font-size:12px;color:var(--text-light);margin-bottom:6px;}
.risk-bar{height:9px;background:#f0f4fb;border-radius:5px;overflow:hidden;}
.risk-fill{height:100%;border-radius:5px;}
.risk-low{background:linear-gradient(90deg,#2ECC71,#A8E063);}
.risk-mid{background:linear-gradient(90deg,#F39C12,#F1C40F);}
.risk-high{background:linear-gradient(90deg,#E74C3C,#F39C12);}

/* ── 대학 갭 ── */
.gap-row{display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid #f0f4fb;}
.gap-row:last-child{border-bottom:none;}
.gap-uni{font-size:14px;font-weight:600;color:var(--navy);width:100px;flex-shrink:0;}
.gap-bar-wrap{flex:1;}
.gap-bar{height:7px;background:#f0f4fb;border-radius:4px;overflow:hidden;}
.gap-fill{height:100%;border-radius:4px;}
.gap-good{background:var(--green);} .gap-warn{background:var(--orange);} .gap-danger{background:var(--red);}
.gap-pct{font-size:12px;font-weight:700;width:36px;text-align:right;flex-shrink:0;}

/* ── AI 에이전트 배지 ── */
.agent-badge{display:inline-flex;align-items:center;gap:5px;background:#f0f4fb;
  border:1px solid rgba(30,58,110,.12);border-radius:20px;padding:3px 10px;font-size:11px;color:var(--navy-light);margin:2px;}
.badge-dot{width:5px;height:5px;border-radius:50%;background:var(--green);}

.err-box{background:#fff5f5;border:1px solid #fcc;border-radius:12px;padding:16px;
  font-size:13px;color:#c0392b;line-height:1.6;margin-top:12px;display:none;}

@media(max-width:520px){
  .card{margin:20px 14px;padding:28px 20px;}
  #screen-result{padding:28px 14px 60px;}
  .ability-grid{grid-template-columns:1fr 1fr;}
  .pref-grid{grid-template-columns:1fr;}
}
</style>
</head>
<body>
<div class="bg"></div>

<!-- ══ 화면 1 : 입력 ══ -->
<div id="screen-input" class="screen active">
  <div class="header">
    <div class="logo-wrap">
      <div class="compass">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#D4AF37" stroke-width="1.3"/>
          <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21" stroke="#D4AF37" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M12 6.5l2.2 5.5-2.2 5.5-2.2-5.5z" fill="#D4AF37"/>
          <path d="M12 6.5l2.2 5.5H9.8z" fill="white" opacity=".55"/>
          <circle cx="12" cy="12" r="1.4" fill="#D4AF37"/>
        </svg>
      </div>
      <div>
        <div class="logo-text">나침반<span class="logo-dot">.</span></div>
      </div>
    </div>
    <div class="tagline">나만의 공부 나침반</div>
  </div>

  <div class="card">
    <div class="card-title">학습 DNA 분석 시작</div>
    <div class="card-sub">이름과 생년월일을 입력하면 나만의 최적 공부법과<br>학습 성향·능력·취향을 심층 분석해드려요.</div>

    <div class="field">
      <label>이름</label>
      <input type="text" id="inp-name" placeholder="이름을 입력하세요" maxlength="10">
    </div>
    <div class="field">
      <label>생년월일</label>
      <div class="date-row">
        <input type="number" id="inp-year" placeholder="년도" min="1990" max="2015" style="flex:2;text-align:center">
        <input type="number" id="inp-month" placeholder="월" min="1" max="12" style="flex:1;text-align:center">
        <input type="number" id="inp-day" placeholder="일" min="1" max="31" style="flex:1;text-align:center">
      </div>
    </div>

    <div class="field">
      <label>목표 대학 (선택)</label>
      <input type="text" id="inp-uni" placeholder="예: 연세대 경영학과 (선택사항)">
    </div>

    <button class="btn-primary" onclick="startAnalysis()">
      🧭 학습 DNA 분석하기
    </button>
    <div class="free-tag"><span>🎉 현재 전 회원 무료 서비스</span></div>
    <div class="err-box" id="err-box"></div>
  </div>
</div>

<!-- ══ 화면 2 : 로딩 ══ -->
<div id="screen-loading" class="screen">
  <div class="header" style="padding-bottom:28px;">
    <div class="logo-wrap">
      <div class="compass">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#D4AF37" stroke-width="1.3"/>
          <path d="M12 6.5l2.2 5.5-2.2 5.5-2.2-5.5z" fill="#D4AF37"/>
          <circle cx="12" cy="12" r="1.4" fill="#D4AF37"/>
        </svg>
      </div>
      <div class="logo-text">나침반<span class="logo-dot">.</span></div>
    </div>
  </div>

  <div style="text-align:center;padding:0 24px;">
    <div class="spin-wrap">
      <div class="spin-ring r1"></div>
      <div class="spin-ring r2"></div>
      <div class="spin-ring r3"></div>
      <div class="spin-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 3l3 9-3 13-3-13z" fill="#D4AF37"/>
        </svg>
      </div>
    </div>
    <div class="loading-title" id="loading-name"></div>

    <ul class="agent-list" id="agent-list">
      <li class="agent-item" data-i="0"><div class="agent-dot"></div>Plan Agent — 학습 전략 수립 중</li>
      <li class="agent-item" data-i="1"><div class="agent-dot"></div>Research Agent — 입시 데이터 로드 중</li>
      <li class="agent-item" data-i="2"><div class="agent-dot"></div>Validation Agent — 데이터 검증 중</li>
      <li class="agent-item" data-i="3"><div class="agent-dot"></div>Personality Agent — 학습 성향 심층 분석 중</li>
      <li class="agent-item" data-i="4"><div class="agent-dot"></div>Ability Agent — 학습 능력 프로파일링 중</li>
      <li class="agent-item" data-i="5"><div class="agent-dot"></div>SubjectLink Agent — 과목 연계 전략 수립 중</li>
      <li class="agent-item" data-i="6"><div class="agent-dot"></div>StudyMethod Agent — 맞춤 공부법 선정 중</li>
      <li class="agent-item" data-i="7"><div class="agent-dot"></div>ProgressCoach Agent — 성장 로드맵 생성 중</li>
      <li class="agent-item" data-i="8"><div class="agent-dot"></div>MentalCoach Agent — 멘탈 전략 수립 중</li>
      <li class="agent-item" data-i="9"><div class="agent-dot"></div>BodyCoach Agent — 체력 루틴 설계 중</li>
      <li class="agent-item" data-i="10"><div class="agent-dot"></div>Structure Agent — 결과 구성 중</li>
      <li class="agent-item" data-i="11"><div class="agent-dot"></div>Coding Agent — 최종 리포트 생성 중</li>
    </ul>
  </div>
</div>

<!-- ══ 화면 3 : 결과 ══ -->
<div id="screen-result" class="screen">
  <div class="result-top">
    <div class="dna-pill">학습 DNA 분석 완료</div>
    <div class="result-greeting" id="r-greeting"></div>
    <div class="result-sub">생년월일 기반 학습 성향 분석 · AI 12개 에이전트 분석</div>
    <div style="margin-top:10px;" id="r-agent-badges"></div>
  </div>

  <!-- 학습 성향 코드 배너 (로컬 분석 — 항상 표시) -->
  <div class="dna-banner" id="r-dna-banner">
    <div class="dna-banner-label">나의 학습 성향 코드</div>
    <div class="dna-row" id="r-dna-chips"></div>
    <div class="dna-sub" id="r-dna-sub"></div>
  </div>

  <!-- 유형 카드 -->
  <div class="type-hero" id="r-type-hero">
    <span class="type-emoji" id="r-emoji"></span>
    <div class="type-name" id="r-type-name"></div>
    <div class="type-desc" id="r-type-desc"></div>
    <div class="trait-row" id="r-traits"></div>
  </div>

  <!-- 학습 능력 프로파일 -->
  <div class="sec">
    <div class="sec-head">
      <div class="sec-icon ic-ability">🧠</div>
      <div class="sec-title">학습 능력 프로파일</div>
    </div>
    <div id="r-abilities"></div>
  </div>

  <!-- 공부 취향 분석 -->
  <div class="sec">
    <div class="sec-head">
      <div class="sec-icon ic-pref">❤️</div>
      <div class="sec-title">공부 취향 분석</div>
    </div>
    <div id="r-preference"></div>
  </div>

  <!-- 성향 인사이트 -->
  <div class="sec">
    <div class="sec-head">
      <div class="sec-icon ic-insight">💡</div>
      <div class="sec-title">나만의 성향 인사이트</div>
    </div>
    <div id="r-insight"></div>
  </div>

  <!-- 추천 공부법 -->
  <div class="sec">
    <div class="sec-head">
      <div class="sec-icon ic-study">📖</div>
      <div class="sec-title">추천 공부법 TOP 3</div>
    </div>
    <div id="r-methods"></div>
  </div>

  <!-- 최적 공부시간 -->
  <div class="sec">
    <div class="sec-head">
      <div class="sec-icon ic-time">⏰</div>
      <div class="sec-title">최적 공부 시간대</div>
    </div>
    <div class="time-labels"><span>오전 6시</span><span>오후 3시</span><span>자정</span></div>
    <div class="time-bar"><div class="time-fill" id="r-time-fill"></div></div>
    <div class="time-best" id="r-time-best"></div>
  </div>

  <!-- 과목 전략 -->
  <div class="sec">
    <div class="sec-head">
      <div class="sec-icon ic-study">🎯</div>
      <div class="sec-title">과목별 학습 전략</div>
    </div>
    <div id="r-subjects"></div>
  </div>

  <!-- 목표대학 갭 -->
  <div class="sec" id="r-gap-sec" style="display:none">
    <div class="sec-head">
      <div class="sec-icon ic-uni">🏛️</div>
      <div class="sec-title">목표 대학 달성 가능성</div>
    </div>
    <div id="r-gap"></div>
  </div>

  <!-- 멘탈 코칭 -->
  <div class="sec">
    <div class="sec-head">
      <div class="sec-icon ic-mental">🧘</div>
      <div class="sec-title">멘탈 코칭</div>
    </div>
    <div id="r-mental"></div>
  </div>

  <!-- 체력 루틴 -->
  <div class="sec">
    <div class="sec-head">
      <div class="sec-icon ic-body">💪</div>
      <div class="sec-title">체력 관리 루틴</div>
    </div>
    <div class="risk-wrap">
      <div class="risk-label-row">
        <span>번아웃 위험도</span>
        <span id="r-risk-label"></span>
      </div>
      <div class="risk-bar"><div class="risk-fill" id="r-risk-fill"></div></div>
    </div>
    <div id="r-body"></div>
  </div>

  <button class="btn-secondary" onclick="goBack()">↩ 다시 분석하기</button>
</div>

<script>
// ══════════════════════════════════════════════
// 핵심 분석 엔진 (일간·월지·오행·십성 기반)
// ══════════════════════════════════════════════
const _ENGINE = (() => {
  const _H = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const _E = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const _HF = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
  const _EF = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
  const _HYY = {甲:0,乙:1,丙:0,丁:1,戊:0,己:1,庚:0,辛:1,壬:0,癸:1};
  const _EYY = {子:0,丑:1,寅:0,卯:1,辰:0,巳:1,午:0,未:1,申:0,酉:1,戌:0,亥:1};

  // 오행 관계
  const _gen   = {木:'火',火:'土',土:'金',金:'水',水:'木'};
  const _ctrl  = {木:'土',火:'金',土:'水',金:'木',水:'火'};
  const _genBy = {木:'水',火:'木',土:'火',金:'土',水:'金'};
  const _ctBy  = {木:'金',火:'水',土:'木',金:'火',水:'土'};

  // ── 일간별 학습 성향 프로파일 (오행명 없음) ──
  const _IP = {
    甲:{type:'개척형',  core:'주도적 탐구자',    ability:'독립적 방향 개척',       tendency:'자기 방식을 고집',          style:'큰 그림부터 파악 후 세부 탐구', emoji:'🧭'},
    乙:{type:'적응형',  core:'유연한 탐색자',    ability:'맥락 속 적응 학습',       tendency:'협력과 공감 선호',          style:'관계·연결 속에서 이해',         emoji:'🌱'},
    丙:{type:'열정형',  core:'에너지 발산자',    ability:'빠른 직관적 이해',        tendency:'즉각적 피드백 선호',         style:'흥미와 몰입 중심',              emoji:'🔥'},
    丁:{type:'통찰형',  core:'세밀한 분석자',    ability:'심층 개념 파악',          tendency:'내면적 사색·숙고',          style:'의미 파악 후 내면화',           emoji:'🕯️'},
    戊:{type:'안정형',  core:'믿음직한 축적자',  ability:'반복·누적 학습',          tendency:'안정적 루틴 선호',          style:'단계적·체계적 쌓기',            emoji:'🏔️'},
    己:{type:'정밀형',  core:'꼼꼼한 정리자',    ability:'세밀한 암기·구조화',      tendency:'완전한 이해 추구',          style:'정교한 노트·체계화',            emoji:'📐'},
    庚:{type:'결단형',  core:'논리적 실행자',    ability:'구조적 분석력',           tendency:'원칙·기준 중시',            style:'문제 패턴 파악 후 해결',        emoji:'⚡'},
    辛:{type:'완성형',  core:'섬세한 완성자',    ability:'정밀한 완성도',           tendency:'완벽한 마무리 추구',        style:'오류 발견·수정 반복',           emoji:'💎'},
    壬:{type:'탐구형',  core:'광범위한 탐험자',  ability:'빠른 개념 흡수·연결',    tendency:'다양한 분야 관심',          style:'연결형·통합형 학습',            emoji:'🌊'},
    癸:{type:'직관형',  core:'깊은 통찰자',      ability:'직관적 핵심 파악',        tendency:'내면 집중·사색',            style:'핵심 원리 이해 중심',           emoji:'🔮'}
  };

  // ── 월지별 에너지 패턴 (오행명 없음) ──
  const _WP = {
    子:{energy:'내면집중형', trait:'차분하고 깊은 사고',     peak:'야간 집중력 최고',         season:'내면의 계절'},
    丑:{energy:'인내지속형', trait:'꾸준하고 꼼꼼함',       peak:'규칙적 루틴에서 최고',     season:'끈기의 계절'},
    寅:{energy:'추진도전형', trait:'활동적·진취적',         peak:'오전 집중력 최고',         season:'도전의 계절'},
    卯:{energy:'유연창의형', trait:'유연하고 창의적',       peak:'오전~오후 집중 우수',      season:'성장의 계절'},
    辰:{energy:'실용준비형', trait:'실용적·계획적',         peak:'오후 집중 우수',           season:'준비의 계절'},
    巳:{energy:'빠른흡수형', trait:'열정적·빠른 이해',     peak:'오전 집중력 탁월',         season:'열기의 계절'},
    午:{energy:'활동에너지형',trait:'에너지·사교성 넘침',  peak:'오후~저녁 집중 최고',      season:'에너지의 계절'},
    未:{energy:'포용인내형', trait:'부드럽고 포용적',       peak:'오후 집중 우수',           season:'수용의 계절'},
    申:{energy:'논리분석형', trait:'날카롭고 분석적',       peak:'오후~저녁 집중 최고',      season:'분석의 계절'},
    酉:{energy:'정밀완성형', trait:'정교하고 완벽주의',    peak:'저녁~야간 집중 최고',      season:'정밀의 계절'},
    戌:{energy:'통합심화형', trait:'깊이 있고 통합적',     peak:'야간 집중력 우수',         season:'통합의 계절'},
    亥:{energy:'지혜흡수형', trait:'직관적·흡수력 강함',  peak:'야간~새벽 집중 최고',      season:'흡수의 계절'}
  };

  // ── 십성 그룹별 학습 동기 특성 (오행명 없음) ──
  const _SS = {
    비겁:{
      trait:'자기주도형',
      strength:'독립적 사고·자기 페이스 유지·경쟁에서 강한 동기',
      weakness:'고집으로 인한 비효율·타인 조언 수용 어려움',
      hint:'혼자 공부가 가장 맞음. 자기 방식을 믿되 주기적 점검 필요',
      motivation:'자존심과 독립적 성취',
      study_style:'자율 학습·자기 설계형'
    },
    식상:{
      trait:'창의표현형',
      strength:'창의적 문제해결·글쓰기·말하기 탁월·아이디어 풍부',
      weakness:'루틴 학습 지루함·집중력 지속 어려움',
      hint:'가르치기 학습(파인만 기법) 효과적. 표현하면서 공부',
      motivation:'흥미와 창의적 도전',
      study_style:'표현·발표·가르치기형'
    },
    재성:{
      trait:'목표실용형',
      strength:'현실적 목표 설정·결과 중심 효율 학습·시간 관리',
      weakness:'과정 무시·흥미 없는 과목 집중력 저하',
      hint:'명확한 목표 수치 설정. 보상 시스템 활용',
      motivation:'결과와 현실적 성취',
      study_style:'목표 중심·결과지향형'
    },
    관성:{
      trait:'규율성취형',
      strength:'높은 성취욕·규칙적 학습·강한 책임감·도전 정신',
      weakness:'완벽주의 번아웃·과도한 자기 압박',
      hint:'계획+휴식 균형 필수. 완벽보다 완료 지향',
      motivation:'성취와 인정·도전',
      study_style:'계획·목표 관리형'
    },
    인성:{
      trait:'지식흡수형',
      strength:'깊은 이해력·빠른 개념 흡수·연구형 사고·학문 탐구',
      weakness:'이해 추구로 속도 느림·암기보다 이해 선호',
      hint:'개념 이해 후 반복 암기. 이해력을 살린 서술·논술 강화',
      motivation:'지적 호기심과 깊은 이해',
      study_style:'개념 탐구·이해 중심형'
    }
  };

  function _getTSG(dayH, otherElem) {
    const de = _HF[dayH];
    if (!de || !otherElem) return '비겁';
    if (otherElem === de)       return '비겁';
    if (_gen[de]  === otherElem) return '식상';
    if (_ctrl[de] === otherElem) return '재성';
    if (_ctBy[de] === otherElem) return '관성';
    if (_genBy[de]=== otherElem) return '인성';
    return '비겁';
  }

  function _dominantSS(dayH, yearH, yearE, monthE, dayE) {
    const cnt = {비겁:0,식상:0,재성:0,관성:0,인성:0};
    cnt[_getTSG(dayH, _HF[yearH])]++;
    cnt[_getTSG(dayH, _EF[yearE])]++;
    cnt[_getTSG(dayH, _EF[monthE])]++;
    cnt[_getTSG(dayH, _EF[dayE])]++;
    return Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0][0];
  }

  function _dayPillar(y, m, d) {
    const diff = Math.round((new Date(y,m-1,d) - new Date(1900,0,1)) / 86400000);
    return { h:_H[((diff%10)+10)%10], e:_E[((diff%12)+12)%12] };
  }
  function _yearPillar(y) {
    return { h:_H[((y-4)%10+10)%10], e:_E[((y-4)%12+12)%12] };
  }

  const _ME = [null,'丑','寅','卯','辰','巳','午','未','申','酉','戌','亥','子'];

  return {
    analyze(year, month, day) {
      const yp = _yearPillar(year);
      const dp = _dayPillar(year, month, day);
      const me = _ME[month];

      const fe = {木:0,火:0,土:0,金:0,水:0};
      [dp.h, yp.h].forEach(h => fe[_HF[h]]++);
      [me, yp.e].forEach(e => fe[_EF[e]]++);

      const dominant = Object.entries(fe).sort((a,b)=>b[1]-a[1])[0][0];
      const weak     = Object.entries(fe).sort((a,b)=>a[1]-b[1])[0][0];
      const domSS    = _dominantSS(dp.h, yp.h, yp.e, me, dp.e);

      const ip = _IP[dp.h];
      const wp = _WP[me];
      const ss = _SS[domSS];

      return {
        learningCode: dp.h,
        dominant, weak, fe,
        dominantSS: domSS,
        ilgan: ip,
        wolji: wp,
        sipseongStudy: ss,
        memoryStrength: ['己','戊','庚','辛'].includes(dp.h) ? 'high' : 'medium',
        bestTimeCode:   ['午','未','申','酉'].includes(dp.e) ? 'afternoon' :
                        ['戌','亥','子','丑'].includes(dp.e) ? 'night' : 'morning',
        stressType: fe['火'] < 1 ? 'burnout_slow' :
                    fe['木'] > 2 ? 'boredom' : 'perfectionism',
      };
    }
  };
})();

// ── 로컬 폴백: Claude API 없이도 성향 분석 표시 ──
function _localFallback(name, profile) {
  const ip = profile.ilgan;
  const wp = profile.wolji;
  const ss = profile.sipseongStudy;
  const mem = profile.memoryStrength === 'high' ? '우수' : '보통';
  const stressLabel = {burnout_slow:'번아웃 서행형', boredom:'지루함 회피형', perfectionism:'완벽주의형'}[profile.stressType];
  return {
    type_name: ip.type + ' ' + ip.core,
    type_emoji: ip.emoji,
    type_desc: \`\${ip.core}인 \${ip.type} 학습자입니다. \${ip.tendency} 성향이 있으며, \${ip.style} 방식으로 공부할 때 가장 효과적입니다. \${wp.energy} 에너지로 \${wp.trait} 특성을 보이며, \${wp.peak}입니다.\`,
    traits: [ip.type, ss.trait, wp.energy, '기억력 ' + mem],
    learning_abilities: {
      headline: ip.ability + ' — ' + ss.trait + '의 강점을 최대한 활용하는 학습자',
      strengths: ss.strength.split('·').slice(0,3).map(s => s.trim()).filter(Boolean),
      weakness: ss.weakness.split('·')[0].trim()
    },
    study_preference: {
      environment: \`\${wp.peak} · \${wp.season}에 에너지가 최고조\`,
      method: ip.style + ' (' + ss.study_style + ')',
      energizer: ss.motivation + ' / ' + ip.tendency,
      killer: ss.weakness.split('·')[0].trim()
    },
    personality_insight: {
      unique_strength: ip.core + '으로서 ' + ip.ability + '가 탁월. ' + ss.strength.split('·')[0],
      warning: ss.weakness + ' · ' + stressLabel + ' 패턴 주의',
      growth_tip: ss.hint
    }
  };
}

async function callClaude(systemPrompt, userPrompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });
  if (!res.ok) throw new Error('API 호출 실패: ' + res.status);
  const data = await res.json();
  const text = data.content.map(b => b.text || '').join('');
  return JSON.parse(text.replace(/\`\`\`json|\`\`\`/g, '').trim());
}

const JR = '반드시 JSON만 응답. 마크다운 코드블록·설명·주석 없이 순수 JSON만 출력.';

// ── 프로파일 설명 빌더 (오행명 노출 없음) ──
function _pd(profile) {
  const ip = profile.ilgan;
  const wp = profile.wolji;
  const ss = profile.sipseongStudy;
  const mem = profile.memoryStrength === 'high' ? '우수' : '보통';
  const st = {burnout_slow:'번아웃 서행형', boredom:'지루함 회피형', perfectionism:'완벽주의형'}[profile.stressType];
  return {
    learnerType: ip.type + ' (' + ip.core + ')',
    ability: ip.ability,
    tendency: ip.tendency,
    studyStyle: ip.style,
    energyPattern: wp.energy + ' · ' + wp.trait,
    peakTime: wp.peak,
    motivationType: ss.trait,
    strength: ss.strength,
    weakness: ss.weakness,
    studyHint: ss.hint,
    motivation: ss.motivation,
    memory: mem,
    stress: st
  };
}

const AGENTS = {
  async plan(name, profile, targetUni) {
    const pd = _pd(profile);
    return callClaude(
      \`당신은 입시 전략 수립 AI입니다. 학습자 성향을 받아 최적 수험 방향을 JSON으로 반환합니다. \${JR}\`,
      \`학습자: \${name}, 유형: \${pd.learnerType}, 동기유형: \${pd.motivationType}, 기억력: \${pd.memory}, 목표: \${targetUni||'미설정'}
반환: {"direction":"수시/정시/균형","priority_subject":"","weak_subject":"","one_line_strategy":""}\`
    );
  },

  async research(targetUni) {
    return callClaude(
      \`당신은 대입 정보 분석 AI입니다. 요청된 대학의 입시 정보를 JSON으로 반환합니다. \${JR}\`,
      \`목표대학: \${targetUni||'미설정'}
반환: {"unis":[{"name":"","admission_rate_pct":30,"key_factor":"","note":""}],"confirmed":false}\`
    );
  },

  async validate(researchData) {
    return callClaude(
      \`당신은 데이터 검증 AI입니다. 입시 정보 신뢰도를 평가합니다. \${JR}\`,
      \`데이터: \${JSON.stringify(researchData)}
반환: {"reliability":"high/medium/low","warning":""}\`
    );
  },

  // ── 핵심: 성향 심층 분석 ──
  async sajuAnalysis(name, profile) {
    const pd = _pd(profile);
    return callClaude(
      \`당신은 학습 성향 심층 분석 AI입니다. 학습자의 성향 코드를 교육심리학적 관점에서 해석해 공부 능력·취향·성향을 체계적으로 분석합니다.
절대 금지 단어: 사주, 명리, 오행, 목화토금수, 천간, 지지, 간지, 일주, 월주, 일간, 월지 등 동양 점성술 용어. \${JR}\`,
      \`학습자: \${name}
━ 학습자 유형: \${pd.learnerType}
━ 핵심 학습 능력: \${pd.ability}
━ 성향: \${pd.tendency}
━ 자연스러운 공부 스타일: \${pd.studyStyle}
━ 에너지 패턴: \${pd.energyPattern}
━ 최적 집중 시간: \${pd.peakTime}
━ 동기 유형: \${pd.motivationType}
━ 핵심 강점: \${pd.strength}
━ 핵심 약점: \${pd.weakness}
━ 공부 힌트: \${pd.studyHint}
━ 동기 원천: \${pd.motivation}
━ 기억력: \${pd.memory}
━ 스트레스 패턴: \${pd.stress}

반환 형식:
{
  "type_name": "독창적인 학습 유형명 (예: 전략적 탐구자, 창의적 개척자 등)",
  "type_emoji": "유형에 맞는 이모지 1개",
  "type_desc": "\${name}님의 공부 DNA와 학습 본성을 구체적이고 생생하게 2-3문장으로",
  "traits": ["핵심특성1","핵심특성2","핵심특성3","핵심특성4"],
  "learning_abilities": {
    "headline": "이 학습자의 가장 강력한 학습 능력 한 줄 요약",
    "strengths": ["구체적 강점 설명1","구체적 강점 설명2","구체적 강점 설명3"],
    "weakness": "가장 보완이 필요한 학습 영역 (구체적으로)"
  },
  "study_preference": {
    "environment": "최적 공부 환경 구체적 설명",
    "method": "이 학습자에게 가장 맞는 공부 방식",
    "energizer": "공부 의욕을 올리는 구체적 요인 (2-3가지)",
    "killer": "공부 의욕을 낮추는 구체적 요인 (1-2가지)"
  },
  "personality_insight": {
    "unique_strength": "이 학습자만이 가진 특별한 공부 강점 (매우 구체적으로)",
    "warning": "반드시 주의해야 할 학습 패턴 (구체적 상황 포함)",
    "growth_tip": "성장을 위한 핵심 실천 조언 (바로 실행 가능하게)"
  }
}\`
    );
  },

  // ── 학습 스타일 + 시간대 ──
  async learningStyle(profile) {
    const pd = _pd(profile);
    return callClaude(
      \`당신은 학습 스타일 분석 AI입니다. 성향 프로파일 기반으로 VARK 유형과 최적 시간대를 분석합니다. \${JR}\`,
      \`유형: \${pd.learnerType}, 에너지: \${pd.energyPattern}, 최적시간: \${pd.peakTime}, 기억력: \${pd.memory}
반환: {"vark":"V/A/R/K","best_time":"최적시간대 설명","time_fill_pct":"퍼센트(예:65%)"}\`
    );
  },

  async subjectLink(profile, direction) {
    const pd = _pd(profile);
    return callClaude(
      \`당신은 과목 연계 전략 AI입니다. 학습자 강점으로 약점 과목을 공략하는 전략을 설계합니다. \${JR}\`,
      \`유형: \${pd.learnerType}, 강점: \${pd.strength}, 약점: \${pd.weakness}, 공부스타일: \${pd.studyStyle}, 수험방향: \${direction}
반환: {"subjects":[{"subject":"국어","strategy":"구체적 전략","priority":"상/중/하"}]}\`
    );
  },

  async studyMethod(profile) {
    const pd = _pd(profile);
    return callClaude(
      \`당신은 공부법 코칭 AI입니다. 파인만 기법·간격반복법·메타인지·코넬노트법·포모도로·황농문 몰입법·이윤규 패턴법 중 이 학습자에게 최적인 3가지를 선정합니다. \${JR}\`,
      \`유형: \${pd.learnerType}, 강점: \${pd.strength}, 공부힌트: \${pd.studyHint}, 동기: \${pd.motivation}, 스트레스: \${pd.stress}
반환: {"methods":[{"name":"공부법명","desc":"이 학습자에게 맞는 구체적 적용 방법 설명"}]}\`
    );
  },

  async progressCoach(name, direction) {
    return callClaude(
      \`당신은 학습 진도 코칭 AI입니다. 월별 로드맵과 갭 분석 전략을 제공합니다. \${JR}\`,
      \`학습자: \${name}, 방향: \${direction}
반환: {"monthly_goal":"","gap_strategy":"","milestone":""}\`
    );
  },

  async mentalCoach(profile) {
    const pd = _pd(profile);
    return callClaude(
      \`당신은 멘탈 코칭 AI입니다. 학습자 성향별 슬럼프 패턴을 분석하고 맞춤 멘탈 전략을 제공합니다. \${JR}\`,
      \`유형: \${pd.learnerType}, 스트레스패턴: \${pd.stress}, 동기: \${pd.motivation}, 약점: \${pd.weakness}
반환: {"tips":["구체적 멘탈 전략1","전략2","전략3"],"dday_message":"수능 당일 이 학습자를 위한 한 마디"}\`
    );
  },

  async bodyCoach(profile) {
    const pd = _pd(profile);
    return callClaude(
      \`당신은 체력 관리 코칭 AI입니다. 번아웃 패턴을 분석하고 기질별 체력 루틴을 설계합니다. \${JR}\`,
      \`스트레스: \${pd.stress}, 약점: \${pd.weakness}, 에너지패턴: \${pd.energyPattern}
반환: {"risk_pct":45,"risk_level":"low/mid/high","risk_comment":"번아웃 위험도 설명","routines":["루틴1","루틴2","루틴3","루틴4"]}\`
    );
  },

  async structure(allData) {
    return callClaude(
      \`당신은 결과 구성 AI입니다. 분석 결과를 통합해 최종 구조를 만듭니다. \${JR}\`,
      \`데이터 요약: \${JSON.stringify(allData).slice(0,400)}
반환: {"summary":"한 줄 요약","highlight":""}\`
    );
  },

  async coding(summary) {
    return callClaude(
      \`당신은 최종 리포트 생성 AI입니다. 분석 결과로 핵심 메시지를 생성합니다. \${JR}\`,
      \`요약: \${JSON.stringify(summary)}
반환: {"final_message":"","action_today":""}\`
    );
  }
};

let _state = {};

async function startAnalysis() {
  const name  = document.getElementById('inp-name').value.trim();
  const year  = parseInt(document.getElementById('inp-year').value);
  const month = parseInt(document.getElementById('inp-month').value);
  const day   = parseInt(document.getElementById('inp-day').value);
  const uni   = document.getElementById('inp-uni').value.trim();

  if (!name) { showErr('이름을 입력해주세요.'); return; }
  if (!year || !month || !day) { showErr('생년월일을 입력해주세요.'); return; }
  if (year < 1990 || year > 2015) { showErr('올바른 년도(1990~2015)를 입력해주세요.'); return; }

  hideErr();
  showScreen('loading');
  document.getElementById('loading-name').textContent = name + '님의 학습 DNA를 분석하고 있어요...';

  const profile = _ENGINE.analyze(year, month, day);
  const agentItems = document.querySelectorAll('.agent-item');
  const results = {};

  async function runAgent(idx, fn, fallbackFn) {
    setAgentActive(agentItems, idx);
    try { results[idx] = await fn(); }
    catch(e) { results[idx] = fallbackFn ? fallbackFn() : null; }
    setAgentDone(agentItems, idx);
  }

  try {
    await runAgent(0, () => AGENTS.plan(name, profile, uni));
    const direction = results[0]?.direction || '균형';
    await runAgent(1, () => AGENTS.research(uni));
    await runAgent(2, () => AGENTS.validate(results[1]));
    await runAgent(3, () => AGENTS.sajuAnalysis(name, profile), () => _localFallback(name, profile));
    await runAgent(4, () => AGENTS.learningStyle(profile));
    await runAgent(5, () => AGENTS.subjectLink(profile, direction));
    await runAgent(6, () => AGENTS.studyMethod(profile));
    await runAgent(7, () => AGENTS.progressCoach(name, direction));
    await runAgent(8, () => AGENTS.mentalCoach(profile));
    await runAgent(9, () => AGENTS.bodyCoach(profile));
    await runAgent(10, () => AGENTS.structure(results));
    await runAgent(11, () => AGENTS.coding(results[10]));

    _state = { name, uni, profile, results };
    renderResult();
    showScreen('result');
  } catch(e) {
    showScreen('input');
    showErr('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.\\n(' + e.message + ')');
  }
}

function renderResult() {
  const { name, uni, profile, results } = _state;
  const r = results;

  document.getElementById('r-greeting').textContent = name + '님의 학습 DNA';

  // ── 에이전트 배지 ──
  const badgeNames = ['Plan','Research','Validation','성향분석','학습스타일','과목연계','공부법','진도코치','멘탈코치','체력코치','구성','리포트'];
  document.getElementById('r-agent-badges').innerHTML =
    badgeNames.map(n => \`<span class="agent-badge"><span class="badge-dot"></span>\${n} Agent</span>\`).join('');

  // ── DNA 배너 (로컬 분석 — 항상 표시) ──
  const ip = profile.ilgan;
  const wp = profile.wolji;
  const ss = profile.sipseongStudy;
  const chips = [
    { icon:'🧭', label: ip.type + ' · ' + ip.core },
    { icon:'⚡', label: wp.energy },
    { icon:'🎯', label: ss.trait },
    { icon:'⏰', label: wp.peak }
  ];
  document.getElementById('r-dna-chips').innerHTML = chips.map(c =>
    \`<span class="dna-chip"><span class="dna-chip-icon">\${c.icon}</span>\${c.label}</span>\`
  ).join('');
  document.getElementById('r-dna-sub').textContent = ip.tendency + ' · ' + ip.style;

  // ── 유형 카드 ──
  const sa = r[3] || _localFallback(name, profile);
  document.getElementById('r-emoji').textContent = sa.type_emoji || ip.emoji;
  document.getElementById('r-type-name').textContent = sa.type_name || ip.type + ' ' + ip.core;
  document.getElementById('r-type-desc').textContent = sa.type_desc || '';
  document.getElementById('r-traits').innerHTML = (sa.traits || []).map(t => \`<span class="trait">\${t}</span>\`).join('');

  // ── 학습 능력 프로파일 ──
  const la = sa.learning_abilities || {};
  const abStr = la.headline ? \`<div class="ability-headline">✨ \${la.headline}</div>\` : '';
  const abStrengths = (la.strengths || []).map((s, i) => \`
    <div class="ability-card">
      <div class="ability-icon">\${['💪','🎯','🔑'][i]||'⭐'}</div>
      <div class="ability-name">\${s}</div>
    </div>\`).join('');
  const abWeak = la.weakness ? \`
    <div class="ability-divider">
      <div class="ability-divider-line"></div>
      <div class="ability-divider-text">보완 영역</div>
      <div class="ability-divider-line"></div>
    </div>
    <div class="ability-card weak-card" style="grid-column:1/-1">
      <div class="ability-icon">🔧</div>
      <div class="ability-name weak-name">\${la.weakness}</div>
    </div>\` : '';
  document.getElementById('r-abilities').innerHTML =
    abStr + '<div class="ability-grid">' + abStrengths + abWeak + '</div>';

  // ── 공부 취향 분석 ──
  const sp = sa.study_preference || {};
  document.getElementById('r-preference').innerHTML = \`
    <div class="pref-grid">
      <div class="pref-box">
        <div class="pref-label">🏠 최적 공부 환경</div>
        <div class="pref-value">\${sp.environment || wp.peak + ' · ' + wp.season}</div>
      </div>
      <div class="pref-box">
        <div class="pref-label">📚 선호 공부 방식</div>
        <div class="pref-value">\${sp.method || ip.style}</div>
      </div>
    </div>
    <div class="pref-grid">
      <div class="pref-box">
        <div class="pref-label">🔥 의욕 UP 요인</div>
        <div class="pref-value">\${sp.energizer || ss.motivation}</div>
      </div>
      <div class="pref-box">
        <div class="pref-label">❄️ 의욕 DOWN 요인</div>
        <div class="pref-value">\${sp.killer || ss.weakness.split('·')[0]}</div>
      </div>
    </div>
    <div class="pref-box" style="margin-top:8px">
      <div class="pref-label">💡 나에게 맞는 공부법 힌트</div>
      <div class="pref-value">\${ss.hint}</div>
    </div>\`;

  // ── 성향 인사이트 ──
  const pi = sa.personality_insight || {};
  document.getElementById('r-insight').innerHTML = \`
    <div class="insight-block star">
      <div class="insight-head star">⭐ 나만의 특별한 강점</div>
      <div class="insight-body">\${pi.unique_strength || ip.ability + '가 탁월한 ' + ip.type + '형 학습자'}</div>
    </div>
    <div class="insight-block warn">
      <div class="insight-head warn">⚠️ 주의해야 할 패턴</div>
      <div class="insight-body">\${pi.warning || ss.weakness}</div>
    </div>
    <div class="insight-block tip">
      <div class="insight-head tip">🚀 성장을 위한 핵심 조언</div>
      <div class="insight-body">\${pi.growth_tip || ss.hint}</div>
    </div>\`;

  // ── 추천 공부법 ──
  const sm = r[6] || {};
  document.getElementById('r-methods').innerHTML = (sm.methods || []).map((m, i) => \`
    <div class="method-item">
      <div class="m-num">\${i+1}</div>
      <div><div class="m-name">\${m.name}</div><div class="m-desc">\${m.desc}</div></div>
    </div>\`).join('');

  // ── 시간대 ──
  const ls = r[4] || {};
  const timeMap = { morning:'20%', afternoon:'60%', night:'85%' };
  document.getElementById('r-time-fill').style.width = ls.time_fill_pct || timeMap[profile.bestTimeCode] || '60%';
  document.getElementById('r-time-best').textContent = '🕐 최적 시간: ' + (ls.best_time || wp.peak);

  // ── 과목 전략 ──
  const sl = r[5] || {};
  document.getElementById('r-subjects').innerHTML = (sl.subjects || []).map(s => \`
    <div class="method-item">
      <div class="m-num">\${s.priority==='상'?'★':'○'}</div>
      <div><div class="m-name">\${s.subject}</div><div class="m-desc">\${s.strategy}</div></div>
    </div>\`).join('');

  // ── 목표대학 갭 ──
  if (uni && r[1]?.unis?.length) {
    document.getElementById('r-gap-sec').style.display = 'block';
    document.getElementById('r-gap').innerHTML = r[1].unis.map(u => {
      const pct = u.admission_rate_pct || 30;
      const cls = pct >= 60 ? 'gap-good' : pct >= 35 ? 'gap-warn' : 'gap-danger';
      return \`<div class="gap-row">
        <div class="gap-uni">\${u.name}</div>
        <div class="gap-bar-wrap"><div class="gap-bar"><div class="gap-fill \${cls}" style="width:\${pct}%"></div></div></div>
        <div class="gap-pct" style="color:\${pct>=60?'#27ae60':pct>=35?'#e67e22':'#e74c3c'}">\${pct}%</div>
      </div>\`;
    }).join('');
  }

  // ── 멘탈 코칭 ──
  const mc = r[8] || {};
  document.getElementById('r-mental').innerHTML =
    (mc.tips || []).map(t => \`<div class="c-item"><div class="c-dot"></div><span>\${t}</span></div>\`).join('') +
    (mc.dday_message ? \`<div class="c-item" style="background:#f8faff;border-radius:8px;padding:10px 12px;margin-top:8px;"><div class="c-dot" style="background:var(--navy)"></div><span style="color:var(--navy);font-weight:600">수능 당일: \${mc.dday_message}</span></div>\` : '');

  // ── 체력 루틴 ──
  const bc = r[9] || {};
  const riskPct = bc.risk_pct || 45;
  const riskCls = riskPct >= 65 ? 'risk-high' : riskPct >= 40 ? 'risk-mid' : 'risk-low';
  document.getElementById('r-risk-fill').className = 'risk-fill ' + riskCls;
  document.getElementById('r-risk-fill').style.width = riskPct + '%';
  document.getElementById('r-risk-label').textContent = bc.risk_comment || '';
  document.getElementById('r-body').innerHTML = (bc.routines || []).map(b => \`<div class="c-item"><div class="c-dot"></div><span>\${b}</span></div>\`).join('');
}

function setAgentActive(items, idx) {
  items.forEach((el, i) => {
    if (i < idx) el.className = 'agent-item done';
    else if (i === idx) el.className = 'agent-item active';
    else if (i <= idx + 2) el.className = 'agent-item show';
  });
  const activeEl = document.querySelector(\`.agent-item[data-i="\${idx}"]\`);
  if (activeEl) {
    const sp = document.createElement('div');
    sp.className = 'agent-spinner';
    const old = activeEl.querySelector('div');
    if (old) activeEl.replaceChild(sp, old);
    activeEl.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }
}
function setAgentDone(items, idx) {
  const el = document.querySelector(\`.agent-item[data-i="\${idx}"]\`);
  if (el) {
    el.className = 'agent-item done';
    const sp = el.querySelector('div');
    if (sp) { const d = document.createElement('div'); d.className='agent-dot'; el.replaceChild(d, sp); }
    el.textContent = '✅ ' + el.textContent.replace(/^[✅🔄]\s*/,'');
  }
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  window.scrollTo({ top:0, behavior:'smooth' });
}
function goBack() { showScreen('input'); }
function showErr(msg) { const el=document.getElementById('err-box'); el.textContent=msg; el.style.display='block'; }
function hideErr() { document.getElementById('err-box').style.display='none'; }
</script>
</body>
</html>`;

export default sajuPageHTML;
