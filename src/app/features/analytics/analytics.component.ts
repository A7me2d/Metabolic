import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { WorkoutService } from '../../core/services/workout.service';
import { StorageService } from '../../core/services/storage.service';
import { TranslationService } from '../../core/services/translation.service';
import { WorkoutLog, UserStats } from '../../core/models/exercise.model';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="min-h-screen">
      <!-- Loading State -->
      @if (loading()) {
        <div class="flex items-center justify-center min-h-[60vh]">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin"></div>
            <p class="text-dark-400">{{ t('common.loading') }}</p>
          </div>
        </div>
      } @else {
      <!-- Hero Header -->
      <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-dark-950 to-accent-600/10"></div>
        <div class="absolute inset-0">
          <div class="absolute top-10 left-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 right-20 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <header class="mb-10 animate-fade-in">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div>
                <h1 class="text-4xl md:text-5xl font-black text-gradient">{{ t('analytics.title') }}</h1>
                <p class="text-lg text-dark-400 mt-1">{{ t('analytics.subtitle') }}</p>
              </div>
            </div>
          </header>

          <!-- Stats Overview -->
          <section class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 animate-slide-up">
            <!-- Total Workouts -->
            <div class="card p-5 md:p-6 group">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/30 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-white">{{ stats().totalWorkouts }}</div>
              <div class="text-sm text-dark-400 mt-1">{{ t('analytics.totalWorkouts') }}</div>
            </div>

            <!-- Volume Lifted -->
            <div class="card p-5 md:p-6 group">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-white">{{ stats().totalVolume | number }}</div>
              <div class="text-sm text-dark-400 mt-1">{{ t('analytics.kgLifted') }}</div>
            </div>

            <!-- Total Sets -->
            <div class="card p-5 md:p-6 group">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </div>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-white">{{ stats().totalSets }}</div>
              <div class="text-sm text-dark-400 mt-1">{{ t('analytics.totalSets') }}</div>
            </div>

            <!-- Streak -->
            <div class="card p-5 md:p-6 group">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/30 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2c0 5-4 7-4 12a4 4 0 0 0 8 0c0-5-4-7-4-12z"/>
                    <path d="M12 22a2 2 0 0 0 2-2c0-1.5-2-2-2-4 0 0-2 2.5-2 4a2 2 0 0 0 2 2z"/>
                  </svg>
                </div>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-white">{{ stats().streak }}</div>
              <div class="text-sm text-dark-400 mt-1">{{ t('analytics.dayStreak') }}</div>
            </div>
          </section>

          <!-- Weekly Progress Chart -->
          <section class="card p-6 md:p-8 mb-10 animate-scale-in">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">{{ t('analytics.weeklyVolume') }}</h2>
            </div>
            
            <div class="h-72 flex items-end gap-3 md:gap-4 px-4">
              @for (week of weeklyData(); track week.label) {
                <div class="flex-1 flex flex-col items-center group">
                  <div class="w-full relative">
                    <div 
                      class="w-full rounded-t-xl transition-all duration-500 group-hover:opacity-80"
                      [style.height.px]="getBarHeight(week.volume)"
                      style="background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 50%, #f97316 100%); min-height: 4px;"
                    ></div>
                    @if (week.volume > 0) {
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-white whitespace-nowrap">
                        {{ week.volume | number }}kg
                      </div>
                    }
                  </div>
                  <span class="text-sm text-dark-400 mt-3 font-medium">{{ week.label }}</span>
                  <span class="text-xs text-dark-500">{{ week.volume | number }}kg</span>
                </div>
              }
            </div>
          </section>

          <!-- Personal Records -->
          <section class="card p-6 md:p-8 mb-10 animate-slide-up">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">{{ t('analytics.personalRecords') }}</h2>
            </div>
            
            @if (Object.keys(stats().personalRecords).length > 0) {
              <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                @for (entry of Object.entries(stats().personalRecords); track entry[0]) {
                  <div class="card p-5 flex items-center justify-between group hover:border-primary-500/50 transition-colors">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/30 to-orange-500/20 flex items-center justify-center">
                        <svg class="w-5 h-5 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                          <circle cx="12" cy="12" r="6"/>
                          <circle cx="12" cy="12" r="2"/>
                        </svg>
                      </div>
                      <div>
                        <div class="font-semibold text-white">{{ entry[0] }}</div>
                        <div class="text-xs text-dark-400">{{ t('analytics.maxWeight') }}</div>
                      </div>
                    </div>
                    <div class="text-2xl font-bold text-accent-400">{{ entry[1] }}kg</div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-12">
                <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-700/50 flex items-center justify-center">
                  <svg class="w-8 h-8 text-dark-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                    <path d="M4 22h16"/>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                  </svg>
                </div>
                <p class="text-dark-400">{{ t('analytics.completeWorkoutsPR') }}</p>
              </div>
            }
          </section>

          <!-- Workout History -->
          <section class="card p-6 md:p-8 animate-slide-up">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">{{ t('analytics.recentWorkouts') }}</h2>
            </div>
            
            @if (workoutHistory().length > 0) {
              <div class="space-y-4">
                @for (log of workoutHistory(); track log.id) {
                  <div class="card p-5 flex items-center justify-between group hover:border-primary-500/50 transition-colors">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/30 to-blue-500/20 flex items-center justify-center">
                        <svg class="w-6 h-6 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M6.5 4.5a2 2 0 0 0-3 0l-.5.5a2 2 0 0 0 0 3l1.5 1.5"/>
                          <path d="M17.5 4.5a2 2 0 0 1 3 0l.5.5a2 2 0 0 1 0 3l-1.5 1.5"/>
                          <path d="M8 12h8"/>
                        </svg>
                      </div>
                      <div>
                        <div class="font-semibold text-white">{{ getDayName(log.dayId) }}</div>
                        <div class="text-sm text-dark-400">{{ log.date }}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-xl font-bold text-primary-400">{{ log.totalVolume | number }}kg</div>
                      <div class="text-sm text-dark-400">{{ log.exerciseLogs.length }} {{ t('analytics.exercises') }}</div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-12">
                <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-700/50 flex items-center justify-center">
                  <svg class="w-8 h-8 text-dark-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <p class="text-dark-400">{{ t('analytics.noWorkoutHistory') }}</p>
              </div>
            }
          </section>
        </div>
      </div>
      }
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  private workoutService = inject(WorkoutService);
  private storageService = inject(StorageService);
  private translationService = inject(TranslationService);

  workoutHistory = signal<WorkoutLog[]>([]);
  loading = this.workoutService.loading;
  
  Object = Object;

  // Provide default values for null safety
  stats = computed(() => this.workoutService.userStats() || this.defaultStats());

  private defaultStats(): UserStats {
    return {
      totalWorkouts: 0,
      totalVolume: 0,
      totalSets: 0,
      totalReps: 0,
      personalRecords: {},
      personalRecordsCount: 0,
      streak: 0,
      lastWorkoutDate: null
    };
  }

  t(key: string): string {
    return this.translationService.t(key);
  }

  weeklyData = signal<{ label: string; volume: number }[]>([
    { label: 'W1', volume: 0 },
    { label: 'W2', volume: 0 },
    { label: 'W3', volume: 0 },
    { label: 'W4', volume: 0 }
  ]);

  maxVolume = computed(() => Math.max(...this.weeklyData().map(w => w.volume), 1));

  ngOnInit(): void {
    this.loadWorkoutHistory();
    this.calculateWeeklyData();
  }

  private loadWorkoutHistory(): void {
    const logs = this.storageService.getWorkoutLogs();
    this.workoutHistory.set(logs.slice(-10).reverse());
  }

  private calculateWeeklyData(): void {
    const logs = this.storageService.getWorkoutLogs();
    const now = new Date();
    const weeks: { label: string; volume: number }[] = [];

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + now.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      weeks.push({
        label: `W${4 - i}`,
        volume: weekLogs.reduce((sum, log) => sum + log.totalVolume, 0)
      });
    }

    this.weeklyData.set(weeks);
  }

  getBarHeight(volume: number): number {
    const max = this.maxVolume();
    if (max === 0) return 4;
    return Math.max((volume / max) * 200, 4);
  }

  getDayName(dayId: number): string {
    const days = ['', 'Chest + Triceps', 'Back + Biceps', 'Rest', 'Legs (Quad)', 'Shoulders', 'Legs (Hamstring)', 'Rest'];
    return days[dayId] || 'Unknown';
  }
}
