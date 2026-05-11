import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BodyMetricsService } from '../../../core/services/body-metrics.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-body-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card p-6 md:p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/30 to-accent-500/20 flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2c0 5-4 7-4 12a4 4 0 0 0 8 0c0-5-4-7-4-12z"/>
            <path d="M12 22a2 2 0 0 0 2-2c0-1.5-2-2-2-4 0 0-2 2.5-2 4a2 2 0 0 0 2 2z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-white">{{ t('bodyTracking.logMetrics') }}</h2>
          <p class="text-sm text-dark-400">{{ t('bodyTracking.logMetricsDesc') }}</p>
        </div>
      </div>

      <form (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Weight Input -->
        <div>
          <label class="label">{{ t('bodyTracking.weight') }} (kg)</label>
          <input 
            type="number" 
            [(ngModel)]="weight" 
            name="weight"
            [min]="minWeight"
            [max]="maxWeight"
            step="0.1"
            class="input"
            [placeholder]="t('bodyTracking.weightPlaceholder')"
            required
          />
          @if (weightError()) {
            <p class="text-red-400 text-sm mt-1">{{ weightError() }}</p>
          }
        </div>

        <!-- Height Input -->
        <div>
          <label class="label">{{ t('bodyTracking.height') }} (cm)</label>
          <input 
            type="number" 
            [(ngModel)]="height" 
            name="height"
            [min]="minHeight"
            [max]="maxHeight"
            step="0.1"
            class="input"
            [placeholder]="t('bodyTracking.heightPlaceholder')"
            required
          />
          @if (heightError()) {
            <p class="text-red-400 text-sm mt-1">{{ heightError() }}</p>
          }
        </div>

        <!-- Date Input -->
        <div>
          <label class="label">{{ t('bodyTracking.date') }}</label>
          <input 
            type="date" 
            [(ngModel)]="date" 
            name="date"
            [max]="todayDate"
            class="input"
            required
          />
        </div>

        <!-- BMI Preview -->
        @if (bmiPreview() !== null) {
          <div class="p-4 rounded-xl bg-dark-700/50 border border-dark-600/50">
            <div class="flex items-center justify-between">
              <span class="text-dark-300">{{ t('bodyTracking.bmiPreview') }}</span>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-bold" [class]="bmiColorClass()">{{ bmiPreview() }}</span>
                <span class="text-sm px-2 py-1 rounded-lg" [class]="bmiCategoryClass()">{{ bmiCategory() }}</span>
              </div>
            </div>
          </div>
        }

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="btn btn-primary w-full py-3 text-base font-bold"
          [disabled]="isSubmitting() || !isFormValid()">
          @if (isSubmitting()) {
            <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
            </svg>
            {{ t('common.loading') }}
          } @else {
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ t('bodyTracking.saveMetrics') }}
          }
        </button>
      </form>

      <!-- Success Message -->
      @if (showSuccess()) {
        <div class="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/30 animate-scale-in">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span class="text-green-400 font-medium">{{ t('bodyTracking.saveSuccess') }}</span>
          </div>
        </div>
      }

      <!-- Error Message -->
      @if (errorMessage()) {
        <div class="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30 animate-scale-in">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span class="text-red-400 font-medium">{{ errorMessage() }}</span>
          </div>
        </div>
      }
    </div>
  `
})
export class BodyFormComponent implements OnInit {
  private bodyMetricsService = inject(BodyMetricsService);
  private translationService = inject(TranslationService);

  // Form values
  weight = signal<number | null>(null);
  height = signal<number | null>(null);
  date = signal<string>(this.formatDate(new Date()));

  // Validation constraints
  minWeight = 30;
  maxWeight = 300;
  minHeight = 100;
  maxHeight = 250;

  // State
  isSubmitting = signal(false);
  showSuccess = signal(false);
  errorMessage = signal<string | null>(null);
  weightError = signal<string | null>(null);
  heightError = signal<string | null>(null);

  todayDate = this.formatDate(new Date());

  t(key: string): string {
    return this.translationService.t(key);
  }

  ngOnInit(): void {
    // Pre-fill height from latest metric if available
    const latest = this.bodyMetricsService.latestMetric();
    if (latest) {
      this.height.set(latest.height);
    }
  }

  bmiPreview = signal<number | null>(null);

  // Computed BMI preview
  updateBmiPreview(): void {
    const w = this.weight();
    const h = this.height();
    if (w && h && w > 0 && h > 0) {
      const heightInMeters = h / 100;
      const bmi = parseFloat((w / (heightInMeters * heightInMeters)).toFixed(1));
      this.bmiPreview.set(bmi);
    } else {
      this.bmiPreview.set(null);
    }
  }

  bmiCategory(): string {
    const bmi = this.bmiPreview();
    if (bmi === null) return '';
    if (bmi < 18.5) return this.t('bodyTracking.underweight');
    if (bmi < 25) return this.t('bodyTracking.normal');
    if (bmi < 30) return this.t('bodyTracking.overweight');
    return this.t('bodyTracking.obese');
  }

  bmiColorClass(): string {
    const bmi = this.bmiPreview();
    if (bmi === null) return '';
    if (bmi < 18.5) return 'text-blue-400';
    if (bmi < 25) return 'text-green-400';
    if (bmi < 30) return 'text-yellow-400';
    return 'text-red-400';
  }

  bmiCategoryClass(): string {
    const bmi = this.bmiPreview();
    if (bmi === null) return '';
    if (bmi < 18.5) return 'bg-blue-500/20 text-blue-400';
    if (bmi < 25) return 'bg-green-500/20 text-green-400';
    if (bmi < 30) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  }

  isFormValid(): boolean {
    const w = this.weight();
    const h = this.height();
    const d = this.date();
    return w !== null && h !== null && d !== '' && 
           w >= this.minWeight && w <= this.maxWeight &&
           h >= this.minHeight && h <= this.maxHeight;
  }

  validateForm(): boolean {
    this.weightError.set(null);
    this.heightError.set(null);

    const w = this.weight();
    const h = this.height();

    if (w === null || w < this.minWeight || w > this.maxWeight) {
      this.weightError.set(this.t('bodyTracking.weightError'));
      return false;
    }

    if (h === null || h < this.minHeight || h > this.maxHeight) {
      this.heightError.set(this.t('bodyTracking.heightError'));
      return false;
    }

    return true;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.showSuccess.set(false);

    const w = this.weight();
    const h = this.height();
    const d = this.date();

    if (w === null || h === null) {
      this.isSubmitting.set(false);
      return;
    }

    const result = await this.bodyMetricsService.addMetric({
      weight: w,
      height: h,
      date: d
    });

    this.isSubmitting.set(false);

    if (result.success) {
      this.showSuccess.set(true);
      this.weight.set(null);
      // Keep height for convenience
      setTimeout(() => this.showSuccess.set(false), 3000);
    } else {
      this.errorMessage.set(result.error || this.t('bodyTracking.saveError'));
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
