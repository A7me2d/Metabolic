import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { User, DailyTargets, ActivityLevel } from '../models';
import { LocalStorageService } from '../services/data';
import { MetabolismService } from '../services/metabolism';

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private dataService = inject(LocalStorageService);
  private metabolismService = inject(MetabolismService);

  // Core state
  private _user = signal<User | null>(null);
  private _isLoading = signal(true);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed values
  readonly isLoggedIn = computed(() => this._user() !== null);
  
  readonly dailyTargets = computed<DailyTargets | null>(() => {
    const user = this._user();
    if (!user) return null;
    return this.metabolismService.calculateDailyTargets(user);
  });

  readonly targetCalories = computed<number | null>(() => {
    const user = this._user();
    if (!user) return null;
    return this.metabolismService.getTargetCalories(user);
  });

  readonly macroTargets = computed<{ protein: number; carbs: number; fat: number } | null>(() => {
    const user = this._user();
    if (!user) return null;
    return this.metabolismService.calculateMacroTargets(user);
  });

  readonly bmr = computed<number | null>(() => {
    const user = this._user();
    if (!user) return null;
    return this.metabolismService.calculateBMR(user);
  });

  constructor() {
    // Load user from storage on init
    this.loadUser();
    
    // Persist user changes to storage
    effect(() => {
      const user = this._user();
      if (user) {
        this.dataService.saveUser(user);
      }
    });
  }

  // Actions
  async loadUser(): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      // Check if localStorage is available (not during SSR)
      if (typeof localStorage === 'undefined') {
        this._user.set(null);
        return;
      }
      const user = await this.dataService.getUser();
      this._user.set(user);
    } catch (e) {
      this._error.set('Failed to load user data');
      console.error('Failed to load user:', e);
    } finally {
      this._isLoading.set(false);
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    
    this._user.set(user);
    return user;
  }

  async updateUser(updates: Partial<User>): Promise<void> {
    const currentUser = this._user();
    if (!currentUser) throw new Error('No user to update');
    
    const updated: User = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this._user.set(updated);
  }

  async setGoal(goal: 'lose' | 'maintain' | 'gain'): Promise<void> {
    await this.updateUser({ goal });
  }

  async setActivityLevel(level: ActivityLevel): Promise<void> {
    await this.updateUser({ activityLevel: level });
  }

  logout(): void {
    this._user.set(null);
    localStorage.clear();
  }
}
