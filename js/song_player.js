/**
 * Melodrio Phase 2 — Song Player & Note Highway Engine
 * Renders a horizontal 6-string highway (Simply Guitar / Yousician style)
 * with chord blocks, individual string notes, moving rhythm grid,
 * countdown animation, and Web Audio guitar synthesizer integration.
 */

const SongPlayer = (() => {
  'use strict';

  // ── 6 Guitar Strings Configuration (Top to Bottom: high e to low E) ──
  const STRINGS = [
    { stringNum: 1, name: 'e', note: 'E4', color: '#F43F5E', thickness: 1.5, shapeIdx: 5 }, // String 1 (thinnest) - Rose
    { stringNum: 2, name: 'B', note: 'B3', color: '#F59E0B', thickness: 2.0, shapeIdx: 4 }, // String 2 - Amber
    { stringNum: 3, name: 'G', note: 'G3', color: '#10B981', thickness: 2.6, shapeIdx: 3 }, // String 3 - Emerald
    { stringNum: 4, name: 'D', note: 'D3', color: '#38BDF8', thickness: 3.2, shapeIdx: 2 }, // String 4 - Cyan
    { stringNum: 5, name: 'A', note: 'A2', color: '#A855F7', thickness: 4.0, shapeIdx: 1 }, // String 5 - Purple
    { stringNum: 6, name: 'E', note: 'E2', color: '#EC4899', thickness: 5.0, shapeIdx: 0 }, // String 6 (thickest) - Pink
  ];

  const HIT_LINE_X_PERCENT = 0.18; // Hit line at 18% from left
  const NOTE_SPEED_BASE = 220;     // px/sec at 1.0× speed and 120 BPM
  const PERFECT_WINDOW = 0.09;     // ±90ms
  const GOOD_WINDOW = 0.20;        // ±200ms

  // ── Engine State ─────────────────────────────────────────────────────
  let _canvas = null;
  let _ctxDraw = null;
  let _container = null;
  let _animId = null;
  let _playing = false;
  let _paused = false;

  let _song = null;
  let _noteTrack = [];
  let _songTime = -3.0; // 3-second countdown before beat 0
  let _lastFrameTime = 0;

  let _tempo = 1.0;
  let _bpm = 120;
  let _beatsPerMeasure = 4;

  let _score = 0;
  let _combo = 0;
  let _maxCombo = 0;
  let _perfectCount = 0;
  let _goodCount = 0;
  let _missCount = 0;
  let _mistakes = [];
  let _feedbackQueue = [];
  let _hitRipples = [];

  let _metronomeEnabled = true;
  let _lastClickBeat = -999;
  let _onFinish = null;

  // ── Note Track Generation ────────────────────────────────────────────
  function generateNoteTrack(song) {
    const chords = song.chords || ['Em', 'Am', 'C', 'G'];
    const bpm = song.bpm || 120;
    _bpm = bpm;
    const beatDuration = 60 / bpm;

    const track = [];
    const totalBeats = Math.max(64, chords.length * 16);

    for (let beat = 0; beat < totalBeats; beat++) {
      const chordIdx = Math.floor(beat / _beatsPerMeasure) % chords.length;
      const chord = chords[chordIdx];
      const time = beat * beatDuration;

      // Downbeat (beat 1): full chord strum
      if (beat % _beatsPerMeasure === 0) {
        track.push({
          id: 'n_' + beat,
          beat: beat,
          time: time,
          type: 'chord',
          chord: chord,
          frets: getChordFrets(chord),
          hit: false,
          judgement: null,
        });
      } else if (beat % 2 === 0) {
        // Beat 3: secondary strum
        track.push({
          id: 'n_' + beat,
          beat: beat,
          time: time,
          type: 'strum',
          chord: chord,
          frets: getChordFrets(chord),
          hit: false,
          judgement: null,
        });
      }
    }

    return track;
  }

  /**
   * Get array of 6 fret numbers for strings 1..6 (top to bottom).
   * Maps shapeIdx 5..0 to lines 0..5.
   */
  function getChordFrets(chordName) {
    const shape = (typeof AudioSynth !== 'undefined' && AudioSynth.CHORD_SHAPES)
      ? AudioSynth.CHORD_SHAPES[chordName]
      : null;

    if (!shape) {
      return [0, 0, 0, 0, 0, 0];
    }

    // shape is [lowE, A, D, G, B, highE] -> indices 0..5
    // STRINGS array lines 0..5 correspond to:
    // line 0: high e -> shape[5]
    // line 1: B      -> shape[4]
    // line 2: G      -> shape[3]
    // line 3: D      -> shape[2]
    // line 4: A      -> shape[1]
    // line 5: low E  -> shape[0]
    return STRINGS.map(s => shape[s.shapeIdx]);
  }

  // ── Canvas Setup & Resizing ──────────────────────────────────────────
  function initCanvas(container) {
    _container = container;

    // Remove any existing canvas inside container
    container.innerHTML = '';

    _canvas = document.createElement('canvas');
    _canvas.style.width = '100%';
    _canvas.style.height = '100%';
    _canvas.style.display = 'block';
    _canvas.style.borderRadius = '16px';
    container.appendChild(_canvas);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!_canvas || !_container) return;
    const rect = _container.getBoundingClientRect();
    const w = Math.round(rect.width) || _container.clientWidth || 960;
    const h = Math.round(rect.height) || _container.clientHeight || 420;

    if (w <= 0 || h <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);

    if (_canvas.width !== targetW || _canvas.height !== targetH) {
      _canvas.width = targetW;
      _canvas.height = targetH;
    }

    _ctxDraw = _canvas.getContext('2d');
    _ctxDraw.setTransform(1, 0, 0, 1, 0, 0);
    _ctxDraw.scale(dpr, dpr);
  }

  function getCanvasSize() {
    if (!_container) return { w: 960, h: 420 };
    const rect = _container.getBoundingClientRect();
    const w = Math.round(rect.width) || _container.clientWidth || 960;
    const h = Math.round(rect.height) || _container.clientHeight || 420;
    return { w, h };
  }

  // ── Main Rendering Function ──────────────────────────────────────────
  function drawFrame() {
    if (!_ctxDraw || !_container) return;

    // Self-healing check: ensure canvas dimensions match visible container
    const { w, h } = getCanvasSize();
    const dpr = window.devicePixelRatio || 1;
    if (_canvas.width !== Math.round(w * dpr) || _canvas.height !== Math.round(h * dpr)) {
      resizeCanvas();
    }

    const g = _ctxDraw;

    // 1. Background fill
    const bgGrad = g.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0B1120');
    bgGrad.addColorStop(1, '#070C18');
    g.fillStyle = bgGrad;
    g.fillRect(0, 0, w, h);

    // Geometry layout
    const hitLineX = Math.round(w * HIT_LINE_X_PERCENT);
    const headerH = 45;
    const footerH = 45;
    const stringAreaTop = headerH + 20;
    const stringAreaBottom = h - footerH - 20;
    const stringSpacing = (stringAreaBottom - stringAreaTop) / 5;

    // 2. Nut / Headstock Zone (left of hit line)
    g.fillStyle = 'rgba(15, 23, 42, 0.7)';
    g.fillRect(0, stringAreaTop - 18, hitLineX, stringAreaBottom - stringAreaTop + 36);

    // Vertical boundary line (Nut)
    g.fillStyle = '#334155';
    g.fillRect(hitLineX - 4, stringAreaTop - 18, 4, stringAreaBottom - stringAreaTop + 36);

    // 3. Moving Rhythm Grid (Beat bars)
    const beatDuration = 60 / _bpm;
    const pixelsPerSecond = NOTE_SPEED_BASE * _tempo * (_bpm / 120);

    // Determine beat range visible on screen
    const minTime = _songTime - 0.5;
    const maxTime = _songTime + (w - hitLineX) / pixelsPerSecond + 1;
    const startBeat = Math.max(0, Math.floor(minTime / beatDuration));
    const endBeat = Math.ceil(maxTime / beatDuration);

    for (let b = startBeat; b <= endBeat; b++) {
      const beatTime = b * beatDuration;
      const bx = hitLineX + (beatTime - _songTime) * pixelsPerSecond;
      if (bx < hitLineX || bx > w + 20) continue;

      const isDownbeat = (b % _beatsPerMeasure === 0);

      g.beginPath();
      if (isDownbeat) {
        g.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        g.lineWidth = 2;
        g.setLineDash([]);
      } else {
        g.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        g.lineWidth = 1;
        g.setLineDash([4, 4]);
      }
      g.moveTo(bx, stringAreaTop - 10);
      g.lineTo(bx, stringAreaBottom + 10);
      g.stroke();
      g.setLineDash([]);

      // Measure number badge on downbeat
      if (isDownbeat) {
        const measureNum = Math.floor(b / _beatsPerMeasure) + 1;
        g.fillStyle = 'rgba(148, 163, 184, 0.6)';
        g.font = 'bold 10px "Segoe UI", sans-serif';
        g.textAlign = 'center';
        g.fillText('Takt ' + measureNum, bx, stringAreaTop - 14);
      }
    }

    // 4. Horizontal Guitar Strings
    for (let i = 0; i < 6; i++) {
      const s = STRINGS[i];
      const y = Math.round(stringAreaTop + i * stringSpacing);

      // String Lane Glow
      const laneGrad = g.createLinearGradient(0, y - 8, 0, y + 8);
      laneGrad.addColorStop(0, 'rgba(0,0,0,0)');
      laneGrad.addColorStop(0.5, s.color + '18');
      laneGrad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = laneGrad;
      g.fillRect(hitLineX, y - 8, w - hitLineX, 16);

      // String wire
      g.strokeStyle = s.color + '75';
      g.lineWidth = s.thickness;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();

      // String wire highlight
      g.strokeStyle = '#FFFFFF35';
      g.lineWidth = Math.max(1, s.thickness * 0.4);
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();

      // String badge on far left (Headstock)
      const badgeX = Math.round(hitLineX * 0.45);
      g.fillStyle = s.color + '25';
      roundRect(g, badgeX - 22, y - 11, 44, 22, 6);
      g.fill();
      g.strokeStyle = s.color;
      g.lineWidth = 1.2;
      roundRect(g, badgeX - 22, y - 11, 44, 22, 6);
      g.stroke();

      // String key & note label
      g.fillStyle = '#F8FAFC';
      g.font = 'bold 11px "Segoe UI", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(`[${s.stringNum}] ${s.name}`, badgeX, y);
    }

    // 5. Target / Hit Line (Neon laser strum line)
    // Laser glow
    const laserGlow = g.createLinearGradient(hitLineX - 24, 0, hitLineX + 24, 0);
    laserGlow.addColorStop(0, 'rgba(99, 102, 241, 0)');
    laserGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.35)');
    laserGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
    g.fillStyle = laserGlow;
    g.fillRect(hitLineX - 24, stringAreaTop - 18, 48, stringAreaBottom - stringAreaTop + 36);

    // Center laser line
    g.strokeStyle = '#FFFFFF';
    g.lineWidth = 2.5;
    g.beginPath();
    g.moveTo(hitLineX, stringAreaTop - 18);
    g.lineTo(hitLineX, stringAreaBottom + 18);
    g.stroke();

    // Strum Zone Receptors on each string
    for (let i = 0; i < 6; i++) {
      const s = STRINGS[i];
      const y = Math.round(stringAreaTop + i * stringSpacing);

      // Receptor circle
      g.fillStyle = '#0B1120';
      g.beginPath();
      g.arc(hitLineX, y, 10, 0, Math.PI * 2);
      g.fill();

      g.strokeStyle = s.color;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(hitLineX, y, 10, 0, Math.PI * 2);
      g.stroke();
    }

    // Top Strum Zone Label
    g.fillStyle = '#FBBF24';
    g.font = '900 11px "Segoe UI", sans-serif';
    g.textAlign = 'center';
    g.fillText('🎯 ZDE ZAHRÁJ [MEZERNÍK]', hitLineX, stringAreaTop - 25);

    // 6. Hit Ripple Effects
    const nowSec = performance.now() / 1000;
    _hitRipples = _hitRipples.filter(r => {
      const age = nowSec - r.spawn;
      if (age > 0.45) return false;
      const progress = age / 0.45;
      const radius = 12 + progress * 40;
      const alpha = (1 - progress) * 0.7;

      g.strokeStyle = r.color;
      g.globalAlpha = alpha;
      g.lineWidth = 3 * (1 - progress);
      g.beginPath();
      g.arc(r.x, r.y, radius, 0, Math.PI * 2);
      g.stroke();
      g.globalAlpha = 1;
      return true;
    });

    // 7. Render Notes / Chord Blocks
    for (const note of _noteTrack) {
      const dt = note.time - _songTime;
      const noteX = hitLineX + dt * pixelsPerSecond;

      // Only draw if visible on screen
      if (noteX < -100 || noteX > w + 120) continue;

      drawChordCard(g, noteX, stringAreaTop, stringSpacing, note);
    }

    // 8. Countdown Overlay (Before song starts: _songTime < 0)
    if (_songTime < 0) {
      drawCountdownOverlay(g, w, h, hitLineX, stringAreaTop, stringAreaBottom);
    }

    // 9. Floating Feedback Texts (Perfektní! / Dobře! / Mimo!)
    _feedbackQueue = _feedbackQueue.filter(fb => {
      const age = nowSec - fb.spawnTime;
      if (age > 1.1) return false;
      const progress = age / 1.1;
      const opacity = Math.max(0, 1 - progress);
      const yOffset = progress * 48;
      const scale = 1 + progress * 0.2;

      g.save();
      g.globalAlpha = opacity;
      g.fillStyle = fb.color;
      g.shadowColor = fb.color;
      g.shadowBlur = 10;
      g.font = `900 ${Math.round(fb.size * scale)}px "Segoe UI", sans-serif`;
      g.textAlign = 'center';
      g.fillText(fb.text, fb.x, fb.y - yOffset);
      g.restore();
      return true;
    });

    // 10. HUD — Header & Footer Stats
    drawHUD(g, w, h);
  }

  // ── Render Individual Chord Card ──────────────────────────────────────
  function drawChordCard(g, x, stringAreaTop, stringSpacing, note) {
    const frets = note.frets || [0, 0, 0, 0, 0, 0];
    const isStrum = (note.type === 'strum');
    const isPassed = (note.hit || note.judgement === 'miss');

    // Opacity based on hit/miss state
    let alpha = 1.0;
    if (note.hit) alpha = 0.25;
    else if (note.judgement === 'miss') alpha = 0.35;

    g.save();
    g.globalAlpha = alpha;

    // Determine vertical range of active strings
    let minIdx = -1;
    let maxIdx = -1;
    for (let i = 0; i < 6; i++) {
      if (frets[i] >= 0) {
        if (minIdx === -1) minIdx = i;
        maxIdx = i;
      }
    }
    if (minIdx === -1) { minIdx = 0; maxIdx = 5; }

    const topY = stringAreaTop + minIdx * stringSpacing - 14;
    const botY = stringAreaTop + maxIdx * stringSpacing + 14;
    const cardW = isStrum ? 48 : 68;
    const cardX = Math.round(x - cardW / 2);

    // Color theme
    let cardTheme = '#6366F1'; // Default Indigo
    if (note.judgement === 'perfect') cardTheme = '#10B981';
    else if (note.judgement === 'good') cardTheme = '#38BDF8';
    else if (note.judgement === 'miss') cardTheme = '#EF4444';

    // 1. Vertical Glow Beam
    const beamGrad = g.createLinearGradient(cardX, 0, cardX + cardW, 0);
    beamGrad.addColorStop(0, cardTheme + '15');
    beamGrad.addColorStop(0.5, cardTheme + (isStrum ? '35' : '55'));
    beamGrad.addColorStop(1, cardTheme + '15');
    g.fillStyle = beamGrad;
    roundRect(g, cardX, topY, cardW, botY - topY, 12);
    g.fill();

    // 2. Card Border
    g.strokeStyle = cardTheme;
    g.lineWidth = isStrum ? 1.5 : 2.5;
    roundRect(g, cardX, topY, cardW, botY - topY, 12);
    g.stroke();

    // 3. Top Chord Name Banner
    if (note.chord) {
      const bannerH = 24;
      const bannerW = isStrum ? 44 : 56;
      const bannerY = topY - bannerH - 4;
      const bannerX = Math.round(x - bannerW / 2);

      g.fillStyle = '#0F172A';
      roundRect(g, bannerX, bannerY, bannerW, bannerH, 6);
      g.fill();

      g.strokeStyle = cardTheme;
      g.lineWidth = 1.5;
      roundRect(g, bannerX, bannerY, bannerW, bannerH, 6);
      g.stroke();

      g.fillStyle = '#FFFFFF';
      g.font = `900 ${isStrum ? 12 : 14}px "Segoe UI", sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(note.chord + (isStrum ? ' ↓' : ''), x, bannerY + bannerH / 2);
    }

    // 4. String Note Pucks (Circles on each active string)
    for (let i = 0; i < 6; i++) {
      const fret = frets[i];
      const y = Math.round(stringAreaTop + i * stringSpacing);
      const strColor = STRINGS[i].color;

      if (fret >= 0) {
        // Active played string (open=0 or fretted=1,2,3...)
        const puckRadius = isStrum ? 10 : 13;

        // Puck Outer Glow
        g.fillStyle = strColor;
        g.beginPath();
        g.arc(x, y, puckRadius, 0, Math.PI * 2);
        g.fill();

        // Puck Inner Core
        g.fillStyle = '#0F172A';
        g.beginPath();
        g.arc(x, y, puckRadius - 2.5, 0, Math.PI * 2);
        g.fill();

        // Fret Number inside puck
        g.fillStyle = '#F8FAFC';
        g.font = `900 ${isStrum ? 10 : 12}px "Segoe UI", sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(fret === 0 ? '0' : String(fret), x, y);
      } else {
        // Muted string (fret === -1)
        g.fillStyle = '#EF4444';
        g.font = '900 13px "Segoe UI", sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText('✕', x, y);
      }
    }

    g.restore();
  }

  // ── Countdown Overlay (3... 2... 1... START!) ────────────────────────
  function drawCountdownOverlay(g, w, h, hitLineX, stringAreaTop, stringAreaBottom) {
    const remaining = -_songTime; // e.g. 3.0 down to 0.0
    let countNum = '1';
    let countColor = '#10B981'; // Green
    let label = 'PŘIPRAV SE!';

    if (remaining > 2.0) {
      countNum = '3';
      countColor = '#F59E0B'; // Amber
      label = 'PŘIPRAV SE!';
    } else if (remaining > 1.0) {
      countNum = '2';
      countColor = '#38BDF8'; // Cyan
      label = 'ZAUJMI AKORD...';
    } else if (remaining > 0) {
      countNum = '1';
      countColor = '#10B981'; // Green
      label = 'JDE SE NA TO!';
    }

    // Fraction within current second for pulse scale effect
    const frac = remaining % 1.0;
    const pulseScale = 1 + (1 - frac) * 0.25;

    const centerY = Math.round((stringAreaTop + stringAreaBottom) / 2);
    const centerX = Math.round(w * 0.52);

    g.save();

    // Dark backdrop pill behind countdown
    g.fillStyle = 'rgba(15, 23, 42, 0.85)';
    roundRect(g, centerX - 120, centerY - 70, 240, 140, 24);
    g.fill();
    g.strokeStyle = countColor;
    g.lineWidth = 2.5;
    roundRect(g, centerX - 120, centerY - 70, 240, 140, 24);
    g.stroke();

    // Countdown Number with glow
    g.fillStyle = countColor;
    g.shadowColor = countColor;
    g.shadowBlur = 20;
    g.font = `900 ${Math.round(56 * pulseScale)}px "Segoe UI", sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(countNum, centerX, centerY - 10);

    // Subtitle label
    g.shadowBlur = 0;
    g.fillStyle = '#CBD5E1';
    g.font = 'bold 13px "Segoe UI", sans-serif';
    g.fillText(label, centerX, centerY + 42);

    g.restore();
  }

  // ── HUD: Score, Combo, Progress Bar ──────────────────────────────────
  function drawHUD(g, w, h) {
    // Top Bar Background
    g.fillStyle = 'rgba(15, 23, 42, 0.9)';
    g.fillRect(0, 0, w, 40);
    g.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(0, 40);
    g.lineTo(w, 40);
    g.stroke();

    // Song Title & Artist (Left)
    if (_song) {
      g.fillStyle = '#F8FAFC';
      g.font = 'bold 13px "Segoe UI", sans-serif';
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      g.fillText(`🎵 ${_song.title} — ${_song.artist}`, 16, 20);
    }

    // Progress Bar (Center)
    const totalTime = _noteTrack.length > 0 ? _noteTrack[_noteTrack.length - 1].time + 2 : 60;
    const currentProgress = Math.max(0, Math.min(1, _songTime / totalTime));
    const barW = Math.min(280, w * 0.28);
    const barX = Math.round((w - barW) / 2);
    const barY = 15;
    const barH = 10;

    // Track
    g.fillStyle = 'rgba(255, 255, 255, 0.1)';
    roundRect(g, barX, barY, barW, barH, 5);
    g.fill();

    // Fill
    if (currentProgress > 0) {
      const fillW = Math.max(8, barW * currentProgress);
      const progGrad = g.createLinearGradient(barX, 0, barX + fillW, 0);
      progGrad.addColorStop(0, '#6366F1');
      progGrad.addColorStop(1, '#10B981');
      g.fillStyle = progGrad;
      roundRect(g, barX, barY, fillW, barH, 5);
      g.fill();
    }

    // Time text
    const curSec = Math.max(0, Math.floor(_songTime));
    const totSec = Math.floor(totalTime);
    g.fillStyle = '#94A3B8';
    g.font = 'bold 11px "Segoe UI", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'bottom';
    g.fillText(`${formatTime(curSec)} / ${formatTime(totSec)}`, w / 2, 13);

    // Score & Combo (Right)
    g.fillStyle = '#F8FAFC';
    g.font = 'bold 14px "Segoe UI", sans-serif';
    g.textAlign = 'right';
    g.textBaseline = 'middle';
    g.fillText(`Skóre: ${_score.toLocaleString()}`, w - 16, 20);

    // Bottom Bar HUD: Combo & Tempo info
    g.fillStyle = 'rgba(15, 23, 42, 0.85)';
    g.fillRect(0, h - 36, w, 36);

    // Combo multiplier
    if (_combo > 1) {
      g.fillStyle = '#FBBF24';
      g.font = '900 13px "Segoe UI", sans-serif';
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      g.fillText(`🔥 COMBO: ${_combo}× (Max: ${_maxCombo}×)`, 16, h - 18);
    } else {
      g.fillStyle = '#94A3B8';
      g.font = 'bold 11px "Segoe UI", sans-serif';
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      g.fillText('Stiskni [Mezerník] pro zahrání akordu v okamžiku, kdy protne laser!', 16, h - 18);
    }

    // Current Tempo
    g.fillStyle = '#A78BFA';
    g.font = 'bold 12px "Segoe UI", sans-serif';
    g.textAlign = 'right';
    g.textBaseline = 'middle';
    g.fillText(`Tempo: ${_tempo.toFixed(2)}× (${Math.round(_bpm * _tempo)} BPM)`, w - 16, h - 18);
  }

  // ── Helper: Rounded Rectangle ─────────────────────────────────────────
  function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
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

    // Metronome audio clicks
    if (_metronomeEnabled) {
      const beatDuration = 60 / _bpm;
      const currentBeat = Math.floor(_songTime / beatDuration);

      if (currentBeat !== _lastClickBeat) {
        _lastClickBeat = currentBeat;
        const isAccent = (currentBeat % _beatsPerMeasure === 0);

        // Click also during countdown (-3, -2, -1)
        if (typeof AudioSynth !== 'undefined') {
          AudioSynth.playClick(isAccent);
        }
      }
    }

    // Auto-miss notes that have scrolled past the hit window
    for (const note of _noteTrack) {
      if (note.hit || note.judgement) continue;
      const dtPass = note.time - _songTime;

      if (dtPass < -GOOD_WINDOW) {
        note.judgement = 'miss';
        _missCount++;
        _combo = 0;
        _mistakes.push({
          chord: note.chord,
          time: note.time,
          type: 'miss',
        });
        spawnFeedback('Mimo!', '#EF4444', 18);
      }
    }

    // Check if song has finished
    const lastNote = _noteTrack[_noteTrack.length - 1];
    if (lastNote && _songTime > lastNote.time + 2.5) {
      finishSong();
      return;
    }

    drawFrame();
    _animId = requestAnimationFrame(gameLoop);
  }

  // ── Hit Note Handling (Keyboard & Phase 3 Microphone Ready) ──────────
  /**
   * Called when player executes an input (keyboard or pitch detection).
   * @param {string} inputType 'strum' | 'string'
   * @param {number} stringNum 1-6 for individual strings, 0 for full strum
   */
  function hitNote(inputType, stringNum = 0) {
    if (!_playing || _paused) return;

    let closest = null;
    let closestDt = Infinity;

    for (const note of _noteTrack) {
      if (note.hit || note.judgement) continue;
      const dt = Math.abs(note.time - _songTime);
      if (dt > GOOD_WINDOW) continue;

      if (inputType === 'strum') {
        if (dt < closestDt) {
          closestDt = dt;
          closest = note;
        }
      } else if (inputType === 'string') {
        // Find if this string is active in the chord
        const lineIdx = stringNum - 1; // 1-based (high e=1) to line 0..5
        const frets = note.frets || [];
        if (frets[lineIdx] >= 0 && dt < closestDt) {
          closestDt = dt;
          closest = note;
        }
      }
    }

    const { w, h } = getCanvasSize();
    const hitLineX = Math.round(w * HIT_LINE_X_PERCENT);

    if (!closest) {
      // User strummed with no note in window
      if (inputType === 'strum') {
        if (typeof AudioSynth !== 'undefined') {
          // Play acoustic scrape / mute sound
          AudioSynth.playClick(false);
        }
      }
      return;
    }

    // Score judgement
    closest.hit = true;
    const dt = Math.abs(closest.time - _songTime);

    if (dt <= PERFECT_WINDOW) {
      closest.judgement = 'perfect';
      _perfectCount++;
      _combo++;
      const bonus = 100 * (1 + Math.floor(_combo / 10));
      _score += bonus;
      spawnFeedback('PERFEKTNÍ!', '#10B981', 22);
      if (typeof AudioSynth !== 'undefined') AudioSynth.playFeedback('perfect');

      // Add ripple
      _hitRipples.push({
        x: hitLineX,
        y: h / 2,
        color: '#10B981',
        spawn: performance.now() / 1000,
      });
    } else if (dt <= GOOD_WINDOW) {
      closest.judgement = 'good';
      _goodCount++;
      _combo++;
      const bonus = 50 * (1 + Math.floor(_combo / 10));
      _score += bonus;
      spawnFeedback('DOBŘE!', '#38BDF8', 19);
      if (typeof AudioSynth !== 'undefined') AudioSynth.playFeedback('good');

      _hitRipples.push({
        x: hitLineX,
        y: h / 2,
        color: '#38BDF8',
        spawn: performance.now() / 1000,
      });
    }

    if (_combo > _maxCombo) _maxCombo = _combo;

    // Play guitar sound via AudioSynth
    if (typeof AudioSynth !== 'undefined') {
      if (inputType === 'strum' && closest.chord) {
        AudioSynth.playChord(closest.chord, { duration: 1.0, velocity: 0.6 });
      } else if (inputType === 'string') {
        const lineIdx = stringNum - 1;
        const fret = closest.frets ? closest.frets[lineIdx] : 0;
        AudioSynth.playString(stringNum, Math.max(0, fret));
      }
    }
  }

  function spawnFeedback(text, color, size = 18) {
    const { w, h } = getCanvasSize();
    const hitLineX = Math.round(w * HIT_LINE_X_PERCENT);
    _feedbackQueue.push({
      text,
      color,
      x: hitLineX + 50,
      y: Math.round(h * 0.45),
      size: size,
      spawnTime: performance.now() / 1000,
    });
  }

  // ── Song Lifecycle ───────────────────────────────────────────────────
  function startSong(song, onFinishCb) {
    if (_playing) stopSong();

    _song = song;
    _noteTrack = generateNoteTrack(song);
    _songTime = -3.0; // 3-second animated countdown
    _score = 0;
    _combo = 0;
    _maxCombo = 0;
    _perfectCount = 0;
    _goodCount = 0;
    _missCount = 0;
    _mistakes = [];
    _feedbackQueue = [];
    _hitRipples = [];
    _lastClickBeat = -999;
    _playing = true;
    _paused = false;
    _onFinish = onFinishCb || null;

    if (typeof AudioSynth !== 'undefined') AudioSynth.ensureContext();

    _lastFrameTime = performance.now();
    _animId = requestAnimationFrame(gameLoop);

    // Keyboard handlers
    window.removeEventListener('keydown', _keyHandler);
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

    saveMistakes(result.mistakes);

    if (_onFinish) _onFinish(result);
  }

  // ── Tempo & Metronome Controls ───────────────────────────────────────
  function setTempo(t) {
    _tempo = Math.max(0.25, Math.min(2.0, t));
  }
  function getTempo() { return _tempo; }

  function setMetronome(enabled) {
    _metronomeEnabled = enabled;
  }

  // ── Mistake Persistence (LocalStorage) ───────────────────────────────
  function saveMistakes(newMistakes) {
    if (!newMistakes || newMistakes.length === 0) return;
    try {
      const existing = JSON.parse(localStorage.getItem('melodrio_mistakes') || '[]');
      for (const m of newMistakes) {
        if (!m.chord) continue;
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
      hitNote('string', parseInt(e.key, 10));
    } else if (e.code === 'Escape') {
      if (typeof App !== 'undefined' && typeof App.closeSongPlayer === 'function') {
        App.closeSongPlayer();
      } else {
        stopSong();
      }
    } else if (e.key === 'p' || e.key === 'P') {
      if (typeof App !== 'undefined' && typeof App.togglePlayerPause === 'function') {
        App.togglePlayerPause();
      } else {
        pauseSong();
      }
    }
  }

  // ── Destruction ──────────────────────────────────────────────────────
  function destroy() {
    stopSong();
    if (_canvas && _canvas.parentNode) {
      _canvas.parentNode.removeChild(_canvas);
    }
    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('keydown', _keyHandler);
    _canvas = null;
    _ctxDraw = null;
    _container = null;
  }

  // ── Public API ───────────────────────────────────────────────────────
  return {
    initCanvas,
    resizeCanvas,
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