import { Injectable } from '@angular/core';
import { User, ActivityLevel, DailyTargets, ACTIVITY_MULTIPLIERS } from '../../models';

/**
 * Mifflin-St Jeor Equation Service
 * Calculates BMR (Basal Metabolic Rate) and TDEE (Total Daily Energy Expenditure)
 */
@Injectable({
  providedIn: 'root'
})
export class MetabolismService {
  /**
   * Calculate BMR using Mifflin-St Jeor Equation
   * Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) + 5
   * Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) - 161
   */
  calculateBMR(user: Pick<User, 'weight' | 'height' | 'age' | 'gender'>): number {
    const { weight, height, age, gender } = user;
    
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? base + 5 : base - 161;
  }

  /**
   * Calculate TDEE (Total Daily Energy Expenditure)
   * TDEE = BMR × Activity Multiplier
   */
  calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
    return Math.round(bmr * multiplier);
  }

  /**
   * Calculate daily calorie targets for different goals
   * - Lose: TDEE - 500 (approx 0.5kg/week loss)
   * - Maintain: TDEE
   * - Gain: TDEE + 500 (approx 0.5kg/week gain)
   */
  calculateDailyTargets(user: User): DailyTargets {
    const bmr = this.calculateBMR(user);
    const tdee = this.calculateTDEE(bmr, user.activityLevel);
    
    return {
      lose: Math.round(tdee - 500),
      maintain: tdee,
      gain: Math.round(tdee + 500)
    };
  }

  /**
   * Get target calories based on user's goal
   */
  getTargetCalories(user: User): number {
    const targets = this.calculateDailyTargets(user);
    return targets[user.goal];
  }

  /**
   * Calculate macros distribution based on goal
   * Returns grams per day for protein, carbs, fat
   */
  calculateMacroTargets(user: User): { protein: number; carbs: number; fat: number } {
    const targetCalories = this.getTargetCalories(user);
    const weight = user.weight;
    
    // Protein: 1.6-2.2g per kg body weight (using 2g for active, 1.6 for sedentary)
    const proteinMultiplier = user.activityLevel === 'sedentary' ? 1.6 : 2.0;
    const protein = Math.round(weight * proteinMultiplier);
    
    // Fat: 25-30% of calories (using 25% for weight loss, 30% for gain)
    const fatPercentage = user.goal === 'lose' ? 0.25 : user.goal === 'gain' ? 0.30 : 0.275;
    const fat = Math.round((targetCalories * fatPercentage) / 9); // 9 cal per gram fat
    
    // Carbs: remaining calories
    const proteinCalories = protein * 4; // 4 cal per gram protein
    const fatCalories = fat * 9;
    const remainingCalories = targetCalories - proteinCalories - fatCalories;
    const carbs = Math.round(remainingCalories / 4); // 4 cal per gram carbs
    
    return { protein, carbs, fat };
  }
}
