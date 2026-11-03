/**
 * Melodrio Phase 2 — Web Audio Guitar Synthesizer
 * Generates realistic-sounding guitar chord strums, arpeggiated fingerpicking patterns,
 * and individual string plucks using the Web Audio API (no external samples needed).
 *
 * Architecture note: In Phase 3, microphone input will be added alongside this
 * synthesizer using the same AudioContext.
 */

const AudioSynth = (() => {
  'use strict';

  // ── Audio Context (lazy-init on first user gesture) ───────────────────
  let ctx = null;
  let masterGain = null;
  let _muted = false;
  let _volume = 0.55; // 0-1

  function ensureContext() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = _volume;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // ── Note Frequencies (Equal Temperament, A4 = 440 Hz) ────────────────
  // Standard guitar tuning: E2, A2, D3, G3, B3, E4
  const NOTE_FREQ = {};
  const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  for (let midi = 21; midi <= 96; midi++) {
    const octave = Math.floor((midi - 12) / 12);
    const noteIdx = (midi - 12) % 12;
    const name = NOTE_NAMES[noteIdx] + octave;
    NOTE_FREQ[name] = 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Open string frequencies (standard tuning, string 6→1 = low E → high E)
  const OPEN_STRINGS = [
    { name: 'E2', freq: NOTE_FREQ['E2'] || 82.41 },   // String 6 (thickest)
    { name: 'A2', freq: NOTE_FREQ['A2'] || 110.00 },   // String 5
    { name: 'D3', freq: NOTE_FREQ['D3'] || 146.83 },   // String 4
    { name: 'G3', freq: NOTE_FREQ['G3'] || 196.00 },   // String 3
    { name: 'B3', freq: NOTE_FREQ['B3'] || 246.94 },   // String 2
    { name: 'E4', freq: NOTE_FREQ['E4'] || 329.63 },   // String 1 (thinnest)
  ];

  // ── Complete Chord Definitions (fret numbers per string, -1 = muted) ───
  // Order: [E2, A2, D3, G3, B3, E4] = strings 6, 5, 4, 3, 2, 1
  const CHORD_SHAPES = {
    // Základní mollové (Minor)
    'Em':   [0, 2, 2, 0, 0, 0],
    'Am':   [-1, 0, 2, 2, 1, 0],
    'Dm':   [-1, -1, 0, 2, 3, 1],
    'Bm':   [-1, 2, 4, 4, 3, 2],
    'Hm':   [-1, 2, 4, 4, 3, 2], // Czech alias for Bm
    'F#m':  [2, 4, 4, 2, 2, 2],
    'Fism': [2, 4, 4, 2, 2, 2], // Czech alias for F#m
    'Fm':   [1, 3, 3, 1, 1, 1],
    'Gm':   [3, 5, 5, 3, 3, 3],
    'Cm':   [-1, 3, 5, 5, 4, 3],

    // Základní durové (Major)
    'C':    [-1, 3, 2, 0, 1, 0],
    'G':    [3, 2, 0, 0, 0, 3],
    'D':    [-1, -1, 0, 2, 3, 2],
    'E':    [0, 2, 2, 1, 0, 0],
    'A':    [-1, 0, 2, 2, 2, 0],
    'F':    [1, 3, 3, 2, 1, 1],
    'B':    [-1, 2, 4, 4, 4, 2],
    'H':    [-1, 2, 4, 4, 4, 2], // Czech alias for B

    // Dominantní septakordy (Dominant 7th)
    'B7':   [-1, 2, 1, 2, 0, 2],
    'H7':   [-1, 2, 1, 2, 0, 2], // Czech alias for B7
    'A7':   [-1, 0, 2, 0, 2, 0],
    'D7':   [-1, -1, 0, 2, 1, 2],
    'E7':   [0, 2, 0, 1, 0, 0],
    'G7':   [3, 2, 0, 0, 0, 1],
    'C7':   [-1, 3, 2, 3, 1, 0],

    // Mollové 7 & Rozšířené akordy (add9, sus4, m7)
    'Am7':  [-1, 0, 2, 0, 1, 0],
    'Em7':  [0, 2, 2, 0, 3, 0],
    'Dm7':  [-1, -1, 0, 2, 1, 1],
    'Cadd9':[-1, 3, 2, 0, 3, 3],
    'Dsus4':[-1, -1, 0, 2, 3, 3],
    'Asus4':[-1, 0, 2, 2, 3, 0]
  };

  // ── Standard Fingerpicking Patterns (Vybrnkávací vzory) ───────────────
  const FINGERPICKING_PATTERNS = {
    'full': {
      id: 'full',
      name: 'Plné arpeggio (všechny struny)',
      shortName: 'Plné arpeggio',
      timeSig: '4/4',
      desc: 'Zahraje postupně všechny znějící struny akordu od nejhlubšího basu až po tenké E, takže zazní kompletní souzvuk bez vynechání vnitřních tónů.',
      steps: [
        { finger: 'P', stringType: 'bass', label: 'Hlavní bas (P)' },
        { finger: 'P', stringType: 'inner_bass', label: 'Vnitřní bas (P)' },
        { finger: 'i', stringNum: 3, label: '3. struna (i)' },
        { finger: 'm', stringNum: 2, label: '2. struna (m)' },
        { finger: 'a', stringNum: 1, label: '1. struna (a)' }
      ]
    },
    'pima': {
      id: 'pima',
      name: 'Vzestupné arpeggio (P-i-m-a)',
      shortName: 'P-i-m-a',
      timeSig: '4/4',
      desc: 'Základní vybrnkávání: palec zahraje basový tón a mezibas, poté prsty postupně rozezní struny 3, 2 a 1 tak, aby zazněl celý akord.',
      steps: [
        { finger: 'P', stringType: 'bass', label: 'Bas (P)' },
        { finger: 'P', stringType: 'inner_bass', label: 'Mezibas (P)' },
        { finger: 'i', stringNum: 3, label: '3. struna (i)' },
        { finger: 'm', stringNum: 2, label: '2. struna (m)' },
        { finger: 'a', stringNum: 1, label: '1. struna (a)' }
      ]
    },
    'camp': {
      id: 'camp',
      name: 'Táborový vzor (P-3-2-1-2-3)',
      shortName: 'P-3-2-1-2-3',
      timeSig: '6/8',
      desc: 'Nejznámější český táborákový a folkový vzor pro 3/4 a 6/8 balady (Nedvědi, Nohavica, trampské písně). Propojuje bas i vnitřní melodii.',
      steps: [
        { finger: 'P', stringType: 'bass', label: 'Bas (P)' },
        { finger: 'P/i', stringType: 'inner', label: 'Struna 4 (P/i)' },
        { finger: 'i', stringNum: 3, label: 'Struna 3 (i)' },
        { finger: 'm', stringNum: 2, label: 'Struna 2 (m)' },
        { finger: 'a', stringNum: 1, label: 'Struna 1 (a)' },
        { finger: 'm', stringNum: 2, label: 'Struna 2 (m)' }
      ]
    },
    'ballad': {
      id: 'ballad',
      name: 'Akustická balada (P-2-3-1-3-2)',
      shortName: 'P-2-3-1-3-2',
      timeSig: '4/4',
      desc: 'Lyrický vzor vhodný pro rockové balady a melodické písně (např. Dust in the Wind, Hallelujah).',
      steps: [
        { finger: 'P', stringType: 'bass', label: 'Bas (P)' },
        { finger: 'P/i', stringType: 'inner', label: 'Struna 4 (P/i)' },
        { finger: 'm', stringNum: 2, label: 'Struna 2 (m)' },
        { finger: 'i', stringNum: 3, label: 'Struna 3 (i)' },
        { finger: 'a', stringNum: 1, label: 'Struna 1 (a)' },
        { finger: 'm', stringNum: 2, label: 'Struna 2 (m)' }
      ]
    },
    'pinch': {
      id: 'pinch',
      name: 'Travis picking / Pinch (Bas + souzvuk)',
      shortName: 'Pinch & Pick',
      timeSig: '4/4',
      desc: 'Tradiční country a folk technika: palec a prsteník štípnou souzvuk basu s výškou, následovaný střídavou dohrávkou.',
      steps: [
        { finger: 'P+a', stringType: 'bass+1', label: 'Souzvuk (P+a)' },
        { finger: 'm', stringNum: 2, label: '2. struna (m)' },
        { finger: 'P', stringType: 'alt_bass', label: 'Altern. bas (P)' },
        { finger: 'i', stringNum: 3, label: '3. struna (i)' }
      ]
    }
  };

  // ── Plucked String Synthesis ─────────────────────────────────────────
  /**
   * Karplus-Strong-inspired pluck via dual oscillator + filtered noise burst.
   * @param {number} freq       Fundamental frequency in Hz
   * @param {number} startTime  AudioContext time to begin
   * @param {number} duration   Note duration in seconds
   * @param {number} velocity   0-1 loudness
   */
  function pluckString(freq, startTime, duration, velocity = 0.5) {
    const ac = ensureContext();
    const t = startTime;

    // --- Oscillator (fundamental triangle + slight detuned sine for warm harmonic richness) ---
    const osc = ac.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;

    const osc2 = ac.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 1.002; // natural chorus shimmer

    // Sub-harmonic for low bass strings (E2, A2)
    let subOsc = null;
    let subGain = null;
    if (freq < 150) {
      subOsc = ac.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.value = freq;
      subGain = ac.createGain();
      subGain.gain.setValueAtTime(0, t);
      subGain.gain.linearRampToValueAtTime(velocity * 0.22, t + 0.008);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.85);
      subOsc.connect(subGain);
    }

    // --- Amplitude envelopes (fast tactile attack, natural exponential decay) ---
    const ampEnv = ac.createGain();
    ampEnv.gain.setValueAtTime(0, t);
    ampEnv.gain.linearRampToValueAtTime(velocity * 0.38, t + 0.005);
    ampEnv.gain.exponentialRampToValueAtTime(0.001, t + duration);

    const ampEnv2 = ac.createGain();
    ampEnv2.gain.setValueAtTime(0, t);
    ampEnv2.gain.linearRampToValueAtTime(velocity * 0.16, t + 0.005);
    ampEnv2.gain.exponentialRampToValueAtTime(0.001, t + duration);

    // --- Low-pass filter (simulates soundboard acoustic body resonance) ---
    const lpf = ac.createBiquadFilter();
    lpf.type = 'lowpass';
    const cutoff = Math.min(10000, freq * 7.5);
    lpf.frequency.setValueAtTime(cutoff, t);
    lpf.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 1.8), t + duration * 0.7);
    lpf.Q.value = 1.35;

    // --- Noise burst for fingernail / plectrum pluck attack ---
    const noiseLen = 0.038;
    const noiseBuf = ac.createBuffer(1, Math.floor(ac.sampleRate * noiseLen), ac.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.45;
    }
    const noiseNode = ac.createBufferSource();
    noiseNode.buffer = noiseBuf;

    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.24, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + noiseLen);

    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = Math.min(8000, freq * 3.2);
    noiseFilter.Q.value = 2.2;

    // --- Signal Graph Wiring ---
    osc.connect(ampEnv);
    osc2.connect(ampEnv2);
    ampEnv.connect(lpf);
    ampEnv2.connect(lpf);
    if (subGain) subGain.connect(lpf);
    lpf.connect(masterGain);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    // --- Start & Stop Scheduling ---
    osc.start(t);
    osc.stop(t + duration + 0.05);
    osc2.start(t);
    osc2.stop(t + duration + 0.05);
    if (subOsc) {
      subOsc.start(t);
      subOsc.stop(t + duration + 0.05);
    }
    noiseNode.start(t);
    noiseNode.stop(t + noiseLen + 0.01);
  }

  // ── Muted String Pluck (Dead note / X on fretboard) ───────────────────
  function playMutedString(stringNum) {
    const ac = ensureContext();
    const t = ac.currentTime;
    const noiseLen = 0.045;
    const noiseBuf = ac.createBuffer(1, Math.floor(ac.sampleRate * noiseLen), ac.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.35;
    }
    const noiseNode = ac.createBufferSource();
    noiseNode.buffer = noiseBuf;

    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(0.14, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + noiseLen);

    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;

    noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noiseNode.start(t);
    noiseNode.stop(t + noiseLen + 0.01);
  }

  // ── Pluck a Single Chord String ──────────────────────────────────────
  /**
   * Pluck a specific string (1-6) of a chord shape.
   * If muted, plays realistic dead string click.
   * If fretted, plays exact note frequency.
   * @param {string} chordName
   * @param {number} stringNum 1-6 (1=high E, 6=low E)
   */
  function pluckChordString(chordName, stringNum) {
    if (stringNum < 1 || stringNum > 6) return null;
    const shape = CHORD_SHAPES[chordName];
    if (!shape) {
      playString(stringNum, 0);
      return { muted: false, stringNum, fret: 0 };
    }
    const idx = 6 - stringNum;
    const fret = shape[idx];
    if (fret < 0) {
      playMutedString(stringNum);
      return { muted: true, stringNum, fret: -1 };
    }
    const baseFreq = OPEN_STRINGS[idx].freq;
    const freq = baseFreq * Math.pow(2, fret / 12);
    const ac = ensureContext();
    pluckString(freq, ac.currentTime, 1.8, 0.58);
    return { muted: false, stringNum, fret, freq };
  }

  // ── Strum a Chord (Full multi-string stroke) ──────────────────────────
  /**
   * Play a full chord strum.
   * @param {string} chordName   e.g. 'Em', 'C', 'G'
   * @param {object} opts        { duration, velocity, speed, direction: 'down'|'up' }
   */
  function playChord(chordName, opts = {}) {
    const shape = CHORD_SHAPES[chordName];
    if (!shape) { console.warn('AudioSynth: Unknown chord', chordName); return; }

    const ac = ensureContext();
    const now = ac.currentTime;
    const duration = opts.duration || 1.4;
    const velocity = opts.velocity || 0.48;
    const strumDelay = opts.strumDelay || 0.016;
    const direction = opts.direction || 'down';

    // Downstroke: sweep low E -> high E (idx 0 -> 5)
    // Upstroke: sweep high E -> low E (idx 5 -> 0)
    const indices = (direction === 'up')
      ? [5, 4, 3, 2, 1, 0]
      : [0, 1, 2, 3, 4, 5];

    let step = 0;
    indices.forEach(idx => {
      const fret = shape[idx];
      if (fret < 0) return; // muted string
      const baseFreq = OPEN_STRINGS[idx].freq;
      const freq = baseFreq * Math.pow(2, fret / 12);
      const t = now + step * strumDelay;
      const strVel = (direction === 'up') ? velocity * 0.92 : velocity;
      pluckString(freq, t, duration, strVel);
      step++;
    });
  }

  // ── Arpeggiate a Chord (Fingerpicking sequence) ───────────────────────
  /**
   * Play a fingerpicking arpeggio on the chord.
   * @param {string} chordName
   * @param {object} opts { pattern: 'pima'|'camp'|'ballad'|'pinch'|'check_clean', tempo: 1.0, onPluck: (str, finger) => void }
   */
  function arpeggiateChord(chordName, opts = {}) {
    const shape = CHORD_SHAPES[chordName];
    if (!shape) return [];

    const patternId = opts.pattern || 'full';
    const tempo = Math.max(0.4, Math.min(2.5, opts.tempo || 1.0));
    const onPluck = opts.onPluck || null;

    // Collect all playable (unmuted) strings from lowest to highest
    const playable = [];
    for (let s = 6; s >= 1; s--) {
      if (shape[6 - s] >= 0) playable.push(s);
    }
    if (playable.length === 0) return [];

    const bassStringNum = playable[0]; // Lowest root bass
    const innerBassString = playable.length > 3 ? playable[1] : playable[0];

    let sequence = [];
    if (patternId === 'full') {
      // Complete ascending chord arpeggio: plucks every single playable string
      let d = 0;
      playable.forEach((s, idx) => {
        const finger = (idx === 0) ? 'P' : (idx === 1 && playable.length >= 5 ? 'P' : (s === 3 ? 'i' : (s === 2 ? 'm' : (s === 1 ? 'a' : 'P'))));
        sequence.push({ str: s, delay: d, finger });
        d += 0.22 / tempo;
      });
    } else if (patternId === 'pima') {
      // Classic P-I-M-A ensuring all inner strings sound:
      if (playable.length >= 5) {
        // 5 or 6 string chord: Bass (P) -> Inner bass (P) -> 3 (i) -> 2 (m) -> 1 (a)
        sequence = [
          { str: bassStringNum, delay: 0, finger: 'P' },
          { str: innerBassString, delay: 0.22 / tempo, finger: 'P' },
          { str: 3, delay: 0.44 / tempo, finger: 'i' },
          { str: 2, delay: 0.66 / tempo, finger: 'm' },
          { str: 1, delay: 0.88 / tempo, finger: 'a' }
        ];
      } else {
        // 4 string chord (e.g. D, Dm): Bass (P) -> 3 (i) -> 2 (m) -> 1 (a)
        sequence = [
          { str: bassStringNum, delay: 0, finger: 'P' },
          { str: 3, delay: 0.25 / tempo, finger: 'i' },
          { str: 2, delay: 0.50 / tempo, finger: 'm' },
          { str: 1, delay: 0.75 / tempo, finger: 'a' }
        ];
      }
    } else if (patternId === 'camp') {
      // 6/8 Táborový vzor: Bas -> vnitřní struna -> 3 -> 2 -> 1 -> 2
      if (playable.length >= 5) {
        sequence = [
          { str: bassStringNum, delay: 0, finger: 'P' },
          { str: innerBassString, delay: 0.20 / tempo, finger: 'P' },
          { str: 3, delay: 0.40 / tempo, finger: 'i' },
          { str: 2, delay: 0.60 / tempo, finger: 'm' },
          { str: 1, delay: 0.80 / tempo, finger: 'a' },
          { str: 2, delay: 1.00 / tempo, finger: 'm' }
        ];
      } else {
        sequence = [
          { str: bassStringNum, delay: 0, finger: 'P' },
          { str: 3, delay: 0.20 / tempo, finger: 'i' },
          { str: 2, delay: 0.40 / tempo, finger: 'm' },
          { str: 1, delay: 0.60 / tempo, finger: 'a' },
          { str: 2, delay: 0.80 / tempo, finger: 'm' },
          { str: 3, delay: 1.00 / tempo, finger: 'i' }
        ];
      }
    } else if (patternId === 'ballad') {
      // Balada: Bas -> vnitřní struna -> 2 -> 3 -> 1 -> 3
      if (playable.length >= 5) {
        sequence = [
          { str: bassStringNum, delay: 0, finger: 'P' },
          { str: innerBassString, delay: 0.22 / tempo, finger: 'P' },
          { str: 2, delay: 0.44 / tempo, finger: 'm' },
          { str: 3, delay: 0.66 / tempo, finger: 'i' },
          { str: 1, delay: 0.88 / tempo, finger: 'a' },
          { str: 3, delay: 1.10 / tempo, finger: 'i' }
        ];
      } else {
        sequence = [
          { str: bassStringNum, delay: 0, finger: 'P' },
          { str: 2, delay: 0.24 / tempo, finger: 'm' },
          { str: 3, delay: 0.48 / tempo, finger: 'i' },
          { str: 1, delay: 0.72 / tempo, finger: 'a' },
          { str: 3, delay: 0.96 / tempo, finger: 'i' },
          { str: 2, delay: 1.20 / tempo, finger: 'm' }
        ];
      }
    } else if (patternId === 'pinch') {
      // Travis picking: Bass + 1 simultaneously, then 2, then alt bass, then 3
      const altBass = (bassStringNum === 6) ? (shape[1] >= 0 ? 5 : 4) : (bassStringNum === 5 ? (shape[2] >= 0 ? 4 : 5) : 3);
      sequence = [
        { str: bassStringNum, delay: 0, finger: 'P' },
        { str: 1, delay: 0, finger: 'a' },
        { str: 2, delay: 0.26 / tempo, finger: 'm' },
        { str: altBass, delay: 0.52 / tempo, finger: 'P' },
        { str: 3, delay: 0.78 / tempo, finger: 'i' }
      ];
    } else if (patternId === 'check_clean') {
      // String-by-string cleanliness check (all playable strings from low to high slowly)
      let d = 0;
      playable.forEach(s => {
        sequence.push({ str: s, delay: d, finger: '🔍' });
        d += 0.38 / tempo;
      });
    } else {
      // Default fallback: sweep all playable strings
      let d = 0;
      playable.forEach((s, idx) => {
        sequence.push({ str: s, delay: d, finger: idx === 0 ? 'P' : 'i' });
        d += 0.22 / tempo;
      });
    }

    sequence.forEach(step => {
      setTimeout(() => {
        pluckChordString(chordName, step.str);
        if (typeof onPluck === 'function') {
          onPluck(step.str, step.finger);
        }
      }, step.delay * 1000);
    });

    return sequence;
  }

  // ── Musical Tone Information per String in a Chord ───────────────────
  function getChordNoteNames(chordName) {
    const shape = CHORD_SHAPES[chordName] || [-1, -1, -1, -1, -1, -1];
    const stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];
    const result = [];
    for (let s = 6; s >= 1; s--) {
      const idx = 6 - s;
      const fret = shape[idx];
      const openName = stringNames[idx];
      if (fret < 0) {
        result.push({
          stringNum: s,
          stringName: openName,
          fret: -1,
          fretLabel: '✕',
          noteName: `${openName} (✕ Tlumeno)`,
          isMuted: true
        });
      } else {
        const baseFreq = OPEN_STRINGS[idx].freq;
        const freq = baseFreq * Math.pow(2, fret / 12);
        const midi = Math.round(69 + 12 * Math.log2(freq / 440));
        const noteIdx = (midi - 12) % 12;
        const octave = Math.floor((midi - 12) / 12);
        const note = NOTE_NAMES[noteIdx] + octave;
        result.push({
          stringNum: s,
          stringName: openName,
          fret: fret,
          fretLabel: fret === 0 ? '0 (volná)' : `${fret}. pražec`,
          noteName: `${note}`,
          isMuted: false
        });
      }
    }
    return result;
  }

  // ── Play Single String (Open or Fretted) ─────────────────────────────
  function playString(stringNum, fret = 0, duration = 1.4, velocity = 0.55) {
    if (stringNum < 1 || stringNum > 6) return;
    const idx = 6 - stringNum;
    const baseFreq = OPEN_STRINGS[idx].freq;
    const freq = baseFreq * Math.pow(2, fret / 12);
    const ac = ensureContext();
    pluckString(freq, ac.currentTime, duration, velocity);
  }

  // ── Metronome Click ─────────────────────────────────────────────────
  function playClick(accent = false) {
    const ac = ensureContext();
    const t = ac.currentTime;

    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = accent ? 1200 : 800;

    const env = ac.createGain();
    env.gain.setValueAtTime(accent ? 0.35 : 0.2, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(env);
    env.connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  // ── Feedback Sounds ─────────────────────────────────────────────────
  function playFeedback(type) {
    const ac = ensureContext();
    const t = ac.currentTime;

    const osc = ac.createOscillator();
    const env = ac.createGain();

    if (type === 'perfect') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.linearRampToValueAtTime(1320, t + 0.08);
      env.gain.setValueAtTime(0.2, t);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    } else if (type === 'good') {
      osc.type = 'sine';
      osc.frequency.value = 660;
      env.gain.setValueAtTime(0.15, t);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    } else { // miss
      osc.type = 'sawtooth';
      osc.frequency.value = 200;
      env.gain.setValueAtTime(0.1, t);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    }

    osc.connect(env);
    env.connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // ── Volume & Mute ───────────────────────────────────────────────────
  function setVolume(v) {
    _volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.value = _muted ? 0 : _volume;
  }

  function toggleMute() {
    _muted = !_muted;
    if (masterGain) masterGain.gain.value = _muted ? 0 : _volume;
    return _muted;
  }

  function getVolume() { return _volume; }
  function isMuted() { return _muted; }

  // ── Public API ──────────────────────────────────────────────────────
  return {
    ensureContext,
    playChord,
    playString,
    playMutedString,
    pluckChordString,
    arpeggiateChord,
    getChordNoteNames,
    FINGERPICKING_PATTERNS,
    playClick,
    playFeedback,
    setVolume,
    getVolume,
    toggleMute,
    isMuted,
    CHORD_SHAPES,
    OPEN_STRINGS,
    NOTE_FREQ,
  };
})();
