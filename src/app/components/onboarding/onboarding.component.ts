import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../../stores';
import { ActivityLevel } from '../../models';

@Component({
  selector: 'app-onboarding',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative min-h-screen overflow-hidden px-4 py-8 md:px-6">
      <div class="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section class="glass-panel rounded-[2.5rem] p-7 md:p-10">
          <div class="max-w-xl">
            <div class="inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
              Elite nutrition setup
            </div>
            <h1 class="mt-6 text-4xl font-bold text-white md:text-6xl">Build a profile that actually drives better food decisions.</h1>
            <p class="mt-4 text-sm leading-7 text-slate-300 md:text-base">
              This setup dials in calorie targets and macro pacing so the tracker feels personal from the first log.
            </p>

            <div class="mt-8 grid gap-3 md:grid-cols-3">
              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div class="text-sm font-semibold text-white">Fast setup</div>
                <div class="mt-2 text-sm text-slate-400">Three steps to a calibrated plan.</div>
              </div>
              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div class="text-sm font-semibold text-white">Adaptive targets</div>
                <div class="mt-2 text-sm text-slate-400">Calories and macros shaped around your goal.</div>
              </div>
              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div class="text-sm font-semibold text-white">Built for momentum</div>
                <div class="mt-2 text-sm text-slate-400">A cleaner system means easier consistency.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="glass-panel rounded-[2.5rem] p-6 md:p-8">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <div class="text-xs uppercase tracking-[0.3em] text-slate-500">Step {{ currentStep() }} of 3</div>
              <h2 class="mt-2 text-2xl font-bold text-white">Dial in your baseline</h2>
            </div>
            <div class="flex gap-2">
              <div
                *ngFor="let step of [1, 2, 3]"
                class="h-2.5 w-10 rounded-full transition-all duration-300"
                [class.bg-emerald-300]="currentStep() === step"
                [class.bg-white/15]="currentStep() !== step">
              </div>
            </div>
          </div>

          <div *ngIf="currentStep() === 1" class="space-y-4">
            <div>
              <h3 class="text-xl font-semibold text-white">Basic stats</h3>
              <p class="mt-1 text-sm text-slate-400">We use this to estimate energy demand and macro distribution.</p>
            </div>

            <input
              type="text"
              [(ngModel)]="name"
              placeholder="Your name"
              class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Age</label>
                <input
                  type="number"
                  [(ngModel)]="age"
                  placeholder="25"
                  class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
              </div>
              <div>
                <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Gender</label>
                <select
                  [(ngModel)]="gender"
                  class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Weight kg</label>
                <input
                  type="number"
                  [(ngModel)]="weight"
                  placeholder="70"
                  class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
              </div>
              <div>
                <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Height cm</label>
                <input
                  type="number"
                  [(ngModel)]="height"
                  placeholder="175"
                  class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
              </div>
            </div>

            <button
              (click)="nextStep()"
              [disabled]="!name || !age || !weight || !height"
              class="w-full rounded-2xl bg-linear-to-r from-emerald-400 via-lime-300 to-orange-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40">
              Continue
            </button>
          </div>

          <div *ngIf="currentStep() === 2" class="space-y-4">
            <div>
              <h3 class="text-xl font-semibold text-white">Activity level</h3>
              <p class="mt-1 text-sm text-slate-400">Choose the option that best matches your real weekly movement.</p>
            </div>

            <button
              *ngFor="let level of activityLevels"
              (click)="activityLevel.set(level.value)"
              class="w-full rounded-[1.5rem] border p-4 text-left transition"
              [class.border-emerald-300/35]="activityLevel() === level.value"
              [class.bg-emerald-300/10]="activityLevel() === level.value"
              [class.border-white/10]="activityLevel() !== level.value"
              [class.bg-white/5]="activityLevel() !== level.value">
              <div class="font-semibold text-white">{{ level.label }}</div>
              <div class="mt-1 text-sm text-slate-400">{{ level.description }}</div>
            </button>

            <button
              (click)="nextStep()"
              [disabled]="!activityLevel()"
              class="w-full rounded-2xl bg-linear-to-r from-emerald-400 via-lime-300 to-orange-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40">
              Continue
            </button>
          </div>

          <div *ngIf="currentStep() === 3" class="space-y-4">
            <div>
              <h3 class="text-xl font-semibold text-white">Primary goal</h3>
              <p class="mt-1 text-sm text-slate-400">Pick the outcome you want the app to optimize for.</p>
            </div>

            <button
              *ngFor="let goal of goals"
              (click)="selectedGoal.set(goal.value)"
              class="w-full rounded-[1.5rem] border p-4 text-left transition"
              [class.border-orange-300/35]="selectedGoal() === goal.value"
              [class.bg-orange-300/10]="selectedGoal() === goal.value"
              [class.border-white/10]="selectedGoal() !== goal.value"
              [class.bg-white/5]="selectedGoal() !== goal.value">
              <div class="font-semibold text-white">{{ goal.label }}</div>
              <div class="mt-1 text-sm text-slate-400">{{ goal.description }}</div>
            </button>

            <button
              (click)="complete()"
              [disabled]="!selectedGoal()"
              class="w-full rounded-2xl bg-linear-to-r from-emerald-400 via-lime-300 to-orange-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40">
              Launch dashboard
            </button>
          </div>
        </section>
      </div>
    </div>
  `
})
export class OnboardingComponent {
  private userStore = inject(UserStore);

  protected currentStep = signal(1);
  protected name = '';
  protected age: number | null = null;
  protected gender: 'male' | 'female' = 'male';
  protected weight: number | null = null;
  protected height: number | null = null;
  protected activityLevel = signal<ActivityLevel | null>(null);
  protected selectedGoal = signal<'lose' | 'maintain' | 'gain' | null>(null);

  protected activityLevels = [
    { value: 'sedentary' as ActivityLevel, label: 'Sedentary', description: 'Little to no exercise.' },
    { value: 'light' as ActivityLevel, label: 'Lightly active', description: 'Light exercise 1 to 3 days each week.' },
    { value: 'moderate' as ActivityLevel, label: 'Moderately active', description: 'Training or steady movement 3 to 5 days weekly.' },
    { value: 'active' as ActivityLevel, label: 'Active', description: 'Hard exercise 6 to 7 days a week.' },
    { value: 'very_active' as ActivityLevel, label: 'Very active', description: 'Very hard exercise or a physical job.' }
  ];

  protected goals = [
    { value: 'lose' as const, label: 'Lose weight', description: 'Create a controlled calorie deficit.' },
    { value: 'maintain' as const, label: 'Maintain weight', description: 'Balance intake to stay steady.' },
    { value: 'gain' as const, label: 'Gain weight', description: 'Support muscle and size with a surplus.' }
  ];

  nextStep(): void {
    this.currentStep.update((step) => step + 1);
  }

  async complete(): Promise<void> {
    if (!this.name || !this.age || !this.weight || !this.height || !this.activityLevel() || !this.selectedGoal()) {
      return;
    }

    await this.userStore.createUser({
      name: this.name,
      age: this.age,
      gender: this.gender,
      weight: this.weight,
      height: this.height,
      activityLevel: this.activityLevel()!,
      goal: this.selectedGoal()!
    });
  }
}
