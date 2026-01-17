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
효과음은 `js/ui.js`의 `playSound()` 함수에서 재생됩니다.
파일이 없어도 앱은 정상 동작합니다 (무음 처리).
