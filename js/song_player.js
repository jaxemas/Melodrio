/**
 * Melodrio Phase 2 — Fullscreen Song Player & Advanced Strumming Highway
 * Renders an expansive horizontal 6-string highway (Simply Guitar / Rocksmith style)
 * with authentic guitar strumming patterns (Down/Up strokes, Island strum, Folk, Rock, Ballad),
 * visual strumming conductor ribbon, fret numbers, and Web Audio guitar synthesis.
 */

const SongPlayer = (() => {
  'use strict';

  // ── Guitar Strings Configuration (Top to Bottom: high e to low E) ─────
  const STRINGS = [
    { stringNum: 1, name: 'e', note: 'E4', color: '#FF3B69', thickness: 2.0, shapeIdx: 5 }, // String 1 (high e) - Rose
    { stringNum: 2, name: 'B', note: 'B3', color: '#FF9F0A', thickness: 2.6, shapeIdx: 4 }, // String 2 (B) - Amber
    { stringNum: 3, name: 'G', note: 'G3', color: '#30D158', thickness: 3.2, shapeIdx: 3 }, // String 3 (G) - Emerald
    { stringNum: 4, name: 'D', note: 'D3', color: '#0A84FF', thickness: 4.0, shapeIdx: 2 }, // String 4 (D) - Blue
    { stringNum: 5, name: 'A', note: 'A2', color: '#BF5AF2', thickness: 5.0, shapeIdx: 1 }, // String 5 (A) - Purple
    { stringNum: 6, name: 'E', note: 'E2', color: '#FF375F', thickness: 6.2, shapeIdx: 0 }, // String 6 (low E) - Pink
  ];

  // ── Strumming Patterns Catalog (Rytmické vzory úderů) ─────────────────
  const STRUMMING_PATTERNS = {
    'camp': {
      id: 'camp',
      name: 'Táborákový / Island Strum (↓ · ↓ ↑ · ↑ ↓ ↑)',
      shortName: 'Táborákový (Island Strum)',
      subdivisions: 8,
      beatsPerMeasure: 4,
      slots: [
        { beat: 0.0, dir: 'down', label: '1', arrow: '↓', accent: true },
        { beat: 0.5, dir: null,   label: '&', arrow: '·', rest: true },
        { beat: 1.0, dir: 'down', label: '2', arrow: '↓' },
        { beat: 1.5, dir: 'up',   label: '&', arrow: '↑' },
        { beat: 2.0, dir: null,   label: '3', arrow: '·', rest: true },
        { beat: 2.5, dir: 'up',   label: '&', arrow: '↑' },
        { beat: 3.0, dir: 'down', label: '4', arrow: '↓' },
        { beat: 3.5, dir: 'up',   label: '&', arrow: '↑' },
      ],
      description: 'Nejznámější kytarový vzor na světě: Dolů, Dolů-Nahoru, vynechat, Nahoru-Dolů-Nahoru.'
    },
    'basic4': {
      id: 'basic4',
      name: 'Základní 4/4 (↓ · ↓ · ↓ · ↓ ·)',
      shortName: 'Základní 4/4',
      subdivisions: 8,
      beatsPerMeasure: 4,
      slots: [
        { beat: 0.0, dir: 'down', label: '1', arrow: '↓', accent: true },
        { beat: 0.5, dir: null,   label: '&', arrow: '·', rest: true },
        { beat: 1.0, dir: 'down', label: '2', arrow: '↓' },
        { beat: 1.5, dir: null,   label: '&', arrow: '·', rest: true },
        { beat: 2.0, dir: 'down', label: '3', arrow: '↓', accent: true },
        { beat: 2.5, dir: null,   label: '&', arrow: '·', rest: true },
        { beat: 3.0, dir: 'down', label: '4', arrow: '↓' },
        { beat: 3.5, dir: null,   label: '&', arrow: '·', rest: true },
      ],
      description: 'Klidné údery dolů na každou celou dobu. Ideální pro začátečníky a nácvik akordů.'
    },
    'folk': {
      id: 'folk',
      name: 'Country & Folk (↓ · ↓ · ↓ ↑ ↓ ↑)',
      shortName: 'Country & Folk',
      subdivisions: 8,
      beatsPerMeasure: 4,
      slots: [
        { beat: 0.0, dir: 'down', label: '1', arrow: '↓', accent: true },
        { beat: 0.5, dir: null,   label: '&', arrow: '·', rest: true },
        { beat: 1.0, dir: 'down', label: '2', arrow: '↓' },
        { beat: 1.5, dir: null,   label: '&', arrow: '·', rest: true },
        { beat: 2.0, dir: 'down', label: '3', arrow: '↓', accent: true },
        { beat: 2.5, dir: 'up',   label: '&', arrow: '↑' },
        { beat: 3.0, dir: 'down', label: '4', arrow: '↓' },
        { beat: 3.5, dir: 'up',   label: '&', arrow: '↑' },
      ],
      description: 'Tradiční trampský a country doprovod se zrychleným osminovým závěrem.'
    },
    'rock': {
      id: 'rock',
      name: 'Rockový tah (↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑)',
      shortName: 'Rockový tah (Straight 8th)',
      subdivisions: 8,
      beatsPerMeasure: 4,
      slots: [
        { beat: 0.0, dir: 'down', label: '1', arrow: '↓', accent: true },
        { beat: 0.5, dir: 'up',   label: '&', arrow: '↑' },
        { beat: 1.0, dir: 'down', label: '2', arrow: '↓' },
        { beat: 1.5, dir: 'up',   label: '&', arrow: '↑' },
        { beat: 2.0, dir: 'down', label: '3', arrow: '↓', accent: true },
        { beat: 2.5, dir: 'up',   label: '&', arrow: '↑' },
        { beat: 3.0, dir: 'down', label: '4', arrow: '↓' },
        { beat: 3.5, dir: 'up',   label: '&', arrow: '↑' },
      ],
      description: 'Nepřetržitý proud osminových úderů dolů a nahoru pro energické rockové písničky.'
    },
    'ballad': {
      id: 'ballad',
      name: 'Akustická balada (↓ · · · ↓ ↑ · ↑)',
      shortName: 'Akustická balada',
      subdivisions: 8,
      beatsPerMeasure: 4,
      slots: [
        { beat: 0.0, dir: 'down', label: '1', arrow: '↓', accent: true },
        { beat: 0.5, dir: null,   label: '&', arrow: '·', rest: true },
        { beat: 1.0, dir: null,   label: '2', arrow: '·', rest: true },
        { beat: 1.5, dir: null,   label: '&', arrow: '·', rest: true },
        { beat: 2.0, dir: 'down', label: '3', arrow: '↓', accent: true },
        { beat: 2.5, dir: 'up',   label: '&', arrow: '↑' },
        { beat: 3.0, dir: null,   label: '4', arrow: '·', rest: true },
        { beat: 3.5, dir: 'up',   label: '&', arrow: '↑' },
      ],
      description: 'Vzdušný, jemný doprovod s dlouhým dozvukem pro pomalé a dojemné písně.'
    },
    'waltz': {
      id: 'waltz',
      name: 'Valčíkový 3/4 (↓ · ↓ ↑ ↓ ↑)',
      shortName: 'Valčík 3/4',
      subdivisions: 6,
      beatsPerMeasure: 3,
      slots: [
        { beat: 0.0, dir: 'down', label: '1', arrow: '↓', accent: true },
        { beat: 0.5, dir: null,   label: '&', arrow: '·', rest: true },
        { beat: 1.0, dir: 'down', label: '2', arrow: '↓' },
        { beat: 1.5, dir: 'up',   label: '&', arrow: '↑' },
        { beat: 2.0, dir: 'down', label: '3', arrow: '↓' },
        { beat: 2.5, dir: 'up',   label: '&', arrow: '↑' },
      ],
      description: 'Třídobý valčíkový rytmus s důrazem na první těžkou dobu (Bum - čvacht - čvacht).'
    }
  };

  const HIT_LINE_X_PERCENT = 0.18; // Hit line at 18% from left
  const NOTE_SPEED_BASE = 240;     // px/sec at 1.0× speed and 120 BPM
  const PERFECT_WINDOW = 0.09;     // ±90ms
  const GOOD_WINDOW = 0.22;        // ±220ms

  // ── Engine State ─────────────────────────────────────────────────────
  let _canvas = null;
  let _ctxDraw = null;
  let _container = null;
  let _animId = null;
  let _playing = false;
  let _paused = false;

  let _song = null;
  let _currentPatternId = 'camp';
  let _noteTrack = [];
  let _songTime = -3.0; // 3-second animated countdown
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
  let _lastRibbonSlotIdx = -1;
  let _onFinish = null;

  // ── Note Track Generation based on Strumming Pattern ─────────────────
  function generateNoteTrack(song, patternId = 'camp') {
    const pattern = STRUMMING_PATTERNS[patternId] || STRUMMING_PATTERNS['camp'];
    _currentPatternId = pattern.id;
    _beatsPerMeasure = pattern.beatsPerMeasure || 4;

    const chords = song.chords && song.chords.length > 0 ? song.chords : ['Em', 'Am', 'C', 'G'];
    const bpm = song.bpm || 120;
    _bpm = bpm;
    const beatDuration = 60 / bpm;

    const track = [];
    const totalMeasures = Math.max(16, chords.length * 4);

    for (let m = 0; m < totalMeasures; m++) {
      const chord = chords[m % chords.length];
      const measureStartTime = m * _beatsPerMeasure * beatDuration;

      pattern.slots.forEach((slot, sIdx) => {
        if (!slot.dir) return; // Rest / Ghost stroke (skip note block)

        const noteTime = measureStartTime + slot.beat * beatDuration;
        track.push({
          id: `m_${m}_s_${sIdx}`,
          time: noteTime,
          measure: m,
          beat: slot.beat,
          chord: chord,
          direction: slot.dir,       // 'down' or 'up'
          arrow: slot.arrow,         // '↓' or '↑'
          accent: !!slot.accent,
          frets: getChordFrets(chord),
          hit: false,
          judgement: null,
          matchedDirection: false,
        });
      });
    }

    return track;
  }

  function getChordFrets(chordName) {
    const shape = (typeof AudioSynth !== 'undefined' && AudioSynth.CHORD_SHAPES)
      ? AudioSynth.CHORD_SHAPES[chordName]
      : null;

    if (!shape) return [0, 0, 0, 0, 0, 0];

    // STRINGS lines 0..5 correspond to shape indices 5..0
    return STRINGS.map(s => shape[s.shapeIdx]);
  }

  // ── Canvas Setup & Resizing ──────────────────────────────────────────
  function initCanvas(container) {
    _container = container;
    container.innerHTML = '';

    _canvas = document.createElement('canvas');
    _canvas.style.width = '100%';
    _canvas.style.height = '100%';
    _canvas.style.display = 'block';
    container.appendChild(_canvas);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('fullscreenchange', resizeCanvas);
  }

  function resizeCanvas() {
    if (!_canvas || !_container) return;
    const rect = _container.getBoundingClientRect();
    const w = Math.round(rect.width) || _container.clientWidth || window.innerWidth || 1280;
    const h = Math.round(rect.height) || _container.clientHeight || window.innerHeight || 720;

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
    if (!_container) return { w: window.innerWidth || 1280, h: window.innerHeight || 720 };
    const rect = _container.getBoundingClientRect();
    const w = Math.round(rect.width) || _container.clientWidth || window.innerWidth || 1280;
    const h = Math.round(rect.height) || _container.clientHeight || window.innerHeight || 720;
    return { w, h };
  }

  // ── Strumming Guide Ribbon (DOM Bar Synchronization) ──────────────────
  function updateRibbonDOM() {
    const pattern = STRUMMING_PATTERNS[_currentPatternId] || STRUMMING_PATTERNS['camp'];
    const nameEl = document.getElementById('strum-ribbon-name');
    const slotsEl = document.getElementById('strum-ribbon-slots');
    if (nameEl) nameEl.textContent = pattern.shortName;

    if (slotsEl) {
      slotsEl.innerHTML = pattern.slots.map((s, idx) => {
        let typeClass = 'rest';
        let arrowText = '·';

        if (s.dir === 'down') {
          typeClass = 'down';
          arrowText = '↓';
        } else if (s.dir === 'up') {
          typeClass = 'up';
          arrowText = '↑';
        }

        return `
          <div class="strum-slot ${typeClass}" id="ribbon-slot-${idx}" data-beat="${s.beat}">
            <span class="slot-label">${s.label}</span>
            <span class="slot-arrow">${arrowText}</span>
          </div>
        `;
      }).join('');
    }
  }

  function syncRibbonCursor() {
    const pattern = STRUMMING_PATTERNS[_currentPatternId];
    if (!pattern) return;

    const beatDuration = 60 / _bpm;
    const totalMeasureDuration = _beatsPerMeasure * beatDuration;

    let activeIdx = -1;
    if (_songTime >= 0) {
      const timeInMeasure = _songTime % totalMeasureDuration;
      const currentBeat = timeInMeasure / beatDuration;

      // Find closest active slot in measure
      for (let i = pattern.slots.length - 1; i >= 0; i--) {
        if (currentBeat >= pattern.slots[i].beat - 0.1) {
          activeIdx = i;
          break;
        }
      }
    }

    if (activeIdx !== _lastRibbonSlotIdx) {
      if (_lastRibbonSlotIdx >= 0) {
        const oldEl = document.getElementById(`ribbon-slot-${_lastRibbonSlotIdx}`);
        if (oldEl) oldEl.classList.remove('active');
      }
      if (activeIdx >= 0) {
        const newEl = document.getElementById(`ribbon-slot-${activeIdx}`);
        if (newEl) newEl.classList.add('active');
      }
      _lastRibbonSlotIdx = activeIdx;
    }
  }

  // ── Main Rendering Function ──────────────────────────────────────────
  function drawFrame() {
    if (!_ctxDraw || !_container) return;

    const { w, h } = getCanvasSize();
    const dpr = window.devicePixelRatio || 1;
    if (_canvas.width !== Math.round(w * dpr) || _canvas.height !== Math.round(h * dpr)) {
      resizeCanvas();
    }

    const g = _ctxDraw;

    // 1. Fullscreen Background Gradient
    const bgGrad = g.createRadialGradient(w * 0.5, h * 0.5, 50, w * 0.5, h * 0.5, w * 0.85);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(0.65, '#0A0F1D');
    bgGrad.addColorStop(1, '#050811');
    g.fillStyle = bgGrad;
    g.fillRect(0, 0, w, h);

    // Layout Geometry (Generous full-screen spacing)
    const hitLineX = Math.round(w * HIT_LINE_X_PERCENT);
    const topMargin = Math.max(50, Math.round(h * 0.08));
    const bottomMargin = Math.max(50, Math.round(h * 0.08));
    const stringAreaTop = topMargin + 30;
    const stringAreaBottom = h - bottomMargin - 30;
    const stringSpacing = (stringAreaBottom - stringAreaTop) / 5;

    // 2. Nut / Headstock Zone (Left of hit line)
    const nutGrad = g.createLinearGradient(0, 0, hitLineX, 0);
    nutGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    nutGrad.addColorStop(0.9, 'rgba(15, 23, 42, 0.7)');
    nutGrad.addColorStop(1, 'rgba(30, 41, 59, 0.85)');
    g.fillStyle = nutGrad;
    g.fillRect(0, stringAreaTop - 25, hitLineX, stringAreaBottom - stringAreaTop + 50);

    // Guitar Nut Bar
    g.fillStyle = '#475569';
    g.fillRect(hitLineX - 6, stringAreaTop - 25, 6, stringAreaBottom - stringAreaTop + 50);

    // 3. Moving Rhythm Grid & Beat Lines
    const beatDuration = 60 / _bpm;
    const pixelsPerSecond = NOTE_SPEED_BASE * _tempo * (_bpm / 120);

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
        g.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        g.lineWidth = 2.5;
        g.setLineDash([]);
      } else {
        g.strokeStyle = 'rgba(255, 255, 255, 0.09)';
        g.lineWidth = 1.2;
        g.setLineDash([5, 5]);
      }
      g.moveTo(bx, stringAreaTop - 15);
      g.lineTo(bx, stringAreaBottom + 15);
      g.stroke();
      g.setLineDash([]);

      // Measure Badge
      if (isDownbeat) {
        const measureNum = Math.floor(b / _beatsPerMeasure) + 1;
        g.fillStyle = 'rgba(167, 139, 250, 0.8)';
        g.font = 'bold 12px "Segoe UI", sans-serif';
        g.textAlign = 'center';
        g.fillText('Takt ' + measureNum, bx, stringAreaTop - 20);
      }
    }

    // 4. Horizontal Guitar Strings
    for (let i = 0; i < 6; i++) {
      const s = STRINGS[i];
      const y = Math.round(stringAreaTop + i * stringSpacing);

      // Lane Ambient Glow
      const laneGrad = g.createLinearGradient(0, y - 14, 0, y + 14);
      laneGrad.addColorStop(0, 'rgba(0,0,0,0)');
      laneGrad.addColorStop(0.5, s.color + '22');
      laneGrad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = laneGrad;
      g.fillRect(hitLineX, y - 14, w - hitLineX, 28);

      // String Cable
      g.strokeStyle = s.color + '85';
      g.lineWidth = s.thickness;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();

      // Metallic String Core Glint
      g.strokeStyle = '#FFFFFF40';
      g.lineWidth = Math.max(1, s.thickness * 0.35);
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();

      // String Badge on Headstock (Left)
      const badgeW = 60;
      const badgeH = 26;
      const badgeX = Math.round(hitLineX * 0.48);

      g.fillStyle = s.color + '25';
      roundRect(g, badgeX - badgeW / 2, y - badgeH / 2, badgeW, badgeH, 8);
      g.fill();
      g.strokeStyle = s.color;
      g.lineWidth = 1.5;
      roundRect(g, badgeX - badgeW / 2, y - badgeH / 2, badgeW, badgeH, 8);
      g.stroke();

      // Text inside string badge
      g.fillStyle = '#FFFFFF';
      g.font = 'bold 12px "Segoe UI", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(`[${s.stringNum}] ${s.name}`, badgeX, y);
    }

    // 5. Target / Hit Line (Neon Laser Bar)
    const laserGlow = g.createLinearGradient(hitLineX - 35, 0, hitLineX + 35, 0);
    laserGlow.addColorStop(0, 'rgba(99, 102, 241, 0)');
    laserGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.45)');
    laserGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
    g.fillStyle = laserGlow;
    g.fillRect(hitLineX - 35, stringAreaTop - 25, 70, stringAreaBottom - stringAreaTop + 50);

    // Laser Line Center
    g.strokeStyle = '#FFFFFF';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(hitLineX, stringAreaTop - 25);
    g.lineTo(hitLineX, stringAreaBottom + 25);
    g.stroke();

    // Target Receptors on each string
    for (let i = 0; i < 6; i++) {
      const s = STRINGS[i];
      const y = Math.round(stringAreaTop + i * stringSpacing);

      g.fillStyle = '#0B1120';
      g.beginPath();
      g.arc(hitLineX, y, 13, 0, Math.PI * 2);
      g.fill();

      g.strokeStyle = s.color;
      g.lineWidth = 2.5;
      g.beginPath();
      g.arc(hitLineX, y, 13, 0, Math.PI * 2);
      g.stroke();
    }

    // Strum Zone Indicator Header
    g.fillStyle = '#FBBF24';
    g.font = '900 13px "Segoe UI", sans-serif';
    g.textAlign = 'center';
    g.fillText('🎯 ZDE ZAHRÁJ [MEZERNÍK / ŠIPKY]', hitLineX, stringAreaTop - 32);

    // 6. Hit Ripple Waves
    const nowSec = performance.now() / 1000;
    _hitRipples = _hitRipples.filter(r => {
      const age = nowSec - r.spawn;
      if (age > 0.45) return false;
      const progress = age / 0.45;
      const radius = 16 + progress * 55;
      const alpha = (1 - progress) * 0.75;

      g.strokeStyle = r.color;
      g.globalAlpha = alpha;
      g.lineWidth = 3.5 * (1 - progress);
      g.beginPath();
      g.arc(r.x, r.y, radius, 0, Math.PI * 2);
      g.stroke();
      g.globalAlpha = 1;
      return true;
    });

    // 7. Render Chord Cards with Strumming Direction Arrows
    for (const note of _noteTrack) {
      const dt = note.time - _songTime;
      const noteX = hitLineX + dt * pixelsPerSecond;

      if (noteX < -120 || noteX > w + 140) continue;

      drawChordCard(g, noteX, stringAreaTop, stringSpacing, note);
    }

    // 8. Visual Animated Countdown (Before song start: _songTime < 0)
    if (_songTime < 0) {
      drawCountdownOverlay(g, w, h, hitLineX, stringAreaTop, stringAreaBottom);
    }

    // 9. Floating Feedback Texts (PERFEKTNÍ! / DOBŘE! / MIMO!)
    _feedbackQueue = _feedbackQueue.filter(fb => {
      const age = nowSec - fb.spawnTime;
      if (age > 1.15) return false;
      const progress = age / 1.15;
      const opacity = Math.max(0, 1 - progress);
      const yOffset = progress * 52;
      const scale = 1 + progress * 0.25;

      g.save();
      g.globalAlpha = opacity;
      g.fillStyle = fb.color;
      g.shadowColor = fb.color;
      g.shadowBlur = 14;
      g.font = `900 ${Math.round(fb.size * scale)}px "Segoe UI", sans-serif`;
      g.textAlign = 'center';
      g.fillText(fb.text, fb.x, fb.y - yOffset);
      g.restore();
      return true;
    });

    // 10. Top & Bottom HUD
    drawHUD(g, w, h);

    // 11. Sync DOM Ribbon Cursor with playback
    syncRibbonCursor();
  }

  // ── Render Individual Chord Card with Directional Arrows ─────────────
  function drawChordCard(g, x, stringAreaTop, stringSpacing, note) {
    const frets = note.frets || [0, 0, 0, 0, 0, 0];
    const isDown = (note.direction === 'down');
    const isUp = (note.direction === 'up');

    let alpha = 1.0;
    if (note.hit) alpha = 0.28;
    else if (note.judgement === 'miss') alpha = 0.35;

    g.save();
    g.globalAlpha = alpha;

    // Active vertical string range
    let minIdx = -1;
    let maxIdx = -1;
    for (let i = 0; i < 6; i++) {
      if (frets[i] >= 0) {
        if (minIdx === -1) minIdx = i;
        maxIdx = i;
      }
    }
    if (minIdx === -1) { minIdx = 0; maxIdx = 5; }

    const topY = stringAreaTop + minIdx * stringSpacing - 18;
    const botY = stringAreaTop + maxIdx * stringSpacing + 18;
    const cardW = 86;
    const cardX = Math.round(x - cardW / 2);

    // Color theme based on stroke direction & timing judgement
    let themeColor = isDown ? '#10B981' : '#38BDF8'; // Emerald for Down, Cyan for Up
    if (note.judgement === 'perfect') themeColor = '#10B981';
    else if (note.judgement === 'good') themeColor = '#38BDF8';
    else if (note.judgement === 'miss') themeColor = '#EF4444';

    // 1. Vertical Card Beam Glow
    const beamGrad = g.createLinearGradient(cardX, 0, cardX + cardW, 0);
    beamGrad.addColorStop(0, themeColor + '20');
    beamGrad.addColorStop(0.5, themeColor + '50');
    beamGrad.addColorStop(1, themeColor + '20');
    g.fillStyle = beamGrad;
    roundRect(g, cardX, topY, cardW, botY - topY, 14);
    g.fill();

    // 2. Card Border
    g.strokeStyle = themeColor;
    g.lineWidth = note.accent ? 3 : 2;
    roundRect(g, cardX, topY, cardW, botY - topY, 14);
    g.stroke();

    // 3. Chord Name Header Badge (Top)
    if (note.chord) {
      const bannerH = 28;
      const bannerW = 72;
      const bannerY = topY - bannerH - 6;
      const bannerX = Math.round(x - bannerW / 2);

      g.fillStyle = '#0F172A';
      roundRect(g, bannerX, bannerY, bannerW, bannerH, 8);
      g.fill();

      g.strokeStyle = themeColor;
      g.lineWidth = 2;
      roundRect(g, bannerX, bannerY, bannerW, bannerH, 8);
      g.stroke();

      g.fillStyle = '#FFFFFF';
      g.font = '900 16px "Segoe UI", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(note.chord, x, bannerY + bannerH / 2);
    }

    // 4. Strumming Direction Arrow Badge (Center/Bottom)
    const dirH = 24;
    const dirW = 74;
    const dirY = botY + 6;
    const dirX = Math.round(x - dirW / 2);

    g.fillStyle = isDown ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.25)';
    roundRect(g, dirX, dirY, dirW, dirH, 6);
    g.fill();

    g.strokeStyle = isDown ? '#10B981' : '#38BDF8';
    g.lineWidth = 1.5;
    roundRect(g, dirX, dirY, dirW, dirH, 6);
    g.stroke();

    g.fillStyle = '#FFFFFF';
    g.font = '900 11px "Segoe UI", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const arrowLabel = isDown ? '⬇ DOLŮ' : '⬆ NAHORU';
    g.fillText(arrowLabel, x, dirY + dirH / 2);

    // 5. String Fret Pucks (Circles on each active string)
    for (let i = 0; i < 6; i++) {
      const fret = frets[i];
      const y = Math.round(stringAreaTop + i * stringSpacing);
      const strColor = STRINGS[i].color;

      if (fret >= 0) {
        const puckRadius = 16;

        // Outer Glow Ring
        g.fillStyle = strColor;
        g.beginPath();
        g.arc(x, y, puckRadius, 0, Math.PI * 2);
        g.fill();

        // Inner Core
        g.fillStyle = '#0F172A';
        g.beginPath();
        g.arc(x, y, puckRadius - 3, 0, Math.PI * 2);
        g.fill();

        // Fret Number
        g.fillStyle = '#F8FAFC';
        g.font = '900 13px "Segoe UI", sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(fret === 0 ? '0' : String(fret), x, y);
      } else {
        // Muted String (Red ✕)
        g.fillStyle = '#EF4444';
        g.font = '900 16px "Segoe UI", sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText('✕', x, y);
      }
    }

    g.restore();
  }

  // ── Countdown Overlay (3... 2... 1... START!) ────────────────────────
  function drawCountdownOverlay(g, w, h, hitLineX, stringAreaTop, stringAreaBottom) {
    const remaining = -_songTime;
    let countNum = '1';
    let countColor = '#10B981';
    let label = 'PŘIPRAV SE!';

    if (remaining > 2.0) {
      countNum = '3';
      countColor = '#F59E0B';
      label = 'PŘIPRAV AKORD!';
    } else if (remaining > 1.0) {
      countNum = '2';
      countColor = '#38BDF8';
      label = 'SLEDUJ SMĚR ÚDERŮ (↓ / ↑)';
    } else if (remaining > 0) {
      countNum = '1';
      countColor = '#10B981';
      label = 'JDE SE NA TO!';
    }

    const frac = remaining % 1.0;
    const pulseScale = 1 + (1 - frac) * 0.25;

    const centerY = Math.round((stringAreaTop + stringAreaBottom) / 2);
    const centerX = Math.round(w * 0.54);

    g.save();

    // Dark pill container
    g.fillStyle = 'rgba(15, 23, 42, 0.9)';
    roundRect(g, centerX - 160, centerY - 80, 320, 160, 24);
    g.fill();
    g.strokeStyle = countColor;
    g.lineWidth = 3;
    roundRect(g, centerX - 160, centerY - 80, 320, 160, 24);
    g.stroke();

    // Countdown Number
    g.fillStyle = countColor;
    g.shadowColor = countColor;
    g.shadowBlur = 25;
    g.font = `900 ${Math.round(68 * pulseScale)}px "Segoe UI", sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(countNum, centerX, centerY - 15);

    // Tip Subtitle
    g.shadowBlur = 0;
    g.fillStyle = '#CBD5E1';
    g.font = 'bold 14px "Segoe UI", sans-serif';
    g.fillText(label, centerX, centerY + 48);

    g.restore();
  }

  // ── Heads-Up Display (HUD) ───────────────────────────────────────────
  function drawHUD(g, w, h) {
    // Top HUD Bar
    g.fillStyle = 'rgba(15, 23, 42, 0.9)';
    g.fillRect(0, 0, w, 44);
    g.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(0, 44);
    g.lineTo(w, 44);
    g.stroke();

    // Song info
    if (_song) {
      g.fillStyle = '#F8FAFC';
      g.font = 'bold 15px "Segoe UI", sans-serif';
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      g.fillText(`🎵 ${_song.title} — ${_song.artist}`, 20, 22);
    }

    // Progress Bar (Center)
    const totalTime = _noteTrack.length > 0 ? _noteTrack[_noteTrack.length - 1].time + 2.5 : 60;
    const currentProgress = Math.max(0, Math.min(1, _songTime / totalTime));
    const barW = Math.min(340, w * 0.3);
    const barX = Math.round((w - barW) / 2);
    const barY = 16;
    const barH = 12;

    g.fillStyle = 'rgba(255, 255, 255, 0.12)';
    roundRect(g, barX, barY, barW, barH, 6);
    g.fill();

    if (currentProgress > 0) {
      const fillW = Math.max(10, barW * currentProgress);
      const progGrad = g.createLinearGradient(barX, 0, barX + fillW, 0);
      progGrad.addColorStop(0, '#6366F1');
      progGrad.addColorStop(1, '#10B981');
      g.fillStyle = progGrad;
      roundRect(g, barX, barY, fillW, barH, 6);
      g.fill();
    }

    const curSec = Math.max(0, Math.floor(_songTime));
    const totSec = Math.floor(totalTime);
    g.fillStyle = '#94A3B8';
    g.font = 'bold 11px "Segoe UI", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'bottom';
    g.fillText(`${formatTime(curSec)} / ${formatTime(totSec)}`, w / 2, 14);

    // Score & Combo (Right)
    g.fillStyle = '#F8FAFC';
    g.font = '900 16px "Segoe UI", sans-serif';
    g.textAlign = 'right';
    g.textBaseline = 'middle';
    g.fillText(`Skóre: ${_score.toLocaleString()}`, w - 20, 22);

    // Bottom HUD Bar
    g.fillStyle = 'rgba(15, 23, 42, 0.85)';
    g.fillRect(0, h - 38, w, 38);

    if (_combo > 1) {
      g.fillStyle = '#FBBF24';
      g.font = '900 14px "Segoe UI", sans-serif';
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      g.fillText(`🔥 COMBO: ${_combo}× (Nejvyšší: ${_maxCombo}×)`, 20, h - 19);
    } else {
      g.fillStyle = '#94A3B8';
      g.font = 'bold 12px "Segoe UI", sans-serif';
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      g.fillText('Stiskni [Mezerník] nebo šipky [↓ / ↑] v okamžiku, kdy akord protne laser!', 20, h - 19);
    }

    // Active Strumming Pattern indicator
    const curPattern = STRUMMING_PATTERNS[_currentPatternId];
    g.fillStyle = '#A78BFA';
    g.font = 'bold 13px "Segoe UI", sans-serif';
    g.textAlign = 'right';
    g.textBaseline = 'middle';
    g.fillText(`Vzor: ${curPattern ? curPattern.shortName : 'Táborákový'} • Tempo: ${_tempo.toFixed(2)}×`, w - 20, h - 19);
  }

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

        if (typeof AudioSynth !== 'undefined') {
          AudioSynth.playClick(isAccent);
        }
      }
    }

    // Auto-miss notes that passed the target window
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

    // Check finish
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
   * Handle user strum/pluck action.
   * @param {string} inputType 'strum' | 'down' | 'up' | 'string'
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

      if (inputType === 'strum' || inputType === 'down' || inputType === 'up') {
        if (dt < closestDt) {
          closestDt = dt;
          closest = note;
        }
      } else if (inputType === 'string') {
        const lineIdx = stringNum - 1;
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
      // Off-beat strum
      if (inputType === 'strum' || inputType === 'down' || inputType === 'up') {
        if (typeof AudioSynth !== 'undefined') {
          AudioSynth.playClick(false);
        }
      }
      return;
    }

    closest.hit = true;
    const dt = Math.abs(closest.time - _songTime);
    const matchedDir = (inputType === closest.direction);

    let strumDirToPlay = closest.direction || 'down';
    if (inputType === 'down') strumDirToPlay = 'down';
    if (inputType === 'up') strumDirToPlay = 'up';

    if (dt <= PERFECT_WINDOW) {
      closest.judgement = 'perfect';
      _perfectCount++;
      _combo++;
      const dirBonus = matchedDir ? 50 : 0;
      _score += (100 + dirBonus) * (1 + Math.floor(_combo / 10));

      const fbText = matchedDir ? `PERFEKTNÍ SMĚR! ${closest.arrow}` : 'PERFEKTNÍ!';
      spawnFeedback(fbText, '#10B981', 24);
      if (typeof AudioSynth !== 'undefined') AudioSynth.playFeedback('perfect');

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
      _score += 50 * (1 + Math.floor(_combo / 10));
      spawnFeedback('DOBŘE!', '#38BDF8', 20);
      if (typeof AudioSynth !== 'undefined') AudioSynth.playFeedback('good');

      _hitRipples.push({
        x: hitLineX,
        y: h / 2,
        color: '#38BDF8',
        spawn: performance.now() / 1000,
      });
    }

    if (_combo > _maxCombo) _maxCombo = _combo;

    // Play synthesized guitar sound
    if (typeof AudioSynth !== 'undefined') {
      if ((inputType === 'strum' || inputType === 'down' || inputType === 'up') && closest.chord) {
        AudioSynth.playChord(closest.chord, {
          duration: 1.0,
          velocity: closest.accent ? 0.7 : 0.55,
          direction: strumDirToPlay
        });
      } else if (inputType === 'string') {
        const lineIdx = stringNum - 1;
        const fret = closest.frets ? closest.frets[lineIdx] : 0;
        AudioSynth.playString(stringNum, Math.max(0, fret));
      }
    }
  }

  function spawnFeedback(text, color, size = 20) {
    const { w, h } = getCanvasSize();
    const hitLineX = Math.round(w * HIT_LINE_X_PERCENT);
    _feedbackQueue.push({
      text,
      color,
      x: hitLineX + 60,
      y: Math.round(h * 0.44),
      size: size,
      spawnTime: performance.now() / 1000,
    });
  }

  // ── Song Lifecycle ───────────────────────────────────────────────────
  function startSong(song, onFinishCb) {
    if (_playing) stopSong();

    _song = song;
    const patternId = song.strummingPattern || _currentPatternId || 'camp';
    _currentPatternId = patternId;

    _noteTrack = generateNoteTrack(song, patternId);
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
    _lastRibbonSlotIdx = -1;
    _playing = true;
    _paused = false;
    _onFinish = onFinishCb || null;

    updateRibbonDOM();

    if (typeof AudioSynth !== 'undefined') AudioSynth.ensureContext();

    _lastFrameTime = performance.now();
    _animId = requestAnimationFrame(gameLoop);

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
      patternId: _currentPatternId,
    };

    saveMistakes(result.mistakes);

    if (_onFinish) _onFinish(result);
  }

  // ── Strumming Pattern Switcher ────────────────────────────────────────
  function setStrummingPattern(patternId) {
    if (!STRUMMING_PATTERNS[patternId]) return;
    _currentPatternId = patternId;

    if (_song) {
      // Regenerate note track on the fly
      _noteTrack = generateNoteTrack(_song, patternId);
      updateRibbonDOM();
    }
  }

  function getStrummingPattern() {
    return _currentPatternId;
  }

  function getStrummingPatterns() {
    return STRUMMING_PATTERNS;
  }

  // ── Tempo & Metronome Controls ───────────────────────────────────────
  function setTempo(t) {
    _tempo = Math.max(0.25, Math.min(2.0, t));
  }
  function getTempo() { return _tempo; }

  function setMetronome(enabled) {
    _metronomeEnabled = enabled;
  }

  // ── Mistake Persistence ──────────────────────────────────────────────
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
    } else if (e.code === 'ArrowDown' || e.code === 'KeyJ' || e.code === 'KeyD') {
      e.preventDefault();
      hitNote('down', 0); // Down stroke
    } else if (e.code === 'ArrowUp' || e.code === 'KeyK' || e.code === 'KeyU') {
      e.preventDefault();
      hitNote('up', 0); // Up stroke
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

  // ── Cleanup ──────────────────────────────────────────────────────────
  function destroy() {
    stopSong();
    if (_canvas && _canvas.parentNode) {
      _canvas.parentNode.removeChild(_canvas);
    }
    window.removeEventListener('resize', resizeCanvas);
    document.removeEventListener('fullscreenchange', resizeCanvas);
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
    setStrummingPattern,
    getStrummingPattern,
    getStrummingPatterns,
    hitNote,
    getMistakes,
    clearMistakes,
    destroy,
    isPlaying: () => _playing,
    isPaused: () => _paused,
    getScore: () => _score,
  };
})();
