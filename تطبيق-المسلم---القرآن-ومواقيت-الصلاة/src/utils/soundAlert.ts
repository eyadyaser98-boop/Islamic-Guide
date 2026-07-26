// Sound alert utility for Adhan & Alarms using Web Audio API and Audio Streams

class AdhanSoundManager {
  private audioCtx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private volume: number = 0.8;

  constructor() {
    // Lazy AudioContext init
  }

  private initCtx() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // Play synthetic pleasant chime tone (works offline guaranteed)
  public playSyntheticChime() {
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    // Play 3 melodic tones: C5, E5, G5, C6 (Islamic Takbeer rhythm pattern)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.4);

      gain.gain.setValueAtTime(0, now + idx * 0.4);
      gain.gain.linearRampToValueAtTime(0.3 * this.volume, now + idx * 0.4 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.4 + 1.2);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + idx * 0.4);
      osc.stop(now + idx * 0.4 + 1.3);
    });
  }

  // Play Adhan Audio (Mishary Alafasy / Cairo Adhan)
  public playAdhan(fullAdhan: boolean = true): Promise<void> {
    this.stopAdhan();

    // High quality Islamic Adhan stream URL (Mishary Rashid Alafasy Adhan)
    const adhanUrl = fullAdhan
      ? 'https://cdn.islamicfinder.org/adhan/adhan_makkah.mp3'
      : 'https://cdn.islamicfinder.org/adhan/adhan_short.mp3';

    return new Promise((resolve) => {
      try {
        const audio = new Audio(adhanUrl);
        audio.volume = this.volume;
        this.currentAudio = audio;

        audio.play().then(() => {
          resolve();
        }).catch((err) => {
          console.warn('Network audio failed, falling back to synthetic chime:', err);
          this.playSyntheticChime();
          resolve();
        });

        audio.onended = () => {
          this.currentAudio = null;
        };
      } catch (err) {
        console.warn('Audio play error, falling back to chime:', err);
        this.playSyntheticChime();
        resolve();
      }
    });
  }

  public stopAdhan() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  public isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  // Trigger browser desktop notification if permission granted
  public triggerNotification(title: string, body: string) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          dir: 'rtl',
          lang: 'ar'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, {
              body,
              icon: '/favicon.ico',
              dir: 'rtl',
              lang: 'ar'
            });
          }
        });
      }
    }
  }
}

export const adhanSoundManager = new AdhanSoundManager();
