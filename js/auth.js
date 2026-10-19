/**
 * Melodrio - Authentication Module
 * Handles local user registration, login, session storage, and authentication UI.
 */

window.Auth = {
  STORAGE_KEY: 'melodrio_user',
  selectedAvatar: '🎸',
  currentMode: 'register', // 'register' | 'login'

  /**
   * Check if a user is currently registered and stored in localStorage.
   * @returns {boolean}
   */
  isLoggedIn() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return false;
    try {
      const user = JSON.parse(data);
      return Boolean(user && user.name && user.passwordHash);
    } catch (e) {
      return false;
    }
  },

  /**
   * Retrieve the active user object.
   * @returns {{name: string, avatar: string, passwordHash: string, createdAt: string}|null}
   */
  getUser() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Chyba při načítání uživatele:', e);
      return null;
    }
  },

  /**
   * Check if the currently authenticated user is in God mode (master account).
   * @returns {boolean}
   */
  isGod() {
    const user = this.getUser();
    return Boolean(user && (user.isGod || (user.name && user.name.toLowerCase() === 'god')));
  },

  /**
   * Hash a password using SHA-256 with a salt string.
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'melodrio_salt_2026');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  /**
   * Register a new user profile.
   * @param {string} name
   * @param {string} avatar
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async register(name, avatar, password) {
    const trimmedName = (name || '').trim();

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 20) {
      if (window.UI) {
        window.UI.showToast('Jméno musí mít 2 až 20 znaků.', 'error');
      }
      return false;
    }

    if (!password || password.length < 4) {
      if (window.UI) {
        window.UI.showToast('Heslo musí mít alespoň 4 znaky.', 'error');
      }
      return false;
    }

    if (trimmedName.toLowerCase() === 'god') {
      if (password !== 'godballs') {
        if (window.UI) {
          window.UI.showToast('Účet god vyžaduje heslo "godballs".', 'error');
        }
        return false;
      }
      return this.login('god', 'godballs');
    }

    const passwordHash = await this.hashPassword(password);
    const chosenAvatar = avatar || this.selectedAvatar || '🎸';

    const user = {
      name: trimmedName,
      avatar: chosenAvatar,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));

      // Initialize Progress data if Progress module exists
      if (window.Progress && typeof window.Progress.initUserData === 'function') {
        window.Progress.initUserData();
      } else {
        // Fallback default progression values
        if (!localStorage.getItem('melodrio_xp')) {
          localStorage.setItem('melodrio_xp', '0');
        }
        if (!localStorage.getItem('melodrio_streak')) {
          localStorage.setItem('melodrio_streak', JSON.stringify({ current: 0, lastDate: null, best: 0 }));
        }
        if (!localStorage.getItem('melodrio_completed_lessons')) {
          localStorage.setItem('melodrio_completed_lessons', '[]');
        }
      }

      return true;
    } catch (e) {
      console.error('Chyba při ukládání registrace:', e);
      if (window.UI) {
        window.UI.showToast('Nepodařilo se uložit profil uživatele.', 'error');
      }
      return false;
    }
  },

  /**
   * Authenticate user with name and password.
   * @param {string} name
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async login(name, password) {
    const trimmedName = (name || '').trim();

    // Built-in master God account: god / godballs
    if (trimmedName.toLowerCase() === 'god' && password === 'godballs') {
      const godUser = {
        name: 'God',
        avatar: '👑',
        passwordHash: 'god_master_auth_hash',
        isGod: true,
        createdAt: new Date().toISOString()
      };
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(godUser));
        if (window.Progress && typeof window.Progress.initGodMode === 'function') {
          window.Progress.initGodMode();
        }
      } catch (e) {
        console.error('Chyba při ukládání God profilu:', e);
      }
      if (window.UI) {
        window.UI.showToast('⚡ Vítej v režimu Bůh (God Mode)! Máš plnou administrátorskou kontrolu.', 'success');
      }
      return true;
    }

    const storedUser = this.getUser();

    if (!storedUser) {
      if (window.UI) {
        window.UI.showToast('Žádný profil nenalezen. Nejprve se prosím zaregistruj.', 'error');
      }
      return false;
    }

    if (!trimmedName) {
      if (window.UI) {
        window.UI.showToast('Zadej své uživatelské jméno.', 'error');
      }
      return false;
    }

    if (!password) {
      if (window.UI) {
        window.UI.showToast('Zadej své heslo.', 'error');
      }
      return false;
    }

    if (trimmedName.toLowerCase() !== storedUser.name.toLowerCase()) {
      if (window.UI) {
        window.UI.showToast('Uživatel s tímto jménem nebyl nalezen.', 'error');
      }
      return false;
    }

    const inputHash = await this.hashPassword(password);
    if (inputHash !== storedUser.passwordHash) {
      if (window.UI) {
        window.UI.showToast('Nesprávné heslo. Zkus to znovu.', 'error');
      }
      return false;
    }

    return true;
  },

  /**
   * Log out the user after confirmation and clear local state.
   */
  logout() {
    if (window.UI) {
      window.UI.showModal(
        'Odhlášení z Melodrio',
        `
        <div style="text-align: center; padding: 1rem 0;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🎸👋</div>
          <p style="color: #f1f5f9; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">
            Opravdu se chceš odhlásit?
          </p>
          <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.5;">
            Provedením odhlášení budou smazána lokální data profilu na tomto počítači a aplikace se resetuje.
          </p>
        </div>
        `,
        [
          {
            text: 'Zrušit',
            class: 'btn-secondary',
            onClick: () => window.UI.hideModal()
          },
          {
            text: 'Odhlásit se',
            class: 'btn-danger',
            onClick: () => {
              window.UI.hideModal();
              localStorage.clear();
              window.UI.showToast('Byl jsi úspěšně odhlášen.', 'info');
              setTimeout(() => {
                window.location.hash = '';
                window.location.reload();
              }, 400);
            }
          }
        ]
      );
    } else {
      if (confirm('Opravdu se chceš odhlásit?')) {
        localStorage.clear();
        window.location.hash = '';
        window.location.reload();
      }
    }
  },

  /**
   * Setup authentication screen UI, form elements, mode toggle, and avatar picker.
   */
  setupAuthUI() {
    const loginScreen = document.getElementById('login-screen');
    if (!loginScreen) return;

    const nameInput = document.getElementById('auth-name');
    const passwordInput = document.getElementById('auth-password');
    const avatarSelect = document.getElementById('auth-avatar');
    const avatarGrid = document.getElementById('avatar-picker-grid');
    const avatarGroup = document.getElementById('auth-avatar-group');
    const btnRegister = document.getElementById('btn-register');
    const btnLogin = document.getElementById('btn-login');
    const tabRegister = document.getElementById('tab-register');
    const tabLogin = document.getElementById('tab-login');
    const switchBtn = document.getElementById('auth-switch-btn');
    const switchText = document.getElementById('auth-switch-text');

    const existingUser = this.getUser();
    this.currentMode = existingUser ? 'login' : 'register';

    // 1. Setup avatar selection
    if (avatarGrid) {
      const options = avatarGrid.querySelectorAll('.avatar-option');
      options.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const av = btn.getAttribute('data-avatar');
          if (av) {
            this.selectedAvatar = av;
            if (avatarSelect) avatarSelect.value = av;
            options.forEach(o => o.classList.remove('selected'));
            btn.classList.add('selected');
            if (window.Sounds) window.Sounds.playClick();
          }
        });
      });
    }

    if (avatarSelect) {
      avatarSelect.addEventListener('change', () => {
        const av = avatarSelect.value;
        if (av) {
          this.selectedAvatar = av;
          if (avatarGrid) {
            avatarGrid.querySelectorAll('.avatar-option').forEach(o => {
              if (o.getAttribute('data-avatar') === av) o.classList.add('selected');
              else o.classList.remove('selected');
            });
          }
        }
      });
    }

    // 2. Helper to switch modes
    const updateModeUI = (mode) => {
      this.currentMode = mode;
      if (mode === 'register') {
        if (tabRegister) {
          tabRegister.classList.add('active');
          tabRegister.setAttribute('aria-selected', 'true');
        }
        if (tabLogin) {
          tabLogin.classList.remove('active');
          tabLogin.setAttribute('aria-selected', 'false');
        }
        if (avatarGroup) avatarGroup.style.display = '';
        if (btnRegister) btnRegister.style.display = '';
        if (btnLogin) btnLogin.style.display = 'none';
        if (switchText) switchText.textContent = 'Už máš svůj účet?';
        if (switchBtn) switchBtn.textContent = 'Přihlásit se';
        if (nameInput && !nameInput.value && existingUser) {
          nameInput.value = '';
        }
      } else {
        if (tabLogin) {
          tabLogin.classList.add('active');
          tabLogin.setAttribute('aria-selected', 'true');
        }
        if (tabRegister) {
          tabRegister.classList.remove('active');
          tabRegister.setAttribute('aria-selected', 'false');
        }
        if (avatarGroup) avatarGroup.style.display = 'none';
        if (btnRegister) btnRegister.style.display = 'none';
        if (btnLogin) btnLogin.style.display = '';
        if (switchText) switchText.textContent = 'Nemáš ještě účet?';
        if (switchBtn) switchBtn.textContent = 'Zaregistrovat se';
        if (nameInput && existingUser && !nameInput.value) {
          nameInput.value = existingUser.name;
        }
      }
    };

    if (tabRegister) {
      tabRegister.onclick = (e) => {
        e.preventDefault();
        if (window.Sounds) window.Sounds.playClick();
        updateModeUI('register');
      };
    }

    if (tabLogin) {
      tabLogin.onclick = (e) => {
        e.preventDefault();
        if (window.Sounds) window.Sounds.playClick();
        updateModeUI('login');
      };
    }

    if (switchBtn) {
      switchBtn.onclick = (e) => {
        e.preventDefault();
        if (window.Sounds) window.Sounds.playClick();
        updateModeUI(this.currentMode === 'register' ? 'login' : 'register');
      };
    }

    // Submit handlers
    const handleRegisterSubmit = async () => {
      const name = nameInput ? nameInput.value : '';
      const password = passwordInput ? passwordInput.value : '';
      const avatar = this.selectedAvatar || (avatarSelect ? avatarSelect.value : '🎸');

      const success = await this.register(name, avatar, password);
      if (success) {
        if (window.UI) {
          window.UI.showConfetti();
          window.UI.showToast(`Vítej v Melodrio, ${name}! Tvá cesta začíná. 🎸`, 'success');
        }
        if (window.Sounds) {
          window.Sounds.playSuccess();
        }
        setTimeout(() => {
          if (window.App && typeof window.App.showMainApp === 'function') {
            window.App.showMainApp();
          }
        }, 500);
      }
    };

    const handleLoginSubmit = async () => {
      const name = nameInput ? nameInput.value : '';
      const password = passwordInput ? passwordInput.value : '';

      const success = await this.login(name, password);
      if (success) {
        if (window.UI) {
          window.UI.showConfetti();
          window.UI.showToast(`Vítej zpět, ${name}! Pokračujeme ve cvičení. 🔥`, 'success');
        }
        if (window.Sounds) {
          window.Sounds.playSuccess();
        }
        setTimeout(() => {
          if (window.App && typeof window.App.showMainApp === 'function') {
            window.App.showMainApp();
          }
        }, 500);
      }
    };

    if (btnRegister) {
      btnRegister.onclick = (e) => {
        e.preventDefault();
        handleRegisterSubmit();
      };
    }

    if (btnLogin) {
      btnLogin.onclick = (e) => {
        e.preventDefault();
        handleLoginSubmit();
      };
    }

    const enterHandler = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (this.currentMode === 'register') {
          handleRegisterSubmit();
        } else {
          handleLoginSubmit();
        }
      }
    };

    if (nameInput) nameInput.addEventListener('keydown', enterHandler);
    if (passwordInput) passwordInput.addEventListener('keydown', enterHandler);

    // Inject God mode quick-login button
    let godChip = document.getElementById('auth-god-chip');
    if (!godChip && switchBtn && switchBtn.parentElement) {
      godChip = document.createElement('div');
      godChip.id = 'auth-god-chip';
      godChip.style.textAlign = 'center';
      godChip.style.marginTop = '1rem';
      godChip.innerHTML = `
        <button type="button" class="btn btn-ghost btn-sm" style="
          font-size: 0.75rem;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.1);
          border: 1px dashed rgba(245, 158, 11, 0.4);
          border-radius: 9999px;
          padding: 0.25rem 0.75rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        ">
          <span>⚡</span> Režim Správce (god / godballs)
        </button>
      `;
      godChip.querySelector('button').addEventListener('click', (e) => {
        e.preventDefault();
        updateModeUI('login');
        if (nameInput) nameInput.value = 'god';
        if (passwordInput) passwordInput.value = 'godballs';
        handleLoginSubmit();
      });
      switchBtn.parentElement.parentElement.appendChild(godChip);
    }

    updateModeUI(this.currentMode);
  }
};
