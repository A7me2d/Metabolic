import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Exercise, WorkoutDay, WorkoutLog, ExerciseLog, UserStats, WeeklyProgress } from '../models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class SupabaseDatabaseService {
  private supabaseService = inject(SupabaseService);

  // Signals for data
  workoutDays = signal<WorkoutDay[]>([]);
  workoutLogs = signal<WorkoutLog[]>([]);
  userStats = signal<UserStats | null>(null);
  
  // Loading states for each data type
  loadingDays = signal(false);
  loadingLogs = signal(false);
  loadingStats = signal(false);
  loading = computed(() => this.loadingDays() || this.loadingLogs() || this.loadingStats());
  
  error = signal<string | null>(null);

  // Computed weekly progress
  weeklyProgress = computed<WeeklyProgress | null>(() => {
    const logs = this.workoutLogs();
    const stats = this.userStats();
    if (!logs.length) return null;

    const now = new Date();
    const startOfWeek = this.getStartOfWeek(now);
    const endOfWeek = this.getEndOfWeek(now);

    const weekLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= startOfWeek && logDate <= endOfWeek;
    });

    return {
      weekNumber: this.getWeekNumber(now),
      year: now.getFullYear(),
      startDate: this.formatDate(startOfWeek),
      endDate: this.formatDate(endOfWeek),
      completedDays: weekLogs.map(log => log.dayId),
      totalVolume: weekLogs.reduce((sum, log) => sum + log.totalVolume, 0),
      totalWorkouts: weekLogs.filter(log => log.completed).length
    };
  });

  // Load workout days (static data from database)
  async loadWorkoutDays(): Promise<void> {
    this.loadingDays.set(true);
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('workout_days')
      .select('*')
      .order('id');

    if (error) {
      this.error.set(error.message);
      this.loadingDays.set(false);
      return;
    }

    // Transform database format to app format
    const days: WorkoutDay[] = await Promise.all((data || []).map(async (day) => {
      const exercises = await this.loadExercisesByIds(day.exercise_ids || []);
      return {
        id: day.id,
        name: day.name,
        focus: day.focus,
        isRestDay: day.is_rest_day,
        exercises
      };
    }));

    this.workoutDays.set(days);
    this.loadingDays.set(false);
  }

  // Load exercises by IDs
  private async loadExercisesByIds(ids: number[]): Promise<Exercise[]> {
    if (!ids.length) return [];

    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('exercises')
      .select('*')
      .in('id', ids);

    if (error || !data) return [];

    return data.map(ex => ({
      id: ex.id,
      name: ex.name,
      nameAr: ex.name_ar || '',
      sets: ex.sets,
      reps: ex.reps,
      rest: ex.rest,
      primaryMuscle: ex.primary_muscle,
      primaryMuscleAr: ex.primary_muscle_ar || '',
      secondaryMuscle: ex.secondary_muscle || [],
      secondaryMuscleAr: ex.secondary_muscle_ar || [],
      difficulty: ex.difficulty,
      equipment: ex.equipment,
      equipmentAr: ex.equipment_ar || '',
      imageUrl: ex.image_url,
      description: ex.description,
      descriptionAr: ex.description_ar || '',
      instructions: ex.instructions || [],
      instructionsAr: ex.instructions_ar || [],
      commonMistakes: ex.common_mistakes || [],
      commonMistakesAr: ex.common_mistakes_ar || [],
      safetyTips: ex.safety_tips || [],
      safetyTipsAr: ex.safety_tips_ar || [],
      alternatives: ex.alternatives || [],
      alternativesAr: ex.alternatives_ar || []
    }));
  }

  // Load user's workout logs
  async loadWorkoutLogs(): Promise<void> {
    const userId = this.supabaseService.getUserId();
    if (!userId) return;

    this.loadingLogs.set(true);
    const client = this.supabaseService.getClient();

    const { data: logsData, error: logsError } = await client
      .from('workout_logs')
      .select(`
        id,
        date,
        day_id,
        total_volume,
        duration,
        completed,
        notes,
        exercise_logs (
          id,
          exercise_id,
          completed,
          weights,
          completed_sets,
          notes
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (logsError) {
      this.error.set(logsError.message);
      this.loadingLogs.set(false);
      return;
    }

    const logs: WorkoutLog[] = (logsData || []).map((log: any) => ({
      id: log.id,
      date: log.date,
      dayId: log.day_id,
      totalVolume: log.total_volume,
      duration: log.duration,
      completed: log.completed,
      exerciseLogs: (log.exercise_logs || []).map((el: any) => ({
        exerciseId: el.exercise_id,
        completed: el.completed,
        weights: el.weights || [],
        completedSets: el.completed_sets
      }))
    }));

    this.workoutLogs.set(logs);
    this.loadingLogs.set(false);
  }

  // Load user stats
  async loadUserStats(): Promise<void> {
    const userId = this.supabaseService.getUserId();
    if (!userId) return;

    this.loadingStats.set(true);
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no stats exist, they will be created by the database trigger
      this.userStats.set({
        totalWorkouts: 0,
        totalVolume: 0,
        totalSets: 0,
        totalReps: 0,
        personalRecords: {},
        personalRecordsCount: 0,
        streak: 0,
        lastWorkoutDate: null
      });
      return;
    }

    this.userStats.set({
      totalWorkouts: data.total_workouts,
      totalVolume: data.total_volume,
      totalSets: data.total_sets,
      totalReps: data.total_reps,
      personalRecords: data.personal_records || {},
      personalRecordsCount: data.personal_records_count,
      streak: data.streak,
      lastWorkoutDate: data.last_workout_date
    });
    this.loadingStats.set(false);
  }

  // Save workout log
  async saveWorkoutLog(log: WorkoutLog): Promise<{ success: boolean; error?: string }> {
    const userId = this.supabaseService.getUserId();
    if (!userId) return { success: false, error: 'Not authenticated' };

    const client = this.supabaseService.getClient();

    // Check if log exists
    const existingLog = log.id ? await this.getLogById(log.id) : null;

    if (existingLog) {
      // Update existing log
      const { error: updateError } = await client
        .from('workout_logs')
        .update({
          total_volume: log.totalVolume,
          duration: log.duration,
          completed: log.completed,
          notes: null
        })
        .eq('id', log.id);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Delete existing exercise logs and insert new ones
      await client.from('exercise_logs').delete().eq('workout_log_id', log.id);
    } else {
      // Insert new log
      const { data: newLog, error: insertError } = await client
        .from('workout_logs')
        .insert({
          user_id: userId,
          date: log.date,
          day_id: log.dayId,
          total_volume: log.totalVolume,
          duration: log.duration,
          completed: log.completed
        })
        .select()
        .single();

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      log.id = newLog.id;
    }

    // Insert exercise logs
    if (log.exerciseLogs.length > 0) {
      const exerciseLogsData = log.exerciseLogs.map(el => ({
        workout_log_id: log.id,
        exercise_id: el.exerciseId,
        completed: el.completed,
        weights: el.weights,
        completed_sets: el.completedSets
      }));

      const { error: exerciseLogsError } = await client
        .from('exercise_logs')
        .insert(exerciseLogsData);

      if (exerciseLogsError) {
        return { success: false, error: exerciseLogsError.message };
      }
    }

    // Update local state
    await this.loadWorkoutLogs();

    return { success: true };
  }

  private async getLogById(id: string): Promise<any> {
    const client = this.supabaseService.getClient();
    const { data } = await client
      .from('workout_logs')
      .select('id')
      .eq('id', id)
      .single();
    return data;
  }

  // Update user stats
  async updateUserStats(stats: UserStats): Promise<void> {
    const userId = this.supabaseService.getUserId();
    if (!userId) return;

    const client = this.supabaseService.getClient();

    await client
      .from('user_stats')
      .update({
        total_workouts: stats.totalWorkouts,
        total_volume: stats.totalVolume,
        total_sets: stats.totalSets,
        total_reps: stats.totalReps,
        personal_records: stats.personalRecords,
        personal_records_count: stats.personalRecordsCount,
        streak: stats.streak,
        last_workout_date: stats.lastWorkoutDate
      })
      .eq('user_id', userId);

    this.userStats.set(stats);
  }

  // Delete workout log
  async deleteWorkoutLog(id: string): Promise<{ success: boolean; error?: string }> {
    const client = this.supabaseService.getClient();

    const { error } = await client
      .from('workout_logs')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    await this.loadWorkoutLogs();
    return { success: true };
  }

  // Get workout logs by date range
  getWorkoutLogsByDateRange(startDate: string, endDate: string): WorkoutLog[] {
    return this.workoutLogs().filter(log => {
      return log.date >= startDate && log.date <= endDate;
    });
  }

  // Get workout logs by day
  getWorkoutLogsByDay(dayId: number): WorkoutLog[] {
    return this.workoutLogs().filter(log => log.dayId === dayId);
  }

  // Helper methods
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  private getEndOfWeek(date: Date): Date {
    const start = this.getStartOfWeek(date);
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  }

  private getWeekNumber(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.ceil(diff / oneWeek);
  }
}
