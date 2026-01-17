# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-01-17

### Added

#### Wave 1: 기반 설정
- **서브에이전트** (.claude/agents/)
  - `planner.md` - 프로젝트 기획 전문가
  - `coder.md` - HTML/CSS/JS 개발 전문가
  - `tester.md` - QA 및 테스트 전문가
  - `ui-designer.md` - UI/UX 디자인 전문가
  - `question-generator.md` - 문제 콘텐츠 생성 전문가

- **스킬** (.claude/skills/)
  - `diagnosis-app/SKILL.md` - 앱 개발 가이드
  - `question-gen/SKILL.md` - 문제 JSON 형식 가이드
  - `ui-design/SKILL.md` - UI 디자인 시스템

- **문서**
  - `README.md` - 프로젝트 소개
  - `PRD.md` - 제품 요구사항 정의서
  - `ARCHITECTURE.md` - 시스템 아키텍처
  - `INITIALIZE.md` - 시작 가이드

#### Wave 2: 템플릿 및 PWA 기반
- **설정 템플릿**
  - `하루캐릭터설정.md` - 하루 캐릭터 대사/이미지 템플릿
  - `귀멸의칼날하루스토리.md` - 스토리 연결 템플릿
  - `레벨시스템설정.md` - 7단계 레벨 시스템 설정
  - `문제콘텐츠출처.md` - 문제 JSON 형식 규격

- **PWA 구조**
  - `index.html` - SPA 메인 페이지
  - `manifest.json` - PWA 매니페스트
  - `sw.js` - Service Worker (오프라인 지원)

- **CSS**
  - `css/theme.css` - CSS 변수, 색상 팔레트
  - `css/style.css` - 기본 스타일, 컴포넌트
  - `css/animations.css` - 레벨업, 피드백 애니메이션

#### Wave 3: 핵심 기능
- **JavaScript 모듈**
  - `js/app.js` - 앱 초기화, SPA 라우팅
  - `js/storage.js` - localStorage CRUD, JSON 내보내기
  - `js/ui.js` - 화면 전환, 모달, 토스트
  - `js/character.js` - 하루 캐릭터 시스템
  - `js/level.js` - 경험치/레벨업 시스템
  - `js/questions.js` - 문제 로딩, 난이도 조절
  - `js/diagnosis.js` - 진단 흐름 제어
  - `js/dashboard.js` - 부모 대시보드

- **페이지**
  - `pages/home.html` - 홈 화면
  - `pages/diagnosis.html` - 영역 선택
  - `pages/question.html` - 문제 화면
  - `pages/result.html` - 결과 화면
  - `pages/dashboard.html` - 부모 대시보드

- **문제 데이터** (각 5개 예시 포함)
  - `data/questions/vocabulary.json` - 어휘력 (25문항 목표)
  - `data/questions/self-efficacy.json` - 학습 자기효능감 (18문항)
  - `data/questions/reading.json` - 읽기 이해 (12문항)
  - `data/questions/motivation.json` - 학습 동기/정서 (18문항)
  - `data/questions/grammar.json` - 문법 기초 (18문항)
  - `data/questions/strength.json` - 강점 발견 (12문항)

#### Wave 4: 마무리
- **에셋 폴더**
  - `assets/images/` - 이미지 에셋 (README 포함)
  - `assets/sounds/` - 효과음 에셋 (README 포함)

### Features
- ✅ PWA 지원 (오프라인 사용 가능)
- ✅ 6개 영역 학습 진단
- ✅ 7단계 레벨 시스템 (여우의 호흡)
- ✅ 귀멸의칼날 + 하루 캐릭터 테마
- ✅ 적응형 난이도 조절
- ✅ 부모 대시보드 (비밀번호: 7942)
- ✅ 레이더 차트 분석 (Chart.js)
- ✅ JSON 데이터 내보내기
- ✅ 반응형 디자인 (태블릿 최적화)
- ✅ Fallback 시스템 (템플릿 미작성 시에도 동작)

### Technical Stack
- Pure HTML/CSS/JavaScript (프레임워크 없음)
- PWA (Service Worker, Cache API)
- Chart.js (대시보드 차트)
- localStorage (데이터 저장)

---

## 사용자 작업 안내

다음 템플릿 파일들을 채워주세요:

1. **하루캐릭터설정.md** - 하루 캐릭터 대사 커스터마이징
2. **귀멸의칼날하루스토리.md** - 스토리 연결 설정
3. **레벨시스템설정.md** - 레벨업 대사 및 경험치 조정
4. **data/questions/*.json** - 추가 문제 작성

템플릿을 채우지 않아도 기본값으로 앱이 동작합니다.
