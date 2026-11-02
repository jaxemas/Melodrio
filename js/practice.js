/**
 * Melodrio Phase 2 — Practice, Chord/Note Training & Mistake Tracker
 *
 * Provides:
 *  1. Interaktivní atlas akordů & hmatník s přehráváním zvuku přes AudioSynth
 *  2. Sekce chyb (Mistake Tracker) — analýza slabých míst z odehraných písniček
 *  3. Cílený trénink chyb ("Procvičit moje chyby") — tréninková smyčka problémových akordů
 */

const Practice = (() => {
  'use strict';

  // ── Chord Database with fingerings and theory ────────────────────────
  const CHORD_LIBRARY = [
    {
      name: 'Em',
      category: 'Základní mollové',
      difficulty: 'Lehká',
      fingers: [
        { string: 5, fret: 2, finger: 2, label: 'Prostředník (2)' },
        { string: 4, fret: 2, finger: 3, label: 'Prsteník (3)' }
      ],
      openStrings: [1, 2, 3, 6],
      mutedStrings: [],
      shape: [0, 2, 2, 0, 0, 0],
      tip: 'První a nejjednodušší kytarový akord. Zní temně a melancholicky.'
    },
    {
      name: 'Am',
      category: 'Základní mollové',
      difficulty: 'Lehká',
      fingers: [
        { string: 2, fret: 1, finger: 1, label: 'Ukazovák (1)' },
        { string: 4, fret: 2, finger: 2, label: 'Prostředník (2)' },
        { string: 3, fret: 2, finger: 3, label: 'Prsteník (3)' }
      ],
      openStrings: [1, 5],
      mutedStrings: [6],
      shape: [-1, 0, 2, 2, 1, 0],
      tip: 'Hraj od 5. struny (A). Šestou strunu (tlusté E) netlum nebo nehraj.'
    },
    {
      name: 'C',
      category: 'Základní durové',
      difficulty: 'Střední',
      fingers: [
        { string: 2, fret: 1, finger: 1, label: 'Ukazovák (1)' },
        { string: 4, fret: 2, finger: 2, label: 'Prostředník (2)' },
        { string: 5, fret: 3, finger: 3, label: 'Prsteník (3)' }
      ],
      openStrings: [1, 3],
      mutedStrings: [6],
      shape: [-1, 3, 2, 0, 1, 0],
      tip: 'Prsty měj kolmo k hmatníku, aby netlumily vedlejší otevřené struny.'
    },
    {
      name: 'G',
      category: 'Základní durové',
      difficulty: 'Střední',
      fingers: [
        { string: 5, fret: 2, finger: 1, label: 'Ukazovák (1)' },
        { string: 6, fret: 3, finger: 2, label: 'Prostředník (2)' },
        { string: 1, fret: 3, finger: 3, label: 'Prsteník (3)' }
      ],
      openStrings: [2, 3, 4],
      mutedStrings: [],
      shape: [3, 2, 0, 0, 0, 3],
      tip: 'Plný, jasný zvuk. Lze hrát i se 4 prsty přidáním malíčku na 2. strunu 3. pražec.'
    },
    {
      name: 'D',
      category: 'Základní durové',
      difficulty: 'Střední',
      fingers: [
        { string: 3, fret: 2, finger: 1, label: 'Ukazovák (1)' },
        { string: 1, fret: 2, finger: 2, label: 'Prostředník (2)' },
        { string: 2, fret: 3, finger: 3, label: 'Prsteník (3)' }
      ],
      openStrings: [4],
      mutedStrings: [5, 6],
      shape: [-1, -1, 0, 2, 3, 2],
      tip: 'Hraj pouze spodní 4 struny (od struny D).'
    },
    {
      name: 'Dm',
      category: 'Základní mollové',
      difficulty: 'Střední',
      fingers: [
        { string: 1, fret: 1, finger: 1, label: 'Ukazovák (1)' },
        { string: 3, fret: 2, finger: 2, label: 'Prostředník (2)' },
        { string: 2, fret: 3, finger: 3, label: 'Prsteník (3)' }
      ],
      openStrings: [4],
      mutedStrings: [5, 6],
      shape: [-1, -1, 0, 2, 3, 1],
      tip: 'Pozor na 1. pražec tenkého E — natáhni ukazovák kolmo k pražci.'
    },
    {
      name: 'E',
      category: 'Základní durové',
      difficulty: 'Lehká',
      fingers: [
        { string: 3, fret: 1, finger: 1, label: 'Ukazovák (1)' },
        { string: 5, fret: 2, finger: 2, label: 'Prostředník (2)' },
        { string: 4, fret: 2, finger: 3, label: 'Prsteník (3)' }
      ],
      openStrings: [1, 2, 6],
      mutedStrings: [],
      shape: [0, 2, 2, 1, 0, 0],
      tip: 'Stejný prstoklad jako Am, pouze posunutý o jednu strunu výše!'
    },
    {
      name: 'A',
      category: 'Základní durové',
      difficulty: 'Střední',
      fingers: [
        { string: 4, fret: 2, finger: 1, label: 'Ukazovák (1)' },
        { string: 3, fret: 2, finger: 2, label: 'Prostředník (2)' },
        { string: 2, fret: 2, finger: 3, label: 'Prsteník (3)' }
      ],
      openStrings: [1, 5],
      mutedStrings: [6],
      shape: [-1, 0, 2, 2, 2, 0],
      tip: 'Tři prsty v jedné řadě na 2. pražci. Prsty namačkej těsně vedle sebe.'
    },
    {
      name: 'F',
      category: 'Bary / Pokročilé',
      difficulty: 'Těžká',
      fingers: [
        { string: 2, fret: 1, finger: 1, label: 'Ukazovák (1)' },
        { string: 1, fret: 1, finger: 1, label: 'Ukazovák (minibarré)' },
        { string: 3, fret: 2, finger: 2, label: 'Prostředník (2)' },
        { string: 4, fret: 3, finger: 3, label: 'Prsteník (3)' }
      ],
      openStrings: [],
      mutedStrings: [5, 6],
      shape: [-1, -1, 3, 2, 1, 1],
      tip: 'Zjednodušená verze F bez velkého barré. Hraj pouze spodní 4 struny.'
    }
  ];

  let _selectedChord = CHORD_LIBRARY[0];
  let _currentSubTab = 'atlas'; // 'atlas' | 'mistakes' | 'quiz'

  /**
   * Render the entire Practice view into the container.
   */
  function renderPracticeView(container) {
    if (!container) return;

    const mistakes = SongPlayer.getMistakes();
    const totalMistakesCount = mistakes.reduce((sum, m) => sum + (m.count || 1), 0);

    container.innerHTML = `
      <div class="practice-container" style="max-width: 1080px; margin: 0 auto; padding-bottom: 2rem;">
        <!-- Header -->
        <div class="view-header" style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h1 style="font-size: 2rem; font-weight: 900; color: #f8fafc; margin-bottom: 0.35rem;">
                🎸 Trénink, Akordy & Slabá místa
              </h1>
              <p class="view-subtitle" style="color: #94a3b8; margin: 0;">
                Interaktivní atlas akordů, nácvik prstokladů a cílené procvičování chyb z písniček
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-sm btn-ghost" onclick="App.navigate('#/songs')">🎵 Do knihovny písní</button>
            </div>
          </div>
        </div>

        <!-- Subtabs -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5rem; padding-bottom: 0.5rem;">
          <button
            class="btn btn-sm ${_currentSubTab === 'atlas' ? 'btn-primary' : 'btn-ghost'}"
            onclick="Practice.switchSubTab('atlas')"
            style="border-radius: 8px; font-weight: 700;"
          >
            📖 Atlas akordů & Hmatník
          </button>
          <button
            class="btn btn-sm ${_currentSubTab === 'mistakes' ? 'btn-primary' : 'btn-ghost'}"
            onclick="Practice.switchSubTab('mistakes')"
            style="border-radius: 8px; font-weight: 700; position: relative;"
          >
            ⚠️ Moje slabá místa & Chyby
            ${totalMistakesCount > 0 ? `
              <span style="background: #ef4444; color: white; font-size: 0.7rem; padding: 1px 6px; border-radius: 9999px; margin-left: 4px;">
                ${totalMistakesCount}
              </span>
            ` : ''}
          </button>
          <button
            class="btn btn-sm ${_currentSubTab === 'quiz' ? 'btn-primary' : 'btn-ghost'}"
            onclick="Practice.switchSubTab('quiz')"
            style="border-radius: 8px; font-weight: 700;"
          >
            🧠 Teoretický kvíz
          </button>
        </div>

        <!-- Content Area -->
        <div id="practice-tab-content">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    renderCurrentSubTab();
  }

  function switchSubTab(tab) {
    _currentSubTab = tab;
    const view = document.getElementById('view-practice');
    if (view) renderPracticeView(view);
  }

  function renderCurrentSubTab() {
    const content = document.getElementById('practice-tab-content');
    if (!content) return;

    if (_currentSubTab === 'atlas') {
      renderAtlasTab(content);
    } else if (_currentSubTab === 'mistakes') {
      renderMistakesTab(content);
    } else if (_currentSubTab === 'quiz') {
      if (typeof App !== 'undefined' && typeof App.renderGodPractice === 'function') {
        App.renderGodPractice(content);
      }
    }
  }

  // ── 1. Atlas akordů & Hmatník ─────────────────────────────────────────
  function renderAtlasTab(container) {
    const chord = _selectedChord;

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; align-items: start;">
        <!-- Left: Chord list selection -->
        <div class="card" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1rem;">
          <div style="font-size: 0.85rem; font-weight: 800; color: #a78bfa; text-transform: uppercase; margin-bottom: 0.75rem;">
            Výběr akordu
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.4rem; max-height: 520px; overflow-y: auto;">
            ${CHORD_LIBRARY.map(c => `
              <button
                type="button"
                onclick="Practice.selectChord('${c.name}')"
                style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid ${c.name === chord.name ? '#6366F1' : 'transparent'}; background: ${c.name === chord.name ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.5)'}; color: #f8fafc; cursor: pointer; text-align: left; transition: all 0.15s ease;"
              >
                <div>
                  <span style="font-size: 1.1rem; font-weight: 800; color: ${c.name === chord.name ? '#818CF8' : '#cbd5e1'};">
                    ${c.name}
                  </span>
                  <div style="font-size: 0.75rem; color: #94a3b8;">${c.category}</div>
                </div>
                <span style="font-size: 0.72rem; font-weight: 700; color: ${c.difficulty === 'Lehká' ? '#34d399' : (c.difficulty === 'Střední' ? '#fbbf24' : '#f87171')}; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">
                  ${c.difficulty}
                </span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Right: Interactive Fretboard & Sound -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Chord Showcase Card -->
          <div class="card" style="background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 20px; padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <h2 style="font-size: 2rem; font-weight: 900; color: #f8fafc; margin: 0;">
                    Akord ${chord.name}
                  </h2>
                  <span style="font-size: 0.8rem; font-weight: 700; color: #a78bfa; background: rgba(139, 92, 246, 0.2); padding: 0.2rem 0.6rem; border-radius: 6px;">
                    ${chord.category}
                  </span>
                </div>
                <div style="font-size: 0.9rem; color: #cbd5e1; margin-top: 0.25rem;">
                  💡 ${chord.tip}
                </div>
              </div>

              <!-- Sound Buttons -->
              <div style="display: flex; gap: 0.5rem;">
                <button
                  class="btn btn-primary"
                  onclick="Practice.playChordSound('${chord.name}')"
                  style="border-radius: 10px; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;"
                >
                  🔊 Zahrát akord
                </button>
                <button
                  class="btn btn-secondary"
                  onclick="Practice.playArpeggio('${chord.name}')"
                  style="border-radius: 10px; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;"
                >
                  🎶 Vybrnkat
                </button>
              </div>
            </div>

            <!-- Fretboard Diagram SVG -->
            <div style="background: #0A0F1D; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 1.5rem; display: flex; justify-content: center; overflow-x: auto;">
              ${renderFretboardSvg(chord)}
            </div>

            <!-- Finger legend -->
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap; font-size: 0.85rem; color: #94a3b8;">
              <span style="display: flex; align-items: center; gap: 0.35rem;">
                <span style="width: 14px; height: 14px; border-radius: 50%; background: #6366F1; display: inline-block;"></span>
                Stisknutý pražec (s číslem prstu)
              </span>
              <span style="display: flex; align-items: center; gap: 0.35rem;">
                <span style="width: 12px; height: 12px; border-radius: 50%; border: 2px solid #10B981; display: inline-block;"></span>
                O (otevřená struna)
              </span>
              <span style="display: flex; align-items: center; gap: 0.35rem;">
                <span style="color: #ef4444; font-weight: 900;">✕</span>
                X (tlumená / nehraná struna)
              </span>
            </div>
          </div>

          <!-- Quick Practice Trainer Callout -->
          <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15)); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.2rem;">
                Chceš procvičit akord ${chord.name} v reálné písničce?
              </div>
              <div style="font-size: 0.85rem; color: #cbd5e1;">
                Spusť herní dráhu a vyzkoušej si timing přímo v rytmu!
              </div>
            </div>
            <button
              class="btn btn-primary"
              onclick="Practice.startChordWorkout('${chord.name}')"
              style="border-radius: 10px; font-weight: 700;"
            >
              🎯 Spustit trénink akordu ▶
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function selectChord(chordName) {
    const found = CHORD_LIBRARY.find(c => c.name === chordName);
    if (found) {
      _selectedChord = found;
      const content = document.getElementById('practice-tab-content');
      if (content) renderAtlasTab(content);
    }
  }

  function playChordSound(chordName) {
    if (typeof AudioSynth !== 'undefined') {
      AudioSynth.playChord(chordName, { duration: 1.5, velocity: 0.55 });
    }
  }

  function playArpeggio(chordName) {
    if (typeof AudioSynth !== 'undefined') {
      const shape = AudioSynth.CHORD_SHAPES[chordName];
      if (!shape) return;
      const ac = AudioSynth.ensureContext();
      const now = ac.currentTime;
      let delay = 0;
      shape.forEach((fret, idx) => {
        if (fret < 0) return;
        const stringNum = 6 - idx; // 1-6
        setTimeout(() => {
          AudioSynth.playString(stringNum, fret);
        }, delay * 1000);
        delay += 0.18;
      });
    }
  }

  /**
   * Render SVG Fretboard for a chord diagram.
   */
  function renderFretboardSvg(chord) {
    const width = 420;
    const height = 240;
    const frets = 4; // Display 4 frets
    const leftMargin = 50;
    const rightMargin = 30;
    const topMargin = 45;
    const bottomMargin = 30;

    const fretWidth = (width - leftMargin - rightMargin) / frets;
    const stringHeight = (height - topMargin - bottomMargin) / 5;

    const stringNames = ['E', 'A', 'D', 'G', 'B', 'e']; // 6 to 1 (top to bottom on horizontal neck)

    let svg = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="max-width: 100%; height: auto; font-family: 'Segoe UI', sans-serif;">`;

    // Fretboard wood background
    svg += `<rect x="${leftMargin}" y="${topMargin - 5}" width="${width - leftMargin - rightMargin}" height="${height - topMargin - bottomMargin + 10}" fill="#1E293B" rx="6" stroke="#334155" stroke-width="1.5" />`;

    // Nut (nultý pražec - thick bar at left)
    svg += `<rect x="${leftMargin - 6}" y="${topMargin - 6}" width="8" height="${height - topMargin - bottomMargin + 12}" fill="#E2E8F0" rx="2" />`;

    // Frets (vertical lines)
    for (let f = 1; f <= frets; f++) {
      const x = leftMargin + f * fretWidth;
      svg += `<line x1="${x}" y1="${topMargin - 5}" x2="${x}" y2="${topMargin + 5 * stringHeight + 5}" stroke="#475569" stroke-width="2" />`;
      // Fret number at bottom
      svg += `<text x="${x - fretWidth / 2}" y="${height - 10}" fill="#94A3B8" font-size="11" font-weight="700" text-anchor="middle">${f}. pražec</text>`;
    }

    // Strings (horizontal lines, strings 6 to 1)
    for (let s = 0; s < 6; s++) {
      const y = topMargin + s * stringHeight;
      const thickness = 1 + (5 - s) * 0.4; // 6th string thickest (at top)
      svg += `<line x1="${leftMargin}" y1="${y}" x2="${width - rightMargin}" y2="${y}" stroke="#94A3B8" stroke-width="${thickness}" opacity="0.6" />`;

      // String name at left
      svg += `<text x="${leftMargin - 22}" y="${y + 4}" fill="#CBD5E1" font-size="12" font-weight="800" text-anchor="middle">${stringNames[s]}</text>`;

      // Open (O) or Muted (X) indicator
      const stringNum = 6 - s; // 1-6
      if (chord.mutedStrings.includes(stringNum)) {
        svg += `<text x="${leftMargin - 36}" y="${y + 5}" fill="#EF4444" font-size="13" font-weight="900" text-anchor="middle">✕</text>`;
      } else if (chord.openStrings.includes(stringNum)) {
        svg += `<circle cx="${leftMargin - 36}" cy="${y}" r="5" fill="none" stroke="#10B981" stroke-width="2" />`;
      }
    }

    // Finger dots on frets
    for (const f of chord.fingers) {
      const sIdx = 6 - f.string; // convert string 1-6 to row 0-5
      const y = topMargin + sIdx * stringHeight;
      const x = leftMargin + (f.fret - 0.5) * fretWidth;

      // Glow shadow
      svg += `<circle cx="${x}" cy="${y}" r="14" fill="rgba(99, 102, 241, 0.35)" />`;
      // Main dot
      svg += `<circle cx="${x}" cy="${y}" r="11" fill="#6366F1" stroke="#FFFFFF" stroke-width="2" />`;
      // Finger number
      svg += `<text x="${x}" y="${y + 4}" fill="#FFFFFF" font-size="11" font-weight="900" text-anchor="middle">${f.finger}</text>`;
    }

    svg += `</svg>`;
    return svg;
  }

  // ── 2. Sekce chyb (Mistake Tracker) ──────────────────────────────────
  function renderMistakesTab(container) {
    const mistakes = SongPlayer.getMistakes();

    if (mistakes.length === 0) {
      container.innerHTML = `
        <div class="card" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 3rem 2rem; text-align: center;">
          <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">🎉</div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.5rem;">
            Zatím nemáš zaznamenané žádné chyby!
          </h2>
          <p style="font-size: 0.95rem; color: #94a3b8; max-width: 500px; margin: 0 auto 1.5rem auto; line-height: 1.5;">
            Jakmile odehraješ libovolnou písničku na herní dráze, systém automaticky zaznamená všechny akordy a struny, kde jsi byl mimo rytmus, a připraví ti trénink na míru.
          </p>
          <button class="btn btn-primary" onclick="App.navigate('#/songs')" style="border-radius: 10px; font-weight: 700;">
            🎵 Vybrat písničku a začít hrát
          </button>
        </div>
      `;
      return;
    }

    // Sort by most missed
    const sorted = [...mistakes].sort((a, b) => (b.count || 1) - (a.count || 1));
    const topMistake = sorted[0];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Workout Launcher Banner -->
        <div class="card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(30, 41, 59, 0.9)); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 20px; padding: 1.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              🎯 Cílený trénink slabých míst
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 900; color: #f8fafc; margin-bottom: 0.35rem;">
              Nejvíce ti dělá problém akord: <span style="color: #fde68a;">${topMistake.chord}</span> (${topMistake.count}× zmeškáno)
            </h2>
            <p style="font-size: 0.9rem; color: #cbd5e1; margin: 0;">
              Spusť 60sekundový zrychlený trénink zaměřený výhradně na tvé problémové akordy.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button
              class="btn btn-primary"
              onclick="Practice.startMistakesWorkout()"
              style="border-radius: 12px; font-weight: 800; padding: 0.75rem 1.4rem; background: #EF4444; border-color: #DC2626;"
            >
              🎯 Spustit trénink chyb ▶
            </button>
            <button
              class="btn btn-ghost btn-sm"
              onclick="Practice.clearAllMistakes()"
              style="border-radius: 10px; color: #94a3b8;"
              title="Resetovat historii chyb"
            >
              Vymazat historii
            </button>
          </div>
        </div>

        <!-- Breakdown Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${sorted.map(m => {
            const chordInfo = CHORD_LIBRARY.find(c => c.name === m.chord);
            return `
              <div class="card" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 1.15rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span style="font-size: 1.35rem; font-weight: 900; color: #f8fafc;">
                      ${m.chord}
                    </span>
                    <span style="font-size: 0.75rem; font-weight: 700; color: #ef4444; background: rgba(239, 68, 68, 0.15); padding: 2px 7px; border-radius: 6px;">
                      ${m.count}× chyb
                    </span>
                  </div>
                  <div style="font-size: 0.8rem; color: #94a3b8;">
                    ${m.lastSong ? `Naposledy: ${m.lastSong}` : 'Běžící dráha'}
                  </div>
                </div>

                <div style="display: flex; gap: 0.4rem;">
                  <button
                    class="btn btn-sm btn-secondary"
                    onclick="Practice.selectChord('${m.chord}'); Practice.switchSubTab('atlas');"
                    style="border-radius: 8px; font-size: 0.8rem;"
                  >
                    Hmatník
                  </button>
                  <button
                    class="btn btn-sm btn-primary"
                    onclick="Practice.startChordWorkout('${m.chord}')"
                    style="border-radius: 8px; font-size: 0.8rem;"
                  >
                    Cvičit ▶
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function clearAllMistakes() {
    if (confirm('Opravdu chceš vymazat historii chyb a začít s čistým štítem?')) {
      SongPlayer.clearMistakes();
      const content = document.getElementById('practice-tab-content');
      if (content) renderMistakesTab(content);
      if (window.UI && typeof window.UI.showToast === 'function') {
        window.UI.showToast('Historie chyb byla vyčištěna.', 'info');
      }
    }
  }

  // ── 3. Spuštění tréninku akordu na herní dráze ─────────────────────────
  function startChordWorkout(chordName) {
    const workoutSong = {
      id: 999,
      title: `Trénink akordu ${chordName}`,
      artist: 'Melodrio Cvičební režim',
      chords: [chordName, chordName, chordName, chordName],
      bpm: 80,
      difficulty: 'Trénink',
      unlockLesson: 1,
      lyrics: `Tréninková smyčka pro zažití akordu ${chordName}`
    };

    if (typeof App !== 'undefined' && typeof App.launchSongPlayer === 'function') {
      App.launchSongPlayer(workoutSong);
    }
  }

  function startMistakesWorkout() {
    const mistakes = SongPlayer.getMistakes();
    if (mistakes.length === 0) return;

    const chordsToPractice = mistakes.map(m => m.chord).filter(Boolean);
    if (chordsToPractice.length === 0) chordsToPractice.push('Em', 'C');

    const workoutSong = {
      id: 998,
      title: 'Trénink mých chyb (Slabá místa)',
      artist: 'Melodrio Mistake Workout',
      chords: chordsToPractice,
      bpm: 85,
      difficulty: 'Trénink',
      unlockLesson: 1,
      lyrics: 'Cílené procvičování problémových akordů na herní dráze'
    };

    if (typeof App !== 'undefined' && typeof App.launchSongPlayer === 'function') {
      App.launchSongPlayer(workoutSong);
    }
  }

  // ── Public API ───────────────────────────────────────────────────────
  return {
    renderPracticeView,
    switchSubTab,
    selectChord,
    playChordSound,
    playArpeggio,
    startChordWorkout,
    startMistakesWorkout,
    clearAllMistakes,
    CHORD_LIBRARY
  };
})();
