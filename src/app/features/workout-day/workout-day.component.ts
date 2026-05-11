import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../core/services/workout.service';
import { TimerService } from '../../core/services/timer.service';
import { TranslationService } from '../../core/services/translation.service';
import { ExerciseCardComponent } from '../../shared/components/exercise-card/exercise-card.component';
import { TimerComponent } from '../../shared/components/timer/timer.component';
import { Exercise, ExerciseLog, WorkoutDay } from '../../core/models/exercise.model';

@Component({
  selector: 'app-workout-day',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ExerciseCardComponent, TimerComponent],
  template: `
    <div class="min-h-screen">
      <!-- Loading State -->
      @if (loadingDays()) {
        <div class="flex items-center justify-center min-h-[60vh]">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin"></div>
            <p class="text-dark-400">{{ t('common.loading') }}</p>
          </div>
        </div>
      } @else if (workoutDay()) {
        <!-- Hero Header -->
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-dark-950 to-accent-600/10"></div>
          <div class="absolute inset-0">
            <div class="absolute top-10 left-10 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-10 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <header class="mb-8 animate-fade-in">
              <div class="flex items-center gap-4 mb-6">
                <a routerLink="/gym" class="btn btn-ghost p-3 rounded-xl">
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
                    <div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="6"/>
                        <circle cx="12" cy="12" r="2"/>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-dark-300">{{ t('workoutDay.progress') }}</span>
                  </div>
                  <span class="badge badge-primary text-sm">{{ completedExercises() }}/{{ totalExercises() }} {{ t('workoutDay.exercises') }}</span>
                </div>
                <div class="progress-bar h-4">
                  <div class="progress-fill" [style.width.%]="progress()"></div>
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
                      <div class="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
                        <svg class="w-4 h-4 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
              <div class="space-y-5">
                @for (exercise of workoutDay()?.exercises; track exercise.id; let i = $index) {
                  <app-exercise-card
                    [exercise]="exercise"
                    [exerciseLog]="getExerciseLog(exercise.id)"
                    [showInputs]="workoutStarted()"
                    [isCompleted]="isExerciseCompleted(exercise.id)"
                    (weightChange)="onWeightChange($event.exerciseId, $event.weights)"
                    (completeChange)="onExerciseComplete($event.exerciseId, $event.completed)"
                  />
                }
              </div>

              <!-- Volume Summary -->
              @if (workoutStarted()) {
                <div class="card p-6 mt-8 animate-scale-in">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/30 to-accent-500/20 flex items-center justify-center">
                        <svg class="w-6 h-6 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm text-dark-400">{{ t('workoutDay.totalVolume') }}</p>
                        <p class="text-2xl font-bold text-primary-400">{{ currentVolume() | number }} kg</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-dark-400">{{ t('workoutDay.completed') }}</p>
                      <p class="text-2xl font-bold text-white">{{ completedExercises() }}/{{ totalExercises() }}</p>
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
            <a routerLink="/gym" class="btn btn-primary">{{ t('workoutDay.backToDashboard') }}</a>
          </div>
        </div>
      }
    </div>
  `
})
export class WorkoutDayComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workoutService = inject(WorkoutService);
  private timerService = inject(TimerService);
  private translationService = inject(TranslationService);

  workoutDay = signal<WorkoutDay | undefined>(undefined);
  workoutStarted = signal(false);
  showTimer = signal(false);
  currentExercise = signal<Exercise | undefined>(undefined);
  currentRestTime = signal(90);
  exerciseLogs = signal<Map<number, ExerciseLog>>(new Map());
  loadingDays = this.workoutService.loadingDays;

  private readonly dayTranslations: Record<number, { nameAr: string; focusAr: string }> = {
    1: { nameAr: 'اليوم 1', focusAr: 'صدر + ترايسيبس (تركيز ثقيل)' },
    2: { nameAr: 'اليوم 2', focusAr: 'ظهر + بايسيبس' },
    3: { nameAr: 'اليوم 3', focusAr: 'راحة / كارديو خفيف' },
    4: { nameAr: 'اليوم 4', focusAr: 'أرجل (تركيز على الفخذ الأمامي)' },
    5: { nameAr: 'اليوم 5', focusAr: 'أكتاف + كتف خلفي' },
    6: { nameAr: 'اليوم 6', focusAr: 'أرجل (تركيز على الفخذ الخلفي)' },
    7: { nameAr: 'اليوم 7', focusAr: 'راحة / كارديو خفيف' }
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

  currentVolume = computed(() => {
    let volume = 0;
    const day = this.workoutDay();
    if (!day) return 0;
    
    this.exerciseLogs().forEach((log, exerciseId) => {
      const exercise = day.exercises.find(e => e.id === exerciseId);
      if (exercise && log.weights.length > 0) {
        const avgReps = this.parseReps(exercise.reps);
        volume += log.weights.reduce((sum, w) => sum + (w * avgReps), 0);
      }
    });
    return volume;
  });

  canComplete = computed(() => this.completedExercises() > 0);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.workoutDay.set(this.workoutService.getWorkoutDay(id));
  }

  startWorkout(): void {
    const day = this.workoutDay();
    if (day) {
      this.workoutService.startWorkout(day.id);
      this.workoutStarted.set(true);
      
      // Initialize exercise logs
      const logs = new Map<number, ExerciseLog>();
      day.exercises.forEach(ex => {
        logs.set(ex.id, {
          exerciseId: ex.id,
          completed: false,
          weights: new Array(ex.sets).fill(0),
          completedSets: 0
        });
      });
      this.exerciseLogs.set(logs);
    }
  }

  completeWorkout(): void {
    this.workoutService.completeWorkout();
    this.router.navigate(['/gym']);
  }

  cancelWorkout(): void {
    this.workoutService.cancelWorkout();
    this.workoutStarted.set(false);
    this.exerciseLogs.set(new Map());
  }

  getExerciseLog(exerciseId: number): ExerciseLog | null {
    return this.exerciseLogs().get(exerciseId) || null;
  }

  isExerciseCompleted(exerciseId: number): boolean {
    return this.exerciseLogs().get(exerciseId)?.completed || false;
  }

  onWeightChange(exerciseId: number, weights: number[]): void {
    const logs = this.exerciseLogs();
    const log = logs.get(exerciseId);
    if (log) {
      log.weights = weights;
      logs.set(exerciseId, { ...log });
      this.exerciseLogs.set(new Map(logs));
    }
  }

  onExerciseComplete(exerciseId: number, completed: boolean): void {
    const logs = this.exerciseLogs();
    const log = logs.get(exerciseId);
    const day = this.workoutDay();
    
    if (log && day) {
      log.completed = completed;
      log.completedSets = completed ? log.weights.filter(w => w > 0).length : 0;
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

  private parseReps(reps: string): number {
    if (reps.includes('-')) {
      const parts = reps.split('-');
      return (parseInt(parts[0]) + parseInt(parts[1])) / 2;
    }
    if (reps.includes(' each')) {
      return parseInt(reps.replace(' each leg', '').replace(' each', ''));
    }
    return parseInt(reps) || 0;
  }

  private parseRestTime(rest: string): number {
    if (rest.includes('min')) {
      const mins = parseInt(rest.replace('min', '').replace('-', ''));
      return mins * 60;
    }
    if (rest.includes('sec')) {
      return parseInt(rest.replace('sec', ''));
    }
    return 90;
  }
}
