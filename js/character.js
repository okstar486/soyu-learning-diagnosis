/**
 * 소유 학습 진단 앱 - Character Module
 * 하루 캐릭터 상태, 대사, 이미지 관리
 */

const Character = {
  // 현재 상태
  state: {
    emotion: 'default',
    isVisible: false,
    isSpeaking: false
  },

  // 대사 데이터 (Fallback - 설정 파일에서 오버라이드 가능)
  dialogues: {
    welcome: [
      "안녕! 나는 하루야. 오늘도 함께 수련하자!",
      "어서 와! 기다리고 있었어!",
      "오늘은 어떤 훈련을 해볼까?",
      "준비됐어? 나비저택 수련 시작이야!",
      "함께라면 무엇이든 할 수 있어!"
    ],

    correct: [
      "잘했어! 역시 너야!",
      "대단해! 하루도 기뻐!",
      "우와, 완벽해!",
      "이 조자면 형을 익힐 수 있어!",
      "역시! 여우의 호흡이 느껴져!",
      "훌륭해! 계속 가자!",
      "멋져! 하루도 배우고 있어!",
      "대박! 이게 바로 너의 실력이야!",
      "짱이야! 다음 문제도 기대돼!",
      "완벽한 수련이야!"
    ],

    incorrect: [
      "다시 해보자! 하루도 기다릴게!",
      "괜찮아, 한 번 더 생각해볼까?",
      "수련은 반복이야. 다시 도전!",
      "아깝다! 조금만 더 생각해보자!",
      "괜찮아, 하루도 처음엔 못했어!",
      "천천히 생각해봐. 할 수 있어!",
      "좋은 시도였어! 다시 한번!",
      "아직 기회가 있어! 다시!",
      "같이 생각해보자!",
      "포기하지 마! 다시 도전이야!"
    ],

    levelUp: {
      1: "시작이 반이야! 첫걸음을 뗐어!",
      2: "축하해! 여우의 호흡 2형 - 월광질주를 익혔어! 이제 시작이야!",
      3: "대단해! 3형 - 여우비 습득! 점점 강해지고 있어!",
      4: "우와! 벌써 4형 - 구미선풍이야! 너 정말 대단해!",
      5: "5형 - 월화연무 달성! 이제 절반을 넘었어! 최고야!",
      6: "6형 - 여우화라니! 하루도 놀랐어! 정말 멋져!",
      7: "여우의 호흡 완성 - 천구여우! 너는 진정한 검사야! 함께해서 행복했어!"
    },

    areaStart: {
      vocabulary: "혈귀의 이름을 외우는 훈련이야! 준비됐어?",
      'self-efficacy': "마음의 힘을 확인하는 시간이야!",
      reading: "지문을 읽고 이해하는 훈련! 집중!",
      motivation: "네 마음을 알아보는 시간이야!",
      grammar: "시노부 선생님의 문법 수업! 잘 들어봐!",
      strength: "너의 특별한 힘을 찾아보자!"
    },

    areaComplete: {
      vocabulary: "어휘 훈련 완료! 혈귀 이름 마스터!",
      'self-efficacy': "마음의 훈련 끝! 네 마음이 보여!",
      reading: "읽기 훈련 성공! 집중력 대단해!",
      motivation: "마음 알기 완료! 너를 더 알게 됐어!",
      grammar: "문법 훈련 끝! 시노부 선생님도 칭찬하실 거야!",
      strength: "강점 발견! 네 특별함을 찾았어!"
    },

    end: [
      "오늘 수련 끝! 정말 잘했어!",
      "고생했어! 내일 또 만나자!",
      "오늘도 즐거웠어! 또 오는 거야?",
      "수련 완료! 너 정말 대단해!",
      "함께해서 즐거웠어! 다음에 또!"
    ]
  },

  // 이미지 경로
  images: {
    default: 'assets/images/haru_main.jpeg',
    happy: 'assets/images/haru_happy.jpeg',
    encourage: 'assets/images/haru_encourage.jpeg',
    focus: 'assets/images/haru_focus.jpeg',
    levelup: 'assets/images/haru_levelup.jpeg',
    complete: 'assets/images/haru_complete.jpeg'
  },

  /**
   * 초기화
   */
  init() {
    this.container = document.getElementById('character-container');
    this.imageElement = document.getElementById('character-image');
    this.dialogueContainer = document.getElementById('character-dialogue');
    this.dialogueText = document.getElementById('dialogue-text');
  },

  /**
   * 캐릭터 표시
   */
  show() {
    if (this.container) {
      this.container.classList.remove('hidden');
      this.state.isVisible = true;
    }
  },

  /**
   * 캐릭터 숨기기
   */
  hide() {
    if (this.container) {
      this.container.classList.add('hidden');
      this.state.isVisible = false;
    }
  },

  /**
   * 감정 설정 및 이미지 변경
   * @param {string} emotion - 감정 상태
   */
  setEmotion(emotion) {
    this.state.emotion = emotion;

    if (this.imageElement) {
      const imagePath = this.images[emotion] || this.images.default;
      this.imageElement.src = imagePath;

      // 감정별 애니메이션 클래스
      this.imageElement.classList.remove('character-happy', 'character-encourage', 'character-bounce');

      switch (emotion) {
        case 'happy':
          this.imageElement.classList.add('character-happy');
          break;
        case 'encourage':
          this.imageElement.classList.add('character-encourage');
          break;
        case 'levelup':
          this.imageElement.classList.add('character-bounce');
          break;
      }
    }
  },

  /**
   * 랜덤 대사 가져오기
   * @param {string} category - 대사 카테고리
   * @returns {string} 대사
   */
  getRandomDialogue(category) {
    const dialogues = this.dialogues[category];
    if (!dialogues) return '';

    if (Array.isArray(dialogues)) {
      return dialogues[Math.floor(Math.random() * dialogues.length)];
    }
    return dialogues;
  },

  /**
   * 대사 말하기 (타이핑 효과)
   * @param {string} text - 대사 텍스트
   * @param {number} duration - 표시 시간 (ms)
   */
  async speak(text, duration = 3000) {
    if (!this.dialogueContainer || !this.dialogueText) return;

    this.state.isSpeaking = true;
    this.dialogueContainer.classList.remove('hidden');
    this.dialogueContainer.classList.add('dialogue-appear');

    // 타이핑 효과
    this.dialogueText.textContent = '';
    for (let i = 0; i < text.length; i++) {
      this.dialogueText.textContent += text[i];
      await this.sleep(30);
    }

    // 일정 시간 후 숨기기
    await this.sleep(duration);
    this.hideDialogue();
  },

  /**
   * 대사 즉시 표시 (타이핑 효과 없이)
   * @param {string} text - 대사 텍스트
   */
  speakInstant(text) {
    if (!this.dialogueContainer || !this.dialogueText) return;

    this.state.isSpeaking = true;
    this.dialogueContainer.classList.remove('hidden');
    this.dialogueText.textContent = text;
  },

  /**
   * 대사 숨기기
   */
  hideDialogue() {
    if (this.dialogueContainer) {
      this.dialogueContainer.classList.add('hidden');
      this.state.isSpeaking = false;
    }
  },

  /**
   * 환영 대사
   */
  sayWelcome() {
    this.show();
    this.setEmotion('happy');
    const text = this.getRandomDialogue('welcome');
    this.speak(text, 4000);
  },

  /**
   * 정답 반응
   */
  sayCorrect() {
    this.setEmotion('happy');
    const text = this.getRandomDialogue('correct');
    this.speak(text, 2500);
  },

  /**
   * 오답 반응 (격려)
   */
  sayIncorrect() {
    this.setEmotion('encourage');
    const text = this.getRandomDialogue('incorrect');
    this.speak(text, 3000);
  },

  /**
   * 레벨업 반응
   * @param {number} level - 레벨
   */
  sayLevelUp(level) {
    this.setEmotion('levelup');
    const text = this.dialogues.levelUp[level] || `레벨 ${level} 달성! 대단해!`;
    this.speak(text, 5000);
  },

  /**
   * 영역 시작 대사
   * @param {string} area - 영역 ID
   */
  sayAreaStart(area) {
    this.setEmotion('focus');
    const text = this.dialogues.areaStart[area] || '새로운 훈련을 시작하자!';
    this.speak(text, 3500);
  },

  /**
   * 영역 완료 대사
   * @param {string} area - 영역 ID
   */
  sayAreaComplete(area) {
    this.setEmotion('happy');
    const text = this.dialogues.areaComplete[area] || '훈련 완료! 잘했어!';
    this.speak(text, 3500);
  },

  /**
   * 종료 대사
   */
  sayEnd() {
    this.setEmotion('complete');
    const text = this.getRandomDialogue('end');
    this.speak(text, 4000);
  },

  /**
   * 커스텀 대사
   * @param {string} text - 대사
   * @param {string} emotion - 감정
   */
  say(text, emotion = 'default') {
    this.setEmotion(emotion);
    this.speak(text);
  },

  /**
   * Sleep 유틸리티
   * @param {number} ms - 밀리초
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// 전역 접근 가능하도록 export
window.Character = Character;
