import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService);

  async signUp(email: string, password: string, metadata: Record<string, unknown>): Promise<{ hasSession: boolean }> {
    const { data, error } = await this.supabase.client.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) {
      throw error;
    }

    return { hasSession: !!data.session };
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.client.auth.signOut();
    if (error) {
      throw error;
    }
  }
}
