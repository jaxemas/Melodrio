/**
 * Melodrio - Kytarová škola (Progress Module)
 * Spravuje XP, úrovně, tituly (ranky), odznaky (badges) a denní sérii (streak).
 * Veškerá data jsou perzistována v localStorage pod klíčem 'melodrio_progress'.
 */

const RANKS = [
  { name: 'Nováček', icon: '🏠', stage: 'Garáž', minXP: 0, color: '#94a3b8' },
  { name: 'Začátečník', icon: '🎤', stage: 'Otevřená scéna', minXP: 500, color: '#3B82F6' },
  { name: 'Muzikant', icon: '🍺', stage: 'Hospoda', minXP: 1500, color: '#8B5CF6' },
  { name: 'Hráč', icon: '🎪', stage: 'Klub', minXP: 3000, color: '#F59E0B' },
  { name: 'Umělec', icon: '🎭', stage: 'Koncertní sál', minXP: 5000, color: '#EC4899' },
  { name: 'Mistr', icon: '🏟️', stage: 'Stadion', minXP: 8000, color: '#10B981' },
  { name: 'Bůh kytary', icon: '👑', stage: 'Olymp', minXP: 10000, color: '#F59E0B' }
];

const BADGES = [
  { id: 'first_login', name: 'První kroky', icon: '👣', description: 'Poprvé ses přihlásil do Melodria' },
  { id: 'first_lesson', name: 'Žák', icon: '📖', description: 'Dokončil jsi svou první lekci' },
  { id: 'five_lessons', name: 'Pilný student', icon: '📚', description: 'Dokončil jsi 5 lekcí' },
  { id: 'ten_lessons', name: 'Učeň', icon: '🎓', description: 'Dokončil jsi 10 lekcí' },
  { id: 'all_stage1', name: 'Z garáže ven!', icon: '🏠', description: 'Dokončil jsi všechny lekce v Garáži' },
  { id: 'all_stage2', name: 'Na scéně', icon: '🎤', description: 'Dokončil jsi všechny lekce na Otevřené scéně' },
  { id: 'perfect_quiz', name: 'Bezchybný', icon: '💯', description: 'Dokončil jsi kvíz bez jediné chyby' },
  { id: 'three_perfect', name: 'Trojitá dokonalost', icon: '🏆', description: '3 kvízy v řadě bez chyby' },
  { id: 'streak_3', name: 'Třídenní série', icon: '🔥', description: '3 dny cvičení v řadě' },
  { id: 'streak_7', name: 'Týdenní válec', icon: '🔥', description: '7 dní cvičení v řadě' },
  { id: 'streak_30', name: 'Měsíční mašina', icon: '💪', description: '30 dní cvičení v řadě' },
  { id: 'xp_500', name: 'Půl tisícovky', icon: '⭐', description: 'Nasbíral jsi 500 XP' },
  { id: 'xp_1000', name: 'Tisícovka!', icon: '🌟', description: 'Nasbíral jsi 1000 XP' },
  { id: 'xp_5000', name: 'XP magnát', icon: '💎', description: 'Nasbíral jsi 5000 XP' },
  { id: 'night_owl', name: 'Noční sova', icon: '🦉', description: 'Cvičil jsi po půlnoci' },
  { id: 'early_bird', name: 'Ranní ptáče', icon: '🐦', description: 'Cvičil jsi před 7 ráno' }
];

