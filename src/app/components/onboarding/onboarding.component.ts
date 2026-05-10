import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../../stores';
import { ActivityLevel } from '../../models';
import { UiFeedbackService } from '../../services';

@Component({
  selector: 'app-onboarding',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative min-h-screen overflow-hidden px-3 py-4 sm:px-4 sm:py-8 md:px-6">
      <div class="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-start gap-4 sm:min-h-[calc(100vh-4rem)] sm:gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <section class="glass-panel rounded-[1.75rem] p-5 sm:rounded-[2.5rem] sm:p-7 md:p-10">
          <div class="max-w-xl">
            <div class="inline-flex max-w-full rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-200 sm:text-xs sm:tracking-[0.3em]">
              Supabase connected
            </div>
            <h1 class="mt-5 text-3xl font-bold leading-tight text-white sm:mt-6 sm:text-4xl md:text-6xl">Your nutrition tracker now has real accounts and cloud data.</h1>
            <p class="mt-4 text-sm leading-7 text-slate-300 md:text-base">
              Sign in from any device, keep meals synced, and store every profile, meal, and supplement in Supabase.
            </p>

            <div class="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
              <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
                <div class="text-sm font-semibold text-white">Real login</div>
                <div class="mt-2 text-sm text-slate-400">Email and password auth with Supabase.</div>
              </div>
              <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
                <div class="text-sm font-semibold text-white">Cloud sync</div>
                <div class="mt-2 text-sm text-slate-400">Meals and supplements tied to each user.</div>
              </div>
              <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
                <div class="text-sm font-semibold text-white">Private data</div>
                <div class="mt-2 text-sm text-slate-400">RLS policies protect every account.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="glass-panel rounded-[1.75rem] p-4 sm:rounded-[2.5rem] sm:p-6 md:p-8">
          <div class="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="text-xs uppercase tracking-[0.3em] text-slate-500">
                {{ authMode() === 'signup' ? 'Create account' : 'Welcome back' }}
              </div>
              <h2 class="mt-2 text-xl font-bold text-white sm:text-2xl">
                {{ authMode() === 'signup' ? 'Launch your dashboard' : 'Sign in to continue' }}
              </h2>
            </div>

            <div class="flex w-full rounded-2xl border border-white/10 bg-slate-950/40 p-1 sm:w-auto">
              <button
                (click)="setMode('signup')"
                class="flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition sm:flex-none"
                [class.bg-emerald-300]="authMode() === 'signup'"
                [class.text-slate-950]="authMode() === 'signup'"
                [class.text-slate-400]="authMode() !== 'signup'">
                Sign up
              </button>
              <button
                (click)="setMode('signin')"
                class="flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition sm:flex-none"
                [class.bg-sky-300]="authMode() === 'signin'"
                [class.text-slate-950]="authMode() === 'signin'"
                [class.text-slate-400]="authMode() !== 'signin'">
                Sign in
              </button>
            </div>
          </div>

          <div *ngIf="errorMessage()" class="mb-4 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {{ errorMessage() }}
          </div>

          <div class="space-y-4">
            <div *ngIf="authMode() === 'signup'">
              <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Full name</label>
              <input
                type="text"
                [(ngModel)]="name"
                placeholder="Your name"
                class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
            </div>

            <div>
              <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                placeholder="you@example.com"
                class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
            </div>

            <div>
              <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Password</label>
              <input
                type="password"
                [(ngModel)]="password"
                placeholder="At least 6 characters"
                class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
            </div>

            <div *ngIf="authMode() === 'signup'" class="space-y-4">
              <div class="grid gap-3 min-[420px]:grid-cols-2">
                <div>
                  <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Age</label>
                  <input type="number" [(ngModel)]="age" placeholder="25" class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
                </div>
                <div>
                  <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Gender</label>
                  <select [(ngModel)]="gender" class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div class="grid gap-3 min-[420px]:grid-cols-2">
                <div>
                  <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Weight kg</label>
                  <input type="number" [(ngModel)]="weight" placeholder="70" class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
                </div>
                <div>
                  <label class="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Height cm</label>
                  <input type="number" [(ngModel)]="height" placeholder="175" class="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-emerald-300/40">
                </div>
              </div>

              <div>
                <label class="mb-3 block text-xs uppercase tracking-[0.24em] text-slate-500">Activity level</label>
                <div class="space-y-2">
                  <button
                    *ngFor="let level of activityLevels"
                    (click)="activityLevel.set(level.value)"
                    class="w-full rounded-[1.1rem] border p-3 text-left transition sm:rounded-[1.25rem]"
                    [class.border-emerald-300/35]="activityLevel() === level.value"
                    [class.bg-emerald-300/10]="activityLevel() === level.value"
                    [class.border-white/10]="activityLevel() !== level.value"
                    [class.bg-white/5]="activityLevel() !== level.value">
                    <div class="font-semibold text-white">{{ level.label }}</div>
                    <div class="mt-1 text-sm text-slate-400">{{ level.description }}</div>
                  </button>
                </div>
              </div>

              <div>
                <label class="mb-3 block text-xs uppercase tracking-[0.24em] text-slate-500">Goal</label>
                <div class="grid gap-2 sm:grid-cols-3">
                  <button
                    *ngFor="let goal of goals"
                    (click)="selectedGoal.set(goal.value)"
                    class="rounded-[1.1rem] border p-3 text-left transition sm:rounded-[1.25rem]"
                    [class.border-orange-300/35]="selectedGoal() === goal.value"
                    [class.bg-orange-300/10]="selectedGoal() === goal.value"
                    [class.border-white/10]="selectedGoal() !== goal.value"
                    [class.bg-white/5]="selectedGoal() !== goal.value">
                    <div class="font-semibold text-white">{{ goal.label }}</div>
                    <div class="mt-1 text-sm text-slate-400">{{ goal.description }}</div>
                  </button>
                </div>
              </div>
            </div>

            <button
              (click)="submit()"
              [disabled]="isSubmitting() || !canSubmit()"
              class="w-full rounded-2xl bg-linear-to-r from-emerald-400 via-lime-300 to-orange-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40">
              {{ isSubmitting() ? 'Please wait...' : authMode() === 'signup' ? 'Create account' : 'Sign in' }}
            </button>
          </div>
        </section>
      </div>
    </div>
  `
})
export class OnboardingComponent {
  private userStore = inject(UserStore);
  private ui = inject(UiFeedbackService);

  protected authMode = signal<'signup' | 'signin'>('signup');
  protected isSubmitting = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected name = '';
  protected email = '';
  protected password = '';
  protected age: number | null = null;
  protected gender: 'male' | 'female' = 'male';
  protected weight: number | null = null;
  protected height: number | null = null;
  protected activityLevel = signal<ActivityLevel | null>('moderate');
  protected selectedGoal = signal<'lose' | 'maintain' | 'gain' | null>('maintain');

  protected activityLevels = [
    { value: 'sedentary' as ActivityLevel, label: 'Sedentary', description: 'Little to no exercise.' },
    { value: 'light' as ActivityLevel, label: 'Lightly active', description: 'Light exercise 1 to 3 days each week.' },
    { value: 'moderate' as ActivityLevel, label: 'Moderately active', description: 'Training or steady movement 3 to 5 days weekly.' },
    { value: 'active' as ActivityLevel, label: 'Active', description: 'Hard exercise 6 to 7 days a week.' },
    { value: 'very_active' as ActivityLevel, label: 'Very active', description: 'Very hard exercise or a physical job.' }
  ];

  protected goals = [
    { value: 'lose' as const, label: 'Lose', description: 'Controlled deficit.' },
    { value: 'maintain' as const, label: 'Maintain', description: 'Stay steady.' },
    { value: 'gain' as const, label: 'Gain', description: 'Support growth.' }
  ];

  protected canSubmit(): boolean {
    if (!this.email || !this.password) return false;
    if (this.authMode() === 'signin') return true;

    return !!(
      this.name &&
      this.age &&
      this.weight &&
      this.height &&
      this.activityLevel() &&
      this.selectedGoal()
    );
  }

  protected setMode(mode: 'signup' | 'signin'): void {
    this.authMode.set(mode);
    this.errorMessage.set(null);
  }

  protected async submit(): Promise<void> {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      if (this.authMode() === 'signin') {
        await this.ui.track('Signing you in...', this.userStore.login(this.email, this.password));
        this.ui.success('Welcome back.');
        return;
      }

      await this.ui.track(
        'Creating your account...',
        this.userStore.createUser(
          {
            name: this.name,
            email: this.email,
            age: this.age!,
            gender: this.gender,
            weight: this.weight!,
            height: this.height!,
            activityLevel: this.activityLevel()!,
            goal: this.selectedGoal()!
          },
          this.password
        )
      );
      this.ui.success('Account created successfully.');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong.';
      this.errorMessage.set(message);
      this.ui.error(message);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
