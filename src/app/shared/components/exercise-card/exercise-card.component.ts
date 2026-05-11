import { Component, input, output, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Exercise, ExerciseLog } from '../../../core/models/exercise.model';
import { TranslationService } from '../../../core/services/translation.service';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [RouterLink, FormsModule, ImageViewerComponent],
  template: `
    <div 
      class="card my-5 p-5 md:p-6 group relative overflow-hidden"
      [class.border-green-500/50]="isCompleted()"
      [class.opacity-70]="isCompleted()"
    >
      @if (isCompleted()) {
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/10 pointer-events-none"></div>
      }
      
      <div class="relative flex items-start gap-4">
        <!-- Exercise Image -->
        <div 
          class="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-dark-700 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          (click)="showImagePreview.set(true)"
        >
          <img 
            [src]="exercise().imageUrl" 
            [alt]="getName()"
            class="w-full h-full object-cover"
            loading="lazy"
            (error)="onImageError($event)"
          />
        </div>

        <!-- Image Viewer Modal -->
        <app-image-viewer
          [imageUrl]="exercise().imageUrl"
          [imageAlt]="getName()"
          [(isOpen)]="showImagePreview"
        />

        <!-- Exercise Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 mb-3">
            <div>
              <h4 class="text-lg font-bold text-white group-hover:text-primary-400 transition-colors truncate">{{ getName() }}</h4>
              <div class="flex items-center gap-2 mt-1">
                <span class="px-3 py-1 rounded-lg text-xs font-semibold" [class]="getMuscleColor(exercise().primaryMuscle)">
                  {{ getPrimaryMuscle() }}
                </span>
                <span class="badge badge-warning">{{ exercise().difficulty }}</span>
              </div>
            </div>
            @if (isCompleted()) {
              <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            }
          </div>

          <!-- Sets & Reps -->
          <div class="grid grid-cols-3 gap-3 mb-4">
            <div class="card p-3 text-center">
              <div class="text-xl font-bold text-white">{{ exercise().sets }}</div>
              <div class="text-xs text-dark-400 mt-1">{{ t('exerciseCard.sets') }}</div>
            </div>
            <div class="card p-3 text-center">
              <div class="text-xl font-bold text-white">{{ exercise().reps }}</div>
              <div class="text-xs text-dark-400 mt-1">{{ t('exerciseCard.reps') }}</div>
            </div>
            <div class="card p-3 text-center">
              <div class="text-xl font-bold text-white">{{ exercise().rest }}</div>
              <div class="text-xs text-dark-400 mt-1">{{ t('exerciseCard.rest') }}</div>
            </div>
          </div>

          <!-- Weight Inputs -->
          @if (showInputs()) {
            <div class="mb-4">
              <label class="label mb-2">{{ t('exerciseCard.weightPerSet') }}</label>
              <div class="grid gap-2" [style.grid-template-columns]="'repeat(' + exercise().sets + ', minmax(0, 1fr))'">
                @for (set of weightInputs(); track $index; let i = $index) {
                  <input 
                    type="number" 
                    class="input text-center font-bold"
                    [placeholder]="t('exerciseCard.set') + ' ' + (i + 1)"
                    [ngModel]="weightInputs()[i]"
                    (ngModelChange)="updateWeight(i, $event)"
                    min="0"
                    step="0.5"
                  />
                }
              </div>
            </div>

            <!-- Completion Checkbox -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-dark-700/30">
              <label class="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  class="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                  [checked]="isCompleted()"
                  (change)="onCompleteToggle()"
                />
                <span class="text-sm font-medium text-dark-300">{{ t('exerciseCard.markCompleted') }}</span>
              </label>
            </div>
          }

          <!-- Actions -->
          <div class="flex items-center gap-3 mt-4">
            <a 
              [routerLink]="['/exercise', exercise().id]"
              class="btn btn-ghost text-sm flex-1"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Details
            </a>
            @if (showInputs() && !isCompleted()) {
              <button 
                class="btn btn-primary text-sm flex-1"
                (click)="onCompleteToggle()"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Complete
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExerciseCardComponent {
  exercise = input.required<Exercise>();
  exerciseLog = input<ExerciseLog | null>(null);
  showInputs = input(false);
  isCompleted = input(false);
  
  weightChange = output<{ exerciseId: number; weights: number[] }>();
  completeChange = output<{ exerciseId: number; completed: boolean }>();

  showImagePreview = signal(false);
  
  // Computed weight inputs for better performance
  weightInputs = computed(() => {
    const log = this.exerciseLog();
    if (log) {
      return [...log.weights];
    }
    return new Array(this.exercise().sets).fill(0);
  });

  private translationService = inject(TranslationService);

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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c0468?w=400&h=300&fit=crop';
  }

  updateWeight(index: number, value: number): void {
    const weights = [...this.weightInputs()];
    weights[index] = value;
    this.weightChange.emit({
      exerciseId: this.exercise().id,
      weights
    });
  }

  onWeightChange(): void {
    this.weightChange.emit({
      exerciseId: this.exercise().id,
      weights: this.weightInputs()
    });
  }

  onCompleteToggle(): void {
    this.completeChange.emit({
      exerciseId: this.exercise().id,
      completed: !this.isCompleted()
    });
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
