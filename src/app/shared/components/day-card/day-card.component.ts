import { Component, input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutDay } from '../../../core/models/exercise.model';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-day-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div 
      class="card card-hover p-5 md:p-6 group relative overflow-hidden h-full flex flex-col"
      [class.glow]="isToday() && !isCompleted()"
      [class.border-green-500/50]="isCompleted()"
      [class.border-primary-500/50]="isToday() && !isCompleted()"
      [class.opacity-60]="day().isRestDay"
    >
      <!-- Gradient overlay for completed days -->
      @if (isCompleted()) {
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/10 pointer-events-none"></div>
      }
      
      <!-- Today indicator pulse -->
      @if (isToday() && !isCompleted()) {
        <div class="absolute top-3 right-3">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
        </div>
      }

      <div class="relative flex-1 flex flex-col">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <!-- Day icon -->
            <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                 [class.bg-gradient-to-br]="!day().isRestDay"
                 [class.from-primary-500/30]="!day().isRestDay && !isCompleted()"
                 [class.to-accent-500/20]="!day().isRestDay && !isCompleted()"
                 [class.from-green-500/30]="isCompleted()"
                 [class.to-emerald-500/20]="isCompleted()"
                 [class.bg-dark-700/50]="day().isRestDay">
              @if (day().isRestDay) {
                <svg class="w-6 h-6 text-dark-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              } @else if (isCompleted()) {
                <svg class="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              } @else {
                <svg class="w-6 h-6 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6.5 4.5a2 2 0 0 0-3 0l-.5.5a2 2 0 0 0 0 3l1.5 1.5"/>
                  <path d="M17.5 4.5a2 2 0 0 1 3 0l.5.5a2 2 0 0 1 0 3l-1.5 1.5"/>
                  <path d="M8 12h8"/>
                </svg>
              }
            </div>
            <div>
              <h3 class="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">{{ day().name }}</h3>
              <p class="text-sm text-dark-400">{{ day().focus }}</p>
            </div>
          </div>
        </div>

        @if (!day().isRestDay) {
          <!-- Exercise count -->
          <div class="mb-4">
            <div class="flex items-center gap-2 text-sm text-dark-400">
              <div class="w-8 h-8 rounded-lg bg-dark-700/50 flex items-center justify-center">
                <svg class="w-4 h-4 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <span class="font-medium">{{ day().exercises.length }} {{ t('dayCard.exercises') }}</span>
            </div>
          </div>

          <!-- Muscle tags -->
          <div class="flex flex-wrap gap-2 mb-5">
            @for (muscle of uniqueMuscles(); track muscle) {
              <span class="px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
                    [class]="getMuscleColor(muscle)">
                {{ muscle }}
              </span>
            }
          </div>

          <!-- Action button -->
          <a 
            [routerLink]="['/workout/day', day().id]" 
            class="btn w-full justify-center text-sm font-bold mt-auto"
            [class.btn-success]="isCompleted()"
            [class.btn-primary]="!isCompleted()"
          >
            @if (isCompleted()) {
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ t('dayCard.redoWorkout') }}
            } @else {
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {{ t('dayCard.startWorkout') }}
            }
          </a>
        } @else {
          <!-- Rest day content -->
          <div class="flex items-center gap-4 py-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-dark-300">{{ t('dayCard.restDay') }}</p>
              <p class="text-xs text-dark-500 mt-1">{{ t('dayCard.restMessage') }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class DayCardComponent {
  day = input.required<WorkoutDay>();
  isCompleted = input(false);
  isToday = input(false);

  private translationService = inject(TranslationService);

  isArabic(): boolean {
    return this.translationService.language() === 'ar';
  }

  // Computed unique muscles for better performance
  uniqueMuscles = computed(() => {
    const d = this.day();
    if (d.isRestDay) return [];
    const muscles = new Set<string>();
    d.exercises.forEach(ex => {
      if (this.isArabic()) {
        muscles.add(ex.primaryMuscleAr || ex.primaryMuscle);
      } else {
        muscles.add(ex.primaryMuscle);
      }
    });
    return Array.from(muscles).slice(0, 4);
  });

  t(key: string): string {
    return this.translationService.t(key);
  }

  getMuscleColor(muscle: string): string {
    const colors: { [key: string]: string } = {
      'Chest': 'bg-red-500/20 text-red-400 border border-red-500/30',
      'Upper Chest': 'bg-red-500/20 text-red-400 border border-red-500/30',
      'Back': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      'Lats': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      'Mid Back': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      'Shoulders': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      'Side Delts': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      'Rear Delts': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      'Biceps': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      'Triceps': 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
      'Quadriceps': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'Hamstrings': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      'Glutes': 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
      'Calves': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      'Traps': 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
    };
    return colors[muscle] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
}
