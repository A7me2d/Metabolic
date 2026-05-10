import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Meal, Supplement, Macros } from '../models';
import { DataService } from '../services/data';
import { UserStore } from './user.store';
import { UiFeedbackService } from '../services/ui';

@Injectable({
  providedIn: 'root'
})
export class NutritionStore {
  private dataService = inject(DataService);
  private userStore = inject(UserStore);
  private ui = inject(UiFeedbackService);

  // Core state
  private _meals = signal<Meal[]>([]);
  private _supplements = signal<Supplement[]>([]);
  private _selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly meals = this._meals.asReadonly();
  readonly supplements = this._supplements.asReadonly();
  readonly selectedDate = this._selectedDate.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed totals for current day
  readonly dailyTotals = computed<Macros>(() => {
    const meals = this._meals();
    return meals.reduce(
      (acc, meal) => ({
        cal: acc.cal + meal.macros.cal,
        p: acc.p + meal.macros.p,
        c: acc.c + meal.macros.c,
        f: acc.f + meal.macros.f
      }),
      { cal: 0, p: 0, c: 0, f: 0 }
    );
  });

  // Progress percentage
  readonly calorieProgress = computed<number>(() => {
    const totals = this.dailyTotals();
    const target = this.userStore.targetCalories();
    if (!target || target === 0) return 0;
    return Math.min(100, Math.round((totals.cal / target) * 100));
  });

  readonly macroProgress = computed(() => {
    const totals = this.dailyTotals();
    const targets = this.userStore.macroTargets();
    if (!targets) return { protein: 0, carbs: 0, fat: 0 };
    
    return {
      protein: Math.min(100, Math.round((totals.p / targets.protein) * 100)),
      carbs: Math.min(100, Math.round((totals.c / targets.carbs) * 100)),
      fat: Math.min(100, Math.round((totals.f / targets.fat) * 100))
    };
  });

  // Remaining calories
  readonly remainingCalories = computed<number>(() => {
    const totals = this.dailyTotals();
    const target = this.userStore.targetCalories();
    if (!target) return 0;
    return target - totals.cal;
  });

  constructor() {
    // Load data when user or date changes
    effect(() => {
      const user = this.userStore.user();
      const date = this._selectedDate();
      if (user) {
        this.loadDailyData(user.id, date);
      } else {
        this._meals.set([]);
        this._supplements.set([]);
      }
    });

    // Persist meals changes
    effect(() => {
      const meals = this._meals();
      const user = this.userStore.user();
      if (user && meals.length > 0) {
        // Meals are persisted via addMeal/deleteMeal
      }
    });
  }

  // Actions
  async loadDailyData(userId: string, date: string): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const { meals, supplements } = await this.dataService.getDailyTotals(userId, date);
      this._meals.set(meals);
      this._supplements.set(supplements);
    } catch (e) {
      this._error.set('Failed to load nutrition data');
      console.error('Failed to load daily data:', e);
      this.ui.error('Failed to load nutrition data.');
    } finally {
      this._isLoading.set(false);
    }
  }

  setSelectedDate(date: string): void {
    this._selectedDate.set(date);
  }

  async addMeal(meal: Omit<Meal, 'id' | 'createdAt'>): Promise<Meal> {
    const user = this.userStore.user();
    if (!user) throw new Error('No user logged in');
    
    const now = new Date().toISOString();
    const newMeal: Meal = {
      ...meal,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: now
    };
    
    const saved = await this.dataService.addMeal(newMeal);
    this._meals.update(meals => [...meals, saved]);
    return saved;
  }

  async updateMeal(id: string, updates: Partial<Meal>): Promise<void> {
    const updated = await this.dataService.updateMeal(id, updates);
    this._meals.update(meals => 
      meals.map(m => m.id === id ? updated : m)
    );
  }

  async deleteMeal(id: string): Promise<void> {
    await this.dataService.deleteMeal(id);
    this._meals.update(meals => meals.filter(m => m.id !== id));
  }

  async addSupplement(supplement: Omit<Supplement, 'id' | 'createdAt'>): Promise<Supplement> {
    const user = this.userStore.user();
    if (!user) throw new Error('No user logged in');
    
    const now = new Date().toISOString();
    const newSupplement: Supplement = {
      ...supplement,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: now
    };
    
    const saved = await this.dataService.addSupplement(newSupplement);
    this._supplements.update(supplements => [...supplements, saved]);
    return saved;
  }

  async deleteSupplement(id: string): Promise<void> {
    await this.dataService.deleteSupplement(id);
    this._supplements.update(supplements => supplements.filter(s => s.id !== id));
  }

  // Quick add helpers
  async quickAddMeal(foodName: string, macros: Macros, source: 'ai' | 'manual' = 'manual'): Promise<Meal> {
    return this.addMeal({
      userId: this.userStore.user()!.id,
      foodName,
      macros,
      source,
      timestamp: new Date().toISOString()
    });
  }
}
