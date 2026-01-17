/**
 * 소유 학습 진단 앱 - Sound Module
 * 효과음 재생 및 관리
 */

const Sound = {
  // 오디오 객체 캐시
  audioCache: {},

  // 볼륨 설정 (0.0 - 1.0)
  volume: 0.7,

  // 음소거 상태
  muted: false,

  // Web Audio API 컨텍스트
  audioContext: null,

  /**
   * 초기화
   */
  init() {
    // 저장된 설정 로드
    const settings = this.loadSettings();
    this.volume = settings.volume;
    this.muted = settings.muted;

    // Web Audio API 초기화 (사용자 인터랙션 후)
    this.initAudioContext();

    // 효과음 미리 로드 (선택적)
    this.preloadSounds();
  },

  /**
   * Audio Context 초기화
   */
  initAudioContext() {
    try {
      // Audio Context 생성 (최신 브라우저)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
    } catch (error) {
      console.warn('[Sound] Web Audio API not supported:', error);
    }
  },

  /**
   * 효과음 미리 로드
   */
  async preloadSounds() {
    const sounds = ['correct', 'incorrect', 'levelup', 'click', 'complete'];

    sounds.forEach(async (soundName) => {
      try {
        const audio = new Audio();
        audio.src = `assets/sounds/${soundName}.mp3`;
        audio.volume = this.volume;
        audio.preload = 'auto';

        // 로드 완료 후 캐시에 저장
        audio.addEventListener('canplaythrough', () => {
          this.audioCache[soundName] = audio;
        }, { once: true });

        // 오류 처리 (파일이 없어도 무시)
        audio.addEventListener('error', () => {
          console.info(`[Sound] ${soundName}.mp3 not found, generating synthetic sound`);
          // 합성 효과음 생성
          this.audioCache[soundName] = this.createSyntheticSound(soundName);
        }, { once: true });

      } catch (error) {
        console.warn(`[Sound] Failed to load ${soundName}:`, error);
      }
    });
  },

  /**
   * Web Audio API로 합성 효과음 생성
   * @param {string} soundName - 효과음 이름
   * @returns {Function} 재생 함수
   */
  createSyntheticSound(soundName) {
    if (!this.audioContext) {
      return () => {}; // Audio API 미지원시 빈 함수 반환
    }

    return () => {
      if (this.muted) return;

      const ctx = this.audioContext;

      // Audio Context resume (브라우저 정책 대응)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // 효과음 타입별 설정
      switch (soundName) {
        case 'correct':
          // 정답: 상승하는 밝은 톤
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          oscillator.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.1); // G5
          gainNode.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.2);
          break;

        case 'incorrect':
          // 오답: 짧은 낮은 톤
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(196.00, ctx.currentTime); // G3
          oscillator.frequency.exponentialRampToValueAtTime(130.81, ctx.currentTime + 0.15); // C3
          gainNode.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.15);
          break;

        case 'levelup':
          // 레벨업: 상승 아르페지오
          const frequencies = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C
          frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
            gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);

            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + i * 0.1 + 0.3);
          });
          return; // 여러 오실레이터 생성하므로 여기서 종료

        case 'click':
          // 클릭: 짧은 틱 소리
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(880.00, ctx.currentTime); // A5
          gainNode.gain.setValueAtTime(this.volume * 0.1, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.05);
          break;

        case 'complete':
          // 완료: 밝은 화음
          const completeFreqs = [523.25, 659.25, 783.99]; // C-E-G
          completeFreqs.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
          });
          return; // 여러 오실레이터 생성하므로 여기서 종료

        default:
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, ctx.currentTime);
          gainNode.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.1);
      }
    };
  },

  /**
   * 효과음 재생
   * @param {string} soundName - 효과음 이름 (correct, incorrect, levelup, click, complete)
   */
  play(soundName) {
    if (this.muted) return;

    // 캐시된 오디오 확인
    if (this.audioCache[soundName]) {
      // HTMLAudioElement인 경우
      if (this.audioCache[soundName] instanceof HTMLAudioElement) {
        const audio = this.audioCache[soundName].cloneNode();
        audio.volume = this.volume;
        audio.play().catch(error => {
          console.debug('[Sound] Play failed:', error);
        });
      }
      // 합성 사운드 함수인 경우
      else if (typeof this.audioCache[soundName] === 'function') {
        this.audioCache[soundName]();
      }
      return;
    }

    // 캐시에 없으면 즉시 합성 사운드 재생
    console.debug(`[Sound] ${soundName} not in cache, creating synthetic sound`);
    const syntheticSound = this.createSyntheticSound(soundName);
    this.audioCache[soundName] = syntheticSound;
    syntheticSound();
  },

  /**
   * 볼륨 설정
   * @param {number} value - 볼륨 (0.0 - 1.0)
   */
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    this.saveSettings();

    // 캐시된 오디오 볼륨 업데이트
    Object.values(this.audioCache).forEach(audio => {
      if (audio instanceof HTMLAudioElement) {
        audio.volume = this.volume;
      }
    });
  },

  /**
   * 음소거 토글
   * @returns {boolean} 새로운 음소거 상태
   */
  toggleMute() {
    this.muted = !this.muted;
    this.saveSettings();
    this.updateMuteButton();
    return this.muted;
  },

  /**
   * 음소거 설정
   * @param {boolean} muted - 음소거 여부
   */
  setMute(muted) {
    this.muted = muted;
    this.saveSettings();
    this.updateMuteButton();
  },

  /**
   * 음소거 버튼 UI 업데이트
   */
  updateMuteButton() {
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) {
      const icon = muteBtn.querySelector('.icon');
      if (icon) {
        icon.textContent = this.muted ? '🔇' : '🔊';
      }
      muteBtn.setAttribute('aria-label', this.muted ? '소리 켜기' : '소리 끄기');
    }
  },

  /**
   * 설정 저장
   */
  saveSettings() {
    try {
      localStorage.setItem('sound_settings', JSON.stringify({
        volume: this.volume,
        muted: this.muted
      }));
    } catch (error) {
      console.warn('[Sound] Failed to save settings:', error);
    }
  },

  /**
   * 설정 불러오기
   * @returns {Object} 설정 객체
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('sound_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('[Sound] Failed to load settings:', error);
    }

    return {
      volume: 0.7,
      muted: false
    };
  }
};

// 전역 접근 가능하도록 export
window.Sound = Sound;
