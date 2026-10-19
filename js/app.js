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
    { id: 6, name: 'Stadion', rank: 'Mistr', icon: '🏟️', minXp: 8000, maxXp: Infinity, lessons: [41, 48] }
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
        if (item.classList.contains('locked')) {
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
    let streak = 1;
    let completed = [];

    if (p) {
      if (typeof p.getXP === 'function') xp = p.getXP();
      else if (p.data && typeof p.data.xp === 'number') xp = p.data.xp;
      else if (typeof p.xp === 'number') xp = p.xp;

      if (typeof p.getStreak === 'function') streak = p.getStreak();
      else if (p.data && typeof p.data.streak === 'number') streak = p.data.streak;
      else if (typeof p.streak === 'number') streak = p.streak;

      if (typeof p.getCompletedLessons === 'function') completed = p.getCompletedLessons();
      else if (p.data && Array.isArray(p.data.completedLessons)) completed = p.data.completedLessons;
      else if (Array.isArray(p.completedLessons)) completed = p.completedLessons;
    }

    if (!xp) {
      const stored = localStorage.getItem('melodrio_xp');
      if (stored) xp = parseInt(stored, 10) || 0;
    }
    if (!streak) {
      const stored = localStorage.getItem('melodrio_streak');
      if (stored) streak = parseInt(stored, 10) || 1;
    }
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
                ${streak} ${streak === 1 ? 'den' : (streak >= 2 && streak <= 4 ? 'dny' : 'dní')}
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
              <div style="font-size: 1.45rem; font-weight: 800; color: #f8fafc;">${completedCount} / 16</div>
            </div>
          </div>
        </div>
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
      for (let lessonId = stage.lessons[0]; lessonId <= stage.lessons[1]; lessonId++) {
        const isCompleted = completed.includes(lessonId);
        const isCurrent = lessonId === currentLessonId;
        const isLocked = !isCompleted && !isCurrent;
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
                title="${info.title}"
                style="
                  width: 58px;
                  height: 58px;
                  border-radius: 50%;
                  background: ${nodeBgColor};
                  border: 3px solid ${nodeBorderColor};
                  box-shadow: ${nodeShadow};
                  color: ${isCompleted ? '#10B981' : (isCurrent ? '#ffffff' : '#94a3b8')};
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
                  border: 1px solid ${isCurrent ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)'};
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
                <div style="font-size: 0.75rem; font-weight: 700; color: ${isCurrent ? '#a78bfa' : '#94a3b8'};">
                  Lekce ${lessonId} • +${info.xp || 50} XP
                </div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${info.title}
                </div>
                <div style="font-size: 0.75rem; color: ${isCompleted ? '#10B981' : (isCurrent ? '#a78bfa' : '#64748b')}; margin-top: 0.15rem;">
                  ${isCompleted ? '✓ Dokončeno' : (isCurrent ? '▶ Probíhá' : '🔒 Zamčeno')}
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
          <h3 style="color: #64748b; font-size: 1.15rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
            🔒 Další etapy (Připravují se)
          </h3>
        </div>
    `;

    [3, 4, 5, 6].forEach(stageId => {
      const stage = this.STAGES.find(s => s.id === stageId);
      html += `
        <div class="card stage-header locked" style="
          background: rgba(15, 23, 42, 0.5);
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.25rem 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          opacity: 0.65;
        ">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 2rem; filter: grayscale(80%);">${stage.icon}</div>
            <div>
              <div style="font-weight: 700; font-size: 1.15rem; color: #94a3b8;">
                ${stage.id}. Etapa: ${stage.name}
              </div>
              <div style="font-size: 0.85rem; color: #64748b;">
                Vyžaduje hodnost <strong>${stage.rank}</strong> (${stage.minXp}+ XP)
              </div>
            </div>
          </div>
          <div style="
            background: rgba(30, 41, 59, 0.6);
            padding: 0.35rem 0.75rem;
            border-radius: 8px;
            font-size: 0.8rem;
            color: #94a3b8;
            display: flex;
            align-items: center;
            gap: 0.4rem;
          ">
            <span>🔒 Zamčeno</span>
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
    if (isLocked) {
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
    const user = (window.Auth && window.Auth.getUser()) || { name: 'Kytarista', avatar: '🎸' };
    const { xp, streak } = this.getProgressData();
    const rankInfo = this.getRankInfo(xp);

    // Update #sidebar-user
    const sidebarUser = document.getElementById('sidebar-user');
    if (sidebarUser) {
      sidebarUser.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">
          <div style="
            width: 44px; height: 44px;
            border-radius: 12px;
            background: rgba(139, 92, 246, 0.2);
            border: 2px solid rgba(139, 92, 246, 0.4);
            display: flex; align-items: center; justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
          ">
            ${user.avatar || '🎸'}
          </div>
          <div style="overflow: hidden; flex: 1;">
            <div style="font-weight: 700; color: #f8fafc; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${user.name}
            </div>
            <div style="font-size: 0.75rem; color: #a78bfa; font-weight: 600; display: flex; align-items: center; gap: 0.25rem;">
              <span>${rankInfo.icon}</span>
              <span>${rankInfo.rankName}</span>
            </div>
          </div>
        </div>

        <!-- Mini XP bar in sidebar -->
        <div style="margin-top: 0.4rem;">
          <div class="xp-bar" style="height: 6px; background: rgba(15, 23, 42, 0.6); border-radius: 9999px; overflow: hidden;">
            <div class="xp-bar-fill" style="width: ${rankInfo.percent}%; height: 100%; background: #8B5CF6;"></div>
          </div>
        </div>
      `;
    }

    // Update #sidebar-streak
    const sidebarStreak = document.getElementById('sidebar-streak');
    if (sidebarStreak) {
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
          <span>${streak} ${streak === 1 ? 'den' : (streak >= 2 && streak <= 4 ? 'dny' : 'dní')}</span>
        </div>
      `;
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
   * Render coming soon placeholder cards for tools (songs, practice, tuner, metronome).
   * @param {string} viewId
   * @param {string} toolName
   */
  renderPlaceholderView(viewId, toolName) {
    const view = document.getElementById(viewId);
    if (!view) return;

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
