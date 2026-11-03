/**
 * Melodrio - Kytarová škola (Lessons Module)
 * Spravuje vykreslování přehledu lekcí (etapy 1 až 6, celkem 48 lekcí),
 * průchod lekcí, interaktivní teorii, herní cvičení v dálnici a ověřovací kvízy.
 */

window.Lessons = {
  get data() {
    return (window.LESSONS_DATA && window.LESSONS_DATA.length > 0)
      ? window.LESSONS_DATA
      : (window.STAGE1_LESSONS || []);
  },

  _currentStageFilter: 'all',

  setStageFilter(stageId) {
    this._currentStageFilter = stageId;
    this.renderLessonList();
  },

  getAllLessons() {
    return this.data;
  },

  getLesson(id) {
    const numId = Number(id);
    return this.data.find(l => l.id === numId);
  },

  getLessonsByStage(stageId) {
    const numStage = Number(stageId);
    return this.data.filter(l => l.stage === numStage);
  },

  /**
   * Spustí praktické cvičení k dané lekci v herní dálnici (SongPlayer).
   * Připraveno pro Fázi 3 (odposlech mikrofonem).
   */
  startLessonWorkout(lesson) {
    if (!lesson) return;
    const pw = lesson.practiceWorkout || {};
    const chords = (pw.chords && pw.chords.length > 0) ? pw.chords : ['Em', 'Am'];
    const pattern = pw.strummingPattern || 'basic4';
    const bpm = pw.bpm || 80;
    const totalBars = pw.bars || 16;

    const workoutSong = {
      id: 9000 + lesson.id,
      title: pw.title || `Trénink: ${lesson.title}`,
      artist: `Lekce ${lesson.id} • ${lesson.stageName}`,
      difficulty: 'Trénink',
      bpm: bpm,
      initialTempo: 1.0,
      strummingPattern: pattern,
      chords: chords,
      isTransitionWorkout: true,
      isLessonWorkout: true,
      lessonId: lesson.id,
      measures: totalBars,
      lyrics: `Tréninkové cvičení k lekci ${lesson.id}: ${lesson.title}.\nProcvičuj akordy: ${chords.join(' – ')}.\nRytmus: ${pattern} • Tempo: ${bpm} BPM.\nVe Fázi 3 se zde spustí mikrofon pro kontrolu čistoty tónů.`
    };

    if (window.App && typeof window.App.launchSongPlayer === 'function') {
      window.App.launchSongPlayer(workoutSong);
    }
  },

  /**
   * Zopakování / procvičení lekce.
   */
  practiceReview(lessonId) {
    const lesson = this.getLesson(lessonId);
    if (!lesson) return;
    if (lesson.practiceWorkout) {
      this.startLessonWorkout(lesson);
    } else {
      if (window.App && typeof window.App.showView === 'function') {
        window.App.showView('practice');
        if (window.Practice && typeof window.Practice.switchSubTab === 'function') {
          window.Practice.switchSubTab('review');
          if (typeof window.Practice.setReviewStage === 'function') {
            window.Practice.setReviewStage(lesson.stage);
            window.Practice.setReviewLesson(lesson.id);
          }
        }
      }
    }
  },

  renderLessonList() {
    const listContainer = document.getElementById('lessons-list');
    const detailContainer = document.getElementById('lesson-detail');

    if (!listContainer) {
      console.warn('[Lessons] Kontejner #lessons-list nebyl nalezen.');
      return;
    }

    if (detailContainer) {
      detailContainer.classList.add('hidden');
    }
    listContainer.classList.remove('hidden');

    const completedIds = window.Progress ? window.Progress.getCompletedLessons() : [];
    const isGod = Boolean(window.Auth && typeof window.Auth.isGod === 'function' && window.Auth.isGod());

    const allStages = [
      { id: 1, name: 'Garáž', emoji: '🏠', subtitle: 'Lekce 1–8: Seznámení s nástrojem, ladění, tóny a první mollové akordy', color: '#f59e0b' },
      { id: 2, name: 'Otevřená scéna', emoji: '🎤', subtitle: 'Lekce 9–16: Durové akordy, táborákový rytmus a slavná progrese G–C–D', color: '#38bdf8' },
      { id: 3, name: 'Hospoda', emoji: '🍺', subtitle: 'Lekce 17–24: Tóny na hmatníku, akordy Dm a A, 3/4 valčík, vybrnkávání a kapodastr', color: '#eab308' },
      { id: 4, name: 'Klub', emoji: '🎪', subtitle: 'Lekce 25–32: Sedmičkové akordy, 12taktové blues, palm muting, power akordy a pentatonika', color: '#a855f7' },
      { id: 5, name: 'Koncertní sál', emoji: '🎭', subtitle: 'Lekce 33–40: Barré akordy (F dur, H moll), stavba akordů, Travis picking a kvintový kruh', color: '#f43f5e' },
      { id: 6, name: 'Stadion', emoji: '🏟️', subtitle: 'Lekce 41–48: Sólové bendingy, slide, spider cvičení, pódiový sound a velkolepé finále', color: '#10b981' }
    ];

    const currentFilter = this._currentStageFilter;
    const stagesToRender = currentFilter === 'all'
      ? allStages
      : allStages.filter(st => st.id === Number(currentFilter));

    let html = `
      <!-- Stage Filter Bar -->
      <div class="stage-filter-bar mb-6" style="
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        align-items: center;
        background: rgba(30, 41, 59, 0.6);
        padding: 0.75rem 1rem;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      ">
        <span style="font-size: 0.85rem; font-weight: 700; color: #94a3b8; margin-right: 0.5rem;">Filtrovat fáze:</span>
        <button
          class="btn btn-sm ${currentFilter === 'all' ? 'btn-primary' : 'btn-ghost'}"
          onclick="Lessons.setStageFilter('all')"
          style="border-radius: 8px; font-weight: 700;"
        >
          🌟 Všechny (1–48)
        </button>
        ${allStages.map(st => `
          <button
            class="btn btn-sm ${currentFilter === String(st.id) ? 'btn-primary' : 'btn-ghost'}"
            onclick="Lessons.setStageFilter('${st.id}')"
            style="border-radius: 8px; font-weight: 700;"
          >
            ${st.emoji} ${st.id}. ${st.name}
          </button>
        `).join('')}
      </div>
    `;

    stagesToRender.forEach((stage, stageIndex) => {
      const stageLessons = this.getLessonsByStage(stage.id);
      if (stageLessons.length === 0) return;

      const stageCompletedCount = isGod ? stageLessons.length : stageLessons.filter(l => completedIds.includes(l.id)).length;
      const stageSpacingStyle = stageIndex > 0 ? 'margin-top: 3.5rem; margin-bottom: 3rem;' : 'margin-bottom: 3rem;';

      html += `
        <div class="stage-section" style="${stageSpacingStyle}">
          <div class="stage-header flex justify-between items-center mb-6" style="
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-left: 4px solid ${stage.color};
            border-radius: 14px;
            padding: 1rem 1.5rem;
            margin-bottom: 1.5rem;
          ">
            <div>
              <h2 class="text-2xl font-bold flex items-center gap-2" style="margin: 0; color: #f8fafc;">
                <span>${stage.emoji}</span>
                <span>Fáze ${stage.id}: ${stage.name}</span>
              </h2>
              <p class="text-sm text-muted mt-1" style="margin-bottom: 0;">${stage.subtitle}</p>
            </div>
            <div class="stage-stats">
              <span class="badge ${stageCompletedCount === stageLessons.length ? 'earned' : ''}" style="font-weight: 700; padding: 0.4rem 0.8rem;">
                ${stageCompletedCount} / ${stageLessons.length} hotovo
              </span>
            </div>
          </div>
          <div class="lessons-grid">
      `;

      stageLessons.forEach(lesson => {
        const isCompleted = isGod || completedIds.includes(lesson.id);
        const prevCompleted = lesson.id === 1 || completedIds.includes(lesson.id - 1);
        const isUnlocked = isGod || isCompleted || prevCompleted;
        const isCurrent = !isGod && !isCompleted && isUnlocked;

        let statusClass = 'locked';
        let statusBadge = '<span class="lesson-pill-status pill-locked"><span class="status-icon">&#x1F512;</span> Zam&#x10D;eno</span>';
        let buttonText = 'Zam&#x10D;eno';
        let buttonClass = 'btn btn-ghost btn-sm';
        let disabledAttr = 'disabled';

        if (isCompleted) {
          statusClass = isGod ? 'completed god-completed' : 'completed';
          statusBadge = `<span class="lesson-pill-status pill-completed ${isGod ? 'god-gold' : ''}"><span class="status-icon">${isGod ? '&#x1F451;' : '&#x2713;'}</span> Dokon&#x10D;eno</span>`;
          buttonText = isGod ? 'Spustit lekci &#x26A1;' : 'Zopakovat lekci';
          buttonClass = isGod ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
          disabledAttr = '';
        } else if (isCurrent) {
          statusClass = 'current active';
          statusBadge = '<span class="lesson-pill-status pill-current"><span class="status-pulse"></span> &#x25B6; Na &#x159;ad&#x11B;</span>';
          buttonText = 'Spustit lekci &rarr;';
          buttonClass = 'btn btn-primary btn-sm';
          disabledAttr = '';
        }

        const isTheory = lesson.type === 'theory';
        const typeBadge = `<span class="lesson-pill-type ${isTheory ? 'pill-theory' : 'pill-practice'}">
          <span class="pill-dot"></span> ${isTheory ? '&#x1F4D8; Teorie' : '&#x1F3B8; Praxe'}
        </span>`;

        let songRewardHtml = '';
        if (window.App && Array.isArray(window.App.SONGS_25)) {
          const s = window.App.SONGS_25.find(song => song.unlockLesson === lesson.id || (lesson.unlockedSongId && song.id === lesson.unlockedSongId));
          if (s) {
            const isSongUnlocked = isGod || isCompleted;
            songRewardHtml = `
              <div class="lesson-song-reward-box ${isSongUnlocked ? 'is-unlocked' : 'is-locked'}">
                <div class="reward-box-top">
                  <span class="reward-badge-tag">${isSongUnlocked ? '&#x2728; Odem&#x10D;en&aacute; skladba' : '&#x1F381; Odm&#x11B;na za lekci'}</span>
                  <span class="reward-badge-hint">${isSongUnlocked ? 'P&#x159;ipraveno ke hran&iacute;' : 'Odemkne se po spln&#x11B;n&iacute;'}</span>
                </div>
                <div class="reward-box-body">
                  <div class="reward-song-details">
                    <span class="reward-song-note">&#x1F3B5;</span>
                    <div class="reward-song-text">
                      <span class="reward-song-name">${s.title}</span>
                      <span class="reward-song-sub">${s.artist} &bull; ${s.difficulty}</span>
                    </div>
                  </div>
                  ${isSongUnlocked ? `
                    <button type="button" class="reward-play-btn" onclick="event.stopPropagation(); window.App.launchSongPlayer(window.App.SONGS_25.find(song => song.id === ${s.id}))" title="Zahr&aacute;t skladbu v d&aacute;lnici">
                      <span>&#x25B6;</span> Hr&aacute;t
                    </button>
                  ` : '<span class="reward-lock-icon" title="Odemkne se po &uacute;sp&#x11B;&scaron;n&eacute;m dokon&#x10D;en&iacute; lekce">&#x1F512;</span>'}
                </div>
              </div>
            `;
          }
        }

        html += `
          <div class="lesson-card card ${statusClass} ${isUnlocked ? 'cursor-pointer' : 'opacity-60'}" data-lesson-id="${lesson.id}">
            <div class="lesson-card-header flex justify-between items-center mb-3">
              ${typeBadge}
              ${statusBadge}
            </div>
            <div class="lesson-card-body">
              <span class="lesson-number text-xs text-muted font-bold uppercase tracking-wider">Lekce ${lesson.id}</span>
              <h3 class="lesson-card-title text-xl font-bold mt-1 mb-2">${lesson.title}</h3>
              <p class="lesson-card-desc text-sm text-muted mb-3">${lesson.description}</p>
              ${songRewardHtml}
            </div>
            <div class="lesson-card-footer flex justify-between items-center pt-3 border-t border-surface-border mt-auto">
              <div class="lesson-meta flex items-center gap-2 text-xs text-muted">
                <span>&#x2B50; +${lesson.xpReward} XP</span>
                <span>&bull;</span>
                <span>${lesson.steps.length} krok&#x16F; + kv&iacute;z</span>
              </div>
              <button class="${buttonClass} start-lesson-btn" data-lesson-id="${lesson.id}" ${disabledAttr}>
                ${buttonText}
              </button>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;

    listContainer.querySelectorAll('.lesson-card').forEach(card => {
      const lessonId = Number(card.dataset.lessonId);
      const isCompleted = completedIds.includes(lessonId);
      const isUnlocked = isGod || lessonId === 1 || isCompleted || completedIds.includes(lessonId - 1);

      if (isUnlocked) {
        card.addEventListener('click', (e) => {
          if (e.target.closest('button') && e.target.closest('button').disabled) return;
          if (window.Sounds && typeof window.Sounds.playClick === 'function') {
            window.Sounds.playClick();
          }
          window.location.hash = `#/lesson/${lessonId}`;
        });
      }
    });
  },

  _currentLessonId: null,
  _currentStep: 0,
  _quizState: {
    currentQuestion: 0,
    correct: 0,
    total: 0,
    answered: [],
    hadErrorInQuestion: false,
    perfectScore: true
  },

  renderLessonDetail(id) {
    const lesson = this.getLesson(id);
    if (!lesson) {
      console.error(`[Lessons] Lekce s ID ${id} nebyla nalezena.`);
      return;
    }

    const listContainer = document.getElementById('lessons-list');
    const detailContainer = document.getElementById('lesson-detail');

    if (!detailContainer) {
      console.warn('[Lessons] Kontejner #lesson-detail nebyl nalezen.');
      return;
    }

    if (listContainer) {
      listContainer.classList.add('hidden');
    }
    detailContainer.classList.remove('hidden');

    this._currentLessonId = lesson.id;
    this._currentStep = 0;
    this._quizState = {
      currentQuestion: 0,
      correct: 0,
      total: lesson.quiz.length,
      answered: [],
      hadErrorInQuestion: false,
      perfectScore: true
    };

    const isTheory = lesson.type === 'theory';

    detailContainer.innerHTML = `
      <div class="view-header lesson-detail-header animate-fadeIn mb-6">
        <div class="flex justify-between items-center mb-3 flex-wrap gap-2">
          <button class="btn btn-ghost flex items-center gap-2" id="btn-back-to-lessons">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Zpět na přehled lekcí
          </button>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="rank-badge">${lesson.stageEmoji} ${lesson.stageName}</span>
            <span class="badge" style="background: ${isTheory ? 'rgba(139, 92, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)'}; color: ${isTheory ? '#c4b5fd' : '#6ee7b7'}; border: 1px solid ${isTheory ? 'rgba(139, 92, 246, 0.4)' : 'rgba(16, 185, 129, 0.4)'}; font-weight: 700;">
              ${isTheory ? '📘 Teorie' : '🎸 Praxe'}
            </span>
            <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b;">+${lesson.xpReward} XP</span>
          </div>
        </div>

        <div class="lesson-detail-title-card card p-6 bg-surface-2 border border-surface-border">
          <span class="text-xs uppercase font-bold text-accent tracking-wider">Lekce ${lesson.id}</span>
          <h1 class="text-3xl font-extrabold text-white mt-1 mb-2">${lesson.title}</h1>
          <p class="text-muted text-base max-w-2xl mb-4">${lesson.description}</p>

          <div class="lesson-progress-bar-container">
            <div class="flex justify-between items-center text-xs text-muted mb-1">
              <span id="lesson-progress-text">Krok 1 z ${lesson.steps.length}: ${lesson.steps[0].title}</span>
              <span id="lesson-progress-percent" class="font-bold text-white">0%</span>
            </div>
            <div class="progress-bar-bg w-full h-2 bg-surface-3 rounded-full overflow-hidden">
              <div id="lesson-progress-fill" class="progress-bar-fill h-full bg-primary transition-all duration-300" style="width: 0%;"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card p-6 bg-surface-2 border border-surface-border animate-fadeIn" id="lesson-step-container">
        <!-- Zde se dynamicky vykreslují jednotlivé kroky a kvíz -->
      </div>
    `;

    const backBtn = document.getElementById('btn-back-to-lessons');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        window.location.hash = '#/lessons';
      });
    }

    this._renderStep(lesson, 0);
  },

  _renderStep(lesson, stepIndex) {
    const stepContainer = document.getElementById('lesson-step-container');
    if (!stepContainer) return;

    this._currentStep = stepIndex;
    const step = lesson.steps[stepIndex];
    const totalStepsAndQuiz = lesson.steps.length + 1;
    const progressPercent = Math.round((stepIndex / totalStepsAndQuiz) * 100);

    const progressText = document.getElementById('lesson-progress-text');
    const progressPercentEl = document.getElementById('lesson-progress-percent');
    const progressFill = document.getElementById('lesson-progress-fill');

    if (progressText) progressText.innerText = `Krok ${stepIndex + 1} z ${lesson.steps.length}: ${step.title}`;
    if (progressPercentEl) progressPercentEl.innerText = `${progressPercent}%`;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex === lesson.steps.length - 1;

    // Workout box for practical lessons
    let workoutBoxHtml = '';
    if (lesson.practiceWorkout && isLastStep) {
      const pw = lesson.practiceWorkout;
      workoutBoxHtml = `
        <div class="card p-5 my-6 bg-surface-3 border border-primary rounded-xl" style="border-left: 4px solid #3b82f6;">
          <div class="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xl">🎸</span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: #60a5fa; margin: 0;">
                  ${pw.title || 'Praktický trénink v herní dálnici'}
                </h4>
              </div>
              <p style="color: #cbd5e1; font-size: 0.9rem; margin-bottom: 0.35rem;">
                Akordy: <strong>${(pw.chords || []).join(' – ')}</strong> &bull; Rytmus: <strong>${pw.strummingPattern || '4/4'}</strong> &bull; Tempo: <strong>${pw.bpm || 80} BPM</strong>
              </p>
              <p style="color: #f59e0b; font-size: 0.8rem; margin: 0;">
                💡 <em>Připraveno pro Fázi 3: Zde se zapne mikrofon pro automatickou kontrolu čistoty hry!</em>
              </p>
            </div>
            <button class="btn btn-primary" id="btn-step-launch-workout" style="font-weight: 700; border-radius: 8px;">
              🚀 Spustit trénink v dálnici
            </button>
          </div>
        </div>
      `;
    }

    // Theory interactive challenge box
    let theoryBoxHtml = '';
    if (lesson.theoryExercise && isLastStep) {
      const te = lesson.theoryExercise;
      theoryBoxHtml = `
        <div class="card p-5 my-6 bg-surface-3 border border-accent rounded-xl" style="border-left: 4px solid #8b5cf6;">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">📘</span>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #c4b5fd; margin: 0;">
              ${te.title || 'Interaktivní teoretické cvičení'}
            </h4>
          </div>
          <p style="color: #cbd5e1; font-size: 0.9rem; margin-bottom: 0.75rem;">
            Otestuj si orientaci na kytarovém hmatníku a zapamatování klíčových pojmů před závěrečným kvízem.
          </p>
          <div class="theory-questions-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${(te.questions || []).map((q, idx) => `
              <div class="p-3 bg-surface-2 rounded-lg border border-surface-border flex justify-between items-center">
                <span style="color: #f8fafc; font-weight: 600;">#${idx + 1}: Kde leží tón <strong>${q.note}</strong> na ${q.string}. struně?</span>
                <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd;">${q.hint}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    stepContainer.innerHTML = `
      <div class="step-header flex justify-between items-center pb-4 border-b border-surface-border mb-6">
        <div>
          <span class="text-xs uppercase font-bold text-muted">Krok ${stepIndex + 1} z ${lesson.steps.length}</span>
          <h2 class="text-2xl font-bold text-white mt-1">${step.title}</h2>
        </div>
        <div class="step-indicators flex gap-1">
          ${lesson.steps.map((_, i) => `
            <span class="w-2.5 h-2.5 rounded-full transition-all ${i === stepIndex ? 'bg-primary scale-125' : i < stepIndex ? 'bg-accent' : 'bg-surface-3'}" title="Krok ${i + 1}"></span>
          `).join('')}
          <span class="w-2.5 h-2.5 rounded-full bg-surface-3" title="Kvíz"></span>
        </div>
      </div>

      <div class="step-content lesson-text-content leading-relaxed mb-6">
        ${step.content}
      </div>

      ${workoutBoxHtml}
      ${theoryBoxHtml}

      <div class="step-navigation flex justify-between items-center pt-4 border-t border-surface-border">
        <button class="btn btn-secondary" id="btn-prev-step" ${isFirstStep ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
          ← Předchozí krok
        </button>

        ${isLastStep ? `
          <button class="btn btn-primary" id="btn-start-quiz">
            Přejít na kvíz (${lesson.quiz.length} otázek) 🎯
          </button>
        ` : `
          <button class="btn btn-primary" id="btn-next-step">
            Další krok →
          </button>
        `}
      </div>
    `;

    const prevBtn = document.getElementById('btn-prev-step');
    const nextBtn = document.getElementById('btn-next-step');
    const startQuizBtn = document.getElementById('btn-start-quiz');
    const workoutBtn = document.getElementById('btn-step-launch-workout');

    if (workoutBtn) {
      workoutBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        this.startLessonWorkout(lesson);
      });
    }

    if (prevBtn && !isFirstStep) {
      prevBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        this._renderStep(lesson, stepIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        this._renderStep(lesson, stepIndex + 1);
      });
    }

    if (startQuizBtn) {
      startQuizBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        this._renderQuiz(lesson);
      });
    }
  },

  _renderQuiz(lesson) {
    const stepContainer = document.getElementById('lesson-step-container');
    if (!stepContainer) return;

    const qIdx = this._quizState.currentQuestion;
    const totalQ = lesson.quiz.length;
    const q = lesson.quiz[qIdx];

    const totalStepsAndQuiz = lesson.steps.length + 1;
    const quizProgress = lesson.steps.length + ((qIdx) / totalQ);
    const progressPercent = Math.round((quizProgress / totalStepsAndQuiz) * 100);

    const progressText = document.getElementById('lesson-progress-text');
    const progressPercentEl = document.getElementById('lesson-progress-percent');
    const progressFill = document.getElementById('lesson-progress-fill');

    if (progressText) progressText.innerText = `Kvíz — Otázka ${qIdx + 1} z ${totalQ}`;
    if (progressPercentEl) progressPercentEl.innerText = `${progressPercent}%`;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    const isLastQ = qIdx === totalQ - 1;

    stepContainer.innerHTML = `
      <div class="quiz-header flex justify-between items-center pb-4 border-b border-surface-border mb-6">
        <div>
          <span class="badge" style="background: rgba(236, 72, 153, 0.2); color: #ec4899;">Ověření znalostí</span>
          <h2 class="text-xl font-bold text-white mt-2">Otázka ${qIdx + 1} z ${totalQ}</h2>
        </div>
        <div class="score-pill badge">
          Skóre: ${this._quizState.correct} / ${qIdx}
        </div>
      </div>

      <div class="quiz-question-box mb-6">
        <h3 class="text-xl font-bold text-white mb-4 leading-snug">${q.question}</h3>
        <div class="quiz-options-grid grid gap-3" id="quiz-options-container">
          ${q.options.map((option, index) => `
            <button class="quiz-option text-left p-4 rounded-xl border border-surface-border transition-all flex items-center justify-between" data-index="${index}">
              <span class="option-text">${option}</span>
              <span class="option-indicator opacity-0 font-bold"></span>
            </button>
          `).join('')}
        </div>
      </div>

      <div id="quiz-feedback-box" class="quiz-feedback-container mb-6 hidden"></div>

      <div class="quiz-footer flex justify-end pt-4 border-t border-surface-border">
        <button class="btn btn-primary hidden" id="btn-quiz-next">
          ${isLastQ ? 'Dokončit kvíz a vyhodnotit 🎉' : 'Další otázka →'}
        </button>
      </div>
    `;

    const optionsContainer = document.getElementById('quiz-options-container');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const nextBtn = document.getElementById('btn-quiz-next');
    let hasAnsweredCurrent = false;

    optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (hasAnsweredCurrent) return;
        hasAnsweredCurrent = true;

        const selectedIndex = Number(btn.dataset.index);
        const isCorrect = selectedIndex === q.correct;

        optionsContainer.querySelectorAll('.quiz-option').forEach(b => {
          b.disabled = true;
          b.style.cursor = 'default';
        });

        if (isCorrect) {
          btn.classList.add('correct');
          const indicator = btn.querySelector('.option-indicator');
          if (indicator) {
            indicator.innerText = '✓';
            indicator.style.opacity = '1';
          }

          if (!this._quizState.hadErrorInQuestion) {
            this._quizState.correct++;
          }

          if (window.Progress && typeof window.Progress.recordPracticeActivity === 'function') {
            window.Progress.recordPracticeActivity();
          }

          if (window.Sounds && typeof window.Sounds.playSuccess === 'function') {
            window.Sounds.playSuccess();
          }

          feedbackBox.className = 'quiz-feedback-container p-4 rounded-xl bg-success-bg border border-success text-success animate-fadeIn mb-6';
          feedbackBox.innerHTML = `
            <div class="flex items-start gap-2">
              <span class="text-xl">✓</span>
              <div>
                <strong>Správná odpověď!</strong>
                <p class="text-sm mt-1 mb-0">${q.explanation || 'Výborně, pokračuj na další otázku.'}</p>
              </div>
            </div>
          `;
          feedbackBox.classList.remove('hidden');
        } else {
          btn.classList.add('wrong', 'animate-shake');
          const wrongIndicator = btn.querySelector('.option-indicator');
          if (wrongIndicator) {
            wrongIndicator.innerText = '✕';
            wrongIndicator.style.opacity = '1';
          }

          this._quizState.hadErrorInQuestion = true;
          this._quizState.perfectScore = false;

          const correctBtn = optionsContainer.querySelector(`[data-index="${q.correct}"]`);
          if (correctBtn) {
            correctBtn.classList.add('correct');
            const rightIndicator = correctBtn.querySelector('.option-indicator');
            if (rightIndicator) {
              rightIndicator.innerText = '✓';
              rightIndicator.style.opacity = '1';
            }
          }

          if (window.Sounds && typeof window.Sounds.playError === 'function') {
            window.Sounds.playError();
          }

          feedbackBox.className = 'quiz-feedback-container p-4 rounded-xl bg-error-bg border border-error text-error animate-fadeIn mb-6';
          feedbackBox.innerHTML = `
            <div class="flex items-start gap-2">
              <span class="text-xl">✕</span>
              <div>
                <strong>Bohužel špatně.</strong>
                <p class="text-sm mt-1 mb-0">${q.explanation || `Správná odpověď byla: <strong>${q.options[q.correct]}</strong>.`}</p>
              </div>
            </div>
          `;
          feedbackBox.classList.remove('hidden');
        }

        if (nextBtn) {
          nextBtn.classList.remove('hidden');
          nextBtn.classList.add('animate-scaleIn');
        }
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }

        if (isLastQ) {
          this._showQuizResults(lesson);
        } else {
          this._quizState.currentQuestion++;
          this._quizState.hadErrorInQuestion = false;
          this._renderQuiz(lesson);
        }
      });
    }
  },

  _showQuizResults(lesson) {
    const stepContainer = document.getElementById('lesson-step-container');
    if (!stepContainer) return;

    const correct = this._quizState.correct;
    const total = lesson.quiz.length;
    const isPerfect = (correct === total) && this._quizState.perfectScore;

    const baseXP = lesson.xpReward || 50;
    const perfectBonus = isPerfect ? 25 : 0;
    const noMistakesBonus = isPerfect ? 15 : 0;
    const totalEarnedXP = baseXP + perfectBonus + noMistakesBonus;

    if (window.Progress) {
      window.Progress.addXP(totalEarnedXP);
      window.Progress.markLessonComplete(lesson.id);
      if (typeof window.Progress.recordPracticeActivity === 'function') {
        window.Progress.recordPracticeActivity();
      }

      if (isPerfect) {
        window.Progress.recordPerfectQuiz();
      } else {
        window.Progress.resetPerfectQuizStreak();
      }
    }

    if (isPerfect) {
      if (window.UI && typeof window.UI.showConfetti === 'function') {
        window.UI.showConfetti();
      }
    }

    if (window.Sounds && typeof window.Sounds.playComplete === 'function') {
      window.Sounds.playComplete();
    }

    const progressText = document.getElementById('lesson-progress-text');
    const progressPercentEl = document.getElementById('lesson-progress-percent');
    const progressFill = document.getElementById('lesson-progress-fill');

    if (progressText) progressText.innerText = 'Lekce dokončena!';
    if (progressPercentEl) progressPercentEl.innerText = '100%';
    if (progressFill) progressFill.style.width = '100%';

    const nextLesson = this.getLesson(lesson.id + 1);

    // Check if song was unlocked
    let unlockedSong = null;
    if (lesson.unlockedSongId && window.App && Array.isArray(window.App.SONGS_25)) {
      unlockedSong = window.App.SONGS_25.find(s => s.id === lesson.unlockedSongId);
    }

    stepContainer.innerHTML = `
      <div class="results-view text-center py-6 animate-scaleIn">
        <div class="result-icon text-6xl mb-4">
          ${isPerfect ? '🏆' : '🎉'}
        </div>
        <h2 class="text-3xl font-extrabold text-white mb-2">
          ${isPerfect ? 'Bezchybný výsledek!' : 'Skvělá práce, lekce dokončena!'}
        </h2>
        <p class="text-muted max-w-md mx-auto mb-6">
          Úspěšně jsi dokončil lekci <strong>${lesson.id}. ${lesson.title}</strong> a posunul se dále na své kytarové cestě.
        </p>

        <!-- Unlocked Song celebration banner -->
        ${unlockedSong ? `
          <div class="card p-5 max-w-md mx-auto bg-surface-3 rounded-2xl border border-accent text-center mb-6" style="border-left: 4px solid #f59e0b; box-shadow: 0 0 24px rgba(245, 158, 11, 0.2);">
            <div class="text-3xl mb-1">🎵 🎸</div>
            <h3 class="text-lg font-bold text-accent mb-1">Za odměnu odemčena nová píseň!</h3>
            <p class="text-white font-bold text-xl mb-1">„${unlockedSong.title}“</p>
            <p class="text-sm text-muted mb-3">${unlockedSong.artist} &bull; Obtížnost: ${unlockedSong.difficulty} &bull; Akordy: ${(unlockedSong.chords || []).join(' – ')}</p>
            <button class="btn btn-primary" id="btn-play-unlocked-song" style="font-weight: 700; border-radius: 8px;">
              ▶️ Zahrát novou píseň v herní dálnici
            </button>
          </div>
        ` : ''}

        <div class="results-stats-card card p-5 max-w-md mx-auto bg-surface-2 text-left mb-6">
          <div class="flex justify-between items-center py-2 border-b border-surface-border">
            <span class="text-muted">Správné odpovědi v kvízu:</span>
            <span class="font-bold text-white">${correct} z ${total}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-surface-border">
            <span class="text-muted">Základní odměna za lekci:</span>
            <span class="font-bold text-accent">+${baseXP} XP</span>
          </div>
          ${isPerfect ? `
            <div class="flex justify-between items-center py-2 border-b border-surface-border text-success">
              <span>Bonus za 100% v kvízu:</span>
              <span class="font-bold">+${perfectBonus} XP</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-surface-border text-success">
              <span>Bonus za lekci bez jediné chyby:</span>
              <span class="font-bold">+${noMistakesBonus} XP</span>
            </div>
          ` : ''}
          <div class="flex justify-between items-center pt-3 text-lg font-extrabold text-primary">
            <span>Celkem získáno:</span>
            <span>+${totalEarnedXP} XP</span>
          </div>
        </div>

        <div class="results-actions flex flex-wrap justify-center gap-3">
          <button class="btn btn-secondary" id="btn-result-overview">
            Zpět na přehled lekcí
          </button>
          <button class="btn btn-ghost" id="btn-result-retry">
            Zopakovat lekci
          </button>
          <button class="btn btn-secondary" id="btn-result-practice-review">
            🎯 Procvičit látku
          </button>
          ${nextLesson ? `
            <button class="btn btn-primary" id="btn-result-next">
              Další lekce (${nextLesson.id}. ${nextLesson.title}) →
            </button>
          ` : `
            <button class="btn btn-primary" id="btn-result-overview-2">
              Hotovo! Přehled lekcí
            </button>
          `}
        </div>
      </div>
    `;

    const overviewBtn = document.getElementById('btn-result-overview');
    const overviewBtn2 = document.getElementById('btn-result-overview-2');
    const retryBtn = document.getElementById('btn-result-retry');
    const nextBtn = document.getElementById('btn-result-next');
    const practiceReviewBtn = document.getElementById('btn-result-practice-review');
    const playSongBtn = document.getElementById('btn-play-unlocked-song');

    if (playSongBtn && unlockedSong) {
      playSongBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        if (window.App && typeof window.App.launchSongPlayer === 'function') {
          window.App.launchSongPlayer(unlockedSong);
        }
      });
    }

    if (practiceReviewBtn) {
      practiceReviewBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        this.practiceReview(lesson.id);
      });
    }

    const goToOverview = () => {
      if (window.Sounds && typeof window.Sounds.playClick === 'function') {
        window.Sounds.playClick();
      }
      window.location.hash = '#/lessons';
    };

    if (overviewBtn) overviewBtn.addEventListener('click', goToOverview);
    if (overviewBtn2) overviewBtn2.addEventListener('click', goToOverview);

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        this.renderLessonDetail(lesson.id);
      });
    }

    if (nextBtn && nextLesson) {
      nextBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        window.location.hash = `#/lesson/${nextLesson.id}`;
      });
    }
  }
};
