/**
 * 소유 학습 진단 앱 - Diagnosis Module
 * 진단 흐름 제어, 영역 관리, 결과 계산
 */

const Diagnosis = {
  // 영역 순서
  areaOrder: ['vocabulary', 'self-efficacy', 'reading', 'motivation', 'grammar', 'strength'],

  // 현재 상태
  currentAreaIndex: 0,
  currentArea: null,
  startTime: null,
  areaStartTime: null,

  // 현재 영역 결과
  currentResults: {
    correct: 0,
    total: 0,
    answers: [],
    difficulties: [],
    scaleScores: [],  // scale 문제 점수 저장
    scaleTotal: 0     // scale 문제 총 점수
  },

  /**
   * 진단 시작
   */
  async start() {
    // 진행 상황 확인
    const progress = Storage.loadProgress();

    if (progress.currentArea && progress.areasCompleted.length < 6) {
      // 이어하기
      const areaIndex = this.areaOrder.indexOf(progress.currentArea);
      if (areaIndex >= 0) {
        this.currentAreaIndex = areaIndex;
      }
    } else {
      // 새로 시작
      this.currentAreaIndex = 0;
      Storage.clear();
      Level.init();
    }

    this.startTime = Date.now();

    // 저장
    Storage.saveProgress({
      startTime: this.startTime,
      currentArea: this.areaOrder[this.currentAreaIndex],
      areasCompleted: []
    });

    // 홈에서 영역 선택 화면으로
    App.navigate('diagnosis');
  },

  /**
   * 특정 영역 시작
   * @param {string} areaId - 영역 ID
   */
  async startArea(areaId) {
    this.currentArea = areaId;
    this.areaStartTime = Date.now();

    // 결과 초기화
    this.currentResults = {
      correct: 0,
      total: 0,
      answers: [],
      difficulties: [],
      scaleScores: [],
      scaleTotal: 0
    };

    // 문제 로드
    const loaded = await Questions.loadArea(areaId);
    if (!loaded) {
      UI.showToast('문제를 불러올 수 없습니다', 'error');
      return false;
    }

    // 진행 상황 저장
    Storage.saveProgress({
      currentArea: areaId,
      questionIndex: 0
    });

    // 캐릭터 영역 시작 대사
    Character.sayAreaStart(areaId);

    return true;
  },

  /**
   * 답변 제출
   * @param {number} answerIndex - 선택한 답 인덱스
   * @returns {Object} 결과
   */
  submitAnswer(answerIndex) {
    const question = Questions.getCurrent();
    if (!question) return null;

    let result;

    // 문제 유형에 따른 처리
    if (question.type === 'scale') {
      result = Questions.handleScaleAnswer(answerIndex);
      // 스케일 문제: 점수 저장 (1-5점)
      this.currentResults.total++;
      this.currentResults.answers.push(answerIndex);
      this.currentResults.scaleScores.push(result.score);
      this.currentResults.scaleTotal += result.score;
    } else {
      result = Questions.checkAnswer(answerIndex);

      this.currentResults.total++;
      this.currentResults.answers.push(answerIndex);
      this.currentResults.difficulties.push(question.difficulty || 3);

      if (result.correct) {
        this.currentResults.correct++;

        // 경험치 추가
        const expResult = Level.handleCorrect(question.difficulty || 3);

        // 레벨업 확인
        if (expResult.levelUp) {
          Level.showLevelUpEffect(expResult.newLevel);
        }

        // 캐릭터 정답 반응
        Character.sayCorrect();
      } else {
        Level.handleIncorrect();

        // 캐릭터 격려
        Character.sayIncorrect();
      }
    }

    // 진행 상황 저장
    Storage.saveProgress({
      questionIndex: Questions.getCurrentNumber()
    });

    return result;
  },

  /**
   * 다음 문제로 이동
   * @returns {Object|null} 다음 문제 또는 null (영역 완료)
   */
  nextQuestion() {
    const next = Questions.getNext();

    if (!next) {
      // 영역 완료
      this.completeArea();
      return null;
    }

    return next;
  },

  /**
   * 영역 완료 처리
   */
  completeArea() {
    const areaTime = Math.round((Date.now() - this.areaStartTime) / 1000);

    // 영역 완료 효과음
    if (window.Sound) {
      Sound.play('complete');
    }

    // 결과 저장
    Storage.saveResult(this.currentArea, {
      ...this.currentResults,
      time: areaTime
    });

    // 영역 완료 경험치
    const expResult = Level.handleAreaComplete();

    // 완료 목록에 추가
    const progress = Storage.loadProgress();
    const completed = [...(progress.areasCompleted || []), this.currentArea];
    Storage.saveProgress({
      areasCompleted: completed,
      currentArea: null
    });

    // 레벨업 확인
    if (expResult.levelUp) {
      Level.showLevelUpEffect(expResult.newLevel);
    }

    // 캐릭터 영역 완료 대사
    Character.sayAreaComplete(this.currentArea);

    // 레벨 배지 업데이트
    Level.updateBadge();

    // 전체 완료 확인
    if (completed.length >= 6) {
      this.completeAll();
    }
  },

  /**
   * 전체 완료 처리
   */
  completeAll() {
    const totalTime = Math.round((Date.now() - this.startTime) / 1000);

    // 전체 완료 경험치
    const expResult = Level.handleAllComplete();

    if (expResult.levelUp) {
      Level.showLevelUpEffect(expResult.newLevel);
    }

    // 캐릭터 종료 대사
    Character.sayEnd();

    // 결과 화면으로 이동
    setTimeout(() => {
      App.navigate('result');
    }, 2000);
  },

  /**
   * 남은 영역 목록
   * @returns {Array} 남은 영역 ID 배열
   */
  getRemainingAreas() {
    const progress = Storage.loadProgress();
    const completed = progress.areasCompleted || [];
    return this.areaOrder.filter(area => !completed.includes(area));
  },

  /**
   * 완료된 영역 목록
   * @returns {Array} 완료된 영역 ID 배열
   */
  getCompletedAreas() {
    const progress = Storage.loadProgress();
    return progress.areasCompleted || [];
  },

  /**
   * 진단 완료 여부
   * @returns {boolean}
   */
  isComplete() {
    return this.getCompletedAreas().length >= 6;
  },

  /**
   * 전체 진행률
   * @returns {number} 0-100
   */
  getOverallProgress() {
    return Math.round((this.getCompletedAreas().length / 6) * 100);
  },

  /**
   * 영역별 결과 요약
   * @returns {Object} 영역별 결과
   */
  getResultsSummary() {
    const results = Storage.loadResults();
    const summary = {};

    // scale 문제만 있는 영역들
    const scaleOnlyAreas = ['self-efficacy', 'motivation', 'strength'];

    this.areaOrder.forEach(area => {
      const areaInfo = Questions.getAreaInfo(area);
      const result = results[area];

      let accuracy = 0;
      if (result) {
        if (scaleOnlyAreas.includes(area)) {
          // scale 영역: 총점 / 최대점수(5점 * 문항수) * 100
          const maxScore = result.total * 5;
          const totalScore = result.scaleTotal || 0;
          accuracy = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        } else {
          // choice 영역: 정답수 / 총문항수 * 100
          accuracy = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
        }
      }

      summary[area] = {
        name: areaInfo?.name || area,
        icon: areaInfo?.icon || '📝',
        completed: !!result,
        correct: result?.correct || 0,
        total: result?.total || 0,
        accuracy: accuracy,
        time: result?.time || 0,
        // scale 영역 추가 정보
        scaleTotal: result?.scaleTotal || 0,
        scaleScores: result?.scaleScores || []
      };
    });

    return summary;
  },

  /**
   * 강점/약점 분석
   * @returns {Object} { strengths, weaknesses }
   */
  analyzeStrengthsWeaknesses() {
    const summary = this.getResultsSummary();
    const areas = Object.entries(summary)
      .filter(([_, data]) => data.completed)
      .map(([area, data]) => ({ area, ...data }))
      .sort((a, b) => b.accuracy - a.accuracy);

    return {
      strengths: areas.slice(0, 2),
      weaknesses: areas.slice(-2).reverse()
    };
  },

  /**
   * 초기화 (새 진단)
   */
  reset() {
    this.currentAreaIndex = 0;
    this.currentArea = null;
    this.startTime = null;
    this.areaStartTime = null;
    this.currentResults = {
      correct: 0,
      total: 0,
      answers: [],
      difficulties: [],
      scaleScores: [],
      scaleTotal: 0
    };
    Questions.reset();
    Storage.clear();
    Level.init();
  }
};

// 전역 접근 가능하도록 export
window.Diagnosis = Diagnosis;
