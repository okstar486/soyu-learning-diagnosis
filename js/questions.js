/**
 * 소유 학습 진단 앱 - Questions Module
 * 문제 로딩, 셔플, 난이도 조절
 */

const Questions = {
  // 영역별 문제 데이터
  areaData: {},

  // 현재 영역 문제
  currentQuestions: [],
  currentIndex: 0,
  currentDifficulty: 3,

  // 연속 정답/오답 카운트
  consecutiveCorrect: 0,
  consecutiveWrong: 0,

  // 영역 정보
  areas: {
    vocabulary: {
      id: 'vocabulary',
      name: '어휘력',
      icon: '📚',
      description: '전과목 학습의 병목인 어휘력 수준을 파악합니다'
    },
    'self-efficacy': {
      id: 'self-efficacy',
      name: '학습 자기효능감',
      icon: '💪',
      description: '학습에 대한 자신감과 믿음 수준을 파악합니다'
    },
    reading: {
      id: 'reading',
      name: '읽기 이해',
      icon: '📖',
      description: '학습 상황에서의 지문 이해력을 파악합니다'
    },
    motivation: {
      id: 'motivation',
      name: '학습 동기/정서',
      icon: '❤️',
      description: '학습 회피 패턴과 동기 유형을 분석합니다'
    },
    grammar: {
      id: 'grammar',
      name: '문법 기초',
      icon: '✏️',
      description: '국어 문법 기초 수준을 점검합니다'
    },
    strength: {
      id: 'strength',
      name: '강점 발견',
      icon: '⭐',
      description: '자신감 회복을 위한 강점을 찾습니다'
    }
  },

  /**
   * 영역 문제 로드
   * @param {string} areaId - 영역 ID
   * @returns {Promise<boolean>} 성공 여부
   */
  async loadArea(areaId) {
    // 캐시 확인
    if (this.areaData[areaId]) {
      this.setupQuestions(areaId);
      return true;
    }

    try {
      const response = await fetch(`data/questions/${areaId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load: ${areaId}`);
      }

      const data = await response.json();
      this.areaData[areaId] = data;
      this.setupQuestions(areaId);
      return true;
    } catch (error) {
      console.error('[Questions] Load error:', error);
      return false;
    }
  },

  /**
   * 문제 설정
   * @param {string} areaId - 영역 ID
   */
  setupQuestions(areaId) {
    const data = this.areaData[areaId];
    if (!data || !data.questions) {
      this.currentQuestions = [];
      return;
    }

    // 문제 복사 및 셔플
    this.currentQuestions = this.shuffle([...data.questions]);
    this.currentIndex = 0;
    this.currentDifficulty = 3;
    this.consecutiveCorrect = 0;
    this.consecutiveWrong = 0;
  },

  /**
   * 배열 셔플 (Fisher-Yates)
   * @param {Array} array - 배열
   * @returns {Array} 셔플된 배열
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  /**
   * 현재 문제 가져오기
   * @returns {Object|null} 문제 데이터
   */
  getCurrent() {
    if (this.currentIndex >= this.currentQuestions.length) {
      return null;
    }
    return this.currentQuestions[this.currentIndex];
  },

  /**
   * 다음 문제로 이동
   * @returns {Object|null} 다음 문제 또는 null (완료)
   */
  getNext() {
    this.currentIndex++;
    return this.getCurrent();
  },

  /**
   * 답변 확인
   * @param {number} answerIndex - 선택한 답 인덱스
   * @returns {Object} { correct, correctAnswer, feedback }
   */
  checkAnswer(answerIndex) {
    const question = this.getCurrent();
    if (!question) return null;

    const correct = answerIndex === question.answer;

    // 연속 정답/오답 업데이트
    if (correct) {
      this.consecutiveCorrect++;
      this.consecutiveWrong = 0;
    } else {
      this.consecutiveWrong++;
      this.consecutiveCorrect = 0;
    }

    // 난이도 조절
    this.adjustDifficulty(correct);

    return {
      correct,
      correctAnswer: question.answer,
      feedback: correct ? question.feedback?.correct : question.feedback?.incorrect,
      explanation: question.explanation
    };
  },

  /**
   * 스케일 문제 답변 처리
   * @param {number} value - 선택한 값 (0-4)
   * @returns {Object} { value, feedback, score }
   */
  handleScaleAnswer(value) {
    const question = this.getCurrent();
    if (!question) return null;

    // 역채점 여부 확인 (positive: false면 역채점)
    const isPositive = question.scoring?.positive !== false;

    // 점수 계산 (weights 사용 또는 기본값)
    const weights = question.scoring?.weights || [1, 2, 3, 4, 5];
    const score = weights[value] || (value + 1);

    // 피드백 카테고리 결정
    let feedbackCategory = 'mid';

    if (isPositive) {
      // 긍정 문항: 높은 값 = high
      if (value <= 1) feedbackCategory = 'low';
      else if (value >= 3) feedbackCategory = 'high';
    } else {
      // 역채점 문항: 높은 값 = low (예: "포기하고 싶어지나요?")
      if (value <= 1) feedbackCategory = 'high';
      else if (value >= 3) feedbackCategory = 'low';
    }

    return {
      value,
      score,
      isPositive,
      feedback: question.feedback?.[feedbackCategory] || '응답해줘서 고마워!'
    };
  },

  /**
   * 난이도 자동 조절
   * @param {boolean} correct - 정답 여부
   */
  adjustDifficulty(correct) {
    // 3연속 정답: 난이도 상승
    if (this.consecutiveCorrect >= 3) {
      this.currentDifficulty = Math.min(this.currentDifficulty + 1, 5);
      this.consecutiveCorrect = 0;
    }

    // 2연속 오답: 난이도 하락
    if (this.consecutiveWrong >= 2) {
      this.currentDifficulty = Math.max(this.currentDifficulty - 1, 1);
      this.consecutiveWrong = 0;
    }
  },

  /**
   * 남은 문제 수
   * @returns {number}
   */
  getRemainingCount() {
    return this.currentQuestions.length - this.currentIndex;
  },

  /**
   * 전체 문제 수
   * @returns {number}
   */
  getTotalCount() {
    return this.currentQuestions.length;
  },

  /**
   * 현재 문제 번호 (1부터 시작)
   * @returns {number}
   */
  getCurrentNumber() {
    return this.currentIndex + 1;
  },

  /**
   * 진행률 (0-100)
   * @returns {number}
   */
  getProgress() {
    if (this.currentQuestions.length === 0) return 0;
    return Math.round((this.currentIndex / this.currentQuestions.length) * 100);
  },

  /**
   * 영역 완료 여부
   * @returns {boolean}
   */
  isAreaComplete() {
    return this.currentIndex >= this.currentQuestions.length;
  },

  /**
   * 영역 정보 가져오기
   * @param {string} areaId - 영역 ID
   * @returns {Object} 영역 정보
   */
  getAreaInfo(areaId) {
    return this.areas[areaId] || null;
  },

  /**
   * 전체 영역 목록
   * @returns {Array} 영역 배열
   */
  getAreaList() {
    return Object.values(this.areas);
  },

  /**
   * 영역 테마 정보 가져오기
   * @param {string} areaId - 영역 ID
   * @returns {Object} 테마 정보
   */
  getAreaTheme(areaId) {
    const data = this.areaData[areaId];
    if (!data) return null;

    return {
      themeStory: data.themeStory,
      startDialogue: data.startDialogue,
      endDialogue: data.endDialogue
    };
  },

  /**
   * 초기화 (새로운 진단 시작)
   */
  reset() {
    this.currentQuestions = [];
    this.currentIndex = 0;
    this.currentDifficulty = 3;
    this.consecutiveCorrect = 0;
    this.consecutiveWrong = 0;
  }
};

// 전역 접근 가능하도록 export
window.Questions = Questions;
