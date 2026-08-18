// Zumba Web Audio API Sound Synthesizer for rhythmic Latin workout music

class ZumbaAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private step = 0;
  private bpm = 128; // Energetic Latin Zumba tempo

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a kick bass drum
  private playKick(time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  // Play snappy snare / clap
  private playSnare(time: number) {
    if (!this.ctx) return;
    // Noise buffer
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(time);
  }

  // Play Latin Cowbell / Conga
  private playLatinCowbell(time: number, pitch = 800) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, time);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, time + 0.08);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  // Play playful melodic marimba/synth chord note
  private playMarimba(time: number, freq: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  public startWorkoutMusic() {
    this.initCtx();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;

    const intervalMs = (60 / this.bpm / 2) * 1000; // 8th notes

    const notes = [
      523.25, // C5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      1046.50 // C6
    ];

    this.timerId = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const step16 = this.step % 16;

      // 4-on-the-floor kick
      if (step16 % 4 === 0) {
        this.playKick(now);
      }

      // Reggaeton/Salsa Dembow Snare (beat 3 and 7 in 16th or syncopated)
      if (step16 === 3 || step16 === 6 || step16 === 11 || step16 === 14) {
        this.playSnare(now);
      }

      // Cowbell syncopation
      if (step16 === 2 || step16 === 5 || step16 === 8 || step16 === 12) {
        this.playLatinCowbell(now, step16 % 2 === 0 ? 880 : 700);
      }

      // Melody
      if (step16 % 2 === 0) {
        const noteIndex = (Math.floor(this.step / 4) + (step16 % 3)) % notes.length;
        this.playMarimba(now, notes[noteIndex]);
      }

      this.step++;
    }, intervalMs);
  }

  public stopWorkoutMusic() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public isMusicPlaying(): boolean {
    return this.isPlaying;
  }
}

export const zumbaAudio = new ZumbaAudioEngine();
