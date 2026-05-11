import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeExercise } from '../../../core/models/home-workout.model';
import { TranslationService } from '../../../core/services/translation.service';
import { AudioService } from '../../../core/services/audio.service';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

@Component({
  selector: 'app-home-exercise-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageViewerComponent],
  template: `
    <div class="card group hover:border-primary-500/50 transition-all duration-300">
      <div class="p-5">
        <!-- Header -->
        <div class="flex gap-4 mb-4">
          <!-- Exercise Image -->
          <div class="relative flex-shrink-0">
            <div 
              class="w-20 h-20 rounded-xl overflow-hidden bg-dark-700 cursor-pointer"
              (click)="showImagePreview.set(true)"
            >
              <img 
                [src]="exercise().imageUrl" 
                [alt]="getName()"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                (error)="onImageError($event)"
              />
            </div>
            @if (isCompleted()) {
              <div class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            }
          </div>
          
          <!-- Exercise Info -->
          <div class="flex-1 min-w-0">
            <a [routerLink]="['/home-exercise', exercise().id]" class="block">
              <h3 class="text-lg font-bold text-white group-hover:text-primary-400 transition-colors truncate">
                {{ getName() }}
              </h3>
            </a>
            <p class="text-sm text-dark-400 mb-2">{{ getPrimaryMuscle() }}</p>
            <div class="flex items-center gap-3 text-sm">
              <span class="flex items-center gap-1 text-dark-300">
                <svg class="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                {{ exercise().sets }} {{ t('exerciseCard.sets') }}
              </span>
              <span class="flex items-center gap-1 text-dark-300">
                @if (exercise().isDurationBased) {
                  <svg class="w-4 h-4 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ exercise().reps }}
                } @else {
                  <svg class="w-4 h-4 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                  {{ exercise().reps }} {{ t('exerciseCard.reps') }}
                }
              </span>
            </div>
          </div>
        </div>

        <!-- Image Viewer Modal -->
        <app-image-viewer
          [imageUrl]="exercise().imageUrl"
          [imageAlt]="getName()"
          [(isOpen)]="showImagePreview"
        />

        <!-- Duration Timer (for duration-based exercises when active) -->
        @if (showTimer() && exercise().isDurationBased) {
          <div class="mb-4 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-dark-300">{{ t('homeWorkout.timer') }}</span>
              <span class="text-2xl font-bold text-primary-400">{{ formatTime(timerSeconds()) }}</span>
            </div>
            <div class="progress-bar h-2 mb-3">
              <div class="progress-fill bg-gradient-to-r from-primary-500 to-accent-500" 
                   [style.width.%]="timerProgress()"></div>
            </div>
            <div class="flex gap-2">
              @if (!timerRunning()) {
                <button class="btn btn-primary flex-1 text-sm" (click)="startTimer()">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  {{ t('homeWorkout.start') }}
                </button>
              } @else {
                <button class="btn btn-ghost flex-1 text-sm" (click)="pauseTimer()">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                  {{ t('homeWorkout.pause') }}
                </button>
              }
              <button class="btn btn-ghost text-sm" (click)="resetTimer()">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </div>
        }

        <!-- Counting Section -->
        @if (showInputs() && !exercise().isDurationBased) {
          @if (isCounting()) {
            <div class="mb-4 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/30">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  @if (countDown() > 0) {
                    <div class="text-center">
                      <p class="text-sm text-dark-400 mb-1">{{ t('workoutDay.getReady') }}</p>
                      <span class="text-4xl font-black text-primary-400 animate-pulse">{{ countDown() }}</span>
                    </div>
                  } @else {
                    <div class="text-center">
                      <p class="text-sm text-dark-400 mb-1">{{ t('workoutDay.count') }}</p>
                      <span class="text-4xl font-black text-accent-400">{{ currentCount() }}/{{ targetCount() }}</span>
                    </div>
                  }
                </div>
                <button class="btn btn-danger text-sm" (click)="onStopCounting()">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="6" width="12" height="12"/>
                  </svg>
                  {{ t('workoutDay.stop') }}
                </button>
              </div>
            </div>
          } @else {
            <button 
              class="w-full btn btn-secondary text-sm mb-4"
              (click)="onStartCounting()">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              {{ t('workoutDay.startCounting') }} ({{ exercise().reps }} {{ t('exerciseCard.reps') }})
            </button>
          }
        }

        <!-- Completion Toggle -->
        @if (showInputs()) {
          <button 
            class="w-full btn flex items-center justify-center gap-2"
            [class.btn-success]="isCompleted()"
            [class.btn-primary]="!isCompleted()"
            (click)="onCompleteToggle()">
            @if (isCompleted()) {
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ t('exerciseCard.completed') }}
            } @else {
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              {{ t('exerciseCard.markComplete') }}
            }
          </button>
        }
      </div>
    </div>
  `
})
export class HomeExerciseCardComponent {
  exercise = input.required<HomeExercise>();
  isCompleted = input(false);
  showInputs = input(false);
  showTimer = input(false);

