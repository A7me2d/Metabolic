import { Component, effect, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiFoodResponse, Macros } from '../../models';

@Component({
  selector: 'app-food-confirm-modal',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xl" (click)="onBackdropClick($event)">
      <div class="glass-panel max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem]" (click)="$event.stopPropagation()">
        <div class="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div class="relative min-h-72 bg-slate-950/70">
            <img *ngIf="imageBase64()" [src]="'data:image/jpeg;base64,' + imageBase64()" class="h-full w-full object-cover" alt="Food image">
            <div class="absolute inset-x-0 bottom-0 p-4">
              <div *ngIf="result()?.confidence" class="inline-flex rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs font-semibold text-white">
                {{ (result()!.confidence * 100).toFixed(0) }}% AI confidence
              </div>
            </div>
          </div>

          <div class="p-6 md:p-8">
            <div class="mb-6">
              <div class="text-xs uppercase tracking-[0.3em] text-slate-500">Review capture</div>
              <h2 class="mt-2 text-3xl font-bold text-white">Confirm and refine the detection</h2>
              <p class="mt-2 text-sm leading-6 text-slate-400">Use the AI estimate as a starting point, then tighten the food label and macros before logging it.</p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Food name</label>
                <input
                  type="text"
                  [(ngModel)]="editedFoodName"
                  class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40"
                  placeholder="Food name">
              </div>

              <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div class="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                  <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Calories</label>
                  <input type="number" [(ngModel)]="editedMacros.cal" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 text-center text-white outline-none focus:border-emerald-300/40">
                </div>
                <div class="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                  <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Protein</label>
                  <input type="number" [(ngModel)]="editedMacros.p" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 text-center text-white outline-none focus:border-emerald-300/40">
                </div>
                <div class="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                  <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Carbs</label>
                  <input type="number" [(ngModel)]="editedMacros.c" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 text-center text-white outline-none focus:border-emerald-300/40">
                </div>
                <div class="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                  <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Fat</label>
                  <input type="number" [(ngModel)]="editedMacros.f" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 text-center text-white outline-none focus:border-emerald-300/40">
                </div>
              </div>
            </div>

            <div class="mt-8 flex gap-3">
              <button (click)="cancel()" class="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-200 transition hover:bg-white/10">
                Cancel
              </button>
              <button (click)="confirm()" class="flex-1 rounded-2xl bg-linear-to-r from-emerald-400 via-lime-300 to-orange-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]">
                Add to log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FoodConfirmModalComponent {
  readonly result = input<GeminiFoodResponse | null>(null);
  readonly imageBase64 = input<string | null>(null);
  readonly visible = model<boolean>(false);

  readonly confirmed = output<{ foodName: string; macros: Macros }>();
  readonly cancelled = output<void>();

  protected editedFoodName = '';
  protected editedMacros: Macros = { cal: 0, p: 0, c: 0, f: 0 };

  constructor() {
    effect(() => {
      const result = this.result();
      if (result) {
        this.editedFoodName = result.food_name;
        this.editedMacros = { ...result.macros };
      }
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancel();
  }

  confirm(): void {
    this.confirmed.emit({ foodName: this.editedFoodName, macros: this.editedMacros });
    this.visible.set(false);
  }

  cancel(): void {
    this.cancelled.emit();
    this.visible.set(false);
  }
}
