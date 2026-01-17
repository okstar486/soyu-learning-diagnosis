/**
 * 소유 학습 진단 앱 - UI Module
 * 화면 전환, 모달, 토스트, 공통 UI 컴포넌트
 */

const UI = {
  // 현재 페이지
  currentPage: null,

  // 페이지 캐시
  pageCache: {},

  /**
   * 초기화
   */
  init() {
    this.pageContainer = document.getElementById('page-container');
    this.header = document.getElementById('app-header');
    this.backBtn = document.getElementById('btn-back');
    this.pageTitle = document.getElementById('page-title');
    this.modalContainer = document.getElementById('modal-container');
    this.modalContent = document.getElementById('modal-content');
    this.toastContainer = document.getElementById('toast-container');
    this.progressContainer = document.getElementById('progress-container');

    // 뒤로가기 버튼 이벤트
    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => {
        if (window.App) {
          App.navigateBack();
        }
      });
    }
  },

  /**
   * 페이지 로드
   * @param {string} pageName - 페이지 이름 (확장자 제외)
   * @returns {Promise<string>} HTML 내용
   */
  async loadPage(pageName) {
    // 캐시 확인
    if (this.pageCache[pageName]) {
      return this.pageCache[pageName];
    }

    try {
      const response = await fetch(`pages/${pageName}.html`);
      if (!response.ok) {
        throw new Error(`Page not found: ${pageName}`);
      }
      const html = await response.text();
      this.pageCache[pageName] = html;
      return html;
    } catch (error) {
      console.error('[UI] Load page error:', error);
      return '<div class="error-page"><p>페이지를 불러올 수 없습니다.</p></div>';
    }
  },

  /**
   * 페이지 표시
   * @param {string} pageName - 페이지 이름
   * @param {Object} options - 옵션 { title, showBack, showProgress }
   */
  async showPage(pageName, options = {}) {
    const {
      title = '나비저택 특별 수련',
      showBack = false,
      showProgress = false
    } = options;

    // 페이지 로드
    const html = await this.loadPage(pageName);

    // 페이지 전환 애니메이션
    if (this.pageContainer) {
      this.pageContainer.classList.add('page-exit');

      await this.sleep(150);

      this.pageContainer.innerHTML = html;
      this.pageContainer.classList.remove('page-exit');
      this.pageContainer.classList.add('page-enter');

      await this.sleep(300);
      this.pageContainer.classList.remove('page-enter');
    }

    // 헤더 설정
    this.setTitle(title);
    this.setBackButton(showBack);

    // 진행률 바 설정
    if (showProgress) {
      this.showProgress();
    } else {
      this.hideProgress();
    }

    this.currentPage = pageName;
  },

  /**
   * 페이지 타이틀 설정
   * @param {string} title - 타이틀
   */
  setTitle(title) {
    if (this.pageTitle) {
      this.pageTitle.textContent = title;
    }
    document.title = `${title} - 소유 학습 진단`;
  },

  /**
   * 뒤로가기 버튼 표시/숨김
   * @param {boolean} show - 표시 여부
   */
  setBackButton(show) {
    if (this.backBtn) {
      if (show) {
        this.backBtn.classList.remove('hidden');
      } else {
        this.backBtn.classList.add('hidden');
      }
    }
  },

  /**
   * 모달 표시
   * @param {string} content - HTML 내용
   * @param {Object} options - 옵션
   */
  showModal(content, options = {}) {
    if (!this.modalContainer || !this.modalContent) return;

    this.modalContent.innerHTML = content;
    this.modalContainer.classList.remove('hidden');

    // 오버레이 클릭으로 닫기
    const overlay = this.modalContainer.querySelector('.modal-overlay');
    if (overlay && options.closeOnOverlay !== false) {
      overlay.onclick = () => this.closeModal();
    }

    // ESC 키로 닫기
    document.addEventListener('keydown', this.handleModalEsc);
  },

  /**
   * 모달 닫기
   */
  closeModal() {
    if (this.modalContainer) {
      this.modalContainer.classList.add('hidden');
    }
    document.removeEventListener('keydown', this.handleModalEsc);
  },

  /**
   * ESC 키 핸들러
   */
  handleModalEsc(e) {
    if (e.key === 'Escape') {
      UI.closeModal();
    }
  },

  /**
   * 확인 모달
   * @param {string} message - 메시지
   * @param {Object} options - 옵션 { title, confirmText, cancelText }
   * @returns {Promise<boolean>} 확인 여부
   */
  confirm(message, options = {}) {
    return new Promise((resolve) => {
      const {
        title = '확인',
        confirmText = '확인',
        cancelText = '취소'
      } = options;

      const content = `
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
        </div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-footer" style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
          <button class="btn btn-secondary" id="modal-cancel" style="flex: 1;">${cancelText}</button>
          <button class="btn btn-primary" id="modal-confirm" style="flex: 1;">${confirmText}</button>
        </div>
      `;

      this.showModal(content, { closeOnOverlay: false });

      document.getElementById('modal-cancel').onclick = () => {
        this.closeModal();
        resolve(false);
      };

      document.getElementById('modal-confirm').onclick = () => {
        this.closeModal();
        resolve(true);
      };
    });
  },

  /**
   * 토스트 알림 표시
   * @param {string} message - 메시지
   * @param {string} type - 타입 (success, error, info)
   * @param {number} duration - 표시 시간 (ms)
   */
  showToast(message, type = 'info', duration = 3000) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    this.toastContainer.appendChild(toast);

    // 자동 제거
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  },

  /**
   * 진행률 바 표시
   */
  showProgress() {
    if (this.progressContainer) {
      this.progressContainer.classList.remove('hidden');
    }
  },

  /**
   * 진행률 바 숨기기
   */
  hideProgress() {
    if (this.progressContainer) {
      this.progressContainer.classList.add('hidden');
    }
  },

  /**
   * 진행률 업데이트
   * @param {string} area - 영역 이름
   * @param {number} current - 현재 문제 번호
   * @param {number} total - 총 문제 수
   */
  updateProgress(area, current, total) {
    const areaElement = document.getElementById('progress-area');
    const countElement = document.getElementById('progress-count');
    const fillElement = document.getElementById('progress-fill');

    if (areaElement) areaElement.textContent = area;
    if (countElement) countElement.textContent = `${current} / ${total}`;
    if (fillElement) {
      const percent = (current / total) * 100;
      fillElement.style.width = `${percent}%`;
    }
  },

  /**
   * 로딩 화면 숨기기
   */
  hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const appContainer = document.getElementById('app');

    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }

    if (appContainer) {
      appContainer.classList.remove('hidden');
    }
  },

  /**
   * 로딩 표시 (인라인)
   * @param {HTMLElement} container - 컨테이너 요소
   */
  showInlineLoading(container) {
    if (!container) return;

    const loading = document.createElement('div');
    loading.className = 'inline-loading';
    loading.innerHTML = `
      <div class="loading-icon pulsing">🦊</div>
      <p>로딩 중...</p>
    `;
    container.innerHTML = '';
    container.appendChild(loading);
  },

  /**
   * 선택지 버튼 생성
   * @param {Array} options - 선택지 배열
   * @param {Function} onSelect - 선택 콜백
   * @returns {HTMLElement} 선택지 컨테이너
   */
  createOptions(options, onSelect) {
    const container = document.createElement('div');
    container.className = 'options-container';

    const labels = ['A', 'B', 'C', 'D', 'E'];

    options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-index">${labels[index]}</span>
        <span class="option-text">${option}</span>
      `;
      btn.onclick = () => onSelect(index, btn);
      container.appendChild(btn);
    });

    return container;
  },

  /**
   * 스케일 선택지 생성 (리커트 척도)
   * @param {Array} options - 선택지 배열
   * @param {Function} onSelect - 선택 콜백
   * @returns {HTMLElement} 스케일 컨테이너
   */
  createScale(options, onSelect) {
    const container = document.createElement('div');
    container.className = 'scale-container';
    container.style.cssText = 'display: flex; justify-content: space-between; gap: var(--spacing-sm); margin-top: var(--spacing-lg);';

    options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'scale-option';
      btn.style.cssText = `
        flex: 1;
        padding: var(--spacing-md);
        background: var(--bg-card);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-lg);
        color: var(--text-primary);
        cursor: pointer;
        transition: all var(--transition-base);
        min-height: 60px;
        font-size: var(--font-size-sm);
      `;
      btn.textContent = option;
      btn.onclick = () => {
        container.querySelectorAll('.scale-option').forEach(b => {
          b.style.borderColor = 'var(--border-color)';
          b.style.background = 'var(--bg-card)';
        });
        btn.style.borderColor = 'var(--primary)';
        btn.style.background = 'rgba(147, 112, 219, 0.2)';
        onSelect(index, btn);
      };
      container.appendChild(btn);
    });

    return container;
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
window.UI = UI;
