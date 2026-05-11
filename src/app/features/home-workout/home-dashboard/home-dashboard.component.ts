import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeWorkoutService } from '../../../core/services/home-workout.service';
import { TranslationService } from '../../../core/services/translation.service';
import { HomeDayCardComponent } from './home-day-card.component';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HomeDayCardComponent],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-green-600/20 via-dark-950 to-emerald-600/20 animate-pulse"></div>
        <div class="absolute inset-0">
          <div class="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <header class="mb-10 animate-fade-in">
            <div class="flex items-center gap-4 mb-4">
              <a routerLink="/gym" class="btn btn-ghost p-3 rounded-xl">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </a>
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-glow">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <h1 class="text-4xl md:text-5xl font-black text-gradient">{{ t('homeWorkout.title') }}</h1>
                <p class="text-lg text-dark-400 mt-1">{{ t('homeWorkout.subtitle') }}</p>
              </div>
            </div>
          </header>

          <!-- Difficulty Mode Selector -->
          <section class="card mb-8 animate-slide-up">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-white">{{ t('homeWorkout.difficulty') }}</h2>
                </div>
              </div>
              
              <div class="grid grid-cols-3 gap-3">
                @for (mode of difficultyModes; track mode.value) {
                  <button 
                    class="btn flex flex-col items-center gap-1 py-3"
                    [class.btn-primary]="difficultyMode() === mode.value"
                    [class.btn-ghost]="difficultyMode() !== mode.value"
                    (click)="setDifficultyMode(mode.value)">
                    <span class="text-sm font-bold">{{ mode.label }}</span>
                    <span class="text-xs text-dark-400">{{ mode.description }}</span>
                  </button>
                }
              </div>
            </div>
          </section>

          <!-- Stats Grid -->
          <section class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 animate-slide-up">
            <!-- Streak Card -->
            <div class="stat-card group">
              <div class="stat-icon bg-gradient-to-br from-orange-500/30 to-red-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2c0 5-4 7-4 12a4 4 0 0 0 8 0c0-5-4-7-4-12z"/>
                  <path d="M12 22a2 2 0 0 0 2-2c0-1.5-2-2-2-4 0 0-2 2.5-2 4a2 2 0 0 0 2 2z"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value text-orange-400">{{ streak() }}</span>
                <span class="stat-label">{{ t('dashboard.streak') }}</span>
              </div>
            </div>

            <!-- Workouts Card -->
            <div class="stat-card group">
              <div class="stat-icon bg-gradient-to-br from-green-500/30 to-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value text-green-400">{{ totalWorkouts() }}</span>
                <span class="stat-label">{{ t('dashboard.workouts') }}</span>
              </div>
            </div>

            <!-- Completed Days Card -->
            <div class="stat-card group col-span-2 md:col-span-1">
              <div class="stat-icon bg-gradient-to-br from-primary-500/30 to-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value text-primary-400">{{ completedDays().length }}/5</span>
                <span class="stat-label">{{ t('homeWorkout.daysCompleted') }}</span>
              </div>
            </div>
          </section>

          <!-- Weekly Program Section -->
          <section class="card animate-scale-in">
            <div class="p-6 md:p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-white">{{ t('homeWorkout.weeklyProgram') }}</h2>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
                @for (day of workoutDays(); track day.id) {
                  <app-home-day-card
                    [day]="day"
                    [isCompleted]="completedDays().includes(day.id)"
                    [isToday]="todayWorkout()?.id === day.id"
                  />
                }
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-content {
      display: flex;
      flex-direction: column;
    }
  `]
})
export class HomeDashboardComponent {
  private homeWorkoutService = inject(HomeWorkoutService);
  private translationService = inject(TranslationService);
  
  workoutDays = this.homeWorkoutService.getAllWorkoutDays.bind(this.homeWorkoutService);
  todayWorkout = this.homeWorkoutService.todayWorkout;
  streak = this.homeWorkoutService.streak;
  totalWorkouts = this.homeWorkoutService.totalWorkouts;
  completedDays = this.homeWorkoutService.completedDays;
  difficultyMode = this.homeWorkoutService.difficultyMode;

  difficultyModes = [
    { value: 'Beginner' as const, label: this.t('homeWorkout.beginner'), description: this.t('homeWorkout.beginnerDesc') },
    { value: 'Intermediate' as const, label: this.t('homeWorkout.intermediate'), description: this.t('homeWorkout.intermediateDesc') },
    { value: 'Advanced' as const, label: this.t('homeWorkout.advanced'), description: this.t('homeWorkout.advancedDesc') }
  ];

  t(key: string): string {
    return this.translationService.t(key);
  }

  async setDifficultyMode(mode: 'Beginner' | 'Intermediate' | 'Advanced'): Promise<void> {
    await this.homeWorkoutService.setDifficultyMode(mode);
    // Update labels for the buttons
    this.difficultyModes = [
      { value: 'Beginner' as const, label: this.t('homeWorkout.beginner'), description: this.t('homeWorkout.beginnerDesc') },
      { value: 'Intermediate' as const, label: this.t('homeWorkout.intermediate'), description: this.t('homeWorkout.intermediateDesc') },
      { value: 'Advanced' as const, label: this.t('homeWorkout.advanced'), description: this.t('homeWorkout.advancedDesc') }
    ];
  }
}
