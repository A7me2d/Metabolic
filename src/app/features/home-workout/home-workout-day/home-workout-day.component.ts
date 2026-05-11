import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HomeWorkoutService } from '../../../core/services/home-workout.service';
import { TranslationService } from '../../../core/services/translation.service';
import { TimerService } from '../../../core/services/timer.service';
import { AudioService } from '../../../core/services/audio.service';
import { HomeExerciseCardComponent } from '../../../shared/components/home-exercise-card/home-exercise-card.component';
import { TimerComponent } from '../../../shared/components/timer/timer.component';
import { HomeWorkoutDay, HomeExercise, HomeExerciseLog } from '../../../core/models/home-workout.model';

@Component({
  selector: 'app-home-workout-day',
  standalone: true,
  imports: [CommonModule, RouterLink, HomeExerciseCardComponent, TimerComponent],
  template: `
    <div class="min-h-screen">
      @if (workoutDay()) {
        <!-- Hero Header -->
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-green-600/20 via-dark-950 to-emerald-600/10"></div>
          <div class="absolute inset-0">
            <div class="absolute top-10 left-10 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <header class="mb-8 animate-fade-in">
              <div class="flex items-center gap-4 mb-6">
                <a routerLink="/home-workout" class="btn btn-ghost p-3 rounded-xl">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </a>
                <div class="flex-1">
                  <h1 class="text-3xl md:text-4xl font-black text-gradient">{{ getDayName() }}</h1>
                  <p class="text-lg text-dark-400 mt-1">{{ getDayFocus() }}</p>
                </div>
              </div>

              <!-- Progress Card -->
              <div class="card p-5 md:p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="6"/>
                        <circle cx="12" cy="12" r="2"/>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-dark-300">{{ t('workoutDay.progress') }}</span>
                  </div>
                  <span class="badge badge-success text-sm">{{ completedExercises() }}/{{ totalExercises() }} {{ t('workoutDay.exercises') }}</span>
                </div>
                <div class="progress-bar h-4">
                  <div class="progress-fill bg-gradient-to-r from-green-500 to-emerald-500" [style.width.%]="progress()"></div>
                </div>
              </div>
            </header>

            <!-- Rest Day -->
            @if (workoutDay()?.isRestDay) {
              <div class="card p-8 md:p-12 text-center animate-scale-in">
                <div class="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/20 flex items-center justify-center">
                  <svg class="w-12 h-12 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                </div>
                <h2 class="text-3xl font-bold text-white mb-3">{{ t('workoutDay.restDay') }}</h2>
                <p class="text-lg text-dark-400 mb-8 max-w-md mx-auto">{{ t('dayCard.restMessage') }}</p>
                
                <div class="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <div class="card p-5 text-left">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <svg class="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                      </div>
                      <span class="font-semibold text-white">{{ t('workoutDay.sleep') }}</span>
                    </div>
                    <p class="text-sm text-dark-400">{{ t('workoutDay.sleepTip') }}</p>
                  </div>
                  <div class="card p-5 text-left">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        </svg>
                      </div>
                      <span class="font-semibold text-white">{{ t('workoutDay.hydrate') }}</span>
                    </div>
                    <p class="text-sm text-dark-400">{{ t('workoutDay.hydrateTip') }}</p>
                  </div>
                  <div class="card p-5 text-left">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                      </div>
                      <span class="font-semibold text-white">{{ t('workoutDay.stretch') }}</span>
                    </div>
                    <p class="text-sm text-dark-400">{{ t('workoutDay.stretchTip') }}</p>
                  </div>
                  <div class="card p-5 text-left">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                        </svg>
                      </div>
                      <span class="font-semibold text-white">{{ t('workoutDay.nutrition') }}</span>
                    </div>
                    <p class="text-sm text-dark-400">{{ t('workoutDay.nutritionTip') }}</p>
                  </div>
                </div>
              </div>
            } @else {
              <!-- Workout Controls -->
              <div class="flex flex-wrap gap-4 mb-8 animate-slide-up">
                @if (!workoutStarted()) {
                  <button class="btn btn-primary text-base font-bold px-8 py-3" (click)="startWorkout()">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    {{ t('workoutDay.startWorkoutBtn') }}
                  </button>
                } @else {
                  <button class="btn btn-success text-base font-bold px-6 py-3" (click)="completeWorkout()" [disabled]="!canComplete()">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {{ t('workoutDay.completeWorkoutBtn') }}
                  </button>
                  <button class="btn btn-danger text-base font-bold px-6 py-3" (click)="cancelWorkout()">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    {{ t('workoutDay.cancelBtn') }}
                  </button>
                }
              </div>

              <!-- Timer -->
              @if (showTimer()) {
                <div class="mb-8 animate-slide-down">
                  <app-timer 
                    [duration]="currentRestTime()" 
                    [label]="getRestLabel()"
                    (timerComplete)="onTimerComplete()"
                  />
                </div>
              }

              <!-- Exercise List -->
              <div class="grid grid-cols-1 gap-4">
                @for (exercise of workoutDay()?.exercises; track exercise.id; let i = $index) {
                  <app-home-exercise-card
                    [exercise]="exercise"
                    [showInputs]="workoutStarted()"
                    [showTimer]="workoutStarted() && exercise.isDurationBased"
                    [isCompleted]="isExerciseCompleted(exercise.id)"
                    [isCounting]="isExerciseCounting(exercise.id)"
                    [countDown]="countDown()"
                    [currentCount]="currentCount()"
                    [targetCount]="targetCount()"
                    (completeChange)="onExerciseComplete($event.exerciseId, $event.completed)"
                    (startCounting)="startCounting($event.exerciseId, $event.target)"
                    (stopCounting)="stopCounting()"
                  />
                }
              </div>

              <!-- Summary -->
              @if (workoutStarted()) {
                <div class="card p-6 mt-8 animate-scale-in">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/20 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm text-dark-400">{{ t('homeWorkout.workoutProgress') }}</p>
                        <p class="text-2xl font-bold text-green-400">{{ completedExercises() }}/{{ totalExercises() }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-dark-400">{{ t('workoutDay.completed') }}</p>
                      <p class="text-2xl font-bold text-white">{{ Math.round(progress()) }}%</p>
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      } @else {
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="card p-8 md:p-12 text-center animate-scale-in">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <svg class="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-3">{{ t('workoutDay.notFoundTitle') }}</h2>
            <p class="text-dark-400 mb-6">{{ t('workoutDay.notFoundDesc') }}</p>
            <a routerLink="/home-workout" class="btn btn-primary">{{ t('homeWorkout.backToHome') }}</a>
          </div>
        </div>
      }
    </div>
  `
})
export class HomeWorkoutDayComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private homeWorkoutService = inject(HomeWorkoutService);
  private timerService = inject(TimerService);
  private translationService = inject(TranslationService);
  private audioService = inject(AudioService);

  workoutDay = signal<HomeWorkoutDay | undefined>(undefined);
  workoutStarted = signal(false);
  showTimer = signal(false);
  currentExercise = signal<HomeExercise | undefined>(undefined);
  currentRestTime = signal(60);
  exerciseLogs = signal<Map<number, HomeExerciseLog>>(new Map());

  // Counting state
  isCounting = signal(false);
  countDown = signal(0); // 3, 2, 1 countdown before counting starts
  currentCount = signal(0);
  targetCount = signal(10); // default count target
  countingExerciseId = signal<number | null>(null);

  Math = Math;

  private readonly dayTranslations: Record<number, { nameAr: string; focusAr: string }> = {
    1: { nameAr: 'اليوم 1', focusAr: 'صدر + عضلات البطن' },
    2: { nameAr: 'اليوم 2', focusAr: 'أرجل' },
    3: { nameAr: 'اليوم 3', focusAr: 'راحة / كارديو خفيف' },
    4: { nameAr: 'اليوم 4', focusAr: 'ظهر + ذراعين' },
    5: { nameAr: 'اليوم 5', focusAr: 'كامل الجسم HIIT' },
    6: { nameAr: 'اليوم 6', focusAr: 'تركيز على البطن' },
    7: { nameAr: 'اليوم 7', focusAr: 'راحة' }
  };

  t(key: string): string {
    return this.translationService.t(key);
  }

  isArabic(): boolean {
    return this.translationService.language() === 'ar';
  }

  getDayName(): string {
    const day = this.workoutDay();
    if (!day) return '';
    if (!this.isArabic()) return day.name;
    return this.dayTranslations[day.id]?.nameAr || day.name;
  }

  getDayFocus(): string {
    const day = this.workoutDay();
    if (!day) return '';
    if (!this.isArabic()) return day.focus;
    return this.dayTranslations[day.id]?.focusAr || day.focus;
  }

  getRestLabel(): string {
    const ex = this.currentExercise();
    const restText = this.t('workoutDay.rest');
    if (!ex) return restText;
    const exName = this.isArabic() ? (ex.nameAr || ex.name) : ex.name;
    return `${restText}: ${exName}`;
  }

  totalExercises = computed(() => this.workoutDay()?.exercises.length || 0);
  
  completedExercises = computed(() => {
    let count = 0;
    this.exerciseLogs().forEach(log => {
      if (log.completed) count++;
    });
    return count;
  });

  progress = computed(() => {
    const total = this.totalExercises();
    if (total === 0) return 0;
    return (this.completedExercises() / total) * 100;
  });

  canComplete = computed(() => this.completedExercises() > 0);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.workoutDay.set(this.homeWorkoutService.getWorkoutDay(id));
  }

  startWorkout(): void {
    const day = this.workoutDay();
    if (day) {
      this.homeWorkoutService.startWorkout(day.id);
      this.workoutStarted.set(true);
      
      // Initialize exercise logs
      const logs = new Map<number, HomeExerciseLog>();
      day.exercises.forEach(ex => {
        logs.set(ex.id, {
          exerciseId: ex.id,
          completed: false,
          completedSets: 0
        });
      });
      this.exerciseLogs.set(logs);
    }
  }

  async completeWorkout(): Promise<void> {
    const result = await this.homeWorkoutService.completeWorkout();
    if (result.success) {
      this.router.navigate(['/home-workout']);
    }
  }

  cancelWorkout(): void {
    this.homeWorkoutService.cancelWorkout();
    this.workoutStarted.set(false);
    this.exerciseLogs.set(new Map());
  }

  isExerciseCompleted(exerciseId: number): boolean {
    return this.exerciseLogs().get(exerciseId)?.completed || false;
  }

  onExerciseComplete(exerciseId: number, completed: boolean): void {
    const logs = this.exerciseLogs();
    const log = logs.get(exerciseId);
    const day = this.workoutDay();
    
    if (log && day) {
      log.completed = completed;
      log.completedSets = completed ? 1 : 0;
      logs.set(exerciseId, { ...log });
      this.exerciseLogs.set(new Map(logs));
      
      // Start rest timer if exercise completed
      if (completed) {
        const exercise = day.exercises.find(e => e.id === exerciseId);
        if (exercise) {
          this.currentExercise.set(exercise);
          this.currentRestTime.set(this.parseRestTime(exercise.rest));
          this.showTimer.set(true);
        }
      }
    }
  }

  onTimerComplete(): void {
    this.showTimer.set(false);
    this.currentExercise.set(undefined);
  }

  private parseRestTime(rest: string): number {
    if (rest.includes('min')) {
      const mins = parseInt(rest.replace('min', '').replace('-', ''));
      return mins * 60;
    }
    if (rest.includes('sec')) {
      return parseInt(rest.replace('sec', ''));
    }
    return 60;
  }

  parseReps(reps: string): number {
    // Handle reps like "10-12" by taking the higher number
    if (reps.includes('-')) {
      const parts = reps.split('-');
      return parseInt(parts[parts.length - 1]) || 10;
    }
    return parseInt(reps) || 10;
  }

  // ==================== COUNTING METHODS ====================

  /**
   * Start counting with 3 second delay
   * @param exerciseId - The exercise to count for
   * @param target - The target count (e.g., reps count)
   */
  startCounting(exerciseId: number, target: number): void {
    this.countingExerciseId.set(exerciseId);
    this.targetCount.set(target);
    this.currentCount.set(0);
    this.countDown.set(3);
    this.isCounting.set(true);

    // Start 3 second countdown
    this.audioService.speakReady();
    this.startCountdown();
  }

  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  private countingInterval: ReturnType<typeof setInterval> | null = null;

  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      const current = this.countDown();
      if (current > 1) {
        this.countDown.set(current - 1);
        this.audioService.speakNumber(current - 1);
      } else {
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
          this.countdownInterval = null;
        }
        this.countDown.set(0);
        // Start the actual counting
        this.executeCounting();
      }
    }, 1000);
  }

  private executeCounting(): void {
    const target = this.targetCount();
    let count = 0;

    const countStep = async () => {
      count++;
      this.currentCount.set(count);
      await this.audioService.speakNumber(count);

      if (count >= target) {
        // Wait a moment then speak complete
        await this.audioService.speakComplete();
        this.isCounting.set(false);
        this.countingExerciseId.set(null);
      } else {
        // Continue counting after audio finishes
        this.countingInterval = setTimeout(countStep, 500);
      }
    };

    // Start counting
    countStep();
  }

  /**
   * Stop counting
   */
  stopCounting(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.countingInterval) {
      clearTimeout(this.countingInterval as unknown as number);
      this.countingInterval = null;
    }
    this.isCounting.set(false);
    this.countDown.set(0);
    this.currentCount.set(0);
    this.countingExerciseId.set(null);
    this.audioService.stop();
  }

  /**
   * Check if an exercise is currently being counted
   */
  isExerciseCounting(exerciseId: number): boolean {
    return this.countingExerciseId() === exerciseId;
  }
}
