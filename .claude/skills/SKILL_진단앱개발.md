# SKILL: 진단앱개발

소유 학습 진단 앱 개발 시 참조하는 핵심 가이드입니다.

## 프로젝트 개요

| 항목 | 값 |
|------|-----|
| 프로젝트명 | soyu-learning-diagnosis |
| 기술 스택 | HTML/CSS/JavaScript (순수) + PWA |
| 호스팅 | GitHub Pages |
| 저장소 | https://github.com/okstar486/soyu-learning-diagnosis |
| 배포 URL | https://okstar486.github.io/soyu-learning-diagnosis |
| 대상 사용자 | 초6→중1 여아 (소유) |
| 테마 | 귀멸의칼날 + 하루 캐릭터 |

## 프로젝트 구조

```
soyu-learning-diagnosis/
├── index.html                    # 메인 진입점 (SPA)
├── manifest.json                 # PWA 매니페스트
├── sw.js                         # Service Worker
│
├── css/
│   ├── theme.css                 # CSS 변수, 귀멸 테마
│   ├── style.css                 # 메인 스타일
│   └── animations.css            # 애니메이션
│
├── js/
│   ├── app.js                    # 앱 초기화, 라우팅
│   ├── ui.js                     # UI 컨트롤러
│   ├── storage.js                # localStorage 관리
│   ├── questions.js              # 문제 로딩, 셔플
│   ├── diagnosis.js              # 진단 엔진
│   ├── character.js              # 하루 캐릭터 로직
│   ├── level.js                  # 레벨 시스템
│   ├── sound.js                  # 효과음
│   └── dashboard.js              # 부모 대시보드
│
├── pages/
│   ├── home.html                 # 홈 화면
│   ├── diagnosis.html            # 영역 선택
│   ├── question.html             # 문제 화면
│   ├── result.html               # 결과 화면
│   └── dashboard.html            # 부모 대시보드
│
├── data/
│   └── questions/
│       ├── vocabulary.json       # 어휘력 문제
│       ├── self-efficacy.json    # 자기효능감 문제
│       ├── reading.json          # 읽기 이해 문제
│       ├── motivation.json       # 동기/정서 문제
│       ├── grammar.json          # 문법 문제
│       └── strength.json         # 강점 발견 문제
│
└── assets/
    ├── images/                   # 하루 캐릭터, 아이콘
    └── sounds/                   # 효과음
```

## 주요 파일 설명

### 1. index.html
- **역할**: SPA의 진입점, 모든 페이지가 여기에 동적으로 로드됨
- **특징**:
  - PWA 메타 태그 포함
  - 로딩 화면
  - 헤더 (뒤로가기, 제목, 음소거, 레벨 배지)
  - 페이지 컨테이너 (동적 로드)
  - 하루 캐릭터 컨테이너
  - 진행률 바
  - 토스트, 모달, 레벨업 효과

### 2. js/app.js
- **역할**: 앱 초기화, SPA 라우팅, 페이지별 초기화
- **주요 함수**:
  - `init()`: 모듈 초기화, 초기 페이지 설정
  - `navigate(page, params)`: 페이지 전환
  - `initHomePage()`: 홈 페이지 버튼 이벤트
  - `initDiagnosisPage()`: 영역 카드 렌더링
  - `initQuestionPage()`: 문제 표시
  - `handleAnswer(index, type, btn)`: 답변 처리

### 3. js/questions.js
- **역할**: 문제 로딩, 셔플, 난이도 조절
- **주요 함수**:
  - `loadArea(areaId)`: JSON 로드
  - `setupQuestions(areaId)`: 문제 설정, 셔플
  - `getCurrent()`: 현재 문제 반환
  - `adjustDifficulty(correct)`: 난이도 동적 조절
  - `getAreaList()`: 영역 목록 반환

