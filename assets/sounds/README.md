# 사운드 에셋 폴더

## 필요한 효과음 파일

| 파일명 | 용도 | 권장 형식 |
|--------|------|----------|
| `correct.mp3` | 정답 시 재생 | MP3/OGG |
| `incorrect.mp3` | 오답 시 재생 | MP3/OGG |
| `levelup.mp3` | 레벨업 시 재생 | MP3/OGG |
| `click.mp3` | 버튼 클릭 시 | MP3/OGG |
| `complete.mp3` | 영역 완료 시 | MP3/OGG |

## 무료 효과음 소스
- [Freesound](https://freesound.org/) - CC0/CC-BY 라이선스
- [Mixkit](https://mixkit.co/free-sound-effects/) - 무료 효과음
- [Pixabay](https://pixabay.com/sound-effects/) - 무료 효과음

## 효과음 가이드라인
- 파일 크기: 각 100KB 미만 권장
- 길이: 1-3초 권장
- 톤: 밝고 긍정적인 사운드
- 볼륨: 일관된 볼륨 레벨 유지

## 구현 참고
효과음은 `js/sound.js`의 `Sound.play()` 함수에서 재생됩니다.
파일이 없어도 앱은 정상 동작합니다 (Web Audio API로 합성 효과음 생성).

## Web Audio API 합성 효과음
실제 MP3 파일이 없는 경우, `js/sound.js`가 자동으로 Web Audio API를 사용하여 합성 효과음을 생성합니다:

- **correct**: 상승하는 밝은 톤 (C5 → G5)
- **incorrect**: 짧은 낮은 톤 (G3 → C3)
- **levelup**: 상승 아르페지오 (C-E-G-C)
- **click**: 짧은 틱 소리 (A5)
- **complete**: 밝은 화음 (C-E-G)

실제 MP3 파일을 추가하면 자동으로 우선 사용됩니다.

## 효과음 설정
- 음소거 버튼: 헤더 오른쪽 상단
- 볼륨 및 음소거 상태는 localStorage에 자동 저장
- 기본 볼륨: 70%
