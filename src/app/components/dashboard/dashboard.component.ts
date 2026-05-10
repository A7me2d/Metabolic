import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore, NutritionStore } from '../../stores';
import { ProgressRingComponent } from '../progress-ring';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ProgressRingComponent],
  template: `
    <div class="min-h-screen px-4 pb-12 pt-4 md:px-6 md:pt-6">
      <div class="mx-auto max-w-6xl space-y-5">
        <header class="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
                Metabolic command center
              </div>
              <h1 class="text-4xl font-bold text-white md:text-5xl">Fuel smarter. Track sharper. Stay in control.</h1>
              <p class="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                A cleaner view of your calories, macros, and recovery inputs so every decision feels deliberate.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3 md:min-w-80">
              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Day</div>
                <div class="mt-2 text-lg font-semibold text-white">{{ todayDate }}</div>
              </div>
              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Entries</div>
                <div class="mt-2 text-3xl font-bold text-white">{{ meals().length }}</div>
              </div>
            </div>
          </div>
        </header>

        <section class="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div class="glass-panel rounded-[2rem] p-6 md:p-8">
            <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex justify-center">
                <div class="relative">
                  <div class="absolute inset-6 rounded-full bg-emerald-400/10 blur-2xl"></div>
                  <app-progress-ring
                    [progress]="calorieProgress()"
                    [size]="220"
                    [strokeWidth]="16"
                    [color]="'#4ade80'"
                    [bgColor]="'#1e293b'">
                    <div class="text-center">
                      <div class="text-xs uppercase tracking-[0.3em] text-slate-400">Calories</div>
                      <div class="mt-2 text-5xl font-bold text-white">{{ dailyTotals().cal }}</div>
                      <div class="mt-1 text-sm text-slate-400">of {{ targetCalories() }} target</div>
                      <div class="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                        [class.bg-emerald-400/15]="remainingCalories() >= 0"
                        [class.text-emerald-200]="remainingCalories() >= 0"
                        [class.bg-rose-400/15]="remainingCalories() < 0"
                        [class.text-rose-200]="remainingCalories() < 0">
                        {{ remainingCalories() >= 0 ? remainingCalories() + ' left' : Math.abs(remainingCalories()) + ' above target' }}
                      </div>
                    </div>
                  </app-progress-ring>
                </div>
              </div>

              <div class="flex-1 space-y-4">
                <div>
                  <div class="text-xs uppercase tracking-[0.3em] text-slate-500">Macro pressure</div>
                  <h2 class="mt-2 text-2xl font-bold text-white">Today’s balance at a glance</h2>
                </div>

                <div class="space-y-4">
                  <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <div class="mb-2 flex items-center justify-between text-sm">
                      <span class="font-semibold text-slate-100">Protein</span>
                      <span class="text-slate-300">{{ dailyTotals().p }}/{{ macroTargets()?.protein || 0 }}g</span>
                    </div>
                    <div class="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div class="h-full rounded-full bg-linear-to-r from-sky-400 to-cyan-300 transition-all duration-500" [style.width.%]="macroProgress().protein"></div>
                    </div>
                  </div>

                  <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <div class="mb-2 flex items-center justify-between text-sm">
                      <span class="font-semibold text-slate-100">Carbs</span>
                      <span class="text-slate-300">{{ dailyTotals().c }}/{{ macroTargets()?.carbs || 0 }}g</span>
                    </div>
                    <div class="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div class="h-full rounded-full bg-linear-to-r from-amber-400 to-orange-400 transition-all duration-500" [style.width.%]="macroProgress().carbs"></div>
                    </div>
                  </div>

                  <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <div class="mb-2 flex items-center justify-between text-sm">
                      <span class="font-semibold text-slate-100">Fat</span>
                      <span class="text-slate-300">{{ dailyTotals().f }}/{{ macroTargets()?.fat || 0 }}g</span>
                    </div>
                    <div class="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div class="h-full rounded-full bg-linear-to-r from-rose-400 to-pink-400 transition-all duration-500" [style.width.%]="macroProgress().fat"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-panel rounded-[2rem] p-6 md:p-8">
            <div class="mb-5 flex items-center justify-between">
              <div>
                <div class="text-xs uppercase tracking-[0.3em] text-slate-500">Daily flow</div>
                <h2 class="mt-2 text-2xl font-bold text-white">Meal activity</h2>
              </div>
              <div class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                {{ meals().length }} items
              </div>
            </div>

            <div *ngIf="meals().length === 0" class="flex min-h-80 flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-white/10 bg-slate-950/30 px-6 text-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/6 text-slate-300">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <p class="mt-4 text-lg font-semibold text-white">No meals logged yet</p>
              <p class="mt-2 max-w-xs text-sm leading-6 text-slate-400">Kick off the day with a camera scan or a fast manual entry and your dashboard will light up here.</p>
            </div>

            <div *ngIf="meals().length > 0" class="space-y-3">
              <div *ngFor="let meal of meals()" class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-emerald-300/20 hover:bg-white/8">
                <div class="flex items-start gap-3">
                  <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-sm font-bold text-emerald-200">
                    {{ meal.foodName.charAt(0).toUpperCase() }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <div class="truncate text-base font-semibold text-white">{{ meal.foodName }}</div>
                      <div class="rounded-full bg-slate-900/70 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        {{ meal.timestamp | date:'shortTime' }}
                      </div>
                    </div>
                    <div class="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-300 md:grid-cols-4">
                      <div class="rounded-xl bg-slate-950/50 px-3 py-2">Cal {{ meal.macros.cal }}</div>
                      <div class="rounded-xl bg-slate-950/50 px-3 py-2">P {{ meal.macros.p }}g</div>
                      <div class="rounded-xl bg-slate-950/50 px-3 py-2">C {{ meal.macros.c }}g</div>
                      <div class="rounded-xl bg-slate-950/50 px-3 py-2">F {{ meal.macros.f }}g</div>
                    </div>
                  </div>
                  <button
                    (click)="deleteMeal(meal.id)"
                    class="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-rose-300/25 hover:text-rose-300">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section *ngIf="supplements().length > 0" class="glass-panel rounded-[2rem] p-6 md:p-8">
          <div class="mb-5">
            <div class="text-xs uppercase tracking-[0.3em] text-slate-500">Support stack</div>
            <h2 class="mt-2 text-2xl font-bold text-white">Supplement timing</h2>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <div *ngFor="let supp of supplements()" class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div class="flex items-start gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-200">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-base font-semibold text-white">{{ supp.name }}</div>
                  <div class="mt-1 text-sm text-slate-400">{{ supp.type }} • {{ supp.time }}</div>
                  <div *ngIf="supp.dosage" class="mt-2 inline-flex rounded-full bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
                    {{ supp.dosage }}
                  </div>
                </div>
                <button
                  (click)="deleteSupplement(supp.id)"
                  class="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-rose-300/25 hover:text-rose-300">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private userStore = inject(UserStore);
  private nutritionStore = inject(NutritionStore);

  protected readonly Math = Math;
  protected meals = this.nutritionStore.meals;
  protected supplements = this.nutritionStore.supplements;
  protected dailyTotals = this.nutritionStore.dailyTotals;
  protected calorieProgress = this.nutritionStore.calorieProgress;
  protected macroProgress = this.nutritionStore.macroProgress;
  protected remainingCalories = this.nutritionStore.remainingCalories;
  protected targetCalories = this.userStore.targetCalories;
  protected macroTargets = this.userStore.macroTargets;

  protected todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  async deleteMeal(id: string): Promise<void> {
    await this.nutritionStore.deleteMeal(id);
  }

  async deleteSupplement(id: string): Promise<void> {
    await this.nutritionStore.deleteSupplement(id);
  }
}
