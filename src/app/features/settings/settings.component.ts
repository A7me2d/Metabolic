import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { StorageService } from '../../core/services/storage.service';
import { TranslationService } from '../../core/services/translation.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen">
      <!-- Hero Header -->
      <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-dark-950 to-accent-600/10"></div>
        <div class="absolute inset-0">
          <div class="absolute top-10 left-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 right-20 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div class="relative mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <header class="mb-10 animate-fade-in">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <div>
                <h1 class="text-4xl md:text-5xl font-black text-gradient">{{ t('settings.title') }}</h1>
                <p class="text-lg text-dark-400 mt-1">{{ t('settings.preferences') }}</p>
              </div>
            </div>
          </header>

          <!-- Account Section -->
          <section class="card p-6 md:p-8 mb-6 animate-slide-up">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">Account</h2>
            </div>
            
            <div class="flex items-center gap-4 p-4 rounded-xl bg-dark-700/30 mb-4">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span class="text-xl font-bold text-white">{{ userInitial() }}</span>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-white">{{ userEmail() }}</div>
                <div class="text-sm text-dark-400">Signed in</div>
              </div>
            </div>

            <button 
              class="btn btn-secondary w-full justify-start p-5 group"
              (click)="logout()"
            >
              <div class="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <div class="text-left">
                <div class="font-semibold">Sign Out</div>
                <div class="text-xs text-dark-400">Log out of your account</div>
              </div>
            </button>
          </section>

          <!-- Theme Settings -->
          <section class="card p-6 md:p-8 mb-6 animate-slide-up">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">{{ t('settings.preferences') }}</h2>
            </div>
            
            <div class="space-y-6">
              <!-- Dark Mode Toggle -->
              <div class="flex items-center justify-between p-4 rounded-xl bg-dark-700/30 group hover:bg-dark-700/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-500/20 flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-white">{{ t('settings.darkMode') }}</div>
                    <div class="text-sm text-dark-400">{{ t('settings.darkModeDesc') }}</div>
                  </div>
                </div>
                <button 
                  class="relative w-14 h-8 rounded-full transition-all duration-300"
                  [class.bg-primary-600]="isDarkMode()"
                  [class.bg-dark-600]="!isDarkMode()"
                  (click)="toggleTheme()"
                >
                  <span 
                    class="absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-lg"
                    [class.translate-x-7]="isDarkMode()"
                    [class.translate-x-1]="!isDarkMode()"
                  ></span>
                </button>
              </div>

              <!-- Language Toggle -->
              <div class="flex items-center justify-between p-4 rounded-xl bg-dark-700/30 group hover:bg-dark-700/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/20 flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-white">{{ t('settings.language') }}</div>
                    <div class="text-sm text-dark-400">{{ t('settings.languageDesc') }}</div>
                  </div>
                </div>
                <button 
                  class="btn btn-ghost px-4 py-2 text-sm font-bold"
                  (click)="toggleLanguage()"
                >
                  {{ isArabic() ? 'English' : 'العربية' }}
                </button>
              </div>

              <!-- Weight Unit -->
              <div class="flex items-center justify-between p-4 rounded-xl bg-dark-700/30 group hover:bg-dark-700/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/20 flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-white">{{ t('settings.weightUnit') }}</div>
                    <div class="text-sm text-dark-400">{{ t('settings.kilograms') }}</div>
                  </div>
                </div>
                <select 
                  class="input w-auto px-4 py-2 text-sm font-medium"
                  [(ngModel)]="weightUnit"
                  (change)="onUnitChange()"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Calculators -->
          <section class="card p-6 md:p-8 mb-6 animate-slide-up">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">Calculators</h2>
            </div>
            
            <div class="grid sm:grid-cols-2 gap-4">
              <button 
                class="btn btn-secondary justify-start p-5 group"
                (click)="showBMICalculator.set(!showBMICalculator())"
              >
                <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-semibold">BMI Calculator</div>
                  <div class="text-xs text-dark-400">Body Mass Index</div>
                </div>
              </button>
              <button 
                class="btn btn-secondary justify-start p-5 group"
                (click)="showCalorieCalculator.set(!showCalorieCalculator())"
              >
                <div class="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-semibold">Calorie Calculator</div>
                  <div class="text-xs text-dark-400">Daily Energy Needs</div>
                </div>
              </button>
            </div>

            <!-- BMI Calculator -->
            @if (showBMICalculator()) {
              <div class="mt-6 p-6 rounded-xl bg-dark-700/30 animate-slide-down">
                <h3 class="font-bold text-white mb-5">BMI Calculator</h3>
                <div class="grid sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label class="label">Height (cm)</label>
                    <input type="number" class="input" [(ngModel)]="bmiHeight" placeholder="175" />
                  </div>
                  <div>
                    <label class="label">Weight (kg)</label>
                    <input type="number" class="input" [(ngModel)]="bmiWeight" placeholder="70" />
                  </div>
                </div>
                <button class="btn btn-primary w-full mb-5" (click)="calculateBMI()">Calculate BMI</button>
                @if (bmiResult() !== null) {
                  <div class="text-center p-6 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/5">
                    <div class="text-4xl font-bold text-primary-400 mb-2">{{ bmiResult() | number:'1.1' }}</div>
                    <div class="badge badge-primary">{{ bmiCategory() }}</div>
                  </div>
                }
              </div>
            }

            <!-- Calorie Calculator -->
            @if (showCalorieCalculator()) {
              <div class="mt-6 p-6 rounded-xl bg-dark-700/30 animate-slide-down">
                <h3 class="font-bold text-white mb-5">TDEE Calculator</h3>
                <div class="grid sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label class="label">Age</label>
                    <input type="number" class="input" [(ngModel)]="calorieAge" placeholder="25" />
                  </div>
                  <div>
                    <label class="label">Gender</label>
                    <select class="input" [(ngModel)]="calorieGender">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label class="label">Height (cm)</label>
                    <input type="number" class="input" [(ngModel)]="calorieHeight" placeholder="175" />
                  </div>
                  <div>
                    <label class="label">Weight (kg)</label>
                    <input type="number" class="input" [(ngModel)]="calorieWeight" placeholder="70" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="label">Activity Level</label>
                    <select class="input" [(ngModel)]="calorieActivity">
                      <option value="1.2">Sedentary (little or no exercise)</option>
                      <option value="1.375">Light (1-3 days/week)</option>
                      <option value="1.55">Moderate (3-5 days/week)</option>
                      <option value="1.725">Active (6-7 days/week)</option>
                      <option value="1.9">Very Active (hard exercise daily)</option>
                    </select>
                  </div>
                </div>
                <button class="btn btn-primary w-full mb-5" (click)="calculateCalories()">Calculate TDEE</button>
                @if (calorieResult() !== null) {
                  <div class="grid grid-cols-3 gap-3 text-center">
                    <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <div class="text-2xl font-bold text-amber-400">{{ calorieResult()! - 500 }}</div>
                      <div class="text-xs text-dark-400 mt-1">Weight Loss</div>
                    </div>
                    <div class="p-4 rounded-xl bg-primary-500/10 border border-primary-500/30">
                      <div class="text-2xl font-bold text-primary-400">{{ calorieResult() }}</div>
                      <div class="text-xs text-dark-400 mt-1">Maintenance</div>
                    </div>
                    <div class="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                      <div class="text-2xl font-bold text-green-400">{{ calorieResult()! + 500 }}</div>
                      <div class="text-xs text-dark-400 mt-1">Muscle Gain</div>
                    </div>
                  </div>
                }
              </div>
            }
          </section>

          <!-- Data Management -->
          <section class="card p-6 md:p-8 mb-6 animate-slide-up">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">Data Management</h2>
            </div>
            
            <div class="space-y-4">
              <button class="btn btn-secondary w-full justify-start p-5 group" (click)="exportData()">
                <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-semibold">Export Workout Summary</div>
                  <div class="text-xs text-dark-400">Download your progress data</div>
                </div>
              </button>
              
              <button 
                class="btn btn-danger w-full justify-start p-5 group"
                (click)="confirmReset.set(true)"
              >
                <div class="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-semibold">Reset All Progress</div>
                  <div class="text-xs text-dark-400">Delete all workout history</div>
                </div>
              </button>
            </div>

            <!-- Reset Confirmation -->
            @if (confirmReset()) {
              <div class="mt-6 p-6 rounded-xl bg-red-500/10 border border-red-500/30 animate-slide-down">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <div>
                    <div class="font-bold text-white">Warning!</div>
                    <div class="text-sm text-dark-300">This action cannot be undone</div>
                  </div>
                </div>
                <p class="text-dark-300 mb-5">Are you sure? This will delete all your workout history and progress.</p>
                <div class="flex gap-3">
                  <button class="btn btn-danger flex-1" (click)="resetProgress()">Yes, Reset</button>
                  <button class="btn btn-secondary flex-1" (click)="confirmReset.set(false)">Cancel</button>
                </div>
              </div>
            }
          </section>

          <!-- About -->
          <section class="card p-6 md:p-8 animate-slide-up">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">About</h2>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6.5 4.5a2 2 0 0 0-3 0l-.5.5a2 2 0 0 0 0 3l1.5 1.5"/>
                  <path d="M17.5 4.5a2 2 0 0 1 3 0l.5.5a2 2 0 0 1 0 3l-1.5 1.5"/>
                  <path d="M8 12h8"/>
                </svg>
              </div>
              <div>
                <p class="font-bold text-white text-lg">Hypertrophy Pro</p>
                <p class="text-sm text-dark-400">Version 1.0.0</p>
                <p class="text-sm text-dark-500 mt-1">A modern workout tracking app for serious lifters</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  private themeService = inject(ThemeService);
  private storageService = inject(StorageService);
  private translationService = inject(TranslationService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  isDarkMode = this.themeService.isDarkMode;
  isArabic = this.translationService.isArabic;
  weightUnit = signal('kg');
  
  showBMICalculator = signal(false);
  showCalorieCalculator = signal(false);
  confirmReset = signal(false);
  
  // BMI Calculator
  bmiHeight = 175;
  bmiWeight = 70;
  bmiResult = signal<number | null>(null);
  bmiCategory = signal('');

  // Calorie Calculator
  calorieAge = 25;
  calorieGender = 'male';
  calorieHeight = 175;
  calorieWeight = 70;
  calorieActivity = 1.55;
  calorieResult = signal<number | null>(null);

  // User info
  userEmail = () => {
    const user = this.supabaseService.user();
    return user?.email || 'User';
  };
  
  userInitial = () => {
    const user = this.supabaseService.user();
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  t(key: string): string {
    return this.translationService.t(key);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  onUnitChange(): void {
    localStorage.setItem('hypertrophy_weight_unit', this.weightUnit());
  }

  async logout(): Promise<void> {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }

  calculateBMI(): void {
    const heightM = this.bmiHeight / 100;
    const bmi = this.bmiWeight / (heightM * heightM);
    this.bmiResult.set(bmi);
    
    if (bmi < 18.5) {
      this.bmiCategory.set('Underweight');
    } else if (bmi < 25) {
      this.bmiCategory.set('Normal weight');
    } else if (bmi < 30) {
      this.bmiCategory.set('Overweight');
    } else {
      this.bmiCategory.set('Obese');
    }
  }

  calculateCalories(): void {
    let bmr: number;
    
    if (this.calorieGender === 'male') {
      bmr = 88.362 + (13.397 * this.calorieWeight) + (4.799 * this.calorieHeight) - (5.677 * this.calorieAge);
    } else {
      bmr = 447.593 + (9.247 * this.calorieWeight) + (3.098 * this.calorieHeight) - (4.330 * this.calorieAge);
    }
    
    const tdee = bmr * this.calorieActivity;
    this.calorieResult.set(Math.round(tdee));
  }

  exportData(): void {
    const stats = this.storageService.getUserStats();
    const logs = this.storageService.getWorkoutLogs();
    
    const data = {
      exportDate: new Date().toISOString(),
      stats,
      workoutLogs: logs
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hypertrophy-workout-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  resetProgress(): void {
    this.storageService.clearAllData();
    this.confirmReset.set(false);
    window.location.reload();
  }
}
