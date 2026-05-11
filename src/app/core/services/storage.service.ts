import { Injectable, inject } from '@angular/core';
import { WorkoutLog, WeeklyProgress, UserStats } from '../models/exercise.model';
import { SupabaseDatabaseService } from './supabase-database.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private databaseService = inject(SupabaseDatabaseService);
  private readonly THEME_KEY = 'hypertrophy_theme';

  // Workout Logs
  getWorkoutLogs(): WorkoutLog[] {
    return this.databaseService.workoutLogs();
  }

  async saveWorkoutLog(log: WorkoutLog): Promise<{ success: boolean; error?: string }> {
    return this.databaseService.saveWorkoutLog(log);
  }

  async deleteWorkoutLog(id: string): Promise<{ success: boolean; error?: string }> {
    return this.databaseService.deleteWorkoutLog(id);
  }

  getWorkoutLogsByDateRange(startDate: string, endDate: string): WorkoutLog[] {
    return this.databaseService.getWorkoutLogsByDateRange(startDate, endDate);
  }

  getWorkoutLogsByDay(dayId: number): WorkoutLog[] {
    return this.databaseService.getWorkoutLogsByDay(dayId);
  }

  // User Stats
  getUserStats(): UserStats {
    return this.databaseService.userStats() || {
      totalWorkouts: 0,
      totalVolume: 0,
      totalSets: 0,
      totalReps: 0,
      personalRecords: {},
      personalRecordsCount: 0,
      streak: 0,
      lastWorkoutDate: null
    };
  }

  async saveUserStats(stats: UserStats): Promise<void> {
    await this.databaseService.updateUserStats(stats);
  }

  // Theme (still uses localStorage for theme preference)
  getTheme(): 'dark' | 'light' {
    const theme = localStorage.getItem(this.THEME_KEY);
    return (theme as 'dark' | 'light') || 'dark';
  }

  saveTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    // This will clear all workout logs from the database
    const logs = this.getWorkoutLogs();
    for (const log of logs) {
      await this.deleteWorkoutLog(log.id);
    }
    await this.saveUserStats({
      totalWorkouts: 0,
      totalVolume: 0,
      totalSets: 0,
      totalReps: 0,
      personalRecords: {},
      personalRecordsCount: 0,
      streak: 0,
      lastWorkoutDate: null
    });
  }
}
