import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { SupabaseDatabaseService } from '../../core/services/supabase-database.service';
import { ActivityLevel } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 relative isolate">
      <!-- Background Effects -->
      <div class="fixed inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 -z-10 pointer-events-none">
        <div class="absolute top-20 left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Login Card -->
      <div class="relative z-10 w-full max-w-md pointer-events-auto">
        <div class="card p-8 animate-fade-in">
          <!-- Logo -->
          <div class="text-center mb-8">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow mb-4">
              <svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6.5 4.5a2 2 0 0 0-3 0l-.5.5a2 2 0 0 0 0 3l1.5 1.5"/>
                <path d="M17.5 4.5a2 2 0 0 1 3 0l.5.5a2 2 0 0 1 0 3l-1.5 1.5"/>
                <path d="M8 12h8"/>
              </svg>
            </div>
            <h1 class="text-3xl font-black text-gradient">Hypertrophy Pro</h1>
            <p class="text-dark-400 mt-2">Track your gains, build your strength</p>
          </div>

          <!-- Tab Switcher -->
          <div class="flex mb-6 bg-dark-800 rounded-xl p-1 relative z-20 pointer-events-auto">
            <button 
              type="button"
              class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300"
              [class.bg-primary-600]="!isRegisterMode()"
              [class.text-white]="!isRegisterMode()"
              [class.text-dark-400]="isRegisterMode()"
              (click)="isRegisterMode.set(false)"
            >
              Sign In
            </button>
            <button 
              type="button"
              class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300"
              [class.bg-primary-600]="isRegisterMode()"
              [class.text-white]="isRegisterMode()"
              [class.text-dark-400]="!isRegisterMode()"
              (click)="isRegisterMode.set(true)"
            >
              Register
            </button>
          </div>

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {{ errorMessage() }}
            </div>
          }

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Display Name (Register Only) -->
            @if (isRegisterMode()) {
              <div>
                <label class="label">Display Name</label>
                <input 
                  type="text" 
                  class="input"
                  [(ngModel)]="displayName"
                  name="displayName"
                  placeholder="Your name"
                />
              </div>
            }

            <!-- Profile Fields (Register Only) -->
            @if (isRegisterMode()) {
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label">Age</label>
                  <input
                    type="number"
                    class="input"
                    [(ngModel)]="age"
                    name="age"
                    placeholder="25"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label class="label">Gender</label>
                  <select class="input" [(ngModel)]="gender" name="gender" required>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label">Weight (kg)</label>
                  <input
                    type="number"
                    class="input"
                    [(ngModel)]="weight"
                    name="weight"
                    placeholder="70"
                    required
                    min="1"
                    step="0.1"
                  />
                </div>

                <div>
                  <label class="label">Height (cm)</label>
                  <input
                    type="number"
                    class="input"
                    [(ngModel)]="height"
                    name="height"
                    placeholder="175"
                    required
                    min="1"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label class="label">Activity Level</label>
                <select class="input" [(ngModel)]="activityLevel" name="activityLevel" required>
                  <option *ngFor="let level of activityLevels" [value]="level.value">{{ level.label }}</option>
                </select>
              </div>

              <div>
                <label class="label">Plan</label>
                <select class="input" [(ngModel)]="goal" name="goal" required>
                  <option *ngFor="let g of goals" [value]="g.value">{{ g.label }}</option>
                </select>
              </div>
            }

            <!-- Email -->
            <div>
              <label class="label">Email</label>
              <input 
                type="email" 
                class="input"
                [(ngModel)]="email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <!-- Password -->
            <div>
              <label class="label">Password</label>
              <div class="relative">
                <input 
                  [type]="showPassword() ? 'text' : 'password'" 
                  class="input pr-12"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  [minlength]="6"
                />
                <button 
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                  (click)="showPassword.set(!showPassword())"
                >
                  @if (showPassword()) {
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  } @else {
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  }
                </button>
              </div>
            </div>

            <!-- Confirm Password (Register Only) -->
            @if (isRegisterMode()) {
              <div>
                <label class="label">Confirm Password</label>
                <input 
                  type="password" 
                  class="input"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                />
              </div>
            }

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="btn btn-primary w-full py-4 text-lg font-bold"
              [disabled]="isLoading()"
            >
              @if (isLoading()) {
                <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                </svg>
                <span class="ml-2">Processing...</span>
              } @else {
                {{ isRegisterMode() ? 'Create Account' : 'Sign In' }}
              }
            </button>
          </form>

          <!-- Forgot Password (Login Only) -->
          @if (!isRegisterMode()) {
            <div class="mt-4 text-center">
              <button 
                class="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                (click)="onForgotPassword()"
              >
                Forgot password?
              </button>
            </div>
          }

          <!-- Features -->
          <div class="mt-8 pt-6 border-t border-dark-700">
            <p class="text-center text-dark-400 text-sm mb-4">Your data is securely stored in the cloud</p>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div class="p-3 rounded-xl bg-dark-800/50">
                <div class="text-primary-400 mb-1">
                  <svg class="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div class="text-xs text-dark-400">Secure</div>
              </div>
              <div class="p-3 rounded-xl bg-dark-800/50">
                <div class="text-accent-400 mb-1">
                  <svg class="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div class="text-xs text-dark-400">Cloud Sync</div>
              </div>
              <div class="p-3 rounded-xl bg-dark-800/50">
                <div class="text-green-400 mb-1">
                  <svg class="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div class="text-xs text-dark-400">Track History</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private supabaseService = inject(SupabaseService);
  private databaseService = inject(SupabaseDatabaseService);
  private router = inject(Router);

  isRegisterMode = signal(false);
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  email = '';
  password = '';
  confirmPassword = '';
  displayName = '';

  age: number | null = null;
  weight: number | null = null;
  height: number | null = null;
  gender: 'male' | 'female' = 'male';
  activityLevel: ActivityLevel = 'moderate';
  goal: 'lose' | 'maintain' | 'gain' = 'maintain';

  protected activityLevels: Array<{ value: ActivityLevel; label: string }> = [
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'active', label: 'Active' },
    { value: 'very_active', label: 'Very active' }
  ];

  protected goals: Array<{ value: 'lose' | 'maintain' | 'gain'; label: string }> = [
    { value: 'lose', label: 'Lose' },
    { value: 'maintain', label: 'Maintain' },
    { value: 'gain', label: 'Gain' }
  ];

  async onSubmit(): Promise<void> {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    try {
      if (this.isRegisterMode()) {
        await this.register();
      } else {
        await this.login();
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  private async register(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    if (!this.displayName) {
      this.errorMessage.set('Please enter your name');
      return;
    }

    if (!this.age || this.age <= 0) {
      this.errorMessage.set('Please enter a valid age');
      return;
    }

    if (!this.weight || this.weight <= 0) {
      this.errorMessage.set('Please enter a valid weight');
      return;
    }

    if (!this.height || this.height <= 0) {
      this.errorMessage.set('Please enter a valid height');
      return;
    }

    const result = await this.supabaseService.signUp(this.email, this.password, {
      name: this.displayName,
      age: this.age,
      weight: this.weight,
      height: this.height,
      gender: this.gender,
      activity_level: this.activityLevel,
      goal: this.goal
    });

    if (result.success) {
      // Load initial data
      await this.databaseService.loadWorkoutDays();
      await this.databaseService.loadUserStats();
      this.router.navigate(['/nutrition']);
    } else {
      this.errorMessage.set(result.error || 'Registration failed');
    }
  }

  private async login(): Promise<void> {
    const result = await this.supabaseService.signIn(this.email, this.password);

    if (result.success) {
      // Load user data
      await this.databaseService.loadWorkoutDays();
      await this.databaseService.loadWorkoutLogs();
      await this.databaseService.loadUserStats();
      this.router.navigate(['/nutrition']);
    } else {
      this.errorMessage.set(result.error || 'Login failed');
    }
  }

  async onForgotPassword(): Promise<void> {
    if (!this.email) {
      this.errorMessage.set('Please enter your email address');
      return;
    }

    this.isLoading.set(true);
    const result = await this.supabaseService.resetPassword(this.email);
    this.isLoading.set(false);

    if (result.success) {
      this.errorMessage.set('Password reset email sent! Check your inbox.');
    } else {
      this.errorMessage.set(result.error || 'Failed to send reset email');
    }
  }
}
