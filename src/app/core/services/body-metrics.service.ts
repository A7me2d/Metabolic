import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { SupabaseDatabaseService } from './supabase-database.service';
import { 
  BodyMetrics, 
  BodyMetricsInput, 
  WeeklyProgressReport,
  BodyMetricsGoal,
  calculateBMI,
  calculateProgressToGoal,
  estimateDaysToGoal
} from '../models/body-metrics.model';

@Injectable({
  providedIn: 'root'
})
export class BodyMetricsService {
  private supabaseService = inject(SupabaseService);
  private databaseService = inject(SupabaseDatabaseService);

  // Signals for state management
  metrics = signal<BodyMetrics[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  goal = signal<BodyMetricsGoal | null>(null);

  // Computed values
  latestMetric = computed(() => {
    const all = this.metrics();
    return all.length > 0 ? all[0] : null;
  });

  hasMetrics = computed(() => this.metrics().length > 0);

  // Get metrics sorted by date (newest first)
  sortedMetrics = computed(() => {
    return [...this.metrics()].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  // Get chart data (last 30 days)
  chartData = computed(() => {
    const all = this.sortedMetrics();
    const last30 = all.slice(0, 30).reverse();
    return {
      labels: last30.map(m => this.formatDateShort(m.date)),
      weights: last30.map(m => m.weight)
    };
  });

  // Weekly progress report
  weeklyReport = computed<WeeklyProgressReport | null>(() => {
    const all = this.metrics();
    if (all.length === 0) return null;

    const now = new Date();
    const startOfWeek = this.getStartOfWeek(now);
    const endOfWeek = this.getEndOfWeek(now);

    // Get metrics from this week
    const weekMetrics = all.filter(m => {
      const date = new Date(m.date);
      return date >= startOfWeek && date <= endOfWeek;
    });

    // Get workouts from this week
    const weekLogs = this.databaseService.getWorkoutLogsByDateRange(
      this.formatDate(startOfWeek),
      this.formatDate(endOfWeek)
    );

    const currentWeight = all[0]?.weight || 0;
    const lastWeekWeight = this.getWeightFromDate(all, this.getDateDaysAgo(7));
    const weightChange = lastWeekWeight !== null ? currentWeight - lastWeekWeight : 0;

    const avgBMI = weekMetrics.length > 0 
      ? weekMetrics.reduce((sum, m) => sum + m.bmi, 0) / weekMetrics.length 
      : all[0]?.bmi || 0;

    const report: WeeklyProgressReport = {
      currentWeight,
      weightChange,
      averageBMI: parseFloat(avgBMI.toFixed(1)),
      workoutsCompleted: weekLogs.filter(l => l.completed).length,
      startDate: this.formatDate(startOfWeek),
      endDate: this.formatDate(endOfWeek)
    };

    // Add goal progress if set
    const goal = this.goal();
    if (goal && all.length > 0) {
      const startWeight = this.getWeightFromDate(all, goal.startDate) || currentWeight;
      report.goalWeight = goal.targetWeight;
      report.progressToGoal = calculateProgressToGoal(currentWeight, startWeight, goal.targetWeight);
      
      // Estimate days to goal based on weekly change rate
      if (weightChange !== 0) {
        report.estimatedDaysToGoal = estimateDaysToGoal(currentWeight, goal.targetWeight, weightChange) ?? undefined;
      }
    }

    return report;
  });

  // Load all metrics for current user
  async loadMetrics(): Promise<void> {
    const userId = this.supabaseService.getUserId();
    if (!userId) return;

    this.loading.set(true);
    this.error.set(null);

    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('body_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      this.error.set(error.message);
      this.loading.set(false);
      return;
    }

    const metrics: BodyMetrics[] = (data || []).map(m => ({
      id: m.id,
      userId: m.user_id,
      weight: m.weight,
      height: m.height,
      bmi: m.bmi,
      date: m.date,
      createdAt: m.created_at
    }));

    this.metrics.set(metrics);
    this.loading.set(false);

    // Load goal from localStorage
    this.loadGoal();
  }

  // Add new metric entry
  async addMetric(input: BodyMetricsInput): Promise<{ success: boolean; error?: string }> {
    const userId = this.supabaseService.getUserId();
    if (!userId) return { success: false, error: 'Not authenticated' };

    const client = this.supabaseService.getClient();
    const bmi = calculateBMI(input.weight, input.height);
    const date = input.date || this.formatDate(new Date());

    const { data, error } = await client
      .from('body_metrics')
      .insert({
        user_id: userId,
        weight: input.weight,
        height: input.height,
        bmi,
        date
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    const newMetric: BodyMetrics = {
      id: data.id,
      userId: data.user_id,
      weight: data.weight,
      height: data.height,
      bmi: data.bmi,
      date: data.date,
      createdAt: data.created_at
    };

    // Update local state
    this.metrics.update(all => [newMetric, ...all]);

    return { success: true };
  }

  // Update existing metric
  async updateMetric(id: string, input: Partial<BodyMetricsInput>): Promise<{ success: boolean; error?: string }> {
    const client = this.supabaseService.getClient();
    const current = this.metrics().find(m => m.id === id);
    
    if (!current) return { success: false, error: 'Metric not found' };

    const weight = input.weight ?? current.weight;
    const height = input.height ?? current.height;
    const bmi = calculateBMI(weight, height);

    const { error } = await client
      .from('body_metrics')
      .update({
        weight,
        height,
        bmi
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Update local state
    this.metrics.update(all => 
      all.map(m => m.id === id ? { ...m, weight, height, bmi } : m)
    );

    return { success: true };
  }

  // Delete metric
  async deleteMetric(id: string): Promise<{ success: boolean; error?: string }> {
    const client = this.supabaseService.getClient();

    const { error } = await client
      .from('body_metrics')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Update local state
    this.metrics.update(all => all.filter(m => m.id !== id));

    return { success: true };
  }

  // Set goal weight
  setGoal(targetWeight: number, targetDate?: string): void {
    const goal: BodyMetricsGoal = {
      targetWeight,
      startDate: this.formatDate(new Date()),
      targetDate
    };
    this.goal.set(goal);
    localStorage.setItem('bodyMetricsGoal', JSON.stringify(goal));
  }

  // Clear goal
  clearGoal(): void {
    this.goal.set(null);
    localStorage.removeItem('bodyMetricsGoal');
  }

  // Load goal from localStorage
  private loadGoal(): void {
    const saved = localStorage.getItem('bodyMetricsGoal');
    if (saved) {
      try {
        this.goal.set(JSON.parse(saved));
      } catch {
        // Invalid data, ignore
      }
    }
  }

  // Get weight from a specific date (or closest)
  private getWeightFromDate(metrics: BodyMetrics[], targetDate: string): number | null {
    const target = new Date(targetDate);
    const sorted = [...metrics].sort((a, b) => 
      Math.abs(new Date(a.date).getTime() - target.getTime()) -
      Math.abs(new Date(b.date).getTime() - target.getTime())
    );
    return sorted[0]?.weight || null;
  }

  // Helper methods
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatDateShort(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
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

  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return this.formatDate(date);
  }
}