### 4. js/diagnosis.js
- **역할**: 진단 진행 상태 관리, 채점, 분석
- **주요 함수**:
  - `start()`: 진단 시작
  - `startArea(areaId)`: 영역 시작
  - `submitAnswer(answerIndex)`: 답변 제출
  - `nextQuestion()`: 다음 문제
  - `completeArea()`: 영역 완료 처리
  - `getResultsSummary()`: 결과 요약
  - `analyzeStrengthsWeaknesses()`: 강약점 분석

### 5. js/storage.js
- **역할**: localStorage 관리, 데이터 저장/불러오기
- **주요 함수**:
  - `save(key, data)`: 저장
  - `load(key)`: 불러오기
  - `hasActiveProgress()`: 진행 중인 진단 확인
  - `getCompletionRate()`: 진행률 계산
  - `exportData()`: JSON 내보내기

### 6. js/character.js
- **역할**: 하루 캐릭터 표시, 대사
- **주요 함수**:
  - `show()`: 캐릭터 표시
  - `hide()`: 캐릭터 숨기기
  - `say(text, duration)`: 대사 표시
  - `sayWelcome()`: 환영 대사
  - `sayCorrect()`: 정답 칭찬
  - `sayEncourage()`: 격려

### 7. js/level.js
- **역할**: 레벨 시스템, 경험치 관리
- **주요 함수**:
  - `addExp(amount)`: 경험치 추가
  - `checkLevelUp()`: 레벨업 확인
  - `showLevelUp()`: 레벨업 연출
  - `getCurrentLevel()`: 현재 레벨 정보
  - `updateBadge()`: 레벨 배지 업데이트

## 개발 시 주의사항

### 1. 코드 스타일

#### JavaScript
```javascript
/**
 * 함수 설명
 * @param {type} paramName - 파라미터 설명
 * @returns {type} 반환값 설명
 */
function functionName(paramName) {
  // 한글 주석 사용
  console.log('[ModuleName] 로그 메시지');

  // 변수명은 명확하게
  const currentQuestion = Questions.getCurrent();

  // 조기 리턴 활용
  if (!currentQuestion) return;

  // 비동기는 async/await 사용
  const result = await Questions.loadArea('vocabulary');
}
```

#### 모듈 패턴
```javascript
const ModuleName = {
  // 상태
  currentState: null,

  // 초기화
  init() {
    console.log('[ModuleName] Initializing...');
  },

  // 메서드
  methodName() {
    // ...
  }
};

// 전역 접근 가능하도록 export
window.ModuleName = ModuleName;
```

#### CSS 변수 활용
```css
/* theme.css에 정의된 변수 사용 */
.element {
  color: var(--primary);
  background: var(--bg-card);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}
```

### 2. SPA 라우팅

**페이지 로드 방식**:
```javascript
// pages/home.html 파일을 fetch하여 #page-container에 삽입
const response = await fetch('pages/home.html');
const html = await response.text();
document.getElementById('page-container').innerHTML = html;
```

**페이지 전환**:
```javascript
// App.navigate() 사용
App.navigate('diagnosis');
App.navigate('question', { area: 'vocabulary' });
```

### 3. 데이터 저장

**localStorage 키 규칙**:
- `soyu-diagnosis-progress`: 진행 상황
- `soyu-diagnosis-results`: 결과 데이터
- `soyu-level`: 레벨 정보
- `soyu-settings`: 설정 (음소거 등)

**저장 예시**:
```javascript
Storage.save('progress', {
  currentArea: 'vocabulary',
  currentIndex: 5,
  answers: [...]
});
```

### 4. 에러 처리

```javascript
try {
  const data = await Questions.loadArea(areaId);
  if (!data) {
    throw new Error('Failed to load area');
  }
} catch (error) {
  console.error('[Questions] Load error:', error);
  UI.toast('문제를 불러올 수 없습니다.', 'error');
  return false;
}
```

### 5. 접근성

