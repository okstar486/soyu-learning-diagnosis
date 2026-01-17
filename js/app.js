/**
 * 소유 학습 진단 앱 - App Module
 * 앱 초기화, SPA 라우팅, 전역 상태 관리
 */

const App = {
  // 현재 페이지
  currentPage: 'home',

  // 페이지 히스토리
  history: [],

  // 페이지 설정
  pageConfig: {
    home: {
      title: '나비저택 특별 수련',
      showBack: false,
      showProgress: false
    },
    diagnosis: {
      title: '영역 선택',
      showBack: true,
      showProgress: false
    },
    question: {
      title: '수련 중',
      showBack: true,
      showProgress: true
    },
    result: {
      title: '수련 결과',
      showBack: false,
      showProgress: false
    },
    dashboard: {
      title: '부모 대시보드',
      showBack: true,
      showProgress: false
    }
  },

  /**
   * 앱 초기화
   */
  async init() {
    console.log('[App] Initializing...');

    // 모듈 초기화
    UI.init();
    Character.init();
    Level.init();

    // 레벨 배지 업데이트
    Level.updateBadge();

    // URL 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');

    // 로딩 화면 숨기기
    await this.sleep(1000);
    UI.hideLoading();

    // 초기 페이지 설정
    if (action === 'continue' && Storage.hasActiveProgress()) {
      // 이어하기
      this.navigate('diagnosis');
    } else {
      // 홈으로
      this.navigate('home');
    }

    // 캐릭터 표시 및 환영
    Character.show();
    Character.sayWelcome();

    console.log('[App] Initialized');
  },

  /**
   * 페이지 이동
   * @param {string} page - 페이지 이름
   * @param {Object} params - 파라미터
   */
  async navigate(page, params = {}) {
    console.log('[App] Navigate to:', page);

    // 히스토리 추가
    if (this.currentPage && this.currentPage !== page) {
      this.history.push(this.currentPage);
    }

    const config = this.pageConfig[page] || {};

    // 페이지 표시
    await UI.showPage(page, config);

    this.currentPage = page;

    // 페이지별 초기화
    await this.initializePage(page, params);
  },

  /**
   * 뒤로가기
   */
  navigateBack() {
    if (this.history.length > 0) {
      const previousPage = this.history.pop();
      this.navigate(previousPage);
    } else {
      this.navigate('home');
    }
  },

  /**
   * 페이지별 초기화
   * @param {string} page - 페이지 이름
   * @param {Object} params - 파라미터
   */
  async initializePage(page, params) {
    switch (page) {
      case 'home':
        this.initHomePage();
        break;
      case 'diagnosis':
        this.initDiagnosisPage();
        break;
      case 'question':
        this.initQuestionPage(params);
        break;
      case 'result':
        this.initResultPage();
        break;
      case 'dashboard':
        this.initDashboardPage();
        break;
    }
  },

  /**
   * 홈 페이지 초기화
   */
  initHomePage() {
    const startBtn = document.getElementById('btn-start');
    const continueBtn = document.getElementById('btn-continue');
    const dashboardBtn = document.getElementById('btn-dashboard');

    // 진행 중인 진단 확인
    const hasProgress = Storage.hasActiveProgress();

    if (startBtn) {
      startBtn.onclick = () => {
        if (hasProgress) {
          UI.confirm('진행 중인 진단이 있습니다. 새로 시작할까요?', {
            title: '확인',
            confirmText: '새로 시작',
            cancelText: '이어하기'
          }).then(confirmed => {
            if (confirmed) {
              Diagnosis.reset();
            }
            Diagnosis.start();
          });
        } else {
          Diagnosis.start();
        }
      };
    }

    if (continueBtn) {
      if (hasProgress) {
        continueBtn.classList.remove('hidden');
        continueBtn.onclick = () => {
          Diagnosis.start();
        };
      } else {
        continueBtn.classList.add('hidden');
      }
    }

    if (dashboardBtn) {
      dashboardBtn.onclick = () => {
        this.navigate('dashboard');
      };
    }

    // 진행률 표시
    const progressText = document.getElementById('progress-text');
    if (progressText) {
      const progress = Storage.getCompletionRate();
      if (progress > 0) {
        progressText.textContent = `진행률: ${progress}%`;
        progressText.classList.remove('hidden');
      }
    }
  },

  /**
   * 진단 페이지 초기화 (영역 선택)
   */
  initDiagnosisPage() {
    const areaList = document.getElementById('area-list');
    if (!areaList) return;

    const areas = Questions.getAreaList();
    const completed = Diagnosis.getCompletedAreas();

    areaList.innerHTML = '';

    areas.forEach(area => {
      const isCompleted = completed.includes(area.id);
      const card = document.createElement('div');
      card.className = `area-card ${isCompleted ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="area-icon">${area.icon}</div>
        <div class="area-info">
          <h3 class="area-name">${area.name}</h3>
          <p class="area-desc">${area.description}</p>
        </div>
        <div class="area-status">
          ${isCompleted ? '✅' : '→'}
        </div>
      `;

      if (!isCompleted) {
        card.onclick = () => this.startArea(area.id);
      }

      areaList.appendChild(card);
    });

    // 스타일 추가
    this.addAreaCardStyles();
  },

  /**
   * 영역 카드 스타일 추가
   */
  addAreaCardStyles() {
    if (document.getElementById('area-card-styles')) return;

    const style = document.createElement('style');
    style.id = 'area-card-styles';
    style.textContent = `
      .area-card {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        background: var(--bg-card);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-xl);
        cursor: pointer;
        transition: all var(--transition-base);
        margin-bottom: var(--spacing-md);
      }
      .area-card:hover {
        border-color: var(--primary);
        transform: translateX(5px);
      }
      .area-card.completed {
        opacity: 0.6;
        cursor: default;
      }
      .area-card.completed:hover {
        transform: none;
      }
      .area-icon {
        font-size: 40px;
        flex-shrink: 0;
      }
      .area-info {
        flex: 1;
      }
      .area-name {
        font-size: var(--font-size-lg);
        color: var(--primary);
        margin-bottom: var(--spacing-xs);
      }
      .area-desc {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
      }
      .area-status {
        font-size: var(--font-size-xl);
        color: var(--text-muted);
      }
    `;
    document.head.appendChild(style);
  },

  /**
   * 영역 시작
   * @param {string} areaId - 영역 ID
   */
  async startArea(areaId) {
    const started = await Diagnosis.startArea(areaId);
    if (started) {
      this.navigate('question', { area: areaId });
    }
  },

  /**
   * 문제 페이지 초기화
   * @param {Object} params - 파라미터
   */
  initQuestionPage(params) {
    const areaInfo = Questions.getAreaInfo(Diagnosis.currentArea);
    if (areaInfo) {
      UI.setTitle(areaInfo.name);
    }

    this.showQuestion();
  },

  /**
   * 문제 표시
   */
  showQuestion() {
    const question = Questions.getCurrent();
    if (!question) {
      // 영역 완료
      this.navigate('diagnosis');
      return;
    }

    const container = document.getElementById('question-container');
    if (!container) return;

    const areaInfo = Questions.getAreaInfo(Diagnosis.currentArea);

    // 진행률 업데이트
    UI.updateProgress(
      areaInfo?.name || '진단',
      Questions.getCurrentNumber(),
      Questions.getTotalCount()
    );

    // 문제 렌더링
    container.innerHTML = `
      <div class="question-context">
        ${question.context ? `<p class="context-text">${question.context}</p>` : ''}
      </div>
      <div class="question-text">
        <h2>${question.question}</h2>
      </div>
      <div id="options-container"></div>
      <div id="feedback-container" class="feedback-container hidden"></div>
      <div id="next-container" class="next-container hidden">
        <button id="btn-next" class="btn btn-primary btn-block">다음 문제</button>
      </div>
    `;

    // 선택지 생성
    const optionsContainer = document.getElementById('options-container');

    if (question.type === 'scale') {
      const scaleOptions = question.scaleLabels || question.options || ['1', '2', '3', '4', '5'];
      const scale = UI.createScale(scaleOptions, (index) => {
        this.handleAnswer(index, question.type);
      });
      optionsContainer.appendChild(scale);
    } else {
      const options = UI.createOptions(question.options, (index, btn) => {
        this.handleAnswer(index, question.type, btn);
      });
      optionsContainer.appendChild(options);
    }
  },

  /**
   * 답변 처리
   * @param {number} index - 선택 인덱스
   * @param {string} type - 문제 유형
   * @param {HTMLElement} btn - 선택한 버튼
   */
  async handleAnswer(index, type, btn) {
    const result = Diagnosis.submitAnswer(index);
    if (!result) return;

    // 선택지 비활성화
    document.querySelectorAll('.option-btn, .scale-option').forEach(b => {
      b.style.pointerEvents = 'none';
    });

    // 피드백 표시
    const feedbackContainer = document.getElementById('feedback-container');
    const nextContainer = document.getElementById('next-container');

    if (type !== 'scale' && btn) {
      // 정답/오답 표시
      if (result.correct) {
        btn.classList.add('correct');
      } else {
        btn.classList.add('incorrect');
        // 정답 표시
        const options = document.querySelectorAll('.option-btn');
        if (options[result.correctAnswer]) {
          options[result.correctAnswer].classList.add('correct');
        }
      }
    }

    // 피드백 메시지
    if (feedbackContainer && result.feedback) {
      feedbackContainer.innerHTML = `
        <p class="feedback-text">${result.feedback}</p>
        ${result.explanation ? `<p class="explanation-text">${result.explanation}</p>` : ''}
      `;
      feedbackContainer.classList.remove('hidden');
    }

    // 다음 버튼 표시
    await UI.sleep(1500);

    if (nextContainer) {
      nextContainer.classList.remove('hidden');
      document.getElementById('btn-next').onclick = () => {
        const next = Diagnosis.nextQuestion();
        if (next) {
          this.showQuestion();
        } else {
          // 영역 완료
          this.navigate('diagnosis');
        }
      };
    }
  },

  /**
   * 결과 페이지 초기화
   */
  initResultPage() {
    const container = document.getElementById('result-container');
    if (!container) return;

    const level = Level.getCurrentLevel();
    const summary = Diagnosis.getResultsSummary();
    const analysis = Diagnosis.analyzeStrengthsWeaknesses();
    const totalAccuracy = Storage.getTotalAccuracy();

    container.innerHTML = `
      <div class="result-header">
        <div class="result-character">🦊</div>
        <h2 class="result-title">수련 완료!</h2>
        <p class="result-level">${level.name}</p>
        <p class="result-title-badge">${level.title}</p>
      </div>

      <div class="result-stats">
        <div class="stat-card">
          <span class="stat-value">${totalAccuracy}%</span>
          <span class="stat-label">전체 정답률</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${level.level}</span>
          <span class="stat-label">레벨</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${Level.getExp()}</span>
          <span class="stat-label">경험치</span>
        </div>
      </div>

      <div class="result-areas">
        <h3>영역별 결과</h3>
        ${Object.entries(summary).map(([area, data]) => `
          <div class="result-area-row">
            <span class="area-icon">${data.icon}</span>
            <span class="area-name">${data.name}</span>
            <span class="area-score ${data.accuracy >= 70 ? 'good' : data.accuracy >= 50 ? 'ok' : 'low'}">${data.accuracy}%</span>
          </div>
        `).join('')}
      </div>

      <div class="result-analysis">
        <h3>💪 강점</h3>
        <p>${analysis.strengths.map(a => a.name).join(', ') || '아직 분석 중...'}</p>

        <h3>📚 보강 영역</h3>
        <p>${analysis.weaknesses.map(a => a.name).join(', ') || '아직 분석 중...'}</p>
      </div>

      <div class="result-actions">
        <button id="btn-home" class="btn btn-secondary btn-block">홈으로</button>
        <button id="btn-restart" class="btn btn-primary btn-block mt-md">다시 도전하기</button>
      </div>
    `;

    // 스타일 추가
    this.addResultStyles();

    // 이벤트
    document.getElementById('btn-home').onclick = () => this.navigate('home');
    document.getElementById('btn-restart').onclick = () => {
      Diagnosis.reset();
      this.navigate('home');
    };
  },

  /**
   * 결과 페이지 스타일
   */
  addResultStyles() {
    if (document.getElementById('result-styles')) return;

    const style = document.createElement('style');
    style.id = 'result-styles';
    style.textContent = `
      .result-header { text-align: center; margin-bottom: var(--spacing-xl); }
      .result-character { font-size: 80px; }
      .result-title { color: var(--accent); font-size: var(--font-size-2xl); margin-top: var(--spacing-md); }
      .result-level { color: var(--primary); font-size: var(--font-size-xl); margin-top: var(--spacing-sm); }
      .result-title-badge { color: var(--text-secondary); }
      .result-stats { display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-xl); }
      .stat-card { flex: 1; text-align: center; padding: var(--spacing-lg); background: var(--bg-card); border-radius: var(--radius-xl); }
      .stat-value { display: block; font-size: var(--font-size-2xl); font-weight: bold; color: var(--primary); }
      .stat-label { font-size: var(--font-size-sm); color: var(--text-secondary); }
      .result-areas { margin-bottom: var(--spacing-xl); }
      .result-areas h3 { margin-bottom: var(--spacing-md); color: var(--primary); }
      .result-area-row { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--bg-card); border-radius: var(--radius-lg); margin-bottom: var(--spacing-sm); }
      .result-area-row .area-icon { font-size: 24px; }
      .result-area-row .area-name { flex: 1; }
      .result-area-row .area-score { font-weight: bold; }
      .result-area-row .area-score.good { color: var(--success); }
      .result-area-row .area-score.ok { color: var(--retry); }
      .result-area-row .area-score.low { color: var(--error); }
      .result-analysis { margin-bottom: var(--spacing-xl); }
      .result-analysis h3 { margin-bottom: var(--spacing-sm); color: var(--primary); }
      .result-analysis p { margin-bottom: var(--spacing-md); color: var(--text-secondary); }
    `;
    document.head.appendChild(style);
  },

  /**
   * 대시보드 페이지 초기화
   */
  initDashboardPage() {
    if (window.Dashboard) {
      Dashboard.init();
    }
  },

  /**
   * Sleep 유틸리티
   * @param {number} ms - 밀리초
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// DOM 로드 후 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// 전역 접근 가능하도록 export
window.App = App;
