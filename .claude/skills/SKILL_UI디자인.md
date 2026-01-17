# SKILL: UI디자인

소유 학습 진단 앱의 UI/UX 디자인 가이드입니다.

## 디자인 시스템

### CSS 변수 (theme.css)

모든 스타일은 CSS 변수를 활용하여 일관성을 유지합니다.

#### 색상 팔레트

```css
/* Primary Colors - 하루 테마 (보라) */
--primary: #9370DB;           /* 메인 보라색 */
--primary-light: #A890E0;     /* 밝은 보라색 */
--primary-dark: #7B5FC7;      /* 어두운 보라색 */

/* Secondary - 연보라 */
--secondary: #E6E6FA;         /* 연보라 */

/* Accent - 금색 (레벨업, 성공) */
--accent: #FFD700;            /* 금색 */
--accent-light: #FFE44D;
--accent-dark: #DAA520;

/* Background - 밤 테마 */
--bg-main: #1a1a2e;           /* 메인 배경 (어두운 남색) */
--bg-secondary: #16213e;      /* 보조 배경 */
--bg-card: #16213e;           /* 카드 배경 */
--bg-card-hover: #1f2b47;     /* 카드 호버 */

/* Feedback Colors */
--success: #4ade80;           /* 정답 - 녹색 */
--retry: #fbbf24;             /* 재시도 - 노란색 */
--info: #60a5fa;              /* 정보 - 파란색 */
--error: #f87171;             /* 에러 - 빨간색 */

/* Text Colors */
--text-primary: #ffffff;      /* 주요 텍스트 */
--text-secondary: #a0a0a0;    /* 보조 텍스트 */
--text-muted: #6b7280;        /* 흐릿한 텍스트 */
--text-inverse: #1a1a2e;      /* 역전 텍스트 (밝은 배경용) */
```

#### 타이포그래피

```css
/* Fonts */
--font-primary: 'Noto Sans KR', sans-serif;   /* 본문 */
--font-display: 'Black Han Sans', sans-serif; /* 제목, 강조 */

/* Font Sizes */
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;       /* 기본 크기 */
--font-size-lg: 20px;
--font-size-xl: 24px;
--font-size-2xl: 32px;
--font-size-3xl: 40px;
--font-size-4xl: 48px;

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;

/* Line Heights */
--line-height-tight: 1.2;     /* 제목용 */
--line-height-normal: 1.5;    /* 본문 */
--line-height-relaxed: 1.75;  /* 편안한 읽기 */
```

#### 간격 (Spacing)

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;           /* 기본 간격 */
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

#### 테두리 (Border Radius)

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;            /* 기본 */
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;        /* 완전 둥근 */
```

#### 전환 효과 (Transitions)

```css
--transition-fast: 0.15s ease;
--transition-base: 0.3s ease;  /* 기본 */
--transition-slow: 0.5s ease;
```

#### 그라디언트

```css
--gradient-primary: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
--gradient-accent: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
--gradient-success: linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%);
--gradient-bg: linear-gradient(180deg, var(--bg-main) 0%, var(--bg-secondary) 100%);
```

## 귀멸 테마 가이드라인

### 컨셉

```
┌─────────────────────────────────────────────┐
│  🦊 나비저택 특별 수련 🦊                    │
│                                             │
│  밤하늘 아래 나비저택에서                    │
│  하루와 함께하는 특별한 수련                 │
│                                             │
│  색상: 보라 (하루) + 금색 (성공)             │
│  분위기: 신비롭고 따뜻한                     │
└─────────────────────────────────────────────┘
```

### 색상 사용 원칙

| 색상 | 용도 | 예시 |
|------|------|------|
| 보라 (`--primary`) | 주요 UI 요소, 강조, 브랜딩 | 버튼, 제목, 테두리 |
| 금색 (`--accent`) | 레벨업, 성공, 특별한 순간 | 레벨업 효과, 성취 배지 |
| 녹색 (`--success`) | 정답, 긍정적 피드백 | 정답 표시, 완료 상태 |
| 노란색 (`--retry`) | 재시도, 주의 | 오답 표시, 힌트 |
| 어두운 남색 (`--bg-main`) | 배경 | 앱 전체 배경 |
| 하얀색 (`--text-primary`) | 주요 텍스트 | 모든 중요 텍스트 |

### 이모지 사용

**권장 이모지**:
- 🦊 (여우) - 하루 캐릭터, 레벨
- 📚 (책) - 어휘력
- 💪 (근육) - 자기효능감
- 📖 (책 펼침) - 읽기
- ❤️ (하트) - 동기/정서
- ✏️ (연필) - 문법
- ⭐ (별) - 강점
- ✨ (반짝임) - 레벨업
- 🎯 (과녁) - 목표 달성

## 컴포넌트 스타일

### 1. 버튼

#### 기본 버튼
```css
.btn {
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-base);
  min-height: var(--touch-target-min); /* 44px */
}
```

#### 버튼 변형

**Primary 버튼** (주요 액션):
```css
.btn-primary {
  background: var(--gradient-primary);
  color: var(--text-primary);
  box-shadow: 0 4px 15px var(--shadow-primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-primary);
}
```

**Secondary 버튼** (보조 액션):
```css
.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