- **터치 타겟**: 최소 44px × 44px (`--touch-target-min`)
- **ARIA 레이블**: 버튼에 `aria-label` 추가
- **키보드 탐색**: 모든 인터랙션 요소에 포커스 가능하도록
- **애니메이션**: `prefers-reduced-motion` 지원

## 테스트 방법

### 로컬 개발
```bash
# 1. 로컬 서버 실행 (PWA 테스트를 위해 필수)
python -m http.server 8000
# 또는
npx http-server -p 8000

# 2. 브라우저에서 접속
http://localhost:8000
```

### PWA 설치 테스트
1. Chrome DevTools 열기 (F12)
2. Application 탭 → Manifest 확인
3. Service Worker 확인
4. 주소창 옆 "설치" 버튼 확인

### 오프라인 테스트
1. DevTools → Network 탭
2. "Offline" 체크박스 활성화
3. 새로고침 후 동작 확인

### 모바일 테스트
1. Chrome DevTools → 모바일 뷰 (Ctrl+Shift+M)
2. Galaxy Tab 14.6" 해상도로 테스트
3. 터치 이벤트 시뮬레이션

## 배포 가이드 (GitHub Pages)

### 자동 배포
```bash
# main 브랜치에 push하면 자동 배포
git add .
git commit -m "feat: 새 기능 추가"
git push origin main
```

### 배포 확인
1. GitHub 저장소 → Actions 탭 확인
2. 배포 완료 후 URL 접속:
   https://okstar486.github.io/soyu-learning-diagnosis

### 수동 배포 설정
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / (root)
4. Save

## 디버깅 팁

### 콘솔 로그
```javascript
// 모듈별 로그 형식
console.log('[App] Initializing...');
console.log('[Questions] Loaded:', areaId);
console.error('[Storage] Error:', error);
```

### localStorage 확인
```javascript
// DevTools Console에서
localStorage.getItem('soyu-diagnosis-progress');
Storage.load('progress');
```

### 진단 초기화
```javascript
// DevTools Console에서
Diagnosis.reset();
localStorage.clear();
```

## 성능 최적화

### 1. 이미지 최적화
- 하루 캐릭터 이미지: WebP 형식, 최대 200KB
- 아이콘: SVG 또는 폰트 아이콘
- 배경: CSS 그라디언트 활용

### 2. 코드 분할
- 각 모듈은 독립적으로 동작
- 페이지별 HTML 파일로 분리

### 3. 캐싱
- Service Worker로 정적 파일 캐싱
- 문제 JSON은 메모리에 캐싱 (`Questions.areaData`)

## 버전 관리

### 커밋 메시지 규칙
```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/배포 설정
```

### 브랜치 전략
- `main`: 배포 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

## 체크리스트

### 새 기능 개발 시
- [ ] 코드 스타일 준수 (JSDoc, 한글 주석)
- [ ] 에러 처리 추가
- [ ] 접근성 고려 (ARIA, 터치 타겟)
- [ ] 모바일 반응형 확인
- [ ] 콘솔 로그 추가 (디버깅용)
- [ ] localStorage 키 규칙 준수
- [ ] 테마 CSS 변수 활용
- [ ] 귀멸 테마 일관성 유지

### 배포 전
- [ ] 전체 진단 흐름 테스트
- [ ] PWA 설치 테스트
- [ ] 오프라인 동작 확인
- [ ] 모바일 뷰 확인
- [ ] 부모 대시보드 비밀번호 확인 (7942)
- [ ] 콘솔 에러 없음
- [ ] localStorage 동작 확인

## 관련 문서

- **PLAN.md**: 프로젝트 마스터 플랜
- **SKILL_문제생성.md**: 문제 JSON 작성 가이드
- **SKILL_UI디자인.md**: 디자인 시스템 가이드
- **README.md**: 프로젝트 소개
- **ARCHITECTURE.md**: 시스템 아키텍처
