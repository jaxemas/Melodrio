/**
 * Melodrio - Web Audio API Sound Effects
 * Synthesized sound effects without external audio files.
 */

window.Sounds = {
  audioCtx: null,
  volume: 0.3,
  enabled: true,

  /**
   * Initialize AudioContext on first user gesture.
   */
  init() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },

  /**
   * Helper to ensure AudioContext is active.
   */
  _ensureContext() {
    if (!this.audioCtx) {
      this.init();
    } else if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  },

  /**
   * Synthesize a tone with ADSR envelope.
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Total duration in seconds
   * @param {OscillatorType} type - 'sine' | 'square' | 'triangle' | 'sawtooth'
   * @param {number} volumeMultiplier - Multiplier for master volume (0.0 - 1.0)
   * @param {number} delay - Delay before playing in seconds
   * @returns {OscillatorNode|null}
   */
  _playTone(frequency, duration, type = 'sine', volumeMultiplier = 1, delay = 0) {
    if (!this.enabled) return null;
    const ctx = this._ensureContext();
    if (!ctx) return null;

    const startTime = ctx.currentTime + Math.max(0, delay);
    const stopTime = startTime + duration;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);

    const peakVolume = Math.max(0.0001, this.volume * volumeMultiplier);
    const attackTime = Math.min(0.02, duration * 0.15);
    const decayTime = Math.min(0.05, duration * 0.25);
    const sustainVolume = Math.max(0.0001, peakVolume * 0.7);
    const releaseTime = Math.max(0.02, duration * 0.3);

    gain.gain.setValueAtTime(0.0001, startTime);
    // Attack
    gain.gain.exponentialRampToValueAtTime(peakVolume, startTime + attackTime);
    // Decay to Sustain
    gain.gain.exponentialRampToValueAtTime(sustainVolume, startTime + attackTime + decayTime);
    // Sustain hold & Release
    const releaseStart = Math.max(startTime + attackTime + decayTime, stopTime - releaseTime);
    gain.gain.setValueAtTime(sustainVolume, releaseStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(stopTime);

    osc.onended = () => {
      try {
        gain.disconnect();
        osc.disconnect();
      } catch (e) {
        // Ignored
      }
    };

    return osc;
  },

  /**
   * Short, subtle click sound for buttons and navigation.
   * Duration ~50ms, crisp high frequency with subtle pitch drop.
   */
  playClick() {
    if (!this.enabled) return;
    const ctx = this._ensureContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const duration = 0.05;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, startTime);
    osc.frequency.exponentialRampToValueAtTime(440, startTime + duration);

    const peakVol = Math.max(0.0001, this.volume * 0.25);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peakVol, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);

    osc.onended = () => {
      try {
        gain.disconnect();
        osc.disconnect();
      } catch (e) {}
    };
  },

  /**
   * Pleasant rising arpeggio: C5 - E5 - G5.
   * Total duration ~300ms.
   */
  playSuccess() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const noteDuration = 0.14;
    const step = 0.08;

    notes.forEach((freq, idx) => {
      this._playTone(freq, noteDuration, 'sine', 0.6, idx * step);
    });
  },

  /**
   * Dissonant low buzz for error feedback.
   * Two descending tones (~200Hz -> ~150Hz) with square wave.
   * Total duration ~200ms.
   */
  playError() {
    if (!this.enabled) return;
    const ctx = this._ensureContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const duration = 0.2;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(210, startTime);
    osc.frequency.setValueAtTime(150, startTime + 0.09);

    const peakVol = Math.max(0.0001, this.volume * 0.35);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peakVol, startTime + 0.015);
    gain.gain.setValueAtTime(peakVol * 0.8, startTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);

    osc.onended = () => {
      try {
        gain.disconnect();
        osc.disconnect();
      } catch (e) {}
    };
  },

  /**
   * Triumphant fanfare for level up / stage unlocks.
   * Rising arpeggio: C4 - E4 - G4 - C5 with layered sine + triangle.
   * Total duration ~650ms.
   */
  playLevelUp() {
    if (!this.enabled) return;
    const notes = [
      { freq: 261.63, dur: 0.16, delay: 0.00 }, // C4
      { freq: 329.63, dur: 0.16, delay: 0.12 }, // E4
      { freq: 392.00, dur: 0.18, delay: 0.24 }, // G4
      { freq: 523.25, dur: 0.40, delay: 0.38 }  // C5 (held)
    ];

    notes.forEach(n => {
      // Primary sine tone
      this._playTone(n.freq, n.dur, 'sine', 0.65, n.delay);
      // Triangle overtone layer for fullness
      this._playTone(n.freq * 2, n.dur * 0.8, 'triangle', 0.25, n.delay);
    });
  },

  /**
   * Gentle two-tone chime for notifications: G5 - C6.
   * Duration ~220ms.
   */
  playNotification() {
    if (!this.enabled) return;
    this._playTone(783.99, 0.15, 'sine', 0.5, 0.00); // G5
    this._playTone(1046.50, 0.22, 'sine', 0.6, 0.08); // C6
  },

  /**
   * Lesson / quiz complete celebration sound.
   * Rising arpeggio ending on a sustained high chord (C5 + G5 + C6).
   * Total duration ~600ms.
   */
  playComplete() {
    if (!this.enabled) return;
    // Arpeggio lead-in
    this._playTone(523.25, 0.14, 'sine', 0.55, 0.00); // C5
    this._playTone(659.25, 0.14, 'sine', 0.55, 0.09); // E5
    this._playTone(783.99, 0.16, 'sine', 0.60, 0.18); // G5

    // Final celebratory chord
    const chordDelay = 0.28;
    const chordDur = 0.55;
    this._playTone(523.25, chordDur, 'triangle', 0.35, chordDelay);  // C5
    this._playTone(783.99, chordDur, 'sine', 0.45, chordDelay);      // G5
    this._playTone(1046.50, chordDur, 'sine', 0.65, chordDelay);     // C6
  },

  /**
   * Set sound volume (0.0 to 1.0).
   * @param {number} v
   */
  setVolume(v) {
    const val = Number(v);
    if (!isNaN(val)) {
      this.volume = Math.max(0, Math.min(1, val));
    }
  },

  /**
   * Toggle sounds on/off.
   * @returns {boolean} current enabled state
   */
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
};
