import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore, NutritionStore } from '../../stores';
import { ProgressRingComponent } from '../progress-ring';
import { UiFeedbackService } from '../../services';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ProgressRingComponent],
  template: `
    <div class="min-h-screen px-3 pb-10 pt-3 sm:px-4 md:px-6 md:pt-6">
      <div class="mx-auto max-w-6xl space-y-4 sm:space-y-5">
        <header class="glass-panel overflow-hidden rounded-[1.75rem] p-4 sm:rounded-[2rem] sm:p-6 md:p-8">
          <div class="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <div class="flex flex-col justify-between gap-5 sm:gap-6">
              <div class="max-w-2xl">
                <div class="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200 sm:mb-4 sm:text-xs sm:tracking-[0.28em]">
                  Metabolic command center
                </div>
                <h1 class="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">Fuel smarter. Track sharper. Stay in control.</h1>
                <p class="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                  A cleaner view of your calories, macros, and recovery inputs so every decision feels deliberate.
                </p>
              </div>

              <div class="grid gap-3 min-[420px]:grid-cols-2 md:max-w-md">
                <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
                  <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Day</div>
                  <div class="mt-2 text-base font-semibold text-white sm:text-lg">{{ todayDate }}</div>
                </div>
                <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
                  <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Entries</div>
                  <div class="mt-2 text-3xl font-bold text-white">{{ meals().length }}</div>
                </div>
              </div>
            </div>

            <div class="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-4 sm:rounded-[2rem] sm:p-5">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-linear-to-br from-sky-400/25 to-emerald-400/20 text-white sm:h-16 sm:w-16 sm:rounded-[1.5rem]">
                    <svg class="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5.121 17.804A8.966 8.966 0 0112 15c2.62 0 4.978 1.122 6.621 2.914M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="text-xs uppercase tracking-[0.28em] text-slate-500">Profile</div>
                    <div class="mt-1 truncate text-xl font-bold text-white sm:text-2xl">{{ user()?.name }}</div>
                    <div class="mt-1 break-all text-sm text-slate-400">{{ user()?.email || 'Signed in user' }}</div>
                  </div>
                </div>

                <button
                  (click)="logout()"
                  class="w-full rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/15 sm:w-auto">
                  Logout
                </button>
              </div>

              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <div class="text-xs uppercase tracking-[0.24em] text-slate-500">Body metrics</div>
                  <div class="mt-2 text-sm text-slate-300">Age {{ user()?.age }} • {{ user()?.weight }} kg • {{ user()?.height }} cm</div>
                </div>
                <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <div class="text-xs uppercase tracking-[0.24em] text-slate-500">Plan</div>
                  <div class="mt-2 text-sm capitalize text-slate-300">{{ user()?.goal }} goal • {{ formatActivity(user()?.activityLevel) }}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section class="grid gap-4 sm:gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div class="glass-panel rounded-[1.75rem] p-4 sm:rounded-[2rem] sm:p-6 md:p-8">
            <div class="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex justify-center">
                <div class="relative">
                  <div class="absolute inset-6 rounded-full bg-emerald-400/10 blur-2xl"></div>
                  <app-progress-ring
                    [progress]="calorieProgress()"
                    [size]="ringSize"
                    [strokeWidth]="14"
                    [color]="'#4ade80'"
                    [bgColor]="'#1e293b'">
                    <div class="text-center">
                      <div class="text-xs uppercase tracking-[0.3em] text-slate-400">Calories</div>
                      <div class="mt-2 text-4xl font-bold text-white sm:text-5xl">{{ dailyTotals().cal }}</div>
                      <div class="mt-1 text-sm text-slate-400">of {{ targetCalories() }} target</div>
                      <div
                        class="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
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
                  <h2 class="mt-2 text-xl font-bold text-white sm:text-2xl">Today's balance at a glance</h2>
                </div>

                <div class="space-y-4">
                  <div class="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
                    <div class="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span class="font-semibold text-slate-100">Protein</span>
                      <span class="text-right text-slate-300">{{ dailyTotals().p }}/{{ macroTargets()?.protein || 0 }}g</span>
                    </div>
                    <div class="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div class="h-full rounded-full bg-linear-to-r from-sky-400 to-cyan-300 transition-all duration-500" [style.width.%]="macroProgress().protein"></div>
                    </div>
                  </div>

                  <div class="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
                    <div class="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span class="font-semibold text-slate-100">Carbs</span>
                      <span class="text-right text-slate-300">{{ dailyTotals().c }}/{{ macroTargets()?.carbs || 0 }}g</span>
                    </div>
                    <div class="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div class="h-full rounded-full bg-linear-to-r from-amber-400 to-orange-400 transition-all duration-500" [style.width.%]="macroProgress().carbs"></div>
                    </div>
                  </div>

                  <div class="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
                    <div class="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span class="font-semibold text-slate-100">Fat</span>
                      <span class="text-right text-slate-300">{{ dailyTotals().f }}/{{ macroTargets()?.fat || 0 }}g</span>
                    </div>
                    <div class="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div class="h-full rounded-full bg-linear-to-r from-rose-400 to-pink-400 transition-all duration-500" [style.width.%]="macroProgress().fat"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-panel rounded-[1.75rem] p-4 sm:rounded-[2rem] sm:p-6 md:p-8">
            <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div class="text-xs uppercase tracking-[0.3em] text-slate-500">Daily flow</div>
                <h2 class="mt-2 text-xl font-bold text-white sm:text-2xl">Meal activity</h2>
              </div>
              <div class="self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                {{ meals().length }} items
              </div>
            </div>

            <div *ngIf="meals().length === 0" class="flex min-h-72 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/30 px-5 py-8 text-center sm:min-h-80 sm:rounded-[1.75rem] sm:px-6">
              <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/6 text-slate-300">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <p class="mt-4 text-lg font-semibold text-white">No meals logged yet</p>
              <p class="mt-2 max-w-xs text-sm leading-6 text-slate-400">Kick off the day with a camera scan or a fast manual entry and your dashboard will light up here.</p>
            </div>

            <div *ngIf="meals().length > 0" class="space-y-3">
              <div *ngFor="let meal of meals()" class="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-emerald-300/20 hover:bg-white/8 sm:rounded-[1.5rem]">
                <div class="flex items-start gap-3">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-sm font-bold text-emerald-200 sm:h-12 sm:w-12">
                    {{ meal.foodName.charAt(0).toUpperCase() }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <div class="truncate text-base font-semibold text-white">{{ meal.foodName }}</div>
                      <div class="rounded-full bg-slate-900/70 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        {{ meal.timestamp | date:'shortTime' }}
                      </div>
                    </div>
                    <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300 min-[420px]:text-sm md:grid-cols-4">
                      <div class="rounded-xl bg-slate-950/50 px-3 py-2">Cal {{ meal.macros.cal }}</div>
                      <div class="rounded-xl bg-slate-950/50 px-3 py-2">P {{ meal.macros.p }}g</div>
                      <div class="rounded-xl bg-slate-950/50 px-3 py-2">C {{ meal.macros.c }}g</div>
                      <div class="rounded-xl bg-slate-950/50 px-3 py-2">F {{ meal.macros.f }}g</div>
                    </div>
                  </div>
                  <button
                    (click)="deleteMeal(meal.id)"
                    class="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-rose-300/25 hover:text-rose-300">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section *ngIf="supplements().length > 0" class="glass-panel rounded-[1.75rem] p-4 sm:rounded-[2rem] sm:p-6 md:p-8">
          <div class="mb-5">
            <div class="text-xs uppercase tracking-[0.3em] text-slate-500">Support stack</div>
            <h2 class="mt-2 text-xl font-bold text-white sm:text-2xl">Supplement timing</h2>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <div *ngFor="let supp of supplements()" class="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
              <div class="flex items-start gap-3">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-200 sm:h-12 sm:w-12">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-base font-semibold text-white">{{ supp.name }}</div>
                  <div class="mt-1 text-sm text-slate-400">{{ supp.type }} • {{ supp.time }}</div>
                  <div *ngIf="supp.dosage" class="mt-2 inline-flex max-w-full rounded-full bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
                    <span class="truncate">{{ supp.dosage }}</span>
                  </div>
                </div>
                <button
                  (click)="deleteSupplement(supp.id)"
                  class="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-rose-300/25 hover:text-rose-300">
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
  private ui = inject(UiFeedbackService);

  protected readonly Math = Math;
  protected user = this.userStore.user;
  protected meals = this.nutritionStore.meals;
  protected supplements = this.nutritionStore.supplements;
  protected dailyTotals = this.nutritionStore.dailyTotals;
  protected calorieProgress = this.nutritionStore.calorieProgress;
  protected macroProgress = this.nutritionStore.macroProgress;
  protected remainingCalories = this.nutritionStore.remainingCalories;
  protected targetCalories = this.userStore.targetCalories;
  protected macroTargets = this.userStore.macroTargets;
  protected ringSize = 220;

  protected todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  constructor() {
    this.updateRingSize();
  }

  @HostListener('window:resize')
  protected updateRingSize(): void {
    if (typeof window === 'undefined') {
      this.ringSize = 220;
      return;
    }
    this.ringSize = window.innerWidth < 420 ? 184 : 220;
  }

  protected formatActivity(level: string | undefined): string {
    if (!level) return 'Unknown';
    return level.replace('_', ' ');
  }

  protected async logout(): Promise<void> {
    try {
      await this.ui.track('Signing you out...', this.userStore.logout());
      this.ui.success('Logged out successfully.');
    } catch (error) {
      this.ui.error(error instanceof Error ? error.message : 'Could not log out.');
    }
  }

  async deleteMeal(id: string): Promise<void> {
    try {
      await this.ui.track('Deleting meal...', this.nutritionStore.deleteMeal(id));
      this.ui.success('Meal removed.');
    } catch (error) {
      this.ui.error(error instanceof Error ? error.message : 'Could not delete meal.');
    }
  }

  async deleteSupplement(id: string): Promise<void> {
    try {
      await this.ui.track('Deleting supplement...', this.nutritionStore.deleteSupplement(id));
      this.ui.success('Supplement removed.');
    } catch (error) {
      this.ui.error(error instanceof Error ? error.message : 'Could not delete supplement.');
    }
  }
}
