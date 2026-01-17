/**
 * 소유 학습 진단 앱 - Recommendation Module
 * 영역별 개인화된 학습 추천 시스템
 */

const Recommendation = {
  /**
   * 영역별 추천 활동 데이터
   */
  activities: {
    vocabulary: {
      name: '어휘력',
      icon: '📚',
      weak: [
        {
          title: '오늘의 단어장',
          desc: '매일 3개씩 새로운 단어 익히기',
          type: 'daily',
          duration: '10분'
        },
        {
          title: '귀멸 소설 한 장 읽기',
          desc: '관심 있는 내용으로 즐겁게 읽기',
          type: 'practice',
          duration: '15분'
        },
        {
          title: '단어 카드 게임',
          desc: '플래시카드 앱으로 단어 맞추기',
          type: 'game',
          duration: '10분'
        }
      ],
      strong: [
        {
          title: '어려운 책 도전',
          desc: '조금 더 어려운 책 읽어보기',
          type: 'challenge',
          duration: '20분'
        },
        {
          title: '단어 일기 쓰기',
          desc: '오늘 배운 단어로 문장 만들기',
          type: 'creative',
          duration: '15분'
        }
      ]
    },
    'self-efficacy': {
      name: '자기효능감',
      icon: '💪',
      weak: [
        {
          title: '작은 성공 일기',
          desc: '오늘 잘한 일 3가지 적기',
          type: 'daily',
          duration: '5분'
        },
        {
          title: '"할 수 있어!" 주문',
          desc: '매일 아침 거울 보며 긍정 말하기',
          type: 'routine',
          duration: '3분'
        },
        {
          title: '쉬운 문제부터 시작',
          desc: '쉬운 문제로 자신감 쌓기',
          type: 'practice',
          duration: '10분'
        }
      ],
      strong: [
        {
          title: '목표 설정하기',
          desc: '이번 주 도전할 목표 정하기',
          type: 'planning',
          duration: '10분'
        },
        {
          title: '친구 가르치기',
          desc: '내가 잘하는 걸 친구에게 설명하기',
          type: 'teaching',
          duration: '15분'
        }
      ]
    },
    reading: {
      name: '읽기이해',
      icon: '📖',
      weak: [
        {
          title: '엄마와 함께 읽기',
          desc: '부모님과 한 문단씩 번갈아 읽기',
          type: 'daily',
          duration: '15분'
        },
        {
          title: '이야기 요약하기',
          desc: '읽은 내용 3줄로 정리하기',
          type: 'practice',
          duration: '10분'
        },
        {
          title: '그림으로 표현하기',
          desc: '읽은 내용을 그림으로 그리기',
          type: 'creative',
          duration: '15분'
        }
      ],
      strong: [
        {
          title: '긴 글 도전',
          desc: '챕터북이나 긴 이야기 읽기',
          type: 'challenge',
          duration: '30분'
        },
        {
          title: '독서 퀴즈 만들기',
          desc: '읽은 책으로 퀴즈 만들기',
          type: 'creative',
          duration: '20분'
        }
      ]
    },
    motivation: {
      name: '학습 동기',
      icon: '❤️',
      weak: [
        {
          title: '관심사 연결 학습',
          desc: '좋아하는 게임/취미와 연결된 학습',
          type: 'daily',
          duration: '15분'
        },
        {
          title: '보상 시스템 만들기',
          desc: '학습 후 로블록스 시간 등 보상',
          type: 'routine',
          duration: '30분'
        },
        {
          title: '재미있는 학습 앱',
          desc: '게임처럼 재미있는 학습 앱 사용',
          type: 'game',
          duration: '15분'
        }
      ],
      strong: [
        {
          title: '학습 목표 꾸미기',
          desc: '나만의 학습 계획표 만들기',
          type: 'planning',
          duration: '10분'
        },
        {
          title: '성취 뱃지 모으기',
          desc: '학습 성취를 스티커로 기록하기',
          type: 'tracking',
          duration: '5분'
        }
      ]
    },
    grammar: {
      name: '문법',
      icon: '✏️',
      weak: [
        {
          title: '문법 게임 앱',
          desc: '게임으로 재미있게 문법 익히기',
          type: 'game',
          duration: '10분'
        },
        {
          title: '일상 대화 연습',
          desc: '부모님과 바른 표현으로 대화하기',
          type: 'daily',
          duration: '하루종일'
        },
        {
          title: '문장 따라쓰기',
          desc: '좋아하는 문장 예쁘게 쓰기',
          type: 'practice',
          duration: '10분'
        }
      ],
      strong: [
        {
          title: '문법 탐정 놀이',
          desc: '책에서 문법 오류 찾기',
          type: 'challenge',
          duration: '15분'
        },
        {
          title: '나만의 문장 만들기',
          desc: '배운 문법으로 창의적인 문장 쓰기',
          type: 'creative',
          duration: '15분'
        }
      ]
    },
    strength: {
      name: '강점 활용',
      icon: '⭐',
      weak: [
        {
          title: '강점 찾기',
          desc: '내가 잘하는 것 3가지 적어보기',
          type: 'reflection',
          duration: '10분'
        },
        {
          title: '작은 성공 경험',
          desc: '쉬운 것부터 시작해서 성공 느끼기',
          type: 'practice',
          duration: '15분'
        },
        {
          title: '칭찬 받기',
          desc: '잘한 것을 부모님께 보여드리기',
          type: 'social',
          duration: '5분'
        }
      ],
      strong: [
        {
          title: '강점 연결 학습',
          desc: '잘하는 것과 어려운 것 연결하기',
          type: 'strategy',
          duration: '20분'
        },
        {
          title: '다른 친구 돕기',
          desc: '내 강점으로 친구 도와주기',
          type: 'teaching',
          duration: '15분'
        }
      ]
    }
  },

  /**
   * 추천 생성
   * @param {Object} summary - 영역별 결과 요약
   * @param {Object} analysis - 강점/약점 분석
   * @returns {Object} 추천 결과
   */
  generate(summary, analysis) {
    const recommendations = {
      urgent: [],      // 시급한 보강 영역
      maintain: [],    // 유지할 강점 영역
      daily: [],       // 일일 미션
      weekly: []       // 주간 목표
    };

    // 1. 약점 영역 추천 (정답률 50% 미만)
    analysis.weaknesses.forEach(weakness => {
      if (weakness.accuracy < 50) {
        const activities = this.activities[weakness.area];
        if (activities) {
          recommendations.urgent.push({
            area: weakness.area,
            name: activities.name,
            icon: activities.icon,
            accuracy: weakness.accuracy,
            activities: activities.weak.slice(0, 3)
          });
        }
      }
    });

    // 2. 강점 영역 추천 (정답률 70% 이상)
    analysis.strengths.forEach(strength => {
      if (strength.accuracy >= 70) {
        const activities = this.activities[strength.area];
        if (activities) {
          recommendations.maintain.push({
            area: strength.area,
            name: activities.name,
            icon: activities.icon,
            accuracy: strength.accuracy,
            activities: activities.strong.slice(0, 2)
          });
        }
      }
    });

    // 3. 일일 미션 생성
    recommendations.daily = this.generateDailyMissions(summary, analysis);

    // 4. 주간 목표 생성
    recommendations.weekly = this.generateWeeklyGoals(summary, analysis);

    return recommendations;
  },

  /**
   * 일일 미션 생성
   */
  generateDailyMissions(summary, analysis) {
    const missions = [];

    // 가장 약한 영역 1개
    if (analysis.weaknesses.length > 0) {
      const weakest = analysis.weaknesses[0];
      const activities = this.activities[weakest.area];
      if (activities && activities.weak.length > 0) {
        const activity = activities.weak.find(a => a.type === 'daily') || activities.weak[0];
        missions.push({
          title: `${activities.icon} ${activity.title}`,
          desc: activity.desc,
          area: activities.name,
          duration: activity.duration,
          type: 'weak'
        });
      }
    }

    // 가장 강한 영역 1개
    if (analysis.strengths.length > 0) {
      const strongest = analysis.strengths[0];
      const activities = this.activities[strongest.area];
      if (activities && activities.strong.length > 0) {
        missions.push({
          title: `${activities.icon} ${activities.strong[0].title}`,
          desc: activities.strong[0].desc,
          area: activities.name,
          duration: activities.strong[0].duration,
          type: 'strong'
        });
      }
    }

    // 공통 습관
    missions.push({
      title: '🎮 학습 게임 시간',
      desc: '재미있는 학습 게임으로 즐겁게 공부하기',
      area: '전체',
      duration: '15분',
      type: 'routine'
    });

    return missions;
  },

  /**
   * 주간 목표 생성
   */
  generateWeeklyGoals(summary, analysis) {
    const goals = [];

    // 약점 보강 목표
    if (analysis.weaknesses.length > 0) {
      const weakest = analysis.weaknesses[0];
      goals.push({
        title: `${weakest.icon} ${weakest.name} 실력 향상`,
        desc: `이번 주는 ${weakest.name} 영역을 집중적으로 연습해봐요`,
        target: '주 5회, 매일 15분',
        area: weakest.name
      });
    }

    // 읽기 습관
    goals.push({
      title: '📖 매일 독서 시간',
      desc: '좋아하는 책으로 매일 읽기 습관 만들기',
      target: '주 7회, 매일 10분',
      area: '전체'
    });

    // 강점 활용
    if (analysis.strengths.length > 0) {
      const strongest = analysis.strengths[0];
      goals.push({
        title: `⭐ ${strongest.name} 강점 살리기`,
        desc: `잘하는 ${strongest.name}을 다른 학습에도 연결해봐요`,
        target: '주 3회',
        area: strongest.name
      });
    }

    return goals;
  },

  /**
   * 우선순위 결정
   * @param {Object} results - 진단 결과
   * @returns {Array} 우선순위 영역 배열
   */
  prioritize(results) {
    const areas = Object.entries(results)
      .filter(([_, data]) => data.total > 0)
      .map(([area, data]) => ({
        area,
        accuracy: Math.round((data.correct / data.total) * 100),
        total: data.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return areas.slice(0, 3); // 가장 약한 3개 영역
  },

  /**
   * HTML 렌더링
   * @param {Object} recommendations - 추천 결과
   * @returns {string} HTML 문자열
   */
  render(recommendations) {
    let html = '';

    // 1. 시급한 보강 영역
    if (recommendations.urgent.length > 0) {
      html += `
        <div class="recommendation-section urgent-section">
          <h3 class="recommendation-title">
            <span class="title-icon">🚨</span>
            <span>집중 보강이 필요해요</span>
          </h3>
          <div class="recommendation-cards">
            ${recommendations.urgent.map(rec => `
              <div class="recommendation-card urgent-card">
                <div class="card-header">
                  <span class="card-icon">${rec.icon}</span>
                  <span class="card-area">${rec.name}</span>
                  <span class="card-score weak">${rec.accuracy}%</span>
                </div>
                <div class="card-body">
                  <p class="card-message">이 영역이 조금 어려웠어요. 함께 연습해봐요!</p>
                  <ul class="activity-list">
                    ${rec.activities.map(activity => `
                      <li class="activity-item">
                        <div class="activity-header">
                          <span class="activity-title">${this.getActivityIcon(activity.type)} ${activity.title}</span>
                          <span class="activity-duration">${activity.duration}</span>
                        </div>
                        <p class="activity-desc">${activity.desc}</p>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 2. 강점 유지 영역
    if (recommendations.maintain.length > 0) {
      html += `
        <div class="recommendation-section maintain-section">
          <h3 class="recommendation-title">
            <span class="title-icon">⭐</span>
            <span>잘하고 있어요! 계속 발전해봐요</span>
          </h3>
          <div class="recommendation-cards">
            ${recommendations.maintain.map(rec => `
              <div class="recommendation-card maintain-card">
                <div class="card-header">
                  <span class="card-icon">${rec.icon}</span>
                  <span class="card-area">${rec.name}</span>
                  <span class="card-score strong">${rec.accuracy}%</span>
                </div>
                <div class="card-body">
                  <p class="card-message">이 영역은 정말 잘해요! 더 발전시켜봐요!</p>
                  <ul class="activity-list">
                    ${rec.activities.map(activity => `
                      <li class="activity-item">
                        <div class="activity-header">
                          <span class="activity-title">${this.getActivityIcon(activity.type)} ${activity.title}</span>
                          <span class="activity-duration">${activity.duration}</span>
                        </div>
                        <p class="activity-desc">${activity.desc}</p>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 3. 오늘의 미션
    if (recommendations.daily.length > 0) {
      html += `
        <div class="recommendation-section daily-section">
          <h3 class="recommendation-title">
            <span class="title-icon">🎯</span>
            <span>오늘의 수련 미션</span>
          </h3>
          <div class="mission-cards">
            ${recommendations.daily.map((mission, index) => `
              <div class="mission-card ${mission.type}-mission">
                <div class="mission-number">${index + 1}</div>
                <div class="mission-content">
                  <h4 class="mission-title">${mission.title}</h4>
                  <p class="mission-desc">${mission.desc}</p>
                  <div class="mission-meta">
                    <span class="mission-area">${mission.area}</span>
                    <span class="mission-duration">⏱️ ${mission.duration}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 4. 주간 목표
    if (recommendations.weekly.length > 0) {
      html += `
        <div class="recommendation-section weekly-section">
          <h3 class="recommendation-title">
            <span class="title-icon">📅</span>
            <span>이번 주 목표</span>
          </h3>
          <div class="goal-cards">
            ${recommendations.weekly.map(goal => `
              <div class="goal-card">
                <h4 class="goal-title">${goal.title}</h4>
                <p class="goal-desc">${goal.desc}</p>
                <div class="goal-target">
                  <span class="target-icon">🎯</span>
                  <span class="target-text">${goal.target}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 5. 부모님을 위한 팁
    html += `
      <div class="recommendation-section parent-tips-section">
        <h3 class="recommendation-title">
          <span class="title-icon">👨‍👩‍👧</span>
          <span>부모님을 위한 팁</span>
        </h3>
        <div class="tips-content">
          ${this.generateParentTips(recommendations)}
        </div>
      </div>
    `;

    return html;
  },

  /**
   * 활동 타입별 아이콘
   */
  getActivityIcon(type) {
    const icons = {
      daily: '📅',
      practice: '✍️',
      game: '🎮',
      routine: '🔄',
      challenge: '🏆',
      creative: '🎨',
      planning: '📋',
      teaching: '👥',
      tracking: '📊',
      reflection: '🤔',
      social: '💬',
      strategy: '🧠'
    };
    return icons[type] || '📌';
  },

  /**
   * 부모님 팁 생성
   */
  generateParentTips(recommendations) {
    const tips = [
      '<p class="tip-item">💡 <strong>쓰기 최소화</strong>: 손글씨보다 타이핑, 선택형 활동 위주로 진행해주세요.</p>',
      '<p class="tip-item">⏰ <strong>짧은 세션</strong>: 15-30분 단위로 집중, 긴 학습은 피해주세요.</p>',
      '<p class="tip-item">🎮 <strong>게이미피케이션</strong>: 학습을 게임처럼! 보상과 레벨업을 활용해주세요.</p>',
      '<p class="tip-item">❤️ <strong>긍정 강화</strong>: 작은 성공도 크게 칭찬해주세요.</p>'
    ];

    // 약점이 많으면 추가 팁
    if (recommendations.urgent.length >= 2) {
      tips.push('<p class="tip-item">🌱 <strong>인내심</strong>: 천천히, 작은 발전도 소중합니다. 꾸준함이 중요해요.</p>');
    }

    // 강점이 있으면 추가 팁
    if (recommendations.maintain.length > 0) {
      tips.push('<p class="tip-item">⭐ <strong>강점 활용</strong>: 잘하는 영역을 다른 학습과 연결해보세요.</p>');
    }

    return tips.join('');
  },

  /**
   * 추천 스타일 추가
   */
  addStyles() {
    if (document.getElementById('recommendation-styles')) return;

    const style = document.createElement('style');
    style.id = 'recommendation-styles';
    style.textContent = `
      /* 추천 섹션 */
      .recommendation-section {
        margin-bottom: var(--spacing-2xl);
      }

      .recommendation-title {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        color: var(--primary);
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-lg);
        padding-bottom: var(--spacing-sm);
        border-bottom: 2px solid var(--border-color);
      }

      .title-icon {
        font-size: var(--font-size-2xl);
      }

      /* 추천 카드 */
      .recommendation-cards {
        display: grid;
        gap: var(--spacing-lg);
      }

      .recommendation-card {
        background: var(--bg-card);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: var(--spacing-lg);
        transition: all var(--transition-base);
      }

      .recommendation-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px var(--shadow-color);
      }

      .urgent-card {
        border-color: var(--retry);
        background: linear-gradient(135deg, var(--bg-card) 0%, rgba(251, 191, 36, 0.05) 100%);
      }

      .maintain-card {
        border-color: var(--success);
        background: linear-gradient(135deg, var(--bg-card) 0%, rgba(74, 222, 128, 0.05) 100%);
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-md);
        padding-bottom: var(--spacing-sm);
        border-bottom: 1px solid var(--border-light);
      }

      .card-icon {
        font-size: var(--font-size-2xl);
      }

      .card-area {
        flex: 1;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-lg);
      }

      .card-score {
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-lg);
        padding: var(--spacing-xs) var(--spacing-md);
        border-radius: var(--radius-full);
      }

      .card-score.weak {
        background: rgba(251, 191, 36, 0.2);
        color: var(--retry);
      }

      .card-score.strong {
        background: rgba(74, 222, 128, 0.2);
        color: var(--success);
      }

      .card-message {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-md);
        font-size: var(--font-size-sm);
      }

      /* 활동 목록 */
      .activity-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .activity-item {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        padding: var(--spacing-md);
      }

      .activity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-xs);
      }

      .activity-title {
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
      }

      .activity-duration {
        font-size: var(--font-size-sm);
        color: var(--text-muted);
        background: var(--bg-main);
        padding: 2px var(--spacing-sm);
        border-radius: var(--radius-md);
      }

      .activity-desc {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        line-height: var(--line-height-relaxed);
      }

      /* 미션 카드 */
      .mission-cards {
        display: grid;
        gap: var(--spacing-md);
      }

      .mission-card {
        display: flex;
        gap: var(--spacing-md);
        background: var(--bg-card);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: var(--spacing-lg);
        transition: all var(--transition-base);
      }

      .mission-card:hover {
        border-color: var(--primary);
        transform: translateX(4px);
      }

      .mission-number {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--gradient-primary);
        color: white;
        border-radius: var(--radius-full);
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-lg);
        flex-shrink: 0;
      }

      .mission-content {
        flex: 1;
      }

      .mission-title {
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-xs);
        color: var(--text-primary);
      }

      .mission-desc {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin-bottom: var(--spacing-sm);
      }

      .mission-meta {
        display: flex;
        gap: var(--spacing-md);
        font-size: var(--font-size-sm);
      }

      .mission-area {
        color: var(--primary);
        font-weight: var(--font-weight-medium);
      }

      .mission-duration {
        color: var(--text-muted);
      }

      /* 목표 카드 */
      .goal-cards {
        display: grid;
        gap: var(--spacing-md);
      }

      .goal-card {
        background: var(--bg-card);
        border: 2px solid var(--primary);
        border-radius: var(--radius-xl);
        padding: var(--spacing-lg);
      }

      .goal-title {
        font-size: var(--font-size-lg);
        color: var(--primary);
        margin-bottom: var(--spacing-sm);
      }

      .goal-desc {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin-bottom: var(--spacing-md);
        line-height: var(--line-height-relaxed);
      }

      .goal-target {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        background: rgba(147, 112, 219, 0.1);
        border-radius: var(--radius-lg);
      }

      .target-icon {
        font-size: var(--font-size-lg);
      }

      .target-text {
        font-weight: var(--font-weight-medium);
        color: var(--primary);
      }

      /* 부모 팁 */
      .parent-tips-section .tips-content {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: var(--spacing-lg);
      }

      .tip-item {
        margin-bottom: var(--spacing-md);
        line-height: var(--line-height-relaxed);
        color: var(--text-secondary);
      }

      .tip-item:last-child {
        margin-bottom: 0;
      }

      .tip-item strong {
        color: var(--primary);
      }

      /* 반응형 */
      @media (min-width: 768px) {
        .recommendation-cards {
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }

        .mission-cards {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// 전역 접근 가능하도록 export
window.Recommendation = Recommendation;
