import { Component, inject, input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { TranslationService } from '../../../core/services/translation.service';

Chart.register(...registerables);

export interface WeightChartData {
  labels: string[];
  weights: number[];
}

@Component({
  selector: 'app-weight-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p-6 md:p-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white">{{ t('bodyTracking.weightProgress') }}</h2>
        </div>
        <div class="flex gap-2">
          <button 
            class="btn btn-ghost text-sm px-3 py-1"
            [class.btn-primary]="selectedRange() === '7'"
            (click)="selectedRange.set('7')">
            7 {{ t('bodyTracking.days') }}
          </button>
          <button 
            class="btn btn-ghost text-sm px-3 py-1"
            [class.btn-primary]="selectedRange() === '30'"
            (click)="selectedRange.set('30')">
            30 {{ t('bodyTracking.days') }}
          </button>
          <button 
            class="btn btn-ghost text-sm px-3 py-1"
            [class.btn-primary]="selectedRange() === '90'"
            (click)="selectedRange.set('90')">
            90 {{ t('bodyTracking.days') }}
          </button>
        </div>
      </div>

      @if (hasData()) {
        <div class="relative h-64 md:h-80">
          <canvas #chartCanvas></canvas>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-dark-700/50">
          <div class="text-center">
            <p class="text-sm text-dark-400">{{ t('bodyTracking.highest') }}</p>
            <p class="text-xl font-bold text-red-400">{{ highestWeight() }} kg</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-dark-400">{{ t('bodyTracking.lowest') }}</p>
            <p class="text-xl font-bold text-green-400">{{ lowestWeight() }} kg</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-dark-400">{{ t('bodyTracking.average') }}</p>
            <p class="text-xl font-bold text-primary-400">{{ averageWeight() }} kg</p>
          </div>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center h-64 text-center">
          <div class="w-16 h-16 rounded-2xl bg-dark-700/50 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-dark-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <p class="text-dark-400">{{ t('bodyTracking.noData') }}</p>
          <p class="text-sm text-dark-500 mt-1">{{ t('bodyTracking.logFirst') }}</p>
        </div>
      }
    </div>
  `
})
export class WeightChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private translationService = inject(TranslationService);

  chartData = input.required<WeightChartData>();

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;
  selectedRange = signal<'7' | '30' | '90'>('30');

  t(key: string): string {
    return this.translationService.t(key);
  }

  hasData = signal(false);
  highestWeight = signal(0);
  lowestWeight = signal(0);
  averageWeight = signal(0);

  ngOnInit(): void {
    // Update stats when data changes
    effect(() => {
      const data = this.chartData();
      if (data.weights.length > 0) {
        this.hasData.set(true);
        this.highestWeight.set(Math.max(...data.weights));
        this.lowestWeight.set(Math.min(...data.weights));
        const avg = data.weights.reduce((a, b) => a + b, 0) / data.weights.length;
        this.averageWeight.set(parseFloat(avg.toFixed(1)));
      } else {
        this.hasData.set(false);
      }
    });
  }

  ngAfterViewInit(): void {
    // Create chart when data changes
    effect(() => {
      const data = this.chartData();
      if (this.chartCanvas && data.weights.length > 0) {
        this.createChart(data);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(data: WeightChartData): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const isArabic = this.translationService.language() === 'ar';

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: this.t('bodyTracking.weight'),
          data: data.weights,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(34, 197, 94)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#fff',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(34, 197, 94, 0.5)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context: TooltipItem<'line'>) => `${this.t('bodyTracking.weight')}: ${context.parsed.y} kg`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(148, 163, 184, 0.1)'
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(148, 163, 184, 0.1)'
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 11
              },
              callback: (value: string | number) => `${value} kg`
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }
}
