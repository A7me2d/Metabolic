import { Component, inject, input, output } from '@angular/core';
import { TimerService } from '../../../core/services/timer.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  template: `
    <div class="card p-6 md:p-8 text-center relative overflow-hidden">
      <!-- Background glow effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 pointer-events-none"></div>
      
      <div class="relative">
        <div class="mb-6">
          <!-- Timer display -->
          <div class="relative inline-block">
            <div class="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full scale-150" [class.opacity-100]="timerService.isRunning()" [class.opacity-0]="!timerService.isRunning()"></div>
            <div class="timer-display text-6xl md:text-7xl font-black relative" [class.text-primary-400]="timerService.isRunning()" [class.text-dark-300]="!timerService.isRunning()">
              {{ timerService.formattedTime() }}
            </div>
          </div>
          
          <!-- Progress bar -->
          <div class="progress-bar mx-auto max-w-xs h-3 mt-6">
            <div class="progress-fill" [style.width.%]="timerService.progress()"></div>
          </div>
        </div>

        <!-- Time adjustment buttons -->
        <div class="flex justify-center gap-3 mb-6">
          <button 
            class="btn btn-secondary text-sm px-4"
            (click)="addTime(-30)"
            [disabled]="!timerService.isRunning()"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            30s
          </button>
          <button 
            class="btn btn-secondary text-sm px-4"
            (click)="addTime(30)"
            [disabled]="!timerService.isRunning()"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            30s
          </button>
        </div>

        <!-- Control buttons -->
        <div class="flex justify-center gap-4">
          @if (!timerService.isRunning()) {
            <button class="btn btn-primary px-8 py-3" (click)="startTimer()">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {{ t('timer.start') }}
            </button>
          } @else if (timerService.isPaused()) {
            <button class="btn btn-primary px-8 py-3" (click)="resumeTimer()">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {{ t('timer.resume') }}
            </button>
          } @else {
            <button class="btn btn-secondary px-8 py-3" (click)="pauseTimer()">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
              {{ t('timer.pause') }}
            </button>
          }
          <button class="btn btn-danger px-8 py-3" (click)="stopTimer()" [disabled]="!timerService.isRunning() && !timerService.isPaused()">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="6" y="6" width="12" height="12"/>
            </svg>
            {{ t('timer.stop') }}
          </button>
        </div>

        <p class="text-sm text-dark-400 mt-6 font-medium">{{ label() }}</p>
      </div>
    </div>
  `
})
export class TimerComponent {
  timerService = inject(TimerService);
  private translationService = inject(TranslationService);
  
  duration = input(90);
  label = input('Rest Timer');
  timerComplete = output<void>();

  t(key: string): string {
    return this.translationService.t(key);
  }

  startTimer(): void {
    this.timerService.start(this.duration());
  }

  pauseTimer(): void {
    this.timerService.pause();
  }

  resumeTimer(): void {
    this.timerService.resume();
  }

  stopTimer(): void {
    this.timerService.stop();
    this.timerComplete.emit();
  }

  addTime(seconds: number): void {
    if (seconds > 0) {
      this.timerService.addTime(seconds);
    } else {
      this.timerService.subtractTime(Math.abs(seconds));
    }
  }
}
