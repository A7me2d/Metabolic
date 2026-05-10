import { Injectable } from '@angular/core';
import { User, Meal, Supplement } from '../../models';

/**
 * Abstract data service for swappable backend implementations
 * Currently uses LocalStorage, can be replaced with Supabase
 */
@Injectable({
  providedIn: 'root'
})
export abstract class DataService {
  // User operations
  abstract getUser(): Promise<User | null>;
  abstract saveUser(user: User): Promise<void>;
  abstract updateUser(updates: Partial<User>): Promise<User>;

  // Meal operations
  abstract getMeals(userId: string, date?: string): Promise<Meal[]>;
  abstract addMeal(meal: Meal): Promise<Meal>;
  abstract updateMeal(id: string, updates: Partial<Meal>): Promise<Meal>;
  abstract deleteMeal(id: string): Promise<void>;

  // Supplement operations
  abstract getSupplements(userId: string, date?: string): Promise<Supplement[]>;
  abstract addSupplement(supplement: Supplement): Promise<Supplement>;
  abstract deleteSupplement(id: string): Promise<void>;

  // Daily totals
  abstract getDailyTotals(userId: string, date: string): Promise<{ meals: Meal[]; supplements: Supplement[] }>;
}
