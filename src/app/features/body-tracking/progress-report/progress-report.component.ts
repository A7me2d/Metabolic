import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';
import { WeeklyProgressReport, getBMICategory } from '../../../core/models/body-metrics.model';

@Component({
  selector: 'app-progress-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p-6 md:p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/30 to-purple-500/20 flex items-center justify-center">
          <svg class="w-5 h-5 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-white">{{ t('bodyTracking.weeklyReport') }}</h2>
          <p class="text-sm text-dark-400">{{ report()?.startDate }} - {{ report()?.endDate }}</p>
        </div>
      </div>

      @if (report()) {
        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <!-- Current Weight -->
          <div class="stat-card">
            <div class="stat-icon bg-gradient-to-br from-green-500/30 to-emerald-500/20">
              <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2c0 5-4 7-4 12a4 4 0 0 0 8 0c0-5-4-7-4-12z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value text-green-400">{{ report()?.currentWeight }}</span>
              <span class="stat-label">{{ t('bodyTracking.currentWeight') }}</span>
            </div>
          </div>

          <!-- Weight Change -->
          <div class="stat-card">
            <div class="stat-icon" [class.bg-gradient-to-br]="true" 
                 [class.from-red-500/30]="weightGain()"
                 [class.to-red-500/20]="weightGain()"
                 [class.from-green-500/30]="!weightGain()"
                 [class.to-emerald-500/20]="!weightGain()">
              @if (weightGain()) {
                <svg class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              } @else {
                <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              }
            </div>
            <div class="stat-content">
              <span class="stat-value" [class.text-red-400]="weightGain()" [class.text-green-400]="!weightGain()">
                {{ weightChangeSign() }}{{ Math.abs(report()?.weightChange || 0).toFixed(1) }}
              </span>
              <span class="stat-label">{{ t('bodyTracking.weightChange') }}</span>
            </div>
          </div>

          <!-- Average BMI -->
          <div class="stat-card">
            <div class="stat-icon bg-gradient-to-br from-primary-500/30 to-blue-500/20">
              <svg class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value text-primary-400">{{ report()?.averageBMI }}</span>
              <span class="stat-label">{{ t('bodyTracking.avgBMI') }}</span>
            </div>
          </div>

          <!-- Workouts -->
          <div class="stat-card">
            <div class="stat-icon bg-gradient-to-br from-accent-500/30 to-purple-500/20">
              <svg class="w-5 h-5 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6.5 4.5a2 2 0 0 0-3 0l-.5.5a2 2 0 0 0 0 3l1.5 1.5"/>
                <path d="M17.5 4.5a2 2 0 0 1 3 0l.5.5a2 2 0 0 1 0 3l-1.5 1.5"/>
                <path d="M8 12h8"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value text-accent-400">{{ report()?.workoutsCompleted }}</span>
              <span class="stat-label">{{ t('bodyTracking.workouts') }}</span>
            </div>
          </div>
        </div>

        <!-- Goal Progress -->
        @if (report()?.goalWeight) {
          <div class="card p-5 bg-dark-700/30 border border-dark-600/50 mb-6">
            <div class="flex items-center justify-between mb-3">
              <span class="text-dark-300">{{ t('bodyTracking.goalProgress') }}</span>
              <span class="text-sm text-dark-400">{{ t('bodyTracking.target') }}: {{ report()?.goalWeight }} kg</span>
            </div>
            <div class="progress-bar h-3 mb-2">
              <div class="progress-fill bg-gradient-to-r from-green-500 to-emerald-500" 
                   [style.width.%]="report()?.progressToGoal || 0"></div>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-dark-400">{{ report()?.progressToGoal || 0 }}% {{ t('bodyTracking.complete') }}</span>
              @if (report()?.estimatedDaysToGoal) {
                <span class="text-dark-400">~{{ report()?.estimatedDaysToGoal }} {{ t('bodyTracking.daysRemaining') }}</span>
              }
            </div>
          </div>
        }

        <!-- BMI Category -->
        <div class="p-4 rounded-xl" [class]="bmiCategoryBg()">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" [class]="bmiCategoryIconBg()">
                <svg class="w-5 h-5" [class]="bmiCategoryIconColor()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-dark-400">{{ t('bodyTracking.bmiCategory') }}</p>
                <p class="font-bold" [class]="bmiCategoryTextColor()">{{ bmiCategoryLabel() }}</p>
              </div>
            </div>
            <span class="text-2xl font-bold" [class]="bmiCategoryTextColor()">{{ report()?.averageBMI }}</span>
          </div>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center h-48 text-center">
          <div class="w-16 h-16 rounded-2xl bg-dark-700/50 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-dark-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <p class="text-dark-400">{{ t('bodyTracking.noReportData') }}</p>
          <p class="text-sm text-dark-500 mt-1">{{ t('bodyTracking.logMetricsFirst') }}</p>
        </div>
      }
    </div>
  `
})
export class ProgressReportComponent {
  private translationService = inject(TranslationService);

  report = input<WeeklyProgressReport | null>(null);

  Math = Math;

  t(key: string): string {
    return this.translationService.t(key);
  }

  weightGain = computed(() => (this.report()?.weightChange || 0) > 0);

  weightChangeSign = computed(() => this.weightGain() ? '+' : '-');

  bmiCategory = computed(() => {
    const bmi = this.report()?.averageBMI;
    if (!bmi) return null;
    return getBMICategory(bmi);
  });

  bmiCategoryLabel = computed(() => {
    const cat = this.bmiCategory();
    if (!cat) return '';
    return this.translationService.language() === 'ar' ? cat.labelAr : cat.label;
  });

  bmiCategoryBg = computed(() => {
    const cat = this.bmiCategory();
    if (!cat) return 'bg-dark-700/30';
    const colors: Record<string, string> = {
      'blue': 'bg-blue-500/10 border border-blue-500/20',
      'green': 'bg-green-500/10 border border-green-500/20',
      'yellow': 'bg-yellow-500/10 border border-yellow-500/20',
      'orange': 'bg-orange-500/10 border border-orange-500/20',
      'red': 'bg-red-500/10 border border-red-500/20'
    };
    return colors[cat.color] || 'bg-dark-700/30';
  });

  bmiCategoryIconBg = computed(() => {
    const cat = this.bmiCategory();
    if (!cat) return 'bg-dark-700/50';
    const colors: Record<string, string> = {
      'blue': 'bg-blue-500/20',
      'green': 'bg-green-500/20',
      'yellow': 'bg-yellow-500/20',
      'orange': 'bg-orange-500/20',
      'red': 'bg-red-500/20'
    };
    return colors[cat.color] || 'bg-dark-700/50';
  });

  bmiCategoryIconColor = computed(() => {
    const cat = this.bmiCategory();
    if (!cat) return 'text-dark-400';
    const colors: Record<string, string> = {
      'blue': 'text-blue-400',
      'green': 'text-green-400',
      'yellow': 'text-yellow-400',
      'orange': 'text-orange-400',
      'red': 'text-red-400'
    };
    return colors[cat.color] || 'text-dark-400';
  });

  bmiCategoryTextColor = computed(() => {
    const cat = this.bmiCategory();
    if (!cat) return 'text-dark-300';
    const colors: Record<string, string> = {
      'blue': 'text-blue-400',
      'green': 'text-green-400',
      'yellow': 'text-yellow-400',
      'orange': 'text-orange-400',
      'red': 'text-red-400'
    };
    return colors[cat.color] || 'text-dark-300';
  });
}
