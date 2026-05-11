import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BodyMetricsService } from '../../core/services/body-metrics.service';
import { TranslationService } from '../../core/services/translation.service';
import { BodyFormComponent } from './body-form/body-form.component';
import { WeightChartComponent, WeightChartData } from './weight-chart/weight-chart.component';
import { ProgressReportComponent } from './progress-report/progress-report.component';
import { BodyMetrics } from '../../core/models/body-metrics.model';

@Component({
  selector: 'app-body-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, BodyFormComponent, WeightChartComponent, ProgressReportComponent],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-dark-950 to-accent-600/20 animate-pulse"></div>
        <div class="absolute inset-0">
          <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-10 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <header class="mb-10 animate-fade-in">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2c0 5-4 7-4 12a4 4 0 0 0 8 0c0-5-4-7-4-12z"/>
                  <path d="M12 22a2 2 0 0 0 2-2c0-1.5-2-2-2-4 0 0-2 2.5-2 4a2 2 0 0 0 2 2z"/>
                </svg>
              </div>
              <div>
                <h1 class="text-4xl md:text-5xl font-black text-gradient">{{ t('bodyTracking.title') }}</h1>
                <p class="text-lg text-dark-400 mt-1">{{ t('bodyTracking.subtitle') }}</p>
              </div>
            </div>
          </header>

          <!-- Loading State -->
          @if (loading()) {
            <div class="flex items-center justify-center min-h-[60vh]">
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin"></div>
                <p class="text-dark-400">{{ t('common.loading') }}</p>
              </div>
            </div>
          } @else {
            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Left Column: Form + Quick Stats -->
              <div class="lg:col-span-1 space-y-6">
                <!-- Body Form -->
                <app-body-form />

                <!-- Quick Stats -->
                @if (latestMetric()) {
                  <div class="card p-5">
                    <h3 class="text-lg font-bold text-white mb-4">{{ t('bodyTracking.latestStats') }}</h3>
                    <div class="space-y-3">
                      <div class="flex justify-between items-center">
                        <span class="text-dark-400">{{ t('bodyTracking.weight') }}</span>
                        <span class="font-bold text-white">{{ latestMetric()?.weight }} kg</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-dark-400">{{ t('bodyTracking.height') }}</span>
                        <span class="font-bold text-white">{{ latestMetric()?.height }} cm</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-dark-400">{{ t('bodyTracking.bmi') }}</span>
                        <span class="font-bold" [class]="bmiColor()">{{ latestMetric()?.bmi }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-dark-400">{{ t('bodyTracking.lastLogged') }}</span>
                        <span class="text-sm text-dark-500">{{ formatDate(latestMetric()?.date) }}</span>
                      </div>
                    </div>
                  </div>
                }

                <!-- Goal Setting -->
                <div class="card p-5">
                  <h3 class="text-lg font-bold text-white mb-4">{{ t('bodyTracking.setGoal') }}</h3>
                  @if (goal()) {
                    <div class="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
                      <div class="flex items-center justify-between">
                        <span class="text-dark-300">{{ t('bodyTracking.targetWeight') }}</span>
                        <span class="font-bold text-green-400">{{ goal()?.targetWeight }} kg</span>
                      </div>
                    </div>
                    <button class="btn btn-ghost w-full text-sm" (click)="clearGoal()">
                      {{ t('bodyTracking.clearGoal') }}
                    </button>
                  } @else {
                    <div class="space-y-4">
                      <div>
                        <label class="label">{{ t('bodyTracking.targetWeight') }} (kg)</label>
                        <input 
                          type="number" 
                          [(ngModel)]="goalWeight"
                          class="input"
                          [placeholder]="t('bodyTracking.enterTarget')"
                        />
                      </div>
                      <button class="btn btn-primary w-full" (click)="setGoal()" [disabled]="!goalWeight">
                        {{ t('bodyTracking.saveGoal') }}
                      </button>
                    </div>
                  }
                </div>
              </div>

              <!-- Right Column: Chart + Report -->
              <div class="lg:col-span-2 space-y-6">
                <!-- Weight Chart -->
                <app-weight-chart [chartData]="chartData()" />

                <!-- Progress Report -->
                <app-progress-report [report]="weeklyReport()" />

                <!-- History Table -->
                @if (metrics().length > 0) {
                  <div class="card p-6">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-lg font-bold text-white">{{ t('bodyTracking.history') }}</h3>
                      <span class="text-sm text-dark-400">{{ metrics().length }} {{ t('bodyTracking.entries') }}</span>
                    </div>
                    <div class="overflow-x-auto">
                      <table class="w-full">
                        <thead>
                          <tr class="border-b border-dark-700/50">
                            <th class="text-left py-3 px-4 text-sm font-medium text-dark-400">{{ t('bodyTracking.date') }}</th>
                            <th class="text-left py-3 px-4 text-sm font-medium text-dark-400">{{ t('bodyTracking.weight') }}</th>
                            <th class="text-left py-3 px-4 text-sm font-medium text-dark-400">{{ t('bodyTracking.height') }}</th>
                            <th class="text-left py-3 px-4 text-sm font-medium text-dark-400">{{ t('bodyTracking.bmi') }}</th>
                            <th class="text-right py-3 px-4 text-sm font-medium text-dark-400">{{ t('bodyTracking.actions') }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (metric of recentMetrics(); track metric.id) {
                            <tr class="border-b border-dark-700/30 hover:bg-dark-700/20 transition-colors">
                              <td class="py-3 px-4 text-white">{{ formatDate(metric.date) }}</td>
                              <td class="py-3 px-4 text-white">{{ metric.weight }} kg</td>
                              <td class="py-3 px-4 text-white">{{ metric.height }} cm</td>
                              <td class="py-3 px-4">
                                <span class="font-medium" [class]="getBmiColor(metric.bmi)">{{ metric.bmi }}</span>
                              </td>
                              <td class="py-3 px-4 text-right">
                                <button 
                                  class="btn btn-ghost text-sm px-2 py-1 text-red-400 hover:bg-red-500/10"
                                  (click)="deleteMetric(metric.id)">
                                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                    @if (metrics().length > 10) {
                      <div class="mt-4 text-center">
                        <button class="btn btn-ghost text-sm" (click)="showAll.set(!showAll())">
                          @if (showAll()) {
                            {{ t('bodyTracking.showLess') }}
                          } @else {
                            {{ t('bodyTracking.showAll') }} ({{ metrics().length }})
                          }
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class BodyTrackingComponent implements OnInit {
  private bodyMetricsService = inject(BodyMetricsService);
  private translationService = inject(TranslationService);

  loading = this.bodyMetricsService.loading;
  metrics = this.bodyMetricsService.metrics;
  latestMetric = this.bodyMetricsService.latestMetric;
  weeklyReport = this.bodyMetricsService.weeklyReport;
  goal = this.bodyMetricsService.goal;

  goalWeight: number | null = null;
  showAll = signal(false);

  t(key: string): string {
    return this.translationService.t(key);
  }

  chartData = computed<WeightChartData>(() => {
    return this.bodyMetricsService.chartData();
  });

  recentMetrics = computed(() => {
    const all = this.metrics();
    return this.showAll() ? all : all.slice(0, 10);
  });

  bmiColor = computed(() => {
    const metric = this.latestMetric();
    if (!metric) return 'text-dark-400';
    return this.getBmiColor(metric.bmi);
  });

  async ngOnInit(): Promise<void> {
    await this.bodyMetricsService.loadMetrics();
  }

  setGoal(): void {
    if (this.goalWeight) {
      this.bodyMetricsService.setGoal(this.goalWeight);
      this.goalWeight = null;
    }
  }

  clearGoal(): void {
    this.bodyMetricsService.clearGoal();
  }

  async deleteMetric(id: string): Promise<void> {
    if (confirm(this.t('bodyTracking.confirmDelete'))) {
      await this.bodyMetricsService.deleteMetric(id);
    }
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const isArabic = this.translationService.language() === 'ar';
    return isArabic 
      ? date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getBmiColor(bmi: number): string {
    if (bmi < 18.5) return 'text-blue-400';
    if (bmi < 25) return 'text-green-400';
    if (bmi < 30) return 'text-yellow-400';
    return 'text-red-400';
  }
}
