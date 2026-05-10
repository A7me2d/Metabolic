import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NutritionStore } from '../../stores';
import { SupplementType, SUPPLEMENT_TYPES, Macros } from '../../models';
import { UiFeedbackService } from '../../services';

@Component({
  selector: 'app-manual-entry',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-panel overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]">
      <div class="flex flex-col gap-4 border-b border-white/10 p-4 sm:gap-5 sm:p-6 md:flex-row md:items-end md:justify-between md:p-8">
        <div>
          <div class="text-xs uppercase tracking-[0.3em] text-slate-500">Precision logging</div>
          <h2 class="mt-2 text-xl font-bold text-white sm:text-2xl">Manual nutrition and supplement input</h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Fast enough for quick capture, clean enough for accurate tracking when AI is not the right move.</p>
        </div>

        <div class="flex w-full rounded-2xl border border-white/10 bg-slate-950/40 p-1 md:w-auto">
          <button
            (click)="activeTab.set('meal')"
            class="flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition md:flex-none"
            [class.bg-emerald-300]="activeTab() === 'meal'"
            [class.text-slate-950]="activeTab() === 'meal'"
            [class.text-slate-400]="activeTab() !== 'meal'">
            Quick meal
          </button>
          <button
            (click)="activeTab.set('supplement')"
            class="flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition md:flex-none"
            [class.bg-orange-300]="activeTab() === 'supplement'"
            [class.text-slate-950]="activeTab() === 'supplement'"
            [class.text-slate-400]="activeTab() !== 'supplement'">
            Supplement
          </button>
        </div>
      </div>

      <div *ngIf="activeTab() === 'meal'" class="grid gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div class="space-y-4">
          <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem] sm:p-5">
            <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Food name</label>
            <input
              type="text"
              [(ngModel)]="mealName"
              placeholder="Chicken rice bowl"
              class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
          </div>

          <div class="grid gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
              <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Calories</label>
              <input type="number" [(ngModel)]="mealMacros.cal" placeholder="540" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 text-center text-white outline-none focus:border-emerald-300/40">
            </div>
            <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
              <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Protein</label>
              <input type="number" [(ngModel)]="mealMacros.p" placeholder="34" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 text-center text-white outline-none focus:border-emerald-300/40">
            </div>
            <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
              <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Carbs</label>
              <input type="number" [(ngModel)]="mealMacros.c" placeholder="52" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 text-center text-white outline-none focus:border-emerald-300/40">
            </div>
            <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
              <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Fat</label>
              <input type="number" [(ngModel)]="mealMacros.f" placeholder="18" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 text-center text-white outline-none focus:border-emerald-300/40">
            </div>
          </div>

          <button
            (click)="addMeal()"
            [disabled]="!mealName || mealMacros.cal === 0"
            class="w-full rounded-2xl bg-linear-to-r from-emerald-400 via-lime-300 to-orange-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40">
            Add meal to today
          </button>
        </div>

        <div class="rounded-[1.5rem] border border-emerald-300/12 bg-emerald-300/8 p-5 sm:rounded-[1.75rem] sm:p-6">
          <div class="text-xs uppercase tracking-[0.28em] text-emerald-200/70">Quick tip</div>
          <h3 class="mt-3 text-xl font-bold text-white sm:text-2xl">Keep entries tight and usable.</h3>
          <p class="mt-3 text-sm leading-6 text-slate-300">Use simple meal names and rough macros when speed matters. Precision is great, consistency is better.</p>
        </div>
      </div>

      <div *ngIf="activeTab() === 'supplement'" class="grid gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div class="space-y-4">
          <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem] sm:p-5">
            <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Supplement name</label>
            <input
              type="text"
              [(ngModel)]="supplementName"
              placeholder="Magnesium glycinate"
              class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-orange-300/40">
          </div>

          <div class="grid gap-3 min-[420px]:grid-cols-2">
            <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
              <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Type</label>
              <select [(ngModel)]="supplementType" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 text-white outline-none focus:border-orange-300/40">
                <option *ngFor="let type of supplementTypes" [value]="type">{{ type | titlecase }}</option>
              </select>
            </div>
            <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
              <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Time</label>
              <input type="time" [(ngModel)]="supplementTime" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 text-white outline-none focus:border-orange-300/40">
            </div>
          </div>

          <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem] sm:p-5">
            <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Dosage</label>
            <input
              type="text"
              [(ngModel)]="supplementDosage"
              placeholder="400mg"
              class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-orange-300/40">
          </div>

          <button
            (click)="addSupplement()"
            [disabled]="!supplementName"
            class="w-full rounded-2xl bg-linear-to-r from-orange-300 via-amber-300 to-lime-300 px-5 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40">
            Add supplement
          </button>
        </div>

        <div class="rounded-[1.5rem] border border-orange-300/12 bg-orange-300/8 p-5 sm:rounded-[1.75rem] sm:p-6">
          <div class="text-xs uppercase tracking-[0.28em] text-orange-200/70">Reminder</div>
          <h3 class="mt-3 text-xl font-bold text-white sm:text-2xl">Timing matters more than clutter.</h3>
          <p class="mt-3 text-sm leading-6 text-slate-300">Log only what you actually want to review later. A cleaner supplement log is easier to trust and maintain.</p>
        </div>
      </div>
    </div>
  `
})
export class ManualEntryComponent {
  private nutritionStore = inject(NutritionStore);
  private ui = inject(UiFeedbackService);

  protected activeTab = signal<'meal' | 'supplement'>('meal');
  protected supplementTypes = SUPPLEMENT_TYPES;
  protected mealName = '';
  protected mealMacros: Macros = { cal: 0, p: 0, c: 0, f: 0 };
  protected supplementName = '';
  protected supplementType: SupplementType = 'vitamin';
  protected supplementTime = new Date().toTimeString().slice(0, 5);
  protected supplementDosage = '';

  async addMeal(): Promise<void> {
    if (!this.mealName || this.mealMacros.cal === 0) return;
    try {
      await this.ui.track('Adding meal...', this.nutritionStore.quickAddMeal(this.mealName, { ...this.mealMacros }, 'manual'));
      this.mealName = '';
      this.mealMacros = { cal: 0, p: 0, c: 0, f: 0 };
      this.ui.success('Meal added successfully.');
    } catch (error) {
      this.ui.error(error instanceof Error ? error.message : 'Could not add meal.');
    }
  }

  async addSupplement(): Promise<void> {
    if (!this.supplementName) return;
    try {
      await this.ui.track(
        'Adding supplement...',
        this.nutritionStore.addSupplement({
          userId: '',
          name: this.supplementName,
          type: this.supplementType,
          dosage: this.supplementDosage || undefined,
          time: this.supplementTime,
          timestamp: new Date().toISOString()
        })
      );
      this.supplementName = '';
      this.supplementDosage = '';
      this.ui.success('Supplement added successfully.');
    } catch (error) {
      this.ui.error(error instanceof Error ? error.message : 'Could not add supplement.');
    }
  }
}