window.Progress = {
  STORAGE_KEY: 'melodrio_progress',
  RANKS: RANKS,
  BADGES: BADGES,

  _getdata() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        let s = parsed.streak;
        if (typeof s === 'number') s = { current: s, lastDate: null, best: s };
        return {
          totalXP: parsed.totalXP || 0,
          completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
          earnedBadges: Array.isArray(parsed.earnedBadges) ? parsed.earnedBadges : ['first_login'],
          streak: s || { current: 1, lastDate: null, best: 1 },
          perfectQuizzes: parsed.perfectQuizzes || 0,
          perfectStreak: parsed.perfectStreak || 0,
          totalQuizzes: parsed.totalQuizzes || 0,
          totalPracticeTime: parsed.totalPracticeTime || 0,
          joinDate: parsed.joinDate || new Date().toISOString()
        };
      }
    } catch (e) {
      console.error('[Progress] Chyba při načítání dat z localStorage:', e);
    }

    const defaultData = {
      totalXP: 0,
      completedLessons: [],
      earnedBadges: ['first_login'],
      streak: { current: 1, lastDate: null, best: 1 },
      perfectQuizzes: 0,
      perfectStreak: 0,
      totalQuizzes: 0,
      totalPracticeTime: 0,
      joinDate: new Date().toISOString()
    };
    this._save(defaultData);
    return defaultData;
  },

  _save(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('[Progress] Chyba při ukládání dat do localStorage:', e);
    }
  },

  getXP() {
    return this._getdata().totalXP;
  },

  _getRankByXP(xp) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (xp >= RANKS[i].minXP) {
        const nextRank = i < RANKS.length - 1 ? RANKS[i + 1] : null;
        return { ...RANKS[i], nextRank };
      }
    }
    return { ...RANKS[0], nextRank: RANKS[1] };
  },

  isGodMode() {
    return Boolean(window.Auth && typeof window.Auth.isGod === 'function' && window.Auth.isGod());
  },

  getRank() {
    if (this.isGodMode()) {
      return {
        name: 'Bůh kytary',
        icon: '👑',
        stage: 'Olymp',
        minXP: 10000,
        color: '#F59E0B',
        nextRank: null
      };
    }
    return this._getRankByXP(this.getXP());
  },

  getLevel() {
    return Math.min(99, 1 + Math.floor(this.getXP() / 100));
  },

  getLevelProgress() {
    return this.getXP() % 100;
  },

  addXP(amount) {
    if (typeof amount !== 'number' || amount <= 0) return;

    const data = this._getdata();
    const prevXP = data.totalXP;
    const prevLevel = Math.min(99, 1 + Math.floor(prevXP / 100));
    const prevRank = this._getRankByXP(prevXP);

    data.totalXP += amount;
    this._save(data);

    const newLevel = this.getLevel();
    const newRank = this.getRank();

    // Kontrola zvýšení úrovně (Level Up)
    if (newLevel > prevLevel) {
      if (window.Sounds && typeof window.Sounds.playLevelUp === 'function') {
        window.Sounds.playLevelUp();
      }
      if (window.UI && typeof window.UI.showToast === 'function') {
        window.UI.showToast(`Postoupil jsi na úroveň ${newLevel}! 🎉`, 'success');
      }
    }

    // Kontrola postupu na nový rank
    if (newRank.name !== prevRank.name && newRank.minXP > prevRank.minXP) {
      if (window.UI && typeof window.UI.showModal === 'function') {
        window.UI.showModal(
          `Nový titul: ${newRank.name}! ${newRank.icon}`,
          `
            <div class="text-center py-4">
              <div class="text-6xl mb-3 animate-scaleIn">${newRank.icon}</div>
              <p class="text-lg font-bold text-white mb-2">Gratulujeme k dosažení nového titulu!</p>
              <p class="text-muted mb-4">Postoupil jsi do fáze: <strong style="color: ${newRank.color};">${newRank.stage}</strong></p>
              <div class="card p-3 bg-surface-2 inline-block">
                <span class="text-xs uppercase font-bold text-muted">Dosaženo celkem:</span>
                <span class="font-bold text-accent ml-1">${data.totalXP} XP</span>
              </div>
            </div>
          `,
          [
            {
              text: 'Pokračovat ve hře 🎸',
              primary: true,
              action: () => {
                if (window.UI && typeof window.UI.hideModal === 'function') {
                  window.UI.hideModal();
                }
              }
            }
          ]
        );
      }
      if (window.UI && typeof window.UI.showConfetti === 'function') {
        window.UI.showConfetti();
      }
      if (window.Sounds && typeof window.Sounds.playLevelUp === 'function') {
        window.Sounds.playLevelUp();
      }
    }

    // Kontrola odznaků za celkové XP
    if (data.totalXP >= 500) this._checkAndAwardBadge('xp_500');
    if (data.totalXP >= 1000) this._checkAndAwardBadge('xp_1000');
    if (data.totalXP >= 5000) this._checkAndAwardBadge('xp_5000');

    // Časové odznaky
    this.checkTimeBadges();

    // Obnovení postranního panelu nebo dashboardu, pokud existuje
    if (window.App && typeof window.App.renderSidebar === 'function') {
      window.App.renderSidebar();
    }
    if (window.App && typeof window.App.renderDashboard === 'function') {
      window.App.renderDashboard();
    }
  },

  getStreak() {
    const data = this._getdata();
    if (!data || !data.streak) return 0;
    if (typeof data.streak === 'number') return data.streak;
    return typeof data.streak.current === 'number' ? data.streak.current : 0;
  },

  getStreakData() {
    const data = this._getdata();
    return data.streak || { current: 0, lastDate: null, best: 0 };
  },

  updateStreak() {
    const data = this._getdata();
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const yesterday = new Date(now.getTime() - 86400000);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (!data.streak) {
      data.streak = { current: 1, lastDate: todayStr, best: 1 };
    } else if (data.streak.lastDate === todayStr) {
      // Dnes již započítáno
      return;
    } else if (data.streak.lastDate === yesterdayStr) {
      // Pokračování série ze včerejška
      data.streak.current += 1;
      data.streak.lastDate = todayStr;
    } else {
      // Přerušení série nebo první záznam
      data.streak.current = 1;
      data.streak.lastDate = todayStr;
    }

    if (data.streak.current > (data.streak.best || 0)) {
      data.streak.best = data.streak.current;
    }

    // Kontrola odznaků za streak
    if (data.streak.current >= 3) this._checkAndAwardBadge('streak_3');
    if (data.streak.current >= 7) this._checkAndAwardBadge('streak_7');
    if (data.streak.current >= 30) this._checkAndAwardBadge('streak_30');

    this.checkTimeBadges();
    this._save(data);
  },

  getCompletedLessons() {
    return this._getdata().completedLessons || [];
  },

  isLessonCompleted(id) {
    return this.getCompletedLessons().includes(Number(id));
  },

  markLessonComplete(id) {
    const numId = Number(id);
    const data = this._getdata();

    if (!data.completedLessons.includes(numId)) {
      data.completedLessons.push(numId);
      data.completedLessons.sort((a, b) => a - b);
      this._save(data);

      // Kontrola odznaků za počet dokončených lekcí
      const count = data.completedLessons.length;
      if (count >= 1) this._checkAndAwardBadge('first_lesson');
      if (count >= 5) this._checkAndAwardBadge('five_lessons');
      if (count >= 10) this._checkAndAwardBadge('ten_lessons');

      // Kontrola dokončení 1. fáze (Garáž - lekce 1 až 8)
      const stage1Lessons = [1, 2, 3, 4, 5, 6, 7, 8];
      const stage1Completed = stage1Lessons.every(lessonId => data.completedLessons.includes(lessonId));
      if (stage1Completed) {
        this._checkAndAwardBadge('all_stage1');
      }

      // Kontrola dokončení 2. fáze (Otevřená scéna - lekce 9 až 15)
      const stage2Lessons = [9, 10, 11, 12, 13, 14, 15];
      const stage2Completed = stage2Lessons.every(lessonId => data.completedLessons.includes(lessonId));
      if (stage2Completed) {
        this._checkAndAwardBadge('all_stage2');
      }

      if (window.App && typeof window.App.renderSidebar === 'function') {
        window.App.renderSidebar();
      }
    }
  },

  recordPerfectQuiz() {
    const data = this._getdata();
    data.perfectStreak = (data.perfectStreak || 0) + 1;
    data.perfectQuizzes = (data.perfectQuizzes || 0) + 1;
    data.totalQuizzes = (data.totalQuizzes || 0) + 1;
    this._save(data);

    this._checkAndAwardBadge('perfect_quiz');
    if (data.perfectStreak >= 3) {
      this._checkAndAwardBadge('three_perfect');
    }
  },

  resetPerfectQuizStreak() {
    const data = this._getdata();
    data.perfectStreak = 0;
    data.totalQuizzes = (data.totalQuizzes || 0) + 1;
    this._save(data);
  },

  getBadges() {
    const earnedIds = this._getdata().earnedBadges || [];
    return BADGES.map(badge => ({
      ...badge,
      earned: earnedIds.includes(badge.id)
    }));
  },

  _checkAndAwardBadge(badgeId) {
    const data = this._getdata();
    if (!data.earnedBadges.includes(badgeId)) {
      data.earnedBadges.push(badgeId);
      this._save(data);

      const badge = BADGES.find(b => b.id === badgeId);
      if (badge) {
        if (window.Sounds && typeof window.Sounds.playSuccess === 'function') {
          window.Sounds.playSuccess();
        }
        if (window.UI && typeof window.UI.showToast === 'function') {
          window.UI.showToast(`Získán nový odznak: ${badge.name} ${badge.icon}!`, 'success');
        }
      }
    }
  },

  checkTimeBadges() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      this._checkAndAwardBadge('night_owl');
    } else if (hour >= 5 && hour < 7) {
      this._checkAndAwardBadge('early_bird');
    }
  },

  unlockBadge(badgeId) {
    this._checkAndAwardBadge(badgeId);
  },

  initGodMode() {
    const data = this._getdata();
    data.totalXP = Math.max(data.totalXP, 10000);
    // Complete all 15 lessons
    data.completedLessons = Array.from({ length: 15 }, (_, i) => i + 1);
    // Unlock all badges
    data.earnedBadges = BADGES.map(b => b.id);
    data.isGod = true;
    if (!data.streak || data.streak.current < 99) {
      data.streak = { current: 99, lastDate: new Date().toISOString().split('T')[0], best: 99 };
    }
    this._save(data);
    if (window.App && typeof window.App.renderSidebar === 'function') {
      window.App.renderSidebar();
    }
    if (window.App && typeof window.App.renderDashboard === 'function') {
      window.App.renderDashboard();
    }
  },

  resetProgress() {
    this.initializeForNewUser();
    if (window.App && typeof window.App.renderSidebar === 'function') {
      window.App.renderSidebar();
    }
    if (window.App && typeof window.App.renderDashboard === 'function') {
      window.App.renderDashboard();
    }
  },

  renderProfile() {
    const profileContainer = document.getElementById('profile-content');
    if (!profileContainer) {
      console.warn('[Progress] Kontejner #profile-content nebyl nalezen.');
      return;
    }

    const data = this._getdata();
    const rank = this.getRank();
    const level = this.getLevel();
    const levelProgress = this.getLevelProgress();
    const badges = this.getBadges();
    const earnedCount = badges.filter(b => b.earned).length;

    // Získání uživatelských informací z modulu Auth (pokud existuje)
    let userName = 'Kytarista';
    let userEmail = 'kytarista@melodrio.cz';
    if (window.Auth && typeof window.Auth.getUser === 'function') {
      const user = window.Auth.getUser();
      if (user) {
        userName = user.name || user.username || userName;
        userEmail = user.email || userEmail;
      }
    }

    // Formátování data vstupu
    let formattedJoinDate = 'Dnes';
    try {
      const joinDateObj = new Date(data.joinDate);
      formattedJoinDate = joinDateObj.toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      formattedJoinDate = 'Říjen 2026';
    }

    // Čtení nastavení zvuku z localStorage
    const savedVolume = localStorage.getItem('melodrio_volume') || '80';
    const soundEnabled = localStorage.getItem('melodrio_sound_enabled') !== 'false';

    profileContainer.innerHTML = `
      <div class="view-header animate-fadeIn mb-6">
        <h1>Tvůj profil kytaristy</h1>
        <p class="text-muted">Sleduj své úspěchy, získané odznaky, odehrané kvízy a spravuj nastavení aplikace.</p>
      </div>

      <!-- 1. Karta uživatele -->
      <div class="card p-6 mb-6 flex flex-wrap items-center justify-between gap-6 animate-slideInUp bg-surface-2 border border-surface-border">
        <div class="flex items-center gap-5">
          <div class="user-avatar w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold bg-primary text-white shadow-lg border-2 border-primary/50">
            ${userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-2xl font-extrabold text-white mb-0">${userName}</h2>
              <span class="rank-badge" style="background: ${rank.color}22; color: ${rank.color}; border: 1px solid ${rank.color}55;">
                ${rank.icon} ${rank.name}
              </span>
            </div>
            <p class="text-sm text-muted mt-1 mb-1">${userEmail}</p>
            <div class="text-xs text-muted flex items-center gap-2">
              <span>📅 Členem od: <strong>${formattedJoinDate}</strong></span>
              <span>•</span>
              <span>Aktuální fáze: <strong style="color: ${rank.color};">${rank.stage}</strong></span>
            </div>
          </div>
        </div>

        <div class="user-rank-status text-right">
          <div class="text-xs text-muted font-bold uppercase tracking-wider mb-1">Titul & Fáze</div>
          <div class="text-xl font-extrabold" style="color: ${rank.color};">${rank.icon} ${rank.name}</div>
          ${rank.nextRank ? `
            <div class="text-xs text-muted mt-1">
              Do titulu <strong>${rank.nextRank.name}</strong> zbývá: <strong>${rank.nextRank.minXP - data.totalXP} XP</strong>
            </div>
          ` : `
            <div class="text-xs text-success font-bold mt-1">🏆 Dosažen nejvyšší mistrovský titul!</div>
          `}
        </div>
      </div>

      <!-- 2. Přehled statistik (Stats Grid) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div class="stat-card card p-4 bg-surface-2 border border-surface-border">
          <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
            <span>Celkem zkušeností</span>
            <span class="text-base">⭐</span>
          </div>
          <div class="text-3xl font-extrabold text-accent mb-2">${data.totalXP} XP</div>
          <div class="text-xs text-muted">Získaných procházením lekcí a kvízů</div>
        </div>

        <div class="stat-card card p-4 bg-surface-2 border border-surface-border">
          <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
            <span>Úroveň (Level)</span>
            <span class="text-base">🏆</span>
          </div>
          <div class="flex items-baseline justify-between mb-1">
            <span class="text-3xl font-extrabold text-white">Level ${level}</span>
            <span class="text-xs text-muted font-semibold">${levelProgress} / 100 XP</span>
          </div>
          <div class="xp-bar mt-2">
            <div class="xp-bar-fill" style="width: ${levelProgress}%"></div>
          </div>
        </div>

        <div class="stat-card card p-4 bg-surface-2 border border-surface-border">
          <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
            <span>Denní série cvičení</span>
            <span class="text-base">🔥</span>
          </div>
          <div class="text-3xl font-extrabold text-white mb-2">
            ${(() => {
              const count = (data.streak && typeof data.streak.current === 'number') ? data.streak.current : (typeof data.streak === 'number' ? data.streak : 0);
              if (count === 1) return '1 den';
              if (count >= 2 && count <= 4) return `${count} dny`;
              return `${count} dní`;
            })()}
          </div>
          <div class="text-xs text-muted">Nejlepší série v kuse: <strong>${(data.streak && data.streak.best) || 0} dní</strong></div>
        </div>

        <div class="stat-card card p-4 bg-surface-2 border border-surface-border">
          <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
            <span>Dokončené lekce</span>
            <span class="text-base">📖</span>
          </div>
          <div class="text-3xl font-extrabold text-white mb-2">${data.completedLessons.length} / 15</div>
          <div class="text-xs text-muted">Absolvováno ${Math.round((data.completedLessons.length / 15) * 100)} % dostupných lekcí</div>
        </div>

        <div class="stat-card card p-4 bg-surface-2 border border-surface-border">
          <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
            <span>Odehrané kvízy</span>
            <span class="text-base">💯</span>
          </div>
          <div class="text-3xl font-extrabold text-white mb-2">${data.totalQuizzes}</div>
          <div class="text-xs text-muted">Bezchybných kvízů: <strong>${data.perfectQuizzes}</strong></div>
        </div>

        <div class="stat-card card p-4 bg-surface-2 border border-surface-border">
          <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
            <span>Získané odznaky</span>
            <span class="text-base">🎖️</span>
          </div>
          <div class="text-3xl font-extrabold text-primary mb-2">${earnedCount} / ${badges.length}</div>
          <div class="text-xs text-muted">Odemčeno ${Math.round((earnedCount / badges.length) * 100)} % všech trofejí</div>
        </div>
      </div>

      <!-- 3. Sekce odznaků -->
      <div class="badges-section mb-8">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span>🎖️</span> Odznaky a úspěchy (${earnedCount} / ${badges.length})
            </h2>
            <p class="text-xs text-muted mt-1">Plň úkoly a odemykej speciální ocenění pro kytaristy.</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          ${badges.map(b => `
            <div class="badge-card card p-4 text-center transition-all ${b.earned ? 'earned bg-surface-2 border-accent/40 shadow-sm' : 'locked opacity-50 bg-surface-1 border-surface-border'}" title="${b.description}">
              <div class="badge-icon-box w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2 ${b.earned ? 'bg-accent/20 border border-accent/40' : 'bg-surface-3 grayscale'}">
                ${b.earned ? b.icon : '🔒'}
              </div>
              <h4 class="text-sm font-bold text-white mb-1">${b.name}</h4>
              <p class="text-xs text-muted leading-tight mb-2">${b.description}</p>
              <span class="badge ${b.earned ? 'earned' : 'locked'} text-[10px] py-0.5 px-2">
                ${b.earned ? '✓ Získáno' : 'Zamčeno'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 4. Sekce nastavení a správy účtu -->
      <div class="card p-6 bg-surface-2 border border-surface-border mb-8">
        <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>⚙️</span> Nastavení aplikace
        </h3>

        <div class="settings-grid grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-surface-border">
          <div>
            <label class="block text-sm font-bold text-white mb-2" for="setting-volume">
              Hlasitost zvuků a kytarových efektů: <span id="volume-val-display" class="text-accent">${savedVolume}%</span>
            </label>
            <input type="range" id="setting-volume" min="0" max="100" value="${savedVolume}" class="w-full cursor-pointer accent-primary">
            <p class="text-xs text-muted mt-1">Nastavuje hlasitost přehrávání akordů, tónů a zvukových efektů.</p>
          </div>

          <div class="flex flex-col justify-center">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" id="setting-sound-toggle" ${soundEnabled ? 'checked' : ''} class="w-5 h-5 accent-primary cursor-pointer">
              <span class="font-bold text-white text-sm">Povolit zvukové efekty aplikace</span>
            </label>
            <p class="text-xs text-muted mt-2 ml-8">Povoluje zvuky kliknutí, úspěšného kvízu, postupu na nový level a fanfáry.</p>
          </div>
        </div>

        <div class="danger-zone pt-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h4 class="text-sm font-bold text-error mb-1">Nebezpečná zóna: Resetování postupu</h4>
            <p class="text-xs text-muted mb-0">Chceš začít svou kytarovou cestu znovu od nuly? Můžeš smazat veškerý postup.</p>
          </div>
          <button class="btn btn-ghost text-error border border-error/40 hover:bg-error/10" id="btn-reset-progress">
            ⚠️ Resetovat veškerý postup
          </button>
        </div>

        <div class="pt-6 mt-6 border-t border-surface-border flex flex-wrap justify-between items-center gap-4">
          <div>
            <h4 class="text-sm font-bold text-white mb-1">Odhlášení z aplikace</h4>
            <p class="text-xs text-muted mb-0">Odhlásí aktuálního uživatele na tomto počítači.</p>
          </div>
          <button class="btn btn-danger btn-sm" id="btn-profile-logout" style="border-radius: 8px; font-weight: 700;">
            Odhlásit se 🚪
          </button>
        </div>
      </div>
    `;

    // Ovládací prvky nastavení
    const volumeSlider = document.getElementById('setting-volume');
    const volumeDisplay = document.getElementById('volume-val-display');
    const soundToggle = document.getElementById('setting-sound-toggle');
    const resetBtn = document.getElementById('btn-reset-progress');
    const logoutBtn = document.getElementById('btn-profile-logout');

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (window.Auth && typeof window.Auth.logout === 'function') {
          window.Auth.logout();
        }
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        if (volumeDisplay) volumeDisplay.innerText = `${val}%`;
        localStorage.setItem('melodrio_volume', val);
        if (window.Sounds) {
          window.Sounds.volume = Number(val) / 100;
        }
      });
    }

    if (soundToggle) {
      soundToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        localStorage.setItem('melodrio_sound_enabled', enabled ? 'true' : 'false');
        if (window.Sounds) {
          window.Sounds.enabled = enabled;
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (window.UI && typeof window.UI.showModal === 'function') {
          window.UI.showModal(
            'Resetovat veškerý postup?',
            `
              <p class="text-white mb-2">Opravdu si přeješ smazat veškerý svůj postup, získané body XP, dokončené lekce i odznaky?</p>
              <p class="text-error font-bold mb-0">Tuto akci nelze vzít zpět!</p>
            `,
            [
              {
                text: 'Zrušit',
                action: () => {
                  if (window.UI && typeof window.UI.hideModal === 'function') {
                    window.UI.hideModal();
                  }
                }
              },
              {
                text: 'Ano, smazat vše',
                danger: true,
                action: () => {
                  window.Progress.initializeForNewUser();
                  if (window.UI && typeof window.UI.hideModal === 'function') {
                    window.UI.hideModal();
                  }
                  if (window.UI && typeof window.UI.showToast === 'function') {
                    window.UI.showToast('Veškerý postup byl úspěšně vymazán.', 'info');
                  }
                  window.Progress.renderProfile();
                  if (window.App && typeof window.App.renderSidebar === 'function') {
                    window.App.renderSidebar();
                  }
                  if (window.App && typeof window.App.renderDashboard === 'function') {
                    window.App.renderDashboard();
                  }
                }
              }
            ]
          );
        } else {
          if (confirm('Opravdu si přeješ smazat veškerý postup?')) {
            window.Progress.initializeForNewUser();
            window.Progress.renderProfile();
          }
        }
      });
    }
  },

  initializeForNewUser() {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const initialData = {
      totalXP: 0,
      completedLessons: [],
      earnedBadges: ['first_login'],
      streak: { current: 1, lastDate: todayStr, best: 1 },
      perfectQuizzes: 0,
      perfectStreak: 0,
      totalQuizzes: 0,
      totalPracticeTime: 0,
      joinDate: now.toISOString()
    };
    this._save(initialData);
  },

  initUserData() {
    this.initializeForNewUser();
  }
};

// Automatická aktualizace denní série při načtení souboru
if (typeof window !== 'undefined') {
  try {
    window.Progress.updateStreak();
  } catch (e) {
    console.warn('[Progress] Nelze automaticky aktualizovat streak při inicializaci:', e);
  }
}

