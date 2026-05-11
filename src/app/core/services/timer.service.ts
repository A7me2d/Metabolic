import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  
  readonly remainingSeconds = signal(0);
  readonly isRunning = signal(false);
  readonly isPaused = signal(false);
  readonly totalSeconds = signal(0);
  
  readonly progress = computed(() => {
    const total = this.totalSeconds();
    const remaining = this.remainingSeconds();
    if (total === 0) return 0;
    return ((total - remaining) / total) * 100;
  });

  readonly formattedTime = computed(() => {
    const seconds = this.remainingSeconds();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  start(seconds: number): void {
    this.stop();
    this.totalSeconds.set(seconds);
    this.remainingSeconds.set(seconds);
    this.isRunning.set(true);
    this.isPaused.set(false);
    
    this.intervalId = setInterval(() => {
      const current = this.remainingSeconds();
      if (current > 0) {
        this.remainingSeconds.set(current - 1);
      } else {
        this.complete();
      }
    }, 1000);
  }

  pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPaused.set(true);
  }

  resume(): void {
    if (this.isPaused() && this.remainingSeconds() > 0) {
      this.isPaused.set(false);
      this.intervalId = setInterval(() => {
        const current = this.remainingSeconds();
        if (current > 0) {
          this.remainingSeconds.set(current - 1);
        } else {
          this.complete();
        }
      }, 1000);
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning.set(false);
    this.isPaused.set(false);
    this.remainingSeconds.set(0);
    this.totalSeconds.set(0);
  }

  private complete(): void {
    this.stop();
    this.playNotificationSound();
  }

  private playNotificationSound(): void {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
      
      // Second beep
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 1000;
        osc2.type = 'sine';
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.3);
      }, 250);
    } catch {
      // Audio not supported
    }
  }

  addTime(seconds: number): void {
    this.remainingSeconds.update(current => current + seconds);
    this.totalSeconds.update(total => total + seconds);
  }

  subtractTime(seconds: number): void {
    this.remainingSeconds.update(current => Math.max(0, current - seconds));
    this.totalSeconds.update(total => Math.max(seconds, total - seconds));
  }
}
