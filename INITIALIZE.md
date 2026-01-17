# 🚀 소유 학습 진단 앱 - 초기 설정 가이드

## 1. 빠른 시작

### 1.1 온라인 사용 (권장)
1. 브라우저에서 열기: https://okstar486.github.io/soyu-learning-diagnosis
2. "홈 화면에 추가" 클릭 (PWA 설치)
3. 앱처럼 사용!

### 1.2 로컬 개발
```bash
# 1. 저장소 클론
git clone https://github.com/okstar486/soyu-learning-diagnosis.git
cd soyu-learning-diagnosis

# 2. 로컬 서버 실행
python -m http.server 8000
# 또는
npx serve .

# 3. 브라우저에서 열기
http://localhost:8000
```

## 2. 프로젝트 구조

```
soyu-learning-diagnosis/
├── index.html          # 메인 진입점
├── manifest.json       # PWA 설정
├── sw.js               # Service Worker
├── css/                # 스타일시트
│   ├── style.css       # 메인 스타일
│   ├── theme.css       # 귀멸 테마
│   └── animations.css  # 애니메이션
├── js/                 # JavaScript 모듈
│   ├── app.js          # 앱 초기화
│   ├── storage.js      # 데이터 저장
│   ├── ui.js           # UI 컨트롤
│   ├── character.js    # 하루 캐릭터
│   ├── diagnosis.js    # 진단 엔진
│   ├── questions.js    # 문제 관리
│   ├── level.js        # 레벨 시스템
│   └── dashboard.js    # 대시보드
├── pages/              # HTML 페이지
│   ├── home.html       # 홈
│   ├── diagnosis.html  # 진단
│   ├── result.html     # 결과
│   └── dashboard.html  # 부모 대시보드
├── data/questions/     # 문제 데이터 (JSON)
└── assets/             # 이미지, 사운드
```

## 3. 커스터마이징

### 3.1 문제 콘텐츠 추가
1. `data/questions/` 폴더에서 해당 영역 JSON 열기
2. `questions` 배열에 문제 추가:

```json
{
  "id": "vocab_021",
  "type": "choice",
  "difficulty": 3,
  "question": "새로운 문제 텍스트",
  "context": "하루가...",
  "options": ["A", "B", "C", "D"],
  "answer": 0,
  "feedback": {
    "correct": "잘했어!",
    "incorrect": "다시 해보자!"
  }
}
```

### 3.2 하루 캐릭터 대사 수정
`하루캐릭터설정.md` 파일 편집 후, `js/character.js`에 반영

### 3.3 레벨 시스템 조정
`레벨시스템설정.md` 참조하여 `js/level.js` 수정

### 3.4 테마 색상 변경
`css/theme.css`의 CSS 변수 수정:
```css
:root {
  --primary: #9370DB;      /* 메인 보라색 */
  --accent: #FFD700;       /* 레벨업 금색 */
  --bg-main: #1a1a2e;      /* 배경색 */
}
```

## 4. 배포

### 4.1 GitHub Pages 배포
1. GitHub에 push
2. Settings → Pages → Source: main branch
3. https://[username].github.io/soyu-learning-diagnosis

### 4.2 Service Worker 업데이트
버전 변경 시 `sw.js`의 CACHE_NAME 수정:
```javascript
const CACHE_NAME = 'soyu-diagnosis-v2';  // 버전 증가
```

## 5. 테스트 체크리스트

### 5.1 기능 테스트
- [ ] 앱 시작
- [ ] 영역 선택
- [ ] 문제 풀이
- [ ] 정답/오답 피드백
- [ ] 레벨업
- [ ] 결과 화면
- [ ] 부모 대시보드 (비번: 7942)
- [ ] JSON 내보내기

### 5.2 PWA 테스트
- [ ] 홈화면 추가
- [ ] 오프라인 동작
- [ ] 전체화면 모드

### 5.3 반응형 테스트
- [ ] 갤럭시탭 14.6" (2560×1600)
- [ ] 모바일 (360×640)

## 6. 문제 해결

### 6.1 PWA가 설치되지 않음
- HTTPS 필요 (localhost는 예외)
- manifest.json 확인
- Service Worker 등록 확인

### 6.2 오프라인이 작동하지 않음
```bash
# Service Worker 재등록
# Chrome DevTools → Application → Service Workers → Unregister
# 페이지 새로고침
```

### 6.3 데이터 초기화
```javascript
// 브라우저 콘솔에서 실행
localStorage.clear();
location.reload();
```

### 6.4 캐시 강제 갱신
```bash
# Chrome DevTools → Network → Disable cache 체크
# 또는 Ctrl+Shift+R (하드 리로드)
```

## 7. 개발 도구

### 7.1 권장 도구
- **에디터**: VS Code 또는 Cursor
- **브라우저**: Chrome (DevTools 활용)
- **로컬 서버**: Python http.server 또는 npx serve

### 7.2 유용한 확장
- Live Server (VS Code)
- Lighthouse (PWA 테스트)
- Chrome DevTools (Application 탭)

## 8. 참고 문서

- [PLAN.md](PLAN.md) - 마스터 플랜
- [ARCHITECTURE.md](ARCHITECTURE.md) - 시스템 아키텍처
- [PRD.md](PRD.md) - 제품 요구사항
- [하루캐릭터설정.md](하루캐릭터설정.md) - 캐릭터 설정
- [레벨시스템설정.md](레벨시스템설정.md) - 레벨 시스템

## 9. 연락처

- **GitHub**: https://github.com/okstar486/soyu-learning-diagnosis
- **Issues**: https://github.com/okstar486/soyu-learning-diagnosis/issues

---

**Happy Learning! 🦊**