**Accent 버튼** (특별 액션, 레벨업):
```css
.btn-accent {
  background: var(--gradient-accent);
  color: var(--text-inverse);
  font-weight: var(--font-weight-bold);
}
```

#### 사용 예시
```html
<button class="btn btn-primary btn-block">진단 시작하기</button>
<button class="btn btn-secondary">취소</button>
<button class="btn btn-accent">레벨 확인</button>
```

### 2. 카드

#### 기본 카드
```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
}

.card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 20px var(--shadow-color);
}
```

#### 영역 카드 (진단 영역 선택)
```css
.area-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-xl);
  cursor: pointer;
}

.area-card:hover {
  border-color: var(--primary);
  transform: translateX(5px);
}

.area-card.completed {
  opacity: 0.6;
  cursor: default;
}
```

### 3. 선택지 버튼

#### 문제 선택지
```css
.option-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-xl);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-base);
}

.option-btn:hover {
  border-color: var(--primary);
  background: var(--bg-card-hover);
}
```

#### 정답/오답 상태
```css
.option-btn.correct {
  border-color: var(--success);
  background: rgba(var(--success-rgb), 0.2);
  animation: correctGlow 0.5s ease;
}

.option-btn.incorrect {
  border-color: var(--retry);
  background: rgba(var(--retry-rgb), 0.2);
  animation: shake 0.5s ease;
}
```

### 4. 척도 선택 (Scale)

```css
.scale-container {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: space-between;
}

.scale-option {
  flex: 1;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.scale-option:hover {
  border-color: var(--primary);
  transform: scale(1.05);
}

.scale-option.selected {
  border-color: var(--primary);
  background: rgba(var(--primary-rgb), 0.2);
}
```

### 5. 진행률 바

```css
.progress-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}
```

### 6. 하루 캐릭터

#### 캐릭터 컨테이너
```css
.character-container {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: var(--z-base);
}

.character-image {
  width: var(--character-size); /* 200px */
  height: var(--character-size);
  object-fit: contain;
  filter: drop-shadow(0 4px 10px var(--shadow-color));
}
```

#### 대사 말풍선
```css
.dialogue-bubble {
  background: var(--bg-card);
  border: 2px solid var(--primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  position: relative;
}

.dialogue-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 30px;
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: var(--primary) transparent transparent;
}
```

### 7. 레벨 배지

```css
.level-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
}

.level-icon {
  font-size: var(--font-size-lg);
}

.level-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--primary);
}
```

### 8. 토스트 알림

```css
.toast {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: 0 4px 20px var(--shadow-color);
  animation: slideDown var(--transition-base) ease;
}

.toast-success {
  border-color: var(--success);
}

.toast-error {
  border-color: var(--error);
}
```

## 애니메이션 원칙

### 1. 사용 시기

| 상황 | 애니메이션 | 지속 시간 |
|------|-----------|----------|
| 페이지 전환 | fade, slide | 0.3s |
| 버튼 클릭 | scale, translateY | 0.15s |
| 정답 | correctGlow | 0.5s |
| 오답 | shake | 0.5s |
| 레벨업 | levelupPop, pulse | 0.5s ~ 1s |
| 토스트 | slideDown | 0.3s |
| 로딩 | bounce, rotate | 무한 |

### 2. 주요 애니메이션

#### 정답 효과 (animations.css)
```css
@keyframes correctGlow {
  0% { box-shadow: 0 0 0 0 rgba(var(--success-rgb), 0.7); }
  100% { box-shadow: 0 0 20px 10px rgba(var(--success-rgb), 0); }
}
```

#### 오답 흔들림
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
```

#### 레벨업 팝업
```css
@keyframes levelupPop {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

#### 바운스 (로딩)
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### 3. 접근성 고려

**애니메이션 감소 모드**:
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0s;
    --transition-base: 0s;
    --transition-slow: 0s;
  }

  * {
    animation-duration: 0.01ms !important;
  }
}
```

## 반응형 디자인

### 브레이크포인트

```css
/* 모바일 (기본) */
/* ~767px */

/* 태블릿 */
@media (min-width: 768px) {
  /* ... */
}

