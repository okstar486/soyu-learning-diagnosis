---
name: diagnosis-app
description: 소유 학습 진단 앱 개발 스킬. PWA 구조, 진단 흐름, 레벨 시스템 구현 시 자동 적용.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# 소유 학습 진단 앱 개발

## 프로젝트 컨텍스트
- **대상**: 초6→중1 여아 (소유)
- **핵심 가설**: 학습 자기효능감 붕괴
- **테마**: 귀멸의칼날 + 하루 캐릭터
- **목표**: 학습 역량 진단 및 맞춤형 개입 전략 수립

## 기술 스택
- HTML/CSS/JS (순수, 프레임워크 없음)
- PWA (오프라인 지원, 홈화면 추가)
- Chart.js (대시보드 시각화)
- localStorage (데이터 저장)

## 핵심 파일 참조
- [PLAN.md](../../../PLAN.md): 마스터 플랜
- [ARCHITECTURE.md](../../../ARCHITECTURE.md): 시스템 구조
- [하루캐릭터설정.md](../../../하루캐릭터설정.md): 캐릭터 설정

## 6개 진단 영역
1. 어휘력 (vocabulary)
2. 학습 자기효능감 (self-efficacy)
3. 학습맥락 읽기 이해 (reading)
4. 학습 동기/정서 (motivation)
5. 문법 기초 (grammar)
6. 강점 발견 (strength)

## 개발 원칙
1. **쓰기 최소화**: 선택형/타이핑 중심
2. **관심사 연결**: 귀멸/하루 테마 전면 활용
3. **게이미피케이션**: 7단계 레벨업 (여우의 호흡 형)
4. **마이크로 세션**: 15-30분 단위
5. **실패 없는 설계**: 오답 → "다시 해보자!"
6. **강점 먼저**: 자신감 회복 우선

## 레벨 시스템
| 레벨 | 이름 | 조건 |
|------|------|------|
| 1 | 여우의 호흡 1형 | 시작 |
| 2 | 여우의 호흡 2형 | 1개 영역 완료 |
| 3 | 여우의 호흡 3형 | 2개 영역 완료 |
| 4 | 여우의 호흡 4형 | 3개 영역 완료 |
| 5 | 여우의 호흡 5형 | 4개 영역 완료 |
| 6 | 여우의 호흡 6형 | 5개 영역 완료 |
| 7 | 여우의 호흡 완성 | 전체 완료 |

## PWA 요구사항
- manifest.json: 앱 아이콘, 테마색, 전체화면
- sw.js: 오프라인 캐싱 (HTML, CSS, JS, JSON, 이미지)
- 설치 프롬프트 지원

## 데이터 저장 구조
```javascript
// localStorage keys
soyu_progress: { currentArea, areasCompleted, questionIndex }
soyu_results: { [area]: { correct, total, time } }
soyu_level: { current, exp, name }
```

## 부모 대시보드
- 비밀번호: 7942
- Chart.js 레이더 차트
- 영역별 상세 분석
- JSON 내보내기 기능
