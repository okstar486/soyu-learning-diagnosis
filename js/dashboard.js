/**
 * 소유 학습 진단 앱 - Dashboard Module
 * 부모용 대시보드, Chart.js 연동, 분석
 */

const Dashboard = {
  // 비밀번호
  password: '7942',

  // 인증 상태
  authenticated: false,

  // Chart.js 인스턴스
  chart: null,

  /**
   * 초기화
   */
  init() {
    const container = document.getElementById('dashboard-container');
    if (!container) return;

    // 인증 확인
    if (!this.authenticated) {
      this.showPasswordForm(container);
    } else {
      this.showDashboard(container);
    }
  },

  /**
   * 비밀번호 입력 폼 표시
   * @param {HTMLElement} container
   */
  showPasswordForm(container) {
    container.innerHTML = `
      <div class="password-form">
        <div class="password-icon">🔒</div>
        <h2>부모 대시보드</h2>
        <p>비밀번호를 입력해주세요</p>
        <input type="password" id="password-input" class="input" placeholder="비밀번호" maxlength="4">
        <button id="btn-submit-password" class="btn btn-primary btn-block mt-md">확인</button>
        <p id="password-error" class="text-error hidden" style="color: var(--error); margin-top: var(--spacing-md);">
          비밀번호가 틀렸습니다
        </p>
      </div>
    `;

    const input = document.getElementById('password-input');
    const btn = document.getElementById('btn-submit-password');
    const error = document.getElementById('password-error');

    const checkPassword = () => {
      if (input.value === this.password) {
        this.authenticated = true;
        this.showDashboard(container);
      } else {
        error.classList.remove('hidden');
        input.value = '';
        input.focus();
      }
    };

    btn.onclick = checkPassword;
    input.onkeypress = (e) => {
      if (e.key === 'Enter') checkPassword();
    };

    input.focus();
  },

  /**
   * 대시보드 표시
   * @param {HTMLElement} container
   */
  showDashboard(container) {
    const results = Storage.loadResults();
    const level = Level.getCurrentLevel();
    const summary = Diagnosis.getResultsSummary();
    const analysis = Diagnosis.analyzeStrengthsWeaknesses();

    container.innerHTML = `
      <div class="dashboard-content">
        <!-- 인쇄 전용 헤더 -->
        <div class="print-only print-header">
          <div class="print-logo">🦊 소유 학습 진단</div>
          <div class="print-title">나비저택 특별 수련 결과</div>
          <div class="print-date">진단일: ${new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}</div>
        </div>

        <!-- 요약 -->
        <section class="dashboard-section">
          <h2>📊 진단 요약</h2>
          <div class="summary-cards">
            <div class="summary-card">
              <span class="summary-value">${level.level}</span>
              <span class="summary-label">레벨</span>
            </div>
            <div class="summary-card">
              <span class="summary-value">${Storage.getTotalAccuracy()}%</span>
              <span class="summary-label">평균 정답률</span>
            </div>
            <div class="summary-card">
              <span class="summary-value">${Storage.getCompletionRate()}%</span>
              <span class="summary-label">완료율</span>
            </div>
          </div>
        </section>

        <!-- 레이더 차트 -->
        <section class="dashboard-section">
          <h2>📈 영역별 성적</h2>
          <div class="chart-container">
            <canvas id="radar-chart"></canvas>
          </div>
        </section>

        <!-- 영역별 상세 -->
        <section class="dashboard-section">
          <h2>📝 영역별 상세</h2>
          <div class="area-details">
            ${Object.entries(summary).map(([area, data]) => `
              <div class="area-detail-card">
                <div class="area-detail-header">
                  <span class="area-icon">${data.icon}</span>
                  <span class="area-name">${data.name}</span>
                  <span class="area-score">${data.accuracy}%</span>
                </div>
                <div class="area-detail-body">
                  <p>정답: ${data.correct} / ${data.total}</p>
                  <p>소요 시간: ${this.formatTime(data.time)}</p>
                </div>
                <div class="area-progress-bar">
                  <div class="area-progress-fill" style="width: ${data.accuracy}%; background: ${data.accuracy >= 70 ? 'var(--success)' : data.accuracy >= 50 ? 'var(--retry)' : 'var(--error)'};"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- 강점/약점 분석 -->
        <section class="dashboard-section">
          <h2>🔍 분석</h2>
          <div class="analysis-cards">
            <div class="analysis-card strengths">
              <h3>💪 강점 영역</h3>
              <ul>
                ${analysis.strengths.map(a => `<li>${a.icon} ${a.name} (${a.accuracy}%)</li>`).join('') || '<li>분석 대기 중...</li>'}
              </ul>
            </div>
            <div class="analysis-card weaknesses">
              <h3>📚 보강 필요 영역</h3>
              <ul>
                ${analysis.weaknesses.map(a => `<li>${a.icon} ${a.name} (${a.accuracy}%)</li>`).join('') || '<li>분석 대기 중...</li>'}
              </ul>
            </div>
          </div>
        </section>

        <!-- 개입 전략 -->
        <section class="dashboard-section">
          <h2>💡 개입 전략 제안</h2>
          <div class="strategy-content">
            ${this.generateStrategy(summary, analysis)}
          </div>
        </section>

        <!-- 학습 추천 -->
        <section class="dashboard-section">
          <h2>🎯 개인화된 학습 추천</h2>
          <div id="recommendations-container" class="recommendations-container">
            ${this.generateRecommendations(summary, analysis)}
          </div>
        </section>

        <!-- 내보내기 -->
        <section class="dashboard-section">
          <h2>📤 데이터 관리</h2>
          <div class="export-section">
            <h3 style="font-size: var(--font-size-md); color: var(--text-secondary); margin-bottom: var(--spacing-md);">인쇄 및 내보내기</h3>
            <div class="export-buttons">
              <button id="btn-print" class="btn btn-accent" style="background: var(--accent); color: #000;">🖨️ 인쇄하기</button>
            </div>
            <h3 style="font-size: var(--font-size-md); color: var(--text-secondary); margin: var(--spacing-lg) 0 var(--spacing-md) 0;">CSV 리포트 내보내기</h3>
            <div class="export-buttons">
              <button id="btn-export-csv-simple" class="btn btn-primary">CSV 간단 요약</button>
              <button id="btn-export-csv-detailed" class="btn btn-primary">CSV 문항별 상세</button>
            </div>
            <h3 style="font-size: var(--font-size-md); color: var(--text-secondary); margin: var(--spacing-lg) 0 var(--spacing-md) 0;">기타</h3>
            <div class="export-buttons">
              <button id="btn-export" class="btn btn-secondary">JSON 내보내기</button>
              <button id="btn-reset" class="btn btn-secondary" style="background: var(--error);">데이터 초기화</button>
            </div>
          </div>
        </section>

        <!-- 인쇄 전용 푸터 -->
        <div class="print-only print-footer">
          <div class="print-footer-character">🦊</div>
          <div class="print-footer-message">"매일 조금씩, 꾸준히 연습하면 누구나 강해질 수 있어!" - 하루</div>
          <div>소유 학습 진단 앱 | 나비저택 특별 수련</div>
        </div>
      </div>
    `;

    // 스타일 추가
    this.addDashboardStyles();

    // 차트 생성
    this.createRadarChart(summary);

    // 이벤트 - 인쇄하기
    document.getElementById('btn-print').onclick = () => {
      this.printReport();
    };

    // 이벤트 - CSV 내보내기
    document.getElementById('btn-export-csv-simple').onclick = () => {
      this.exportCSV();
      UI.showToast('CSV 요약 파일이 다운로드됩니다', 'success');
    };

    document.getElementById('btn-export-csv-detailed').onclick = async () => {
      UI.showToast('CSV 상세 파일을 생성 중입니다...', 'info');
      await this.exportDetailedCSV();
      UI.showToast('CSV 상세 파일이 다운로드됩니다', 'success');
    };

    // 이벤트 - JSON 내보내기
    document.getElementById('btn-export').onclick = () => {
      Storage.downloadJSON();
      UI.showToast('JSON 파일이 다운로드됩니다', 'success');
    };

    // 이벤트 - 데이터 초기화
    document.getElementById('btn-reset').onclick = async () => {
      const confirmed = await UI.confirm('모든 진단 데이터를 삭제할까요? 이 작업은 되돌릴 수 없습니다.', {
        title: '데이터 초기화',
        confirmText: '삭제',
        cancelText: '취소'
      });
      if (confirmed) {
        Storage.clear();
        UI.showToast('데이터가 초기화되었습니다', 'info');
        App.navigate('home');
      }
    };
  },

  /**
   * 레이더 차트 생성
   * @param {Object} summary - 영역별 요약
   */
  createRadarChart(summary) {
    const canvas = document.getElementById('radar-chart');
    if (!canvas) return;

    // Chart.js CDN 로드 확인
    if (typeof Chart === 'undefined') {
      // Chart.js 동적 로드
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => this.renderChart(canvas, summary);
      document.head.appendChild(script);
    } else {
      this.renderChart(canvas, summary);
    }
  },

  /**
   * 차트 렌더링
   */
  renderChart(canvas, summary) {
    const labels = Object.values(summary).map(s => s.name);
    const data = Object.values(summary).map(s => s.accuracy);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: '정답률 (%)',
          data: data,
          backgroundColor: 'rgba(147, 112, 219, 0.2)',
          borderColor: '#9370DB',
          borderWidth: 2,
          pointBackgroundColor: '#9370DB',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#9370DB'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              color: '#a0a0a0'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            angleLines: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            pointLabels: {
              color: '#ffffff',
              font: {
                size: 12
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  },

  /**
   * 개입 전략 생성
   */
  generateStrategy(summary, analysis) {
    const strategies = [];

    // 약점 영역 분석
    analysis.weaknesses.forEach(weakness => {
      switch (weakness.area) {
        case 'vocabulary':
          strategies.push('📚 <strong>어휘력 향상</strong>: 매일 10분 독서 습관 만들기. 귀멸의칼날 소설 활용 추천.');
          break;
        case 'self-efficacy':
          strategies.push('💪 <strong>자기효능감 회복</strong>: 작은 성공 경험 쌓기. 쉬운 문제부터 시작하여 점진적으로 난이도 높이기.');
          break;
        case 'reading':
          strategies.push('📖 <strong>읽기 이해력</strong>: 짧은 글부터 시작. 읽고 나서 "무슨 내용이었어?" 대화하기.');
          break;
        case 'motivation':
          strategies.push('❤️ <strong>학습 동기</strong>: 관심사와 연결된 학습 자료 활용. 로블록스 등 보상과 연결.');
          break;
        case 'grammar':
          strategies.push('✏️ <strong>문법 기초</strong>: 게임 형식의 문법 학습 앱 활용. 일상 대화에서 바른 표현 사용하기.');
          break;
        case 'strength':
          strategies.push('⭐ <strong>강점 활용</strong>: 발견된 강점을 다른 학습에 연결하기.');
          break;
      }
    });

    // 공통 전략
    strategies.push('🎮 <strong>게이미피케이션</strong>: 학습을 게임처럼! 레벨업, 보상 시스템 적극 활용.');
    strategies.push('⏰ <strong>마이크로 세션</strong>: 15-30분 단위로 집중, 긴 학습은 피하기.');
    strategies.push('✍️ <strong>쓰기 최소화</strong>: 타이핑, 선택형 위주로 학습 부담 줄이기.');

    return strategies.map(s => `<p class="strategy-item">${s}</p>`).join('');
  },

  /**
   * 학습 추천 생성
   */
  generateRecommendations(summary, analysis) {
    // Recommendation 모듈이 로드되었는지 확인
    if (typeof Recommendation === 'undefined') {
      return '<p class="text-muted">추천 시스템을 불러올 수 없습니다.</p>';
    }

    // 추천 생성
    const recommendations = Recommendation.generate(summary, analysis);

    // 스타일 추가
    Recommendation.addStyles();

    // HTML 렌더링
    return Recommendation.render(recommendations);
  },

  /**
   * 시간 포맷
   */
  formatTime(seconds) {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  },

  /**
   * CSV 내보내기 (간단 요약)
   */
  exportCSV() {
    const summary = Diagnosis.getResultsSummary();
    const level = Level.getCurrentLevel();
    const timestamp = new Date().toISOString();

    let csv = '\uFEFF'; // UTF-8 BOM for Korean support

    // 헤더 정보
    csv += `소유 학습 진단 결과\n`;
    csv += `내보내기 날짜,${timestamp.split('T')[0]}\n`;
    csv += `내보내기 시간,${timestamp.split('T')[1].split('.')[0]}\n`;
    csv += `현재 레벨,${level.level}\n`;
    csv += `평균 정답률,${Storage.getTotalAccuracy()}%\n`;
    csv += `완료율,${Storage.getCompletionRate()}%\n`;
    csv += `\n`;

    // 영역별 요약
    csv += `영역,정답수,전체문항,정답률,소요시간(초)\n`;

    Object.entries(summary).forEach(([area, data]) => {
      csv += `${data.name},${data.correct},${data.total},${data.accuracy}%,${data.time}\n`;
    });

    this.downloadCSV(csv, 'soyu_진단결과_요약');
  },

  /**
   * CSV 내보내기 (문항별 상세)
   */
  async exportDetailedCSV() {
    const results = Storage.loadResults();
    const timestamp = new Date().toISOString();

    let csv = '\uFEFF'; // UTF-8 BOM

    // 헤더 정보
    csv += `소유 학습 진단 결과 (상세)\n`;
    csv += `내보내기 날짜,${timestamp.split('T')[0]}\n`;
    csv += `내보내기 시간,${timestamp.split('T')[1].split('.')[0]}\n`;
    csv += `\n`;

    // 문항별 상세 헤더
    csv += `영역,문제번호,난이도,정답여부,선택한답,정답,카테고리\n`;

    // 각 영역별 문제 데이터
    for (const [areaId, result] of Object.entries(results)) {
      const areaInfo = Questions.getAreaInfo(areaId);
      const areaName = areaInfo?.name || areaId;

      // 문제 데이터 로드
      await Questions.loadArea(areaId);
      const questions = Questions.currentQuestions;

      // 각 답변 처리
      result.answers.forEach((userAnswer, index) => {
        const question = questions[index];
        if (!question) return;

        const difficulty = question.difficulty || result.difficulties?.[index] || '-';
        const isCorrect = question.type === 'scale' ? 'N/A' : (userAnswer === question.answer ? 'O' : 'X');
        const correctAnswer = question.type === 'scale' ? 'N/A' : question.answer;
        const category = question.category || '-';

        csv += `${areaName},${question.id || index + 1},${difficulty},${isCorrect},${userAnswer},${correctAnswer},${category}\n`;
      });
    }

    this.downloadCSV(csv, 'soyu_진단결과_상세');
  },

  /**
   * CSV 파일 다운로드
   * @param {string} csvData - CSV 데이터
   * @param {string} fileNamePrefix - 파일명 접두사
   */
  downloadCSV(csvData, fileNamePrefix) {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `${fileNamePrefix}_${dateStr}.csv`;

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * 인쇄하기
   * 레이더 차트를 포함한 전체 결과를 인쇄합니다
   */
  printReport() {
    // 인쇄 전 처리
    const originalTitle = document.title;
    document.title = `소유_학습진단결과_${new Date().toLocaleDateString('ko-KR').replace(/\./g, '-')}`;

    // 차트가 렌더링될 시간을 주기 위해 약간의 지연
    setTimeout(() => {
      window.print();

      // 인쇄 후 원래 제목으로 복원
      document.title = originalTitle;
    }, 100);
  },

  /**
   * 대시보드 스타일
   */
  addDashboardStyles() {
    if (document.getElementById('dashboard-styles')) return;

    const style = document.createElement('style');
    style.id = 'dashboard-styles';
    style.textContent = `
      .password-form { text-align: center; padding: var(--spacing-2xl); }
      .password-icon { font-size: 60px; margin-bottom: var(--spacing-lg); }
      .password-form h2 { margin-bottom: var(--spacing-sm); }
      .password-form p { color: var(--text-secondary); margin-bottom: var(--spacing-lg); }

      .dashboard-section { margin-bottom: var(--spacing-2xl); }
      .dashboard-section h2 { color: var(--primary); margin-bottom: var(--spacing-lg); border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-sm); }

      .summary-cards { display: flex; gap: var(--spacing-md); }
      .summary-card { flex: 1; text-align: center; padding: var(--spacing-lg); background: var(--bg-card); border-radius: var(--radius-xl); }
      .summary-value { display: block; font-size: var(--font-size-2xl); font-weight: bold; color: var(--primary); }
      .summary-label { font-size: var(--font-size-sm); color: var(--text-secondary); }

      .chart-container { background: var(--bg-card); padding: var(--spacing-lg); border-radius: var(--radius-xl); max-width: 500px; margin: 0 auto; }

      .area-detail-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: var(--spacing-md); margin-bottom: var(--spacing-md); }
      .area-detail-header { display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-sm); }
      .area-detail-header .area-icon { font-size: 24px; }
      .area-detail-header .area-name { flex: 1; font-weight: bold; }
      .area-detail-header .area-score { font-size: var(--font-size-lg); font-weight: bold; color: var(--primary); }
      .area-detail-body { font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--spacing-sm); }
      .area-progress-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: var(--radius-full); overflow: hidden; }
      .area-progress-fill { height: 100%; border-radius: var(--radius-full); transition: width 0.5s ease; }

      .analysis-cards { display: flex; gap: var(--spacing-md); }
      .analysis-card { flex: 1; background: var(--bg-card); padding: var(--spacing-lg); border-radius: var(--radius-xl); }
      .analysis-card h3 { margin-bottom: var(--spacing-md); }
      .analysis-card ul { list-style: none; }
      .analysis-card li { padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--border-light); }
      .analysis-card li:last-child { border-bottom: none; }

      .strategy-content { background: var(--bg-card); padding: var(--spacing-lg); border-radius: var(--radius-xl); }
      .strategy-item { margin-bottom: var(--spacing-md); line-height: 1.6; }

      .export-section { background: var(--bg-card); padding: var(--spacing-lg); border-radius: var(--radius-xl); }
      .export-buttons { display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-md); }
      .export-buttons .btn { flex: 1; }

      @media (max-width: 768px) {
        .summary-cards, .analysis-cards { flex-direction: column; }
        .export-buttons { flex-direction: column; }
      }
    `;
    document.head.appendChild(style);
  }
};

// 전역 접근 가능하도록 export
window.Dashboard = Dashboard;
