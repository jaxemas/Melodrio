/**
 * Melodrio Phase 2 — Web Audio Guitar Synthesizer
 * Generates realistic-sounding guitar chord strums and individual string plucks
 * using the Web Audio API (no external samples needed).
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

  // ── Chord Definitions (fret numbers per string, -1 = muted) ──────────
  // Order: [E2, A2, D3, G3, B3, E4] = strings 6,5,4,3,2,1
  const CHORD_SHAPES = {
    'Em':  [0, 2, 2, 0, 0, 0],
    'Am':  [-1, 0, 2, 2, 1, 0],
    'C':   [-1, 3, 2, 0, 1, 0],
    'G':   [3, 2, 0, 0, 0, 3],
    'D':   [-1, -1, 0, 2, 3, 2],
    'Dm':  [-1, -1, 0, 2, 3, 1],
    'E':   [0, 2, 2, 1, 0, 0],
    'A':   [-1, 0, 2, 2, 2, 0],
    'F':   [1, 3, 3, 2, 1, 1],
    'B7':  [-1, 2, 1, 2, 0, 2],
    'A7':  [-1, 0, 2, 0, 2, 0],
    'D7':  [-1, -1, 0, 2, 1, 2],
    'E7':  [0, 2, 0, 1, 0, 0],
    'G7':  [3, 2, 0, 0, 0, 1],
    'C7':  [-1, 3, 2, 3, 1, 0],
    'Bm':  [-1, 2, 4, 4, 3, 2],
  };

  // ── Plucked String Synthesis ─────────────────────────────────────────
  /**
   * Attempt Karplus-Strong-inspired pluck via oscillator + filtered noise burst.
   * @param {number} freq     Fundamental frequency in Hz
   * @param {number} startTime  AudioContext time to begin
   * @param {number} duration   Note duration in seconds
   * @param {number} velocity   0-1 loudness
   */
  function pluckString(freq, startTime, duration, velocity = 0.45) {
    const ac = ensureContext();
    const t = startTime;

    // --- Oscillator (fundamental + slight detune for warmth) ---
    const osc = ac.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;

    const osc2 = ac.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 1.002; // tiny detune

    // --- Amplitude envelope (fast attack, natural decay) ---
    const ampEnv = ac.createGain();
    ampEnv.gain.setValueAtTime(0, t);
    ampEnv.gain.linearRampToValueAtTime(velocity * 0.35, t + 0.005);
    ampEnv.gain.exponentialRampToValueAtTime(0.001, t + duration);

    const ampEnv2 = ac.createGain();
    ampEnv2.gain.setValueAtTime(0, t);
    ampEnv2.gain.linearRampToValueAtTime(velocity * 0.15, t + 0.005);
    ampEnv2.gain.exponentialRampToValueAtTime(0.001, t + duration);

    // --- Low-pass filter (simulates guitar body resonance) ---
    const lpf = ac.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(freq * 6, t);
    lpf.frequency.exponentialRampToValueAtTime(freq * 1.5, t + duration * 0.7);
    lpf.Q.value = 1.2;

    // --- Noise burst for pick attack ---
    const noiseLen = 0.04;
    const noiseBuf = ac.createBuffer(1, ac.sampleRate * noiseLen, ac.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noiseNode = ac.createBufferSource();
    noiseNode.buffer = noiseBuf;

    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.2, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + noiseLen);

    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = freq * 3;
    noiseFilter.Q.value = 2;

    // --- Wiring ---
    osc.connect(ampEnv);
    osc2.connect(ampEnv2);
    ampEnv.connect(lpf);
    ampEnv2.connect(lpf);
    lpf.connect(masterGain);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    // --- Schedule ---
    osc.start(t);
    osc.stop(t + duration + 0.05);
    osc2.start(t);
    osc2.stop(t + duration + 0.05);
    noiseNode.start(t);
    noiseNode.stop(t + noiseLen + 0.01);
  }

  // ── Strum a Chord ────────────────────────────────────────────────────
  /**
   * Play a full chord strum.
   * @param {string} chordName   e.g. 'Em', 'C', 'G'
   * @param {object} opts        { duration, velocity, speed }
   */
  function playChord(chordName, opts = {}) {
    const shape = CHORD_SHAPES[chordName];
    if (!shape) { console.warn('AudioSynth: Unknown chord', chordName); return; }

    const ac = ensureContext();
    const now = ac.currentTime;
    const duration = opts.duration || 1.2;
    const velocity = opts.velocity || 0.45;
    const strumDelay = 0.018; // delay between strings for strum effect

    shape.forEach((fret, idx) => {
      if (fret < 0) return; // muted string
      const baseFreq = OPEN_STRINGS[idx].freq;
      const freq = baseFreq * Math.pow(2, fret / 12);
      const t = now + idx * strumDelay;
      pluckString(freq, t, duration, velocity);
    });
  }

  // ── Play Single String ──────────────────────────────────────────────
  /**
   * Play a single guitar string (open or fretted).
   * @param {number} stringNum 1-6 (1=high E, 6=low E)
   * @param {number} fret      0=open, 1-24
   */
  function playString(stringNum, fret = 0) {
    if (stringNum < 1 || stringNum > 6) return;
    const idx = 6 - stringNum; // convert 1-based (high E first) to array index
    const baseFreq = OPEN_STRINGS[idx].freq;
    const freq = baseFreq * Math.pow(2, fret / 12);
    const ac = ensureContext();
    pluckString(freq, ac.currentTime, 1.0, 0.5);
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