/* 데스크톱 */
@media (min-width: 1024px) {
  :root {
    --character-size: 250px;
  }
}
```

### 주요 대상: 갤럭시탭 14.6"

- **화면 크기**: 2960 × 1848 (16:10 비율)
- **권장 뷰포트**: 최대 800px 컨텐츠 너비
- **터치 타겟**: 최소 44px × 44px
- **폰트 크기**: 16px 기본 (충분히 큼)

### 반응형 조절

```css
@media (max-width: 768px) {
  :root {
    --character-size: 150px;
  }

  .page-container {
    padding: var(--spacing-md);
  }

  .dialogue-bubble {
    max-width: 200px;
  }
}
```

## 접근성 고려사항

### 1. 색상 대비

- **텍스트**: 최소 4.5:1 대비율 (WCAG AA)
- **큰 텍스트**: 최소 3:1 대비율
- **주요 텍스트**: 하얀색 (#ffffff) on 어두운 배경

### 2. 터치 타겟

```css
:root {
  --touch-target-min: 44px; /* iOS/Android 권장 */
}

.btn, .option-btn, .btn-icon {
  min-height: var(--touch-target-min);
  min-width: var(--touch-target-min);
}
```

### 3. 포커스 표시

```css
button:focus, a:focus, input:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### 4. ARIA 레이블

```html
<button aria-label="뒤로가기">←</button>
<button aria-label="소리 끄기">🔊</button>
<div role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
```

### 5. 키보드 탐색

- 모든 인터랙티브 요소는 `Tab`으로 접근 가능
- `Enter` 또는 `Space`로 활성화 가능
- 논리적인 탭 순서 유지

### 6. 고대비 모드

```css
@media (prefers-contrast: high) {
  :root {
    --text-secondary: #c0c0c0;
    --border-color: rgba(147, 112, 219, 0.5);
  }
}
```

## 레이아웃 패턴

### 1. 홈 화면

```
┌─────────────────────────────────┐
│          [헤더]                 │ 60px 고정
├─────────────────────────────────┤
│                                 │
│      🦊                         │
│   나비저택 특별 수련             │
│                                 │
│   [진단 시작하기]               │
│   [이어하기]                    │
│   [부모 대시보드]               │
│                                 │
│                [하루 캐릭터]    │ 우하단 고정
└─────────────────────────────────┘
```

### 2. 영역 선택

```
┌─────────────────────────────────┐
│  [←]  영역 선택     [🔊] [🦊1형]│
├─────────────────────────────────┤
│                                 │
│  [📚 어휘력              →]    │
│  [💪 학습 자기효능감     →]    │
│  [📖 읽기 이해          →]    │
│  [❤️ 학습 동기/정서      →]    │
│  [✏️ 문법 기초          →]    │
│  [⭐ 강점 발견          →]    │
│                                 │
│                [하루 캐릭터]    │
└─────────────────────────────────┘
```

### 3. 문제 화면

```
┌─────────────────────────────────┐
│  [←]  어휘력        [🔊] [🦊1형]│
├─────────────────────────────────┤
│                                 │
│  [상황 설명 박스]                │
│                                 │
│  문제 텍스트                     │
│                                 │
│  [1] 선택지 1                   │
│  [2] 선택지 2                   │
│  [3] 선택지 3                   │
│  [4] 선택지 4                   │
│                                 │
│  [피드백 영역]                   │
│  [다음 문제]                     │
│                [하루 캐릭터]    │
├─────────────────────────────────┤
│  어휘력            5 / 20       │ 진행률 바
└─────────────────────────────────┘
```

## UI 개발 체크리스트

### 새 컴포넌트 개발 시
- [ ] CSS 변수 활용 (하드코딩 금지)
- [ ] 반응형 확인 (모바일, 태블릿, 데스크톱)
- [ ] 터치 타겟 최소 44px
- [ ] 호버 효과 추가
- [ ] 전환 애니메이션 (`var(--transition-base)`)
- [ ] 귀멸 테마 일관성 유지
- [ ] ARIA 레이블 추가
- [ ] 키보드 탐색 가능
- [ ] 포커스 표시 확인

### 색상 사용 시
- [ ] CSS 변수 사용 (`var(--primary)`)
- [ ] 색상 대비 확인 (4.5:1 이상)
- [ ] 고대비 모드 테스트
- [ ] 색맹 시뮬레이션 확인

### 애니메이션 추가 시
- [ ] 지속 시간 적절 (0.15s ~ 0.5s)
- [ ] `prefers-reduced-motion` 고려
- [ ] 성능 확인 (60fps 유지)
- [ ] 과도한 애니메이션 지양

## 디자인 참고 자료

### 귀멸의칼날 컬러 참고
- 나비저택: 보라, 남색, 하얀색
- 밤 장면: 어두운 남색, 금색 별빛
- 하루: 보라 머리, 흰색 구미호 가면, 금색 문양

### 이모지 선택 원칙
- 플랫폼 호환성 확인
- 너무 화려하지 않게
- 의미 명확하게

### 폰트 사용
- **Noto Sans KR**: 본문, 설명, 대부분의 텍스트
- **Black Han Sans**: 제목, 레벨명, 강조 문구

## 관련 문서

- **SKILL_진단앱개발.md**: 전체 앱 개발 가이드
- **SKILL_문제생성.md**: 문제 JSON 작성 가이드
- **PLAN.md**: 프로젝트 마스터 플랜
