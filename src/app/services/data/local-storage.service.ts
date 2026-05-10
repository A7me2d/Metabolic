import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { User, Meal, Supplement } from '../../models';

const STORAGE_KEYS = {
  USER: 'cal_user',
  MEALS: 'cal_meals',
  SUPPLEMENTS: 'cal_supplements'
};

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService extends DataService {
  private generateId(): string {
    return crypto.randomUUID();
  }

  // SSR-safe localStorage access
  private getStorage(): Storage | null {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  }

  // User operations
  override async getUser(): Promise<User | null> {
    const storage = this.getStorage();
    if (!storage) return null;
    const data = storage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  override async saveUser(user: User): Promise<void> {
    const storage = this.getStorage();
    if (!storage) return;
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  override async updateUser(updates: Partial<User>): Promise<User> {
    const user = await this.getUser();
    if (!user) throw new Error('User not found');
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    await this.saveUser(updated);
    return updated;
  }

  // Meal operations
  private getMealsFromStorage(): Meal[] {
    const storage = this.getStorage();
    if (!storage) return [];
    const data = storage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  }

  private saveMealsToStorage(meals: Meal[]): void {
    const storage = this.getStorage();
    if (!storage) return;
    storage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  }

  override async getMeals(userId: string, date?: string): Promise<Meal[]> {
    const meals = this.getMealsFromStorage().filter(m => m.userId === userId);
    if (!date) return meals;
    
    const targetDate = new Date(date).toDateString();
    return meals.filter(m => new Date(m.timestamp).toDateString() === targetDate);
  }

  override async addMeal(meal: Meal): Promise<Meal> {
    const meals = this.getMealsFromStorage();
    const newMeal = { ...meal, id: meal.id || this.generateId() };
    meals.push(newMeal);
    this.saveMealsToStorage(meals);
    return newMeal;
  }

  override async updateMeal(id: string, updates: Partial<Meal>): Promise<Meal> {
    const meals = this.getMealsFromStorage();
    const index = meals.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Meal not found');
    
    meals[index] = { ...meals[index], ...updates };
    this.saveMealsToStorage(meals);
    return meals[index];
  }

  override async deleteMeal(id: string): Promise<void> {
    const meals = this.getMealsFromStorage().filter(m => m.id !== id);
    this.saveMealsToStorage(meals);
  }

  // Supplement operations
  private getSupplementsFromStorage(): Supplement[] {
    const storage = this.getStorage();
    if (!storage) return [];
    const data = storage.getItem(STORAGE_KEYS.SUPPLEMENTS);
    return data ? JSON.parse(data) : [];
  }

  private saveSupplementsToStorage(supplements: Supplement[]): void {
    const storage = this.getStorage();
    if (!storage) return;
    storage.setItem(STORAGE_KEYS.SUPPLEMENTS, JSON.stringify(supplements));
  }

  override async getSupplements(userId: string, date?: string): Promise<Supplement[]> {
    const supplements = this.getSupplementsFromStorage().filter(s => s.userId === userId);
    if (!date) return supplements;
    
    const targetDate = new Date(date).toDateString();
    return supplements.filter(s => new Date(s.timestamp).toDateString() === targetDate);
  }

  override async addSupplement(supplement: Supplement): Promise<Supplement> {
    const supplements = this.getSupplementsFromStorage();
    const newSupplement = { ...supplement, id: supplement.id || this.generateId() };
    supplements.push(newSupplement);
    this.saveSupplementsToStorage(supplements);
    return newSupplement;
  }

  override async deleteSupplement(id: string): Promise<void> {
    const supplements = this.getSupplementsFromStorage().filter(s => s.id !== id);
    this.saveSupplementsToStorage(supplements);
  }

  // Daily totals
  override async getDailyTotals(userId: string, date: string): Promise<{ meals: Meal[]; supplements: Supplement[] }> {
    const [meals, supplements] = await Promise.all([
      this.getMeals(userId, date),
      this.getSupplements(userId, date)
    ]);
    return { meals, supplements };
  }
}
