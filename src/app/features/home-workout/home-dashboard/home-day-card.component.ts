import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeWorkoutDay } from '../../../core/models/home-workout.model';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-home-day-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card group hover:border-green-500/50 transition-all duration-300 cursor-pointer h-full flex flex-col relative">
      <a [routerLink]="['/home-workout/day', day().id]" class="block p-5 flex-1 flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300"
                 [class.bg-green-500/20]="!day().isRestDay"
                 [class.text-green-400]="!day().isRestDay"
                 [class.bg-purple-500/20]="day().isRestDay"
                 [class.text-purple-400]="day().isRestDay"
                 [class.ring-2]="isToday()"
                 [class.ring-green-400]="isToday()">
              @if (day().isRestDay) {
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              } @else {
                {{ day().id }}
              }
            </div>
            <div>
              <h3 class="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{{ getDayName() }}</h3>
              <p class="text-sm text-dark-400">{{ getDayFocus() }}</p>
            </div>
          </div>
          @if (isCompleted()) {
            <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          }
        </div>

        @if (!day().isRestDay) {
          <!-- Exercise count -->
          <div class="mb-4">
            <div class="flex items-center gap-2 text-sm text-dark-400">
              <div class="w-8 h-8 rounded-lg bg-dark-700/50 flex items-center justify-center">
                <svg class="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <div class="btn w-full justify-center text-sm font-bold mt-auto"
               [class.btn-success]="isCompleted()"
               [class.btn-primary]="!isCompleted()">
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
          </div>
        } @else {
          <!-- Rest Day Content -->
          <div class="card p-4 text-center bg-purple-500/10 border-purple-500/20">
            <svg class="w-8 h-8 mx-auto mb-2 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <p class="text-sm text-purple-300">{{ t('dayCard.restDay') }}</p>
          </div>
        }

        @if (isToday()) {
          <div class="absolute top-2 right-2">
            <span class="badge badge-success text-xs">{{ t('dayCard.today') }}</span>
          </div>
        }
      </a>
    </div>
  `
})
export class HomeDayCardComponent {
  day = input.required<HomeWorkoutDay>();
  isCompleted = input(false);
  isToday = input(false);

  private translationService = inject(TranslationService);

  uniqueMuscles = computed(() => {
    const muscles = new Set<string>();
    const d = this.day();
    if (!d.isRestDay) {
      d.exercises.forEach(ex => {
        muscles.add(this.isArabic() ? (ex.primaryMuscleAr || ex.primaryMuscle) : ex.primaryMuscle);
      });
    }
    return Array.from(muscles);
  });

  t(key: string): string {
    return this.translationService.t(key);
  }

  isArabic(): boolean {
    return this.translationService.language() === 'ar';
  }

  getDayName(): string {
    const d = this.day();
    return this.isArabic() ? (d.nameAr || d.name) : d.name;
  }

  getDayFocus(): string {
    const d = this.day();
    return this.isArabic() ? (d.focusAr || d.focus) : d.focus;
  }

  getMuscleColor(muscle: string): string {
    const colors: { [key: string]: string } = {
      'Chest': 'bg-red-500/20 text-red-400 border border-red-500/30',
      'Core': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      'Quadriceps': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'Legs': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'Back': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      'Arms': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      'Triceps': 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
      'Full Body': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      'Lower Abs': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      'Obliques': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      'Lower Back': 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
      'Upper Chest': 'bg-red-500/20 text-red-400 border border-red-500/30',
      'Hip Flexors': 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
      'Calves': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      'صدر': 'bg-red-500/20 text-red-400 border border-red-500/30',
      'عضلات البطن': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      'أرجل': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'ظهر': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      'ذراعين': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      'كامل الجسم': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      'أسفل البطن': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      'أسفل الظهر': 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
    };
    return colors[muscle] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
}
