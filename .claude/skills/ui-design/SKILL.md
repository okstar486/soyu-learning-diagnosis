---
name: ui-design
description: 소유 앱 UI 디자인 스킬. 귀멸 테마 색상, 애니메이션, 레이아웃 시 자동 적용.
allowed-tools: Read, Write, Edit, Glob
---

# UI 디자인 가이드

## 색상 팔레트

### CSS 변수
```css
:root {
  /* Primary Colors */
  --primary: #9370DB;      /* 보라 (하루 테마) */
  --primary-light: #A890E0;
  --primary-dark: #7B5FC7;
  --secondary: #E6E6FA;    /* 연보라 */

  /* Accent Colors */
  --accent: #FFD700;       /* 금색 (레벨업) */
  --accent-light: #FFE44D;

  /* Background Colors */
  --bg-main: #1a1a2e;      /* 어두운 남색 (밤 느낌) */
  --bg-card: #16213e;      /* 카드 배경 */
  --bg-hover: #1f2b47;     /* 호버 상태 */

  /* Feedback Colors */
  --success: #4ade80;      /* 정답 - 녹색 */
  --success-light: #86efac;
  --retry: #fbbf24;        /* 재시도 - 노란색 */
  --retry-light: #fcd34d;
  --info: #60a5fa;         /* 정보 - 파란색 */

  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted: #6b7280;

  /* Border & Shadow */
  --border-color: rgba(147, 112, 219, 0.3);
  --shadow-color: rgba(0, 0, 0, 0.3);
}
```

## 타이포그래피

```css
:root {
  --font-primary: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Black Han Sans', sans-serif;

  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 40px;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

## 간격 시스템

```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
}
```

## 반응형 타겟

### 기본 (갤럭시탭 14.6")
- 뷰포트: 2560×1600
- 실제 CSS: 1280×800 (2x 스케일)

### 브레이크포인트
```css
/* Mobile first */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### 터치 타겟
- 최소 크기: 44px × 44px
- 권장 크기: 48px × 48px
- 버튼 패딩: 12px 24px

## 애니메이션

### 정답 효과
```css
@keyframes correct-glow {
  0% { box-shadow: 0 0 0 rgba(74, 222, 128, 0); }
  50% { box-shadow: 0 0 30px rgba(74, 222, 128, 0.6); }
  100% { box-shadow: 0 0 0 rgba(74, 222, 128, 0); }
}

@keyframes correct-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### 오답 효과
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}
```

### 레벨업 효과
```css
@keyframes levelup-glow {
  0% {
    box-shadow: 0 0 0 rgba(255, 215, 0, 0);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 50px rgba(255, 215, 0, 0.8);
    transform: scale(1.1);
  }
  100% {
    box-shadow: 0 0 0 rgba(255, 215, 0, 0);
    transform: scale(1);
  }
}

@keyframes confetti {
  0% { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
}
```

### 전환 효과
```css
.transition-base {
  transition: all 0.3s ease;
}

.transition-fast {
  transition: all 0.15s ease;
}

.transition-slow {
  transition: all 0.5s ease;
}
```

## 컴포넌트 스타일

### 버튼
```css
.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}
```

### 카드
```css
.card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
}
```

### 진행률 바
```css
.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 4px;
  transition: width 0.5s ease;
}
```

## 상세 구현
[css/animations.css](../../../css/animations.css) 참조
