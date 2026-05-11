import { Injectable, inject, signal, computed } from '@angular/core';
import { Exercise, WorkoutDay, WorkoutLog, ExerciseLog, UserStats, WeeklyProgress } from '../models/exercise.model';
import { WORKOUT_DAYS, getWorkoutDay, getExercise } from '../data/workout-data';
import { StorageService } from './storage.service';
import { SupabaseDatabaseService } from './supabase-database.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private databaseService = inject(SupabaseDatabaseService);

  readonly workoutDays = this.databaseService.workoutDays;
  readonly currentWorkout = signal<WorkoutLog | null>(null);
  readonly userStats = this.databaseService.userStats;
  
  // Expose loading states
  readonly loadingDays = this.databaseService.loadingDays;
  readonly loadingLogs = this.databaseService.loadingLogs;
  readonly loadingStats = this.databaseService.loadingStats;
  readonly loading = this.databaseService.loading;

  readonly todayWorkout = computed(() => {
    const dayOfWeek = new Date().getDay();
    // Map days: Saturday(6)=Day1, Sunday(0)=Day2, Monday(1)=Day3, Tuesday(2)=Day4, Wednesday(3)=Day5, Thursday(4)=Day6, Friday(5)=Day7
    const dayMap: { [key: number]: number } = {
      6: 1,  // Saturday → Day 1
      0: 2,  // Sunday → Day 2
      1: 3,  // Monday → Day 3
      2: 4,  // Tuesday → Day 4
      3: 5,  // Wednesday → Day 5
      4: 6,  // Thursday → Day 6
      5: 7   // Friday → Day 7
    };
    const dayId = dayMap[dayOfWeek];
    const days = this.workoutDays();
    return days.find(d => d.id === dayId) || getWorkoutDay(dayId);
  });

  readonly weeklyProgress = computed<WeeklyProgress | null>(() => {
    return this.databaseService.weeklyProgress();
  });

  constructor(private storageService: StorageService) {}

  async initialize(): Promise<void> {
    await this.databaseService.loadWorkoutDays();
    await this.databaseService.loadWorkoutLogs();
    await this.databaseService.loadUserStats();
  }

  getWorkoutDay(id: number): WorkoutDay | undefined {
    const days = this.workoutDays();
    const found = days.find(d => d.id === id);
    return found || getWorkoutDay(id);
  }

  getExercise(id: number): Exercise | undefined {
    return getExercise(id);
  }

  startWorkout(dayId: number): WorkoutLog {
    const log: WorkoutLog = {
      id: this.generateId(),
      date: this.formatDate(new Date()),
      dayId,
      exerciseLogs: [],
      totalVolume: 0,
      duration: 0,
      completed: false
    };
    this.currentWorkout.set(log);
    return log;
  }

  logExercise(exerciseLog: ExerciseLog): void {
    const current = this.currentWorkout();
    if (current) {
      const existingIndex = current.exerciseLogs.findIndex(
        el => el.exerciseId === exerciseLog.exerciseId
      );
      if (existingIndex >= 0) {
        current.exerciseLogs[existingIndex] = exerciseLog;
      } else {
        current.exerciseLogs.push(exerciseLog);
      }
      this.updateTotalVolume();
      this.currentWorkout.set({ ...current });
    }
  }

  async completeWorkout(): Promise<void> {
    const current = this.currentWorkout();
    if (current) {
      current.completed = true;
      await this.storageService.saveWorkoutLog(current);
      await this.updateUserStats(current);
      this.currentWorkout.set(null);
    }
  }

  cancelWorkout(): void {
    this.currentWorkout.set(null);
  }

  getWorkoutHistory(): WorkoutLog[] {
    return this.storageService.getWorkoutLogs();
  }

  getWorkoutLogsForDay(dayId: number): WorkoutLog[] {
    return this.storageService.getWorkoutLogsByDay(dayId);
  }

  calculateVolume(weights: number[], reps: number): number {
    return weights.reduce((sum, weight) => sum + (weight * reps), 0);
  }

  private updateTotalVolume(): void {
    const current = this.currentWorkout();
    if (current) {
      let totalVolume = 0;
      for (const log of current.exerciseLogs) {
        const exercise = this.getExercise(log.exerciseId);
        if (exercise && log.weights.length > 0) {
          const avgReps = this.parseReps(exercise.reps);
          totalVolume += this.calculateVolume(log.weights, avgReps);
        }
      }
      current.totalVolume = totalVolume;
    }
  }

  private async updateUserStats(log: WorkoutLog): Promise<void> {
    const currentStats = this.userStats();
    if (!currentStats) return;

    const stats = { ...currentStats };
    stats.totalWorkouts++;
    stats.totalVolume += log.totalVolume;

    let totalSets = 0;
    let totalReps = 0;

    for (const exerciseLog of log.exerciseLogs) {
      const exercise = this.getExercise(exerciseLog.exerciseId);
      if (exercise) {
        totalSets += exerciseLog.completedSets;
        totalReps += exerciseLog.completedSets * this.parseReps(exercise.reps);

        // Update PRs
        const maxWeight = Math.max(...exerciseLog.weights);
        const currentPR = stats.personalRecords[exercise.name] || 0;
        if (maxWeight > currentPR) {
          stats.personalRecords[exercise.name] = maxWeight;
        }
      }
    }

    stats.personalRecordsCount = Object.keys(stats.personalRecords).length;

    stats.totalSets += totalSets;
    stats.totalReps += totalReps;

    // Update streak
    const lastDate = stats.lastWorkoutDate;
    const today = this.formatDate(new Date());
    if (lastDate) {
      const last = new Date(lastDate);
      const diff = Math.floor((new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        stats.streak++;
      } else if (diff > 1) {
        stats.streak = 1;
      }
    } else {
      stats.streak = 1;
    }
    stats.lastWorkoutDate = today;

    await this.storageService.saveUserStats(stats);
  }

  private parseReps(reps: string): number {
    if (reps.includes('-')) {
      const parts = reps.split('-');
      return (parseInt(parts[0]) + parseInt(parts[1])) / 2;
    }
    if (reps.includes(' each')) {
      return parseInt(reps.replace(' each leg', '').replace(' each', ''));
    }
    return parseInt(reps) || 0;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
