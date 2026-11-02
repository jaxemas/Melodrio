/**
 * Melodrio Phase 2 — Song Player / Note Highway Engine
 * Renders a horizontal 6-string highway (Simply Guitar / Yousician style)
 * with chord and note blocks flowing right-to-left toward a Hit Line.
 *
 * Supports:
 *  - Tempo adjustment (0.5× – 1.25×)
 *  - Keyboard input: Space (strum) + keys 1-6 (individual strings)
 *  - Timing judgement: Perfect / Good / Miss with XP rewards
 *  - Mistake tracking for the Practice section
 *
 * Architecture: Prepared for Phase 3 microphone input — the hitNote()
 * method accepts input from any source (keyboard, mic, or auto).
 */

const SongPlayer = (() => {
  'use strict';

  // ── Constants ────────────────────────────────────────────────────────
  const STRING_COLORS = [
    '#EF4444', // E4 (string 1 - thinnest) - Red
    '#F59E0B', // B3 (string 2) - Amber
    '#10B981', // G3 (string 3) - Emerald
    '#3B82F6', // D3 (string 4) - Blue
    '#8B5CF6', // A2 (string 5) - Purple
    '#EC4899', // E2 (string 6 - thickest) - Pink
  ];

  const STRING_LABELS = ['E', 'B', 'G', 'D', 'A', 'E'];

  const HIT_LINE_X_PERCENT = 0.15; // Hit line at 15% from left
  const NOTE_SPEED_BASE = 200;     // px/sec at 1.0× speed, 120 BPM
  const PERFECT_WINDOW = 0.08;     // ±80ms
  const GOOD_WINDOW = 0.18;        // ±180ms

  // ── State ────────────────────────────────────────────────────────────
  let _canvas = null;
  let _ctxDraw = null;
  let _container = null;
  let _animId = null;
  let _playing = false;
  let _paused = false;

  let _song = null;         // Current song data
  let _noteTrack = [];       // Array of note events [{time, type, chord, strings, hit, judgement}, ...]
  let _songTime = 0;         // Current playback position in seconds
  let _lastFrameTime = 0;

  let _tempo = 1.0;          // Speed multiplier
  let _bpm = 120;
  let _beatsPerMeasure = 4;

  let _score = 0;
  let _combo = 0;
  let _maxCombo = 0;
  let _perfectCount = 0;
  let _goodCount = 0;
  let _missCount = 0;
  let _mistakes = [];        // [{chord, time, type:'miss'|'late'|'early'}, ...]
  let _feedbackQueue = [];    // [{text, color, x, y, opacity, time}, ...]

  let _metronomeEnabled = true;
  let _lastClickBeat = -1;

  let _onFinish = null;       // Callback when song ends

  // ── Song Data Generation ─────────────────────────────────────────────
  /**
   * Generate a note track from a song's chord progression.
   * Each chord gets a beat slot based on the song's BPM.
   */
  function generateNoteTrack(song) {
    const chords = song.chords || [];
    if (chords.length === 0) return [];

    const bpm = song.bpm || 120;
    _bpm = bpm;
    const beatDuration = 60 / bpm; // seconds per beat

    // Parse lyrics/chord progression to create timeline
    // For now: cycle through chords, 4 beats each (1 measure)
    const track = [];
    const totalBeats = Math.max(64, chords.length * 16); // At least 64 beats

    for (let beat = 0; beat < totalBeats; beat++) {
      const chordIdx = Math.floor(beat / _beatsPerMeasure) % chords.length;
      const chord = chords[chordIdx];
      const time = beat * beatDuration;

      if (beat % _beatsPerMeasure === 0) {
        // Full chord strum on downbeat
        track.push({
          time: time,
          type: 'chord',
          chord: chord,
          strings: getChordStrings(chord),
          hit: false,
          judgement: null,
        });
      } else if (beat % 2 === 0) {
        // Lighter strum on beats 3
        track.push({
          time: time,
          type: 'strum',
          chord: chord,
          strings: getChordStrings(chord),
          hit: false,
          judgement: null,
        });
      }
    }

    return track;
  }

  /**
   * Get which strings (0-5) are active for a chord.
   * Returns array of {stringIdx, fret} objects.
   */
  function getChordStrings(chordName) {
    const shape = (typeof AudioSynth !== 'undefined' && AudioSynth.CHORD_SHAPES)
      ? AudioSynth.CHORD_SHAPES[chordName]
      : null;

    if (!shape) {
      // Fallback: strum all strings open
      return [0,1,2,3,4,5].map(i => ({ stringIdx: i, fret: 0 }));
    }

    return shape
      .map((fret, idx) => fret >= 0 ? { stringIdx: idx, fret } : null)
      .filter(Boolean);
  }

  // ── Canvas Rendering ─────────────────────────────────────────────────
  function initCanvas(container) {
    _container = container;

    // Create canvas
    _canvas = document.createElement('canvas');
    _canvas.style.width = '100%';
    _canvas.style.height = '100%';
    _canvas.style.display = 'block';
    _canvas.style.borderRadius = '12px';
    container.appendChild(_canvas);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!_canvas || !_container) return;
    const rect = _container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    _canvas.width = rect.width * dpr;
    _canvas.height = rect.height * dpr;
    _ctxDraw = _canvas.getContext('2d');
    _ctxDraw.scale(dpr, dpr);
  }

  function getCanvasSize() {
    if (!_container) return { w: 960, h: 400 };
    const rect = _container.getBoundingClientRect();
    return { w: rect.width, h: rect.height };
  }

  function drawFrame() {
    if (!_ctxDraw) return;
    const { w, h } = getCanvasSize();
    const g = _ctxDraw;

    // Clear
    g.fillStyle = '#0A0F1D';
    g.fillRect(0, 0, w, h);

    const hitLineX = w * HIT_LINE_X_PERCENT;
    const stringAreaTop = 40;
    const stringAreaBottom = h - 60;
    const stringSpacing = (stringAreaBottom - stringAreaTop) / 5;

    // ── Draw string lines ───
    for (let i = 0; i < 6; i++) {
      const y = stringAreaTop + i * stringSpacing;
      const thickness = 1 + (i * 0.4); // thicker for bass strings

      // String line
      g.strokeStyle = STRING_COLORS[i] + '40'; // 25% opacity
      g.lineWidth = thickness;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();

      // String label on far left
      g.fillStyle = STRING_COLORS[i];
      g.font = 'bold 13px "Segoe UI", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(STRING_LABELS[i], 14, y);
    }

    // ── Draw hit line ───
    g.strokeStyle = '#FFFFFF';
    g.lineWidth = 2.5;
    g.setLineDash([6, 4]);
    g.beginPath();
    g.moveTo(hitLineX, stringAreaTop - 15);
    g.lineTo(hitLineX, stringAreaBottom + 15);
    g.stroke();
    g.setLineDash([]);

    // Hit line glow
    const glowGrad = g.createLinearGradient(hitLineX - 20, 0, hitLineX + 20, 0);
    glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0)');
    glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.15)');
    glowGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
    g.fillStyle = glowGrad;
    g.fillRect(hitLineX - 20, stringAreaTop - 15, 40, stringAreaBottom - stringAreaTop + 30);

    // ── Draw "PLAY HERE" label ───
    g.fillStyle = '#94A3B8';
    g.font = 'bold 10px "Segoe UI", sans-serif';
    g.textAlign = 'center';
    g.fillText('ZAHRAJ', hitLineX, stringAreaTop - 22);

    // ── Draw notes / chord blocks ───
    const beatDuration = 60 / _bpm;
    const pixelsPerSecond = NOTE_SPEED_BASE * _tempo * (_bpm / 120);

    for (const note of _noteTrack) {
      const dt = note.time - _songTime;
      const noteX = hitLineX + dt * pixelsPerSecond;

      // Only draw if visible
      if (noteX < -80 || noteX > w + 80) continue;

      // Already hit or missed?
      const alpha = note.hit ? 0.15 : (note.judgement === 'miss' ? 0.25 : 1.0);

      if (note.type === 'chord' || note.type === 'strum') {
        drawChordBlock(g, noteX, stringAreaTop, stringSpacing, note, alpha);
      }
    }

    // ── Draw floating feedback texts ───
    const now = performance.now() / 1000;
    _feedbackQueue = _feedbackQueue.filter(fb => {
      const age = now - fb.spawnTime;
      if (age > 1.2) return false;
      const opacity = Math.max(0, 1 - age / 1.2);
      const yOff = age * 40;
      g.globalAlpha = opacity;
      g.fillStyle = fb.color;
      g.font = `bold ${fb.size || 18}px "Segoe UI", sans-serif`;
      g.textAlign = 'center';
      g.fillText(fb.text, fb.x, fb.y - yOff);
      g.globalAlpha = 1;
      return true;
    });

    // ── HUD: Score, Combo, Tempo ───
    g.fillStyle = '#F8FAFC';
    g.font = 'bold 16px "Segoe UI", sans-serif';
    g.textAlign = 'left';
    g.fillText('Skore: ' + _score, 10, h - 30);

    if (_combo > 1) {
      g.fillStyle = '#FBBF24';
      g.fillText('Combo: ' + _combo + 'x', 10, h - 10);
    }

    g.fillStyle = '#94A3B8';
    g.textAlign = 'right';
    g.font = '13px "Segoe UI", sans-serif';
    const elapsed = Math.floor(_songTime);
    const totalTime = Math.floor((_noteTrack.length > 0 ? _noteTrack[_noteTrack.length - 1].time + 2 : 0));
    g.fillText(formatTime(elapsed) + ' / ' + formatTime(totalTime), w - 10, h - 10);

    g.fillText('Tempo: ' + _tempo.toFixed(2) + 'x', w - 10, h - 30);
  }

  function drawChordBlock(g, x, stringAreaTop, stringSpacing, note, alpha) {
    const strings = note.strings || [];
    if (strings.length === 0) return;

    g.globalAlpha = alpha;

    // Determine vertical range
    const minStr = Math.min(...strings.map(s => s.stringIdx));
    const maxStr = Math.max(...strings.map(s => s.stringIdx));
    const topY = stringAreaTop + minStr * stringSpacing - 12;
    const botY = stringAreaTop + maxStr * stringSpacing + 12;

    // Block background
    const isStrum = note.type === 'strum';
    const blockW = isStrum ? 30 : 50;
    const radius = 8;

    // Color based on judgement
    let baseColor = '#6366F1';
    if (note.judgement === 'perfect') baseColor = '#10B981';
    else if (note.judgement === 'good') baseColor = '#3B82F6';
    else if (note.judgement === 'miss') baseColor = '#EF4444';

    g.fillStyle = baseColor + (isStrum ? '90' : 'CC');
    roundRect(g, x - blockW / 2, topY, blockW, botY - topY, radius);
    g.fill();

    // Border
    g.strokeStyle = baseColor;
    g.lineWidth = 1.5;
    roundRect(g, x - blockW / 2, topY, blockW, botY - topY, radius);
    g.stroke();

    // Chord name inside block
    if (note.chord && !isStrum) {
      g.fillStyle = '#FFFFFF';
      g.font = 'bold 14px "Segoe UI", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(note.chord, x, (topY + botY) / 2);
    }

    // Individual string dots
    for (const s of strings) {
      const dotY = stringAreaTop + s.stringIdx * stringSpacing;
      g.fillStyle = STRING_COLORS[s.stringIdx];
      g.globalAlpha = alpha * 0.8;
      g.beginPath();
      g.arc(x, dotY, isStrum ? 4 : 6, 0, Math.PI * 2);
      g.fill();
    }

    g.globalAlpha = 1;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // ── Game Loop ────────────────────────────────────────────────────────
  function gameLoop(timestamp) {
    if (!_playing) return;

    if (_paused) {
      _lastFrameTime = timestamp;
      _animId = requestAnimationFrame(gameLoop);
      drawFrame();
      return;
    }

    const dtMs = timestamp - _lastFrameTime;
    _lastFrameTime = timestamp;
    const dt = (dtMs / 1000) * _tempo;
    _songTime += dt;

    // Metronome clicks
    if (_metronomeEnabled) {
      const beatDuration = 60 / _bpm;
      const currentBeat = Math.floor(_songTime / beatDuration);
      if (currentBeat !== _lastClickBeat && _songTime > 0) {
        _lastClickBeat = currentBeat;
        const isAccent = (currentBeat % _beatsPerMeasure === 0);
        if (typeof AudioSynth !== 'undefined') {
          AudioSynth.playClick(isAccent);
        }
      }
    }

    // Auto-miss notes that have passed the window
    for (const note of _noteTrack) {
      if (note.hit || note.judgement) continue;
      const dt2 = note.time - _songTime;
      if (dt2 < -GOOD_WINDOW) {
        note.judgement = 'miss';
        _missCount++;
        _combo = 0;
        _mistakes.push({
          chord: note.chord,
          time: note.time,
          type: 'miss',
        });
        spawnFeedback('Mimo!', '#EF4444', note);
      }
    }

    // Check if song ended
    if (_noteTrack.length > 0) {
      const lastNote = _noteTrack[_noteTrack.length - 1];
      if (_songTime > lastNote.time + 3) {
        finishSong();
        return;
      }
    }

    drawFrame();
    _animId = requestAnimationFrame(gameLoop);
  }

  // ── Hit Detection ────────────────────────────────────────────────────
  /**
   * Called when player presses a key (or in Phase 3, when mic detects a note).
   * @param {string} inputType  'strum' or 'string'
   * @param {number} stringNum  1-6 (only for 'string' type)
   */
  function hitNote(inputType, stringNum) {
    if (!_playing || _paused) return;

    // Find the closest unhit note within the timing window
    let closest = null;
    let closestDt = Infinity;

    for (const note of _noteTrack) {
      if (note.hit || note.judgement) continue;
      const dt = Math.abs(note.time - _songTime);
      if (dt > GOOD_WINDOW) continue;

      if (inputType === 'strum' && (note.type === 'chord' || note.type === 'strum')) {
        if (dt < closestDt) {
          closestDt = dt;
          closest = note;
        }
      } else if (inputType === 'string') {
        // Check if this note contains the pressed string
        const strIdx = 6 - stringNum; // 1-based (high E first) to 0-based array
        const hasString = note.strings && note.strings.some(s => s.stringIdx === strIdx);
        if (hasString && dt < closestDt) {
          closestDt = dt;
          closest = note;
        }
      }
    }

    if (!closest) return;

    closest.hit = true;
    const dt = Math.abs(closest.time - _songTime);

    if (dt <= PERFECT_WINDOW) {
      closest.judgement = 'perfect';
      _perfectCount++;
      _score += 100 * (1 + Math.floor(_combo / 10));
      _combo++;
      spawnFeedback('Perfektni!', '#10B981', closest, 22);
      if (typeof AudioSynth !== 'undefined') AudioSynth.playFeedback('perfect');
    } else if (dt <= GOOD_WINDOW) {
      closest.judgement = 'good';
      _goodCount++;
      _score += 50 * (1 + Math.floor(_combo / 10));
      _combo++;
      spawnFeedback('Dobre!', '#3B82F6', closest);
      if (typeof AudioSynth !== 'undefined') AudioSynth.playFeedback('good');
    }

    if (_combo > _maxCombo) _maxCombo = _combo;

    // Play the chord sound
    if (typeof AudioSynth !== 'undefined' && closest.chord) {
      AudioSynth.playChord(closest.chord, { duration: 0.8, velocity: 0.4 });
    }
  }

  function spawnFeedback(text, color, note, size) {
    const { w, h } = getCanvasSize();
    const hitLineX = w * HIT_LINE_X_PERCENT;
    _feedbackQueue.push({
      text,
      color,
      x: hitLineX,
      y: h / 2 - 30,
      size: size || 18,
      spawnTime: performance.now() / 1000,
    });
  }

  // ── Song Lifecycle ───────────────────────────────────────────────────
  function startSong(song, onFinishCb) {
    if (_playing) stopSong();

    _song = song;
    _noteTrack = generateNoteTrack(song);
    _songTime = -2; // 2-second countdown before first note
    _score = 0;
    _combo = 0;
    _maxCombo = 0;
    _perfectCount = 0;
    _goodCount = 0;
    _missCount = 0;
    _mistakes = [];
    _feedbackQueue = [];
    _lastClickBeat = -1;
    _playing = true;
    _paused = false;
    _onFinish = onFinishCb || null;

    if (typeof AudioSynth !== 'undefined') AudioSynth.ensureContext();

    _lastFrameTime = performance.now();
    _animId = requestAnimationFrame(gameLoop);

    // Attach keyboard handlers
    window.addEventListener('keydown', _keyHandler);
  }

  function stopSong() {
    _playing = false;
    _paused = false;
    if (_animId) cancelAnimationFrame(_animId);
    _animId = null;
    window.removeEventListener('keydown', _keyHandler);
  }

  function pauseSong() {
    _paused = !_paused;
    return _paused;
  }

  function finishSong() {
    stopSong();

    const totalNotes = _noteTrack.length;
    const hitNotes = _perfectCount + _goodCount;
    const accuracy = totalNotes > 0 ? Math.round((hitNotes / totalNotes) * 100) : 0;

    const result = {
      song: _song,
      score: _score,
      accuracy,
      perfectCount: _perfectCount,
      goodCount: _goodCount,
      missCount: _missCount,
      maxCombo: _maxCombo,
      totalNotes,
      mistakes: [..._mistakes],
    };

    // Save mistakes to localStorage for Practice section
    saveMistakes(result.mistakes);

    if (_onFinish) _onFinish(result);
  }

  // ── Tempo Control ────────────────────────────────────────────────────
  function setTempo(t) {
    _tempo = Math.max(0.25, Math.min(2.0, t));
  }
  function getTempo() { return _tempo; }

  function setMetronome(enabled) { _metronomeEnabled = enabled; }

  // ── Mistake Persistence ──────────────────────────────────────────────
  function saveMistakes(newMistakes) {
    if (!newMistakes || newMistakes.length === 0) return;
    try {
      const existing = JSON.parse(localStorage.getItem('melodrio_mistakes') || '[]');
      for (const m of newMistakes) {
        const found = existing.find(e => e.chord === m.chord);
        if (found) {
          found.count = (found.count || 1) + 1;
          found.lastSong = _song ? _song.title : '';
        } else {
          existing.push({
            chord: m.chord,
            count: 1,
            type: m.type,
            lastSong: _song ? _song.title : '',
          });
        }
      }
      localStorage.setItem('melodrio_mistakes', JSON.stringify(existing));
    } catch (e) { /* ignore */ }
  }

  function getMistakes() {
    try {
      return JSON.parse(localStorage.getItem('melodrio_mistakes') || '[]');
    } catch (e) { return []; }
  }

  function clearMistakes() {
    localStorage.removeItem('melodrio_mistakes');
  }

  // ── Keyboard Handler ─────────────────────────────────────────────────
  function _keyHandler(e) {
    if (!_playing) return;

    if (e.code === 'Space') {
      e.preventDefault();
      hitNote('strum', 0);
    } else if (e.key >= '1' && e.key <= '6') {
      e.preventDefault();
      hitNote('string', parseInt(e.key));
    } else if (e.code === 'Escape') {
      stopSong();
    } else if (e.key === 'p' || e.key === 'P') {
      pauseSong();
    }
  }

  // ── Cleanup ──────────────────────────────────────────────────────────
  function destroy() {
    stopSong();
    if (_canvas && _canvas.parentNode) {
      _canvas.parentNode.removeChild(_canvas);
    }
    window.removeEventListener('resize', resizeCanvas);
    _canvas = null;
    _ctxDraw = null;
    _container = null;
  }

  // ── Public API ───────────────────────────────────────────────────────
  return {
    initCanvas,
    startSong,
    stopSong,
    pauseSong,
    finishSong,
    setTempo,
    getTempo,
    setMetronome,
    hitNote,
    getMistakes,
    clearMistakes,
    destroy,
    isPlaying: () => _playing,
    isPaused: () => _paused,
    getScore: () => _score,
  };
})();
