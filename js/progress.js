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
        let currentStreak = 0;
        let lastDate = null;
        let bestStreak = 0;

        if (typeof s === 'number' && !isNaN(s)) {
          currentStreak = s >= 1 ? 1 : 0;
          bestStreak = currentStreak;
        } else if (typeof s === 'string') {
          if (s === '[object Object]' || s.includes('object')) {
            currentStreak = 0;
          } else {
            const num = parseInt(s, 10) || 0;
            currentStreak = num >= 1 ? 1 : 0;
            bestStreak = currentStreak;
          }
        } else if (s && typeof s === 'object') {
          const rawCurrent = s.current;
          if (typeof rawCurrent === 'number') {
            currentStreak = rawCurrent >= 1 ? 1 : 0;
          } else if (typeof rawCurrent === 'string' && rawCurrent !== '[object Object]' && !rawCurrent.includes('object')) {
            currentStreak = (parseInt(rawCurrent, 10) || 0) >= 1 ? 1 : 0;
          } else {
            currentStreak = 0;
          }
          lastDate = s.lastDate || null;
          bestStreak = currentStreak;
        }

        const cleanStreak = {
          current: currentStreak,
          lastDate: lastDate,
          best: bestStreak
        };

        return {
          totalXP: parsed.totalXP || 0,
          completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
          earnedBadges: Array.isArray(parsed.earnedBadges) ? parsed.earnedBadges : ['first_login'],
          streak: cleanStreak,
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
      streak: { current: 0, lastDate: null, best: 0 },
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
      if (data && data.streak) {
        if (typeof data.streak === 'object' && data.streak !== null) {
          data.streak.current = (data.streak.current >= 1) ? 1 : 0;
          data.streak.best = data.streak.current;
        } else {
          const num = Number(data.streak) || 0;
          data.streak = { current: num >= 1 ? 1 : 0, lastDate: null, best: num >= 1 ? 1 : 0 };
        }
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      if (data && data.streak) {
        localStorage.setItem('melodrio_streak', JSON.stringify(data.streak));
      }
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
    if (typeof data.streak === 'number' && !isNaN(data.streak)) return data.streak >= 1 ? 1 : 0;
    if (typeof data.streak === 'object' && typeof data.streak.current === 'number' && !isNaN(data.streak.current)) {
      return data.streak.current >= 1 ? 1 : 0;
    }
    return 0;
  },

  getStreakData() {
    const data = this._getdata();
    if (data && data.streak && typeof data.streak === 'object' && typeof data.streak.current === 'number') {
      const isOne = data.streak.current >= 1 ? 1 : 0;
      return {
        current: isOne,
        lastDate: data.streak.lastDate || null,
        best: isOne
      };
    }
    return { current: 0, lastDate: null, best: 0 };
  },

  /**
   * Zkontroluje stav denní série při startu (pasivní kontrola).
   * Pokud uživatel dnes ještě necvičil, série je 0.
   * Pokud dnes již cvičil, série je 1 (výš už to nejde, stačí 0 a 1).
   */
  updateStreak() {
    const data = this._getdata();
    if (!data || !data.streak || typeof data.streak !== 'object') return;

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (data.streak.lastDate === todayStr && data.streak.current >= 1) {
      data.streak.current = 1;
      data.streak.best = 1;
    } else {
      data.streak.current = 0;
    }
    this._save(data);
  },

  /**
   * Zaznamená splnění cvičení nebo lekce a nastaví denní sérii na 1.
   * Podle zadání je streak striktně binární: 0 (dnes necvičil) nebo 1 (dnes cvičil).
   * Výš už to nejde (stačí 0 a 1).
   */
  recordPracticeActivity() {
    const data = this._getdata();
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    data.streak.current = 1;
    data.streak.lastDate = todayStr;
    data.streak.best = 1;

    this._save(data);

    // Aktualizace UI
    if (window.App) {
      if (typeof window.App.renderDashboard === 'function') window.App.renderDashboard();
      if (typeof window.App.renderSidebar === 'function') window.App.renderSidebar();
    }
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

    // Splnění lekce je aktivita cvičení -> streak na 1
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    data.streak.current = 1;
    data.streak.lastDate = todayStr;
    data.streak.best = 1;

    if (!data.completedLessons.includes(numId)) {
      data.completedLessons.push(numId);
      data.completedLessons.sort((a, b) => a - b);

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
    }
    this._save(data);

    if (window.App && typeof window.App.renderSidebar === 'function') {
      window.App.renderSidebar();
    }
    if (window.App && typeof window.App.renderDashboard === 'function') {
      window.App.renderDashboard();
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
    if (!data.streak || typeof data.streak !== 'object') {
      data.streak = { current: 0, lastDate: null, best: 0 };
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

  currentBadgeFilter: 'all',

  filterBadges(filter) {
    this.currentBadgeFilter = filter;

    const buttons = document.querySelectorAll('.badge-filter-btn');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-filter') === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const cards = document.querySelectorAll('.badge-card-v2');
    cards.forEach(card => {
      const status = card.getAttribute('data-badge-status');
      if (filter === 'all' || status === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    const categories = document.querySelectorAll('.badge-category-section');
    categories.forEach(cat => {
      const allCards = cat.querySelectorAll('.badge-card-v2');
      let anyVisible = false;
      allCards.forEach(c => {
        if (c.style.display !== 'none') anyVisible = true;
      });
      cat.style.display = anyVisible ? 'block' : 'none';
    });
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

    // Check if God Mode is active
    const isGod = (window.Auth && typeof window.Auth.isGod === 'function' && window.Auth.isGod()) || (data.isGod === true);

    // Získání uživatelských informací z modulu Auth (pokud existuje)
    let userName = isGod ? 'God (Všemohoucí Bůh kytary)' : 'Kytarista';
    let userEmail = isGod ? 'god@melodrio.cz' : 'kytarista@melodrio.cz';
    if (!isGod && window.Auth && typeof window.Auth.getUser === 'function') {
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

    // 1. Skupina: Kytarový pokrok & Úroveň (pro Boha vše na max a hotovo)
    const displayXP = isGod ? Math.max(10000, data.totalXP) : data.totalXP;
    const displayLevel = isGod ? 100 : level;
    const displayLevelProgress = isGod ? 100 : levelProgress;

    const stage1Done = isGod ? 8 : data.completedLessons.filter(id => id >= 1 && id <= 8).length;
    const stage1Percent = isGod ? 100 : Math.round((stage1Done / 8) * 100);
    const stage2Done = isGod ? 8 : data.completedLessons.filter(id => id >= 9 && id <= 16).length;
    const stage2Percent = isGod ? 100 : Math.round((stage2Done / 8) * 100);
    const totalLessonsDone = isGod ? 16 : data.completedLessons.length;
    const totalCoursePercent = isGod ? 100 : Math.min(100, Math.round((totalLessonsDone / 16) * 100));

    // 2. Skupina: Aktivita, Vytrvalost & Mistrovství
    // PRO BOHA: Nekonečný streak (∞ dní) se zlatým zvýrazněním!
    // PRO NORMÁLNÍHO UŽIVATELE: striktně 0 nebo 1 den.
    const streakRaw = (data.streak && typeof data.streak.current === 'number') ? data.streak.current : (typeof data.streak === 'number' ? data.streak : 0);
    const streakCount = streakRaw >= 1 ? 1 : 0;
    const streakDisplay = isGod ? '∞ dní' : (streakCount === 1 ? '1 den' : '0 dní');
    const streakActive = isGod ? true : (streakCount >= 1);

    const totalQuizzes = isGod ? Math.max(25, data.totalQuizzes || 0) : (data.totalQuizzes || 0);
    const perfectQuizzes = isGod ? totalQuizzes : (data.perfectQuizzes || 0);
    const estimatedMinutes = isGod ? 999 : Math.max(10, (totalLessonsDone * 12) + (totalQuizzes * 5));
    const earnedCount = isGod ? badges.length : badges.filter(b => b.earned).length;
    const badgePercent = isGod ? 100 : Math.round((earnedCount / badges.length) * 100);

    // 3. Skupina: Kategoriální rozdělení odznaků
    const categories = [
      {
        id: 'journey',
        name: 'Cesta žáka (Lekce & Postup)',
        icon: '📚',
        badgeIds: ['first_lesson', 'five_lessons', 'ten_lessons', 'all_stage1', 'all_stage2']
      },
      {
        id: 'xp',
        name: 'Zkušenosti & Úrovně (XP)',
        icon: '⭐',
        badgeIds: ['xp_500', 'xp_1000', 'xp_5000']
      },
      {
        id: 'mastery',
        name: 'Kvízy & Mistrovství',
        icon: '🎯',
        badgeIds: ['perfect_quiz', 'three_perfect']
      },
      {
        id: 'habit',
        name: 'Vytrvalost & Speciální výzvy',
        icon: '🔥',
        badgeIds: ['first_login', 'streak_3', 'streak_7', 'streak_30', 'night_owl', 'early_bird']
      }
    ];

    // Helper pro výpočet cíle a postupu odznaku
    const getBadgeGoalInfo = (badge) => {
      if (isGod) {
        return { cur: 1, tgt: 1, unit: 'splněno', pct: 100, goalHint: '✨ Božská moc: Plně odemčeno' };
      }

      let cur = 0, tgt = 1, unit = '', goalHint = '';
      if (badge.id === 'first_lesson') {
        cur = totalLessonsDone; tgt = 1; unit = 'lekce';
        goalHint = cur >= tgt ? 'Splněno!' : 'Dokonči 1. lekci kurzu';
      } else if (badge.id === 'five_lessons') {
        cur = totalLessonsDone; tgt = 5; unit = 'lekcí';
        goalHint = cur >= tgt ? 'Splněno!' : `Zbývá dokončit: ${Math.max(0, 5 - cur)} lekcí`;
      } else if (badge.id === 'ten_lessons') {
        cur = totalLessonsDone; tgt = 10; unit = 'lekcí';
        goalHint = cur >= tgt ? 'Splněno!' : `Zbývá dokončit: ${Math.max(0, 10 - cur)} lekcí`;
      } else if (badge.id === 'all_stage1') {
        cur = stage1Done; tgt = 8; unit = 'v Garáži';
        goalHint = cur >= tgt ? 'Splněno!' : `Zbývá: ${8 - cur} lekcí v Garáži`;
      } else if (badge.id === 'all_stage2') {
        cur = stage2Done; tgt = 8; unit = 'na Scéně';
        goalHint = cur >= tgt ? 'Splněno!' : `Zbývá: ${8 - cur} lekcí na Scéně`;
      } else if (badge.id === 'xp_500') {
        cur = displayXP; tgt = 500; unit = 'XP';
        goalHint = cur >= tgt ? 'Splněno!' : `Chybí ještě: ${Math.max(0, 500 - cur)} XP`;
      } else if (badge.id === 'xp_1000') {
        cur = displayXP; tgt = 1000; unit = 'XP';
        goalHint = cur >= tgt ? 'Splněno!' : `Chybí ještě: ${Math.max(0, 1000 - cur)} XP`;
      } else if (badge.id === 'xp_5000') {
        cur = displayXP; tgt = 5000; unit = 'XP';
        goalHint = cur >= tgt ? 'Splněno!' : `Chybí ještě: ${Math.max(0, 5000 - cur)} XP`;
      } else if (badge.id === 'perfect_quiz') {
        cur = perfectQuizzes; tgt = 1; unit = 'kvíz';
        goalHint = cur >= tgt ? 'Splněno!' : 'Zvládni libovolný kvíz na 100 %';
      } else if (badge.id === 'three_perfect') {
        cur = data.perfectStreak || 0; tgt = 3; unit = 'v řadě';
        goalHint = cur >= tgt ? 'Splněno!' : `Zbývá: ${Math.max(0, 3 - cur)} bezchybné kvízy v řadě`;
      } else if (badge.id === 'first_login') {
        cur = 1; tgt = 1; unit = 'vstup';
        goalHint = 'První přihlášení do aplikace';
      } else if (badge.id === 'streak_3') {
        cur = streakCount; tgt = 3; unit = 'dny';
        goalHint = cur >= tgt ? 'Splněno!' : `Zbývá: ${Math.max(0, 3 - cur)} dny denní série`;
      } else if (badge.id === 'streak_7') {
        cur = streakCount; tgt = 7; unit = 'dní';
        goalHint = cur >= tgt ? 'Splněno!' : `Zbývá: ${Math.max(0, 7 - cur)} dní denní série`;
      } else if (badge.id === 'streak_30') {
        cur = streakCount; tgt = 30; unit = 'dní';
        goalHint = cur >= tgt ? 'Splněno!' : `Zbývá: ${Math.max(0, 30 - cur)} dní denní série`;
      } else if (badge.id === 'night_owl') {
        cur = badge.earned ? 1 : 0; tgt = 1; unit = 'noc';
        goalHint = badge.earned ? 'Splněno!' : 'Procvič lekci mezi 00:00 a 05:00';
      } else if (badge.id === 'early_bird') {
        cur = badge.earned ? 1 : 0; tgt = 1; unit = 'ráno';
        goalHint = badge.earned ? 'Splněno!' : 'Procvič lekci ráno mezi 05:00 a 07:00';
      } else {
        cur = badge.earned ? 1 : 0; tgt = 1; unit = '';
        goalHint = badge.description;
      }

      if (badge.earned) {
        cur = tgt;
      }
      const pct = Math.min(100, Math.round((cur / tgt) * 100));
      return { cur, tgt, unit, pct, goalHint };
    };

    profileContainer.innerHTML = `
      <div class="view-header animate-fadeIn mb-6">
        <h1>Tvůj profil kytaristy</h1>
        <p class="text-muted">Přehled hudebních milníků, kytarových dovedností, získaných trofejí a nastavení.</p>
      </div>

      <!-- 1. Karta uživatele -->
      <div class="card p-6 mb-8 flex flex-wrap items-center justify-between gap-6 animate-slideInUp ${isGod ? 'god-gold-card' : 'bg-surface-2 border border-surface-border'}" style="border-radius: 18px;">
        <div class="flex items-center gap-5">
          <div style="
            width: 76px; height: 76px;
            border-radius: 50%;
            background: ${isGod ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)'};
            border: 2px solid ${isGod ? '#FBBF24' : 'rgba(139, 92, 246, 0.5)'};
            display: flex; align-items: center; justify-content: center;
            font-size: 2.5rem;
            box-shadow: 0 0 20px ${isGod ? 'rgba(245, 158, 11, 0.5)' : 'rgba(139, 92, 246, 0.3)'};
            flex-shrink: 0;
          ">
            ${isGod ? '👑' : '🎸'}
          </div>
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-2xl font-extrabold text-white mb-0">${userName}</h2>
              <span class="rank-badge ${isGod ? 'god-gold-badge' : ''}" style="${isGod ? '' : `background: ${rank.color}22; color: ${rank.color}; border: 1px solid ${rank.color}55;`}">
                ${isGod ? '👑 Olymp (Bůh kytary)' : `${rank.icon} ${rank.name}`}
              </span>
            </div>
            <p class="text-sm text-muted mt-1 mb-1">${userEmail}</p>
            <div class="text-xs text-muted flex items-center gap-2 flex-wrap">
              <span>📅 Členem od: <strong>${formattedJoinDate}</strong></span>
              <span>•</span>
              <span>Aktuální fáze: <strong style="color: ${isGod ? '#fbbf24' : rank.color};">${isGod ? 'Všechny etapy dokončeny' : rank.stage}</strong></span>
            </div>
          </div>
        </div>

        <div class="user-rank-status text-right">
          <div class="text-xs text-muted font-bold uppercase tracking-wider mb-1">Titul & Fáze</div>
          <div class="text-xl font-extrabold" style="color: ${isGod ? '#fbbf24' : rank.color};">
            ${isGod ? '👑 Olymp (Bůh kytary)' : `${rank.icon} ${rank.name}`}
          </div>
          ${isGod ? `
            <div class="text-xs font-bold mt-1" style="color: #fbbf24;">⚡ PLNÁ KONTROLA • VŠECHNY LEKCE DOKONČENY</div>
          ` : (rank.nextRank ? `
            <div class="text-xs text-muted mt-1">
              Do titulu <strong>${rank.nextRank.name}</strong> zbývá: <strong>${rank.nextRank.minXP - data.totalXP} XP</strong>
            </div>
          ` : `
            <div class="text-xs text-success font-bold mt-1">🏆 Dosažen nejvyšší mistrovský titul!</div>
          `)}
        </div>
      </div>

      <!-- 2. ROZDĚLENÉ STATISTIKY - SKUPINA 1: Kytarový pokrok & Úroveň -->
      <section class="profile-stats-group animate-slideInUp">
        <div class="profile-group-header">
          <div>
            <h3 class="profile-group-title">
              <span>🎸</span>
              <span>Kytarový pokrok & Úroveň</span>
            </h3>
            <p class="profile-group-desc">Tvůj postup kurzem, získané zkušenosti a postup na vyšší úroveň.</p>
          </div>
          <span class="companion-card-badge ${isGod ? 'god-gold-badge' : ''}" style="font-size: 0.75rem;">
            Level ${displayLevel}
          </span>
        </div>

        <!-- Hero Card: Úroveň a XP -->
        <div class="profile-hero-card ${isGod ? 'god-gold-card' : ''}">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="
                width: 56px; height: 56px;
                border-radius: 16px;
                background: ${isGod ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'};
                display: flex; align-items: center; justify-content: center;
                font-size: 1.6rem;
                font-weight: 800;
                color: ${isGod ? '#000000' : '#ffffff'};
                box-shadow: 0 4px 15px ${isGod ? 'rgba(245, 158, 11, 0.5)' : 'rgba(139, 92, 246, 0.4)'};
              ">
                ${displayLevel}
              </div>
              <div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #ffffff;">
                  Úroveň ${displayLevel} • ${isGod ? 'Olymp (Bůh kytary)' : rank.name}
                </div>
                <div style="font-size: 0.8rem; color: #94a3b8;">
                  Nasbíráno celkem <strong style="color: #fbbf24;">${displayXP} XP</strong> ${isGod ? '(MAX DOSAŽENO)' : ''}
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.85rem; font-weight: 700; color: ${isGod ? '#fbbf24' : '#a78bfa'};">
                ${displayLevelProgress} / 100 XP (${displayLevelProgress}%)
              </span>
              <div style="font-size: 0.75rem; color: #64748b;">
                ${isGod ? 'Dosažena maximální božská úroveň' : `Do další úrovně chybí ${100 - displayLevelProgress} XP`}
              </div>
            </div>
          </div>

          <!-- XP Bar (Zlatý pro God Mode) -->
          <div class="xp-bar" style="height: 10px; background: rgba(15, 23, 42, 0.6); border-radius: 9999px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08);">
            <div class="xp-bar-fill ${isGod ? 'god-gold-bar' : ''}" style="width: ${displayLevelProgress}%; height: 100%; background: ${isGod ? 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 50%, #FDE68A 100%)' : 'linear-gradient(90deg, #8B5CF6, #3B82F6)'}; border-radius: 9999px; transition: width 0.6s ease; box-shadow: ${isGod ? '0 0 12px rgba(245, 158, 11, 0.7)' : 'none'};"></div>
          </div>
        </div>

        <!-- 3 Podrobné karty postupu kurzem -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 1. etapa -->
          <div class="stat-card card p-4 bg-surface-2 border border-surface-border ${isGod ? 'god-gold-card' : ''}">
            <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
              <span>1. Fáze: Garáž</span>
              <span class="text-base">🏠</span>
            </div>
            <div class="flex items-baseline justify-between mb-1">
              <span class="text-2xl font-extrabold text-white">${stage1Done} / 8 lekcí</span>
              <span class="text-xs ${isGod ? 'text-warning font-bold' : 'text-accent font-semibold'}">${stage1Percent}%</span>
            </div>
            <div class="badge-progress-bar mt-2">
              <div class="badge-progress-bar-fill ${isGod ? 'god-gold-bar' : ''}" style="width: ${stage1Percent}%;"></div>
            </div>
            <div class="text-xs text-muted mt-2">${isGod ? '✅ Všechny lekce v Garáži splněny' : 'Základní akordy, rytmus a úchop'}</div>
          </div>

          <!-- 2. etapa -->
          <div class="stat-card card p-4 bg-surface-2 border border-surface-border ${isGod ? 'god-gold-card' : ''}">
            <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
              <span>2. Fáze: Otevřená scéna</span>
              <span class="text-base">🎤</span>
            </div>
            <div class="flex items-baseline justify-between mb-1">
              <span class="text-2xl font-extrabold text-white">${stage2Done} / 8 lekcí</span>
              <span class="text-xs ${isGod ? 'text-warning font-bold' : 'text-accent font-semibold'}">${stage2Percent}%</span>
            </div>
            <div class="badge-progress-bar mt-2">
              <div class="badge-progress-bar-fill ${isGod ? 'god-gold-bar' : ''}" style="width: ${stage2Percent}%;"></div>
            </div>
            <div class="text-xs text-muted mt-2">${isGod ? '✅ Všechny lekce na Scéně splněny' : 'Písničky, barre akordy a vybrnkávání'}</div>
          </div>

          <!-- Celkový kurz -->
          <div class="stat-card card p-4 bg-surface-2 border border-surface-border ${isGod ? 'god-gold-card' : ''}">
            <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
              <span>Celkový postup výukou</span>
              <span class="text-base">📖</span>
            </div>
            <div class="flex items-baseline justify-between mb-1">
              <span class="text-2xl font-extrabold text-white">${totalLessonsDone} / 16 lekcí</span>
              <span class="text-xs text-success font-bold">${totalCoursePercent}%</span>
            </div>
            <div class="badge-progress-bar mt-2">
              <div class="badge-progress-bar-fill ${isGod ? 'god-gold-bar' : ''}" style="width: ${totalCoursePercent}%; ${isGod ? '' : 'background: linear-gradient(90deg, #10B981, #059669);'}"></div>
            </div>
            <div class="text-xs text-muted mt-2">${isGod ? '🏆 Kompletní akademie 100% dokončena' : 'Kompletní akademie hry na kytaru'}</div>
          </div>
        </div>
      </section>

      <!-- 3. ROZDĚLENÉ STATISTIKY - SKUPINA 2: Aktivita, Vytrvalost & Mistrovství -->
      <section class="profile-stats-group animate-slideInUp" style="animation-delay: 50ms;">
        <div class="profile-group-header">
          <div>
            <h3 class="profile-group-title">
              <span>⚡</span>
              <span>Aktivita, Vytrvalost & Kvízy</span>
            </h3>
            <p class="profile-group-desc">Sledování pravidelnosti cvičení, přesnosti odpovědí a kytarové praxe.</p>
          </div>
          <span class="companion-card-badge ${isGod ? 'god-gold-badge' : (streakActive ? 'streak-done' : '')}">
            ${isGod ? '👑 Nekonečná série' : (streakActive ? '🔥 Série aktivní' : '⏳ Připraveno ke cvičení')}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Denní série (Nekonečno ∞ pro God Mode) -->
          <div class="stat-card card p-4 bg-surface-2 border border-surface-border ${isGod ? 'god-gold-card' : ''}">
            <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
              <span>Denní série</span>
              <span class="text-base">🔥</span>
            </div>
            <div class="text-3xl font-extrabold mb-1" style="color: ${isGod ? '#fbbf24' : (streakActive ? '#f59e0b' : '#ffffff')}; ${isGod ? 'text-shadow: 0 0 15px rgba(245, 158, 11, 0.7);' : ''}">
              ${streakDisplay}
            </div>
            <div class="text-xs text-muted">
              Dnes aktivní: <strong style="color: ${isGod ? '#fbbf24' : (streakActive ? '#34d399' : '#94a3b8')};">${isGod ? 'Ano (∞ dní - Božská moc)' : (streakActive ? 'Ano (1 den)' : 'Zatím ne (0 dní)')}</strong>
            </div>
          </div>

          <!-- Kvízy -->
          <div class="stat-card card p-4 bg-surface-2 border border-surface-border ${isGod ? 'god-gold-card' : ''}">
            <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
              <span>Odehrané kvízy</span>
              <span class="text-base">💯</span>
            </div>
            <div class="text-3xl font-extrabold text-white mb-1">${totalQuizzes}</div>
            <div class="text-xs text-muted">
              Bezchybných: <strong style="color: ${isGod ? '#fbbf24' : '#34d399'};">${perfectQuizzes}</strong> (100%)
            </div>
          </div>

          <!-- Kytarová praxe -->
          <div class="stat-card card p-4 bg-surface-2 border border-surface-border ${isGod ? 'god-gold-card' : ''}">
            <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
              <span>Čas praxe</span>
              <span class="text-base">⏱️</span>
            </div>
            <div class="text-3xl font-extrabold text-white mb-1">${isGod ? 'Nekonečno' : `~${estimatedMinutes} min`}</div>
            <div class="text-xs text-muted">Odehraný čas u cvičení a lekcí</div>
          </div>

          <!-- Trofeje -->
          <div class="stat-card card p-4 bg-surface-2 border border-surface-border ${isGod ? 'god-gold-card' : ''}">
            <div class="flex items-center justify-between text-muted text-xs font-bold uppercase mb-2">
              <span>Trofeje & Odznaky</span>
              <span class="text-base">🎖️</span>
            </div>
            <div class="text-3xl font-extrabold ${isGod ? 'text-warning' : 'text-accent'} mb-1">${earnedCount} / ${badges.length}</div>
            <div class="text-xs text-muted">Odemčeno <strong>${badgePercent}%</strong> ocenění</div>
          </div>
        </div>
      </section>

      <!-- 4. ROZDĚLENÉ A MOTIVUJÍCÍ ODZNAKY -->
      <section class="badges-section mb-8 animate-slideInUp" style="animation-delay: 100ms;">
        <div class="profile-group-header">
          <div>
            <h3 class="profile-group-title">
              <span>🎖️</span>
              <span>Kytarové odznaky a milníky</span>
            </h3>
            <p class="profile-group-desc">Sleduj svůj postup a odemykej speciální ocenění pro kytaristy.</p>
          </div>
          <span class="companion-card-badge ${isGod ? 'god-gold-badge' : ''}" style="font-size: 0.8rem; padding: 4px 12px;">
            ${earnedCount} získáno • ${isGod ? '0 zbývá' : `${badges.length - earnedCount} zbývá`}
          </span>
        </div>

        <!-- Filter bar -->
        <div class="badge-filter-bar">
          <button class="badge-filter-btn active" data-filter="all" onclick="Progress.filterBadges('all')">
            🌟 Všechny (${badges.length})
          </button>
          <button class="badge-filter-btn" data-filter="earned" onclick="Progress.filterBadges('earned')">
            ✨ Získané (${earnedCount})
          </button>
          <button class="badge-filter-btn" data-filter="locked" onclick="Progress.filterBadges('locked')">
            🎯 K odemčení (${isGod ? 0 : badges.length - earnedCount})
          </button>
        </div>

        <!-- Kategoriální zobrazení odznaků -->
        <div class="badge-categories-container">
          ${categories.map(cat => {
            const catBadges = badges.filter(b => cat.badgeIds.includes(b.id));
            const catEarned = isGod ? catBadges.length : catBadges.filter(b => b.earned).length;

            return `
              <div class="badge-category-section ${isGod ? 'god-gold-card' : ''}" data-category="${cat.id}">
                <div class="badge-category-title-wrap">
                  <div class="badge-category-name">
                    <span>${cat.icon}</span>
                    <span>${cat.name}</span>
                  </div>
                  <div class="badge-category-count ${isGod ? 'god-gold-badge' : ''}">
                    ${catEarned} / ${catBadges.length} získáno
                  </div>
                </div>

                <div class="badge-cards-grid">
                  ${catBadges.map(b => {
                    const isEarned = isGod || b.earned;
                    const info = getBadgeGoalInfo(b);
                    return `
                      <div class="badge-card-v2 ${isEarned ? 'earned' : 'locked'}" data-badge-status="${isEarned ? 'earned' : 'locked'}" title="${b.description}">
                        <div class="badge-top-row">
                          <div class="badge-icon-bubble" style="${isGod ? 'background: rgba(245, 158, 11, 0.25); border: 1px solid #f59e0b; box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);' : ''}">
                            ${b.icon}
                          </div>
                          <span class="badge-status-pill ${isEarned ? 'earned' : 'locked'}" style="${isGod ? 'background: rgba(245, 158, 11, 0.2); color: #fbbf24; border-color: rgba(245, 158, 11, 0.5);' : ''}">
                            ${isEarned ? '✓ Získáno' : '🎯 K odemčení'}
                          </span>
                        </div>

                        <div class="badge-content-v2">
                          <div class="badge-title-v2">${b.name}</div>
                          <div class="badge-desc-v2">${b.description}</div>

                          <div class="badge-progress-box">
                            <div class="badge-progress-labels">
                              <span>${isEarned ? 'Dokončeno na 100%' : `Postup: ${info.cur} / ${info.tgt} ${info.unit}`}</span>
                              <span style="color: ${isEarned ? '#fbbf24' : '#a78bfa'};">${info.pct}%</span>
                            </div>
                            <div class="badge-progress-bar">
                              <div class="badge-progress-bar-fill ${isGod ? 'god-gold-bar' : ''}" style="width: ${info.pct}%; ${(!isGod && isEarned) ? 'background: linear-gradient(90deg, #10B981, #059669);' : ''}"></div>
                            </div>
                            <div class="badge-goal-hint" style="color: ${isEarned ? (isGod ? '#fbbf24' : '#34d399') : '#cbd5e1'};">
                              ${isEarned ? (isGod ? '✨ Božská moc: Plně odemčeno' : '✨ Úspěch plně odemčen') : `🎯 ${info.goalHint}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- 5. Sekce nastavení a správy účtu -->
      <div class="card p-6 bg-surface-2 border border-surface-border mb-8" style="border-radius: 18px;">
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

    const initialData = {
      totalXP: 0,
      completedLessons: [],
      earnedBadges: ['first_login'],
      streak: { current: 0, lastDate: null, best: 0 },
      perfectQuizzes: 0,
      perfectStreak: 0,
      totalQuizzes: 0,
      totalPracticeTime: 0,
      joinDate: now.toISOString()
    };
    this._save(initialData);
    try {
      localStorage.setItem('melodrio_streak', JSON.stringify({ current: 0, lastDate: null, best: 0 }));
    } catch (e) {}
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

