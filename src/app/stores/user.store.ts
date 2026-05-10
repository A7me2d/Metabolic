import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { User, DailyTargets, ActivityLevel } from '../models';
import { DataService } from '../services/data';
import { MetabolismService } from '../services/metabolism';
import { AuthService } from '../services/supabase';
import { UiFeedbackService } from '../services/ui';

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private dataService = inject(DataService);
  private metabolismService = inject(MetabolismService);
  private authService = inject(AuthService);
  private ui = inject(UiFeedbackService);

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
    
    // Persist profile changes after the initial load
    effect(() => {
      const user = this._user();
      if (user) {
        void this.dataService.saveUser(user);
      }
    });
  }

  // Actions
  async loadUser(): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const user = await this.dataService.getUser();
      this._user.set(user);
    } catch (e) {
      this._error.set('Failed to load user data');
      console.error('Failed to load user:', e);
      this.ui.error('Failed to load user data.');
    } finally {
      this._isLoading.set(false);
    }
  }

  async createUser(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    password: string
  ): Promise<User> {
    const now = new Date().toISOString();
    const signUpResult = await this.authService.signUp(userData.email ?? '', password, {
      name: userData.name,
      age: userData.age,
      weight: userData.weight,
      height: userData.height,
      gender: userData.gender,
      activity_level: userData.activityLevel,
      goal: userData.goal
    });

    if (!signUpResult.hasSession) {
      throw new Error('Account created. If email confirmation is enabled in Supabase, confirm your email first, then sign in.');
    }

    const user = await this.dataService.getUser();
    if (!user) {
      throw new Error('User signup succeeded, but profile could not be loaded.');
    }

    this._user.set({
      ...user,
      createdAt: user.createdAt ?? now,
      updatedAt: user.updatedAt ?? now
    });
    return user;
  }

  async login(email: string, password: string): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      await this.authService.signIn(email, password);
      const user = await this.dataService.getUser();
      this._user.set(user);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to sign in';
      this._error.set(message);
      throw e;
    } finally {
      this._isLoading.set(false);
    }
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

  async logout(): Promise<void> {
    await this.authService.signOut();
    this._user.set(null);
  }
}
