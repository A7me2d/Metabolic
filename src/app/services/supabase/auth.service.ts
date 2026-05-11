import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService);

  async signUp(email: string, password: string, metadata: Record<string, unknown>): Promise<{ hasSession: boolean }> {
    const result = await this.supabase.signUp(email, password, metadata);
    return { hasSession: !!this.supabase.session() };
  }

  async signIn(email: string, password: string): Promise<void> {
    const result = await this.supabase.signIn(email, password);
    if (result.error) {
      throw new Error(result.error);
    }
  }

  async signOut(): Promise<void> {
    await this.supabase.signOut();
  }
}