  // Counting inputs
  isCounting = input(false);
  countDown = input(0);
  currentCount = input(0);
  targetCount = input(0);

  completeChange = output<{ exerciseId: number; completed: boolean }>();
  timerComplete = output<number>();
  startCounting = output<{ exerciseId: number; target: number }>();
  stopCounting = output<void>();

  private translationService = inject(TranslationService);
  private audioService = inject(AudioService);
  
  timerSeconds = signal(0);
  timerRunning = signal(false);
  showImagePreview = signal(false);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  t(key: string): string {
    return this.translationService.t(key);
  }

  isArabic(): boolean {
    return this.translationService.language() === 'ar';
  }

  getName(): string {
    const ex = this.exercise();
    return this.isArabic() ? (ex.nameAr || ex.name) : ex.name;
  }

  getPrimaryMuscle(): string {
    const ex = this.exercise();
    return this.isArabic() ? (ex.primaryMuscleAr || ex.primaryMuscle) : ex.primaryMuscle;
  }

  timerProgress = signal(0);

  ngOnInit(): void {
    const ex = this.exercise();
    if (ex.isDurationBased && ex.duration) {
      this.timerSeconds.set(ex.duration);
      this.updateTimerProgress();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  startTimer(): void {
    this.timerRunning.set(true);
    this.timerInterval = setInterval(() => {
      const current = this.timerSeconds();
      if (current > 0) {
        this.timerSeconds.set(current - 1);
        this.updateTimerProgress();
      } else {
        this.clearTimer();
        this.timerRunning.set(false);
        this.timerComplete.emit(this.exercise().id);
      }
    }, 1000);
  }

  pauseTimer(): void {
    this.timerRunning.set(false);
    this.clearTimer();
  }

  resetTimer(): void {
    this.pauseTimer();
    const ex = this.exercise();
    if (ex.isDurationBased && ex.duration) {
      this.timerSeconds.set(ex.duration);
      this.updateTimerProgress();
    }
  }

  private updateTimerProgress(): void {
    const ex = this.exercise();
    if (ex.isDurationBased && ex.duration) {
      const progress = ((ex.duration - this.timerSeconds()) / ex.duration) * 100;
      this.timerProgress.set(progress);
    }
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onCompleteToggle(): void {
    this.completeChange.emit({
      exerciseId: this.exercise().id,
      completed: !this.isCompleted()
    });
  }

  onStartCounting(): void {
    const target = this.parseReps(this.exercise().reps);
    this.startCounting.emit({
      exerciseId: this.exercise().id,
      target: target
    });
  }

  onStopCounting(): void {
    this.stopCounting.emit();
  }

  parseReps(reps: string): number {
    // Handle reps like "10-12" by taking the higher number
    if (reps.includes('-')) {
      const parts = reps.split('-');
      return parseInt(parts[parts.length - 1]) || 10;
    }
    return parseInt(reps) || 10;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c0468?w=400&h=300&fit=crop';
  }
}
