/**
 * Authentic 8-bit Web Audio API synthesizer for Tamagotchi sound effects
 */

class TamagotchiAudio {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {}

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  // Classic Tamagotchi Button beep
  public playBeep(freq = 1200, duration = 0.035, type: OscillatorType = 'square') {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  // Two-tone Confirm/Select chime (A/B button)
  public playSelect() {
    if (!this.soundEnabled) return;
    this.playBeep(987, 0.03, 'square');
    setTimeout(() => this.playBeep(1318, 0.045, 'square'), 35);
  }

  // Retro Game Startup Chime
  public playStartGame() {
    if (!this.soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playBeep(freq, 0.06, 'square'), i * 65);
    });
  }

  // Cancel / Back beep (C button)
  public playCancel() {
    if (!this.soundEnabled) return;
    this.playBeep(880, 0.035, 'square');
    setTimeout(() => this.playBeep(659, 0.05, 'square'), 45);
  }

  // Iconic Tamagotchi Attention Call (3 sharp beeps: BEEP - BEEP - BEEP!)
  public playAttentionCall() {
    if (!this.soundEnabled) return;
    const beep = (delay: number) => {
      setTimeout(() => {
        this.playBeep(1864, 0.08, 'square');
        setTimeout(() => this.playBeep(2093, 0.09, 'square'), 80);
      }, delay);
    };

    beep(0);
    beep(250);
    beep(500);
  }

  // Eating crunchy nom-nom
  public playEat() {
    if (!this.soundEnabled) return;
    const bites = [620, 840, 620, 840, 1100];
    bites.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 0.04, 'triangle');
      }, idx * 75);
    });
  }

  // Cute Petting / Chirp sound ("Pío Pío")
  public playPetChirp() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.playBeep(1760, 0.04, 'sine');
      setTimeout(() => this.playBeep(2349, 0.05, 'sine'), 50);
      setTimeout(() => this.playBeep(2793, 0.06, 'sine'), 120);
    } catch {}
  }

  // Happy Jingle / Hearts gained
  public playHappy() {
    if (!this.soundEnabled) return;
    const melody = [523.25, 659.25, 783.99, 1046.5];
    melody.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 0.07, 'square');
      }, idx * 80);
    });
  }

  // Sad / Refused / Displeased (Wah wah)
  public playRefuse() {
    if (!this.soundEnabled) return;
    this.playBeep(440, 0.1, 'square');
    setTimeout(() => this.playBeep(370, 0.12, 'square'), 110);
    setTimeout(() => this.playBeep(311, 0.18, 'square'), 230);
  }

  // Poop Sound (Squishy slide)
  public playPoop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // Bath / Flush water shower swoosh
  public playFlush() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Medicine Injection
  public playMedicine() {
    if (!this.soundEnabled) return;
    this.playBeep(300, 0.05, 'triangle');
    setTimeout(() => this.playBeep(450, 0.05, 'triangle'), 60);
    setTimeout(() => this.playBeep(700, 0.06, 'triangle'), 120);
    setTimeout(() => this.playHappy(), 220);
  }

  // Discipline Scold whistle/buzz
  public playScold() {
    if (!this.soundEnabled) return;
    this.playBeep(1800, 0.06, 'square');
    setTimeout(() => this.playBeep(1400, 0.06, 'square'), 70);
    setTimeout(() => this.playBeep(1800, 0.06, 'square'), 140);
  }

  // Pitido claro al terminar la Zumba (Clean 8-bit Tamagotchi finish beep)
  public playZumbaFinishBeep() {
    if (!this.soundEnabled) return;
    this.playBeep(1046.5, 0.08, 'square');
    setTimeout(() => this.playBeep(1318.5, 0.08, 'square'), 90);
    setTimeout(() => this.playBeep(1567.98, 0.11, 'square'), 180);
    setTimeout(() => this.playBeep(2093.0, 0.16, 'square'), 300);
  }

  // Mini-Game Win Round
  public playGameRoundWin() {
    if (!this.soundEnabled) return;
    this.playBeep(784, 0.05, 'square');
    setTimeout(() => this.playBeep(1046.5, 0.09, 'square'), 60);
  }

  // Mini-Game Lose Round
  public playGameRoundLose() {
    if (!this.soundEnabled) return;
    this.playBeep(440, 0.07, 'square');
    setTimeout(() => this.playBeep(349, 0.1, 'square'), 75);
  }

  // Egg Hatching Fanfare
  public playEggHatch() {
    if (!this.soundEnabled) return;
    // Cracks then chirps then fanfare
    this.playBeep(800, 0.04, 'square');
    setTimeout(() => this.playBeep(1200, 0.04, 'square'), 80);
    setTimeout(() => this.playBeep(1600, 0.06, 'square'), 160);
    setTimeout(() => {
      const melody = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      melody.forEach((f, i) => {
        setTimeout(() => this.playBeep(f, 0.1, 'square'), i * 90);
      });
    }, 280);
  }

  // Death Funeral Chime (Iconic Somber Chopin Theme)
  public playDeathFuneral() {
    if (!this.soundEnabled) return;
    // C4 - C4 - C4 - C4 - Eb4 - D4 - D4 - C4
    const notes = [
      { f: 261.63, d: 0.35, pause: 0 },
      { f: 261.63, d: 0.35, pause: 400 },
      { f: 261.63, d: 0.25, pause: 800 },
      { f: 261.63, d: 0.45, pause: 1100 },
      { f: 311.13, d: 0.35, pause: 1600 },
      { f: 293.66, d: 0.2, pause: 2000 },
      { f: 293.66, d: 0.25, pause: 2250 },
      { f: 261.63, d: 0.6, pause: 2550 }
    ];

    notes.forEach((n) => {
      setTimeout(() => {
        this.playBeep(n.f, n.d, 'square');
      }, n.pause);
    });
  }

  // Light Switch Click
  public playLightSwitch() {
    if (!this.soundEnabled) return;
    this.playBeep(500, 0.02, 'triangle');
    setTimeout(() => this.playBeep(250, 0.03, 'triangle'), 30);
  }
}

export const soundManager = new TamagotchiAudio();
