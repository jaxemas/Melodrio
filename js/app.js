/**
 * Melodrio - Main Application Module
 * Handles routing, navigation, dashboard rendering, story map, profile, and app initialization.
 */

window.App = {
  currentView: 'dashboard',

  // Stages & Ranks configuration
  STAGES: [
    { id: 1, name: 'Garáž', rank: 'Nováček', icon: '🏠', minXp: 0, maxXp: 500, lessons: [1, 8] },
    { id: 2, name: 'Otevřená scéna', rank: 'Začátečník', icon: '🎤', minXp: 500, maxXp: 1500, lessons: [9, 16] },
    { id: 3, name: 'Hospoda', rank: 'Muzikant', icon: '🍺', minXp: 1500, maxXp: 3000, lessons: [17, 24] },
    { id: 4, name: 'Klub', rank: 'Hráč', icon: '🎪', minXp: 3000, maxXp: 5000, lessons: [25, 32] },
    { id: 5, name: 'Koncertní sál', rank: 'Umělec', icon: '🎭', minXp: 5000, maxXp: 8000, lessons: [33, 40] },
    { id: 6, name: 'Stadion', rank: 'Mistr', icon: '🏟️', minXp: 8000, maxXp: 10000, lessons: [41, 48] },
    { id: 7, name: 'Olymp', rank: 'Bůh kytary', icon: '👑', minXp: 10000, maxXp: Infinity, lessons: [1, 15] }
  ],

  // Fallback lesson metadata for Stage 1 (1-8) and Stage 2 (9-16)
  LESSON_DATA: {
    1: { title: 'Seznámení s kytarou & držení', xp: 50, desc: 'Části kytary, poloha těla a držení trsátka' },
    2: { title: 'První struna & ladění', xp: 50, desc: 'Názvy strun a jak naladit kytaru' },
    3: { title: 'Jednoduchý akord E moll (Em)', xp: 60, desc: 'Tvůj vůbec první kytarový akord na dva prsty' },
    4: { title: 'Akord C dur & čistý tón', xp: 60, desc: 'Postavení prstů na hmatníku a čistý tón' },
    5: { title: 'Rytmus 4/4 a první úder', xp: 70, desc: 'Základní rytmický vzorec pro pravou ruku' },
    6: { title: 'Akord G dur & přechody', xp: 75, desc: 'Populární akord a nácvik plynulého střídání' },
    7: { title: 'Akord D dur & akordový kruh', xp: 80, desc: 'Doplnění základní čtveřice rockových akordů' },
    8: { title: 'První celá píseň (G-Em-C-D)', xp: 100, desc: 'Spoj všechny akordy do své první písně v garáži' },

    9: { title: 'Akord A moll (Am) & melancholie', xp: 60, desc: 'Nový mollový akord a melancholické vyhrávky' },
    10: { title: 'Rytmus s tlumením (Palm Mute)', xp: 70, desc: 'Tlumení hranou dlaně pro perkusivní doprovod' },
    11: { title: 'Akord E dur & basový krok', xp: 75, desc: 'Plný durový akord a střídavý bas' },
    12: { title: 'Vybrnkávání (Fingerpicking)', xp: 80, desc: 'Hra bez trsátka – technika prstů pravé ruky' },
    13: { title: 'Stupnice pentatonika v Em', xp: 90, desc: 'Základní stupnice pro improvizaci a sóla' },
    14: { title: 'První kytarové sólo', xp: 100, desc: 'Frázování, bend a vibrato na pódiu' },
    15: { title: 'Power akordy & rockový styl', xp: 100, desc: 'Úderné power akordy pro elektrickou i akustickou kytaru' },
    16: { title: 'Píseň na Otevřené scéně', xp: 150, desc: 'Velké vystoupení se všemi zvládnutými technikami' }
  },

  /**
   * Check if current user is logged in as God (master account).
   */
  isGod() {
    return Boolean(window.Auth && typeof window.Auth.isGod === 'function' && window.Auth.isGod());
  },

  /**
   * Helper to format streak count with Czech declension.
   * e.g. 0 dní, 1 den, 2 dny, 3 dny, 4 dny, 5 dní...
   */
  formatStreak(count) {
    const s = Math.max(0, parseInt(count, 10) || 0);
    if (s === 0) return '0 dní';
    if (s === 1) return '1 den';
    if (s >= 2 && s <= 4) return `${s} dny`;
    return `${s} dní`;
  },

  /**
   * Application entry point.
   */
  init() {
    // 1. Audio unlock on first user gesture
    const unlockAudio = () => {
      if (window.Sounds) {
        window.Sounds.init();
      }
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('pointerdown', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    // 2. Setup sidebar navigation listeners
    this.setupSidebarEvents();

    // 3. Setup hashchange router
    window.addEventListener('hashchange', () => {
      if (window.Auth && window.Auth.isLoggedIn()) {
        this.navigate(window.location.hash || '#/dashboard');
      }
    });

    // 4. Check if user is logged in
    if (window.Auth && window.Auth.isLoggedIn()) {
      if (window.Progress && typeof window.Progress.updateStreak === 'function') {
        window.Progress.updateStreak();
      }
      this.showMainApp();
    } else {
      this.showLoginScreen();
    }
  },

  /**
   * Setup click handlers on sidebar navigation items.
   */
  setupSidebarEvents() {
    const sidebarItems = document.querySelectorAll('.sidebar-item[data-view]');
    sidebarItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const isGod = this.isGod();
        if (!isGod && item.classList.contains('locked')) {
          if (window.UI) {
            window.UI.showToast('Tato sekce je zatím zamčená.', 'info');
          }
          if (window.Sounds) {
            window.Sounds.playError();
          }
          return;
        }

        const view = item.getAttribute('data-view');
        if (view) {
          window.location.hash = `#/${view}`;
        }
      });
    });

    // Sidebar user card click -> profile
    const sidebarUser = document.getElementById('sidebar-user');
    if (sidebarUser) {
      sidebarUser.style.cursor = 'pointer';
      sidebarUser.onclick = () => {
        window.location.hash = '#/profile';
      };
    }
  },

  /**
   * Router and navigation coordinator.
   * @param {string} route - e.g. '#/dashboard', '#/lessons', '#/lesson/3', '#/profile'
   */
  navigate(route) {
    if (!route || route === '#' || route === '#/') {
      route = '#/dashboard';
    }

    const cleanRoute = route.replace(/^#\/?/, '');
    const parts = cleanRoute.split('/');
    const viewName = parts[0] || 'dashboard';
    const param = parts[1] || null;

    if (window.Sounds) {
      window.Sounds.playClick();
    }

    // Determine target view ID
    let targetViewId = 'view-dashboard';
    if (viewName === 'lesson' && param) {
      targetViewId = 'view-lesson-detail';
    } else {
      targetViewId = `view-${viewName}`;
    }

    // Update active sidebar item
    this.updateActiveSidebar(viewName === 'lesson' ? 'lessons' : viewName);

    // Show view container
    this.showView(targetViewId);

    // Render corresponding view content
    switch (viewName) {
      case 'dashboard':
        this.renderDashboard();
        break;

      case 'lessons':
        this.renderLessonsView();
        break;

      case 'lesson':
      case 'lesson-detail':
        this.renderLessonDetailView(parseInt(param || '1', 10));
        break;

      case 'profile':
        this.renderProfile();
        break;

      case 'songs':
      case 'practice':
      case 'tuner':
      case 'metronome':
        this.renderPlaceholderView(targetViewId, viewName);
        break;

      default:
        this.renderDashboard();
        break;
    }
  },

  /**
   * Update active class on sidebar items.
   * @param {string} currentNav
   */
  updateActiveSidebar(currentNav) {
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(item => {
      const view = item.getAttribute('data-view');
      if (view === currentNav) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  },

  /**
   * Display the requested view element and hide all others.
   * @param {string} viewId - ID of view element e.g. 'view-dashboard'
   */
  showView(viewId) {
    const allViews = document.querySelectorAll('.view');
    allViews.forEach(v => {
      v.classList.remove('active');
      v.classList.add('hidden');
      v.style.display = 'none';
    });

    const target = document.getElementById(viewId);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active');
      target.classList.add('animate-fadeIn');
      target.style.display = 'block';
    }

    this.currentView = viewId;

    // Scroll main content back to top smoothly
    const content = document.getElementById('content');
    if (content) {
      content.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  /**
   * Get unified user statistics from Progress module or localStorage.
   */
  getProgressData() {
    const p = window.Progress;
    let xp = 0;
    let streak = 0;
    let completed = [];

    if (p) {
      if (typeof p.getXP === 'function') xp = p.getXP();
      else if (p.data && typeof p.data.xp === 'number') xp = p.data.xp;
      else if (typeof p.xp === 'number') xp = p.xp;

      if (typeof p.getStreak === 'function') streak = p.getStreak();
      else if (p.data && p.data.streak && typeof p.data.streak.current === 'number') streak = p.data.streak.current;
      else if (typeof p.streak === 'number') streak = p.streak;

      if (typeof p.getCompletedLessons === 'function') completed = p.getCompletedLessons();
      else if (p.data && Array.isArray(p.data.completedLessons)) completed = p.data.completedLessons;
      else if (Array.isArray(p.completedLessons)) completed = p.completedLessons;
    }

    if (!xp && xp !== 0) {
      const stored = localStorage.getItem('melodrio_xp');
      if (stored) xp = parseInt(stored, 10) || 0;
    }
    if (typeof streak !== 'number') {
      const stored = localStorage.getItem('melodrio_streak');
      if (stored !== null) streak = parseInt(stored, 10) || 0;
    }
    if (typeof streak === 'object' && streak !== null) {
      streak = Number(streak.current) || 0;
    }
    streak = Math.max(0, Number(streak) || 0);

    if (!completed || completed.length === 0) {
      try {
        const stored = localStorage.getItem('melodrio_completed_lessons');
        if (stored) completed = JSON.parse(stored) || [];
      } catch (e) {
        completed = [];
      }
    }

    return { xp, streak, completed };
  },

  /**
   * Calculate rank, stage name, and progress percentage for a given XP.
   * @param {number} xp
   */
  getRankInfo(xp) {
    if (this.isGod()) {
      return {
        stageId: 7,
        stageName: 'Olymp',
        rankName: 'Bůh kytary',
        icon: '👑',
        currentXp: Math.max(10000, xp),
        minXp: 10000,
        nextXp: 10000,
        percent: 100,
        isMaxRank: true
      };
    }

    for (let i = this.STAGES.length - 1; i >= 0; i--) {
      const stage = this.STAGES[i];
      if (xp >= stage.minXp) {
        const nextStage = this.STAGES[i + 1] || null;
        const nextXp = nextStage ? nextStage.minXp : stage.maxXp;
        const span = nextStage ? (nextStage.minXp - stage.minXp) : 1000;
        const currentInStage = xp - stage.minXp;
        const percent = Math.min(100, Math.max(0, Math.round((currentInStage / span) * 100)));

        return {
          stageId: stage.id,
          stageName: stage.name,
          rankName: stage.rank,
          icon: stage.icon,
          currentXp: xp,
          minXp: stage.minXp,
          nextXp: nextXp,
          percent: percent,
          isMaxRank: !nextStage
        };
      }
    }

    return {
      stageId: 1,
      stageName: 'Garáž',
      rankName: 'Nováček',
      icon: '🏠',
      currentXp: xp,
      minXp: 0,
      nextXp: 500,
      percent: Math.min(100, Math.round((xp / 500) * 100)),
      isMaxRank: false
    };
  },

  /**
   * Retrieve lesson information by ID.
   * @param {number} id
   */
  getLessonInfo(id) {
    if (window.Lessons && typeof window.Lessons.getLesson === 'function') {
      const lesson = window.Lessons.getLesson(id);
      if (lesson) return lesson;
    }
    return this.LESSON_DATA[id] || {
      title: `Lekce ${id}`,
      xp: 50,
      desc: 'Kytarová výuková lekce'
    };
  },

  /**
   * Render Dashboard view: welcome header, stat cards, and story progression map.
   */
  renderDashboard() {
    const user = (window.Auth && window.Auth.getUser()) || { name: 'Kytarista', avatar: '🎸' };
    const { xp, streak, completed } = this.getProgressData();
    const rankInfo = this.getRankInfo(xp);

    // 1. Render #dashboard-header
    const headerContainer = document.getElementById('dashboard-header');
    if (headerContainer) {
      headerContainer.innerHTML = `
        <div class="card dashboard-welcome-card" style="
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 18px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(16px);
        ">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                <span style="font-size: 2.2rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));">${user.avatar || '🎸'}</span>
                <h1 style="margin: 0; font-size: 2rem; font-weight: 800; color: #f8fafc; letter-spacing: -0.02em;">
                  Ahoj, ${user.name}!
                </h1>
                <span class="rank-badge" style="
                  background: rgba(139, 92, 246, 0.25);
                  border: 1px solid rgba(139, 92, 246, 0.5);
                  color: #c4b5fd;
                  padding: 0.25rem 0.85rem;
                  border-radius: 9999px;
                  font-size: 0.85rem;
                  font-weight: 700;
                  display: inline-flex;
                  align-items: center;
                  gap: 0.35rem;
                ">
                  ${rankInfo.icon} ${rankInfo.rankName}
                </span>
              </div>
              <p style="margin: 0; color: #94a3b8; font-size: 1.05rem;">
                Tvá kytarová cesta: <strong style="color: #cbd5e1;">${rankInfo.stageName}</strong>. Každý den o krok blíže pódiu!
              </p>
            </div>

            <button class="btn btn-primary" onclick="App.continueCurrentLesson()" style="
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.75rem 1.4rem;
              font-weight: 700;
              border-radius: 12px;
              box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
            ">
              <span>Pokračovat ve výuce</span>
              <span style="font-size: 1.2rem;">▶</span>
            </button>
          </div>

          <!-- XP Progress Bar -->
          <div style="margin-top: 1.75rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.45rem;">
              <span style="color: #cbd5e1;">Úroveň: ${rankInfo.rankName} (${rankInfo.stageName})</span>
              <span style="color: #a78bfa;">${rankInfo.currentXp} / ${rankInfo.nextXp} XP (${rankInfo.percent}%)</span>
            </div>
            <div class="xp-bar" style="
              width: 100%;
              height: 12px;
              background: rgba(15, 23, 42, 0.6);
              border-radius: 9999px;
              overflow: hidden;
              border: 1px solid rgba(255, 255, 255, 0.08);
            ">
              <div class="xp-bar-fill" style="
                width: ${rankInfo.percent}%;
                height: 100%;
                background: linear-gradient(90deg, #8B5CF6 0%, #3B82F6 100%);
                border-radius: 9999px;
                transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
              "></div>
            </div>
          </div>
        </div>
      `;
    }

    // 2. Render #dashboard-stats
    const statsContainer = document.getElementById('dashboard-stats');
    if (statsContainer) {
      const completedCount = completed.length;
      statsContainer.innerHTML = `
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin: 1.5rem 0 2rem 0;
        ">
          <!-- Stat 1: Total XP -->
          <div class="card stat-card" style="
            background: rgba(30, 41, 59, 0.65);
            border: 1px solid rgba(245, 158, 11, 0.25);
            border-radius: 14px;
            padding: 1.25rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            backdrop-filter: blur(12px);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          ">
            <div style="
              width: 50px; height: 50px;
              border-radius: 12px;
              background: rgba(245, 158, 11, 0.15);
              border: 1px solid rgba(245, 158, 11, 0.3);
              display: flex; align-items: center; justify-content: center;
              font-size: 1.6rem;
            ">⭐</div>
            <div>
              <div style="font-size: 0.85rem; color: #94a3b8; font-weight: 500;">Celkem XP</div>
              <div style="font-size: 1.45rem; font-weight: 800; color: #f8fafc;">${xp} XP</div>
            </div>
          </div>

          <!-- Stat 2: Level / Rank -->
          <div class="card stat-card" style="
            background: rgba(30, 41, 59, 0.65);
            border: 1px solid rgba(139, 92, 246, 0.25);
            border-radius: 14px;
            padding: 1.25rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            backdrop-filter: blur(12px);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          ">
            <div style="
              width: 50px; height: 50px;
              border-radius: 12px;
              background: rgba(139, 92, 246, 0.15);
              border: 1px solid rgba(139, 92, 246, 0.3);
              display: flex; align-items: center; justify-content: center;
              font-size: 1.6rem;
            ">🏆</div>
            <div>
              <div style="font-size: 0.85rem; color: #94a3b8; font-weight: 500;">Aktuální hodnost</div>
              <div style="font-size: 1.45rem; font-weight: 800; color: #f8fafc;">${rankInfo.rankName}</div>
            </div>
          </div>

          <!-- Stat 3: Streak -->
          <div class="card stat-card" style="
            background: rgba(30, 41, 59, 0.65);
            border: 1px solid rgba(239, 68, 68, 0.25);
            border-radius: 14px;
            padding: 1.25rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            backdrop-filter: blur(12px);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          ">
            <div style="
              width: 50px; height: 50px;
              border-radius: 12px;
              background: rgba(239, 68, 68, 0.15);
              border: 1px solid rgba(239, 68, 68, 0.3);
              display: flex; align-items: center; justify-content: center;
              font-size: 1.6rem;
            ">🔥</div>
            <div>
              <div style="font-size: 0.85rem; color: #94a3b8; font-weight: 500;">Denní série</div>
              <div style="font-size: 1.45rem; font-weight: 800; color: #f8fafc;">
                ${this.formatStreak(streak)}
              </div>
            </div>
          </div>

          <!-- Stat 4: Completed Lessons -->
          <div class="card stat-card" style="
            background: rgba(30, 41, 59, 0.65);
            border: 1px solid rgba(16, 185, 129, 0.25);
            border-radius: 14px;
            padding: 1.25rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            backdrop-filter: blur(12px);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          ">
            <div style="
              width: 50px; height: 50px;
              border-radius: 12px;
              background: rgba(16, 185, 129, 0.15);
              border: 1px solid rgba(16, 185, 129, 0.3);
              display: flex; align-items: center; justify-content: center;
              font-size: 1.6rem;
            ">🎸</div>
            <div>
              <div style="font-size: 0.85rem; color: #94a3b8; font-weight: 500;">Dokončené lekce</div>
              <div style="font-size: 1.45rem; font-weight: 800; color: #f8fafc;">${completedCount} / 15</div>
            </div>
          </div>
        </div>

        ${this.isGod() ? `
        <!-- God Control Panel (Root Access) -->
        <div class="card god-control-panel mb-6" style="
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
          border: 2px solid rgba(245, 158, 11, 0.5);
          border-radius: 16px;
          padding: 1.5rem;
          margin: 1.5rem 0 2rem 0;
          box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.2);
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 2rem;">⚡👑</span>
              <div>
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #fbbf24;">
                  Administrátorská konzole (Režim Bůh)
                </h3>
                <p style="margin: 0.15rem 0 0 0; font-size: 0.85rem; color: #cbd5e1;">
                  Máš plnou kontrolu nad všemi 15 lekcemi, statistikami, odznaky a moduly aplikace.
                </p>
              </div>
            </div>
            <span class="badge" style="
              background: rgba(245, 158, 11, 0.25);
              border: 1px solid #f59e0b;
              color: #fbbf24;
              font-weight: 800;
              padding: 0.35rem 0.85rem;
              border-radius: 9999px;
              font-size: 0.8rem;
              letter-spacing: 0.05em;
            ">
              ROOT ACCESS • GOD MODE
            </span>
          </div>

          <!-- Quick Action Buttons -->
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.75rem;
            margin-bottom: 1.25rem;
          ">
            <button class="btn btn-secondary btn-sm" onclick="App.godUnlockAllLessons()" style="border-color: rgba(245, 158, 11, 0.5); color: #fde68a;">
              🔓 Odemknout všech 15 lekcí
            </button>
            <button class="btn btn-secondary btn-sm" onclick="App.godCompleteAllLessons()" style="border-color: rgba(16, 185, 129, 0.5); color: #a7f3d0;">
              ✅ Dokončit všech 15 lekcí
            </button>
            <button class="btn btn-secondary btn-sm" onclick="App.godSetMaxXP()" style="border-color: rgba(139, 92, 246, 0.5); color: #ddd6fe;">
              ⭐ Nastavit 10 000 XP (Olymp)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="App.godUnlockBadges()" style="border-color: rgba(59, 130, 246, 0.5); color: #bfdbfe;">
              🏆 Odemknout všech 16 odznaků
            </button>
            <button class="btn btn-secondary btn-sm" onclick="App.godAddStreak()" style="border-color: rgba(239, 68, 68, 0.5); color: #fca5a5;">
              🔥 Přidat +5 ke streak (+5 dní)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="App.godResetProgress()" style="border-color: rgba(148, 163, 184, 0.4); color: #cbd5e1;">
              🔄 Resetovat postup (pro testy)
            </button>
          </div>

          <!-- Jump to lesson and tools row -->
          <div style="
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
          ">
            <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
              <span style="font-size: 0.85rem; font-weight: 700; color: #94a3b8;">🚀 Rychlý skok:</span>
              <select id="god-lesson-jump-select" style="
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #f8fafc;
                padding: 0.35rem 0.65rem;
                border-radius: 8px;
                font-size: 0.85rem;
              ">
                ${Array.from({ length: 15 }, (_, i) => i + 1).map(id => {
                  const lesson = window.Lessons && window.Lessons.getLesson(id);
                  const title = lesson ? lesson.title : `Lekce ${id}`;
                  return `<option value="${id}">Lekce ${id}: ${title}</option>`;
                }).join('')}
              </select>
              <button class="btn btn-primary btn-sm" onclick="App.godJumpSelectedLesson()">
                Přejít do lekce →
              </button>
            </div>

            <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
              <span style="font-size: 0.85rem; font-weight: 700; color: #94a3b8;">🛠️ Moduly:</span>
              <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#/metronome'" style="font-size: 0.8rem;">⏱️ Metronom</button>
              <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#/tuner'" style="font-size: 0.8rem;">🔧 Ladička</button>
              <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#/practice'" style="font-size: 0.8rem;">🎯 Cvičení</button>
              <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#/songs'" style="font-size: 0.8rem;">🎵 Písničky</button>
            </div>
          </div>
        </div>
        ` : ''}
      `;
    }

    // 3. Render #story-map
    this.renderStoryMap();
  },

  /**
   * Helper to jump straight into the current active lesson.
   */
  continueCurrentLesson() {
    const { completed } = this.getProgressData();
    let currentId = 1;
    for (let i = 1; i <= 16; i++) {
      if (!completed.includes(i)) {
        currentId = i;
        break;
      }
    }
    window.location.hash = `#/lesson/${currentId}`;
  },

  /**
   * Render the visual progression journey map.
   * Full timeline for Stages 1 & 2; locked headers for Stages 3-6.
   */
  renderStoryMap() {
    const storyMap = document.getElementById('story-map');
    if (!storyMap) return;

    const { xp, completed } = this.getProgressData();
    const isGod = this.isGod();

    // Determine the current active lesson (first uncompleted)
    let currentLessonId = 1;
    for (let i = 1; i <= 16; i++) {
      if (!completed.includes(i)) {
        currentLessonId = i;
        break;
      }
    }

    let html = `
      <div class="story-map-container" style="
        position: relative;
        padding: 1rem 0 3rem 0;
        max-width: 860px;
        margin: 0 auto;
      ">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.75rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.35rem;">
            🗺️ Hudební cesta kytaristy
          </h2>
          <p style="color: #94a3b8; font-size: 0.95rem;">
            Postupuj lekci po lekci od garážových začátků až k vyprodaným stadionům.
          </p>
        </div>
    `;

    // Render Stage 1 (Garáž, 1-8) and Stage 2 (Otevřená scéna, 9-16)
    [1, 2].forEach(stageId => {
      const stage = this.STAGES.find(s => s.id === stageId);
      const isStageUnlocked = stageId === 1 || xp >= stage.minXp || completed.some(id => id >= 8);
      const isStageCompleted = stage.lessons.length > 0 &&
        Array.from({ length: stage.lessons[1] - stage.lessons[0] + 1 }, (_, i) => stage.lessons[0] + i)
          .every(id => completed.includes(id));

      html += `
        <div class="stage-section" style="margin-bottom: 3.5rem;">
          <!-- Stage Header -->
          <div class="stage-header" style="
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.9) 100%);
            border: 1px solid ${isStageCompleted ? 'rgba(16, 185, 129, 0.4)' : (isStageUnlocked ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)')};
            border-radius: 16px;
            padding: 1.25rem 1.75rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 2rem;
            backdrop-filter: blur(12px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          ">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="font-size: 2.2rem;">${stage.icon}</div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <h3 style="margin: 0; font-size: 1.35rem; font-weight: 800; color: #f8fafc;">
                    ${stage.id}. Etapa: ${stage.name}
                  </h3>
                  <span class="rank-badge" style="
                    background: rgba(139, 92, 246, 0.15);
                    border: 1px solid rgba(139, 92, 246, 0.35);
                    color: #c4b5fd;
                    padding: 0.2rem 0.6rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                  ">
                    ${stage.rank} (${stage.minXp} - ${stage.maxXp} XP)
                  </span>
                </div>
                <div style="color: #94a3b8; font-size: 0.85rem; margin-top: 0.2rem;">
                  Lekce ${stage.lessons[0]} až ${stage.lessons[1]}
                </div>
              </div>
            </div>

            <div>
              ${isStageCompleted
                ? '<span style="color: #10B981; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem;">✅ Splněno</span>'
                : (isStageUnlocked
                    ? '<span style="color: #A78BFA; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem;">⚡ Probíhá</span>'
                    : '<span style="color: #64748b; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem;">🔒 Zamčeno</span>')
              }
            </div>
          </div>

          <!-- Vertical Timeline with Nodes -->
          <div class="timeline-path-container" style="
            position: relative;
            padding: 1.5rem 0;
          ">
            <!-- Vertical connecting line -->
            <div class="timeline-vertical-line" style="
              position: absolute;
              top: 0;
              bottom: 0;
              left: 50%;
              width: 4px;
              background: linear-gradient(180deg, #10B981 0%, #8B5CF6 60%, rgba(255, 255, 255, 0.1) 100%);
              transform: translateX(-50%);
              border-radius: 2px;
              z-index: 1;
            "></div>

            <div class="timeline-nodes-list" style="
              position: relative;
              z-index: 2;
              display: flex;
              flex-direction: column;
              gap: 2.5rem;
            ">
      `;

      // Render individual lesson nodes for this stage
      const isGod = this.isGod();
      for (let lessonId = stage.lessons[0]; lessonId <= stage.lessons[1]; lessonId++) {
        const isCompleted = completed.includes(lessonId);
        const isCurrent = lessonId === currentLessonId;
        const isLocked = !isGod && !isCompleted && !isCurrent;
        const info = this.getLessonInfo(lessonId);

        // Alternating zigzag offset for game path appearance
        const isLeft = lessonId % 2 !== 0;

        let nodeClass = 'lesson-node';
        let nodeIcon = lessonId;
        let nodeBorderColor = '#475569';
        let nodeBgColor = 'rgba(30, 41, 59, 0.8)';
        let nodeShadow = 'none';

        if (isCompleted) {
          nodeClass += ' completed';
          nodeIcon = '✓';
          nodeBorderColor = '#10B981';
          nodeBgColor = 'rgba(16, 185, 129, 0.2)';
          nodeShadow = '0 0 16px rgba(16, 185, 129, 0.45)';
        } else if (isCurrent) {
          nodeClass += ' current animate-glow';
          nodeIcon = lessonId;
          nodeBorderColor = '#8B5CF6';
          nodeBgColor = 'rgba(139, 92, 246, 0.35)';
          nodeShadow = '0 0 24px rgba(139, 92, 246, 0.7)';
        } else if (isGod) {
          nodeClass += ' god-unlocked';
          nodeIcon = '⚡';
          nodeBorderColor = '#F59E0B';
          nodeBgColor = 'rgba(245, 158, 11, 0.2)';
          nodeShadow = '0 0 16px rgba(245, 158, 11, 0.4)';
        } else {
          nodeClass += ' locked';
          nodeIcon = '🔒';
          nodeBorderColor = '#334155';
          nodeBgColor = 'rgba(15, 23, 42, 0.7)';
        }

        html += `
          <div class="timeline-node-row" style="
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 100%;
          ">
            <!-- Node Clickable Wrapper -->
            <div class="node-wrapper" style="
              display: flex;
              align-items: center;
              gap: 1.25rem;
              flex-direction: ${isLeft ? 'row' : 'row-reverse'};
              width: 100%;
              max-width: 600px;
              justify-content: ${isLeft ? 'flex-end' : 'flex-start'};
              padding: ${isLeft ? '0 50% 0 0' : '0 0 0 50%'};
              box-sizing: border-box;
            ">
              <!-- Interactive Lesson Circle Node -->
              <div
                class="${nodeClass}"
                data-lesson-id="${lessonId}"
                onclick="App.onNodeClick(${lessonId}, ${isLocked})"
                title="${info.title}${isGod && !isCompleted ? ' (Odemčeno Bůh)' : ''}"
                style="
                  width: 58px;
                  height: 58px;
                  border-radius: 50%;
                  background: ${nodeBgColor};
                  border: 3px solid ${nodeBorderColor};
                  box-shadow: ${nodeShadow};
                  color: ${isCompleted ? '#10B981' : (isCurrent ? '#ffffff' : (isGod ? '#fde68a' : '#94a3b8'))};
                  font-size: ${isCompleted ? '1.5rem' : '1.15rem'};
                  font-weight: 800;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: ${isLocked ? 'not-allowed' : 'pointer'};
                  opacity: ${isLocked ? '0.6' : '1'};
                  transition: transform 0.2s ease, box-shadow 0.2s ease;
                  flex-shrink: 0;
                  z-index: 3;
                "
                onmouseover="if (!${isLocked}) this.style.transform='scale(1.1)';"
                onmouseout="this.style.transform='scale(1)';"
              >
                ${nodeIcon}
              </div>

              <!-- Lesson Info Pill Card -->
              <div
                class="lesson-info-pill"
                onclick="App.onNodeClick(${lessonId}, ${isLocked})"
                style="
                  background: rgba(30, 41, 59, 0.75);
                  border: 1px solid ${isCurrent ? 'rgba(139, 92, 246, 0.4)' : (isGod && !isCompleted ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.08)')};
                  border-radius: 12px;
                  padding: 0.65rem 1rem;
                  cursor: ${isLocked ? 'not-allowed' : 'pointer'};
                  opacity: ${isLocked ? '0.5' : '1'};
                  transition: all 0.2s ease;
                  max-width: 230px;
                  backdrop-filter: blur(8px);
                  text-align: ${isLeft ? 'right' : 'left'};
                "
              >
                <div style="font-size: 0.75rem; font-weight: 700; color: ${isCurrent ? '#a78bfa' : (isGod && !isCompleted ? '#fde68a' : '#94a3b8')};">
                  Lekce ${lessonId} • +${info.xp || 50} XP
                </div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${info.title}
                </div>
                <div style="font-size: 0.75rem; color: ${isCompleted ? '#10B981' : (isCurrent ? '#a78bfa' : (isGod ? '#fde68a' : '#64748b'))}; margin-top: 0.15rem; font-weight: ${isGod ? '700' : 'normal'};">
                  ${isCompleted ? '✓ Dokončeno' : (isCurrent ? '▶ Probíhá' : (isGod ? '⚡ Odemčeno (Bůh)' : '🔒 Zamčeno'))}
                </div>
              </div>
            </div>
          </div>
        `;
      }

      html += `
            </div>
          </div>
        </div>
      `;
    });

    // Render Locked Stages 3 to 6
    html += `
      <div class="locked-stages-section" style="margin-top: 2rem;">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <h3 style="color: ${isGod ? '#fde68a' : '#64748b'}; font-size: 1.15rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
            ${isGod ? '👑 Další etapy (Administrátorský přístup Bůh)' : '🔒 Další etapy (Připravují se)'}
          </h3>
        </div>
    `;

    [3, 4, 5, 6].forEach(stageId => {
      const stage = this.STAGES.find(s => s.id === stageId);
      html += `
        <div class="card stage-header ${isGod ? 'god-unlocked' : 'locked'}" style="
          background: ${isGod ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(245, 158, 11, 0.08) 100%)' : 'rgba(15, 23, 42, 0.5)'};
          border: 1px ${isGod ? 'solid rgba(245, 158, 11, 0.4)' : 'dashed rgba(255, 255, 255, 0.1)'};
          border-radius: 16px;
          padding: 1.25rem 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          opacity: ${isGod ? '1' : '0.65'};
        ">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 2rem; ${isGod ? '' : 'filter: grayscale(80%);'}">${stage.icon}</div>
            <div>
              <div style="font-weight: 700; font-size: 1.15rem; color: ${isGod ? '#fde68a' : '#94a3b8'};">
                ${stage.id}. Etapa: ${stage.name} ${isGod ? '👑' : ''}
              </div>
              <div style="font-size: 0.85rem; color: ${isGod ? '#cbd5e1' : '#64748b'};">
                ${isGod ? '⚡ Administrátorský přístup aktivní (připraveno pro další výstupy)' : `Vyžaduje hodnost <strong>${stage.rank}</strong> (${stage.minXp}+ XP)`}
              </div>
            </div>
          </div>
          <div style="
            background: ${isGod ? 'rgba(245, 158, 11, 0.2)' : 'rgba(30, 41, 59, 0.6)'};
            border: 1px solid ${isGod ? 'rgba(245, 158, 11, 0.4)' : 'transparent'};
            padding: 0.35rem 0.75rem;
            border-radius: 8px;
            font-size: 0.8rem;
            color: ${isGod ? '#fde68a' : '#94a3b8'};
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.4rem;
          ">
            <span>${isGod ? '👑 Odemčeno (Bůh)' : '🔒 Zamčeno'}</span>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    storyMap.innerHTML = html;
  },

  /**
   * Click handler for lesson nodes on the story map.
   * @param {number} lessonId
   * @param {boolean} isLocked
   */
  onNodeClick(lessonId, isLocked) {
    if (isLocked && !this.isGod()) {
      if (window.UI) {
        window.UI.showToast('Tato lekce je zatím zamčená. Dokonči nejprve předchozí lekce!', 'info');
      }
      if (window.Sounds) {
        window.Sounds.playError();
      }
      return;
    }

    window.location.hash = `#/lesson/${lessonId}`;
  },

  /**
   * Update sidebar user profile card and streak badge.
   */
  renderSidebar() {
    const isGod = this.isGod();
    const user = (window.Auth && window.Auth.getUser()) || { name: 'Kytarista', avatar: '🎸' };
    const { xp, streak } = this.getProgressData();
    const rankInfo = this.getRankInfo(xp);

    const displayName = isGod ? 'God (Administrátor)' : user.name;
    const displayAvatar = isGod ? '👑' : (user.avatar || '🎸');

    // Update #sidebar-user
    const sidebarUser = document.getElementById('sidebar-user');
    if (sidebarUser) {
      sidebarUser.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
          <div style="
            width: 44px; height: 44px;
            border-radius: 12px;
            background: ${isGod ? 'rgba(245, 158, 11, 0.25)' : 'rgba(139, 92, 246, 0.2)'};
            border: 2px solid ${isGod ? '#F59E0B' : 'rgba(139, 92, 246, 0.4)'};
            box-shadow: ${isGod ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none'};
            display: flex; align-items: center; justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
          ">
            ${displayAvatar}
          </div>
          <div style="overflow: hidden; flex: 1;">
            <div style="font-weight: 700; color: #f8fafc; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${displayName}
            </div>
            <div style="font-size: 0.75rem; color: ${isGod ? '#fde68a' : '#a78bfa'}; font-weight: 700; display: flex; align-items: center; gap: 0.25rem;">
              <span>${rankInfo.icon}</span>
              <span>${rankInfo.rankName}</span>
            </div>
          </div>
        </div>

        <!-- Mini XP bar in sidebar -->
        <div style="margin-top: 0.4rem;">
          <div class="xp-bar" style="height: 6px; background: rgba(15, 23, 42, 0.6); border-radius: 9999px; overflow: hidden;">
            <div class="xp-bar-fill" style="width: ${rankInfo.percent}%; height: 100%; background: ${isGod ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : '#8B5CF6'};"></div>
          </div>
        </div>
      `;
    }

    // Update #sidebar-streak
    const sidebarStreak = document.getElementById('sidebar-streak');
    if (sidebarStreak) {
      const streakCount = typeof streak === 'number' ? streak : (streak && streak.current ? streak.current : 0);
      sidebarStreak.innerHTML = `
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 700;
        ">
          <span>🔥</span>
          <span>${this.formatStreak(streakCount)}</span>
        </div>
      `;
    }

    // If God mode, unlock sidebar tool items (songs, practice, tuner, metronome)
    if (isGod) {
      ['songs', 'practice', 'tuner', 'metronome'].forEach(toolId => {
        const navItem = document.querySelector(`.sidebar-item[data-view="${toolId}"]`);
        if (navItem) {
          navItem.classList.remove('locked');
          const badge = navItem.querySelector('.coming-soon');
          if (badge) {
            badge.textContent = '⚡ Bůh';
            badge.style.background = 'rgba(245, 158, 11, 0.25)';
            badge.style.color = '#fde68a';
            badge.style.border = '1px solid rgba(245, 158, 11, 0.4)';
          }
        }
      });
    }
  },

  /**
   * Render Lessons Grid View (#view-lessons).
   */
  renderLessonsView() {
    if (window.Lessons && typeof window.Lessons.renderLessonList === 'function') {
      window.Lessons.renderLessonList();
      return;
    }
    if (window.Lessons && typeof window.Lessons.renderLessonsList === 'function') {
      window.Lessons.renderLessonsList();
      return;
    }

    const listContainer = document.getElementById('lessons-list');
    if (!listContainer) return;

    const { completed } = this.getProgressData();
    let currentLessonId = 1;
    for (let i = 1; i <= 16; i++) {
      if (!completed.includes(i)) {
        currentLessonId = i;
        break;
      }
    }

    let cardsHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; padding: 1rem 0;">
    `;

    for (let id = 1; id <= 16; id++) {
      const isCompleted = completed.includes(id);
      const isCurrent = id === currentLessonId;
      const isLocked = !isCompleted && !isCurrent;
      const info = this.getLessonInfo(id);

      cardsHtml += `
        <div class="card lesson-card" onclick="App.onNodeClick(${id}, ${isLocked})" style="
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid ${isCurrent ? '#8B5CF6' : (isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)')};
          border-radius: 14px;
          padding: 1.25rem;
          cursor: ${isLocked ? 'not-allowed' : 'pointer'};
          opacity: ${isLocked ? '0.6' : '1'};
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        ">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="
                background: ${isCompleted ? 'rgba(16, 185, 129, 0.2)' : (isCurrent ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.06)')};
                color: ${isCompleted ? '#10B981' : (isCurrent ? '#c4b5fd' : '#94a3b8')};
                padding: 0.2rem 0.6rem;
                border-radius: 6px;
                font-size: 0.8rem;
                font-weight: 700;
              ">
                Lekce ${id}
              </span>
              <span style="font-size: 0.8rem; color: #a78bfa; font-weight: 600;">+${info.xp} XP</span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #f8fafc; margin: 0 0 0.5rem 0;">
              ${info.title}
            </h3>
            <p style="font-size: 0.85rem; color: #94a3b8; margin: 0; line-height: 1.4;">
              ${info.desc}
            </p>
          </div>

          <div style="margin-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; font-weight: 600; color: ${isCompleted ? '#10B981' : (isCurrent ? '#8B5CF6' : '#64748b')};">
              ${isCompleted ? '✅ Dokončeno' : (isCurrent ? '▶ Aktuální' : '🔒 Zamčeno')}
            </span>
            <button class="btn btn-sm ${isCurrent ? 'btn-primary' : (isCompleted ? 'btn-secondary' : 'btn-ghost')}" style="border-radius: 8px;">
              ${isCompleted ? 'Opakovat' : (isCurrent ? 'Spustit' : 'Zamčeno')}
            </button>
          </div>
        </div>
      `;
    }

    cardsHtml += `</div>`;
    listContainer.innerHTML = cardsHtml;
  },

  /**
   * Render Lesson Detail View (#view-lesson-detail).
   * @param {number} lessonId
   */
  renderLessonDetailView(lessonId) {
    if (window.Lessons && typeof window.Lessons.renderLessonDetail === 'function') {
      window.Lessons.renderLessonDetail(lessonId);
      return;
    }

    const detailContainer = document.getElementById('lesson-detail');
    if (!detailContainer) return;

    const info = this.getLessonInfo(lessonId);

    detailContainer.innerHTML = `
      <div class="card" style="
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 16px;
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
        backdrop-filter: blur(14px);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <button class="btn btn-ghost" onclick="App.navigate('#/dashboard')">
            ← Zpět na přehled
          </button>
          <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd; padding: 0.3rem 0.8rem; border-radius: 9999px; font-weight: 700;">
            +${info.xp} XP
          </span>
        </div>

        <h1 style="font-size: 1.85rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.5rem;">
          Lekce ${lessonId}: ${info.title}
        </h1>
        <p style="color: #94a3b8; font-size: 1.05rem; margin-bottom: 2rem;">
          ${info.desc}
        </p>

        <div style="background: rgba(15, 23, 42, 0.6); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; border: 1px solid rgba(255, 255, 255, 0.08);">
          <h3 style="color: #f1f5f9; font-size: 1.15rem; margin-top: 0; margin-bottom: 0.75rem;">🎸 Co se v této lekci naučíš:</h3>
          <ul style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.8; margin: 0; padding-left: 1.25rem;">
            <li>Správné prstoklady a uvolněné držení rukou</li>
            <li>Rytmická přesnost s metronomem</li>
            <li>Praktické cvičení a interaktivní kvíz na závěr</li>
          </ul>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button class="btn btn-primary" onclick="App.completeLessonSimulation(${lessonId})" style="padding: 0.75rem 1.5rem; font-weight: 700; border-radius: 10px;">
            Dokončit lekci (+${info.xp} XP) 🎉
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Helper to simulate lesson completion when Lessons module is not yet attached.
   * @param {number} lessonId
   */
  completeLessonSimulation(lessonId) {
    const { xp, completed } = this.getProgressData();
    const info = this.getLessonInfo(lessonId);

    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      const newXp = xp + (info.xp || 50);

      localStorage.setItem('melodrio_xp', String(newXp));
      localStorage.setItem('melodrio_completed_lessons', JSON.stringify(completed));

      if (window.Progress && typeof window.Progress.addXP === 'function') {
        window.Progress.addXP(info.xp || 50);
      }
    }

    if (window.Sounds) {
      window.Sounds.playComplete();
    }
    if (window.UI) {
      window.UI.showConfetti();
      window.UI.showToast(`Skvělá práce! Lekce ${lessonId} dokončena (+${info.xp} XP).`, 'success');
    }

    setTimeout(() => {
      this.navigate('#/dashboard');
    }, 1200);
  },

  /**
   * Render User Profile view (#view-profile).
   */
  renderProfile() {
    if (window.Progress && typeof window.Progress.renderProfile === 'function') {
      window.Progress.renderProfile();
      return;
    }

    const profileContainer = document.getElementById('profile-content');
    if (!profileContainer) return;

    const user = (window.Auth && window.Auth.getUser()) || { name: 'Kytarista', avatar: '🎸', createdAt: new Date().toISOString() };
    const { xp, streak, completed } = this.getProgressData();
    const rankInfo = this.getRankInfo(xp);

    const formattedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('cs-CZ') : 'Dnes';

    profileContainer.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; padding: 1rem 0 3rem 0;">
        <!-- Profile Header Card -->
        <div class="card" style="
          background: rgba(30, 41, 59, 0.75);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 18px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.75rem;
          backdrop-filter: blur(14px);
        ">
          <div style="
            width: 84px; height: 84px;
            border-radius: 20px;
            background: rgba(139, 92, 246, 0.2);
            border: 3px solid #8B5CF6;
            display: flex; align-items: center; justify-content: center;
            font-size: 3rem;
            flex-shrink: 0;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
          ">
            ${user.avatar || '🎸'}
          </div>

          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <h2 style="font-size: 1.85rem; font-weight: 800; color: #f8fafc; margin: 0;">${user.name}</h2>
              <span class="rank-badge" style="
                background: rgba(139, 92, 246, 0.25);
                border: 1px solid rgba(139, 92, 246, 0.5);
                color: #c4b5fd;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.85rem;
                font-weight: 700;
              ">
                ${rankInfo.icon} ${rankInfo.rankName}
              </span>
            </div>
            <p style="color: #94a3b8; font-size: 0.95rem; margin: 0.35rem 0 0 0;">
              Členem Melodrio od: <strong>${formattedDate}</strong>
            </p>
          </div>
        </div>

        <!-- Badges & Achievements -->
        <div class="card" style="
          background: rgba(30, 41, 59, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.75rem;
        ">
          <h3 style="margin-top: 0; margin-bottom: 1.25rem; font-size: 1.25rem; font-weight: 700; color: #f8fafc;">
            🏅 Odznaky & Úspěchy
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;">
            <!-- Badge 1 -->
            <div class="badge ${completed.length >= 1 ? 'earned' : 'locked'}" style="
              background: ${completed.length >= 1 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.5)'};
              border: 1px solid ${completed.length >= 1 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.06)'};
              border-radius: 12px;
              padding: 1rem;
              display: flex;
              align-items: center;
              gap: 0.85rem;
              opacity: ${completed.length >= 1 ? '1' : '0.5'};
            ">
              <span style="font-size: 1.8rem;">🎸</span>
              <div>
                <div style="font-weight: 700; color: #f8fafc; font-size: 0.9rem;">První akord</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Zvládni 1. lekci</div>
              </div>
            </div>

            <!-- Badge 2 -->
            <div class="badge ${streak >= 3 ? 'earned' : 'locked'}" style="
              background: ${streak >= 3 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.5)'};
              border: 1px solid ${streak >= 3 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,0.06)'};
              border-radius: 12px;
              padding: 1rem;
              display: flex;
              align-items: center;
              gap: 0.85rem;
              opacity: ${streak >= 3 ? '1' : '0.5'};
            ">
              <span style="font-size: 1.8rem;">🔥</span>
              <div>
                <div style="font-weight: 700; color: #f8fafc; font-size: 0.9rem;">Zapálený hráč</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Série alespoň 3 dny</div>
              </div>
            </div>

            <!-- Badge 3 -->
            <div class="badge ${completed.length >= 8 ? 'earned' : 'locked'}" style="
              background: ${completed.length >= 8 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.5)'};
              border: 1px solid ${completed.length >= 8 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255,255,255,0.06)'};
              border-radius: 12px;
              padding: 1rem;
              display: flex;
              align-items: center;
              gap: 0.85rem;
              opacity: ${completed.length >= 8 ? '1' : '0.5'};
            ">
              <span style="font-size: 1.8rem;">🏠</span>
              <div>
                <div style="font-weight: 700; color: #f8fafc; font-size: 0.9rem;">Pán Garáže</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Dokonči celou 1. etapu</div>
              </div>
            </div>

            <!-- Badge 4 -->
            <div class="badge ${xp >= 500 ? 'earned' : 'locked'}" style="
              background: ${xp >= 500 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.5)'};
              border: 1px solid ${xp >= 500 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255,255,255,0.06)'};
              border-radius: 12px;
              padding: 1rem;
              display: flex;
              align-items: center;
              gap: 0.85rem;
              opacity: ${xp >= 500 ? '1' : '0.5'};
            ">
              <span style="font-size: 1.8rem;">⭐</span>
              <div>
                <div style="font-weight: 700; color: #f8fafc; font-size: 0.9rem;">Hvězdný start</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Získej 500 XP</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Audio Settings & Logout Card -->
        <div class="card" style="
          background: rgba(30, 41, 59, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.75rem;
        ">
          <h3 style="margin-top: 0; margin-bottom: 1.25rem; font-size: 1.25rem; font-weight: 700; color: #f8fafc;">
            ⚙️ Nastavení a systém
          </h3>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <!-- Sound toggle -->
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; color: #f8fafc;">Zvukové efekty aplikace</div>
                <div style="font-size: 0.85rem; color: #94a3b8;">Zvuková odezva tlačítek a fanfáry</div>
              </div>
              <button class="btn btn-sm ${window.Sounds && window.Sounds.enabled ? 'btn-primary' : 'btn-ghost'}" onclick="App.toggleSounds(this)" style="border-radius: 8px;">
                ${window.Sounds && window.Sounds.enabled ? '🔊 Zapnuto' : '🔇 Vypnuto'}
              </button>
            </div>

            <!-- Volume slider -->
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; color: #f8fafc;">Hlasitost tónů</div>
                <div style="font-size: 0.85rem; color: #94a3b8;">Nastavení hlasitosti syntetizátoru</div>
              </div>
              <input type="range" min="0" max="1" step="0.05" value="${window.Sounds ? window.Sounds.volume : 0.3}" oninput="if(window.Sounds) window.Sounds.setVolume(this.value);" style="width: 140px; accent-color: #8B5CF6;">
            </div>

            <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 0.5rem 0;">

            <!-- Logout button -->
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; color: #ef4444;">Odhlášení a reset profilu</div>
                <div style="font-size: 0.85rem; color: #94a3b8;">Odhlásí aktuálního uživatele z tohoto prohlížeče</div>
              </div>
              <button class="btn btn-danger btn-sm" onclick="Auth.logout()" style="border-radius: 8px; font-weight: 700;">
                Odhlásit se
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Sound toggle helper.
   * @param {HTMLElement} btn
   */
  toggleSounds(btn) {
    if (window.Sounds) {
      const enabled = window.Sounds.toggle();
      btn.textContent = enabled ? '🔊 Zapnuto' : '🔇 Vypnuto';
      btn.className = `btn btn-sm ${enabled ? 'btn-primary' : 'btn-ghost'}`;
      if (window.UI) {
        window.UI.showToast(enabled ? 'Zvuky byly zapnuty.' : 'Zvuky byly vypnuty.', 'info');
      }
    }
  },
  /**
   * God Mode / Admin Action: Unlock all 15 lessons
   */
  godUnlockAllLessons() {
    const all = Array.from({ length: 15 }, (_, i) => i + 1);
    localStorage.setItem('melodrio_completed_lessons', JSON.stringify(all));
    if (window.Progress && typeof window.Progress.initGodMode === 'function') {
      window.Progress.initGodMode();
    }
    if (window.UI) {
      window.UI.showToast('🔓 Všech 15 lekcí bylo odemčeno a zpřístupněno!', 'success');
      window.UI.showConfetti();
    }
    this.renderDashboard();
    this.renderSidebar();
  },

  /**
   * God Mode / Admin Action: Complete all 15 lessons with max XP
   */
  godCompleteAllLessons() {
    const all = Array.from({ length: 15 }, (_, i) => i + 1);
    localStorage.setItem('melodrio_completed_lessons', JSON.stringify(all));
    localStorage.setItem('melodrio_xp', '10000');
    if (window.Progress && typeof window.Progress.initGodMode === 'function') {
      window.Progress.initGodMode();
    }
    if (window.UI) {
      window.UI.showToast('✅ Všech 15 lekcí dokončeno se 100% skóre!', 'success');
      window.UI.showConfetti();
    }
    this.renderDashboard();
    this.renderSidebar();
  },

  /**
   * God Mode / Admin Action: Set maximum XP (10 000 XP - Olymp)
   */
  godSetMaxXP() {
    localStorage.setItem('melodrio_xp', '10000');
    if (window.Progress && window.Progress.state) {
      window.Progress.state.xp = 10000;
      if (typeof window.Progress.save === 'function') {
        window.Progress.save();
      }
    }
    if (window.UI) {
      window.UI.showToast('⭐ Nastaveno 10 000 XP – dosažena hodnost Bůh kytary!', 'success');
      window.UI.showConfetti();
    }
    this.renderDashboard();
    this.renderSidebar();
  },

  /**
   * God Mode / Admin Action: Unlock all 16 badges
   */
  godUnlockBadges() {
    const allBadgeIds = [
      'first_chord', 'streak_3', 'streak_7', 'streak_30',
      'garage_master', 'open_mic', 'stage_virtuoso',
      'speed_demon', 'tuner_pro', 'ear_master',
      'repertoire_5', 'repertoire_15', 'repertoire_25',
      'xp_500', 'xp_2000', 'god_guitar'
    ];
    localStorage.setItem('melodrio_badges', JSON.stringify(allBadgeIds));
    if (window.Progress && window.Progress.state) {
      window.Progress.state.badges = allBadgeIds;
      if (typeof window.Progress.save === 'function') {
        window.Progress.save();
      }
    }
    if (window.UI) {
      window.UI.showToast('🏆 Všech 16 odznaků bylo úspěšně odemčeno!', 'success');
      window.UI.showConfetti();
    }
    this.renderDashboard();
  },

  /**
   * God Mode / Admin Action: Add +5 to streak
   */
  godAddStreak() {
    let currentStreak = 0;
    try {
      const s = JSON.parse(localStorage.getItem('melodrio_streak') || '{}');
      currentStreak = typeof s.current === 'number' ? s.current : 0;
    } catch (e) {}
    const newStreak = currentStreak + 5;
    const streakObj = {
      current: newStreak,
      lastDate: new Date().toISOString().slice(0, 10),
      best: Math.max(newStreak, 10)
    };
    localStorage.setItem('melodrio_streak', JSON.stringify(streakObj));
    if (window.Progress && window.Progress.state) {
      window.Progress.state.streak = streakObj;
    }
    if (window.UI) {
      window.UI.showToast(`🔥 Přidáno +5 ke streak! Aktuálně: ${newStreak} dní`, 'success');
    }
    this.renderDashboard();
    this.renderSidebar();
  },

  /**
   * God Mode / Admin Action: Reset progress for testing
   */
  godResetProgress() {
    if (window.Progress && typeof window.Progress.resetProgress === 'function') {
      window.Progress.resetProgress();
    } else {
      localStorage.removeItem('melodrio_xp');
      localStorage.removeItem('melodrio_completed_lessons');
      localStorage.removeItem('melodrio_badges');
      localStorage.setItem('melodrio_streak', JSON.stringify({ current: 0, lastDate: null, best: 0 }));
    }
    if (window.UI) {
      window.UI.showToast('🔄 Postup byl resetován na výchozí hodnoty.', 'info');
    }
    this.renderDashboard();
    this.renderSidebar();
  },

  /**
   * God Mode / Admin Action: Jump to selected lesson
   */
  godJumpSelectedLesson() {
    const select = document.getElementById('god-lesson-jump-select');
    if (select && select.value) {
      window.location.hash = `#/lesson/${select.value}`;
    }
  },

  // 25 Song Repertoire
  SONGS_25: [
    { id: 1, title: 'Stánky', artist: 'Nedvědi', difficulty: 'Snadná', bpm: 105, chords: ['D', 'G', 'A'], lyrics: "U stánků na levnou krásu postávaj a smějou se času,\ns kapkou rumu v kafi marně touží po lidech...\nJen konce všech těch lásek zbyly někde v prachu cest." },
    { id: 2, title: 'Bedna od vodky', artist: 'Miki Ryvola', difficulty: 'Snadná', bpm: 120, chords: ['C', 'F', 'G', 'Am'], lyrics: "Pět neděl v chládku jsem si poseděl,\nteď v kapse prachy mám a starej cíl.\nV hospodě na rohu chci chvíli pít,\na starou bednu od vodky zas mít." },
    { id: 3, title: 'Slavíci z Madridu', artist: 'Waldemar Matuška', difficulty: 'Snadná', bpm: 110, chords: ['Am', 'E', 'Dm'], lyrics: "Nebe je modrý a zlatý, bílá je sluneční zář,\nhorko a sváteční šaty, vřava a lhostejná tvář.\nLalalalala lalala lalala lalalalala..." },
    { id: 4, title: 'Severní vítr', artist: 'Jaroslav Uhlíř', difficulty: 'Snadná', bpm: 95, chords: ['C', 'Am', 'F', 'G'], lyrics: "Jdu s děravou patou, mám horečku zlatou,\njsem chudý, jsem sláb, nemocen.\nHlava mě pálí a v modravé dáli\nse leskne a třpytí můj sen..." },
    { id: 5, title: "Knockin' on Heaven's Door", artist: 'Bob Dylan', difficulty: 'Snadná', bpm: 68, chords: ['G', 'D', 'Am', 'C'], lyrics: "Mama, take this badge off of me,\nI can't use it anymore.\nIt's gettin' dark, too dark for me to see,\nFeels like I'm knockin' on heaven's door." },
    { id: 6, title: 'Let It Be', artist: 'The Beatles', difficulty: 'Střední', bpm: 72, chords: ['C', 'G', 'Am', 'F'], lyrics: "When I find myself in times of trouble,\nMother Mary comes to me,\nSpeaking words of wisdom: Let it be.\nAnd in my hour of darkness she is standing right in front of me..." },
    { id: 7, title: 'Wonderwall', artist: 'Oasis', difficulty: 'Střední', bpm: 88, chords: ['Em', 'G', 'D', 'A7sus4'], lyrics: "Today is gonna be the day that they're gonna throw it back to you.\nBy now you should've somehow realized what you gotta do.\nI don't believe that anybody feels the way I do about you now." },
    { id: 8, title: 'Zombie', artist: 'The Cranberries', difficulty: 'Snadná', bpm: 84, chords: ['Em', 'C', 'G', 'D'], lyrics: "Another head hangs lowly, child is slowly taken.\nAnd the violence caused such silence, who are we mistaken?\nIn your head, in your head, they are fighting..." },
    { id: 9, title: 'Hallelujah', artist: 'Leonard Cohen', difficulty: 'Střední', bpm: 58, chords: ['C', 'Am', 'F', 'G', 'E'], lyrics: "Now I've heard there was a secret chord\nThat David played, and it pleased the Lord,\nBut you don't really care for music, do ya?\nIt goes like this: the fourth, the fifth, the minor fall, the major lift..." },
    { id: 10, title: 'Stand By Me', artist: 'Ben E. King', difficulty: 'Snadná', bpm: 118, chords: ['A', 'F#m', 'D', 'E'], lyrics: "When the night has come and the land is dark,\nAnd the moon is the only light we'll see.\nNo, I won't be afraid, oh, I won't be afraid,\nJust as long as you stand, stand by me." },
    { id: 11, title: 'House of the Rising Sun', artist: 'The Animals', difficulty: 'Pokročilá', bpm: 78, chords: ['Am', 'C', 'D', 'F', 'E'], lyrics: "There is a house in New Orleans they call the Rising Sun,\nAnd it's been the ruin of many a poor boy,\nAnd God, I know I'm one." },
    { id: 12, title: 'Wish You Were Here', artist: 'Pink Floyd', difficulty: 'Střední', bpm: 60, chords: ['Em', 'G', 'A7sus4', 'C', 'D'], lyrics: "So, so you think you can tell Heaven from Hell?\nBlue skies from pain?\nCan you tell a green field from a cold steel rail?\nA smile from a veil? Do you think you can tell?" },
    { id: 13, title: 'Riptide', artist: 'Vance Joy', difficulty: 'Snadná', bpm: 102, chords: ['Am', 'G', 'C', 'F'], lyrics: "I was scared of dentists and the dark,\nI was scared of pretty girls and starting conversations.\nOh, all my friends are turning green,\nYou're the magician's assistant in their dreams." },
    { id: 14, title: 'Hey Jude', artist: 'The Beatles', difficulty: 'Střední', bpm: 74, chords: ['F', 'C', 'C7', 'Bb'], lyrics: "Hey Jude, don't make it bad,\nTake a sad song and make it better.\nRemember to let her into your heart,\nThen you can start to make it better." },
    { id: 15, title: 'A Horse with No Name', artist: 'America', difficulty: 'Snadná', bpm: 122, chords: ['Em', 'D6/9'], lyrics: "On the first part of the journey, I was looking at all the life.\nThere were plants and birds and rocks and things,\nThere was sand and hills and rings.\nThe ocean is a desert with its life underground..." },
    { id: 16, title: 'Černí andělé', artist: 'Lucie', difficulty: 'Střední', bpm: 124, chords: ['Em', 'G', 'D', 'C'], lyrics: "Černí andělé v nás křídla rozprostřou,\ntisíc let už bdí a čekaj nad Prahou.\nSex je náš a dělá dobře mně i tobě,\nčerný anděl hlídá nás." },
    { id: 17, title: 'Tisíc mil', artist: 'Waldemar Matuška', difficulty: 'Snadná', bpm: 90, chords: ['G', 'Em', 'C', 'D'], lyrics: "V nohách mám už tisíc mil,\nstovky měst a stovky řek,\nnikde klid a nikde cíl,\njenom stín a prach a vděk..." },
    { id: 18, title: 'Kometa', artist: 'Jaromír Nohavica', difficulty: 'Střední', bpm: 110, chords: ['Am', 'Dm', 'E', 'C'], lyrics: "Spatřil jsem kometu, oblohou letěla,\nchtěl jsem jí zazpívat, ona mi zmizela.\nJako srnka, když v křoví zhasne,\njako když rozkvete poupě krásné..." },
    { id: 19, title: 'Jarošovský pivovar', artist: 'Argema', difficulty: 'Snadná', bpm: 130, chords: ['G', 'D', 'Em', 'C'], lyrics: "Léta tam stál, stát bude dál,\nten náš slavný pivovar.\nKde se pivo vaří, tam se dobře daří,\ntam je svět náš..." },
    { id: 20, title: 'Svařené víno', artist: 'Sem Tam', difficulty: 'Snadná', bpm: 98, chords: ['C', 'F', 'G'], lyrics: "Když venku mrzne, až praští mráz,\nsvařené víno zahřeje nás.\nHřebíček, skořice, plamínek plápolá,\ntenhle večer na kytaru zavolá..." },
    { id: 21, title: 'Bláznova ukolébavka', artist: 'Pavel Dobeš', difficulty: 'Snadná', bpm: 100, chords: ['D', 'A', 'G'], lyrics: "Máš, má ovečko, dávno spát,\ni píseň ptáků už doznává,\nzavři svá očka a nechej si zdát,\no tom, jak tě mám rád..." },
    { id: 22, title: 'Sweet Home Alabama', artist: 'Lynyrd Skynyrd', difficulty: 'Střední', bpm: 98, chords: ['D', 'C', 'G'], lyrics: "Big wheels keep on turnin',\nCarry me home to see my kin.\nSingin' songs about the south-land,\nI miss 'ole 'Bama once again and I think it's a sin." },
    { id: 23, title: 'Take Me Home, Country Roads', artist: 'John Denver', difficulty: 'Snadná', bpm: 82, chords: ['G', 'Em', 'D', 'C'], lyrics: "Almost Heaven, West Virginia,\nBlue Ridge Mountains, Shenandoah River.\nLife is old there, older than the trees,\nYounger than the mountains, growin' like a breeze." },
    { id: 24, title: "Ain't No Sunshine", artist: 'Bill Withers', difficulty: 'Střední', bpm: 78, chords: ['Am', 'Em', 'G', 'Dm'], lyrics: "Ain't no sunshine when she's gone,\nIt's not warm when she's away.\nAin't no sunshine when she's gone,\nAnd she's always gone too long anytime she goes away." },
    { id: 25, title: 'Perfect', artist: 'Ed Sheeran', difficulty: 'Snadná', bpm: 63, chords: ['G', 'Em', 'C', 'D'], lyrics: "I found a love for me,\nDarling, just dive right in and follow my lead.\nWell, I found a girl, beautiful and sweet,\nOh, I never knew you were the someone waiting for me." }
  ],

  // Metronome State
  _metroState: {
    bpm: 100,
    isPlaying: false,
    beatsPerBar: 4,
    currentBeat: 0,
    timer: null,
    audioCtx: null,
    tapTimes: []
  },

  // Tuner State
  _tunerState: {
    audioCtx: null,
    activeString: null,
    currentOsc: null,
    isListening: false
  },

  // Practice Quiz State
  _quizState: {
    index: 0,
    score: 0,
    answered: false,
    questions: [
      {
        q: 'Jaké prsty potřebuješ pro základní akord C dur?',
        options: ['1. prst na H struně, 2. na D, 3. na A', 'Všechny prsty na 2. pražci', 'Pouze 1. a 2. prst na tlustých strunách', 'Palec přes hmatník'],
        correct: 0,
        tip: '1. pražec H struny (C), 2. pražec D struny (E), 3. pražec A struny (C).'
      },
      {
        q: 'Kolik strun se rozeznívá při hraní akordu Em (E moll)?',
        options: ['Pouze 4 tenké struny', 'Všech 6 strun', 'Pouze 3 basové struny', '5 strun (bez tlustého E)'],
        correct: 1,
        tip: 'Akord Em má prsty na 5. a 4. struně (2. pražec) a zní všech 6 strun!'
      },
      {
        q: 'Který tón je základním tónem akordu G dur na kytaře?',
        options: ['Tón E na 6. struně', 'Tón G na 3. pražci 6. struny (E)', 'Tón C na 3. pražci A struny', 'Prázdná H struna'],
        correct: 1,
        tip: 'Základní basový tón G se nachází na 3. pražci tlusté E struny.'
      },
      {
        q: 'Který akord tvoří typický trojúhelníkový tvar na spodních třech strunách?',
        options: ['Am', 'D dur', 'F dur', 'C dur'],
        correct: 1,
        tip: 'Akord D dur využívá 1. a 2. prst na 2. pražci (G a tenké E) a 3. prst na 3. pražci (H).'
      }
    ]
  },

  /**
   * Render coming soon placeholder cards for tools (songs, practice, tuner, metronome),
   * OR render full interactive preview tools if user is in God mode.
   * @param {string} viewId
   * @param {string} toolName
   */
  renderPlaceholderView(viewId, toolName) {
    const view = document.getElementById(viewId);
    if (!view) return;

    // IF GOD MODE: render fully functional interactive tool preview!
    if (this.isGod()) {
      switch (toolName) {
        case 'metronome':
          this.renderGodMetronome(view);
          return;
        case 'tuner':
          this.renderGodTuner(view);
          return;
        case 'practice':
          this.renderGodPractice(view);
          return;
        case 'songs':
          this.renderGodSongs(view);
          return;
      }
    }

    // NORMAL USERS: Clean coming-soon card
    const titles = {
      songs: { title: 'Písničky a taby', icon: '🎶', desc: 'Knihovna skladeb s interaktivními akordy a texty.' },
      practice: { title: 'Trénink & Cvičení', icon: '🎯', desc: 'Rychlé tréninkové moduly pro trénink prstů a sluchu.' },
      tuner: { title: 'Kytarová ladička', icon: '🎚️', desc: 'Přesné ladění kytary přes mikrofon i tóny.' },
      metronome: { title: 'Metronom', icon: '⏱️', desc: 'Nastavitelný metronom s vizuálním a zvukovým rytmem.' }
    };

    const item = titles[toolName] || { title: 'Připravujeme', icon: '🎸', desc: 'Tento modul je právě ve vývoji.' };

    view.innerHTML = `
      <div class="card coming-soon-page" style="
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        padding: 3.5rem 2rem;
        text-align: center;
        max-width: 600px;
        margin: 2rem auto;
        backdrop-filter: blur(14px);
      ">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">${item.icon}</div>
        <h2 style="font-size: 1.75rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.5rem;">${item.title}</h2>
        <p style="color: #94a3b8; font-size: 1.05rem; margin-bottom: 2rem; line-height: 1.5;">${item.desc}</p>
        <div style="display: inline-block; background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.35); color: #c4b5fd; padding: 0.4rem 1rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; margin-bottom: 1.5rem;">
          🚀 Bude dostupné v příští aktualizaci
        </div>
        <div>
          <button class="btn btn-primary" onclick="App.navigate('#/dashboard')">
            Zpět na přehled
          </button>
        </div>
      </div>
    `;
  },

  /* ==========================================================================
     INTERACTIVE GOD TOOLS (Metronome, Tuner, Practice, Songs)
     ========================================================================== */

  /**
   * Render Interactive Metronome
   */
  renderGodMetronome(container) {
    const s = this._metroState;
    container.innerHTML = `
      <div style="max-width: 680px; margin: 1rem auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- God Mode Banner -->
        <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(30, 41, 59, 0.8)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.6rem; color: #fde68a; font-weight: 700; font-size: 0.9rem;">
            <span>👑 Administrátorský přístup:</span>
            <span style="color: #cbd5e1; font-weight: normal;">Interaktivní náhled modulu Metronom</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="App.navigate('#/dashboard')">← Dashboard</button>
        </div>

        <!-- Metronome Card -->
        <div class="card" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 20px; padding: 2.5rem; text-align: center; backdrop-filter: blur(14px); box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; font-weight: 700; margin-bottom: 0.5rem;">
            Rytmický trenér
          </div>
          <div style="font-size: 4.5rem; font-weight: 900; color: #f8fafc; font-family: monospace; line-height: 1; margin-bottom: 0.5rem;">
            <span id="metro-bpm-val">${s.bpm}</span>
            <span style="font-size: 1.25rem; color: #94a3b8; font-weight: 600;">BPM</span>
          </div>
          <div id="metro-tempo-label" style="color: #cbd5e1; font-size: 1.05rem; font-weight: 600; margin-bottom: 2rem;">
            ${this.getTempoName(s.bpm)}
          </div>

          <!-- Visual Beat Indicators -->
          <div id="metro-beats-container" style="display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 2rem;">
            ${Array.from({ length: s.beatsPerBar }, (_, i) => `
              <div id="metro-beat-${i}" style="width: 20px; height: 20px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.2); transition: all 0.1s ease;"></div>
            `).join('')}
          </div>

          <!-- Slider and Quick Step Buttons -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto;">
            <button class="btn btn-secondary btn-sm" onclick="App.changeMetronomeBpm(-5)" style="border-radius: 8px; font-weight: 700;">-5</button>
            <button class="btn btn-secondary btn-sm" onclick="App.changeMetronomeBpm(-1)" style="border-radius: 8px; font-weight: 700;">-1</button>
            <input type="range" id="metro-slider" min="40" max="240" value="${s.bpm}" oninput="App.setMetronomeBpm(this.value)" style="flex: 1; accent-color: #8B5CF6; height: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="App.changeMetronomeBpm(1)" style="border-radius: 8px; font-weight: 700;">+1</button>
            <button class="btn btn-secondary btn-sm" onclick="App.changeMetronomeBpm(5)" style="border-radius: 8px; font-weight: 700;">+5</button>
          </div>

          <!-- Time signature and Controls -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(15, 23, 42, 0.6); padding: 0.35rem 0.75rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
              <span style="font-size: 0.85rem; color: #94a3b8; font-weight: 600;">Takt:</span>
              <select onchange="App.setMetronomeBeats(this.value)" style="background: transparent; color: #f8fafc; border: 0; font-weight: 700; cursor: pointer; outline: none;">
                <option value="2" ${s.beatsPerBar === 2 ? 'selected' : ''}>2/4</option>
                <option value="3" ${s.beatsPerBar === 3 ? 'selected' : ''}>3/4</option>
                <option value="4" ${s.beatsPerBar === 4 ? 'selected' : ''}>4/4</option>
                <option value="6" ${s.beatsPerBar === 6 ? 'selected' : ''}>6/8</option>
              </select>
            </div>

            <button class="btn btn-secondary" onclick="App.tapTempo()" style="border-radius: 10px; font-weight: 700; padding: 0.5rem 1rem;">
              🖐️ Tap Tempo
            </button>
          </div>

          <!-- Big Play / Stop Button -->
          <button id="metro-play-btn" class="btn ${s.isPlaying ? 'btn-danger' : 'btn-primary'} btn-lg" onclick="App.toggleMetronome()" style="padding: 1rem 3rem; font-size: 1.25rem; border-radius: 14px; font-weight: 800; box-shadow: 0 4px 20px ${s.isPlaying ? 'rgba(239, 68, 68, 0.4)' : 'rgba(139, 92, 246, 0.4)'};">
            ${s.isPlaying ? '⏹ Zastavit' : '▶ Spustit metronom'}
          </button>
        </div>
      </div>
    `;
  },

  getTempoName(bpm) {
    if (bpm < 60) return 'Largo (velmi pomalu)';
    if (bpm < 76) return 'Adagio (pomalu)';
    if (bpm < 108) return 'Andante (krokem)';
    if (bpm < 120) return 'Moderato (středně)';
    if (bpm < 168) return 'Allegro (rychle)';
    if (bpm < 200) return 'Vivace (živě)';
    return 'Presto (velmi rychle)';
  },

  setMetronomeBpm(val) {
    const bpm = Math.max(40, Math.min(240, parseInt(val, 10) || 100));
    this._metroState.bpm = bpm;
    const bpmEl = document.getElementById('metro-bpm-val');
    const labelEl = document.getElementById('metro-tempo-label');
    const sliderEl = document.getElementById('metro-slider');
    if (bpmEl) bpmEl.textContent = bpm;
    if (labelEl) labelEl.textContent = this.getTempoName(bpm);
    if (sliderEl && sliderEl.value != bpm) sliderEl.value = bpm;

    if (this._metroState.isPlaying) {
      clearInterval(this._metroState.timer);
      const intervalMs = (60 / bpm) * 1000;
      this._metroState.timer = setInterval(() => this.tickMetronome(), intervalMs);
    }
  },

  changeMetronomeBpm(delta) {
    this.setMetronomeBpm(this._metroState.bpm + delta);
  },

  setMetronomeBeats(val) {
    this._metroState.beatsPerBar = parseInt(val, 10) || 4;
    this._metroState.currentBeat = 0;
    const view = document.getElementById('view-metronome');
    if (view) this.renderGodMetronome(view);
  },

  toggleMetronome() {
    const s = this._metroState;
    if (s.isPlaying) {
      clearInterval(s.timer);
      s.isPlaying = false;
      s.currentBeat = 0;
      this.clearBeatIndicators();
    } else {
      s.isPlaying = true;
      s.currentBeat = 0;
      const intervalMs = (60 / s.bpm) * 1000;
      this.tickMetronome();
      s.timer = setInterval(() => this.tickMetronome(), intervalMs);
    }
    const btn = document.getElementById('metro-play-btn');
    if (btn) {
      btn.className = `btn ${s.isPlaying ? 'btn-danger' : 'btn-primary'} btn-lg`;
      btn.innerHTML = s.isPlaying ? '⏹ Zastavit' : '▶ Spustit metronom';
      btn.style.boxShadow = s.isPlaying ? '0 4px 20px rgba(239, 68, 68, 0.4)' : '0 4px 20px rgba(139, 92, 246, 0.4)';
    }
  },

  tickMetronome() {
    const s = this._metroState;
    const accent = s.currentBeat === 0;
    this.playMetronomeClick(accent);

    // Update visual dot indicators
    for (let i = 0; i < s.beatsPerBar; i++) {
      const dot = document.getElementById(`metro-beat-${i}`);
      if (dot) {
        if (i === s.currentBeat) {
          dot.style.background = accent ? '#F59E0B' : '#8B5CF6';
          dot.style.transform = 'scale(1.4)';
          dot.style.boxShadow = accent ? '0 0 16px #F59E0B' : '0 0 12px #8B5CF6';
        } else {
          dot.style.background = 'rgba(255,255,255,0.15)';
          dot.style.transform = 'scale(1)';
          dot.style.boxShadow = 'none';
        }
      }
    }

    s.currentBeat = (s.currentBeat + 1) % s.beatsPerBar;
  },

  clearBeatIndicators() {
    for (let i = 0; i < this._metroState.beatsPerBar; i++) {
      const dot = document.getElementById(`metro-beat-${i}`);
      if (dot) {
        dot.style.background = 'rgba(255,255,255,0.15)';
        dot.style.transform = 'scale(1)';
        dot.style.boxShadow = 'none';
      }
    }
  },

  playMetronomeClick(accent) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this._metroState.audioCtx) {
        this._metroState.audioCtx = new AudioCtx();
      }
      const ctx = this._metroState.audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(accent ? 1200 : 800, ctx.currentTime);

      gain.gain.setValueAtTime(accent ? 0.35 : 0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Metronome audio error:', e);
    }
  },

  tapTempo() {
    const now = Date.now();
    const t = this._metroState.tapTimes;
    t.push(now);
    if (t.length > 4) t.shift();
    if (t.length >= 2) {
      const intervals = [];
      for (let i = 1; i < t.length; i++) {
        intervals.push(t[i] - t[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (avgInterval > 200 && avgInterval < 2000) {
        const bpm = Math.round(60000 / avgInterval);
        this.setMetronomeBpm(bpm);
      }
    }
  },

  /**
   * Render Interactive Tuner
   */
  renderGodTuner(container) {
    const strings = [
      { num: 6, note: 'E', name: '6. E (Tlusté E)', freq: 82.41 },
      { num: 5, note: 'A', name: '5. A', freq: 110.00 },
      { num: 4, note: 'D', name: '4. D', freq: 146.83 },
      { num: 3, note: 'G', name: '3. G', freq: 196.00 },
      { num: 2, note: 'H', name: '2. H (B)', freq: 246.94 },
      { num: 1, note: 'E', name: '1. E (Tenké E)', freq: 329.63 }
    ];

    container.innerHTML = `
      <div style="max-width: 720px; margin: 1rem auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- God Mode Banner -->
        <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(30, 41, 59, 0.8)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.6rem; color: #fde68a; font-weight: 700; font-size: 0.9rem;">
            <span>👑 Administrátorský přístup:</span>
            <span style="color: #cbd5e1; font-weight: normal;">Interaktivní kytarová ladička (připraveno pro Výstup 3)</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="App.navigate('#/dashboard')">← Dashboard</button>
        </div>

        <!-- Tuner Dial & Needle Card -->
        <div class="card" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 20px; padding: 2.25rem; text-align: center; backdrop-filter: blur(14px);">
          <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; font-weight: 700; margin-bottom: 0.25rem;">
            Chromatická ladička
          </div>
          <div id="tuner-note-display" style="font-size: 4rem; font-weight: 900; color: #f8fafc; font-family: monospace; line-height: 1.1;">
            E<span style="font-size: 1.5rem; color: #94a3b8;">2</span>
          </div>
          <div id="tuner-freq-display" style="color: #cbd5e1; font-size: 1rem; font-weight: 600; margin-bottom: 1.5rem;">
            Referenční tón: 82.41 Hz
          </div>

          <!-- Needle Meter -->
          <div style="position: relative; width: 100%; max-width: 440px; margin: 0 auto 1.5rem auto; height: 70px; background: rgba(15, 23, 42, 0.7); border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 1.5rem 0.75rem 1.5rem; box-sizing: border-box;">
            <!-- Scale markings -->
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; font-weight: 700; margin-bottom: 0.5rem;">
              <span>-50 ct</span>
              <span style="color: #10B981;">0 (OK)</span>
              <span>+50 ct</span>
            </div>
            <!-- Center In-Tune line -->
            <div style="position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: #10B981; transform: translateX(-50%); opacity: 0.8;"></div>
            <!-- Needle -->
            <div id="tuner-needle" style="position: absolute; top: 8px; bottom: 8px; left: 50%; width: 4px; background: #F59E0B; transform: translateX(-50%); border-radius: 2px; box-shadow: 0 0 10px #F59E0B; transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);"></div>
          </div>

          <div id="tuner-status-badge" style="display: inline-block; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #a7f3d0; padding: 0.35rem 1.25rem; border-radius: 9999px; font-weight: 700; font-size: 0.9rem; margin-bottom: 2rem;">
            ✓ Perfektně naladěno
          </div>

          <!-- Strings List (Click to play tone) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.75rem; margin-top: 1rem;">
            ${strings.map(s => `
              <button
                class="btn btn-secondary tuner-string-btn"
                id="tuner-str-${s.note}${s.num}"
                onclick="App.playTunerTone(${s.freq}, '${s.note}', ${s.num})"
                style="padding: 0.85rem 0.5rem; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; border-color: rgba(255,255,255,0.12);"
              >
                <span style="font-size: 1.35rem; font-weight: 800; color: #f8fafc;">${s.note}</span>
                <span style="font-size: 0.75rem; color: #94a3b8;">${s.name}</span>
                <span style="font-size: 0.7rem; color: #a78bfa;">${s.freq} Hz</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  playTunerTone(freq, note, num) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this._tunerState.audioCtx) {
        this._tunerState.audioCtx = new AudioCtx();
      }
      const ctx = this._tunerState.audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      if (this._tunerState.currentOsc) {
        try { this._tunerState.currentOsc.stop(); } catch (e) {}
        this._tunerState.currentOsc = null;
      }

      // Update UI displays
      const noteEl = document.getElementById('tuner-note-display');
      const freqEl = document.getElementById('tuner-freq-display');
      const needleEl = document.getElementById('tuner-needle');
      if (noteEl) noteEl.innerHTML = `${note}<span style="font-size: 1.5rem; color: #94a3b8;">${num}</span>`;
      if (freqEl) freqEl.textContent = `Referenční tón: ${freq} Hz`;

      // Slight needle wiggle for realistic feel
      if (needleEl) {
        needleEl.style.left = '48%';
        setTimeout(() => { if (needleEl) needleEl.style.left = '51%'; }, 150);
        setTimeout(() => { if (needleEl) needleEl.style.left = '50%'; }, 350);
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.0);
      this._tunerState.currentOsc = osc;

      if (window.UI) {
        window.UI.showToast(`Přehrávám tón ${note} (${freq} Hz)`, 'info');
      }
    } catch (e) {
      console.warn('Tuner tone error:', e);
    }
  },

  /**
   * Render Interactive Practice Module
   */
  renderGodPractice(container) {
    const q = this._quizState.questions[this._quizState.index];
    const chords = [
      { name: 'C dur', diagram: 'x 3 2 0 1 0', desc: 'Ukazovák 1. pražec H, prostředník 2. pražec D, prsteník 3. pražec A.' },
      { name: 'G dur', diagram: '3 2 0 0 0 3', desc: 'Prostředník 2. pražec A, prsteník 3. pražec tlusté E, malíček 3. pražec tenké E.' },
      { name: 'D dur', diagram: 'x x 0 2 3 2', desc: 'Ukazovák 2. pražec G, prsteník 3. pražec H, prostředník 2. pražec tenké E.' },
      { name: 'E moll', diagram: '0 2 2 0 0 0', desc: 'Prostředník 2. pražec A, prsteník 2. pražec D. Zní všech 6 strun.' },
      { name: 'A moll', diagram: 'x 0 2 2 1 0', desc: 'Ukazovák 1. pražec H, prostředník 2. pražec D, prsteník 2. pražec G.' },
      { name: 'F dur', diagram: '1 3 3 2 1 1', desc: 'Bariérový akord: ukazovák přes 1. pražec všech strun.' }
    ];

    container.innerHTML = `
      <div style="max-width: 820px; margin: 1rem auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- God Mode Banner -->
        <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(30, 41, 59, 0.8)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.6rem; color: #fde68a; font-weight: 700; font-size: 0.9rem;">
            <span>👑 Administrátorský přístup:</span>
            <span style="color: #cbd5e1; font-weight: normal;">Cvičení & Interaktivní akordový kvíz</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="App.navigate('#/dashboard')">← Dashboard</button>
        </div>

        <!-- Section 1: Interactive Chord Quiz Card -->
        <div class="card" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(139, 92, 246, 0.35); border-radius: 20px; padding: 2rem; backdrop-filter: blur(14px);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.5rem;">🎯</span>
              <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #f8fafc;">
                Akordový kvíz (Otázka ${this._quizState.index + 1} ze 4)
              </h3>
            </div>
            <span style="background: rgba(16, 185, 129, 0.2); color: #a7f3d0; border: 1px solid rgba(16, 185, 129, 0.4); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 700;">
              Skóre: ${this._quizState.score} XP
            </span>
          </div>

          <p style="font-size: 1.15rem; color: #f1f5f9; font-weight: 600; margin-bottom: 1.5rem; line-height: 1.5;">
            ${q.q}
          </p>

          <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem; margin-bottom: 1.5rem;">
            ${q.options.map((opt, i) => `
              <button
                class="btn btn-secondary quiz-opt-btn"
                onclick="App.answerPracticeQuiz(${i})"
                style="text-align: left; padding: 0.85rem 1.25rem; font-size: 0.95rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.6);"
              >
                <span>${opt}</span>
                <span class="opt-badge" style="font-size: 0.85rem; color: #94a3b8;">Vybrat →</span>
              </button>
            `).join('')}
          </div>

          <div id="quiz-feedback-box" style="display: none; padding: 1rem 1.25rem; border-radius: 12px; margin-bottom: 1rem;"></div>

          <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-primary" onclick="App.nextPracticeQuiz()" style="border-radius: 10px; font-weight: 700;">
              Další otázka →
            </button>
          </div>
        </div>

        <!-- Section 2: Chord Library Quick Reference -->
        <div class="card" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; padding: 1.75rem;">
          <h4 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: #f8fafc; font-weight: 700;">
            🎸 Rychlá přehlídka akordů pro začátečníky:
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;">
            ${chords.map(c => `
              <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <strong style="font-size: 1.15rem; color: #fde68a;">${c.name}</strong>
                  <span style="font-family: monospace; font-size: 0.75rem; color: #a78bfa; background: rgba(139, 92, 246, 0.2); padding: 0.15rem 0.4rem; border-radius: 4px;">${c.diagram}</span>
                </div>
                <p style="font-size: 0.8rem; color: #94a3b8; margin: 0; line-height: 1.4;">${c.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  answerPracticeQuiz(index) {
    const q = this._quizState.questions[this._quizState.index];
    const box = document.getElementById('quiz-feedback-box');
    if (!box) return;

    box.style.display = 'block';
    if (index === q.correct) {
      this._quizState.score += 25;
      box.style.background = 'rgba(16, 185, 129, 0.2)';
      box.style.border = '1px solid rgba(16, 185, 129, 0.4)';
      box.style.color = '#a7f3d0';
      box.innerHTML = `<strong>✅ Správně! (+25 XP)</strong> ${q.tip}`;
      if (window.Sounds) window.Sounds.playComplete();
      if (window.UI) window.UI.showConfetti();
    } else {
      box.style.background = 'rgba(239, 68, 68, 0.2)';
      box.style.border = '1px solid rgba(239, 68, 68, 0.4)';
      box.style.color = '#fca5a5';
      box.innerHTML = `<strong>❌ Zkus to znovu!</strong> ${q.tip}`;
      if (window.Sounds) window.Sounds.playError();
    }
  },

  nextPracticeQuiz() {
    this._quizState.index = (this._quizState.index + 1) % this._quizState.questions.length;
    const view = document.getElementById('view-practice');
    if (view) this.renderGodPractice(view);
  },

  /**
   * Render Interactive 25-Song Repertoire Repertoire
   */
  renderGodSongs(container, query = '', filterDiff = 'all') {
    let filtered = this.SONGS_25;
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
    }
    if (filterDiff !== 'all') {
      filtered = filtered.filter(s => s.difficulty === filterDiff);
    }

    container.innerHTML = `
      <div style="max-width: 900px; margin: 1rem auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- God Mode Banner -->
        <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(30, 41, 59, 0.8)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.6rem; color: #fde68a; font-weight: 700; font-size: 0.9rem;">
            <span>👑 Administrátorský přístup:</span>
            <span style="color: #cbd5e1; font-weight: normal;">Knihovna 25 skladeb s akordy a texty</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="App.navigate('#/dashboard')">← Dashboard</button>
        </div>

        <!-- Filter Bar -->
        <div class="card" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 1.25rem; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <input
            type="text"
            placeholder="🔍 Hledat píseň nebo interpreta..."
            value="${query}"
            oninput="App.renderGodSongs(document.getElementById('view-songs'), this.value, '${filterDiff}')"
            style="flex: 1; min-width: 200px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 0.6rem 1rem; color: #f8fafc; font-size: 0.9rem;"
          >
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-sm ${filterDiff === 'all' ? 'btn-primary' : 'btn-ghost'}" onclick="App.renderGodSongs(document.getElementById('view-songs'), '${query}', 'all')" style="border-radius: 8px;">Vše (${this.SONGS_25.length})</button>
            <button class="btn btn-sm ${filterDiff === 'Snadná' ? 'btn-primary' : 'btn-ghost'}" onclick="App.renderGodSongs(document.getElementById('view-songs'), '${query}', 'Snadná')" style="border-radius: 8px;">Snadné</button>
            <button class="btn btn-sm ${filterDiff === 'Střední' ? 'btn-primary' : 'btn-ghost'}" onclick="App.renderGodSongs(document.getElementById('view-songs'), '${query}', 'Střední')" style="border-radius: 8px;">Střední</button>
          </div>
        </div>

        <!-- Songs Grid (25 songs) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1rem;">
          ${filtered.map(s => `
            <div
              class="card song-card"
              onclick="App.showSongModal(${s.id})"
              style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 1.25rem; cursor: pointer; transition: transform 0.2s ease, border-color 0.2s ease; display: flex; flex-direction: column; justify-content: space-between;"
              onmouseover="this.style.transform='translateY(-3px)'; this.style.borderColor='rgba(139, 92, 246, 0.5)';"
              onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255, 255, 255, 0.08)';"
            >
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                  <span style="font-size: 0.75rem; font-weight: 700; color: #a78bfa; background: rgba(139, 92, 246, 0.15); padding: 0.2rem 0.5rem; border-radius: 6px;">
                    #${s.id}
                  </span>
                  <span style="font-size: 0.75rem; font-weight: 700; color: ${s.difficulty === 'Snadná' ? '#10B981' : (s.difficulty === 'Střední' ? '#F59E0B' : '#EF4444')};">
                    ${s.difficulty}
                  </span>
                </div>
                <h3 style="font-size: 1.1rem; font-weight: 800; color: #f8fafc; margin: 0 0 0.25rem 0;">
                  ${s.title}
                </h3>
                <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.85rem;">
                  ${s.artist} • ${s.bpm} BPM
                </div>
              </div>

              <div>
                <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                  ${s.chords.map(c => `
                    <span style="font-size: 0.75rem; font-weight: 700; color: #fde68a; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.15rem 0.45rem; border-radius: 6px;">
                      ${c}
                    </span>
                  `).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.6rem;">
                  <span style="font-size: 0.8rem; color: #64748b;">Klikni pro náhled</span>
                  <span style="font-size: 0.8rem; color: #a78bfa; font-weight: 700;">Zobrazit text →</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Floating Song Detail Modal -->
      <div id="song-modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(8px); padding: 1.5rem;" onclick="if(event.target === this) App.closeSongModal();">
        <div id="song-modal-content" class="card" style="background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(139, 92, 246, 0.4); border-radius: 20px; max-width: 650px; width: 100%; padding: 2rem; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
        </div>
      </div>
    `;
  },

  showSongModal(songId) {
    const song = this.SONGS_25.find(s => s.id === songId);
    if (!song) return;
    const overlay = document.getElementById('song-modal-overlay');
    const content = document.getElementById('song-modal-content');
    if (!overlay || !content) return;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
        <div>
          <span style="font-size: 0.8rem; font-weight: 700; color: #a78bfa; background: rgba(139, 92, 246, 0.2); padding: 0.2rem 0.6rem; border-radius: 6px;">
            Skladba #${song.id} • ${song.difficulty} • ${song.bpm} BPM
          </span>
          <h2 style="font-size: 1.75rem; font-weight: 900; color: #f8fafc; margin: 0.5rem 0 0.2rem 0;">
            ${song.title}
          </h2>
          <div style="font-size: 1rem; color: #94a3b8; font-weight: 600;">
            ${song.artist}
          </div>
        </div>
        <button class="btn btn-ghost" onclick="App.closeSongModal()" style="font-size: 1.5rem; line-height: 1; padding: 0.4rem 0.8rem; border-radius: 8px;">✕</button>
      </div>

      <div style="margin-bottom: 1.5rem; background: rgba(15, 23, 42, 0.6); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 0.85rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.5rem;">Použité akordy:</div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${song.chords.map(c => `
            <span style="font-size: 1rem; font-weight: 800; color: #fde68a; background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.4); padding: 0.3rem 0.8rem; border-radius: 8px;">
              ${c}
            </span>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <div style="font-size: 0.85rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.5rem;">Text a akordový průběh:</div>
        <pre style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.25rem; color: #e2e8f0; font-family: monospace; font-size: 0.95rem; line-height: 1.7; white-space: pre-wrap; margin: 0;">${song.lyrics}</pre>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
        <button class="btn btn-primary" onclick="App.closeSongModal()" style="border-radius: 10px;">
          Zavřít náhled
        </button>
      </div>
    `;

    overlay.style.display = 'flex';
  },

  closeSongModal() {
    const overlay = document.getElementById('song-modal-overlay');
    if (overlay) overlay.style.display = 'none';
  },
  /**
   * Switch UI to login screen.
   */
  showLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');

    if (loginScreen) {
      loginScreen.classList.add('active');
      loginScreen.classList.remove('hidden');
      loginScreen.style.display = 'flex';
    }
    if (mainApp) {
      mainApp.classList.remove('active');
      mainApp.classList.add('hidden');
      mainApp.style.display = 'none';
    }

    if (window.Auth && typeof window.Auth.setupAuthUI === 'function') {
      window.Auth.setupAuthUI();
    }
  },

  /**
   * Switch UI to main application.
   */
  showMainApp() {
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');

    if (loginScreen) {
      loginScreen.classList.remove('active');
      loginScreen.classList.add('hidden');
      loginScreen.style.display = 'none';
    }
    if (mainApp) {
      mainApp.classList.add('active');
      mainApp.classList.remove('hidden');
      mainApp.style.display = 'flex';
    }

    this.renderSidebar();
    this.renderDashboard();
    this.navigate(window.location.hash || '#/dashboard');
  }
};

// Initialize App on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
