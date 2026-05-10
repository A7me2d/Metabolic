import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';
import { Meal, Supplement, User } from '../../models';
import { SupabaseService } from '../supabase';

type ProfileRow = {
  id: string;
  name: string;
  email: string | null;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activity_level: User['activityLevel'];
  goal: User['goal'];
  created_at: string;
  updated_at: string;
};

type MealRow = {
  id: string;
  user_id: string;
  food_name: string;
  cal: number;
  p: number;
  c: number;
  f: number;
  confidence: number | null;
  source: 'ai' | 'manual';
  image_url: string | null;
  timestamp: string;
  created_at: string;
};

type SupplementRow = {
  id: string;
  user_id: string;
  name: string;
  type: Supplement['type'];
  dosage: string | null;
  time: string;
  timestamp: string;
  created_at: string;
};

@Injectable({
  providedIn: 'root'
})
export class SupabaseDataService extends DataService {
  private supabase = inject(SupabaseService);

  override async getUser(): Promise<User | null> {
    const authUser = await this.supabase.getCurrentAuthUser();
    if (!authUser) return null;

    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle<ProfileRow>();

    if (error) throw error;
    if (!data) return null;

    return this.mapProfile(data);
  }

  override async saveUser(user: User): Promise<void> {
    const payload = this.mapUserToProfileInsert(user);
    const { error } = await this.supabase.client.from('profiles').upsert(payload);
    if (error) throw error;
  }

  override async updateUser(updates: Partial<User>): Promise<User> {
    const currentUser = await this.getUser();
    if (!currentUser) throw new Error('User not found');

    const mergedUser: User = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const { data, error } = await this.supabase.client
      .from('profiles')
      .update(this.mapUserToProfileUpdate(mergedUser))
      .eq('id', mergedUser.id)
      .select('*')
      .single<ProfileRow>();

    if (error) throw error;
    return this.mapProfile(data);
  }

  override async getMeals(userId: string, date?: string): Promise<Meal[]> {
    let query = this.supabase.client
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (date) {
      const start = `${date}T00:00:00.000Z`;
      const end = `${date}T23:59:59.999Z`;
      query = query.gte('timestamp', start).lte('timestamp', end);
    }

    const { data, error } = await query.returns<MealRow[]>();
    if (error) throw error;
    return (data ?? []).map((meal) => this.mapMeal(meal));
  }

  override async addMeal(meal: Meal): Promise<Meal> {
    const { data, error } = await this.supabase.client
      .from('meals')
      .insert(this.mapMealToRow(meal))
      .select('*')
      .single<MealRow>();

    if (error) throw error;
    return this.mapMeal(data);
  }

  override async updateMeal(id: string, updates: Partial<Meal>): Promise<Meal> {
    const payload: Record<string, unknown> = {};

    if (updates.foodName !== undefined) payload['food_name'] = updates.foodName;
    if (updates.macros?.cal !== undefined) payload['cal'] = updates.macros.cal;
    if (updates.macros?.p !== undefined) payload['p'] = updates.macros.p;
    if (updates.macros?.c !== undefined) payload['c'] = updates.macros.c;
    if (updates.macros?.f !== undefined) payload['f'] = updates.macros.f;
    if (updates.confidence !== undefined) payload['confidence'] = updates.confidence;
    if (updates.source !== undefined) payload['source'] = updates.source;
    if (updates.imageUrl !== undefined) payload['image_url'] = updates.imageUrl;
    if (updates.timestamp !== undefined) payload['timestamp'] = updates.timestamp;

    const { data, error } = await this.supabase.client
      .from('meals')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single<MealRow>();

    if (error) throw error;
    return this.mapMeal(data);
  }

  override async deleteMeal(id: string): Promise<void> {
    const { error } = await this.supabase.client.from('meals').delete().eq('id', id);
    if (error) throw error;
  }

  override async getSupplements(userId: string, date?: string): Promise<Supplement[]> {
    let query = this.supabase.client
      .from('supplements')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (date) {
      const start = `${date}T00:00:00.000Z`;
      const end = `${date}T23:59:59.999Z`;
      query = query.gte('timestamp', start).lte('timestamp', end);
    }

    const { data, error } = await query.returns<SupplementRow[]>();
    if (error) throw error;
    return (data ?? []).map((supplement) => this.mapSupplement(supplement));
  }

  override async addSupplement(supplement: Supplement): Promise<Supplement> {
    const { data, error } = await this.supabase.client
      .from('supplements')
      .insert(this.mapSupplementToRow(supplement))
      .select('*')
      .single<SupplementRow>();

    if (error) throw error;
    return this.mapSupplement(data);
  }

  override async deleteSupplement(id: string): Promise<void> {
    const { error } = await this.supabase.client.from('supplements').delete().eq('id', id);
    if (error) throw error;
  }

  override async getDailyTotals(userId: string, date: string): Promise<{ meals: Meal[]; supplements: Supplement[] }> {
    const [meals, supplements] = await Promise.all([
      this.getMeals(userId, date),
      this.getSupplements(userId, date)
    ]);

    return { meals, supplements };
  }

  private mapProfile(profile: ProfileRow): User {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email ?? undefined,
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      gender: profile.gender,
      activityLevel: profile.activity_level,
      goal: profile.goal,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };
  }

  private mapUserToProfileInsert(user: User): Record<string, unknown> {
    return {
      id: user.id,
      name: user.name,
      email: user.email ?? null,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activity_level: user.activityLevel,
      goal: user.goal,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    };
  }

  private mapUserToProfileUpdate(user: User): Record<string, unknown> {
    return {
      name: user.name,
      email: user.email ?? null,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activity_level: user.activityLevel,
      goal: user.goal,
      updated_at: user.updatedAt
    };
  }

  private mapMeal(meal: MealRow): Meal {
    return {
      id: meal.id,
      userId: meal.user_id,
      foodName: meal.food_name,
      macros: {
        cal: meal.cal,
        p: Number(meal.p),
        c: Number(meal.c),
        f: Number(meal.f)
      },
      confidence: meal.confidence ?? undefined,
      source: meal.source,
      imageUrl: meal.image_url ?? undefined,
      timestamp: meal.timestamp,
      createdAt: meal.created_at
    };
  }

  private mapMealToRow(meal: Meal): Record<string, unknown> {
    return {
      id: meal.id,
      user_id: meal.userId,
      food_name: meal.foodName,
      cal: meal.macros.cal,
      p: meal.macros.p,
      c: meal.macros.c,
      f: meal.macros.f,
      confidence: meal.confidence ?? null,
      source: meal.source,
      image_url: meal.imageUrl ?? null,
      timestamp: meal.timestamp,
      created_at: meal.createdAt
    };
  }

  private mapSupplement(supplement: SupplementRow): Supplement {
    return {
      id: supplement.id,
      userId: supplement.user_id,
      name: supplement.name,
      type: supplement.type,
      dosage: supplement.dosage ?? undefined,
      time: supplement.time,
      timestamp: supplement.timestamp,
      createdAt: supplement.created_at
    };
  }

  private mapSupplementToRow(supplement: Supplement): Record<string, unknown> {
    return {
      id: supplement.id,
      user_id: supplement.userId,
      name: supplement.name,
      type: supplement.type,
      dosage: supplement.dosage ?? null,
      time: supplement.time,
      timestamp: supplement.timestamp,
      created_at: supplement.createdAt
    };
  }
}
