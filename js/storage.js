/**
 * 소유 학습 진단 앱 - Storage Module
 * localStorage CRUD 및 JSON 내보내기/가져오기
 */

const Storage = {
  // 저장소 키
  KEYS: {
    PROGRESS: 'soyu_progress',
    RESULTS: 'soyu_results',
    LEVEL: 'soyu_level',
    SETTINGS: 'soyu_settings'
  },

  /**
   * 데이터 저장
   * @param {string} key - 저장소 키
   * @param {any} data - 저장할 데이터
   */
  save(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      return true;
    } catch (error) {
      console.error('[Storage] Save error:', error);
      return false;
    }
  },

  /**
   * 데이터 불러오기
   * @param {string} key - 저장소 키
   * @param {any} defaultValue - 기본값
   * @returns {any} 저장된 데이터 또는 기본값
   */
  load(key, defaultValue = null) {
    try {
      const jsonData = localStorage.getItem(key);
      if (jsonData === null) {
        return defaultValue;
      }
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('[Storage] Load error:', error);
      return defaultValue;
    }
  },

  /**
   * 특정 키 삭제
   * @param {string} key - 저장소 키
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('[Storage] Remove error:', error);
      return false;
    }
  },

  /**
   * 전체 데이터 초기화
   */
  clear() {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('[Storage] Clear error:', error);
      return false;
    }
  },

  /**
   * 진행 상황 저장
   * @param {Object} progress - 진행 상황 데이터
   */
  saveProgress(progress) {
    const data = {
      ...this.loadProgress(),
      ...progress,
      updatedAt: new Date().toISOString()
    };
    return this.save(this.KEYS.PROGRESS, data);
  },

  /**
   * 진행 상황 불러오기
   * @returns {Object} 진행 상황
   */
  loadProgress() {
    return this.load(this.KEYS.PROGRESS, {
      currentArea: null,
      areasCompleted: [],
      questionIndex: 0,
      startTime: null,
      updatedAt: null
    });
  },

  /**
   * 결과 저장
   * @param {string} area - 영역 ID
   * @param {Object} result - 결과 데이터
   */
  saveResult(area, result) {
    const results = this.loadResults();
    results[area] = {
      ...result,
      completedAt: new Date().toISOString()
    };
    return this.save(this.KEYS.RESULTS, results);
  },

  /**
   * 전체 결과 불러오기
   * @returns {Object} 영역별 결과
   */
  loadResults() {
    return this.load(this.KEYS.RESULTS, {});
  },

  /**
   * 특정 영역 결과 불러오기
   * @param {string} area - 영역 ID
   * @returns {Object|null} 영역 결과
   */
  loadAreaResult(area) {
    const results = this.loadResults();
    return results[area] || null;
  },

  /**
   * 레벨 정보 저장
   * @param {Object} levelData - 레벨 데이터
   */
  saveLevel(levelData) {
    return this.save(this.KEYS.LEVEL, {
      ...levelData,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * 레벨 정보 불러오기
   * @returns {Object} 레벨 데이터
   */
  loadLevel() {
    return this.load(this.KEYS.LEVEL, {
      current: 1,
      exp: 0,
      name: '여우의 호흡 1형',
      formName: '첫걸음',
      title: '견습 검사',
      history: [],
      achievements: []
    });
  },

  /**
   * 설정 저장
   * @param {Object} settings - 설정 데이터
   */
  saveSettings(settings) {
    return this.save(this.KEYS.SETTINGS, settings);
  },

  /**
   * 설정 불러오기
   * @returns {Object} 설정 데이터
   */
  loadSettings() {
    return this.load(this.KEYS.SETTINGS, {
      soundEnabled: true,
      animationsEnabled: true
    });
  },

  /**
   * 전체 데이터 JSON 내보내기
   * @returns {string} JSON 문자열
   */
  exportJSON() {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      progress: this.loadProgress(),
      results: this.loadResults(),
      level: this.loadLevel(),
      settings: this.loadSettings()
    };
    return JSON.stringify(data, null, 2);
  },

  /**
   * JSON 데이터 가져오기
   * @param {string} jsonString - JSON 문자열
   * @returns {boolean} 성공 여부
   */
  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      // 버전 확인
      if (!data.version) {
        console.warn('[Storage] Invalid export format');
        return false;
      }

      // 데이터 복원
      if (data.progress) {
        this.save(this.KEYS.PROGRESS, data.progress);
      }
      if (data.results) {
        this.save(this.KEYS.RESULTS, data.results);
      }
      if (data.level) {
        this.save(this.KEYS.LEVEL, data.level);
      }
      if (data.settings) {
        this.save(this.KEYS.SETTINGS, data.settings);
      }

      return true;
    } catch (error) {
      console.error('[Storage] Import error:', error);
      return false;
    }
  },

  /**
   * JSON 파일 다운로드
   */
  downloadJSON() {
    const jsonData = this.exportJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `soyu-diagnosis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * 진행 중인 진단이 있는지 확인
   * @returns {boolean}
   */
  hasActiveProgress() {
    const progress = this.loadProgress();
    return progress.currentArea !== null && progress.areasCompleted.length < 6;
  },

  /**
   * 완료율 계산
   * @returns {number} 0-100
   */
  getCompletionRate() {
    const progress = this.loadProgress();
    return Math.round((progress.areasCompleted.length / 6) * 100);
  },

  /**
   * 전체 정답률 계산
   * @returns {number} 0-100
   */
  getTotalAccuracy() {
    const results = this.loadResults();
    let totalCorrect = 0;
    let totalQuestions = 0;

    Object.values(results).forEach(result => {
      if (result.correct !== undefined && result.total !== undefined) {
        totalCorrect += result.correct;
        totalQuestions += result.total;
      }
    });

    if (totalQuestions === 0) return 0;
    return Math.round((totalCorrect / totalQuestions) * 100);
  }
};

// 전역 접근 가능하도록 export
window.Storage = Storage;
