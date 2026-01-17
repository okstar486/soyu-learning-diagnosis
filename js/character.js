/**
 * 소유 학습 진단 앱 - Character Module
 * 하루 캐릭터 상태, 대사, 이미지 관리
 */

const Character = {
  // 현재 상태
  state: {
    emotion: 'default',
    isVisible: false,
    isSpeaking: false,
    isAnimating: false,
    currentAnimation: null
  },

  // 애니메이션 큐
  animationQueue: [],

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
   * @param {boolean} withAnimation - 등장 애니메이션 여부
   */
  show(withAnimation = true) {
    if (this.container) {
      this.container.classList.remove('hidden');
      this.state.isVisible = true;

      if (withAnimation && this.imageElement) {
        this.playAnimation('character-enter');
        // 등장 후 기본 float 애니메이션
        setTimeout(() => {
          this.playAnimation('character-float');
        }, 800);
      }
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
   * @param {boolean} withParticles - 파티클 효과 여부
   */
  setEmotion(emotion, withParticles = false) {
    this.state.emotion = emotion;

    if (this.imageElement) {
      const imagePath = this.images[emotion] || this.images.default;
      this.imageElement.src = imagePath;

      // 모든 애니메이션 클래스 제거
      this.clearAnimations();

      // 감정별 애니메이션 적용
      switch (emotion) {
        case 'happy':
          this.playAnimation('character-happy');
          if (withParticles) {
            this.createSparkParticles();
          }
          break;
        case 'encourage':
          this.playAnimation('character-encourage');
          if (withParticles) {
            this.createHeartParticles();
          }
          break;
        case 'focus':
          this.playAnimation('character-focus');
          break;
        case 'levelup':
          this.playAnimation('character-levelup');
          if (withParticles) {
            this.createFoxfireParticles();
          }
          break;
        case 'complete':
          this.playAnimation('character-complete');
          if (withParticles) {
            this.createPetalParticles();
          }
          break;
        default:
          this.playAnimation('character-float');
      }
    }
  },

  /**
   * 애니메이션 재생
   * @param {string} animationClass - 애니메이션 클래스명
   */
  playAnimation(animationClass) {
    if (!this.imageElement) return;

    this.state.isAnimating = true;
    this.state.currentAnimation = animationClass;
    this.imageElement.classList.add(animationClass);

    // 애니메이션 종료 후 클래스 제거 (infinite 애니메이션 제외)
    if (!['character-float', 'character-focus', 'character-bounce'].includes(animationClass)) {
      const duration = this.getAnimationDuration(animationClass);
      setTimeout(() => {
        this.imageElement.classList.remove(animationClass);
        this.state.isAnimating = false;
        this.state.currentAnimation = null;
      }, duration);
    }
  },

  /**
   * 애니메이션 지속 시간 가져오기
   * @param {string} animationClass - 애니메이션 클래스명
   * @returns {number} 밀리초
   */
  getAnimationDuration(animationClass) {
    const durations = {
      'character-happy': 600,
      'character-encourage': 1000,
      'character-levelup': 1000,
      'character-complete': 1200,
      'character-enter': 800
    };
    return durations[animationClass] || 500;
  },

  /**
   * 모든 애니메이션 클래스 제거
   */
  clearAnimations() {
    if (!this.imageElement) return;

    const animationClasses = [
      'character-happy',
      'character-encourage',
      'character-focus',
      'character-levelup',
      'character-complete',
      'character-bounce',
      'character-float',
      'character-enter'
    ];

    animationClasses.forEach(cls => {
      this.imageElement.classList.remove(cls);
    });

    this.state.isAnimating = false;
    this.state.currentAnimation = null;
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
   * 파티클 생성 (범용)
   * @param {string} type - 파티클 타입
   * @param {number} count - 생성 개수
   */
  createParticles(type, count = 10) {
    if (!this.container) return;

    const rect = this.imageElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = `particle particle-${type}`;

        // 랜덤 위치 및 이동 방향 설정
        const angle = (Math.random() * 360) * Math.PI / 180;
        const distance = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rotate = Math.random() * 360;

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--rotate', `${rotate}deg`);

        // 파티클 타입별 색상
        if (type === 'confetti') {
          const colors = ['#9370DB', '#FFD700', '#E6E6FA', '#4ade80'];
          particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        } else if (type === 'heart') {
          particle.textContent = '💜';
        }

        document.body.appendChild(particle);

        // 애니메이션 종료 후 제거
        const duration = type === 'petal' ? 3000 : type === 'foxfire' ? 2000 : 800;
        setTimeout(() => {
          particle.remove();
        }, duration);
      }, i * 50);
    }
  },

  /**
   * 여우불 파티클 (레벨업)
   */
  createFoxfireParticles() {
    this.createParticles('foxfire', 15);
  },

  /**
   * 꽃잎 파티클 (완료)
   */
  createPetalParticles() {
    this.createParticles('petal', 20);
  },

  /**
   * 스파크 파티클 (정답)
   */
  createSparkParticles() {
    this.createParticles('spark', 8);
  },

  /**
   * 하트 파티클 (격려)
   */
  createHeartParticles() {
    this.createParticles('heart', 5);
  },

  /**
   * 말풍선 타이핑 효과 강화
   * @param {string} text - 대사 텍스트
   * @returns {Promise}
   */
  async typeText(text) {
    if (!this.dialogueText) return;

    this.dialogueText.textContent = '';

    for (let i = 0; i < text.length; i++) {
      this.dialogueText.textContent += text[i];

      // 타이핑 속도: 한글은 느리게, 공백/기호는 빠르게
      const char = text[i];
      const delay = /[\s.,!?~]/.test(char) ? 10 : /[가-힣]/.test(char) ? 40 : 30;

      await this.sleep(delay);
    }
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

    // 향상된 타이핑 효과
    await this.typeText(text);

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
    this.setEmotion('happy', true); // 파티클 효과 활성화
    const text = this.getRandomDialogue('correct');
    this.speak(text, 2500);
  },

  /**
   * 오답 반응 (격려)
   */
  sayIncorrect() {
    this.setEmotion('encourage', true); // 파티클 효과 활성화
    const text = this.getRandomDialogue('incorrect');
    this.speak(text, 3000);
  },

  /**
   * 레벨업 반응
   * @param {number} level - 레벨
   */
  sayLevelUp(level) {
    this.setEmotion('levelup', true); // 파티클 효과 활성화
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
    this.setEmotion('complete', true); // 파티클 효과 활성화
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
  },

  /**
   * 눈 깜빡임 효과 활성화
   */
  enableBlink() {
    if (this.imageElement) {
      this.imageElement.classList.add('character-blink');
    }
  },

  /**
   * 눈 깜빡임 효과 비활성화
   */
  disableBlink() {
    if (this.imageElement) {
      this.imageElement.classList.remove('character-blink');
    }
  },

  /**
   * 귀 흔들림 효과 (일시적)
   * @param {number} duration - 지속 시간 (ms)
   */
  wiggleEars(duration = 2000) {
    if (this.imageElement) {
      this.imageElement.classList.add('character-ear-wiggle');
      setTimeout(() => {
        this.imageElement.classList.remove('character-ear-wiggle');
      }, duration);
    }
  },

  /**
   * 순차적 애니메이션 체인
   * @param {Array} animations - 애니메이션 배열 [{emotion, text, duration, particles}]
   */
  async playAnimationChain(animations) {
    for (const anim of animations) {
      if (anim.emotion) {
        this.setEmotion(anim.emotion, anim.particles || false);
      }
      if (anim.text) {
        await this.speak(anim.text, anim.duration || 3000);
      }
      if (anim.wait) {
        await this.sleep(anim.wait);
      }
    }
  },

  /**
   * 감정 리셋
   */
  resetEmotion() {
    this.clearAnimations();
    this.setEmotion('default');
    this.playAnimation('character-float');
  }
};

// 전역 접근 가능하도록 export
window.Character = Character;
