import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HomeWorkoutService } from '../../../core/services/home-workout.service';
import { TranslationService } from '../../../core/services/translation.service';
import { HomeExercise } from '../../../core/models/home-workout.model';
import { ImageViewerComponent } from '../../../shared/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-home-exercise-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageViewerComponent],
  template: `
    <div class="min-h-screen">
      @if (exercise()) {
        <!-- Hero Section with Full-Width Image -->
        <div class="relative h-72 md:h-96 overflow-hidden">
          <img 
            [src]="exercise()?.imageUrl" 
            [alt]="exercise()?.name"
            class="w-full h-full object-cover cursor-pointer"
            (error)="onImageError($event)"
            (click)="showImagePreview.set(true)"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent"></div>
          <div class="absolute inset-0">
            <div class="absolute top-10 left-10 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <!-- Back button -->
          <div class="absolute top-4 left-4 z-10">
            <a routerLink="/home-workout" class="btn btn-ghost bg-dark-900/50 backdrop-blur-sm border border-dark-700/50">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              {{ t('common.back') }}
            </a>
          </div>
          
          <!-- Title overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <h1 class="text-4xl md:text-5xl font-black text-white mb-4">{{ getName() }}</h1>
            <div class="flex flex-wrap gap-3">
              <span class="px-4 py-2 rounded-xl text-sm font-semibold border" [class]="getMuscleColor(exercise()?.primaryMuscle || '')">
                {{ getPrimaryMuscle() }}
              </span>
              <span class="badge badge-warning px-4 py-2">{{ exercise()?.difficulty }}</span>
              <span class="badge badge-success px-4 py-2">{{ getEquipment() }}</span>
            </div>
          </div>
        </div>

        <!-- Image Viewer Modal -->
        <app-image-viewer
          [imageUrl]="exercise()?.imageUrl || ''"
          [imageAlt]="getName()"
          [(isOpen)]="showImagePreview"
        />

        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 animate-slide-up">
            <div class="card p-5 md:p-6 text-center group">
              <div class="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-white">{{ exercise()?.sets }}</div>
              <div class="text-sm text-dark-400 mt-1">{{ t('exerciseCard.sets') }}</div>
            </div>
            
            <div class="card p-5 md:p-6 text-center group">
              <div class="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-emerald-500/30 to-green-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                @if (exercise()?.isDurationBased) {
                  <svg class="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                } @else {
                  <svg class="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                }
              </div>
              <div class="text-3xl md:text-4xl font-bold text-white">{{ exercise()?.reps }}</div>
              <div class="text-sm text-dark-400 mt-1">{{ exercise()?.isDurationBased ? t('homeWorkout.duration') : t('exerciseCard.reps') }}</div>
            </div>
            
            <div class="card p-5 md:p-6 text-center group">
              <div class="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-teal-500/30 to-cyan-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-white">{{ exercise()?.rest }}</div>
              <div class="text-sm text-dark-400 mt-1">{{ t('exerciseCard.rest') }}</div>
            </div>
            
            <div class="card p-5 md:p-6 text-center group">
              <div class="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-amber-500/30 to-yellow-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L12 3a9 9 0 0 0 15 10.42l-1.76-1.76"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-white">{{ exercise()?.secondaryMuscle?.length || 0 }}</div>
              <div class="text-sm text-dark-400 mt-1">{{ t('exerciseDetails.secondary') }}</div>
            </div>
          </div>

          <!-- Description -->
          <section class="card p-6 md:p-8 mb-8 animate-fade-in">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">{{ t('exerciseDetails.description') }}</h2>
            </div>
            <p class="text-dark-300 leading-relaxed text-lg">{{ getDescription() }}</p>
          </section>

          <!-- Instructions -->
          <section class="card p-6 md:p-8 mb-8 animate-slide-up">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">{{ t('exerciseDetails.instructions') }}</h2>
            </div>
            <ol class="space-y-4">
              @for (instruction of getInstructions(); track $index; let i = $index) {
                <li class="flex gap-4 group">
                  <span class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    {{ i + 1 }}
                  </span>
                  <span class="text-dark-300 pt-2 text-lg">{{ instruction }}</span>
                </li>
              }
            </ol>
          </section>

          <!-- Common Mistakes & Safety Tips -->
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <section class="card p-6 md:p-8 animate-slide-up">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16.5c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-white">{{ t('exerciseDetails.commonMistakes') }}</h2>
              </div>
              <ul class="space-y-3">
                @for (mistake of getCommonMistakes(); track $index) {
                  <li class="flex gap-3 text-dark-300">
                    <div class="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </div>
                    {{ mistake }}
                  </li>
                }
              </ul>
            </section>

            <section class="card p-6 md:p-8 animate-slide-up">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-white">{{ t('exerciseDetails.safetyTips') }}</h2>
              </div>
              <ul class="space-y-3">
                @for (tip of getSafetyTips(); track $index) {
                  <li class="flex gap-3 text-dark-300">
                    <div class="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    {{ tip }}
                  </li>
                }
              </ul>
            </section>
          </div>

          <!-- Target Muscles -->
          <section class="card p-6 md:p-8 mb-8 animate-slide-up">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">{{ t('exerciseDetails.targetMuscles') }}</h2>
            </div>
            <div class="flex flex-wrap gap-3">
              <span class="px-4 py-2 rounded-xl text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                {{ t('exerciseDetails.primary') }}: {{ getPrimaryMuscle() }}
              </span>
              @for (muscle of getSecondaryMuscles(); track muscle) {
                <span class="px-4 py-2 rounded-xl text-sm font-semibold bg-dark-700/50 text-dark-300 border border-dark-600/50">
                  {{ muscle }}
                </span>
              }
            </div>
          </section>

          <!-- Alternative Exercises -->
          <section class="card p-6 md:p-8 animate-slide-up">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 3h5v5"/>
                  <path d="M8 21H3v-5"/>
                  <path d="M21 3l-7 7"/>
                  <path d="M3 21l7-7"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">{{ t('exerciseDetails.alternatives') }}</h2>
            </div>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              @for (alt of getAlternatives(); track alt) {
                <div class="card p-4 text-center group hover:border-green-500/50 transition-colors">
                  <span class="text-dark-200 font-medium group-hover:text-green-400 transition-colors">{{ alt }}</span>
                </div>
              }
            </div>
          </section>
        </div>
      } @else {
        <div class="min-h-screen flex items-center justify-center">
          <div class="card p-10 text-center max-w-md animate-scale-in">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-700/50 flex items-center justify-center">
              <svg class="w-10 h-10 text-dark-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-3">Exercise Not Found</h2>
            <p class="text-dark-400 mb-6">The requested exercise doesn't exist or has been removed.</p>
            <a routerLink="/home-workout" class="btn btn-primary">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Back to Home Workout
            </a>
          </div>
        </div>
      }
    </div>
  `
})
export class HomeExerciseDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private homeWorkoutService = inject(HomeWorkoutService);
  private translationService = inject(TranslationService);

  exercise = signal<HomeExercise | undefined>(undefined);
  showImagePreview = signal(false);

  t(key: string): string {
    return this.translationService.t(key);
  }

  isArabic(): boolean {
    return this.translationService.language() === 'ar';
  }

  getName(): string {
    const ex = this.exercise();
    return this.isArabic() ? (ex?.nameAr || ex?.name || '') : (ex?.name || '');
  }

  getDescription(): string {
    const ex = this.exercise();
    return this.isArabic() ? (ex?.descriptionAr || ex?.description || '') : (ex?.description || '');
  }

  getPrimaryMuscle(): string {
    const ex = this.exercise();
    return this.isArabic() ? (ex?.primaryMuscleAr || ex?.primaryMuscle || '') : (ex?.primaryMuscle || '');
  }

  getEquipment(): string {
    const ex = this.exercise();
    return this.isArabic() ? (ex?.equipmentAr || ex?.equipment || '') : (ex?.equipment || '');
  }

  getInstructions(): string[] {
    const ex = this.exercise();
    if (!ex) return [];
    return this.isArabic() ? (ex.instructionsAr.length > 0 ? ex.instructionsAr : ex.instructions) : ex.instructions;
  }

  getCommonMistakes(): string[] {
    const ex = this.exercise();
    if (!ex) return [];
    return this.isArabic() ? (ex.commonMistakesAr.length > 0 ? ex.commonMistakesAr : ex.commonMistakes) : ex.commonMistakes;
  }

  getSafetyTips(): string[] {
    const ex = this.exercise();
    if (!ex) return [];
    return this.isArabic() ? (ex.safetyTipsAr.length > 0 ? ex.safetyTipsAr : ex.safetyTips) : ex.safetyTips;
  }

  getSecondaryMuscles(): string[] {
    const ex = this.exercise();
    if (!ex) return [];
    return this.isArabic() ? (ex.secondaryMuscleAr.length > 0 ? ex.secondaryMuscleAr : ex.secondaryMuscle) : ex.secondaryMuscle;
  }

  getAlternatives(): string[] {
    const ex = this.exercise();
    if (!ex) return [];
    return this.isArabic() ? (ex.alternativesAr.length > 0 ? ex.alternativesAr : ex.alternatives) : ex.alternatives;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.exercise.set(this.homeWorkoutService.getExercise(id));
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c0468?w=800&h=600&fit=crop';
  }

  getMuscleColor(muscle: string): string {
    const colors: { [key: string]: string } = {
      'Chest': 'bg-red-500/20 text-red-400 border border-red-500/30',
      'Upper Chest': 'bg-red-500/20 text-red-400 border border-red-500/30',
      'Core': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      'Quadriceps': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'Legs': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'Back': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      'Lower Back': 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
      'Arms': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      'Triceps': 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
      'Full Body': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      'Lower Abs': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      'Obliques': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      'Hip Flexors': 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
      'Calves': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
    };
    return colors[muscle] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
}
