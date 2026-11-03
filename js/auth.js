/**
 * Melodrio - Authentication Module
 * Handles local user registration, login, session storage, multi-user profiles, and authentication UI.
 */

window.Auth = {
  STORAGE_KEY: 'melodrio_user',
  USERS_DB_KEY: 'melodrio_users_db',
  selectedAvatar: '🎸',
  currentMode: 'register', // 'register' | 'login'

  /**
   * Check if a user is currently registered and active in localStorage.
   * @returns {boolean}
   */
  isLoggedIn() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return false;
    try {
      const user = JSON.parse(data);
      return Boolean(user && user.name && (user.passwordHash || user.isGod));
    } catch (e) {
      return false;
    }
  },

  /**
   * Retrieve the active user object.
   * @returns {{name: string, avatar: string, passwordHash: string, isGod?: boolean, createdAt: string}|null}
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
   * Retrieve the registered users dictionary from localStorage.
   * @returns {Record<string, {user: any, progress: any, volume?: string, soundEnabled?: string, savedAt: string}>}
   */
  getUsersDB() {
    try {
      const raw = localStorage.getItem(this.USERS_DB_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error('Chyba při čtení users DB:', e);
      return {};
    }
  },

  /**
   * Save the active user's progress snapshot into the persistent accounts database.
   */
  saveActiveUserProgress() {
    const user = this.getUser();
    if (!user || !user.name || user.isGod) return;

    try {
      const db = this.getUsersDB();
      const key = user.name.trim().toLowerCase();
      const progressData = window.Progress && typeof window.Progress._getdata === 'function'
        ? window.Progress._getdata()
        : null;

      db[key] = {
        user: user,
        progress: progressData,
        volume: localStorage.getItem('melodrio_volume') || '80',
        soundEnabled: localStorage.getItem('melodrio_sound_enabled') || 'true',
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.warn('Nelze uložit postup uživatele do DB:', e);
    }
  },

  /**
   * Restore a user's progress snapshot from the persistent accounts database.
   * @param {string} userName
   */
  restoreUserProgress(userName) {
    if (!userName) return;
    const key = userName.trim().toLowerCase();
    const db = this.getUsersDB();
    const record = db[key];

    if (record && record.progress && window.Progress) {
      try {
        if (typeof window.Progress._save === 'function') {
          window.Progress._save(record.progress);
        }
        if (record.progress.totalXP !== undefined) {
          localStorage.setItem('melodrio_xp', String(record.progress.totalXP));
        }
        if (record.progress.completedLessons) {
          localStorage.setItem('melodrio_completed_lessons', JSON.stringify(record.progress.completedLessons));
        }
        if (record.progress.streak) {
          localStorage.setItem('melodrio_streak', JSON.stringify(record.progress.streak));
        }
        if (record.volume) {
          localStorage.setItem('melodrio_volume', record.volume);
        }
        if (record.soundEnabled) {
          localStorage.setItem('melodrio_sound_enabled', record.soundEnabled);
        }
      } catch (e) {
        console.warn('Nelze obnovit postup uživatele:', e);
      }
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
   * Hash a password using SHA-256 with salt.
   * Includes synchronous deterministic fallback for environments where crypto.subtle is restricted (file:// etc.).
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hashPassword(password) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'melodrio_salt_2026');
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      } catch (e) {
        console.warn('crypto.subtle selhalo, použití záložního hashe:', e);
      }
    }

    // Fallback deterministic hash
    let hash = 0x811c9dc5;
    const str = password + 'melodrio_salt_2026';
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return 'fallback_' + (hash >>> 0).toString(16);
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

    // Built-in master God account
    if (trimmedName.toLowerCase() === 'god') {
      if (password !== 'godballs') {
        if (window.UI) {
          window.UI.showToast('Účet god vyžaduje heslo "godballs".', 'error');
        }
        return false;
      }
      return this.login('god', 'godballs');
    }

    const key = trimmedName.toLowerCase();
    const db = this.getUsersDB();
    const existing = db[key] && db[key].user;

    // If an account with this name already exists in the accounts database:
    if (existing) {
      const inputHash = await this.hashPassword(password);
      if (inputHash === existing.passwordHash) {
        if (window.UI) {
          window.UI.showToast(`Účet '${trimmedName}' již existuje. Přihlašuji tě... ✨`, 'info');
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
        this.restoreUserProgress(existing.name);
        return true;
      } else {
        if (window.UI) {
          window.UI.showToast(`Uživatel '${trimmedName}' již existuje. Zadej správné heslo pro přihlášení nebo zvol jiné jméno.`, 'error');
        }
        return false;
      }
    }

    // Save previous user's progress before creating new user
    this.saveActiveUserProgress();

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

      // Reset progress for the brand new user
      if (window.Progress && typeof window.Progress.initializeForNewUser === 'function') {
        window.Progress.initializeForNewUser();
      } else {
        localStorage.setItem('melodrio_xp', '0');
        localStorage.setItem('melodrio_streak', JSON.stringify({ current: 0, lastDate: null, best: 0 }));
        localStorage.setItem('melodrio_completed_lessons', '[]');
      }

      // Persist in accounts DB
      this.saveActiveUserProgress();

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
   * Seamlessly logs in existing users, verifies master God account, or auto-registers if new.
   * @param {string} name
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async login(name, password) {
    const trimmedName = (name || '').trim();

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

    // Built-in master God account: god / godballs (case-insensitive)
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

    // Look up user in DB or currently stored session
    const key = trimmedName.toLowerCase();
    const db = this.getUsersDB();
    const storedUser = (db[key] && db[key].user) || this.getUser();

    // If matching user found in database or single stored user matches
    if (storedUser && (storedUser.name.toLowerCase() === key || (!db[key] && storedUser.name.toLowerCase() === key))) {
      const inputHash = await this.hashPassword(password);
      if (inputHash !== storedUser.passwordHash) {
        if (window.UI) {
          window.UI.showToast('Nesprávné heslo. Zkus to znovu.', 'error');
        }
        return false;
      }

      // Valid credentials! Set active user and restore their data
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedUser));
        this.restoreUserProgress(storedUser.name);
      } catch (e) {
        console.error('Chyba při přihlašování uživatele:', e);
      }
      return true;
    }

    // User was not found in DB:
    // If entered password is valid (>= 4 chars), auto-register them seamlessly so they are never blocked!
    if (password.length >= 4) {
      if (window.UI) {
        window.UI.showToast(`Profil '${trimmedName}' nebyl nalezen. Automaticky ti vytváříme nový profil... 🎸`, 'info');
      }
      return await this.register(trimmedName, this.selectedAvatar || '🎸', password);
    } else {
      if (window.UI) {
        window.UI.showToast(`Profil '${trimmedName}' nebyl nalezen. Pro vytvoření nového profilu zadej heslo o min. 4 znacích.`, 'error');
      }
      return false;
    }
  },

  /**
   * Log out the user after confirmation and clear local session state.
   */
  logout() {
    const doLogout = () => {
      this.saveActiveUserProgress();
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem('melodrio_progress');
      localStorage.removeItem('melodrio_xp');
      localStorage.removeItem('melodrio_streak');
      localStorage.removeItem('melodrio_completed_lessons');
      if (window.UI) {
        window.UI.showToast('Byl jsi úspěšně odhlášen.', 'info');
      }
      setTimeout(() => {
        window.location.hash = '';
        window.location.reload();
      }, 350);
    };

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
            Tvůj postup a odznaky budou bezpečně uloženy v tomto prohlížeči. Kdykoliv se můžeš znovu přihlásit pod svým jménem a heslem.
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
              doLogout();
            }
          }
        ]
      );
    } else {
      if (confirm('Opravdu se chceš odhlásit? Tvůj postup zůstane uložen.')) {
        doLogout();
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
            if (window.Sounds && typeof window.Sounds.playClick === 'function') {
              window.Sounds.playClick();
            }
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
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        updateModeUI('register');
      };
    }

    if (tabLogin) {
      tabLogin.onclick = (e) => {
        e.preventDefault();
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        updateModeUI('login');
      };
    }

    if (switchBtn) {
      switchBtn.onclick = (e) => {
        e.preventDefault();
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
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
        if (window.Sounds && typeof window.Sounds.playSuccess === 'function') {
          window.Sounds.playSuccess();
        }
        if (window.App && typeof window.App.showMainApp === 'function') {
          window.App.showMainApp();
        }
      }
    };

    const handleLoginSubmit = async () => {
      const name = nameInput ? nameInput.value : '';
      const password = passwordInput ? passwordInput.value : '';

      const success = await this.login(name, password);
      if (success) {
        if (window.UI) {
          window.UI.showConfetti();
          window.UI.showToast(`Vítej zpět, ${name}! Pokračujeme v kytarové cestě. 🔥`, 'success');
        }
        if (window.Sounds && typeof window.Sounds.playSuccess === 'function') {
          window.Sounds.playSuccess();
        }
        if (window.App && typeof window.App.showMainApp === 'function') {
          window.App.showMainApp();
        }
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

    // Form submit listener to prevent page reloads
    const form = document.getElementById('auth-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        if (this.currentMode === 'register') {
          handleRegisterSubmit();
        } else {
          handleLoginSubmit();
        }
        return false;
      };
    }

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
