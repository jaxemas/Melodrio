/**
 * Melodrio - UI Utilities
 * Handles toasts, modals, confetti animations, and loading states.
 */

window.UI = {
  /**
   * Display a floating toast notification.
   * @param {string} message - Message text in Czech
   * @param {'success'|'error'|'info'} [type='info'] - Toast category
   */
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slideInUp`;

    const iconMap = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };
    const icon = iconMap[type] || 'ℹ️';

    toast.innerHTML = `
      <div class="toast-content" style="display: flex; align-items: center; gap: 0.75rem; width: 100%;">
        <span class="toast-icon" style="font-size: 1.25rem; flex-shrink: 0;">${icon}</span>
        <span class="toast-text" style="flex: 1; font-size: 0.95rem; line-height: 1.4; color: #f8fafc;">${message}</span>
        <button class="toast-close-btn" aria-label="Zavřít" style="background: none; border: none; color: #94a3b8; font-size: 1.25rem; cursor: pointer; padding: 0.2rem 0.4rem; line-height: 1; border-radius: 4px; transition: color 0.2s;">&times;</button>
      </div>
    `;

    // Close button click
    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this._dismissToast(toast);
      });
    }

    container.appendChild(toast);

    // Audio feedback
    if (window.Sounds) {
      if (type === 'success') {
        window.Sounds.playSuccess();
      } else if (type === 'error') {
        window.Sounds.playError();
      } else {
        window.Sounds.playNotification();
      }
    }

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      this._dismissToast(toast);
    }, 3000);
  },

  /**
   * Dismiss and animate out a toast element.
   * @private
   */
  _dismissToast(toast) {
    if (!toast || toast.dataset.dismissing) return;
    toast.dataset.dismissing = 'true';
    toast.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-12px) scale(0.95)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  },

  /**
   * Display a modal dialog with header, body, and action buttons.
   * @param {string} title - Modal title
   * @param {string} content - HTML content or text for modal body
   * @param {Array<{text: string, class?: string, onClick?: Function}>} [buttons=[]]
   */
  showModal(title, content, buttons = []) {
    let overlay = document.getElementById('modal-overlay');
    let modal = document.getElementById('modal');
    let header = document.getElementById('modal-header');
    let body = document.getElementById('modal-body');
    let footer = document.getElementById('modal-footer');

    // Create modal elements dynamically if missing
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modal-overlay';
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div id="modal" class="modal">
          <div id="modal-header" class="modal-header"></div>
          <div id="modal-body" class="modal-body"></div>
          <div id="modal-footer" class="modal-footer"></div>
        </div>
      `;
      document.body.appendChild(overlay);
      modal = document.getElementById('modal');
      header = document.getElementById('modal-header');
      body = document.getElementById('modal-body');
      footer = document.getElementById('modal-footer');
    }

    // Header with title and close X
    header.innerHTML = `
      <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: #f8fafc;">${title}</h3>
      <button id="modal-close-x" class="modal-close-btn" aria-label="Zavřít" style="background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; padding: 0.2rem 0.5rem; line-height: 1; border-radius: 6px; transition: color 0.2s;">&times;</button>
    `;

    const closeX = document.getElementById('modal-close-x');
    if (closeX) {
      closeX.onclick = () => this.hideModal();
    }

    // Body content
    body.innerHTML = content;

    // Footer buttons
    footer.innerHTML = '';
    const actionButtons = buttons.length > 0 ? buttons : [
      { text: 'Rozumím', class: 'btn-primary', onClick: () => this.hideModal() }
    ];

    actionButtons.forEach(btn => {
      const buttonEl = document.createElement('button');
      let btnClass = btn.class || '';
      if (!btnClass) {
        if (btn.danger) btnClass = 'btn-danger';
        else if (btn.secondary) btnClass = 'btn-secondary';
        else btnClass = 'btn-primary';
      }
      buttonEl.className = `btn ${btnClass}`;
      buttonEl.textContent = btn.text;
      buttonEl.addEventListener('click', (e) => {
        if (window.Sounds) window.Sounds.playClick();
        const actionFn = btn.onClick || btn.action;
        if (typeof actionFn === 'function') {
          actionFn(e);
        } else {
          this.hideModal();
        }
      });
      footer.appendChild(buttonEl);
    });

    // Close when clicking directly on overlay background
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        this.hideModal();
      }
    };

    // Close on Escape key
    this._keyHandler = (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
      }
    };
    window.addEventListener('keydown', this._keyHandler);

    // Show with scaleIn animation
    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    overlay.style.display = 'flex';
    if (modal) {
      modal.classList.add('animate-scaleIn');
    }

    if (window.Sounds) {
      window.Sounds.playNotification();
    }
  },

  /**
   * Hide the modal dialog.
   */
  hideModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }

    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.remove('animate-scaleIn');
    }

    overlay.classList.remove('active');
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  },

  /**
   * Trigger a festive confetti shower.
   * Spawns 50-80 colorful confetti pieces with randomized movement.
   */
  showConfetti() {
    // Ensure keyframes are defined
    if (!document.getElementById('confetti-keyframes')) {
      const style = document.createElement('style');
      style.id = 'confetti-keyframes';
      style.textContent = `
        @keyframes confettiFall {
          0% {
            transform: translateY(-20px) rotate(0deg) scale(1);
            opacity: 1;
          }
          75% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(105vh) rotate(720deg) scale(0.6);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    let container = document.getElementById('confetti-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'confetti-container';
      container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;overflow:hidden;';
      document.body.appendChild(container);
    } else {
      container.innerHTML = '';
    }

    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#A78BFA', '#60A5FA', '#34D399'];
    const pieceCount = Math.floor(Math.random() * 31) + 55; // 55 to 85 pieces

    for (let i = 0; i < pieceCount; i++) {
      const piece = document.createElement('div');
      const size = Math.floor(Math.random() * 7) + 6; // 6-12px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const startX = Math.random() * 100; // 0 - 100vw
      const duration = (Math.random() * 1.8 + 1.2).toFixed(2); // 1.2s - 3.0s
      const delay = (Math.random() * 0.4).toFixed(2);
      const isCircle = Math.random() > 0.5;

      piece.style.cssText = `
        position: absolute;
        top: -15px;
        left: ${startX}vw;
        width: ${size}px;
        height: ${size * (isCircle ? 1 : 1.6)}px;
        background-color: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        opacity: 0.95;
        box-shadow: 0 0 4px ${color}88;
        animation: confettiFall ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards;
      `;
      container.appendChild(piece);
    }

    // Auto cleanup
    setTimeout(() => {
      if (container && container.parentNode) {
        container.innerHTML = '';
      }
    }, 3500);
  },

  /**
   * Display a full-screen loading spinner.
   * @param {string} [text='Načítání...']
   */
  showLoading(text = 'Načítání...') {
    let loader = document.getElementById('loading-overlay');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'loading-overlay';
      loader.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(8px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.25s ease;
      `;
      loader.innerHTML = `
        <div class="spinner" style="
          width: 48px; height: 48px;
          border: 4px solid rgba(139, 92, 246, 0.2);
          border-top-color: #8B5CF6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        "></div>
        <p id="loading-text" style="
          margin-top: 1rem;
          color: #e2e8f0;
          font-weight: 500;
          font-size: 1rem;
        ">${text}</p>
        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(loader);
    } else {
      const textEl = loader.querySelector('#loading-text');
      if (textEl) textEl.textContent = text;
      loader.style.display = 'flex';
      loader.style.opacity = '1';
    }
  },

  /**
   * Hide the loading spinner overlay.
   */
  hideLoading() {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 250);
    }
  }
};
