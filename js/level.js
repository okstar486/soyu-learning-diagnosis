/**
 * 소유 학습 진단 앱 - Level Module
 * 경험치, 레벨업, 호흡 형 관리
 */

const Level = {
  // 레벨 정의
  levels: [
    { level: 1, name: '여우의 호흡 1형', formName: '첫걸음', exp: 0, title: '견습 검사', color: '#9e9e9e' },
    { level: 2, name: '여우의 호흡 2형', formName: '월광질주', exp: 100, title: '신입 대원', color: '#cd7f32' },
    { level: 3, name: '여우의 호흡 3형', formName: '여우비', exp: 220, title: '정식 대원', color: '#c0c0c0' },
    { level: 4, name: '여우의 호흡 4형', formName: '구미선풍', exp: 360, title: '숙련 대원', color: '#ffd700' },
    { level: 5, name: '여우의 호흡 5형', formName: '월화연무', exp: 520, title: '선배 대원', color: '#9370db' },
    { level: 6, name: '여우의 호흡 6형', formName: '여우화', exp: 700, title: '주 후보', color: '#ff69b4' },
    { level: 7, name: '여우의 호흡 완성', formName: '천구여우', exp: 900, title: '명예 주', color: '#ffd700' }
  ],

  // 경험치 설정
  expConfig: {
    correct: 10,        // 정답당 경험치
    streak: 5,          // 연속 정답 보너스
    areaComplete: 50,   // 영역 완료 보너스
    allComplete: 100,   // 전체 완료 보너스
    difficultyBonus: [0, 0, 1, 2, 3, 5]  // 난이도별 추가 경험치
  },

  // 현재 상태
  currentStreak: 0,

  /**
   * 초기화
   */
  init() {
    const savedLevel = Storage.loadLevel();
    this.currentData = savedLevel;
  },

  /**
   * 현재 레벨 정보 가져오기
   * @returns {Object} 레벨 정보
   */
  getCurrentLevel() {
    const data = Storage.loadLevel();
    return this.getLevelByExp(data.exp);
  },

  /**
   * 경험치로 레벨 계산
   * @param {number} exp - 경험치
   * @returns {Object} 레벨 정보
   */
  getLevelByExp(exp) {
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (exp >= this.levels[i].exp) {
        return { ...this.levels[i] };
      }
    }
    return { ...this.levels[0] };
  },

  /**
   * 다음 레벨 정보 가져오기
   * @returns {Object|null} 다음 레벨 정보 (최대 레벨이면 null)
   */
  getNextLevel() {
    const current = this.getCurrentLevel();
    if (current.level >= 7) return null;
    return { ...this.levels[current.level] };
  },

  /**
   * 현재 경험치 가져오기
   * @returns {number} 경험치
   */
  getExp() {
    const data = Storage.loadLevel();
    return data.exp;
  },

  /**
   * 레벨업까지 필요한 경험치
   * @returns {number} 필요 경험치 (최대 레벨이면 0)
   */
  getExpToNextLevel() {
    const current = this.getCurrentLevel();
    const next = this.getNextLevel();
    if (!next) return 0;

    const data = Storage.loadLevel();
    return next.exp - data.exp;
  },

  /**
   * 레벨 진행률 (0-100)
   * @returns {number} 진행률
   */
  getLevelProgress() {
    const current = this.getCurrentLevel();
    const next = this.getNextLevel();
    if (!next) return 100;

    const data = Storage.loadLevel();
    const expInLevel = data.exp - current.exp;
    const expNeeded = next.exp - current.exp;

    return Math.min(100, Math.round((expInLevel / expNeeded) * 100));
  },

  /**
   * 경험치 추가
   * @param {number} amount - 추가할 경험치
   * @param {string} reason - 이유 (correct, streak, areaComplete, allComplete)
   * @returns {Object} { totalAdded, levelUp, newLevel }
   */
  addExp(amount, reason = 'correct') {
    const beforeLevel = this.getCurrentLevel();
    const data = Storage.loadLevel();

    data.exp += amount;

    // 레벨업 확인
    const afterLevel = this.getLevelByExp(data.exp);
    const levelUp = afterLevel.level > beforeLevel.level;

    if (levelUp) {
      // 레벨업 히스토리 추가
      if (!data.history) data.history = [];
      data.history.push({
        level: afterLevel.level,
        date: new Date().toISOString()
      });

      // 레벨 정보 업데이트
      data.current = afterLevel.level;
      data.name = afterLevel.name;
      data.formName = afterLevel.formName;
      data.title = afterLevel.title;
    }

    Storage.saveLevel(data);

    return {
      totalAdded: amount,
      levelUp,
      newLevel: levelUp ? afterLevel : null,
      currentExp: data.exp
    };
  },

  /**
   * 정답 처리 (연속 정답 보너스 포함)
   * @param {number} difficulty - 문제 난이도 (1-5)
   * @returns {Object} 경험치 결과
   */
  handleCorrect(difficulty = 3) {
    this.currentStreak++;

    let totalExp = this.expConfig.correct;

    // 난이도 보너스
    totalExp += this.expConfig.difficultyBonus[difficulty] || 0;

    // 연속 정답 보너스 (3연속 이상)
    if (this.currentStreak >= 3) {
      totalExp += this.expConfig.streak;
    }

    return this.addExp(totalExp, 'correct');
  },

  /**
   * 오답 처리 (연속 리셋)
   */
  handleIncorrect() {
    this.currentStreak = 0;
  },

  /**
   * 영역 완료 처리
   * @returns {Object} 경험치 결과
   */
  handleAreaComplete() {
    return this.addExp(this.expConfig.areaComplete, 'areaComplete');
  },

  /**
   * 전체 완료 처리
   * @returns {Object} 경험치 결과
   */
  handleAllComplete() {
    return this.addExp(this.expConfig.allComplete, 'allComplete');
  },

  /**
   * 레벨업 이펙트 표시
   * @param {Object} levelData - 레벨 데이터
   */
  showLevelUpEffect(levelData) {
    const container = document.getElementById('levelup-effect');
    const title = document.getElementById('levelup-title');
    const name = document.getElementById('levelup-name');
    const message = document.getElementById('levelup-message');
    const closeBtn = document.getElementById('levelup-close');
    const particles = document.getElementById('levelup-particles');

    if (!container) return;

    // 레벨업 효과음
    if (window.Sound) {
      Sound.play('levelup');
    }

    // 내용 설정
    title.textContent = '레벨 업!';
    name.textContent = levelData.name;
    message.textContent = `${levelData.formName} 습득! ${levelData.title} 달성!`;

    // 파티클 생성
    this.createParticles(particles);

    // 표시
    container.classList.remove('hidden');

    // 캐릭터 레벨업 대사
    if (window.Character) {
      Character.sayLevelUp(levelData.level);
    }

    // 닫기 버튼
    closeBtn.onclick = () => {
      if (window.Sound) {
        Sound.play('click');
      }
      container.classList.add('hidden');
      particles.innerHTML = '';
    };
  },

  /**
   * 파티클 생성
   * @param {HTMLElement} container - 파티클 컨테이너
   */
  createParticles(container) {
    if (!container) return;

    container.innerHTML = '';
    const colors = ['#FFD700', '#9370DB', '#FF69B4', '#4ade80', '#60a5fa'];

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle particle-confetti';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      particle.style.animationDuration = `${2 + Math.random() * 2}s`;
      container.appendChild(particle);
    }
  },

  /**
   * 레벨 배지 UI 업데이트
   */
  updateBadge() {
    const levelText = document.getElementById('level-text');
    if (levelText) {
      const current = this.getCurrentLevel();
      levelText.textContent = `${current.level}형`;
    }
  },

  /**
   * 연속 정답 리셋
   */
  resetStreak() {
    this.currentStreak = 0;
  }
};

// 전역 접근 가능하도록 export
window.Level = Level;
