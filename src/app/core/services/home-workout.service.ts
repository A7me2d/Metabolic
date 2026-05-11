import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { HomeExercise, HomeWorkoutDay, HomeWorkoutLog, HomeUserProgress, HomeExerciseLog } from '../models/home-workout.model';
import { HOME_WORKOUT_DAYS, getHomeWorkoutDay, getHomeExercise, applyDifficulty } from '../data/home-workout-data';

@Injectable({
  providedIn: 'root'
})
export class HomeWorkoutService {
  private supabaseService = inject(SupabaseService);
  
  // Signals for reactive state
  readonly workoutDays = signal<HomeWorkoutDay[]>(HOME_WORKOUT_DAYS);
  readonly currentWorkout = signal<HomeWorkoutLog | null>(null);
  readonly userProgress = signal<HomeUserProgress>(this.getDefaultProgress());
  readonly difficultyMode = signal<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  
  // Computed values
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
    return this.getWorkoutDay(dayId);
  });
  
  readonly completedDays = computed(() => {
    return this.userProgress().completedDays;
  });
  
  readonly streak = computed(() => {
    return this.userProgress().streak;
  });
  
  readonly totalWorkouts = computed(() => {
    return this.userProgress().totalWorkouts;
  });

  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    await this.loadProgress();
  }

  private getDefaultProgress(): HomeUserProgress {
    return {
      totalWorkouts: 0,
      streak: 0,
      lastWorkoutDate: null,
      completedDays: [],
      workoutLogs: [],
      difficultyMode: 'Intermediate'
    };
  }

  // Load progress from Supabase
  async loadProgress(): Promise<void> {
    const userId = this.supabaseService.getUserId();
    if (!userId) return;

    this.loading.set(true);
    const client = this.supabaseService.getClient();

    // Load user progress
    const { data: progressData, error: progressError } = await client
      .from('home_user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Load workout logs
    const { data: logsData, error: logsError } = await client
      .from('home_workout_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (progressError && progressError.code !== 'PGRST116') {
      this.error.set(progressError.message);
      this.loading.set(false);
      return;
    }

    const logs: HomeWorkoutLog[] = (logsData || []).map((log: any) => ({
      id: log.id,
      date: log.date,
      dayId: log.day_id,
      exerciseLogs: log.exercise_logs || [],
      duration: log.duration,
      completed: log.completed,
      difficultyMode: log.difficulty_mode
    }));

    const progress: HomeUserProgress = {
      totalWorkouts: progressData?.total_workouts || 0,
      streak: progressData?.streak || 0,
      lastWorkoutDate: progressData?.last_workout_date || null,
      completedDays: progressData?.completed_days || [],
      workoutLogs: logs,
      difficultyMode: progressData?.difficulty_mode || 'Intermediate'
    };

    this.userProgress.set(progress);
    this.difficultyMode.set(progress.difficultyMode);
    this.loading.set(false);
  }

  // Get workout day by ID with difficulty applied
  getWorkoutDay(id: number): HomeWorkoutDay | undefined {
    const day = getHomeWorkoutDay(id);
    if (!day) return undefined;
    
    const difficulty = this.difficultyMode();
    return {
      ...day,
      exercises: day.exercises.map(ex => applyDifficulty(ex, difficulty))
    };
  }

  // Get exercise by ID with difficulty applied
  getExercise(id: number): HomeExercise | undefined {
    const exercise = getHomeExercise(id);
    if (!exercise) return undefined;
    
    return applyDifficulty(exercise, this.difficultyMode());
  }

  // Get all workout days with difficulty applied
  getAllWorkoutDays(): HomeWorkoutDay[] {
    const difficulty = this.difficultyMode();
    return HOME_WORKOUT_DAYS.map(day => ({
      ...day,
      exercises: day.exercises.map(ex => applyDifficulty(ex, difficulty))
    }));
  }

  // Set difficulty mode
  async setDifficultyMode(mode: 'Beginner' | 'Intermediate' | 'Advanced'): Promise<void> {
    const userId = this.supabaseService.getUserId();
    if (!userId) return;

    this.difficultyMode.set(mode);
    
    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('home_user_progress')
      .upsert({
        user_id: userId,
        difficulty_mode: mode
      }, { onConflict: 'user_id' });

    if (error) {
      this.error.set(error.message);
    }
  }

  // Start a workout
  startWorkout(dayId: number): HomeWorkoutLog {
    const log: HomeWorkoutLog = {
      id: '',
      date: this.formatDate(new Date()),
      dayId,
      exerciseLogs: [],
      duration: 0,
      completed: false,
      difficultyMode: this.difficultyMode()
    };
    this.currentWorkout.set(log);
    return log;
  }

  // Log exercise completion
  logExercise(exerciseLog: HomeExerciseLog): void {
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
      this.currentWorkout.set({ ...current });
    }
  }

  // Complete workout
  async completeWorkout(): Promise<{ success: boolean; error?: string }> {
    const current = this.currentWorkout();
    if (!current) return { success: false, error: 'No active workout' };

    const userId = this.supabaseService.getUserId();
    if (!userId) return { success: false, error: 'Not authenticated' };

    current.completed = true;
    current.duration = this.calculateDuration();

    const client = this.supabaseService.getClient();

    // Save workout log to Supabase
    const { data: logData, error: logError } = await client
      .from('home_workout_logs')
      .insert({
        user_id: userId,
        date: current.date,
        day_id: current.dayId,
        duration: current.duration,
        completed: true,
        difficulty_mode: current.difficultyMode,
        exercise_logs: current.exerciseLogs
      })
      .select('id')
      .single();

    if (logError) {
      return { success: false, error: logError.message };
    }

    // Update progress
    const progress = this.userProgress();
    progress.totalWorkouts++;
    progress.workoutLogs.push({ ...current, id: logData.id });

    // Add to completed days if not already there
    if (!progress.completedDays.includes(current.dayId)) {
      progress.completedDays.push(current.dayId);
    }

    // Update streak
    this.updateStreak(progress);

    // Save progress to Supabase
    const { error: progressError } = await client
      .from('home_user_progress')
      .upsert({
        user_id: userId,
        total_workouts: progress.totalWorkouts,
        streak: progress.streak,
        last_workout_date: progress.lastWorkoutDate,
        completed_days: progress.completedDays,
        difficulty_mode: progress.difficultyMode
      }, { onConflict: 'user_id' });

    if (progressError) {
      return { success: false, error: progressError.message };
    }

    this.userProgress.set(progress);
    this.currentWorkout.set(null);
    return { success: true };
  }

  // Cancel workout
  cancelWorkout(): void {
    this.currentWorkout.set(null);
  }

  // Check if day is completed
  isDayCompleted(dayId: number): boolean {
    return this.userProgress().completedDays.includes(dayId);
  }

  // Get workout history
  getWorkoutHistory(): HomeWorkoutLog[] {
    return this.userProgress().workoutLogs;
  }

  // Get workout logs for a specific day
  getWorkoutLogsForDay(dayId: number): HomeWorkoutLog[] {
    return this.userProgress().workoutLogs.filter(log => log.dayId === dayId);
  }

  // Reset all progress
  async resetProgress(): Promise<void> {
    const userId = this.supabaseService.getUserId();
    if (!userId) return;

    const client = this.supabaseService.getClient();

    // Delete all workout logs
    await client
      .from('home_workout_logs')
      .delete()
      .eq('user_id', userId);

    // Reset progress
    const defaultProgress: HomeUserProgress = {
      totalWorkouts: 0,
      streak: 0,
      lastWorkoutDate: null,
      completedDays: [],
      workoutLogs: [],
      difficultyMode: 'Intermediate'
    };

    await client
      .from('home_user_progress')
      .upsert({
        user_id: userId,
        total_workouts: 0,
        streak: 0,
        last_workout_date: null,
        completed_days: [],
        difficulty_mode: 'Intermediate'
      }, { onConflict: 'user_id' });

    this.userProgress.set(defaultProgress);
    this.difficultyMode.set('Intermediate');
  }

  // Private methods
  private updateStreak(progress: HomeUserProgress): void {
    const today = this.formatDate(new Date());
    const lastDate = progress.lastWorkoutDate;
    
    if (lastDate) {
      const last = new Date(lastDate);
      const diff = Math.floor((new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 0) {
        // Same day, no streak change
      } else if (diff === 1) {
        // Consecutive day
        progress.streak++;
      } else {
        // Streak broken
        progress.streak = 1;
      }
    } else {
      progress.streak = 1;
    }
    
    progress.lastWorkoutDate = today;
  }

  private calculateDuration(): number {
    // Calculate based on exercise logs and rest times
    const current = this.currentWorkout();
    if (!current) return 0;
    
    const day = this.getWorkoutDay(current.dayId);
    if (!day) return 0;
    
    let duration = 0;
    for (const exercise of day.exercises) {
      const log = current.exerciseLogs.find(el => el.exerciseId === exercise.id);
      if (log && log.completed) {
        // Add exercise time (estimate 3 seconds per rep)
        const reps = parseInt(exercise.reps) || 10;
        duration += exercise.sets * reps * 3;
        
        // Add rest time
        const restSeconds = parseInt(exercise.rest.replace(/[^0-9]/g, '')) || 60;
        duration += restSeconds;
      }
    }
    
    return Math.round(duration / 60); // Return in minutes
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
