// Enhanced Sound Engine using Web Audio API - Vietnamese Gameshow & Dong Son Resonance
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initContext();
  }

  initContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  ensureContext() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMute(mute) {
    this.isMuted = mute;
  }

  // Click Sound
  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Tiếng Trống Đồng Âm Vang (Dong Son Bronze Drum Resonance)
  playDongSonGong() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Harmonics characteristic of ancient bronze drums (metallic fundamental + ring)
    const freqs = [108, 216, 324, 432, 648];
    const gains = [0.45, 0.25, 0.15, 0.08, 0.04];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.95, t + 2.5);

      gain.gain.setValueAtTime(gains[idx], t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 2.5);
    });
  }

  // Cinematic Transition Whoosh
  playWhoosh() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + 0.18);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.45);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.45);
  }

  // Countdown Tick (Dong Son wood & stone percussion tick)
  playTick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5

    gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Countdown Warning (last 5s)
  playWarning() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Time's up Gong/Alarm
  playTimeout() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.playDongSonGong();
  }

  // Correct Answer Fanfare (Hào Hùng Việt Nam)
  playCorrect() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Ascending brass harmonic chords C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.07);

      gain.gain.setValueAtTime(0.24, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.5);
    });
  }

  // Wrong Answer (Soft dignified tone, not overly jarring)
  playWrong() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(146.83, t); // D3
    osc2.frequency.setValueAtTime(155.56, t); // Eb3

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.35);
    osc2.stop(t + 0.35);
  }

  // Steal Siren / Alert
  playSteal() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.25);
    osc.frequency.exponentialRampToValueAtTime(1046, t + 0.4);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.45);
  }

  // Score Award / Point Burst
  playScoreUp() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.2, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.35);
    });
  }

  // Victory fanfare - Triumphant Heroic Melody
  playVictory() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.playDongSonGong();

    const t = this.ctx.currentTime + 0.3;
    const melody = [
      { f: 523.25, time: 0, dur: 0.15 },
      { f: 523.25, time: 0.16, dur: 0.15 },
      { f: 523.25, time: 0.32, dur: 0.15 },
      { f: 659.25, time: 0.48, dur: 0.3 },
      { f: 783.99, time: 0.8, dur: 0.25 },
      { f: 1046.5, time: 1.1, dur: 0.8 }
    ];

    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t + note.time);

      gain.gain.setValueAtTime(0.3, t + note.time);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.time + note.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + note.time);
      osc.stop(t + note.time + note.dur);
    });
  }
}

export const sound = new SoundEngine();
