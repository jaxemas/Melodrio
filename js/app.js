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
   * Striktně binární streak (0 dní nebo 1 den):
   * Výchozí je 0, po splnění cvičení je 1, výš už to nejde (stačí 0 a 1).
   */
  formatStreak(count) {
    let s = 0;
    if (typeof count === 'number' && !isNaN(count)) {
      s = count;
    } else if (typeof count === 'object' && count !== null) {
      if (typeof count.current === 'number') s = count.current;
      else s = parseInt(count.current, 10) || 0;
    } else if (typeof count === 'string') {
      if (count === '[object Object]' || count.includes('object')) {
        s = 0;
      } else {
        s = parseInt(count, 10) || 0;
      }
    }
    return (s >= 1) ? '1 den' : '0 dní';
  },

  /**
   * Self-healing: vyčistí případné staré nevalidní záznamy [object Object] z localStorage.
   */
  cleanCorruptedStorage() {
    try {
      const rawStreak = localStorage.getItem('melodrio_streak');
      if (rawStreak) {
        if (rawStreak === '[object Object]' || rawStreak.includes('object')) {
          localStorage.setItem('melodrio_streak', JSON.stringify({ current: 0, lastDate: null, best: 0 }));
        } else {
          try {
            const parsed = JSON.parse(rawStreak);
            if (!parsed || typeof parsed !== 'object' || typeof parsed.current !== 'number' || isNaN(parsed.current)) {
              localStorage.setItem('melodrio_streak', JSON.stringify({ current: 0, lastDate: null, best: 0 }));
            } else if (parsed.current > 1) {
              localStorage.setItem('melodrio_streak', JSON.stringify({ current: 1, lastDate: parsed.lastDate || null, best: 1 }));
            }
          } catch (e) {
            localStorage.setItem('melodrio_streak', JSON.stringify({ current: 0, lastDate: null, best: 0 }));
          }
        }
      }

      const rawProgress = localStorage.getItem('melodrio_progress');
      if (rawProgress) {
        try {
          const prog = JSON.parse(rawProgress);
          if (prog && (prog.streak === '[object Object]' || typeof prog.streak !== 'object' || prog.streak === null)) {
            prog.streak = { current: 0, lastDate: null, best: 0 };
            localStorage.setItem('melodrio_progress', JSON.stringify(prog));
          } else if (prog && prog.streak && typeof prog.streak.current === 'number' && prog.streak.current > 1) {
            prog.streak.current = 1;
            prog.streak.best = 1;
            localStorage.setItem('melodrio_progress', JSON.stringify(prog));
          }
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Storage cleanup notice:', err);
    }
  },

  /**
   * Application entry point.
   */
  init() {
    // 0. Auto-healing storage cleanup
    this.cleanCorruptedStorage();

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
    if (typeof streak !== 'number' || isNaN(streak)) {
      try {
        const stored = localStorage.getItem('melodrio_streak');
        if (stored) {
          if (stored.startsWith('{')) {
            const parsed = JSON.parse(stored);
            streak = Number(parsed.current) || 0;
          } else if (stored !== '[object Object]') {
            streak = parseInt(stored, 10) || 0;
          } else {
            streak = 0;
          }
        }
      } catch (e) {
        streak = 0;
      }
    }
    if (typeof streak === 'object' && streak !== null) {
      streak = Number(streak.current) || 0;
    }
    streak = (streak >= 1) ? 1 : 0;

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
            <button class="btn btn-secondary btn-sm" onclick="App.godToggleStreak()" style="border-color: rgba(239, 68, 68, 0.5); color: #fca5a5;">
              🔥 Přepnout streak (0 ↔ 1 den)
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
    this.renderDashboardSidebar();
  },

  /**
   * Helper to jump straight into the current active lesson.
   */
  /**
   * Educational guitar tips cycling list
   */
  guitarTips: [
    { title: "Čisté tóny na pražcích", text: "Pokládej prsty těsně za kovový pražec, nikoliv doprostřed pole. Zabráníš drnčení strun a zvuk bude zvonivý." },
    { title: "Správný úchop trsátka", text: "Drž trsátko mezi bříškem palce a boční stranou ukazováčku. Šetří to energii v ruce a zrychluje hru." },
    { title: "Pravidelnost vítězí", text: "15 minut soustředěného cvičení denně dá tvým prstům mnohem více než dvě vyčerpávající hodiny jednou za týden." },
    { title: "Uvolněné zápěstí", text: "Křeč v ruce je největší nepřítel rychlosti. Pravidelně uvolňuj zápěstí, spusť ruku podél těla a vyklepej prsty." },
    { title: "Hladké akordové přechody", text: "Při střídání akordů hledej společné prsty (tzv. pivot fingers), které se nemusí zvedat ze struny." },
    { title: "Poloha palce na krku", text: "Palec levé ruky drž na zadní straně krku zhruba uprostřed. Dává to prstům volnost a správnou klenbu nad hmatníkem." }
  ],
  currentTipIndex: 0,

  nextGuitarTip() {
    this.currentTipIndex = (this.currentTipIndex + 1) % this.guitarTips.length;
    this.renderDashboardSidebar();
  },

  /**
   * Render the companion right sidebar column on the dashboard (Compact & Sticky).
   */
  renderDashboardSidebar() {
    const sidebar = document.getElementById('dashboard-sidebar');
    if (!sidebar) return;

    const { xp, streak, completed } = this.getProgressData();
    const isGod = this.isGod();
    const streakCount = (streak >= 1) ? 1 : 0;
    const isStreakActive = isGod ? true : (streakCount >= 1);

    // Dynamic calculation of the closest locked badge to unlock
    let nextBadge = null;
    let badgeProgress = { current: 0, target: 1, percent: 0, hint: '' };
    if (window.Progress && typeof window.Progress.getBadges === 'function') {
      const allBadges = window.Progress.getBadges();
      const lockedBadges = isGod ? [] : allBadges.filter(b => !b.earned);
      if (lockedBadges.length > 0) {
        for (const b of lockedBadges) {
          let cur = 0, tgt = 1, h = '';
          if (b.id === 'first_lesson') {
            cur = completed.length; tgt = 1; h = `Dokonči 1. lekci v kurzu`;
          } else if (b.id === 'five_lessons') {
            cur = completed.length; tgt = 5; h = `Zbývá: ${Math.max(0, 5 - completed.length)} lekcí`;
          } else if (b.id === 'ten_lessons') {
            cur = completed.length; tgt = 10; h = `Zbývá: ${Math.max(0, 10 - completed.length)} lekcí`;
          } else if (b.id === 'all_stage1') {
            const c = completed.filter(id => id >= 1 && id <= 8).length;
            cur = c; tgt = 8; h = `Zbývá: ${8 - c} lekcí v Garáži`;
          } else if (b.id === 'all_stage2') {
            const c = completed.filter(id => id >= 9 && id <= 16).length;
            cur = c; tgt = 8; h = `Zbývá: ${8 - c} lekcí na Scéně`;
          } else if (b.id === 'xp_500') {
            cur = xp; tgt = 500; h = `Chybí: ${Math.max(0, 500 - xp)} XP`;
          } else if (b.id === 'xp_1000') {
            cur = xp; tgt = 1000; h = `Chybí: ${Math.max(0, 1000 - xp)} XP`;
          } else if (b.id === 'xp_5000') {
            cur = xp; tgt = 5000; h = `Chybí: ${Math.max(0, 5000 - xp)} XP`;
          } else if (b.id === 'streak_3') {
            cur = streakCount; tgt = 3; h = `Zbývá: ${Math.max(0, 3 - streakCount)} dny série`;
          } else if (b.id === 'streak_7') {
            cur = streakCount; tgt = 7; h = `Zbývá: ${Math.max(0, 7 - streakCount)} dní série`;
          } else if (b.id === 'perfect_quiz') {
            const p = (window.Progress.data && window.Progress.data.perfectQuizzes) || 0;
            cur = p; tgt = 1; h = `Kvíz bez chyby (100 %)`;
          } else {
            cur = 0; tgt = 1; h = b.description;
          }

          const pct = Math.min(100, Math.round((cur / tgt) * 100));
          if (!nextBadge || pct > badgeProgress.percent) {
            nextBadge = b;
            badgeProgress = { current: cur, target: tgt, percent: pct, hint: h };
          }
        }
      }
    }

    const tip = this.guitarTips[this.currentTipIndex % this.guitarTips.length];

    sidebar.innerHTML = `
      <!-- Companion Card 1: Dnešní cíl & Denní série -->
      <div class="dashboard-companion-card animate-slideInUp">
        <div class="companion-card-header">
          <div class="companion-card-title">
            <span>🔥</span>
            <span>Dnešní série & Cíl</span>
          </div>
          <span class="companion-card-badge ${isStreakActive ? 'streak-done' : ''}">
            ${isStreakActive ? '✅ Splněno' : '⏳ K dokončení'}
          </span>
        </div>
        <div class="companion-card-body">
          <div style="display: flex; align-items: baseline; justify-content: space-between;">
            <span style="font-size: 1.3rem; font-weight: 800; color: ${isStreakActive ? '#f59e0b' : '#f8fafc'};">
              ${isGod ? '∞ dní' : this.formatStreak(streakCount)}
            </span>
            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">
              ${isStreakActive ? 'Dnes aktivní' : '1 cvičení denně'}
            </span>
          </div>
          <button class="btn ${isStreakActive ? 'btn-ghost' : 'btn-primary'} btn-sm" onclick="App.continueCurrentLesson()" style="
            width: 100%;
            padding: 0.35rem 0.6rem;
            font-size: 0.78rem;
            font-weight: 700;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.35rem;
          ">
            <span>${isStreakActive ? 'Další lekce' : 'Spustit dnešní lekci'}</span>
            <span>▶</span>
          </button>
        </div>
      </div>

      <!-- Companion Card 2: Odznak na dosah -->
      <div class="dashboard-companion-card animate-slideInUp">
        <div class="companion-card-header">
          <div class="companion-card-title">
            <span>🎯</span>
            <span>Odznak na dosah</span>
          </div>
          <a href="#/profile" style="font-size: 0.68rem; color: #a78bfa; font-weight: 600; text-decoration: none;">Profil →</a>
        </div>
        <div class="companion-card-body">
          ${nextBadge ? `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="
                width: 34px; height: 34px;
                border-radius: 8px;
                background: rgba(139, 92, 246, 0.15);
                border: 1px solid rgba(139, 92, 246, 0.3);
                display: flex; align-items: center; justify-content: center;
                font-size: 1.2rem;
                flex-shrink: 0;
              ">${nextBadge.icon}</div>
              <div style="min-width: 0; flex: 1;">
                <div style="font-size: 0.82rem; font-weight: 700; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${nextBadge.name}
                </div>
                <div style="font-size: 0.68rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${nextBadge.description}
                </div>
              </div>
              <span style="font-size: 0.72rem; font-weight: 700; color: #a78bfa;">${badgeProgress.percent}%</span>
            </div>
            <div class="badge-progress-bar" style="height: 5px; margin-top: 2px;">
              <div class="badge-progress-bar-fill" style="width: ${badgeProgress.percent}%;"></div>
            </div>
            <div style="font-size: 0.68rem; color: #cbd5e1; font-weight: 600;">
              🎯 ${badgeProgress.hint}
            </div>
          ` : `
            <div style="text-align: center; padding: 0.2rem 0; font-size: 0.78rem; color: #f8fafc; font-weight: 700;">
              🏆 Všechny odznaky odemčeny!
            </div>
          `}
        </div>
      </div>

      <!-- Companion Card 3: Kytarový tip dne -->
      <div class="dashboard-companion-card animate-slideInUp">
        <div class="companion-card-header">
          <div class="companion-card-title">
            <span>💡</span>
            <span>Tip dne</span>
          </div>
          <button class="btn btn-ghost" onclick="App.nextGuitarTip()" title="Další tip" style="
            padding: 1px 6px;
            font-size: 0.68rem;
            color: #a78bfa;
            border-radius: 6px;
            border: 1px solid rgba(139, 92, 246, 0.25);
          ">Další ↻</button>
        </div>
        <div class="companion-card-body">
          <div style="font-size: 0.78rem; font-weight: 700; color: #f8fafc;">
            ${tip.title}
          </div>
          <p style="font-size: 0.72rem; color: #94a3b8; margin: 0; line-height: 1.35;">
            ${tip.text}
          </p>
        </div>
      </div>

      <!-- Companion Card 4: Rychlé nástroje -->
      <div class="dashboard-companion-card animate-slideInUp">
        <div class="companion-card-header">
          <div class="companion-card-title">
            <span>⚡</span>
            <span>Rychlé nástroje</span>
          </div>
          <span class="companion-card-badge">Praxe</span>
        </div>
        <div class="companion-mini-tools-grid">
          <a href="#/songs" class="companion-tool-btn">
            <span class="companion-tool-icon">🎵</span>
            <span>Písničky</span>
          </a>
          <a href="#/tuner" class="companion-tool-btn">
            <span class="companion-tool-icon">🎛️</span>
            <span>Ladička</span>
          </a>
          <a href="#/metronome" class="companion-tool-btn">
            <span class="companion-tool-icon">⏱️</span>
            <span>Metronom</span>
          </a>
        </div>
      </div>

      ${isGod ? `
      <!-- Companion Card 5: God Quick Tools -->
      <div class="dashboard-companion-card animate-slideInUp" style="
        border-color: rgba(245, 158, 11, 0.4);
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(245, 158, 11, 0.1) 100%);
      ">
        <div class="companion-card-header" style="border-bottom-color: rgba(245, 158, 11, 0.2);">
          <div class="companion-card-title" style="color: #fde68a;">
            <span>👑</span>
            <span>God Mode</span>
          </div>
          <span class="companion-card-badge" style="background: rgba(245, 158, 11, 0.2); color: #fde68a; border-color: rgba(245, 158, 11, 0.4);">
            Root
          </span>
        </div>
        <div class="companion-card-body" style="gap: 0.35rem;">
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn btn-sm btn-ghost" onclick="App.godSetMaxXP()" style="flex: 1; padding: 2px 4px; font-size: 0.68rem; border-color: rgba(245, 158, 11, 0.3); color: #fde68a;">
              Max XP ⭐
            </button>
            <button class="btn btn-sm btn-ghost" onclick="App.godToggleStreak()" style="flex: 1; padding: 2px 4px; font-size: 0.68rem; border-color: rgba(239, 68, 68, 0.3); color: #fca5a5;">
              Série 🔥
            </button>
          </div>
        </div>
      </div>
      ` : ''}
    `;
  },
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
        max-width: 100%;
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

      const storyStageSpacing = stageId > 1 ? 'margin-top: 4.5rem; margin-bottom: 3.5rem;' : 'margin-bottom: 3.5rem;';
      html += `
        <div class="stage-section" style="${storyStageSpacing}">
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
    const streakDaysEl = document.getElementById('sidebar-streak-days');
    const streakCount = typeof streak === 'number' ? streak : (streak && streak.current ? streak.current : 0);
    const formattedStreak = this.formatStreak(streakCount);

    if (streakDaysEl) {
      streakDaysEl.textContent = formattedStreak;
    } else {
      const sidebarStreak = document.getElementById('sidebar-streak');
      if (sidebarStreak) {
        sidebarStreak.innerHTML = `
          <div class="streak-card">
            <div class="streak-icon-wrap">
              <span class="streak-flame animate-pulse">🔥</span>
            </div>
            <div class="streak-text-wrap">
              <span class="streak-days" id="sidebar-streak-days">${formattedStreak}</span>
              <span class="streak-label">Aktivní série</span>
            </div>
          </div>
        `;
      }
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
      if (window.Progress && typeof window.Progress.recordPracticeActivity === 'function') {
        window.Progress.recordPracticeActivity();
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
   * God Mode / Admin Action: Toggle streak (0 ↔ 1 den)
   */
  godToggleStreak() {
    let current = 0;
    if (window.Progress && typeof window.Progress.getStreak === 'function') {
      current = window.Progress.getStreak();
    } else {
      const s = this.getProgressData().streak;
      current = typeof s === 'number' ? s : 0;
    }
    const targetStreak = current === 0 ? 1 : 0;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const streakObj = {
      current: targetStreak,
      lastDate: targetStreak === 1 ? todayStr : null,
      best: targetStreak
    };
    try {
      localStorage.setItem('melodrio_streak', JSON.stringify(streakObj));
    } catch (e) {}

    if (window.Progress) {
      const pData = window.Progress._getdata();
      pData.streak = streakObj;
      window.Progress._save(pData);
    }

    this.renderDashboard();
    this.renderSidebar();
    if (window.UI) {
      window.UI.showToast(`🔥 Denní série přepnuta na: ${this.formatStreak(targetStreak)}`, 'success');
    }
  },

  godAddStreak() {
    this.godToggleStreak();
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

  // 25 Song Repertoire with unlock conditions tied to lessons
  SONGS_25: [
    { id: 1, title: 'Stánky', artist: 'Nedvědi', difficulty: 'Snadná', bpm: 105, unlockLesson: 11, chords: ['D', 'G', 'A'], lyrics: "U stánků na levnou krásu postávaj a smějou se času,\ns kapkou rumu v kafi marně touží po lidech...\nJen konce všech těch lásek zbyly někde v prachu cest." },
    { id: 2, title: 'Bedna od vodky', artist: 'Miki Ryvola', difficulty: 'Snadná', bpm: 120, unlockLesson: 13, chords: ['C', 'F', 'G', 'Am'], lyrics: "Pět neděl v chládku jsem si poseděl,\nteď v kapse prachy mám a starej cíl.\nV hospodě na rohu chci chvíli pít,\na starou bednu od vodky zas mít." },
    { id: 3, title: 'Slavíci z Madridu', artist: 'Waldemar Matuška', difficulty: 'Snadná', bpm: 110, unlockLesson: 9, chords: ['Am', 'E', 'Dm'], lyrics: "Nebe je modrý a zlatý, bílá je sluneční zář,\nhorko a sváteční šaty, vřava a lhostejná tvář.\nLalalalala lalala lalala lalalalala..." },
    { id: 4, title: 'Severní vítr', artist: 'Jaroslav Uhlíř', difficulty: 'Snadná', bpm: 95, unlockLesson: 13, chords: ['C', 'Am', 'F', 'G'], lyrics: "Jdu s děravou patou, mám horečku zlatou,\njsem chudý, jsem sláb, nemocen.\nHlava mě pálí a v modravé dáli\nse leskne a třpytí můj sen..." },
    { id: 5, title: "Knockin' on Heaven's Door", artist: 'Bob Dylan', difficulty: 'Snadná', bpm: 68, unlockLesson: 14, chords: ['G', 'D', 'Am', 'C'], lyrics: "Mama, take this badge off of me,\nI can't use it anymore.\nIt's gettin' dark, too dark for me to see,\nFeels like I'm knockin' on heaven's door." },
    { id: 6, title: 'Let It Be', artist: 'The Beatles', difficulty: 'Střední', bpm: 72, unlockLesson: 13, chords: ['C', 'G', 'Am', 'F'], lyrics: "When I find myself in times of trouble,\nMother Mary comes to me,\nSpeaking words of wisdom: Let it be.\nAnd in my hour of darkness she is standing right in front of me..." },
    { id: 7, title: 'Wonderwall', artist: 'Oasis', difficulty: 'Střední', bpm: 88, unlockLesson: 14, chords: ['Em', 'G', 'D', 'A7sus4'], lyrics: "Today is gonna be the day that they're gonna throw it back to you.\nBy now you should've somehow realized what you gotta do.\nI don't believe that anybody feels the way I do about you now." },
    { id: 8, title: 'Zombie', artist: 'The Cranberries', difficulty: 'Snadná', bpm: 84, unlockLesson: 8, chords: ['Em', 'C', 'G', 'D'], lyrics: "Another head hangs lowly, child is slowly taken.\nAnd the violence caused such silence, who are we mistaken?\nIn your head, in your head, they are fighting..." },
    { id: 9, title: 'Hallelujah', artist: 'Leonard Cohen', difficulty: 'Střední', bpm: 58, unlockLesson: 13, chords: ['C', 'Am', 'F', 'G', 'E'], lyrics: "Now I've heard there was a secret chord\nThat David played, and it pleased the Lord,\nBut you don't really care for music, do ya?\nIt goes like this: the fourth, the fifth, the minor fall, the major lift..." },
    { id: 10, title: 'Stand By Me', artist: 'Ben E. King', difficulty: 'Snadná', bpm: 118, unlockLesson: 10, chords: ['A', 'F#m', 'D', 'E'], lyrics: "When the night has come and the land is dark,\nAnd the moon is the only light we'll see.\nNo, I won't be afraid, oh, I won't be afraid,\nJust as long as you stand, stand by me." },
    { id: 11, title: 'House of the Rising Sun', artist: 'The Animals', difficulty: 'Pokročilá', bpm: 78, unlockLesson: 13, chords: ['Am', 'C', 'D', 'F', 'E'], lyrics: "There is a house in New Orleans they call the Rising Sun,\nAnd it's been the ruin of many a poor boy,\nAnd God, I know I'm one." },
    { id: 12, title: 'Wish You Were Here', artist: 'Pink Floyd', difficulty: 'Střední', bpm: 60, unlockLesson: 14, chords: ['Em', 'G', 'A7sus4', 'C', 'D'], lyrics: "So, so you think you can tell Heaven from Hell?\nBlue skies from pain?\nCan you tell a green field from a cold steel rail?\nA smile from a veil? Do you think you can tell?" },
    { id: 13, title: 'Riptide', artist: 'Vance Joy', difficulty: 'Snadná', bpm: 102, unlockLesson: 13, chords: ['Am', 'G', 'C', 'F'], lyrics: "I was scared of dentists and the dark,\nI was scared of pretty girls and starting conversations.\nOh, all my friends are turning green,\nYou're the magician's assistant in their dreams." },
    { id: 14, title: 'Hey Jude', artist: 'The Beatles', difficulty: 'Střední', bpm: 74, unlockLesson: 13, chords: ['F', 'C', 'C7', 'Bb'], lyrics: "Hey Jude, don't make it bad,\nTake a sad song and make it better.\nRemember to let her into your heart,\nThen you can start to make it better." },
    { id: 15, title: 'A Horse with No Name', artist: 'America', difficulty: 'Snadná', bpm: 122, unlockLesson: 6, chords: ['Em', 'D6/9'], lyrics: "On the first part of the journey, I was looking at all the life.\nThere were plants and birds and rocks and things,\nThere was sand and hills and rings.\nThe ocean is a desert with its life underground..." },
    { id: 16, title: 'Černí andělé', artist: 'Lucie', difficulty: 'Střední', bpm: 124, unlockLesson: 14, chords: ['Em', 'G', 'D', 'C'], lyrics: "Černí andělé v nás křídla rozprostřou,\ntisíc let už bdí a čekaj nad Prahou.\nSex je náš a dělá dobře mně i tobě,\nčerný anděl hlídá nás." },
    { id: 17, title: 'Tisíc mil', artist: 'Waldemar Matuška', difficulty: 'Snadná', bpm: 90, unlockLesson: 14, chords: ['G', 'Em', 'C', 'D'], lyrics: "V nohách mám už tisíc mil,\nstovky měst a stovky řek,\nnikde klid a nikde cíl,\njenom stín a prach a vděk..." },
    { id: 18, title: 'Kometa', artist: 'Jaromír Nohavica', difficulty: 'Střední', bpm: 110, unlockLesson: 9, chords: ['Am', 'Dm', 'E', 'C'], lyrics: "Spatřil jsem kometu, oblohou letěla,\nchtěl jsem jí zazpívat, ona mi zmizela.\nJako srnka, když v křoví zhasne,\njako když rozkvete poupě krásné..." },
    { id: 19, title: 'Jarošovský pivovar', artist: 'Argema', difficulty: 'Snadná', bpm: 130, unlockLesson: 14, chords: ['G', 'D', 'Em', 'C'], lyrics: "Léta tam stál, stát bude dál,\nten náš slavný pivovar.\nKde se pivo vaří, tam se dobře daří,\ntam je svět náš..." },
    { id: 20, title: 'Svařené víno', artist: 'Sem Tam', difficulty: 'Snadná', bpm: 98, unlockLesson: 14, chords: ['C', 'F', 'G'], lyrics: "Když venku mrzne, až praští mráz,\nsvařené víno zahřeje nás.\nHřebíček, skořice, plamínek plápolá,\ntenhle večer na kytaru zavolá..." },
    { id: 21, title: 'Bláznova ukolébavka', artist: 'Pavel Dobeš', difficulty: 'Snadná', bpm: 100, unlockLesson: 11, chords: ['D', 'A', 'G'], lyrics: "Máš, má ovečko, dávno spát,\ni píseň ptáků už doznává,\nzavři svá očka a nechej si zdát,\no tom, jak tě mám rád..." },
    { id: 22, title: 'Sweet Home Alabama', artist: 'Lynyrd Skynyrd', difficulty: 'Střední', bpm: 98, unlockLesson: 15, chords: ['D', 'C', 'G'], lyrics: "Big wheels keep on turnin',\nCarry me home to see my kin.\nSingin' songs about the south-land,\nI miss 'ole 'Bama once again and I think it's a sin." },
    { id: 23, title: 'Take Me Home, Country Roads', artist: 'John Denver', difficulty: 'Snadná', bpm: 82, unlockLesson: 15, chords: ['G', 'Em', 'D', 'C'], lyrics: "Almost Heaven, West Virginia,\nBlue Ridge Mountains, Shenandoah River.\nLife is old there, older than the trees,\nYounger than the mountains, growin' like a breeze." },
    { id: 24, title: "Ain't No Sunshine", artist: 'Bill Withers', difficulty: 'Střední', bpm: 78, unlockLesson: 8, chords: ['Am', 'Em', 'G', 'Dm'], lyrics: "Ain't no sunshine when she's gone,\nIt's not warm when she's away.\nAin't no sunshine when she's gone,\nAnd she's always gone too long anytime she goes away." },
    { id: 25, title: 'Perfect', artist: 'Ed Sheeran', difficulty: 'Snadná', bpm: 63, unlockLesson: 15, chords: ['G', 'Em', 'C', 'D'], lyrics: "I found a love for me,\nDarling, just dive right in and follow my lead.\nWell, I found a girl, beautiful and sweet,\nOh, I never knew you were the someone waiting for me." }
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
        options: ['Tón G na 3. pražci 6. struny', 'Tón C na 3. pražci 5. struny', 'Otevřená struna D', '1. pražec na tenkém e'],
        correct: 0,
        tip: 'Základní basový tón G leží na 3. pražci nejtlustší struny E.'
      },
      {
        q: 'Co znamená zkratka BPM v hudbě?',
        options: ['Beats Per Minute (počet úderů za minutu)', 'Bass Power Music', 'Best Practice Method', 'Bar Per Measure'],
        correct: 0,
        tip: 'BPM udává tempo skladby — kolik dob proběhne za 60 sekund.'
      },
      {
        q: 'Jaký je standardní interval mezi 3. strunou (G) a 2. strunou (H)?',
        options: ['Velká tercie', 'Čistá kvarta', 'Čistá kvinta', 'Malá sekunda'],
        correct: 0,
        tip: 'Všechny ostatní struny jsou laděné v čistých kvartách, pouze mezi G a H je velká tercie (4 půltóny).'
      }
    ]
  },

  /**
   * Render views for tools (songs, tuner, metronome, practice).
   * Ladička a Metronom jsou nyní odemčeny pro všechny uživatele!
   * Písničky mají propracovaný katalog s odemykáním podle lekcí.
   * @param {string} viewId
   * @param {string} toolName
   */
  renderPlaceholderView(viewId, toolName) {
    const view = document.getElementById(viewId);
    if (!view) return;

    if (toolName === 'metronome') {
      this.renderGodMetronome(view);
      return;
    }
    if (toolName === 'tuner') {
      this.renderGodTuner(view);
      return;
    }
    if (toolName === 'songs') {
      this.renderSongsCatalog(view);
      return;
    }
    if (toolName === 'practice' && this.isGod()) {
      this.renderGodPractice(view);
      return;
    }

    // Normal user practice placeholder
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
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🎯</div>
        <h2 style="font-size: 1.75rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.5rem;">Trénink & Cvičení</h2>
        <p style="color: #94a3b8; font-size: 1.05rem; margin-bottom: 2rem; line-height: 1.5;">
          Interaktivní chord quiz a tréninkové moduly pro hbitost prstů.
        </p>
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
     INTERACTIVE TOOLS (Metronome, Tuner, Practice, Songs)
     ========================================================================== */

  /**
   * Render Interactive Metronome (plně odemčeno pro všechny uživatele)
   */
  renderGodMetronome(container) {
    const s = this._metroState;
    const isGod = this.isGod();

    container.innerHTML = `
      <div style="max-width: 680px; margin: 1rem auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Banner -->
        <div style="background: ${isGod ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(30, 41, 59, 0.8))' : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(30, 41, 59, 0.8))'}; border: 1px solid ${isGod ? 'rgba(245, 158, 11, 0.4)' : 'rgba(139, 92, 246, 0.35)'}; border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.6rem; color: ${isGod ? '#fde68a' : '#c4b5fd'}; font-weight: 700; font-size: 0.9rem;">
            <span>${isGod ? '👑 Administrátorský přístup:' : '⏱️ Interaktivní metronom:'}</span>
            <span style="color: #cbd5e1; font-weight: normal;">${isGod ? 'Interaktivní náhled modulu Metronom' : 'Trénuj přesnost rytmu, tempo a plynulost přechodů'}</span>
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
    s.isPlaying = !s.isPlaying;
    const btn = document.getElementById('metro-play-btn');

    if (s.isPlaying) {
      if (btn) {
        btn.textContent = '⏹ Zastavit';
        btn.className = 'btn btn-danger btn-lg';
      }
      const intervalMs = (60 / s.bpm) * 1000;
      this.tickMetronome();
      s.timer = setInterval(() => this.tickMetronome(), intervalMs);
    } else {
      if (btn) {
        btn.textContent = '▶ Spustit metronom';
        btn.className = 'btn btn-primary btn-lg';
      }
      clearInterval(s.timer);
      s.timer = null;
      s.currentBeat = 0;
      this.clearBeatIndicators();
    }
  },

  tickMetronome() {
    const s = this._metroState;
    const isFirstBeat = (s.currentBeat === 0);
    this.playMetronomeClick(isFirstBeat);

    // Update beat indicator dots
    for (let i = 0; i < s.beatsPerBar; i++) {
      const dot = document.getElementById(`metro-beat-${i}`);
      if (dot) {
        if (i === s.currentBeat) {
          dot.style.background = isFirstBeat ? '#10B981' : '#8B5CF6';
          dot.style.transform = 'scale(1.35)';
          dot.style.boxShadow = `0 0 16px ${isFirstBeat ? 'rgba(16, 185, 129, 0.8)' : 'rgba(139, 92, 246, 0.8)'}`;
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
   * Render Interactive Tuner (plně odemčeno pro všechny uživatele)
   */
  renderGodTuner(container) {
    const isGod = this.isGod();
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
        <!-- Banner -->
        <div style="background: ${isGod ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(30, 41, 59, 0.8))' : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(30, 41, 59, 0.8))'}; border: 1px solid ${isGod ? 'rgba(245, 158, 11, 0.4)' : 'rgba(139, 92, 246, 0.35)'}; border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.6rem; color: ${isGod ? '#fde68a' : '#c4b5fd'}; font-weight: 700; font-size: 0.9rem;">
            <span>${isGod ? '👑 Administrátorský přístup:' : '🎛️ Chromatická ladička:'}</span>
            <span style="color: #cbd5e1; font-weight: normal;">${isGod ? 'Interaktivní kytarová ladička' : 'Referenční tóny pro standardní kytarové ladění E-A-D-G-H-E'}</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="App.navigate('#/dashboard')">← Dashboard</button>
        </div>

        <!-- Tuner Dial & Needle Card -->
        <div class="card" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 20px; padding: 2.25rem; text-align: center; backdrop-filter: blur(14px);">
          <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; font-weight: 700; margin-bottom: 0.25rem;">
            Referenční tóny pro ladění
          </div>
          <div id="tuner-note-display" style="font-size: 4rem; font-weight: 900; color: #f8fafc; font-family: monospace; line-height: 1.1;">
            E<span style="font-size: 1.5rem; color: #94a3b8;">2</span>
          </div>
          <div id="tuner-freq-display" style="color: #cbd5e1; font-size: 1rem; font-weight: 600; margin-bottom: 1.5rem;">
            Referenční tón: 82.41 Hz
          </div>

          <!-- Needle Meter -->
          <div style="position: relative; width: 280px; height: 140px; margin: 0 auto 2rem auto; overflow: hidden;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 140px; border-radius: 140px 140px 0 0; background: rgba(15, 23, 42, 0.7); border: 2px solid rgba(255, 255, 255, 0.1); border-bottom: none;"></div>
            <div style="position: absolute; bottom: 0; left: 50%; width: 4px; height: 120px; background: #10B981; transform-origin: bottom center; transform: translateX(-50%) rotate(0deg); border-radius: 2px; box-shadow: 0 0 12px #10B981; transition: transform 0.25s ease;" id="tuner-needle"></div>
            <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; border-radius: 50%; background: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>
          </div>

          <div id="tuner-status-badge" style="display: inline-block; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-weight: 800; padding: 0.4rem 1.25rem; border-radius: 9999px; font-size: 0.95rem; margin-bottom: 2rem;">
            🎯 Přesně naladěno (In Tune)
          </div>

          <!-- 6 Guitar String Selector Buttons -->
          <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; max-width: 550px; margin: 0 auto 1.5rem auto;">
            ${strings.map(st => `
              <button
                class="btn btn-secondary tuner-string-btn"
                id="tuner-btn-${st.num}"
                onclick="App.playTunerString(${st.num}, ${st.freq}, '${st.note}')"
                style="padding: 0.85rem 0.25rem; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; font-weight: 800;"
              >
                <span style="font-size: 1.35rem; color: #f8fafc;">${st.note}</span>
                <span style="font-size: 0.7rem; color: #94a3b8;">${st.num}. struna</span>
              </button>
            `).join('')}
          </div>

          <div style="color: #94a3b8; font-size: 0.85rem;">
            Klikni na libovolnou strunu a poslouchej referenční tón pro naladění své kytary.
          </div>
        </div>
      </div>
    `;
  },

  playTunerString(num, freq, note) {
    const s = this._tunerState;
    if (s.currentOsc) {
      try { s.currentOsc.stop(); } catch (e) {}
      s.currentOsc = null;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!s.audioCtx) s.audioCtx = new AudioCtx();
      const ctx = s.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.0);
      s.currentOsc = osc;

      // Update UI
      const noteEl = document.getElementById('tuner-note-display');
      const freqEl = document.getElementById('tuner-freq-display');
      if (noteEl) noteEl.innerHTML = `${note}<span style="font-size: 1.5rem; color: #94a3b8;">(${num}. struna)</span>`;
      if (freqEl) freqEl.textContent = `Frekvence: ${freq} Hz`;

      // Highlight active button
      document.querySelectorAll('.tuner-string-btn').forEach(b => {
        b.style.borderColor = 'rgba(255,255,255,0.1)';
        b.style.background = 'rgba(255,255,255,0.05)';
      });
      const activeBtn = document.getElementById(`tuner-btn-${num}`);
      if (activeBtn) {
        activeBtn.style.borderColor = '#10B981';
        activeBtn.style.background = 'rgba(16, 185, 129, 0.2)';
      }
    } catch (e) {
      console.warn('Tuner audio error:', e);
    }
  },

  /**
   * Render Interactive Practice Quiz
   */
  renderGodPractice(container) {
    const q = this._quizState;
    const item = q.questions[q.index];

    container.innerHTML = `
      <div style="max-width: 680px; margin: 1rem auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Banner -->
        <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(30, 41, 59, 0.8)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.6rem; color: #fde68a; font-weight: 700; font-size: 0.9rem;">
            <span>👑 Administrátorský přístup:</span>
            <span style="color: #cbd5e1; font-weight: normal;">Interaktivní hudební kvíz & trénink</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="App.navigate('#/dashboard')">← Dashboard</button>
        </div>

        <!-- Quiz Card -->
        <div class="card" style="background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 20px; padding: 2.25rem; backdrop-filter: blur(14px);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <span style="font-size: 0.85rem; font-weight: 700; color: #a78bfa; text-transform: uppercase;">
              Otázka ${q.index + 1} z ${q.questions.length}
            </span>
            <span style="font-size: 0.85rem; font-weight: 700; color: #10B981;">
              Skóre: ${q.score} / ${q.questions.length}
            </span>
          </div>

          <h3 style="font-size: 1.35rem; font-weight: 800; color: #f8fafc; margin-bottom: 1.5rem; line-height: 1.4;">
            ${item.q}
          </h3>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
            ${item.options.map((opt, i) => `
              <button
                class="btn btn-secondary quiz-opt-btn"
                onclick="App.answerPracticeQuiz(${i})"
                id="quiz-opt-${i}"
                style="text-align: left; padding: 1rem 1.25rem; border-radius: 12px; font-weight: 600; font-size: 0.95rem; justify-content: flex-start;"
              >
                <span style="margin-right: 0.75rem; font-weight: 800; color: #a78bfa;">${String.fromCharCode(65 + i)})</span>
                ${opt}
              </button>
            `).join('')}
          </div>

          <div id="quiz-feedback-box" style="display: none; padding: 1rem; border-radius: 12px; margin-bottom: 1.25rem;"></div>

          <div style="display: flex; justify-content: flex-end;">
            <button id="quiz-next-btn" class="btn btn-primary" onclick="App.nextPracticeQuiz()" style="display: none; border-radius: 10px;">
              Další otázka →
            </button>
          </div>
        </div>
      </div>
    `;
  },

  answerPracticeQuiz(chosenIdx) {
    const q = this._quizState;
    if (q.answered) return;
    q.answered = true;

    const item = q.questions[q.index];
    const isCorrect = (chosenIdx === item.correct);
    if (isCorrect) q.score++;

    const feedback = document.getElementById('quiz-feedback-box');
    const nextBtn = document.getElementById('quiz-next-btn');

    if (feedback) {
      feedback.style.display = 'block';
      if (isCorrect) {
        feedback.style.background = 'rgba(16, 185, 129, 0.15)';
        feedback.style.border = '1px solid rgba(16, 185, 129, 0.4)';
        feedback.style.color = '#34d399';
        feedback.innerHTML = `<strong>✅ Skvěle! Správná odpověď.</strong><div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">${item.tip}</div>`;
        if (window.Sounds) window.Sounds.playSuccess();
      } else {
        feedback.style.background = 'rgba(239, 68, 68, 0.15)';
        feedback.style.border = '1px solid rgba(239, 68, 68, 0.4)';
        feedback.style.color = '#f87171';
        feedback.innerHTML = `<strong>❌ Bohužel špatně.</strong><div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">${item.tip}</div>`;
        if (window.Sounds) window.Sounds.playError();
      }
    }

    const chosenBtn = document.getElementById(`quiz-opt-${chosenIdx}`);
    if (chosenBtn) {
      chosenBtn.style.background = isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
      chosenBtn.style.borderColor = isCorrect ? '#10B981' : '#EF4444';
    }
    const correctBtn = document.getElementById(`quiz-opt-${item.correct}`);
    if (correctBtn && !isCorrect) {
      correctBtn.style.background = 'rgba(16, 185, 129, 0.25)';
      correctBtn.style.borderColor = '#10B981';
    }

    if (nextBtn) nextBtn.style.display = 'inline-flex';
  },

  nextPracticeQuiz() {
    const q = this._quizState;
    q.answered = false;
    q.index = (q.index + 1) % q.questions.length;
    const view = document.getElementById('view-practice');
    if (view) this.renderGodPractice(view);
  },

  /**
   * Render Interactive 25-Song Repertoire (podporuje God i normálního uživatele s odemykáním)
   */
  renderSongsCatalog(container, query = '', filterDiff = 'all') {
    const isGod = this.isGod();
    const { completed } = this.getProgressData();
    let filtered = this.SONGS_25;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.chords.some(c => c.toLowerCase().includes(q)));
    }
    if (filterDiff !== 'all') {
      filtered = filtered.filter(s => s.difficulty === filterDiff);
    }

    const unlockedCount = isGod ? this.SONGS_25.length : this.SONGS_25.filter(s => completed.includes(s.unlockLesson)).length;

    container.innerHTML = `
      <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem;">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%); border: 1px solid rgba(139, 92, 246, 0.35); border-radius: 18px; padding: 1.25rem 1.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
              <span style="font-size: 1.75rem;">🎵</span>
              <h1 style="font-size: 1.5rem; font-weight: 800; color: #f8fafc; margin: 0;">Knihovna 25 skladeb a tabů</h1>
              <span class="companion-card-badge" style="font-size: 0.75rem;">
                ${unlockedCount} / ${this.SONGS_25.length} odemčeno
              </span>
            </div>
            <p style="color: #94a3b8; font-size: 0.9rem; margin: 0;">
              ${isGod
                ? '👑 Režim Boha: Všech 25 skladeb máš plně odemčeno s akordy a texty.'
                : 'Skladby se ti postupně odemykají podle toho, jaké akordy a lekce v kurzu zvládneš.'
              }
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" onclick="App.showAllSongsUnlockScheduleModal()" style="border-radius: 10px; font-weight: 700;">
              📋 Pravidla odemykání skladeb
            </button>
            <button class="btn btn-ghost btn-sm" onclick="App.navigate('#/dashboard')">← Dashboard</button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="card" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <input
            type="text"
            placeholder="🔍 Hledat píseň, interpreta nebo akord..."
            value="${query}"
            oninput="App.renderSongsCatalog(document.getElementById('view-songs'), this.value, '${filterDiff}')"
            style="flex: 1; min-width: 220px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 0.55rem 0.9rem; color: #f8fafc; font-size: 0.9rem;"
          >
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-sm ${filterDiff === 'all' ? 'btn-primary' : 'btn-ghost'}" onclick="App.renderSongsCatalog(document.getElementById('view-songs'), '${query}', 'all')" style="border-radius: 8px;">Vše (${this.SONGS_25.length})</button>
            <button class="btn btn-sm ${filterDiff === 'Snadná' ? 'btn-primary' : 'btn-ghost'}" onclick="App.renderSongsCatalog(document.getElementById('view-songs'), '${query}', 'Snadná')" style="border-radius: 8px;">Snadné</button>
            <button class="btn btn-sm ${filterDiff === 'Střední' ? 'btn-primary' : 'btn-ghost'}" onclick="App.renderSongsCatalog(document.getElementById('view-songs'), '${query}', 'Střední')" style="border-radius: 8px;">Střední</button>
          </div>
        </div>

        <!-- Songs Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${filtered.map(s => {
            const isUnlocked = isGod || completed.includes(s.unlockLesson);
            const lessonInfo = this.getLessonInfo(s.unlockLesson);
            const lessonTitle = lessonInfo ? lessonInfo.title : `Lekce ${s.unlockLesson}`;

            return `
              <div
                class="card song-card ${isUnlocked ? 'unlocked' : 'locked'}"
                onclick="${isUnlocked ? `App.showSongModal(${s.id})` : `App.showSongUnlockPopup(${s.id})`}"
                style="background: rgba(30, 41, 59, 0.7); border: 1px solid ${isUnlocked ? 'rgba(255, 255, 255, 0.1)' : 'rgba(245, 158, 11, 0.35)'}; border-radius: 14px; padding: 1.15rem; cursor: pointer; transition: transform 0.2s ease, border-color 0.2s ease; display: flex; flex-direction: column; justify-content: space-between;"
                onmouseover="this.style.transform='translateY(-3px)';"
                onmouseout="this.style.transform='translateY(0)';"
              >
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.5rem;">
                    <span style="font-size: 0.75rem; font-weight: 700; color: #a78bfa; background: rgba(139, 92, 246, 0.15); padding: 0.2rem 0.5rem; border-radius: 6px;">
                      #${s.id}
                    </span>
                    ${isUnlocked ? `
                      <span style="font-size: 0.72rem; font-weight: 700; color: #34d399; background: rgba(16, 185, 129, 0.15); padding: 2px 7px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.3);">
                        🔓 Odemčeno
                      </span>
                    ` : `
                      <span class="song-lock-badge">
                        🔒 Po Lekci ${s.unlockLesson}
                      </span>
                    `}
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
                    <span style="font-size: 0.78rem; color: ${isUnlocked ? '#64748b' : '#fbbf24'};">
                      ${isUnlocked ? 'Klikni pro akordy a text' : `Vyžaduje Lekci ${s.unlockLesson}`}
                    </span>
                    <span style="font-size: 0.78rem; color: ${isUnlocked ? '#a78bfa' : '#f59e0b'}; font-weight: 700;">
                      ${isUnlocked ? 'Hrát →' : 'Podmínky 🔒'}
                    </span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Floating Song Detail Modal -->
      <div id="song-modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(8px); padding: 1.5rem;" onclick="if(event.target === this) App.closeSongModal();">
        <div id="song-modal-content" class="card" style="background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(139, 92, 246, 0.4); border-radius: 20px; max-width: 650px; width: 100%; padding: 2rem; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
        </div>
      </div>
    `;
  },

  // Alias for backward compatibility
  renderGodSongs(container, query = '', filterDiff = 'all') {
    this.renderSongsCatalog(container, query, filterDiff);
  },

  /**
   * Popup modal for locked songs explaining what lesson unlocks it.
   */
  showSongUnlockPopup(songId) {
    const song = this.SONGS_25.find(s => s.id === songId);
    if (!song) return;

    const lessonInfo = this.getLessonInfo(song.unlockLesson);
    const lessonTitle = lessonInfo ? lessonInfo.title : `Lekce ${song.unlockLesson}`;

    const content = `
      <div style="text-align: center; padding: 0.5rem 0;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎸🔒</div>
        <h4 style="font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-bottom: 0.25rem;">
          ${song.title}
        </h4>
        <div style="font-size: 0.95rem; color: #94a3b8; margin-bottom: 1rem;">
          Interpret: <strong style="color: #cbd5e1;">${song.artist}</strong> • Obtížnost: <strong>${song.difficulty}</strong>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 0.85rem; margin-bottom: 1.25rem; text-align: left;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.4rem;">
            Potřebné akordy k zahrání:
          </div>
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            ${song.chords.map(c => `
              <span style="font-size: 0.9rem; font-weight: 800; color: #fde68a; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); padding: 0.25rem 0.65rem; border-radius: 8px;">
                ${c}
              </span>
            `).join('')}
          </div>
        </div>

        <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(139, 92, 246, 0.15)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 1.15rem; text-align: left; margin-bottom: 1.25rem;">
          <div style="font-size: 0.82rem; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
            🎯 Jak tuto skladbu odemknout:
          </div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.35rem;">
            Dokonči Lekci ${song.unlockLesson}: ${lessonTitle}
          </div>
          <p style="font-size: 0.85rem; color: #cbd5e1; margin: 0; line-height: 1.45;">
            V této lekci získáš všechny potřebné kytarové dovednosti, abys mohl skladbu zahrát plynule a s čistým tónem.
          </p>
        </div>
      </div>
    `;

    if (window.UI && typeof window.UI.showModal === 'function') {
      window.UI.showModal('Kdy se odemkne tato píseň?', content, [
        {
          text: `Přejít do Lekce ${song.unlockLesson} ▶`,
          primary: true,
          action: () => {
            if (window.UI && typeof window.UI.hideModal === 'function') {
              window.UI.hideModal();
            }
            window.location.hash = `#/lesson/${song.unlockLesson}`;
          }
        },
        {
          text: 'Rozumím',
          action: () => {
            if (window.UI && typeof window.UI.hideModal === 'function') {
              window.UI.hideModal();
            }
          }
        }
      ]);
    }
  },

  /**
   * Modal dialog displaying the unlock schedule for all 25 songs.
   */
  showAllSongsUnlockScheduleModal() {
    const isGod = this.isGod();
    const { completed } = this.getProgressData();

    // Group songs by unlock lesson
    const lessonGroups = [
      { lessonId: 6, title: 'Lekce 6: Akord Em (E moll)' },
      { lessonId: 8, title: 'Lekce 8: Střídání akordů Em–Am' },
      { lessonId: 9, title: 'Lekce 9: Akord E dur' },
      { lessonId: 10, title: 'Lekce 10: Akord A dur' },
      { lessonId: 11, title: 'Lekce 11: Akord D dur' },
      { lessonId: 13, title: 'Lekce 13: Akord C dur' },
      { lessonId: 14, title: 'Lekce 14: Akord G dur' },
      { lessonId: 15, title: 'Lekce 15: Akordová progrese G–C–D' }
    ];

    let html = `
      <div style="max-height: 65vh; overflow-y: auto; padding-right: 6px;">
        <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 0; margin-bottom: 1.25rem;">
          Zde vidíš přesný přehled všech 25 písniček v Melodriu a lekce, které je potřeba splnit pro jejich odemčení.
        </p>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${lessonGroups.map(grp => {
            const songsInGrp = this.SONGS_25.filter(s => s.unlockLesson === grp.lessonId);
            const isLessonDone = isGod || completed.includes(grp.lessonId);

            return `
              <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid ${isLessonDone ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.08)'}; border-radius: 12px; padding: 0.85rem 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                  <span style="font-size: 0.92rem; font-weight: 800; color: #ffffff;">
                    ${grp.title}
                  </span>
                  <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px; ${isLessonDone ? 'background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);' : 'background: rgba(245, 158, 11, 0.15); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.3);'}">
                    ${isLessonDone ? '✅ Odemčeno' : '🔒 Čeká na dokončení'}
                  </span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem;">
                  ${songsInGrp.map(s => `
                    <div style="background: rgba(30, 41, 59, 0.5); padding: 0.4rem 0.6rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.82rem;">
                      <div style="font-weight: 700; color: #f8fafc;">${s.title}</div>
                      <div style="font-size: 0.72rem; color: #94a3b8;">${s.artist} • [${s.chords.join(', ')}]</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (window.UI && typeof window.UI.showModal === 'function') {
      window.UI.showModal('Harmonogram odemykání skladeb (25 písní)', html, [
        {
          text: 'Rozumím',
          primary: true,
          action: () => {
            if (window.UI && typeof window.UI.hideModal === 'function') {
              window.UI.hideModal();
            }
          }
        }
      ]);
    }
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
